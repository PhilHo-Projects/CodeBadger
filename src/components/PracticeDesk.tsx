import { useState } from "react";
import { lessons, lessonsForLanguage } from "../data/lessons";
import { scenarios, allExercises } from "../data/scenarios";
import { dueReviews, type Progress } from "../lib/progress";
import {
  LANGUAGE_META,
  TRACK_LANGUAGES,
  type TrackLanguage,
} from "../lib/languages";
import type { SessionOptions } from "../lib/sessions";
import { Icon } from "./Icons";
export function SessionBuilder({
  language,
  onStart,
}: {
  language: TrackLanguage;
  onStart: (options: SessionOptions) => void;
}) {
  const [scope, setScope] = useState<SessionOptions["language"]>(language);
  const [count, setCount] = useState<SessionOptions["count"]>(3);
  const [mode, setMode] = useState<SessionOptions["mode"]>("mixed");
  const available =
    mode === "predict" || mode === "repair"
      ? allExercises.filter(
          (e) => e.kind === mode && (scope === "all" || e.language === scope),
        ).length
      : 100;
  return (
    <section className="session-builder panel">
      <div className="section-heading">
        <h2>Create a session</h2>
        <Icon name="bolt" size={20} />
      </div>
      <p>
        Due reviews and new exercises are selected before completed exercises.
      </p>
      <div className="builder-fields">
        <label className="select-label">
          Language
          <select
            value={scope}
            onChange={(e) =>
              setScope(e.target.value as SessionOptions["language"])
            }
          >
            {TRACK_LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {LANGUAGE_META[l].label}
              </option>
            ))}
            <option value="all">All languages</option>
          </select>
        </label>
        <label className="select-label">
          Session size
          <select
            value={count}
            onChange={(e) =>
              setCount(Number(e.target.value) as SessionOptions["count"])
            }
          >
            <option value={3}>3 exercises</option>
            <option value={6}>6 exercises</option>
            <option value={10}>10 exercises</option>
          </select>
        </label>
        <label className="select-label">
          Practice mode
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as SessionOptions["mode"])}
          >
            <option value="mixed">Mixed practice</option>
            <option value="recall">Recall only</option>
            <option value="predict">Predict output</option>
            <option value="repair">Repair bugs</option>
          </select>
        </label>
      </div>
      <button
        className="button button-primary"
        onClick={() => onStart({ language: scope, count, mode })}
      >
        Start session
        <Icon name="arrow" size={16} />
      </button>
      {available < count && (
        <span className="builder-note">
          {available} exercises available for this selection; the session will
          include all {available}.
        </span>
      )}
    </section>
  );
}
export function PracticeDesk({
  progress,
  now,
  language,
  onTrack,
  onResume,
  onStart,
  onScenarios,
}: {
  progress: Progress;
  now: number;
  language: TrackLanguage;
  onTrack: (language: TrackLanguage) => void;
  onResume: () => void;
  onStart: (options: SessionOptions) => void;
  onScenarios: () => void;
}) {
  const recalled = lessons.filter((l) =>
    progress.stages[l.id]?.includes("recall"),
  ).length;
  const due = dueReviews(progress, now).length;
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Practice</h1>
        </div>
        <span className="small-badge">
          {recalled}/{lessons.length} concepts recalled
        </span>
      </div>
      <div className="desk-grid">
        <div className="desk-left">
          <div className="section-heading">
            <h2>Language tracks</h2>
            <span className="eyebrow">4 TRACKS · 48 LESSONS</span>
          </div>
          <div className="track-grid">
            {TRACK_LANGUAGES.map((l) => {
              const track = lessonsForLanguage(l);
              const done = track.filter((x) =>
                progress.stages[x.id]?.includes("recall"),
              ).length;
              return (
                <button
                  key={l}
                  className="track-card"
                  style={
                    {
                      "--track-color": LANGUAGE_META[l].color,
                    } as React.CSSProperties
                  }
                  onClick={() => onTrack(l)}
                >
                  <div className="track-card-top">
                    <span className="track-monogram">
                      {LANGUAGE_META[l].short}
                    </span>
                    <Icon name="arrow" size={17} />
                  </div>
                  <h3>{LANGUAGE_META[l].label}</h3>
                  <p>{LANGUAGE_META[l].description}</p>
                  <div className="track-card-bottom">
                    <span>12 lessons</span>
                    <span>{done}/12 recalled</span>
                  </div>
                  <div className="track-meter">
                    <i style={{ width: `${(done / 12) * 100}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
          <button className="resume-strip" onClick={onResume}>
            <span>
              <strong>Continue {LANGUAGE_META[language].label} lessons</strong>
            </span>
            <Icon name="arrow" size={19} />
          </button>
        </div>
        <SessionBuilder key={language} language={language} onStart={onStart} />
      </div>
      <div className="desk-bottom">
        <button className="scenario-teaser" onClick={onScenarios}>
          <h2>Scenarios</h2>
          <p>
            Practice filtering, counting, sets, loop boundaries, optional
            values, and binary search.
          </p>
          <span className="text-link">
            Explore {scenarios.length} scenarios
            <Icon name="arrow" size={16} />
          </span>
        </button>
        <div className="review-note notes-paper">
          <h2>
            {due} {due === 1 ? "review" : "reviews"} due
          </h2>
          <p>
            Unaided answers are scheduled for review after 1, 3, 7, and 14 days.
            Incorrect answers and attempts with hints are due immediately.
          </p>
        </div>
      </div>
    </>
  );
}
