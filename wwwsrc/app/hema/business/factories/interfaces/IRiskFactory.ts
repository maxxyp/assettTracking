import {IRisk as RiskApiModel} from "../../../api/models/fft/jobs/IRisk";
import {IRisk as RiskUpdateApiModel} from "../../../api/models/fft/jobs/jobupdate/IRisk";
import {Job} from "../../models/job";
import {Risk as RiskBusinessModel} from "../../models/risk";
import {IAppliance as ApplianceUpdateApiModel} from "../../../api/models/fft/jobs/jobupdate/IAppliance";
import {IAppliance as ApplianceApiModel} from "../../../api/models/fft/jobs/history/IAppliance";

export interface IRiskFactory {
    createRiskBusinessModel(riskApiModel: RiskApiModel): RiskBusinessModel;
    createRiskBusinessModelFromAppliance(applianceApiModel: ApplianceApiModel, applianceTypeHazard: string) : RiskBusinessModel;

    createRiskApiModel(riskBusinessModel: RiskBusinessModel): RiskUpdateApiModel;
    createApplianceApiModel(riskBusinessModel: RiskBusinessModel, originalJob: Job) : ApplianceUpdateApiModel;
}
