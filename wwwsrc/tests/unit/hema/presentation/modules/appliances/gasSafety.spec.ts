/// <reference path="../../../../../../typings/app.d.ts" />
import { Router } from "aurelia-router";
import { EventAggregator } from "aurelia-event-aggregator";
import { BindingEngine } from "aurelia-framework";

import { IApplianceService } from "../../../../../../app/hema/business/services/interfaces/IApplianceService";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { IValidationService } from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { GasSafety } from "../../../../../../app/hema/presentation/modules/appliances/gasSafety";
import { Appliance } from "../../../../../../app/hema/business/models/appliance";
import { IApplianceGasSafetyFactory } from "../../../../../../app/hema/presentation/factories/interfaces/IApplianceGasSafetyFactory";
import { GasSafetyViewModel } from "../../../../../../app/hema/presentation/modules/appliances/viewModels/gasSafetyViewModel";
import { GasUnsafetyViewModel } from "../../../../../../app/hema/presentation/modules/appliances/viewModels/gasUnsafetyViewModel";
import { DataState } from "../../../../../../app/hema/business/models/dataState";
import { ApplianceGasUnsafeDetail } from "../../../../../../app/hema/business/models/applianceGasUnsafeDetail";
import { ApplianceGasSafety } from "../../../../../../app/hema/business/models/applianceGasSafety";
import { ApplianceGasReadingMaster } from "../../../../../../app/hema/business/models/applianceGasReadingMaster";
import { ApplianceSafety } from "../../../../../../app/hema/business/models/applianceSafety";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { DialogService, DialogResult } from "aurelia-dialog";
import { GasApplianceReadingsMasterViewModel } from "../../../../../../app/hema/presentation/modules/appliances/viewModels/gasApplianceReadingsMasterViewModel";
import { YesNoNa } from "../../../../../../app/hema/business/models/yesNoNa";
import { ApplianceSafetyType } from "../../../../../../app/hema/business/models/applianceSafetyType";
import { TaskQueue } from "aurelia-task-queue";
import { Container } from "aurelia-dependency-injection";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { Job } from "../../../../../../app/hema/business/models/job";
import { Task } from "../../../../../../app/hema/business/models/task";
import { ISafetyNoticeType } from "../../../../../../app/hema/business/models/reference/ISafetyNoticeType";
import { ISafetyNoticeStatus } from "../../../../../../app/hema/business/models/reference/ISafetyNoticeStatus";
import { ISafetyAction } from "../../../../../../app/hema/business/models/reference/ISafetyAction";
import { IDynamicRule } from "../../../../../../app/hema/business/services/validation/IDynamicRule";
import {Threading} from "../../../../../../app/common/core/threading";

// property changed events get scheduled in aurelia. Queue a microtask as everything is handled in FIFO so we
// get a gurenteed callback when the property changed handler has been applied.
function propertyChangedAssertHelper(viewModel: any, propertyName: string, callback: (actual: any) => void): void {
    let taskQueue: TaskQueue = Container.instance.get(TaskQueue);
    taskQueue.queueMicroTask(() => {
        let actualValue = viewModel[propertyName];
        callback && callback(actualValue);
    });
}

describe("the GasSafety module", () => {
    let gasSafety: GasSafety;
    let sandbox: Sinon.SinonSandbox;

    let labelServiceStub: ILabelService;
    let applianceServiceStub: IApplianceService;
    let routerStub: Router;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let catalogServiceStub: ICatalogService;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let bindingEngine: BindingEngine;
    let appGasSafetyFactoryStub: IApplianceGasSafetyFactory;
    let showContentSpy: Sinon.SinonSpy;
    let applianceStub: Appliance;
    let validationBuildSpy: Sinon.SinonSpy;
    let gasSafetyViewModelStub: GasSafetyViewModel;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        applianceServiceStub = <IApplianceService>{};
        routerStub = <Router>{};
        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sinon.stub().returns(Promise.resolve(null));
        labelServiceStub.getGroupWithoutCommon = sinon.stub().returns(Promise.resolve(null));

        bindingEngine = Container.instance.get(BindingEngine);
        appGasSafetyFactoryStub = <IApplianceGasSafetyFactory>{};
        eventAggregatorStub = <EventAggregator>{};

        catalogServiceStub = <ICatalogService>{};
        catalogServiceStub.getSafetyActions = sandbox.stub().resolves([
            <ISafetyAction>{ "actionCode": "C", "safetyActionDescription": "Capped" },
            <ISafetyAction>{ "actionCode": "T", "safetyActionDescription": "TurnedOff" },
            <ISafetyAction>{ "actionCode": "X", "safetyActionDescription": "NotApplicable" },
            <ISafetyAction>{ "actionCode": "NC", "safetyActionDescription": "NotCapped" },
            <ISafetyAction>{ "actionCode": "NT", "safetyActionDescription": "NotCapped" }
        ]);
        catalogServiceStub.getSafetyNoticeTypes = sandbox.stub().resolves([
            <ISafetyNoticeType>{ "noticeType": "ID", "safetyNoticeTypeDescription": "IMMEDIATELY DANGEROUS" },
            <ISafetyNoticeType>{ "noticeType": "AR", "safetyNoticeTypeDescription": "AT RISK" },
            <ISafetyNoticeType>{ "noticeType": "SS", "safetyNoticeTypeDescription": "NOT TO CURRENT STD" },
            <ISafetyNoticeType>{ "noticeType": "XC", "safetyNoticeTypeDescription": "NOT COMMISSIONED" }]);
        catalogServiceStub.getSafetyNoticeStatuses = sandbox.stub().resolves([
            <ISafetyNoticeStatus>{ "noticeStatus": "A", "safetyNoticeStatusDescription": "Attached" },
            <ISafetyNoticeStatus>{ "noticeStatus": "X", "safetyNoticeStatusDescription": "NotAttached" },
            <ISafetyNoticeStatus>{ "noticeStatus": "R", "safetyNoticeStatusDescription": "Removed" },
            <ISafetyNoticeStatus>{ "noticeStatus": "N", "safetyNoticeStatusDescription": "NotApplicable" }
        ]);
        catalogServiceStub.getPerformanceTestReasons = sandbox.stub().resolves([]);

        validationServiceStub = <IValidationService>{};
        validationBuildSpy = validationServiceStub.build = sandbox.stub().resolves([]);
        validationServiceStub.validate = sandbox.stub().resolves(undefined);

        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);

        businessRuleServiceStub = <IBusinessRuleService>{};

        let businessRuleGroup = {
            "performanceTestNotDoneReasonExceptions": "NC,TN",
            "flueTypesExceptions": "V,O,R",
            "unsafeToastDismissTime": 3,
            "showApplianceStrippedQuestion": "IA,NO,PI",
            "applianceMakeAndModelMaxChars": 10,
            "conditionsAsLeftNotToCurrentStandardsOption": "SS",
            "cappedTurnedOffDisabledOptionsForNTCS": "C,T,NC,NT",
            "cappedTurnedOffNotApplicableOption": "X",
            "labelAttachedRemovedDisabledOptionsForNTCS": "A,X",
            "labelAttachedRemovedDisabledOptionsForNonNTCS": "R,X,N",
            "didYouWorkOnApplianceNoOption": false,
            "conditionAsLeftImmediatelyDangerousOption": "ID",
            "cappedTurnedOffOptionsForWarningMsg": "NC,NT,T",
            "showApplianceStrippedQuestionForSupplementary": "IS,NS,PS"
        };

        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(businessRuleGroup);

        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};

        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("notDoingJobStatuses").returns("NA");
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        applianceStub = new Appliance();
        applianceStub.safety = <ApplianceSafety>{};
        applianceStub.safety.applianceGasSafety = <ApplianceGasSafety>{};
        applianceStub.safety.applianceGasUnsafeDetail = <ApplianceGasUnsafeDetail>{};
        applianceStub.safety.applianceGasReadingsMaster = <ApplianceGasReadingMaster>{};
        applianceServiceStub.getAppliance = sandbox.stub().resolves(applianceStub);

        gasSafetyViewModelStub = new GasSafetyViewModel();
        gasSafetyViewModelStub.applianceId = "1";
        gasSafetyViewModelStub.applianceStripped = true;
        gasSafetyViewModelStub.applianceTightness = YesNoNa.No;
        gasSafetyViewModelStub.chimneyInstallationAndTests = YesNoNa.Yes;
        gasSafetyViewModelStub.dataState = DataState.valid;
        gasSafetyViewModelStub.didYouVisuallyCheck = true;
        gasSafetyViewModelStub.isApplianceSafe = true;
        gasSafetyViewModelStub.summaryPrelimLpgWarningTrigger = true;
        gasSafetyViewModelStub.summarySuppLpgWarningTrigger = false;
        gasSafetyViewModelStub.performanceTestsNotDoneReason = undefined;
        gasSafetyViewModelStub.performanceTestsNotDoneReasonForSupplementary = undefined;
        gasSafetyViewModelStub.supplementaryApplianceStripped = true;
        gasSafetyViewModelStub.safetyDevice = YesNoNa.No;
        gasSafetyViewModelStub.ventSizeConfig = true;
        gasSafetyViewModelStub.workedOnAppliance = true;
        gasSafetyViewModelStub.applianceMake = "DefaultMake";
        gasSafetyViewModelStub.applianceModel = "DefaultModel";
        gasSafetyViewModelStub.ableToTest = undefined;
        gasSafetyViewModelStub.requestedToTest = undefined;

        appGasSafetyFactoryStub.createApplianceGasSafetyViewModel = sandbox.stub().returns(gasSafetyViewModelStub);

        let gasUnSafetyViewModelStub: GasUnsafetyViewModel = new GasUnsafetyViewModel();
        gasUnSafetyViewModelStub.applianceId = "1";
        gasUnSafetyViewModelStub.cappedTurnedOff = "";
        gasUnSafetyViewModelStub.conditionAsLeft = "";
        gasUnSafetyViewModelStub.labelAttachedRemoved = "";
        gasUnSafetyViewModelStub.letterLeft = false;
        gasUnSafetyViewModelStub.ownedByCustomer = false;
        gasUnSafetyViewModelStub.report = "";
        gasUnSafetyViewModelStub.signatureObtained = false;

        appGasSafetyFactoryStub.createApplianceGasUnsafeViewModel = sandbox.stub().returns(gasUnSafetyViewModelStub);

        let gasReadingsMasterVMStub: GasApplianceReadingsMasterViewModel = new GasApplianceReadingsMasterViewModel();

        appGasSafetyFactoryStub.createApplianceGasReadingsViewModel = sandbox.stub().returns(gasReadingsMasterVMStub);

        eventAggregatorStub.publish = sandbox.stub();

        dialogServiceStub = <DialogService>{};
        let dialogResult: DialogResult = new DialogResult(false, "");
        dialogServiceStub.open = sandbox.stub().resolves(dialogResult);

        jobServiceStub = <IJobService>{};
        let job = new Job();
        let task = new Task(true, false);
        task.status = "NA";
        job.tasks = [task];
        job.isLandlordJob = true;
        jobServiceStub.getJob = sandbox.stub().resolves(job);

        gasSafety = new GasSafety(jobServiceStub, engineerServiceStub, labelServiceStub, applianceServiceStub, routerStub,
            eventAggregatorStub, dialogServiceStub, validationServiceStub, businessRuleServiceStub, catalogServiceStub, bindingEngine, appGasSafetyFactoryStub);

        gasSafety.showContent = showContentSpy = sandbox.spy();

        gasSafety.labels = {
            "no": "",
            "yes": "",
            "na": "",
            "unsafeSituation": "",
            "applianceTightness": "",
            "didYouVisuallyCheck": "",
            "applianceStripped": "",
            "chimneyInstallationAndTests": "",
            "ventSizeConfig": "",
            "isLpg": "",
            "isSuppLpg": "",
            "burnerPressureUnsafe": "",
            "gasReadingUnsafe": "",
            "finalRatioUnsafe": "",
            "suppBurnerPressureUnsafe": "",
            "suppGasReadingUnsafe": "",
            "suppFinalRatioUnsafe": "",
            "supplementary": "",
            "safetyDevice": "",
            "confirmation": "",
            "readingClearQuestion": "",
            "toCurrentStandards": "",
            "objectName": "",
            "clearQuestion": "",
            "applianceSafe": "",
            "unsafeWarningMsg": "",
            "supplementaryApplianceStripped": "",
            "supplementaryBurnerPressureUnsafe": "",
            "supplementaryGasReadingUnsafe": "",
            "supplementaryFinalRatioUnsafe": "",
            "preliminary": ""
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(gasSafety).toBeDefined();
    });

    describe("canActivateAsync", () => {
        it("can continue with correct applianceType", done => {
            applianceStub.applianceSafetyType = ApplianceSafetyType.gas;
            gasSafety.canActivateAsync({ applianceId: "1", jobId: "1" }, { settings: { applianceSafetyType: ApplianceSafetyType.gas } })
                .then(result => {
                    expect(result).toBe(true);
                    done();
                });
        });

        it("can not continue with incorrect applianceType", done => {
            applianceStub.applianceSafetyType = ApplianceSafetyType.electrical;
            gasSafety.canActivateAsync({ applianceId: "1", jobId: "1" }, { settings: { applianceSafetyType: ApplianceSafetyType.gas } })
                .then(result => {
                    expect(result).not.toBe(true);
                    done();
                });
        });
    });

    describe(("activateAsync"), () => {
        it("can call activateAsync, loadBusinessRules, buildBusinessRules, buildValidationRules, loadCatalogs, set applianceId, jobId and showContent", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                expect(showContentSpy.calledOnce).toBeTruthy();
                expect(gasSafety.canEdit).toBe(false);
                done();
            });
        });

        it("should clear out unsafeReasonFields", (done) => {
            gasSafetyViewModelStub.applianceTightness = YesNoNa.Yes;
            gasSafetyViewModelStub.summaryPrelimLpgWarningTrigger = false;
            gasSafetyViewModelStub.summarySuppLpgWarningTrigger = false;
            gasSafetyViewModelStub.safetyDevice = YesNoNa.Yes;

            gasSafety.unsafeReasonFields = ["isLpg"];
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                expect(gasSafety.unsafeReasonFields.length).toBe(0);
                done();
            });
        });

        it(("unsafeSituation, isApplianceSafe is false"), (done) => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.unsafeSituation();
                expect(gasSafety.gasSafetyViewModel).toBeDefined();
                expect(gasSafety.gasSafetyViewModel.isApplianceSafe).toBeFalsy();
                done();
            });
        });

        it(("isApplianceSafe is false"), (done) => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.gasSafetyViewModel.isApplianceSafe = false;
                propertyChangedAssertHelper(gasSafety, "disableToCurrentStandards", (actual) => {
                    expect(gasSafety.disableToCurrentStandards).toEqual(true);
                    done();
                });
            });
        });

        it(("isApplianceSafe is true"), (done) => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.gasSafetyViewModel.isApplianceSafe = true;
                propertyChangedAssertHelper(gasSafety, "showCurrentStandards", (actual) => {
                    expect(gasSafety.showCurrentStandards).toEqual(true);
                    done();
                });
            });
        });

        it(("isApplianceSafe is false, disable to current standards"), (done) => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.gasSafetyViewModel.isApplianceSafe = false;
                propertyChangedAssertHelper(gasSafety, "disableToCurrentStandards", (actual) => {
                    expect(gasSafety.disableToCurrentStandards).toEqual(true);
                    done();
                });
            });
        });

        it(("isApplianceSafe is false and toCurrentStandards No"), (done) => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.gasSafetyViewModel.isApplianceSafe = false;
                gasSafety.gasSafetyViewModel.toCurrentStandards = 0;
                gasSafety.obserApplianceSafe(false, undefined, false);
                expect(gasSafety.showCurrentStandards).toEqual(true);
                gasSafety.obserToCurrentStandards(0, undefined, false);
                expect(gasSafety.disableConditionAsLeft).toEqual(true);
                expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toEqual("SS");
                done();
            });
        });

        it(("isApplianceSafe is false and toCurrentStandards N/A"), (done) => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.gasSafetyViewModel.isApplianceSafe = false;
                gasSafety.gasSafetyViewModel.toCurrentStandards = 2;
                gasSafety.obserApplianceSafe(false, undefined, false);
                expect(gasSafety.showCurrentStandards).toEqual(true);
                gasSafety.obserToCurrentStandards(2, undefined, false);
                expect(gasSafety.disableConditionAsLeft).toEqual(false);
                done();
            });
        });
    });

    it(("unsafeSituation, gasSafetyViewModel is undefined"), () => {
        gasSafety.gasSafetyViewModel = new GasSafetyViewModel();
        gasSafety.unsafeSituation();
        expect(gasSafety.gasSafetyViewModel.isApplianceSafe).toBeFalsy();
    });

    it("showUnsafeWarningMsg should be true when conditionAsLeft = Immediately Dangerous", (done) => {
        gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
            gasSafety.gasUnsafeViewModel.cappedTurnedOff = "NT";
            gasSafety.gasUnsafeViewModel.conditionAsLeft = "ID";
            propertyChangedAssertHelper(gasSafety.gasUnsafeViewModel, "conditionAsLeft", (actual) => {
                expect(gasSafety.showUnsafeWarningMsg).toEqual(true);                
                done();
            });
        });
    });

    it("showUnsafeWarningMsg should be false when conditionAsLeft = At Risk", (done) => {
        gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
            gasSafety.gasUnsafeViewModel.cappedTurnedOff = "NT";
            gasSafety.gasUnsafeViewModel.conditionAsLeft = "AR";
            propertyChangedAssertHelper(gasSafety.gasUnsafeViewModel, "conditionAsLeft", (actual) => {
                expect(gasSafety.showUnsafeWarningMsg).toEqual(false);
                done();
            });
        });
    });

    it("showUnsafeWarningMsg should be false when cappedTurnedOff = Capped", (done) => {
        gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
            gasSafety.gasUnsafeViewModel.conditionAsLeft = "ID";
            gasSafety.gasUnsafeViewModel.cappedTurnedOff = "C";            
            propertyChangedAssertHelper(gasSafety.gasUnsafeViewModel, "cappedTurnedOff", (actual) => {
                expect(gasSafety.showUnsafeWarningMsg).toEqual(false);
                done();
            });
        });
    });

    it("showUnsafeWarningMsg should be true when cappedTurnedOff = turnedOff", (done) => {
        gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
            gasSafety.gasUnsafeViewModel.conditionAsLeft = "ID";
            gasSafety.gasUnsafeViewModel.cappedTurnedOff = "T";            
            propertyChangedAssertHelper(gasSafety.gasUnsafeViewModel, "cappedTurnedOff", (actual) => {
                expect(gasSafety.showUnsafeWarningMsg).toEqual(true);
                done();
            });
        });
    });

    describe(("deactivateAsync"), () => {
        it("deactivated", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.deactivateAsync().then(() => {
                    done();
                });
            });
        });
    });

    describe(("Property Observers"), () => {
        it("obserApplianceSafe onload is false, unsafeReasonFields is empty", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.gasUnsafeViewModel.report = "test report";
                gasSafety.gasUnsafeViewModel.conditionAsLeft = "test";
                gasSafety.gasUnsafeViewModel.cappedTurnedOff = "C";
                gasSafety.gasUnsafeViewModel.labelAttachedRemoved = "A";
                gasSafety.gasUnsafeViewModel.letterLeft = true;
                gasSafety.gasUnsafeViewModel.ownedByCustomer = false;
                gasSafety.gasUnsafeViewModel.signatureObtained = true;
                gasSafety.unsafeReasonFields = ["applianceSafe"];

                gasSafety.obserApplianceSafe(true, undefined, false);
                expect(gasSafety.isSafe).toBeTruthy();
                expect(gasSafety.unsafeReasonFields.length === 0).toBeTruthy();
                expect(gasSafety.disableToCurrentStandards).toBe(false);
                expect(gasSafety.gasUnsafeViewModel.report).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.cappedTurnedOff).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.labelAttachedRemoved).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.letterLeft).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.ownedByCustomer).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.signatureObtained).toBe(undefined);
                done();
            });
        });

        it("obserApplianceSafe, showApplianceSafe true", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserApplianceSafe(false, undefined, false);
                expect(gasSafety.showApplianceSafe).toBeTruthy();
                expect(gasSafety.disableToCurrentStandards).toBe(true);
                expect(gasSafety.conditionAsLeftLookup.find(x => x.value === "SS").disabled).toBe(true);
                done();
            });
        });


        it("should disable NotApplicable cappedTurnedOff button and Removed, NotAttached, NotApplicable labelAttachedRemoved buttons", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.gasSafetyViewModel.isApplianceSafe = false;
                propertyChangedAssertHelper(gasSafety.gasSafetyViewModel, "isApplianceSafe", (actual) => {
                    expect(gasSafety.conditionAsLeftLookup.find(x => x.value === "SS").disabled).toBe(true);
                    expect(gasSafety.cappedTurnedOffLookup.find(c => c.value === "X").disabled).toBe(true);
                    expect(gasSafety.cappedTurnedOffLookup.find(c => c.value === "C").disabled).toBe(false);
                    expect(gasSafety.cappedTurnedOffLookup.find(c => c.value === "NC").disabled).toBe(false);
                    expect(gasSafety.cappedTurnedOffLookup.find(c => c.value === "T").disabled).toBe(false);
                    expect(gasSafety.cappedTurnedOffLookup.find(c => c.value === "NT").disabled).toBe(false);

                    expect(gasSafety.labelAttachedRemovedLookup.find(a => a.value === "A").disabled).toBe(false);
                    expect(gasSafety.labelAttachedRemovedLookup.find(a => a.value === "R").disabled).toBe(true);
                    expect(gasSafety.labelAttachedRemovedLookup.find(a => a.value === "X").disabled).toBe(true);
                    expect(gasSafety.labelAttachedRemovedLookup.find(a => a.value === "N").disabled).toBe(true);
                    done();
                });
            });
        });

        it("should disableToCurrentStandards = true, toCurrentStandards = YesNoNa.Yes if disableApplianceSafe is true", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.disableApplianceSafe = true;
                gasSafety.obserApplianceSafe(false, undefined, false);
                expect(gasSafety.disableToCurrentStandards).toBe(true);
                expect(gasSafety.gasSafetyViewModel.toCurrentStandards).toBe(YesNoNa.Yes);
                done();
            });
        });

        it("should set conditionAsLeft, cappedTurnedOff, labelAttachedRemoved to undefined and unsafe fields lookup options when applianceSafe = false and toCurrentStandards = YesNoNa.No", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.gasSafetyViewModel.isApplianceSafe = false;
                gasSafety.gasSafetyViewModel.toCurrentStandards = YesNoNa.No;
                gasSafety.gasUnsafeViewModel.conditionAsLeft = "SS";
                gasSafety.gasUnsafeViewModel.cappedTurnedOff = "X";
                gasSafety.gasUnsafeViewModel.labelAttachedRemoved = "R";
                gasSafety.obserApplianceSafe(false, undefined, true);
                expect(gasSafety.gasSafetyViewModel.toCurrentStandards).toBe(YesNoNa.Yes);
                expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.cappedTurnedOff).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.labelAttachedRemoved).toBe(undefined);

                expect(gasSafety.conditionAsLeftLookup.find(x => x.value === "ID").disabled).toBe(false);
                expect(gasSafety.conditionAsLeftLookup.find(x => x.value === "AR").disabled).toBe(false);
                expect(gasSafety.conditionAsLeftLookup.find(x => x.value === "XC").disabled).toBe(false);
                expect(gasSafety.conditionAsLeftLookup.find(x => x.value === "SS").disabled).toBe(true);

                expect(gasSafety.cappedTurnedOffLookup.find(x => x.value === "C").disabled).toBe(false);
                expect(gasSafety.cappedTurnedOffLookup.find(x => x.value === "T").disabled).toBe(false);
                expect(gasSafety.cappedTurnedOffLookup.find(x => x.value === "X").disabled).toBe(true);
                expect(gasSafety.cappedTurnedOffLookup.find(x => x.value === "NC").disabled).toBe(false);
                expect(gasSafety.cappedTurnedOffLookup.find(x => x.value === "NT").disabled).toBe(false);

                expect(gasSafety.labelAttachedRemovedLookup.find(x => x.value === "A").disabled).toBe(false);
                expect(gasSafety.labelAttachedRemovedLookup.find(x => x.value === "R").disabled).toBe(true);
                expect(gasSafety.labelAttachedRemovedLookup.find(x => x.value === "X").disabled).toBe(true);
                expect(gasSafety.labelAttachedRemovedLookup.find(x => x.value === "N").disabled).toBe(true);
                done();
            });
        });

        it("obserToCurrentStandards = 0, unsafeReasonFields length is 5", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserToCurrentStandards(YesNoNa.No, undefined, false);
                expect(gasSafety.unsafeReasonFields.length).toEqual(5);
                expect(gasSafety.unsafeReasonFields[4]).toEqual("toCurrentStandards");
                expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toBe("SS");
                expect(gasSafety.disableConditionAsLeft).toBe(true);
                done();
            });
        });

        it("obserToCurrentStandards = NA, unsafeReasonFields length should be 0", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.unsafeReasonFields = ["toCurrentStandards"];
                gasSafety.gasUnsafeViewModel.report = "test report";
                gasSafety.gasUnsafeViewModel.conditionAsLeft = "test";
                gasSafety.obserToCurrentStandards(YesNoNa.Na, undefined, false);
                expect(gasSafety.unsafeReasonFields.length).toEqual(0);
                expect(gasSafety.gasUnsafeViewModel.report).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toBe(undefined);
                done();
            });
        });

        it("obserApplianceSafe onload is true, unsafeReasonFields is empty", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserApplianceSafe(true, undefined, true);
                expect(gasSafety.isSafe).toBeTruthy();
                expect(gasSafety.unsafeReasonFields.length === 0).toBeTruthy();
                done();
            });
        });

        it("obserApplianceTightnessOk = 0, unsafeReasonFields length is 4", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserApplianceTightnessOk(YesNoNa.No, undefined, false);
                expect(gasSafety.unsafeReasonFields.length === 4).toBeTruthy();
                expect(gasSafety.unsafeReasonFields[0] === "safetyDevice").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[1] === "applianceTightness").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[2] === "isLpg").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[3] === "applianceSafe").toBeTruthy();
                expect(gasSafety.conditionAsLeftLookup.find(x => x.value === "SS").disabled).toBe(true);
                done();
            });
        });

        it("obserApplianceTightnessOk = 1, unsafeReasonFields length is 3", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserApplianceTightnessOk(YesNoNa.Yes, undefined, false);
                expect(gasSafety.unsafeReasonFields.length === 3).toBeTruthy();
                expect(gasSafety.unsafeReasonFields[0] === "safetyDevice").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[1] === "isLpg").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[2] === "applianceSafe").toBeTruthy();
                done();
            });
        });

        it("obserApplianceTightnessOk = yes, unsafeReasonFields length is 0 and unsafeReasonFields is empty", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.unsafeReasonFields = ["applianceTightness"];
                gasSafety.gasUnsafeViewModel.report = "test report";
                gasSafety.gasUnsafeViewModel.conditionAsLeft = "test";
                gasSafety.obserApplianceTightnessOk(YesNoNa.Yes, undefined, false);
                expect(gasSafety.unsafeReasonFields.length).toEqual(0);
                expect(gasSafety.gasUnsafeViewModel.report).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toBe(undefined);
                done();
            });
        });

        it("obserApplianceTightnessOk = -1, unsafeReasonFields length is 3", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserApplianceTightnessOk(YesNoNa.Na, undefined, false);
                expect(gasSafety.unsafeReasonFields.length === 3).toBeTruthy();
                expect(gasSafety.unsafeReasonFields[0] === "safetyDevice").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[1] === "isLpg").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[2] === "applianceSafe").toBeTruthy();
                done();
            });
        });

        it("obserVentSizeConfigOk = true, has 4 reasons", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.gasUnsafeViewModel.report = "test report";
                gasSafety.gasUnsafeViewModel.conditionAsLeft = "test";
                gasSafety.obserVentSizeConfigOk(true, undefined, false);
                expect(gasSafety.unsafeReasonFields.length === 4).toBeTruthy();
                expect(gasSafety.unsafeReasonFields[0] === "safetyDevice").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[1] === "applianceTightness").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[2] === "isLpg").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[3] === "applianceSafe").toBeTruthy();
                expect(gasSafety.gasUnsafeViewModel.report).toBe("test report");
                expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toBe("test");
                done();
            });
        });

        it("obserVentSizeConfigOk = true, unsafeReasonFields length should be 0", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.unsafeReasonFields = ["ventSizeConfig"];
                gasSafety.gasUnsafeViewModel.report = "test report";
                gasSafety.gasUnsafeViewModel.conditionAsLeft = "test";
                gasSafety.obserVentSizeConfigOk(true, undefined, false);
                expect(gasSafety.unsafeReasonFields.length).toEqual(0);
                expect(gasSafety.gasUnsafeViewModel.report).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toBe(undefined);
                done();
            });
        });

        it("obserVentSizeConfigOk = false, has 5 reasons", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserVentSizeConfigOk(false, undefined, false);
                expect(gasSafety.unsafeReasonFields.length === 5).toBeTruthy();
                expect(gasSafety.unsafeReasonFields[0] === "safetyDevice").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[1] === "applianceTightness").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[2] === "isLpg").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[3] === "applianceSafe").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[4] === "ventSizeConfig").toBeTruthy();
                expect(gasSafety.conditionAsLeftLookup.find(x => x.value === "SS").disabled).toBe(true);
                done();
            });
        });

        it("obserVentSizeConfigOk = undefined, has 4 reasons", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserVentSizeConfigOk(undefined, undefined, false);
                expect(gasSafety.unsafeReasonFields.length === 4).toBeTruthy();
                expect(gasSafety.unsafeReasonFields[0] === "safetyDevice").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[1] === "applianceTightness").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[2] === "isLpg").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[3] === "applianceSafe").toBeTruthy();
                done();
            });
        });

        it("obserSafetyDevice =0, has 4 reasons", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    gasSafety.obserSafetyDevice(YesNoNa.No, undefined, true);
                    expect(gasSafety.unsafeReasonFields.length === 4).toBeTruthy();
                    expect(gasSafety.unsafeReasonFields[0] === "safetyDevice").toBeTruthy();
                    expect(gasSafety.unsafeReasonFields[1] === "applianceTightness").toBeTruthy();
                    expect(gasSafety.unsafeReasonFields[2] === "isLpg").toBeTruthy();
                    expect(gasSafety.unsafeReasonFields[3] === "applianceSafe").toBeTruthy();
                    expect(gasSafety.conditionAsLeftLookup.find(x => x.value === "SS").disabled).toBe(true);
                    done();
                });
        });

        it("obserSafetyDevice, preselected non-NTCS is not reset", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.gasUnsafeViewModel.conditionAsLeft = "FOO";
                gasSafety.obserSafetyDevice(YesNoNa.No, undefined, true);
                expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toBe("FOO");
                done();
            });
        });

        it("obserSafetyDevice = 1, has 3 reasons", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserSafetyDevice(YesNoNa.Yes, undefined, true);
                expect(gasSafety.unsafeReasonFields.length === 3).toBeTruthy();
                expect(gasSafety.unsafeReasonFields[0] === "applianceTightness").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[1] === "isLpg").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[2] === "applianceSafe").toBeTruthy();
                done();
            });
        });

        it("obserSafetyDevice = 1, unsafeReasonFields length should be 0", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.unsafeReasonFields = ["safetyDevice"];
                gasSafety.gasUnsafeViewModel.report = "test report";
                gasSafety.gasUnsafeViewModel.conditionAsLeft = "test";
                gasSafety.obserSafetyDevice(YesNoNa.Yes, undefined, true);
                expect(gasSafety.unsafeReasonFields.length).toEqual(0);
                expect(gasSafety.gasUnsafeViewModel.report).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toBe(undefined);
                done();
            });
        });

        it("obserSafetyDevice = -1, has 3 reasons", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserSafetyDevice(YesNoNa.Na, undefined, true);
                expect(gasSafety.unsafeReasonFields.length === 3).toBeTruthy();
                expect(gasSafety.unsafeReasonFields[0] === "applianceTightness").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[1] === "isLpg").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[2] === "applianceSafe").toBeTruthy();
                done();
            });
        });

        it("obserDidYouVisuallyCheck = true, has 4 reasons", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserDidYouVisuallyCheck(true, undefined, false);
                expect(gasSafety.unsafeReasonFields.length === 4).toBeTruthy();
                expect(gasSafety.unsafeReasonFields[0] === "safetyDevice").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[1] === "applianceTightness").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[2] === "isLpg").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[3] === "applianceSafe").toBeTruthy();
                done();
            });
        });

        it("obserDidYouVisuallyCheck = true, unsafeReasonFields length should be 0", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.unsafeReasonFields = ["didYouVisuallyCheck"];
                gasSafety.gasUnsafeViewModel.report = "test report";
                gasSafety.gasUnsafeViewModel.conditionAsLeft = "test";
                gasSafety.gasSafetyViewModel.workedOnAppliance = false;
                gasSafety.obserDidYouVisuallyCheck(true, false, false);
                expect(gasSafety.unsafeReasonFields.length).toEqual(0);
                expect(gasSafety.gasUnsafeViewModel.report).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toBe(undefined);
                done();
            });
        });

        it("obserDidYouVisuallyCheck = false, has 4 reasons", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserDidYouVisuallyCheck(false, undefined, false);
                expect(gasSafety.unsafeReasonFields.length === 4).toBeTruthy();
                expect(gasSafety.unsafeReasonFields[0] === "safetyDevice").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[1] === "applianceTightness").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[2] === "isLpg").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[3] === "applianceSafe").toBeTruthy();
                done();
            });
        });

        it("obserWorkedOnAppliance = true, onload is true", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserWorkedOnAppliance(true, undefined, true).then(() => {
                    expect(gasSafety.showSafetyDevice).toBeTruthy();
                    expect(gasSafety.showApplianceTightnessOk).toBeTruthy();
                    expect(gasSafety.showApplianceStripped).toBeTruthy();
                    expect(gasSafety.showVentSizeConfigOk).toBeTruthy();
                    expect(gasSafety.showVisuallyCheckRelight).toBeFalsy();
                    expect(gasSafety.disableApplianceSafe).toBeFalsy();
                    expect(gasSafety.showApplianceSafe).toBeTruthy();
                    expect(gasSafety.gasSafetyViewModel.didYouVisuallyCheck === undefined).toBeTruthy();
                    expect(gasSafety.gasSafetyViewModel.overrideWorkedOnAppliance).toBeFalsy();
                    done();
                });
            });
        });


        it("obserWorkedOnAppliance = true, onload is true, no performance readings", done => {
            let gasReadingsMasterVMStub: GasApplianceReadingsMasterViewModel = new GasApplianceReadingsMasterViewModel();
            gasReadingsMasterVMStub.workedOnPreliminaryPerformanceReadings = false;

            appGasSafetyFactoryStub.createApplianceGasReadingsViewModel = sandbox.stub().returns(gasReadingsMasterVMStub);

            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserWorkedOnAppliance(true, undefined, true).then(() => {
                    expect(gasSafety.showSafetyDevice).toBeTruthy();
                    expect(gasSafety.showApplianceTightnessOk).toBeTruthy();
                    expect(gasSafety.showApplianceStripped).toBeTruthy();
                    expect(gasSafety.showVentSizeConfigOk).toBeTruthy();
                    expect(gasSafety.showVisuallyCheckRelight).toBeFalsy();
                    expect(gasSafety.disableApplianceSafe).toBeFalsy();
                    expect(gasSafety.showApplianceSafe).toBeTruthy();
                    expect(gasSafety.gasSafetyViewModel.didYouVisuallyCheck === undefined).toBeTruthy();
                    expect(gasSafety.gasSafetyViewModel.overrideWorkedOnAppliance).toBeFalsy();
                    expect(gasSafety.showPerformanceTestNotDoneReasons).toBe(true);
                    done();
                });
            });
        });

        it("obserWorkedOnAppliance = true, onload is true, has performance readings", done => {
            let gasReadingsMasterVMStub: GasApplianceReadingsMasterViewModel = new GasApplianceReadingsMasterViewModel();
            gasReadingsMasterVMStub.workedOnPreliminaryPerformanceReadings = true;

            appGasSafetyFactoryStub.createApplianceGasReadingsViewModel = sandbox.stub().returns(gasReadingsMasterVMStub);

            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserWorkedOnAppliance(true, undefined, true).then(() => {
                    expect(gasSafety.showSafetyDevice).toBeTruthy();
                    expect(gasSafety.showApplianceTightnessOk).toBeTruthy();
                    expect(gasSafety.showApplianceStripped).toBeFalsy();
                    expect(gasSafety.showVentSizeConfigOk).toBeTruthy();
                    expect(gasSafety.showVisuallyCheckRelight).toBeFalsy();
                    expect(gasSafety.disableApplianceSafe).toBeFalsy();
                    expect(gasSafety.showApplianceSafe).toBeTruthy();
                    expect(gasSafety.gasSafetyViewModel.didYouVisuallyCheck === undefined).toBeTruthy();
                    expect(gasSafety.gasSafetyViewModel.overrideWorkedOnAppliance).toBeFalsy();
                    expect(gasSafety.showPerformanceTestNotDoneReasons).toBe(false);
                    done();
                });
            });
        });

        it("obserWorkedOnAppliance = true, onload is true, no supplementary burner performance readings", done => {
            let gasReadingsMasterVMStub: GasApplianceReadingsMasterViewModel = new GasApplianceReadingsMasterViewModel();
            gasReadingsMasterVMStub.supplementaryBurnerFitted = true;
            gasReadingsMasterVMStub.workedOnSupplementaryPerformanceReadings = false;

            appGasSafetyFactoryStub.createApplianceGasReadingsViewModel = sandbox.stub().returns(gasReadingsMasterVMStub);

            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserWorkedOnAppliance(true, undefined, true).then(() => {
                    expect(gasSafety.showPerformanceTestNotDoneReasonsForSupplementary).toBe(true);
                    expect(gasSafety.showSupplementaryApplianceStripped).toBe(true);
                    done();
                });
            });
        });

        it("obserWorkedOnAppliance = true, onload is true, has supplementary burner performance readings", done => {
            let gasReadingsMasterVMStub: GasApplianceReadingsMasterViewModel = new GasApplianceReadingsMasterViewModel();
            gasReadingsMasterVMStub.supplementaryBurnerFitted = true;
            gasReadingsMasterVMStub.workedOnSupplementaryPerformanceReadings = true;

            appGasSafetyFactoryStub.createApplianceGasReadingsViewModel = sandbox.stub().returns(gasReadingsMasterVMStub);

            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserWorkedOnAppliance(true, undefined, true).then(() => {
                    expect(gasSafety.showPerformanceTestNotDoneReasonsForSupplementary).toBe(false);
                    expect(gasSafety.showSupplementaryApplianceStripped).toBe(false);
                    done();
                });
            });
        });

        it("obserWorkedOnAppliance = false, onload is true", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserWorkedOnAppliance(false, undefined, true).then(() => {
                    expect(gasSafety.showSafetyDevice).toBeFalsy();
                    expect(gasSafety.showApplianceTightnessOk).toBeFalsy();
                    expect(gasSafety.showApplianceStripped).toBeFalsy();
                    expect(gasSafety.showVentSizeConfigOk).toBeFalsy();
                    expect(gasSafety.showVisuallyCheckRelight).toBeTruthy();
                    expect(gasSafety.disableApplianceSafe).toBeTruthy();
                    expect(gasSafety.showApplianceSafe).toBeTruthy();
                    expect(gasSafety.showPerformanceTestNotDoneReasons).toBeFalsy();
                    expect(gasSafety.gasSafetyViewModel.performanceTestsNotDoneReason === undefined).toBeTruthy();
                    expect(gasSafety.gasSafetyViewModel.applianceStripped === undefined).toBeTruthy();
                    expect(gasSafety.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary === undefined).toBeTruthy();
                    expect(gasSafety.gasSafetyViewModel.supplementaryApplianceStripped === undefined).toBeTruthy();
                    expect(gasSafety.gasSafetyViewModel.overrideWorkedOnAppliance).toBeTruthy();
                    done();
                });
            });
        });

        it("obserWorkedOnAppliance = false, onload is false, clears out readings and safety", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserWorkedOnAppliance(false, undefined, false).then(() => {
                    expect(gasSafety.gasSafetyViewModel.workedOnAppliance).toBeFalsy();
                    expect(gasSafety.gasSafetyViewModel.summaryPrelimLpgWarningTrigger).toBeFalsy();
                    expect(gasSafety.gasSafetyViewModel.summarySuppLpgWarningTrigger).toBeFalsy();
                    expect(gasSafety.showVisuallyCheckRelight).toBeTruthy();
                    expect(gasSafety.showVisuallyCheckRelight).toBeTruthy();
                    expect(gasSafety.showApplianceTightnessOk).toBeFalsy();
                    expect(gasSafety.showVentSizeConfigOk).toBeFalsy();
                    expect(gasSafety.showSafetyDevice).toBeFalsy();
                    expect(gasSafety.gasSafetyViewModel.overrideWorkedOnAppliance).toBeTruthy();
                    done();
                });

            });
        });

        it("obserApplianceStripped, true, has 4 reasons", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserApplianceStripped(true, undefined, true);
                expect(gasSafety.unsafeReasonFields.length === 4).toBeTruthy();
                expect(gasSafety.unsafeReasonFields[0] === "safetyDevice").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[1] === "applianceTightness").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[2] === "isLpg").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[3] === "applianceSafe").toBeTruthy();
                done();
            });
        });

        it("obserApplianceStripped = true, unsafeReasonFields length should be 0", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.unsafeReasonFields = ["applianceStripped"];
                gasSafety.gasUnsafeViewModel.report = "test report";
                gasSafety.gasUnsafeViewModel.conditionAsLeft = "test";
                gasSafety.obserApplianceStripped(true, undefined, true);
                expect(gasSafety.unsafeReasonFields.length).toEqual(0);
                expect(gasSafety.gasUnsafeViewModel.report).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toBe(undefined);
                done();
            });
        });

        it("obserApplianceStripped = false, unsafeReasonFields length should be 5", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserApplianceStripped(false, undefined, false);
                expect(gasSafety.unsafeReasonFields.length === 5).toBeTruthy();
                expect(gasSafety.unsafeReasonFields[0] === "safetyDevice").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[1] === "applianceTightness").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[2] === "isLpg").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[3] === "applianceSafe").toBeTruthy();
                done();
            });
        });



        it("supplementaryApplianceStripped = true, unsafeReasonFields length should be 0", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.unsafeReasonFields = ["supplementaryApplianceStripped"];
                gasSafety.gasUnsafeViewModel.report = "test report";
                gasSafety.gasUnsafeViewModel.conditionAsLeft = "test";
                gasSafety.obserSupplementaryApplianceStripped(true, undefined, true);
                expect(gasSafety.unsafeReasonFields.length).toEqual(0);
                expect(gasSafety.gasUnsafeViewModel.report).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toBe(undefined);
                done();
            });
        });

        it("supplementaryApplianceStripped = false, unsafeReasonFields length should be 5", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary = "IN";
                gasSafety.obserSupplementaryApplianceStripped(false, undefined, false);
                expect(gasSafety.unsafeReasonFields[4] === "supplementaryApplianceStripped").toBeTruthy();
                done();
            });
        });

        it("obserChimneyInstallationAndTests, true, has 4 reasons", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserChimneyInstallationAndTests(YesNoNa.Yes, undefined, true);
                expect(gasSafety.unsafeReasonFields.length === 4).toBeTruthy();
                expect(gasSafety.unsafeReasonFields[0] === "safetyDevice").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[1] === "applianceTightness").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[2] === "isLpg").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[3] === "applianceSafe").toBeTruthy();
                done();
            });
        });

        it("obserChimneyInstallationAndTests, true, unsafeReasonFields length should be 0", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.unsafeReasonFields = ["chimneyInstallationAndTests"];
                gasSafety.gasUnsafeViewModel.report = "test report";
                gasSafety.gasUnsafeViewModel.conditionAsLeft = "test";
                gasSafety.obserChimneyInstallationAndTests(YesNoNa.Yes, undefined, true);
                expect(gasSafety.unsafeReasonFields.length).toEqual(0);
                expect(gasSafety.gasUnsafeViewModel.report).toBe(undefined);
                expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toBe(undefined);
                done();
            });
        });

        it("obserChimneyInstallationAndTests, true, has 5 reasons", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserChimneyInstallationAndTests(YesNoNa.No, undefined, true);
                expect(gasSafety.unsafeReasonFields.length === 5).toBeTruthy();
                expect(gasSafety.unsafeReasonFields[0] === "safetyDevice").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[1] === "applianceTightness").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[2] === "isLpg").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[3] === "applianceSafe").toBeTruthy();
                expect(gasSafety.unsafeReasonFields[4] === "chimneyInstallationAndTests").toBeTruthy();
                done();
            });
        });

        it("obserPerformanceTestsNotDoneReason, undefined", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserPerformanceTestsNotDoneReason(undefined, undefined, true);
                expect(gasSafety.showApplianceStripped).toBeTruthy();
                done();
            });
        });

        it("showApplianceStripped should be true", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserPerformanceTestsNotDoneReason("PI", undefined, false);
                expect(gasSafety.showApplianceStripped).toBeTruthy();
                done();
            });
        });

        it("should showApplianceStripped = false, applianceStripped = undefined", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.disableApplianceSafe = true;
                gasSafety.unsafeReasonFields = ["applianceStripped", "applianceSafe"];
                gasSafety.gasSafetyViewModel.isApplianceSafe = false;
                gasSafety.obserPerformanceTestsNotDoneReason("TN", undefined, false);
                Threading.delay(() => {
                    expect(gasSafety.showApplianceStripped).toBeFalsy();                
                    expect(gasSafety.disableApplianceSafe).toBeFalsy();
                    expect(gasSafety.gasSafetyViewModel.applianceStripped).toBeUndefined();
                    expect(gasSafety.unsafeReasonFields.length).toBe(1);
                    done();
                }, 250);
            });
        });

        it("obserPerformanceTestsNotDoneReasonForSupplementary, undefined", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserPerformanceTestsNotDoneReasonForSupplementary(undefined, undefined, true);
                expect(gasSafety.gasSafetyViewModel.supplementaryApplianceStripped).toBeUndefined();
                done();
            });
        });

         it("showSupplementaryApplianceStripped should be true", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.obserPerformanceTestsNotDoneReasonForSupplementary("PS", undefined, false);
                expect(gasSafety.showSupplementaryApplianceStripped).toBeTruthy();
                done();
            });
        });

        it("should showSupplementaryApplianceStripped = false, supplementaryApplianceStripped = undefined", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
               gasSafety.obserPerformanceTestsNotDoneReasonForSupplementary("TS", undefined, false);
                Threading.delay(() => {
                    expect(gasSafety.showSupplementaryApplianceStripped).toBeFalsy();                
                    expect(gasSafety.gasSafetyViewModel.applianceStripped).toBeUndefined();
                    done();
                }, 250);
            });
        });


        it("should not disable didYouWorkOnAppliance No button when ableToTest = undefined", (done) => {
            gasSafetyViewModelStub.ableToTest = undefined;
            gasSafety.isLandlordJob = true;
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                expect(gasSafety.didYouWorkOnApplianceLookup.find(x => x.value === false).disabled).toBe(false);
                done();
            });
        });

        it("should not disable didYouWorkOnAppliance No button when requestedToTest = undefined", (done) => {
            gasSafetyViewModelStub.requestedToTest = undefined;
            gasSafety.isLandlordJob = true;
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                expect(gasSafety.didYouWorkOnApplianceLookup.find(x => x.value === false).disabled).toBe(false);
                done();
            });
        });

        it("ableToTest = true, should disable didYouWorkOnAppliance No button and workedOnAppliance = true", (done) => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.gasSafetyViewModel.requestedToTest = true;
                gasSafety.gasSafetyViewModel.ableToTest = true;
                gasSafety.obserAbleToTest(true, undefined);
                expect(gasSafety.didYouWorkOnApplianceLookup.find(x => x.value === false).disabled).toBe(true);
                expect(gasSafety.gasSafetyViewModel.workedOnAppliance).toBe(true);
                done();
            });
        });

        it("ableToTest = false, should not disable didYouWorkOnAppliance No button", (done) => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.didYouWorkOnApplianceLookup.find(x => x.value === false).disabled = true;
                gasSafety.gasSafetyViewModel.requestedToTest = true;
                gasSafety.gasSafetyViewModel.ableToTest = false;
                gasSafety.obserAbleToTest(false, true);
                expect(gasSafety.didYouWorkOnApplianceLookup.find(x => x.value === false).disabled).toBe(false);
                done();
            });
        });
        it("requestedToTest = true, should disable didYouWorkOnAppliance No button and workedOnAppliance = true", (done) => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.gasSafetyViewModel.requestedToTest = true;
                gasSafety.gasSafetyViewModel.ableToTest = true;
                gasSafety.obserRequestedTest(true, undefined);
                expect(gasSafety.didYouWorkOnApplianceLookup.find(x => x.value === false).disabled).toBe(true);
                expect(gasSafety.gasSafetyViewModel.workedOnAppliance).toBe(true);
                done();
            });
        });

        it("requestedToTest = false, should not disable didYouWorkOnAppliance No button", (done) => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.didYouWorkOnApplianceLookup.find(x => x.value === false).disabled = true;
                gasSafety.gasSafetyViewModel.requestedToTest = false;
                gasSafety.gasSafetyViewModel.ableToTest = true;
                gasSafety.obserRequestedTest(false, true);
                expect(gasSafety.didYouWorkOnApplianceLookup.find(x => x.value === false).disabled).toBe(false);
                done();
            });
        });
    });

    describe("undo function", () => {

        let methodSpy: Sinon.SinonSpy;
        let gasSafetyViewModelStub: GasSafetyViewModel ;
        let createApplianceGasSafetyViewModelStub: Sinon.SinonStub;

        beforeEach(() => {
            gasSafetyViewModelStub = new GasSafetyViewModel();
            gasSafetyViewModelStub.applianceId = "1";
            gasSafetyViewModelStub.applianceStripped = true;
            gasSafetyViewModelStub.applianceTightness = YesNoNa.No;
            gasSafetyViewModelStub.chimneyInstallationAndTests = YesNoNa.Yes;
            gasSafetyViewModelStub.dataState = DataState.valid;
            gasSafetyViewModelStub.didYouVisuallyCheck = true;
            // gasSafetyViewModelStub.gasReadings = null;
            gasSafetyViewModelStub.isApplianceSafe = true;
            gasSafetyViewModelStub.summaryPrelimLpgWarningTrigger = true;
            gasSafetyViewModelStub.summarySuppLpgWarningTrigger = true;
            gasSafetyViewModelStub.performanceTestsNotDoneReason = "";
            gasSafetyViewModelStub.safetyDevice = YesNoNa.No;
            // gasSafetyViewModelStub.supplementaryBurnerFitted = true;
            // gasSafetyViewModelStub.supplementaryReadings = null;
            gasSafetyViewModelStub.ventSizeConfig = true;
            gasSafetyViewModelStub.workedOnAppliance = true;
            gasSafetyViewModelStub.applianceMake = "DefaultMake";
            gasSafetyViewModelStub.applianceModel = "DefaultModel";
            gasSafetyViewModelStub.ableToTest = undefined;
            gasSafetyViewModelStub.requestedToTest = undefined;

            let gasSafetyViewModelStubSecondCall: GasSafetyViewModel = new GasSafetyViewModel();
            gasSafetyViewModelStubSecondCall.applianceId = "1";
            gasSafetyViewModelStubSecondCall.applianceStripped = true;
            gasSafetyViewModelStubSecondCall.applianceTightness = YesNoNa.No;
            gasSafetyViewModelStubSecondCall.chimneyInstallationAndTests = YesNoNa.Yes;
            gasSafetyViewModelStubSecondCall.dataState = DataState.valid;
            gasSafetyViewModelStubSecondCall.didYouVisuallyCheck = true;
            // gasSafetyViewModelStubSecondCall.gasReadings = null;
            gasSafetyViewModelStubSecondCall.isApplianceSafe = true;
            gasSafetyViewModelStubSecondCall.summaryPrelimLpgWarningTrigger = true;
            gasSafetyViewModelStubSecondCall.summarySuppLpgWarningTrigger = true;
            gasSafetyViewModelStubSecondCall.performanceTestsNotDoneReason = undefined;
            gasSafetyViewModelStubSecondCall.safetyDevice = YesNoNa.No;
            // gasSafetyViewModelStubSecondCall.supplementaryBurnerFitted = true;
            // gasSafetyViewModelStubSecondCall.supplementaryReadings = null;
            gasSafetyViewModelStubSecondCall.ventSizeConfig = true;
            gasSafetyViewModelStubSecondCall.workedOnAppliance = true;
            gasSafetyViewModelStubSecondCall.applianceMake = "DefaultMake";
            gasSafetyViewModelStubSecondCall.applianceModel = "DefaultModel";
            gasSafetyViewModelStubSecondCall.ableToTest = undefined;
            gasSafetyViewModelStubSecondCall.requestedToTest = undefined;

            methodSpy = createApplianceGasSafetyViewModelStub = appGasSafetyFactoryStub.createApplianceGasSafetyViewModel = sandbox.stub();

            createApplianceGasSafetyViewModelStub.onFirstCall().returns(gasSafetyViewModelStub);
            createApplianceGasSafetyViewModelStub.onSecondCall().returns(gasSafetyViewModelStubSecondCall);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("will reset the appliance make and model after undo", (done) => {

            gasSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    gasSafety.unsafeSituation();
                    expect(gasSafety.gasSafetyViewModel.applianceMake).toBe("DefaultMake");
                    expect(gasSafety.gasSafetyViewModel.applianceModel).toBe("DefaultModel");
                })
                .then(() => {
                    gasSafety.gasSafetyViewModel.applianceMake = "New Make";
                    gasSafety.gasSafetyViewModel.applianceModel = "New Model";
                })
                .then(() => gasSafety.undo())
                .then(() => {
                    expect(methodSpy.callCount).toBe(2);
                    expect(gasSafety.gasSafetyViewModel.applianceMake).toBe("DefaultMake");
                    expect(gasSafety.gasSafetyViewModel.applianceModel).toBe("DefaultModel");
                    done();
                })
                .catch((error) => {
                    fail("should not be here: " + error);
                });
        });

        it("will reset the requested and able to test values after undo", (done) => {

            gasSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    gasSafety.unsafeSituation();
                    expect(gasSafety.gasSafetyViewModel.requestedToTest).toBe(undefined);
                    expect(gasSafety.gasSafetyViewModel.ableToTest).toBe(undefined);
                })
                .then(() => {
                    gasSafety.gasSafetyViewModel.requestedToTest = true;
                    gasSafety.gasSafetyViewModel.ableToTest = true;
                })
                .then(() => gasSafety.undo())
                .then(() => {
                    expect(methodSpy.callCount).toBe(2);
                    expect(gasSafety.gasSafetyViewModel.requestedToTest).toBe(undefined);
                    expect(gasSafety.gasSafetyViewModel.ableToTest).toBe(undefined);
                    done();
                })
                .catch((error) => {
                    fail("should not be here: " + error);
                });
        });

        it("will not show toasts when undoing", done => {

            createApplianceGasSafetyViewModelStub.returns(gasSafetyViewModelStub);
            let showToastSpy = gasSafety.showWarning = sandbox.spy();

            gasSafety.activateAsync({ applianceId: "1", jobId: "1" })

                .then(() => gasSafety.load())
                .then(() => {
                    expect(showToastSpy.called).toBe(true);
                    showToastSpy.reset();
                })

                .then(() => gasSafety.undo())
                .then(() => {
                    expect(showToastSpy.called).toBe(false);
                    done();
                });

        });
    });

    describe("getting appliance make and model", () => {
        beforeEach(() => {
            gasSafetyViewModelStub.applianceMake = "123456";
            gasSafetyViewModelStub.applianceModel = "something";
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("will not trim the appliance make if length is within business rule", (done) => {

            gasSafety.activateAsync({ applianceId: "1", jobId: "1" }).then(() => {
                gasSafety.deactivateAsync().then(() => {
                    expect(gasSafety.gasSafetyViewModel.applianceMake).toBe("123456");
                    expect(gasSafety.gasSafetyViewModel.applianceModel).toBe("something");
                    done();
                });
            });
        });
    });

    describe("chimneyInstallationAndTests property", () => {
        beforeEach(() => {
            if (gasSafety && gasSafety.chimneyInstallationAndTestsLookup) {
                gasSafety.chimneyInstallationAndTestsLookup.forEach((lookupOption) => {
                    lookupOption.disabled = false;
                });
            }
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("will only allow na if no flue on central heating appliance", (done) => {
            applianceStub.flueType = "F";
            applianceStub.isCentralHeatingAppliance = true;

            gasSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    let filteredLookup = gasSafety.chimneyInstallationAndTestsLookup.filter(x => !x.disabled);
                    expect(filteredLookup.length).toBe(1);
                    expect(filteredLookup[0].value).toBe(YesNoNa.Na);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        it("will only allow yes or no if flue on central heating appliance", (done) => {
            applianceStub.flueType = "V";
            applianceStub.isCentralHeatingAppliance = true;

            gasSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    let filteredLookup = gasSafety.chimneyInstallationAndTestsLookup.filter(x => !x.disabled);
                    expect(filteredLookup.length).toBe(2);
                    expect(filteredLookup.find(x => x.value === YesNoNa.Yes)).toBeDefined();
                    expect(filteredLookup.find(x => x.value === YesNoNa.No)).toBeDefined();
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        it("will reset chimney if not allowed option selected on central heating appliance", (done) => {
            applianceStub.flueType = "V";
            applianceStub.isCentralHeatingAppliance = true;
            applianceStub.safety.applianceGasSafety.chimneyInstallationAndTests = YesNoNa.Na;

            let gasSafetyViewModelStub: GasSafetyViewModel = new GasSafetyViewModel();
            gasSafetyViewModelStub.applianceId = "1";
            gasSafetyViewModelStub.applianceStripped = true;
            gasSafetyViewModelStub.applianceTightness = YesNoNa.No;
            gasSafetyViewModelStub.chimneyInstallationAndTests = YesNoNa.Na;
            gasSafetyViewModelStub.dataState = DataState.valid;
            gasSafetyViewModelStub.didYouVisuallyCheck = true;
            gasSafetyViewModelStub.isApplianceSafe = true;
            gasSafetyViewModelStub.summaryPrelimLpgWarningTrigger = true;
            gasSafetyViewModelStub.summarySuppLpgWarningTrigger = true;
            gasSafetyViewModelStub.performanceTestsNotDoneReason = "";
            gasSafetyViewModelStub.safetyDevice = YesNoNa.No;
            gasSafetyViewModelStub.ventSizeConfig = true;
            gasSafetyViewModelStub.workedOnAppliance = true;
            gasSafetyViewModelStub.applianceMake = "DefaultMake";
            gasSafetyViewModelStub.applianceModel = "DefaultModel";
            gasSafetyViewModelStub.ableToTest = undefined;
            gasSafetyViewModelStub.requestedToTest = undefined;

            appGasSafetyFactoryStub.createApplianceGasSafetyViewModel = sandbox.stub().returns(gasSafetyViewModelStub);

            gasSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    expect(gasSafety.gasSafetyViewModel.chimneyInstallationAndTests).toBeUndefined();
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });
    });

    describe("validation", () => {
        it("will validate to current standards only when shown", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                    let dynamicRules: IDynamicRule[] = validationBuildSpy.args[0][2];
                    let conditionAsLeftRule = dynamicRules.find(rule => rule.property === "gasSafetyViewModel.toCurrentStandards");
                    gasSafety.showCurrentStandards = true;
                    expect(conditionAsLeftRule.condition()).toBe(true);
                    gasSafety.showCurrentStandards = false;
                    expect(conditionAsLeftRule.condition()).toBe(false);
                    done();
                });
        });
    });

    describe("clearModel",() => {
        it("will reset all model properties", (done) => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => gasSafety.clear().then(() => {
                    expect(gasSafety.gasSafetyViewModel.applianceMake).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.applianceModel).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.applianceTightness).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.ventSizeConfig).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.chimneyInstallationAndTests).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.safetyDevice).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.didYouVisuallyCheck).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.isApplianceSafe).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.toCurrentStandards).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.performanceTestsNotDoneReason).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.requestedToTest).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.ableToTest).toBeUndefined();
                    expect(gasSafety.gasUnsafeViewModel.report).toBeUndefined();
                    expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toBeUndefined();
                    expect(gasSafety.gasUnsafeViewModel.labelAttachedRemoved).toBeUndefined();
                    expect(gasSafety.gasUnsafeViewModel.ownedByCustomer).toBeUndefined();
                    expect(gasSafety.gasUnsafeViewModel.letterLeft).toBeUndefined();
                    expect(gasSafety.gasUnsafeViewModel.signatureObtained).toBeUndefined();
                    expect(gasSafety.gasUnsafeViewModel.cappedTurnedOff).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.performanceTestsNotDoneReasonForSupplementary).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.supplementaryApplianceStripped).toBeUndefined();
                    done();
                }))
                .catch((error) => {
                    fail("should not be here: " + error);
                });
        });

        it("workedOnAppliance = true, should reset the gasSafetyViewModel", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                gasSafety.gasSafetyViewModel.workedOnAppliance = true;
                gasSafety.gasSafetyViewModel.performanceTestsNotDoneReason = "PI";
                gasSafety.gasSafetyViewModel.applianceStripped = true;
                gasSafety.gasSafetyViewModel.applianceTightness = YesNoNa.Yes;
                gasSafety.gasSafetyViewModel.ventSizeConfig = true;
                gasSafety.gasSafetyViewModel.safetyDevice = YesNoNa.Yes;
                gasSafety.gasSafetyViewModel.isApplianceSafe = true;
                gasSafety.gasSafetyViewModel.toCurrentStandards = YesNoNa.Yes;

                gasSafety.clear().then(() => {
                    expect(gasSafety.gasSafetyViewModel.workedOnAppliance).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.performanceTestsNotDoneReason).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.applianceStripped).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.applianceTightness).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.ventSizeConfig).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.safetyDevice).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.isApplianceSafe).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.toCurrentStandards).toBeUndefined();

                    expect(gasSafety.showVisuallyCheckRelight).toBe(false);
                    expect(gasSafety.showApplianceStripped).toBe(false);
                    expect(gasSafety.showApplianceTightnessOk).toBe(false);
                    expect(gasSafety.showVentSizeConfigOk).toBe(false);
                    expect(gasSafety.showSafetyDevice).toBe(false);
                    expect(gasSafety.showApplianceSafe).toBe(false);
                    done();
                });
            });
        });

        it("Unsafe situation workedOnAppliance = true, should reset the gasSafetyViewModel", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                gasSafety.gasSafetyViewModel.workedOnAppliance = true;
                gasSafety.gasSafetyViewModel.performanceTestsNotDoneReason = "PI";
                gasSafety.gasSafetyViewModel.applianceStripped = true;
                gasSafety.gasSafetyViewModel.applianceTightness = YesNoNa.Yes;
                gasSafety.gasSafetyViewModel.ventSizeConfig = false;
                gasSafety.gasSafetyViewModel.safetyDevice = YesNoNa.Yes;
                gasSafety.gasSafetyViewModel.isApplianceSafe = false;

                gasSafety.gasUnsafeViewModel.cappedTurnedOff = "C";
                gasSafety.gasUnsafeViewModel.conditionAsLeft = "AR";
                gasSafety.gasUnsafeViewModel.labelAttachedRemoved = "A";
                gasSafety.gasUnsafeViewModel.letterLeft = true;
                gasSafety.gasUnsafeViewModel.ownedByCustomer = true;
                gasSafety.gasUnsafeViewModel.signatureObtained = true;
                gasSafety.gasUnsafeViewModel.report = "test";

                gasSafety.clear().then(() => {
                    expect(gasSafety.gasSafetyViewModel.workedOnAppliance).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.performanceTestsNotDoneReason).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.applianceStripped).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.applianceTightness).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.ventSizeConfig).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.safetyDevice).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.isApplianceSafe).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.toCurrentStandards).toBeUndefined();

                    expect(gasSafety.gasUnsafeViewModel.cappedTurnedOff).toBeUndefined();
                    expect(gasSafety.gasUnsafeViewModel.conditionAsLeft).toBeUndefined();
                    expect(gasSafety.gasUnsafeViewModel.labelAttachedRemoved).toBeUndefined();
                    expect(gasSafety.gasUnsafeViewModel.letterLeft).toBeUndefined();
                    expect(gasSafety.gasUnsafeViewModel.ownedByCustomer).toBeUndefined();
                    expect(gasSafety.gasUnsafeViewModel.signatureObtained).toBeUndefined();
                    expect(gasSafety.gasUnsafeViewModel.report).toBeUndefined();

                    expect(gasSafety.showVisuallyCheckRelight).toBe(false);
                    expect(gasSafety.showApplianceStripped).toBe(false);
                    expect(gasSafety.showApplianceTightnessOk).toBe(false);
                    expect(gasSafety.showVentSizeConfigOk).toBe(false);
                    expect(gasSafety.showSafetyDevice).toBe(false);
                    expect(gasSafety.showApplianceSafe).toBe(false);
                    done();
                });
            });
        });

        it("workedOnAppliance = false, should reset the gasSafetyViewModel", done => {
            gasSafety.activateAsync({ applianceId: "1", jobId: "1" })
                .then(() => {
                gasSafety.gasSafetyViewModel.workedOnAppliance = false;
                gasSafety.gasSafetyViewModel.didYouVisuallyCheck = true;
                gasSafety.gasSafetyViewModel.isApplianceSafe = true;
                gasSafety.gasSafetyViewModel.toCurrentStandards = YesNoNa.Yes;

                gasSafety.clear().then(() => {
                    expect(gasSafety.gasSafetyViewModel.workedOnAppliance).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.didYouVisuallyCheck).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.isApplianceSafe).toBeUndefined();
                    expect(gasSafety.gasSafetyViewModel.toCurrentStandards).toBeUndefined();
                    
                    expect(gasSafety.showVisuallyCheckRelight).toBe(false);
                    expect(gasSafety.showApplianceSafe).toBe(false);
                    done();
                });
            });
        });
    });
});
