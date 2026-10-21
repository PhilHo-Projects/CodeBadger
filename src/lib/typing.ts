import { calculateAccuracy, calculateWpm } from "./score";

export type TypingState = {
  target: string;
  text: string;
  attempts: number;
  correctAttempts: number;
  typos: number;
  startedAt: number | null;
  endedAt: number | null;
  errorIndex: number | null;
};

export function createTypingState(target: string): TypingState {
  return {
    target,
    text: "",
    attempts: 0,
    correctAttempts: 0,
    typos: 0,
    startedAt: null,
    endedAt: null,
    errorIndex: null,
  };
}

export function applyTypingInput(
  state: TypingState,
  input: string,
  at: number,
  keystrokes = input.length,
): TypingState {
  if (state.endedAt !== null || !input) return state;
  const matches =
    state.target.slice(state.text.length, state.text.length + input.length) ===
    input;
  const text = matches ? state.text + input : state.text;
  return {
    ...state,
    text,
    attempts: state.attempts + keystrokes,
    correctAttempts: state.correctAttempts + (matches ? keystrokes : 0),
    typos: state.typos + (matches ? 0 : 1),
    startedAt: state.startedAt ?? at,
    endedAt: text === state.target ? at : null,
    errorIndex: matches ? null : state.text.length,
  };
}

export function eraseTypingInput(state: TypingState): TypingState {
  if (state.endedAt !== null || !state.text) return state;
  return { ...state, text: state.text.slice(0, -1), errorIndex: null };
}

export function getTypingStats(state: TypingState, now: number) {
  const elapsedMs =
    state.startedAt === null
      ? 0
      : Math.max(0, (state.endedAt ?? now) - state.startedAt);
  return {
    elapsedMs,
    accuracy: calculateAccuracy(state.correctAttempts, state.attempts),
    wpm: calculateWpm(state.text.length, elapsedMs),
  };
}

/** Smart Enter consumes the target's indentation; Tab consumes up to four spaces. */
export function nextIndent(target: string, cursor: number): string {
  const rest = target.slice(cursor);
  if (rest.startsWith("\n")) return /^\n */.exec(rest)?.[0] ?? "\n";
  return /^ {1,4}/.exec(rest)?.[0] ?? "";
}

export function getEnterInput(
  target: string,
  cursor: number,
  smartIndent: boolean,
): string {
  return smartIndent && target[cursor] === "\n"
    ? nextIndent(target, cursor)
    : "\n";
}
