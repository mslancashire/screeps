import { resourcePipeline } from "../utils/resourcePipeline";

const refreshIcon = '🔄';

/**
 * @implements {ICreepRole}
 */
export default class BaseRole {
    
    /**
     * 
     * @param {string} roleName
     * @param {string} workName
     * @param {string} workIcon
     */
    constructor(roleName, workName, workIcon) {
        this.roleName = roleName;
        this.workName = workName;
        this.workIcon = workIcon;
    }

    /** Action lifecycle for a creep.
     * 
     * @param {Creep} creep 
     */
    run(creep) {
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0)         {
            creep.memory.working = false;
            creep.say(`${refreshIcon} harvest`);
        }

        if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
            creep.memory.working = true;
            creep.say(`${this.workIcon} ${this.workName}`);
        }

        if (!creep.memory.working) {
            this.onGatheringState(creep);
        } else {
            this.onWorkState(creep);
        }
    }

    /**
     * Default gather state behavior.
     * @param {Creep} creep 
     */
    onGatheringState(creep) {
        resourcePipeline.fetchEnergy(creep, this.getGatheringTiers());
    }

    /**
     * @returns {import("../utils/resourcePipeline").EnergyFetcher<any>[]}
     */
    getGatheringTiers() {
        return [
            resourcePipeline.tiers.graveRobber,
            resourcePipeline.tiers.sweeper,
            resourcePipeline.tiers.miner,
            resourcePipeline.tiers.collector
        ];
    }

    /**
     * Abstract-style hook mandatory for all child roles to implement.
     * @param {Creep} creep
     */
    onWorkState(creep) {
        throw new Error(`[BaseRole] Role "${this.roleName}" has not implemented onWorkState().`);
    }

    /**
     * 
     * @param {Creep} creep 
     */
    onWorkFallback(creep) {
        if (creep.room.controller) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
}