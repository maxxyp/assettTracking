export class PreviousPropertySafetyDetail {
    public lastVisitDate: string;
    public safetyNoticeNotLeftReason: string; // gas only can be null
    public report: string;
    public conditionAsLeft: string;
    public labelAttachedOrRemoved: string;
    public cappedOrTurnedOff: string;
    public ownedByCustomer: boolean;
    public signatureObtained: boolean;
    public letterLeft: boolean;
    public ownersNameAndDetails: string;
    public reasons: string[];
}
