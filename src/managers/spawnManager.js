export function runSpawnManager() {
    const spawn = Game.spawns['Spawn1'];
    if (!spawn) return;

    // 1. Spawn population targets
    /** @type {Record<string, number>} */
    const populationTargets = {
        harvester: 2,
        upgrader: 3,
        builder: 2
    };

    // 2. Count current living creeps for each role
    /** @type {Record<string, number>} */
    const counts = {};
    for (const role in populationTargets) {
        counts[role] = _.filter(Game.creeps, (/** @type {{ memory: { role: string; }; }} */ creep) => creep.memory.role === role).length;
    }

    // 3. Check targets in priority order
    const rolesInPriority = ['harvester', 'upgrader', 'builder'];

    // 4. Calculate energy budget, no harvesters = use what we have
    const energyBudget = (counts['harvester'] === 0)
        ? spawn.room.energyAvailable
        : spawn.room.energyCapacityAvailable;

    // Minimum for a starter creep
    if (energyBudget < 200) return;

    for (const role of rolesInPriority) {
        if (counts[role] < populationTargets[role]) {
            const newName = `${role}_${Game.time}`;
            const body = generateDynamicBody(role, energyBudget);
            const result = spawn.spawnCreep(body, newName, {
                memory: { role: role }
            });

            if (result === OK) {
                console.log(`🐣 Spawning optimised ${role} (Cost: ${energyBudget}e): ${newName} with body [${body}].`);
                break;
            }
        }
    }

    // 4. Visual indicator
    if (spawn.spawning) {
        const spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
            `🛠️ ${spawningCreep.memory.role}`,
            spawn.pos.x + 1,
            spawn.pos.y,
            { align: 'left', opacity: 0.8 }
        );
    }
}

/**
 * 
 * @param {string} role 
 * @param {number} budget 
 * @returns {BodyPartConstant[]}
 */
function generateDynamicBody(role, budget) {
    /** @type {BodyPartConstant[]} */
    const body = [];
    let currentCost = 0;

    // Define the ideal repeating ratio block for standard economy creeps
    const blockCost = 200;
    const maxParts = 20; // max is 50 per creep

    while (underBudget()) {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
        currentCost += blockCost;
    }

    if (body.length === 0) {
        return [WORK, CARRY, MOVE];
    }

    return body;

    function underBudget() {
        return currentCost + blockCost <= budget && body.length + 3 <= maxParts;
    }
}

/*

Every body part in Screeps has a fixed energy cost:
- MOVE: 50 energy
- CARRY: 50 energy
- WORK: 100 energy
- ATTACK: 80 energy (for future reference)HEAL: 250 energy (for future reference)

*/