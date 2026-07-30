import BasePlanner from "./BasePlanner";

/** @type {Record<string, number>} */
const TOWER_LIMITS = {
    1: 0,
    2: 0,
    3: 1,
    4: 1,
    5: 2,
    6: 2,
    7: 3,
    8: 6
};

class TowersPlanner extends BasePlanner {
    constructor() {
        super(STRUCTURE_TOWER, 2, TOWER_LIMITS)
    }
    
    /**
     * Tactical Pre-Condition Gate
     * @param {Room} room
     * @returns {boolean}
     */
    isRoomReady(room) {        
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            return false;
        }
        
        return true;
    }
}

export default new TowersPlanner();