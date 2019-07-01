var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../models/previousApplianceUnsafeDetail", "../../../common/core/stringHelper", "../../../common/core/objectHelper", "../../core/dateHelper", "../services/businessRuleService", "aurelia-dependency-injection", "../../core/middlewareHelper", "../models/applianceSafetyType"], function (require, exports, previousApplianceUnsafeDetail_1, stringHelper_1, objectHelper_1, dateHelper_1, businessRuleService_1, aurelia_dependency_injection_1, middlewareHelper_1, applianceSafetyType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplianceSafetyFactory = /** @class */ (function () {
        function ApplianceSafetyFactory(businessRuleService) {
            this._businessRulesService = businessRuleService;
        }
        ApplianceSafetyFactory.prototype.createApplianceSafetyApiModel = function (appliance, gasPropertySafety, gasPropertyUnsafeDetail) {
            return this._businessRulesService.getQueryableRuleGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(this)))
                .then(function (ruleGroup) {
                var applianceSafetyUpdateApiModel = {};
                if (appliance.applianceSafetyType === applianceSafetyType_1.ApplianceSafetyType.gas) {
                    var safety = appliance.safety.applianceGasSafety;
                    var unsafe = appliance.safety.applianceGasUnsafeDetail;
                    var applianceGasReadingsMaster = appliance.safety.applianceGasReadingsMaster;
                    var gasMeterInstallationSatisfactory = !!gasPropertySafety ? gasPropertySafety.gasMeterInstallationSatisfactory : undefined;
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
                        applianceSafetyUpdateApiModel.applianceSafe = middlewareHelper_1.MiddlewareHelper.getYNForBoolean(safety.isApplianceSafe, undefined);
                        applianceSafetyUpdateApiModel.flueSafe = middlewareHelper_1.MiddlewareHelper.getYNXForYesNoNa(safety.chimneyInstallationAndTests, undefined);
                        applianceSafetyUpdateApiModel.installationSafe = middlewareHelper_1.MiddlewareHelper.getYNXForYesNoNa(safety.installationSafe, undefined);
                        applianceSafetyUpdateApiModel.applianceTightnessTestSafe = middlewareHelper_1.MiddlewareHelper.getYNXForYesNoNa(safety.installationTightnessTestSafe, undefined);
                        applianceSafetyUpdateApiModel.ventilationSafe = middlewareHelper_1.MiddlewareHelper.getYNForBoolean(safety.ventilationSafe, undefined);
                        applianceSafetyUpdateApiModel.detailsDate = dateHelper_1.DateHelper.toJsonDateTimeString(new Date());
                        applianceSafetyUpdateApiModel.safeDeviceandCorrectOperation = middlewareHelper_1.MiddlewareHelper.getYNXForYesNoNa(safety.safetyDevice, undefined);
                        applianceSafetyUpdateApiModel.workedOnAppliance = safety.workedOnAppliance;
                        applianceSafetyUpdateApiModel.visuallyCheckRelight = middlewareHelper_1.MiddlewareHelper.getYNForBoolean(safety.visuallyCheckRelight, undefined);
                        applianceSafetyUpdateApiModel.applianceToCurrentStandards = middlewareHelper_1.MiddlewareHelper.getYNXForYesNoNa(safety.toCurrentStandards, undefined);
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
                        applianceSafetyUpdateApiModel.detailsDate = dateHelper_1.DateHelper.toJsonDateTimeString(new Date());
                        // applianceSafetyUpdateApiModel.gasMeterInstallationSafe = gasMeterInstallationSatisfactory;
                        applianceSafetyUpdateApiModel.workedOnAppliance = false;
                        applianceSafetyUpdateApiModel.visuallyCheckRelight = "Y";
                        // applianceSafetyUpdateApiModel.applianceTightnessTestSafe = MiddlewareHelper.getYNForBoolean(gasPropertySafety
                        // && gasPropertySafety.gasInstallationTightnessTestDone, undefined);
                        var isGasMeterInstallationSafe = (gasPropertySafety &&
                            (gasPropertySafety.gasMeterInstallationSatisfactory === "Y" || gasPropertySafety.gasMeterInstallationSatisfactory === "N/A"));
                        var isNotToCurrentStandard = (gasPropertyUnsafeDetail && gasPropertyUnsafeDetail.conditionAsLeft === "SS");
                        if (isGasMeterInstallationSafe) {
                            applianceSafetyUpdateApiModel.applianceSafe = "Y";
                            applianceSafetyUpdateApiModel.applianceToCurrentStandards = "Y";
                        }
                        else if (isNotToCurrentStandard) {
                            applianceSafetyUpdateApiModel.applianceSafe = "Y";
                            applianceSafetyUpdateApiModel.applianceToCurrentStandards = "N";
                        }
                        else {
                            applianceSafetyUpdateApiModel.applianceSafe = "N";
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
                }
                else if (appliance.applianceSafetyType === applianceSafetyType_1.ApplianceSafetyType.electrical) {
                    var safety = appliance.safety.applianceElectricalSafetyDetail;
                    var unsafe = appliance.safety.applianceElectricalUnsafeDetail;
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
                    var isSafetyFilledOut = safety &&
                        ((safety.applianceInstallationSatisfactory != null && safety.applianceInstallationSatisfactory !== undefined)
                            || (safety.installationSatisfactory != null && safety.installationSatisfactory !== undefined));
                    if (isSafetyFilledOut) {
                        applianceSafetyUpdateApiModel.applianceSafe = middlewareHelper_1.MiddlewareHelper.getYNForBoolean(safety.applianceSafe, undefined);
                        // this is because on appliances, if its microwave or white goods then its appliance installation satisfactory
                        // and if its electrical wiring then its installation satisfactory
                        if (safety.applianceInstallationSatisfactory != null && safety.applianceInstallationSatisfactory !== undefined) {
                            applianceSafetyUpdateApiModel.installationSafe = middlewareHelper_1.MiddlewareHelper.getYNForBoolean(safety.applianceInstallationSatisfactory, undefined);
                        }
                        else {
                            applianceSafetyUpdateApiModel.installationSafe = middlewareHelper_1.MiddlewareHelper.getYNForBoolean(safety.installationSatisfactory, undefined);
                        }
                        applianceSafetyUpdateApiModel.detailsDate = dateHelper_1.DateHelper.toJsonDateTimeString(new Date());
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
                        applianceSafetyUpdateApiModel.jobType = ruleGroup.getBusinessRule(safety.electricalApplianceType)
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
                }
                else if (appliance.applianceSafetyType === applianceSafetyType_1.ApplianceSafetyType.other) {
                    var safety = appliance.safety.applianceOtherSafety;
                    var unsafe = appliance.safety.applianceOtherUnsafeDetail;
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
                        applianceSafetyUpdateApiModel.applianceSafe = middlewareHelper_1.MiddlewareHelper.getYNForBoolean(safety.isApplianceSafe, undefined);
                        applianceSafetyUpdateApiModel.detailsDate = dateHelper_1.DateHelper.toJsonDateTimeString(new Date());
                        applianceSafetyUpdateApiModel.workedOnAppliance = safety.workedOnAppliance;
                        applianceSafetyUpdateApiModel.visuallyCheckRelight = middlewareHelper_1.MiddlewareHelper.getYNForBoolean(safety.visuallyCheckRelight, undefined);
                        if (safety.workedOnAppliance === false) {
                            applianceSafetyUpdateApiModel.installationSafe = applianceSafetyUpdateApiModel.applianceSafe;
                        }
                        else {
                            if (safety.isApplianceSafe === true) {
                                applianceSafetyUpdateApiModel.installationSafe = "X";
                            }
                            else {
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
        };
        ApplianceSafetyFactory.prototype.populatePreviousApplianceSafety = function (safetyApi, applianceSafety) {
            var previousApplianceSafety = new previousApplianceUnsafeDetail_1.PreviousApplianceUnsafeDetail();
            previousApplianceSafety.applianceSafe = middlewareHelper_1.MiddlewareHelper.getBooleanForYNX(safetyApi.applianceSafe);
            previousApplianceSafety.flueSafe = middlewareHelper_1.MiddlewareHelper.getBooleanForYNX(safetyApi.flueSafe);
            previousApplianceSafety.ventilationSafe = middlewareHelper_1.MiddlewareHelper.getBooleanForYNX(safetyApi.ventilationSafe);
            previousApplianceSafety.installationSafe = middlewareHelper_1.MiddlewareHelper.getBooleanForYNX(safetyApi.installationSafe);
            previousApplianceSafety.installationTightnessTestSafe = middlewareHelper_1.MiddlewareHelper.getBooleanForYNX(safetyApi.installationTightnessTestSafe);
            previousApplianceSafety.actionCode = safetyApi.actionCode;
            previousApplianceSafety.date = stringHelper_1.StringHelper.isString(safetyApi.date) ? new Date(safetyApi.date) : undefined;
            previousApplianceSafety.noticeStatus = safetyApi.noticeStatus;
            previousApplianceSafety.noticeType = safetyApi.noticeType;
            previousApplianceSafety.progress = safetyApi.progress;
            previousApplianceSafety.report = safetyApi.report;
            applianceSafety.previousApplianceUnsafeDetail = previousApplianceSafety;
            return applianceSafety;
        };
        ApplianceSafetyFactory = __decorate([
            aurelia_dependency_injection_1.inject(businessRuleService_1.BusinessRuleService),
            __metadata("design:paramtypes", [Object])
        ], ApplianceSafetyFactory);
        return ApplianceSafetyFactory;
    }());
    exports.ApplianceSafetyFactory = ApplianceSafetyFactory;
});

//# sourceMappingURL=applianceSafetyFactory.js.map
