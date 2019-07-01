import {Appliance} from "../../../../business/models/appliance";
import {DataState} from "../../../../business/models/dataState";

export class ApplianceSummaryViewModel {
    public appliance : Appliance;
    public applianceDescription: string;
    public aggregateDataState: DataState;
    public isUnderContract: boolean;
    public isDisplayableGcCode: boolean;
    public isAssociatedWithTask: boolean;

    public canDelete: boolean;
    public canExclude: boolean;
}
