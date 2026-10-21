import { describe, expect, it } from "vitest";

import { parseGeneratedSnippet } from "../src/lib/googleAi";

describe("Google AI snippet parsing", () => {
  const options = {
    apiKey: "test",
    model: "test",
    language: "cpp" as const,
    difficulty: "easy" as const,
    topic: "all" as const,
  };
  it("rejects oversized code before it becomes a typing target", () => {
    expect(() =>
      parseGeneratedSnippet(
        JSON.stringify({ code: "x".repeat(3000) }),
        options,
      ),
    ).toThrow(/too long/i);
  });
  it("normalizes tab indentation into typeable spaces", () => {
    expect(
      parseGeneratedSnippet(
        JSON.stringify({ code: "if (true)\n{\n\twork();\n}" }),
        options,
      ).code,
    ).toContain("    work();");
  });
  it.each(["null", "[]", '{"code":123}'])(
    "rejects malformed payload %s with a useful error",
    (text) => {
      expect(() => parseGeneratedSnippet(text, options)).toThrow(/payload/i);
    },
  );
  it("keeps C++ generated topics inside the selected tier and sanitizes line hints", () => {
    const snippet = parseGeneratedSnippet(
      JSON.stringify({
        filename: "generated-snippet.cpp",
        title: "Timer Tick",
        description: "Count down a timer before the round starts.",
        code: "int timer = 3;\nwhile (timer > 0)\n{\n    --timer;\n}",
        lineHints: [
          { line: 1, text: "Create the timer." },
          { line: 2, text: "Loop until zero.\nIgnore this extra line." },
          { line: 99, text: "Out of range." },
        ],
      }),
      {
        apiKey: "test",
        model: "gemini-2.5-flash",
        language: "cpp",
        difficulty: "easy",
        topic: "all",
      },
    );

    expect(snippet.topic).toBe("loops");
    expect(snippet.lineHints).toEqual([
      { line: 1, text: "Create the timer." },
      { line: 2, text: "Loop until zero." },
    ]);
  });

  it("drops helper hints outside easy C++", () => {
    const snippet = parseGeneratedSnippet(
      JSON.stringify({
        filename: "generated-snippet.cpp",
        code: "std::mutex queueMutex;\nstd::lock_guard<std::mutex> guard(queueMutex);",
        lineHints: [{ line: 1, text: "Do not keep this hint." }],
      }),
      {
        apiKey: "test",
        model: "gemini-2.5-flash",
        language: "cpp",
        difficulty: "hard",
        topic: "concurrency",
      },
    );

    expect(snippet.lineHints).toBeUndefined();
    expect(snippet.title).toBe("Production Concurrency");
  });
});
