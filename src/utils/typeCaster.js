export const typeCaster = {
    /**
     * Safely casts a generic Owned Structure array to an inventory-capable structure array
     * @param {AnyStructure[]} structures 
     * @returns {AnyStoreStructure[]}
     */
    asStructuresWithStore(structures) {
        // We return the array wrapped in a top-level JSDoc cast expression.
        // This instantly changes the signature of the entire array for the compiler.
        return /** @type {AnyStoreStructure[]} */ (structures);
    }
};