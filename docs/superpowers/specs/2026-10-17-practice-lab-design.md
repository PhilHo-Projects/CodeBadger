# CodeBadger practice lab

Build a personal interview warm-up tool for a programmer whose syntax recall is rusty from heavy AI use. The user approved the preceding assessment and delegated product/design decisions with “do it … surprise me.” Work inline; no subagents, publishing, or profile changes. Preserve the existing uncommitted snippet improvements.

## Experience

A focused, responsive dark workspace with a warm amber accent, compact navigation, a C++ foundations path, quick drills in all four existing languages, and a review/warm-up view. Eight lessons cover variables, conditions, for loops, while loops, functions, strings, vectors, and maps. Every lesson has explanation, an annotated example, output, a pitfall, a typing rep, fill-in-the-gap questions, and a short recall prompt.

Recall checks specific requested constructs through bounded, documented syntax patterns. Accept common formatting and syntax alternatives; never execute submitted code or claim compilation. Wrong answers receive a useful hint; revealing a solution records assistance. Complete a lesson after passing recall. Users can jump to any lesson/stage, retry, and continue to the next lesson. A three-prompt warm-up prioritizes weak or stale concepts.

## Architecture and constraints

Keep Astro/React/TypeScript and static output. No new dependencies, accounts, backend, or mandatory API key. `PracticeApp` owns navigation; reusable `TypingDrill`, code display, and challenge components own interaction. Curriculum data and pure functions for typing, validation, persistence, and review selection are separate modules. Initial SSR state is deterministic. Existing optional Google generation remains available in quick drills with cancellation and bounded validation.

Persist versioned lesson-stage completion and the latest 100 practice attempts in browser storage. Invalid data is discarded safely; blocked storage falls back to memory. Track honest typing accuracy independently of deletions, mistakes, hints, and successful recall. Keep practice results after reload and show real course/session statistics, never fabricated activity.

## Verification

Meaningful unit tests pin scoring after backspace, strict mismatch behavior, smart indentation, full-match recall validation and alternatives, comment handling, corrupt/unavailable storage, unique warm-up selection, and deterministic startup. Run all tests, Astro checks, production build, then browser-check a complete lesson, a warm-up, quick drills, persistence, responsive layout, keyboard navigation, dialogs, and console errors. Keep changes reviewable locally; do not use the old deployment workflow.
