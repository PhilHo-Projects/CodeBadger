import { matchesAnswer } from "../lib/answers";
import type { TrackLanguage } from "../lib/languages";
export type ExerciseKind = "predict" | "repair" | "recall";
export type Exercise = {
  id: string;
  language: TrackLanguage;
  kind: ExerciseKind;
  title: string;
  prompt: string;
  context: string;
  code: string;
  starter: string;
  solution: string;
  choices?: string[];
  accepted?: string[];
  hint: string;
  explanation: string;
};
export type Scenario = {
  id: string;
  slug: string;
  language: TrackLanguage;
  title: string;
  description: string;
  topic: string;
  difficulty: "Foundations" | "Intermediate";
  minutes: number;
  exercises: Exercise[];
};
type Variant = {
  language: TrackLanguage;
  code: string;
  output: string;
  wrong: string[];
  broken: [string, string];
  repair: string;
  recall: [string, string];
  hint: string;
  explanation: string;
};
function pack(
  slug: string,
  title: string,
  description: string,
  topic: string,
  difficulty: Scenario["difficulty"],
  variants: Variant[],
): Scenario[] {
  return variants.map((v) => {
    const id = `${v.language}:scenario:${slug}`;
    const base = {
      language: v.language,
      title,
      context: description,
      hint: v.hint,
      explanation: v.explanation,
    };
    // Rotate the correct position deterministically; no random SSR content.
    const choices = [...v.wrong];
    choices.splice((slug.length + v.language.length) % 4, 0, v.output);
    return {
      id,
      slug,
      language: v.language,
      title,
      description,
      topic,
      difficulty,
      minutes: 6,
      exercises: [
        {
          ...base,
          id: `${id}:predict`,
          kind: "predict",
          prompt: "What does this code print?",
          code: v.code,
          starter: "",
          solution: v.output,
          choices,
        },
        {
          ...base,
          id: `${id}:repair`,
          kind: "repair",
          prompt: v.repair,
          code: "",
          starter: v.code.replace(v.broken[0], v.broken[1]),
          solution: v.code,
        },
        {
          ...base,
          id: `${id}:recall`,
          kind: "recall",
          prompt: v.recall[0],
          code: "",
          starter: "",
          solution: v.recall[1],
        },
      ],
    };
  });
}
export const scenarios: Scenario[] = [
  ...pack(
    "checkout",
    "Sum qualifying prices",
    "A cart has prices 10, 20 and 40. Only prices at least 20 qualify for the offer. Sum the qualifying prices.",
    "Arrays & filtering",
    "Foundations",
    [
      {
        language: "typescript",
        code: "const prices = [10, 20, 40];\nlet total = 0;\nfor (const price of prices) {\n    if (price >= 20) total += price;\n}\nconsole.log(total);",
        output: "60",
        wrong: ["70", "40", "20"],
        broken: ["price >= 20", "price > 20"],
        repair:
          "Fix the boundary so the price 20 also qualifies. Keep the rest of the code.",
        recall: [
          "Write only the statement adding price to total using +=.",
          "total += price;",
        ],
        hint: "At least includes the boundary.",
        explanation:
          "20 and 40 qualify; 10 does not. One pass is O(n) time and O(1) extra space.",
      },
      {
        language: "csharp",
        code: "int[] prices = { 10, 20, 40 };\nint total = 0;\nforeach (int price in prices)\n{\n    if (price >= 20) total += price;\n}\nConsole.WriteLine(total);",
        output: "60",
        wrong: ["70", "40", "20"],
        broken: ["price >= 20", "price > 20"],
        repair:
          "Include price 20 in the total. Keep the existing loop and variable names.",
        recall: [
          "Write the statement adding price to total using +=.",
          "total += price;",
        ],
        hint: "Use an inclusive comparison.",
        explanation:
          "The qualifying total is 20 + 40. A single pass uses O(n) time and O(1) extra space.",
      },
      {
        language: "rust",
        code: 'let prices = [10, 20, 40];\nlet mut total = 0;\nfor price in prices {\n    if price >= 20 { total += price; }\n}\nprintln!("{}", total);',
        output: "60",
        wrong: ["70", "40", "20"],
        broken: ["price >= 20", "price > 20"],
        repair:
          "Make the threshold inclusive of price 20. Keep the loop unchanged.",
        recall: [
          "Write the statement adding price to total using +=.",
          "total += price;",
        ],
        hint: "At least means >=.",
        explanation:
          "The integer array is Copy and its values are visited once. 20 + 40 is 60.",
      },
      {
        language: "cpp",
        code: "std::vector<int> prices{10, 20, 40};\nint total = 0;\nfor (int price : prices)\n{\n    if (price >= 20) total += price;\n}\nstd::cout << total;",
        output: "60",
        wrong: ["70", "40", "20"],
        broken: ["price >= 20", "price > 20"],
        repair:
          "Include 20 in the qualifying total. Keep the existing range loop.",
        recall: [
          "Write the statement adding price to total using +=.",
          "total += price;",
        ],
        hint: "Use the inclusive comparator.",
        explanation:
          "20 and 40 qualify. The range loop takes O(n) time and constant extra space.",
      },
    ],
  ),
  ...pack(
    "log-counts",
    "Count log entries",
    "The log contains ok, fail, ok. Count each label, then read the count of ok.",
    "Maps & counting",
    "Intermediate",
    [
      {
        language: "typescript",
        code: 'const counts = new Map<string, number>();\nfor (const key of ["ok", "fail", "ok"]) {\n    counts.set(key, (counts.get(key) ?? 0) + 1);\n}\nconsole.log(counts.get("ok"));',
        output: "2",
        wrong: ["1", "3", "NaN"],
        broken: ["?? 0", "?? 1"],
        repair:
          "Fix the initial count so the first occurrence has count 1, not 2.",
        recall: [
          "Increment key in counts using set, get, a ?? 0 fallback, and + 1.",
          "counts.set(key, (counts.get(key) ?? 0) + 1);",
        ],
        hint: "A missing entry starts at zero before adding one.",
        explanation:
          "ok occurs twice. Each missing key starts with count zero; the loop then increments it.",
      },
      {
        language: "csharp",
        code: 'var counts = new Dictionary<string, int>();\nforeach (var key in new[] { "ok", "fail", "ok" })\n{\n    counts.TryGetValue(key, out int count);\n    counts[key] = count + 1;\n}\nConsole.WriteLine(counts["ok"]);',
        output: "2",
        wrong: ["0", "1", "3"],
        broken: ["count + 1", "count"],
        repair:
          "The loop never increases the count. Fix the assignment while keeping TryGetValue.",
        recall: [
          "Write counts[key] = count + 1; from memory.",
          "counts[key] = count + 1;",
        ],
        hint: "TryGetValue supplies default(int), zero, when the key is absent.",
        explanation:
          "The out count is zero on a missing key, then each occurrence adds one.",
      },
      {
        language: "rust",
        code: 'use std::collections::HashMap;\nlet mut counts = HashMap::new();\nfor key in ["ok", "fail", "ok"] {\n    *counts.entry(key).or_insert(0) += 1;\n}\nprintln!("{}", counts["ok"]);',
        output: "2",
        wrong: ["1", "3", "0"],
        broken: ["or_insert(0)", "or_insert(1)"],
        repair:
          "Fix the starting value so the first occurrence is counted once.",
        recall: [
          "Increment the entry for key in counts, inserting 0 if absent. Use entry, or_insert, dereference and += 1.",
          "*counts.entry(key).or_insert(0) += 1;",
        ],
        hint: "or_insert returns a mutable reference to the value.",
        explanation:
          "Dereferencing the entry lets += update the stored count, rather than a copy.",
      },
      {
        language: "cpp",
        code: 'std::unordered_map<std::string, int> counts;\nfor (const std::string key : {"ok", "fail", "ok"})\n{\n    counts[key] += 1;\n}\nstd::cout << counts.at("ok");',
        output: "2",
        wrong: ["1", "3", "0"],
        broken: ["counts[key] += 1", "counts[key] = 1"],
        repair:
          "Repeated labels reset to 1. Fix the update so occurrences accumulate.",
        recall: ["Increment counts[key] by 1 using +=.", "counts[key] += 1;"],
        hint: "operator[] value-initializes a missing int to zero.",
        explanation:
          "The first access inserts zero; += 1 counts each occurrence.",
      },
    ],
  ),
  ...pack(
    "duplicates",
    "Count unique values",
    "A sequence contains 3, 1, 3, 2. Track membership and report the number of distinct values.",
    "Sets & membership",
    "Foundations",
    [
      {
        language: "typescript",
        code: "const ids = [3, 1, 3, 2];\nconst seen = new Set<number>();\nfor (const id of ids) {\n    seen.add(id);\n}\nconsole.log(seen.size);",
        output: "3",
        wrong: ["4", "2", "1"],
        broken: ["seen.add(id)", "seen.add(0)"],
        repair:
          "The set receives the same constant every time. Store the actual id.",
        recall: [
          "Write an if header testing whether seen already contains id.",
          "if (seen.has(id))",
        ],
        hint: "Set.add inserts; Set.has checks membership.",
        explanation:
          "The duplicate 3 does not increase size. There are three distinct values.",
      },
      {
        language: "csharp",
        code: "int[] ids = { 3, 1, 3, 2 };\nvar seen = new HashSet<int>();\nforeach (int id in ids)\n{\n    seen.Add(id);\n}\nConsole.WriteLine(seen.Count);",
        output: "3",
        wrong: ["4", "2", "1"],
        broken: ["seen.Add(id)", "seen.Add(0)"],
        repair: "Insert each id instead of repeatedly inserting zero.",
        recall: [
          "Write an if header testing whether seen contains id.",
          "if (seen.Contains(id))",
        ],
        hint: "HashSet has Add and Contains methods.",
        explanation: "HashSet keeps one copy of each distinct int.",
      },
      {
        language: "rust",
        code: 'use std::collections::HashSet;\nlet ids = [3, 1, 3, 2];\nlet mut seen = HashSet::new();\nfor id in ids {\n    seen.insert(id);\n}\nprintln!("{}", seen.len());',
        output: "3",
        wrong: ["4", "2", "1"],
        broken: ["seen.insert(id)", "seen.insert(0)"],
        repair: "Insert the current id instead of zero.",
        recall: [
          "Write an if header checking seen.contains(&id), including the opening brace only.",
          "if seen.contains(&id) {",
        ],
        hint: "contains borrows the queried key.",
        explanation:
          "HashSet contains three integers. Its iteration order is not guaranteed, so we print only len.",
      },
      {
        language: "cpp",
        code: "std::vector<int> ids{3, 1, 3, 2};\nstd::unordered_set<int> seen;\nfor (int id : ids)\n{\n    seen.insert(id);\n}\nstd::cout << seen.size();",
        output: "3",
        wrong: ["4", "2", "1"],
        broken: ["seen.insert(id)", "seen.insert(0)"],
        repair: "Insert the current id rather than a constant.",
        recall: [
          "Write an if header checking seen.contains(id) in C++20.",
          "if (seen.contains(id))",
        ],
        hint: "contains checks membership without inserting.",
        explanation:
          "unordered_set has three unique elements. Hash lookup is typically O(1) on average.",
      },
    ],
  ),
  ...pack(
    "off-by-one",
    "Loop boundaries",
    "Accumulate the integers from 0 through 3. The upper boundary should exclude 4.",
    "Loops & boundaries",
    "Foundations",
    [
      {
        language: "typescript",
        code: "let total = 0;\nfor (let i = 0; i < 4; i++) {\n    total += i;\n}\nconsole.log(total);",
        output: "6",
        wrong: ["10", "3", "4"],
        broken: ["i < 4", "i <= 4"],
        repair:
          "Remove the extra iteration at i = 4. Change only the comparison.",
        recall: [
          "Write the for header for let i = 0, i < 4, i++.",
          "for (let i = 0; i < 4; i++)",
        ],
        hint: "A half-open range includes its start and excludes its end.",
        explanation: "0 + 1 + 2 + 3 is 6. Including 4 would make 10.",
      },
      {
        language: "csharp",
        code: "int total = 0;\nfor (int i = 0; i < 4; i++)\n{\n    total += i;\n}\nConsole.WriteLine(total);",
        output: "6",
        wrong: ["10", "3", "4"],
        broken: ["i < 4", "i <= 4"],
        repair:
          "Exclude i = 4 from the loop. Keep the initializer and increment.",
        recall: [
          "Write the for header for int i = 0, i < 4, i++.",
          "for (int i = 0; i < 4; i++)",
        ],
        hint: "Use < instead of <=.",
        explanation: "There are four iterations, summing to 6.",
      },
      {
        language: "rust",
        code: 'let mut total = 0;\nfor i in 0..4 {\n    total += i;\n}\nprintln!("{}", total);',
        output: "6",
        wrong: ["10", "3", "4"],
        broken: ["0..4", "0..=4"],
        repair: "Fix the range so 4 is excluded.",
        recall: [
          "Write the loop header for i in 0..4, including its opening brace.",
          "for i in 0..4 {",
        ],
        hint: ".. is exclusive; ..= is inclusive.",
        explanation: "The range yields 0, 1, 2, 3. The sum is 6.",
      },
      {
        language: "cpp",
        code: "int total = 0;\nfor (int i = 0; i < 4; ++i)\n{\n    total += i;\n}\nstd::cout << total;",
        output: "6",
        wrong: ["10", "3", "4"],
        broken: ["i < 4", "i <= 4"],
        repair: "Exclude 4 with a strict upper bound.",
        recall: [
          "Write the for header for int i = 0, i < 4, ++i.",
          "for (int i = 0; i < 4; ++i)",
        ],
        hint: "Stop when i reaches 4.",
        explanation:
          "The upper boundary is excluded, as with standard half-open iterator ranges.",
      },
    ],
  ),
  ...pack(
    "missing-name",
    "Optional display names",
    "A present but empty name is valid. Fall back to Guest only when the value is absent, then print the label length.",
    "Optional values",
    "Intermediate",
    [
      {
        language: "typescript",
        code: 'const user: { name?: string } = { name: "" };\nconst label = user.name ?? "Guest";\nconsole.log(label.length);',
        output: "0",
        wrong: ["5", "undefined", "1"],
        broken: ['user.name ?? "Guest"', 'user.name || "Guest"'],
        repair: "Preserve the empty string. Use the nullish fallback operator.",
        recall: [
          'Declare const label from user.name with a ?? fallback of "Guest".',
          'const label = user.name ?? "Guest";',
        ],
        hint: "|| also treats empty strings, zero and false as missing; ?? does not.",
        explanation: "The empty string is present, so its length remains zero.",
      },
      {
        language: "csharp",
        code: 'string? name = "";\nstring label = name ?? "Guest";\nConsole.WriteLine(label.Length);',
        output: "0",
        wrong: ["5", "null", "1"],
        broken: [
          'name ?? "Guest"',
          'string.IsNullOrEmpty(name) ? "Guest" : name',
        ],
        repair:
          "An empty name is valid. Replace the broad empty check with a null-only fallback.",
        recall: [
          'Declare string label from name with a ?? fallback of "Guest".',
          'string label = name ?? "Guest";',
        ],
        hint: "?? falls back only for null.",
        explanation:
          "Empty and null are different states. The label’s Length is zero.",
      },
      {
        language: "rust",
        code: 'let name = Some("");\nlet label = name.unwrap_or("Guest");\nprintln!("{}", label.len());',
        output: "0",
        wrong: ["5", "None", "1"],
        broken: [
          'name.unwrap_or("Guest")',
          'name.filter(|s| !s.is_empty()).unwrap_or("Guest")',
        ],
        repair: 'Keep Some("") as a valid value. Remove the extra filter.',
        recall: [
          'Declare label from name.unwrap_or("Guest").',
          'let label = name.unwrap_or("Guest");',
        ],
        hint: "Option already distinguishes absence from an empty string.",
        explanation:
          'Some("") is not None. unwrap_or returns the contained empty string.',
      },
      {
        language: "cpp",
        code: 'std::optional<std::string> name{std::string{}};\nstd::string label = name.value_or("Guest");\nstd::cout << label.size();',
        output: "0",
        wrong: ["5", "nullopt", "1"],
        broken: [
          'name.value_or("Guest")',
          'name && !name->empty() ? *name : "Guest"',
        ],
        repair:
          "Keep an engaged optional even when its string is empty. Use value_or.",
        recall: [
          'Declare std::string label from name.value_or("Guest").',
          'std::string label = name.value_or("Guest");',
        ],
        hint: "Engagement of optional is independent of the contained string’s length.",
        explanation:
          "The optional contains an empty string, so value_or does not select Guest.",
      },
    ],
  ),
  ...pack(
    "binary-search",
    "Binary search",
    "A sorted sequence is 2, 4, 6, 8. Find the first index whose value is at least 5 using a half-open search interval.",
    "Binary search",
    "Intermediate",
    [
      {
        language: "typescript",
        code: "const values = [2, 4, 6, 8];\nlet low = 0, high = values.length;\nwhile (low < high) {\n    const mid = low + Math.floor((high - low) / 2);\n    if (values[mid]! < 5) low = mid + 1;\n    else high = mid;\n}\nconsole.log(low);",
        output: "2",
        wrong: ["1", "3", "6"],
        broken: ["low = mid + 1", "low = mid"],
        repair:
          "The lower bound may stop advancing and loop forever. Fix the low update.",
        recall: [
          "Write the statement advancing low past mid.",
          "low = mid + 1;",
        ],
        hint: "A rejected midpoint must be excluded from the remaining interval.",
        explanation:
          "The result is index 2, holding 6. The interval shrinks each round: O(log n) time, O(1) extra space. The non-null assertion relies on valid interval invariants.",
      },
      {
        language: "csharp",
        code: "int[] values = { 2, 4, 6, 8 };\nint low = 0, high = values.Length;\nwhile (low < high)\n{\n    int mid = low + (high - low) / 2;\n    if (values[mid] < 5) low = mid + 1;\n    else high = mid;\n}\nConsole.WriteLine(low);",
        output: "2",
        wrong: ["1", "3", "6"],
        broken: ["low = mid + 1", "low = mid"],
        repair:
          "Fix the low update so the loop makes progress even when mid equals low.",
        recall: [
          "Write the statement advancing low past mid.",
          "low = mid + 1;",
        ],
        hint: "Exclude the midpoint after rejecting it.",
        explanation:
          "Index 2 is the first value at least 5. Half-open bounds also handle an empty sequence.",
      },
      {
        language: "rust",
        code: 'let values = [2, 4, 6, 8];\nlet (mut low, mut high) = (0, values.len());\nwhile low < high {\n    let mid = low + (high - low) / 2;\n    if values[mid] < 5 { low = mid + 1; }\n    else { high = mid; }\n}\nprintln!("{}", low);',
        output: "2",
        wrong: ["1", "3", "6"],
        broken: ["low = mid + 1", "low = mid"],
        repair: "Fix the low update to guarantee progress.",
        recall: [
          "Write the statement advancing low past mid.",
          "low = mid + 1;",
        ],
        hint: "mid was too small, so do not keep it in the interval.",
        explanation:
          "Index 2 is the lower bound of 5. usize indices stay within [0, len) for each access.",
      },
      {
        language: "cpp",
        code: "std::vector<int> values{2, 4, 6, 8};\nstd::size_t low = 0, high = values.size();\nwhile (low < high)\n{\n    auto mid = low + (high - low) / 2;\n    if (values[mid] < 5) low = mid + 1;\n    else high = mid;\n}\nstd::cout << low;",
        output: "2",
        wrong: ["1", "3", "6"],
        broken: ["low = mid + 1", "low = mid"],
        repair:
          "Fix the low update so each iteration reduces the search interval.",
        recall: [
          "Write the statement advancing low past mid.",
          "low = mid + 1;",
        ],
        hint: "Rejecting a midpoint means advancing beyond it.",
        explanation:
          "The lower bound is index 2. std::lower_bound provides this operation in the standard library.",
      },
    ],
  ),
];
export const allExercises = scenarios.flatMap((scenario) => scenario.exercises);
export function checkExercise(exercise: Exercise, answer: string) {
  return exercise.kind === "predict"
    ? answer.trim().length > 0 && answer.trim() === exercise.solution
    : matchesAnswer(answer, [exercise.solution, ...(exercise.accepted ?? [])]);
}
export const exerciseById = (id: string) =>
  allExercises.find((exercise) => exercise.id === id);
