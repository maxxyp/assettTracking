export class ApplianceElectricalUnsafeDetail {
    public unsafeReasons: { field: string; mandatory: boolean; }[];
    public report: string;
    public conditionAsLeft: string;
    public cappedTurnedOff: string;
    public labelAttachedRemoved: string;
    public ownedByCustomer: boolean;
    public letterLeft: boolean;
    public signatureObtained: boolean;
    public ownerNameAddressPhone: string;

    constructor() {
        this.unsafeReasons = [];
    }
}
