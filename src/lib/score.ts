export function calculateAccuracy(correctChars: number, totalTypedChars: number) {
  if (totalTypedChars <= 0) {
    return 100;
  }

  return Number(((correctChars / totalTypedChars) * 100).toFixed(1));
}

export function calculateWpm(correctChars: number, elapsedMs: number) {
  if (correctChars <= 0 || elapsedMs <= 0) {
    return 0;
  }

  const elapsedMinutes = elapsedMs / 60000;
  return Math.max(0, Number((((correctChars / 5) / elapsedMinutes)).toFixed(1)));
}

export function formatElapsedMs(elapsedMs: number) {
  const safeMs = Math.max(0, elapsedMs);
  const minutes = Math.floor(safeMs / 60000);
  const seconds = Math.floor((safeMs % 60000) / 1000);
  const tenths = Math.floor((safeMs % 1000) / 100);

  return `${minutes}:${seconds.toString().padStart(2, "0")}.${tenths}`;
}
