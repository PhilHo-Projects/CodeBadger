import { useEffect, useState } from "react";
import {
  lessons,
  lessonById,
  lessonsForLanguage,
  canonicalLessonId,
} from "../data/lessons";
import type { Exercise, Scenario } from "../data/scenarios";
import { fallbackSnippets } from "../data/fallbackSnippets";
import { STAGES, type Stage } from "../lib/learning";
import {
  completeStage,
  emptyProgress,
  dueReviews,
  loadProgress,
  recordAttempt,
  saveProgress,
  type Attempt,
  type Progress,
} from "../lib/progress";
import {
  LANGUAGE_META,
  TRACK_LANGUAGES,
  type TrackLanguage,
} from "../lib/languages";
import { buildSession, type SessionOptions } from "../lib/sessions";
import { PracticeDesk } from "./PracticeDesk";
import { ScenarioLab } from "./ScenarioLab";
import { PracticeSession } from "./PracticeSession";
import { LessonWorkspace } from "./LessonWorkspace";
import { ProgressView } from "./ProgressView";
import { BadgerMark, Icon } from "./Icons";
import { TypingGame } from "./TypingGame";

type View = "desk" | "learn" | "scenarios" | "quick" | "review" | "session";
const NAV_KEY = "codebadger.workspace.v2";
const nav = [
  { view: "desk", label: "Practice desk", icon: "bolt" },
  { view: "learn", label: "Learning path", icon: "book" },
  { view: "scenarios", label: "Scenario lab", icon: "code" },
  { view: "quick", label: "Quick drills", icon: "code" },
  { view: "review", label: "Your progress", icon: "chart" },
] as const;
export function PracticeApp() {
  const [view, setView] = useState<View>("desk");
  const [lessonId, setLessonId] = useState("cpp:for-loops");
  const [language, setLanguage] = useState<TrackLanguage>("cpp");
  const [stage, setStage] = useState<Stage>("learn");
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [now, setNow] = useState(0);
  const [session, setSession] = useState<Exercise[]>([]);
  const [sessionTitle, setSessionTitle] = useState("THE DAILY LAP");
  const [sessionId, setSessionId] = useState(0);
  const [sessionOptions, setSessionOptions] = useState<SessionOptions>({
    language: "cpp",
    count: 3,
    mode: "mixed",
  });
  useEffect(() => {
    setProgress(loadProgress());
    setNow(Date.now());
    try {
      const saved = JSON.parse(
        window.localStorage.getItem(NAV_KEY) ??
          window.localStorage.getItem("codebadger.workspace.v1") ??
          "null",
      );
      if (
        saved &&
        typeof saved.lessonId === "string" &&
        lessons.some((l) => l.id === canonicalLessonId(saved.lessonId))
      ) {
        const l = lessonById(saved.lessonId);
        setLessonId(l.id);
        setLanguage(l.language);
        if (STAGES.includes(saved.stage)) setStage(saved.stage);
        if (nav.some((n) => n.view === saved.view)) setView(saved.view);
      }
    } catch {
      /* Storage is optional. */
    }
    setReady(true);
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!ready) return;
    setStorageAvailable(saveProgress(progress));
    try {
      window.localStorage.setItem(
        NAV_KEY,
        JSON.stringify({
          lessonId,
          stage,
          language,
          view: view === "session" ? "desk" : view,
        }),
      );
    } catch {
      setStorageAvailable(false);
    }
  }, [progress, lessonId, stage, language, view, ready]);
  useEffect(() => {
    if (!ready) return;
    document.getElementById("practice-main")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view, lessonId, sessionId, ready]);
  const track = lessonsForLanguage(language);
  const lesson = lessonById(lessonId);
  const recalled = track.filter((l) =>
    progress.stages[l.id]?.includes("recall"),
  ).length;
  const due = dueReviews(progress, now, language).length;
  const today = progress.attempts.filter(
    (a) =>
      a.passed &&
      new Date(a.at).toDateString() === new Date(now).toDateString(),
  ).length;
  function record(a: Attempt) {
    setProgress((p) => recordAttempt(p, a));
    setNow(Date.now());
  }
  function choose(id: string, nextStage: Stage = "learn") {
    const l = lessonById(id);
    setLanguage(l.language);
    setLessonId(l.id);
    setStage(nextStage);
    setView("learn");
  }
  function switchLanguage(l: TrackLanguage) {
    setLanguage(l);
    const current =
      lessonsForLanguage(l).find(
        (x) =>
          progress.stages[x.id] && !progress.stages[x.id].includes("recall"),
      ) ??
      lessonsForLanguage(l).find(
        (x) => !progress.stages[x.id]?.includes("recall"),
      ) ??
      lessonsForLanguage(l)[0];
    setLessonId(current.id);
    setStage("learn");
  }
  function start(options: SessionOptions) {
    setSessionOptions(options);
    setSession(buildSession(progress, options, Date.now()));
    setSessionTitle(
      options.mode === "mixed"
        ? "THE DAILY LAP"
        : `${options.mode.toUpperCase()} SESSION`,
    );
    setSessionId((i) => i + 1);
    setView("session");
  }
  function scenario(s: Scenario) {
    setSessionOptions({ language: s.language, count: 3, mode: "mixed" });
    setSession(s.exercises);
    setSessionTitle(`${LANGUAGE_META[s.language].label} / ${s.title}`);
    setSessionId((i) => i + 1);
    setView("session");
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#practice-main">
        Skip to practice
      </a>
      <aside className="sidebar">
        <button
          className="brand brand-button"
          onClick={() => setView("desk")}
          aria-label="CodeBadger home"
        >
          <BadgerMark />
          <span>
            codebadger
            <span className="brand-caption">A little rust is normal.</span>
          </span>
        </button>
        <nav className="primary-nav" aria-label="Workspace">
          {nav.map((n) => (
            <button
              className={`nav-item${view === n.view ? " selected" : ""}`}
              onClick={() => setView(n.view)}
              aria-current={view === n.view ? "page" : undefined}
              key={n.view}
            >
              <Icon name={n.icon} />
              {n.label}
              {n.view === "review" && due > 0 && (
                <span className="nav-count">{due}</span>
              )}
              {n.view === "scenarios" && <span className="nav-tag">NEW</span>}
            </button>
          ))}
        </nav>
        <label className="select-label sidebar-language">
          Learning language
          <select
            aria-label="Learning language"
            value={language}
            onChange={(e) => switchLanguage(e.target.value as TrackLanguage)}
          >
            {TRACK_LANGUAGES.map((l) => (
              <option value={l} key={l}>
                {LANGUAGE_META[l].label}
              </option>
            ))}
          </select>
        </label>
        <div className="path-heading">
          <span className="eyebrow">
            {LANGUAGE_META[language].label} FOUNDATIONS
          </span>
          <span>
            {recalled}/{track.length}
          </span>
        </div>
        <nav
          className="lesson-nav"
          aria-label={`${LANGUAGE_META[language].label} lessons`}
        >
          {track.map((l, i) => {
            const done = progress.stages[l.id]?.includes("recall");
            const active = view === "learn" && lesson.id === l.id;
            return (
              <button
                className={`lesson-link${active ? " active" : ""}${done ? " recalled" : ""}`}
                key={l.id}
                onClick={() => choose(l.id)}
                aria-current={active ? "step" : undefined}
              >
                <span className="lesson-number">
                  {done ? (
                    <Icon name="check" size={13} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <span>{l.subtitle}</span>
                {active && <span className="active-dot" />}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="course-meter">
            <span style={{ width: `${(recalled / track.length) * 100}%` }} />
          </div>
          <p>
            {recalled
              ? `${recalled} of ${track.length} concepts recalled.`
              : "One concept. A few good reps."}
          </p>
          <span className="local-label">
            <i />
            {storageAvailable
              ? "Saved in this browser"
              : "Progress is in memory only"}
          </span>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Workspace</span>
            <Icon name="chevron" size={12} />
            <strong>
              {view === "session"
                ? "Practice session"
                : nav.find((n) => n.view === view)?.label}
            </strong>
          </div>
          <div className="topbar-right">
            <span className="today-count">
              <i />
              {today} {today === 1 ? "rep" : "reps"} today
            </span>
            <button
              className="button button-warmup"
              onClick={() => start({ language, count: 3, mode: "mixed" })}
            >
              <Icon name="bolt" size={15} />
              3-rep warm-up
            </button>
          </div>
        </header>
        <main id="practice-main" className="workspace" tabIndex={-1}>
          {!storageAvailable && (
            <p className="notice" role="status">
              Browser storage is unavailable. You can keep practicing and export
              a backup from Your progress before leaving.
            </p>
          )}
          {view === "desk" && (
            <PracticeDesk
              progress={progress}
              now={now}
              language={language}
              onTrack={(l) => {
                switchLanguage(l);
                setView("learn");
              }}
              onResume={() => setView("learn")}
              onStart={start}
              onScenarios={() => setView("scenarios")}
            />
          )}{" "}
          {view === "learn" && (
            <LessonWorkspace
              lesson={lesson}
              stage={stage}
              progress={progress}
              onStage={setStage}
              onLearn={() => {
                setProgress((p) => completeStage(p, lesson.id, "learn"));
                setStage("type");
              }}
              onResult={record}
              onChoose={choose}
              onFinish={() => setView("review")}
            />
          )}{" "}
          {view === "scenarios" && (
            <ScenarioLab
              key={language}
              language={language}
              progress={progress}
              onStart={scenario}
            />
          )}{" "}
          {view === "quick" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow accent">HANDS ON. BRAIN ON.</span>
                  <h1>Shake off the rust.</h1>
                  <p>Five languages. Real code. One clean rep at a time.</p>
                </div>
                <span className="small-badge">
                  {fallbackSnippets.length} curated drills
                </span>
              </div>
              <div className="panel">
                <TypingGame
                  key={language}
                  initialLanguage={language}
                  onResult={record}
                />
              </div>
            </>
          )}{" "}
          {view === "review" && (
            <ProgressView
              progress={progress}
              now={now}
              language={language}
              onChoose={choose}
              onWarmup={() => start({ language, count: 6, mode: "mixed" })}
              onImport={setProgress}
            />
          )}{" "}
          {view === "session" && (
            <PracticeSession
              key={sessionId}
              exercises={session}
              title={sessionTitle}
              onResult={record}
              onExit={() => setView("desk")}
              onAgain={() => start(sessionOptions)}
            />
          )}
        </main>
        <footer className="app-footer">
          <span>Built for the part between “I know this” and typing it.</span>
          <span>
            Keep your hands in the loop.<span className="footer-cursor">_</span>
          </span>
        </footer>
      </div>
    </div>
  );
}
