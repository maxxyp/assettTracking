var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-dependency-injection", "../../business/models/landlord/landlordSafetyCertificate", "../../business/models/landlord/landlordSafetyCertificateAppliance", "../../business/models/landlord/landlordSafetyCertificateDefect", "../../business/models/landlord/landlordSafetyCertificateResult", "../models/yesNoNa", "../models/landlord/operatingValueUnits", "../services/catalogService", "../models/businessException", "../models/applianceSafetyType"], function (require, exports, aurelia_dependency_injection_1, landlordSafetyCertificate_1, landlordSafetyCertificateAppliance_1, landlordSafetyCertificateDefect_1, landlordSafetyCertificateResult_1, yesNoNa_1, operatingValueUnits_1, catalogService_1, businessException_1, applianceSafetyType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LandlordFactory = /** @class */ (function () {
        function LandlordFactory(catalogService) {
            this._catalogService = catalogService;
        }
        LandlordFactory.prototype.createLandlordSafetyCertificate = function (job, engineer, businessRules, appliances) {
            var _this = this;
            return this._catalogService.getSafetyActions().then(function (actions) {
                var model = new landlordSafetyCertificate_1.LandlordSafetyCertificate();
                var applianceBusinessModelPromises = [];
                model.jobNumber = job.id;
                model.date = new Date();
                if (engineer) {
                    model.engineerName = engineer.firstName + " " + engineer.lastName;
                    model.engineerId = engineer.id;
                }
                if (job.customerContact) {
                    model.landlordAddress = [];
                    model.landlordName = job.customerContact.title + " " + job.customerContact.firstName + " " + job.customerContact.lastName;
                    if (job.customerContact.address) {
                        if (job.customerContact.address.premisesName) {
                            model.landlordAddress.push(job.customerContact.address.premisesName);
                        }
                        if (job.customerContact.address.line && job.customerContact.address.line.length > 0) {
                            if (job.customerContact.address.houseNumber) {
                                model.landlordAddress.push(job.customerContact.address.houseNumber + " " + job.customerContact.address.line[0]);
                            }
                            else {
                                model.landlordAddress.push(job.customerContact.address.line[0]);
                            }
                        }
                        else if (job.customerContact.address.houseNumber) {
                            model.landlordAddress.push(job.customerContact.address.houseNumber);
                        }
                        if (job.customerContact.address.line && job.customerContact.address.line.length > 1) {
                            model.landlordAddress.push(job.customerContact.address.line[1]);
                        }
                        if (job.customerContact.address.town) {
                            model.landlordAddress.push(job.customerContact.address.town);
                        }
                        else if (job.customerContact.address.county) {
                            model.landlordAddress.push(job.customerContact.address.county);
                        }
                        model.landlordAddress.push(job.customerContact.address.postCodeOut + " " + job.customerContact.address.postCodeIn);
                    }
                }
                model.propertyAddress = [];
                if (job.premises && job.premises.address) {
                    if (job.premises.address.premisesName) {
                        model.propertyAddress.push(job.premises.address.premisesName);
                    }
                    if (job.premises.address.line && job.premises.address.line.length > 0) {
                        if (job.premises.address.line.length > 0) {
                            if (job.premises.address.houseNumber) {
                                model.propertyAddress.push(job.premises.address.houseNumber + " " + job.premises.address.line[0]);
                            }
                            else {
                                model.propertyAddress.push(job.premises.address.line[0]);
                            }
                        }
                        if (job.premises.address.line.length > 1) {
                            model.propertyAddress.push(job.premises.address.line[1]);
                        }
                    }
                    else if (job.premises.address.houseNumber) {
                        model.propertyAddress.push(job.premises.address.houseNumber);
                    }
                    if (job.premises.address.town) {
                        model.propertyAddress.push(job.premises.address.town);
                    }
                    else if (job.premises.address.county) {
                        model.propertyAddress.push(job.premises.address.county);
                    }
                    model.propertyAddress.push(job.premises.address.postCodeOut + " " + job.premises.address.postCodeIn);
                }
                else if (job.customerAddress) {
                    if (job.customerAddress.premisesName) {
                        model.propertyAddress.push(job.customerAddress.premisesName);
                    }
                    if (job.customerAddress.line && job.customerAddress.line.length > 0) {
                        if (job.customerAddress.line.length > 0) {
                            if (job.customerAddress.houseNumber) {
                                model.propertyAddress.push(job.customerAddress.houseNumber + " " + job.customerAddress.line[0]);
                            }
                            else {
                                model.propertyAddress.push(job.customerAddress.line[0]);
                            }
                        }
                        if (job.customerAddress.line.length > 1) {
                            model.propertyAddress.push(job.customerAddress.line[1]);
                        }
                    }
                    else if (job.premises.address.houseNumber) {
                        model.propertyAddress.push(job.customerAddress.houseNumber);
                    }
                    if (job.customerAddress.town) {
                        model.propertyAddress.push(job.customerAddress.town);
                    }
                    else if (job.customerAddress.county) {
                        model.propertyAddress.push(job.customerAddress.county);
                    }
                    model.propertyAddress.push(job.customerAddress.postCodeOut + " " + job.customerAddress.postCodeIn);
                }
                model.appliances = [];
                model.defects = [];
                appliances.forEach(function (appliance) {
                    if (appliance) {
                        applianceBusinessModelPromises.push(_this.createLandlordSafetyCertificateAppliance(appliance, businessRules));
                        model.defects.push(_this.createLandlordSafetyCertificateDefect(appliance, businessRules, actions));
                    }
                });
                return Promise.all(applianceBusinessModelPromises)
                    .then(function (certificateAappliances) {
                    certificateAappliances.forEach(function (certificateAappliance) {
                        model.appliances.push(certificateAappliance);
                    });
                })
                    .then(function () {
                    model.applianceCount = model.appliances.length;
                    model.certificateResult = _this.createLandlordSafetyCertificateResult(job.propertySafety, businessRules, actions);
                    return model;
                });
            });
        };
        LandlordFactory.prototype.createLandlordSafetyCertificateAppliance = function (appliance, businessRules) {
            var _this = this;
            if (appliance.applianceSafetyType && appliance.applianceSafetyType === applianceSafetyType_1.ApplianceSafetyType.gas) {
                var model_1 = new landlordSafetyCertificateAppliance_1.LandlordSafetyCertificateAppliance();
                model_1.id = appliance.id;
                var safetyDeviceYesValueBusinessRule_1 = businessRules.getBusinessRule("safetyDeviceYesValue");
                var safetyDeviceNoValueBusinessRule_1 = businessRules.getBusinessRule("safetyDeviceNoValue");
                var flueLessApplianceTypeBusinessRule_1 = businessRules.getBusinessRule("flueLessApplianceType");
                var roomSealedFlueApplianceTypeBusinessRule_1 = businessRules.getBusinessRule("roomSealedFlueApplianceType");
                return this._catalogService.getObjectType(appliance.applianceType)
                    .then(function (catalogItem) {
                    if (catalogItem) {
                        model_1.location = appliance.locationDescription ? appliance.locationDescription : undefined;
                        model_1.type = appliance.applianceType ? appliance.applianceType : undefined;
                        model_1.flueType = appliance.flueType ? appliance.flueType : undefined;
                        if (appliance.safety) {
                            if (appliance.safety.applianceGasSafety) {
                                model_1.applianceSafe = appliance.safety.applianceGasSafety.isApplianceSafe;
                            }
                            else {
                                model_1.applianceSafe = undefined;
                            }
                            var isGasAppliance = appliance.applianceSafetyType === applianceSafetyType_1.ApplianceSafetyType.gas;
                            // do the other fields
                            if ((model_1.flueType || (!model_1.flueType && !isGasAppliance)) && (appliance.safety.applianceGasReadingsMaster
                                && appliance.safety.applianceGasReadingsMaster.preliminaryReadings)) {
                                if ((appliance.safety.applianceGasReadingsMaster.preliminaryReadings.burnerPressure !== null)
                                    && (appliance.safety.applianceGasReadingsMaster.preliminaryReadings.burnerPressure !== undefined)) {
                                    model_1.operatingValue =
                                        appliance.safety.applianceGasReadingsMaster.preliminaryReadings.burnerPressure;
                                    model_1.operatingValueUnits = operatingValueUnits_1.OperatingValueUnits.M;
                                }
                                else if ((appliance.safety.applianceGasReadingsMaster.preliminaryReadings.gasRateReading !== null)
                                    && (appliance.safety.applianceGasReadingsMaster.preliminaryReadings.gasRateReading !== undefined)) {
                                    model_1.operatingValue =
                                        appliance.safety.applianceGasReadingsMaster.preliminaryReadings.gasRateReading;
                                    model_1.operatingValueUnits = operatingValueUnits_1.OperatingValueUnits.K;
                                }
                                else if ((appliance.safety.applianceGasReadingsMaster.preliminaryReadings.readingFinalRatio !== null)
                                    && (appliance.safety.applianceGasReadingsMaster.preliminaryReadings.readingFinalRatio !== undefined)) {
                                    model_1.operatingValue =
                                        appliance.safety.applianceGasReadingsMaster.preliminaryReadings.readingFinalRatio;
                                    model_1.operatingValueUnits = operatingValueUnits_1.OperatingValueUnits.R;
                                }
                                else {
                                    model_1.operatingValue = undefined;
                                    model_1.operatingValueUnits = undefined;
                                }
                            }
                            else {
                                model_1.operatingValue = undefined;
                                model_1.operatingValueUnits = undefined;
                            }
                            if (appliance.safety.applianceGasSafety) {
                                model_1.make = appliance.safety.applianceGasSafety.applianceMake;
                                model_1.model = appliance.safety.applianceGasSafety.applianceModel;
                                if (appliance.safety.applianceGasSafety.requestedToTest !== null && appliance.safety.applianceGasSafety.requestedToTest !== undefined) {
                                    model_1.requestedToTest = appliance.safety.applianceGasSafety.requestedToTest;
                                }
                                else {
                                    model_1.requestedToTest = appliance.safety.applianceGasSafety.requestedToTest;
                                }
                                if (appliance.safety.applianceGasSafety.ableToTest !== null && appliance.safety.applianceGasSafety.ableToTest !== undefined) {
                                    model_1.unableToTest = !appliance.safety.applianceGasSafety.ableToTest;
                                }
                                else {
                                    model_1.unableToTest = appliance.safety.applianceGasSafety.ableToTest;
                                }
                                if (appliance.safety.applianceGasSafety.safetyDevice !== null
                                    && appliance.safety.applianceGasSafety.safetyDevice !== undefined) {
                                    model_1.safetyDeviceCorrectOperation = appliance.safety.applianceGasSafety.safetyDevice === safetyDeviceYesValueBusinessRule_1
                                        ? yesNoNa_1.YesNoNa.Yes
                                        : (appliance.safety.applianceGasSafety.safetyDevice === safetyDeviceNoValueBusinessRule_1 ? yesNoNa_1.YesNoNa.No : yesNoNa_1.YesNoNa.Na);
                                }
                                else {
                                    model_1.safetyDeviceCorrectOperation = undefined;
                                }
                                if (appliance.safety.applianceGasSafety.ventilationSafe !== null
                                    && appliance.safety.applianceGasSafety.ventilationSafe !== undefined) {
                                    model_1.ventilationSatisfactory = appliance.safety.applianceGasSafety.ventilationSafe
                                        ? yesNoNa_1.YesNoNa.Yes
                                        : yesNoNa_1.YesNoNa.No;
                                }
                                else {
                                    model_1.ventilationSatisfactory = undefined;
                                }
                                if (appliance.safety.applianceGasSafety.chimneyInstallationAndTests !== null
                                    && appliance.safety.applianceGasSafety.chimneyInstallationAndTests !== undefined) {
                                    model_1.flueFlowTest = appliance.safety.applianceGasSafety.chimneyInstallationAndTests
                                        ? yesNoNa_1.YesNoNa.Yes : yesNoNa_1.YesNoNa.No;
                                    model_1.spillageTest = model_1.flueFlowTest;
                                    model_1.visualConditionOfFlueAndTerminationSatisfactory = model_1.flueFlowTest;
                                }
                                else {
                                    model_1.flueFlowTest = undefined;
                                    model_1.spillageTest = undefined;
                                    model_1.visualConditionOfFlueAndTerminationSatisfactory = undefined;
                                }
                            }
                            if (((appliance.safety.applianceGasSafety.requestedToTest !== null) && (appliance.safety.applianceGasSafety.requestedToTest !== undefined)
                                && (appliance.safety.applianceGasSafety.requestedToTest === false))
                                || ((appliance.safety.applianceGasSafety.ableToTest !== null) && (appliance.safety.applianceGasSafety.ableToTest !== undefined)
                                    && (appliance.safety.applianceGasSafety.ableToTest === false))) {
                                // do the other fields
                                model_1.operatingValue = null;
                                model_1.operatingValueUnits = null;
                                model_1.safetyDeviceCorrectOperation = yesNoNa_1.YesNoNa.Na;
                                model_1.ventilationSatisfactory = yesNoNa_1.YesNoNa.Na;
                                model_1.flueFlowTest = yesNoNa_1.YesNoNa.Na;
                                model_1.spillageTest = yesNoNa_1.YesNoNa.Na;
                                model_1.visualConditionOfFlueAndTerminationSatisfactory = yesNoNa_1.YesNoNa.Na;
                            }
                        }
                        // dont need the flue checks if the flue type is flue less
                        switch (appliance.flueType) {
                            case flueLessApplianceTypeBusinessRule_1:
                                model_1.flueFlowTest = yesNoNa_1.YesNoNa.Na;
                                model_1.spillageTest = yesNoNa_1.YesNoNa.Na;
                                model_1.visualConditionOfFlueAndTerminationSatisfactory = yesNoNa_1.YesNoNa.Na;
                                break;
                            case roomSealedFlueApplianceTypeBusinessRule_1:
                                model_1.flueFlowTest = yesNoNa_1.YesNoNa.Na;
                                model_1.spillageTest = yesNoNa_1.YesNoNa.Na;
                                break;
                        }
                        return model_1;
                    }
                    else {
                        throw new businessException_1.BusinessException(_this, "landlordFactory", "could not get object type catalog item for appliance type ${applianceType}", [appliance.applianceType], null);
                    }
                });
            }
            else {
                return Promise.resolve(undefined);
            }
        };
        LandlordFactory.prototype.createLandlordSafetyCertificateResult = function (propertySafety, businessRules, safetyActions) {
            var model = new landlordSafetyCertificateResult_1.LandlordSafetyCertificateResult();
            model.propertySafetyDefect = new landlordSafetyCertificateDefect_1.LandlordSafetyCertificateDefect();
            var gasMeterApplianceSatisfactoryYesBusinessRule = businessRules.getBusinessRule("gasMeterApplianceSatisfactoryYes");
            var gasMeterApplianceSatisfactoryNoBusinessRule = businessRules.getBusinessRule("gasMeterApplianceSatisfactoryNo");
            var gasMeterApplianceSatisfactoryNoMeterBusinessRule = businessRules.getBusinessRule("gasMeterApplianceSatisfactoryNoMeter");
            var gasMeterApplianceSatisfactoryNotApplicableBusinessRule = businessRules.getBusinessRule("gasMeterApplianceSatisfactoryNotApplicable");
            var conditionAsLeftImmediatelyDangerousBusinessRule = businessRules.getBusinessRule("conditionAsLeftImmediatelyDangerous");
            var conditionAsLeftAtRiskBusinessRule = businessRules.getBusinessRule("conditionAsLeftAtRisk");
            var conditionAsLeftNotCommissionedBusinessRule = businessRules.getBusinessRule("conditionAsLeftNotCommissioned");
            var conditionAsLeftNotToCurrentStandardsBusinessRule = businessRules.getBusinessRule("conditionAsLeftNotToCurrentStandards");
            var reportMaxLengthBusinessRule = businessRules.getBusinessRule("reportMaxLength");
            if (propertySafety && propertySafety.propertyUnsafeDetail
                && propertySafety.propertyUnsafeDetail.reasons
                && propertySafety.propertyUnsafeDetail.reasons.length > 0) {
                model.propertySafetyDefect.isNotApplicable = false;
                if (propertySafety.propertyUnsafeDetail.report && propertySafety.propertyUnsafeDetail.report.length > 0) {
                    model.propertySafetyDefect.details = propertySafety.propertyUnsafeDetail.report.length > reportMaxLengthBusinessRule
                        ? propertySafety.propertyUnsafeDetail.report.substr(0, reportMaxLengthBusinessRule)
                        : propertySafety.propertyUnsafeDetail.report;
                }
                model.propertySafetyDefect.actionTaken = propertySafety.propertyUnsafeDetail.cappedTurnedOff;
                var action = safetyActions.find(function (x) { return x.actionCode === propertySafety.propertyUnsafeDetail.cappedTurnedOff; });
                if (action) {
                    model.propertySafetyDefect.actionTakenText = action.safetyActionDescription;
                }
                model.propertySafetyDefect.labelledAndWarningNoticeGiven = propertySafety.propertyUnsafeDetail.letterLeft === true
                    ? yesNoNa_1.YesNoNa.Yes
                    : (propertySafety.propertyUnsafeDetail.letterLeft === false ? yesNoNa_1.YesNoNa.No : undefined);
                model.propertySafetyDefect.conditionOfAppliance = propertySafety.propertyUnsafeDetail.conditionAsLeft;
            }
            else {
                model.propertySafetyDefect.isNotApplicable = true;
                model.propertySafetyDefect.details = undefined;
                model.propertySafetyDefect.actionTaken = undefined;
                model.propertySafetyDefect.actionTakenText = undefined;
                model.propertySafetyDefect.labelledAndWarningNoticeGiven = undefined;
                model.propertySafetyDefect.conditionOfAppliance = undefined;
            }
            model.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = undefined;
            if (propertySafety && propertySafety.propertyGasSafetyDetail
                && propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory === gasMeterApplianceSatisfactoryYesBusinessRule) {
                // everything ok
                model.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = yesNoNa_1.YesNoNa.Yes;
            }
            else if (propertySafety && propertySafety.propertyGasSafetyDetail
                && propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory === gasMeterApplianceSatisfactoryNoBusinessRule
                && propertySafety.propertyUnsafeDetail
                && propertySafety.propertyUnsafeDetail.conditionAsLeft === conditionAsLeftNotToCurrentStandardsBusinessRule) {
                // not to current standards
                model.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = yesNoNa_1.YesNoNa.Yes;
            }
            else if (propertySafety && propertySafety.propertyGasSafetyDetail
                && propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory === gasMeterApplianceSatisfactoryNoMeterBusinessRule) {
                // no meter
                model.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = yesNoNa_1.YesNoNa.Na;
            }
            else if (propertySafety && propertySafety.propertyGasSafetyDetail
                && propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory === gasMeterApplianceSatisfactoryNotApplicableBusinessRule) {
                // not applicable
                model.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = yesNoNa_1.YesNoNa.Yes;
            }
            else if (propertySafety && propertySafety.propertyGasSafetyDetail
                && propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory === gasMeterApplianceSatisfactoryNoBusinessRule
                && propertySafety.propertyUnsafeDetail
                && propertySafety.propertyUnsafeDetail.conditionAsLeft === conditionAsLeftAtRiskBusinessRule) {
                // at risk
                model.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = yesNoNa_1.YesNoNa.No;
            }
            else if (propertySafety && propertySafety.propertyGasSafetyDetail
                && propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory === gasMeterApplianceSatisfactoryNoBusinessRule
                && propertySafety.propertyUnsafeDetail
                && propertySafety.propertyUnsafeDetail.conditionAsLeft === conditionAsLeftImmediatelyDangerousBusinessRule) {
                // immediately dangerous
                model.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = yesNoNa_1.YesNoNa.No;
            }
            else if (propertySafety && propertySafety.propertyGasSafetyDetail
                && propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory === gasMeterApplianceSatisfactoryNoBusinessRule
                && propertySafety.propertyUnsafeDetail
                && propertySafety.propertyUnsafeDetail.conditionAsLeft === conditionAsLeftNotCommissionedBusinessRule) {
                // not commissioned
                model.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = yesNoNa_1.YesNoNa.Na;
            }
            return model;
        };
        LandlordFactory.prototype.createLandlordSafetyCertificateDefect = function (appliance, businessRules, safetyActions) {
            var model = new landlordSafetyCertificateDefect_1.LandlordSafetyCertificateDefect();
            var reportMaxLengthBusinessRule = businessRules.getBusinessRule("reportMaxLength");
            if (appliance && appliance.safety && appliance.safety.applianceGasSafety) {
                if (appliance.safety.applianceGasSafety.isApplianceSafe !== null
                    && appliance.safety.applianceGasSafety.isApplianceSafe !== undefined) {
                    if (!appliance.safety.applianceGasSafety.isApplianceSafe
                        || (appliance.safety.applianceGasUnsafeDetail && appliance.safety.applianceGasUnsafeDetail.report)) {
                        if (appliance.safety.applianceGasUnsafeDetail) {
                            // need to put in some defect info
                            model.isNotApplicable = false;
                            if (appliance.safety.applianceGasUnsafeDetail.report && appliance.safety.applianceGasUnsafeDetail.report.length > reportMaxLengthBusinessRule) {
                                model.details = appliance.safety.applianceGasUnsafeDetail.report.substr(0, reportMaxLengthBusinessRule);
                            }
                            else {
                                model.details = appliance.safety.applianceGasUnsafeDetail.report;
                            }
                            model.actionTaken = appliance.safety.applianceGasUnsafeDetail.cappedTurnedOff;
                            var action = safetyActions.find(function (x) { return x.actionCode === appliance.safety.applianceGasUnsafeDetail.cappedTurnedOff; });
                            if (action) {
                                model.actionTakenText = action.safetyActionDescription;
                            }
                            model.labelledAndWarningNoticeGiven = appliance.safety.applianceGasUnsafeDetail.letterLeft === true
                                ? yesNoNa_1.YesNoNa.Yes
                                : (appliance.safety.applianceGasUnsafeDetail.letterLeft === false ? yesNoNa_1.YesNoNa.No : undefined);
                            model.conditionOfAppliance = appliance.safety.applianceGasUnsafeDetail.conditionAsLeft;
                        }
                        else {
                            model.isNotApplicable = false;
                            model.details = undefined;
                            model.actionTaken = undefined;
                            model.actionTakenText = undefined;
                            model.labelledAndWarningNoticeGiven = undefined;
                            model.conditionOfAppliance = undefined;
                        }
                    }
                    else {
                        model.isNotApplicable = true;
                        model.details = undefined;
                        model.actionTaken = undefined;
                        model.actionTakenText = undefined;
                        model.labelledAndWarningNoticeGiven = undefined;
                        model.conditionOfAppliance = undefined;
                    }
                }
                else {
                    model.isNotApplicable = false;
                    model.details = undefined;
                    model.actionTaken = undefined;
                    model.actionTakenText = undefined;
                    model.labelledAndWarningNoticeGiven = undefined;
                    model.conditionOfAppliance = undefined;
                }
            }
            else {
                model.isNotApplicable = false;
                model.details = undefined;
                model.actionTaken = undefined;
                model.actionTakenText = undefined;
                model.labelledAndWarningNoticeGiven = undefined;
                model.conditionOfAppliance = undefined;
            }
            return model;
        };
        LandlordFactory = __decorate([
            aurelia_dependency_injection_1.inject(catalogService_1.CatalogService),
            __metadata("design:paramtypes", [Object])
        ], LandlordFactory);
        return LandlordFactory;
    }());
    exports.LandlordFactory = LandlordFactory;
});

//# sourceMappingURL=landlordFactory.js.map
