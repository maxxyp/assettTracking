import {Part} from "../../../../business/models/part";
import {Task} from "../../../../business/models/task";
import {PartWarrantyReturn} from "../../../../business/models/partWarrantyReturn";
import {PartNotUsedReturn} from "../../../../business/models/partNotUsedReturn";
import {DataState} from "../../../../business/models/dataState";
import * as bignumber from "bignumber";

export class TodaysPartViewModel {
    // readonly stuff
    public part: Part;
    public task: Task;

    // read/write stuff
    public warrantyReturn: PartWarrantyReturn;
    public notUsedReturn: PartNotUsedReturn;
    public isWarrantyCollapsedOnLoad: boolean;
    public isReturnCollapsedOnLoad: boolean;
    public dataStateIndicator: DataState;
    public partPrice: bignumber.BigNumber;
    public isWarrantyReturnOptionAvailable: boolean;

    public get canRaiseNotUsed(): boolean {
        return !this.warrantyReturn || !this.warrantyReturn.isWarrantyReturn || this.warrantyReturn.quantityToClaimOrReturn < this.part.quantity;
    }
}
