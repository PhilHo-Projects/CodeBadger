/** Explicit syntax patterns, not a compiler or an equivalence prover. */
export function normalizeAnswer(code: string): string {
  const parts =
    code.match(
      /\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\\n])'|`(?:\\.|[^`\\])*`|\s+|[A-Za-z_$][\w$]*|\d+(?:\.\d+)?|\+\+|--|>=|<=|===|!==|==|!=|\+=|-=|::|=>|->|&&|\|\||\?\?|\?\.|[^\s]/g,
    ) ?? [];
  return parts.filter((part) => !/^\s|^\/\/|^\/\*/.test(part)).join(" ");
}
export function matchesAnswer(answer: string, accepted: readonly string[]) {
  const normalized = normalizeAnswer(answer);
  return (
    normalized.length > 0 &&
    accepted.some((value) => normalizeAnswer(value) === normalized)
  );
}
