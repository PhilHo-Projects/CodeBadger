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
