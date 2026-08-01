import harvester from "./role.harvester";
import upgrader from "./role.upgrader";
import builder from "./role.builder";
import repairer from "./role.repairer";

const roles = {
    harvester,
    upgrader,
    builder,
    repairer,

};

/** @type {Record<string, ICreepRole>}>} */
export default roles;