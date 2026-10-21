import { describe, expect, it } from "vitest";
import { lessons } from "../src/data/lessons";
import { checkRecall, checkGap } from "../src/lib/learning";

describe("recall checks", () => {
  it.each([
    ["variables", "int lives = 3;", true],
    ["variables", "int lives{3};", true],
    ["variables", "auto lives = 3;", true],
    ["variables", 'int lives = "3";', false],
    ["conditions", "if (score >= 100)", true],
    ["conditions", "if(100 <= score)", true],
    ["conditions", "if (score > 100)", false],
    ["for-loops", "for (int i = 0; i < 5; ++i)", true],
    ["for-loops", "for(int i=0;5>i;i+=1)", true],
    ["for-loops", "for (int i = 0; i <= 5; ++i)", false],
    ["while-loops", "while (lives > 0)", true],
    ["while-loops", "while (0 < lives)", true],
    ["while-loops", "while (lives != 0)", false],
    ["functions", "int square(int n) { return n * n; }", true],
    ["functions", "int square (int n) { return n + n; }", false],
    ["strings", "name.size()", true],
    ["strings", "name.length();", true],
    ["strings", '"name.size()"', false],
    ["vectors", "scores.push_back(42);", true],
    ["vectors", "scores.push_back(24);", false],
    ["maps", 'scores.at("Nova")', true],
    ["maps", 'scores["Nova"];', true],
    ["maps", 'scores.at("nova")', false],
  ])("checks %s answer %s", (id, code, passed) => {
    expect(checkRecall(id, code).passed).toBe(passed);
  });
  it("ignores comments but cannot pass using a commented-out answer", () => {
    expect(checkRecall("variables", "// int lives = 3;").passed).toBe(false);
    expect(
      checkRecall("variables", "/* comment */ int lives = 3; // done").passed,
    ).toBe(true);
  });
  it("rejects extra statements, empty input, and unknown exercises", () => {
    expect(checkRecall("variables", "int lives = 3; lives = 9;").passed).toBe(
      false,
    );
    expect(checkRecall("variables", "").passed).toBe(false);
    expect(checkRecall("unknown", "int lives = 3;").passed).toBe(false);
  });
  it("checks gaps without accepting changes inside strings", () => {
    expect(checkGap(" ++i ", ["i++", "++i", "i += 1"])).toBe(true);
    expect(checkGap('"No va"', ['"Nova"'])).toBe(false);
  });
  it("every published solution passes its real checker and every gap has a valid answer", () => {
    for (const lesson of lessons) {
      expect(
        checkRecall(lesson.id, lesson.recall.solution).passed,
        lesson.id,
      ).toBe(true);
      for (const gap of lesson.gaps)
        expect(checkGap(gap.answers[0], gap.answers)).toBe(true);
    }
  });
});
