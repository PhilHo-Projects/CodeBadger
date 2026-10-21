# CodeBadger

A personal coding warm-up workspace: rebuild syntax recall, get your fingers moving, and practice fundamentals before an interview.

## Run locally

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:4321/codebadger`.

```sh
npm run test     # Behavioral tests
npm run check    # Astro / TypeScript diagnostics
npm run build    # Static output in dist/
npm run preview # Serve the built app
```

## Practice modes

- **Practice desk:** pick a track, resume your work, or build a 3/6/10-rep session. Choose recall, output prediction, code repair, or a mix. Mix languages or focus on one. Sessions use distinct exercises and show the available count when a mode has fewer than requested.
- **Learning paths:** 48 lessons, 12 each for C++, TypeScript, C#, and Rust. Every lesson includes explanations, code, output, pitfalls, and Learn → Type → Fill gaps → Recall stages. Python remains available in quick drills.
- **Scenario lab:** six problems in four languages (24 scenarios / 72 rounds): checkout totals, log counting, duplicates, loop boundaries, missing names, and binary search. Each scenario has prediction, repair, and recall rounds. Filter by language, level, or search.
- **Quick drills:** 150 unique curated snippets across five languages, including lesson and scenario examples, with language/difficulty/topic filters, restart/skip controls, and optional Google AI generation.
- **Reviews:** successful unaided answers return after 1, 3, 7, then 14 days; failed or assisted answers become due immediately. Repeating an answer before it is due does not advance its spacing streak. Mixed sessions prioritize due exercises within each mode, then unseen exercises, then future reviews.
- **Progress:** completed stages, independent review schedules, and the latest 500 attempts live in this browser. A concept earns recalled status only after an unaided success. Export a JSON backup and import it on another machine; imports merge stages and deduplicate identical attempts, keeping the latest review state. Invalid backups leave progress unchanged.

## Typing and recall

Typing drills use strict input: wrong characters stop at the cursor, and completion requires the exact target. Backspace does not reduce accuracy; accuracy measures accepted input attempts against all attempts. Smart Enter supplies the target's indentation; Tab inserts up to four expected spaces. Paste is blocked in typing drills. Escape releases editor focus so Tab can navigate normally.

Recall and repair use editable textareas; Ctrl/Cmd+Enter checks the answer. Checks match curated syntax patterns and stated alternatives, ignoring comments and whitespace while preserving literals and operators. They are **not a compiler, sandbox, or general semantic code grader**. Valid implementations outside a prompt’s supported structure may require adaptation. Environment notes describe the surrounding imports/function expected by each language. C++ examples target C++20; TypeScript uses strict checking; C# uses modern top-level statements and nullable annotations; Rust uses the standard library.

`npm test` verifies behavior and executes the repository-authored TypeScript examples against their documented output. `npm run verify:curriculum` additionally requires installed `rustc` and .NET 10: it strict-checks 18 TypeScript fixtures and compiles/runs all 18 Rust and 18 C# lesson/scenario examples, comparing their output. It writes authoring fixtures to an OS temporary directory. Learner code is never executed by the app.

## Local data and Google AI

Progress uses `codebadger.progress.v2` and namespaced concept IDs such as `rust:variables`. Existing v1 C++ stages and attempts migrate automatically; the original v1 key is retained. Workspace navigation uses `codebadger.workspace.v2`; optional AI settings keep `codebadger.google-ai-settings`. Blocked storage falls back to in-memory practice with export still available. Corrupt progress is ignored safely. Cross-device transfer is manual through progress backups; there is no automatic sync.

Google generation sends your saved key directly to Google's API and consumes your account's quota. All core practice works without it. The key is accessible to scripts on this origin; don't use a shared provider key in a public static app. A shared-key deployment would need a protected server endpoint. Generation is cancelled when selections change or the view unmounts, times out after 20 seconds, rejects malformed/oversized targets, and leaves local practice available on failure. Generated code is not compiled.

## Hosting

The app builds to static files with native base path `/codebadger` and canonical site `https://philippeho.dev`. Host `dist/` at that base path; keep asset requests under `/codebadger/_astro/`. For a Coolify path domain, disable Strip Prefix because the app owns its base path.

Production is a Git-backed Coolify Dockerfile app named `codebadger`, UUID `cyqpam51he0azzkx9drwbdxi`, on Hetzner. It tracks `PhilHo-Projects/CodeBadger` branch `main` and serves `https://philippeho.dev/codebadger`. Native prefix handling is enabled (`is_stripprefix_enabled=false`). The image builds with Node 22 and serves static assets through Nginx on container port 8080, with `/health` for health checks. No host port or persistent volume is required.

CI runs tests, type checks, and the production build, and uploads the resulting `dist` artifact. Pushes do **not** deploy: Coolify automatic deployment is disabled and there is no release webhook. After checks pass, manually deploy UUID `cyqpam51he0azzkx9drwbdxi` in Coolify or through `POST /api/v1/deploy?uuid=cyqpam51he0azzkx9drwbdxi`, then poll the returned deployment UUID until finished. Verify the public HTML, referenced assets and container health. Further releases use the same resource; use Coolify's retained images for rollback.

`SETUP.md` preserves the original prototype brief; this README describes the current app.

See [ROADMAP.md](ROADMAP.md) for the next learning modes and language candidates.
