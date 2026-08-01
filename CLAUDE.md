# AI Current Starting Context

## Project Content

This is for writing a bot for the game of Screeps.

## Working Mode

I write the code — explain, review, and suggest approaches, don't implement directly, this is for my benefit in learning.

## Goal & Tech Stack

- **Objective:** Refresh JS/TS/Node skills (Moving from IE6/jQuery to ES6 standards). Focused on clean, decoupled architecture.
- **Environment:** Private Screeps Server (Single Room, RCL 4).

## Current Architecture

- **Build System:** Rollup bundler mapping ES modules cleanly to a single compiled main.js file.
- **Construction Queue:** Strategic priority system fully enforced (`Towers -> Extensions -> Source Containers -> Roads`).
- **Road Planner:** Fully refactored using native global `PathFinder.search` and custom `CostMatrix` configurations. Bypasses and wraps around energy source boundaries natively using a `range: 1` buffer cap.
- **Role Composition:** Roles can compose other roles' behavior directly (e.g. RepairerRole holds a reference to the Builder role singleton) rather than only via inheritance, for fallback chains.
- **Energy Pipeline:** `resourcePipeline.js` uses a tiered fetcher pattern (`EnergyFetcher<T>` — generic find/act pairs: graveRobber, sweeper, miner, collector) and a priority-comparator pattern for deposits. Both are supplied per-role via `BaseRole` virtual methods (`getGatheringTiers()`) or comparator params (`depositEnergy`), not hardcoded centrally — new roles override to customize.

## Live File Notes

### Utils

- `src/utils/memoryManager.js` (Remove dead creeps from memory)
- `src/utils/typeCaster.js` (Isolated utility handling strict JSDoc array casting to bypass native API constraints)
- `src/utils/resourcePipeline.js` (Centralised resource service handling tombstone scavenging, floor-drop sweeping, and prioritized delivery sorting)

### Managers

- `src/managers/towerManager.js` (Independent defence script utilizing isolated JSDoc casting to execute combat rules)

### Structure Planners

- `src/construction/BasePlanner.js` (Class-based parent manager for structure placement)
- `src/construction/index.js` (The Planner Registry, Towers -> Extensions -> Source Containers -> Roads (reasoning: towers rarely compete for build slots; extensions compound creep capacity; containers unlock static mining; roads are polish))
- `src/construction/SourceContainerPlanner.js` (Places one Container adjacent to each energy source, RCL2+ gated, overrides getTargetPositions fully rather than using BasePlanner's spawn-centered grid)

### Roles

- `src/roles/BaseRole.js` (Class-based parent manager implementing automatic lifecycle hooks and state-toggles)
- `src/roles/index.js` (The Role Registry matching class-based role instances)
- `src/roles/role.repairer.js` (Repairs owned structures, then unowned roads, falls back to Builder role via composition, then BaseRole's default upgrade fallback)
- `src/roles/role.harvester.js` (Deposits energy by type priority: Spawn > Extension > Tower > Container; gathers via miner tier only — no scavenging, dedicated source harvesting)

## Tasks for Next Session Focus

1. ~~Expand Spawn Manager for RCL4 extensions~~ → still pending, now understood to overlap with static mining body-part sizing (WORK parts should roughly match source regen rate)
2. ~~Scale creep count by RCL/energy~~ → still pending
3. ~~Create Repair role~~ → DONE
4. Create Spawn-adjacent Container planner variant (reuse BasePlanner's grid spread, unlike the Source variant)
5. Create static Harvester role (parks at source/container, no working/gathering toggle) + Hauler role (fetches from containers, delivers — needs its own getGatheringTiers() override, e.g. collector-first, miner excluded entirely)
6. Long-distance mining — still parked, revisit only if static mining alone doesn't resolve the energy bottleneck
7. Inject Extension/Tower coords into Road Planner CostMatrix
8. Optimize Tower repair threshold for rampart deployment

## Live File Structure

SRC
|   main.js
|
+---construction
|       BasePlanner.js
|       build.extensions.js
|       build.roads.js
|       build.source-containers.js
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
|       role.repairer.js
|       role.upgrader.js
|
+---types
|       index.d.ts
|       screeps.d.ts
|
\---utils
        memoryManager.js
        resourcePipeline.js
        typeCaster.js
