import { lessons, canonicalLessonId } from "../data/lessons";
import { exerciseById } from "../data/scenarios";
import { STAGES, type Stage } from "./learning";
import type { TrackLanguage } from "./languages";

export type Attempt = {
  lessonId: string;
  mode: "type" | "fill" | "recall" | "quick" | "predict" | "repair";
  accuracy: number;
  wpm: number;
  typos: number;
  durationMs: number;
  assisted: boolean;
  passed: boolean;
  at: number;
};
export type Review = { streak: number; dueAt: number; updatedAt: number };
export type Progress = {
  version: 2;
  stages: Record<string, Stage[]>;
  attempts: Attempt[];
  reviews: Record<string, Review>;
};
type StorageLike = Pick<Storage, "getItem" | "setItem">;
export const PROGRESS_KEY = "codebadger.progress.v2";
const LEGACY_KEY = "codebadger.progress.v1";
const DAY = 86400000;
export const emptyProgress = (): Progress => ({
  version: 2,
  stages: {},
  attempts: [],
  reviews: {},
});
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isNumber = (v: unknown): v is number =>
  typeof v === "number" &&
  Number.isFinite(v) &&
  v >= 0 &&
  v <= 8640000000000000;
const knownLesson = (id: string) => lessons.some((l) => l.id === id);
const knownReview = (id: string) =>
  knownLesson(id) || Boolean(exerciseById(id));
const canonical = (id: string) =>
  id.includes(":") ? id : canonicalLessonId(id);
function readAttempt(v: unknown): Attempt | null {
  if (!isObject(v) || typeof v.lessonId !== "string") return null;
  const id = v.mode === "quick" ? v.lessonId : canonical(v.lessonId);
  const modes = ["type", "fill", "recall", "quick", "predict", "repair"];
  const exercise = exerciseById(id);
  const validId =
    v.mode === "quick"
      ? /^(cpp|csharp|typescript|python|rust):[a-z0-9_-]+$/.test(id)
      : knownLesson(id)
        ? ["type", "fill", "recall"].includes(String(v.mode))
        : exercise?.kind === v.mode;
  if (
    !validId ||
    !modes.includes(String(v.mode)) ||
    !["accuracy", "wpm", "typos", "durationMs", "at"].every((key) =>
      isNumber(v[key]),
    ) ||
    Number(v.accuracy) > 100 ||
    typeof v.assisted !== "boolean" ||
    typeof v.passed !== "boolean"
  )
    return null;
  return {
    lessonId: id,
    mode: v.mode as Attempt["mode"],
    accuracy: Number(v.accuracy),
    wpm: Number(v.wpm),
    typos: Number(v.typos),
    durationMs: Number(v.durationMs),
    at: Number(v.at),
    assisted: v.assisted,
    passed: v.passed,
  };
}
function schedule(previous: Review | undefined, attempt: Attempt): Review {
  const success = attempt.passed && !attempt.assisted;
  const streak = success ? Math.min(4, (previous?.streak ?? 0) + 1) : 0;
  return {
    streak,
    dueAt: Math.min(
      8640000000000000,
      attempt.at + (success ? [0, 1, 3, 7, 14][streak] * DAY : 0),
    ),
    updatedAt: attempt.at,
  };
}
function decode(raw: string | null): Progress | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      !isObject(value) ||
      (value.version !== 1 && value.version !== 2) ||
      !isObject(value.stages) ||
      !Array.isArray(value.attempts) ||
      value.attempts.length > 100000
    )
      return null;
    if (value.version === 2 && !isObject(value.reviews)) return null;
    const parsed = value.attempts.map(readAttempt);
    if (parsed.some((a) => a === null)) return null;
    const attempts = (parsed as Attempt[]).sort((a, b) => a.at - b.at);
    const stages: Progress["stages"] = {};
    for (const [id, saved] of Object.entries(value.stages)) {
      if (!knownLesson(canonical(id))) continue;
      if (!Array.isArray(saved) || !saved.every((s) => STAGES.includes(s)))
        return null;
      stages[canonical(id)] = [...new Set<Stage>(saved)];
    }
    const reviews: Progress["reviews"] = {};
    if (value.version === 1) {
      for (const attempt of attempts)
        if (attempt.mode === "recall")
          reviews[attempt.lessonId] = schedule(
            reviews[attempt.lessonId],
            attempt,
          );
    } else {
      for (const [id, v] of Object.entries(
        value.reviews as Record<string, unknown>,
      )) {
        if (
          !knownReview(id) ||
          !isObject(v) ||
          !Number.isInteger(v.streak) ||
          Number(v.streak) < 0 ||
          Number(v.streak) > 4 ||
          !isNumber(v.dueAt) ||
          !isNumber(v.updatedAt)
        )
          return null;
        reviews[id] = {
          streak: Number(v.streak),
          dueAt: v.dueAt,
          updatedAt: v.updatedAt,
        };
      }
    }
    return { version: 2, stages, attempts: attempts.slice(-500), reviews };
  } catch {
    return null;
  }
}
export const parseProgress = (raw: string | null): Progress =>
  decode(raw) ?? emptyProgress();
export function completeStage(
  progress: Progress,
  id: string,
  stage: Stage,
): Progress {
  id = canonical(id);
  if (!knownLesson(id) || !STAGES.includes(stage)) return progress;
  return {
    ...progress,
    stages: {
      ...progress.stages,
      [id]: [...new Set([...(progress.stages[id] ?? []), stage])],
    },
  };
}
export function recordAttempt(progress: Progress, input: Attempt): Progress {
  const attempt = readAttempt(input);
  if (!attempt) return progress;
  let next: Progress = {
    ...progress,
    attempts: [...progress.attempts, attempt]
      .sort((a, b) => a.at - b.at)
      .slice(-500),
  };
  if (["recall", "predict", "repair"].includes(attempt.mode)) {
    const previous = progress.reviews[attempt.lessonId];
    // Rechecking immediately cannot inflate the spacing streak.
    const base =
      previous &&
      attempt.passed &&
      !attempt.assisted &&
      attempt.at < previous.dueAt
        ? { ...previous, streak: Math.max(0, previous.streak - 1) }
        : previous;
    if (!previous || attempt.at >= previous.updatedAt)
      next.reviews = {
        ...progress.reviews,
        [attempt.lessonId]: schedule(base, attempt),
      };
  }
  if (
    attempt.passed &&
    !attempt.assisted &&
    (attempt.mode === "type" ||
      attempt.mode === "fill" ||
      attempt.mode === "recall")
  )
    next = completeStage(next, attempt.lessonId, attempt.mode);
  return next;
}
export function dueReviews(
  progress: Progress,
  now: number,
  language?: TrackLanguage,
) {
  return Object.entries(progress.reviews)
    .filter(
      ([id, r]) =>
        r.dueAt <= now && (!language || id.startsWith(`${language}:`)),
    )
    .sort((a, b) => a[1].dueAt - b[1].dueAt)
    .map(([id]) => id);
}
export function getReviewQueue(
  progress: Progress,
  now: number,
  count = 3,
  language?: TrackLanguage,
): string[] {
  return lessons
    .filter((l) => !language || l.language === language)
    .map((lesson, index) => {
      const review = progress.reviews[lesson.id];
      const priority = !review
        ? 100 - index / 100
        : review.dueAt <= now
          ? 200 + Math.min(100, (now - review.dueAt) / DAY)
          : -review.dueAt / 1e15;
      return { id: lesson.id, priority };
    })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, Math.max(0, count))
    .map((e) => e.id);
}
export function importProgress(
  current: Progress,
  raw: string,
):
  | { ok: true; progress: Progress; added: number }
  | { ok: false; error: string } {
  if (raw.length > 5_000_000)
    return {
      ok: false,
      error: "This file is too large for a CodeBadger backup (5 MB maximum).",
    };
  const incoming = decode(raw);
  if (!incoming)
    return {
      ok: false,
      error:
        "This is not a valid CodeBadger progress backup. Your current progress is unchanged.",
    };
  const fingerprint = (a: Attempt) => JSON.stringify(a);
  const combined = new Map(current.attempts.map((a) => [fingerprint(a), a]));
  let added = 0;
  for (const a of incoming.attempts)
    if (!combined.has(fingerprint(a))) {
      combined.set(fingerprint(a), a);
      added++;
    }
  const stages = { ...current.stages };
  for (const [id, values] of Object.entries(incoming.stages))
    stages[id] = [...new Set([...(stages[id] ?? []), ...values])];
  const reviews = { ...current.reviews };
  for (const [id, r] of Object.entries(incoming.reviews))
    if (!reviews[id] || r.updatedAt > reviews[id].updatedAt) reviews[id] = r;
  return {
    ok: true,
    added,
    progress: {
      version: 2,
      stages,
      reviews,
      attempts: [...combined.values()].sort((a, b) => a.at - b.at).slice(-500),
    },
  };
}
export function loadProgress(storage?: StorageLike): Progress {
  try {
    const source = storage ?? window.localStorage;
    return (
      decode(source.getItem(PROGRESS_KEY)) ??
      parseProgress(source.getItem(LEGACY_KEY))
    );
  } catch {
    return emptyProgress();
  }
}
export function saveProgress(
  progress: Progress,
  storage?: StorageLike,
): boolean {
  try {
    (storage ?? window.localStorage).setItem(
      PROGRESS_KEY,
      JSON.stringify(progress),
    );
    return true;
  } catch {
    return false;
  }
}
