/// <reference path="../../../../typings/app.d.ts" />

import {Job} from "../../../../app/hema/business/models/job";
import { Appliance } from "../../../../app/hema/business/models/appliance";

import {DataStateManager} from "../../../../app/hema/common/dataStateManager";
import { DataState } from "../../../../app/hema/business/models/dataState";
import {QueryableBusinessRuleGroup} from "../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import {IBusinessRuleService} from "../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {ICatalogService} from "../../../../app/hema/business/services/interfaces/ICatalogService";
import {ApplianceSafetyType} from "../../../../app/hema/business/models/applianceSafetyType";
import {IObjectType} from "../../../../app/hema/business/models/reference/IObjectType";
import {Task} from "../../../../app/hema/business/models/task";
import { ApplianceGasReadings } from "../../../../app/hema/business/models/applianceGasReadings";
import { ApplianceSafety } from "../../../../app/hema/business/models/applianceSafety";
import { ApplianceElectricalSafetyDetail } from "../../../../app/hema/business/models/applianceElectricalSafetyDetail";
import { ApplianceGasReadingMaster } from "../../../../app/hema/business/models/applianceGasReadingMaster";
import { ApplianceGasSafety } from "../../../../app/hema/business/models/applianceGasSafety";
import { ApplianceOtherSafety } from "../../../../app/hema/business/models/applianceOtherSafety";
import { ApplianceGasUnsafeDetail } from "../../../../app/hema/business/models/applianceGasUnsafeDetail";
import { PropertySafety } from "../../../../app/hema/business/models/propertySafety";
import { IDataStateManager } from "../../../../app/hema/common/IDataStateManager";
import { PropertySafetyType } from "../../../../app/hema/business/models/propertySafetyType";

describe("the dataStateManager", () => {
    let sandbox: Sinon.SinonSandbox;

    let job: Job;
    let appliance: Appliance;

    let catalogServiceStub: ICatalogService;
    let businessRuleServiceStub: IBusinessRuleService;

    let dataStateManager: IDataStateManager;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        catalogServiceStub = <ICatalogService>{};

        businessRuleServiceStub = <IBusinessRuleService>{};
        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};

        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();

        // the applianceFactory business rules
        getBusinessRuleStub.withArgs("applianceSafetyNotRequiredIndicator").returns("N");
        getBusinessRuleStub.withArgs("electricalWiringElectricalApplianceType").returns("ELECTRICAL");

        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        appliance = new Appliance();
        job = new Job();

        dataStateManager = new DataStateManager(businessRuleServiceStub, catalogServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("the updateApplianceDataState function", () => {
        beforeEach(() => {

        });

        afterEach(() => {

        });

        // this test is needed because the base appliance factory assumes the
        // datastate is like the below when a new appliance is created
        // because it doesnt set any default datastates
        describe("when new appliance is created", () => {
           it("will not require appliance details", () => {
               appliance = new Appliance();

               expect(appliance.dataState).toEqual(DataState.dontCare);
           });

            it("will not require any appliance safety details", () => {
                appliance = new Appliance();

                expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);

                expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toEqual(DataState.dontCare);

                expect(appliance.safety.applianceOtherSafety.dataState).toEqual(DataState.dontCare);
            });
        });


        describe("deleted appliance" , () => {
            it("will set everything to dontCare", done => {
                let appliance = <Appliance> {
                    isDeleted: true,
                    dataState: DataState.invalid,
                    safety: <ApplianceSafety>{
                        applianceElectricalSafetyDetail: <ApplianceElectricalSafetyDetail>{
                            dataState: DataState.notVisited
                        },
                        applianceGasReadingsMaster: <ApplianceGasReadingMaster> {
                            dataState: DataState.valid
                        },
                        applianceGasSafety: <ApplianceGasSafety> {
                            dataState: DataState.invalid
                        },
                        applianceOtherSafety: <ApplianceOtherSafety> {
                            dataState: DataState.notVisited
                        }
                    }
                };

                dataStateManager.updateApplianceDataState(appliance, <Job>{});
                expect(appliance.dataState).toBe(DataState.dontCare);
                expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toBe(DataState.dontCare);
                expect(appliance.safety.applianceGasReadingsMaster.dataState).toBe(DataState.dontCare);
                expect(appliance.safety.applianceGasSafety.dataState).toBe(DataState.dontCare);
                expect(appliance.safety.applianceOtherSafety.dataState).toBe(DataState.dontCare);
                done();
            });
        });

        describe("exclude appliance" , () => {
            it("will set everything to dontCare", done => {
                let appliance = <Appliance> {
                    isExcluded: true,
                    dataState: DataState.invalid,
                    safety: <ApplianceSafety>{
                        applianceElectricalSafetyDetail: <ApplianceElectricalSafetyDetail>{
                            dataState: DataState.notVisited
                        },
                        applianceGasReadingsMaster: <ApplianceGasReadingMaster> {
                            dataState: DataState.valid
                        },
                        applianceGasSafety: <ApplianceGasSafety> {
                            dataState: DataState.invalid
                        },
                        applianceOtherSafety: <ApplianceOtherSafety> {
                            dataState: DataState.notVisited
                        }
                    }
                };

                dataStateManager.updateApplianceDataState(appliance, <Job>{});
                expect(appliance.dataState).toBe(DataState.dontCare);
                expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toBe(DataState.dontCare);
                expect(appliance.safety.applianceGasReadingsMaster.dataState).toBe(DataState.dontCare);
                expect(appliance.safety.applianceGasSafety.dataState).toBe(DataState.dontCare);
                expect(appliance.safety.applianceOtherSafety.dataState).toBe(DataState.dontCare);
                done();
            });
        });

        describe("for a true gas appliance", () => {
            let chbObjectType = <IObjectType> {};

            beforeEach(() => {
                appliance = new Appliance();
                appliance.applianceType = "CHB";
                appliance.applianceSafetyType = ApplianceSafetyType.gas;

                // mock catalogService methods
                chbObjectType = <IObjectType> {
                    category: "X",
                    applianceType: "CHB",
                    applianceTypeDescription: "C/HEAT BLR",
                    applianceSafetyNotRequiredIndicator: "N",
                    applianceCategory: "G",
                    useIaci: "Y",
                    fetchGCCode: "Y",
                    association: "",
                    associationNumber: 0,
                    allowCreateInField: "Y",
                    allowDeleteInField: "Y"
                };

                let getObjectTypeStub = catalogServiceStub.getObjectType = sandbox.stub();
                getObjectTypeStub.withArgs("CHB").resolves(chbObjectType);


            });

            describe("when job", () => {
                beforeEach(() => {

                });

                describe("is not a landlord job", () => {
                    beforeEach(() => {
                        job.isLandlordJob = false;
                    });

                    describe("and appliance is not linked to a task", () => {
                        beforeEach(() => {
                            job.tasks = [];
                        });

                        it("will not require any appliance details", (done) => {
                            appliance.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is Y", (done) => {
                            chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.notVisited;
                            appliance.safety.applianceGasSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is N", (done) => {
                            chbObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.notVisited;
                            appliance.safety.applianceGasSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will set gasSafety to notvisited if there is a preliminary readings unsafe situation", done => {
                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.valid;
                            appliance.safety.applianceGasSafety.dataState = DataState.valid;

                            appliance.safety.applianceGasReadingsMaster.preliminaryReadings = <ApplianceGasReadings>{ isUnsafeReadings: true };
                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.valid);
                                    done();
                                });
                        });

                        it("will not set gasSafety to notvisited if there is a preliminary readings unsafe situation but a report is already present", done => {
                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.valid;
                            appliance.safety.applianceGasSafety.dataState = DataState.valid;

                            appliance.safety.applianceGasReadingsMaster.preliminaryReadings = <ApplianceGasReadings>{ isUnsafeReadings: true };
                            appliance.safety.applianceGasUnsafeDetail = <ApplianceGasUnsafeDetail> {report: "x"};

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.valid);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.valid);
                                    done();
                                });
                        });

                        it("will set gasSafety to notVisited if there is a supplementary readings unsafe situation", done => {
                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.valid;
                            appliance.safety.applianceGasSafety.dataState = DataState.valid;

                            appliance.safety.applianceGasReadingsMaster.supplementaryReadings = <ApplianceGasReadings>{ isUnsafeReadings: true };

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.valid);
                                    done();
                                });
                        });

                        it("will not set gasSafety to notvisited if there is a supplementary readings unsafe situation but a report is already present", done => {
                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.valid;
                            appliance.safety.applianceGasSafety.dataState = DataState.valid;

                            appliance.safety.applianceGasReadingsMaster.supplementaryReadings = <ApplianceGasReadings>{ isUnsafeReadings: true };
                            appliance.safety.applianceGasUnsafeDetail = <ApplianceGasUnsafeDetail> {report: "x"};

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.valid);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.valid);
                                    done();
                                });
                        });

                    });

                    describe("and appliance is linked to a task", () => {
                        beforeEach(() => {
                            let task = new Task(true, false);
                            task.applianceId = "1";
                            task.status = "D";

                            job.tasks = [task];

                            appliance.id = "1";
                        });

                        it("will require appliance details", (done) => {
                            appliance.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require appliance safety details if the applianceSafetyRequiredIndicator is N", (done) => {
                            chbObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.notVisited;
                            appliance.safety.applianceGasSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will require appliance safety details  if the applianceSafetyRequiredIndicator is Y", (done) => {
                            chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.dontCare;
                            appliance.safety.applianceGasSafety.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        describe("when gasSafety/readings have been interacted with", () => {

                            it("will set readings to notVisited if gasSafety is touched", done => {
                                chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                                appliance.safety.applianceGasReadingsMaster.dataState = DataState.dontCare;
                                appliance.safety.applianceGasSafety.dataState = DataState.dontCare;

                                appliance.safety.applianceGasSafety.workedOnAppliance = true;
                                dataStateManager.updateApplianceDataState(appliance, job)
                                    .then(() => {
                                        expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                        expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.notVisited);
                                        done();
                                    });
                            })

                            it("will not set readings to notVisited if gasSafety is touched and readings is already invalid", done => {
                                chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                                appliance.safety.applianceGasReadingsMaster.dataState = DataState.invalid;
                                appliance.safety.applianceGasSafety.dataState = DataState.dontCare;

                                appliance.safety.applianceGasSafety.workedOnAppliance = true;
                                dataStateManager.updateApplianceDataState(appliance, job)
                                    .then(() => {
                                        expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                        expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.invalid);
                                        done();
                                    });
                            })

                            it("will set gasSafety to notVisited if readings is touched", done => {
                                chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                                appliance.safety.applianceGasReadingsMaster.dataState = DataState.dontCare;
                                appliance.safety.applianceGasSafety.dataState = DataState.dontCare;

                                appliance.safety.applianceGasReadingsMaster.preliminaryReadings = <ApplianceGasReadings>{isLpg: true};
                                dataStateManager.updateApplianceDataState(appliance, job)
                                    .then(() => {
                                        expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                        expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                        done();
                                    });
                            })

                            it("will not set gasSafety to notVisited if readings is touched and gasSafety is already invalid", done => {
                                chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                                appliance.safety.applianceGasReadingsMaster.dataState = DataState.dontCare;
                                appliance.safety.applianceGasSafety.dataState = DataState.invalid;

                                appliance.safety.applianceGasReadingsMaster.preliminaryReadings = <ApplianceGasReadings>{isLpg: true};
                                dataStateManager.updateApplianceDataState(appliance, job)
                                    .then(() => {
                                        expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.invalid);
                                        expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                        done();
                                    });
                            })

                            it("will set gasSafety to invalid if flueType has changed (and chimneyInstallationAndTests has been set to undefined)", done => {
                                chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                                appliance.safety.applianceGasSafety.dataState = DataState.valid;
                                appliance.safety.applianceGasSafety.chimneyInstallationAndTests = undefined;
                                appliance.flueType = "foo";
                                appliance.safety.applianceGasSafety.workedOnAppliance = true;
                                dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                    done();
                                });

                            });

                            it("will not set gasSafety to invalid if flueType has changed (and chimneyInstallationAndTests has been set to undefined) but the appliance is not worked on", done => {
                                chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                                appliance.safety.applianceGasSafety.dataState = DataState.valid;
                                appliance.safety.applianceGasSafety.chimneyInstallationAndTests = undefined;
                                appliance.flueType = "foo";
                                appliance.safety.applianceGasSafety.workedOnAppliance = false;
                                dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.valid);
                                    done();
                                });

                            });

                            it("will set gasSafety to notVisited if performance tests are required", done => {
                                chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                                appliance.safety.applianceGasSafety.dataState = DataState.valid;
                                appliance.safety.applianceGasSafety.performanceTestsNotDoneReason = undefined;
                                appliance.safety.applianceGasSafety.workedOnAppliance = true;
                                appliance.safety.applianceGasReadingsMaster.preliminaryReadings = <ApplianceGasReadings>{};
                                dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                    done();
                                });

                            });

                            it("will not set gasSafety to notVisited if performance tests are missing but appliance not worked on", done => {
                                chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                                appliance.safety.applianceGasSafety.dataState = DataState.valid;
                                appliance.safety.applianceGasSafety.performanceTestsNotDoneReason = undefined;
                                appliance.safety.applianceGasSafety.workedOnAppliance = false;
                                appliance.safety.applianceGasReadingsMaster.preliminaryReadings = <ApplianceGasReadings>{};
                                dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.valid);
                                    done();
                                });

                            });

                            it("will not set gasSafety to notVisited if performance tests are done", done => {
                                chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                                appliance.safety.applianceGasSafety.dataState = DataState.valid;
                                appliance.safety.applianceGasSafety.performanceTestsNotDoneReason = undefined;
                                appliance.safety.applianceGasSafety.workedOnAppliance = true;
                                appliance.safety.applianceGasReadingsMaster.preliminaryReadings = <ApplianceGasReadings>{readingFinalRatio: 0.001};
                                dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.valid);
                                    done();
                                });

                            });

                            it("will set gasSafety to notVisited if performance tests for supplementary are required", done => {
                                chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                                appliance.safety.applianceGasSafety.dataState = DataState.valid;
                                appliance.safety.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary = undefined;
                                appliance.safety.applianceGasSafety.workedOnAppliance = true;
                                appliance.safety.applianceGasReadingsMaster.supplementaryReadings = <ApplianceGasReadings>{};
                                appliance.safety.applianceGasReadingsMaster.supplementaryBurnerFitted = true;
                                dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                    done();
                                });
                            });

                            it("will not set gasSafety to notVisited if performance tests for supplementary is not added but appliance not worked on", done => {
                                chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                                appliance.safety.applianceGasSafety.dataState = DataState.valid;
                                appliance.safety.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary = undefined;
                                appliance.safety.applianceGasSafety.workedOnAppliance = false;
                                appliance.safety.applianceGasReadingsMaster.preliminaryReadings = <ApplianceGasReadings>{};
                                appliance.safety.applianceGasReadingsMaster.supplementaryReadings = <ApplianceGasReadings>{};
                                appliance.safety.applianceGasReadingsMaster.supplementaryBurnerFitted = true;
                                dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.valid);
                                    done();
                                });
                            });

                            it("will not set gasSafety to notVisited if performance tests for supplementary are done", done => {
                                chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                                appliance.safety.applianceGasSafety.dataState = DataState.valid;
                                appliance.safety.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary = undefined;
                                appliance.safety.applianceGasSafety.workedOnAppliance = true;
                                appliance.safety.applianceGasReadingsMaster.supplementaryReadings = <ApplianceGasReadings>{readingFinalRatio: 0.001};
                                appliance.safety.applianceGasReadingsMaster.supplementaryBurnerFitted = true;
                                dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.valid);
                                    done();
                                });
                            });
                        });
                    });
                });

                describe("is a landlord job", () => {
                    beforeEach(() => {
                        job.isLandlordJob = true;
                    });

                    describe("and appliance is not linked to a task", () => {
                        beforeEach(() => {
                            job.tasks = [];
                        })

                        it("will require appliance details", (done) => {
                            appliance.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will require appliance safety details if the applianceSafetyRequiredIndicator is Y", (done) => {
                            chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.dontCare;
                            appliance.safety.applianceGasSafety.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is N", (done) => {
                            chbObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.notVisited;
                            appliance.safety.applianceGasSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not set gasSafety to invalid if the certificate make amd model fields are completed", done => {
                            chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceGasSafety.dataState = DataState.valid;
                            appliance.safety.applianceGasSafety.chimneyInstallationAndTests = undefined;
                            appliance.safety.applianceGasSafety.workedOnAppliance = true;
                            appliance.safety.applianceGasSafety.applianceMake = "bar";
                            appliance.safety.applianceGasSafety.applianceModel = "foo";
                            dataStateManager.updateApplianceDataState(appliance, job)
                            .then(() => {
                                expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.valid);
                                done();
                            });

                        });

                        it("will set gasSafety to invalid if the certificate make field is missing", done => {
                            chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceGasSafety.dataState = DataState.valid;
                            appliance.safety.applianceGasSafety.chimneyInstallationAndTests = undefined;
                            appliance.safety.applianceGasSafety.workedOnAppliance = true;
                            appliance.safety.applianceGasSafety.applianceMake = undefined;
                            appliance.safety.applianceGasSafety.applianceModel = "foo";
                            dataStateManager.updateApplianceDataState(appliance, job)
                            .then(() => {
                                expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                done();
                            });

                        });

                        it("will set gasSafety to invalid if the certificate model field is missing", done => {
                            chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceGasSafety.dataState = DataState.valid;
                            appliance.safety.applianceGasSafety.chimneyInstallationAndTests = undefined;
                            appliance.safety.applianceGasSafety.workedOnAppliance = true;
                            appliance.safety.applianceGasSafety.applianceMake = "foo";
                            appliance.safety.applianceGasSafety.applianceModel = undefined;
                            dataStateManager.updateApplianceDataState(appliance, job)
                            .then(() => {
                                expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                done();
                            });
                        });
                    });

                    describe("and appliance is linked to a task", () => {
                        beforeEach(() => {
                            let task = new Task(true, false);
                            task.applianceId = "1";
                            task.status = "D";

                            job.tasks = [task];

                            appliance.id = "1";
                        });

                        it("will require appliance details", (done) => {
                            appliance.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will require appliance safety details if the applianceSafetyRequiredIndicator is Y", (done) => {
                            chbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.dontCare;
                            appliance.safety.applianceGasSafety.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is N", (done) => {
                            chbObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.notVisited;
                            appliance.safety.applianceGasSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                    });
                });
            });
        });

        describe("for a true gas child appliance", () => {
            let bbfObjectType = <IObjectType> {};
            let frbObjectType = <IObjectType> {};

            let parentAppliance: Appliance;

            beforeEach(() => {
                parentAppliance = new Appliance();
                parentAppliance.applianceType = "BBF";
                parentAppliance.applianceSafetyType = ApplianceSafetyType.gas;
                parentAppliance.id = "1";
                parentAppliance.childId = "2";

                appliance = new Appliance();
                appliance.applianceType = "FRB";
                appliance.applianceSafetyType = ApplianceSafetyType.gas;
                appliance.id = "2";
                appliance.parentId = "1";


                // mock catalogService methods
                bbfObjectType = <IObjectType> {
                    category: "X",
                    applianceType: "BBF",
                    applianceTypeDescription: "BK BLR FRE",
                    applianceSafetyNotRequiredIndicator: "N",
                    applianceCategory: "G",
                    useIaci: "Y",
                    fetchGCCode: "Y",
                    association: "P",
                    associationNumber: 2,
                    allowCreateInField: "Y",
                    allowDeleteInField: "Y"
                };

                frbObjectType = <IObjectType> {
                    category: "A",
                    applianceType: "FRB",
                    applianceTypeDescription: "FIRE-BBF",
                    applianceSafetyNotRequiredIndicator: "N",
                    applianceCategory: "G",
                    useIaci: "N",
                    fetchGCCode: "N",
                    association: "C",
                    associationNumber: 2,
                    allowCreateInField: "N",
                    allowDeleteInField: "N"
                };

                let getObjectTypeStub = catalogServiceStub.getObjectType = sandbox.stub();
                getObjectTypeStub.withArgs("BBF").resolves(bbfObjectType);
                getObjectTypeStub.withArgs("FRB").resolves(frbObjectType);

            });

            describe("when job", () => {
                beforeEach(() => {

                });

                describe("is not a landlord job", () => {
                    beforeEach(() => {
                        job.isLandlordJob = false;
                    });

                    describe("and parent appliance is not linked to a task", () => {
                        beforeEach(() => {
                            job.tasks = [];
                        });

                        it("will not require any appliance details like its parent", (done) => {
                            appliance.dataState = DataState.notVisited;
                            parentAppliance.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(parentAppliance, job)
                                .then(() => dataStateManager.updateApplianceDataState(appliance, job))
                                .then(() => {
                                    expect(parentAppliance.dataState).toEqual(DataState.dontCare);
                                    expect(appliance.dataState).toEqual(DataState.dontCare);

                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is Y like its parent", (done) => {
                            bbfObjectType.applianceSafetyNotRequiredIndicator = "Y";
                            frbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            parentAppliance.safety.applianceGasReadingsMaster.dataState = DataState.notVisited;
                            parentAppliance.safety.applianceGasSafety.dataState = DataState.notVisited;

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.notVisited;
                            appliance.safety.applianceGasSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(parentAppliance, job)
                                .then(() => dataStateManager.updateApplianceDataState(appliance, job))
                                .then(() => {
                                    expect(parentAppliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                    expect(parentAppliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);

                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is N like its parent", (done) => {
                            bbfObjectType.applianceSafetyNotRequiredIndicator = "N";
                            frbObjectType.applianceSafetyNotRequiredIndicator = "N";

                            parentAppliance.safety.applianceGasReadingsMaster.dataState = DataState.notVisited;
                            parentAppliance.safety.applianceGasSafety.dataState = DataState.notVisited;

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.notVisited;
                            appliance.safety.applianceGasSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(parentAppliance, job)
                                .then(() => dataStateManager.updateApplianceDataState(appliance, job))
                                .then(() => {
                                    expect(parentAppliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                    expect(parentAppliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);

                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                    });

                    describe("and parent appliance is linked to a task", () => {
                        beforeEach(() => {
                            let task = new Task(true, false);
                            task.applianceId = "1";
                            task.status = "D";

                            job.tasks = [task];
                        });

                        it("will require appliance details like its parent", (done) => {
                            parentAppliance.dataState = DataState.dontCare;
                            appliance.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(parentAppliance, job)
                                .then(() => dataStateManager.updateApplianceDataState(appliance, job))
                                .then(() => {
                                    expect(parentAppliance.dataState).toEqual(DataState.notVisited);
                                    expect(appliance.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require appliance safety details if the applianceSafetyRequiredIndicator is N like its parent", (done) => {
                            bbfObjectType.applianceSafetyNotRequiredIndicator = "N";
                            frbObjectType.applianceSafetyNotRequiredIndicator = "N";

                            parentAppliance.safety.applianceGasReadingsMaster.dataState = DataState.notVisited;
                            parentAppliance.safety.applianceGasSafety.dataState = DataState.notVisited;

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.notVisited;
                            appliance.safety.applianceGasSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(parentAppliance, job)
                                .then(() => dataStateManager.updateApplianceDataState(appliance, job))
                                .then(() => {
                                    expect(parentAppliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                    expect(parentAppliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);

                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will require appliance safety details  if the applianceSafetyRequiredIndicator is Y like its parent", (done) => {
                            bbfObjectType.applianceSafetyNotRequiredIndicator = "Y";
                            frbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            parentAppliance.safety.applianceGasReadingsMaster.dataState = DataState.dontCare;
                            parentAppliance.safety.applianceGasSafety.dataState = DataState.dontCare;

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.dontCare;
                            appliance.safety.applianceGasSafety.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(parentAppliance, job)
                                .then(() => dataStateManager.updateApplianceDataState(appliance, job))
                                .then(() => {
                                    expect(parentAppliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                    expect(parentAppliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);

                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                    });
                });

                describe("is a landlord job", () => {
                    beforeEach(() => {
                        job.isLandlordJob = true;
                    });

                    describe("and parent appliance is not linked to a task", () => {
                        beforeEach(() => {
                            job.tasks = [];
                        })

                        it("will require appliance details like its parent", (done) => {
                            parentAppliance.dataState = DataState.dontCare;
                            appliance.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(parentAppliance, job)
                                .then(() => dataStateManager.updateApplianceDataState(appliance, job))
                                .then(() => {
                                    expect(parentAppliance.dataState).toEqual(DataState.notVisited);
                                    expect(appliance.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will require appliance safety details if the applianceSafetyRequiredIndicator is Y like its parent", (done) => {
                            bbfObjectType.applianceSafetyNotRequiredIndicator = "Y";
                            frbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            parentAppliance.safety.applianceGasReadingsMaster.dataState = DataState.dontCare;
                            parentAppliance.safety.applianceGasSafety.dataState = DataState.dontCare;

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.dontCare;
                            appliance.safety.applianceGasSafety.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(parentAppliance, job)
                                .then(() => dataStateManager.updateApplianceDataState(appliance, job))
                                .then(() => {
                                    expect(parentAppliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                    expect(parentAppliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);

                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is N", (done) => {
                            bbfObjectType.applianceSafetyNotRequiredIndicator = "N";
                            frbObjectType.applianceSafetyNotRequiredIndicator = "N";

                            parentAppliance.safety.applianceGasReadingsMaster.dataState = DataState.notVisited;
                            parentAppliance.safety.applianceGasSafety.dataState = DataState.notVisited;

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.notVisited;
                            appliance.safety.applianceGasSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(parentAppliance, job)
                                .then(() => dataStateManager.updateApplianceDataState(appliance, job))
                                .then(() => {
                                    expect(parentAppliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                    expect(parentAppliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);

                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                    });

                    describe("and parent appliance is linked to a task", () => {
                        beforeEach(() => {
                            let task = new Task(true, false);
                            task.applianceId = "1";
                            task.status = "D";

                            job.tasks = [task];
                        });

                        it("will require appliance details like its parent", (done) => {
                            parentAppliance.dataState = DataState.dontCare;
                            appliance.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(parentAppliance, job)
                                .then(() => dataStateManager.updateApplianceDataState(appliance, job))
                                .then(() => {
                                    expect(parentAppliance.dataState).toEqual(DataState.notVisited);
                                    expect(appliance.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will require appliance safety details if the applianceSafetyRequiredIndicator is Y like its parent", (done) => {
                            bbfObjectType.applianceSafetyNotRequiredIndicator = "Y";
                            frbObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            parentAppliance.safety.applianceGasReadingsMaster.dataState = DataState.dontCare;
                            parentAppliance.safety.applianceGasSafety.dataState = DataState.dontCare;

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.dontCare;
                            appliance.safety.applianceGasSafety.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(parentAppliance, job)
                                .then(() => dataStateManager.updateApplianceDataState(appliance, job))
                                .then(() => {
                                    expect(parentAppliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                    expect(parentAppliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);

                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.notVisited);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is N like its parent", (done) => {
                            bbfObjectType.applianceSafetyNotRequiredIndicator = "N";
                            frbObjectType.applianceSafetyNotRequiredIndicator = "N";

                            parentAppliance.safety.applianceGasReadingsMaster.dataState = DataState.notVisited;
                            parentAppliance.safety.applianceGasSafety.dataState = DataState.notVisited;

                            appliance.safety.applianceGasReadingsMaster.dataState = DataState.notVisited;
                            appliance.safety.applianceGasSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(parentAppliance, job)
                                .then(() => dataStateManager.updateApplianceDataState(appliance, job))
                                .then(() => {
                                    expect(parentAppliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                    expect(parentAppliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);

                                    expect(appliance.safety.applianceGasSafety.dataState).toEqual(DataState.dontCare);
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                    });
                });
            });
        });

        describe("for a inst prem appliance", () => {

            let insObjectType = <IObjectType> {};

            beforeEach(() => {

                appliance.isInstPremAppliance = true;
                appliance.applianceType = "INS";
                appliance.applianceSafetyType = ApplianceSafetyType.gas;

                // mock catalogService methods
                insObjectType = <IObjectType> {
                    category: "A",
                    applianceType: "INS",
                    applianceTypeDescription: "INST/PREM",
                    applianceSafetyNotRequiredIndicator: "N",
                    applianceCategory: "G",
                    useIaci: "N",
                    fetchGCCode: "N",
                    association: "",
                    associationNumber: 0,
                    allowCreateInField: "Y",
                    allowDeleteInField: "Y"
                };

                let getObjectTypeStub = catalogServiceStub.getObjectType = sandbox.stub();
                getObjectTypeStub.withArgs("INS").resolves(insObjectType);
            });

            describe("when job", () => {
                beforeEach(() => {

                });

                describe("is not a landlord job", () => {
                    beforeEach(() => {
                        job.isLandlordJob = false;
                    });

                    describe("and appliance is not linked to a task", () => {
                        beforeEach(() => {
                            job.tasks = [];
                        });

                        it("will not require any appliance details", (done) => {

                            appliance.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not change the appliance safety details required state if the applianceSafetyRequiredIndicator is Y", (done) => {
                            insObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceGasReadingsMaster.dataState = undefined;
                            appliance.safety.applianceGasSafety.dataState = undefined;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toBeUndefined();
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toBeUndefined();
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not change the appliance safety details required state if the applianceSafetyRequiredIndicator is N", (done) => {
                            insObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceGasReadingsMaster.dataState = undefined;
                            appliance.safety.applianceGasSafety.dataState = undefined;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toBeUndefined();
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toBeUndefined();
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                    });

                    describe("and appliance is linked to a task", () => {
                        beforeEach(() => {
                            let task = new Task(true, false);
                            task.applianceId = "1";
                            task.status = "D";

                            job.tasks = [task];

                            appliance.id = "1";
                        });

                        it("will require appliance details", (done) => {

                            appliance.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not change the appliance safety details required state if the applianceSafetyRequiredIndicator is N", (done) => {
                            insObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceGasReadingsMaster.dataState = undefined;
                            appliance.safety.applianceGasSafety.dataState = undefined;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toBeUndefined();
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toBeUndefined();
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not change the appliance safety details required state if the applianceSafetyRequiredIndicator is Y", (done) => {
                            insObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceGasReadingsMaster.dataState = undefined;
                            appliance.safety.applianceGasSafety.dataState = undefined;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toBeUndefined();
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toBeUndefined();
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                    });
                });

                describe("is a landlord job", () => {
                    beforeEach(() => {
                        job.isLandlordJob = true;
                    });

                    describe("and appliance is not linked to a task", () => {
                        beforeEach(() => {
                            job.tasks = [];
                        })

                        it("will require appliance details", (done) => {
                            appliance.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not change the appliance safety details required state if the applianceSafetyRequiredIndicator is Y", (done) => {
                            insObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceGasReadingsMaster.dataState = undefined;
                            appliance.safety.applianceGasSafety.dataState = undefined;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toBeUndefined()
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toBeUndefined();
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not change the appliance safety details required state if the applianceSafetyRequiredIndicator is N", (done) => {
                            insObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceGasReadingsMaster.dataState = undefined;
                            appliance.safety.applianceGasSafety.dataState = undefined;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toBeUndefined();
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toBeUndefined();
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                    });

                    describe("and appliance is linked to a task", () => {
                        beforeEach(() => {
                            let task = new Task(true, false);
                            task.applianceId = "1";
                            task.status = "D";

                            job.tasks = [task];

                            appliance.id = "1";
                        });

                        it("will require appliance details", (done) => {
                            appliance.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will change the appliance safety details required state if the applianceSafetyRequiredIndicator is Y", (done) => {
                            insObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceGasReadingsMaster.dataState = undefined;
                            appliance.safety.applianceGasSafety.dataState = undefined;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toBeUndefined();
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toBeUndefined();
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not change the appliance safety details required state if the applianceSafetyRequiredIndicator is N", (done) => {
                            insObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceGasReadingsMaster.dataState = undefined;
                            appliance.safety.applianceGasSafety.dataState = undefined;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceGasSafety.dataState).toBeUndefined();
                                    expect(appliance.safety.applianceGasReadingsMaster.dataState).toBeUndefined();
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                    });
                });
            });
        });

        describe("for a electrical appliance", () => {

            let electricalObjectType = <IObjectType> {};

            beforeEach(() => {

                appliance.applianceType = "MW";
                appliance.applianceSafetyType = ApplianceSafetyType.electrical;

                // mock catalogService methods
                electricalObjectType = <IObjectType> {
                    category: "A",
                    applianceType: "MW",
                    applianceTypeDescription: "MICROWAVE",
                    applianceSafetyNotRequiredIndicator: "N",
                    applianceCategory: "E",
                    useIaci: "N",
                    fetchGCCode: "N",
                    association: "",
                    associationNumber: 0,
                    allowCreateInField: "Y",
                    allowDeleteInField: "Y"
                };

                let getObjectTypeStub = catalogServiceStub.getObjectType = sandbox.stub();
                getObjectTypeStub.withArgs("MW").resolves(electricalObjectType);

            });

            describe("when job", () => {
                beforeEach(() => {

                });

                describe("is not a landlord job", () => {
                    beforeEach(() => {
                        job.isLandlordJob = false;
                    });

                    describe("and appliance is not linked to a task", () => {
                        beforeEach(() => {
                            job.tasks = [];
                        });

                        it("will not require any appliance details", (done) => {
                            appliance.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is Y", (done) => {
                            electricalObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceElectricalSafetyDetail.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is N", (done) => {
                            electricalObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceElectricalSafetyDetail.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will allow the user to clear the form and return the electrical appliance safety to dontCare", done => {
                            electricalObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceElectricalSafetyDetail = new ApplianceElectricalSafetyDetail();
                            appliance.safety.applianceElectricalSafetyDetail.dataStateId = "a";
                            appliance.safety.applianceElectricalSafetyDetail.dataStateGroup = "b";
                            appliance.safety.applianceElectricalSafetyDetail.systemType = "c";
                            appliance.safety.applianceElectricalSafetyDetail.electricalApplianceType = "d";

                            appliance.safety.applianceElectricalSafetyDetail.dataState = DataState.invalid;


                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toEqual(DataState.dontCare);
                                    done();
                                });

                        });
                        it("will not allow the appliance safety to go to dontCare if a property has been set", done => {
                            electricalObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceElectricalSafetyDetail = new ApplianceElectricalSafetyDetail();
                            appliance.safety.applianceElectricalSafetyDetail.dataStateId = "a";
                            appliance.safety.applianceElectricalSafetyDetail.dataStateGroup = "b";
                            appliance.safety.applianceElectricalSafetyDetail.systemType = "c";
                            appliance.safety.applianceElectricalSafetyDetail.electricalApplianceType = "d";

                            appliance.safety.applianceElectricalSafetyDetail.applianceFuseRating = "foo";
                            appliance.safety.applianceElectricalSafetyDetail.dataState = DataState.invalid;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toEqual(DataState.invalid);
                                    done();
                                });

                        });

                        it("will make the user revisit the appliance electrical safety screen if the system type is changed on the property screen", done => {
                            appliance.safety.applianceElectricalSafetyDetail = new ApplianceElectricalSafetyDetail();
                            appliance.safety.applianceElectricalSafetyDetail.dataStateId = "a";
                            appliance.safety.applianceElectricalSafetyDetail.dataStateGroup = "b";
                            appliance.safety.applianceElectricalSafetyDetail.systemType = "foo";
                            appliance.safety.applianceElectricalSafetyDetail.electricalApplianceType = "ELECTRICAL";

                            appliance.safety.applianceElectricalSafetyDetail.dataState = DataState.valid;

                            job.propertySafety = <PropertySafety> {
                                propertyElectricalSafetyDetail: {
                                    systemType: "bar"
                                }
                            }

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toEqual(DataState.notVisited);
                                    done();
                                });
                        });


                        it("will not make the user revisit the appliance electrical safety screen if the system type is not changed on the property screen", done => {
                            appliance.safety.applianceElectricalSafetyDetail = new ApplianceElectricalSafetyDetail();
                            appliance.safety.applianceElectricalSafetyDetail.dataStateId = "a";
                            appliance.safety.applianceElectricalSafetyDetail.dataStateGroup = "b";
                            appliance.safety.applianceElectricalSafetyDetail.systemType = "foo";
                            appliance.safety.applianceElectricalSafetyDetail.electricalApplianceType = "ELECTRICAL";

                            appliance.safety.applianceElectricalSafetyDetail.dataState = DataState.valid;

                            job.propertySafety = <PropertySafety> {
                                propertyElectricalSafetyDetail: {
                                    systemType: "foo"
                                }
                            }

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toEqual(DataState.valid);
                                    done();
                                });
                        })
                    });

                    describe("and appliance is linked to a task", () => {
                        beforeEach(() => {
                            let task = new Task(true, false);
                            task.applianceId = "1";
                            task.status = "D";

                            job.tasks = [task];

                            appliance.id = "1";
                        });

                        it("will require appliance details", (done) => {
                            appliance.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require appliance safety details if the applianceSafetyRequiredIndicator is N", (done) => {
                            electricalObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceElectricalSafetyDetail.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will require appliance safety details  if the applianceSafetyRequiredIndicator is Y", (done) => {
                            electricalObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceElectricalSafetyDetail.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                        it("will not allow the appliance safety to go to dontCare if safety is required", done => {
                            electricalObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceElectricalSafetyDetail = new ApplianceElectricalSafetyDetail();
                            appliance.safety.applianceElectricalSafetyDetail.dataStateId = "a";
                            appliance.safety.applianceElectricalSafetyDetail.dataStateGroup = "b";
                            appliance.safety.applianceElectricalSafetyDetail.systemType = "c";
                            appliance.safety.applianceElectricalSafetyDetail.electricalApplianceType = "d";

                            appliance.safety.applianceElectricalSafetyDetail.dataState = DataState.invalid;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toEqual(DataState.invalid);
                                    done();
                                });

                        });
                    });
                });

                describe("is a landlord job", () => {
                    beforeEach(() => {
                        job.isLandlordJob = true;
                    });

                    describe("and appliance is not linked to a task", () => {
                        beforeEach(() => {
                            job.tasks = [];
                        })

                        it("will not require any appliance details", (done) => {
                            appliance.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is Y", (done) => {
                            electricalObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceElectricalSafetyDetail.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is N", (done) => {
                            electricalObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceElectricalSafetyDetail.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                    });

                    describe("and appliance is linked to a task", () => {
                        beforeEach(() => {
                            let task = new Task(true, false);
                            task.applianceId = "1";
                            task.status = "D";

                            job.tasks = [task];

                            appliance.id = "1";
                        });

                        it("will require appliance details", (done) => {
                            appliance.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require appliance safety details if the applianceSafetyRequiredIndicator is N", (done) => {
                            electricalObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceElectricalSafetyDetail.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will require appliance safety details  if the applianceSafetyRequiredIndicator is Y", (done) => {
                            electricalObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceElectricalSafetyDetail.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceElectricalSafetyDetail.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                    });
                });
            });
        });

        describe("for a other appliance", () => {

            let otherObjectType = <IObjectType> {};

            beforeEach(() => {

                appliance.applianceType = "COD";
                appliance.applianceSafetyType = ApplianceSafetyType.other;

                // mock catalogService methods
                otherObjectType = <IObjectType> {
                    category: "A",
                    applianceType: "COD",
                    applianceTypeDescription: "CO DETECT",
                    applianceSafetyNotRequiredIndicator: "Y",
                    applianceCategory: "O",
                    useIaci: "N",
                    fetchGCCode: "N",
                    association: "",
                    associationNumber: 0,
                    allowCreateInField: "Y",
                    allowDeleteInField: "Y"
                };

                let getObjectTypeStub = catalogServiceStub.getObjectType = sandbox.stub();
                getObjectTypeStub.withArgs("COD").resolves(otherObjectType);

            });

            describe("when job", () => {
                beforeEach(() => {

                });

                describe("is not a landlord job", () => {
                    beforeEach(() => {
                        job.isLandlordJob = false;
                    });

                    describe("and appliance is not linked to a task", () => {
                        beforeEach(() => {
                            job.tasks = [];
                        });

                        it("will not require any appliance details", (done) => {
                            appliance.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is Y", (done) => {
                            otherObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceOtherSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceOtherSafety.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is N", (done) => {
                            otherObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceOtherSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceOtherSafety.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                    });

                    describe("and appliance is linked to a task", () => {
                        beforeEach(() => {
                            let task = new Task(true, false);
                            task.applianceId = "1";
                            task.status = "D";

                            job.tasks = [task];

                            appliance.id = "1";
                        });

                        it("will require appliance details", (done) => {
                            appliance.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require appliance safety details if the applianceSafetyRequiredIndicator is N", (done) => {
                            otherObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceOtherSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceOtherSafety.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will require appliance safety details  if the applianceSafetyRequiredIndicator is Y", (done) => {
                            otherObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceOtherSafety.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceOtherSafety.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                    });
                });

                describe("is a landlord job", () => {
                    beforeEach(() => {
                        job.isLandlordJob = true;
                    });

                    describe("and appliance is not linked to a task", () => {
                        beforeEach(() => {
                            job.tasks = [];
                        })

                        it("will not require any appliance details", (done) => {
                            appliance.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is Y", (done) => {
                            otherObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceOtherSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceOtherSafety.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require any appliance safety details if the applianceSafetyRequiredIndicator is N", (done) => {
                            otherObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceOtherSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceOtherSafety.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                    });

                    describe("and appliance is linked to a task", () => {
                        beforeEach(() => {
                            let task = new Task(true, false);
                            task.applianceId = "1";
                            task.status = "D";

                            job.tasks = [task];

                            appliance.id = "1";
                        });

                        it("will require appliance details", (done) => {
                            appliance.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will not require appliance safety details if the applianceSafetyRequiredIndicator is N", (done) => {
                            otherObjectType.applianceSafetyNotRequiredIndicator = "N";

                            appliance.safety.applianceOtherSafety.dataState = DataState.notVisited;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceOtherSafety.dataState).toEqual(DataState.dontCare);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });

                        it("will require appliance safety details  if the applianceSafetyRequiredIndicator is Y", (done) => {
                            otherObjectType.applianceSafetyNotRequiredIndicator = "Y";

                            appliance.safety.applianceOtherSafety.dataState = DataState.dontCare;

                            dataStateManager.updateApplianceDataState(appliance, job)
                                .then(() => {
                                    expect(appliance.safety.applianceOtherSafety.dataState).toEqual(DataState.notVisited);
                                    done();
                                })
                                .catch((error) => {
                                    fail("should not be here, error: " + error);
                                });
                        });
                    });
                });
            });
        });

    });

    describe("the updateAppliancesDataState function", () => {
        let job: Job;
        beforeEach(() => {
            job = <Job> {
                history: {
                    appliances:[
                    ]
                }
            };
        });

        it("will call the updateApplianceDataState function for each appliance in the job", done => {
            let appliance1 = <Appliance>{};
            let appliance2 = <Appliance>{isDeleted: true};
            job.history.appliances.push(appliance1, appliance2);

            let populateApplianceStub = dataStateManager.updateApplianceDataState = sandbox.stub().resolves(null);

            dataStateManager.updateAppliancesDataState(job)
                .then(() => {
                    expect(populateApplianceStub.calledWith(appliance1, job)).toBe(true);
                    expect(populateApplianceStub.calledWith(appliance2, job)).toBe(true);
                    done();
                });
        });

        it("will say the job is notVisited if there are no appliances", done => {
            dataStateManager.updateApplianceDataState = sandbox.stub().resolves(null);

            job.history.dataState = DataState.dontCare;
            dataStateManager.updateAppliancesDataState(job)
                .then(() => {
                    expect(job.history.dataState).toBe(DataState.notVisited);
                    done();
                });
        });

        it("will say the job is notVisited if there are no appliances that are not deleted", done => {
            let appliance1 = <Appliance>{isDeleted: true};
            let appliance2 = <Appliance>{isDeleted: true};
            job.history.appliances.push(appliance1, appliance2);

            dataStateManager.updateApplianceDataState = sandbox.stub().resolves(null);

            job.history.dataState = DataState.dontCare;
            dataStateManager.updateAppliancesDataState(job)
                .then(() => {
                    expect(job.history.dataState).toBe(DataState.notVisited);
                    done();
                });
        });

        it("will say the job is valid if there are appliances", done => {
            let appliance1 = <Appliance>{isDeleted: true};
            let appliance2 = <Appliance>{};
            job.history.appliances.push(appliance1, appliance2);

            dataStateManager.updateApplianceDataState = sandbox.stub().resolves(null);

            job.history.dataState = DataState.dontCare;
            dataStateManager.updateAppliancesDataState(job)
                .then(() => {
                    expect(job.history.dataState).toBe(DataState.valid);
                    done();
                });
        });

        it("will say the job is notVisited if there are no appliances that are not excluded", done => {
            let appliance1 = <Appliance>{isExcluded: true};
            let appliance2 = <Appliance>{isExcluded: true};
            job.history.appliances.push(appliance1, appliance2);

            dataStateManager.updateApplianceDataState = sandbox.stub().resolves(null);

            job.history.dataState = DataState.dontCare;
            dataStateManager.updateAppliancesDataState(job)
                .then(() => {
                    expect(job.history.dataState).toBe(DataState.notVisited);
                    done();
                });
        });

        it("will say the job is valid if there are appliances that are not excluded", done => {
            let appliance1 = <Appliance>{isExcluded: true};
            let appliance2 = <Appliance>{};
            job.history.appliances.push(appliance1, appliance2);

            dataStateManager.updateApplianceDataState = sandbox.stub().resolves(null);

            job.history.dataState = DataState.dontCare;
            dataStateManager.updateAppliancesDataState(job)
                .then(() => {
                    expect(job.history.dataState).toBe(DataState.valid);
                    done();
                });
        });
    });

    describe("the updatePropertySafetyDataState function", () => {
        it ("can switch a job from gas to electric when electrical is dontCare", () => {
            let job = <Job>{
                propertySafetyType: PropertySafetyType.electrical,
                propertySafety: {
                    propertyElectricalSafetyDetail: {
                        dataState: DataState.dontCare
                    },
                    propertyGasSafetyDetail: {
                        dataState: DataState.invalid
                    },
                }
            };

            dataStateManager.updatePropertySafetyDataState(job);

            expect(job.propertySafety.propertyElectricalSafetyDetail.dataState).toBe(DataState.notVisited);
            expect(job.propertySafety.propertyGasSafetyDetail.dataState).toBe(DataState.dontCare);
        });

        it ("can switch a job from gas to electric when electrical is invalid", () => {
            let job = <Job>{
                propertySafetyType: PropertySafetyType.electrical,
                propertySafety: {
                    propertyElectricalSafetyDetail: {
                        dataState: DataState.invalid
                    },
                    propertyGasSafetyDetail: {
                        dataState: DataState.invalid
                    },
                }
            };

            dataStateManager.updatePropertySafetyDataState(job);

            expect(job.propertySafety.propertyElectricalSafetyDetail.dataState).toBe(DataState.invalid);
            expect(job.propertySafety.propertyGasSafetyDetail.dataState).toBe(DataState.dontCare);
        });

        it ("can switch a job from electrical to gas when electrical is dontCare", () => {
            let job = <Job>{
                propertySafetyType: PropertySafetyType.gas,
                propertySafety: {
                    propertyElectricalSafetyDetail: {
                        dataState: DataState.invalid
                    },
                    propertyGasSafetyDetail: {
                        dataState: DataState.dontCare
                    },
                }
            };

            dataStateManager.updatePropertySafetyDataState(job);

            expect(job.propertySafety.propertyElectricalSafetyDetail.dataState).toBe(DataState.dontCare);
            expect(job.propertySafety.propertyGasSafetyDetail.dataState).toBe(DataState.notVisited);
        });

        it ("can switch a job from eletrical to gas when electrical is invalid", () => {
            let job = <Job>{
                propertySafetyType: PropertySafetyType.gas,
                propertySafety: {
                    propertyElectricalSafetyDetail: {
                        dataState: DataState.invalid
                    },
                    propertyGasSafetyDetail: {
                        dataState: DataState.invalid
                    },
                }
            };

            dataStateManager.updatePropertySafetyDataState(job);

            expect(job.propertySafety.propertyElectricalSafetyDetail.dataState).toBe(DataState.dontCare);
            expect(job.propertySafety.propertyGasSafetyDetail.dataState).toBe(DataState.invalid);
        });

        it("can set property safety to not visited if transitioning to landlord job and property safety is valid", () => {
            let job = <Job>{
                isLandlordJob: true,
                propertySafetyType: PropertySafetyType.gas,
                propertySafety: {
                    propertyGasSafetyDetail: {
                        dataState: DataState.valid
                    },
                }
            };

            dataStateManager.updatePropertySafetyDataState(job);

            expect(job.propertySafety.propertyGasSafetyDetail.dataState).toBe(DataState.notVisited);
        });

        it("can set property safety to not visited if transitioning to landlord job and property safety is invalid", () => {
            let job = <Job>{
                isLandlordJob: true,
                propertySafetyType: PropertySafetyType.gas,
                propertySafety: {
                    propertyGasSafetyDetail: {
                        dataState: DataState.invalid
                    },
                }
            };

            dataStateManager.updatePropertySafetyDataState(job);

            expect(job.propertySafety.propertyGasSafetyDetail.dataState).toBe(DataState.invalid);
        });
    });
});
