import type { Language, SyntaxKind, TokenChar } from "./types";

type Token = {
  value: string;
  kind: SyntaxKind;
};

const KEYWORDS: Record<Language, Set<string>> = {
  rust: new Set(
    "let mut fn pub impl struct enum match if else for in while loop return break continue move ref use mod const static true false async await dyn trait where self Self as".split(
      " ",
    ),
  ),
  csharp: new Set([
    "async",
    "await",
    "catch",
    "try",
    "throw",
    "out",
    "record",
    "switch",
    "with",
    "get",
    "set",
    "using",
    "is",
    "not",
    "bool",
    "break",
    "case",
    "class",
    "const",
    "continue",
    "else",
    "false",
    "for",
    "foreach",
    "if",
    "in",
    "int",
    "new",
    "null",
    "private",
    "public",
    "return",
    "static",
    "string",
    "true",
    "var",
    "void",
    "while",
  ]),
  cpp: new Set([
    "auto",
    "bool",
    "break",
    "class",
    "const",
    "continue",
    "else",
    "false",
    "for",
    "if",
    "int",
    "private",
    "public",
    "return",
    "size_t",
    "struct",
    "true",
    "void",
    "while",
  ]),
  typescript: new Set([
    "async",
    "await",
    "catch",
    "try",
    "throw",
    "typeof",
    "instanceof",
    "unknown",
    "never",
    "number",
    "string",
    "boolean",
    "null",
    "undefined",
    "of",
    "void",
    "as",
    "break",
    "class",
    "const",
    "continue",
    "else",
    "export",
    "extends",
    "false",
    "for",
    "function",
    "if",
    "implements",
    "interface",
    "let",
    "new",
    "private",
    "public",
    "readonly",
    "return",
    "true",
    "type",
    "while",
  ]),
  python: new Set([
    "and",
    "as",
    "break",
    "class",
    "continue",
    "def",
    "elif",
    "else",
    "False",
    "for",
    "if",
    "in",
    "None",
    "not",
    "or",
    "range",
    "return",
    "True",
    "while",
  ]),
};

const TYPE_NAMES: Record<Language, Set<string>> = {
  rust: new Set(
    "String str Vec HashMap HashSet Option Result Some None Ok Err i32 u32 usize bool f64".split(
      " ",
    ),
  ),
  csharp: new Set([
    "Console",
    "Dictionary",
    "HashSet",
    "List",
    "Math",
    "PlayerState",
    "Queue",
    "Stack",
  ]),
  cpp: new Set(["Enemy", "Player", "std", "string", "unordered_map", "vector"]),
  typescript: new Set(["Array", "Map", "Player", "Promise", "Record", "Set"]),
  python: new Set(["Path", "Player", "dict", "list", "set", "tuple"]),
};

function isIdentifierStart(char: string) {
  return /[A-Za-z_]/.test(char);
}

function isIdentifierChar(char: string) {
  return /[A-Za-z0-9_]/.test(char);
}

function readString(line: string, start: number) {
  const quote = line[start];
  let index = start + 1;

  while (index < line.length) {
    const current = line[index];

    if (current === "\\" && index + 1 < line.length) {
      index += 2;
      continue;
    }

    if (current === quote) {
      index += 1;
      break;
    }

    index += 1;
  }

  return {
    value: line.slice(start, index),
    nextIndex: index,
  };
}

function classifyIdentifier(
  language: Language,
  value: string,
  nextChar: string | undefined,
): SyntaxKind {
  if (KEYWORDS[language].has(value)) {
    return "keyword";
  }

  if (TYPE_NAMES[language].has(value) || /^[A-Z][A-Za-z0-9_]*$/.test(value)) {
    return "type";
  }

  if (nextChar === "(") {
    return "function";
  }

  return "plain";
}

function tokenizeLine(line: string, language: Language): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < line.length) {
    const char = line[index];

    if (char === " " || char === "\t") {
      const start = index;
      while (
        index < line.length &&
        (line[index] === " " || line[index] === "\t")
      ) {
        index += 1;
      }
      tokens.push({ value: line.slice(start, index), kind: "plain" });
      continue;
    }

    if (
      (language !== "python" && line.startsWith("//", index)) ||
      (language === "python" && char === "#")
    ) {
      tokens.push({ value: line.slice(index), kind: "comment" });
      break;
    }

    if (
      char === '"' ||
      (char === "'" &&
        (language !== "rust" || /^'(?:\\.|[^'\\])'/.test(line.slice(index)))) ||
      (language === "typescript" && char === "`")
    ) {
      const stringToken = readString(line, index);
      tokens.push({ value: stringToken.value, kind: "string" });
      index = stringToken.nextIndex;
      continue;
    }

    if (/[0-9]/.test(char)) {
      const start = index;
      while (index < line.length && /[0-9._]/.test(line[index])) {
        index += 1;
      }
      tokens.push({ value: line.slice(start, index), kind: "number" });
      continue;
    }

    if (isIdentifierStart(char)) {
      const start = index;
      while (index < line.length && isIdentifierChar(line[index])) {
        index += 1;
      }

      let lookahead = index;
      while (lookahead < line.length && line[lookahead] === " ") {
        lookahead += 1;
      }

      const value = line.slice(start, index);
      tokens.push({
        value,
        kind: classifyIdentifier(language, value, line[lookahead]),
      });
      continue;
    }

    tokens.push({ value: char, kind: "plain" });
    index += 1;
  }

  return tokens;
}

export function tokenizeCode(code: string, language: Language) {
  return code
    .split("\n")
    .map((line) =>
      tokenizeLine(line, language).flatMap<TokenChar>((token) =>
        [...token.value].map((char) => ({ char, kind: token.kind })),
      ),
    );
}
