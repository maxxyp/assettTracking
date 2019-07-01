import {IRiskFactory} from "./interfaces/IRiskFactory";
import {Job} from "../models/job";
import {Risk as RiskBusinessModel} from "../models/risk";
import {IRisk as RiskApiModel} from "../../api/models/fft/jobs/IRisk";
import {Guid} from "../../../common/core/guid";
import {NumberHelper} from "../../../common/core/numberHelper";
import {IAppliance as ApplianceApiModel} from "../../api/models/fft/jobs/history/IAppliance";
import {IAppliance as ApplianceUpdateApiModel} from "../../api/models/fft/jobs/jobupdate/IAppliance";
import {IRisk as RiskUpdateApiModel} from "../../api/models/fft/jobs/jobupdate/IRisk";
import {DateHelper} from "../../core/dateHelper";
import {StringHelper} from "../../../common/core/stringHelper";

export class RiskFactory implements IRiskFactory {
    public createRiskBusinessModel(riskApiModel: RiskApiModel): RiskBusinessModel {

        let riskBusinessModel: RiskBusinessModel = new RiskBusinessModel();

        riskBusinessModel.id = Guid.newGuid();
        riskBusinessModel.reason = riskApiModel.reason;
        riskBusinessModel.report = riskApiModel.report;
        riskBusinessModel.date = DateHelper.fromJsonDateString(riskApiModel.date);
        riskBusinessModel.isHazard = false;

        return riskBusinessModel;
    }

    public createRiskApiModel(riskBusinessModel: RiskBusinessModel): RiskUpdateApiModel {
        let riskApiModel = <RiskUpdateApiModel>{};

        riskApiModel.reason = riskBusinessModel.reason;
        riskApiModel.report = riskBusinessModel.report;

        return riskApiModel;
    }

    public createRiskBusinessModelFromAppliance(applianceApiModel: ApplianceApiModel, applianceTypeHazard: string) : RiskBusinessModel {
        let riskBusinessModel = new RiskBusinessModel();

        riskBusinessModel.id = StringHelper.isString(applianceApiModel.id) && applianceApiModel.id.length > 0 ? applianceApiModel.id : Guid.newGuid();
        riskBusinessModel.reason = applianceTypeHazard;
        riskBusinessModel.report = applianceApiModel.locationDescription;
        if (NumberHelper.isNumber(applianceApiModel.installationYear)) {
            riskBusinessModel.date = new Date(applianceApiModel.installationYear, 0, 1);
        }
        riskBusinessModel.isHazard = true;

        return riskBusinessModel;
    }

    public createApplianceApiModel(riskBusinessModel: RiskBusinessModel, originalJob: Job) : ApplianceUpdateApiModel {
        let apiModel = this.createApiModel(riskBusinessModel);

        if (riskBusinessModel.isDeleted) {
            apiModel.id = riskBusinessModel.id;
            return apiModel;
        } else if (riskBusinessModel.isCreated) {
            this.populateCoreFields(apiModel, riskBusinessModel);
            return apiModel;
        } else {
            apiModel.id = riskBusinessModel.id;

            let originalRisk = this.getOriginalRisk(riskBusinessModel, originalJob);
            this.populateCoreFields(apiModel, riskBusinessModel, originalRisk);

            return apiModel;
        }
    }

    private createApiModel(riskBusinessModel: RiskBusinessModel): ApplianceUpdateApiModel {
        let updateMarker = riskBusinessModel.isCreated ? "C" : riskBusinessModel.isDeleted ? "D" : "A";
        return <ApplianceUpdateApiModel>{
            updateMarker,
            applianceType: riskBusinessModel.reason
         };
    }

    private getOriginalRisk(riskBusinessModel: RiskBusinessModel, originalJob: Job): RiskBusinessModel {
        return !riskBusinessModel.isCreated
            && originalJob
            && originalJob.risks
            && originalJob.risks.find(risk => risk.id === riskBusinessModel.id);
    }

    private populateCoreFields(apiModel: ApplianceUpdateApiModel, riskBusinessModel: RiskBusinessModel, originalRisk?: RiskBusinessModel): void {
        if (!originalRisk || (riskBusinessModel.report !== originalRisk.report)) {
            apiModel.locationDescription = riskBusinessModel.report;
        }
    }
}
