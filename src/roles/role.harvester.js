import { resourcePipeline } from '../utils/resourcePipeline';
import BaseRole from './BaseRole';

/** @type {Record<string,number>} */
const priority = { [STRUCTURE_SPAWN]: 1, [STRUCTURE_EXTENSION]: 2, [STRUCTURE_TOWER]: 3, [STRUCTURE_CONTAINER]: 4 };

export class HarvesterRole extends BaseRole {

    constructor() {
        super(
            'harvester',
            'harvest',
            '⚡'
        );
    }

    /**
     * @param {Creep} creep
     */
    onWorkState(creep) {
        const success = resourcePipeline.depositEnergy(creep, (a, b) => priority[a.structureType] - priority[b.structureType]);
        if (success) return;

        super.onWorkFallback(creep);
    }
    
    /**
     * @returns {import("../utils/resourcePipeline").EnergyFetcher<any>[]}
     */
    getGatheringTiers() {
        return [
            resourcePipeline.tiers.miner,
            resourcePipeline.tiers.graveRobber,
            resourcePipeline.tiers.sweeper,
        ];
    }
};

export default new HarvesterRole();