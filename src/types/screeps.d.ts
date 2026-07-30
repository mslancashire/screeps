interface CreepMemory {
    role: string;
    working?: boolean; // The '?' means it is optional (can be undefined)
}

interface IConstructionPlanner {
    structureType: BuildableStructureConstant;
    isRoomReady?(room: Room): boolean; // ? => optional, return true by default
    getTargetPositions(room: Room): RoomPosition[];
}