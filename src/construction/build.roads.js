import BasePlanner from './BasePlanner.js';



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
        const [mainSpawn] = room.find(FIND_MY_SPAWNS);
        if (!mainSpawn) return [];

        const controller = room.controller;
        const sources = room.find(FIND_SOURCES);

        /**
         * @type {RoomPosition[]}
         */
        let rawPositions = [];

        const pathingOptions = {
            swampCost: 1,
            plainCost: 1,
            roomCallback: (/** @type {string} */ roomName) => {
                if (roomName !== room.name) return false;
                const costs = new PathFinder.CostMatrix();
                for (const src of sources) {
                    costs.set(src.pos.x, src.pos.y, 255);
                }
                return costs;
            }
        };

        // helper for finding a safe path
        const getSafePath = (/** @type {RoomPosition} */ start, /** @type {any} */ end) => {
            const searchResult = PathFinder.search(start, { pos: end, range: 1 }, pathingOptions);
            return searchResult.path;
        }

        // 1. Highway: Spawn to every Energy source
        for (const source of sources) {
            rawPositions = [...rawPositions, ...getSafePath(mainSpawn.pos, source.pos)];
        }

        if (controller) {
            // 2. Highway: Sources to Room Controller
            for (const source of sources) {
                rawPositions = [...rawPositions, ...getSafePath(source.pos, controller.pos)]
            }

            // 3. Highway: Spawn to Room Controller
            rawPositions = [...rawPositions, ...getSafePath(mainSpawn.pos, controller.pos)];
        }

        const uniquePositions = rawPositions.filter((pos, index, self) =>
            self.findIndex(p => p.x === pos.x && p.y === pos.y) === index);

        const unbuiltPositions = uniquePositions.filter(pos => {
            const existingStructures = room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y);
            const existingBlueprints = room.lookForAt(LOOK_CONSTRUCTION_SITES, pos.x, pos.y);
            const hasRoad = existingStructures.some(s => s.structureType === STRUCTURE_ROAD);
            return !hasRoad && existingBlueprints.length === 0;
        });

        return unbuiltPositions;
    }
}

export default new RoadsPlanner();
