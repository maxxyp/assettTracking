import { inject } from "aurelia-dependency-injection";

import { Job } from "../../business/models/job";
import { Engineer } from "../../business/models/engineer";

import { ILandlordFactory } from "./interfaces/ILandlordFactory";

import { LandlordSafetyCertificate as LandlordSafetyCertificateBusinessModel } from "../../business/models/landlord/landlordSafetyCertificate";
import { LandlordSafetyCertificateAppliance as LandlordSafetyCertificateApplianceBusinessModel } from "../../business/models/landlord/landlordSafetyCertificateAppliance";
import { LandlordSafetyCertificateDefect as LandlordSafetyCertificateDefectBusinessModel } from "../../business/models/landlord/landlordSafetyCertificateDefect";
import { LandlordSafetyCertificateResult as LandlordSafetyCertificateResultBusinessModel } from "../../business/models/landlord/landlordSafetyCertificateResult";
import { Appliance } from "../../business/models/appliance";
import { QueryableBusinessRuleGroup } from "../models/businessRules/queryableBusinessRuleGroup";
import { YesNoNa } from "../models/yesNoNa";
import { OperatingValueUnits } from "../models/landlord/operatingValueUnits";
import { PropertySafety } from "../models/propertySafety";
import { ICatalogService } from "../services/interfaces/ICatalogService";
import { CatalogService } from "../services/catalogService";
import { BusinessException } from "../models/businessException";
import { ISafetyAction } from "../models/reference/ISafetyAction";
import { ApplianceSafetyType } from "../models/applianceSafetyType";

@inject(CatalogService)
export class LandlordFactory implements ILandlordFactory {
    private _catalogService: ICatalogService;

    public constructor(catalogService: ICatalogService) {
        this._catalogService = catalogService;
    }

    public createLandlordSafetyCertificate(
        job: Job,
        engineer: Engineer,
        businessRules: QueryableBusinessRuleGroup,
        appliances: Appliance[]
    ): Promise<LandlordSafetyCertificateBusinessModel> {

        return this._catalogService.getSafetyActions().then((actions) => {
            let model = new LandlordSafetyCertificateBusinessModel();

            let applianceBusinessModelPromises: Promise<LandlordSafetyCertificateApplianceBusinessModel>[] = [];

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
                        } else {
                            model.landlordAddress.push(job.customerContact.address.line[0]);
                        }
                    } else if (job.customerContact.address.houseNumber) {
                        model.landlordAddress.push(job.customerContact.address.houseNumber);
                    }

                    if (job.customerContact.address.line && job.customerContact.address.line.length > 1) {
                        model.landlordAddress.push(job.customerContact.address.line[1]);
                    }

                    if (job.customerContact.address.town) {
                        model.landlordAddress.push(job.customerContact.address.town);
                    } else if (job.customerContact.address.county) {
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
                        } else {
                            model.propertyAddress.push(job.premises.address.line[0]);
                        }
                    }

                    if (job.premises.address.line.length > 1) {
                        model.propertyAddress.push(job.premises.address.line[1]);
                    }
                } else if (job.premises.address.houseNumber) {
                    model.propertyAddress.push(job.premises.address.houseNumber);
                }

                if (job.premises.address.town) {
                    model.propertyAddress.push(job.premises.address.town);
                } else if (job.premises.address.county) {
                    model.propertyAddress.push(job.premises.address.county);
                }

                model.propertyAddress.push(job.premises.address.postCodeOut + " " + job.premises.address.postCodeIn);

            } else if (job.customerAddress) {
                if (job.customerAddress.premisesName) {
                    model.propertyAddress.push(job.customerAddress.premisesName);
                }

                if (job.customerAddress.line && job.customerAddress.line.length > 0) {
                    if (job.customerAddress.line.length > 0) {
                        if (job.customerAddress.houseNumber) {
                            model.propertyAddress.push(job.customerAddress.houseNumber + " " + job.customerAddress.line[0]);
                        } else {
                            model.propertyAddress.push(job.customerAddress.line[0]);
                        }
                    }

                    if (job.customerAddress.line.length > 1) {
                        model.propertyAddress.push(job.customerAddress.line[1]);
                    }
                } else if (job.premises.address.houseNumber) {
                    model.propertyAddress.push(job.customerAddress.houseNumber);
                }

                if (job.customerAddress.town) {
                    model.propertyAddress.push(job.customerAddress.town);
                } else if (job.customerAddress.county) {
                    model.propertyAddress.push(job.customerAddress.county);
                }

                model.propertyAddress.push(job.customerAddress.postCodeOut + " " + job.customerAddress.postCodeIn);
            }

            model.appliances = [];
            model.defects = [];

            appliances.forEach(appliance => {
                if (appliance) {
                    applianceBusinessModelPromises.push(this.createLandlordSafetyCertificateAppliance(appliance, businessRules));
                    model.defects.push(this.createLandlordSafetyCertificateDefect(appliance, businessRules, actions));
                }
            });

            return Promise.all(applianceBusinessModelPromises)
                .then((certificateAappliances) => {
                    certificateAappliances.forEach((certificateAappliance) => {
                        model.appliances.push(certificateAappliance);
                    });
                })
                .then(() => {
                    model.applianceCount = model.appliances.length;
                    model.certificateResult = this.createLandlordSafetyCertificateResult(job.propertySafety, businessRules, actions);
                    return model;
                });
        });

    }

    public createLandlordSafetyCertificateAppliance(appliance: Appliance, businessRules: QueryableBusinessRuleGroup)
        : Promise<LandlordSafetyCertificateApplianceBusinessModel> {
        if (appliance.applianceSafetyType && appliance.applianceSafetyType === ApplianceSafetyType.gas) {
            let model: LandlordSafetyCertificateApplianceBusinessModel = new LandlordSafetyCertificateApplianceBusinessModel();
            model.id = appliance.id;

            let safetyDeviceYesValueBusinessRule = businessRules.getBusinessRule<number>("safetyDeviceYesValue");
            let safetyDeviceNoValueBusinessRule = businessRules.getBusinessRule<number>("safetyDeviceNoValue");
            let flueLessApplianceTypeBusinessRule = businessRules.getBusinessRule<string>("flueLessApplianceType");
            let roomSealedFlueApplianceTypeBusinessRule = businessRules.getBusinessRule<string>("roomSealedFlueApplianceType");

            return this._catalogService.getObjectType(appliance.applianceType)
                .then(catalogItem => {
                    if (catalogItem) {

                        model.location = appliance.locationDescription ? appliance.locationDescription : undefined;
                        model.type = appliance.applianceType ? appliance.applianceType : undefined;
                        model.flueType = appliance.flueType ? appliance.flueType : undefined;

                        if (appliance.safety) {

                            if (appliance.safety.applianceGasSafety) {
                                model.applianceSafe = appliance.safety.applianceGasSafety.isApplianceSafe;
                            } else {
                                model.applianceSafe = undefined;
                            }

                            let isGasAppliance = appliance.applianceSafetyType === ApplianceSafetyType.gas;
                            // do the other fields
                            if ((model.flueType || (!model.flueType && !isGasAppliance)) && (appliance.safety.applianceGasReadingsMaster
                                && appliance.safety.applianceGasReadingsMaster.preliminaryReadings)) {

                                if ((appliance.safety.applianceGasReadingsMaster.preliminaryReadings.burnerPressure !== null)
                                    && (appliance.safety.applianceGasReadingsMaster.preliminaryReadings.burnerPressure !== undefined)) {
                                    model.operatingValue =
                                        appliance.safety.applianceGasReadingsMaster.preliminaryReadings.burnerPressure;
                                    model.operatingValueUnits = OperatingValueUnits.M;
                                } else if ((appliance.safety.applianceGasReadingsMaster.preliminaryReadings.gasRateReading !== null)
                                    && (appliance.safety.applianceGasReadingsMaster.preliminaryReadings.gasRateReading !== undefined)) {
                                    model.operatingValue =
                                        appliance.safety.applianceGasReadingsMaster.preliminaryReadings.gasRateReading;
                                    model.operatingValueUnits = OperatingValueUnits.K;
                                } else if ((appliance.safety.applianceGasReadingsMaster.preliminaryReadings.readingFinalRatio !== null)
                                    && (appliance.safety.applianceGasReadingsMaster.preliminaryReadings.readingFinalRatio !== undefined)) {
                                    model.operatingValue =
                                        appliance.safety.applianceGasReadingsMaster.preliminaryReadings.readingFinalRatio;
                                    model.operatingValueUnits = OperatingValueUnits.R;
                                } else {
                                    model.operatingValue = undefined;
                                    model.operatingValueUnits = undefined;
                                }
                            } else {
                                model.operatingValue = undefined;
                                model.operatingValueUnits = undefined;
                            }

                            if (appliance.safety.applianceGasSafety) {

                                model.make = appliance.safety.applianceGasSafety.applianceMake;
                                model.model = appliance.safety.applianceGasSafety.applianceModel;

                                if (appliance.safety.applianceGasSafety.requestedToTest !== null && appliance.safety.applianceGasSafety.requestedToTest !== undefined) {
                                    model.requestedToTest = appliance.safety.applianceGasSafety.requestedToTest;
                                } else {
                                    model.requestedToTest = appliance.safety.applianceGasSafety.requestedToTest;
                                }

                                if (appliance.safety.applianceGasSafety.ableToTest !== null && appliance.safety.applianceGasSafety.ableToTest !== undefined) {
                                    model.unableToTest = !appliance.safety.applianceGasSafety.ableToTest;
                                } else {
                                    model.unableToTest = appliance.safety.applianceGasSafety.ableToTest;
                                }

                                if (appliance.safety.applianceGasSafety.safetyDevice !== null
                                    && appliance.safety.applianceGasSafety.safetyDevice !== undefined) {

                                    model.safetyDeviceCorrectOperation = appliance.safety.applianceGasSafety.safetyDevice === safetyDeviceYesValueBusinessRule
                                        ? YesNoNa.Yes
                                        : (appliance.safety.applianceGasSafety.safetyDevice === safetyDeviceNoValueBusinessRule ? YesNoNa.No : YesNoNa.Na);
                                } else {
                                    model.safetyDeviceCorrectOperation = undefined;
                                }

                                if (appliance.safety.applianceGasSafety.ventilationSafe !== null
                                    && appliance.safety.applianceGasSafety.ventilationSafe !== undefined) {

                                    model.ventilationSatisfactory = appliance.safety.applianceGasSafety.ventilationSafe
                                        ? YesNoNa.Yes
                                        : YesNoNa.No;
                                } else {
                                    model.ventilationSatisfactory = undefined;
                                }

                                if (appliance.safety.applianceGasSafety.chimneyInstallationAndTests !== null
                                    && appliance.safety.applianceGasSafety.chimneyInstallationAndTests !== undefined) {

                                    model.flueFlowTest = appliance.safety.applianceGasSafety.chimneyInstallationAndTests
                                        ? YesNoNa.Yes : YesNoNa.No;

                                    model.spillageTest = model.flueFlowTest;
                                    model.visualConditionOfFlueAndTerminationSatisfactory = model.flueFlowTest;
                                } else {
                                    model.flueFlowTest = undefined;
                                    model.spillageTest = undefined;
                                    model.visualConditionOfFlueAndTerminationSatisfactory = undefined;
                                }
                            }

                            if (((appliance.safety.applianceGasSafety.requestedToTest !== null) && (appliance.safety.applianceGasSafety.requestedToTest !== undefined)
                                && (appliance.safety.applianceGasSafety.requestedToTest === false))
                                || ((appliance.safety.applianceGasSafety.ableToTest !== null) && (appliance.safety.applianceGasSafety.ableToTest !== undefined)
                                    && (appliance.safety.applianceGasSafety.ableToTest === false))) {
                                // do the other fields
                                model.operatingValue = null;
                                model.operatingValueUnits = null;
                                model.safetyDeviceCorrectOperation = YesNoNa.Na;
                                model.ventilationSatisfactory = YesNoNa.Na;
                                model.flueFlowTest = YesNoNa.Na;
                                model.spillageTest = YesNoNa.Na;
                                model.visualConditionOfFlueAndTerminationSatisfactory = YesNoNa.Na;
                            }
                        }

                        // dont need the flue checks if the flue type is flue less
                        switch (appliance.flueType) {
                            case flueLessApplianceTypeBusinessRule:
                                model.flueFlowTest = YesNoNa.Na;
                                model.spillageTest = YesNoNa.Na;
                                model.visualConditionOfFlueAndTerminationSatisfactory = YesNoNa.Na;
                                break;
                            case roomSealedFlueApplianceTypeBusinessRule:
                                model.flueFlowTest = YesNoNa.Na;
                                model.spillageTest = YesNoNa.Na;
                                break;
                        }

                        return model;
                    } else {
                        throw new BusinessException(this, "landlordFactory", "could not get object type catalog item for appliance type ${applianceType}", [appliance.applianceType], null);
                    }
                });
        } else {
            return Promise.resolve(undefined);
        }
    }

    public createLandlordSafetyCertificateResult(propertySafety: PropertySafety, businessRules: QueryableBusinessRuleGroup, safetyActions: ISafetyAction[])
        : LandlordSafetyCertificateResultBusinessModel {

        let model: LandlordSafetyCertificateResultBusinessModel = new LandlordSafetyCertificateResultBusinessModel();
        model.propertySafetyDefect = new LandlordSafetyCertificateDefectBusinessModel();

        let gasMeterApplianceSatisfactoryYesBusinessRule = businessRules.getBusinessRule<string>("gasMeterApplianceSatisfactoryYes");
        let gasMeterApplianceSatisfactoryNoBusinessRule = businessRules.getBusinessRule<string>("gasMeterApplianceSatisfactoryNo");
        let gasMeterApplianceSatisfactoryNoMeterBusinessRule = businessRules.getBusinessRule<string>("gasMeterApplianceSatisfactoryNoMeter");
        let gasMeterApplianceSatisfactoryNotApplicableBusinessRule = businessRules.getBusinessRule<string>("gasMeterApplianceSatisfactoryNotApplicable");
        let conditionAsLeftImmediatelyDangerousBusinessRule = businessRules.getBusinessRule<string>("conditionAsLeftImmediatelyDangerous");
        let conditionAsLeftAtRiskBusinessRule = businessRules.getBusinessRule<string>("conditionAsLeftAtRisk");
        let conditionAsLeftNotCommissionedBusinessRule = businessRules.getBusinessRule<string>("conditionAsLeftNotCommissioned");
        let conditionAsLeftNotToCurrentStandardsBusinessRule = businessRules.getBusinessRule<string>("conditionAsLeftNotToCurrentStandards");
        let reportMaxLengthBusinessRule = businessRules.getBusinessRule<number>("reportMaxLength");

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
            let action = safetyActions.find(x => x.actionCode === propertySafety.propertyUnsafeDetail.cappedTurnedOff);
            if (action) {
                model.propertySafetyDefect.actionTakenText = action.safetyActionDescription;
            }

            model.propertySafetyDefect.labelledAndWarningNoticeGiven = propertySafety.propertyUnsafeDetail.letterLeft === true
                ? YesNoNa.Yes
                : (propertySafety.propertyUnsafeDetail.letterLeft === false ? YesNoNa.No : undefined);

            model.propertySafetyDefect.conditionOfAppliance = propertySafety.propertyUnsafeDetail.conditionAsLeft;
        } else {
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
            model.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = YesNoNa.Yes;
        } else if (propertySafety && propertySafety.propertyGasSafetyDetail
            && propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory === gasMeterApplianceSatisfactoryNoBusinessRule
            && propertySafety.propertyUnsafeDetail
            && propertySafety.propertyUnsafeDetail.conditionAsLeft === conditionAsLeftNotToCurrentStandardsBusinessRule) {

            // not to current standards
            model.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = YesNoNa.Yes;
        } else if (propertySafety && propertySafety.propertyGasSafetyDetail
            && propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory === gasMeterApplianceSatisfactoryNoMeterBusinessRule) {

            // no meter
            model.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = YesNoNa.Na;
        } else if (propertySafety && propertySafety.propertyGasSafetyDetail
            && propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory === gasMeterApplianceSatisfactoryNotApplicableBusinessRule) {

            // not applicable
            model.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = YesNoNa.Yes;
        } else if (propertySafety && propertySafety.propertyGasSafetyDetail
            && propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory === gasMeterApplianceSatisfactoryNoBusinessRule
            && propertySafety.propertyUnsafeDetail
            && propertySafety.propertyUnsafeDetail.conditionAsLeft === conditionAsLeftAtRiskBusinessRule) {

            // at risk
            model.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = YesNoNa.No;
        } else if (propertySafety && propertySafety.propertyGasSafetyDetail
            && propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory === gasMeterApplianceSatisfactoryNoBusinessRule
            && propertySafety.propertyUnsafeDetail
            && propertySafety.propertyUnsafeDetail.conditionAsLeft === conditionAsLeftImmediatelyDangerousBusinessRule) {

            // immediately dangerous
            model.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = YesNoNa.No;
        } else if (propertySafety && propertySafety.propertyGasSafetyDetail
            && propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory === gasMeterApplianceSatisfactoryNoBusinessRule
            && propertySafety.propertyUnsafeDetail
            && propertySafety.propertyUnsafeDetail.conditionAsLeft === conditionAsLeftNotCommissionedBusinessRule) {

            // not commissioned
            model.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = YesNoNa.Na;
        }

        return model;
    }

    public createLandlordSafetyCertificateDefect(appliance: Appliance, businessRules: QueryableBusinessRuleGroup, safetyActions: ISafetyAction[])
        : LandlordSafetyCertificateDefectBusinessModel {

        let model: LandlordSafetyCertificateDefectBusinessModel = new LandlordSafetyCertificateDefectBusinessModel();

        let reportMaxLengthBusinessRule = businessRules.getBusinessRule<number>("reportMaxLength");

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
                        } else {
                            model.details = appliance.safety.applianceGasUnsafeDetail.report;
                        }

                        model.actionTaken = appliance.safety.applianceGasUnsafeDetail.cappedTurnedOff;
                        let action = safetyActions.find(x => x.actionCode === appliance.safety.applianceGasUnsafeDetail.cappedTurnedOff);
                        if (action) {
                            model.actionTakenText = action.safetyActionDescription;
                        }

                        model.labelledAndWarningNoticeGiven = appliance.safety.applianceGasUnsafeDetail.letterLeft === true
                            ? YesNoNa.Yes
                            : (appliance.safety.applianceGasUnsafeDetail.letterLeft === false ? YesNoNa.No : undefined);
                        model.conditionOfAppliance = appliance.safety.applianceGasUnsafeDetail.conditionAsLeft;
                    } else {
                        model.isNotApplicable = false;
                        model.details = undefined;
                        model.actionTaken = undefined;
                        model.actionTakenText = undefined;
                        model.labelledAndWarningNoticeGiven = undefined;
                        model.conditionOfAppliance = undefined;
                    }
                } else {
                    model.isNotApplicable = true;
                    model.details = undefined;
                    model.actionTaken = undefined;
                    model.actionTakenText = undefined;
                    model.labelledAndWarningNoticeGiven = undefined;
                    model.conditionOfAppliance = undefined;
                }
            } else {
                model.isNotApplicable = false;
                model.details = undefined;
                model.actionTaken = undefined;
                model.actionTakenText = undefined;
                model.labelledAndWarningNoticeGiven = undefined;
                model.conditionOfAppliance = undefined;
            }
        } else {
            model.isNotApplicable = false;
            model.details = undefined;
            model.actionTaken = undefined;
            model.actionTakenText = undefined;
            model.labelledAndWarningNoticeGiven = undefined;
            model.conditionOfAppliance = undefined;
        }

        return model;
    }
}
