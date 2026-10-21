import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";

type Props = {
  open: boolean;
  initialApiKey: string;
  initialModel: string;
  onClose: () => void;
  onSave: (apiKey: string, model: string) => void;
};

export function ApiSettingsModal({
  open,
  initialApiKey,
  initialModel,
  onClose,
  onSave,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  useEffect(() => {
    if (open) {
      setApiKey(initialApiKey);
      setModel(initialModel);
      dialog.current?.showModal();
    } else dialog.current?.close();
  }, [open, initialApiKey, initialModel]);
  return (
    <dialog
      ref={dialog}
      className="settings-dialog"
      aria-labelledby="settings-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(apiKey.trim(), model.trim() || "gemini-2.5-flash");
          onClose();
        }}
      >
        <div className="dialog-heading">
          <div>
            <h2 id="settings-title">Google AI settings</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Close settings"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>
        <p>
          All lessons and the snippet library work without a key. Add your own
          key to generate variations in quick drills.
        </p>
        <label className="form-label">
          API key
          <input
            type="password"
            value={apiKey}
            autoComplete="off"
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="Google AI API key"
          />
        </label>
        <label className="form-label">
          Model
          <input
            value={model}
            onChange={(event) => setModel(event.target.value)}
            placeholder="gemini-2.5-flash"
          />
        </label>
        <p className="validation-note">
          The key is stored in this browser and sent directly to Google when you
          generate. It is accessible to scripts on this site. Generation uses
          your Google AI quota.
        </p>
        <div className="exercise-actions">
          <button
            type="button"
            className="button button-quiet"
            onClick={() => {
              onSave("", model.trim());
              onClose();
            }}
          >
            Remove key
          </button>
          <button className="button button-primary" type="submit">
            Save settings
            <Icon name="check" size={16} />
          </button>
        </div>
      </form>
    </dialog>
  );
}
