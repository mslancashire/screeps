# Screeps

Refreshing JS knowledge by coding in screeps.

- [Screeps](#screeps)
  - [Main Tasks](#main-tasks)
  - [Game Goals](#game-goals)
  - [Stretch Goals](#stretch-goals)
  - [Solution Setup](#solution-setup)
    - [Prerequisite](#prerequisite)
    - [Getting Started](#getting-started)
    - [Updating AI Context with FS](#updating-ai-context-with-fs)
    - [Individual Dependencies](#individual-dependencies)
    - [Rollup](#rollup)
    - [Types](#types)
  - [Screep Client: Console Command Notes](#screep-client-console-command-notes)
    - [Spawning](#spawning)
  - [Current Status / Supported Features](#current-status--supported-features)
    - [Memory Management](#memory-management)
    - [Automatic Creep Spawning](#automatic-creep-spawning)
    - [Automatic Placement of Structure Blueprints](#automatic-placement-of-structure-blueprints)
    - [Creep Roles](#creep-roles)
    - [Current Level](#current-level)

## Main Tasks

- [x] Start Up
- [x] Integrate automatically to a local server.
- [x] Play about with the basics.

## Game Goals

- [x] Review docs and understand next parts.
- [ ] Optimise builder.
- [ ] Optimise creep spawner based on level of rcl, energy available.
- [ ] Create tower/s and feeders.
- [ ] Add Container Mining.
- [ ] Create road builder.

## Stretch Goals

- [ ] Migrate to type script.
- [ ] Migrate to C# or Python using WASP to build the JS for the integration.

## Solution Setup

### Prerequisite

- Node.js (>= v18) => Runtime used to run the build tools and manage dependencies.
- npm => Package manager.
- VS Code (recommended) => The ideal code editor, providing strict autocomplete via the configured type definitions.
- Screeps Desktop / Steam Client => Required if you intend to use the automated local folder syncing feature.

### Getting Started

1. `npm install` => install dependencies (rollup, type definitions, build plugins)
2. `cp .env.example .env` => Copy template file.
3. Add your local path to .env file.
4. `npm run build` => Runs a one-time compilation. It clears the dist/ directory, bundles your modular files, and outputs a flat main.js copy to both your local workspace and your Screeps client directory.
5. `npm run watch` =>  Enters continuous development mode. Rollup will monitor your src/ directory and automatically re-bundle and redeploy your scripts the absolute moment you save any file.

### Updating AI Context with FS

In powershell run `tree /F /A src`.

### Individual Dependencies

- `npm install --save-dev rollup @rollup/plugin-node-resolve`
- `npm install --save-dev rollup-plugin-clear`
- `npm install --save-dev dotenv`
- `npm install --save-dev @types/screeps @types/lodash`

### Rollup

Rollup has been installed and configured.

`rollup.config.mjs`

- Uses `src/main.js` to find all references and pull them into a single `main.js` and publish to the `dist` folder.
- Copies the `dist/main.js` file to the local folder that the screeps client runs from.

### Types

Intellisense and enforced type checking has been enabled in the `tsconfig.json`

Extra custom types have been added in `types` folder.

- `screeps` => Use for extending the official screep types. Do not add import or require as this breaks the global scope.
- `index` => Used for custom types.

## Screep Client: Console Command Notes

### Spawning

Spawn a new creep.

`Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester1' );`

Change role on the memory of a creep.

`Game.creeps['Harvester1'].memory.role = 'harvester';`

Kill a creep.

`Game.creeps['Harvester1'].suicide();`

Create a construction site.
23, 22: The X and Y grid map coordinates relative to the active room.

`Game.spawns['Spawn1'].room.createConstructionSite(23, 22, STRUCTURE_TOWER);`

Remove all roads from a room.

`_.forEach(Game.rooms['YOUR_ROOM_NAME_HERE'].find(FIND_STRUCTURES, { filter: { structureType: 'road' } }), r => r.destroy());`

Remove all construction sites that are roads.

`_.forEach(Game.constructionSites, s => { if (s.structureType === 'road') s.remove(); });`

## Current Status / Supported Features

### Memory Management

A manager that simply Deletes from Memory creeps that no longer part of the Game.

### Automatic Creep Spawning

A manager that based on very basic role quantity settings and priority order creates new screeps based on the available energy.
It uses a standard body block to dynamically create the Creep body, and has a Harvester role fall back for energy issues.
It does not optimise body parts for roles.

### Automatic Placement of Structure Blueprints

- Extensions => Number based on RCL level, spread is even offset spacing so creeps can still path.
- Towers => Number based on RCL level, does not appear to work.
- Roads => Sources to Spawn, Sources to Controller, Spawn to Controller.

### Creep Roles

Each creep as a `working` memory block that alerts change of state. Then an loop action that carries out either a get energy or carry relevant action based on the role its spawned with.

Each has a fallback to the Upgrader role, if it has nothing else to, e.g. Harvester has no where to deposit energy, Builder has nothing to build.

- Harvester => Basic go fetch energy then deposit energy.
- Upgrader => Basic go fetch energy then upgrade Room Controller.
- Builder => Basic go fetch energy then build any available construction site.

### Current Level

Single Room.
Room Controller is at level 3.
