import { cppSnippets } from "./cpp";
import { csharpSnippets } from "./csharp";
import { pythonSnippets } from "./python";
import { typescriptSnippets } from "./typescript";
import { lessons, lessonsForLanguage } from "../lessons";
import { scenarios } from "../scenarios";
import { lessonFilename } from "../../lib/languages";
import type { Snippet } from "../../lib/types";

const lessonSnippets: Snippet[] = lessons.map((lesson) => {
  const index = lessonsForLanguage(lesson.language).findIndex(
    (l) => l.id === lesson.id,
  );
  const slug = lesson.id.split(":")[1];
  const difficulty =
    lesson.language === "cpp"
      ? index < 8
        ? "easy"
        : slug === "references" || slug === "ownership"
          ? "hard"
          : "medium"
      : index < 4
        ? "easy"
        : index < 9
          ? "medium"
          : "hard";
  const cppTopics: Record<string, Snippet["topic"]> = {
    variables: "loops",
    conditions: "loops",
    "for-loops": "loops",
    "while-loops": "loops",
    functions: "loops",
    strings: "strings",
    vectors: "containers",
    maps: "containers",
    references: "memory",
    "range-for": "iterators",
    algorithms: "algorithms",
    ownership: "memory",
  };
  const topic =
    lesson.language === "cpp"
      ? cppTopics[slug]
      : lesson.tag === "Control flow"
        ? "loops"
        : lesson.tag === "Collections"
          ? "collections"
          : lesson.tag === "Data modelling"
            ? "classes"
            : "algorithms";
  return {
    language: lesson.language,
    difficulty,
    topic,
    code: lesson.code,
    filename: lessonFilename(lesson.id, lesson.language),
    slug: `lesson-${lesson.id.split(":")[1]}`,
    title: lesson.subtitle,
    description: lesson.intro,
  };
});
const scenarioSnippets: Snippet[] = scenarios.map((s) => ({
  language: s.language,
  difficulty: s.difficulty === "Foundations" ? "easy" : "medium",
  topic:
    s.language === "cpp" && s.difficulty === "Foundations"
      ? "containers"
      : "algorithms",
  code: s.exercises[0].code,
  filename: lessonFilename(s.slug, s.language),
  slug: `scenario-${s.slug}`,
  title: s.title,
  description: s.description,
}));

export const fallbackSnippets = [
  ...csharpSnippets,
  ...cppSnippets,
  ...typescriptSnippets,
  ...pythonSnippets,
  ...lessonSnippets,
  ...scenarioSnippets,
].filter(
  (s, i, all) =>
    all.findIndex(
      (other) => other.language === s.language && other.code === s.code,
    ) === i,
);
