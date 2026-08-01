import planExtensions from './build.extensions';
import planTowers from './build.towers';
import planRoads from './build.roads';
import planSourceContainers from './build.source-containers'

const buildingRegistry = [
    planTowers,
    planExtensions,
    planSourceContainers,
    planRoads
];

/** @type {IConstructionPlanner[]} */
export default buildingRegistry;