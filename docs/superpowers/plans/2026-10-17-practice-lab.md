# CodeBadger practice lab implementation plan

> Execution: implement inline, using executing-plans and test-driven-development. No subagents. User delegated design and implementation; no further design approval is needed.

**Goal:** Turn the existing code-copying prototype into a useful learning and recall workspace.
**Architecture:** Pure typing/learning/progress modules, curated C++ curriculum, reusable drill/challenge components, and a responsive React application shell. Retain the existing fallback libraries and optional Google integration.
**Tech Stack:** Existing Astro, React, TypeScript, Tailwind, Vitest; no new packages.
**Spec:** `docs/superpowers/specs/2026-10-17-practice-lab-design.md`

## Global constraints

- Work on `codex/practice-lab` in the existing checkout to preserve uncommitted work.
- No external deployment, profile changes, arbitrary code execution, or subagents.
- Static first render must be deterministic; browser storage may be unavailable.
- Recall is bounded syntax practice, not a compiler or a general semantic judge.

## Review focus

- Backspacing correct text must not count as a typo or reduce accuracy.
- Blank, commented-out, extra, or incorrect recall code must not earn progress.
- Corrupt/blocked storage must not prevent practice.
- Same-snippet retry and next-round actions must restore focus and reset timing.
- Generation responses must not overwrite a changed selection or survive unmount.

## Tasks

- [x] 1. Add failing behavioral tests for pure typing, answer validation, persistence, and review selection; implement the modules and eight curated lessons; run the suite.
- [x] 2. Implement reusable keyboard typing drills, syntax display, gap and recall interactions using the tested modules; retain optional AI quick drills and address cancellation/fallback behavior.
- [x] 3. Implement the responsive learning workspace, lesson navigation, progress/review views, three-round warm-up, and local persistence.
- [x] 4. Update project documentation and hosting metadata; run tests/type checks/build, browser QA, accessibility/keyboard checks, and inline code review. Fix demonstrated issues and record limitations.

## Progress ledger

Pre-flight: curriculum IDs connect validators, persistence, and lesson navigation; stage keys are `learn`, `type`, `fill`, `recall`. Typing metrics use accepted attempts / all attempts, independently of current buffer length. No conflicting interfaces.

Ruling: preserve the existing dirty checkout on a new branch rather than create a worktree that would omit that work. Preserve all existing snippet libraries. No commits until the complete combined work is reviewable.

Tasks 1–3: complete. Test suite grew from 19 to 68 passing tests. Browser-verified the full for-loop path, rejection of an off-by-one recall, alternative syntax, reload persistence, and a full three-rep warm-up with an assisted result correctly excluded from mastery. Phone-width navigation and code overflow are verified at 390px. Dialog Escape handling and restored focus are verified on the production build.

Inline review: separated lesson content and progress views from navigation. Corrected invalid persisted dates/IDs, an overly broad while-condition matcher, hidden solution notes during recall, Enter accidentally accepting spaces, and stale AI generation after settings changes. Original C++ snippet notes were retained with two countdown line numbers corrected. No subagent review, external release, or paid AI request was performed.

Task 4: complete. Final suite: 68/68 passing; Astro: 40 files, zero errors/warnings/hints; static production build: success. Production-browser checks passed for strict Enter matching, smart indentation, completing/repeating a one-snippet topic with restored focus, saved progress, dialog focus/Escape behavior, responsive lesson selection, and bounded code overflow at 390px. Production console had no errors or warnings. Preview at http://localhost:4321/codebadger uses a clean origin; QA progress remains isolated at the 127.0.0.1 origin. Native screenshot saved outside the repository. Existing uncommitted changes remain preserved and the branch is intentionally uncommitted for review.
