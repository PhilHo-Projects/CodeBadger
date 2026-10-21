# CodeBadger roadmap

## Shipped in the language lab

- 48 lessons: 12 each for C++, TypeScript, C#, Rust.
- 24 scenarios with 72 prediction, repair and recall rounds.
- 150 quick typing drills across those languages and Python.
- Configurable sessions, spaced reviews, guided/unaided records, local progress migration and backup transfer.

## Next: practice beyond a known pattern

1. **Test-backed implementation mode.** A blank function, input/output examples, hidden edge cases and useful diagnostics. Start with TypeScript in a restricted worker; compiled languages need a separate isolated runner. The current pattern checker must never masquerade as a general grader.
2. **Trace the state.** Step through indices, collections, references and call stacks; predict the next state before revealing it. Especially useful for Rust moves/borrows, C++ reference invalidation and binary-search invariants.
3. **Interview circuits.** Timed sessions that mix implementation, a bug report, complexity analysis and a verbal explanation checklist. Timing should be optional; accuracy and reasoning remain visible.
4. **Deeper problem families.** Two pointers, sliding windows, stacks, queues, linked lists, trees, BFS/DFS, recursion and dynamic programming. Include constraints, counterexamples and boundary tests, rather than only a canonical snippet.
5. **Adaptive practice variants.** Change names, inputs and conditions without repeating the same answer by muscle memory. Validate every generated variant before publishing it.

## Curriculum depth

- **TypeScript:** unknown-data validation, keyof/indexed access, utility/mapped types, inference constraints, Promise.all, cancellation and event handling.
- **C#:** interfaces, delegates, equality, generics/constraints, IEnumerable versus IQueryable, disposal and CancellationToken.
- **Rust:** structs/traits, HashMap entry APIs, iter versus into_iter, closures, lifetimes across two inputs, Box/Rc/Arc and concurrency basics.
- **C++:** const correctness, iterator invalidation, lambda captures, copy/move semantics, optional/variant, smart-pointer ownership and concurrency fundamentals.

## Other languages, in a useful order

1. **Python learning track:** turn the existing typing library into proper lessons and scenarios. Strong return for general interview preparation.
2. **Go:** compact syntax plus slices, maps, pointers, error returns, interfaces and goroutines.
3. **SQL:** a different practice format with fixture tables, result prediction, joins, grouping, NULL and window functions.
4. **Java:** collections, generics, streams and concurrency if targeting JVM interviews.
5. **Swift or Kotlin:** add when mobile interviews become relevant.

## Quality of practice

- Per-concept mistake notes and a deliberate retry queue.
- Keyboard remapping and editor preferences without forced speed scoring.
- PWA/offline asset caching and install support.
- Optional private sync; retain export/import and local-first use.
- More accepted answer variants backed by parser/test evidence; visible diagnostics for unsupported but plausible answers.
