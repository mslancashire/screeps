# Coding With AI

Part of this project is to learn and refresh skill in:

- Javascript
- TypeScript
- Typing, Hints
- Node
- NPM
- Processes => Rollup
- Processes => Test, Build, Watch

However it is also to begin to learn the following AI concepts:

- Prompt engineering
- Agentic engineering
- Harness engineering
- Loop engineering

## Notes on Modern Upgrades

To update your skills from the IE6 era, here are the modern language features we should inject into your code:

- Replace `var` with `let` and `const`: Never use `var`. Use `const` by default, and `let` only if the variable's reference changes.
- Arrow Functions (`=>`): Instead of `function(creep) {}`, use `(creep) => {}`. They are cleaner and automatically bind the lexical context of this.
- Array Methods (`forEach`, `filter`, `map`, `reduce`): Avoid old `for (var i = 0; i < array.length; i++)` loops. Modern JS uses high-order functions for cleaner, declarative data processing.
- Destructuring & Template Literals: Use `const { room, memory } = creep;` to unpack objects instantly, and `Creep ${name} is working` instead of string concatenation (+).
