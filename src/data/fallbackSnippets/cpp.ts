import { buildSnippetLibrary } from "./shared";

export const cppSnippets = buildSnippetLibrary("cpp", [
  {
    slug: "countdown-loop",
    difficulty: "easy",
    topic: "loops",
    code: `
for (int value = 5; value >= 1; --value)
{
    std::cout << value << "\\n";
}
`
  },
  {
    slug: "positive-values",
    difficulty: "easy",
    topic: "arrays",
    code: `
std::vector<int> values = { -3, 5, 0, 9, 12 };
std::vector<int> positive;
for (int value : values)
{
    if (value > 0)
    {
        positive.push_back(value);
    }
}
`
  },
  {
    slug: "slugify-title",
    difficulty: "easy",
    topic: "strings",
    code: `
std::string title = "Code Badger";
for (char& ch : title)
{
    if (ch == ' ')
    {
        ch = '-';
    }
}
`
  },
  {
    slug: "score-map",
    difficulty: "easy",
    topic: "collections",
    code: `
std::unordered_map<std::string, int> scores;
scores["nova"] = 12;
scores["ember"] = 18;
int lead = scores["ember"];
`
  },
  {
    slug: "player-struct",
    difficulty: "easy",
    topic: "classes",
    code: `
struct Player
{
    std::string name = "Nova";
    int health = 100;

    bool IsAlive() const
    {
        return health > 0;
    }
};
`
  },
  {
    slug: "pair-scan",
    difficulty: "medium",
    topic: "algorithms",
    code: `
std::vector<int> values = { 2, 7, 11, 15 };
std::unordered_map<int, int> seen;
for (int index = 0; index < static_cast<int>(values.size()); ++index)
{
    int gap = 9 - values[index];
    if (seen.contains(gap))
    {
        std::cout << seen[gap] << "," << index << "\\n";
    }
    seen[values[index]] = index;
}
`
  },
  {
    slug: "move-to-target",
    difficulty: "medium",
    topic: "game-dev",
    code: `
float position = 2.5f;
float target = 9.0f;
float speed = 1.25f;
while (position < target)
{
    position = std::min(position + speed, target);
}
`
  },
  {
    slug: "grid-sum",
    difficulty: "medium",
    topic: "loops",
    code: `
std::vector<std::vector<int>> grid = {
    { 1, 2, 3 },
    { 4, 5, 6 }
};
int total = 0;
for (const auto& row : grid)
{
    for (int value : row)
    {
        total += value;
    }
}
`
  },
  {
    slug: "rotate-left",
    difficulty: "medium",
    topic: "arrays",
    code: `
std::vector<int> values = { 4, 8, 15, 16, 23, 42 };
int first = values.front();
values.erase(values.begin());
values.push_back(first);
`
  },
  {
    slug: "camel-words",
    difficulty: "medium",
    topic: "strings",
    code: `
std::vector<std::string> parts = { "typing", "game", "mode" };
std::string camel = parts.front();
for (size_t index = 1; index < parts.size(); ++index)
{
    camel += static_cast<char>(std::toupper(parts[index][0]));
    camel += parts[index].substr(1);
}
`
  },
  {
    slug: "word-frequency",
    difficulty: "medium",
    topic: "collections",
    code: `
std::vector<std::string> words = { "loop", "array", "loop", "class" };
std::unordered_map<std::string, int> counts;
for (const std::string& word : words)
{
    counts[word] += 1;
}
`
  },
  {
    slug: "loadout-class",
    difficulty: "medium",
    topic: "classes",
    code: `
class Loadout
{
public:
    Loadout(std::string primary, std::string secondary)
        : primary(std::move(primary)), secondary(std::move(secondary)) {}

    std::string Summary() const
    {
        return primary + " / " + secondary;
    }

private:
    std::string primary;
    std::string secondary;
};
`
  },
  {
    slug: "selection-pass",
    difficulty: "medium",
    topic: "algorithms",
    code: `
std::vector<int> values = { 9, 3, 6, 1 };
for (size_t start = 0; start + 1 < values.size(); ++start)
{
    size_t smallest = start;
    for (size_t index = start + 1; index < values.size(); ++index)
    {
        if (values[index] < values[smallest])
        {
            smallest = index;
        }
    }
    std::swap(values[start], values[smallest]);
}
`
  },
  {
    slug: "cooldown-tick",
    difficulty: "medium",
    topic: "game-dev",
    code: `
float cooldown = 3.5f;
float delta = 0.16f;
while (cooldown > 0.0f)
{
    cooldown = std::max(0.0f, cooldown - delta);
}
`
  },
  {
    slug: "dedupe-names",
    difficulty: "medium",
    topic: "collections",
    code: `
std::vector<std::string> names = { "bee", "badger", "bee", "fox" };
std::unordered_map<std::string, bool> seen;
std::vector<std::string> unique;
for (const std::string& name : names)
{
    if (!seen[name])
    {
        seen[name] = true;
        unique.push_back(name);
    }
}
`
  },
  {
    slug: "linked-window",
    difficulty: "hard",
    topic: "algorithms",
    code: `
struct Node
{
    int value;
    Node* next;
};

Node third{ 8, nullptr };
Node second{ 5, &third };
Node first{ 3, &second };
for (Node* current = &first; current && current->next; current = current->next)
{
    std::cout << current->value + current->next->value << "\\n";
}
`
  },
  {
    slug: "turn-order",
    difficulty: "hard",
    topic: "classes",
    code: `
class TurnOrder
{
public:
    std::string Advance()
    {
        std::string current = queue.front();
        queue.pop_front();
        queue.push_back(current);
        return current;
    }

private:
    std::deque<std::string> queue{ "tank", "mage", "scout" };
};
`
  },
  {
    slug: "frontier-visit",
    difficulty: "hard",
    topic: "game-dev",
    code: `
std::queue<std::pair<int, int>> frontier;
std::set<std::pair<int, int>> visited;
frontier.push({ 0, 0 });
while (!frontier.empty())
{
    auto cell = frontier.front();
    frontier.pop();
    if (visited.contains(cell))
    {
        continue;
    }
    visited.insert(cell);
}
`
  },
  {
    slug: "diagonal-match",
    difficulty: "hard",
    topic: "arrays",
    code: `
std::vector<std::vector<int>> board = {
    { 7, 0, 0 },
    { 0, 7, 0 },
    { 0, 0, 7 }
};
bool matches = true;
for (size_t index = 0; index < board.size(); ++index)
{
    matches = matches && board[index][index] == 7;
}
`
  },
  {
    slug: "stack-balance",
    difficulty: "hard",
    topic: "algorithms",
    code: `
std::string text = "{[()]}";
std::vector<char> stack;
for (char ch : text)
{
    if (ch == '{' || ch == '[' || ch == '(')
    {
        stack.push_back(ch);
    }
    else if (!stack.empty())
    {
        stack.pop_back();
    }
}
`
  }
]);
