import { sanitizeSnippetText } from "../../lib/snippetText";
import type { Difficulty, Language, Snippet, Topic } from "../../lib/types";

const LANGUAGE_EXTENSIONS: Record<Language, string> = {
  csharp: "cs",
  cpp: "cpp",
  typescript: "ts",
  python: "py"
};

type SnippetSeed = {
  slug: string;
  difficulty: Difficulty;
  topic: Topic;
  code: string;
};

export function buildSnippetLibrary(language: Language, seeds: SnippetSeed[]): Snippet[] {
  return seeds.map((seed) => ({
    language,
    difficulty: seed.difficulty,
    topic: seed.topic,
    code: sanitizeSnippetText(seed.code),
    filename: `${seed.slug}.${LANGUAGE_EXTENSIONS[language]}`,
    slug: seed.slug
  }));
}
