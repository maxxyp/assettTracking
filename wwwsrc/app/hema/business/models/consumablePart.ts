import * as moment from "moment";
export class ConsumablePart {
    public dateAdded: String;
    public referenceId: string;
    public description: string;
    public quantity: number;
    public deleted: boolean;
    public sent: boolean;
    public favourite: boolean;
    constructor(referenceId: string, description: string, quantitiy: number) {
        this.dateAdded = moment(new Date()).format("YYYY-MM-DD");
        this.referenceId = referenceId;
        this.description = description;
        this.quantity = quantitiy;
        this.deleted = false;
        this.sent = false;
        this.favourite = false;
    }
}
