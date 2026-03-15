import type { Difficulty, Language, Snippet, TopicFilter } from "./types";

const STORAGE_KEY = "codedagger.google-ai-settings";
const DEFAULT_MODEL = "gemini-2.5-flash";

type StoredGoogleAiSettings = {
  apiKey: string;
  model: string;
};

type GenerateSnippetOptions = {
  apiKey: string;
  model: string;
  language: Language;
  difficulty: Difficulty;
  topic: TopicFilter;
  previousSnippet?: string | null;
};

type GoogleGenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function languageLabel(language: Language) {
  switch (language) {
    case "csharp":
      return "C#";
    case "cpp":
      return "C++";
    case "typescript":
      return "TypeScript";
    case "python":
      return "Python";
  }
}

function topicLabel(topic: TopicFilter) {
  return topic === "all" ? "any topic" : topic;
}

function safeFilename(language: Language) {
  switch (language) {
    case "csharp":
      return "generated-snippet.cs";
    case "cpp":
      return "generated-snippet.cpp";
    case "typescript":
      return "generated-snippet.ts";
    case "python":
      return "generated-snippet.py";
  }
}

function stripCodeFences(text: string) {
  return text.replace(/^```[\w-]*\s*/u, "").replace(/\s*```$/u, "").trim();
}

function readCandidateText(response: GoogleGenerateResponse) {
  return response.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("\n")
    .trim();
}

function normalizeCode(code: string) {
  return stripCodeFences(code).replace(/\r\n/g, "\n").trim();
}

function buildPrompt(options: GenerateSnippetOptions) {
  const topicInstruction =
    options.topic === "all"
      ? "Choose a useful topic yourself."
      : `Use the topic "${topicLabel(options.topic)}".`;

  return [
    "You are generating a short code typing practice snippet.",
    `Language: ${languageLabel(options.language)}.`,
    `Difficulty: ${options.difficulty}.`,
    topicInstruction,
    "Return valid JSON only.",
    'Use this schema: {"filename":"string","code":"string"}.',
    "The code must be a single self-contained snippet between 6 and 18 lines.",
    "Do not include markdown fences, commentary, or explanations.",
    options.previousSnippet
      ? `Do not repeat or closely mirror this previous snippet:\n${options.previousSnippet}`
      : "Do not repeat earlier snippets."
  ].join("\n");
}

function parseGeneratedSnippet(text: string, options: GenerateSnippetOptions): Snippet {
  const cleanedText = stripCodeFences(text);
  let parsed: { filename?: string; code?: string };

  try {
    parsed = JSON.parse(cleanedText) as { filename?: string; code?: string };
  } catch {
    throw new Error("Google AI returned an unreadable snippet payload.");
  }

  const code = normalizeCode(parsed.code ?? "");

  if (!code) {
    throw new Error("Google AI returned an empty snippet.");
  }

  return {
    language: options.language,
    difficulty: options.difficulty,
    topic: options.topic === "all" ? "algorithms" : options.topic,
    filename: (parsed.filename ?? safeFilename(options.language)).trim() || safeFilename(options.language),
    slug: `google-${Date.now()}`,
    code
  };
}

export function getStoredGoogleAiSettings(): StoredGoogleAiSettings | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredGoogleAiSettings>;

    if (!parsed.apiKey) {
      return null;
    }

    return {
      apiKey: parsed.apiKey,
      model: parsed.model || DEFAULT_MODEL
    };
  } catch {
    return null;
  }
}

export function storeGoogleAiSettings(settings: StoredGoogleAiSettings) {
  if (typeof window === "undefined") {
    return;
  }

  if (!settings.apiKey) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      apiKey: settings.apiKey,
      model: settings.model || DEFAULT_MODEL
    })
  );
}

export async function generateSnippetWithGoogleAi(options: GenerateSnippetOptions) {
  const model = options.model.trim() || DEFAULT_MODEL;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": options.apiKey
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: buildPrompt(options) }]
        }
      ],
      generationConfig: {
        temperature: 0.9,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Google AI request failed (${response.status}).`);
  }

  const payload = (await response.json()) as GoogleGenerateResponse;
  const candidateText = readCandidateText(payload);

  if (!candidateText) {
    throw new Error("Google AI returned no snippet content.");
  }

  return parseGeneratedSnippet(candidateText, { ...options, model });
}
