import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";

import { ApiSettingsModal } from "./ApiSettingsModal";
import { CompletionModal } from "./CompletionModal";
import { ControlsBar } from "./ControlsBar";
import { EditorWindow } from "./EditorWindow";
import { StatsBar } from "./StatsBar";
import { generateSnippetWithGoogleAi, getStoredGoogleAiSettings, storeGoogleAiSettings } from "../lib/googleAi";
import { createInitialRound, selectFallbackSnippet } from "../lib/snippetService";
import { calculateAccuracy, calculateWpm, formatElapsedMs } from "../lib/score";
import type { Difficulty, Language, RoundState, Snippet, TopicFilter } from "../lib/types";

const DEFAULT_LANGUAGE: Language = "cpp";
const DEFAULT_DIFFICULTY: Difficulty = "medium";
const DEFAULT_TOPIC: TopicFilter = "all";

function buildRound(snippet: Snippet): RoundState {
  return createInitialRound(snippet);
}

export function TypingGame() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
  const [topic, setTopic] = useState<TopicFilter>(DEFAULT_TOPIC);
  const [currentSnippet, setCurrentSnippet] = useState<Snippet>(() =>
    selectFallbackSnippet({
      language: DEFAULT_LANGUAGE,
      difficulty: DEFAULT_DIFFICULTY,
      topic: DEFAULT_TOPIC
    })
  );
  const [round, setRound] = useState<RoundState>(() => buildRound(currentSnippet));
  const [now, setNow] = useState(() => Date.now());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [googleModel, setGoogleModel] = useState("gemini-2.5-flash");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatorMessage, setGeneratorMessage] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const errorTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const savedSettings = getStoredGoogleAiSettings();

    if (!savedSettings) {
      return;
    }

    setGoogleApiKey(savedSettings.apiKey);
    setGoogleModel(savedSettings.model);
  }, []);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [currentSnippet.filename]);

  useEffect(() => {
    if (!round.startedAt || round.endedAt) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => window.clearInterval(intervalId);
  }, [round.startedAt, round.endedAt]);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        window.clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const elapsedMs = round.startedAt
    ? (round.endedAt ?? now) - round.startedAt
    : 0;
  const correctChars = round.typedText.length;
  const accuracy = calculateAccuracy(correctChars, round.totalTypedChars);
  const wpm = calculateWpm(correctChars, elapsedMs);

  function focusEditor() {
    textareaRef.current?.focus();
  }

  function clearErrorSoon() {
    if (errorTimeoutRef.current) {
      window.clearTimeout(errorTimeoutRef.current);
    }

    errorTimeoutRef.current = window.setTimeout(() => {
      setRound((currentRound) => ({ ...currentRound, errorIndex: null }));
    }, 180);
  }

  function loadSnippet(nextLanguage: Language, nextDifficulty: Difficulty, nextTopic: TopicFilter, excludeCode?: string | null) {
    const nextSnippet = selectFallbackSnippet({
      language: nextLanguage,
      difficulty: nextDifficulty,
      topic: nextTopic,
      excludeCode
    });

    setCurrentSnippet(nextSnippet);
    setRound(buildRound(nextSnippet));
    setNow(Date.now());
  }

  function handleSelectionChange(nextLanguage: Language, nextDifficulty: Difficulty, nextTopic: TopicFilter) {
    setGeneratorMessage(null);
    loadSnippet(nextLanguage, nextDifficulty, nextTopic, currentSnippet.code);
  }

  async function handleGenerateSnippet() {
    if (!googleApiKey || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setGeneratorMessage(null);

    try {
      const generatedSnippet = await generateSnippetWithGoogleAi({
        apiKey: googleApiKey,
        model: googleModel,
        language,
        difficulty,
        topic,
        previousSnippet: currentSnippet.code
      });

      setCurrentSnippet(generatedSnippet);
      setRound(buildRound(generatedSnippet));
      setNow(Date.now());
      setGeneratorMessage(`Generated via ${googleModel}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google AI generation failed.";
      setGeneratorMessage(message);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSaveSettings(apiKey: string, model: string) {
    setGoogleApiKey(apiKey);
    setGoogleModel(model);
    storeGoogleAiSettings({ apiKey, model });
    setGeneratorMessage(apiKey ? "Google AI key saved locally on this device." : "Google AI key removed from local storage.");
  }

  function markTypo(timestamp: number, errorIndex: number) {
    setRound((currentRound) => ({
      ...currentRound,
      startedAt: currentRound.startedAt ?? timestamp,
      totalTypedChars: currentRound.totalTypedChars + 1,
      typoCount: currentRound.typoCount + 1,
      errorIndex
    }));
    clearErrorSoon();
  }

  function acceptInput(input: string, timestamp: number) {
    setRound((currentRound) => {
      const nextTypedText = currentRound.typedText + input;
      const isComplete = nextTypedText === currentRound.targetText;

      return {
        ...currentRound,
        typedText: nextTypedText,
        totalTypedChars: currentRound.totalTypedChars + input.length,
        startedAt: currentRound.startedAt ?? timestamp,
        endedAt: isComplete ? timestamp : currentRound.endedAt,
        isComplete,
        errorIndex: null
      };
    });
  }

  function handleCharacterInput(input: string) {
    if (round.isComplete || input.length === 0) {
      return;
    }

    const timestamp = Date.now();
    const expectedChunk = round.targetText.slice(round.typedText.length, round.typedText.length + input.length);

    if (expectedChunk === input) {
      acceptInput(input, timestamp);
      return;
    }

    markTypo(timestamp, round.typedText.length);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();

      if (round.isComplete || round.typedText.length === 0) {
        return;
      }

      setRound((currentRound) => ({
        ...currentRound,
        typedText: currentRound.typedText.slice(0, -1),
        endedAt: null,
        isComplete: false,
        errorIndex: null
      }));
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      handleCharacterInput("    ");
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      handleCharacterInput("\n");
      return;
    }

    if (event.key.length === 1) {
      event.preventDefault();
      handleCharacterInput(event.key);
    }
  }

  return (
    <div className="space-y-5">
      <ControlsBar
        language={language}
        difficulty={difficulty}
        topic={topic}
        canAdvance={round.isComplete}
        hasGoogleApiKey={Boolean(googleApiKey)}
        isGenerating={isGenerating}
        generatorMessage={generatorMessage}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onGenerateSnippet={handleGenerateSnippet}
        onLanguageChange={(nextLanguage) => {
          setLanguage(nextLanguage);
          handleSelectionChange(nextLanguage, difficulty, topic);
        }}
        onDifficultyChange={(nextDifficulty) => {
          setDifficulty(nextDifficulty);
          handleSelectionChange(language, nextDifficulty, topic);
        }}
        onTopicChange={(nextTopic) => {
          setTopic(nextTopic);
          handleSelectionChange(language, difficulty, nextTopic);
        }}
        onNextSnippet={() => loadSnippet(language, difficulty, topic, currentSnippet.code)}
      />

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={round.typedText}
          onChange={() => undefined}
          onKeyDown={handleKeyDown}
          onPaste={(event) => event.preventDefault()}
          onDrop={(event) => event.preventDefault()}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          aria-label="Hidden typing input"
          className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-0"
        />

        <EditorWindow
          code={round.targetText}
          typedText={round.typedText}
          language={currentSnippet.language}
          filename={currentSnippet.filename}
          isComplete={round.isComplete}
          errorIndex={round.errorIndex}
          onRequestFocus={focusEditor}
        />

        <CompletionModal
          open={round.isComplete}
          accuracy={accuracy}
          wpm={wpm}
          typoCount={round.typoCount}
          elapsedLabel={formatElapsedMs(elapsedMs)}
          filename={currentSnippet.filename}
          onNextSnippet={() => loadSnippet(language, difficulty, topic, currentSnippet.code)}
        />
      </div>

      <StatsBar
        wpm={wpm}
        accuracy={accuracy}
        typoCount={round.typoCount}
        elapsedLabel={formatElapsedMs(elapsedMs)}
        characterProgress={`${round.typedText.length}/${round.targetText.length}`}
      />

      <div className="rounded-[24px] border border-white/8 bg-white/4 px-4 py-3 text-sm text-text-muted">
        Click the editor and type directly into the code. Paste is blocked, <span className="font-semibold text-text-main">Tab</span> inserts four spaces, and completion only lands on an exact match.
      </div>

      <ApiSettingsModal
        open={isSettingsOpen}
        initialApiKey={googleApiKey}
        initialModel={googleModel}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
