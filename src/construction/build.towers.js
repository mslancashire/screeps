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
     * Checks if room has a controller and its level is equal to or greater than 3.
     * @param {Room} room
     * @returns {boolean}
     */
    isRoomReady(room) {        
        if (!room.controller) return false;

        return room.controller.level >= 3;
    }
}

export default new TowersPlanner();