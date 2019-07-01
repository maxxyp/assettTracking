/// <reference path="../../../../../typings/app.d.ts" />

import { PreviousJobsFactory } from "../../../../../app/hema/presentation/factories/previousJobsFactory";
import { Job as JobBusinessModel } from "../../../../../app/hema/business/models/job";
import { Task } from "../../../../../app/hema/business/models/task";
import { Activity } from "../../../../../app/hema/business/models/activity";
import { History } from "../../../../../app/hema/business/models/history";
import * as moment from "moment";
import { IBusinessRuleService } from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { QueryableBusinessRuleGroup } from "../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";

describe("the PreviousJobsFactory", () => {
    let sandbox: Sinon.SinonSandbox;
    let previousJobFactory: PreviousJobsFactory;
    let businessRuleServiceStub: IBusinessRuleService;

    const TODAY_DATE = "2016-12-31";

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        businessRuleServiceStub = <IBusinessRuleService>{};
        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};
        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();

        getBusinessRuleStub.withArgs("noChargePrefix").returns("NC");
        getBusinessRuleStub.withArgs("previousJobsAllowedInMonths").returns("60");
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        previousJobFactory = new PreviousJobsFactory(businessRuleServiceStub);

        const today = moment(TODAY_DATE).toDate();
        jasmine.clock().mockDate(today);
    });

    afterEach(() => {
        sandbox.restore();
        jasmine.clock().uninstall();
    });

    it("can be called with empty job history tasks", (done) => {
        let job: JobBusinessModel = new JobBusinessModel();

        previousJobFactory.createPreviousJobsViewModel(job)
            .then((previousJobViewModel) => {
                expect(previousJobViewModel).toBeDefined();
                done();
            });
    });

    it("can be called with job", (done) => {
        let job: JobBusinessModel = new JobBusinessModel();
        job.history = new History();
        job.history.tasks = [];

        previousJobFactory.createPreviousJobsViewModel(job)
            .then((previousJobViewModel) => {
                expect(previousJobViewModel).toBeDefined();
                done();
            });
    });

    it("has previous job with 1 task", (done) => {
        let task: Task = new Task(true, false);
        task.id = "1234567890001";
        task.activities = [new Activity(moment("2016-01-01").toDate())];

        let job: JobBusinessModel = new JobBusinessModel();
        job.id = "0";
        job.history = new History();
        job.history.tasks = [task];

        previousJobFactory.createPreviousJobsViewModel(job)
            .then((previousJobViewModel) => {
                expect(previousJobViewModel).toBeDefined();
                expect(previousJobViewModel.length).toEqual(1);
                done();
            });
    });

    it("has previous job with 2 tasks", (done) => {
        let task: Task = new Task(true, false);
        task.id = "1234567890001";
        task.activities = [new Activity(moment("2016-03-01").toDate())];

        let task2: Task = new Task(true, false);
        task2.id = "1234567890002";
        task2.activities = [new Activity(moment("2016-01-01").toDate())];

        let job: JobBusinessModel = new JobBusinessModel();
        job.id = "0";
        job.history = new History();
        job.history.tasks = [task, task2];

        previousJobFactory.createPreviousJobsViewModel(job)
            .then((previousJobViewModel) => {
                expect(previousJobViewModel).toBeDefined();
                expect(previousJobViewModel.length).toEqual(1);
                expect(previousJobViewModel[0].tasks.length).toEqual(2);
                done();
            });
    });

    it("has more than 10 previous jobs", (done) => {

        let lastYear = new Date().getFullYear() - 1;

        let task: Task = new Task(true, false);
        task.id = "0000000001001";
        task.activities = [new Activity(moment(lastYear + "-01-01").toDate())];

        let task2: Task = new Task(true, false);
        task2.id = "0000000002001";
        task2.activities = [new Activity(moment(lastYear + "-02-01").toDate())];

        let task3: Task = new Task(true, false);
        task3.id = "0000000003001";
        task3.activities = [new Activity(moment(lastYear + "-03-01").toDate())];

        let task4: Task = new Task(true, false);
        task4.id = "0000000004001";
        task4.activities = [new Activity(moment(lastYear + "-04-01").toDate())];

        let task5: Task = new Task(true, false);
        task5.id = "0000000005001";
        task5.activities = [new Activity(moment(lastYear + "-05-01").toDate())];

        let task6: Task = new Task(true, false);
        task6.id = "0000000006001";
        task6.activities = [new Activity(moment(lastYear + "-06-01").toDate())];

        let task7: Task = new Task(true, false);
        task7.id = "0000000007001";
        task7.activities = [new Activity(moment(lastYear + "-07-01").toDate())];

        let task8: Task = new Task(true, false);
        task8.id = "0000000008001";
        task8.activities = [new Activity(moment(lastYear + "-08-01").toDate())];

        let task9: Task = new Task(true, false);
        task9.id = "0000000009001";
        task9.activities = [new Activity(moment(lastYear + "-09-01").toDate())];

        let task10: Task = new Task(true, false);
        task10.id = "0000000010001";
        task10.activities = [new Activity(moment(lastYear + "-10-01").toDate())];

        let task11: Task = new Task(true, false);
        task11.id = "0000000011001";
        task11.activities = [new Activity(moment(lastYear + "-11-01").toDate())];

        let job: JobBusinessModel = new JobBusinessModel();
        job.id = "0";
        job.history = new History();
        job.history.tasks = [task, task2, task3, task4, task5, task6, task7, task8, task9, task10, task11];

        previousJobFactory.createPreviousJobsViewModel(job)
            .then((previousJobViewModel) => {
                expect(previousJobViewModel).toBeDefined();
                expect(previousJobViewModel.length).toEqual(11);
                done();
            });
    });

    //As per the new request in part of this incident - INC09871740, It changed to display the previous visits for last 60 Months (5 Years) irrespective of the visits.
    it("has more tasks no older than 60 months", (done) => {
        const today = moment(TODAY_DATE).toDate();

        let task: Task = new Task(true, false);
        task.id = "0000000001001";
        task.activities = [new Activity(today)];
        let task2: Task = new Task(true, false);
        task2.id = "0000000002001";
        task2.activities = [new Activity(today)];
        let task3: Task = new Task(true, false);
        task3.id = "0000000003001";
        task3.activities = [new Activity(moment(TODAY_DATE).subtract(60, "months").add(1, "day").toDate())];
        let task4: Task = new Task(true, false);
        task4.id = "0000000004001";
        task4.activities = [new Activity(moment(TODAY_DATE).subtract(60, "months").add(-1, "minute").toDate())];
        let job: JobBusinessModel = new JobBusinessModel();
        job.id = "0";
        job.history = new History();
        job.history.tasks = [task, task2, task3, task4];
        previousJobFactory.createPreviousJobsViewModel(job)
            .then((previousJobViewModel) => {
                expect(previousJobViewModel).toBeDefined();
                expect(previousJobViewModel.length).toEqual(3);
                done();
            });
    });


    it("will correctly set latest job date", (done) => {
        let task: Task = new Task(true, false);
        task.id = "0000000001001";
        let sdate: moment.Moment = moment().add("days", 1);
        task.activities = [new Activity(sdate.toDate())];

        let task2: Task = new Task(true, false);
        task2.id = "0000000001002";
        let edate: moment.Moment = moment().add("days", 30);
        task2.activities = [new Activity(edate.toDate())];

        let job: JobBusinessModel = new JobBusinessModel();
        job.id = "0";
        job.history = new History();
        job.history.tasks = [task, task2];

        previousJobFactory.createPreviousJobsViewModel(job)
            .then((previousJobViewModel) => {
                expect(previousJobViewModel).toBeDefined();
                expect(previousJobViewModel[0].date).toEqual(edate.toDate());
                done();
            });
    });

    describe("isCharge setting", () => {

        let task: Task = new Task(true, false);
        task.id = "0000000001001";
        task.activities = [new Activity(moment().toDate())];

        let task2: Task = new Task(true, false);
        task2.id = "0000000001002";
        task2.activities = [new Activity(moment().toDate())];

        task.jobType = "jobType1";
        task.chargeType = "";
        task.applianceType = "applianceType1";

        task2.jobType = "jobType2";
        task2.applianceType = "applianceType2";

        let job: JobBusinessModel = new JobBusinessModel();
        job.id = "0";
        job.history = new History();

        beforeEach(() => {

        });

        it("sets isCharge to false when no chargeable code for task", (done) => {

            job.history.tasks = [task, task2];

            previousJobFactory.createPreviousJobsViewModel(job)
                .then((previousJobViewModel) => {
                    expect(previousJobViewModel[0].isCharge).toBe(false);
                    done();
                });
        });

        it("sets isCharge to true when chargeable code for task", (done) => {

            task.chargeType = "SLO123";

            job.history.tasks = [task, task2];

            previousJobFactory.createPreviousJobsViewModel(job)
                .then((previousJobViewModel) => {
                    expect(previousJobViewModel[0].isCharge).toBe(true);
                    done();
                });
        });

        it("sets isCharge to false when no chargeable codes for task", (done) => {

            task.chargeType = "NC123";

            job.history.tasks = [task];

            previousJobFactory.createPreviousJobsViewModel(job)
                .then((previousJobViewModel) => {
                    expect(previousJobViewModel[0].isCharge).toBe(false);
                    done();
                });
        });


    });


});