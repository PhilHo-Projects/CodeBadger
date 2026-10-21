import { useEffect, useRef, useState } from "react";
import type { Exercise } from "../data/scenarios";
import { LANGUAGE_META } from "../lib/languages";
import type { Attempt } from "../lib/progress";
import { ExerciseRunner, MODE_LABELS } from "./ExerciseRunner";
import { Icon } from "./Icons";
export function PracticeSession({
  exercises,
  title,
  onResult,
  onExit,
  onAgain,
}: {
  exercises: Exercise[];
  title: string;
  onResult: (a: Attempt) => void;
  onExit: () => void;
  onAgain: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<string, Attempt>>({});
  const done = index >= exercises.length;
  const passed = Object.values(results).filter((a) => a.passed).length;
  const unaided = Object.values(results).filter(
    (a) => a.passed && !a.assisted,
  ).length;
  const current = exercises[index];
  const round = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (index > 0) {
      round.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [index]);
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>{done ? "Session results" : title}</h1>
          {done && <p>Incorrect and skipped exercises are due for review.</p>}
        </div>
        <button className="button button-quiet" onClick={onExit}>
          Back to practice
        </button>
      </div>
      {done ? (
        <div className="panel warmup-summary">
          <span className="large-check">
            <Icon name="check" size={30} />
          </span>
          <h2>
            {passed} of {exercises.length} exercises completed.
          </h2>
          <p>
            {unaided} unaided · {passed - unaided} guided ·{" "}
            {exercises.length - passed} to revisit
          </p>
          <div className="session-results">
            {exercises.map((e) => {
              const a = results[e.id];
              return (
                <div key={e.id}>
                  <span>
                    {LANGUAGE_META[e.language].short} · {e.title}
                    <small className="result-mode">{MODE_LABELS[e.kind]}</small>
                  </span>
                  <span
                    className={
                      a?.passed && !a.assisted ? "text-success" : "muted"
                    }
                  >
                    {a?.passed
                      ? a.assisted
                        ? "Guided"
                        : "Unaided"
                      : "Revisit"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="inline-actions">
            <button className="button button-secondary" onClick={onExit}>
              Back to practice
            </button>
            <button className="button button-primary" onClick={onAgain}>
              Another session
              <Icon name="arrow" size={16} />
            </button>
          </div>
        </div>
      ) : (
        current && (
          <div className="session-layout">
            <aside className="session-outline">
              <span className="eyebrow">
                SESSION / {exercises.length} EXERCISES
              </span>
              {exercises.map((e, i) => (
                <div
                  className={`session-outline-item${i === index ? " current" : ""}${i < index ? " done" : ""}`}
                  key={e.id}
                >
                  <span>
                    {i < index ? (
                      <Icon name="check" size={13} />
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                  </span>
                  <div>
                    <strong>{MODE_LABELS[e.kind]}</strong>
                    <small>
                      {LANGUAGE_META[e.language].label} · {e.title}
                    </small>
                  </div>
                </div>
              ))}
              <p>
                Attempts with hints are recorded as assisted. Unaided answers
                receive longer review intervals.
              </p>
            </aside>
            <div className="panel session-panel" ref={round} tabIndex={-1}>
              <div className="section-heading">
                <span className="eyebrow">
                  EXERCISE {index + 1} OF {exercises.length}
                </span>
                <span
                  className="language-pill"
                  style={{ color: LANGUAGE_META[current.language].color }}
                >
                  {LANGUAGE_META[current.language].label}
                </span>
              </div>
              <ExerciseRunner
                key={current.id}
                exercise={current}
                onResult={(a) => {
                  onResult(a);
                  setResults((r) => ({ ...r, [a.lessonId]: a }));
                }}
                onNext={() => setIndex((i) => i + 1)}
                nextLabel={
                  index + 1 === exercises.length
                    ? "Finish session"
                    : "Next exercise"
                }
              />
            </div>
          </div>
        )
      )}
    </>
  );
}
