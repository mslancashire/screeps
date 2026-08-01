import { resourcePipeline } from '../utils/resourcePipeline';
import BaseRole from './BaseRole';

export class BuilderRole extends BaseRole {

    constructor() {
        super(
            'builder',
            'build',
            '🚧'
        );
    }

    /**
     * @param {Creep} creep
     */
    onWorkState(creep) {
        // 2. Build structures
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length > 0) {
            const closestTarget = creep.pos.findClosestByPath(targets);
            if (closestTarget && creep.build(closestTarget) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closestTarget, { visualizePathStyle: { stroke: '#ffffff' } });
            }
            return;
        }

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

export default new BuilderRole();