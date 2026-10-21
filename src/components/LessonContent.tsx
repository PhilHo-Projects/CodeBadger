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
          <strong>Common mistake</strong>
          <p>{lesson.pitfall}</p>
        </div>
      </div>
      <div className="exercise-actions">
        <button className="button button-primary" onClick={onNext}>
          Start typing exercise
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
  if (stage === "fill" || stage === "recall") return null;
  return (
    <aside className="field-notes">
      <div className="notes-paper">
        <div className="notes-top">
          <span className="notes-label">Language notes</span>
          <span>Lesson {String(lessonIndex + 1).padStart(2, "0")}</span>
        </div>
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
