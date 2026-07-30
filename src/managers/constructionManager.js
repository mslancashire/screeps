/** @type {Record<string, number>} */
const EXTENSION_LIMITS = {
    1: 0,
    2: 5,
    3: 10,
    4: 20,
    5: 30,
    6: 40,
    7: 50,
    8: 60
};

/**
 * @param {Room} room
 */
export function runConstructionManager(room) {
    // Save on CPU
    if (Game.time % 20 !== 0) return;

    const controller = room.controller;
    if (!controller || !controller.my) return;

    // 1. Determine how many extensions
    const rcl = controller.level;
    const maxAllowed = EXTENSION_LIMITS[rcl] || 0;
    if (maxAllowed === 0) return;

    // 2. Count existing extensions + active blueprints
    const existingCount = room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    }).length;

    const blueprintCount = room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    }).length;

    const currentTotal = existingCount + blueprintCount;

    // 3. Create blueprint if needed
    if (currentTotal < maxAllowed) {

        const spawn = room.find(FIND_MY_SPAWNS)[0];
        if (!spawn) return;
        
        const position = findValidExtensionSpot(room, spawn.pos);

        if (position) {
            const result = room.createConstructionSite(position.x, position.y, STRUCTURE_EXTENSION);
            if (result === OK) {
                console.log(`🚧 Automated Construction: Placed extension blueprint at [${position.x}, ${position.y}]`);
            }
        } else {
            console.log('No position for blueprint...');
        }
    }
}

/**
 * @param {Room} room
 * @param {RoomPosition} centerPos
 */
function findValidExtensionSpot(room, centerPos) {
    // Outward spread of 5 tiles
    for (let distance = 2; distance <= 5; distance++) {
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