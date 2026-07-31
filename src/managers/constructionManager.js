import buildingRegistry from "../construction";

/**
 * @param {Room} room
 */
export function runConstructionManager(room) {

    // Save on CPU
    if (Game.time % 20 !== 0) return;

    // Throttle builds
    const activeSites = room.find(FIND_MY_CONSTRUCTION_SITES).length;
    if (activeSites >= 3) {
        console.log(`🚧 Automated Construction: Too many active sites.`);
        return;
    };

    for (const plan of buildingRegistry) {

        if (plan.isRoomReady && !plan.isRoomReady(room)) {
            console.log(`🚧 Automated Construction: ${plan.structureType} room not ready.`);
            continue;
        }

        const targets = plan.getTargetPositions(room);

        if (!targets || targets.length === 0) {
            console.log(`🚧 Automated Construction: ${plan.structureType} no target positions.`);
        }

        for (const targetPosition of targets) {

            if (plan.structureType !== STRUCTURE_ROAD) {
                clearRoadObstaclesAt(room, targetPosition, plan.structureType);
            }

            const result = room.createConstructionSite(targetPosition.x, targetPosition.y, plan.structureType);
            if (result === OK) {
                console.log(`🚧 Automated Construction: Placed ${plan.structureType} blueprint at [${targetPosition.x}, ${targetPosition.y}]`);
                return; // only place one, to save CPU load
            } else {
                console.log(`🚧 Automated Construction: ${plan.structureType} placement failed at (${targetPosition.x}, ${targetPosition.y}) with code: ${result}`);
            }
        }
    }
}

/**
     * Internal helper to handle the structural clearing responsibility
     * @param {Room} room
     * @param {RoomPosition} pos
     * @param {string} buildingType
     */
function clearRoadObstaclesAt(room, pos, buildingType) {
    const structures = room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y);
    const sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, pos.x, pos.y);

    const roadSite = sites.find(s => s.structureType === STRUCTURE_ROAD);
    const roadStructure = structures.find(s => s.structureType === STRUCTURE_ROAD);

    if (roadSite) {
        console.log(`🚧 Automated Construction: Clearing road blueprint at (${pos.x}, ${pos.y}) for incoming ${buildingType}`);
        roadSite.remove();
    }

    if (roadStructure) {
        console.log(`🚧 Automated Construction: Evicting operational road at (${pos.x}, ${pos.y}) for incoming ${buildingType}`);
        roadStructure.destroy();
    }
}
