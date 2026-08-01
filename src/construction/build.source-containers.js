import BasePlanner from "./BasePlanner";

export class SourceContainerPlanner extends BasePlanner {
    constructor() {
        super(STRUCTURE_CONTAINER, 1, {})
    }
    
    /**
     * Checks if room has a controller and its level is equal to or greater than 2.
     * @param {Room} room
     * @returns {boolean}
     */
    isRoomReady(room) {        
        
        // not sure if you add these to room without controller, we may consider this in the future for long distance mining
        if (!room.controller) return false;

        // 2 is used to allow for room startup, this could be optimised
        return room.controller.level >= 2;
    }

    /**
      Overridden Pure Function: Returns a single container for each energy source.
     * @param {Room} room
     * @returns {RoomPosition[]}
     */
    getTargetPositions(room) {
        
        const sources = room.find(FIND_SOURCES);

        for (const source of sources) {
            const structures = room.lookForAtArea(LOOK_STRUCTURES, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
            const sites = room.lookForAtArea(LOOK_CONSTRUCTION_SITES, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
            
            const hasContainer = structures.some(s => s.structure.structureType === STRUCTURE_CONTAINER)
                        || sites.some(s => s.constructionSite.structureType === STRUCTURE_CONTAINER);

            if (hasContainer) {
                continue;
            }

            const position = super.findAdjacentOpenSpot(room, source.pos);
            if (position) return [position];
        }
        
        return [];
    }
}

export default new SourceContainerPlanner();