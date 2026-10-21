import { useMemo } from "react";
import { tokenizeCode } from "../lib/tokenize";
import type { Language } from "../lib/types";
import { getLanguageLabel } from "../lib/types";

type Props = {
  code: string;
  language?: Language;
  filename?: string;
  typedText?: string;
  errorIndex?: number | null;
  complete?: boolean;
  label?: string;
};

export function CodeBlock({
  code,
  language = "cpp",
  filename,
  typedText,
  errorIndex,
  complete,
  label,
}: Props) {
  const lines = useMemo(() => tokenizeCode(code, language), [code, language]);
  let offset = 0;
  return (
    <div className="code-window">
      {filename && (
        <div className="code-chrome">
          <span className="code-file">
            <IconFile />
            {filename}
          </span>
          <span className="code-language">
            {label ??
              (language === "cpp" ? "C++20" : getLanguageLabel(language))}
          </span>
        </div>
      )}
      <div
        className="code-scroll"
        aria-label={typedText === undefined ? "Code example" : "Typing target"}
      >
        <pre className="code-lines">
          <code>
            {lines.map((line, row) => {
              const start = offset;
              offset += line.length + 1;
              const cursor = typedText?.length;
              const active =
                cursor !== undefined &&
                cursor >= start &&
                cursor <= start + line.length &&
                !complete;
              return (
                <span
                  className={`code-line${active ? " active-line" : ""}`}
                  key={row}
                >
                  <span className="line-number" aria-hidden="true">
                    {row + 1}
                  </span>
                  <span className="line-content">
                    {line.map((char, column) => {
                      const index = start + column;
                      const isCursor = index === cursor && !complete;
                      return (
                        <span
                          key={column}
                          data-cursor={isCursor || undefined}
                          className={`syntax-${char.kind}${typedText !== undefined && index < typedText.length ? " char-typed" : ""}${isCursor ? " char-cursor" : ""}${errorIndex === index ? " char-error" : ""}`}
                        >
                          {char.char}
                        </span>
                      );
                    })}
                    {active && cursor === start + line.length && (
                      <span
                        data-cursor="true"
                        className={`newline-cursor${errorIndex === cursor ? " char-error" : ""}`}
                        aria-hidden="true"
                      >
                        ↵
                      </span>
                    )}
                    {line.length === 0 && !active ? " " : ""}
                  </span>
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}

function IconFile() {
  return (
    <span className="file-icon" aria-hidden="true">
      {"{}"}
    </span>
  );
}
