import { resourcePipeline } from '../utils/resourcePipeline';
import BaseRole from './BaseRole';

export class UpgraderRole extends BaseRole {

    constructor() {
        super(
            'upgrader',
            'upgrade',
            '⚡'
        );
    }

    /**
     * @param {Creep} creep
     */
    onWorkState(creep) {
        this.onWorkFallback(creep);
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
};

export default new UpgraderRole();