import type { Language } from "./types";
export const TRACK_LANGUAGES = ["cpp", "typescript", "csharp", "rust"] as const;
export type TrackLanguage = (typeof TRACK_LANGUAGES)[number];
export const LANGUAGE_META: Record<
  Language,
  {
    label: string;
    short: string;
    extension: string;
    color: string;
    description: string;
    setup: string;
  }
> = {
  cpp: {
    label: "C++",
    short: "C++",
    extension: "cpp",
    color: "#9ac5ac",
    description: "Control flow, containers, memory & the STL.",
    setup:
      "C++20 snippets inside main unless a function is shown. Include the corresponding standard headers. Output uses std::cout.",
  },
  typescript: {
    label: "TypeScript",
    short: "TS",
    extension: "ts",
    color: "#8cbde0",
    description: "Typed JavaScript, narrowing, generics & async.",
    setup:
      "Strict TypeScript with modern JavaScript built-ins. console.log prints output. Types are erased at runtime.",
  },
  csharp: {
    label: "C#",
    short: "C#",
    extension: "cs",
    color: "#c4ace0",
    description: "Collections, LINQ, nullability & async.",
    setup:
      "Modern C# top-level statements with implicit System usings, System.Collections.Generic and System.Linq. Nullable reference types enabled.",
  },
  rust: {
    label: "Rust",
    short: "RS",
    extension: "rs",
    color: "#e5a888",
    description: "Ownership, borrowing, enums & iterators.",
    setup:
      "Snippets inside fn main() unless a function or type is shown. Standard library only; import HashMap when shown.",
  },
  python: {
    label: "Python",
    short: "PY",
    extension: "py",
    color: "#d9cb83",
    description: "Quick typing laps in readable Python.",
    setup: "Python 3 quick drills. A full learning track is on the roadmap.",
  },
};
export const lessonFilename = (id: string, language: Language) =>
  `${id.split(":").at(-1)}.${LANGUAGE_META[language].extension}`;
