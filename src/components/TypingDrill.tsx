import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  applyTypingInput,
  createTypingState,
  eraseTypingInput,
  getEnterInput,
  getTypingStats,
  nextIndent,
} from "../lib/typing";
import { formatElapsedMs } from "../lib/score";
import type { Language } from "../lib/types";
import { CodeBlock } from "./CodeBlock";
import { Icon } from "./Icons";

export type DrillResult = {
  accuracy: number;
  wpm: number;
  typos: number;
  durationMs: number;
};
type Props = {
  code: string;
  filename: string;
  language?: Language;
  onComplete?: (result: DrillResult) => void;
  onNext?: () => void;
  nextLabel?: string;
};

export function TypingDrill({
  code,
  filename,
  language = "cpp",
  onComplete,
  onNext,
  nextLabel = "Fill the gaps",
}: Props) {
  const [round, setRound] = useState(() => createTypingState(code));
  const [now, setNow] = useState(0);
  const [focused, setFocused] = useState(false);
  const [smartIndent, setSmartIndent] = useState(true);
  const input = useRef<HTMLTextAreaElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const reported = useRef(false);
  const completionCallback = useRef(onComplete);
  completionCallback.current = onComplete;
  const stats = getTypingStats(round, now);
  const complete = round.endedAt !== null;

  useEffect(() => {
    input.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (round.startedAt === null || complete) return;
    const timer = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(timer);
  }, [round.startedAt, complete]);
  useEffect(() => {
    if (round.errorIndex === null) return;
    const timer = window.setTimeout(
      () => setRound((current) => ({ ...current, errorIndex: null })),
      240,
    );
    return () => window.clearTimeout(timer);
  }, [round.errorIndex, round.typos]);
  useEffect(() => {
    if (focused && round.text.length)
      surface.current
        ?.querySelector('[data-cursor="true"]')
        ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [round.text.length, focused]);
  useEffect(() => {
    if (round.endedAt === null || reported.current) return;
    reported.current = true;
    const result = getTypingStats(round, round.endedAt);
    completionCallback.current?.({
      accuracy: result.accuracy,
      wpm: result.wpm,
      typos: round.typos,
      durationMs: result.elapsedMs,
    });
  }, [round]);

  function enter(text: string, count?: number) {
    const at = Date.now();
    setNow(at);
    setRound((current) => applyTypingInput(current, text, at, count));
  }
  function retry() {
    reported.current = false;
    setRound(createTypingState(code));
    setNow(0);
    input.current?.focus({ preventScroll: true });
  }
  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Escape") {
      input.current?.blur();
      return;
    }
    if (
      event.key === "Backspace" &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey
    ) {
      event.preventDefault();
      setRound(eraseTypingInput);
      return;
    }
    if (event.key === "Tab" && !event.shiftKey && !complete) {
      const spaces = nextIndent(code, round.text.length);
      if (spaces && !spaces.startsWith("\n")) {
        event.preventDefault();
        enter(spaces, 1);
      }
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      enter(getEnterInput(code, round.text.length, smartIndent), 1);
    }
  }

  return (
    <div className="typing-drill">
      <div className="drill-toolbar">
        <span className={`focus-status${focused ? " is-focused" : ""}`}>
          <i />
          {complete
            ? "Rep complete"
            : focused
              ? "Ready for your keystrokes"
              : "Click the code to focus"}
        </span>
        <div className="toolbar-actions">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={smartIndent}
              onChange={(event) => setSmartIndent(event.target.checked)}
            />
            Auto-indent
          </label>
          <button
            className="icon-button"
            onClick={retry}
            title="Restart typing drill"
            aria-label="Restart typing drill"
          >
            <Icon name="reset" size={16} />
          </button>
        </div>
      </div>
      <div
        className={`typing-surface${focused ? " is-focused" : ""}`}
        ref={surface}
      >
        <textarea
          ref={input}
          value={round.text}
          aria-label="Typing input"
          aria-describedby={complete ? undefined : "typing-help"}
          className="typing-input"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          readOnly={complete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          onChange={(event) => {
            const value = event.target.value;
            if (value.startsWith(round.text))
              enter(value.slice(round.text.length));
            else if (round.text.startsWith(value)) {
              const removed = round.text.length - value.length;
              setRound((current) => {
                let next = current;
                for (let index = 0; index < removed; index++)
                  next = eraseTypingInput(next);
                return next;
              });
            }
          }}
          onSelect={() => {
            const element = input.current;
            if (element && element.selectionStart !== element.value.length)
              element.setSelectionRange(
                element.value.length,
                element.value.length,
              );
          }}
          onPaste={(event) => event.preventDefault()}
          onDrop={(event) => event.preventDefault()}
        />
        <div onClick={() => input.current?.focus({ preventScroll: true })}>
          <CodeBlock
            code={code}
            filename={filename}
            language={language}
            typedText={round.text}
            errorIndex={round.errorIndex}
            complete={complete}
          />
        </div>
      </div>
      <div
        className="drill-progress"
        role="progressbar"
        aria-label="Typing progress"
        aria-valuemin={0}
        aria-valuemax={code.length}
        aria-valuenow={round.text.length}
      >
        <span
          style={{
            width: `${code.length ? (round.text.length / code.length) * 100 : 0}%`,
          }}
        />
      </div>
      <div className="live-stats">
        <div>
          <strong>{stats.wpm.toFixed(0)}</strong>
          <span>WPM</span>
        </div>
        <div>
          <strong>
            {stats.accuracy.toFixed(0)}
            <small>%</small>
          </strong>
          <span>Accuracy</span>
        </div>
        <div>
          <strong>{round.typos}</strong>
          <span>Mistakes</span>
        </div>
        <div>
          <strong>{formatElapsedMs(stats.elapsedMs)}</strong>
          <span>Time</span>
        </div>
        <span className="character-count">
          {round.text.length} / {code.length} chars
        </span>
      </div>
      {complete ? (
        <div className="success-banner" role="status">
          <span className="success-icon">
            <Icon name="check" />
          </span>
          <div>
            <strong>
              {round.typos === 0
                ? "Clean rep. Nicely done."
                : "Another rep in the bank."}
            </strong>
            <p>
              {stats.accuracy.toFixed(0)}% accuracy · {stats.wpm.toFixed(0)} WPM
              · Try recalling the pattern next.
            </p>
          </div>
          {onNext && (
            <button className="button button-primary" onClick={onNext}>
              {nextLabel}
              <Icon name="arrow" size={16} />
            </button>
          )}
        </div>
      ) : (
        <p className="keyboard-help" id="typing-help">
          <span>
            <kbd>Tab</kbd> indent
          </span>
          <span>
            <kbd>Esc</kbd> release focus
          </span>
          <span>Wrong keys stop at the cursor. Paste is off.</span>
        </p>
      )}
    </div>
  );
}
