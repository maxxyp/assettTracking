import {ISafety} from "../../../api/models/fft/jobs/history/ISafety";
import {IApplianceSafety as ApplianceSafetyUpdateApiModel} from "../../../api/models/fft/jobs/jobUpdate/IApplianceSafety";
import {ApplianceSafety} from "../../models/applianceSafety";
import {Appliance as ApplianceBusinessModel} from "../../models/appliance";
import { PropertyGasSafetyDetail } from "../../models/propertyGasSafetyDetail";
import {PropertyUnsafeDetail} from "../../models/propertyUnsafeDetail";

export interface IApplianceSafetyFactory {
    createApplianceSafetyApiModel(appliance: ApplianceBusinessModel, gasPropertySafety?: PropertyGasSafetyDetail, gasPropertyUnsafeDetail?: PropertyUnsafeDetail):
        Promise<ApplianceSafetyUpdateApiModel>;
    populatePreviousApplianceSafety(safetyApi: ISafety, applianceSafety: ApplianceSafety): ApplianceSafety;
}
