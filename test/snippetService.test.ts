import { describe, expect, it } from "vitest";

import { cppSnippets } from "../src/data/fallbackSnippets/cpp";
import { csharpSnippets } from "../src/data/fallbackSnippets/csharp";
import { pythonSnippets } from "../src/data/fallbackSnippets/python";
import { typescriptSnippets } from "../src/data/fallbackSnippets/typescript";
import { selectSnippetFromPool } from "../src/lib/snippetService";
import { sanitizeSnippetText } from "../src/lib/snippetText";
import type { Snippet } from "../src/lib/types";

function snippet(slug: string, difficulty: Snippet["difficulty"], topic: Snippet["topic"]): Snippet {
  return {
    language: "typescript",
    difficulty,
    topic,
    code: `const ${slug} = true;`,
    filename: `${slug}.ts`,
    slug
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
});

describe("snippet sanitization", () => {
  it("strips markdown fences and normalizes line endings and quotes", () => {
    const sanitized = sanitizeSnippetText("```ts\r\nconst message = “hi”;\r\n```");
    expect(sanitized).toBe('const message = "hi";');
  });
});

describe("snippet selection fallback order", () => {
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
});
