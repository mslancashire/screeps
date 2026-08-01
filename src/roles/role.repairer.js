import { resourcePipeline } from '../utils/resourcePipeline';
import BaseRole from './BaseRole';
import builderRole from './role.builder';

export class RepairerRole extends BaseRole {

    constructor() {
        super(
            'repairer',
            'repair',
            '🔨'
        );
    }

    /**
     * @param {String} structureType
     */
    static #structuralRequirement(structureType) {
        switch (structureType) {
            case STRUCTURE_ROAD:
                return 0.7;
            case STRUCTURE_RAMPART:
                return 0.05;
            default:
                return 0.5;
        }
    }

    /**
     * @param {Creep} creep
     */
    onWorkState(creep) {

        const threshold = RepairerRole.#structuralRequirement;

        // 1. Repair My Structures
        const myTargets = creep.room.find(FIND_MY_STRUCTURES);
        const repairableTargets = myTargets.filter(s => s.hits <= s.hitsMax * threshold(s.structureType));
        if (repairableTargets.length > 0) {
            this.repairTarget(creep, repairableTargets);            
            return;
        }

        // 2. Repair Valid Neutral Structures
        /** @type string[] */
        const validNeutralTargets = [STRUCTURE_ROAD];
        const neutralTargets = creep.room.find(FIND_STRUCTURES, {
            filter: s => validNeutralTargets.includes(s.structureType)
                && s.hits <= s.hitsMax * threshold(s.structureType)
        });
        if (neutralTargets.length > 0) {            
            this.repairTarget(creep, neutralTargets);            
            return;
        }

        builderRole.onWorkState(creep);
    }

    /**
     * @param {Creep} creep
     * @param {AnyStructure[]} targets
     */
    repairTarget(creep, targets) {
        const closestTarget = creep.pos.findClosestByPath(targets);
        if (closestTarget && creep.repair(closestTarget) === ERR_NOT_IN_RANGE) {
            creep.moveTo(closestTarget, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }

    /**
     * @returns {import("../utils/resourcePipeline").EnergyFetcher<any>[]}
     */
    getGatheringTiers() {
        return [
            resourcePipeline.tiers.graveRobber,
            resourcePipeline.tiers.sweeper,
            resourcePipeline.tiers.collector,
            resourcePipeline.tiers.miner,
        ];
    }
}

export default new RepairerRole();