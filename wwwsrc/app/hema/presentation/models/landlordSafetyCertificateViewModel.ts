import {LandlordSafetyCertificateDefectViewModel} from "./LandlordSafetyCertificateDefectViewModel";
import {LandlordSafetyCertificateApplianceViewModel} from "./LandlordSafetyCertificateApplianceViewModel";

export class LandlordSafetyCertificateViewModel {
    public jobNumber: string;
    public date: Date;

    public engineerName: string;
    public engineerId: string;

    public landlordName: string;
    public landlordAddress: string[];
    public propertyAddress: string[];
    public applianceCount: number;
    public appliances: LandlordSafetyCertificateApplianceViewModel[];
    public defects: LandlordSafetyCertificateDefectViewModel[];
    public instPremDefect: LandlordSafetyCertificateDefectViewModel;
    public gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass: string;

    public static dummy() : LandlordSafetyCertificateViewModel {
        let vm = new LandlordSafetyCertificateViewModel();
        vm.jobNumber = "1234";
        vm.engineerName = "Jane Smith";

        vm.date = new Date();
        vm.landlordAddress = ["Line 1", "Long Long Long Long Line 2", "Town", "POS TC0D"];
        vm.propertyAddress = ["Line 1", "Line 2", "Town", "POS TC0D"];

        vm.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass = "Fail";

        vm.appliances = [
            <LandlordSafetyCertificateApplianceViewModel>{
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
            <LandlordSafetyCertificateApplianceViewModel>{
                make: "FOO2",
                model: "BAR2"
            }
        ];
        vm.defects = [
            <LandlordSafetyCertificateDefectViewModel>{
                details: "Foo",
                actionTaken: "Baz Baz Baz",
                conditionOfAppliance: "Bar",
                labelledAndWarningNoticeGiven: "Yes"
            },
            <LandlordSafetyCertificateDefectViewModel>{
                details: "Foo",
                actionTaken: "Baz",
                conditionOfAppliance: "Bar",
                labelledAndWarningNoticeGiven: "Yes"
            }
        ];

        vm.instPremDefect = <LandlordSafetyCertificateDefectViewModel>{
            details: "Foo",
            actionTaken: "Baz",
            conditionOfAppliance: "Bar",
            labelledAndWarningNoticeGiven: "Yes"
        };
        return vm;
    }
}
