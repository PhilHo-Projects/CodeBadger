import { buildSnippetLibrary } from "./shared";

export const pythonSnippets = buildSnippetLibrary("python", [
  {
    slug: "countdown-loop",
    difficulty: "easy",
    topic: "loops",
    code: `
for value in range(5, 0, -1):
    print(value)
`
  },
  {
    slug: "collect-positive",
    difficulty: "easy",
    topic: "arrays",
    code: `
values = [-3, 5, 0, 9, 12]
positive = []
for value in values:
    if value > 0:
        positive.append(value)
`
  },
  {
    slug: "slugify-title",
    difficulty: "easy",
    topic: "strings",
    code: `
title = "Code Badger"
slug = title.lower().replace(" ", "-")
`
  },
  {
    slug: "score-map",
    difficulty: "easy",
    topic: "collections",
    code: `
scores = {"nova": 12, "ember": 18}
lead = scores.get("ember", 0)
`
  },
  {
    slug: "player-class",
    difficulty: "easy",
    topic: "classes",
    code: `
class Player:
    def __init__(self, name: str, health: int = 100):
        self.name = name
        self.health = health

    def is_alive(self) -> bool:
        return self.health > 0
`
  },
  {
    slug: "pair-scan",
    difficulty: "medium",
    topic: "algorithms",
    code: `
values = [2, 7, 11, 15]
seen = {}
for index, value in enumerate(values):
    gap = 9 - value
    if gap in seen:
        print((seen[gap], index))
    seen[value] = index
`
  },
  {
    slug: "move-to-target",
    difficulty: "medium",
    topic: "game-dev",
    code: `
position = 2.5
target = 9.0
speed = 1.25
while position < target:
    position = min(position + speed, target)
`
  },
  {
    slug: "grid-sum",
    difficulty: "medium",
    topic: "loops",
    code: `
grid = [
    [1, 2, 3],
    [4, 5, 6],
]
total = 0
for row in grid:
    for value in row:
        total += value
`
  },
  {
    slug: "rotate-left",
    difficulty: "medium",
    topic: "arrays",
    code: `
values = [4, 8, 15, 16, 23, 42]
first = values.pop(0)
values.append(first)
`
  },
  {
    slug: "camel-words",
    difficulty: "medium",
    topic: "strings",
    code: `
parts = ["typing", "game", "mode"]
camel = parts[0]
for part in parts[1:]:
    camel += part[0].upper() + part[1:]
`
  },
  {
    slug: "word-frequency",
    difficulty: "medium",
    topic: "collections",
    code: `
words = ["loop", "array", "loop", "class"]
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
`
  },
  {
    slug: "loadout-class",
    difficulty: "medium",
    topic: "classes",
    code: `
class Loadout:
    def __init__(self, primary: str, secondary: str):
        self.primary = primary
        self.secondary = secondary

    def summary(self) -> str:
        return f"{self.primary} / {self.secondary}"
`
  },
  {
    slug: "selection-pass",
    difficulty: "medium",
    topic: "algorithms",
    code: `
values = [9, 3, 6, 1]
for start in range(len(values) - 1):
    smallest = start
    for index in range(start + 1, len(values)):
        if values[index] < values[smallest]:
            smallest = index
    values[start], values[smallest] = values[smallest], values[start]
`
  },
  {
    slug: "cooldown-tick",
    difficulty: "medium",
    topic: "game-dev",
    code: `
cooldown = 3.5
delta = 0.16
while cooldown > 0:
    cooldown = max(0, cooldown - delta)
`
  },
  {
    slug: "dedupe-seen",
    difficulty: "medium",
    topic: "collections",
    code: `
names = ["bee", "badger", "bee", "fox"]
unique = []
seen = set()
for name in names:
    if name not in seen:
        seen.add(name)
        unique.append(name)
`
  },
  {
    slug: "linked-window",
    difficulty: "hard",
    topic: "algorithms",
    code: `
class Node:
    def __init__(self, value: int, next_node: "Node | None" = None):
        self.value = value
        self.next = next_node

current = Node(3, Node(5, Node(8)))
while current and current.next:
    print(current.value + current.next.value)
    current = current.next
`
  },
  {
    slug: "turn-order",
    difficulty: "hard",
    topic: "classes",
    code: `
class TurnOrder:
    def __init__(self):
        self.queue = ["tank", "mage", "scout"]

    def advance(self) -> str:
        current = self.queue.pop(0)
        self.queue.append(current)
        return current
`
  },
  {
    slug: "frontier-visit",
    difficulty: "hard",
    topic: "game-dev",
    code: `
frontier = [(0, 0)]
visited = set()
while frontier:
    row, col = frontier.pop(0)
    key = (row, col)
    if key in visited:
        continue
    visited.add(key)
`
  },
  {
    slug: "diagonal-match",
    difficulty: "hard",
    topic: "arrays",
    code: `
board = [
    [7, 0, 0],
    [0, 7, 0],
    [0, 0, 7],
]
matches = True
for index in range(len(board)):
    matches = matches and board[index][index] == 7
`
  },
  {
    slug: "stack-balance",
    difficulty: "hard",
    topic: "algorithms",
    code: `
text = "{[()]}"
stack = []
for char in text:
    if char in "{[(":
        stack.append(char)
    else:
        stack.pop()
`
  }
]);
