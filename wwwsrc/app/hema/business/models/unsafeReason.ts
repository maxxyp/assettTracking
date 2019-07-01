export class UnsafeReason {
    public lookupId: string;
    public catalogId: string;
    public params: any[];
    public label: string;
    public isMandatory: boolean;

    constructor(lookupId: string, catalogId: string, params: any[], isMandatory: boolean = true) {
        this.lookupId = lookupId;
        this.catalogId = catalogId;
        this.params = params;
        this.isMandatory = isMandatory;
    }
}
