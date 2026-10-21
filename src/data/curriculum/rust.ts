import { buildLessons } from "./build";
export const rustLessons = buildLessons("rust", [
  {
    slug: "variables",
    title: "Bindings & mutability",
    subtitle: "Bindings & mutability",
    tag: "Foundations",
    intro:
      "Rust bindings are immutable by default. Add mut when a binding needs to change; shadowing creates a new binding instead.",
    points: [
      ["Opt into change", "let mut allows reassignment. let alone does not."],
      [
        "Infer or annotate",
        "An integer often defaults to i32; annotate when a boundary needs a specific type.",
      ],
      [
        "Shadowing",
        "Another let can reuse a name with a new value or even a different type.",
      ],
    ],
    example:
      'let {{mut}} lives = 3;\nlet damage = 1;\nlives {{-=}} damage;\nprintln!("{}", lives);',
    output: "2",
    pitfall:
      "mut is part of the binding declaration. It does not grant mutation through a shared reference.",
    task: "Declare a mutable binding named lives initialized to 3.",
    context: "Use let mut. An explicit i32 annotation is accepted.",
    solution: "let mut lives = 3;",
    alternatives: ["let mut lives: i32 = 3;"],
    hint: "let mut name = value;",
    explanation:
      "The binding can now be reassigned while remaining statically typed.",
  },
  {
    slug: "loops",
    title: "Ranges & loops",
    subtitle: "Ranges & loops",
    tag: "Control flow",
    intro:
      "A for loop consumes an iterator. A range with .. excludes its upper bound; ..= includes it.",
    points: [
      ["Half-open range", "0..4 yields 0, 1, 2, 3."],
      ["Inclusive range", "0..=4 also yields 4."],
      [
        "Loop values",
        "loop can break with a value; while repeats while a condition holds.",
      ],
    ],
    example:
      'let mut total = 0;\nfor i in {{0..4}} {\n    total {{+=}} i;\n}\nprintln!("{}", total);',
    output: "6",
    pitfall:
      "Rust has no C-style for(init; test; step) syntax and no ++ operator.",
    task: "Write the for-loop header visiting i = 0, 1, 2, 3, including the opening brace.",
    context: "Use 0..4. Do not include the body or closing brace.",
    solution: "for i in 0..4 {",
    hint: "for binding in range {",
    explanation: "The exclusive range gives exactly four iterations.",
  },
  {
    slug: "functions",
    title: "Functions & expressions",
    subtitle: "Functions & expressions",
    tag: "Foundations",
    intro:
      "Rust functions use fn, typed parameters and an optional -> return type. A final expression without a semicolon becomes the return value.",
    points: [
      ["Parameter annotations", "Function parameters require explicit types."],
      ["Tail expression", "n * n without a semicolon returns the value."],
      [
        "Unit",
        "A block ending with a semicolon evaluates to (), unless an explicit return exits first.",
      ],
    ],
    example:
      'fn square(n: i32) {{->}} i32 {\n    {{n * n}}\n}\nprintln!("{}", square(4));',
    output: "16",
    pitfall:
      "A semicolon on the final expression can change the block’s type to ().",
    task: "Write fn square accepting i32 n and returning its square as i32 using a tail expression.",
    context: "An explicit return is also accepted.",
    solution: "fn square(n: i32) -> i32 { n * n }",
    alternatives: ["fn square(n: i32) -> i32 { return n * n; }"],
    hint: "fn name(arg: Type) -> Type { expression }",
    explanation: "The final multiplication is the returned i32.",
  },
  {
    slug: "ownership",
    title: "Ownership & moves",
    subtitle: "Ownership & moves",
    tag: "Memory model",
    intro:
      "A String owns heap storage. Assigning it to another binding moves ownership; the old binding can no longer be read as that String.",
    points: [
      ["One owner", "Owned values are dropped when their owner leaves scope."],
      [
        "Move versus copy",
        "String moves by default; small Copy types such as i32 are copied.",
      ],
      [
        "Explicit cloning",
        "clone duplicates owned data and can allocate. Borrow when you only need to inspect it.",
      ],
    ],
    example:
      'let name = String::{{from}}("Nova");\nlet moved = {{name}};\nprintln!("{}", moved);',
    output: "Nova",
    pitfall:
      "Reading name after moving it is a compile error. A move is not a deep copy.",
    task: "Move the String named name into a new binding named moved.",
    context: "One let statement. No clone or borrow.",
    solution: "let moved = name;",
    hint: "A plain assignment of a String transfers ownership.",
    explanation:
      "moved becomes the owner; name is no longer available for reading that value.",
  },
  {
    slug: "borrowing",
    title: "References & borrowing",
    subtitle: "References & borrowing",
    tag: "Memory model",
    intro:
      "A shared reference borrows a value. A function can inspect data while the caller keeps ownership.",
    points: [
      ["Shared borrow", "&value creates a reference without moving the value."],
      [
        "Read-only view",
        "&str can view string data owned by String or a string literal.",
      ],
      [
        "No dangling reference",
        "The borrowed data must outlive each use of its reference.",
      ],
    ],
    example:
      'fn length(name: {{&str}}) -> usize {\n    name.len()\n}\nlet name = String::from("Nova");\nprintln!("{}", length({{&name}}));\nprintln!("{}", name);',
    output: "4\nNova",
    pitfall:
      "String::len and str::len count bytes, not Unicode characters or grapheme clusters.",
    task: "Declare borrowed as a shared reference to name.",
    context: "Use &name. No annotation needed.",
    solution: "let borrowed = &name;",
    hint: "The & operator borrows instead of moving.",
    explanation:
      "The original owner remains usable while the shared borrow is valid.",
  },
  {
    slug: "mutable-borrow",
    title: "Mutable references",
    subtitle: "Mutable references",
    tag: "Memory model",
    intro:
      "A mutable reference provides exclusive access. During its active use, overlapping shared or mutable borrows of the same data are disallowed.",
    points: [
      ["Mutable owner", "The binding must be mutable to borrow it mutably."],
      ["Exclusive access", "&mut T lets a function update the original value."],
      [
        "Borrow duration",
        "A borrow can end after its last use, before the scope ends.",
      ],
    ],
    example:
      'fn cheer(name: {{&mut String}}) {\n    name.push(\'!\');\n}\nlet mut name = String::from("Nova");\ncheer({{&mut name}});\nprintln!("{}", name);',
    output: "Nova!",
    pitfall:
      "A shared reference cannot remain in use across an overlapping mutable borrow.",
    task: "Call cheer with a mutable reference to name.",
    context: "name is a mutable String and cheer accepts &mut String.",
    solution: "cheer(&mut name);",
    hint: "The call needs &mut, not a move.",
    explanation:
      "cheer edits the caller’s String through an exclusive reference.",
  },
  {
    slug: "vectors",
    title: "Vectors & slices",
    subtitle: "Vectors & slices",
    tag: "Collections",
    intro:
      "Vec<T> owns a growable sequence. A slice &[T] borrows a contiguous view without requiring the caller to own a Vec.",
    points: [
      ["Append", "push adds an item at the end."],
      [
        "Checked access",
        "get returns Option<&T>; indexing panics out of bounds.",
      ],
      [
        "Reallocation",
        "Growing a vector can move its storage, so Rust prevents invalid references into it.",
      ],
    ],
    example:
      'let mut scores = {{vec!}}[10, 20];\nscores.{{push}}(42);\nprintln!("{}", scores.len());',
    output: "3",
    pitfall:
      "An element reference used after a push can violate borrowing rules.",
    task: "Append 42 to the mutable Vec named scores.",
    context: "Use push.",
    solution: "scores.push(42);",
    hint: "The method name is lowercase.",
    explanation: "push increases the vector’s length by one.",
  },
  {
    slug: "option",
    title: "Option & matching",
    subtitle: "Option & matching",
    tag: "Error handling",
    intro:
      "Option<T> represents either Some(T) or None. Matching handles absence explicitly without a null pointer.",
    points: [
      ["Two variants", "Some carries a value; None carries no value."],
      ["if let", "Use if let when only one variant needs action."],
      ["Fallback", "unwrap_or provides a default. unwrap panics on None."],
    ],
    example:
      'let score = Some(7);\nif let {{Some(value)}} = score {\n    println!("{}", {{value}});\n}',
    output: "7",
    pitfall: "unwrap turns ordinary absence into a panic.",
    task: "Declare value as score.unwrap_or(0).",
    context: "score is Option<i32>. Use let.",
    solution: "let value = score.unwrap_or(0);",
    hint: "unwrap_or takes the fallback value directly.",
    explanation: "Some returns its number; None selects zero without a panic.",
  },
  {
    slug: "result",
    title: "Result & propagation",
    subtitle: "Result & propagation",
    tag: "Error handling",
    intro:
      "Result<T, E> represents success or failure. In a compatible returning function, ? returns early on Err and unwraps Ok.",
    points: [
      ["Ok and Err", "Success and error types both appear in the signature."],
      [
        "Propagation",
        "? propagates errors, converting them when the required From conversion exists.",
      ],
      [
        "Parsing",
        "parse::<i32>() returns Result instead of assuming valid input.",
      ],
    ],
    example:
      'fn parse_score(text: &str) -> Result<i32, std::num::ParseIntError> {\n    let score = text.parse::<i32>(){{?}};\n    {{Ok}}(score + 1)\n}\nprintln!("{}", parse_score("41").unwrap_or(0));',
    output: "42",
    pitfall:
      "? cannot propagate a Result from a function returning an ordinary i32.",
    task: "Declare score by parsing text as i32 and propagating an error with ?.",
    context:
      "Inside a compatible Result-returning function. Use turbofish syntax.",
    solution: "let score = text.parse::<i32>()?;",
    hint: "parse::<i32>()?",
    explanation:
      "A valid integer is bound to score; a parse error returns early.",
  },
  {
    slug: "enums",
    title: "Enums & match",
    subtitle: "Enums & match",
    tag: "Data modelling",
    intro:
      "An enum attaches different data to each variant. match must cover every possible case.",
    points: [
      [
        "Payload variants",
        "Ready(i32) carries a number; Waiting has no payload.",
      ],
      ["Destructuring", "A match pattern binds a payload to a local name."],
      [
        "Exhaustive handling",
        "A wildcard covers remaining variants but can hide newly added cases.",
      ],
    ],
    example:
      'enum State { Ready(i32), Waiting }\nlet state = State::Ready(7);\nlet value = {{match}} state {\n    State::Ready(n) => n,\n    State::Waiting {{=>}} 0,\n};\nprintln!("{}", value);',
    output: "7",
    pitfall:
      "Matching an owned enum can move a non-Copy payload. Match a reference to retain ownership.",
    task: "Declare value using match state: Ready(n) gives n; Waiting gives 0.",
    context: "Fully qualify the State variants. Include a comma between arms.",
    solution:
      "let value = match state { State::Ready(n) => n, State::Waiting => 0, };",
    alternatives: [
      "let value = match state { State::Ready(n) => n, State::Waiting => 0 };",
    ],
    hint: "match input { Variant(pattern) => value, ... }",
    explanation: "The match explicitly covers both variants.",
  },
  {
    slug: "iterators",
    title: "Iterator pipelines",
    subtitle: "Iterator pipelines",
    tag: "Collections",
    intro:
      "Iterator adaptors are lazy. map transforms, filter selects, and consumers such as sum perform the work.",
    points: [
      [
        "Borrow or consume",
        "iter borrows elements; into_iter can move them from an owned collection.",
      ],
      [
        "Laziness",
        "An unused map iterator does not run its callback over every item.",
      ],
      [
        "Consumer",
        "sum and collect drive iteration; annotations can resolve their output type.",
      ],
    ],
    example:
      'let scores = vec![2, 5, 8];\nlet total: i32 = scores.{{iter}}()\n    .filter(|&&n| n >= 5)\n    .map(|&n| n * 2)\n    .{{sum}}();\nprintln!("{}", total);',
    output: "26",
    pitfall:
      "filter receives a reference to the iterator item. With iter() that adds a reference layer.",
    task: "Declare total: i32 by summing scores.iter().copied().",
    context: "Use let and sum(). scores contains i32 values.",
    solution: "let total: i32 = scores.iter().copied().sum();",
    hint: "copied converts &i32 items into i32 values.",
    explanation: "The pipeline borrows scores and computes a numeric total.",
  },
  {
    slug: "lifetimes",
    title: "Lifetimes & slices",
    subtitle: "Lifetimes & slices",
    tag: "Memory model",
    intro:
      "A lifetime annotation describes how references relate. It does not extend storage duration or allocate memory.",
    points: [
      [
        "Relationship",
        "A returned reference cannot outlive the input data it refers to.",
      ],
      [
        "Elision",
        "A function with one input lifetime can often omit explicit annotations.",
      ],
      [
        "No local escape",
        "A reference to a local String cannot escape after that String is dropped.",
      ],
    ],
    example:
      'fn echo<\'a>(text: {{&\'a str}}) -> &\'a str {\n    {{text}}\n}\nprintln!("{}", echo("Nova"));',
    output: "Nova",
    pitfall:
      "Adding 'a does not make a local variable live longer. Return owned data when the function creates the data.",
    task: "Write fn echo with lifetime 'a, borrowing text as &'a str and returning it as &'a str.",
    context:
      "Return text as a tail expression. Practice the explicit lifetime rather than elision.",
    solution: "fn echo<'a>(text: &'a str) -> &'a str { text }",
    hint: "Declare <'a> after echo; use &'a str for both references.",
    explanation:
      "The output reference’s validity is connected to the input borrow.",
  },
]);
