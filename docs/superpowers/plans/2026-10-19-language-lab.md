# Language lab expansion

Keep CodeBadger's graphite workbench and field notes. Build inline, preserving the existing checkout and saved C++ progress. No deployment or external execution service.

- [x] Namespaced curriculum: C++, TypeScript, C#, Rust; language metadata and highlighting.
- [x] Rich lessons with learn/type/gaps/recall; curated answers, explicit limits of pattern checking.
- [x] Scenario library with output prediction, code repair and recall rounds, language/topic search.
- [x] Practice desk, configurable review sessions, spaced review state.
- [x] Validated JSON progress export/import and legacy migration.
- [x] Verify with unit tests, Astro check/build, fixture compilation where available, desktop/mobile browser exercises.

Acceptance: switching languages keeps independent progress; wrong boundaries/string literals cannot pass answer checks; hints never award unaided recall; old C++ progress survives; backup import merges safely; sessions do not repeat an exercise; every published answer passes; browser flows work by keyboard and at mobile width.

## Delivered and verified

- 48 lessons, 24 scenarios / 72 rounds, 150 unique quick drills.
- 100 passing tests; Astro check: 58 files, zero errors/warnings/hints; static production build passed.
- 18 TypeScript fixtures strict-checked and output-tested; 18 Rust fixtures and 18 C# fixtures compiled and output-verified with local rustc 1.94 and .NET 10. C++ was not compiled locally (no C++ toolchain available).
- Production-preview browser checks: TypeScript wrong/correct recall, gap completion, scenario prediction → guided repair → unaided recall and result summary, Rust typing/restart/hard quick drills, mobile C# record recall, session size limiting, round progression/focus, skip handling, JSON export/import with no duplicate attempts, navigation persistence, and desktop/390px mobile layout without document overflow. User-facing localhost progress was kept separate from practice-flow QA at 127.0.0.1. Browser console check returned no warnings or errors.
- Final handoff uses the local development server on port 4321. No commit, push, deployment, account change or additional dependency installation.
