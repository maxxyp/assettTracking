/// <reference path="../../../../../typings/app.d.ts" />

import { ReadingFactory } from "../../../../../app/hema/business/factories/readingFactory";
import { IReadingFactory } from "../../../../../app/hema/business/factories/interfaces/IReadingFactory";
import { Appliance } from "../../../../../app/hema/business/models/Appliance";
import { ApplianceSafety } from "../../../../../app/hema/business/models/applianceSafety";
import { ApplianceGasReadingMaster } from "../../../../../app/hema/business/models/applianceGasReadingMaster";
import { ApplianceGasReadings } from "../../../../../app/hema/business/models/applianceGasReadings";
import { IReading } from "../../../../../app/hema/api/models/fft/jobs/jobupdate/IReading";
import { ApplianceElectricalSafetyDetail } from "../../../../../app/hema/business/models/applianceElectricalSafetyDetail";
import { ICatalogService } from "../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IReadTypeMapping } from "../../../../../app/hema/business/models/reference/IReadTypeMapping";
import { IReadingType } from "../../../../../app/hema/business/models/reference/IReadingType";
import { ObjectHelper } from "../../../../../app/common/core/objectHelper";
import { ApplianceGasSafety } from "../../../../../app/hema/business/models/applianceGasSafety";
import { IPerformanceTestReason } from "../../../../../app/hema/business/models/reference/IPerformanceTestReason";

describe("the ReadingFactory module", () => {
    let readingFactory: IReadingFactory;
    let catalogServiceStub: ICatalogService;
    let readTypeLookup: IReadTypeMapping[];
    let performanceTestReasons: IPerformanceTestReason[];
    let readingTypes: IReadingType[];
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        readTypeLookup = <IReadTypeMapping[]>[
            {
                "group": "applianceGasReadingsMaster.preliminaryReadings",
                "id": "burnerPressure",
                "value": "BP"
            },
            {
                "group": "applianceGasReadingsMaster.preliminaryReadings",
                "id": "gasRateReading",
                "value": "G1"
            },
            {
                "group": "applianceGasReadingsMaster.preliminaryReadings",
                "id": "readingFirstRatio",
                "value": "TF"
            },
            {
                "group": "applianceGasReadingsMaster.preliminaryReadings",
                "id": "readingFirstCO",
                "value": "1F"
            },
            {
                "group": "applianceGasReadingsMaster.preliminaryReadings",
                "id": "readingFirstCO2",
                "value": "3F"
            },
            {
                "group": "applianceGasReadingsMaster.preliminaryReadings",
                "id": "readingMaxRatio",
                "value": "1R"
            },
            {
                "group": "applianceGasReadingsMaster.preliminaryReadings",
                "id": "readingMaxCO",
                "value": "1P"
            },
            {
                "group": "applianceGasReadingsMaster.preliminaryReadings",
                "id": "readingMaxCO2",
                "value": "3C"
            },
            {
                "group": "applianceGasReadingsMaster.preliminaryReadings",
                "id": "readingMinRatio",
                "value": "2R"
            },
            {
                "group": "applianceGasReadingsMaster.preliminaryReadings",
                "id": "readingMinCO",
                "value": "2P"
            },
            {
                "group": "applianceGasReadingsMaster.preliminaryReadings",
                "id": "readingMinCO2",
                "value": "4C"
            },
            {
                "group": "applianceGasReadingsMaster.preliminaryReadings",
                "id": "readingFinalRatio",
                "value": "TL"
            },
            {
                "group": "applianceGasReadingsMaster.preliminaryReadings",
                "id": "readingFinalCO",
                "value": "2F"
            },
            {
                "group": "applianceGasReadingsMaster.preliminaryReadings",
                "id": "readingFinalCO2",
                "value": "4F"
            },
            {
                "group": "applianceGasReadingsMaster.supplementaryReadings",
                "id": "burnerPressure",
                "value": "1S"
            },
            {
                "group": "applianceGasReadingsMaster.supplementaryReadings",
                "id": "gasRateReading",
                "value": "2S"
            },
            {
                "group": "applianceGasReadingsMaster.supplementaryReadings",
                "id": "readingFirstRatio",
                "value": "7C"
            },
            {
                "group": "applianceGasReadingsMaster.supplementaryReadings",
                "id": "readingFirstCO",
                "value": "8C"
            },
            {
                "group": "applianceGasReadingsMaster.supplementaryReadings",
                "id": "readingFirstCO2",
                "value": "9C"
            },
            {
                "group": "applianceGasReadingsMaster.supplementaryReadings",
                "id": "readingMaxRatio",
                "value": "3R"
            },
            {
                "group": "applianceGasReadingsMaster.supplementaryReadings",
                "id": "readingMaxCO",
                "value": "3P"
            },
            {
                "group": "applianceGasReadingsMaster.supplementaryReadings",
                "id": "readingMaxCO2",
                "value": "5C"
            },
            {
                "group": "applianceGasReadingsMaster.supplementaryReadings",
                "id": "readingMinRatio",
                "value": "4R"
            },
            {
                "group": "applianceGasReadingsMaster.supplementaryReadings",
                "id": "readingMinCO",
                "value": "4P"
            },
            {
                "group": "applianceGasReadingsMaster.supplementaryReadings",
                "id": "readingMinCO2",
                "value": "6C"
            },
            {
                "group": "applianceGasReadingsMaster.supplementaryReadings",
                "id": "readingFinalRatio",
                "value": "1D"
            },
            {
                "group": "applianceGasReadingsMaster.supplementaryReadings",
                "id": "readingFinalCO",
                "value": "2D"
            },
            {
                "group": "applianceGasReadingsMaster.supplementaryReadings",
                "id": "readingFinalCO2",
                "value": "3D"
            },
            {
                "group": "applianceElectricalSafetyDetail",
                "id": "mcbFuseRating",
                "value": "1M"
            },
            {
                "group": "applianceElectricalSafetyDetail",
                "id": "applianceFuseRating",
                "value": "2M"
            },
            {
                "group": "applianceElectricalSafetyDetail",
                "id": "applianceEarthContinuityReading",
                "value": "AE"
            },
            {
                "group": "applianceElectricalSafetyDetail",
                "id": "leInsulationResistance",
                "value": "IL"
            },
            {
                "group": "applianceElectricalSafetyDetail",
                "id": "neInsulationResistance",
                "value": "RN"
            },
            {
                "group": "applianceElectricalSafetyDetail",
                "id": "lnInsulationResistance",
                "value": "SL"
            },
            {
                "group": "applianceElectricalSafetyDetail",
                "id": "finalEliReading",
                "value": "EF"
            },
            {
                "group": "applianceElectricalSafetyDetail",
                "id": "rcdTripTimeReading",
                "value": "RT"
            },
            {
                "group": "applianceElectricalSafetyDetail",
                "id": "rcboTripTimeReading",
                "value": "RO"
            },
            {
                "group": "applianceElectricalSafetyDetail",
                "id": "microwaveLeakageReading",
                "value": "MW"
            }
        ];

        readingTypes = [
            "BP", "G1", "TF", "1F", "3F", "1R", "1P", "3C", "2R", "2P",
            "4C", "4F", "2F", "C2", "1S", "2S", "7C", "8C", "9C", "3R",
            "3P", "5C", "4R", "4P", "6C", "1D", "2D", "3D", "1M", "2M",
            "AE", "IL", "RN", "SL", "EF", "RT", "RO", "MW"
        ].map((readCode) => {
            return {
                "readingTypeCode": readCode,
                "readingHighRangeValue": 40,
                "readingLowRangeValue": 0,
                "readingTypeDescription": "something",
                "category": ""
            };
        });

        catalogServiceStub = <ICatalogService>{};
        catalogServiceStub.getReadTypeMappings = sandbox.stub().resolves(readTypeLookup);
        catalogServiceStub.getReadingTypes = sandbox.stub().resolves(readingTypes);
        catalogServiceStub.getPerformanceTestReasons = sandbox.stub().resolves(null);

        readingFactory = new ReadingFactory(catalogServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(readingFactory).toBeDefined();
    });

    describe("createReadingApiModels method", () => {
        // this assures the readType in the business rules references a valid readType in the reference data.
        // if the code in the business rules doesn't match a reference data value we don't generate a read.
        it("should only map read types defined in `readType` reference data", (done) => {
            let appliance = <Appliance>{};
            appliance.isCentralHeatingAppliance = true;
            appliance.safety = <ApplianceSafety>{};
            appliance.safety.applianceGasReadingsMaster = <ApplianceGasReadingMaster>{};

            appliance.safety.applianceGasReadingsMaster.preliminaryReadings = <ApplianceGasReadings>{
                burnerPressure: 0
            };

            readTypeLookup = <IReadTypeMapping[]>[
                {
                    "group": "applianceGasReadingsMaster.preliminaryReadings",
                    "id": "burnerPressure",
                    "value": "BP"
                }
            ];

            catalogServiceStub = <ICatalogService>{};
            catalogServiceStub.getReadTypeMappings = sandbox.stub().resolves(readTypeLookup);
            catalogServiceStub.getReadingTypes = sandbox.stub().resolves([]);
            catalogServiceStub.getPerformanceTestReasons = sandbox.stub().resolves(null);

            readingFactory = new ReadingFactory(catalogServiceStub);

            readingFactory.createReadingApiModels(appliance)
                .then((readings) => expect(readings.length).toEqual(0))
                .then(() => done());

        });

        it("can map applianceGasReadingsMaster preliminary readings to readTypes", (done) => {
            let appliance = <Appliance>{};
            appliance.isCentralHeatingAppliance = true;
            appliance.safety = <ApplianceSafety>{};
            appliance.safety.applianceGasReadingsMaster = <ApplianceGasReadingMaster>{};

            appliance.safety.applianceGasReadingsMaster.preliminaryReadings = <ApplianceGasReadings>{
                burnerPressure: 0,
                gasRateReading: 1,
                readingFirstRatio: 2,
                readingFirstCO: 3,
                readingFirstCO2: 4,
                readingMaxRatio: 5,
                readingMaxCO: 6,
                readingMaxCO2: 7,
                readingMinRatio: 8,
                readingMinCO: 9,
                readingMinCO2: 10,
                readingFinalRatio: 11,
                readingFinalCO: 12,
                readingFinalCO2: 13
            };

            readingFactory.createReadingApiModels(appliance)
                .then((readings) => assertReadings(appliance.safety, readings, "applianceGasReadingsMaster", "preliminaryReadings"))
                .then(() => done());
        });

        it("can map applianceGasReadingsMaster supplementaryReadings readings to readTypes", (done) => {
            let appliance = <Appliance>{};
            appliance.isCentralHeatingAppliance = true;
            appliance.safety = <ApplianceSafety>{};
            appliance.safety.applianceGasReadingsMaster = <ApplianceGasReadingMaster>{};

            appliance.safety.applianceGasReadingsMaster.supplementaryReadings = <ApplianceGasReadings>{
                burnerPressure: 0,
                gasRateReading: 1,
                readingFirstRatio: 2,
                readingFirstCO: 3,
                readingFirstCO2: 4,
                readingMaxRatio: 5,
                readingMaxCO: 6,
                readingMaxCO2: 7,
                readingMinRatio: 8,
                readingMinCO: 9,
                readingMinCO2: 10,
                readingFinalRatio: 11,
                readingFinalCO: 12,
                readingFinalCO2: 13
            };

            readingFactory.createReadingApiModels(appliance)
                .then((readings) => {
                    expect(readings.length).toEqual(14);
                    return readings;
                })
                .then((readings) => assertReadings(appliance.safety, readings, "applianceGasReadingsMaster", "supplementaryReadings"))
                .then(() => done());
        });

        it("can map applianceElectricalSafetyDetail readings to readTypes", (done) => {
            let appliance = <Appliance>{};
            appliance.isCentralHeatingAppliance = true;
            appliance.safety = <ApplianceSafety>{};
            appliance.safety.applianceGasReadingsMaster = <ApplianceGasReadingMaster>{};

            appliance.safety.applianceElectricalSafetyDetail = <ApplianceElectricalSafetyDetail>{
                showMcbFuseRatingReasonWhyNot: true,
                mcbFuseRating: "0",
                applianceFuseRating: "1",
                applianceEarthContinuityReading: 2,
                leInsulationResistance: 3,
                neInsulationResistance: 4,
                lnInsulationResistance: 5,
                finalEliReading: 6,
                rcdTripTimeReading: 7,
                rcboTripTimeReading: 8,
                microwaveLeakageReading: 9,
                electricalApplianceType: "",
                mainEarthChecked: "",
                gasBondingChecked: "",
                waterBondingChecked: "",
                otherBondingChecked: "",
                supplementaryBondingOrFullRcdProtectionChecked: "",
                ringContinuityReadingDone: "",
                showLeInsulationResistanceReasonWhyNot: true,
                leInsulationResistanceReasonWhyNot: "",
                showNeInsulationResistanceReasonWhyNot: true,
                neInsulationResistanceReasonWhyNot: "",
                showLnInsulationResistanceReasonWhyNot: true,
                lnInsulationResistanceReasonWhyNot: "",
                systemType: "",
                circuitRcdRcboProtected: "",
                finalEliReadingDone: true,
                readingSafeAccordingToTops: true,
                mcbFuseRatingReasonWhyNot: undefined,
                applianceFuseRatingReasonWhyNot: undefined,
                microwaveLeakageReadingReasonWhyNot: undefined,
                isRcdPresent: false,
                applianceEarthContinuityReadingDone: true,
                isApplianceHardWired: false
            };

            readingFactory.createReadingApiModels(appliance)
                .then((readings) => {
                    expect(readings.length).toEqual(10);
                    return readings;
                })
                .then((readings) => assertReadings(appliance.safety, readings, "applianceElectricalSafetyDetail"))
                .then(() => done());
        });

    });

    describe("populatePerformanceTestNotDoneReason method", () => {

        it("should set to rdingHightRangeVal from reference data", (done) => {
            let appliance = <Appliance>{};
            appliance.isCentralHeatingAppliance = true;
            appliance.safety = <ApplianceSafety>{};
            appliance.safety.applianceGasReadingsMaster = <ApplianceGasReadingMaster>{};

            appliance.safety.applianceGasReadingsMaster.preliminaryReadings = <ApplianceGasReadings>{
                burnerPressure: 0
            };

            appliance.safety.applianceGasSafety = <ApplianceGasSafety>{};
            appliance.safety.applianceGasSafety.performanceTestsNotDoneReason = "TN";
            readTypeLookup = <IReadTypeMapping[]>[
                {
                    "group": "applianceGasReadingsMaster.preliminaryReadings",
                    "id": "burnerPressure",
                    "value": "BP"
                }
            ];
            readingTypes = [
                "IA", "NC", "NO", "PI", "TN"
            ].map((readCode) => {
                return {
                    "readingTypeCode": readCode,
                    "readingHighRangeValue": 1,
                    "readingLowRangeValue": 0,
                    "readingTypeDescription": "something",
                    "category": ""
                };
            });

            performanceTestReasons = <IPerformanceTestReason[]>[{
                "key": "101",
                "id": "TN",
                "description": "something",
                "ctlgEntDelnMkr": "N",
            }];

            catalogServiceStub = <ICatalogService>{};
            catalogServiceStub.getReadTypeMappings = sandbox.stub().resolves(readTypeLookup);
            catalogServiceStub.getReadingTypes = sandbox.stub().resolves(readingTypes);
            catalogServiceStub.getPerformanceTestReasons = sandbox.stub().resolves(performanceTestReasons);

            readingFactory = new ReadingFactory(catalogServiceStub);

            readingFactory.createReadingApiModels(appliance)
                .then((readings: IReading[]) => {
                    expect(readings.length).toEqual(1);
                    expect(readings[0].type === "TN").toBeTruthy();
                    expect(readings[0].value).toEqual("1");
                })
                .then(() => done());

        });

        it("should reverse reading types if not CH appliance", (done) => {
            let appliance = <Appliance>{};
            appliance.isCentralHeatingAppliance = false;
            appliance.safety = <ApplianceSafety>{};
            appliance.safety.applianceGasReadingsMaster = <ApplianceGasReadingMaster>{};

            appliance.safety.applianceGasReadingsMaster.preliminaryReadings = <ApplianceGasReadings>{
                burnerPressure: 0
            };

            appliance.safety.applianceGasSafety = <ApplianceGasSafety>{};
            appliance.safety.applianceGasSafety.performanceTestsNotDoneReason = "TN";
            readTypeLookup = <IReadTypeMapping[]>[
                {
                    "group": "applianceGasReadingsMaster.preliminaryReadings",
                    "id": "burnerPressure",
                    "value": "BP"
                }
            ];
            readingTypes = [
                "IA", "NC", "NO", "PI", "TN"
            ].map((readCode) => {
                return {
                    "readingTypeCode": readCode,
                    "readingHighRangeValue": 1,
                    "readingLowRangeValue": 0,
                    "readingTypeDescription": "something",
                    "category": ""
                };
            });

            performanceTestReasons = <IPerformanceTestReason[]>[{
                "key": "101",
                "id": "TN",
                "description": "something",
                "ctlgEntDelnMkr": "N",
            }];

            catalogServiceStub = <ICatalogService>{};
            catalogServiceStub.getReadTypeMappings = sandbox.stub().resolves(readTypeLookup);
            catalogServiceStub.getReadingTypes = sandbox.stub().resolves(readingTypes);
            catalogServiceStub.getPerformanceTestReasons = sandbox.stub().resolves(performanceTestReasons);

            readingFactory = new ReadingFactory(catalogServiceStub);

            readingFactory.createReadingApiModels(appliance)
                .then((readings: IReading[]) => {
                    expect(readings.length).toEqual(1);
                    expect(readings[0].type === "NT").toBeTruthy();
                    expect(readings[0].value).toEqual("1");
                })
                .then(() => done());

        });

        it("should not set reading data if performanceTestsNotDoneReason not present", (done) => {
            let appliance = <Appliance>{};
            appliance.isCentralHeatingAppliance = true;
            appliance.safety = <ApplianceSafety>{};
            appliance.safety.applianceGasReadingsMaster = <ApplianceGasReadingMaster>{};

            appliance.safety.applianceGasReadingsMaster.preliminaryReadings = <ApplianceGasReadings>{
                burnerPressure: 0
            };

            readTypeLookup = <IReadTypeMapping[]>[
                {
                    "group": "applianceGasReadingsMaster.preliminaryReadings",
                    "id": "burnerPressure",
                    "value": "BP"
                }
            ];

            catalogServiceStub = <ICatalogService>{};
            catalogServiceStub.getReadTypeMappings = sandbox.stub().resolves(readTypeLookup);
            catalogServiceStub.getReadingTypes = sandbox.stub().resolves([]);
            catalogServiceStub.getPerformanceTestReasons = sandbox.stub().resolves(null);

            readingFactory = new ReadingFactory(catalogServiceStub);

            readingFactory.createReadingApiModels(appliance)
                .then((readings: IReading[]) => {
                    expect(readings.length).toEqual(0);
                })
                .then(() => done());

        });

        it("should create readings model if performance test not done for supplementary burner", (done) => {
            let appliance = <Appliance>{};
            appliance.isCentralHeatingAppliance = true;
            appliance.safety = <ApplianceSafety>{};
            appliance.safety.applianceGasReadingsMaster = <ApplianceGasReadingMaster>{};

            appliance.safety.applianceGasReadingsMaster.preliminaryReadings = <ApplianceGasReadings>{
                burnerPressure: 0
            };

            appliance.safety.applianceGasReadingsMaster.supplementaryReadings = <ApplianceGasReadings>{
                burnerPressure: 0
            };

            appliance.safety.applianceGasSafety = <ApplianceGasSafety>{};
            appliance.safety.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary = "TN";
            readTypeLookup = <IReadTypeMapping[]>[
                {
                    "group": "applianceGasReadingsMaster.preliminaryReadings",
                    "id": "burnerPressure",
                    "value": "BP"
                },
                {
                    "group": "applianceGasReadingsMaster.supplementaryReadings",
                    "id": "burnerPressure",
                    "value": "1S",
                }
            ];
            readingTypes = [
                "IA", "NC", "NO", "PI", "TN"
            ].map((readCode) => {
                return {
                    "readingTypeCode": readCode,
                    "readingHighRangeValue": 1,
                    "readingLowRangeValue": 0,
                    "readingTypeDescription": "something",
                    "category": ""
                };
            });

            performanceTestReasons = <IPerformanceTestReason[]>[{
                "key": "101",
                "id": "TN",
                "description": "something",
                "ctlgEntDelnMkr": "N",
            }];

            catalogServiceStub = <ICatalogService>{};
            catalogServiceStub.getReadTypeMappings = sandbox.stub().resolves(readTypeLookup);
            catalogServiceStub.getReadingTypes = sandbox.stub().resolves(readingTypes);
            catalogServiceStub.getPerformanceTestReasons = sandbox.stub().resolves(performanceTestReasons);

            readingFactory = new ReadingFactory(catalogServiceStub);

            readingFactory.createReadingApiModels(appliance)
                .then((readings: IReading[]) => {
                    expect(readings.length).toEqual(1);
                    expect(readings[0].type === "TN").toBeTruthy();
                    expect(readings[0].value).toEqual("1");
                    done();
                });        

        });

    });

    function assertReadings(safety: ApplianceSafety, readings: IReading[], readingTypeName: string, readingSubTypeName?: string): void {
        let mappings: IReadTypeMapping[];
        let groupName = readingSubTypeName ? readingTypeName + "." + readingSubTypeName : readingTypeName;

        mappings = readTypeLookup.filter(rtm => rtm.group === groupName);

        let safetyObjectSection = ObjectHelper.getPathValue(safety, groupName);

        readings.forEach((reading) => {
            let readingPropertyName: string = "";
            let readType: string = "";
            mappings.forEach(mapping => {
                if (mapping.value === reading.type) {
                    readingPropertyName = mapping.id;
                    readType = mapping.value;
                }
            });

            let readValue = safetyObjectSection[readingPropertyName];

            expect(reading.type).toEqual(readType);
            expect(reading.value).toEqual(readValue);
        });
    }
});
