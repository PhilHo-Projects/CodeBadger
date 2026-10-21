import { tokenizeCode } from "../lib/tokenize";
import type { Language, SnippetLineHint } from "../lib/types";

type EditorWindowProps = {
  code: string;
  typedText: string;
  language: Language;
  filename: string;
  title: string;
  description: string;
  lineHints?: SnippetLineHint[];
  isComplete: boolean;
  errorIndex: number | null;
  onRequestFocus: () => void;
};

const SYNTAX_CLASS_NAMES = {
  plain: "text-text-main",
  keyword: "text-syntax-keyword",
  type: "text-syntax-type",
  string: "text-syntax-string",
  number: "text-syntax-number",
  function: "text-syntax-function",
  comment: "text-text-muted"
} as const;

function displayChar(char: string) {
  return char === " " ? "\u00A0" : char;
}

export function EditorWindow(props: EditorWindowProps) {
  const lines = tokenizeCode(props.code, props.language);
  const cursorIndex = props.typedText.length;
  const totalCharacters = props.code.length;
  const lineHintsByLine = props.lineHints?.reduce<Map<number, SnippetLineHint[]>>((hintMap, lineHint) => {
    const hints = hintMap.get(lineHint.line) ?? [];
    hints.push(lineHint);
    hintMap.set(lineHint.line, hints);
    return hintMap;
  }, new Map());
  let globalIndex = 0;

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-editor shadow-editor">
      <div className="border-b border-white/8 bg-[#141a28] px-4 py-3">
        <div className="flex flex-col gap-2">
          <div className="rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs text-text-muted">
            training/{props.filename}
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-text-main">{props.title}</h2>
            <p className="text-sm leading-6 text-text-muted">{props.description}</p>
          </div>
        </div>
      </div>

      <div
        className="group relative cursor-text overflow-x-auto px-0 py-4"
        role="presentation"
        onMouseDown={(event) => event.preventDefault()}
        onClick={props.onRequestFocus}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(73,189,255,0.08),transparent_40%)] opacity-70" />
        <div className="relative min-w-full px-4 pb-4">
          {lines.map((line, lineIndex) => {
            const lineStart = globalIndex;
            const lineEnd = lineStart + line.length;
            const hasNewline = lineIndex < lines.length - 1;
            const cursorInLine =
              cursorIndex >= lineStart &&
              (cursorIndex <= lineEnd || (!hasNewline && cursorIndex === totalCharacters));
            const rowClassName = cursorInLine && !props.isComplete ? "bg-white/[0.035]" : "";

            globalIndex = lineEnd + (hasNewline ? 1 : 0);

            return (
              <div key={`${props.filename}-${lineIndex}`} className="space-y-1">
                {(lineHintsByLine?.get(lineIndex + 1) ?? []).map((lineHint, hintIndex) => (
                  <div
                    key={`${props.filename}-hint-${lineIndex + 1}-${hintIndex}`}
                    className="grid grid-cols-[56px_minmax(0,1fr)] gap-4 rounded-2xl px-2 py-1 text-[13px] leading-6"
                  >
                    <div className="select-none pr-3 text-right font-code text-state-correct/55">//</div>
                    <div className="font-code text-state-correct/85">{lineHint.text}</div>
                  </div>
                ))}

                <div
                  className={`grid grid-cols-[56px_minmax(0,1fr)] gap-4 rounded-2xl px-2 py-1.5 ${rowClassName}`}
                >
                  <div className="select-none border-r border-white/6 pr-3 text-right font-code text-sm text-text-muted">
                    {lineIndex + 1}
                  </div>

                  <div className="min-h-[1.6rem] whitespace-pre font-code text-[15px] leading-7 text-text-main">
                    {line.map((tokenChar, charIndex) => {
                      const absoluteIndex = lineStart + charIndex;
                      const isCurrent = !props.isComplete && absoluteIndex === cursorIndex;
                      const isAccepted = !props.isComplete && absoluteIndex < props.typedText.length;
                      const isError = !props.isComplete && props.errorIndex === absoluteIndex;

                      const statusClassName = props.isComplete
                        ? ""
                        : isError
                          ? "rounded-[6px] bg-state-error/35 text-white"
                          : isAccepted
                            ? "rounded-[6px] bg-state-correct/12 shadow-[0_0_0_1px_rgba(74,210,149,0.12)_inset]"
                            : isCurrent
                              ? "rounded-[6px] bg-accent/18 shadow-[0_0_0_1px_rgba(73,189,255,0.48)_inset]"
                              : "";

                      return (
                        <span
                          key={`${props.filename}-${absoluteIndex}`}
                          className={`${SYNTAX_CLASS_NAMES[tokenChar.kind]} ${statusClassName}`}
                        >
                          {displayChar(tokenChar.char)}
                        </span>
                      );
                    })}

                    {hasNewline && !props.isComplete && cursorIndex === lineEnd ? (
                      <span
                        className={
                          props.errorIndex === lineEnd
                            ? "ml-1 rounded-md border border-state-error/40 bg-state-error/25 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-white"
                            : "ml-1 rounded-md border border-accent/40 bg-accent/18 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-accent"
                        }
                      >
                        enter
                      </span>
                    ) : null}

                    {!props.isComplete && !hasNewline && cursorIndex === totalCharacters ? (
                      <span className="ml-1 inline-block h-5 w-1 rounded-full bg-accent shadow-[0_0_14px_rgba(73,189,255,0.55)]" />
                    ) : null}

                    {line.length === 0 && cursorInLine && !props.isComplete ? (
                      <span className="inline-block h-5 w-1 rounded-full bg-accent shadow-[0_0_14px_rgba(73,189,255,0.55)]" />
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
