import BaseRole from './BaseRole';

class UpgraderRole extends BaseRole {

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
};

export default new UpgraderRole();