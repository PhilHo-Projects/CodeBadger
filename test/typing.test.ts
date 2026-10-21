import { describe, expect, it } from "vitest";
import {
  getEnterInput,
  applyTypingInput,
  createTypingState,
  eraseTypingInput,
  getTypingStats,
  nextIndent,
} from "../src/lib/typing";

describe("typing rounds", () => {
  it("never turns an Enter key into a space between tokens", () => {
    expect(getEnterInput("int lives", 3, true)).toBe("\n");
    expect(getEnterInput("a\n    b", 1, true)).toBe("\n    ");
    expect(getEnterInput("a\n    b", 1, false)).toBe("\n");
  });
  it("does not punish deleting and retyping correct text", () => {
    let round = applyTypingInput(createTypingState("abc"), "a", 1000);
    round = eraseTypingInput(round);
    round = applyTypingInput(round, "a", 2000);
    expect(getTypingStats(round, 2000).accuracy).toBe(100);
    expect(round.typos).toBe(0);
    expect(round.text).toBe("a");
  });
  it("blocks incorrect input and includes the attempt in accuracy", () => {
    let round = applyTypingInput(createTypingState("ab"), "x", 1000);
    expect(round.text).toBe("");
    expect(round.errorIndex).toBe(0);
    round = applyTypingInput(round, "a", 1100);
    expect(getTypingStats(round, 1100).accuracy).toBe(50);
    expect(round.typos).toBe(1);
  });
  it("freezes a completed round and measures elapsed time from the first input", () => {
    let round = applyTypingInput(createTypingState("ab"), "a", 1000);
    round = applyTypingInput(round, "b", 2000);
    expect(round.endedAt).toBe(2000);
    expect(getTypingStats(round, 9000).elapsedMs).toBe(1000);
    expect(applyTypingInput(round, "x", 3000)).toBe(round);
    expect(eraseTypingInput(round)).toBe(round);
  });
  it("does not count automatic indentation as keystrokes", () => {
    let round = applyTypingInput(createTypingState("a\n    b"), "a", 1000);
    round = applyTypingInput(round, "\n    ", 2000, 1);
    expect(round.attempts).toBe(2);
    expect(round.correctAttempts).toBe(2);
    expect(nextIndent("a\n    b", 1)).toBe("\n    ");
  });
  it("finds the remaining spaces to the next indentation stop", () => {
    expect(nextIndent("a\n        b", 2)).toBe("    ");
    expect(nextIndent("a\n        b", 6)).toBe("    ");
    expect(nextIndent("abc", 0)).toBe("");
  });
});
