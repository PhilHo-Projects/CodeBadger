import { cppLessons } from "./curriculum/cpp";
import { cppExtraLessons } from "./curriculum/cpp-extra";
import { typescriptLessons } from "./curriculum/typescript";
import { csharpLessons } from "./curriculum/csharp";
import { rustLessons } from "./curriculum/rust";
import type { TrackLanguage } from "../lib/languages";
export const lessons = [
  ...cppLessons,
  ...cppExtraLessons,
  ...typescriptLessons,
  ...csharpLessons,
  ...rustLessons,
];
export const canonicalLessonId = (id: string) =>
  id.includes(":") ? id : `cpp:${id}`;
export const lessonsForLanguage = (language: TrackLanguage) =>
  lessons.filter((lesson) => lesson.language === language);
export const lessonById = (id: string) =>
  lessons.find((lesson) => lesson.id === canonicalLessonId(id)) ?? lessons[0];
