import {
  humanizeSnippetSlug,
  sanitizeLineHints,
  sanitizeSnippetText,
} from "../../lib/snippetText";
import {
  getDifficultyLabel,
  getLanguageLabel,
  getTopicLabel,
  type Difficulty,
  type Language,
  type Snippet,
  type SnippetLineHint,
  type Topic,
} from "../../lib/types";

const LANGUAGE_EXTENSIONS: Record<Language, string> = {
  csharp: "cs",
  cpp: "cpp",
  typescript: "ts",
  python: "py",
  rust: "rs",
};

type SnippetSeed = {
  slug: string;
  difficulty: Difficulty;
  topic: Topic;
  code: string;
  title?: string;
  description?: string;
  lineHints?: SnippetLineHint[];
};

function fallbackDescription(
  language: Language,
  difficulty: Difficulty,
  topic: Topic,
) {
  return `Type a short ${getLanguageLabel(language)} ${getDifficultyLabel(language, difficulty).toLowerCase()} snippet focused on ${getTopicLabel(topic).toLowerCase()}.`;
}

export function buildSnippetLibrary(
  language: Language,
  seeds: SnippetSeed[],
): Snippet[] {
  return seeds.map((seed) => {
    const code = sanitizeSnippetText(seed.code);

    return {
      code,
      language,
      difficulty: seed.difficulty,
      topic: seed.topic,
      filename: `${seed.slug}.${LANGUAGE_EXTENSIONS[language]}`,
      slug: seed.slug,
      title: seed.title?.trim() || humanizeSnippetSlug(seed.slug),
      description:
        seed.description?.trim() ||
        fallbackDescription(language, seed.difficulty, seed.topic),
      lineHints: sanitizeLineHints(seed.lineHints, code),
    };
  });
}
