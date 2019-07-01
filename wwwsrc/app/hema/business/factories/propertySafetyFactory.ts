import {IPropertySafetyFactory} from "./interfaces/IPropertySafetyFactory";
import {ISafetyDetail as SafetyDetailApiModel} from "../../api/models/fft/jobs/ISafetyDetail";
import {IUnsafeDetail as UnSafeDetailApiModel} from "../../api/models/fft/jobs/IUnsafeDetail";
import {PropertySafety as PropertySafetyBusinessModel} from "../models/propertySafety";
import {PreviousPropertySafetyDetail} from "../models/previousPropertySafetyDetail";
import {PropertyGasSafetyDetail} from "../models/propertyGasSafetyDetail";
import {PropertyElectricalSafetyDetail} from "../models/propertyElectricalSafetyDetail";
import {PropertyUnsafeDetail} from "../models/propertyUnsafeDetail";
import { PropertySafetyType } from "../models/propertySafetyType";
import {ISafety as SafetyDetailUpdateApiModel} from "../../api/models/fft/jobs/jobupdate/ISafety";
import {IUnsafeDetail as UnSafeDetailUpdateApiModel} from "../../api/models/fft/jobs/jobupdate/IUnsafeDetail";
import {ObjectHelper} from "../../../common/core/objectHelper";
import {CatalogConstants} from "../services/constants/catalogConstants";

export class PropertySafetyFactory implements IPropertySafetyFactory {

    public createPropertySafetyBusinessModel(propertySafetyType: PropertySafetyType, safetyDetail: SafetyDetailApiModel, unsafeDetail: UnSafeDetailApiModel): PropertySafetyBusinessModel {
        let propertySafety: PropertySafetyBusinessModel = new PropertySafetyBusinessModel();

        propertySafety.propertyGasSafetyDetail = new PropertyGasSafetyDetail();
        propertySafety.propertyElectricalSafetyDetail = new PropertyElectricalSafetyDetail();
        propertySafety.propertyUnsafeDetail = new PropertyUnsafeDetail();

        let hasUnsafeSituation = unsafeDetail && ObjectHelper.isObject(unsafeDetail) && ObjectHelper.hasKeys(unsafeDetail);

        if (safetyDetail && hasUnsafeSituation) {

            // previousPropertySafety information is only valid if there is an unsafe sitiuation.
            // therefore only create previousPropertySafetyDetail if there is an unsafe situation
            propertySafety.previousPropertySafetyDetail = new PreviousPropertySafetyDetail();

            if (propertySafetyType === PropertySafetyType.gas) {
                propertySafety.previousPropertySafetyDetail.lastVisitDate = safetyDetail.lastGasVisitDate;
                propertySafety.previousPropertySafetyDetail.safetyNoticeNotLeftReason = safetyDetail.safetyNoticeNotLeftReason;
            } else if (propertySafetyType === PropertySafetyType.electrical) {
                propertySafety.previousPropertySafetyDetail.lastVisitDate = safetyDetail.lastElectricVisitDate;
            } else {
                // if the job comes down as an "other" job, try gas then electric dates
                propertySafety.previousPropertySafetyDetail.lastVisitDate = safetyDetail.lastGasVisitDate || safetyDetail.lastElectricVisitDate;
            }

            propertySafety.previousPropertySafetyDetail.cappedOrTurnedOff = unsafeDetail.cappedOrTurnedOff;
            propertySafety.previousPropertySafetyDetail.conditionAsLeft = unsafeDetail.conditionAsLeft;
            propertySafety.previousPropertySafetyDetail.labelAttachedOrRemoved = unsafeDetail.labelAttachedOrRemoved;
            propertySafety.previousPropertySafetyDetail.letterLeft = unsafeDetail.letterLeft;
            propertySafety.previousPropertySafetyDetail.ownedByCustomer = unsafeDetail.ownedByCustomer;
            propertySafety.previousPropertySafetyDetail.reasons = unsafeDetail.reasons;
            propertySafety.previousPropertySafetyDetail.report = unsafeDetail.report;
            propertySafety.previousPropertySafetyDetail.ownersNameAndDetails = unsafeDetail.ownersNameAndDetails;
            propertySafety.previousPropertySafetyDetail.signatureObtained = unsafeDetail.signatureObtained;

        }

        return propertySafety;
    }

    public createPropertySafetyApiModel(propertySafetyType: PropertySafetyType, propertySafetyBusinessModel: PropertySafetyBusinessModel, hasRisks: boolean,
            isjobPartLJReportable: boolean): SafetyDetailUpdateApiModel {
        let safetyDetailUpdateApiModel: SafetyDetailUpdateApiModel = <SafetyDetailUpdateApiModel>{};
        if (propertySafetyBusinessModel) {
            if (propertySafetyType === PropertySafetyType.electrical) {
                if (propertySafetyBusinessModel.propertyElectricalSafetyDetail) {
                    safetyDetailUpdateApiModel.electricalELIReading = propertySafetyBusinessModel.propertyElectricalSafetyDetail.noEliReadings ?
                        undefined : propertySafetyBusinessModel.propertyElectricalSafetyDetail.eliReading;
                    safetyDetailUpdateApiModel.eliReason = propertySafetyBusinessModel.propertyElectricalSafetyDetail.noEliReadings ?
                        propertySafetyBusinessModel.propertyElectricalSafetyDetail.eliReadingReason : undefined;
                    safetyDetailUpdateApiModel.consumerUnitOrFuseBoxSatisfactory = propertySafetyBusinessModel.propertyElectricalSafetyDetail.consumerUnitSatisfactory;
                    safetyDetailUpdateApiModel.electricalSystemType = propertySafetyBusinessModel.propertyElectricalSafetyDetail.systemType;
                    safetyDetailUpdateApiModel.rcdPresent = propertySafetyBusinessModel.propertyElectricalSafetyDetail.rcdPresent
                        ? propertySafetyBusinessModel.propertyElectricalSafetyDetail.rcdPresent === "Y"
                        : undefined;
                    safetyDetailUpdateApiModel.eliSafeAccordingToTheTableInTops = propertySafetyBusinessModel.propertyElectricalSafetyDetail.eliSafeAccordingToTops;
                }
            } else if (propertySafetyType === PropertySafetyType.gas) {
                if (propertySafetyBusinessModel.propertyGasSafetyDetail) {

                    safetyDetailUpdateApiModel.gasELIReading = propertySafetyBusinessModel.propertyGasSafetyDetail.eliReading === CatalogConstants.SAFETY_READING_CAT_NO_READING_TAKEN
                        ? undefined
                        : propertySafetyBusinessModel.propertyGasSafetyDetail.eliReading;

                    safetyDetailUpdateApiModel.eliReason = propertySafetyBusinessModel.propertyGasSafetyDetail.eliReadingReason;

                    safetyDetailUpdateApiModel.safetyNoticeNotLeftReason = propertySafetyBusinessModel.propertyGasSafetyDetail.safetyAdviseNoticeLeft ?
                        propertySafetyBusinessModel.propertyGasSafetyDetail.safetyAdviseNoticeLeftReason : "";
                    safetyDetailUpdateApiModel.gasInstallationTightnessTestDone = propertySafetyBusinessModel.propertyGasSafetyDetail.gasInstallationTightnessTestDone;
                    safetyDetailUpdateApiModel.pressureDrop = propertySafetyBusinessModel.propertyGasSafetyDetail.gasInstallationTightnessTestDone ?
                        propertySafetyBusinessModel.propertyGasSafetyDetail.pressureDrop : undefined;
                    safetyDetailUpdateApiModel.gasMeterInstallationSafe = propertySafetyBusinessModel.propertyGasSafetyDetail.gasMeterInstallationSatisfactory;
                }
            }
            safetyDetailUpdateApiModel.jobPartLJReportable = isjobPartLJReportable;
        }

        safetyDetailUpdateApiModel.riskIdentifiedAtProperty = !!hasRisks;

        return safetyDetailUpdateApiModel;
    }

    public createPropertyUnsafetyApiModel(propertySafetyType: PropertySafetyType, propertySafetyBusinessModel: PropertySafetyBusinessModel): UnSafeDetailUpdateApiModel {
        let unSafeDetailUpdateApiModel: UnSafeDetailUpdateApiModel = <UnSafeDetailUpdateApiModel>{};

        if (propertySafetyBusinessModel && propertySafetyBusinessModel.propertyUnsafeDetail) {
            if (propertySafetyType === PropertySafetyType.electrical || propertySafetyType === PropertySafetyType.gas) {
                unSafeDetailUpdateApiModel.report = propertySafetyBusinessModel.propertyUnsafeDetail.report;
                unSafeDetailUpdateApiModel.conditionAsLeft = propertySafetyBusinessModel.propertyUnsafeDetail.conditionAsLeft;
                unSafeDetailUpdateApiModel.labelAttachedOrRemoved = propertySafetyBusinessModel.propertyUnsafeDetail.labelAttachedRemoved;
                unSafeDetailUpdateApiModel.cappedOrTurnedOff = propertySafetyBusinessModel.propertyUnsafeDetail.cappedTurnedOff;
                unSafeDetailUpdateApiModel.ownedByCustomer = propertySafetyBusinessModel.propertyUnsafeDetail.ownedByCustomer;
                unSafeDetailUpdateApiModel.signatureObtained = propertySafetyBusinessModel.propertyUnsafeDetail.signatureObtained;
                unSafeDetailUpdateApiModel.letterLeft = propertySafetyBusinessModel.propertyUnsafeDetail.letterLeft;
                unSafeDetailUpdateApiModel.reasons = propertySafetyBusinessModel.propertyUnsafeDetail.reasons;

                unSafeDetailUpdateApiModel.ownersNameAndDetails = undefined; // not used only for historical purposes only

            }
        }

        return unSafeDetailUpdateApiModel;
    }
}
