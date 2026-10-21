import { buildLessons } from "./build";
export const cppExtraLessons = buildLessons("cpp", [
  {
    slug: "references",
    title: "References & const",
    subtitle: "References & const",
    tag: "Memory model",
    intro:
      "A reference is an alias to an existing object. A const reference reads without copying; a non-const reference can edit the original.",
    points: [
      ["Alias", "int& refers to an existing int and must be initialized."],
      [
        "Read-only access",
        "const T& prevents modification through that reference.",
      ],
      [
        "Lifetime",
        "Never return a reference to a local object about to be destroyed.",
      ],
    ],
    example:
      "int score = 7;\nint{{&}} alias = score;\nalias {{+=}} 1;\nstd::cout << score;",
    output: "8",
    pitfall:
      "Assigning through a reference changes its object; it does not reseat the reference.",
    task: "Declare int& alias as a reference to score.",
    context: "One declaration.",
    solution: "int& alias = score;",
    hint: "The & belongs in the declarator.",
    explanation: "alias and score name the same int object.",
  },
  {
    slug: "range-for",
    title: "Range-based loops",
    subtitle: "Range-based loops",
    tag: "Collections",
    intro:
      "A range-for expresses traversal directly. The element declaration determines whether each item is copied or borrowed.",
    points: [
      ["auto value", "Copies each element."],
      ["const auto& value", "Reads each element without copying."],
      ["auto& value", "Allows modification of the original elements."],
    ],
    example:
      "std::vector<int> scores{1, 2, 3};\nfor (auto{{&}} score : scores)\n{\n    score {{*=}} 2;\n}\nstd::cout << scores[1];",
    output: "4",
    pitfall:
      "for (auto score : scores) edits a copy, leaving original values unchanged.",
    task: "Write a range-for header using auto& score to iterate scores.",
    context: "Only the header.",
    solution: "for (auto& score : scores)",
    hint: "A colon separates the element declaration and range.",
    explanation: "Each score aliases its vector element.",
  },
  {
    slug: "algorithms",
    title: "STL algorithms",
    subtitle: "STL algorithms",
    tag: "Algorithms",
    intro:
      "Standard algorithms operate over iterator ranges. The end iterator marks one past the last element.",
    points: [
      ["Half-open range", "[begin, end) excludes the end iterator."],
      [
        "Sorting",
        "std::sort rearranges a random-access range in O(n log n) comparisons.",
      ],
      ["Searching", "Compare find results with end before dereferencing."],
    ],
    example:
      "std::vector<int> scores{3, 1, 2};\nstd::{{sort}}(scores.begin(), scores.{{end}}());\nstd::cout << scores.front();",
    output: "1",
    pitfall: "Dereferencing end has undefined behavior.",
    task: "Sort scores ascending with std::sort and begin/end iterators.",
    context: "Include <algorithm> in a complete program.",
    solution: "std::sort(scores.begin(), scores.end());",
    hint: "std::sort(first, last);",
    explanation: "The vector’s full range is sorted in place.",
  },
  {
    slug: "ownership",
    title: "RAII & unique_ptr",
    subtitle: "RAII & unique_ptr",
    tag: "Memory model",
    intro:
      "RAII ties cleanup to object lifetime. unique_ptr owns an object and deletes it automatically when the owner is destroyed.",
    points: [
      [
        "Automatic cleanup",
        "Scope exit releases resources even during exception unwinding.",
      ],
      [
        "Move ownership",
        "unique_ptr cannot be copied; std::move transfers ownership.",
      ],
      [
        "Prefer make_unique",
        "Construct an owned object without a raw new expression.",
      ],
    ],
    example:
      "auto score = std::{{make_unique}}<int>(42);\nstd::cout << {{*score}};",
    output: "42",
    pitfall: "A moved-from unique_ptr is null. Do not dereference it.",
    task: "Declare auto score using std::make_unique<int>(42).",
    context: "Include <memory> in a complete program.",
    solution: "auto score = std::make_unique<int>(42);",
    hint: "The template argument names the owned type.",
    explanation: "score owns an int and handles its cleanup automatically.",
  },
]);
