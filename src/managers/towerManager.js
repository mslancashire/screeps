import { filter } from "lodash";

export const towerManager = {
    /** Finds and runs all active towers in a given room
     * @param {Room} room
     */
    run(room) {
        const genericTowers = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });

        if (genericTowers.length === 0) return;

        for (const genericTower of genericTowers) {            
            const tower = /** @type {StructureTower} */ (genericTower);
            if (tower.store[RESOURCE_ENERGY] === 0) continue;

            this.processTowerAction(tower, room);
        }
    },

    /**
     * Core combat and maintenance Logic for a single tower
     * @param {StructureTower} tower
     * @param {Room}room
     */
    processTowerAction(tower, room) {

        // 1. Attach Hostiles
        const closestHostiles = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostiles) {
            tower.attack(closestHostiles);
            return;
        }

        // 2. Heal
        const closestInjuredCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (creep) => creep.hits < creep.hitsMax
        });
        if (closestInjuredCreep) {
            tower.heal(closestInjuredCreep);
            return;
        }

        // 3. Repair if we have a surplus of energy
        if (tower.store[RESOURCE_ENERGY] < 500) return;

        const damagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => {
                if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
                    return s.hits < 5000;
                }
                return s.hits < s.hitsMax;
            }
        });
        if (damagedStructure) {
            tower.repair(damagedStructure);
        }
    }
}