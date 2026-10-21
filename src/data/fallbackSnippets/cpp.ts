import { buildSnippetLibrary } from "./shared";

export const cppSnippets = buildSnippetLibrary("cpp", [
  {
    slug: "countdown-timer",
    difficulty: "easy",
    topic: "loops",
    title: "Countdown Timer",
    description: "Count down a small timer and print each value before the round begins. This practices a simple while loop with a decrement step.",
    lineHints: [
      { line: 1, text: "Start with a timer value." },
      { line: 2, text: "Keep looping while there is still time left." },
      { line: 5, text: "Decrease the timer after printing." },
      { line: 7, text: "Print a final message after the loop ends." }
    ],
    code: `
int timer = 3;
while (timer > 0)
{
    std::cout << timer << "\\n";
    --timer;
}
std::cout << "Go!\\n";
`
  },
  {
    slug: "checkpoint-filter",
    difficulty: "easy",
    topic: "loops",
    title: "Checkpoint Filter",
    description: "Walk through a list of checkpoint values and print only the later milestones. This drills range-based loops plus a small condition.",
    lineHints: [
      { line: 1, text: "Store a few checkpoint values in a vector." },
      { line: 2, text: "Visit each checkpoint one at a time." },
      { line: 4, text: "Only keep the larger checkpoint values." },
      { line: 6, text: "Print the checkpoints that pass the filter." }
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
`
  },
  {
    slug: "collect-positive-values",
    difficulty: "easy",
    topic: "arrays",
    title: "Collect Positive Values",
    description: "Scan through a fixed-size array and copy only positive entries into a new vector. This is basic array traversal and filtering.",
    lineHints: [
      { line: 1, text: "Set up the source array of sample numbers." },
      { line: 2, text: "Prepare a vector for the filtered results." },
      { line: 3, text: "Loop through each number in the array." },
      { line: 5, text: "Keep only the values above zero." }
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
`
  },
  {
    slug: "highest-score",
    difficulty: "easy",
    topic: "arrays",
    title: "Highest Score",
    description: "Walk a vector of scores and keep track of the current maximum. This is a classic beginner pattern for array scanning.",
    lineHints: [
      { line: 1, text: "Start with a vector of scores." },
      { line: 2, text: "Use the first score as the initial maximum." },
      { line: 3, text: "Compare every score against the current best." },
      { line: 5, text: "Update the saved maximum when you find a bigger value." }
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
`
  },
  {
    slug: "slugify-title",
    difficulty: "easy",
    topic: "strings",
    title: "Slugify Title",
    description: "Replace spaces in a short title so it can be used as a slug. This practices looping over characters and editing a string in place.",
    lineHints: [
      { line: 1, text: "Start with a title that includes spaces." },
      { line: 2, text: "Visit each character by reference so it can be changed." },
      { line: 4, text: "Look for spaces inside the string." },
      { line: 6, text: "Swap spaces for dashes." }
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
`
  },
  {
    slug: "count-vowels",
    difficulty: "easy",
    topic: "strings",
    title: "Count Vowels",
    description: "Check each character in a word and count how many vowels appear. This combines string traversal with a multi-branch condition.",
    lineHints: [
      { line: 1, text: "Store the input word." },
      { line: 2, text: "Track how many vowels you find." },
      { line: 3, text: "Read each character in the string." },
      { line: 5, text: "Increase the count when the character is a vowel." }
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
`
  },
  {
    slug: "lookup-score",
    difficulty: "easy",
    topic: "containers",
    title: "Lookup Score",
    description: "Store player scores in a hash map and read back one specific value. This introduces container lookup with a simple guard.",
    lineHints: [
      { line: 1, text: "Create a map of player names to scores." },
      { line: 5, text: "Check that the key exists before reading it." },
      { line: 7, text: "Print the stored score for Nova." }
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
`
  },
  {
    slug: "unique-tags",
    difficulty: "easy",
    topic: "containers",
    title: "Unique Tags",
    description: "Insert repeated strings into a set so only unique values remain. This is a beginner-friendly example of why sets are useful.",
    lineHints: [
      { line: 1, text: "Start with a vector that includes duplicate tags." },
      { line: 2, text: "Create a set to keep only unique entries." },
      { line: 3, text: "Loop through each tag in the original list." },
      { line: 5, text: "Print how many unique tags were collected." }
    ],
    code: `
std::vector<std::string> tags = { "ui", "combat", "ui", "audio" };
std::unordered_set<std::string> uniqueTags;
for (const std::string& tag : tags)
{
    uniqueTags.insert(tag);
}
std::cout << uniqueTags.size() << "\\n";
`
  },
  {
    slug: "bfs-frontier",
    difficulty: "medium",
    topic: "algorithms",
    title: "Breadth-First Frontier",
    description: "Process nodes in breadth-first order with a queue and a visited array. This is the basic control flow behind BFS.",
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
`
  },
  {
    slug: "dfs-stack",
    difficulty: "medium",
    topic: "algorithms",
    title: "Depth-First Stack",
    description: "Use a vector as an explicit stack while walking graph nodes. This shows the iterative version of depth-first search.",
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
`
  },
  {
    slug: "dijkstra-relax",
    difficulty: "medium",
    topic: "algorithms",
    title: "Dijkstra Relax Step",
    description: "Update tentative path costs by relaxing each outgoing edge from the current node. This is the core update step inside Dijkstra's algorithm.",
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
`
  },
  {
    slug: "linked-traversal",
    difficulty: "medium",
    topic: "data-structures",
    title: "Linked Traversal",
    description: "Walk a small linked list node by node and print each value. This focuses on pointer-based traversal in a classic academic data structure.",
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
`
  },
  {
    slug: "linked-insert",
    difficulty: "medium",
    topic: "data-structures",
    title: "Linked Insert",
    description: "Insert a new node into the middle of a linked list by rewiring pointers. This is a compact pointer-manipulation exercise from a typical data structures course.",
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
`
  },
  {
    slug: "iterator-sum",
    difficulty: "medium",
    topic: "iterators",
    title: "Iterator Sum",
    description: "Step through a vector with explicit iterators instead of a range loop. This keeps the focus on iterator mechanics and dereferencing.",
    code: `
std::vector<int> values = { 4, 8, 15, 16 };
int total = 0;
for (auto it = values.begin(); it != values.end(); ++it)
{
    total += *it;
}
`
  },
  {
    slug: "find-first-even",
    difficulty: "medium",
    topic: "iterators",
    title: "Find First Even",
    description: "Use an STL algorithm to locate the first value that matches a predicate. This is a practical iterator-based pattern many C++ developers should know.",
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
`
  },
  {
    slug: "move-ownership",
    difficulty: "hard",
    topic: "memory",
    title: "Move Ownership",
    description: "Transfer ownership of a heap value from one unique pointer to another. This is the kind of lifetime management pattern that shows up in production C++.",
    code: `
std::unique_ptr<int> health = std::make_unique<int>(120);
std::unique_ptr<int> equippedHealth = std::move(health);
if (!health)
{
    std::cout << *equippedHealth << "\\n";
}
`
  },
  {
    slug: "packet-buffer",
    difficulty: "hard",
    topic: "memory",
    title: "Packet Buffer",
    description: "Write raw byte values into a heap-allocated packet buffer and read them back. This mirrors the lower-level memory work that often appears in real C++ systems code.",
    code: `
std::unique_ptr<std::byte[]> packet = std::make_unique<std::byte[]>(8);
packet[0] = std::byte{ 0x2A };
packet[1] = std::byte{ 0x10 };
for (size_t index = 0; index < 2; ++index)
{
    std::cout << std::to_integer<int>(packet[index]) << "\\n";
}
`
  },
  {
    slug: "protected-queue",
    difficulty: "hard",
    topic: "concurrency",
    title: "Protected Queue Update",
    description: "Guard shared work data with a mutex and lock guard before mutating it. This is a small but realistic concurrency pattern from production code.",
    code: `
std::mutex queueMutex;
std::vector<int> jobs = { 4, 8, 15 };
{
    std::lock_guard<std::mutex> guard(queueMutex);
    jobs.push_back(16);
    jobs.erase(jobs.begin());
}
`
  },
  {
    slug: "ue-health-delegate",
    difficulty: "hard",
    topic: "game-dev",
    title: "Unreal Health Delegate",
    description: "Broadcast a gameplay event through an Unreal-style dynamic multicast delegate. This is the kind of engine-flavored production snippet you asked for.",
    code: `
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnHealthChanged, float, NewHealth);

UPROPERTY(BlueprintAssignable)
FOnHealthChanged OnHealthChanged;

void SetHealth(float value)
{
    Health = value;
    OnHealthChanged.Broadcast(Health);
}
`
  },
  {
    slug: "weak-target-check",
    difficulty: "hard",
    topic: "game-dev",
    title: "Weak Target Check",
    description: "Resolve a weak Unreal object pointer before reading actor data from it. This is a production-oriented engine pattern built around safe object access.",
    code: `
TWeakObjectPtr<AActor> TargetActor = FocusTarget;
if (AActor* Actor = TargetActor.Get())
{
    FVector direction = Actor->GetActorLocation() - GetActorLocation();
    direction.Normalize();
    CachedDirection = direction;
}
`
  }
]);
