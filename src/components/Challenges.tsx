import { useRef, useState, type KeyboardEvent } from "react";
import { checkGap, checkRecall, type Lesson } from "../lib/learning";
import type { Attempt } from "../lib/progress";
import { CodeBlock } from "./CodeBlock";
import { Icon } from "./Icons";
import { lessonFilename, LANGUAGE_META } from "../lib/languages";

type Props = {
  lesson: Lesson;
  onResult: (attempt: Attempt) => void;
  onNext: () => void;
  nextLabel?: string;
};

export function GapChallenge({ lesson, onResult, onNext }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [assisted, setAssisted] = useState(false);
  const [passed, setPassed] = useState(false);
  const startedAt = useRef<number | null>(null);
  const parts = lesson.gapCode.split(/(\[\[\w+\]\])/);
  const correct = lesson.gaps.filter((gap) =>
    checkGap(answers[gap.id] ?? "", gap.answers),
  );

  function check() {
    const success = correct.length === lesson.gaps.length;
    setChecked(true);
    setPassed(success);
    onResult({
      lessonId: lesson.id,
      mode: "fill",
      accuracy: (correct.length / lesson.gaps.length) * 100,
      wpm: 0,
      typos: lesson.gaps.length - correct.length,
      durationMs: Math.max(0, Date.now() - (startedAt.current ?? Date.now())),
      assisted,
      passed: success,
      at: Date.now(),
    });
  }

  return (
    <div>
      <div className="exercise-intro">
        <h2>Complete the missing code.</h2>
        <p>Enter each missing value, keyword, or expression.</p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!passed) check();
        }}
      >
        <div className="code-window">
          <div className="code-chrome">
            <span className="code-file">
              <span className="file-icon">{"{}"}</span>
              {lessonFilename(lesson.id, lesson.language)}
            </span>
            <span className="code-language">Fill the gaps</span>
          </div>
          <pre className="gap-code">
            <code>
              {parts.map((part, index) => {
                const id = /^\[\[(\w+)\]\]$/.exec(part)?.[1];
                if (!id) return <span key={index}>{part}</span>;
                const gap = lesson.gaps.find((entry) => entry.id === id)!;
                const valid = checkGap(answers[id] ?? "", gap.answers);
                return (
                  <input
                    key={index}
                    aria-label={gap.label}
                    value={answers[id] ?? ""}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    disabled={passed}
                    size={Math.max(3, (answers[id] ?? "").length + 1)}
                    placeholder="…"
                    className={`gap-input${checked ? (valid ? " gap-correct" : " gap-wrong") : ""}`}
                    onChange={(event) => {
                      startedAt.current ??= Date.now();
                      setChecked(false);
                      setAnswers({ ...answers, [id]: event.target.value });
                    }}
                  />
                );
              })}
            </code>
          </pre>
        </div>
        {checked && (
          <div
            className={passed ? "answer-feedback good" : "answer-feedback"}
            role="status"
          >
            {passed
              ? "All gaps are correct."
              : `${correct.length} of ${lesson.gaps.length} correct. Check the highlighted gaps.`}
          </div>
        )}
        {assisted && (
          <div className="hint-box">
            {lesson.gaps.map((gap) => (
              <p key={gap.id}>
                <strong>{gap.label}:</strong> {gap.hint}
              </p>
            ))}
          </div>
        )}
        <div className="exercise-actions">
          <button
            type="button"
            className="button button-quiet"
            onClick={() => setAssisted(true)}
            disabled={assisted || passed}
          >
            Show hints
          </button>
          {passed ? (
            <button
              type="button"
              className="button button-primary"
              onClick={onNext}
            >
              Continue to recall
              <Icon name="arrow" size={16} />
            </button>
          ) : (
            <button type="submit" className="button button-primary">
              Check gaps
              <Icon name="check" size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export function RecallChallenge({
  lesson,
  onResult,
  onNext,
  nextLabel = "Next lesson",
}: Props) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [passed, setPassed] = useState(false);
  const [assisted, setAssisted] = useState(false);
  const [solution, setSolution] = useState(false);
  const [checks, setChecks] = useState(0);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const startedAt = useRef<number | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  function check() {
    if (!answer.trim() || answer === lastChecked || passed) return;
    const result = checkRecall(lesson.id, answer);
    const nextChecks = checks + 1;
    setChecks(nextChecks);
    setLastChecked(answer);
    setPassed(result.passed);
    setFeedback(
      result.passed && assisted
        ? "Correct. Completed with assistance."
        : result.message,
    );
    onResult({
      lessonId: lesson.id,
      mode: "recall",
      accuracy: result.passed ? 100 / nextChecks : 0,
      wpm: 0,
      typos: result.passed ? nextChecks - 1 : nextChecks,
      durationMs: Date.now() - (startedAt.current ?? Date.now()),
      assisted,
      passed: result.passed,
      at: Date.now(),
    });
  }
  function retry() {
    setAnswer("");
    setFeedback(null);
    setPassed(false);
    setAssisted(false);
    setSolution(false);
    setChecks(0);
    setLastChecked(null);
    startedAt.current = null;
    input.current?.focus();
  }
  function handleKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (passed) return;
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      check();
    }
    if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      const element = event.currentTarget;
      const start = element.selectionStart;
      const end = element.selectionEnd;
      setAnswer(answer.slice(0, start) + "    " + answer.slice(end));
      requestAnimationFrame(() => {
        element.selectionStart = element.selectionEnd = start + 4;
      });
    }
    if (event.key === "Escape") input.current?.blur();
  }

  return (
    <div>
      <div className="exercise-intro">
        <h2>{lesson.recall.prompt}</h2>
      </div>
      <p className="recall-context">{lesson.recall.context}</p>
      <div className="code-window">
        <div className="code-chrome">
          <span className="code-file">
            <span className="file-icon">{"{}"}</span>answer.
            {LANGUAGE_META[lesson.language].extension}
          </span>
          <span className="code-language">Recall</span>
        </div>
        <textarea
          ref={input}
          className="recall-input"
          aria-label="Your recall answer"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          placeholder={lesson.recall.placeholder}
          value={answer}
          readOnly={passed}
          onKeyDown={handleKey}
          onChange={(event) => {
            startedAt.current ??= Date.now();
            setAnswer(event.target.value);
            setFeedback(null);
          }}
        />
        <div className="editor-status">
          <span>Formatting variations accepted</span>
          <span>
            <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to check · <kbd>Esc</kbd>{" "}
            releases focus
          </span>
        </div>
      </div>
      {feedback && (
        <div
          className={`answer-feedback${passed ? " good" : ""}`}
          role="status"
        >
          <strong>{feedback}</strong>
          {passed && (
            <p>
              {assisted
                ? "Retry without hints or the revealed answer to mark this concept recalled."
                : lesson.recall.explanation}
            </p>
          )}
        </div>
      )}
      {assisted && (
        <div className="hint-box">
          <span className="eyebrow">Hint</span>
          <p>{lesson.recall.hint}</p>
          {solution && (
            <CodeBlock
              code={lesson.recall.solution}
              language={lesson.language}
            />
          )}
        </div>
      )}
      <div className="exercise-actions">
        <div className="inline-actions">
          <button
            className="button button-quiet"
            disabled={passed}
            onClick={() => setAssisted(true)}
          >
            Hint
          </button>
          <button
            className="button button-quiet"
            disabled={passed || solution}
            onClick={() => {
              setAssisted(true);
              setSolution(true);
            }}
          >
            Show answer
          </button>
        </div>
        {passed ? (
          <div className="inline-actions">
            <button className="button button-quiet" onClick={retry}>
              <Icon name="reset" size={15} />
              Try again
            </button>
            <button className="button button-primary" onClick={onNext}>
              {nextLabel}
              <Icon name="arrow" size={16} />
            </button>
          </div>
        ) : (
          <button
            className="button button-primary"
            disabled={!answer.trim() || answer === lastChecked}
            onClick={check}
          >
            Check answer
            <Icon name="arrow" size={16} />
          </button>
        )}
      </div>
      <p className="validation-note">
        Checks the requested syntax pattern and common alternatives. Your code
        is never executed or compiled.
      </p>
    </div>
  );
}
