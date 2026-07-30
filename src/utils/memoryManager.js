export function clearDeadCreepsMemory() {
    // Loop through all creeps in memory
    for (const name in Memory.creeps) {
        // If the creep doesn't exist in the game any more, delete its memory
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(`Clearing non-existing creep memory: ${name}`);
        }
    }
}
