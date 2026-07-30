export function runSpawnManager() {
    const spawn = Game.spawns['Spawn1'];
    if (!spawn) return;

    // 1. Spawn population targets
    /** @type {Record<string, number>} */
    const populationTargets = {
        harvester: 2,
        upgrader: 2,
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

    for (const role of rolesInPriority) {
        if (counts[role] < populationTargets[role]) {
            const newName = `${role}_${Game.time}`;
            const result = spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
                memory: { role: role }
            });

            if (result === OK) {
                console.log(`🐣 Spawning new ${role}: ${newName}.`);
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
            { align: 'left', opacity: 0.8}
        );
    }
}