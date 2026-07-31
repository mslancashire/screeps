import BaseRole from './BaseRole';

class BuilderRole extends BaseRole {

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

    /*
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
    */

};

export default new BuilderRole();