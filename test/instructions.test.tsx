import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { lessons } from "../src/data/lessons";
import { RecallChallenge } from "../src/components/Challenges";
import { FieldNotes } from "../src/components/LessonContent";

describe("exercise instructions", () => {
  it("uses the actual task as the heading in every lesson", () => {
    for (const lesson of lessons) {
      const markup = renderToStaticMarkup(
        <RecallChallenge
          lesson={lesson}
          onResult={() => {}}
          onNext={() => {}}
        />,
      );
      const taskHeading = renderToStaticMarkup(<h2>{lesson.recall.prompt}</h2>);
      expect(markup).toContain(taskHeading);
      expect(markup.indexOf(taskHeading)).toBeLessThan(
        markup.indexOf("<textarea"),
      );
    }
  });
  it.each(["fill", "recall"] as const)(
    "does not add a placeholder notes panel during %s",
    (stage) => {
      expect(
        renderToStaticMarkup(
          <FieldNotes
            lesson={lessons[0]}
            lessonIndex={0}
            stage={stage}
            completed={[]}
          />,
        ),
      ).toBe("");
    },
  );
});
