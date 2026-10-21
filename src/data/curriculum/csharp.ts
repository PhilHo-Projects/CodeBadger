import { buildLessons } from "./build";
export const csharpLessons = buildLessons("csharp", [
  {
    slug: "variables",
    title: "Variables & types",
    subtitle: "Variables & types",
    tag: "Foundations",
    intro:
      "C# is statically typed. var asks the compiler to infer a concrete type; it does not make the value dynamically typed.",
    points: [
      [
        "Value types",
        "int, double and bool hold values. Assigning them copies the value.",
      ],
      [
        "Reference types",
        "A variable holding a class instance refers to an object; assignments can share that object.",
      ],
      [
        "Explicit intent",
        "Use const for a compile-time constant. var requires an initializer.",
      ],
    ],
    example:
      "{{int}} lives = 3;\nconst int damage = 1;\nlives {{-=}} damage;\nConsole.WriteLine(lives);",
    output: "2",
    pitfall:
      "Integer division truncates: 5 / 2 is 2. Use a floating point operand when you need a fraction.",
    task: "Declare int lives initialized to 3.",
    context: "One local declaration. var is also accepted.",
    solution: "int lives = 3;",
    alternatives: ["var lives = 3;"],
    hint: "type name = value;",
    explanation:
      "The compiler knows lives is an int and checks subsequent assignments.",
  },
  {
    slug: "loops",
    title: "Loops & foreach",
    subtitle: "Loops & foreach",
    tag: "Control flow",
    intro:
      "foreach reads each element of a sequence. A for loop is useful when you need an index or a custom step.",
    points: [
      [
        "Element variable",
        "foreach declares a local variable for the current element.",
      ],
      [
        "Exclusive boundary",
        "An index loop normally uses i < items.Length or items.Count.",
      ],
      [
        "Mutation rules",
        "Changing a List structurally while enumerating it can invalidate its enumerator.",
      ],
    ],
    example:
      "int[] scores = { 2, 3, 5 };\nint total = 0;\n{{foreach}} (int score {{in}} scores)\n{\n    total += score;\n}\nConsole.WriteLine(total);",
    output: "10",
    pitfall:
      "Arrays expose Length; List<T> exposes Count. Mixing them up is a common syntax lapse.",
    task: "Write the foreach header that visits every int score in scores.",
    context: "Only the header, without a body.",
    solution: "foreach (int score in scores)",
    alternatives: ["foreach (var score in scores)"],
    hint: "foreach (type item in sequence)",
    explanation: "Each iteration binds score to the next element.",
  },
  {
    slug: "functions",
    title: "Methods",
    subtitle: "Methods",
    tag: "Foundations",
    intro:
      "A method declares its return type before its name. Small static methods are convenient for independent calculations.",
    points: [
      [
        "Signature",
        "Return type, name and parameter list describe how to call the method.",
      ],
      [
        "Expression body",
        "=> expression is concise for a single returned expression.",
      ],
      [
        "Static",
        "A static method belongs to the type rather than an instance.",
      ],
    ],
    example:
      "static int Square(int n) {{=>}} n * n;\nConsole.WriteLine({{Square}}(4));",
    output: "16",
    pitfall: "An expression-bodied method still ends with a semicolon.",
    task: "Write static int Square(int n) as an expression-bodied method returning n * n.",
    context: "Use =>. A block-bodied return is accepted too.",
    solution: "static int Square(int n) => n * n;",
    alternatives: ["static int Square(int n) { return n * n; }"],
    hint: "The arrow replaces the braces and return for one expression.",
    explanation:
      "Square accepts and returns int without depending on instance state.",
  },
  {
    slug: "lists",
    title: "Arrays & lists",
    subtitle: "Arrays & lists",
    tag: "Collections",
    intro:
      "An array has a fixed length. List<T> is a resizable collection with indexed access and a Count property.",
    points: [
      [
        "Element type",
        "List<int> prevents adding a string to a list of numbers.",
      ],
      [
        "Append",
        "Add places an element at the end. Insert places it at a specific index.",
      ],
      [
        "Cost",
        "Indexing is O(1); inserting at the front shifts elements and costs O(n). ",
      ],
    ],
    example:
      "var scores = new List<int> { 10, 20 };\nscores.{{Add}}(42);\nConsole.WriteLine(scores.{{Count}});",
    output: "3",
    pitfall:
      "Capacity is allocated space; Count is the number of elements you can access.",
    task: "Append 42 to the List<int> named scores.",
    context: "Use the collection’s Add method.",
    solution: "scores.Add(42);",
    hint: "C# method names are case-sensitive: Add starts with a capital.",
    explanation: "The list gains one element and Count increases by one.",
  },
  {
    slug: "dictionary",
    title: "Dictionaries",
    subtitle: "Dictionaries",
    tag: "Collections",
    intro:
      "Dictionary<TKey,TValue> connects keys to values. TryGetValue lets you handle a missing key as an ordinary branch.",
    points: [
      [
        "Key lookup",
        "A dictionary indexer throws for a missing key when reading.",
      ],
      ["Try pattern", "TryGetValue returns bool and writes an out value."],
      [
        "Expected cost",
        "Hash-based lookup is normally O(1) on average, with equality and hash rules determining matches.",
      ],
    ],
    example:
      'var scores = new Dictionary<string, int> { ["Nova"] = 7 };\nif (scores.{{TryGetValue}}("Nova", {{out var score}}))\n{\n    Console.WriteLine(score);\n}',
    output: "7",
    pitfall:
      "ContainsKey followed by the indexer performs two lookups. TryGetValue combines the check and read.",
    task: 'Write the if header using scores.TryGetValue("Nova", out var score).',
    context: "Only the header.",
    solution: 'if (scores.TryGetValue("Nova", out var score))',
    hint: "The out declaration introduces score for the result.",
    explanation:
      "The branch runs only if Nova was found, and score contains its value.",
  },
  {
    slug: "nullable",
    title: "Nullability",
    subtitle: "Nullability",
    tag: "Null safety",
    intro:
      "With nullable reference types enabled, string? means the value may be null. The compiler tracks checks so you can handle absence explicitly.",
    points: [
      [
        "Nullable annotation",
        "string? permits null; string expresses a non-null intent checked by analysis.",
      ],
      ["Null conditional", "?. returns null when its receiver is null."],
      ["Fallback", "?? provides a default only for a null value."],
    ],
    example:
      'string? name = null;\nstring label = name {{??}} "Guest";\nConsole.WriteLine(label);',
    output: "Guest",
    pitfall:
      "The null-forgiving ! operator suppresses a warning. It does not prevent NullReferenceException.",
    task: 'Declare string label using name with a null fallback of "Guest".',
    context: "Use ??.",
    solution: 'string label = name ?? "Guest";',
    alternatives: ['var label = name ?? "Guest";'],
    hint: "possiblyNull ?? fallback",
    explanation: "A non-null name is preserved; null selects Guest.",
  },
  {
    slug: "records",
    title: "Records",
    subtitle: "Records",
    tag: "Data modelling",
    intro:
      "A record class supplies value-based equality for its members. A with expression creates a shallow copy with selected changes.",
    points: [
      [
        "Positional record",
        "Constructor parameters become generated properties.",
      ],
      [
        "Non-destructive update",
        "with creates another record without rebinding the source.",
      ],
      [
        "Shallow copy",
        "Referenced collections remain shared unless you copy them explicitly.",
      ],
    ],
    example:
      'var player = new Player("Nova", 3);\nvar updated = player {{with}} { Lives = 2 };\nConsole.WriteLine(updated.Lives);\nrecord Player(string Name, {{int}} Lives);',
    output: "2",
    pitfall:
      "A record containing a mutable List is not deeply immutable just because its properties are init-only.",
    task: "Declare var updated as a with copy of player with Lives set to 2.",
    context: "Use a with expression.",
    solution: "var updated = player with { Lives = 2 };",
    hint: "source with { Property = newValue }",
    explanation:
      "player keeps its original Lives value; updated holds a shallow copy with Lives = 2.",
  },
  {
    slug: "linq",
    title: "LINQ pipelines",
    subtitle: "LINQ pipelines",
    tag: "Collections",
    intro:
      "LINQ composes operations over sequences. Where filters, Select transforms, and ToArray materializes a result.",
    points: [
      ["Where", "Keeps elements for which the predicate is true."],
      ["Select", "Projects each input into a new value."],
      [
        "Deferred evaluation",
        "Many LINQ operators do no work until enumeration. Materialize when you need a snapshot.",
      ],
    ],
    example:
      'int[] scores = { 2, 5, 8 };\nvar doubled = scores.{{Where}}(n => n >= 5)\n    .{{Select}}(n => n * 2).ToArray();\nConsole.WriteLine(string.Join(",", doubled));',
    output: "10,16",
    pitfall:
      "Enumerating a deferred query twice can repeat work and observe mutations made between enumerations.",
    task: "Declare var doubled as scores.Select(n => n * 2).ToArray().",
    context: "Use Select and materialize to an array.",
    solution: "var doubled = scores.Select(n => n * 2).ToArray();",
    hint: "Select transforms; ToArray evaluates the sequence.",
    explanation:
      "The result is a snapshot array containing each doubled score.",
  },
  {
    slug: "patterns",
    title: "Pattern matching",
    subtitle: "Pattern matching",
    tag: "Control flow",
    intro:
      "A switch expression produces a value. Relational patterns let you describe ranges in the order they should be checked.",
    points: [
      ["First match wins", "Place more specific cases before broad fallbacks."],
      [
        "Discard pattern",
        "_ matches any value and commonly provides the default.",
      ],
      ["Expression result", "Each arm must produce a compatible result type."],
    ],
    example:
      'int score = 85;\nstring rank = score {{switch}}\n{\n    >= 80 => "Gold",\n    _ {{=>}} "Unranked"\n};\nConsole.WriteLine(rank);',
    output: "Gold",
    pitfall:
      "Switch expressions use => and comma-separated arms, not case labels and break.",
    task: 'Declare string rank with a switch expression: >= 80 gives "Gold", _ gives "Unranked".',
    context: "Use score as the switch input.",
    solution:
      'string rank = score switch { >= 80 => "Gold", _ => "Unranked" };',
    hint: "input switch { pattern => value, _ => fallback }",
    explanation: "The first matching arm becomes the expression’s value.",
  },
  {
    slug: "classes",
    title: "Classes & encapsulation",
    subtitle: "Classes & encapsulation",
    tag: "Data modelling",
    intro:
      "A class combines state with operations. Restrict writes when the object should enforce rules about its state.",
    points: [
      ["Properties", "An auto-property supplies compiler-generated storage."],
      [
        "Private setter",
        "Other code can read a public property but cannot assign through a private setter.",
      ],
      [
        "Invariant",
        "Methods can keep state within a valid range rather than exposing unrestricted writes.",
      ],
    ],
    example:
      "var counter = new Counter();\ncounter.Increment();\nConsole.WriteLine(counter.Value);\nclass Counter\n{\n    public int Value { get; {{private set;}} }\n    public void Increment() {{=>}} Value++;\n}",
    output: "1",
    pitfall:
      "Reference assignment shares a class instance. It does not clone its fields.",
    task: "Declare public int Value as an auto-property with a getter and private setter.",
    context: "Inside a class. No initializer needed.",
    solution: "public int Value { get; private set; }",
    hint: "Put the access modifier directly on set.",
    explanation:
      "Consumers can observe Value while the class controls mutation.",
  },
  {
    slug: "async",
    title: "Tasks & await",
    subtitle: "Tasks & await",
    tag: "Async flow",
    intro:
      "Task<T> represents a future result. An async method can await it without blocking the calling thread for the entire wait.",
    points: [
      [
        "Async return",
        "Prefer Task or Task<T>; async void is mainly for event handlers.",
      ],
      ["Await", "Await retrieves the result and propagates failure."],
      [
        "Cancellation",
        "Pass a CancellationToken through operations that support cancellation.",
      ],
    ],
    example:
      "static async Task<int> ScoreAsync()\n{\n    {{await}} Task.Delay(1);\n    return 42;\n}\nint value = await {{ScoreAsync}}();\nConsole.WriteLine(value);",
    output: "42",
    pitfall:
      "Using .Result or .Wait() blocks a thread and can deadlock in synchronization contexts.",
    task: "Declare int value as the awaited result of ScoreAsync().",
    context: "Inside an async method or a top-level program.",
    solution: "int value = await ScoreAsync();",
    alternatives: ["var value = await ScoreAsync();"],
    hint: "await precedes the Task-producing call.",
    explanation:
      "The result is an int; exceptions remain on the async control flow.",
  },
  {
    slug: "exceptions",
    title: "Exceptions & cleanup",
    subtitle: "Exceptions & cleanup",
    tag: "Boundaries",
    intro:
      "Catch a specific exception when you have a recovery strategy. using scopes dispose resources even when control leaves through an exception.",
    points: [
      [
        "Specific catch",
        "A FormatException is different from an unexpected programming fault.",
      ],
      [
        "Preserve the stack",
        "Inside catch, throw; rethrows with the original stack information.",
      ],
      [
        "Cleanup",
        "using invokes Dispose when the scope ends; await using supports async disposal.",
      ],
    ],
    example:
      'try\n{\n    int.Parse("oops");\n}\ncatch ({{FormatException}})\n{\n    Console.{{WriteLine}}("Invalid number");\n}',
    output: "Invalid number",
    pitfall:
      "Catching Exception and ignoring it turns failures into misleading success. TryParse is usually better for expected invalid input.",
    task: "Write only the catch header for a FormatException, without a variable.",
    context: "This follows an existing try block.",
    solution: "catch (FormatException)",
    hint: "catch (ExceptionType)",
    explanation:
      "The handler applies only to the expected parse-format failure.",
  },
]);
