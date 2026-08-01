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
    * Internal geometry helper: Finds placements based on a center position in a offset grid.
    * @param {Room} room The room the positions are to be found in.
    * @param {RoomPosition} centerPos The centre position.
    * @param {number} maxDistance I assume this forces the positions to be at least 2 away from the centre position?
    * @returns {RoomPosition | null}
    */
    findValidGridSpot(room, centerPos, maxDistance) {
        for (let distance = 2; distance <= maxDistance; distance++) {
            for (let dx = -distance; dx <= distance; dx++) {
                for (let dy = -distance; dy <= distance; dy++) {

                    // Use even check to create a chequerboard grid to allow for walking paths for creeps
                    if ((Math.abs(dx) + Math.abs(dy)) % 2 !== 0) continue;

                    const targetX = centerPos.x + dx;
                    const targetY = centerPos.y + dy;

                    // Check against room boundary (room 0-49)
                    if (targetX < 2 || targetX > 47 || targetY < 2 || targetY > 47) continue;

                    // ignore walls
                    const terrain = room.getTerrain();
                    if (terrain.get(targetX, targetY) === TERRAIN_MASK_WALL) continue;

                    // ignore structures and construction sites
                    const structures = room.lookForAt(LOOK_STRUCTURES, targetX, targetY);
                    const sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, targetX, targetY);

                    const blocked = structures.some(s => s.structureType !== STRUCTURE_ROAD)
                        || sites.some(s => s.structureType !== STRUCTURE_ROAD);

                    if (!blocked) {
                        return new RoomPosition(targetX, targetY, room.name);
                    }
                }
            }
        }

        return null;
    }

    /**
    *  Internal geometry helper: Finds adjacent placements.
    * @param {Room} room The room the positions are to be found in.
    * @param {RoomPosition} centerPos The centre position.
    * @returns {RoomPosition | null}
    */
    findAdjacentOpenSpot(room, centerPos) {
        const terrain = room.getTerrain();
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {

                if (dx === 0 && dy === 0) continue;

                const x = centerPos.x + dx;
                const y = centerPos.y + dy;
                if (x < 2 || x > 47 || y < 2 || y > 47) continue;
                if (terrain.get(x, y) === TERRAIN_MASK_WALL) continue;

                const structures = room.lookForAt(LOOK_STRUCTURES, x, y);
                const sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y);
                const blocked = structures.some(s => s.structureType !== STRUCTURE_ROAD)
                    || sites.some(s => s.structureType !== STRUCTURE_ROAD);

                if (!blocked) {
                    return new RoomPosition(x, y, room.name);
                }
            }
        }
        return null;
    }
}