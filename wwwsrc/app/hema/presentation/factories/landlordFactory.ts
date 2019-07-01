import {BusinessException} from "../../business/models/businessException";
import {LandlordSafetyCertificate as LandlordSafetyCertificateBusinessModel} from "../../business/models/landlord/landlordSafetyCertificate";
import {LandlordSafetyCertificateAppliance as LandlordSafetyCertificateApplianceBusinessModel} from "../../business/models/landlord/landlordSafetyCertificateAppliance";
import {LandlordSafetyCertificateDefect as LandlordSafetyCertificateDefectBusinessModel} from "../../business/models/landlord/landlordSafetyCertificateDefect";

import {LandlordSafetyCertificateViewModel} from "../models/landlordSafetyCertificateViewModel";
import {LandlordSafetyCertificateApplianceViewModel} from "../models/landlordSafetyCertificateApplianceViewModel";
import {LandlordSafetyCertificateDefectViewModel} from "../models/landlordSafetyCertificateDefectViewModel";

import {ILandlordFactory} from "./interfaces/ILandlordFactory";
import {OperatingValueUnits} from "../../business/models/landlord/operatingValueUnits";
import {YesNoNa} from "../../business/models/yesNoNa";
// import {ArrayHelper} from "../../../common/core/arrayHelper";

export class LandlordFactory implements ILandlordFactory {

    public createLandlordSafetyCertificateViewModel(landlordSafetyCertificateBusinessModel: LandlordSafetyCertificateBusinessModel,
                                                    labels: { [key: string]: any }) : LandlordSafetyCertificateViewModel {
        let vm = new LandlordSafetyCertificateViewModel();

        let incompleteLabel = this.getDictionaryValue<string>(labels, "incomplete");
        let yesLabel = this.getDictionaryValue<string>(labels, "yes");
        let noLabel = this.getDictionaryValue<string>(labels, "no");
        let notApplicableLabel = this.getDictionaryValue<string>(labels, "notApplicable");
        let unableToTestLabel = this.getDictionaryValue<string>(labels, "unableToTest");
        let passLabel = this.getDictionaryValue<string>(labels, "pass");
        let failLabel = this.getDictionaryValue<string>(labels, "fail");

        if (landlordSafetyCertificateBusinessModel) {
            vm.jobNumber = landlordSafetyCertificateBusinessModel.jobNumber;
            vm.date = landlordSafetyCertificateBusinessModel.date;

            vm.engineerName = landlordSafetyCertificateBusinessModel.engineerName;
            vm.engineerId = landlordSafetyCertificateBusinessModel.engineerId;

            vm.landlordAddress = landlordSafetyCertificateBusinessModel.landlordAddress;
            vm.propertyAddress = landlordSafetyCertificateBusinessModel.propertyAddress;

            vm.appliances = [];
            vm.defects = [];

            if (landlordSafetyCertificateBusinessModel.appliances && landlordSafetyCertificateBusinessModel.appliances.length > 0) {
                // aArrayHelper.sortByColumn(landlordSafetyCertificateBusinessModel.appliances, "id");

                for (let applianceCounter = 0; applianceCounter < landlordSafetyCertificateBusinessModel.appliances.length; applianceCounter++) {
                    let certificateApplianceBusinessModel = landlordSafetyCertificateBusinessModel.appliances[applianceCounter];
                    let certificateDefectBusinessModel = landlordSafetyCertificateBusinessModel.defects[applianceCounter];

                    vm.appliances.push(this.createLandlordSafetyCertificateApplianceViewModel(certificateApplianceBusinessModel, labels));
                    vm.defects.push(this.createLandlordSafetyCertificateDefectViewModel(certificateDefectBusinessModel, labels));

                    if (certificateApplianceBusinessModel.requestedToTest === false || certificateApplianceBusinessModel.unableToTest === true) {
                        // defect DF_1441 - labelledAndWarningNoticeGiven should be set to N/A when requestedToTest is falsee or unableToTest is true
                        vm.defects[applianceCounter].labelledAndWarningNoticeGiven = notApplicableLabel;
                    }
                }
            }

            vm.applianceCount = vm.appliances.length;

            vm.instPremDefect = new LandlordSafetyCertificateDefectViewModel();

            if (landlordSafetyCertificateBusinessModel.certificateResult && landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect) {
                if (landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.isNotApplicable === true) {
                    vm.instPremDefect.details = notApplicableLabel;
                    vm.instPremDefect.actionTaken = notApplicableLabel;
                    vm.instPremDefect.labelledAndWarningNoticeGiven = notApplicableLabel;
                    vm.instPremDefect.conditionOfAppliance = notApplicableLabel;
                } else {
                    if (landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.details === undefined) {
                        vm.instPremDefect.details = incompleteLabel;
                    } else {
                        vm.instPremDefect.details = landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.details;
                    }

                    if (landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.actionTaken === undefined) {
                        vm.instPremDefect.actionTaken = incompleteLabel;
                    } else {
                        vm.instPremDefect.actionTaken = landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.actionTaken;
                    }

                    if (landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.labelledAndWarningNoticeGiven === undefined) {
                        vm.instPremDefect.labelledAndWarningNoticeGiven = incompleteLabel;
                    } else {
                        switch (landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.labelledAndWarningNoticeGiven) {
                            case YesNoNa.Yes:
                                vm.instPremDefect.labelledAndWarningNoticeGiven = yesLabel;
                                break;
                            case YesNoNa.No:
                                vm.instPremDefect.labelledAndWarningNoticeGiven = noLabel;
                                break;
                            case YesNoNa.Na:
                                vm.instPremDefect.labelledAndWarningNoticeGiven = notApplicableLabel;
                                break;
                            default:
                                vm.instPremDefect.labelledAndWarningNoticeGiven = incompleteLabel;
                                break;
                        }
                    }

                    if (landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.conditionOfAppliance === undefined) {
                        vm.instPremDefect.conditionOfAppliance = incompleteLabel;
                    } else {
                        vm.instPremDefect.conditionOfAppliance = landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.conditionOfAppliance;
                    }
                }
            } else {
                vm.instPremDefect.details = incompleteLabel;
                vm.instPremDefect.actionTaken = incompleteLabel;
                vm.instPremDefect.labelledAndWarningNoticeGiven = incompleteLabel;
                vm.instPremDefect.conditionOfAppliance = incompleteLabel;
            }

            if (landlordSafetyCertificateBusinessModel.certificateResult.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass === undefined) {
                vm.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = incompleteLabel;
            } else {
                switch (landlordSafetyCertificateBusinessModel.certificateResult.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass) {
                    case YesNoNa.Yes:
                        vm.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = passLabel;
                        break;
                    case YesNoNa.No:
                        vm.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = failLabel;
                        break;
                    case YesNoNa.Na:
                        vm.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = unableToTestLabel;
                        break;
                    default:
                        vm.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = incompleteLabel;
                        break;
                }
            }
        }

        return vm;
    }

    public createLandlordSafetyCertificateApplianceViewModel(certificateApplianceBusinessModel: LandlordSafetyCertificateApplianceBusinessModel, labels: { [key: string]: any })
        : LandlordSafetyCertificateApplianceViewModel {

        let vm: LandlordSafetyCertificateApplianceViewModel = new LandlordSafetyCertificateApplianceViewModel();

        let incompleteLabel = this.getDictionaryValue<string>(labels, "incomplete");
        let yesLabel = this.getDictionaryValue<string>(labels, "yes");
        let noLabel = this.getDictionaryValue<string>(labels, "no");
        let passLabel = this.getDictionaryValue<string>(labels, "pass");
        let failLabel = this.getDictionaryValue<string>(labels, "fail");
        let notApplicableLabel = this.getDictionaryValue<string>(labels, "notApplicable");
        let dashesLabel = this.getDictionaryValue<string>(labels, "dashes");
        let operatingUnitsMLabel = this.getDictionaryValue<string>(labels, "operatingUnitsM");
        let operatingUnitsRLabel = this.getDictionaryValue<string>(labels, "operatingUnitsR");
        let operatingUnitsKLabel = this.getDictionaryValue<string>(labels, "operatingUnitsK");

        vm.id = certificateApplianceBusinessModel.id;
        vm.location = certificateApplianceBusinessModel.location ? certificateApplianceBusinessModel.location : incompleteLabel;
        vm.type = certificateApplianceBusinessModel.type ? certificateApplianceBusinessModel.type : incompleteLabel;
        vm.flueType = certificateApplianceBusinessModel.flueType ? certificateApplianceBusinessModel.flueType : incompleteLabel;

        vm.make = certificateApplianceBusinessModel.make ? certificateApplianceBusinessModel.make : incompleteLabel;
        vm.model = certificateApplianceBusinessModel.model ? certificateApplianceBusinessModel.model : incompleteLabel;

        if (certificateApplianceBusinessModel.requestedToTest === undefined) {
            vm.requestedToTest = incompleteLabel;
        } else {
            vm.requestedToTest = certificateApplianceBusinessModel.requestedToTest === true
                ? yesLabel
                : noLabel;
        }

        if (certificateApplianceBusinessModel.unableToTest === undefined) {
            vm.unableToTest = incompleteLabel;
        } else {
            vm.unableToTest = certificateApplianceBusinessModel.unableToTest === true
                ? yesLabel
                : dashesLabel;
        }

        if (certificateApplianceBusinessModel.unableToTest === true || certificateApplianceBusinessModel.requestedToTest === false) {
            vm.applianceSafe = notApplicableLabel;
            vm.operatingValue = notApplicableLabel;
            vm.operatingValueUnits = "";
        } else {
            
            if (certificateApplianceBusinessModel.applianceSafe === undefined) {
                vm.applianceSafe = incompleteLabel;
            } else {
                vm.applianceSafe = certificateApplianceBusinessModel.applianceSafe === true
                    ? yesLabel
                    : noLabel;
            }

            if (certificateApplianceBusinessModel.operatingValue === undefined || certificateApplianceBusinessModel.operatingValue === null) {
                vm.operatingValue = incompleteLabel;
                vm.operatingValueUnits = "";
            } else {
                vm.operatingValue = certificateApplianceBusinessModel.operatingValue.toString(10);

                switch (certificateApplianceBusinessModel.operatingValueUnits) {
                    case OperatingValueUnits.K:
                        vm.operatingValueUnits = operatingUnitsKLabel;
                        break;
                    case OperatingValueUnits.R:
                        vm.operatingValueUnits = operatingUnitsRLabel;
                        break;
                    case OperatingValueUnits.M:
                        vm.operatingValueUnits = operatingUnitsMLabel;
                        break;
                    default:
                        vm.operatingValueUnits = "";
                        break;
                }
            }
        }

        if (certificateApplianceBusinessModel.safetyDeviceCorrectOperation === undefined) {
            vm.safetyDeviceCorrectOperation = incompleteLabel;
        } else {
            switch (certificateApplianceBusinessModel.safetyDeviceCorrectOperation) {
                case YesNoNa.Yes:
                    vm.safetyDeviceCorrectOperation = yesLabel;
                    break;
                case YesNoNa.No:
                    vm.safetyDeviceCorrectOperation = noLabel;
                    break;
                case YesNoNa.Na:
                    vm.safetyDeviceCorrectOperation = notApplicableLabel;
                    break;
                default:
                    vm.safetyDeviceCorrectOperation = incompleteLabel;
                    break;
            }
        }

        if (certificateApplianceBusinessModel.ventilationSatisfactory === undefined) {
            vm.ventilationSatisfactory = incompleteLabel;
        } else {
            switch (certificateApplianceBusinessModel.ventilationSatisfactory) {
                case YesNoNa.Yes:
                    vm.ventilationSatisfactory = yesLabel;
                    break;
                case YesNoNa.No:
                    vm.ventilationSatisfactory = noLabel;
                    break;
                case YesNoNa.Na:
                    vm.ventilationSatisfactory = notApplicableLabel;
                    break;
                default:
                    vm.ventilationSatisfactory = incompleteLabel;
                    break;
            }
        }

        if (certificateApplianceBusinessModel.flueFlowTest === undefined) {
            vm.flueFlowTest = incompleteLabel;
        } else {
            switch (certificateApplianceBusinessModel.flueFlowTest) {
                case YesNoNa.Yes:
                    vm.flueFlowTest = passLabel;
                    break;
                case YesNoNa.No:
                    vm.flueFlowTest = failLabel;
                    break;
                case YesNoNa.Na:
                    vm.flueFlowTest = notApplicableLabel;
                    break;
                default:
                    vm.flueFlowTest = incompleteLabel;
                    break;
            }
        }

        if (certificateApplianceBusinessModel.spillageTest === undefined) {
            vm.spillageTest = incompleteLabel;
        } else {
            switch (certificateApplianceBusinessModel.spillageTest) {
                case YesNoNa.Yes:
                    vm.spillageTest = passLabel;
                    break;
                case YesNoNa.No:
                    vm.spillageTest = failLabel;
                    break;
                case YesNoNa.Na:
                    vm.spillageTest = notApplicableLabel;
                    break;
                default:
                    vm.spillageTest = incompleteLabel;
                    break;
            }
        }

        if (certificateApplianceBusinessModel.visualConditionOfFlueAndTerminationSatisfactory === undefined) {
            vm.visualConditionOfFlueAndTerminationSatisfactory = incompleteLabel;
        } else {
            switch (certificateApplianceBusinessModel.visualConditionOfFlueAndTerminationSatisfactory) {
                case YesNoNa.Yes:
                    vm.visualConditionOfFlueAndTerminationSatisfactory = yesLabel;
                    break;
                case YesNoNa.No:
                    vm.visualConditionOfFlueAndTerminationSatisfactory = noLabel;
                    break;
                case YesNoNa.Na:
                    vm.visualConditionOfFlueAndTerminationSatisfactory = notApplicableLabel;
                    break;
                default:
                    vm.visualConditionOfFlueAndTerminationSatisfactory = incompleteLabel;
                    break;
            }
        }

        return vm;
    }

    public createLandlordSafetyCertificateDefectViewModel(certificateDefectBusinessModel: LandlordSafetyCertificateDefectBusinessModel, labels: { [key: string]: any })
        : LandlordSafetyCertificateDefectViewModel {

        let vm: LandlordSafetyCertificateDefectViewModel = new LandlordSafetyCertificateDefectViewModel();

        let incompleteLabel = this.getDictionaryValue<string>(labels, "incomplete");
        let yesLabel = this.getDictionaryValue<string>(labels, "yes");
        let noLabel = this.getDictionaryValue<string>(labels, "no");
        let notApplicableLabel = this.getDictionaryValue<string>(labels, "notApplicable");

        if (certificateDefectBusinessModel.isNotApplicable) {
            vm.details = notApplicableLabel;
            vm.actionTaken = notApplicableLabel;
            vm.conditionOfAppliance = notApplicableLabel;
            vm.labelledAndWarningNoticeGiven = notApplicableLabel;
        } else {
            if (certificateDefectBusinessModel.details === undefined) {
                vm.details = incompleteLabel;
            } else {
                vm.details = certificateDefectBusinessModel.details;
            }

            if (certificateDefectBusinessModel.actionTaken === undefined) {
                vm.actionTaken = incompleteLabel;
            } else {
                vm.actionTaken = certificateDefectBusinessModel.actionTaken;
            }

            if (certificateDefectBusinessModel.labelledAndWarningNoticeGiven === undefined) {
                vm.labelledAndWarningNoticeGiven = incompleteLabel;
            } else {
                switch (certificateDefectBusinessModel.labelledAndWarningNoticeGiven) {
                    case YesNoNa.Yes:
                        vm.labelledAndWarningNoticeGiven = yesLabel;
                        break;
                    case YesNoNa.No:
                        vm.labelledAndWarningNoticeGiven = noLabel;
                        break;
                    case YesNoNa.Na:
                        vm.labelledAndWarningNoticeGiven = notApplicableLabel;
                        break;
                    default:
                        vm.labelledAndWarningNoticeGiven = incompleteLabel;
                        break;
                }
            }

            if (certificateDefectBusinessModel.conditionOfAppliance === undefined) {
                vm.conditionOfAppliance = incompleteLabel;
            } else {
                vm.conditionOfAppliance = certificateDefectBusinessModel.conditionOfAppliance;
            }
        }

        return vm;
    }

    public getDictionaryValue<T>(source: { [key: string] : any }, key: string): T {
        if (!source || !(key in source)) {
            throw new BusinessException(this, "getDictionaryValue", "Unable to get dictionary value '{0}' in factory 'landlordFactory'", [key], null);
        }

        let value = source[key];
        return <T>value;
    }
}
