import { cppSnippets } from "./cpp";
import { csharpSnippets } from "./csharp";
import { pythonSnippets } from "./python";
import { typescriptSnippets } from "./typescript";

export const fallbackSnippets = [
  ...csharpSnippets,
  ...cppSnippets,
  ...typescriptSnippets,
  ...pythonSnippets
];
