const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // State 1: Energy Empty => Go harvest
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }

        // State 2: Energy Full => Go upgrade controller
        if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
            creep.memory.working = true;
            creep.say('⚡ upgrade');
        }

        // Action Loop
        if (creep.memory.working) {
            
            if (!creep.room.controller) {
                console.log(`Warning: Creep ${creep.name} is in a room with no controller.`);
                return;
            }
            
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};

export default roleUpgrader;