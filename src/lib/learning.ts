import { lessons } from "../data/lessons";
import { normalizeAnswer, matchesAnswer } from "./answers";
import type { TrackLanguage } from "./languages";
export const STAGES = ["learn", "type", "fill", "recall"] as const;
export type Stage = (typeof STAGES)[number];
export const STAGE_LABELS: Record<Stage, string> = {
  learn: "Learn",
  type: "Type it",
  fill: "Fill gaps",
  recall: "Recall",
};
export type Gap = {
  id: string;
  label: string;
  answers: string[];
  hint: string;
};
export type Lesson = {
  id: string;
  language: TrackLanguage;
  title: string;
  subtitle: string;
  tag: string;
  minutes: number;
  intro: string;
  points: { title: string; text: string }[];
  code: string;
  output: string;
  pitfall: string;
  gapCode: string;
  gaps: Gap[];
  recall: {
    prompt: string;
    context: string;
    placeholder: string;
    solution: string;
    accepted?: string[];
    hint: string;
    explanation: string;
  };
};

export function checkGap(answer: string, accepted: string[]) {
  return matchesAnswer(answer, accepted);
}

const patterns: Record<string, RegExp> = {
  variables: /^(?:int lives (?:= 3|\{ 3 \}|\( 3 \))|auto lives = 3) ;$/,
  conditions: /^if \( (?:score >= 100|100 <= score) \)$/,
  "for-loops":
    /^for \( int i = 0 ; (?:i < 5|5 > i) ; (?:\+\+ i|i \+\+|i \+= 1|i = i \+ 1) \)$/,
  "while-loops": /^while \( (?:lives > 0|0 < lives) \)$/,
  functions: /^int square \( int n \) \{ return n \* n ; \}$/,
  strings: /^name \. (?:size|length) \( \)(?: ;)?$/,
  vectors: /^scores \. (?:push_back|emplace_back) \( 42 \) ;$/,
  maps: /^scores (?:\. at \( "Nova" \)|\[ "Nova" \])(?: ;)?$/,
};

export function checkRecall(lessonId: string, answer: string) {
  const id = lessonId.includes(":") ? lessonId : `cpp:${lessonId}`;
  const lesson = lessons.find((item) => item.id === id);
  const pattern = id.startsWith("cpp:") ? patterns[id.slice(4)] : undefined;
  const normalized = normalizeAnswer(answer);
  const passed = Boolean(
    lesson &&
    (pattern
      ? normalized && pattern.test(normalized)
      : matchesAnswer(answer, [
          lesson.recall.solution,
          ...(lesson.recall.accepted ?? []),
        ])),
  );
  return {
    passed,
    message: passed
      ? "That’s the construct. You recalled it."
      : "Check the requested names, values, and syntax. Use the hint if you’re stuck.",
  };
}
