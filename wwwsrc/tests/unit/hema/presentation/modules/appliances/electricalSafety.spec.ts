/// <reference path="../../../../../../typings/app.d.ts" />

import { ElectricalSafety } from "../../../../../../app/hema/presentation/modules/appliances/electricalSafety";
import {BindingEngine, PropertyObserver} from "aurelia-framework";
import {EventAggregator} from "aurelia-event-aggregator";
import {TaskQueue} from "aurelia-task-queue";
import {Container} from "aurelia-dependency-injection";

import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {IJobService} from "../../../../../../app/hema/business/services/interfaces/IJobService";
import {IValidationService} from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import {IBusinessRuleService} from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {ICatalogService} from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import {IApplianceService} from "../../../../../../app/hema/business/services/interfaces/IApplianceService";
import {IPropertySafetyService} from "../../../../../../app/hema/business/services/interfaces/IPropertySafetyService";
import {IApplianceSafetyFactory} from "../../../../../../app/hema/presentation/factories/interfaces/IApplianceSafetyFactory";
import {ApplianceSafety} from "../../../../../../app/hema/business/models/applianceSafety";
import {PropertySafety} from "../../../../../../app/hema/business/models/propertySafety";
import {Appliance} from "../../../../../../app/hema/business/models/appliance";
import {ViewModelState} from "../../../../../../app/hema/presentation/elements/viewModelState";
import {IEngineerService} from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { DialogService, DialogResult } from "aurelia-dialog";
import {ApplianceSafetyType} from "../../../../../../app/hema/business/models/applianceSafetyType";
import {ISafetyNoticeStatus} from "../../../../../../app/hema/business/models/reference/ISafetyNoticeStatus";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { Job } from "../../../../../../app/hema/business/models/job";
import { Task } from "../../../../../../app/hema/business/models/task";

// property changed events get scheduled in aurelia. Queue a microtask as everything is handled in FIFO so we
// get a guaranteed callback when the property changed handler has been applied.
function propertyChangedAssertHelper(viewModel: any, propertyName: string, callback: (actual: any)=> void) {
    let taskQueue: TaskQueue = Container.instance.get(TaskQueue);
    taskQueue.queueMicroTask(() => {
        let actualValue = viewModel[propertyName];
        callback && callback(actualValue);
    });
}

describe("the ElectricalSafety module", () => {

    class TestableElectricalSafety extends ElectricalSafety {
        public setUnclean() : void {
            this._isCleanInstance = false;
        }
    }

    let electricalSafety: TestableElectricalSafety;
    let sandbox: Sinon.SinonSandbox;

    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let validationServiceStub: IValidationService;
    let businessRulesServiceStub: IBusinessRuleService;
    let catalogServiceStub: ICatalogService;
    let bindingEngineStub: BindingEngine;
    let applianceServiceStub: IApplianceService;
    let propertySafetyServiceStub: IPropertySafetyService;
    let applianceSafetyFactoryStub: IApplianceSafetyFactory;
    let appliance: Appliance;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sandbox.stub().resolves({
            "yes": "",
            "no": "",
            "confirmation": "",
            "clearQuestion": "",
            "objectName": ""
        });

        let applianceSafety = <ApplianceSafety>{};
        appliance = <Appliance>{};

        applianceServiceStub = <IApplianceService>{};
        applianceServiceStub.getApplianceSafetyDetails = sandbox.stub().resolves(applianceSafety);
        applianceServiceStub.getAppliance = sandbox.stub().resolves(appliance);

        businessRulesServiceStub = <IBusinessRuleService>{};
        businessRulesServiceStub.getRuleGroup = sandbox.stub().resolves({
            "itemCheckedQuestionNotChecked": "C",
            "itemCheckedQuestionYes": "Y",
            "itemCheckedQuestionNo": "N",
            "itemCheckedQuestionNotApplicable": "X",
            "circuitRcdProtected": "RCD",
            "circuitRcboProtected": "RCBO",
            "circuitRcdProtectedNo": "N",
            "circuitRcdProtectedCustRefusedTest": "CRT",
            "ringContinuityReadingDoneFail": "F",
            "leInsulationResistanceMinThreshold": 1,
            "leInsulationResistanceMaxThreshold": 1,
            "neInsulationResistanceMinThreshold": 1,
            "lnInsulationResistanceMinThreshold": 1,
            "systemTypeTt": "TT",
            "systemTypeTns": "TNS",
            "systemTypeTncs": "TNCS",
            "systemTypeUnableToCheck": "U",
            "finalEliReadingMinThreshold": 1,
            "finalEliReadingMaxThreshold": 1000,
            "rcdTripTimeReadingFirstThreshold": 1,
            "rcdTripTimeReadingSecondThreshold": 200,

            "rcboTripTimeReadingMinThreshold": 300,
            "applianceEarthContinuityReadingMinThreshold": 1,
            "applianceEarthContinuityReadingMaxThreshold": 1,
            "applianceEarthContinuityReadingMessageThreshold": 1,
            "mcbFuseRatingUnsafeReason": "US",
            "applianceFuseRatingUnsafeReason": "US",
            "microwaveLeakageMaxThreshold": 5,
            "applianceTypeElectrical": "ELECTRICAL",
            "applianceTypeMicrowave": "MICROWAVE",
            "applianceTypeWhiteGoods": "WHITEGOODS",
            "unsafeToastDismissTime": 3,
            "conditionAsLeftImmediatelyDangerous": "ID"
        });

        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};

        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("notDoingJobStatuses").returns("NA");
        businessRulesServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);


        catalogServiceStub = <ICatalogService>{};
        catalogServiceStub.getApplianceElectricalType = sandbox.stub().resolves({});
        catalogServiceStub.getSafetyReasonCats = sandbox.stub().resolves([]);
        catalogServiceStub.getYesNoNotCheckeds = sandbox.stub().resolves([]);
        catalogServiceStub.getYesNoNotCheckedNas = sandbox.stub().resolves([]);
        catalogServiceStub.getPassFailNas = sandbox.stub().resolves([]);
        catalogServiceStub.getSafetyNoticeTypes = sandbox.stub().resolves([]);
        catalogServiceStub.getSafetyActions = sandbox.stub().resolves([]);
        catalogServiceStub.getSafetyReadingCats = sandbox.stub().resolves([]);
        catalogServiceStub.getElectricalApplianceTypes = sandbox.stub().resolves([]);

        catalogServiceStub.getSafetyNoticeStatuses = sandbox.stub().resolves([
                <ISafetyNoticeStatus> {
                    noticeStatus: "A",
                    safetyNoticeStatusDescription: "ATTACHED"
                },
                <ISafetyNoticeStatus> {
                    noticeStatus: "R",
                    safetyNoticeStatusDescription: "REMOVED"
                },
                <ISafetyNoticeStatus> {
                    noticeStatus: "N",
                    safetyNoticeStatusDescription: "NOT APPLICABLE"
                },
                <ISafetyNoticeStatus> {
                    noticeStatus: "X",
                    safetyNoticeStatusDescription: "NOT ATTACHED"
                },
            ]);

        let propertyObserverStub = <PropertyObserver>{};
        propertyObserverStub.subscribe = sandbox.spy();

        bindingEngineStub = Container.instance.get(BindingEngine);
        // bindingEngineStub.propertyObserver = sandbox.stub().returns(propertyObserverStub);

        validationServiceStub = <IValidationService>{};
        validationServiceStub.build = sandbox.stub().resolves(null);

        let propertySafety = <PropertySafety>{};
        propertySafetyServiceStub = <IPropertySafetyService>{};
        propertySafetyServiceStub.getPropertySafetyDetails = sandbox.stub().resolves(propertySafety);

        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.publish = sandbox.stub();

        dialogServiceStub = <DialogService>{};
        dialogServiceStub.open = sandbox.stub().resolves(<DialogResult>{wasCancelled: false});

        jobServiceStub = <IJobService>{};
        let job = new Job();
        let task = new Task(true, false);
        task.status = "NA";
        job.tasks = [task];
        jobServiceStub.getJob = sandbox.stub().resolves(job);

        electricalSafety = new TestableElectricalSafety(jobServiceStub, engineerServiceStub, labelServiceStub, eventAggregatorStub,
            dialogServiceStub, validationServiceStub, businessRulesServiceStub, catalogServiceStub, bindingEngineStub, applianceServiceStub, propertySafetyServiceStub, applianceSafetyFactoryStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(electricalSafety).toBeDefined();
    });

    describe("call activateAsync", () => {
        beforeEach(() => {

        });

        afterEach(() => {
            sandbox.restore();
        });

        it("sets the viewModels, build validation and show content", (done) => {
            let showContentSpy = sandbox.spy(electricalSafety, "showContent");
            let buildValidationSpy = sandbox.spy(electricalSafety, "buildValidation");
            electricalSafety
                .loadLabels("")
                .then(() => electricalSafety.activateAsync({applianceId: "0", jobId: "1"}))
                .then(() => {
                    expect(showContentSpy.called).toBe(true);
                    expect(buildValidationSpy.called).toBe(true);
                    expect(electricalSafety.canEdit).toBe(false);
                    done();
            })
            .catch((error) => {
                fail("should not be here: " + error);
                done();
            });
        });

        // all of the logic to handle any property change is handled in electricalSafetyViewModel, and tested
        //  in electricalSafetyViewModel.spec.ts.  So let's just make sure that that method is called by every
        //  bound property handler.
        it("can call recalculateFlowState on all properties that should be bound to", done => {
            electricalSafety
                .loadLabels("")
                .then(() => electricalSafety.activateAsync({applianceId: "0", jobId: "1"}))
                .then(() => {
                let spy = sandbox.spy(electricalSafety.viewModel, "recalculateflowState");

                let p = Promise.resolve();

                electricalSafety.viewModel.getPropertiesToBind().forEach(prop => {
                    let thisPropertyPromise = new Promise<void>((resolved) => {
                        // trigger a change: null !== undefined
                        electricalSafety.viewModel[prop] = null;
                        propertyChangedAssertHelper(electricalSafety.viewModel, prop, () => {
                            expect(spy.calledWith(prop)).toBe(true);
                            spy.reset();
                            resolved();
                    });
                })
                    p = p.then(() => thisPropertyPromise);
                })

                p.then(() => done());

                })
                })
    });

    describe("canActivateAsync", () => {
        it("can continue with correct applianceType", done => {
            appliance.applianceSafetyType = ApplianceSafetyType.electrical;
            electricalSafety.canActivateAsync({ applianceId: "1", jobId: "1" }, {settings: {applianceSafetyType: ApplianceSafetyType.electrical} })
            .then(result => {
                expect(result).toBe(true);
                done();
            });
        });

        it("can not continue with incorrect applianceType", done => {
            appliance.applianceSafetyType = ApplianceSafetyType.gas;
            electricalSafety.canActivateAsync({ applianceId: "1", jobId: "1" }, {settings: {applianceSafetyType: ApplianceSafetyType.electrical} })
            .then(result => {
                expect(result).not.toBe(true);
                done();
            });
        });
    });

    it("can call activate", done => {
        electricalSafety
            .loadLabels("")
            .then(() => electricalSafety.activateAsync({applianceId: "0", jobId: "1"}))
            .then(() => {
                expect(electricalSafety.viewState).toBe(ViewModelState.content);
                done();
            });
    });

});
