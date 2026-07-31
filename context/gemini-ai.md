# Gemini AI Current Starting Context

## Goal & Tech Stack

- **Objective:** Refresh JS/TS/Node skills (Moving from IE6/jQuery to ES6 standards). Focused on clean, decoupled architecture.
- **Environment:** Private Screeps Server (Single Room, RCL 4).

## Current Architecture

- **Build System:** Rollup bundler mapping ES modules cleanly to a single compiled main.js file.
- **Construction Queue:** Strategic priority system fully enforced (`Towers -> Extensions -> Roads`).
- **Road Planner:** Fully refactored using native global `PathFinder.search` and custom `CostMatrix` configurations. Bypasses and wraps around energy source boundaries natively using a `range: 1` buffer cap.

## Live File Notes

- `src/utils/typeCaster.js` (Isolated utility handling strict JSDoc array casting to bypass native API constraints)
- `src/utils/resourcePipeline.js` (Centralised resource service handling tombstone scavenging, floor-drop sweeping, and prioritized delivery sorting)
- `src/roles/BaseRole.js` (Class-based parent manager implementing automatic lifecycle hooks and state-toggles)
- `src/roles/role.harvester.js`, `role.upgrader.js`, `role.builder.js` (Sub-classes extending BaseRole)
- `src/roles/index.js` (The Role Registry matching class-based role instances)
- `src/construction/BasePlanner.js` (Class-based parent manager for structure placement)
- `src/managers/towerManager.js` (Independent defence script utilizing isolated JSDoc casting to execute combat rules)

## Next Session Focus

- **Task 1:** Expand the Spawn Manager to utilize your 20 newly unlocked RCL 4 extensions to construct larger, multi-part creep body arrays.
**Task 2:** Inject Extension/Tower coordinates into the Road Planner CostMatrix so highways wrap neatly around structural grids without overlapping.
- **Task 3:** Optimize the Tower repair logic threshold to handle rampart deployment as your defences scale.
- **Task 4** Create a repairer creep, that spawns when necessary and then repairs structures, e.g. roads etc...

## Live File Structure

SRC
|   main.js
|
+---construction
|       BasePlanner.js
|       build.extensions.js
|       build.roads.js
|       build.towers.js
|       index.js
|
+---managers
|       constructionManager.js
|       spawnManager.js
|       towerManager.js
|
+---roles
|       BaseRole.js
|       index.js
|       role.builder.js
|       role.harvester.js
|       role.upgrader.js
|
+---types
|       index.d.ts
|       screeps.d.ts
|
\---utils
        memoryManager.js
        resourcePipeline .js
        typeCaster.js
