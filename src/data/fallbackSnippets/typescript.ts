import { buildSnippetLibrary } from "./shared";

export const typescriptSnippets = buildSnippetLibrary("typescript", [
  {
    slug: "for-loop-total",
    difficulty: "easy",
    topic: "loops",
    code: `
const values = [3, 5, 8, 13];
let total = 0;
for (let index = 0; index < values.length; index += 1) {
    total += values[index];
}
`
  },
  {
    slug: "trim-empty-entries",
    difficulty: "easy",
    topic: "arrays",
    code: `
const raw = ["api", "", "cache", ""];
const clean: string[] = [];
for (const entry of raw) {
    if (entry.length > 0) {
        clean.push(entry);
    }
}
`
  },
  {
    slug: "slugify-title",
    difficulty: "easy",
    topic: "strings",
    code: `
const title = "Code Badger";
const slug = title
    .toLowerCase()
    .replaceAll(" ", "-");
`
  },
  {
    slug: "map-player-score",
    difficulty: "easy",
    topic: "collections",
    code: `
const scores = new Map<string, number>();
scores.set("nova", 12);
scores.set("ember", 18);
const lead = scores.get("ember") ?? 0;
`
  },
  {
    slug: "player-class",
    difficulty: "easy",
    topic: "classes",
    code: `
class Player {
    constructor(public name: string, public health = 100) {}

    isAlive(): boolean {
        return this.health > 0;
    }
}
`
  },
  {
    slug: "pair-scan",
    difficulty: "medium",
    topic: "algorithms",
    code: `
const values = [2, 7, 11, 15];
const seen = new Map<number, number>();
for (let index = 0; index < values.length; index += 1) {
    const gap = 9 - values[index];
    if (seen.has(gap)) {
        console.log([seen.get(gap), index]);
    }
    seen.set(values[index], index);
}
`
  },
  {
    slug: "velocity-step",
    difficulty: "medium",
    topic: "game-dev",
    code: `
let position = 12;
let velocity = -3;
const floor = 0;
while (position > floor) {
    position = Math.max(floor, position + velocity);
}
`
  },
  {
    slug: "matrix-walk",
    difficulty: "medium",
    topic: "loops",
    code: `
const grid = [
    [1, 2, 3],
    [4, 5, 6]
];
let total = 0;
for (const row of grid) {
    for (const value of row) {
        total += value;
    }
}
`
  },
  {
    slug: "rotate-array",
    difficulty: "medium",
    topic: "arrays",
    code: `
const items = ["alpha", "beta", "gamma", "delta"];
const first = items.shift();
if (first) {
    items.push(first);
}
`
  },
  {
    slug: "camel-from-words",
    difficulty: "medium",
    topic: "strings",
    code: `
const parts = ["typing", "game", "mode"];
const camel = parts
    .map((part, index) => index === 0 ? part : part[0].toUpperCase() + part.slice(1))
    .join("");
`
  },
  {
    slug: "word-frequency",
    difficulty: "medium",
    topic: "collections",
    code: `
const words = ["loop", "array", "loop", "class"];
const counts = new Map<string, number>();
for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
}
`
  },
  {
    slug: "loadout-class",
    difficulty: "medium",
    topic: "classes",
    code: `
class Loadout {
    constructor(
        readonly primary: string,
        readonly secondary: string
    ) {}

    summary(): string {
        return \`\${this.primary} / \${this.secondary}\`;
    }
}
`
  },
  {
    slug: "selection-pass",
    difficulty: "medium",
    topic: "algorithms",
    code: `
const values = [8, 3, 5, 1];
for (let start = 0; start < values.length - 1; start += 1) {
    let lowest = start;
    for (let index = start + 1; index < values.length; index += 1) {
        if (values[index] < values[lowest]) {
            lowest = index;
        }
    }
    [values[start], values[lowest]] = [values[lowest], values[start]];
}
`
  },
  {
    slug: "cooldown-reduce",
    difficulty: "medium",
    topic: "game-dev",
    code: `
let cooldown = 2.4;
const delta = 0.16;
while (cooldown > 0) {
    cooldown = Math.max(0, cooldown - delta);
}
`
  },
  {
    slug: "set-deduplicate",
    difficulty: "medium",
    topic: "collections",
    code: `
const names = ["bee", "badger", "bee", "fox"];
const unique = new Set<string>();
for (const name of names) {
    unique.add(name);
}
`
  },
  {
    slug: "linked-window",
    difficulty: "hard",
    topic: "algorithms",
    code: `
type Node = { value: number; next: Node | null };

let current: Node | null = { value: 3, next: { value: 5, next: { value: 8, next: null } } };
while (current && current.next) {
    const windowTotal = current.value + current.next.value;
    console.log(windowTotal);
    current = current.next;
}
`
  },
  {
    slug: "initiative-order",
    difficulty: "hard",
    topic: "classes",
    code: `
class Initiative {
    constructor(private queue = ["tank", "mage", "scout"]) {}

    advance(): string {
        const current = this.queue.shift() ?? "none";
        this.queue.push(current);
        return current;
    }
}
`
  },
  {
    slug: "flood-frontier",
    difficulty: "hard",
    topic: "game-dev",
    code: `
const frontier: Array<[number, number]> = [[0, 0]];
const visited = new Set<string>();
while (frontier.length > 0) {
    const [row, col] = frontier.shift()!;
    const key = \`\${row}:\${col}\`;
    if (visited.has(key)) {
        continue;
    }
    visited.add(key);
}
`
  },
  {
    slug: "diagonal-check",
    difficulty: "hard",
    topic: "arrays",
    code: `
const board = [
    [7, 0, 0],
    [0, 7, 0],
    [0, 0, 7]
];
let matches = true;
for (let index = 0; index < board.length; index += 1) {
    matches = matches && board[index][index] === 7;
}
`
  },
  {
    slug: "stack-balance",
    difficulty: "hard",
    topic: "algorithms",
    code: `
const text = "{[()]}";
const stack: string[] = [];
for (const char of text) {
    if ("{[(".includes(char)) {
        stack.push(char);
        continue;
    }
    stack.pop();
}
`
  }
]);
