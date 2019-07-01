export interface IPartsUsed {
    quantityUsed: number;
    requisitionNumber: string;
    buyingUnitPrice: number;
    description: string;
    sourceCategory: string;
    quantityCharged: number;
    stockReferenceId: string;
    // missing fields?
    /*
    "stockSourceCode": "DP",
    "supplierCode": "12",
    "suppliersPartNumber": "C0032",
    "suppliersRequisitionNumber": " E71100/001",
    */
    charge: number;
}
