import type { Lesson } from "../../lib/learning";
import type { TrackLanguage } from "../../lib/languages";
export type LessonSeed = {
  slug: string;
  title: string;
  subtitle: string;
  tag: string;
  intro: string;
  points: [string, string][];
  pitfall: string;
  /** {{code}} marks meaningful pieces that become gaps. */
  example: string;
  output: string;
  task: string;
  context: string;
  solution: string;
  alternatives?: string[];
  hint: string;
  explanation: string;
};
export function buildLessons(
  language: TrackLanguage,
  seeds: LessonSeed[],
): Lesson[] {
  return seeds.map((seed) => {
    const gaps: Lesson["gaps"] = [];
    const gapCode = seed.example.replace(
      /\{\{([\s\S]*?)\}\}/g,
      (_, answer: string) => {
        const id = `gap${gaps.length + 1}`;
        gaps.push({
          id,
          label: `Missing piece ${gaps.length + 1}`,
          answers: [answer],
          hint: seed.hint,
        });
        return `[[${id}]]`;
      },
    );
    return {
      id: `${language}:${seed.slug}`,
      language,
      title: seed.title,
      subtitle: seed.subtitle,
      tag: seed.tag,
      minutes: 4,
      intro: seed.intro,
      points: seed.points.map(([title, text]) => ({ title, text })),
      code: seed.example.replace(/\{\{([\s\S]*?)\}\}/g, "$1"),
      output: seed.output,
      pitfall: seed.pitfall,
      gapCode,
      gaps,
      recall: {
        prompt: seed.task,
        context: seed.context,
        placeholder: "// Recall the requested pattern",
        solution: seed.solution,
        accepted: seed.alternatives,
        hint: seed.hint,
        explanation: seed.explanation,
      },
    };
  });
}
