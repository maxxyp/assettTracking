/// <reference path="../../../../../typings/app.d.ts" />

import { ApplianceService } from "../../../../../app/hema/business/services/applianceService";
import { IJobService } from "../../../../../app/hema/business/services/interfaces/IJobService";
import { Job } from "../../../../../app/hema/business/models/job";
import { History } from "../../../../../app/hema/business/models/history";
import { Appliance } from "../../../../../app/hema/business/models/appliance";
import { Task } from "../../../../../app/hema/business/models/task";
import { ICatalogService } from "../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IBusinessRuleService } from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { QueryableBusinessRuleGroup } from "../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { ApplianceSafety } from '../../../../../app/hema/business/models/applianceSafety';
import { ApplianceElectricalSafetyDetail } from "../../../../../app/hema/business/models/applianceElectricalSafetyDetail";
import { ApplianceElectricalUnsafeDetail } from "../../../../../app/hema/business/models/applianceElectricalUnsafeDetail";
import { BusinessException } from "../../../../../app/hema/business/models/businessException";
import { IObjectType } from "../../../../../app/hema/business/models/reference/IObjectType";
import { BaseApplianceFactory } from "../../../../../app/hema/common/factories/baseApplianceFactory";
import { IBridgeBusinessService } from "../../../../../app/hema/business/services/interfaces/IBridgeBusinessService";
import { IStorageService } from "../../../../../app/hema/business/services/interfaces/IStorageService";
import { ApplianceGasSafety } from "../../../../../app/hema/business/models/applianceGasSafety";
import { IDataStateManager } from "../../../../../app/hema/common/IDataStateManager";
import { ITaskService } from "../../../../../app/hema/business/services/interfaces/ITaskService";
import { ExternalApplianceAppModel } from "../../../../../app/hema/business/models/adapt/externalApplianceAppModel";
import { AdaptCssClassConstants } from "../../../../../app/hema/presentation/constants/adaptCssClassConstants";
import { AdaptAvailabilityAttributeType } from "../../../../../app/hema/business/services/constants/adaptAvailabilityAttributeType";
import { ApplianceOperationType } from "../../../../../app/hema/business/models/applianceOperationType";

describe("the ApplianceService module", () => {
    let applianceService: ApplianceService;
    let sandbox: Sinon.SinonSandbox;
    let jobServiceStub: IJobService;
    let catalogServiceStub: ICatalogService;
    let businessRulesServiceStub: IBusinessRuleService;
    let getBusinessRuleStub: Sinon.SinonStub;
    let job: Job;
    let appliance: Appliance;

    let bridgeServiceStub: IBridgeBusinessService;
    let storageStub: IStorageService;
    let dataStateManagerStub: IDataStateManager;
    let taskServiceStub: ITaskService;
    let updateTaskApplianceSpy: Sinon.SinonSpy;
    let getApplianceStub: Sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        jobServiceStub = <IJobService>{};

        job = new Job();
        appliance = new Appliance();
        appliance.id = "1";
        appliance.applianceType = "GGG";

        job.history = new History();
        job.history.appliances = [appliance];
        job.tasks = [];
        jobServiceStub.getJob = sandbox.stub().returns(Promise.resolve(job));
        jobServiceStub.setJob = sandbox.stub().returns(Promise.resolve());

        catalogServiceStub = <ICatalogService>{};
        let gasAppCode = <IObjectType>{ applianceType: "GGG", applianceCategory: "G" };
        let elecAppCode = <IObjectType>{ applianceType: "EEE", applianceCategory: "E" };
        let otherAppCode = <IObjectType>{ applianceType: "OOO", applianceCategory: "O" };
        catalogServiceStub.getObjectTypes = sandbox.stub().returns(Promise.resolve([gasAppCode, elecAppCode, otherAppCode]));

        let ruleGroup = <QueryableBusinessRuleGroup>{};
        getBusinessRuleStub = ruleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("firstVisitCode").returns("FV");
        getBusinessRuleStub.withArgs("applianceMakeAndModelMaxChars").returns(10);
        getBusinessRuleStub.withArgs("removeCharactersDescription").returns("^(\\.+)");
        getBusinessRuleStub.withArgs("childApplianceIndicator").returns("foo");
        getBusinessRuleStub.withArgs("electricalWorkingSector").returns("PatchES");
        getBusinessRuleStub.withArgs("fullGcCodeLength").returns("7");

        let getBusinessRuleListStub = ruleGroup.getBusinessRuleList = sandbox.stub();
        getBusinessRuleListStub.withArgs("gasApplianceCategorySortOrder").returns(["G", "E", "O"]);
        getBusinessRuleListStub.withArgs("electricalApplianceCategorySortOrder").returns(["E", "G", "O"]);
        businessRulesServiceStub = <IBusinessRuleService>{};
        businessRulesServiceStub.getQueryableRuleGroup = sandbox.stub().returns(Promise.resolve(ruleGroup));

        let baseApplianceFactory = <BaseApplianceFactory>{};

        bridgeServiceStub = <IBridgeBusinessService>{};
        getApplianceStub = bridgeServiceStub.getApplianceInformation = sandbox.stub().resolves({});

        storageStub = <IStorageService>{};
        storageStub.getWorkingSector = sandbox.stub().resolves("foo");

        taskServiceStub = <ITaskService>{};
        updateTaskApplianceSpy = taskServiceStub.updateTaskAppliance = sandbox.stub().resolves(undefined);

        dataStateManagerStub = <IDataStateManager>{
            updateApplianceDataState: sandbox.stub().resolves(null),
            updateAppliancesDataState: sandbox.stub().resolves(null),
            updatePropertySafetyDataState: sandbox.stub()
        };

        applianceService = new ApplianceService(jobServiceStub, catalogServiceStub, businessRulesServiceStub, baseApplianceFactory,
            // todo: just placeholders til Faisal does the unit tests. Faisal? Faisal! Come back Faisal!!
            bridgeServiceStub, storageStub, dataStateManagerStub, taskServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(applianceService).toBeDefined();
    });

    describe("isFullGcCode", () => {

        it("returns false for empty gcCode", done => {
            applianceService.isFullGcCode(null).then(isFullGcCode => {
                expect(isFullGcCode).toBe(false);
                done();
            });
        });

        it("returns false for non-full gcCode", done => {
            applianceService.isFullGcCode("123456").then(isFullGcCode => {
                expect(isFullGcCode).toBe(false);
                done();
            });
        });

        it("returns true for a full gcCode", done => {
            applianceService.isFullGcCode("1234567").then(isFullGcCode => {
                expect(isFullGcCode).toBe(true);
                done();
            });
        });
    });
    describe("getAppliance", () => {

        it("can be called and return appliance", (done) => {
            applianceService.getAppliance("0", "1").then((app) => {
                expect(app).toEqual(appliance);
                done();
            });
        });

        it("can be called and error when appliance id does not exist", (done) => {
            applianceService.getAppliance("0", "2").catch((err) => {
                done();
            });
        });
    });

    describe("getAppliances", () => {

        it("can be called and return appliances", (done) => {
            applianceService.getAppliances("0").then((appliances) => {
                expect(appliances).toEqual([appliance]);
                done();
            });
        });

        it("can be called and ignore deleted appliances", (done) => {
            appliance.isDeleted = true;
            applianceService.getAppliances("0").then((appliances) => {
                expect(appliances).toEqual([]);
                done();
            });
        });

        it("can be called and reject when jobService errors", (done) => {
            jobServiceStub.getJob = sandbox.stub().returns(Promise.reject(null));
            applianceService.getAppliances("0").catch((err) => {
                done();
            });
        });

        describe("sanitise appliance", () => {

            let app0: Appliance;

            beforeEach(() => {

                app0 = <Appliance>{};
                app0.id = "0";
                app0.applianceType = "EEE";
                app0.description = ".unknown";

                job.history.appliances = [app0];
            });

            it("removes trailing dot from description, this is for first visit jobs", (done) => {

                applianceService.getAppliances("0").then(appliances => {
                    expect(appliances[0].description).toEqual("unknown"); // should change '.unknown' to 'unknown'
                    done();
                });
            });
        });

        describe("appliance sorting", () => {

            let app0: Appliance,
                app1: Appliance,
                app2: Appliance,
                app3: Appliance,
                app4: Appliance;

            beforeEach(() => {
                app0 = <Appliance>{};
                app0.id = "0";
                app0.applianceType = "EEE";

                app1 = <Appliance>{};
                app1.id = "1";
                app1.applianceType = "OOO";

                app2 = <Appliance>{};
                app2.id = "2";
                app2.applianceType = "GGG";

                app3 = <Appliance>{};
                app3.id = "3";
                app3.applianceType = "OOO";

                app4 = <Appliance>{};
                app4.id = "4";
                app4.applianceType = "EEE";

                let task1 = <Task>{};
                task1.id = "9999002";
                task1.applianceId = "3";

                let task2 = <Task>{};
                task2.id = "9999001";
                task2.applianceId = "4";

                job.tasks = [task1, task2];
                job.history.appliances = [app0, app1, app2, app3, app4];
            });

            it("can be called for a gas job and sort appliances by involvement by task, then category", (done) => {
                storageStub.getWorkingSector = sandbox.stub().resolves("PatchGas");

                applianceService.getAppliances("0").then((appliances) => {
                    expect(appliances).toEqual([
                        app4,   // is involved in today's work, first task
                        app3,   // is involved in today's work, second task
                        app2,   // not involved in today's work, category G
                        app0,   // not involved in today's work, category E
                        app1    // not involved in today's work, category O
                    ]);
                    done();
                });
            });

            it("can be called for an electrical job and sort appliances by involvement by task, then category", (done) => {
                storageStub.getWorkingSector = sandbox.stub().resolves("PatchES");

                applianceService.getAppliances("0").then((appliances) => {
                    expect(appliances).toEqual([
                        app4,   // is involved in today's work, first task
                        app3,   // is involved in today's work, second task
                        app0,   // not involved in today's work, category E
                        app2,   // not involved in today's work, category G
                        app1    // not involved in today's work, category O
                    ]);
                    done();
                });
            });
        });

        describe("appliance sorting with parent/child pairs", () => {

            let app0: Appliance,
                app1: Appliance,
                app2: Appliance;

            beforeEach(() => {
                app0 = <Appliance>{};
                app0.id = "0";
                app0.applianceType = "GGG";
                app0.childId = "2";

                app1 = <Appliance>{};
                app1.id = "1";
                app1.applianceType = "GGG";

                app2 = <Appliance>{};
                app2.id = "2";
                app2.applianceType = "GGG";
                app2.parentId = "0";

            });

            it("can sort with parent then child if parent is listed first", (done) => {

                let task1 = <Task>{};
                task1.id = "9999002";
                task1.applianceId = "0";
                job.tasks = [task1];

                job.history.appliances = [app0, app1, app2];
                applianceService.getAppliances("0").then((appliances) => {
                    expect(appliances).toEqual([
                        app0,   // is today's appliance
                        app2,   // is the child of today's appliance
                        app1    // not involved in today's work
                    ]);
                    done();
                });
            });

            it("can sort with parent then child if child is listed first", (done) => {

                let task1 = <Task>{};
                task1.id = "9999002";
                task1.applianceId = "0";
                job.tasks = [task1];

                job.history.appliances = [app0, app1, app2];
                applianceService.getAppliances("0").then((appliances) => {
                    expect(appliances).toEqual([
                        app0,   // is today's appliance
                        app2,   // is the child of today's appliance
                        app1    // not involved in today's work
                    ]);
                    done();
                });
            });

            it("can sort with parent then child if child is today's appliance", (done) => {

                let task1 = <Task>{};
                task1.id = "9999002";
                task1.applianceId = "2";
                job.tasks = [task1];

                job.history.appliances = [app0, app1, app2];
                applianceService.getAppliances("0").then((appliances) => {
                    expect(appliances).toEqual([
                        app0,   // is parent of today's appliance
                        app2,   // is today's appliance
                        app1    // not involved in today's work
                    ]);
                    done();
                });
            });

        });

    });

    describe("createAppliance", () => {
        it("can save a new appliance", done => {
            let newAppliance = <Appliance>{};
            applianceService.createAppliance("1", newAppliance).then(() => {
                expect(job.history.appliances.find(a => a === newAppliance)).toBe(newAppliance);
                done();
            });
        });

        it("can save a new appliance if job history does not exist", done => {
            let newAppliance = <Appliance>{};
            job.history = null;
            applianceService.createAppliance("1", newAppliance).then(() => {
                expect(job.history.appliances.find(a => a === newAppliance)).toBe(newAppliance);
                expect((dataStateManagerStub.updateAppliancesDataState as Sinon.SinonStub).calledWith(job)).toBe(true);
                done();
            });
        });

        it("can save a new appliance if job history appliances does not exist", done => {
            let newAppliance = <Appliance>{};
            job.history.appliances = null;
            applianceService.createAppliance("1", newAppliance).then(() => {
                expect(job.history.appliances.find(a => a === newAppliance)).toBe(newAppliance);
                expect((dataStateManagerStub.updateAppliancesDataState as Sinon.SinonStub).calledWith(job)).toBe(true);
                done();
            });
        });
    });

    describe("updateAppliance", () => {
        it("can save an existing appliance and call populateApplianceDataState, updateAdaptMakeAndModel", done => {
            let incomingAppliance = <Appliance>{ id: "1", description: "abc", gcCode: "123456" };
            incomingAppliance.safety = <ApplianceSafety>{};
            incomingAppliance.safety.applianceGasSafety = <ApplianceGasSafety>{};

            let spyOnAdaptSync = sandbox.spy(applianceService, "ensureAdaptInformationIsSynced");

            applianceService.updateAppliance("1", incomingAppliance, true, true).then(() => {
                expect(job.history.appliances.find(a => a.id === "1").description).toBe("abc");
                expect((dataStateManagerStub.updateApplianceDataState as Sinon.SinonStub).called).toBe(true);
                expect(spyOnAdaptSync.called).toBe(true);
                done();
            });
        });

        it("can save an existing appliance and not call updateAdaptMakeAndModel", done => {
            let incomingAppliance = <Appliance>{ id: "1", description: "abc", gcCode: "123456" };
            incomingAppliance.safety = <ApplianceSafety>{};
            incomingAppliance.safety.applianceGasSafety = <ApplianceGasSafety>{};

            let spyOnAdaptSync = sandbox.spy(applianceService, "ensureAdaptInformationIsSynced");

            applianceService.updateAppliance("1", incomingAppliance, true, false).then(() => {
                expect(job.history.appliances.find(a => a.id === "1").description).toBe("abc");
                expect((dataStateManagerStub.updateApplianceDataState as Sinon.SinonStub).called).toBe(true);
                expect(spyOnAdaptSync.called).toBe(false);
                done();
            });
        });
    });

    describe("deleteAppliance", () => {
        it("can delete an existing appliance and call populateDataState", done => {
            job.history.appliances.push(<Appliance>{ id: "2" });
            applianceService.deleteOrExcludeAppliance("0", "1", ApplianceOperationType.delete)
                .then(() => applianceService.getAppliances("0"))
                .then((appliances) => {
                    expect(appliances.length).toBe(1);
                    expect(appliances[0].id).toBe("2");
                    const deletedAppliance = job.history.appliances.find(a => a.id === "1");
                    expect(deletedAppliance.isDeleted).toBeTruthy();
                    expect((dataStateManagerStub.updateAppliancesDataState as Sinon.SinonStub).args[0][0]).toBe(job);
                    done();
                });
        });

        it("can delete an existing appliance and leave appliances empty and call populateDataState", done => {
            applianceService.deleteOrExcludeAppliance("0", "1", ApplianceOperationType.delete)
                .then(() => applianceService.getAppliances("0"))
                .then((appliances) => {
                    expect(appliances.length).toBe(0);
                    const deletedAppliance = job.history.appliances.find(a => a.id === "1");
                    expect(deletedAppliance.isDeleted).toBeTruthy();
                    expect((dataStateManagerStub.updateAppliancesDataState as Sinon.SinonStub).args[0][0]).toBe(job);
                    done();
                });
        });
    });

    describe("getApplianceSafetyDetails", () => {
        let applianceSafety: ApplianceSafety;

        beforeEach(() => {
            appliance = new Appliance();
            applianceSafety = new ApplianceSafety();
            appliance.safety = applianceSafety;

            applianceService.getAppliance = sandbox.stub().returns(Promise.resolve(appliance));
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can get appliance safety details", (done) => {
            applianceService.getApplianceSafetyDetails("0", "1")
                .then((appSafety) => {
                    expect(appSafety).toEqual(applianceSafety);
                    done();
                })
                .catch((error) => {
                    fail("should not be here: " + error);
                    done();

                });
        });

    });

    describe("saveElectricalSafetyDetails", () => {
        let applianceSafety: ApplianceSafety;
        let applianceSafetyDetail: ApplianceElectricalSafetyDetail;
        let applianceUnsafeDetail: ApplianceElectricalUnsafeDetail;

        beforeEach(() => {
            applianceSafetyDetail = new ApplianceElectricalSafetyDetail();
            applianceUnsafeDetail = new ApplianceElectricalUnsafeDetail();

            applianceSafety = new ApplianceSafety();
            applianceSafety.applianceElectricalSafetyDetail = applianceSafetyDetail;
            applianceSafety.applianceElectricalUnsafeDetail = applianceUnsafeDetail;

            appliance = new Appliance();
            appliance.safety = applianceSafety;

            applianceService.getAppliance = sandbox.stub().returns(Promise.resolve(appliance));
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can throw when appliance not found", done => {

            applianceService.getAppliance = sandbox.stub().returns(Promise.resolve(null));

            applianceService.saveElectricalSafetyDetails("1", "2", applianceSafetyDetail, applianceUnsafeDetail, true)
                .then(() => {
                    fail("should not be here");
                    done();
                })
                .catch((error) => {
                    expect(error instanceof BusinessException).toBe(true);
                    done();
                });
        });

        it("can save electrical appliance safety", done => {

            let methodSpy: Sinon.SinonSpy = applianceService.updateAppliance = sandbox.stub().returns(Promise.resolve());

            applianceService.saveElectricalSafetyDetails("1", "2", applianceSafetyDetail, applianceUnsafeDetail, true)
                .then(() => {
                    expect(methodSpy.calledOnce).toBe(true);
                    expect(methodSpy.args[0][1].safety.applianceElectricalSafetyDetail).toEqual(applianceSafetyDetail);
                    expect(methodSpy.args[0][1].safety.applianceElectricalUnsafeDetail).toEqual(applianceUnsafeDetail);
                    done();
                })
                .catch((error) => {
                    fail("should not be here: " + error);
                    done();
                });
        });
    });

    describe("replaceAppliace", () => {
        it("should replace old appliance with new appliance", done => {
            let newAppliance = <Appliance>{ id: "A2", applianceType: "CHB" };
            let oldAppliance = <Appliance>{ id: "A1", applianceType: "CHB", isDeleted: false };
            job.id = "11";
            job.tasks = [<Task> {id: "T1", applianceId: "A1"}];
            job.history = <History>{ appliances: [oldAppliance] };

            applianceService.replaceAppliance("11", newAppliance, oldAppliance.id).then(() => {
                expect(job.history.appliances.find(a => a === newAppliance)).toBe(newAppliance);
                expect(job.history.appliances.find(a => a.id === oldAppliance.id).isDeleted).toBe(true);
                expect(updateTaskApplianceSpy.calledWith("11", "T1", "CHB", "A2", undefined, undefined));
                done();
            });
        });

        it("an old appliance should be replaced with the new one and the related tasks should be linked to new appliance", done => {
            let newAppliance = <Appliance>{ id: "A2", applianceType: "CHB" };
            let oldAppliance = <Appliance>{ id: "A1", applianceType: "CHB", isDeleted: false };
            let testAppliance = <Appliance>{ id: "A3", applianceType: "FRE", isDeleted: false };
            job.id = "11";
            job.tasks = [<Task> {id: "T1", applianceId: "A1"},
                        <Task> {id: "T2", applianceId: "A1"},
                        <Task> {id: "T3", applianceId: "A3"}];
            job.history = <History>{ appliances: [oldAppliance, testAppliance] };

            applianceService.replaceAppliance("11", newAppliance, oldAppliance.id).then(() => {
                expect(job.history.appliances.find(a => a === newAppliance)).toBe(newAppliance);
                expect(job.history.appliances.find(a => a.id === oldAppliance.id).isDeleted).toBe(true);
                expect(updateTaskApplianceSpy.calledWith("11", "T1", "CHB", "A2", undefined, undefined));
                expect(updateTaskApplianceSpy.calledWith("11", "T2", "CHB", "A2", undefined, undefined));
                done();
            });
        });

        it("it should update isDeleted flag on the old parent & child appliance", done => {
            let newParentAppliance = <Appliance>{ id: "P2", applianceType: "BBF", childId: "C2" };
            let oldParentAppliance = <Appliance>{ id: "P1", applianceType: "BBF", isDeleted: false, childId: "C1" };
            let oldChildAppliance = <Appliance>{ id: "C1", applianceType: "FRB", isDeleted: false, parentId: "P1" };
            job.id = "11";
            job.tasks = [<Task> {id: "T1", applianceId: "P1"},
                        <Task> {id: "T2", applianceId: "A1"}];
            job.history = <History>{ appliances: [oldParentAppliance, oldChildAppliance] };

            applianceService.replaceAppliance("11", newParentAppliance, oldParentAppliance.id).then(() => {
                expect(job.history.appliances.find(a => a.id === oldParentAppliance.id).isDeleted).toBe(true);
                expect(job.history.appliances.find(a => a.id === oldChildAppliance.id).isDeleted).toBe(true);
                done();
            });
        });
    });

    describe("excludeAppliance", () => {
        it("should update the isExcluded flag on the excluded appliance object", done => {
            let appliance1 = <Appliance>{ id: "A1", applianceType: "CHB" };
            let appliance2 = <Appliance>{ id: "A2", applianceType: "CHB" };
            job.id = "11";
            job.history = <History>{ appliances: [appliance1, appliance2] };

            applianceService.deleteOrExcludeAppliance("11", "A2", ApplianceOperationType.exclude).then(() => {
                expect(job.history.appliances.find(a => a.id === "A1").isExcluded).toBeUndefined();
                expect(job.history.appliances.find(a => a.id === "A2").isExcluded).toBe(true);
                expect((dataStateManagerStub.updateAppliancesDataState as Sinon.SinonStub).called).toBeTruthy();
                expect((dataStateManagerStub.updateAppliancesDataState as Sinon.SinonStub).args[0][0]).toBe(job);
                expect((dataStateManagerStub.updatePropertySafetyDataState as Sinon.SinonStub).called).toBeTruthy();
                expect((jobServiceStub.setJob as Sinon.SinonStub).calledWith(job)).toBeTruthy();
                done();
            });
        });
    });

    describe("getAppliancesForLandlordsCertificate", () => {
            let app1: Appliance,
                app2: Appliance,
                app3: Appliance,
                app4: Appliance;

            beforeEach(() => {
                app1 = <Appliance>{};
                app1.id = "1";
                app1.applianceType = "OOO";

                app2 = <Appliance>{};
                app2.id = "2";
                app2.applianceType = "GGG";

                app3 = <Appliance>{};
                app3.id = "3";
                app3.applianceType = "OOO";

                app4 = <Appliance>{};
                app4.id = "4";
                app4.applianceType = "EEE";

                let task1 = <Task>{};
                task1.id = "9999002";
                task1.applianceId = "3";

                let task2 = <Task>{};
                task2.id = "9999001";
                task2.applianceId = "4";

                job.id = "11111";
                job.tasks = [task1, task2];
                job.history.appliances = [app1, app2, app3, app4];
                storageStub.getWorkingSector = sandbox.stub().resolves("PatchGas");
            });

            it("should return all the appliances", async (done) => {
                app1.isSafetyRequired = true;
                app2.isSafetyRequired = true;
                app3.isSafetyRequired = true;
                app4.isSafetyRequired = true;
                app1.isExcluded = false;

                let appliances = await applianceService.getAppliancesForLandlordsCertificate("11111");
                expect(appliances.length).toEqual(4);
                done();
            });

            it("should return all the appliances except the excluded appliance", async (done) => {
                app1.isSafetyRequired = true;
                app2.isSafetyRequired = true;
                app3.isSafetyRequired = true;
                app4.isSafetyRequired = true;
                app1.isExcluded = true;

                let appliances = await applianceService.getAppliancesForLandlordsCertificate("11111");
                expect(appliances.some(a => a.id === "1")).toBeFalsy();
                expect(appliances.length).toEqual(3);
                done();
            });

    });

    describe("ensureAdaptInformationIsSynced", () => {
        it("can set set safety notice", async done => {
            appliance.gcCode = "1234567";
            getApplianceStub.withArgs("1234567").resolves(<ExternalApplianceAppModel>{
                foundInAdapt: true,
                safetyNotice: true
            });

            await applianceService.ensureAdaptInformationIsSynced("1");

            expect(appliance.headerIcons.some(icon => icon.iconClassName === AdaptCssClassConstants.SAFETY_ISSUE)).toBe(true);
            done();
        });

        it("can set availability status folio", async done => {
            appliance.gcCode = "1234567";
            getApplianceStub.withArgs("1234567").resolves(<ExternalApplianceAppModel>{
                foundInAdapt: true,
                availabilityStatus: AdaptAvailabilityAttributeType.FOLIO
            });

            await applianceService.ensureAdaptInformationIsSynced("1");

            expect(appliance.headerIcons.some(icon => icon.iconClassName === AdaptCssClassConstants.FOLIO)).toBe(true);
            done();
        });

        it("can set availability status withdrawn", async done => {
            appliance.gcCode = "1234567";
            getApplianceStub.withArgs("1234567").resolves(<ExternalApplianceAppModel>{
                foundInAdapt: true,
                availabilityStatus: AdaptAvailabilityAttributeType.WITHDRAWN
            });

            await applianceService.ensureAdaptInformationIsSynced("1");

            expect(appliance.headerIcons.some(icon => icon.iconClassName === AdaptCssClassConstants.WITHDRAWN)).toBe(true);
            done();
        });

        it("can set availability status reduced parts list", async done => {
            appliance.gcCode = "1234567";
            getApplianceStub.withArgs("1234567").resolves(<ExternalApplianceAppModel>{
                foundInAdapt: true,
                availabilityStatus: AdaptAvailabilityAttributeType.REDUCED_PARTS_LIST
            });

            await applianceService.ensureAdaptInformationIsSynced("1");

            expect(appliance.headerIcons.some(icon => icon.iconClassName === AdaptCssClassConstants.RESTRICTED)).toBe(true);
            done();
        });

        it("can set availability status service listed", async done => {
            appliance.gcCode = "1234567";
            getApplianceStub.withArgs("1234567").resolves(<ExternalApplianceAppModel>{
                foundInAdapt: true,
                availabilityStatus: AdaptAvailabilityAttributeType.SERVICE_LISTED
            });

            await applianceService.ensureAdaptInformationIsSynced("1");

            expect(appliance.headerIcons.some(icon => icon.iconClassName === AdaptCssClassConstants.SERVICE_LISTED)).toBe(true);
            done();
        });

        it("can set ceased", async done => {
            appliance.gcCode = "1234567";
            getApplianceStub.withArgs("1234567").resolves(<ExternalApplianceAppModel>{
                foundInAdapt: true,
                ceased: true
            });

            await applianceService.ensureAdaptInformationIsSynced("1");

            expect(appliance.headerIcons.some(icon => icon.iconClassName === AdaptCssClassConstants.CEASED)).toBe(true);
            done();
        });

        it("can set error if not found", async done => {
            appliance.gcCode = "1234567";
            getApplianceStub.withArgs("1234567").resolves(<ExternalApplianceAppModel>{
                foundInAdapt: false
            });

            await applianceService.ensureAdaptInformationIsSynced("1");

            expect(appliance.headerIcons.some(icon => icon.iconClassName === AdaptCssClassConstants.ERROR_ADAPT)).toBe(true);
            done();
        });

        it("can set error if bridge errors", async done => {
            appliance.gcCode = "1234567";
            getApplianceStub.withArgs("1234567").throws();
            await applianceService.ensureAdaptInformationIsSynced("1");

            expect(appliance.headerIcons.some(icon => icon.iconClassName === AdaptCssClassConstants.ERROR_ADAPT)).toBe(true);
            done();
        });

        it("can not try again once adpart info is known", async done => {
            appliance.gcCode = "1234567";
            getApplianceStub.withArgs("1234567").resolves(<ExternalApplianceAppModel>{
                foundInAdapt: true
            });

            await applianceService.ensureAdaptInformationIsSynced("1");
            expect(getApplianceStub.callCount).toBe(1);
            await applianceService.ensureAdaptInformationIsSynced("1");
            expect(getApplianceStub.callCount).toBe(1);
            done();
        });

        it("can not try again once adpart info has errored", async done => {
            appliance.gcCode = "1234567";
            getApplianceStub.withArgs("1234567").throws();

            await applianceService.ensureAdaptInformationIsSynced("1");
            expect(getApplianceStub.callCount).toBe(1);
            await applianceService.ensureAdaptInformationIsSynced("1");
            expect(getApplianceStub.callCount).toBe(1);
            done();
        });

        it("can clear if gc is not valid", async done => {
            appliance.gcCode = "1234567";
            getApplianceStub.withArgs("1234567").resolves(<ExternalApplianceAppModel>{
                foundInAdapt: true,
                safetyNotice: true
            });

            await applianceService.ensureAdaptInformationIsSynced("1");
            expect(appliance.headerIcons.length).toBe(1);
            appliance.gcCode = "123456";
            await applianceService.ensureAdaptInformationIsSynced("1");
            expect(appliance.headerIcons.length).toBe(0);
            done();
        });

        it("can try again if gc code is changed", async done => {
            appliance.gcCode = "1234567";
            getApplianceStub.withArgs("1234567").resolves(<ExternalApplianceAppModel>{
                foundInAdapt: true,
                availabilityStatus: AdaptAvailabilityAttributeType.FOLIO
            });
            getApplianceStub.withArgs("1234568").resolves(<ExternalApplianceAppModel>{
                foundInAdapt: true,
                availabilityStatus: AdaptAvailabilityAttributeType.WITHDRAWN
            });

            await applianceService.ensureAdaptInformationIsSynced("1");

            expect(appliance.headerIcons.some(icon => icon.iconClassName === AdaptCssClassConstants.FOLIO)).toBe(true);

            appliance.gcCode = "1234568";
            await applianceService.ensureAdaptInformationIsSynced("1");

            expect(appliance.headerIcons.some(icon => icon.iconClassName === AdaptCssClassConstants.WITHDRAWN)).toBe(true);
            done();
        });

        it("can set make and model" , async done => {
            appliance.gcCode = "1234567";
            getApplianceStub.withArgs("1234567").resolves(<ExternalApplianceAppModel>{
                foundInAdapt: true,
                manufacturer: "foo",
                description: "bar"
            });

            await applianceService.ensureAdaptInformationIsSynced("1");

            expect(appliance.safety.applianceGasSafety.applianceMake).toBe("foo");
            expect(appliance.safety.applianceGasSafety.applianceModel).toBe("bar");
            done();
        });

        it("can fall back to appliance description " , async done => {
            appliance.gcCode = "1234567";
            appliance.description = "0123456789ABC";

            getApplianceStub.withArgs("1234567").resolves(<ExternalApplianceAppModel>{
                foundInAdapt: true,
                manufacturer: "foo",
                description: undefined
            });

            await applianceService.ensureAdaptInformationIsSynced("1");

            expect(appliance.safety.applianceGasSafety.applianceModel).toBe("0123456789");

            done();
        });

        it("can not get data for a deleted appliance " , async done => {
            appliance.gcCode = "1234567";
            appliance.isDeleted = true;
            getApplianceStub.withArgs("1234567").resolves(<ExternalApplianceAppModel>{
                foundInAdapt: true,
                safetyNotice: true
            });

            await applianceService.ensureAdaptInformationIsSynced("1");

            expect((getApplianceStub as Sinon.SinonStub).called).toBe(false);
            done();
        });
    });

    // when these tests are reinstated, there needs to be a test to:
    // ---assert that if the appliance is linked to multiple tasks then it will be de-linked from all when deleted
    // ---assert that getAppliancesForLandlordsCertificate calls getAppliances
    // ---assert that getAppliancesForLandlordsCertificate filters isSafetyRequired && isInstPremAppliance
    // ---assert that getAppliancesForLandlordsCertificate results in appliances and defects of the same length
});
