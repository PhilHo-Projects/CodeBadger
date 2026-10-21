import { buildLessons } from "./build";
export const typescriptLessons = buildLessons("typescript", [
  {
    slug: "variables",
    title: "Give your values a contract.",
    subtitle: "Bindings & types",
    tag: "Foundations",
    intro:
      "TypeScript checks JavaScript before it runs. Let inference do the easy work, and annotate boundaries where a contract helps the reader.",
    points: [
      [
        "let or const",
        "const prevents rebinding; let allows it. Neither makes an object deeply immutable.",
      ],
      [
        "Infer locally",
        "A numeric initializer infers number. An annotation makes the intended type explicit.",
      ],
      [
        "Types disappear",
        "A type annotation provides no runtime validation for a network response.",
      ],
    ],
    example:
      "{{let}} lives: {{number}} = 3;\nconst damage = 1;\nlives -= damage;\nconsole.log(lives);",
    output: "2",
    pitfall:
      "number includes integers and floating point. A string containing digits is still a string.",
    task: "Declare a mutable number named lives initialized to 3, with an explicit type annotation.",
    context: "Use let and number. One declaration.",
    solution: "let lives: number = 3;",
    hint: "let name: type = value;",
    explanation:
      "The annotation restricts assignments to numbers; let permits the value to change.",
  },
  {
    slug: "loops",
    title: "Keep the boundary in sight.",
    subtitle: "Loops & boundaries",
    tag: "Control flow",
    intro:
      "Use an indexed loop when the position matters. Use for...of when you only need each value.",
    points: [
      [
        "Exclusive upper bound",
        "i < values.length stops before the first missing element.",
      ],
      [
        "Values versus keys",
        "for...of visits iterable values; for...in enumerates property keys.",
      ],
      [
        "Know the cost",
        "A single pass over n items is O(n) time and can use O(1) extra space.",
      ],
    ],
    example:
      "let total = 0;\nfor (let i = 0; i {{<}} 4; {{i++}}) {\n    total += i;\n}\nconsole.log(total);",
    output: "6",
    pitfall:
      "<= length visits one element too many. Reading outside an array returns undefined.",
    task: "Write only a for-loop header that visits i = 0, 1, 2, 3.",
    context: "Initialize with let i = 0, test i < 4, and increment i.",
    solution: "for (let i = 0; i < 4; i++)",
    alternatives: ["for (let i = 0; i < 4; ++i)"],
    hint: "Three clauses, separated by semicolons.",
    explanation:
      "The strict comparison excludes 4 and gives exactly four iterations.",
  },
  {
    slug: "functions",
    title: "Make inputs and outputs explicit.",
    subtitle: "Functions",
    tag: "Foundations",
    intro:
      "A function signature describes the values it accepts and returns. Keep a small function focused on one transformation.",
    points: [
      [
        "Parameter types",
        "Annotate parameters when the surrounding context cannot infer them.",
      ],
      [
        "Return contract",
        "Return types can be inferred, but explicit types help at public boundaries.",
      ],
      [
        "Pure operations",
        "A pure function depends on its inputs and does not mutate outside state.",
      ],
    ],
    example:
      "function square(n: {{number}}): number {\n    {{return}} n * n;\n}\nconsole.log(square(4));",
    output: "16",
    pitfall:
      "A block-bodied arrow needs return; an expression-bodied arrow returns its expression automatically.",
    task: "Write square as a function declaration accepting number n and returning number n * n.",
    context: "Include both type annotations and the function body.",
    solution: "function square(n: number): number { return n * n; }",
    hint: "function name(parameter: type): returnType { return ...; }",
    explanation:
      "The signature documents the numeric contract, and multiplication produces the square.",
  },
  {
    slug: "arrays",
    title: "Transform without losing the original.",
    subtitle: "Arrays & transforms",
    tag: "Collections",
    intro:
      "filter chooses elements; map transforms each one. Both create new arrays, so a small pipeline can express a data transformation clearly.",
    points: [
      [
        "filter keeps",
        "Its callback returns a boolean-like value for each item.",
      ],
      [
        "map transforms",
        "Its callback returns one output item for every input item.",
      ],
      [
        "Mutation is separate",
        "sort and reverse mutate the original array. Copy first if that matters.",
      ],
    ],
    example:
      'const scores = [2, 5, 8];\nconst passed = scores.{{filter}}(n => n >= 5);\nconst doubled = passed.{{map}}(n => n * 2);\nconsole.log(doubled.join(","));',
    output: "10,16",
    pitfall:
      "map with a block body and no return creates an array of undefined values.",
    task: "Declare const doubled by mapping scores to each number multiplied by 2.",
    context: "Use scores.map and an expression arrow with parameter n.",
    solution: "const doubled = scores.map(n => n * 2);",
    alternatives: ["const doubled = scores.map((n) => n * 2);"],
    hint: "map(n => expression)",
    explanation: "map returns a new array; scores remains unchanged.",
  },
  {
    slug: "objects",
    title: "Handle the value that might be missing.",
    subtitle: "Optional values",
    tag: "Null safety",
    intro:
      "An optional property can be undefined. Optional chaining stops at a nullish receiver; nullish coalescing supplies a fallback only for null or undefined.",
    points: [
      ["Optional property", "name?: string permits the property to be absent."],
      [
        "Optional chaining",
        "?. avoids dereferencing a nullish value; it does not catch exceptions.",
      ],
      [
        "Use ?? deliberately",
        "Unlike ||, ?? preserves 0, false and the empty string.",
      ],
    ],
    example:
      'const user: { name?: string } = {};\nconst label = user.name {{??}} "Guest";\nconsole.log(label);',
    output: "Guest",
    pitfall:
      "A non-null assertion (!) silences the checker but adds no runtime check.",
    task: 'Declare const label as user.name with a nullish fallback of "Guest".',
    context: "Use ??, not ||. Keep empty names if they are present.",
    solution: 'const label = user.name ?? "Guest";',
    hint: "left ?? fallback",
    explanation: "Only null and undefined select the fallback.",
  },
  {
    slug: "narrowing",
    title: "Check it, then use it.",
    subtitle: "Union narrowing",
    tag: "Type system",
    intro:
      "A runtime check lets TypeScript narrow a union. The guard and the code it protects should describe the same fact.",
    points: [
      [
        "Union means either",
        "string | number supports only operations valid for both until narrowed.",
      ],
      [
        "typeof guard",
        "typeof value === 'string' enables string-specific operations in that branch.",
      ],
      [
        "Avoid broad assertions",
        "An assertion changes the checker’s view without changing the value.",
      ],
    ],
    example:
      'function lengthOf(value: string | number): number {\n    if ({{typeof value === "string"}}) {\n        return value.length;\n    }\n    return 0;\n}\nconsole.log(lengthOf("Nova"));',
    output: "4",
    pitfall:
      "typeof null is 'object'. Test for null explicitly before accessing an object.",
    task: "Write only an if header that narrows value to string using typeof.",
    context: 'Use a strict equality comparison against "string".',
    solution: 'if (typeof value === "string")',
    hint: "typeof returns a string describing the runtime primitive category.",
    explanation:
      "Inside the branch, the checker knows value supports string methods.",
  },
  {
    slug: "unions",
    title: "Let the tag choose the shape.",
    subtitle: "Discriminated unions",
    tag: "Type system",
    intro:
      "A shared literal property connects a variant’s tag to its payload. Checking the tag narrows the whole object.",
    points: [
      [
        "Literal tags",
        "kind: 'ok' and kind: 'error' distinguish the variants.",
      ],
      [
        "Payload safety",
        "Read value only after narrowing to the variant that contains it.",
      ],
      [
        "Exhaustiveness",
        "A never check can make a missing branch a compile error.",
      ],
    ],
    example:
      'type Reply = { kind: "ok"; value: number }\n    | { kind: "error"; message: string };\nfunction unwrap(reply: Reply): number {\n    return reply.kind {{===}} "ok" ? reply.{{value}} : 0;\n}\nconsole.log(unwrap({ kind: "ok", value: 7 }));',
    output: "7",
    pitfall:
      "Making every payload property optional loses the link between the tag and the data.",
    task: 'Write an if header checking whether reply.kind is "ok".',
    context: "Use === to narrow the tagged union.",
    solution: 'if (reply.kind === "ok")',
    hint: "Check the shared discriminant, not whether a payload happens to be truthy.",
    explanation:
      "The literal tag identifies the variant even if its numeric value is zero.",
  },
  {
    slug: "generics",
    title: "Preserve the type you were handed.",
    subtitle: "Generics",
    tag: "Type system",
    intro:
      "A type parameter expresses a relationship. An identity function returns the same type it accepts without falling back to any.",
    points: [
      ["One relationship", "T connects the argument to the return type."],
      ["Inference at the call", "The compiler can infer T from the argument."],
      [
        "Constraints",
        "T extends { length: number } permits length access without requiring one concrete type.",
      ],
    ],
    example:
      "function identity<{{T}}>(value: T): {{T}} {\n    return value;\n}\nconsole.log(identity(42));",
    output: "42",
    pitfall: "any discards checking. unknown requires narrowing before use.",
    task: "Write a generic identity function with type parameter T and argument value.",
    context: "Use a function declaration, returning value unchanged.",
    solution: "function identity<T>(value: T): T { return value; }",
    hint: "Put <T> after the function name; use T for input and return.",
    explanation:
      "The caller’s concrete type is preserved through the function.",
  },
  {
    slug: "maps",
    title: "Count what you encounter.",
    subtitle: "Maps & counting",
    tag: "Collections",
    intro:
      "A Map stores key-value pairs without object prototype keys. A missing get returns undefined, which fits naturally with a nullish fallback.",
    points: [
      [
        "Typed key and value",
        "Map<string, number> limits both sides of the association.",
      ],
      [
        "Read then write",
        "get reads; set inserts or replaces and returns the map.",
      ],
      [
        "Expected complexity",
        "Hash-style lookups are typically constant time on average; the spec requires sublinear average access.",
      ],
    ],
    example:
      'const counts = new Map<string, number>();\nfor (const word of ["hi", "hi"]) {\n    counts.{{set}}(word, (counts.get(word) {{??}} 0) + 1);\n}\nconsole.log(counts.get("hi"));',
    output: "2",
    pitfall:
      "Setting a property with counts[word] does not create a Map entry.",
    task: "Write the statement that increments word in counts, defaulting a missing count to zero.",
    context: "Use counts.set, counts.get and ?? 0.",
    solution: "counts.set(word, (counts.get(word) ?? 0) + 1);",
    hint: "Set the key to its old count plus one.",
    explanation: "The fallback covers unseen words without a separate branch.",
  },
  {
    slug: "sets",
    title: "Keep only the first occurrence.",
    subtitle: "Sets & membership",
    tag: "Collections",
    intro:
      "A Set stores unique values. Spreading it back into an array preserves first-insertion order for primitive values.",
    points: [
      ["Membership", "has checks whether a value is present."],
      ["Deduplication", "new Set(values) removes repeated primitive values."],
      [
        "Identity matters",
        "Two separately created objects are distinct keys even if their fields match.",
      ],
    ],
    example:
      'const ids = [3, 1, 3, 2];\nconst unique = [...new {{Set}}(ids)];\nconsole.log(unique.{{join}}(","));',
    output: "3,1,2",
    pitfall:
      "A Set does not sort its values. Deduplication and sorting are separate operations.",
    task: "Declare const unique as an array of the unique values in ids using Set and spread.",
    context: "Preserve insertion order.",
    solution: "const unique = [...new Set(ids)];",
    hint: "Wrap the Set in an array spread.",
    explanation:
      "Set removes duplicates; spread materializes the iterable into an array.",
  },
  {
    slug: "async",
    title: "Wait for the value, not the promise.",
    subtitle: "Async & await",
    tag: "Async flow",
    intro:
      "An async function always returns a Promise. await unwraps a fulfilled value or throws the rejection at that point.",
    points: [
      [
        "Return shape",
        "async function returning number has a Promise<number> result.",
      ],
      [
        "Sequential awaits",
        "A later operation starts after an earlier await unless you start both promises first.",
      ],
      [
        "Error path",
        "Handle rejections with try/catch at a boundary that can recover.",
      ],
    ],
    example:
      "{{async}} function score(): Promise<number> {\n    return 42;\n}\nasync function main() {\n    const value = {{await}} score();\n    console.log(value);\n}\nvoid main();",
    output: "42",
    pitfall:
      "forEach does not wait for async callbacks. Use for...of for sequential work, or Promise.all for independent work.",
    task: "Inside an async function, declare const value as the awaited result of score().",
    context: "One statement.",
    solution: "const value = await score();",
    hint: "await goes before the promise expression.",
    explanation: "value is the resolved number, rather than a Promise<number>.",
  },
  {
    slug: "errors",
    title: "Treat a caught value as unknown.",
    subtitle: "Errors & validation",
    tag: "Boundaries",
    intro:
      "JavaScript can throw any value. Narrow a caught value before reading Error-specific properties.",
    points: [
      [
        "Unknown catch value",
        "Strict catch variables need a guard before accessing message.",
      ],
      [
        "instanceof",
        "An Error check enables its message and stack properties.",
      ],
      [
        "Validate input",
        "Static types do not validate JSON. Check external data when it enters the app.",
      ],
    ],
    example:
      'try {\n    throw new Error("Offline");\n} catch (error) {\n    if (error {{instanceof}} Error) {\n        console.log(error.{{message}});\n    }\n}',
    output: "Offline",
    pitfall:
      "Casting a response to User can hide malformed data; it does not transform or validate it.",
    task: "Write an if header that checks whether error is an Error instance.",
    context: "Use instanceof.",
    solution: "if (error instanceof Error)",
    hint: "value instanceof Constructor",
    explanation: "The guard makes reading error.message valid in the branch.",
  },
]);
