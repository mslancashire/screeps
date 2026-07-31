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

    // 3. Handle creeps
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