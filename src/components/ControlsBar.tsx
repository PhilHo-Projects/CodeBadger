import {
  DIFFICULTIES,
  LANGUAGES,
  getDifficultyLabel,
  getTopicLabel,
  getTopicsForLanguage,
  type Difficulty,
  type Language,
  type TopicFilter,
} from "../lib/types";

const LANGUAGE_LABELS: Record<Language, string> = {
  rust: "Rust",
  csharp: "C#",
  cpp: "C++",
  typescript: "TypeScript",
  python: "Python",
};

type ControlsBarProps = {
  language: Language;
  difficulty: Difficulty;
  topic: TopicFilter;
  canAdvance: boolean;
  hasGoogleApiKey: boolean;
  isGenerating: boolean;
  generatorMessage: string | null;
  onOpenSettings: () => void;
  onGenerateSnippet: () => void;
  onLanguageChange: (language: Language) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onTopicChange: (topic: TopicFilter) => void;
  onNextSnippet: () => void;
};

function selectClassName() {
  return "h-11 rounded-2xl border border-white/10 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-accent/70 focus:ring-2 focus:ring-accent/20";
}

export function ControlsBar(props: ControlsBarProps) {
  const topicOptions = [
    "all",
    ...getTopicsForLanguage(props.language, props.difficulty),
  ] as const;

  return (
    <section className="rounded-[28px] border border-white/10 bg-panel/75 p-4 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs uppercase tracking-[0.24em] text-text-muted">
            Controls
          </div>

          <button
            type="button"
            onClick={props.onOpenSettings}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm font-medium text-text-main transition hover:border-accent/30 hover:bg-white/8"
            title="Google AI settings"
          >
            <span aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-none stroke-current stroke-[1.8]"
              >
                <path d="M10.3 2.7h3.4l.6 2.2a7.8 7.8 0 0 1 1.8.8l2.1-1 2.4 2.4-1 2.1c.3.6.6 1.2.8 1.8l2.2.6v3.4l-2.2.6a7.8 7.8 0 0 1-.8 1.8l1 2.1-2.4 2.4-2.1-1a7.8 7.8 0 0 1-1.8.8l-.6 2.2h-3.4l-.6-2.2a7.8 7.8 0 0 1-1.8-.8l-2.1 1-2.4-2.4 1-2.1a7.8 7.8 0 0 1-.8-1.8l-2.2-.6v-3.4l2.2-.6a7.8 7.8 0 0 1 .8-1.8l-1-2.1 2.4-2.4 2.1 1c.6-.3 1.2-.6 1.8-.8l.6-2.2Z" />
                <circle cx="12" cy="12" r="3.2" />
              </svg>
            </span>
            Google AI
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] ${
                props.hasGoogleApiKey
                  ? "border border-state-correct/30 bg-state-correct/10 text-state-correct"
                  : "border border-white/10 bg-white/6 text-text-muted"
              }`}
            >
              {props.hasGoogleApiKey ? "key saved" : "no key"}
            </span>
          </button>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.24em] text-text-muted">
              Language
              <select
                className={selectClassName()}
                value={props.language}
                onChange={(event) =>
                  props.onLanguageChange(event.target.value as Language)
                }
              >
                {LANGUAGES.map((language) => (
                  <option key={language} value={language}>
                    {LANGUAGE_LABELS[language]}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.24em] text-text-muted">
              Difficulty
              <select
                className={selectClassName()}
                value={props.difficulty}
                onChange={(event) =>
                  props.onDifficultyChange(event.target.value as Difficulty)
                }
              >
                {DIFFICULTIES.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {getDifficultyLabel(props.language, difficulty)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.24em] text-text-muted">
              Topic
              <select
                className={selectClassName()}
                value={props.topic}
                onChange={(event) =>
                  props.onTopicChange(event.target.value as TopicFilter)
                }
              >
                {topicOptions.map((topic) => (
                  <option key={topic} value={topic}>
                    {getTopicLabel(topic)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={props.onGenerateSnippet}
              disabled={!props.hasGoogleApiKey || props.isGenerating}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/4 px-5 text-sm font-medium text-text-main transition hover:border-accent/30 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-60"
              title={
                props.hasGoogleApiKey
                  ? "Generate a new snippet with Google AI."
                  : "Add your Google AI API key first."
              }
            >
              {props.isGenerating ? "Generating..." : "Generate"}
              <span className="ml-2 rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]">
                Google AI
              </span>
            </button>

            <button
              type="button"
              onClick={props.onNextSnippet}
              disabled={!props.canAdvance}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-accent/30 bg-accent/15 px-5 text-sm font-semibold text-accent transition hover:border-accent/60 hover:bg-accent/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/4 disabled:text-text-muted"
            >
              Next snippet
            </button>
          </div>
        </div>

        {props.generatorMessage ? (
          <p className="mt-1 text-sm text-text-muted">
            {props.generatorMessage}
          </p>
        ) : null}
      </div>
    </section>
  );
}
