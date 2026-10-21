import type { SnippetLineHint } from "./types";

export function normalizeSnippetText(text: string) {
  return text.replace(/\r\n?/g, "\n");
}

export function sanitizeSnippetText(text: string) {
  return normalizeSnippetText(text)
    .replace(/^```[a-zA-Z0-9_-]*\n?/, "")
    .replace(/\n?```$/, "")
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .trim();
}

export function humanizeSnippetSlug(slug: string) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function sanitizeLineHints(
  lineHints: Array<Partial<SnippetLineHint>> | undefined,
  code: string
) {
  if (!lineHints || lineHints.length === 0) {
    return undefined;
  }

  const lineCount = normalizeSnippetText(code).split("\n").length;
  const sanitizedHints = lineHints.flatMap((lineHint) => {
    const text = normalizeSnippetText(lineHint.text ?? "")
      .split("\n")[0]
      .trim();

    if (!Number.isInteger(lineHint.line) || !text) {
      return [];
    }

    if (lineHint.line! < 1 || lineHint.line! > lineCount) {
      return [];
    }

    return [{ line: lineHint.line!, text }];
  });

  return sanitizedHints.length > 0 ? sanitizedHints : undefined;
}
