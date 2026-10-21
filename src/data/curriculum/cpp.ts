import type { Lesson } from "../../lib/learning";

const originalLessons: Omit<Lesson, "language">[] = [
  {
    id: "variables",
    title: "Variables & types",
    subtitle: "Variables & types",
    tag: "Foundations",
    minutes: 3,
    intro:
      "A variable is a named place to keep a value. In C++, its type determines what it can hold and which operations make sense.",
    points: [
      {
        title: "Choose a type",
        text: "int stores whole numbers. double stores decimals. bool stores true or false.",
      },
      {
        title: "Initialize it",
        text: "Give local variables a value before reading them. Brace initialization also helps catch narrowing conversions.",
      },
      {
        title: "const and auto",
        text: "Use const for a value that should not change. auto deduces a type from its initializer.",
      },
    ],
    code: "int lives = 3;\nconst int damage = 1;\nlives -= damage;\nstd::cout << lives;",
    output: "2",
    pitfall:
      "An uninitialized local int has no safe default value. int lives; is a declaration, not an initialization to zero.",
    gapCode:
      "[[type]] lives = 3;\n[[constant]] int damage = 1;\nlives -= damage;",
    gaps: [
      {
        id: "type",
        label: "A whole-number type",
        answers: ["int"],
        hint: "Three letters. Short for integer.",
      },
      {
        id: "constant",
        label: "Prevent damage from changing",
        answers: ["const", "constexpr"],
        hint: "The usual qualifier starts with con.",
      },
    ],
    recall: {
      prompt: "Declare an integer named lives initialized to 3.",
      context:
        "One declaration. Assignment, braces, or direct initialization all work; auto is accepted when it deduces int.",
      placeholder: "// Write the declaration from memory",
      solution: "int lives = 3;",
      hint: "Type, name, initial value, semicolon.",
      explanation:
        "int chooses the type, lives is the name, and = 3 gives it an initial value.",
    },
  },
  {
    id: "conditions",
    title: "Conditions & comparisons",
    subtitle: "Conditions & comparisons",
    tag: "Control flow",
    minutes: 3,
    intro:
      "An if statement runs its body only when its condition is true. Comparisons turn values into a yes-or-no decision.",
    points: [
      {
        title: "Comparison operators",
        text: "== compares equality. != compares inequality. >= includes the boundary value.",
      },
      {
        title: "Choose a branch",
        text: "if checks a condition, else if checks another, and else handles what remains.",
      },
      {
        title: "Combine conditions",
        text: "&& means both must be true. || means at least one. ! reverses a boolean.",
      },
    ],
    code: 'int score = 100;\nif (score >= 100)\n{\n    std::cout << "Pass";\n}\nelse\n{\n    std::cout << "Fail";\n}',
    output: "Pass",
    pitfall:
      "= assigns; == compares. An accidental assignment in a condition can compile and still do the wrong thing.",
    gapCode:
      'if (score [[comparison]] 100)\n{\n    std::cout << "Pass";\n}\n[[otherwise]]\n{\n    std::cout << "Fail";\n}',
    gaps: [
      {
        id: "comparison",
        label: "At least 100, including 100",
        answers: [">="],
        hint: "Greater than, or equal to.",
      },
      {
        id: "otherwise",
        label: "The other branch",
        answers: ["else"],
        hint: "The companion to if.",
      },
    ],
    recall: {
      prompt: "Write an if header that checks whether score is at least 100.",
      context:
        "Only the header: no body or trailing semicolon. The boundary value must pass.",
      placeholder: "// Write the if header",
      solution: "if (score >= 100)",
      hint: "At least includes equality. Put the condition in parentheses.",
      explanation:
        "score >= 100 is true for 100 and every larger score. 100 <= score expresses the same comparison.",
    },
  },
  {
    id: "for-loops",
    title: "For loops",
    subtitle: "For loops",
    tag: "Control flow",
    minutes: 4,
    intro:
      "A for loop combines initialization, a condition, and an increment. Use it when you need an explicit loop counter.",
    points: [
      {
        title: "Initialize the counter",
        text: "int i = 0 runs once, before the loop. The counter is scoped to the loop.",
      },
      {
        title: "Check the loop condition",
        text: "i < 5 is checked before every iteration. Starting at zero, the values are 0, 1, 2, 3, 4.",
      },
      {
        title: "Increment the counter",
        text: "++i increments after the body. i++ works here too; both move to the next counter value.",
      },
    ],
    code: 'for (int i = 0; i < 5; ++i)\n{\n    std::cout << i << " ";\n}',
    output: "0 1 2 3 4",
    pitfall:
      "i <= 5 runs six times when you start at zero. For an array with five elements, index 5 is already past the end.",
    gapCode:
      'for (int i = [[start]]; i [[bound]] 5; [[step]])\n{\n    std::cout << i << " ";\n}',
    gaps: [
      {
        id: "start",
        label: "First counter value",
        answers: ["0"],
        hint: "C++ sequence indices start at zero.",
      },
      {
        id: "bound",
        label: "Stop before five",
        answers: ["<"],
        hint: "Use a strict comparison, without equality.",
      },
      {
        id: "step",
        label: "Move forward by one",
        answers: ["++i", "i++", "i += 1", "i = i + 1"],
        hint: "Increment i. Prefix and postfix both work here.",
      },
    ],
    recall: {
      prompt:
        "Write a for header that visits 0 through 4, using an int counter named i.",
      context:
        "Start at 0, stop before 5, and increment by 1. Write the header only, with no body or trailing semicolon.",
      placeholder: "// Write the for header from memory",
      solution: "for (int i = 0; i < 5; ++i)",
      hint: "for (initialization; condition; increment)",
      explanation:
        "The three clauses initialize i, keep iterating while i < 5, and increment i after each body execution.",
    },
  },
  {
    id: "while-loops",
    title: "While loops",
    subtitle: "While loops",
    tag: "Control flow",
    minutes: 3,
    intro:
      "A while loop repeats as long as a condition is true. It’s useful when the stopping condition matters more than an iteration count.",
    points: [
      {
        title: "Test first",
        text: "The condition is checked before the body. A false initial condition means zero iterations.",
      },
      {
        title: "Update the loop condition",
        text: "The body should eventually make the condition false, unless an intentional break exits the loop.",
      },
      {
        title: "Trace the state",
        text: "Write down the value before and after each iteration. It’s a quick way to catch a loop that never ends.",
      },
    ],
    code: 'int lives = 3;\nwhile (lives > 0)\n{\n    std::cout << lives << " ";\n    --lives;\n}',
    output: "3 2 1",
    pitfall:
      "Forget --lives here and the condition never becomes false. A while loop doesn’t advance its own state.",
    gapCode:
      "int lives = 3;\n[[loop]] (lives > 0)\n{\n    std::cout << lives;\n    [[decrement]];\n}",
    gaps: [
      {
        id: "loop",
        label: "Repeat while the condition holds",
        answers: ["while"],
        hint: "The name of this lesson is the keyword.",
      },
      {
        id: "decrement",
        label: "Remove one life",
        answers: ["--lives", "lives--", "lives -= 1", "lives = lives - 1"],
        hint: "Use the decrement operator or subtract one.",
      },
    ],
    recall: {
      prompt:
        "Write a while header that keeps running while lives is greater than zero.",
      context:
        "Use an explicit greater-than comparison. Write only the header, without a body or trailing semicolon.",
      placeholder: "// Write the while header",
      solution: "while (lives > 0)",
      hint: "Put lives > 0 inside the loop’s parentheses.",
      explanation:
        "The comparison is checked before each iteration. The body is responsible for changing lives.",
    },
  },
  {
    id: "functions",
    title: "Functions & return values",
    subtitle: "Functions & return values",
    tag: "Functions",
    minutes: 4,
    intro:
      "A function accepts parameters, executes statements, and can return a result to its caller.",
    points: [
      {
        title: "Describe the result",
        text: "The type before the name is the return type. void means no value is returned.",
      },
      {
        title: "Name the inputs",
        text: "int n is a parameter passed by value. Inside the function, n is a local copy.",
      },
      {
        title: "Return a value",
        text: "return ends the function immediately and gives its expression’s value to the caller.",
      },
    ],
    code: "int square(int n)\n{\n    return n * n;\n}\n\nstd::cout << square(4);",
    output: "16",
    pitfall:
      "Printing a value and returning it are different operations. A caller can use a returned value in another expression.",
    gapCode: "[[type]] square(int n)\n{\n    [[result]] n * n;\n}",
    gaps: [
      {
        id: "type",
        label: "Return a whole number",
        answers: ["int"],
        hint: "Match the input’s whole-number type.",
      },
      {
        id: "result",
        label: "Send the result to the caller",
        answers: ["return"],
        hint: "This keyword ends the function with a value.",
      },
    ],
    recall: {
      prompt: "Define int square(int n), returning n multiplied by itself.",
      context:
        "Write the full function. Use the requested parameter n and a direct return expression.",
      placeholder: "// Write the function",
      solution: "int square(int n)\n{\n    return n * n;\n}",
      hint: "Return type, name, typed parameter, braces, return n * n;.",
      explanation:
        "The signature promises an int result. Multiplying n by itself computes its square for values that fit in int.",
    },
  },
  {
    id: "strings",
    title: "Strings",
    subtitle: "Strings",
    tag: "Collections",
    minutes: 3,
    intro:
      "std::string owns a sequence of characters. It can grow, be indexed, and expose common operations through member functions.",
    points: [
      {
        title: "String member functions",
        text: "name.size() gives the number of char elements. name.length() is an equivalent spelling.",
      },
      {
        title: "Index carefully",
        text: "The first character is name[0]. at(index) checks bounds and throws if the index is invalid.",
      },
      {
        title: "String length in bytes",
        text: "For UTF-8 text, size() counts bytes, which may differ from the number of visible characters.",
      },
    ],
    code: 'std::string name = "Nova";\nname += "!";\nstd::cout << name << "\\n";\nstd::cout << name.size();',
    output: "Nova!\n5",
    pitfall:
      "size() is a function call: keep the parentheses. For a C++ std::string, length and size are not JavaScript-style properties.",
    gapCode: 'std::[[type]] name = "Nova";\nstd::cout << name.[[length]]();',
    gaps: [
      {
        id: "type",
        label: "An owning text type",
        answers: ["string"],
        hint: "It lives in the std namespace.",
      },
      {
        id: "length",
        label: "Count the char elements",
        answers: ["size", "length"],
        hint: "Two member functions have the same result.",
      },
    ],
    recall: {
      prompt:
        "Write the expression that gets the length of the std::string named name.",
      context:
        "Use a member function. Both standard spellings are accepted, with or without a final semicolon.",
      placeholder: "// Write the expression",
      solution: "name.size()",
      hint: "object.member_function()",
      explanation:
        "size() and length() both return the number of char elements held by the string.",
    },
  },
  {
    id: "vectors",
    title: "Vectors",
    subtitle: "Vectors",
    tag: "Collections",
    minutes: 4,
    intro:
      "std::vector is a dynamic sequence stored contiguously. It’s a useful default when the number of elements can change.",
    points: [
      {
        title: "Choose an element type",
        text: "std::vector<int> holds integers. The template argument says what kind of elements it contains.",
      },
      {
        title: "Append an element",
        text: "push_back adds a value at the end. size() tells you how many elements currently exist.",
      },
      {
        title: "Watch reallocation",
        text: "Growing a vector may move its storage and invalidate pointers, references, and iterators into it.",
      },
    ],
    code: 'std::vector<int> scores = { 12, 18 };\nscores.push_back(42);\nfor (int score : scores)\n{\n    std::cout << score << " ";\n}',
    output: "12 18 42",
    pitfall:
      "reserve(10) changes capacity, not size. It doesn’t create ten elements you can safely access with operator[].",
    gapCode: "std::vector<[[type]]> scores;\nscores.[[append]](42);",
    gaps: [
      {
        id: "type",
        label: "Store whole numbers",
        answers: ["int"],
        hint: "The element type sits between the angle brackets.",
      },
      {
        id: "append",
        label: "Add to the end",
        answers: ["push_back", "emplace_back"],
        hint: "The usual member name means push at the back.",
      },
    ],
    recall: {
      prompt: "Append the integer 42 to the std::vector<int> named scores.",
      context:
        "Write one statement. push_back or emplace_back works for this integer.",
      placeholder: "// Write the append statement",
      solution: "scores.push_back(42);",
      hint: "Call the append member on scores, with 42 as its argument.",
      explanation:
        "push_back adds one element after the current final element, increasing the vector’s size by one.",
    },
  },
  {
    id: "maps",
    title: "Maps & lookups",
    subtitle: "Maps & lookups",
    tag: "Collections",
    minutes: 4,
    intro:
      "A map associates a key with a value. std::unordered_map is a hash table; std::map keeps keys ordered.",
    points: [
      {
        title: "Pair a key and a value",
        text: "std::unordered_map<std::string, int> maps names to integers. Keys are unique.",
      },
      {
        title: "Choose your lookup",
        text: "at(key) reads an existing value and throws if the key is missing. operator[] inserts a default value when absent.",
      },
      {
        title: "Check before reading",
        text: "contains(key) checks membership in C++20. find(key) works in earlier standards too.",
      },
    ],
    code: 'std::unordered_map<std::string, int> scores = {\n    { "Nova", 42 },\n    { "Moss", 18 }\n};\nif (scores.contains("Nova"))\n{\n    std::cout << scores.at("Nova");\n}',
    output: "42",
    pitfall:
      'scores["missing"] changes a non-const map by inserting that key. Prefer at or find when reading should not insert anything.',
    gapCode:
      'if (scores.[[exists]]("Nova"))\n{\n    std::cout << scores.[[read]]("Nova");\n}',
    gaps: [
      {
        id: "exists",
        label: "Check membership (C++20)",
        answers: ["contains"],
        hint: "A boolean member that asks whether the map contains the key.",
      },
      {
        id: "read",
        label: "Read without inserting",
        answers: ["at"],
        hint: "A two-letter checked accessor.",
      },
    ],
    recall: {
      prompt:
        'Read the value for the existing key "Nova" in the map named scores.',
      context:
        "The key is guaranteed to exist. Use at or square-bracket lookup. A final semicolon is optional.",
      placeholder: "// Write the lookup expression",
      solution: 'scores.at("Nova")',
      hint: 'Use scores.at("Nova") or square brackets around the key.',
      explanation:
        "Because the key exists, both accessors read its value. at() also avoids accidental insertion when a key is missing.",
    },
  },
];

export const cppLessons: Lesson[] = originalLessons.map((lesson) => ({
  ...lesson,
  id: `cpp:${lesson.id}`,
  language: "cpp",
}));
