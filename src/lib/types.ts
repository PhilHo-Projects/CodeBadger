export const LANGUAGES = [
  "cpp",
  "typescript",
  "csharp",
  "rust",
  "python",
] as const;
export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export const LEGACY_TOPICS = [
  "loops",
  "arrays",
  "strings",
  "collections",
  "classes",
  "algorithms",
  "game-dev",
] as const;
export const CPP_TOPICS_BY_DIFFICULTY = {
  easy: ["loops", "arrays", "strings", "containers"],
  medium: ["algorithms", "data-structures", "iterators"],
  hard: ["memory", "concurrency", "game-dev"],
} as const;
export const TOPIC_LABELS = {
  loops: "Loops",
  arrays: "Arrays",
  strings: "Strings",
  collections: "Collections",
  classes: "Classes",
  algorithms: "Algorithms",
  "game-dev": "Game-dev",
  containers: "Containers",
  "data-structures": "Data structures",
  iterators: "Iterators",
  memory: "Memory",
  concurrency: "Concurrency",
} as const;
export const GENERIC_DIFFICULTY_LABELS = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
} as const;
export const CPP_DIFFICULTY_LABELS = {
  easy: "Basics",
  medium: "Academic",
  hard: "Production",
} as const;

export type Language = (typeof LANGUAGES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type Topic =
  | (typeof LEGACY_TOPICS)[number]
  | (typeof CPP_TOPICS_BY_DIFFICULTY)[Difficulty][number];
export type TopicFilter = Topic | "all";
export type SnippetSource = "fallback" | "llm";
export type SnippetLineHint = {
  line: number;
  text: string;
};

export type Snippet = {
  language: Language;
  difficulty: Difficulty;
  topic: Topic;
  code: string;
  filename: string;
  slug: string;
  title: string;
  description: string;
  lineHints?: SnippetLineHint[];
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

export function getLanguageLabel(language: Language) {
  switch (language) {
    case "csharp":
      return "C#";
    case "cpp":
      return "C++";
    case "typescript":
      return "TypeScript";
    case "python":
      return "Python";
    case "rust":
      return "Rust";
  }
}

export function getDifficultyLabel(language: Language, difficulty: Difficulty) {
  return language === "cpp"
    ? CPP_DIFFICULTY_LABELS[difficulty]
    : GENERIC_DIFFICULTY_LABELS[difficulty];
}

export function getTopicLabel(topic: TopicFilter) {
  return topic === "all" ? "All topics" : TOPIC_LABELS[topic];
}

export function getTopicsForLanguage(
  language: Language,
  difficulty: Difficulty,
): readonly Topic[] {
  return language === "cpp"
    ? CPP_TOPICS_BY_DIFFICULTY[difficulty]
    : LEGACY_TOPICS;
}

export function isTopicAvailable(
  language: Language,
  difficulty: Difficulty,
  topic: Topic,
) {
  return getTopicsForLanguage(language, difficulty).some(
    (currentTopic) => currentTopic === topic,
  );
}

export function normalizeTopicFilter(
  language: Language,
  difficulty: Difficulty,
  topic: TopicFilter,
) {
  if (topic === "all") {
    return topic;
  }

  return isTopicAvailable(language, difficulty, topic) ? topic : "all";
}

export function getDefaultTopicForSelection(
  language: Language,
  difficulty: Difficulty,
): Topic {
  return getTopicsForLanguage(language, difficulty)[0];
}
