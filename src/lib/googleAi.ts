import { normalizeSnippetText, sanitizeLineHints } from "./snippetText";
import {
  getDefaultTopicForSelection,
  getDifficultyLabel,
  getLanguageLabel,
  getTopicLabel,
  getTopicsForLanguage,
  type Difficulty,
  type Language,
  type Snippet,
  type SnippetLineHint,
  type TopicFilter,
} from "./types";

const STORAGE_KEY = "codebadger.google-ai-settings";
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
  signal?: AbortSignal;
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
type GeneratedSnippetPayload = {
  filename?: string;
  title?: string;
  description?: string;
  code?: string;
  lineHints?: Array<Partial<SnippetLineHint>>;
};

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
    case "rust":
      return "generated-snippet.rs";
  }
}

function stripCodeFences(text: string) {
  return text
    .replace(/^```[\w-]*\s*/u, "")
    .replace(/\s*```$/u, "")
    .trim();
}

function readCandidateText(response: GoogleGenerateResponse) {
  return response.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("\n")
    .trim();
}

function normalizeCode(code: string) {
  return stripCodeFences(code)
    .replace(/\r\n?/g, "\n")
    .replace(/\t/g, "    ")
    .trim();
}

function normalizeTextSummary(text: string | undefined) {
  return normalizeSnippetText(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function fallbackTitle(
  language: Language,
  difficulty: Difficulty,
  topic: Exclude<TopicFilter, "all">,
) {
  return `${getDifficultyLabel(language, difficulty)} ${getTopicLabel(topic)}`;
}

function fallbackDescription(
  language: Language,
  difficulty: Difficulty,
  topic: Exclude<TopicFilter, "all">,
) {
  return `Type a short ${getLanguageLabel(language)} ${getDifficultyLabel(language, difficulty).toLowerCase()} snippet focused on ${getTopicLabel(topic).toLowerCase()}.`;
}

function buildPrompt(options: GenerateSnippetOptions) {
  const tierTopics = getTopicsForLanguage(options.language, options.difficulty)
    .map((topic) => getTopicLabel(topic))
    .join(", ");
  const topicInstruction =
    options.topic === "all"
      ? `Choose a useful topic from this tier only: ${tierTopics}.`
      : `Use the topic "${getTopicLabel(options.topic)}".`;
  const lineHintInstruction =
    options.language === "cpp" && options.difficulty === "easy"
      ? 'Include optional "lineHints" with short visual-only notes using valid 1-based line numbers from the code.'
      : 'Omit "lineHints" unless they are clearly useful.';

  return [
    "You are generating a short code typing practice snippet.",
    `Language: ${getLanguageLabel(options.language)}.`,
    `Difficulty tier: ${getDifficultyLabel(options.language, options.difficulty)} (${options.difficulty}).`,
    topicInstruction,
    "Return valid JSON only.",
    'Use this schema: {"filename":"string","title":"string","description":"string","code":"string","lineHints":[{"line":1,"text":"string"}]}.',
    'Set "title" to a short snippet name.',
    'Set "description" to one or two sentences explaining what the code does and what the player is typing.',
    lineHintInstruction,
    "The code must be a single self-contained snippet between 6 and 18 lines.",
    "Do not include markdown fences or any text outside the JSON payload.",
    options.previousSnippet
      ? `Do not repeat or closely mirror this previous snippet:\n${options.previousSnippet}`
      : "Do not repeat earlier snippets.",
  ].join("\n");
}

export function parseGeneratedSnippet(
  text: string,
  options: GenerateSnippetOptions,
): Snippet {
  const cleanedText = stripCodeFences(text);
  let parsed: GeneratedSnippetPayload;

  try {
    parsed = JSON.parse(cleanedText) as GeneratedSnippetPayload;
  } catch {
    throw new Error("Google AI returned an unreadable snippet payload.");
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed) ||
    typeof parsed.code !== "string"
  ) {
    throw new Error(
      "Google AI returned an invalid snippet payload. Try generating again.",
    );
  }
  for (const key of ["title", "description", "filename"] as const) {
    if (parsed[key] !== undefined && typeof parsed[key] !== "string")
      delete parsed[key];
  }
  if (parsed.lineHints !== undefined) {
    parsed.lineHints = Array.isArray(parsed.lineHints)
      ? parsed.lineHints.filter(
          (hint) =>
            hint && typeof hint === "object" && typeof hint.text === "string",
        )
      : undefined;
  }

  const code = normalizeCode(parsed.code ?? "");

  if (!code) {
    throw new Error("Google AI returned an empty snippet.");
  }
  if (code.length > 2000 || code.split("\n").length > 40) {
    throw new Error(
      "Google AI returned a snippet that is too long. Try generating again.",
    );
  }

  const topic =
    options.topic === "all"
      ? getDefaultTopicForSelection(options.language, options.difficulty)
      : options.topic;
  const title =
    normalizeTextSummary(parsed.title) ||
    fallbackTitle(options.language, options.difficulty, topic);
  const description =
    normalizeTextSummary(parsed.description) ||
    fallbackDescription(options.language, options.difficulty, topic);
  const lineHints =
    options.language === "cpp" && options.difficulty === "easy"
      ? sanitizeLineHints(parsed.lineHints, code)
      : undefined;

  return {
    language: options.language,
    difficulty: options.difficulty,
    topic,
    filename:
      (parsed.filename ?? safeFilename(options.language)).trim() ||
      safeFilename(options.language),
    slug: `google-${Date.now()}`,
    code,
    title,
    description,
    lineHints,
  };
}

export function getStoredGoogleAiSettings(): StoredGoogleAiSettings | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredGoogleAiSettings>;

    if (!parsed || typeof parsed.apiKey !== "string" || !parsed.apiKey) {
      return null;
    }

    return {
      apiKey: parsed.apiKey,
      model:
        typeof parsed.model === "string" && parsed.model
          ? parsed.model
          : DEFAULT_MODEL,
    };
  } catch {
    return null;
  }
}

export function storeGoogleAiSettings(
  settings: StoredGoogleAiSettings,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    if (!settings.apiKey) {
      window.localStorage.removeItem(STORAGE_KEY);
      return true;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        apiKey: settings.apiKey,
        model: settings.model || DEFAULT_MODEL,
      }),
    );
    return true;
  } catch {
    return false;
  }
}

export async function generateSnippetWithGoogleAi(
  options: GenerateSnippetOptions,
) {
  const model = options.model.trim() || DEFAULT_MODEL;
  if (!/^[a-zA-Z0-9._-]+$/.test(model))
    throw new Error("Use a Google AI model name such as gemini-2.5-flash.");
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      signal: options.signal
        ? AbortSignal.any([options.signal, AbortSignal.timeout(20000)])
        : AbortSignal.timeout(20000),
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": options.apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildPrompt(options) }],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          responseMimeType: "application/json",
        },
      }),
    },
  );

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
