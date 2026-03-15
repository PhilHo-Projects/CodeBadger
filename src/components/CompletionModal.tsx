type CompletionModalProps = {
  open: boolean;
  accuracy: number;
  wpm: number;
  typoCount: number;
  elapsedLabel: string;
  filename: string;
  onNextSnippet: () => void;
};

export function CompletionModal(props: CompletionModalProps) {
  if (!props.open) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-md rounded-[24px] border border-white/12 bg-panel/95 p-5 shadow-[0_32px_80px_rgba(5,7,16,0.55)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.32em] text-state-correct">Exact match</p>
        <h2 className="mt-2 text-2xl font-semibold text-text-main">Snippet locked in clean.</h2>
        <p className="mt-2 text-sm text-text-muted">
          {props.filename} is complete. Pull the next rep whenever you are ready.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-text-muted">WPM</p>
            <p className="mt-2 text-lg font-semibold text-text-main">{props.wpm.toFixed(1)}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-text-muted">Accuracy</p>
            <p className="mt-2 text-lg font-semibold text-text-main">{props.accuracy.toFixed(1)}%</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-text-muted">Typos</p>
            <p className="mt-2 text-lg font-semibold text-text-main">{props.typoCount}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-text-muted">Time</p>
            <p className="mt-2 text-lg font-semibold text-text-main">{props.elapsedLabel}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={props.onNextSnippet}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl border border-accent/30 bg-accent/15 px-5 text-sm font-semibold text-accent transition hover:border-accent/60 hover:bg-accent/20"
        >
          Load next snippet
        </button>
      </div>
    </div>
  );
}
