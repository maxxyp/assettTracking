/// <reference path="../../../../../../typings/app.d.ts" />

import { DialogService } from "aurelia-dialog";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { IValidationService } from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { PropertyObserver } from "aurelia-binding";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { Archives } from "../../../../../../app/hema/presentation/modules/archives/archives";
import { IArchiveService } from "../../../../../../app/hema/business/services/interfaces/IArchiveService";
import { Archive } from "../../../../../../app/hema/business/models/archive";
import SinonFakeTimers = Sinon.SinonFakeTimers;
import { ArchiveJob } from "../../../../../../app/hema/business/models/archiveJob";
import { JobState } from "../../../../../../app/hema/business/models/jobState";

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

describe("the Archives module", () => {
    let sandbox: Sinon.SinonSandbox;
    let archives: Archives;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let validationServiceStub: IValidationService;
    let businessRulesServiceStub: IBusinessRuleService;
    let catalogServiceStub: ICatalogService;
    let dialogServiceStub: DialogService;
    let showContentSpy: Sinon.SinonSpy;
    let archiveServiceStub: IArchiveService;

    let clock: SinonFakeTimers;

    let archive1, archive2: Archive;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        clock = sinon.useFakeTimers(new Date("2010-01-01").getTime());

        dialogServiceStub = <DialogService>{};
        jobServiceStub = <IJobService>{};
        engineerServiceStub = <IEngineerService>{};
        labelServiceStub = <ILabelService>{};
        eventAggregatorStub = <EventAggregator>{};
        validationServiceStub = <IValidationService>{};
        businessRulesServiceStub = <IBusinessRuleService>{};
        catalogServiceStub = <ICatalogService>{};
        archiveServiceStub = <IArchiveService>{};

        let propertyObserverStub = <PropertyObserver>{};
        propertyObserverStub.subscribe = sandbox.spy();

        catalogServiceStub.getFieldOperativeStatuses = sandbox.stub().resolves([]);
        catalogServiceStub.getActivityComponentVisitStatuses = sandbox.stub().resolves([]);

        engineerServiceStub.isWorking = sandbox.stub().resolves(true);

        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};
        businessRulesServiceStub.getRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        validationServiceStub.build = sandbox.stub().resolves([]);

        let subscription: Subscription = <Subscription>{};
        eventAggregatorStub.subscribe = sandbox.stub().resolves(subscription);
        eventAggregatorStub.publish = sandbox.stub();

        const today = new Date("2010-01-01");

        archive1 = new Archive("1");
        archive1.timestamp = today;

        archive2 = new Archive("1");
        archive2.timestamp = addMinutes(today, 10);

        let all = [archive1, archive2];

        archiveServiceStub.getArchiveByDate = sandbox.stub().resolves(all);
        archiveServiceStub.getEarliestDate = sandbox.stub().resolves(new Date());

        const labelsMockData = {
            "jobStatusArrived": "jobStatusArrived",
            "jobStatusCompleted": "jobStatusCompleted",
            "jobStatusDeSelected": "jobStatusDeSelected",
            "jobStatusDone": "jobStatusDone",
            "jobStatusEnRoute": "jobStatusEnRoute",
        };

        labelServiceStub.getGroup = sandbox.stub().resolves(labelsMockData);

        archives = new Archives(jobServiceStub, engineerServiceStub, labelServiceStub,
            eventAggregatorStub, validationServiceStub, businessRulesServiceStub, catalogServiceStub
            , dialogServiceStub, archiveServiceStub);

        archives.labels["jobStatusArrived"] = "";
        archives.labels["jobStatusCompleted"] = "";
        archives.labels["jobStatusDeSelected"] = "";
        archives.labels["jobStatusDone"] = "";
        archives.labels["jobStatusEnRoute"] = "";

        archives.showContent = showContentSpy = sandbox.spy();

    });

    afterEach(() => {
        sandbox.restore();
        clock.restore();
    });

    it("can be created", () => {
        expect(archives).toBeDefined();
    });

    describe("work out duration for job states and previous jobs", () => {

        describe("work out duration archived jobs", () => {

            it("sets min date", done => {
                archives.activateAsync().then(() => {
                    expect(archives.minDate).toEqual(archive1.timestamp);
                    done();
                });
            });

            it("adds archives to archiveModel array", done => {
                archives.activateAsync().then(() => {
                    expect(archives.archiveModel.length).toEqual(2);
                    done();
                });
            });

            it("has undefined start time for archive models", done => {
                archives.activateAsync().then(() => {
                    expect(archives.archiveModel[0].start).toBeUndefined();
                    expect(archives.archiveModel[1].start).toBeUndefined();
                    done();
                });
            });

            it("sets undefined end time for archive models", done => {
                archives.activateAsync().then(() => {
                    expect(archives.archiveModel[0].end).toBeUndefined();
                    expect(archives.archiveModel[1].end).toBeUndefined();
                    done();
                });
            });

            it("set undefined duration for current day archives", done => {
                archives.activateAsync().then(() => {
                    expect(archives.archiveModel[0].duration).toBeUndefined();
                    expect(archives.archiveModel[1].duration).toBeUndefined();
                    done();
                });
            });
        });

        describe("work out duration between job status", () => {

            beforeEach(() => {

                const today = new Date("2009-01-01");

                archive1 = new Archive("1");

                let all = [archive1];

                let ac1 = new ArchiveJob();
                ac1.timestamp = today;
                ac1.state = JobState.arrived;

                let ac2 = new ArchiveJob();
                ac2.timestamp = addMinutes(today, 63);
                ac2.state = JobState.arrived;

                archive1.jobStates = [ac1, ac2];

                archiveServiceStub.getArchiveByDate = sandbox.stub().resolves(all);

                archives = new Archives(jobServiceStub, engineerServiceStub, labelServiceStub,
                    eventAggregatorStub, validationServiceStub, businessRulesServiceStub, catalogServiceStub,
                    dialogServiceStub, archiveServiceStub);

                archives.labels["jobStatusArrived"] = "";
                archives.labels["jobStatusCompleted"] = "";
                archives.labels["jobStatusDeSelected"] = "";
                archives.labels["jobStatusDone"] = "";
                archives.labels["jobStatusEnRoute"] = "";
            });

            it("set start for job state in archive", done => {
                archives.activateAsync().then(() => {
                    expect(archives.archiveModel[0].jobStates[0].start).toEqual('00:00');
                    done();
                });
            });

            it("set end for job state in archive", done => {
                archives.activateAsync().then(() => {
                    expect(archives.archiveModel[0].jobStates[0].end).toEqual('01:03');
                    done();
                });
            });

            it("set duration for job state in archive", done => {
                archives.activateAsync().then(() => {
                    expect(archives.archiveModel[0].jobStates[0].duration).toEqual('63');
                    done();
                });
            });

        });
    });
});
