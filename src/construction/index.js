import extensions from './build.extensions';
import towers from './build.towers';
import roads from './build.roads';

const buildingRegistry = [
    towers,
    extensions,    
    roads
];

/** @type {IConstructionPlanner[]} */
export default buildingRegistry;