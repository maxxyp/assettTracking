import {ISafetyDetail as SafetyDetailApiModel} from "../../../api/models/fft/jobs/ISafetyDetail";
import {IUnsafeDetail as UnSafeDetailApiModel} from "../../../api/models/fft/jobs/IUnsafeDetail";
import {PropertySafety as PropertySafetyBusinessModel} from "../../models/propertySafety";
import {PropertySafetyType} from "../../models/propertySafetyType";
import {ISafety as SafetyDetailUpdateApiModel} from "../../../api/models/fft/jobs/jobupdate/ISafety";
import {IUnsafeDetail as UnSafeDetailUpdateApiModel} from "../../../api/models/fft/jobs/jobupdate/IUnsafeDetail";

export interface IPropertySafetyFactory {
    createPropertySafetyBusinessModel(propertySafetyType: PropertySafetyType, safetyDetail: SafetyDetailApiModel, unsafeDetail: UnSafeDetailApiModel): PropertySafetyBusinessModel;

    createPropertySafetyApiModel(propertySafetyType: PropertySafetyType, propertySafetyBusinessModel: PropertySafetyBusinessModel,
            hasRisks: boolean, isjobPartLJReportable: boolean): SafetyDetailUpdateApiModel;

    createPropertyUnsafetyApiModel(propertySafetyType: PropertySafetyType, propertySafetyBusinessModel: PropertySafetyBusinessModel): UnSafeDetailUpdateApiModel;
}
