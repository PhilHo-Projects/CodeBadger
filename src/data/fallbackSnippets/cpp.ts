import { buildSnippetLibrary } from "./shared";

export const cppSnippets = buildSnippetLibrary("cpp", [
  {
    slug: "countdown-timer",
    difficulty: "easy",
    topic: "loops",
    title: "Countdown Timer",
    description:
      "Count down from 3 to 1 with a while loop, then print a completion message.",
    lineHints: [
      { line: 1, text: "Start with a timer value." },
      { line: 2, text: "Keep looping while there is still time left." },
      { line: 5, text: "Decrease the timer after printing." },
      { line: 7, text: "Print a final message after the loop ends." },
    ],
    code: `
int timer = 3;
while (timer > 0)
{
    std::cout << timer << "\\n";
    --timer;
}
std::cout << "Go!\\n";
`,
  },
  {
    slug: "checkpoint-filter",
    difficulty: "easy",
    topic: "loops",
    title: "Checkpoint Filter",
    description:
      "Print checkpoint values at least 10 using a range-based loop and an if statement.",
    lineHints: [
      { line: 1, text: "Store a few checkpoint values in a vector." },
      { line: 2, text: "Visit each checkpoint one at a time." },
      { line: 4, text: "Only keep the larger checkpoint values." },
      { line: 6, text: "Print the checkpoints that pass the filter." },
    ],
    code: `
std::vector<int> checkpoints = { 5, 10, 15, 20 };
for (int checkpoint : checkpoints)
{
    if (checkpoint >= 10)
    {
        std::cout << checkpoint << "\\n";
    }
}
`,
  },
  {
    slug: "collect-positive-values",
    difficulty: "easy",
    topic: "arrays",
    title: "Collect Positive Values",
    description: "Copy positive integers from an array into a vector.",
    lineHints: [
      { line: 1, text: "Set up the source array of sample numbers." },
      { line: 2, text: "Prepare a vector for the filtered results." },
      { line: 3, text: "Loop through each number in the array." },
      { line: 5, text: "Keep only the values above zero." },
    ],
    code: `
std::array<int, 5> samples = { -4, 7, 0, 9, 12 };
std::vector<int> positiveValues;
for (int value : samples)
{
    if (value > 0)
    {
        positiveValues.push_back(value);
    }
}
`,
  },
  {
    slug: "highest-score",
    difficulty: "easy",
    topic: "arrays",
    title: "Highest Score",
    description: "Find and print the maximum score in a vector.",
    lineHints: [
      { line: 1, text: "Start with a vector of scores." },
      { line: 2, text: "Use the first score as the initial maximum." },
      { line: 3, text: "Compare every score against the current best." },
      {
        line: 5,
        text: "Update the saved maximum when you find a bigger value.",
      },
    ],
    code: `
std::vector<int> scores = { 18, 42, 27, 35 };
int highestScore = scores.front();
for (int score : scores)
{
    if (score > highestScore)
    {
        highestScore = score;
    }
}
`,
  },
  {
    slug: "slugify-title",
    difficulty: "easy",
    topic: "strings",
    title: "Slugify Title",
    description:
      "Replace spaces with hyphens by modifying string characters through references.",
    lineHints: [
      { line: 1, text: "Start with a title that includes spaces." },
      {
        line: 2,
        text: "Visit each character by reference so it can be changed.",
      },
      { line: 4, text: "Look for spaces inside the string." },
      { line: 6, text: "Swap spaces for dashes." },
    ],
    code: `
std::string title = "Easy Digital 3";
for (char& ch : title)
{
    if (ch == ' ')
    {
        ch = '-';
    }
}
`,
  },
  {
    slug: "count-vowels",
    difficulty: "easy",
    topic: "strings",
    title: "Count Vowels",
    description: "Count vowels by testing each character in a string.",
    lineHints: [
      { line: 1, text: "Store the input word." },
      { line: 2, text: "Track how many vowels you find." },
      { line: 3, text: "Read each character in the string." },
      { line: 5, text: "Increase the count when the character is a vowel." },
    ],
    code: `
std::string label = "codebadger";
int vowelCount = 0;
for (char ch : label)
{
    if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u')
    {
        ++vowelCount;
    }
}
`,
  },
  {
    slug: "lookup-score",
    difficulty: "easy",
    topic: "containers",
    title: "Lookup Score",
    description:
      "Look up a player score in an unordered_map after checking whether the key exists.",
    lineHints: [
      { line: 1, text: "Create a map of player names to scores." },
      { line: 5, text: "Check that the key exists before reading it." },
      { line: 7, text: "Print the stored score for Nova." },
    ],
    code: `
std::unordered_map<std::string, int> scores = {
    { "Nova", 18 },
    { "Moss", 12 }
};
if (scores.contains("Nova"))
{
    std::cout << scores["Nova"] << "\\n";
}
`,
  },
  {
    slug: "unique-tags",
    difficulty: "easy",
    topic: "containers",
    title: "Unique Tags",
    description:
      "Insert strings into an unordered_set and print the number of unique tags.",
    lineHints: [
      { line: 1, text: "Start with a vector that includes duplicate tags." },
      { line: 2, text: "Create a set to keep only unique entries." },
      { line: 3, text: "Loop through each tag in the original list." },
      { line: 5, text: "Print how many unique tags were collected." },
    ],
    code: `
std::vector<std::string> tags = { "ui", "combat", "ui", "audio" };
std::unordered_set<std::string> uniqueTags;
for (const std::string& tag : tags)
{
    uniqueTags.insert(tag);
}
std::cout << uniqueTags.size() << "\\n";
`,
  },
  {
    slug: "bfs-frontier",
    difficulty: "medium",
    topic: "algorithms",
    title: "Breadth-First Frontier",
    description:
      "Traverse graph nodes in breadth-first order using a queue and a visited array.",
    code: `
std::queue<int> frontier;
std::vector<bool> visited(6, false);
frontier.push(0);
while (!frontier.empty())
{
    int node = frontier.front();
    frontier.pop();
    if (visited[node])
    {
        continue;
    }
    visited[node] = true;
}
`,
  },
  {
    slug: "dfs-stack",
    difficulty: "medium",
    topic: "algorithms",
    title: "Depth-First Stack",
    description:
      "Traverse graph nodes in depth-first order using a vector as a stack.",
    code: `
std::vector<int> stack = { 0 };
std::vector<bool> visited(6, false);
while (!stack.empty())
{
    int node = stack.back();
    stack.pop_back();
    if (visited[node])
    {
        continue;
    }
    visited[node] = true;
}
`,
  },
  {
    slug: "dijkstra-relax",
    difficulty: "medium",
    topic: "algorithms",
    title: "Dijkstra Relax Step",
    description:
      "Relax outgoing edges to update tentative distances in Dijkstra's algorithm.",
    code: `
std::vector<int> distance = { 0, 9, 14 };
int current = 0;
std::vector<std::pair<int, int>> edges = { { 1, 4 }, { 2, 11 } };
for (const auto& [next, cost] : edges)
{
    int candidate = distance[current] + cost;
    if (candidate < distance[next])
    {
        distance[next] = candidate;
    }
}
`,
  },
  {
    slug: "linked-traversal",
    difficulty: "medium",
    topic: "data-structures",
    title: "Linked Traversal",
    description:
      "Traverse a linked list through next pointers and print each value.",
    code: `
struct Node
{
    int value;
    Node* next;
};

Node third{ 8, nullptr };
Node second{ 5, &third };
Node first{ 3, &second };
for (Node* current = &first; current; current = current->next)
{
    std::cout << current->value << "\\n";
}
`,
  },
  {
    slug: "linked-insert",
    difficulty: "medium",
    topic: "data-structures",
    title: "Linked Insert",
    description:
      "Insert a linked-list node by updating its next pointer and the preceding node.",
    code: `
struct Node
{
    int value;
    Node* next;
};

Node tail{ 9, nullptr };
Node middle{ 6, &tail };
Node head{ 3, &middle };
Node inserted{ 4, head.next };
head.next = &inserted;
`,
  },
  {
    slug: "iterator-sum",
    difficulty: "medium",
    topic: "iterators",
    title: "Iterator Sum",
    description: "Sum vector elements by dereferencing iterators.",
    code: `
std::vector<int> values = { 4, 8, 15, 16 };
int total = 0;
for (auto it = values.begin(); it != values.end(); ++it)
{
    total += *it;
}
`,
  },
  {
    slug: "find-first-even",
    difficulty: "medium",
    topic: "iterators",
    title: "Find First Even",
    description:
      "Find the first even value using std::find_if and a predicate.",
    code: `
std::vector<int> values = { 3, 7, 8, 11 };
auto firstEven = std::find_if(values.begin(), values.end(), [](int value)
{
    return value % 2 == 0;
});
if (firstEven != values.end())
{
    std::cout << *firstEven << "\\n";
}
`,
  },
  {
    slug: "move-ownership",
    difficulty: "hard",
    topic: "memory",
    title: "Move Ownership",
    description:
      "Transfer ownership of an int between unique_ptr instances using std::move.",
    code: `
std::unique_ptr<int> health = std::make_unique<int>(120);
std::unique_ptr<int> equippedHealth = std::move(health);
if (!health)
{
    std::cout << *equippedHealth << "\\n";
}
`,
  },
  {
    slug: "packet-buffer",
    difficulty: "hard",
    topic: "memory",
    title: "Packet Buffer",
    description:
      "Allocate a byte buffer with make_unique, write its elements, and read them back.",
    code: `
std::unique_ptr<std::byte[]> packet = std::make_unique<std::byte[]>(8);
packet[0] = std::byte{ 0x2A };
packet[1] = std::byte{ 0x10 };
for (size_t index = 0; index < 2; ++index)
{
    std::cout << std::to_integer<int>(packet[index]) << "\\n";
}
`,
  },
  {
    slug: "protected-queue",
    difficulty: "hard",
    topic: "concurrency",
    title: "Protected Queue Update",
    description:
      "Protect a shared queue update with std::mutex and std::lock_guard.",
    code: `
std::mutex queueMutex;
std::vector<int> jobs = { 4, 8, 15 };
{
    std::lock_guard<std::mutex> guard(queueMutex);
    jobs.push_back(16);
    jobs.erase(jobs.begin());
}
`,
  },
  {
    slug: "ue-health-delegate",
    difficulty: "hard",
    topic: "game-dev",
    title: "Unreal Health Delegate",
    description:
      "Declare and broadcast an Unreal Engine dynamic multicast health delegate.",
    code: `
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnHealthChanged, float, NewHealth);

UPROPERTY(BlueprintAssignable)
FOnHealthChanged OnHealthChanged;

void SetHealth(float value)
{
    Health = value;
    OnHealthChanged.Broadcast(Health);
}
`,
  },
  {
    slug: "weak-target-check",
    difficulty: "hard",
    topic: "game-dev",
    title: "Weak Target Check",
    description:
      "Check whether an Unreal Engine weak object pointer is valid before accessing its actor.",
    code: `
TWeakObjectPtr<AActor> TargetActor = FocusTarget;
if (AActor* Actor = TargetActor.Get())
{
    FVector direction = Actor->GetActorLocation() - GetActorLocation();
    direction.Normalize();
    CachedDirection = direction;
}
`,
  },
]);
