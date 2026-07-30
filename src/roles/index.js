import harvester from "./role.harvester";
import upgrader from "./role.upgrader";
import builder from "./role.builder";

const roles = {
    harvester,
    upgrader,
    builder
};

/** @type {Record<string, { run: (creep: Creep) => void }>} */
export default roles;