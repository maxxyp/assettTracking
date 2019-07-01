/// <reference path="../../../../../typings/app.d.ts" />

import { ApplianceFactory } from "../../../../../app/hema/business/factories/applianceFactory";

import { IAppliance as ApplianceApiModel } from "../../../../../app/hema/api/models/fft/jobs/history/IAppliance";
import { ApplianceSafety } from "../../../../../app/hema/business/models/applianceSafety";
import { Job } from "../../../../../app/hema/business/models/job";
import { Appliance } from "../../../../../app/hema/business/models/appliance";
import { LandlordSafetyCertificateAppliance } from "../../../../../app/hema/business/models/landlord/landlordSafetyCertificateAppliance";
import { LandlordSafetyCertificateDefect } from "../../../../../app/hema/business/models/landlord/LandlordSafetyCertificateDefect";
import { YesNoNa } from "../../../../../app/hema/business/models/yesNoNa";
import { IApplianceSafetyFactory } from "../../../../../app/hema/business/factories/interfaces/IApplianceSafetyFactory";
import { IReadingFactory } from "../../../../../app/hema/business/factories/interfaces/IReadingFactory";
import { IBusinessRuleService } from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ILandlordFactory } from "../../../../../app/hema/business/factories/interfaces/ILandlordFactory";
import { ICatalogService } from "../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IObjectType } from "../../../../../app/hema/business/models/reference/IObjectType";
import { IDataStateManager } from "../../../../../app/hema/common/IDataStateManager";

describe("the ApplianceFactory module", () => {
    let applianceFactory: ApplianceFactory;
    let applianceSafetyFactoryStub: IApplianceSafetyFactory;
    let readingFactoryStub: IReadingFactory;
    let landlordFactoryStub: ILandlordFactory;
    let businessRuleServiceStub: IBusinessRuleService;
    let sandbox: Sinon.SinonSandbox;
    let catalogServiceStub: ICatalogService;
    let applianceSafety: ApplianceSafety;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        applianceSafetyFactoryStub = <IApplianceSafetyFactory>{};

        applianceSafety = <ApplianceSafety>{
            applianceElectricalSafetyDetail: {},
            applianceGasSafety: {},
            applianceOtherSafety: {}
        };

        applianceSafetyFactoryStub.populatePreviousApplianceSafety = sandbox.stub().returns(applianceSafety);
        readingFactoryStub = <IReadingFactory>{};
        landlordFactoryStub = <ILandlordFactory>{};
        businessRuleServiceStub = <IBusinessRuleService>{};
        catalogServiceStub = <ICatalogService>{};

        catalogServiceStub.getObjectType = sandbox.stub().resolves(<IObjectType>{
            applianceCategory: "Gas"
        });

        catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
            applianceType: "Gas"
        }]);
        catalogServiceStub.getSafetyActions = sandbox.stub().resolves([]);

        let getBusinessRuleStub = sandbox.stub().returns("");
        getBusinessRuleStub.withArgs("centralHeatingApplianceHardwareCategory").returns("X");
        getBusinessRuleStub.withArgs("applianceTypesToUseEngineerPatchInsteadToCalculateSafetyType").returns("X");
        getBusinessRuleStub.withArgs("applianceCategoryOther").returns("X");
        getBusinessRuleStub.withArgs("applianceCategoryElectrical").returns("X");
        getBusinessRuleStub.withArgs("applianceCategoryGas").returns("Gas");
        getBusinessRuleStub.withArgs("electricalWorkingSector").returns("X");
        getBusinessRuleStub.withArgs("hardWareCatForCHAppliance").returns("X");
        getBusinessRuleStub.withArgs("instPremApplianceType").returns("X");
        getBusinessRuleStub.withArgs("instPremApplianceContractType").returns("INSTPREM");

        let getBusinessRuleListStub = sandbox.stub();
        getBusinessRuleListStub.withArgs("notDoingTaskStatuses").returns(["X"]);

        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves({
            getBusinessRule: getBusinessRuleStub,
            getBusinessRuleList: getBusinessRuleListStub
        });

        let dataStateManagerStub = <IDataStateManager>{
            updateApplianceDataState: sandbox.stub().resolves(null),
            updateAppliancesDataState: sandbox.stub().resolves(null),
            updatePropertySafetyDataState: sandbox.stub()
        };
        applianceFactory = new ApplianceFactory(applianceSafetyFactoryStub, readingFactoryStub, landlordFactoryStub, businessRuleServiceStub, catalogServiceStub, dataStateManagerStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(applianceFactory).toBeDefined();
    });

    describe("createApplianceBusinessModel maps bgInstallationIndicator", () => {
        let appliance: ApplianceApiModel;
        let job: Job;
        let engineerWorkingSector: string;

        beforeEach(() => {
            appliance = <ApplianceApiModel>{
                applianceType: "Gas"
            };
            job = <Job>{};
            engineerWorkingSector = "";
        })

        it("will map bgInstallationIndicator to 'true' when api model is '1'", (done) => {
            appliance.bgInstallationIndicator = "1";

            applianceFactory.createApplianceBusinessModel(appliance, job, engineerWorkingSector)
                .then(res => {
                    expect(res.bgInstallationIndicator).toEqual(true);
                    done();
                });
        });

        it("will map bgInstallationIndicator 'false', when api model '0'", (done) => {
            appliance.bgInstallationIndicator = "0";

            applianceFactory.createApplianceBusinessModel(appliance, job, engineerWorkingSector)
                .then(res => {
                    expect(res.bgInstallationIndicator).toEqual(false);
                    done();
                });
        });

        it("will map bgInstallationIndicator undefined, when api model is not '0' or '1'", (done) => {
            appliance.bgInstallationIndicator = "A";

            applianceFactory.createApplianceBusinessModel(appliance, job, engineerWorkingSector)
                .then(res => {
                    expect(res.bgInstallationIndicator).toBeUndefined();
                    done();
                });
        });
    });

    describe("createApplianceBusinessModel", () => {
        let appliance: ApplianceApiModel;
        let job: Job;
        let engineerWorkingSector: string;

        beforeEach(() => {
            job = <Job>{};
            engineerWorkingSector = "";
        })

        it("excludes appliance not in reference data", (done) => {
            appliance = <ApplianceApiModel>{
                applianceType: "X"
            };
            applianceFactory.createApplianceBusinessModel(appliance, job, engineerWorkingSector)
                .then(res => {
                    expect(res).toBeUndefined();
                    done();
                });
        });

        it("inclues appliance that is in reference data", (done) => {
            appliance = <ApplianceApiModel>{
                applianceType: "Gas"
            };
            applianceFactory.createApplianceBusinessModel(appliance, job, engineerWorkingSector)
                .then(res => {
                    expect(res).toBeDefined();
                    done();
                });
        });
    });

    describe("createApplianceBusinessModel", () => {

        // it("can create business model", done => {
        //     applianceFactory.createApplianceBusinessModel(applianceApiModel, true, true)
        //         .then(applianceBusinessModel => {
        //             expect(applianceBusinessModel).toBeDefined();
        //             done();
        //         });

        // });

        // it("can map the whole thing", done => {
        //     applianceApiModel.id = "a";
        //     applianceApiModel.serialId = "b";
        //     applianceApiModel.gcCode = "c";
        //     applianceApiModel.bgInstallationIndicator = true;
        //     applianceApiModel.category = "d";
        //     applianceApiModel.contractType = "e";
        //     applianceApiModel.contractExpiryDate = new Date(2000, 1, 1).toISOString();
        //     applianceApiModel.applianceType = "f";
        //     applianceApiModel.description = "g";
        //     applianceApiModel.flueType = "h";
        //     applianceApiModel.cylinderType = 1;
        //     applianceApiModel.energyControl = "i";
        //     applianceApiModel.locationDescription = "j";
        //     applianceApiModel.condition = 2;
        //     applianceApiModel.numberOfRadiators = 3;
        //     applianceApiModel.numberOfSpecialRadiators = 4;
        //     applianceApiModel.installationYear = 5;
        //     applianceApiModel.systemDesignCondition = 7;
        //     applianceApiModel.systemType = 8;
        //     applianceApiModel.notes = "k";
        //     applianceApiModel.boilerSize = 9;
        //     applianceApiModel.safety = <ApplianceSafetyApiModel>{};
        //     applianceApiModel.safety.actionCode = "actionCode";
        //     applianceApiModel.safety.applianceSafe = true;
        //     applianceApiModel.safety.date = null;
        //     applianceApiModel.safety.flueSafe = true;
        //     applianceApiModel.safety.installationSafe = true;
        //     applianceApiModel.safety.installationTightnessTestSafe = true;
        //     applianceApiModel.safety.noticeStatus = "noticeStatus";
        //     applianceApiModel.safety.noticeType = "noticeType";
        //     applianceApiModel.safety.progress = "progress";
        //     applianceApiModel.safety.report = "report";
        //     applianceApiModel.safety.ventilationSafe = true;

        //     applianceFactory.createApplianceBusinessModel(applianceApiModel, true, true)
        //         .then((applianceBusinessModel) => {
        //             expect(applianceBusinessModel.id).toBe("a");
        //             expect(applianceBusinessModel.serialId).toBe("b");
        //             expect(applianceBusinessModel.gcCode).toBe("c");
        //             expect(applianceBusinessModel.bgInstallationIndicator).toBe(true);
        //             expect(applianceBusinessModel.category).toBe("d");
        //             expect(applianceBusinessModel.contractType).toBe("e");
        //             expect(applianceBusinessModel.contractExpiryDate).toEqual(new Date(2000, 1, 1));
        //             expect(applianceBusinessModel.applianceType).toBe("f");
        //             expect(applianceBusinessModel.description).toBe("g");
        //             expect(applianceBusinessModel.flueType).toBe("h");
        //             expect(applianceBusinessModel.cylinderType).toBe("1");
        //             expect(applianceBusinessModel.energyControl).toBe("i");
        //             expect(applianceBusinessModel.locationDescription).toBe("j");
        //             expect(applianceBusinessModel.condition).toBe("2");
        //             expect(applianceBusinessModel.numberOfRadiators).toBe(3);
        //             expect(applianceBusinessModel.numberOfSpecialRadiators).toBe(4);
        //             expect(applianceBusinessModel.installationYear).toBe(5);
        //             expect(applianceBusinessModel.systemDesignCondition).toBe("7");
        //             expect(applianceBusinessModel.systemType).toBe("8");
        //             expect(applianceBusinessModel.notes).toBe("k");
        //             expect(applianceBusinessModel.boilerSize).toBe(9);

        //             // todo gas, electrical safety

        //             expect(applianceBusinessModel.safety).toBeDefined();
        //             expect(applianceBusinessModel.safety.applianceGasSafety).toBeDefined();
        //             done();
        //         });

        // });

        // describe("parent/child appliances", () => {
        //     it("can set the parentId to null if linkId is empty", done => {
        //         applianceApiModel.id = "1";
        //         applianceApiModel.linkId = "";
        //         applianceFactory.createApplianceBusinessModel(applianceApiModel, true, true)
        //             .then((applianceBusinessModel) => {
        //                 expect(applianceBusinessModel.parentId).toBeUndefined();
        //                 done();
        //             });
        //     });

        //     it("can set the parentId to null if linkId is the appliance's own id", done => {
        //         applianceApiModel.id = "1";
        //         applianceApiModel.linkId = "1";
        //         applianceFactory.createApplianceBusinessModel(applianceApiModel, true, true)
        //             .then((applianceBusinessModel) => {
        //                 expect(applianceBusinessModel.parentId).toBeUndefined();
        //                 done();
        //             });
        //     });

        //     it("can set the parentId to linkId if linkId is another appliance's id", done => {
        //         applianceApiModel.id = "1";
        //         applianceApiModel.linkId = "2";
        //         applianceFactory.createApplianceBusinessModel(applianceApiModel, true, true)
        //             .then(applianceBusinessModel => {
        //                 expect(applianceBusinessModel.parentId).toBe("2");
        //                 done();
        //             });
        //     });
        // });
    });

    describe("createApplianceApiModel", () => {

        beforeEach(() => {
            readingFactoryStub.createReadingApiModels = sandbox.stub().resolves({});

            applianceSafetyFactoryStub.createApplianceSafetyApiModel = sandbox.stub().resolves({});

            let landlordAppliance = <LandlordSafetyCertificateAppliance>{};
            landlordAppliance.make = "A";
            landlordAppliance.model = "B";
            landlordAppliance.flueFlowTest = YesNoNa.Yes;
            landlordAppliance.spillageTest = YesNoNa.No;
            landlordAppliance.requestedToTest = true;
            landlordAppliance.unableToTest = false;

            landlordFactoryStub.createLandlordSafetyCertificateAppliance = sandbox.stub().resolves(landlordAppliance);

            let landlordDefect = <LandlordSafetyCertificateDefect>{};
            landlordDefect.details = "Z";

            landlordFactoryStub.createLandlordSafetyCertificateDefect = sandbox.stub().returns(landlordDefect);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("CH appliances fields undefined", done => {
            let job = <Job>{
                isLandlordJob: true
            };

            let appliance = <Appliance>{
                category: "Z",
                isSafetyRequired: true,
                applianceType: "Gas"
            };

            applianceFactory.createApplianceApiModel(job, <Job>{}, appliance, {}).then(apiModel => {

                expect(apiModel.condition).toBeUndefined()
                expect(apiModel.boilerSize).toBeUndefined()
                expect(apiModel.numberOfRadiators).toBeUndefined()
                expect(apiModel.energyControl).toBeUndefined()
                expect(apiModel.systemType).toBeUndefined()
                expect(apiModel.systemDesignCondition).toBeUndefined()
                expect(apiModel.cylinderType).toBeUndefined()
                expect(apiModel.numberofSpecialRadiators).toBeUndefined()
                done();
            });
        });

        it("non-CH appliances fields have values", done => {
            let job = <Job>{
                isLandlordJob: true
            };

            let appliance = <Appliance>{
                category: "X",
                condition: "new",
                boilerSize: 1,
                numberOfRadiators: 5,
                energyControl: "PQR",
                systemType: "system1",
                systemDesignCondition: "good",
                cylinderType: "round",
                numberOfSpecialRadiators: 2,
                isSafetyRequired: true,
                applianceType: "Gas"
            };

            applianceFactory.createApplianceApiModel(job, <Job>{}, appliance, {}).then(apiModel => {

                expect(apiModel.condition === "new").toBeTruthy()
                expect(apiModel.boilerSize === 1).toBeTruthy()
                expect(apiModel.numberOfRadiators === 5).toBeTruthy()
                expect(apiModel.energyControl === "PQR").toBeTruthy()
                expect(apiModel.systemType === "system1").toBeTruthy()
                expect(apiModel.systemDesignCondition === "good").toBeTruthy()
                expect(apiModel.cylinderType === "round").toBeTruthy()
                expect(apiModel.numberofSpecialRadiators === 2).toBeTruthy()
                done();
            });
        });

        it("can map landlord-specific fields if landlord job", done => {
            let job = <Job>{
                isLandlordJob: true
            };

            let appliance = <Appliance>{
                isSafetyRequired: true,
                applianceType: "Gas"
            };

            applianceFactory.createApplianceApiModel(job, <Job>{}, appliance, {}).then(apiModel => {

                expect(apiModel.make).toBe("A");
                expect(apiModel.model).toBe("B");
                expect(apiModel.flueFlowTest).toBe("P");
                expect(apiModel.spillageTest).toBe("F");
                expect(apiModel.requestedToTest).toBe(true);
                expect(apiModel.unableToTest).toBe(false);
                expect(apiModel.detailsOfAnyDefectsIdentifiedText).toBe("Z");
                expect(apiModel.remedialActionTakenText).toBeUndefined();

                done();
            });
        });

        it("requestedToTest should be true with landlord job and instPremApplianceContractType appliance", done => {
            let job = <Job>{
                isLandlordJob: true
            };

            let appliance = <Appliance>{
                isSafetyRequired: true,
                contractType: "INSTPREM",
                isInstPremAppliance: true,
                applianceType: "Gas"
            };

            landlordFactoryStub.createLandlordSafetyCertificateResult = sandbox.stub().returns({ propertySafetyDefect: {} });

            applianceFactory.createApplianceApiModel(job, <Job>{}, appliance, {}).then(apiModel => {
                expect(apiModel.requestedToTest).toBe(true);
                done();
            });
        });

        it("unableToTest should be false with landlord job and instPremApplianceContractType appliance", done => {
            let job = <Job>{
                isLandlordJob: true
            };

            let appliance = <Appliance>{
                isSafetyRequired: true,
                contractType: "INSTPREM",
                isInstPremAppliance: true,
                applianceType: "Gas"
            };

            landlordFactoryStub.createLandlordSafetyCertificateResult = sandbox.stub().returns({ propertySafetyDefect: {} });

            applianceFactory.createApplianceApiModel(job, <Job>{}, appliance, {}).then(apiModel => {
                expect(apiModel.unableToTest).toBe(false);
                done();
            });
        });

        it("can not map landlord-specific fields if not landlord job", done => {
            let job = <Job>{
                isLandlordJob: false
            };

            let appliance = <Appliance>{
                isSafetyRequired: true,
                applianceType: "Gas"
            };

            applianceFactory.createApplianceApiModel(job, <Job>{}, appliance, {}).then(apiModel => {

                expect(apiModel.make).toBeUndefined();
                expect(apiModel.model).toBeUndefined();
                expect(apiModel.flueFlowTest).toBeUndefined();
                expect(apiModel.spillageTest).toBeUndefined();
                expect(apiModel.requestedToTest).toBeUndefined();
                expect(apiModel.unableToTest).toBeUndefined();
                expect(apiModel.detailsOfAnyDefectsIdentifiedText).toBeUndefined();
                expect(apiModel.remedialActionTakenText).toBeUndefined();

                done();
            });
        });



        describe("updateMarker", () => {

            it("can return a new appliance", done => {
                applianceFactory.createApplianceApiModel(<Job>{}, <Job>{},
                    <Appliance>{ id: "9d992ee2-e93c-4599-888d-b85e9a0cffe0", isCreated: true, applianceType: "Gas" }, {})
                    .then(apiModel => {
                        expect(apiModel.updateMarker).toBe("C");
                        done();
                    });
            });

            it("can return an ammended appliance", done => {
                applianceFactory.createApplianceApiModel(<Job>{}, <Job>{}, <Appliance>{ isUpdated: true, applianceType: "Gas" }, {})
                    .then(apiModel => {
                        expect(apiModel.updateMarker).toBe("A");
                        done();
                    });
            });

            it("can return an unchanged appliance (isUpdated = false)", done => {
                applianceFactory.createApplianceApiModel(<Job>{}, <Job>{}, <Appliance>{ isUpdated: false, applianceType: "Gas" }, {})
                    .then(apiModel => {
                        expect(apiModel.updateMarker).toBe("A");
                        done();
                    });
            });

            it("can return a deleted appliance", done => {
                applianceFactory.createApplianceApiModel(<Job>{}, <Job>{}, <Appliance>{ isDeleted: true, applianceType: "Gas" }, {})
                    .then(apiModel => {
                        expect(apiModel.updateMarker).toBe("D");
                        done();
                    });
            });
        });

        describe("hardwareSequenceNumber & linkId", () => {
            let appliance: Appliance;
            let applianceIdToSequenceMap: { [guid: string]: number } = {};

            beforeEach(() => {
                appliance = new Appliance();
                appliance.isCreated = true;
                appliance.applianceType = "CHB";
                appliance.id = "123";    
                appliance.parentId = undefined;            
            });

            it("hardwareSequenceNumber should be set and linkId should be undefined for stand-alone appliance", async done => {
                applianceIdToSequenceMap[appliance.id] = 2;
                let applianceApiModel = await applianceFactory.createApplianceApiModel(<Job>{}, <Job>{}, appliance, applianceIdToSequenceMap);
                expect(applianceApiModel.hardwareSequenceNumber).toEqual(applianceIdToSequenceMap[appliance.id]);
                expect(applianceApiModel.linkId).toBeUndefined();
                done();
            });

            it("linkId should be set for the child appliance", async done => {
                appliance.applianceType = "FRB";
                appliance.parentId = "234";
                applianceIdToSequenceMap["234"] = 2;
                applianceIdToSequenceMap[appliance.id] = 3;
                let applianceApiModel = await applianceFactory.createApplianceApiModel(<Job>{}, <Job>{}, appliance, applianceIdToSequenceMap);
                expect(applianceApiModel.hardwareSequenceNumber).toEqual(applianceIdToSequenceMap[appliance.id]);
                expect(applianceApiModel.linkId).toEqual(applianceIdToSequenceMap[appliance.parentId].toString());
                done();
            });

            it("hardwareSequenceNumber and linkId should be undefined for the existing appliance", async done => {
                appliance.isCreated = false;
                let applianceApiModel = await applianceFactory.createApplianceApiModel(<Job>{}, <Job>{}, appliance);
                expect(applianceApiModel.hardwareSequenceNumber).toBeUndefined();
                expect(applianceApiModel.linkId).toBeUndefined();
                done();
            });
        });

        // describe("appropriate fields for each CRUD operation", () => {
        //     let appliance: Appliance;
        //     let originalJob: Job;

        //     let getDefinedFields = (o: any) => {
        //         return Object.keys(o)
        //                 .map(key => key)
        //                 .filter(key => o[key] !== undefined);
        //     };

        //     beforeEach(() => {
        //         appliance = <Appliance>{
        //             id: "12345",
        //             applianceCategoryType: ApplianceCategoryType.gas,
        //             serialId: "foo",
        //             gcCode: "foo",
        //             bgInstallationIndicator: true,
        //             category: "foo",
        //             contractType: "foo",
        //             contractExpiryDate: undefined,
        //             applianceType: "CHB",
        //             description: "foo",
        //             flueType: "foo",
        //             cylinderType: "foo",
        //             energyControl: "foo",
        //             locationDescription: "foo",
        //             condition: "foo",
        //             numberOfRadiators: 1,
        //             numberOfSpecialRadiators: 1,
        //             installationYear: 1,
        //             systemDesignCondition: "foo",
        //             systemType: "foo",
        //             notes: "foo",
        //             boilerSize: 1,
        //             parentId: "foo",
        //             childId: "foo",
        //             isCurrentJob: true,
        //             isSafetyRequired: true,
        //             preVisitChirpCode: undefined,
        //             isCentralHeatingAppliance: true,
        //             isInstPremAppliance: true
        //         };

        //         originalJob = <Job> {
        //             history : {
        //                 appliances: [{ id: "12345", applianceType: "CHB", boilerSize: 23 }]
        //             }
        //         };
        //     });

        //     it("can return appropriate fields for deleted appliances", done => {
        //          appliance.isDeleted = true;
        //          applianceFactory.createApplianceApiModel(<Job>{}, <Job>{}, appliance, {})
        //         .then(apiModel => {
        //             expect(apiModel).toEqual({id: "12345", applianceType: "CHB", updateMarker: "D"});
        //             expect(getDefinedFields(apiModel).length).toBe(3); // no other fields should be set
        //             done();
        //         });
        //     });

        //     it("can return appropriate fields for created appliances", done => {

        //         appliance.isCreated = true;
        //         applianceFactory.createApplianceApiModel(<Job>{}, originalJob, appliance, {"12345": 1})
        //             .then(apiModel => {
        //                 expect(apiModel.applianceType).toBe("CHB");
        //                 expect(apiModel.id).toBeUndefined();
        //                 expect(apiModel.hardwareSequenceNumber).toBe(1);
        //                 done();
        //         });
        //     });

        //     it("can return appliance type for updated appliances", done => {
        //         appliance.isUpdated = true;
        //         applianceFactory.createApplianceApiModel(<Job>{}, originalJob, appliance, {})
        //             .then(apiModel => {
        //                 // #16587 DF_1077 - always send back the appliance type
        //                 expect(apiModel.applianceType).toBe("CHB");
        //                 expect(apiModel.id).toBe("12345");
        //                 expect(apiModel.hardwareSequenceNumber).toBeUndefined();
        //                 done();
        //         });
        //     });
        // })
    });

});
