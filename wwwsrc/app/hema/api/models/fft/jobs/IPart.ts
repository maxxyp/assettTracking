export interface IPart {
    orderDate: Date;
    status: string;
    requisitionNumber: string;
    description: string;
    charge: number;
    quantity: number;
    quantityCharged: number;
    stockReferenceId: string;
    isMainPart: boolean;
    partOrderStatus: string; 
}
