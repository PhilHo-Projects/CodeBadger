# CodeBadger

CodeBadger is a one-page Astro app for typing real code snippets in an IDE-style shell. The current build is local-first: it ships curated fallback snippet sets for C#, C++, TypeScript, and Python, and it can optionally generate fresh snippets with Google AI when you save an API key locally in the browser.

## Local setup

```bash
npm install
npm run dev
```

Useful scripts:

- `npm run build` builds the static app.
- `npm run check` runs Astro type checks.
- `npm run test` runs the Vitest suite for scoring and snippet selection.

## What ships in V1

- Hidden-textarea typing flow with exact-match completion
- Language, difficulty, and topic selectors
- Rider-inspired dark editor shell with line numbers and syntax-ish coloring
- Curated fallback libraries with 20 snippets per language
- Live WPM, accuracy, typo, elapsed-time, and progress stats
- Google AI settings modal with local-only API key storage
- Optional generated snippets through the Google AI `generateContent` API

## Google AI notes

The Google AI key is stored in browser `localStorage`, not in tracked repo files. This avoids accidental Git commits in the current static Astro setup, but it is still a client-side key. For a future deployed version, move generation behind a server-only endpoint and keep the key in `.env.local` or platform secrets.

If you want to reserve a local server-side secret file now, `.env.local` is already ignored by [`.gitignore`](D:/WebDev/CodeBadger/.gitignore).
