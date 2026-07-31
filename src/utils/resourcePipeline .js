import { typeCaster } from "./typeCaster";

export const resourcePipeline = {

    /**
     * Common logic to fill a creep with energy (Piles, Container, Harvesting)
     * @param {Creep} creep 
     */
    fetchEnergy(creep) {

        const harvestMovementOptions = { visualizePathStyle: { stroke: '#ffffff' } };

        // 1. Play grave robber
        const tombstones = creep.room.find(FIND_TOMBSTONES, {
            filter: (t) => t.store[RESOURCE_ENERGY] > 0
        });
        if (tombstones.length > 0)
        {
            const closestTombstone = creep.pos.findClosestByRange(tombstones);
            if (closestTombstone) {
                if (creep.withdraw(closestTombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestTombstone, harvestMovementOptions);
                }
                return;
            }
        }
        
        // 2. Play sweeper
        const drops = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: r => r.resourceType === RESOURCE_ENERGY && r.amount > 20
        });
        if (drops.length > 0) {
            const closestDrop = creep.pos.findClosestByRange(drops);
            if (closestDrop && creep.pickup(closestDrop) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closestDrop, harvestMovementOptions);
            }
            return;
        }

        // 3. Get from source
        const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        if (source) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, harvestMovementOptions);
            }
            return;
        }
    },

    /**
     * Common logic to deposit energy into target structures based on custom sorting
     * @param {Creep} creep
     * @param {((a: AnyStoreStructure, b: AnyStoreStructure) => number) | undefined} sortStrategyFn
     * @returns {boolean}
     */
    depositEnergy(creep, sortStrategyFn) {
        /** @type {StructureConstant[]} */
        const deliverableTypes = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER];

        const genericStructures = creep.room.find(FIND_MY_STRUCTURES);
        const targets = typeCaster.asStructuresWithStore(genericStructures)
            .filter(s => deliverableTypes.includes(s.structureType)
                && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0);

        if (targets.length === 0) return false; // Signal back that no deposit targets exist

        targets.sort(sortStrategyFn);

        const primaryTarget = targets[0];
        if (creep.transfer(primaryTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(primaryTarget, { visualizePathStyle: { stroke: '#ffaa00' } });
        }

        return true;
    }
}