/// <reference path="../../../../../typings/app.d.ts" />

import {EventAggregator} from "aurelia-event-aggregator";
import {StateButtons} from "../../../../../app/hema/presentation/elements/stateButtons";
import {IJobService} from "../../../../../app/hema/business/services/interfaces/IJobService";
import {IEngineerService} from "../../../../../app/hema/business/services/interfaces/IEngineerService";
import {Router} from "aurelia-router";
import {IArchiveService} from "../../../../../app/hema/business/services/interfaces/IArchiveService";
import { ILabelService } from "../../../../../app/hema/business/services/interfaces/ILabelService";
import { ViewService } from "../../../../../app/hema/presentation/services/viewService";
import { IReferenceDataService } from "../../../../../app/hema/business/services/interfaces/IReferenceDataService";
import { DialogService, DialogResult } from "aurelia-dialog";
import { JobState } from "../../../../../app/hema/business/models/jobState";
import { State } from "../../../../../app/hema/business/services/stateMachine/state";
import { Job } from "../../../../../app/hema/business/models/job";
import { Task } from "../../../../../app/hema/business/models/task";
import { Engineer } from "../../../../../app/hema/business/models/engineer";
import {DataStateSummary} from "../../../../../app/hema/business/models/dataStateSummary";
import { WindowHelper } from "../../../../../app/hema/core/windowHelper";
import { IModalBusyService } from "../../../../../app/common/ui/services/IModalBusyService";
import { JobServiceConstants } from "../../../../../app/hema/business/services/constants/jobServiceConstants";
import { IChargeService } from "../../../../../app/hema/business/services/interfaces/charge/IchargeService";
import { Charge } from "../../../../../app/hema/business/models/charge/charge";
import { ChargeableTask } from "../../../../../app/hema/business/models/charge/chargeableTask";
import * as bignumber from "bignumber";
import { IBusinessRuleService } from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { QueryableBusinessRuleGroup } from "../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";

describe("the StateButtons module", () => {
    let stateButtons: StateButtons;
    let sandbox: Sinon.SinonSandbox;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let eaStub: EventAggregator;
    let routerStub: Router;
    let archiveServiceStub: IArchiveService;
    let labelServiceStub: ILabelService;
    let viewService: ViewService;
    let referenceDataServiceStub: IReferenceDataService;
    let dialogService: DialogService;
    let modalBusyServiceStub: IModalBusyService;
    let chargeServiceStub: IChargeService;
    let businessRuleServiceStub: IBusinessRuleService

    let job: Job;
    let engineer: Engineer;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        jobServiceStub = <IJobService>{};
        job = <Job>{ premises: {id: "123456"}};
        engineer = <Engineer>{};

        jobServiceStub.getJob = sandbox.stub().resolves(job);
        jobServiceStub.getJobState = sandbox.stub().resolves(<State<JobState>>{});
        jobServiceStub.setJobState = sandbox.stub().resolves(null);
        jobServiceStub.checkIfJobFinishTimeNeedsToBeUpdated = sandbox.stub().resolves(false);
        jobServiceStub.requiresAppointment = sandbox.stub().resolves(false);
                
        // eaStub = <EventAggregator>{};
        eaStub = new EventAggregator();
        // eaStub.publish = sandbox.stub();

        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);
        engineerServiceStub.getCurrentEngineer = sandbox.stub().resolves(engineer);
        engineerServiceStub.setStatus = sandbox.stub().resolves(null);

        routerStub = <Router> {};
        routerStub.navigate = sandbox.stub().returns(true);
        routerStub.navigateToRoute =  sandbox.stub().returns(true);

        archiveServiceStub = <IArchiveService>{};
        archiveServiceStub.addUpdateJobState = sandbox.stub().resolves(null);

        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sandbox.stub().resolves({
            "referenceDataOutOfDateDescription": "foo",
            "referenceDataOutOfDateTitle": "bar",
            "amend": "amend",
            "continue": "continue",
            "confirmation": "confirmation",
            "jobFinishTimeUpdateConfirmationMessage": "test",
            "jobCompletingText": "text"
        });

        viewService = <ViewService>{};
        viewService.saveAll = sandbox.stub().resolves(null);

        referenceDataServiceStub = <IReferenceDataService>{};
        referenceDataServiceStub.shouldUserRefreshReferenceData = sandbox.stub().resolves(false);

        dialogService = <DialogService>{};
        dialogService.open = sandbox.stub().resolves(null);

        let dataStateSummary = <DataStateSummary>{};
        dataStateSummary.getCombinedTotals = sandbox.stub().returns({invalid: 0, notVisited: 0});
        jobServiceStub.getDataStateSummary = sandbox.stub().resolves(dataStateSummary);

        modalBusyServiceStub = <IModalBusyService> {};
        modalBusyServiceStub.showBusy = sandbox.stub().resolves(Promise.resolve());
        modalBusyServiceStub.hideBusy = sandbox.stub().resolves(Promise.resolve());

        chargeServiceStub = <IChargeService> {};
        chargeServiceStub.startCharges = sandbox.stub().resolves(Promise.resolve());

        businessRuleServiceStub = <IBusinessRuleService> {};
        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};

        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("jobDoingStatuses").returns("C,CX,WA,IP");
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        stateButtons = new StateButtons(jobServiceStub, engineerServiceStub, eaStub, routerStub, archiveServiceStub, labelServiceStub, viewService,
            referenceDataServiceStub, dialogService, modalBusyServiceStub, chargeServiceStub, businessRuleServiceStub);

        WindowHelper.reload = sandbox.stub();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(stateButtons).toBeDefined();
    });

    describe("requestedStateChanged", () => {
        beforeEach(async () => {
            await stateButtons.attached();
        });

        it("can set job state to a new state, and save state and add to archive", async done => {
            stateButtons.jobId = "12345";

            await stateButtons.requestedStateChanged(JobState.done, JobState.complete);

            expect((jobServiceStub.setJobState as Sinon.SinonStub).calledWith("12345", JobState.done)).toBe(true);
            expect((archiveServiceStub.addUpdateJobState as Sinon.SinonStub).calledWith(job, engineer, JobState.done));
            done();
        });

        it("should job state set to a new state", async done => {
            stateButtons.jobId = "12345";
            jobServiceStub.requiresAppointment = sandbox.stub().resolves(false);
            await stateButtons.requestedStateChanged(JobState.complete, JobState.arrived);

            expect((jobServiceStub.setJobState as Sinon.SinonStub).calledWith("12345", JobState.complete)).toBe(true);
            done();
        });

        it("should not call jobService.setJobState and requestedState set to a old state", async done => {
            stateButtons.jobId = "12345";
            jobServiceStub.requiresAppointment = sandbox.stub().resolves(true);
            await stateButtons.requestedStateChanged(JobState.complete, JobState.arrived);

            expect(stateButtons.requestedState).toBe(2);
            expect((jobServiceStub.setJobState as Sinon.SinonStub).called).toBe(false);
            done();
        })

        it("can set state to en route and ensure engineer is working", async done => {
            engineerServiceStub.isWorking = sandbox.stub().resolves(false);

            await stateButtons.requestedStateChanged(JobState.enRoute, JobState.idle);

            expect((engineerServiceStub.setStatus as Sinon.SinonStub).called).toBe(true);
            done();
        });

        it("should call modalBusyServiceStub.showBusy", async done => {
            stateButtons.jobId = "12345";
            jobServiceStub.requiresAppointment = sandbox.stub().resolves(false);
            await stateButtons.requestedStateChanged(JobState.complete, JobState.arrived);
            expect((modalBusyServiceStub.showBusy as Sinon.SinonStub).called).toBe(true);
            done();
        });

        it("should call modalBusyServiceStub.hideBusy", async done => {
            stateButtons.jobId = "12345";
            jobServiceStub.requiresAppointment = sandbox.stub().resolves(false);
            await stateButtons.requestedStateChanged(JobState.complete, JobState.arrived);
            expect((modalBusyServiceStub.showBusy as Sinon.SinonStub).called).toBe(true);
            
            eaStub.publish(JobServiceConstants.JOB_COMPLETION_REFRESH);            
            while (!(modalBusyServiceStub.hideBusy as Sinon.SinonStub).called) {
                await Promise.delay(50);
                done();
            }
        });

        it("shouldn't call chargeService.startCharges when Job.isIncompleteSerialization returns false", async done => {
            stateButtons.jobId = "12345";
            jobServiceStub.requiresAppointment = sandbox.stub().resolves(false);
            jobServiceStub.getJob = sandbox.stub().resolves(
                <Job> {id: "1234", 
                        charge: <Charge> {tasks: []}
            });
            await stateButtons.requestedStateChanged(JobState.complete, JobState.arrived);
            expect((chargeServiceStub.startCharges as Sinon.SinonStub).called).toBe(false);
            done();
        });

        it("should call chargeService.startCharges when the charge model is not serialized properly", async done => {
            stateButtons.jobId = "12345";
            jobServiceStub.requiresAppointment = sandbox.stub().resolves(false);
            jobServiceStub.getJob = sandbox.stub().resolves(
                <Job> {id: "1234", 
                        charge: <Charge> {tasks: [<ChargeableTask> {discountAmount: new bignumber.BigNumber(0)}]}
            });
            await stateButtons.requestedStateChanged(JobState.complete, JobState.arrived);
            expect((chargeServiceStub.startCharges as Sinon.SinonStub).called).toBe(true);
            done();
        });

        it("shouldn't call chargeService.startCharges if the charge model has got the required properties", async done => {
            stateButtons.jobId = "12345";
            jobServiceStub.requiresAppointment = sandbox.stub().resolves(false);
            let chargeableTask: ChargeableTask = new ChargeableTask();
            chargeableTask.discountAmount = new bignumber.BigNumber(0);
            jobServiceStub.getJob = sandbox.stub().resolves(
                <Job> {id: "1234", 
                        charge: <Charge> {tasks: [chargeableTask]}
            });
            await stateButtons.requestedStateChanged(JobState.complete, JobState.arrived);
            expect((chargeServiceStub.startCharges as Sinon.SinonStub).called).toBe(false);
            done();
        });

        it("should redirect to activities route as the job finish time needs to be updated", async done => {
            jobServiceStub.checkIfJobFinishTimeNeedsToBeUpdated = sandbox.stub().resolves(true);
            stateButtons.jobId = "12345";
            job.tasks = [];
            let t1 = new Task(true, false);
            t1.id = "1";
            t1.status = "C";
            job.tasks.push(t1);

            let t2 = new Task(true, false);
            t2.id = "2";
            t2.status = "C";
            job.tasks.push(t2);

            dialogService.open = sandbox.stub().resolves(<DialogResult> {
                wasCancelled: false
            });

            await stateButtons.requestedStateChanged(JobState.complete, JobState.arrived);
            expect((routerStub.navigate as Sinon.SinonSpy).called).toBeTruthy();
            expect((routerStub.navigate as Sinon.SinonSpy).args[0][0]).toEqual("/customers/to-do/12345/activities");
            done();
        });

        it("should redirect to activity details route as the job finish time needs to be updated", async done => {
            jobServiceStub.checkIfJobFinishTimeNeedsToBeUpdated = sandbox.stub().resolves(true);
            stateButtons.jobId = "12345";
            job.tasks = [];
            let t1 = new Task(true, false);
            t1.id = "1";
            t1.status = "C";
            job.tasks.push(t1);

            dialogService.open = sandbox.stub().resolves(<DialogResult> {
                wasCancelled: false
            });

            await stateButtons.requestedStateChanged(JobState.complete, JobState.arrived);
            expect((routerStub.navigate as Sinon.SinonSpy).called).toBeTruthy();
            expect((routerStub.navigate as Sinon.SinonSpy).args[0][0]).toEqual("/customers/to-do/12345/activities/1/details");
            done();
        });

        it("should call setJobState method as job finish time confirmation dialog is cancelled ", async done => {
            jobServiceStub.checkIfJobFinishTimeNeedsToBeUpdated = sandbox.stub().resolves(true);
            stateButtons.jobId = "12345";
            job.tasks = [];
            let t1 = new Task(true, false);
            t1.id = "1";
            job.tasks.push(t1);

            dialogService.open = sandbox.stub().resolves(<DialogResult> {
                wasCancelled: true
            });

            await stateButtons.requestedStateChanged(JobState.done, JobState.complete);
            expect((jobServiceStub.setJobState as Sinon.SinonStub).calledWith("12345", JobState.done)).toBe(true);
            expect((archiveServiceStub.addUpdateJobState as Sinon.SinonStub).calledWith(job, engineer, JobState.done));
            done();
        });
        
        it("shouldn't call chargeService.startCharges if its enroute or arrived status change", async done => {
            stateButtons.jobId = "12345";
            jobServiceStub.requiresAppointment = sandbox.stub().resolves(false);
            
            await stateButtons.requestedStateChanged(JobState.enRoute, JobState.idle);
            expect((chargeServiceStub.startCharges as Sinon.SinonStub).called).toBe(false);
            done();

            await stateButtons.requestedStateChanged(JobState.arrived, JobState.enRoute);
            expect((chargeServiceStub.startCharges as Sinon.SinonStub).called).toBe(false);
            done();
        });        
    })
});
