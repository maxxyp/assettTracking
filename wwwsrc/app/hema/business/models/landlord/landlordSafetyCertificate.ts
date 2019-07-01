
import {LandlordSafetyCertificateAppliance} from "./landlordSafetyCertificateAppliance";
import {LandlordSafetyCertificateDefect} from "./landlordSafetyCertificateDefect";
import {YesNoNa} from "../yesNoNa";
import {OperatingValueUnits} from "./operatingValueUnits";
import {LandlordSafetyCertificateResult} from "./landlordSafetyCertificateResult";

export class LandlordSafetyCertificate {
    public jobNumber: string;
    public date: Date;

    public engineerName: string;
    public engineerId: string;

    public landlordName: string;
    public landlordAddress: string[];
    public propertyAddress: string[];
    public applianceCount: number;
    public appliances: LandlordSafetyCertificateAppliance[];
    public defects: LandlordSafetyCertificateDefect[];
    public certificateResult: LandlordSafetyCertificateResult;

    public static dummy() : LandlordSafetyCertificate {
        let model = new LandlordSafetyCertificate();
        model.jobNumber = "1234";
        model.engineerName = "Jane Smith";

        model.date = new Date();
        model.landlordAddress = ["Line 1", "Long Long Long Long Line 2", "Town", "POS TC0D"];
        model.propertyAddress = ["Line 1", "Line 2", "Town", "POS TC0D"];

        model.appliances = [
            <LandlordSafetyCertificateAppliance>{
                location: "Kitchen",
                type: "BBR",
                make: "FOO",
                model: "BAR",

                flueType: "Flueless",
                operatingValue: 12,
                operatingValueUnits: OperatingValueUnits.K,
                safetyDeviceCorrectOperation: YesNoNa.No,
                ventilationSatisfactory: YesNoNa.Yes,
                flueFlowTest: YesNoNa.Na,
                spillageTest: YesNoNa.Na,
                visualConditionOfFlueAndTerminationSatisfactory: YesNoNa.Yes,
                applianceSafe: false,
                requestedToTest: true,
                unableToTest: undefined
            },
            <LandlordSafetyCertificateAppliance>{
                make: "FOO2",
                model: "BAR2"
            }
        ];
        model.defects = [
            <LandlordSafetyCertificateDefect>{
                details: "Foo",
                actionTaken: "Baz Baz Baz",
                conditionOfAppliance: "Bar",
                labelledAndWarningNoticeGiven: YesNoNa.Yes
            },
            <LandlordSafetyCertificateDefect>{
                details: "Foo",
                actionTaken: "Baz",
                conditionOfAppliance: "Bar",
                labelledAndWarningNoticeGiven: YesNoNa.Yes
            }
        ];

        model.certificateResult = <LandlordSafetyCertificateResult> {
            gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass: YesNoNa.No,
            propertySafetyDefect: <LandlordSafetyCertificateDefect> {
                details: "Foo",
                actionTaken: "Baz",
                conditionOfAppliance: "Bar",
                labelledAndWarningNoticeGiven: YesNoNa.Yes
            }
        };
        return model;
    }

}
