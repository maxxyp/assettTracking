
export interface IMaterialActions {
    dispatchedMaterials: IMaterialActionDispatch[];
    reservedMaterials: IMaterialActionReservation[];
    transferredMaterials: IMaterialActionTransfer[];
}

export interface IMaterialActionDispatch {
    id: number;
    materialCode: string;
    description: string;
    owner: string;
    quantity: number;
    jobId: string;
    storageZone: string;
}

export interface IMaterialActionReservation {
    id: number;
    materialCode: string;
    description: string;
    owner: string;
    quantity: number;

    sourceEngineerId: string;
    sourceEngineerName: string;
    sourceEngineerTelephone?: string;
    sourceEngineerStorageZone?: string;

    destinationEngineerId: string;
    destinationEngineerName: string;
    destinationEngineerTelephone?: string;
    destinationEngineerStorageZone?: string;

    date: number;
    time: number;

    declined: boolean;
}

export interface IMaterialActionTransfer {
    id: number;
    materialCode: string;
    description: string;
    owner: string;
    quantity: number;

    sourceEngineerId: string;
    sourceEngineerName?: string;
    sourceEngineerTelephone?: string;
    sourceEngineerStorageZone?: string;

    destinationEngineerId: string;
    destinationEngineerName?: string;
    destinationEngineerTelephone?: string;
    destinationEngineerStorageZone?: string;

    date: number;
    time: number;
}
