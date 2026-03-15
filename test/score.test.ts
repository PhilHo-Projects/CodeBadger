import { describe, expect, it } from "vitest";

import { calculateAccuracy, calculateWpm, formatElapsedMs } from "../src/lib/score";

describe("score helpers", () => {
  it("returns full accuracy when nothing has been typed yet", () => {
    expect(calculateAccuracy(0, 0)).toBe(100);
  });

  it("calculates accuracy with one decimal place", () => {
    expect(calculateAccuracy(18, 20)).toBe(90);
  });

  it("calculates WPM from correct characters and elapsed time", () => {
    expect(calculateWpm(25, 60000)).toBe(5);
  });

  it("formats elapsed time as minutes, seconds, and tenths", () => {
    expect(formatElapsedMs(61234)).toBe("1:01.2");
  });
});
