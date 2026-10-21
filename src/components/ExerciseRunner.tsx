import { useRef, useState, type KeyboardEvent } from "react";
import { lessons } from "../data/lessons";
import { checkExercise, type Exercise } from "../data/scenarios";
import { LANGUAGE_META } from "../lib/languages";
import type { Attempt } from "../lib/progress";
import { CodeBlock } from "./CodeBlock";
import { RecallChallenge } from "./Challenges";
import { Icon } from "./Icons";
export const MODE_LABELS = {
  predict: "Predict the output",
  repair: "Repair the bug",
  recall: "Recall the pattern",
};
type Props = {
  exercise: Exercise;
  onResult: (attempt: Attempt) => void;
  onNext: () => void;
  nextLabel?: string;
};
export function ExerciseRunner(props: Props) {
  const lesson = lessons.find((l) => l.id === props.exercise.id);
  return lesson ? (
    <RecallChallenge
      lesson={lesson}
      onResult={props.onResult}
      onNext={props.onNext}
      nextLabel={props.nextLabel}
    />
  ) : (
    <ScenarioExercise {...props} />
  );
}
function ScenarioExercise({
  exercise: e,
  onResult,
  onNext,
  nextLabel = "Next exercise",
}: Props) {
  const [answer, setAnswer] = useState(e.starter);
  const [checks, setChecks] = useState(0);
  const [last, setLast] = useState<string | null>(null);
  const [passed, setPassed] = useState(false);
  const [assisted, setAssisted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState("");
  const started = useRef<number | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  function result(success: boolean, tries: number): Attempt {
    const at = Date.now();
    return {
      lessonId: e.id,
      mode: e.kind,
      accuracy: success ? 100 / tries : 0,
      wpm: 0,
      typos: success ? tries - 1 : tries,
      durationMs: at - (started.current ?? at),
      assisted,
      passed: success,
      at,
    };
  }
  function check() {
    if (!answer.trim() || last === answer || passed) return;
    const success = checkExercise(e, answer);
    setChecks(checks + 1);
    setLast(answer);
    setPassed(success);
    setFeedback(
      success
        ? assisted
          ? "Correct. Completed with assistance."
          : "Correct."
        : e.kind === "predict"
          ? "Incorrect output. Trace the variable values and check the loop boundaries."
          : "Check the requested change and keep the surrounding code. Formatting differences are accepted.",
    );
    onResult(result(success, checks + 1));
  }
  function keydown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      check();
    }
    if (event.key === "Tab" && !event.shiftKey && !passed) {
      event.preventDefault();
      const el = event.currentTarget;
      const start = el.selectionStart;
      setAnswer(
        answer.slice(0, start) + "    " + answer.slice(el.selectionEnd),
      );
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 4;
      });
    }
    if (event.key === "Escape") input.current?.blur();
  }
  return (
    <div className="scenario-exercise">
      <div className="exercise-intro">
        <span className="eyebrow accent">{MODE_LABELS[e.kind]}</span>
        <h2>{e.prompt}</h2>
        <p>{e.context}</p>
      </div>
      {e.kind === "predict" ? (
        <>
          <CodeBlock
            code={e.code}
            language={e.language}
            filename={`trace.${LANGUAGE_META[e.language].extension}`}
          />
          <fieldset className="output-choices">
            <legend>Choose the exact output</legend>
            {e.choices?.map((choice, i) => (
              <label
                key={choice}
                className={`output-choice${answer === choice ? " chosen" : ""}`}
              >
                <input
                  type="radio"
                  name={`output-${e.id}`}
                  value={choice}
                  checked={answer === choice}
                  disabled={passed}
                  onChange={() => {
                    started.current ??= Date.now();
                    setAnswer(choice);
                    setFeedback("");
                  }}
                />
                <span className="choice-index">
                  {String.fromCharCode(65 + i)}
                </span>
                <code>{choice}</code>
              </label>
            ))}
          </fieldset>
        </>
      ) : (
        <div className="code-window">
          <div className="code-chrome">
            <span className="code-file">
              {e.kind === "repair" ? "repair" : "answer"}.
              {LANGUAGE_META[e.language].extension}
            </span>
            <span className="code-language">
              {LANGUAGE_META[e.language].label}
            </span>
          </div>
          <textarea
            ref={input}
            className="recall-input repair-input"
            aria-label={
              e.kind === "repair" ? "Your code repair" : "Your recall answer"
            }
            value={answer}
            readOnly={passed}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            placeholder="// Write the requested code"
            onKeyDown={keydown}
            onChange={(event) => {
              started.current ??= Date.now();
              setAnswer(event.target.value);
              setFeedback("");
            }}
          />
          <div className="editor-status">
            <span>
              {e.kind === "repair"
                ? "Edit the bug; keep the rest"
                : "Write from memory"}
            </span>
            <span>
              <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to check · <kbd>Esc</kbd>{" "}
              releases focus
            </span>
          </div>
        </div>
      )}
      {feedback && (
        <div
          role="status"
          className={`answer-feedback${passed ? " good" : ""}`}
        >
          <strong>{feedback}</strong>
          {passed && <p>{e.explanation}</p>}
        </div>
      )}
      {assisted && (
        <div className="hint-box">
          <span className="eyebrow">Hint</span>
          <p>{e.hint}</p>
          {revealed &&
            (e.kind === "predict" ? (
              <pre>{e.solution}</pre>
            ) : (
              <CodeBlock code={e.solution} language={e.language} />
            ))}
        </div>
      )}
      <div className="exercise-actions">
        <div className="inline-actions">
          <button
            className="button button-quiet"
            disabled={passed || assisted}
            onClick={() => setAssisted(true)}
          >
            Hint
          </button>
          <button
            className="button button-quiet"
            disabled={passed || revealed}
            onClick={() => {
              setAssisted(true);
              setRevealed(true);
            }}
          >
            Show answer
          </button>
        </div>
        {passed ? (
          <button className="button button-primary" onClick={onNext}>
            {nextLabel}
            <Icon name="arrow" size={16} />
          </button>
        ) : (
          <button
            className="button button-primary"
            onClick={check}
            disabled={!answer.trim() || answer === last}
          >
            Check answer
            <Icon name="check" size={16} />
          </button>
        )}
      </div>
      <div className="round-footnote">
        <p className="validation-note">
          {e.kind === "predict"
            ? "Trace it mentally. No code execution needed."
            : "Checks a curated solution pattern; this is not compilation or a general test runner."}
        </p>
        {!passed && (
          <button
            className="text-link"
            onClick={() => {
              onResult(result(false, checks + 1));
              onNext();
            }}
          >
            Skip exercise <Icon name="arrow" size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
