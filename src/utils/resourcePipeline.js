import { typeCaster } from "./typeCaster";


/**
 * @template TTargetType
 * @typedef {Object} EnergyFetcher
 * @property {string} name
 * @property {(creep: Creep) => TTargetType[]} find
 * @property {(creep: Creep, target: TTargetType) => number} act
 */

/** @type {EnergyFetcher<Tombstone>} */
const graveRobber = {
    name: "GraveRobber",
    find: (creep) => creep.room.find(FIND_TOMBSTONES, { filter: t => t.store[RESOURCE_ENERGY] > 0}),
    act: (creep, target) => creep.withdraw(target, RESOURCE_ENERGY)
}

/** @type {EnergyFetcher<Resource>} */
const sweeper = {
    name: "Sweeper",
    find: (creep) => creep.room.find(FIND_DROPPED_RESOURCES, { filter: r => r.resourceType === RESOURCE_ENERGY && r.amount > 20}),
    act: (creep, target) => creep.pickup(target)
}

/** @type {EnergyFetcher<Source>} */
const miner = {
    name: "Miner",
    find: (creep) => creep.room.find(FIND_SOURCES_ACTIVE),
    act: (creep, target) => creep.harvest(target)
}

/** @type {EnergyFetcher<StructureContainer>} */
const collector = {
    name: "Collector",
    find: (creep) => creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity() > 0}),
    act: (creep, target) => creep.withdraw(target, RESOURCE_ENERGY)
}

export const resourcePipeline = {

    tiers: {
        graveRobber,
        sweeper,
        miner,
        collector
    },

    /**
     * Common logic to fill a creep with energy (Piles, Container, Harvesting)
     * @param {Creep} creep
     * @param {EnergyFetcher<any>[]} tiers
     */
    fetchEnergy(creep, tiers) {

        const harvestMovementOptions = { visualizePathStyle: { stroke: '#ffffff' } };

        for (const energyFetcher of tiers) {
            const targets = energyFetcher.find(creep);
            if (targets && targets.length > 0) {
                const closestTarget = creep.pos.findClosestByRange(targets);
                if (closestTarget) {
                    if (energyFetcher.act(creep, closestTarget) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestTarget, harvestMovementOptions);
                    }
                    return true;
                }
            }
        }

        return false;
    },

    /**
     * Common logic to deposit energy into target structures based on custom sorting
     * @param {Creep} creep
     * @param {((a: AnyStoreStructure, b: AnyStoreStructure) => number) | undefined} sortStrategyFn
     * @returns {boolean}
     */
    depositEnergy(creep, sortStrategyFn) {
        /** @type {StructureConstant[]} */
        const deliverableTypes = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_CONTAINER];

        const genericStructures = creep.room.find(FIND_STRUCTURES);
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