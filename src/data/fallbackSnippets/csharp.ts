import { buildSnippetLibrary } from "./shared";

export const csharpSnippets = buildSnippetLibrary("csharp", [
  {
    slug: "countdown-loop",
    difficulty: "easy",
    topic: "loops",
    code: `
for (int i = 5; i >= 1; i--)
{
    Console.WriteLine(i);
}
`
  },
  {
    slug: "array-average",
    difficulty: "easy",
    topic: "arrays",
    code: `
int[] scores = { 14, 18, 21, 19 };
int total = 0;
for (int i = 0; i < scores.Length; i++)
{
    total += scores[i];
}
double average = total / (double)scores.Length;
`
  },
  {
    slug: "string-initials",
    difficulty: "easy",
    topic: "strings",
    code: `
string name = "honey badger";
string[] parts = name.Split(' ');
string initials = "";
for (int i = 0; i < parts.Length; i++)
{
    initials += char.ToUpper(parts[i][0]);
}
`
  },
  {
    slug: "collect-evens",
    difficulty: "easy",
    topic: "collections",
    code: `
var values = new List<int> { 3, 4, 7, 8, 12 };
var evens = new List<int>();
for (int i = 0; i < values.Count; i++)
{
    if (values[i] % 2 == 0)
    {
        evens.Add(values[i]);
    }
}
`
  },
  {
    slug: "player-state-class",
    difficulty: "easy",
    topic: "classes",
    code: `
public class PlayerState
{
    public string Name { get; set; } = "Nova";
    public int Health { get; set; } = 100;

    public bool IsAlive()
    {
        return Health > 0;
    }
}
`
  },
  {
    slug: "score-dictionary",
    difficulty: "medium",
    topic: "algorithms",
    code: `
var scores = new Dictionary<string, int>();
string[] players = { "Ana", "Bea", "Ana", "Cy" };
for (int i = 0; i < players.Length; i++)
{
    scores[players[i]] = scores.GetValueOrDefault(players[i], 0) + 1;
}
`
  },
  {
    slug: "move-toward-target",
    difficulty: "medium",
    topic: "game-dev",
    code: `
float position = 2.5f;
float target = 9.0f;
float speed = 1.25f;
while (position < target)
{
    position = Math.Min(position + speed, target);
}
`
  },
  {
    slug: "grid-sum",
    difficulty: "medium",
    topic: "loops",
    code: `
int[,] grid =
{
    { 1, 2, 3 },
    { 4, 5, 6 }
};
int total = 0;
for (int row = 0; row < grid.GetLength(0); row++)
{
    for (int col = 0; col < grid.GetLength(1); col++)
    {
        total += grid[row, col];
    }
}
`
  },
  {
    slug: "rotate-left",
    difficulty: "medium",
    topic: "arrays",
    code: `
int[] numbers = { 4, 8, 15, 16, 23, 42 };
int first = numbers[0];
for (int i = 1; i < numbers.Length; i++)
{
    numbers[i - 1] = numbers[i];
}
numbers[^1] = first;
`
  },
  {
    slug: "run-length",
    difficulty: "medium",
    topic: "strings",
    code: `
string text = "aaabbcccc";
int run = 1;
for (int i = 1; i <= text.Length; i++)
{
    bool changed = i == text.Length || text[i] != text[i - 1];
    if (changed)
    {
        Console.WriteLine($"{text[i - 1]}:{run}");
        run = 1;
    }
    else
    {
        run++;
    }
}
`
  },
  {
    slug: "word-count",
    difficulty: "medium",
    topic: "collections",
    code: `
string[] words = { "map", "loop", "map", "array" };
var counts = new Dictionary<string, int>();
foreach (string word in words)
{
    counts[word] = counts.GetValueOrDefault(word, 0) + 1;
}
`
  },
  {
    slug: "loadout-class",
    difficulty: "medium",
    topic: "classes",
    code: `
public class Loadout
{
    public string Primary { get; set; } = "Pulse";
    public string Secondary { get; set; } = "Burst";

    public string Summary()
    {
        return $"{Primary} / {Secondary}";
    }
}
`
  },
  {
    slug: "selection-pass",
    difficulty: "medium",
    topic: "algorithms",
    code: `
int[] values = { 9, 3, 6, 1 };
for (int start = 0; start < values.Length - 1; start++)
{
    int smallest = start;
    for (int i = start + 1; i < values.Length; i++)
    {
        if (values[i] < values[smallest])
        {
            smallest = i;
        }
    }

    (values[start], values[smallest]) = (values[smallest], values[start]);
}
`
  },
  {
    slug: "cooldown-tick",
    difficulty: "medium",
    topic: "game-dev",
    code: `
float cooldown = 3.5f;
float deltaTime = 0.16f;
while (cooldown > 0)
{
    cooldown = Math.Max(0, cooldown - deltaTime);
}
`
  },
  {
    slug: "drain-queue",
    difficulty: "medium",
    topic: "collections",
    code: `
var queue = new Queue<string>();
queue.Enqueue("spawn");
queue.Enqueue("aim");
queue.Enqueue("fire");
while (queue.Count > 0)
{
    string next = queue.Dequeue();
    Console.WriteLine(next);
}
`
  },
  {
    slug: "linked-window",
    difficulty: "hard",
    topic: "algorithms",
    code: `
var values = new LinkedList<int>(new[] { 2, 4, 6, 8, 10 });
var node = values.First;
int window = 0;
while (node != null && node.Next != null)
{
    window = node.Value + node.Next.Value;
    Console.WriteLine(window);
    node = node.Next;
}
`
  },
  {
    slug: "turn-order",
    difficulty: "hard",
    topic: "classes",
    code: `
public class TurnOrder
{
    private readonly Queue<string> _actors = new(["Tank", "Mage", "Scout"]);

    public string Advance()
    {
        string current = _actors.Dequeue();
        _actors.Enqueue(current);
        return current;
    }
}
`
  },
  {
    slug: "flood-fill-step",
    difficulty: "hard",
    topic: "game-dev",
    code: `
var frontier = new Queue<(int Row, int Col)>();
var visited = new HashSet<(int Row, int Col)>();
frontier.Enqueue((0, 0));
while (frontier.Count > 0)
{
    var cell = frontier.Dequeue();
    if (!visited.Add(cell))
    {
        continue;
    }
}
`
  },
  {
    slug: "diagonal-match",
    difficulty: "hard",
    topic: "arrays",
    code: `
int[,] board =
{
    { 7, 0, 0 },
    { 0, 7, 0 },
    { 0, 0, 7 }
};
bool match = true;
for (int i = 0; i < board.GetLength(0); i++)
{
    match &= board[i, i] == 7;
}
`
  },
  {
    slug: "bracket-balance",
    difficulty: "hard",
    topic: "algorithms",
    code: `
string text = "{[()]}";
var stack = new Stack<char>();
foreach (char ch in text)
{
    if (ch is '{' or '[' or '(')
    {
        stack.Push(ch);
    }
    else if (stack.Count > 0)
    {
        stack.Pop();
    }
}
`
  }
]);
