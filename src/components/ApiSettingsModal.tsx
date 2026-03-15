import { useEffect, useState } from "react";

type ApiSettingsModalProps = {
  open: boolean;
  initialApiKey: string;
  initialModel: string;
  onClose: () => void;
  onSave: (apiKey: string, model: string) => void;
};

export function ApiSettingsModal(props: ApiSettingsModalProps) {
  const [apiKey, setApiKey] = useState(props.initialApiKey);
  const [model, setModel] = useState(props.initialModel);

  useEffect(() => {
    if (!props.open) {
      return;
    }

    setApiKey(props.initialApiKey);
    setModel(props.initialModel);
  }, [props.initialApiKey, props.initialModel, props.open]);

  if (!props.open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#060911]/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-panel/95 p-6 shadow-[0_32px_80px_rgba(5,7,16,0.6)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Google AI</p>
            <h2 className="mt-2 text-2xl font-semibold text-text-main">Local API settings</h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Paste your API key here. It stays on this device in browser storage and is not written into the repo.
            </p>
          </div>

          <button
            type="button"
            onClick={props.onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/4 text-text-main transition hover:bg-white/8"
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block text-xs uppercase tracking-[0.24em] text-text-muted">
            API key
            <input
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="Paste your Google AI API key"
              className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-accent/70 focus:ring-2 focus:ring-accent/20"
            />
          </label>

          <label className="block text-xs uppercase tracking-[0.24em] text-text-muted">
            Model
            <input
              type="text"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              placeholder="gemini-2.5-flash"
              className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-accent/70 focus:ring-2 focus:ring-accent/20"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => {
              props.onSave("", model.trim() || "gemini-2.5-flash");
              props.onClose();
            }}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/4 px-5 text-sm font-medium text-text-main transition hover:bg-white/8"
          >
            Clear key
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={props.onClose}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/4 px-5 text-sm font-medium text-text-main transition hover:bg-white/8"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                props.onSave(apiKey.trim(), model.trim() || "gemini-2.5-flash");
                props.onClose();
              }}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-accent/30 bg-accent/15 px-5 text-sm font-semibold text-accent transition hover:border-accent/60 hover:bg-accent/20"
            >
              Save settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
