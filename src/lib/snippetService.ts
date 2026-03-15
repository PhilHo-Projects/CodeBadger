import { fallbackSnippets } from "../data/fallbackSnippets";
import type { Difficulty, Language, RoundState, Snippet, TopicFilter } from "./types";

function isSnippetUsable(snippet: Snippet) {
  return snippet.code.length > 0;
}

function chooseRandom(snippets: Snippet[], excludeCode?: string | null) {
  if (snippets.length === 0) {
    throw new Error("No fallback snippets are available for the requested language.");
  }

  const withoutCurrent = excludeCode
    ? snippets.filter((snippet) => snippet.code !== excludeCode)
    : snippets;

  const pool = withoutCurrent.length > 0 ? withoutCurrent : snippets;
  return pool[Math.floor(Math.random() * pool.length)];
}

type SelectSnippetOptions = {
  language: Language;
  difficulty: Difficulty;
  topic: TopicFilter;
  excludeCode?: string | null;
};

export function selectSnippetFromPool(snippets: Snippet[], options: SelectSnippetOptions) {
  const languagePool = snippets.filter(
    (snippet) => snippet.language === options.language && isSnippetUsable(snippet)
  );

  const difficultyMatches = languagePool.filter((snippet) => snippet.difficulty === options.difficulty);
  const exactMatches =
    options.topic === "all"
      ? difficultyMatches
      : difficultyMatches.filter((snippet) => snippet.topic === options.topic);

  if (exactMatches.length > 0) {
    return chooseRandom(exactMatches, options.excludeCode);
  }

  if (difficultyMatches.length > 0) {
    return chooseRandom(difficultyMatches, options.excludeCode);
  }

  const relaxedDifficulty =
    options.topic === "all"
      ? languagePool
      : languagePool.filter((snippet) => snippet.topic === options.topic);

  if (relaxedDifficulty.length > 0) {
    return chooseRandom(relaxedDifficulty, options.excludeCode);
  }

  return chooseRandom(languagePool, options.excludeCode);
}

export function selectFallbackSnippet(options: SelectSnippetOptions) {
  return selectSnippetFromPool(fallbackSnippets, options);
}

export function createInitialRound(snippet: Snippet): RoundState {
  return {
    targetText: snippet.code,
    typedText: "",
    totalTypedChars: 0,
    startedAt: null,
    endedAt: null,
    typoCount: 0,
    isComplete: false,
    errorIndex: null
  };
}
