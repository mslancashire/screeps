import extensions from './build.extensions';
import towers from './build.towers';
import roads from './build.roads';

const buildingRegistry = [
    extensions,
    towers,
    roads
];

/** @type {IConstructionPlanner[]} */
export default buildingRegistry;