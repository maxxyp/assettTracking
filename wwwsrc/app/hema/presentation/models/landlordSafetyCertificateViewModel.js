define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LandlordSafetyCertificateViewModel = /** @class */ (function () {
        function LandlordSafetyCertificateViewModel() {
        }
        LandlordSafetyCertificateViewModel.dummy = function () {
            var vm = new LandlordSafetyCertificateViewModel();
            vm.jobNumber = "1234";
            vm.engineerName = "Jane Smith";
            vm.date = new Date();
            vm.landlordAddress = ["Line 1", "Long Long Long Long Line 2", "Town", "POS TC0D"];
            vm.propertyAddress = ["Line 1", "Line 2", "Town", "POS TC0D"];
            vm.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = "Fail";
            vm.appliances = [
                {
                    location: "Kitchen",
                    type: "BBR",
                    make: "FOO",
                    model: "BAR",
                    flueType: "Flueless",
                    operatingValue: "12",
                    operatingValueUnits: "k",
                    safetyDeviceCorrectOperation: "NO",
                    ventilationSatisfactory: "YES",
                    flueFlowTest: "N/A",
                    spillageTest: "N/A",
                    visualConditionOfFlueAndTerminationSatisfactory: "YES",
                    applianceSafe: "NO",
                    requestedToTest: "YES",
                    unableToTest: "-"
                },
                {
                    make: "FOO2",
                    model: "BAR2"
                }
            ];
            vm.defects = [
                {
                    details: "Foo",
                    actionTaken: "Baz Baz Baz",
                    conditionOfAppliance: "Bar",
                    labelledAndWarningNoticeGiven: "Yes"
                },
                {
                    details: "Foo",
                    actionTaken: "Baz",
                    conditionOfAppliance: "Bar",
                    labelledAndWarningNoticeGiven: "Yes"
                }
            ];
            vm.instPremDefect = {
                details: "Foo",
                actionTaken: "Baz",
                conditionOfAppliance: "Bar",
                labelledAndWarningNoticeGiven: "Yes"
            };
            return vm;
        };
        return LandlordSafetyCertificateViewModel;
    }());
    exports.LandlordSafetyCertificateViewModel = LandlordSafetyCertificateViewModel;
});

//# sourceMappingURL=landlordSafetyCertificateViewModel.js.map
