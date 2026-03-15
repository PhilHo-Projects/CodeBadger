export const LANGUAGES = ["csharp", "cpp", "typescript", "python"] as const;
export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export const TOPICS = [
  "loops",
  "arrays",
  "strings",
  "collections",
  "classes",
  "algorithms",
  "game-dev"
] as const;

export type Language = (typeof LANGUAGES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type Topic = (typeof TOPICS)[number];
export type TopicFilter = Topic | "all";
export type SnippetSource = "fallback" | "llm";

export type Snippet = {
  language: Language;
  difficulty: Difficulty;
  topic: Topic;
  code: string;
  filename: string;
  slug: string;
};

export type RoundState = {
  targetText: string;
  typedText: string;
  totalTypedChars: number;
  startedAt: number | null;
  endedAt: number | null;
  typoCount: number;
  isComplete: boolean;
  errorIndex: number | null;
};

export type SyntaxKind =
  | "plain"
  | "keyword"
  | "type"
  | "string"
  | "number"
  | "function"
  | "comment";

export type TokenChar = {
  char: string;
  kind: SyntaxKind;
};
