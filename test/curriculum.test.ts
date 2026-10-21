import { describe, expect, it } from "vitest";
import ts from "typescript";
import { lessons } from "../src/data/lessons";
import { scenarios } from "../src/data/scenarios";
import { fallbackSnippets } from "../src/data/fallbackSnippets";
import { isTopicAvailable } from "../src/lib/types";
import { matchesAnswer } from "../src/lib/answers";

describe("published exercise content", () => {
  const fixtures = [
    ...lessons
      .filter((l) => l.language === "typescript")
      .map((l) => ({ id: l.id, code: l.code, output: l.output })),
    ...scenarios
      .filter((s) => s.language === "typescript")
      .map((s) => ({
        id: s.id,
        code: s.exercises[0].code,
        output: s.exercises[0].solution,
      })),
  ];
  it.each(fixtures)(
    "TypeScript example $id prints its documented output",
    async ({ code, output }) => {
      const logs: string[] = [];
      const js = ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
      }).outputText;
      // Execute only repository-authored fixtures, never learner input.
      await new Function("console", `return (async()=>{${js}})()`)({
        log: (...args: unknown[]) => logs.push(args.join(" ")),
      });
      await Promise.resolve();
      expect(logs.join("\n")).toBe(output);
    },
  );
  it("has gap markers that reconstruct each complete example", () => {
    for (const lesson of lessons) {
      const reconstructed = lesson.gapCode.replace(
        /\[\[(\w+)\]\]/g,
        (_, id: string) => lesson.gaps.find((g) => g.id === id)!.answers[0],
      );
      // Existing C++ gap tasks intentionally isolate a smaller construct.
      if (lesson.language !== "cpp")
        expect(reconstructed, lesson.id).toBe(lesson.code);
      expect(lesson.code).not.toContain("{{");
    }
  });
  it("keeps the enlarged quick library unique and its filters accurate", () => {
    expect(fallbackSnippets.length).toBeGreaterThan(140);
    expect(
      new Set(fallbackSnippets.map((s) => `${s.language}:${s.code}`)).size,
    ).toBe(fallbackSnippets.length);
    for (const s of fallbackSnippets)
      expect(isTopicAvailable(s.language, s.difficulty, s.topic), s.slug).toBe(
        true,
      );
  });
  it("preserves literals, operators and statement boundaries in pattern checks", () => {
    expect(
      matchesAnswer('const name = "No va";', ['const name = "Nova";']),
    ).toBe(false);
    expect(matchesAnswer("i + + 1", ["i++1"])).toBe(false);
    expect(matchesAnswer("let n = 1; n = 2;", ["let n = 1;"])).toBe(false);
    expect(
      matchesAnswer('let text = "//keep"; // ignore', ['let text="//keep";']),
    ).toBe(true);
    expect(
      matchesAnswer("fn echo<'a>(text: &'a str)->&'a str{text}", [
        "fn echo<'a>(text: &'a str) -> &'a str { text }",
      ]),
    ).toBe(true);
  });
});
