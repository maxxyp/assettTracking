define(["require", "exports", "../../business/models/businessException", "../models/landlordSafetyCertificateViewModel", "../models/landlordSafetyCertificateApplianceViewModel", "../models/landlordSafetyCertificateDefectViewModel", "../../business/models/landlord/operatingValueUnits", "../../business/models/yesNoNa"], function (require, exports, businessException_1, landlordSafetyCertificateViewModel_1, landlordSafetyCertificateApplianceViewModel_1, landlordSafetyCertificateDefectViewModel_1, operatingValueUnits_1, yesNoNa_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import {ArrayHelper} from "../../../common/core/arrayHelper";
    var LandlordFactory = /** @class */ (function () {
        function LandlordFactory() {
        }
        LandlordFactory.prototype.createLandlordSafetyCertificateViewModel = function (landlordSafetyCertificateBusinessModel, labels) {
            var vm = new landlordSafetyCertificateViewModel_1.LandlordSafetyCertificateViewModel();
            var incompleteLabel = this.getDictionaryValue(labels, "incomplete");
            var yesLabel = this.getDictionaryValue(labels, "yes");
            var noLabel = this.getDictionaryValue(labels, "no");
            var notApplicableLabel = this.getDictionaryValue(labels, "notApplicable");
            var unableToTestLabel = this.getDictionaryValue(labels, "unableToTest");
            var passLabel = this.getDictionaryValue(labels, "pass");
            var failLabel = this.getDictionaryValue(labels, "fail");
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
                    for (var applianceCounter = 0; applianceCounter < landlordSafetyCertificateBusinessModel.appliances.length; applianceCounter++) {
                        var certificateApplianceBusinessModel = landlordSafetyCertificateBusinessModel.appliances[applianceCounter];
                        var certificateDefectBusinessModel = landlordSafetyCertificateBusinessModel.defects[applianceCounter];
                        vm.appliances.push(this.createLandlordSafetyCertificateApplianceViewModel(certificateApplianceBusinessModel, labels));
                        vm.defects.push(this.createLandlordSafetyCertificateDefectViewModel(certificateDefectBusinessModel, labels));
                        if (certificateApplianceBusinessModel.requestedToTest === false || certificateApplianceBusinessModel.unableToTest === true) {
                            // defect DF_1441 - labelledAndWarningNoticeGiven should be set to N/A when requestedToTest is falsee or unableToTest is true
                            vm.defects[applianceCounter].labelledAndWarningNoticeGiven = notApplicableLabel;
                        }
                    }
                }
                vm.applianceCount = vm.appliances.length;
                vm.instPremDefect = new landlordSafetyCertificateDefectViewModel_1.LandlordSafetyCertificateDefectViewModel();
                if (landlordSafetyCertificateBusinessModel.certificateResult && landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect) {
                    if (landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.isNotApplicable === true) {
                        vm.instPremDefect.details = notApplicableLabel;
                        vm.instPremDefect.actionTaken = notApplicableLabel;
                        vm.instPremDefect.labelledAndWarningNoticeGiven = notApplicableLabel;
                        vm.instPremDefect.conditionOfAppliance = notApplicableLabel;
                    }
                    else {
                        if (landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.details === undefined) {
                            vm.instPremDefect.details = incompleteLabel;
                        }
                        else {
                            vm.instPremDefect.details = landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.details;
                        }
                        if (landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.actionTaken === undefined) {
                            vm.instPremDefect.actionTaken = incompleteLabel;
                        }
                        else {
                            vm.instPremDefect.actionTaken = landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.actionTaken;
                        }
                        if (landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.labelledAndWarningNoticeGiven === undefined) {
                            vm.instPremDefect.labelledAndWarningNoticeGiven = incompleteLabel;
                        }
                        else {
                            switch (landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.labelledAndWarningNoticeGiven) {
                                case yesNoNa_1.YesNoNa.Yes:
                                    vm.instPremDefect.labelledAndWarningNoticeGiven = yesLabel;
                                    break;
                                case yesNoNa_1.YesNoNa.No:
                                    vm.instPremDefect.labelledAndWarningNoticeGiven = noLabel;
                                    break;
                                case yesNoNa_1.YesNoNa.Na:
                                    vm.instPremDefect.labelledAndWarningNoticeGiven = notApplicableLabel;
                                    break;
                                default:
                                    vm.instPremDefect.labelledAndWarningNoticeGiven = incompleteLabel;
                                    break;
                            }
                        }
                        if (landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.conditionOfAppliance === undefined) {
                            vm.instPremDefect.conditionOfAppliance = incompleteLabel;
                        }
                        else {
                            vm.instPremDefect.conditionOfAppliance = landlordSafetyCertificateBusinessModel.certificateResult.propertySafetyDefect.conditionOfAppliance;
                        }
                    }
                }
                else {
                    vm.instPremDefect.details = incompleteLabel;
                    vm.instPremDefect.actionTaken = incompleteLabel;
                    vm.instPremDefect.labelledAndWarningNoticeGiven = incompleteLabel;
                    vm.instPremDefect.conditionOfAppliance = incompleteLabel;
                }
                if (landlordSafetyCertificateBusinessModel.certificateResult.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass === undefined) {
                    vm.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = incompleteLabel;
                }
                else {
                    switch (landlordSafetyCertificateBusinessModel.certificateResult.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass) {
                        case yesNoNa_1.YesNoNa.Yes:
                            vm.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = passLabel;
                            break;
                        case yesNoNa_1.YesNoNa.No:
                            vm.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = failLabel;
                            break;
                        case yesNoNa_1.YesNoNa.Na:
                            vm.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = unableToTestLabel;
                            break;
                        default:
                            vm.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = incompleteLabel;
                            break;
                    }
                }
            }
            return vm;
        };
        LandlordFactory.prototype.createLandlordSafetyCertificateApplianceViewModel = function (certificateApplianceBusinessModel, labels) {
            var vm = new landlordSafetyCertificateApplianceViewModel_1.LandlordSafetyCertificateApplianceViewModel();
            var incompleteLabel = this.getDictionaryValue(labels, "incomplete");
            var yesLabel = this.getDictionaryValue(labels, "yes");
            var noLabel = this.getDictionaryValue(labels, "no");
            var passLabel = this.getDictionaryValue(labels, "pass");
            var failLabel = this.getDictionaryValue(labels, "fail");
            var notApplicableLabel = this.getDictionaryValue(labels, "notApplicable");
            var dashesLabel = this.getDictionaryValue(labels, "dashes");
            var operatingUnitsMLabel = this.getDictionaryValue(labels, "operatingUnitsM");
            var operatingUnitsRLabel = this.getDictionaryValue(labels, "operatingUnitsR");
            var operatingUnitsKLabel = this.getDictionaryValue(labels, "operatingUnitsK");
            vm.id = certificateApplianceBusinessModel.id;
            vm.location = certificateApplianceBusinessModel.location ? certificateApplianceBusinessModel.location : incompleteLabel;
            vm.type = certificateApplianceBusinessModel.type ? certificateApplianceBusinessModel.type : incompleteLabel;
            vm.flueType = certificateApplianceBusinessModel.flueType ? certificateApplianceBusinessModel.flueType : incompleteLabel;
            vm.make = certificateApplianceBusinessModel.make ? certificateApplianceBusinessModel.make : incompleteLabel;
            vm.model = certificateApplianceBusinessModel.model ? certificateApplianceBusinessModel.model : incompleteLabel;
            if (certificateApplianceBusinessModel.requestedToTest === undefined) {
                vm.requestedToTest = incompleteLabel;
            }
            else {
                vm.requestedToTest = certificateApplianceBusinessModel.requestedToTest === true
                    ? yesLabel
                    : noLabel;
            }
            if (certificateApplianceBusinessModel.unableToTest === undefined) {
                vm.unableToTest = incompleteLabel;
            }
            else {
                vm.unableToTest = certificateApplianceBusinessModel.unableToTest === true
                    ? yesLabel
                    : dashesLabel;
            }
            if (certificateApplianceBusinessModel.unableToTest === true || certificateApplianceBusinessModel.requestedToTest === false) {
                vm.applianceSafe = notApplicableLabel;
                vm.operatingValue = notApplicableLabel;
                vm.operatingValueUnits = "";
            }
            else {
                if (certificateApplianceBusinessModel.applianceSafe === undefined) {
                    vm.applianceSafe = incompleteLabel;
                }
                else {
                    vm.applianceSafe = certificateApplianceBusinessModel.applianceSafe === true
                        ? yesLabel
                        : noLabel;
                }
                if (certificateApplianceBusinessModel.operatingValue === undefined || certificateApplianceBusinessModel.operatingValue === null) {
                    vm.operatingValue = incompleteLabel;
                    vm.operatingValueUnits = "";
                }
                else {
                    vm.operatingValue = certificateApplianceBusinessModel.operatingValue.toString(10);
                    switch (certificateApplianceBusinessModel.operatingValueUnits) {
                        case operatingValueUnits_1.OperatingValueUnits.K:
                            vm.operatingValueUnits = operatingUnitsKLabel;
                            break;
                        case operatingValueUnits_1.OperatingValueUnits.R:
                            vm.operatingValueUnits = operatingUnitsRLabel;
                            break;
                        case operatingValueUnits_1.OperatingValueUnits.M:
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
            }
            else {
                switch (certificateApplianceBusinessModel.safetyDeviceCorrectOperation) {
                    case yesNoNa_1.YesNoNa.Yes:
                        vm.safetyDeviceCorrectOperation = yesLabel;
                        break;
                    case yesNoNa_1.YesNoNa.No:
                        vm.safetyDeviceCorrectOperation = noLabel;
                        break;
                    case yesNoNa_1.YesNoNa.Na:
                        vm.safetyDeviceCorrectOperation = notApplicableLabel;
                        break;
                    default:
                        vm.safetyDeviceCorrectOperation = incompleteLabel;
                        break;
                }
            }
            if (certificateApplianceBusinessModel.ventilationSatisfactory === undefined) {
                vm.ventilationSatisfactory = incompleteLabel;
            }
            else {
                switch (certificateApplianceBusinessModel.ventilationSatisfactory) {
                    case yesNoNa_1.YesNoNa.Yes:
                        vm.ventilationSatisfactory = yesLabel;
                        break;
                    case yesNoNa_1.YesNoNa.No:
                        vm.ventilationSatisfactory = noLabel;
                        break;
                    case yesNoNa_1.YesNoNa.Na:
                        vm.ventilationSatisfactory = notApplicableLabel;
                        break;
                    default:
                        vm.ventilationSatisfactory = incompleteLabel;
                        break;
                }
            }
            if (certificateApplianceBusinessModel.flueFlowTest === undefined) {
                vm.flueFlowTest = incompleteLabel;
            }
            else {
                switch (certificateApplianceBusinessModel.flueFlowTest) {
                    case yesNoNa_1.YesNoNa.Yes:
                        vm.flueFlowTest = passLabel;
                        break;
                    case yesNoNa_1.YesNoNa.No:
                        vm.flueFlowTest = failLabel;
                        break;
                    case yesNoNa_1.YesNoNa.Na:
                        vm.flueFlowTest = notApplicableLabel;
                        break;
                    default:
                        vm.flueFlowTest = incompleteLabel;
                        break;
                }
            }
            if (certificateApplianceBusinessModel.spillageTest === undefined) {
                vm.spillageTest = incompleteLabel;
            }
            else {
                switch (certificateApplianceBusinessModel.spillageTest) {
                    case yesNoNa_1.YesNoNa.Yes:
                        vm.spillageTest = passLabel;
                        break;
                    case yesNoNa_1.YesNoNa.No:
                        vm.spillageTest = failLabel;
                        break;
                    case yesNoNa_1.YesNoNa.Na:
                        vm.spillageTest = notApplicableLabel;
                        break;
                    default:
                        vm.spillageTest = incompleteLabel;
                        break;
                }
            }
            if (certificateApplianceBusinessModel.visualConditionOfFlueAndTerminationSatisfactory === undefined) {
                vm.visualConditionOfFlueAndTerminationSatisfactory = incompleteLabel;
            }
            else {
                switch (certificateApplianceBusinessModel.visualConditionOfFlueAndTerminationSatisfactory) {
                    case yesNoNa_1.YesNoNa.Yes:
                        vm.visualConditionOfFlueAndTerminationSatisfactory = yesLabel;
                        break;
                    case yesNoNa_1.YesNoNa.No:
                        vm.visualConditionOfFlueAndTerminationSatisfactory = noLabel;
                        break;
                    case yesNoNa_1.YesNoNa.Na:
                        vm.visualConditionOfFlueAndTerminationSatisfactory = notApplicableLabel;
                        break;
                    default:
                        vm.visualConditionOfFlueAndTerminationSatisfactory = incompleteLabel;
                        break;
                }
            }
            return vm;
        };
        LandlordFactory.prototype.createLandlordSafetyCertificateDefectViewModel = function (certificateDefectBusinessModel, labels) {
            var vm = new landlordSafetyCertificateDefectViewModel_1.LandlordSafetyCertificateDefectViewModel();
            var incompleteLabel = this.getDictionaryValue(labels, "incomplete");
            var yesLabel = this.getDictionaryValue(labels, "yes");
            var noLabel = this.getDictionaryValue(labels, "no");
            var notApplicableLabel = this.getDictionaryValue(labels, "notApplicable");
            if (certificateDefectBusinessModel.isNotApplicable) {
                vm.details = notApplicableLabel;
                vm.actionTaken = notApplicableLabel;
                vm.conditionOfAppliance = notApplicableLabel;
                vm.labelledAndWarningNoticeGiven = notApplicableLabel;
            }
            else {
                if (certificateDefectBusinessModel.details === undefined) {
                    vm.details = incompleteLabel;
                }
                else {
                    vm.details = certificateDefectBusinessModel.details;
                }
                if (certificateDefectBusinessModel.actionTaken === undefined) {
                    vm.actionTaken = incompleteLabel;
                }
                else {
                    vm.actionTaken = certificateDefectBusinessModel.actionTaken;
                }
                if (certificateDefectBusinessModel.labelledAndWarningNoticeGiven === undefined) {
                    vm.labelledAndWarningNoticeGiven = incompleteLabel;
                }
                else {
                    switch (certificateDefectBusinessModel.labelledAndWarningNoticeGiven) {
                        case yesNoNa_1.YesNoNa.Yes:
                            vm.labelledAndWarningNoticeGiven = yesLabel;
                            break;
                        case yesNoNa_1.YesNoNa.No:
                            vm.labelledAndWarningNoticeGiven = noLabel;
                            break;
                        case yesNoNa_1.YesNoNa.Na:
                            vm.labelledAndWarningNoticeGiven = notApplicableLabel;
                            break;
                        default:
                            vm.labelledAndWarningNoticeGiven = incompleteLabel;
                            break;
                    }
                }
                if (certificateDefectBusinessModel.conditionOfAppliance === undefined) {
                    vm.conditionOfAppliance = incompleteLabel;
                }
                else {
                    vm.conditionOfAppliance = certificateDefectBusinessModel.conditionOfAppliance;
                }
            }
            return vm;
        };
        LandlordFactory.prototype.getDictionaryValue = function (source, key) {
            if (!source || !(key in source)) {
                throw new businessException_1.BusinessException(this, "getDictionaryValue", "Unable to get dictionary value '{0}' in factory 'landlordFactory'", [key], null);
            }
            var value = source[key];
            return value;
        };
        return LandlordFactory;
    }());
    exports.LandlordFactory = LandlordFactory;
});

//# sourceMappingURL=landlordFactory.js.map
