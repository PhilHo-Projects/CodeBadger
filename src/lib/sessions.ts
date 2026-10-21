import { lessons } from "../data/lessons";
import {
  allExercises,
  type Exercise,
  type ExerciseKind,
} from "../data/scenarios";
import { getReviewQueue, type Progress } from "./progress";
import type { TrackLanguage } from "./languages";
export type SessionOptions = {
  language: TrackLanguage | "all";
  count: 3 | 6 | 10;
  mode: "mixed" | ExerciseKind;
};
export function buildSession(
  progress: Progress,
  options: SessionOptions,
  now: number,
): Exercise[] {
  const language = options.language === "all" ? undefined : options.language;
  const recall: Exercise[] = getReviewQueue(
    progress,
    now,
    lessons.length,
    language,
  ).map((id) => {
    const l = lessons.find((l) => l.id === id)!;
    return {
      id: l.id,
      language: l.language,
      kind: "recall" as const,
      title: l.subtitle,
      prompt: l.recall.prompt,
      context: l.recall.context,
      code: "",
      starter: "",
      solution: l.recall.solution,
      accepted: l.recall.accepted,
      hint: l.recall.hint,
      explanation: l.recall.explanation,
    };
  });
  const pools: Record<ExerciseKind, Exercise[]> = {
    recall,
    predict: [],
    repair: [],
  };
  for (const e of allExercises)
    if (!language || e.language === language) pools[e.kind].push(e);
  const rank = (e: Exercise) => {
    const r = progress.reviews[e.id];
    return !r ? 1 : r.dueAt <= now ? 0 : 2;
  };
  for (const [offset, kind] of (
    ["recall", "predict", "repair"] as const
  ).entries()) {
    pools[kind].sort(
      (a, b) =>
        rank(a) - rank(b) ||
        (progress.reviews[a.id]?.dueAt ?? 0) -
          (progress.reviews[b.id]?.dueAt ?? 0),
    );
    if (!language) {
      // Keep due work ahead of new work, then rotate languages within each group.
      const ordered: Exercise[] = [];
      const languages = ["cpp", "typescript", "csharp", "rust"];
      const rotated = [
        ...languages.slice(offset),
        ...languages.slice(0, offset),
      ];
      for (const group of [0, 1, 2]) {
        const buckets = rotated.map((lang) =>
          pools[kind].filter((e) => rank(e) === group && e.language === lang),
        );
        while (buckets.some((b) => b.length))
          for (const b of buckets) if (b.length) ordered.push(b.shift()!);
      }
      pools[kind] = ordered;
    }
  }
  const kinds: ExerciseKind[] =
    options.mode === "mixed" ? ["recall", "predict", "repair"] : [options.mode];
  const session: Exercise[] = [];
  while (
    session.length < options.count &&
    kinds.some((kind) => pools[kind].length)
  )
    for (const kind of kinds) {
      if (session.length >= options.count) break;
      const next = pools[kind].shift();
      if (next) session.push(next);
    }
  return session;
}
