import { IApplianceSafetyFactory } from "./interfaces/IApplianceSafetyFactory";
import { ISafety } from "../../api/models/fft/jobs/history/ISafety";
import { IApplianceSafety as ApplianceSafetyUpdateApiModel } from "../../api/models/fft/jobs/jobUpdate/IApplianceSafety";
import { PreviousApplianceUnsafeDetail } from "../models/previousApplianceUnsafeDetail";
import { ApplianceSafety } from "../models/applianceSafety";
import { StringHelper } from "../../../common/core/stringHelper";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { DateHelper } from "../../core/dateHelper";
import { PropertyGasSafetyDetail } from "../models/propertyGasSafetyDetail";
import { Appliance } from "../models/appliance";
import { IBusinessRuleService } from "../services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../services/businessRuleService";
import { inject } from "aurelia-dependency-injection";
import { MiddlewareHelper } from "../../core/middlewareHelper";
import {PropertyUnsafeDetail} from "../models/propertyUnsafeDetail";
import {ApplianceSafetyType} from "../models/applianceSafetyType";

@inject(BusinessRuleService)
export class ApplianceSafetyFactory implements IApplianceSafetyFactory {
    private _businessRulesService: IBusinessRuleService;

    constructor(businessRuleService: IBusinessRuleService) {
        this._businessRulesService = businessRuleService;
    }

    public createApplianceSafetyApiModel(appliance: Appliance, gasPropertySafety?: PropertyGasSafetyDetail,
                                         gasPropertyUnsafeDetail?: PropertyUnsafeDetail): Promise<ApplianceSafetyUpdateApiModel> {

        return this._businessRulesService.getQueryableRuleGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(this)))
            .then((ruleGroup) => {

                let applianceSafetyUpdateApiModel = <ApplianceSafetyUpdateApiModel>{};

                if (appliance.applianceSafetyType === ApplianceSafetyType.gas) {
                    let safety = appliance.safety.applianceGasSafety;
                    let unsafe = appliance.safety.applianceGasUnsafeDetail;
                    let applianceGasReadingsMaster = appliance.safety.applianceGasReadingsMaster;

                    let gasMeterInstallationSatisfactory = !!gasPropertySafety ? gasPropertySafety.gasMeterInstallationSatisfactory : undefined;

                    // set the always undefined values or non safety/unsafe dependant values
                    applianceSafetyUpdateApiModel.ownersNameAndDetails = undefined;
                    applianceSafetyUpdateApiModel.ringContinuityReadingDone = undefined;
                    applianceSafetyUpdateApiModel.leirNotTakenReason = undefined;
                    applianceSafetyUpdateApiModel.neirNotTakenReason = undefined;
                    applianceSafetyUpdateApiModel.lnirNotTakenReason = undefined;
                    applianceSafetyUpdateApiModel.circuitRcdRcboProtected = undefined;
                    applianceSafetyUpdateApiModel.mcbFuseRatingNotTakenReason = undefined;
                    applianceSafetyUpdateApiModel.partPJob = undefined;
                    applianceSafetyUpdateApiModel.partPReason = undefined;
                    applianceSafetyUpdateApiModel.cpcinLightingCircuitOk = undefined;
                    applianceSafetyUpdateApiModel.fuseRatingNotTakenReason = undefined;
                    applianceSafetyUpdateApiModel.microwaveLeakageReadingNotTakenReason = undefined;
                    applianceSafetyUpdateApiModel.eliSafeAccordingToTheTableInTops = undefined;
                    applianceSafetyUpdateApiModel.rcdPresent = undefined;
                    applianceSafetyUpdateApiModel.systemType = undefined;
                    applianceSafetyUpdateApiModel.jobType = undefined;
                    applianceSafetyUpdateApiModel.gasMeterInstallationSafe = gasMeterInstallationSatisfactory;

                    // fill out the appliance safety information only if there is safety and that a mandatory field is filled
                    // cant just check for property because null/undefined  will return false and hence incorrectly pass
                    // and only if the appliance was worked on
                    if (safety && safety.isApplianceSafe !== null && safety.isApplianceSafe !== undefined) {
                        applianceSafetyUpdateApiModel.applianceSafe = MiddlewareHelper.getYNForBoolean(safety.isApplianceSafe, undefined);
                        applianceSafetyUpdateApiModel.flueSafe = MiddlewareHelper.getYNXForYesNoNa(safety.chimneyInstallationAndTests, undefined);
                        applianceSafetyUpdateApiModel.installationSafe = MiddlewareHelper.getYNXForYesNoNa(safety.installationSafe, undefined);
                        applianceSafetyUpdateApiModel.applianceTightnessTestSafe = MiddlewareHelper.getYNXForYesNoNa(safety.installationTightnessTestSafe, undefined);
                        applianceSafetyUpdateApiModel.ventilationSafe = MiddlewareHelper.getYNForBoolean(safety.ventilationSafe, undefined);
                        applianceSafetyUpdateApiModel.detailsDate = DateHelper.toJsonDateTimeString(new Date());
                        applianceSafetyUpdateApiModel.safeDeviceandCorrectOperation = MiddlewareHelper.getYNXForYesNoNa(safety.safetyDevice, undefined);
                        applianceSafetyUpdateApiModel.workedOnAppliance = safety.workedOnAppliance;
                        applianceSafetyUpdateApiModel.visuallyCheckRelight = MiddlewareHelper.getYNForBoolean(safety.visuallyCheckRelight, undefined);
                        applianceSafetyUpdateApiModel.applianceToCurrentStandards = MiddlewareHelper.getYNXForYesNoNa(safety.toCurrentStandards, undefined);
                    }

                    // check if there is an unsafe and that a mandatory field is filled
                    if (unsafe && unsafe.report) {
                        applianceSafetyUpdateApiModel.actionCode = unsafe.cappedTurnedOff;
                        applianceSafetyUpdateApiModel.noticeStatus = unsafe.labelAttachedRemoved;
                        applianceSafetyUpdateApiModel.noticeType = unsafe.conditionAsLeft;
                        applianceSafetyUpdateApiModel.letterLeft = unsafe.letterLeft;
                        applianceSafetyUpdateApiModel.signatureObtained = unsafe.signatureObtained;
                        applianceSafetyUpdateApiModel.report = unsafe.report;
                    }

                    // check if there is an applianceGasReadingsMaster
                    if (applianceGasReadingsMaster && safety && safety.workedOnAppliance === true) {

                        applianceSafetyUpdateApiModel.unmeteredLPGAppliance =
                            !!applianceGasReadingsMaster
                            && !!applianceGasReadingsMaster.preliminaryReadings
                            && applianceGasReadingsMaster.preliminaryReadings.isLpg;

                        applianceSafetyUpdateApiModel.supplementaryBurnerFitted =
                            !!applianceGasReadingsMaster
                            && !!applianceGasReadingsMaster.supplementaryReadings
                            // if the user has recorded a supplementary burner then one of these three fields will have been set
                            && (applianceGasReadingsMaster.supplementaryReadings.burnerPressure !== undefined
                                || applianceGasReadingsMaster.supplementaryReadings.gasRateReading !== undefined
                                || applianceGasReadingsMaster.supplementaryReadings.isLpg !== undefined);

                        applianceSafetyUpdateApiModel.suppBurnerUnmeteredLPGAppliance =
                            !!applianceGasReadingsMaster
                            && !!applianceGasReadingsMaster.supplementaryReadings
                            && !!applianceGasReadingsMaster.supplementaryReadings.isLpg;
                    }

                    if (appliance.isInstPremAppliance) {
                        applianceSafetyUpdateApiModel.detailsDate = DateHelper.toJsonDateTimeString(new Date());

                        // applianceSafetyUpdateApiModel.gasMeterInstallationSafe = gasMeterInstallationSatisfactory;

                        applianceSafetyUpdateApiModel.workedOnAppliance = false;
                        applianceSafetyUpdateApiModel.visuallyCheckRelight = "Y";

                        // applianceSafetyUpdateApiModel.applianceTightnessTestSafe = MiddlewareHelper.getYNForBoolean(gasPropertySafety
                            // && gasPropertySafety.gasInstallationTightnessTestDone, undefined);

                        let isGasMeterInstallationSafe = (gasPropertySafety &&
                            (gasPropertySafety.gasMeterInstallationSatisfactory === "Y" || gasPropertySafety.gasMeterInstallationSatisfactory === "N/A"));
                        let isNotToCurrentStandard = (gasPropertyUnsafeDetail && gasPropertyUnsafeDetail.conditionAsLeft === "SS");
                        if (isGasMeterInstallationSafe) {
                            applianceSafetyUpdateApiModel.applianceSafe = "Y";
                            applianceSafetyUpdateApiModel.applianceToCurrentStandards = "Y";
                        } else if (isNotToCurrentStandard) {
                            applianceSafetyUpdateApiModel.applianceSafe =  "Y";
                            applianceSafetyUpdateApiModel.applianceToCurrentStandards = "N";
                        } else {
                            applianceSafetyUpdateApiModel.applianceSafe =  "N";
                            applianceSafetyUpdateApiModel.applianceToCurrentStandards = "X";
                        }

                        if (gasPropertyUnsafeDetail && gasPropertyUnsafeDetail.report) {
                            applianceSafetyUpdateApiModel.actionCode = gasPropertyUnsafeDetail.cappedTurnedOff;
                            applianceSafetyUpdateApiModel.noticeStatus = gasPropertyUnsafeDetail.labelAttachedRemoved;
                            applianceSafetyUpdateApiModel.noticeType = gasPropertyUnsafeDetail.conditionAsLeft;
                            applianceSafetyUpdateApiModel.letterLeft = gasPropertyUnsafeDetail.letterLeft;
                            applianceSafetyUpdateApiModel.signatureObtained = gasPropertyUnsafeDetail.signatureObtained;
                            applianceSafetyUpdateApiModel.report = gasPropertyUnsafeDetail.report;
                        }
                    }

                    return applianceSafetyUpdateApiModel;

                } else if (appliance.applianceSafetyType === ApplianceSafetyType.electrical) {
                    let safety = appliance.safety.applianceElectricalSafetyDetail;
                    let unsafe = appliance.safety.applianceElectricalUnsafeDetail;

                    // set the always undefined values or non safety/unsafe dependant values
                    applianceSafetyUpdateApiModel.flueSafe = undefined;
                    applianceSafetyUpdateApiModel.applianceTightnessTestSafe = undefined;
                    applianceSafetyUpdateApiModel.ventilationSafe = undefined;
                    applianceSafetyUpdateApiModel.safeDeviceandCorrectOperation = undefined;
                    applianceSafetyUpdateApiModel.unmeteredLPGAppliance = undefined;
                    applianceSafetyUpdateApiModel.supplementaryBurnerFitted = undefined;
                    applianceSafetyUpdateApiModel.gasMeterInstallationSafe = undefined;
                    applianceSafetyUpdateApiModel.visuallyCheckRelight = undefined;
                    applianceSafetyUpdateApiModel.suppBurnerUnmeteredLPGAppliance = undefined;
                    applianceSafetyUpdateApiModel.applianceToCurrentStandards = undefined; // clarification - Mark doesn't want us to send this. The field causes a lot of confusion

                    // fill out the appliance safety information only if there is safety and that a mandatory field is filled
                    // cant just check for property because null/undefined  will return false and hence incorrectly pass
                    let isSafetyFilledOut = safety &&
                        ((safety.applianceInstallationSatisfactory != null && safety.applianceInstallationSatisfactory !== undefined)
                            || (safety.installationSatisfactory != null && safety.installationSatisfactory !== undefined));

                    if (isSafetyFilledOut) {
                        applianceSafetyUpdateApiModel.applianceSafe = MiddlewareHelper.getYNForBoolean(safety.applianceSafe, undefined);

                        // this is because on appliances, if its microwave or white goods then its appliance installation satisfactory
                        // and if its electrical wiring then its installation satisfactory
                        if (safety.applianceInstallationSatisfactory != null && safety.applianceInstallationSatisfactory !== undefined) {
                            applianceSafetyUpdateApiModel.installationSafe = MiddlewareHelper.getYNForBoolean(safety.applianceInstallationSatisfactory, undefined);
                        } else {
                            applianceSafetyUpdateApiModel.installationSafe = MiddlewareHelper.getYNForBoolean(safety.installationSatisfactory, undefined);
                        }

                        applianceSafetyUpdateApiModel.detailsDate = DateHelper.toJsonDateTimeString(new Date());
                        applianceSafetyUpdateApiModel.workedOnAppliance = safety.workedOnLightingCircuit;
                        applianceSafetyUpdateApiModel.ringContinuityReadingDone = safety.ringContinuityReadingDone;
                        applianceSafetyUpdateApiModel.leirNotTakenReason = safety.leInsulationResistanceReasonWhyNot;
                        applianceSafetyUpdateApiModel.neirNotTakenReason = safety.neInsulationResistanceReasonWhyNot;
                        applianceSafetyUpdateApiModel.lnirNotTakenReason = safety.lnInsulationResistanceReasonWhyNot;
                        applianceSafetyUpdateApiModel.circuitRcdRcboProtected = safety.circuitRcdRcboProtected;
                        applianceSafetyUpdateApiModel.mcbFuseRatingNotTakenReason = safety.mcbFuseRatingReasonWhyNot;
                        applianceSafetyUpdateApiModel.partPJob = safety.isPartP;
                        applianceSafetyUpdateApiModel.partPReason = safety.partPReason;
                        applianceSafetyUpdateApiModel.cpcinLightingCircuitOk = safety.cpcInLightingCircuitOk;
                        applianceSafetyUpdateApiModel.fuseRatingNotTakenReason = safety.applianceFuseRatingReasonWhyNot;
                        applianceSafetyUpdateApiModel.microwaveLeakageReadingNotTakenReason = safety.microwaveLeakageReadingReasonWhyNot;
                        applianceSafetyUpdateApiModel.eliSafeAccordingToTheTableInTops = safety.readingSafeAccordingToTops;
                        applianceSafetyUpdateApiModel.rcdPresent = safety.isRcdPresent;
                        applianceSafetyUpdateApiModel.systemType = safety.systemType;

                        // in safety.electricalApplianceType we store WHITEGOODS, MICROWAVE, ELECTRICAL, but WMIS expects "WHITE GOODS" in the case of WHITEGOODS...
                        //  ... so if there is a conversion businessRule use that, otherwise fallback to the original
                        applianceSafetyUpdateApiModel.jobType = ruleGroup.getBusinessRule<string>(safety.electricalApplianceType)
                            || safety.electricalApplianceType;
                    }

                    // check if there is an unsafe and that a mandatory field is filled
                    if (unsafe && unsafe.report) {
                        applianceSafetyUpdateApiModel.actionCode = unsafe.cappedTurnedOff;
                        applianceSafetyUpdateApiModel.noticeStatus = unsafe.labelAttachedRemoved;
                        applianceSafetyUpdateApiModel.noticeType = unsafe.conditionAsLeft;
                        applianceSafetyUpdateApiModel.letterLeft = unsafe.letterLeft;
                        applianceSafetyUpdateApiModel.signatureObtained = unsafe.signatureObtained;
                        applianceSafetyUpdateApiModel.report = unsafe.report;
                        applianceSafetyUpdateApiModel.ownersNameAndDetails = unsafe.ownerNameAddressPhone;
                    }

                    return applianceSafetyUpdateApiModel;

                } else if (appliance.applianceSafetyType === ApplianceSafetyType.other) {
                    let safety = appliance.safety.applianceOtherSafety;
                    let unsafe = appliance.safety.applianceOtherUnsafeDetail;

                    // set the always undefined values or non safety/unsafe dependant values
                    applianceSafetyUpdateApiModel.flueSafe = undefined;
                    applianceSafetyUpdateApiModel.installationSafe = undefined;
                    applianceSafetyUpdateApiModel.applianceTightnessTestSafe = undefined;
                    applianceSafetyUpdateApiModel.ventilationSafe = undefined;
                    applianceSafetyUpdateApiModel.ownersNameAndDetails = undefined;
                    applianceSafetyUpdateApiModel.safeDeviceandCorrectOperation = undefined;
                    applianceSafetyUpdateApiModel.unmeteredLPGAppliance = undefined;
                    applianceSafetyUpdateApiModel.supplementaryBurnerFitted = undefined;
                    applianceSafetyUpdateApiModel.gasMeterInstallationSafe = undefined;
                    applianceSafetyUpdateApiModel.suppBurnerUnmeteredLPGAppliance = undefined;
                    applianceSafetyUpdateApiModel.ringContinuityReadingDone = undefined;
                    applianceSafetyUpdateApiModel.leirNotTakenReason = undefined;
                    applianceSafetyUpdateApiModel.neirNotTakenReason = undefined;
                    applianceSafetyUpdateApiModel.lnirNotTakenReason = undefined;
                    applianceSafetyUpdateApiModel.circuitRcdRcboProtected = undefined;
                    applianceSafetyUpdateApiModel.mcbFuseRatingNotTakenReason = undefined;
                    applianceSafetyUpdateApiModel.partPJob = undefined;
                    applianceSafetyUpdateApiModel.partPReason = undefined;
                    applianceSafetyUpdateApiModel.cpcinLightingCircuitOk = undefined;
                    applianceSafetyUpdateApiModel.fuseRatingNotTakenReason = undefined;
                    applianceSafetyUpdateApiModel.microwaveLeakageReadingNotTakenReason = undefined;
                    applianceSafetyUpdateApiModel.eliSafeAccordingToTheTableInTops = undefined;
                    applianceSafetyUpdateApiModel.rcdPresent = undefined;
                    applianceSafetyUpdateApiModel.systemType = undefined;
                    applianceSafetyUpdateApiModel.applianceToCurrentStandards = undefined; // clarification - Mark doesn't want us to send this. The field causes a lot of confusion
                    applianceSafetyUpdateApiModel.jobType = undefined;

                    // fill out the appliance safety information only if there is safety and that a mandatory field is filled
                    // cant just check for property because null/undefined  will return false and hence incorrectly pass
                    if (safety && safety.isApplianceSafe !== null && safety.isApplianceSafe !== undefined) {
                        applianceSafetyUpdateApiModel.applianceSafe = MiddlewareHelper.getYNForBoolean(safety.isApplianceSafe, undefined);
                        applianceSafetyUpdateApiModel.detailsDate = DateHelper.toJsonDateTimeString(new Date());
                        applianceSafetyUpdateApiModel.workedOnAppliance = safety.workedOnAppliance;
                        applianceSafetyUpdateApiModel.visuallyCheckRelight = MiddlewareHelper.getYNForBoolean(safety.visuallyCheckRelight, undefined);

                        if (safety.workedOnAppliance === false) {
                            applianceSafetyUpdateApiModel.installationSafe = applianceSafetyUpdateApiModel.applianceSafe;
                        } else {
                            if (safety.isApplianceSafe === true) {
                                applianceSafetyUpdateApiModel.installationSafe = "X";
                            } else {
                                applianceSafetyUpdateApiModel.installationSafe = "N";
                            }
                        }
                    }

                    // check if there is an unsafe and that a mandatory field is filled
                    if (unsafe && unsafe.report) {
                        applianceSafetyUpdateApiModel.actionCode = unsafe.cappedTurnedOff;
                        applianceSafetyUpdateApiModel.noticeStatus = unsafe.labelAttachedRemoved;
                        applianceSafetyUpdateApiModel.noticeType = unsafe.conditionAsLeft;
                        applianceSafetyUpdateApiModel.letterLeft = unsafe.letterLeft;
                        applianceSafetyUpdateApiModel.signatureObtained = unsafe.signatureObtained;
                        applianceSafetyUpdateApiModel.report = unsafe.report;
                    }

                    return applianceSafetyUpdateApiModel;
                }
                return undefined;
            });
    }

    public populatePreviousApplianceSafety(safetyApi: ISafety, applianceSafety: ApplianceSafety): ApplianceSafety {

        let previousApplianceSafety = new PreviousApplianceUnsafeDetail();
        previousApplianceSafety.applianceSafe = MiddlewareHelper.getBooleanForYNX(safetyApi.applianceSafe);
        previousApplianceSafety.flueSafe = MiddlewareHelper.getBooleanForYNX(safetyApi.flueSafe);
        previousApplianceSafety.ventilationSafe = MiddlewareHelper.getBooleanForYNX(safetyApi.ventilationSafe);
        previousApplianceSafety.installationSafe = MiddlewareHelper.getBooleanForYNX(safetyApi.installationSafe);
        previousApplianceSafety.installationTightnessTestSafe = MiddlewareHelper.getBooleanForYNX(safetyApi.installationTightnessTestSafe);
        previousApplianceSafety.actionCode = safetyApi.actionCode;
        previousApplianceSafety.date = StringHelper.isString(safetyApi.date) ? new Date(safetyApi.date) : undefined;
        previousApplianceSafety.noticeStatus = safetyApi.noticeStatus;
        previousApplianceSafety.noticeType = safetyApi.noticeType;
        previousApplianceSafety.progress = safetyApi.progress;
        previousApplianceSafety.report = safetyApi.report;

        applianceSafety.previousApplianceUnsafeDetail = previousApplianceSafety;

        return applianceSafety;
    }
}
