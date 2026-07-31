import { resourcePipeline } from '../utils/resourcePipeline ';
import BaseRole from './BaseRole';

/** @type {Record<string,number>} */
const priority = { [STRUCTURE_SPAWN]: 1, [STRUCTURE_EXTENSION]: 2, [STRUCTURE_TOWER]: 3 };

class HarvesterRole extends BaseRole {

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
};

export default new HarvesterRole();