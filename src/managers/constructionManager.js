import buildingRegistry from "../construction";

/**
 * @param {Room} room
 */
export function runConstructionManager(room) {
    
    // Save on CPU
    if (Game.time % 20 !== 0) return;

    // Throttle builds
    const activeSites = room.find(FIND_MY_CONSTRUCTION_SITES).length;
    if (activeSites >= 3) return;

    for (const plan of buildingRegistry) {
        
        if (plan.isRoomReady && !plan.isRoomReady(room)) {
            continue;
        }
        
        const targets = plan.getTargetPositions(room);

        for (const targetPosition of targets) {
            if (canPlaceBlueprintAt(room, targetPosition, plan.structureType)) {
                const result = room.createConstructionSite(targetPosition.x, targetPosition.y, plan.structureType);
                if (result === OK) {
                    console.log(`🚧 Automated Construction: Placed ${plan.structureType} blueprint at [${targetPosition.x}, ${targetPosition.y}]`);
                    return; // only place one, to save CPU load
                }
            }
        }
    }
}

/**
 * Validation check to verify if a coordinate can receive this specific blueprint
 * @param {Room} room
 * @param {RoomPosition} pos
 * @param {string} structureType
 */
function canPlaceBlueprintAt(room, pos, structureType) {
    const objects = room.lookAt(pos.x, pos.y);

    for (const obj of objects) {
        if (obj.type === 'terrain' && obj.terrain === 'wall') return false;
        if (obj.type === 'constructionSite') return false;
        if (obj.type === 'structure' && obj['structure']) {
            // If the exact structure is already standing there, we don't need a blueprint
            if (obj.structure.structureType === structureType) return false;
            
            // Roads can overlap with other structures, but extensions/towers cannot
            if (structureType !== STRUCTURE_ROAD) return false;
        }
    }
    return true;
}