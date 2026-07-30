/**
 * @implements {IConstructionPlanner}
 */
export default class BasePlanner {
    /**
     * @param {BuildableStructureConstant} structureType
     * @param {number} maxDistance
     * @param {Record<number, number>} limitsMap
    */
    constructor(structureType, maxDistance, limitsMap) {
        this.structureType = structureType;
        this.maxDistance = maxDistance;
        this.limitsMap = limitsMap;
    }
    
    /**
     * Calculates and return potential Layout positions
     * @param {Room} room
     * @returns {RoomPosition[]} An array of intended positions (empty if cap reached)
     */
    getTargetPositions(room) {
        const rcl = room.controller ? room.controller.level : 0;
        const maxAllowed = this.limitsMap[rcl] || 0;
        if (maxAllowed === 0) return [];

        const existing = room.find(FIND_MY_STRUCTURES, this.filterByStructureType()).length;
        const pending = room.find(FIND_MY_CONSTRUCTION_SITES, this.filterByStructureType()).length;

        if ((existing + pending) >= maxAllowed) return [];

        const spawn = room.find(FIND_MY_SPAWNS);
        if (spawn.length === 0) return [];

        const openSpot = this.findValidGridSpot(room, spawn[0].pos, this.maxDistance);

        return openSpot ? [openSpot] : [];
    }

    filterByStructureType() {
        return { filter: { structureType: this.structureType } };
    }

    /**
    *  Internal geometry helper
    * @param {Room} room
    * @param {RoomPosition} centerPos
    * @param {number} maxDistance
    * @returns {RoomPosition | null}
    */
    findValidGridSpot(room, centerPos, maxDistance) {
        // Outward spread of 5 tiles
        for (let distance = 2; distance <= maxDistance; distance++) {
            for (let dx = -distance; dx <= distance; dx++) {
                for (let dy = -distance; dy <= distance; dy++) {

                    // Use even check to create a chequerboard grid to allow for walking paths for creeps
                    if ((Math.abs(dx) + Math.abs(dy)) % 2 !== 0) continue;

                    const targetX = centerPos.x + dx;
                    const targetY = centerPos.y + dy;

                    // Check against room boundary (room 0-49)
                    if (targetX < 2 || targetX > 47 || targetY < 2 || targetY > 47) continue;

                    // Check what's occupying tile
                    const objects = room.lookAt(targetX, targetY);
                    let isBlocked = false;

                    for (const obj of objects) {
                        if (obj.type === 'terrain' && obj.terrain === 'wall') isBlocked = true;
                        if (obj.type === 'structure') isBlocked = true;
                        if (obj.type === 'constructionSite') isBlocked = true;
                    }

                    if (!isBlocked) {
                        return new RoomPosition(targetX, targetY, room.name);
                    }
                }
            }
        }

        return null;
    }
}