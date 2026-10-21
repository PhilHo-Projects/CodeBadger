import { describe, expect, it } from "vitest";
import {
  emptyProgress,
  parseProgress,
  recordAttempt,
  completeStage,
  getReviewQueue,
  loadProgress,
  saveProgress,
} from "../src/lib/progress";

const result = {
  lessonId: "cpp:for-loops",
  mode: "recall" as const,
  accuracy: 100,
  wpm: 0,
  typos: 0,
  durationMs: 1000,
  assisted: false,
  passed: true,
  at: 10000,
};

describe("learning progress", () => {
  it("survives a JSON round trip with completed stages and attempt details", () => {
    let progress = completeStage(emptyProgress(), "cpp:for-loops", "learn");
    progress = recordAttempt(progress, result);
    expect(parseProgress(JSON.stringify(progress))).toEqual(progress);
    expect(progress.stages["cpp:for-loops"]).toEqual(["learn", "recall"]);
  });
  it("does not complete a recall stage for a failed or assisted attempt", () => {
    expect(
      recordAttempt(emptyProgress(), { ...result, passed: false }).stages[
        "cpp:for-loops"
      ],
    ).toBeUndefined();
    expect(
      recordAttempt(emptyProgress(), { ...result, assisted: true }).stages[
        "cpp:for-loops"
      ],
    ).toBeUndefined();
  });
  it.each([
    "invalid JSON",
    "null",
    '{"version":999}',
    '{"version":1,"stages":null,"attempts":[]}',
    '{"version":1,"stages":{},"attempts":[{}]}',
  ])("recovers from invalid storage: %s", (raw) => {
    expect(parseProgress(raw)).toEqual(emptyProgress());
  });
  it("caps history and deduplicates stage completion", () => {
    let progress = emptyProgress();
    for (let i = 0; i < 505; i++)
      progress = recordAttempt(progress, { ...result, at: i });
    expect(progress.attempts).toHaveLength(500);
    expect(progress.attempts[0].at).toBe(5);
    expect(progress.stages["cpp:for-loops"]).toEqual(["recall"]);
  });
  it("prioritizes failed recall and never repeats a lesson inside a warm-up", () => {
    let progress = recordAttempt(emptyProgress(), {
      ...result,
      lessonId: "cpp:variables",
    });
    progress = recordAttempt(progress, {
      ...result,
      lessonId: "cpp:for-loops",
      passed: false,
      accuracy: 0,
      at: 11000,
    });
    const queue = getReviewQueue(progress, 20000, 3);
    expect(queue[0]).toBe("cpp:for-loops");
    expect(new Set(queue).size).toBe(3);
  });
  it("keeps working when browser storage throws", () => {
    const blocked = {
      getItem() {
        throw new Error("denied");
      },
      setItem() {
        throw new Error("quota");
      },
    };
    expect(loadProgress(blocked)).toEqual(emptyProgress());
    expect(saveProgress(emptyProgress(), blocked)).toBe(false);
  });
  it("rejects corrupted attempt identifiers and dates that cannot be displayed", () => {
    for (const invalid of [
      { ...result, mode: "quick", lessonId: "missing-separator" },
      { ...result, at: 1e30 },
      { ...result, lessonId: "missing-lesson" },
    ]) {
      expect(
        parseProgress(
          JSON.stringify({ version: 1, stages: {}, attempts: [invalid] }),
        ),
      ).toEqual(emptyProgress());
    }
  });
});
