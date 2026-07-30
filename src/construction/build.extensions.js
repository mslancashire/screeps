import BasePlanner from "./BasePlanner";

/** @type {Record<string, number>} */
const EXTENSION_LIMITS = {
    1: 0,
    2: 5,
    3: 10,
    4: 20,
    5: 30,
    6: 40,
    7: 50,
    8: 60
};

class ExtensionsPlanner extends BasePlanner {
    constructor() {
        super(STRUCTURE_EXTENSION, 5, EXTENSION_LIMITS)
    }
}

export default new ExtensionsPlanner();