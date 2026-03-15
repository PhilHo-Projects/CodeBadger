# CodeBadger / TypeCode — 1-shot build plan

This is going to be a rip off of Monkeytype, the typing game online.
Cept with code l0l
And instead of a monkey it's a honey badger lol

## Goal

Build a small web app that feels like a stylish IDE-themed typing game for programmers.

The user selects a language, receives a generated code snippet, and must type it exactly.
The app scores mainly by:
- typo count
- completion time
- accuracy

The initial scope is intentionally narrow so the whole thing can be one-shotted by an LLM and cleaned up afterward.

---

## Product vision

This is basically:

- Monkeytype-style typing flow
- but with real code snippets
- presented like an IDE editor
- with syntax highlighting
- and an optional LLM-generated stream of fresh practice snippets

Primary use case:
- programmers who got rusty on raw syntax because of heavy AI usage
- interview prep
- quick warm-up reps before technical tests

---

## V1 scope

### Must have
- language selector
  - C#
  - C++
  - TypeScript
  - Python
- one code block shown at a time
- user types against that block
- per-character correctness highlighting
- prevent block completion until fully correct
- WPM
- accuracy
- typo count
- timer
- next snippet button
- generate snippet button
- IDE-like dark UI

### Nice to have if easy
- difficulty selector
  - easy
  - medium
  - hard
- snippet type selector
  - loops
  - collections
  - classes
  - algorithms
  - game-dev flavored
- local recent history
- streak counter
- animation polish

### Not in V1
- auth
- database
- multiplayer
- leaderboards
- accounts
- payments
- saved profiles
- social features
- full fake IDE features
- code execution
- autocomplete
- mobile-first perfection

---

## Recommended stack

### Frontend shell
- Astro

Reason:
- fast to scaffold
- clean structure
- minimal overhead
- good for landing-page + app hybrid if expanded later

### Interactive island
- React inside Astro

Reason:
- easiest path for LLM generation
- easiest state management for a typing UI
- easiest ecosystem for syntax components and keyboard handling

### Styling
- Tailwind CSS

Reason:
- fast iteration
- easy dark theme
- simple token-based design system
- very easy for Codex to generate and refactor

### Syntax highlighting
Choose one:
- Shiki preferred
- Prism acceptable

Recommendation:
- use **Shiki** for display rendering
- use custom per-character overlay logic for correctness

Reason:
- Shiki looks closer to editor-grade highlighting
- better “IDE vibe”

### Backend
- Astro API routes

Reason:
- enough for one small endpoint
- no separate backend service needed in V1

### LLM integration
- one server endpoint that calls an external model API to generate code snippets
- keep provider abstracted behind a small service file

Reason:
- easy to swap providers later
- avoids provider-specific mess leaking into UI code

---

## High-level architecture

```text
src/
  pages/
    index.astro
    api/
      generate-snippet.ts

  components/
    TypingGame.tsx
    EditorWindow.tsx
    StatsBar.tsx
    ControlsBar.tsx
    CompletionModal.tsx

  lib/
    snippetService.ts
    score.ts
    tokenize.ts
    theme.ts
    promptTemplates.ts

  data/
    fallbackSnippets/
      csharp.ts
      cpp.ts
      typescript.ts
      python.ts

  styles/
    global.css
```

---

## Core flow

1. user opens app
2. chooses language
3. app loads a snippet
   - from fallback local snippets first
   - or from API-generated snippet
4. snippet appears in an editor-like window
5. user types
6. app compares typed input against target
7. correct chars are locked visually
8. wrong chars are highlighted immediately
9. block is only considered complete when exact
10. show results
11. load next block

---

## Product behavior details

### Typing behavior
- user types naturally into a hidden textarea
- visible code area is rendered separately
- no normal input box visible
- editor area should feel like typing directly in code

### Error handling
Use strict mode for V1:
- if current typed character is wrong, mark it wrong
- do not allow silent skipping
- completion only happens when the entire snippet matches exactly

Optional later:
- “forgiving mode”
- “stop on error mode”
- “strict exact mode”

### Snippet completion
When a snippet is fully correct:
- freeze the block
- show fully syntax-colored final state
- show stats
- enable next snippet

### Scoring
Primary ranking formula for V1:
- lower typos is better
- then faster completion time
- then higher accuracy

Also display:
- raw WPM
- corrected WPM
- accuracy %
- typo count
- elapsed time

---

## Game modes

### V1 default mode
**Block Mode**
- a complete code snippet is shown
- type it exactly
- finish cleanly
- move to next

### Later mode
**Chunk Mode**
- code appears one logical chunk at a time
- like:
  - `for (...)`
  - then `{`
  - then next line
- good for memory and rhythm

### Much later mode
**Blind Prompt Mode**
- user gets:
  - “write a for loop over a List<int> in C#”
- they type from memory
- validated by parser / heuristic / LLM judge
- definitely not V1

---

## Snippet generation strategy

Use **two sources**:

### 1. local fallback snippets
These guarantee the app always works even if API fails.

Use curated snippets for each language:
- loops
- arrays
- dictionaries/maps
- classes
- sorting
- simple functions
- common interview patterns
- game-dev flavored snippets

### 2. LLM-generated snippets
Used when the player clicks “Generate”.

Requirements for generated snippets:
- short enough to type in 20–90 seconds
- valid syntax
- no weird dependencies
- no giant boilerplate
- no comments unless requested
- no markdown fences
- no explanations
- plain code only

---

## Prompt design for snippet generation

Create prompt templates per language and difficulty.

### Example system prompt
You generate short, realistic, syntactically correct code snippets for typing practice.
Return code only.
Do not include markdown fences.
Do not include explanations.
Do not include imports unless necessary.
Keep snippets between 3 and 12 lines.
Prefer interview-style or everyday coding constructs.

### Example user payload
Language: C#
Difficulty: medium
Topic: collections
Style: realistic IDE code
Constraints:
- valid syntax
- 5 to 10 lines
- no comments
- no using statements unless necessary
- should be typable in under 45 seconds

### Good topic buckets
- loops
- arrays
- strings
- classes
- dictionaries
- recursion
- sorting
- linq for C#
- vectors / gameplay logic for game-dev flavor

---

## Recommended endpoint contract

### POST `/api/generate-snippet`

Request:
```json
{
  "language": "csharp",
  "difficulty": "medium",
  "topic": "collections"
}
```

Response:
```json
{
  "snippet": "for (int i = 0; i < items.Count; i++)\n{\n    Console.WriteLine(items[i]);\n}",
  "language": "csharp",
  "difficulty": "medium",
  "topic": "collections",
  "source": "llm"
}
```

If generation fails:
- return one fallback snippet instead
- never break the gameplay flow

---

## State model for the React island

Suggested state:

```ts
type Language = "csharp" | "cpp" | "typescript" | "python"
type Difficulty = "easy" | "medium" | "hard"

type SnippetRound = {
  language: Language
  difficulty: Difficulty
  topic?: string
  targetText: string
  typedText: string
  startedAt: number | null
  endedAt: number | null
  typoCount: number
  isComplete: boolean
  source: "fallback" | "llm"
}
```

---

## Rendering strategy

### Best approach
Render the target text as a sequence of characters/tokens.

For each visible character:
- untouched
- correct
- incorrect
- current cursor position

This gives Monkeytype-style feedback.

### Important detail
Keep the syntax colors and the correctness colors separate.

Do not let correctness styling destroy syntax readability.

Use two layers mentally:
- syntax layer
- typing status layer

Implementation options:
1. tokenize syntax first, then decorate chars
2. simpler V1: render plain text char-by-char with IDE-like palette around it

Recommended V1:
- use syntax-highlighted display for untouched/final code
- use per-character correctness overlay during active typing
- accept slightly simplified syntax fidelity during typing if needed

---

## UI structure

### Page layout
- centered app shell
- top toolbar
- large editor panel
- bottom stats row
- small footer note

### Main regions
1. Header
   - app name
   - tagline
2. Controls bar
   - language dropdown
   - difficulty dropdown
   - topic dropdown
   - generate button
   - next snippet button
3. Editor window
   - fake IDE chrome
   - filename tab
   - line numbers
   - code area
4. Stats bar
   - WPM
   - accuracy
   - typos
   - elapsed
5. completion card/modal

---

## Visual direction

### Desired vibe
- hackerman
- polished
- editor-like
- not terminal-like
- feels like Rider / JetBrains dark editor more than a shell

### Theme notes
JetBrains Rider currently distinguishes between UI themes and editor color schemes, with dark options like **Rider Night**, and editor syntax colors are configured separately in the color scheme settings rather than being one single fixed palette. JetBrains also documents semantic highlighting separately, so a perfect clone is unnecessary for V1; aim for a **Rider-inspired dark editor feel**, not a literal reproduction. :contentReference[oaicite:0]{index=0}

### Practical palette strategy
Use a **Rider-inspired approximation**:

- app background: near-black blue-gray
- panel background: slightly lifted dark slate
- editor background: deep charcoal
- default text: cool light gray
- keyword: purple
- type names: desaturated gold / warm yellow
- strings: green
- numbers: blue-ish cyan
- function names: pale yellow or soft blue
- comments: muted gray-green
- error red: muted pink-red
- correct green: bright but not neon
- cursor: electric cyan or magenta accent

### Tailwind token idea
Define CSS variables:
- `--bg-app`
- `--bg-panel`
- `--bg-editor`
- `--text-main`
- `--text-muted`
- `--syntax-keyword`
- `--syntax-type`
- `--syntax-string`
- `--syntax-number`
- `--syntax-function`
- `--state-correct`
- `--state-error`
- `--accent`

Then map them in Tailwind via custom theme extension.

---

## UX details that matter a lot

### Must feel smooth
- instant key response
- no lag on highlight
- clear cursor position
- line numbers stable
- code font with good ligatures optional but not required

### Strong polish wins
- tiny glow on active editor border
- subtle completion animation
- smooth stat count-up
- tab-like filename area
- fake gutter and line highlight

### Keep input invisible
Use a hidden textarea for keyboard capture.
The visible editor is the rendered surface.

That is the cleanest path.

---

## Data model for fallback snippets

Use curated arrays.

Example:

```ts
export const csharpSnippets = [
  {
    topic: "loops",
    difficulty: "easy",
    code: `for (int i = 0; i < items.Count; i++)
{
    Console.WriteLine(items[i]);
}`
  }
]
```

Include:
- 20 snippets per language for V1 minimum
- 5 easy
- 10 medium
- 5 hard

That is already enough for the first release.

---

## Scoring formulas

### Accuracy
```ts
accuracy = correctChars / totalTypedChars
```

### WPM
```ts
wpm = (correctChars / 5) / elapsedMinutes
```

### Corrected score idea
```ts
score = max(0, round((accuracy * 100) - typoCount - elapsedSeconds * 0.2))
```

But for display, keep:
- WPM
- Accuracy
- Typos
- Time

Do not overcomplicate ranking in V1.

---

## Edge cases

- API fails -> use fallback snippet
- empty response -> use fallback snippet
- user changes language mid-round -> reset round
- pasted text -> disable or ignore paste
- tab key -> either insert spaces or prevent default
- newline handling -> preserve exact line breaks
- Windows line endings -> normalize to `\n`
- very long snippet -> reject before display
- weird unicode quotes from model -> sanitize
- markdown fences from model -> strip before use

---

## Security / backend notes

### Keep API key server-side only
Never expose provider keys in the client.

### Rate limit lightly if deployed
Simple per-IP throttle is enough later.
Not needed for local prototype.

### Sanitize model output
Before returning generated code:
- strip triple backticks
- trim leading/trailing whitespace
- reject giant blocks
- reject empty output

---

## Build order for Codex

### Pass 1
Scaffold:
- Astro app
- React integration
- Tailwind
- page layout
- dark theme shell

### Pass 2
Implement local-only typing loop:
- load fallback snippet
- hidden textarea
- char-by-char comparison
- stats
- next snippet

### Pass 3
Implement editor look:
- line numbers
- fake IDE chrome
- syntax-ish color styling
- completion state polish

### Pass 4
Implement API route:
- generate snippet endpoint
- provider abstraction
- prompt templates
- fallback behavior

### Pass 5
Refine:
- difficulty/topic selectors
- better palette
- animation and polish
- cleanup
- README

---

## Definition of done for V1

The app is done when:

- it launches locally with one command
- user can choose a language
- a snippet appears immediately
- typing works without visible input box
- wrong chars visibly fail
- snippet only completes when exact
- stats are shown correctly
- next snippet works
- generate snippet works through server API
- fallback snippets still work if API is off
- UI looks like a believable code editor, not a generic form

---

## Suggested prompt to give Codex

Build a small Astro app with Tailwind and one React island called TypingGame.
The app is a code typing trainer with an IDE-like dark theme.
Requirements:
- language selector: C#, C++, TypeScript, Python
- hidden textarea for keyboard capture
- visible code editor surface with line numbers
- per-character correctness highlighting
- completion only when typed text exactly matches target
- display WPM, accuracy, typo count, elapsed time
- next snippet button
- generate snippet button
- local fallback snippet sets for each language
- Astro API route `/api/generate-snippet`
- provider abstraction file for LLM snippet generation
- return plain code only
- Tailwind theme should feel Rider-inspired dark editor
- organize files cleanly
- keep code small, readable, and production-sane
- no database
- no auth
- no multiplayer

Start with fallback local snippets first, then wire in the API route.

---

## Personal note on scope discipline

If the LLM starts adding:
- auth
- Prisma
- user accounts
- leaderboard
- persistent DB
- websocket live races
- Monaco editor
- code execution sandbox

cut it immediately.

That is how a 1-shot build turns into a bloated mess.

This project should feel like:
- one page
- one game loop
- one clean backend endpoint
- one strong visual identity

That is the winning version.