define(["require", "exports", "../yesNoNa", "./operatingValueUnits"], function (require, exports, yesNoNa_1, operatingValueUnits_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LandlordSafetyCertificate = /** @class */ (function () {
        function LandlordSafetyCertificate() {
        }
        LandlordSafetyCertificate.dummy = function () {
            var model = new LandlordSafetyCertificate();
            model.jobNumber = "1234";
            model.engineerName = "Jane Smith";
            model.date = new Date();
            model.landlordAddress = ["Line 1", "Long Long Long Long Line 2", "Town", "POS TC0D"];
            model.propertyAddress = ["Line 1", "Line 2", "Town", "POS TC0D"];
            model.appliances = [
                {
                    location: "Kitchen",
                    type: "BBR",
                    make: "FOO",
                    model: "BAR",
                    flueType: "Flueless",
                    operatingValue: 12,
                    operatingValueUnits: operatingValueUnits_1.OperatingValueUnits.K,
                    safetyDeviceCorrectOperation: yesNoNa_1.YesNoNa.No,
                    ventilationSatisfactory: yesNoNa_1.YesNoNa.Yes,
                    flueFlowTest: yesNoNa_1.YesNoNa.Na,
                    spillageTest: yesNoNa_1.YesNoNa.Na,
                    visualConditionOfFlueAndTerminationSatisfactory: yesNoNa_1.YesNoNa.Yes,
                    applianceSafe: false,
                    requestedToTest: true,
                    unableToTest: undefined
                },
                {
                    make: "FOO2",
                    model: "BAR2"
                }
            ];
            model.defects = [
                {
                    details: "Foo",
                    actionTaken: "Baz Baz Baz",
                    conditionOfAppliance: "Bar",
                    labelledAndWarningNoticeGiven: yesNoNa_1.YesNoNa.Yes
                },
                {
                    details: "Foo",
                    actionTaken: "Baz",
                    conditionOfAppliance: "Bar",
                    labelledAndWarningNoticeGiven: yesNoNa_1.YesNoNa.Yes
                }
            ];
            model.certificateResult = {
                gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass: yesNoNa_1.YesNoNa.No,
                propertySafetyDefect: {
                    details: "Foo",
                    actionTaken: "Baz",
                    conditionOfAppliance: "Bar",
                    labelledAndWarningNoticeGiven: yesNoNa_1.YesNoNa.Yes
                }
            };
            return model;
        };
        return LandlordSafetyCertificate;
    }());
    exports.LandlordSafetyCertificate = LandlordSafetyCertificate;
});

//# sourceMappingURL=landlordSafetyCertificate.js.map
