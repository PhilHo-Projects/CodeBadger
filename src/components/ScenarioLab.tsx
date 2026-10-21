import { useState } from "react";
import { scenarios, type Scenario } from "../data/scenarios";
import {
  LANGUAGE_META,
  TRACK_LANGUAGES,
  type TrackLanguage,
} from "../lib/languages";
import type { Progress } from "../lib/progress";
import { Icon } from "./Icons";
export function ScenarioLab({
  language,
  progress,
  onStart,
}: {
  language: TrackLanguage;
  progress: Progress;
  onStart: (scenario: Scenario) => void;
}) {
  const [scope, setScope] = useState<TrackLanguage | "all">(language);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const filtered = scenarios.filter(
    (s) =>
      (scope === "all" || s.language === scope) &&
      (difficulty === "all" || s.difficulty === difficulty) &&
      `${s.title} ${s.topic} ${s.description} ${LANGUAGE_META[s.language].label}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow accent">THE SCENARIO LAB</span>
          <h1>Put the pieces together.</h1>
          <p>Real little problems. Three ways to practice each one.</p>
        </div>
        <span className="small-badge">24 scenarios · 72 rounds</span>
      </div>
      <div className="scenario-toolbar panel">
        <label className="select-label search-label">
          Find a scenario
          <input
            type="search"
            value={query}
            placeholder="Try maps, boundaries, binary search…"
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="select-label">
          Scenario language
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as TrackLanguage | "all")}
          >
            <option value="all">All languages</option>
            {TRACK_LANGUAGES.map((l) => (
              <option value={l} key={l}>
                {LANGUAGE_META[l].label}
              </option>
            ))}
          </select>
        </label>
        <label className="select-label">
          Level
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="all">All levels</option>
            <option>Foundations</option>
            <option>Intermediate</option>
          </select>
        </label>
      </div>
      <div className="section-heading scenario-count">
        <span className="muted small-text">
          {filtered.length} scenarios · each about 6 minutes
        </span>
        <span className="eyebrow">PREDICT → REPAIR → RECALL</span>
      </div>
      <div className="scenario-grid">
        {filtered.map((s) => {
          const done = s.exercises.filter(
            (e) => progress.reviews[e.id]?.streak > 0,
          ).length;
          return (
            <button
              className="scenario-card panel"
              key={s.id}
              onClick={() => onStart(s)}
            >
              <div className="section-heading">
                <span
                  className="language-pill"
                  style={{ color: LANGUAGE_META[s.language].color }}
                >
                  {LANGUAGE_META[s.language].label}
                </span>
                <span className="eyebrow">{s.difficulty}</span>
              </div>
              <h2>{s.title}</h2>
              <p>{s.description}</p>
              <div className="scenario-card-footer">
                <span>{s.topic}</span>
                <span>
                  {done ? `${done}/3 unaided` : "Start scenario"}
                  <Icon name="arrow" size={14} />
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {!filtered.length && (
        <div className="empty-state panel">
          <h2>No matching scenarios.</h2>
          <p>Try a broader topic or another language.</p>
          <button
            className="button button-secondary"
            onClick={() => {
              setQuery("");
              setDifficulty("all");
              setScope("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
