import { clearDeadCreepsMemory} from './utils/memoryManager'
import { runSpawnManager} from './managers/spawnManager'
import { runConstructionManager } from './managers/constructionManager';
import roles from './roles/index';

export const loop = function () {

    // 1. Run system utilities 
    clearDeadCreepsMemory();
    runSpawnManager();
    
    // 2. Run automated constructions
    for (const roomName in Game.rooms) {
        runConstructionManager(Game.rooms[roomName]);
    }
    
    // TODO: Create tower process
    /*
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS); 
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    */

    // TODO: Handle screep actions
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        let roleName = creep.memory.role;

        if (roles[roleName]) {
            roles[roleName].run(creep);
        } else {
            console.log(`Warning: Creep ${name} has an unknown role: ${roleName}.`);
        }
    }
}