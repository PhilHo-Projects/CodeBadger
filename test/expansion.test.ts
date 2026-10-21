import { describe, expect, it } from "vitest";
import { lessons, lessonsForLanguage } from "../src/data/lessons";
import { scenarios, checkExercise } from "../src/data/scenarios";
import { checkRecall } from "../src/lib/learning";
import {
  emptyProgress,
  recordAttempt,
  parseProgress,
  importProgress,
  getReviewQueue,
  dueReviews,
} from "../src/lib/progress";
import { buildSession } from "../src/lib/sessions";
import { tokenizeCode } from "../src/lib/tokenize";

const rep = {
  lessonId: "typescript:variables",
  mode: "recall" as const,
  accuracy: 100,
  wpm: 0,
  typos: 0,
  durationMs: 2000,
  passed: true,
  assisted: false,
  at: 1000,
};

describe("language lab", () => {
  it("publishes distinct, complete tracks with working recall answers", () => {
    for (const language of ["cpp", "typescript", "csharp", "rust"] as const) {
      const track = lessonsForLanguage(language);
      expect(track.length).toBeGreaterThanOrEqual(12);
      for (const lesson of track) {
        expect(lesson.id.startsWith(`${language}:`)).toBe(true);
        expect(
          checkRecall(lesson.id, lesson.recall.solution).passed,
          lesson.id,
        ).toBe(true);
        expect(lesson.gaps.length).toBeGreaterThan(0);
        expect(lesson.points.length).toBeGreaterThanOrEqual(2);
      }
    }
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
  });
  it("checks language-specific syntax without accepting a wrong value or commented answer", () => {
    expect(
      checkRecall("typescript:variables", "let lives: number = 3;").passed,
    ).toBe(true);
    expect(
      checkRecall("typescript:variables", 'let lives: number = "3";').passed,
    ).toBe(false);
    expect(checkRecall("rust:variables", "let mut lives = 3;").passed).toBe(
      true,
    );
    expect(checkRecall("rust:variables", "// let mut lives = 3;").passed).toBe(
      false,
    );
  });
  it("does not colour a Rust lifetime as the rest of a string", () => {
    const line = tokenizeCode(
      "fn first<'a>(s: &'a str) -> &'a str { s }",
      "rust",
    )[0];
    expect(line.map((x) => x.char).join("")).toBe(
      "fn first<'a>(s: &'a str) -> &'a str { s }",
    );
    expect(line.find((x) => x.char === "{")?.kind).toBe("plain");
  });
  it("provides prediction and repair rounds in all four scenario languages", () => {
    expect(scenarios.length).toBeGreaterThanOrEqual(24);
    for (const scenario of scenarios) {
      expect(scenario.exercises.map((e) => e.kind)).toEqual([
        "predict",
        "repair",
        "recall",
      ]);
      for (const exercise of scenario.exercises) {
        expect(checkExercise(exercise, exercise.solution)).toBe(true);
        expect(checkExercise(exercise, "")).toBe(false);
        if (exercise.kind === "repair")
          expect(checkExercise(exercise, exercise.starter)).toBe(false);
      }
    }
  });
  it("migrates legacy C++ progress and keeps tracks independent", () => {
    const migrated = parseProgress(
      JSON.stringify({
        version: 1,
        stages: { variables: ["learn", "recall"] },
        attempts: [{ ...rep, lessonId: "variables" }],
      }),
    );
    expect(migrated.stages["cpp:variables"]).toEqual(["learn", "recall"]);
    expect(migrated.attempts[0].lessonId).toBe("cpp:variables");
    const next = recordAttempt(migrated, rep);
    expect(next.stages["typescript:variables"]).toEqual(["recall"]);
    expect(next.stages["rust:variables"]).toBeUndefined();
  });
  it("schedules unaided recall, then brings mistakes back immediately", () => {
    let p = recordAttempt(emptyProgress(), rep);
    expect(dueReviews(p, 1001, "typescript")).toHaveLength(0);
    expect(dueReviews(p, 86401001, "typescript")).toEqual([
      "typescript:variables",
    ]);
    p = recordAttempt(p, { ...rep, passed: false, at: 2000 });
    expect(dueReviews(p, 2001, "typescript")).toEqual(["typescript:variables"]);
    expect(
      getReviewQueue(p, 2001, 3, "rust").every((id) => id.startsWith("rust:")),
    ).toBe(true);
  });
  it("validates backups and merges attempts without duplicates or lost stages", () => {
    const a = recordAttempt(emptyProgress(), rep);
    const b = recordAttempt(emptyProgress(), {
      ...rep,
      lessonId: "rust:variables",
    });
    const merged = importProgress(a, JSON.stringify(b));
    expect(merged.ok).toBe(true);
    if (!merged.ok) return;
    expect(merged.progress.attempts).toHaveLength(2);
    const again = importProgress(merged.progress, JSON.stringify(b));
    expect(again.ok && again.progress.attempts.length).toBe(2);
    expect(
      importProgress(
        a,
        '{"version":2,"stages":{},"attempts":[{}],"reviews":{}}',
      ).ok,
    ).toBe(false);
    expect(importProgress(a, "not json").ok).toBe(false);
  });
  it("builds unique mixed sessions and respects language selection", () => {
    const session = buildSession(
      emptyProgress(),
      { language: "rust", count: 10, mode: "mixed" },
      1000,
    );
    expect(session).toHaveLength(10);
    expect(new Set(session.map((e) => e.id)).size).toBe(10);
    expect(session.every((e) => e.language === "rust")).toBe(true);
    expect(new Set(session.map((e) => e.kind)).size).toBe(3);
  });
  it("returns scenario recalls for review and mixes languages in a short all-track session", () => {
    const exercise = scenarios.find((s) => s.language === "rust")!.exercises[2];
    const p = recordAttempt(emptyProgress(), {
      ...rep,
      lessonId: exercise.id,
      passed: false,
    });
    const review = buildSession(
      p,
      { language: "rust", count: 3, mode: "recall" },
      2000,
    );
    expect(review[0].id).toBe(exercise.id);
    const mixed = buildSession(
      emptyProgress(),
      { language: "all", count: 3, mode: "mixed" },
      2000,
    );
    expect(new Set(mixed.map((e) => e.language)).size).toBe(3);
  });
  it("keeps review schedules after old attempts leave recent history", () => {
    let p = recordAttempt(emptyProgress(), rep);
    for (let i = 0; i < 505; i++)
      p = recordAttempt(p, {
        ...rep,
        lessonId: "rust:variables",
        mode: "type",
        at: 2000 + i,
      });
    expect(p.attempts.some((a) => a.lessonId === rep.lessonId)).toBe(false);
    expect(parseProgress(JSON.stringify(p)).reviews[rep.lessonId]).toEqual(
      p.reviews[rep.lessonId],
    );
    expect(dueReviews(p, 86402000)).toContain(rep.lessonId);
  });
  it("does not advance spacing by repeating a successful answer immediately", () => {
    let p = recordAttempt(emptyProgress(), rep);
    p = recordAttempt(p, { ...rep, at: 2000 });
    expect(p.reviews[rep.lessonId].streak).toBe(1);
    p = recordAttempt(p, { ...rep, at: p.reviews[rep.lessonId].dueAt });
    expect(p.reviews[rep.lessonId].streak).toBe(2);
  });
});
