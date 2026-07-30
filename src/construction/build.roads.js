import BasePlanner from './BasePlanner.js';

const pathingOptions = {
    ignoreCreeps: true,
    swampCost: 1,
    plainCost: 1
};
class RoadsPlanner extends BasePlanner {
    constructor() {
        super(STRUCTURE_ROAD, 0, {});
    }

    /**
     * Overridden Pure Function: Returns every path tile connecting base to sources
     * @param {Room} room 
     * @returns {RoomPosition[]}
     */
    getTargetPositions(room) {
        const spawns = room.find(FIND_MY_SPAWNS);
        if (spawns.length === 0) return [];

        const mainSpawn = spawns[0];
        const controller = room.controller;
        const sources = room.find(FIND_SOURCES);

        const positions = [];

        // 1. Highway: Spawn to every Energy source
        for (const source of sources) {
            const pathToSource = mainSpawn.pos.findPathTo(source.pos, pathingOptions);

            for (const step of pathToSource) {
                positions.push(new RoomPosition(step.x, step.y, room.name));
            }
        }

        if (!controller) {
            return positions;
        }

        // 2. Highway: Spawn to Room Controller
        const pathToController = mainSpawn.pos.findPathTo(controller.pos, pathingOptions);
        for (const step of pathToController) {
            positions.push(new RoomPosition(step.x, step.y, room.name));
        }

        // 3. Highway: Sources to Room Controller
        for (const source of sources) {
            const pathToSource = source.pos.findPathTo(controller.pos, pathingOptions);
            for (const step of pathToSource) {
                positions.push(new RoomPosition(step.x, step.y, room.name));
            }
        }

        return positions;
    }
}

export default new RoadsPlanner();
