import { Router } from "aurelia-router";
import { EventAggregator } from "aurelia-event-aggregator";
import { BindingEngine, Container } from "aurelia-framework";
import { IApplianceService } from "../../../../../../app/hema/business/services/interfaces/IApplianceService";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { IValidationService } from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { OtherSafety } from "../../../../../../app/hema/presentation/modules/appliances/otherSafety";
import { Appliance } from "../../../../../../app/hema/business/models/appliance";
import { ApplianceSafety } from "../../../../../../app/hema/business/models/applianceSafety";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { DialogService, DialogResult } from "aurelia-dialog";
import { YesNoNa } from "../../../../../../app/hema/business/models/yesNoNa";
import { ApplianceOtherSafetyFactory } from "../../../../../../app/hema/presentation/factories/applianceOtherSafetyFactory";
import { ApplianceOtherSafety } from "../../../../../../app/hema/business/models/applianceOtherSafety";
import { ApplianceOtherUnsafeDetail } from "../../../../../../app/hema/business/models/applianceOtherUnsafeDetail";
import { OtherSafetyViewModel } from "../../../../../../app/hema/presentation/modules/appliances/viewModels/otherSafetyViewModel";
import { ValidationService } from "../../../../../../app/hema/business/services/validationService";
import { TaskQueue } from "aurelia-task-queue";
import { ApplianceSafetyType } from "../../../../../../app/hema/business/models/applianceSafetyType";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { Job } from "../../../../../../app/hema/business/models/job";
import { Task } from "../../../../../../app/hema/business/models/task";

// property changed events get scheduled in aurelia. Queue a microtask as everything is handled in FIFO so we
// get a gurenteed callback when the property changed handler has been applied.
function propertyChangedAssertHelper(viewModel: any, propertyName: string, callback: (actual: any) => void) {
    let taskQueue: TaskQueue = Container.instance.get(TaskQueue);
    taskQueue.queueMicroTask(() => {
        let actualValue = viewModel[propertyName];
        callback && callback(actualValue);
    });
}

describe("the OtherSafety module", () => {
    let otherSafety: OtherSafety;
    let sandbox: Sinon.SinonSandbox;

    let labelServiceStub: ILabelService;
    let applianceServiceStub: IApplianceService;
    let routerStub: Router;
    let eventAggregator: EventAggregator;
    let dialogServiceStub: DialogService;
    let catalogServiceStub: ICatalogService;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let validationService: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let bindingEngine: BindingEngine;
    let applianceOtherSafetyFactoryStub: ApplianceOtherSafetyFactory;

    let showContentSpy: Sinon.SinonSpy;
    let applianceStub: Appliance;

    beforeEach((done) => {
        sandbox = sinon.sandbox.create();
        applianceServiceStub = <IApplianceService>{};
        routerStub = <Router>{};
        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sinon.stub().returns(Promise.resolve(null));
        bindingEngine = Container.instance.get(BindingEngine);
        applianceOtherSafetyFactoryStub = <ApplianceOtherSafetyFactory>{};

        catalogServiceStub = <ICatalogService>{};
        catalogServiceStub.getSafetyActions = sandbox.stub().resolves([]);
        catalogServiceStub.getSafetyNoticeTypes = sandbox.stub().resolves([]);
        catalogServiceStub.getSafetyNoticeStatuses = sandbox.stub().resolves([]);
        catalogServiceStub.getPerformanceTestReasons = sandbox.stub().resolves([]);
        catalogServiceStub.getValidations = sandbox.stub().resolves([]);

        eventAggregator = <EventAggregator>{};
        eventAggregator.publish = sandbox.stub();

        jobServiceStub = <IJobService>{};
        let job = new Job();
        let task = new Task(true, false);
        task.status = "NA";
        job.tasks = [task];
        job.isLandlordJob = true;
        jobServiceStub.getJob = sandbox.stub().resolves(job);

        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);

        businessRuleServiceStub = <IBusinessRuleService>{};

        let businessRuleGroup = {
            "unsafeToastDismissTime": 3
        };

        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(businessRuleGroup);

        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};

        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("notDoingJobStatuses").returns("NA");
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        applianceStub = new Appliance();
        applianceStub.safety = <ApplianceSafety>{};
        applianceStub.safety.applianceOtherSafety = <ApplianceOtherSafety>{};
        applianceStub.safety.applianceOtherUnsafeDetail = <ApplianceOtherUnsafeDetail>{};
        applianceServiceStub.getAppliance = sandbox.stub().resolves(applianceStub);

        let applianceOtherUnsafeDetail = new ApplianceOtherUnsafeDetail();
        applianceOtherUnsafeDetail.cappedTurnedOff = "";
        applianceOtherUnsafeDetail.conditionAsLeft = "";
        applianceOtherUnsafeDetail.labelAttachedRemoved = "";
        applianceOtherUnsafeDetail.letterLeft = false;
        applianceOtherUnsafeDetail.ownedByCustomer = false;
        applianceOtherUnsafeDetail.report = "";
        applianceOtherUnsafeDetail.signatureObtained = false;

        applianceOtherSafetyFactoryStub.createApplianceOtherUnsafeViewModel = sandbox.stub().returns(applianceOtherUnsafeDetail);

        let applianceOtherSafety = new OtherSafetyViewModel();
        applianceOtherSafety.workedOnAppliance = undefined;
        applianceOtherSafety.isApplianceSafe = undefined;
        applianceOtherSafety.toCurrentStandards = undefined;
        applianceOtherSafety.didYouVisuallyCheck = undefined;

        applianceOtherSafetyFactoryStub.createApplianceOtherSafetyViewModel = sandbox.stub().returns(applianceOtherSafety);

        dialogServiceStub = <DialogService>{};
        let dialogResult: DialogResult = new DialogResult(false, "");
        dialogServiceStub.open = sandbox.stub().resolves(dialogResult);

        validationService = new ValidationService(catalogServiceStub, labelServiceStub);

        otherSafety = new OtherSafety(jobServiceStub, engineerServiceStub, labelServiceStub, applianceServiceStub, routerStub,
            eventAggregator, dialogServiceStub, validationService, businessRuleServiceStub, catalogServiceStub, bindingEngine, applianceOtherSafetyFactoryStub);

        otherSafety.showContent = showContentSpy = sandbox.spy();

        otherSafety.labels = {
            "no": "",
            "yes": "",
            "na": "",
            "unsafeSituation": "",
            "didYouVisuallyCheck": "",
            "isApplianceSafe": "",
            "toCurrentStandards": "toCurrentStandards"
        };

        otherSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => done());
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(otherSafety).toBeDefined();
    });

    describe("canActivateAsync", () => {
        it("can continue with correct applianceType", done => {
            applianceStub.applianceSafetyType = ApplianceSafetyType.other;
            otherSafety.canActivateAsync({ applianceId: "1", jobId: "1" }, { settings: { applianceSafetyType: ApplianceSafetyType.other } })
                .then(result => {
                    expect(result).toBe(true);
                    done();
                });
        });

        it("can not continue with incorrect applianceType", done => {
            applianceStub.applianceSafetyType = ApplianceSafetyType.electrical;
            otherSafety.canActivateAsync({ applianceId: "1", jobId: "1" }, { settings: { applianceSafetyType: ApplianceSafetyType.other } })
                .then(result => {
                    expect(result).not.toBe(true);
                    expect(otherSafety.canEdit).toBe(false);
                    done();
                });
        });
    });

    it("can activate view model", () => {
        expect(showContentSpy.calledOnce).toBeTruthy();
    });

    it("onload when appliance is safe apply toCurrentStandards", done => {
        otherSafety.otherSafetyViewModel.isApplianceSafe = true;
        otherSafety.otherSafetyViewModel.toCurrentStandards = 2;

        otherSafety.activateAsync({ applianceId: "1", jobId: "1" })
            .then(result => {
                expect(otherSafety.otherSafetyViewModel.isApplianceSafe).toBe(true);
                expect(otherSafety.otherSafetyViewModel.toCurrentStandards).toBe(2);
                done();
            });
    });

    it("setting appliance unsafe assigns toCurrentStandards to default value Yes", (done) => {
        otherSafety.otherSafetyViewModel.isApplianceSafe = false;
        propertyChangedAssertHelper(otherSafety.otherSafetyViewModel, "toCurrentStandards", (result) => {
            expect(otherSafety.otherSafetyViewModel.toCurrentStandards).toEqual(YesNoNa.Yes);
            done();
        });
    });

    it("setting appliance unsafe disables toCurrentStandards", (done) => {
        otherSafety.otherSafetyViewModel.isApplianceSafe = false;
        propertyChangedAssertHelper(otherSafety, "disableToCurrentStandards", (result) => {
            expect(otherSafety.disableToCurrentStandards).toBeTruthy();
            done();
        });
    });

    it("setting appliance as safe implies the appliance could not be to current standards - assign default value undefined", (done) => {
        otherSafety.otherSafetyViewModel.isApplianceSafe = true;
        propertyChangedAssertHelper(otherSafety.otherSafetyViewModel, "toCurrentStandards", (result) => {
            expect(otherSafety.otherSafetyViewModel.toCurrentStandards).toBeUndefined();
            done();
        });
    });

    it("setting appliance as safe implies the appliance could not be to current standards - enable user input", (done) => {
        otherSafety.otherSafetyViewModel.isApplianceSafe = true;
        propertyChangedAssertHelper(otherSafety, "disableToCurrentStandards", (result) => {
            expect(otherSafety.disableToCurrentStandards).toBeFalsy();
            done();
        });
    });

    it("setting to current standards as no, creates an unsafe situation", (done) => {
        otherSafety.otherSafetyViewModel.toCurrentStandards = YesNoNa.No;
        propertyChangedAssertHelper(otherSafety.otherSafetyViewModel, "toCurrentStandards", (result) => {
            expect(otherSafety.unsafeReasons.find(x => x.lookupId === "toCurrentStandards")).toBeDefined();
            done();
        });
    });

    it(("setting to current standards as na, implies the appliance is to current standards. No unsafe situation required"), (done) => {
        otherSafety.otherSafetyViewModel.toCurrentStandards = YesNoNa.Na;
        propertyChangedAssertHelper(otherSafety.otherSafetyViewModel, "toCurrentStandards", (result) => {
            expect(otherSafety.unsafeReasons.find(x => x.lookupId === "toCurrentStandards")).toBeUndefined();
            done();
        });
    });

    it(("should clear other field and set false if worked on is false"), (done) => {
        otherSafety.otherSafetyViewModel.workedOnAppliance = false;
        propertyChangedAssertHelper(otherSafety.otherSafetyViewModel, "workedOnAppliance", () => {
            expect(otherSafety.otherSafetyViewModel.workedOnAppliance).toBe(false);
            expect(otherSafety.otherSafetyViewModel.didYouVisuallyCheck).toBe(undefined);
            expect(otherSafety.otherSafetyViewModel.isApplianceSafe).toBe(undefined);
            expect(otherSafety.otherSafetyViewModel.toCurrentStandards).toBe(undefined);

            expect(otherSafety.otherUnsafeViewModel.report).toBe(undefined);
            expect(otherSafety.otherUnsafeViewModel.conditionAsLeft).toBe(undefined);
            expect(otherSafety.otherUnsafeViewModel.labelAttachedRemoved).toBe(undefined);
            expect(otherSafety.otherUnsafeViewModel.ownedByCustomer).toBe(undefined);
            expect(otherSafety.otherUnsafeViewModel.letterLeft).toBe(undefined);
            expect(otherSafety.otherUnsafeViewModel.signatureObtained).toBe(undefined);
            expect(otherSafety.otherUnsafeViewModel.cappedTurnedOff).toBe(undefined);
            done();
        });
    });

    it("should trigger unsafe situation when setting didYouVisuallyCheck as false", (done) => {
        otherSafety.otherSafetyViewModel.didYouVisuallyCheck = false;
        propertyChangedAssertHelper(otherSafety, "unsafeReasons", (result) => {
            expect(otherSafety.unsafeReasons.length).toBe(1);
            expect(otherSafety.unsafeReasons[0].lookupId === "didYouVisuallyCheck").toBeTruthy();
            done();
        });
    });

    it("should not trigger unsafe situation when setting didYouVisuallyCheck as true", (done) => {
        otherSafety.otherSafetyViewModel.didYouVisuallyCheck = true;
        propertyChangedAssertHelper(otherSafety, "unsafeReasons", (result) => {
            expect(otherSafety.unsafeReasons.length).toBe(0);
            done();
        });
    })

    it("should isApplianceSafe = false and disableApplianceSafe = true when setting didYouVisuallyCheck as false", (done) => {
        otherSafety.otherSafetyViewModel.didYouVisuallyCheck = false;
        propertyChangedAssertHelper(otherSafety.otherSafetyViewModel, "isApplianceSafe", (result) => {
            expect(otherSafety.otherSafetyViewModel.isApplianceSafe).toBeFalsy();
            expect(otherSafety.disableApplianceSafe).toBe(true);
            done();
        });
    });

    it("should isApplianceSafe = true and disableApplianceSafe = false when setting didYouVisuallyCheck as true", (done) => {
        otherSafety.otherSafetyViewModel.isApplianceSafe = true;
        otherSafety.otherSafetyViewModel.didYouVisuallyCheck = true;
        propertyChangedAssertHelper(otherSafety.otherSafetyViewModel, "isApplianceSafe", (result) => {
            expect(otherSafety.otherSafetyViewModel.isApplianceSafe).toBe(true);
            expect(otherSafety.disableApplianceSafe).toBe(false);
            done();
        });
    });

    it("should clear unsafefields", done => {
        otherSafety.otherSafetyViewModel.workedOnAppliance = true;
        otherSafety.otherSafetyViewModel.didYouVisuallyCheck = true;
        otherSafety.otherSafetyViewModel.isApplianceSafe = true;
        otherSafety.otherSafetyViewModel.toCurrentStandards = YesNoNa.Na;

        otherSafety.otherUnsafeViewModel.cappedTurnedOff = "C";
        otherSafety.otherUnsafeViewModel.conditionAsLeft = "ID";
        otherSafety.otherUnsafeViewModel.labelAttachedRemoved = "A";
        otherSafety.otherUnsafeViewModel.letterLeft = true;
        otherSafety.otherUnsafeViewModel.ownedByCustomer = true;
        otherSafety.otherUnsafeViewModel.report = "test";
        otherSafety.otherUnsafeViewModel.signatureObtained = true;

         propertyChangedAssertHelper(otherSafety.otherSafetyViewModel, "toCurrentStandards", (result) => {
            expect(otherSafety.unsafeReasons.length).toBe(0);
            expect(otherSafety.otherUnsafeViewModel.cappedTurnedOff).toBeUndefined();
            expect(otherSafety.otherUnsafeViewModel.conditionAsLeft).toBeUndefined();
            expect(otherSafety.otherUnsafeViewModel.labelAttachedRemoved).toBeUndefined();
            expect(otherSafety.otherUnsafeViewModel.letterLeft).toBeUndefined();
            expect(otherSafety.otherUnsafeViewModel.ownedByCustomer).toBeUndefined();
            expect(otherSafety.otherUnsafeViewModel.report).toBeUndefined();
            expect(otherSafety.otherUnsafeViewModel.signatureObtained).toBeUndefined();           
            done();
        });
    });

    describe("conditionAsLeft property observer", () => {
        beforeEach(() => {
            let safetyNoticeTypesJson = '[{"noticeType":"ID","safetyNoticeTypeCategory":"A","safetyNoticeTypeDescription":"IMMEDIATELY DANGEROUS"},{"noticeType":"AR","safetyNoticeTypeCategory":"B","safetyNoticeTypeDescription":"AT RISK"},{"noticeType":"SS","safetyNoticeTypeCategory":"C","safetyNoticeTypeDescription":"NOT TO CURRENT STD"},{"noticeType":"XC","safetyNoticeTypeCategory":"C","safetyNoticeTypeDescription":"NOT COMMISSIONED"}]';
            let safetyNoticeStatusesJson = '[{"noticeStatus":"A","safetyNoticeStatusDescription":"ATTACHED","safetyNoticeStatusCategory":"A"},{"noticeStatus":"R","safetyNoticeStatusDescription":"REMOVED","safetyNoticeStatusCategory":"R"},{"noticeStatus":"N","safetyNoticeStatusDescription":"NOT APPLICABLE","safetyNoticeStatusCategory":"N"},{"noticeStatus":"X","safetyNoticeStatusDescription":"NOT ATTACHED","safetyNoticeStatusCategory":"X"}]';
            catalogServiceStub.getSafetyNoticeTypes = sandbox.stub().resolves(JSON.parse(safetyNoticeTypesJson));
            catalogServiceStub.getSafetyNoticeStatuses = sandbox.stub().resolves(JSON.parse(safetyNoticeStatusesJson));

        });

        it("conditionAsLeft is ID, labelAttached filtered to A", done => {
            otherSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    otherSafety.otherUnsafeViewModel.conditionAsLeft = "ID";
                    propertyChangedAssertHelper(otherSafety.otherUnsafeViewModel, "conditionAsLeft", (result) => {
                        expect(otherSafety.labelAttachedRemovedLookup.length).toEqual(1);
                        expect(otherSafety.labelAttachedRemovedLookup[0].value).toEqual("A");
                        done();
                    });
                });
        });

        it("conditionAsLeft is AR, labelAttached filtered to A", done => {
            otherSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    otherSafety.otherUnsafeViewModel.conditionAsLeft = "AR";
                    propertyChangedAssertHelper(otherSafety.otherUnsafeViewModel, "conditionAsLeft", (result) => {
                        expect(otherSafety.labelAttachedRemovedLookup.length).toEqual(1);
                        expect(otherSafety.labelAttachedRemovedLookup[0].value).toEqual("A");
                        done();
                    });
                });
        });  
        
        it("conditionAsLeft is SS, labelAttached filtered to N", done => {
            otherSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    otherSafety.otherUnsafeViewModel.conditionAsLeft = "SS";
                    propertyChangedAssertHelper(otherSafety.otherUnsafeViewModel, "conditionAsLeft", (result) => {
                        expect(otherSafety.labelAttachedRemovedLookup.length).toEqual(1);
                        expect(otherSafety.labelAttachedRemovedLookup[0].value).toEqual("N");
                        done();
                    });
                });
        });   
        
        it("conditionAsLeft is XC, labelAttached filtered to N", done => {
            otherSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    otherSafety.otherUnsafeViewModel.conditionAsLeft = "XC";
                    propertyChangedAssertHelper(otherSafety.otherUnsafeViewModel, "conditionAsLeft", (result) => {
                        expect(otherSafety.labelAttachedRemovedLookup.length).toEqual(1);
                        expect(otherSafety.labelAttachedRemovedLookup[0].value).toEqual("N");
                        done();
                    });
                });
        });  

        it("conditionAsLeft is undefined, labelAttached not filtered", done => {
            otherSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    otherSafety.otherUnsafeViewModel.conditionAsLeft = undefined;
                    propertyChangedAssertHelper(otherSafety.otherUnsafeViewModel, "conditionAsLeft", (result) => {
                        expect(otherSafety.labelAttachedRemovedLookup.length).toEqual(4);
                        done();
                    });
                });
        });        

        it("should otherUnsafeViewModel.labelAttachedRemoved not be undefined when labelAttachedRemoved = A and conditionAsLeft = ID", done => {
            otherSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    otherSafety.otherUnsafeViewModel.labelAttachedRemoved = "A";
                    otherSafety.otherUnsafeViewModel.conditionAsLeft = "ID";
                    propertyChangedAssertHelper(otherSafety.otherUnsafeViewModel, "conditionAsLeft", (result) => {
                        expect(otherSafety.otherUnsafeViewModel.labelAttachedRemoved).toEqual("A");
                        done();
                    });
                });
        });

        it("should otherUnsafeViewModel.labelAttachedRemoved not be undefined when labelAttachedRemoved = A and conditionAsLeft = AR", done => {
            otherSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    otherSafety.otherUnsafeViewModel.labelAttachedRemoved = "A";
                    otherSafety.otherUnsafeViewModel.conditionAsLeft = "AR";
                    propertyChangedAssertHelper(otherSafety.otherUnsafeViewModel, "conditionAsLeft", (result) => {
                        expect(otherSafety.otherUnsafeViewModel.labelAttachedRemoved).toEqual("A");
                        done();
                    });
                });
        });

        it("should otherUnsafeViewModel.labelAttachedRemoved be set to undefined when labelAttachedRemoved = A and conditionAsLeft = SS", done => {
            otherSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    otherSafety.otherUnsafeViewModel.labelAttachedRemoved = "A";
                    otherSafety.otherUnsafeViewModel.conditionAsLeft = "SS";
                    propertyChangedAssertHelper(otherSafety.otherUnsafeViewModel, "conditionAsLeft", (result) => {
                        expect(otherSafety.otherUnsafeViewModel.labelAttachedRemoved).toEqual(undefined);
                        done();
                    });
                });
        });

        it("should otherUnsafeViewModel.labelAttachedRemoved be set to undefined when labelAttachedRemoved = A and conditionAsLeft = XC", done => {
            otherSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    otherSafety.otherUnsafeViewModel.labelAttachedRemoved = "A";
                    otherSafety.otherUnsafeViewModel.conditionAsLeft = "XC";
                    propertyChangedAssertHelper(otherSafety.otherUnsafeViewModel, "conditionAsLeft", (result) => {
                        expect(otherSafety.otherUnsafeViewModel.labelAttachedRemoved).toEqual(undefined);
                        done();
                    });
                });
        });

        it("should otherUnsafeViewModel.labelAttachedRemoved not be undefined when labelAttachedRemoved = N and conditionAsLeft = SS", done => {
            otherSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    otherSafety.otherUnsafeViewModel.labelAttachedRemoved = "N";
                    otherSafety.otherUnsafeViewModel.conditionAsLeft = "SS";
                    propertyChangedAssertHelper(otherSafety.otherUnsafeViewModel, "conditionAsLeft", (result) => {
                        expect(otherSafety.otherUnsafeViewModel.labelAttachedRemoved).toEqual("N");
                        done();
                    });
                });
        });

        it("should otherUnsafeViewModel.labelAttachedRemoved not be undefined when labelAttachedRemoved = N and conditionAsLeft = XC", done => {
            otherSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    otherSafety.otherUnsafeViewModel.labelAttachedRemoved = "N";
                    otherSafety.otherUnsafeViewModel.conditionAsLeft = "XC";
                    propertyChangedAssertHelper(otherSafety.otherUnsafeViewModel, "conditionAsLeft", (result) => {
                        expect(otherSafety.otherUnsafeViewModel.labelAttachedRemoved).toEqual("N");
                        done();
                    });
                });
        });

        it("should otherUnsafeViewModel.labelAttachedRemoved be set to undefined when labelAttachedRemoved = N and conditionAsLeft = ID", done => {
            otherSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    otherSafety.otherUnsafeViewModel.labelAttachedRemoved = "N";
                    otherSafety.otherUnsafeViewModel.conditionAsLeft = "ID";
                    propertyChangedAssertHelper(otherSafety.otherUnsafeViewModel, "conditionAsLeft", (result) => {
                        expect(otherSafety.otherUnsafeViewModel.labelAttachedRemoved).toEqual(undefined);
                        done();
                    });
                });
        });

        it("should otherUnsafeViewModel.labelAttachedRemoved be set to undefined when labelAttachedRemoved = N and conditionAsLeft = AR", done => {
            otherSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    otherSafety.otherUnsafeViewModel.labelAttachedRemoved = "N";
                    otherSafety.otherUnsafeViewModel.conditionAsLeft = "AR";
                    propertyChangedAssertHelper(otherSafety.otherUnsafeViewModel, "conditionAsLeft", (result) => {
                        expect(otherSafety.otherUnsafeViewModel.labelAttachedRemoved).toEqual(undefined);
                        done();
                    });
                });
        });      
    });
});
