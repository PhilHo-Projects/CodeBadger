import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { EditorWindow } from "../src/components/EditorWindow";
import { createInitialRound } from "../src/lib/snippetService";
import type { Snippet } from "../src/lib/types";

const easyCppSnippet: Snippet = {
  language: "cpp",
  difficulty: "easy",
  topic: "loops",
  code: 'int timer = 3;\nwhile (timer > 0)\n{\n    --timer;\n}',
  filename: "timer.cpp",
  slug: "timer",
  title: "Countdown Timer",
  description: "Count down until the timer reaches zero.",
  lineHints: [
    { line: 1, text: "Create the timer." },
    { line: 2, text: "Loop while time remains." }
  ]
};

describe("EditorWindow", () => {
  it("renders snippet context and visual-only helper notes", () => {
    const markup = renderToStaticMarkup(
      <EditorWindow
        code={easyCppSnippet.code}
        typedText=""
        language={easyCppSnippet.language}
        filename={easyCppSnippet.filename}
        title={easyCppSnippet.title}
        description={easyCppSnippet.description}
        lineHints={easyCppSnippet.lineHints}
        isComplete={false}
        errorIndex={null}
        onRequestFocus={() => undefined}
      />
    );

    expect(markup).toContain("training/timer.cpp");
    expect(markup).toContain("Countdown Timer");
    expect(markup).toContain("Count down until the timer reaches zero.");
    expect(markup).toContain("Create the timer.");
    expect(markup).toContain("Loop while time remains.");
    expect(markup).not.toContain("hidden input active");
  });

  it("keeps helper notes out of the typed target text", () => {
    const round = createInitialRound(easyCppSnippet);

    expect(round.targetText).toBe(easyCppSnippet.code);
    expect(round.targetText).not.toContain("Create the timer.");
    expect(round.targetText).not.toContain("Loop while time remains.");
  });
});
