import {
  STAGES,
  STAGE_LABELS as stageNames,
  type Lesson,
  type Stage,
} from "../lib/learning";
import { CodeBlock } from "./CodeBlock";
import { Icon } from "./Icons";
import { LANGUAGE_META, lessonFilename } from "../lib/languages";

export function LearnStep({
  lesson,
  onNext,
}: {
  lesson: Lesson;
  onNext: () => void;
}) {
  return (
    <div className="learn-step">
      <div className="exercise-intro">
        <span className="eyebrow">First, the idea</span>
        <h2>{lesson.subtitle}</h2>
        <p>{lesson.intro}</p>
      </div>
      <CodeBlock
        code={lesson.code}
        language={lesson.language}
        filename={lessonFilename(lesson.id, lesson.language)}
      />
      <details className="example-setup">
        <summary>Example environment</summary>
        <p>{LANGUAGE_META[lesson.language].setup}</p>
      </details>
      <div className="output-panel">
        <span className="eyebrow">Output</span>
        <pre>{lesson.output}</pre>
      </div>
      <div className="pitfall">
        <span aria-hidden="true">!</span>
        <div>
          <strong>Watch for this</strong>
          <p>{lesson.pitfall}</p>
        </div>
      </div>
      <div className="exercise-actions">
        <span className="muted small-text">
          Read it once. Then give it a go.
        </span>
        <button className="button button-primary" onClick={onNext}>
          Type this pattern
          <Icon name="arrow" size={16} />
        </button>
      </div>
    </div>
  );
}

export function FieldNotes({
  lesson,
  lessonIndex,
  stage,
  completed,
}: {
  lesson: Lesson;
  lessonIndex: number;
  stage: Stage;
  completed: Stage[];
}) {
  if (stage === "fill" || stage === "recall")
    return (
      <aside className="field-notes">
        <div className="closed-notes">
          <Icon name="book" size={24} />
          <span className="eyebrow" style={{ display: "block", marginTop: 19 }}>
            Notes closed
          </span>
          <h2>
            {stage === "recall"
              ? "You’ve seen it. Now trust your hands."
              : "A few pieces are yours to find."}
          </h2>
          <p>
            {stage === "recall"
              ? "The example is tucked away for this rep. Try recalling the shape before reaching for a hint."
              : "Use what you just practiced. Hints are there if you need a nudge."}
          </p>
          <p style={{ marginTop: 18 }}>
            Using a hint saves a guided rep. An unaided recall marks the concept
            learned.
          </p>
        </div>
      </aside>
    );
  return (
    <aside className="field-notes">
      <div className="notes-paper">
        <div className="notes-top">
          <span className="notes-label">THE FIELD NOTES</span>
          <span>No. {String(lessonIndex + 1).padStart(2, "0")}</span>
        </div>
        <h2>
          A pattern worth <br />
          keeping.
        </h2>
        <div className="notes-rule" />
        {lesson.points.map((point, index) => (
          <div className="note-point" key={point.title}>
            <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
            <div>
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </div>
          </div>
        ))}
        <div className="notes-bottom">
          <span>Read → repeat → remember.</span>
          <span aria-hidden="true">↳</span>
        </div>
      </div>
      <div className="practice-recipe">
        <span className="eyebrow">This lesson</span>
        {STAGES.map((item) => (
          <div className={item === stage ? "recipe-current" : ""} key={item}>
            <span>{stageNames[item]}</span>
            {completed.includes(item) ? (
              <Icon name="check" size={14} />
            ) : (
              <span className="recipe-dot" />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
