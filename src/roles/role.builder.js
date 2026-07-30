import roleUpgrader from "./role.upgrader";

const roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        
        // State 1: Energy empty => Go harvest
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }

        // State 2: Energy full => Go build
        if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
            creep.memory.working = true;
            creep.say('🚧 build');
        }

        // Action Loop
        if (creep.memory.working) {
            // Find closest construction sites
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                const closestTarget = creep.pos.findClosestByPath(targets);
                if (closestTarget && creep.build(closestTarget) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestTarget, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // Fallback: No build sites, act as upgrader
                roleUpgrader.run(creep);
            }
        }
        else {
            // Find closest active energy source
            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};

export default roleBuilder;