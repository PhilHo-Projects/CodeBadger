import { useEffect, useRef, useState } from "react";
import { fallbackSnippets } from "../data/fallbackSnippets";
import {
  DIFFICULTIES,
  LANGUAGES,
  getDifficultyLabel,
  getLanguageLabel,
  getTopicLabel,
  getTopicsForLanguage,
  normalizeTopicFilter,
  type Language,
  type Difficulty,
  type TopicFilter,
  type Snippet,
} from "../lib/types";
import { selectFallbackSnippet } from "../lib/snippetService";
import {
  generateSnippetWithGoogleAi,
  getStoredGoogleAiSettings,
  storeGoogleAiSettings,
} from "../lib/googleAi";
import type { Attempt } from "../lib/progress";
import { TypingDrill, type DrillResult } from "./TypingDrill";
import { ApiSettingsModal } from "./ApiSettingsModal";
import { Icon } from "./Icons";

export function TypingGame({
  onResult,
  initialLanguage = "cpp",
}: {
  onResult?: (attempt: Attempt) => void;
  initialLanguage?: Language;
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [topic, setTopic] = useState<TopicFilter>("all");
  const [snippet, setSnippet] = useState<Snippet>(
    () =>
      fallbackSnippets.find(
        (item) =>
          item.language === initialLanguage && item.difficulty === "easy",
      )!,
  );
  const [round, setRound] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    apiKey: "",
    model: "gemini-2.5-flash",
  });
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const request = useRef<AbortController | null>(null);
  useEffect(() => {
    const saved = getStoredGoogleAiSettings();
    if (saved) setSettings(saved);
    return () => request.current?.abort();
  }, []);

  function cancel() {
    request.current?.abort();
    request.current = null;
    setGenerating(false);
  }
  function select(
    nextLanguage: Language,
    nextDifficulty: Difficulty,
    nextTopic: TopicFilter,
  ) {
    cancel();
    const normalized = normalizeTopicFilter(
      nextLanguage,
      nextDifficulty,
      nextTopic,
    );
    setLanguage(nextLanguage);
    setDifficulty(nextDifficulty);
    setTopic(normalized);
    setSnippet(
      selectFallbackSnippet({
        language: nextLanguage,
        difficulty: nextDifficulty,
        topic: normalized,
        excludeCode: snippet.code,
      }),
    );
    setRound((value) => value + 1);
    setMessage(null);
  }
  async function generate() {
    if (!settings.apiKey || generating) return;
    const controller = new AbortController();
    request.current = controller;
    setGenerating(true);
    setMessage(null);
    try {
      const generated = await generateSnippetWithGoogleAi({
        ...settings,
        language,
        difficulty,
        topic,
        previousSnippet: snippet.code,
        signal: controller.signal,
      });
      if (request.current !== controller) return;
      setSnippet(generated);
      setRound((value) => value + 1);
      setMessage("Fresh drill ready. Generated code has not been compiled.");
    } catch (error) {
      if (request.current !== controller || controller.signal.aborted) return;
      const detail =
        error instanceof Error ? error.message : "Generation failed.";
      setMessage(`${detail} The local library is still available.`);
    } finally {
      if (request.current === controller) {
        request.current = null;
        setGenerating(false);
      }
    }
  }
  const pool = fallbackSnippets.filter(
    (item) =>
      item.language === language &&
      item.difficulty === difficulty &&
      (topic === "all" || item.topic === topic),
  );
  function complete(result: DrillResult) {
    onResult?.({
      ...result,
      lessonId: `${language}:${snippet.slug}`,
      mode: "quick",
      assisted: false,
      passed: true,
      at: Date.now(),
    });
  }

  return (
    <div className="quick-practice">
      <div className="quick-controls">
        <label className="select-label">
          Language
          <select
            value={language}
            onChange={(event) =>
              select(event.target.value as Language, difficulty, topic)
            }
          >
            {LANGUAGES.map((value) => (
              <option key={value} value={value}>
                {getLanguageLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <label className="select-label">
          Difficulty
          <select
            value={difficulty}
            onChange={(event) =>
              select(language, event.target.value as Difficulty, topic)
            }
          >
            {DIFFICULTIES.map((value) => (
              <option key={value} value={value}>
                {getDifficultyLabel(language, value)}
              </option>
            ))}
          </select>
        </label>
        <label className="select-label">
          Topic
          <select
            value={topic}
            onChange={(event) =>
              select(language, difficulty, event.target.value as TopicFilter)
            }
          >
            <option value="all">All topics</option>
            {getTopicsForLanguage(language, difficulty).map((value) => (
              <option key={value} value={value}>
                {getTopicLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <button
          className="button button-secondary"
          onClick={() => select(language, difficulty, topic)}
        >
          <Icon name="reset" size={15} />
          {pool.length <= 1 ? "Restart" : "Skip drill"}
        </button>
      </div>
      <div className="snippet-heading">
        <div>
          <span className="eyebrow">
            {getLanguageLabel(snippet.language)} /{" "}
            {getTopicLabel(snippet.topic)}
          </span>
          <h2>{snippet.title}</h2>
          <p>{snippet.description}</p>
        </div>
        <span className="small-badge">
          {pool.length} {pool.length === 1 ? "local drill" : "local drills"}
        </span>
      </div>
      {topic !== "all" && snippet.topic !== topic && (
        <p className="notice" role="status">
          No local {getTopicLabel(topic).toLowerCase()} drills at this
          difficulty yet. Showing {getTopicLabel(snippet.topic).toLowerCase()}{" "}
          instead.
        </p>
      )}
      <TypingDrill
        key={`${round}:${snippet.slug}`}
        code={snippet.code}
        filename={snippet.filename}
        language={snippet.language}
        onComplete={complete}
        onNext={() => select(language, difficulty, topic)}
        nextLabel={pool.length <= 1 ? "Repeat drill" : "Next drill"}
      />
      {snippet.lineHints && (
        <details className="snippet-hints">
          <summary>Read the code notes</summary>
          {snippet.lineHints.map((hint, index) => (
            <p key={index}>
              <span>Line {hint.line}</span>
              {hint.text}
            </p>
          ))}
        </details>
      )}
      <div className="generator-strip">
        <div>
          <Icon name="bolt" size={16} />
          <span>Want a fresh variation?</span>
        </div>
        <div className="inline-actions">
          <button
            className="button button-quiet"
            onClick={() => setSettingsOpen(true)}
          >
            {settings.apiKey ? "AI settings" : "Add Google AI key"}
          </button>
          {settings.apiKey && (
            <button
              className="button button-secondary"
              disabled={generating}
              onClick={generate}
            >
              {generating ? "Generating…" : "Generate drill"}
            </button>
          )}
          {generating && (
            <button className="button button-quiet" onClick={cancel}>
              Cancel
            </button>
          )}
        </div>
      </div>
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      <ApiSettingsModal
        open={settingsOpen}
        initialApiKey={settings.apiKey}
        initialModel={settings.model}
        onClose={() => setSettingsOpen(false)}
        onSave={(apiKey, model) => {
          cancel();
          setSettings({ apiKey, model });
          const saved = storeGoogleAiSettings({ apiKey, model });
          setMessage(
            saved
              ? apiKey
                ? "Settings saved in this browser."
                : "Stored key removed."
              : "Browser storage is unavailable. Settings will last for this visit.",
          );
        }}
      />
    </div>
  );
}
