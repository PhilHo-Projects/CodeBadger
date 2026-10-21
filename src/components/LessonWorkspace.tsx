import { lessonsForLanguage } from "../data/lessons";
import { STAGES, STAGE_LABELS, type Lesson, type Stage } from "../lib/learning";
import { LANGUAGE_META, lessonFilename } from "../lib/languages";
import type { Attempt, Progress } from "../lib/progress";
import { LearnStep, FieldNotes } from "./LessonContent";
import { GapChallenge, RecallChallenge } from "./Challenges";
import { TypingDrill } from "./TypingDrill";
import { Icon } from "./Icons";
export function LessonWorkspace({
  lesson,
  stage,
  progress,
  onStage,
  onLearn,
  onResult,
  onChoose,
  onFinish,
}: {
  lesson: Lesson;
  stage: Stage;
  progress: Progress;
  onStage: (s: Stage) => void;
  onLearn: () => void;
  onResult: (a: Attempt) => void;
  onChoose: (id: string) => void;
  onFinish: () => void;
}) {
  const track = lessonsForLanguage(lesson.language);
  const index = track.findIndex((l) => l.id === lesson.id);
  const completed = progress.stages[lesson.id] ?? [];
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow accent">
            LESSON {String(index + 1).padStart(2, "0")} / {lesson.tag}
          </span>
          <h1>{lesson.title}</h1>
          <p>Understand the pattern. Get a few reps. Make it yours.</p>
        </div>
        <div className="lesson-duration">
          <span
            className="language-chip"
            style={{ color: LANGUAGE_META[lesson.language].color }}
          >
            {LANGUAGE_META[lesson.language].label}
          </span>
          <span>~{lesson.minutes} min</span>
        </div>
      </div>
      <label className="mobile-lesson-select select-label">
        Choose a lesson
        <select value={lesson.id} onChange={(e) => onChoose(e.target.value)}>
          {track.map((l, i) => (
            <option key={l.id} value={l.id}>
              {i + 1}. {l.subtitle}
            </option>
          ))}
        </select>
      </label>
      <div className="lesson-grid">
        <section
          className="lesson-workspace"
          aria-label={`${lesson.subtitle} practice`}
        >
          <nav className="stage-tabs" aria-label="Lesson stages">
            {STAGES.map((s, i) => (
              <button
                key={s}
                className={`stage-tab${s === stage ? " current" : ""}`}
                onClick={() => onStage(s)}
                aria-current={s === stage ? "step" : undefined}
              >
                <span
                  className={`stage-index${completed.includes(s) ? " done" : ""}`}
                >
                  {completed.includes(s) ? (
                    <Icon name="check" size={12} />
                  ) : (
                    i + 1
                  )}
                </span>
                {STAGE_LABELS[s]}
              </button>
            ))}
          </nav>
          <div className="lesson-body" key={`${lesson.id}:${stage}`}>
            {stage === "learn" && (
              <LearnStep lesson={lesson} onNext={onLearn} />
            )}{" "}
            {stage === "type" && (
              <>
                <div className="exercise-intro">
                  <span className="eyebrow">Build the muscle memory</span>
                  <h2>Let your fingers do a lap.</h2>
                  <p>Type the code below. Accuracy comes first.</p>
                </div>
                <TypingDrill
                  language={lesson.language}
                  code={lesson.code}
                  filename={lessonFilename(lesson.id, lesson.language)}
                  onComplete={(r) =>
                    onResult({
                      ...r,
                      lessonId: lesson.id,
                      mode: "type",
                      passed: true,
                      assisted: false,
                      at: Date.now(),
                    })
                  }
                  onNext={() => onStage("fill")}
                />
              </>
            )}
            {stage === "fill" && (
              <GapChallenge
                lesson={lesson}
                onResult={onResult}
                onNext={() => onStage("recall")}
              />
            )}{" "}
            {stage === "recall" && (
              <RecallChallenge
                lesson={lesson}
                onResult={onResult}
                onNext={() =>
                  index + 1 < track.length
                    ? onChoose(track[index + 1].id)
                    : onFinish()
                }
                nextLabel={
                  index + 1 === track.length
                    ? "See your progress"
                    : "Next lesson"
                }
              />
            )}
          </div>
        </section>
        <FieldNotes
          lesson={lesson}
          lessonIndex={index}
          stage={stage}
          completed={completed}
        />
      </div>
      <div className="lesson-footer">
        <span>
          <span className="tiny-badger">//</span> Small reps beat a giant cram
          session.
        </span>
        <span className="muted small-text">
          {index + 1} of {track.length} · {LANGUAGE_META[lesson.language].label}
        </span>
      </div>
    </>
  );
}
