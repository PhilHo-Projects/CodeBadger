import { describe, expect, it } from "vitest";

import { cppSnippets } from "../src/data/fallbackSnippets/cpp";
import { csharpSnippets } from "../src/data/fallbackSnippets/csharp";
import { pythonSnippets } from "../src/data/fallbackSnippets/python";
import { typescriptSnippets } from "../src/data/fallbackSnippets/typescript";
import { selectSnippetFromPool } from "../src/lib/snippetService";
import { sanitizeSnippetText } from "../src/lib/snippetText";
import { getTopicsForLanguage, normalizeTopicFilter, type Snippet } from "../src/lib/types";

function snippet(slug: string, difficulty: Snippet["difficulty"], topic: Snippet["topic"]): Snippet {
  return {
    language: "typescript",
    difficulty,
    topic,
    code: `const ${slug} = true;`,
    filename: `${slug}.ts`,
    slug,
    title: slug,
    description: `${slug} description`
  };
}

describe("fallback snippet libraries", () => {
  it("ships 20 snippets per language", () => {
    expect(csharpSnippets).toHaveLength(20);
    expect(cppSnippets).toHaveLength(20);
    expect(typescriptSnippets).toHaveLength(20);
    expect(pythonSnippets).toHaveLength(20);
  });

  it("keeps the planned 5/10/5 difficulty split", () => {
    const hardCount = typescriptSnippets.filter((item) => item.difficulty === "hard").length;
    const mediumCount = typescriptSnippets.filter((item) => item.difficulty === "medium").length;
    const easyCount = typescriptSnippets.filter((item) => item.difficulty === "easy").length;

    expect(easyCount).toBe(5);
    expect(mediumCount).toBe(10);
    expect(hardCount).toBe(5);
  });

  it("reshapes C++ into an 8/7/5 curriculum split", () => {
    const hardCount = cppSnippets.filter((item) => item.difficulty === "hard").length;
    const mediumCount = cppSnippets.filter((item) => item.difficulty === "medium").length;
    const easyCount = cppSnippets.filter((item) => item.difficulty === "easy").length;

    expect(easyCount).toBe(8);
    expect(mediumCount).toBe(7);
    expect(hardCount).toBe(5);
  });

  it("keeps C++ topics aligned to the selected tier", () => {
    const easyTopics = new Set(getTopicsForLanguage("cpp", "easy"));
    const mediumTopics = new Set(getTopicsForLanguage("cpp", "medium"));
    const hardTopics = new Set(getTopicsForLanguage("cpp", "hard"));

    expect(cppSnippets.filter((item) => item.difficulty === "easy").every((item) => easyTopics.has(item.topic))).toBe(true);
    expect(cppSnippets.filter((item) => item.difficulty === "medium").every((item) => mediumTopics.has(item.topic))).toBe(true);
    expect(cppSnippets.filter((item) => item.difficulty === "hard").every((item) => hardTopics.has(item.topic))).toBe(true);
  });

  it("requires metadata on every C++ snippet and helper notes on basics only", () => {
    expect(cppSnippets.every((item) => item.title.length > 0 && item.description.length > 0)).toBe(true);
    expect(cppSnippets.filter((item) => item.difficulty === "easy").every((item) => item.lineHints && item.lineHints.length > 0)).toBe(true);
    expect(cppSnippets.filter((item) => item.difficulty !== "easy").every((item) => !item.lineHints)).toBe(true);
  });
});

describe("snippet sanitization", () => {
  it("strips markdown fences and normalizes line endings and quotes", () => {
    const sanitized = sanitizeSnippetText("```ts\r\nconst message = “hi”;\r\n```");
    expect(sanitized).toBe('const message = "hi";');
  });
});

describe("snippet selection fallback order", () => {
  it("publishes the tier-specific C++ topic lists", () => {
    expect(getTopicsForLanguage("cpp", "easy")).toEqual(["loops", "arrays", "strings", "containers"]);
    expect(getTopicsForLanguage("cpp", "medium")).toEqual(["algorithms", "data-structures", "iterators"]);
    expect(getTopicsForLanguage("cpp", "hard")).toEqual(["memory", "concurrency", "game-dev"]);
  });

  it("normalizes invalid C++ topics back to all", () => {
    expect(normalizeTopicFilter("cpp", "easy", "memory")).toBe("all");
    expect(normalizeTopicFilter("cpp", "hard", "game-dev")).toBe("game-dev");
  });

  it("relaxes topic before difficulty", () => {
    const pool = [
      snippet("easy-loops", "easy", "loops"),
      snippet("easy-arrays", "easy", "arrays"),
      snippet("medium-game", "medium", "game-dev")
    ];

    const selected = selectSnippetFromPool(pool, {
      language: "typescript",
      difficulty: "easy",
      topic: "collections"
    });

    expect(selected.difficulty).toBe("easy");
  });

  it("drops topic before it drops difficulty", () => {
    const pool = [
      snippet("easy-loops", "easy", "loops"),
      snippet("hard-loops", "hard", "loops"),
      snippet("medium-arrays", "medium", "arrays")
    ];

    const selected = selectSnippetFromPool(pool, {
      language: "typescript",
      difficulty: "medium",
      topic: "loops"
    });

    expect(selected.difficulty).toBe("medium");
    expect(selected.topic).toBe("arrays");
  });

  it("keeps invalid C++ topics from leaking into another tier", () => {
    const pool: Snippet[] = [
      {
        language: "cpp",
        difficulty: "easy",
        topic: "loops",
        code: "int loop = 0;",
        filename: "loop.cpp",
        slug: "loop",
        title: "Loop",
        description: "Loop"
      },
      {
        language: "cpp",
        difficulty: "hard",
        topic: "memory",
        code: "int* ptr = nullptr;",
        filename: "memory.cpp",
        slug: "memory",
        title: "Memory",
        description: "Memory"
      }
    ];

    const selected = selectSnippetFromPool(pool, {
      language: "cpp",
      difficulty: "easy",
      topic: "memory"
    });

    expect(selected.difficulty).toBe("easy");
    expect(selected.topic).toBe("loops");
  });
});
