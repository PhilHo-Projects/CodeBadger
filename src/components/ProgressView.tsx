import { useRef, useState } from "react";
import { lessonsForLanguage } from "../data/lessons";
import { allExercises } from "../data/scenarios";
import { STAGES, STAGE_LABELS, type Stage } from "../lib/learning";
import { dueReviews, importProgress, type Progress } from "../lib/progress";
import { LANGUAGE_META, type TrackLanguage } from "../lib/languages";
import { Icon } from "./Icons";
import { LANGUAGES, type Language } from "../lib/types";

export function ProgressView({
  progress,
  now,
  language,
  onChoose,
  onWarmup,
  onImport,
}: {
  progress: Progress;
  now: number;
  language: TrackLanguage;
  onChoose: (id: string, stage?: Stage) => void;
  onWarmup: () => void;
  onImport: (p: Progress) => void;
}) {
  const [message, setMessage] = useState("");
  const [historyLanguage, setHistoryLanguage] = useState<Language | "all">(
    "all",
  );
  const input = useRef<HTMLInputElement>(null);
  const track = lessonsForLanguage(language);
  const attempts = progress.attempts.filter((a) =>
    a.lessonId.startsWith(`${language}:`),
  );
  const recalled = track.filter((l) =>
    progress.stages[l.id]?.includes("recall"),
  ).length;
  const typing = attempts.filter(
    (a) => a.mode === "type" || a.mode === "quick",
  );
  const accuracy = typing.length
    ? Math.round(typing.reduce((s, a) => s + a.accuracy, 0) / typing.length)
    : null;
  const due = dueReviews(progress, now, language);
  const history = progress.attempts.filter(
    (a) =>
      historyLanguage === "all" || a.lessonId.startsWith(`${historyLanguage}:`),
  );
  function exportBackup() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codebadger-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(
      "Backup exported. It includes all four tracks and your recent 500 attempts.",
    );
  }
  async function readBackup(file: File | undefined) {
    if (!file) return;
    if (file.size > 5_000_000) {
      setMessage(
        "Backup is too large (5 MB maximum). Your progress is unchanged.",
      );
      return;
    }
    try {
      const result = importProgress(progress, await file.text());
      if (result.ok) {
        onImport(result.progress);
        setMessage(
          `Backup merged: ${result.added} new attempts. Existing stages and reviews were kept.`,
        );
      } else setMessage(result.error);
    } catch {
      setMessage("Could not read that file. Your progress is unchanged.");
    }
  }
  const nameFor = (id: string) =>
    track.find((l) => l.id === id)?.subtitle ??
    allExercises.find((e) => e.id === id)?.title ??
    id.split(":").slice(1).join(" · ").replaceAll("-", " ");
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow accent">
            {LANGUAGE_META[language].label}
          </span>
          <h1>Progress</h1>
        </div>
        <button className="button button-primary" onClick={onWarmup}>
          <Icon name="bolt" size={16} />
          Practice this track
        </button>
      </div>
      <div className="progress-stats">
        <div>
          <span className="eyebrow">Concepts recalled</span>
          <strong>
            {recalled}
            <small> / {track.length}</small>
          </strong>
        </div>
        <div>
          <span className="eyebrow">Reviews due</span>
          <strong>{due.length}</strong>
        </div>
        <div>
          <span className="eyebrow">Typing accuracy</span>
          <strong>{accuracy === null ? "—" : `${accuracy}%`}</strong>
        </div>
        <div>
          <span className="eyebrow">Unaided completions</span>
          <strong>
            {
              attempts.filter(
                (a) =>
                  a.passed &&
                  !a.assisted &&
                  a.mode !== "type" &&
                  a.mode !== "quick",
              ).length
            }
          </strong>
        </div>
      </div>
      <div className="review-grid">
        <section className="panel concept-panel">
          <div className="section-heading">
            <h2>{LANGUAGE_META[language].label} foundations</h2>
            <span className="muted small-text">Learn → recall</span>
          </div>
          {track.map((l) => {
            const completed = progress.stages[l.id] ?? [];
            const review = progress.reviews[l.id];
            return (
              <button
                className="concept-row"
                key={l.id}
                onClick={() =>
                  onChoose(
                    l.id,
                    completed.includes("recall") ? "recall" : "learn",
                  )
                }
              >
                <span className="concept-name">
                  {l.subtitle}
                  <small className="review-when">
                    {review
                      ? review.dueAt <= now
                        ? "Ready to revisit"
                        : `Next review ${new Date(review.dueAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
                      : "Not recalled yet"}
                  </small>
                </span>
                <span
                  className="concept-stages"
                  aria-label={
                    completed.map((s) => STAGE_LABELS[s]).join(", ") ||
                    "Not started"
                  }
                >
                  {STAGES.map((s) => (
                    <i
                      className={completed.includes(s) ? "done" : ""}
                      title={STAGE_LABELS[s]}
                      key={s}
                    />
                  ))}
                </span>
                <Icon name="chevron" size={13} />
              </button>
            );
          })}
        </section>
        <section className="panel history-panel">
          <div className="section-heading">
            <h2>Recent attempts</h2>
            <select
              className="history-language"
              aria-label="History language"
              value={historyLanguage}
              onChange={(e) =>
                setHistoryLanguage(e.target.value as Language | "all")
              }
            >
              <option value="all">All languages</option>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {LANGUAGE_META[l].label}
                </option>
              ))}
            </select>
          </div>
          {history.length ? (
            <div className="history-list">
              {history
                .slice(-8)
                .reverse()
                .map((a, i) => (
                  <div className="history-row" key={`${a.at}:${i}`}>
                    <div>
                      <strong>{nameFor(a.lessonId)}</strong>
                      <span>
                        {
                          LANGUAGE_META[a.lessonId.split(":")[0] as Language]
                            .short
                        }{" "}
                        · {a.mode} ·{" "}
                        {new Date(a.at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <span
                      className={
                        a.passed && !a.assisted ? "text-success" : "muted"
                      }
                    >
                      {!a.passed
                        ? "Revisit"
                        : a.assisted
                          ? "Guided"
                          : a.mode === "type" || a.mode === "quick"
                            ? `${Math.round(a.accuracy)}%`
                            : "Unaided"}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="empty-history">
              <Icon name="chart" size={25} />
              <h3>No attempts recorded.</h3>
              <p>Complete a typing drill or exercise to record an attempt.</p>
            </div>
          )}
          <p className="validation-note">
            Recent history keeps up to 500 attempts across languages. Learned
            stages and review schedules are stored separately.
          </p>
        </section>
      </div>
      <section className="backup-panel panel">
        <div>
          <h2>Progress backups</h2>
          <p>
            Export all languages to JSON, then import on your other machine.
            Import merges both records and removes exact duplicates.
          </p>
        </div>
        <div className="inline-actions">
          <button className="button button-secondary" onClick={exportBackup}>
            Export progress
          </button>
          <button
            className="button button-primary"
            onClick={() => input.current?.click()}
          >
            Import backup
          </button>
          <input
            ref={input}
            hidden
            type="file"
            accept=".json,application/json"
            aria-label="Progress backup file"
            onChange={(e) => {
              void readBackup(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
        {message && (
          <p role="status" className="backup-message">
            {message}
          </p>
        )}
      </section>
    </>
  );
}
