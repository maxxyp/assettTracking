/// <reference path="../../../../../typings/app.d.ts" />

import {JobSummaryFactory} from "../../../../../app/hema/presentation/factories/jobSummaryFactory";
import {ITaskFactory} from "../../../../../app/hema/presentation/factories/interfaces/ITaskFactory";

import {Job} from "../../../../../app/hema/business/models/job";
import {Visit} from "../../../../../app/hema/business/models/visit";
import {Contact} from "../../../../../app/hema/business/models/contact";
import {Premises} from "../../../../../app/hema/business/models/premises";
import {Address} from "../../../../../app/hema/business/models/address";
import {Task} from "../../../../../app/hema/business/models/task";

import {TaskSummaryViewModel} from "../../../../../app/hema/presentation/models/taskSummaryViewModel";

describe("the JobSummaryFactory", () => {
    let sandbox: Sinon.SinonSandbox;
    let jobSummaryFactory: JobSummaryFactory;

    let taskFactoryStub: ITaskFactory;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        taskFactoryStub = <ITaskFactory>{};

        jobSummaryFactory = new JobSummaryFactory(taskFactoryStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(jobSummaryFactory).toBeDefined();
    });

    describe("the createJobSummaryViewModel function", () => {
        let jobBusinessModel: Job;

        beforeEach(() => {
            jobBusinessModel = new Job();
            jobBusinessModel.id = "J123456789";

            jobBusinessModel.visit = new Visit();
            jobBusinessModel.visit.specialInstructions = "These are some special instructions for the visit";
            jobBusinessModel.visit.timeSlotFrom = new Date(2015, 1, 1, 8, 0);
            jobBusinessModel.visit.timeSlotTo = new Date(2015, 1, 1, 12, 0);

            jobBusinessModel.contact = new Contact();
            jobBusinessModel.contact.title = "Mr";
            jobBusinessModel.contact.firstName = "John";
            jobBusinessModel.contact.middleName = "Texas";
            jobBusinessModel.contact.lastName = "Smith";
            jobBusinessModel.contact.password = "stinky";
            jobBusinessModel.contact.homePhone = "01234567890";

            jobBusinessModel.premises = new Premises();
            jobBusinessModel.premises.accessInfo = "gate code 0000";
            jobBusinessModel.premises.id = "P1234567890";
            jobBusinessModel.premises.address = new Address();
            jobBusinessModel.premises.address.premisesName = "Address Line 1";
            jobBusinessModel.premises.address.line = ["Address Line 2", "Address Line 3"];
            jobBusinessModel.premises.address.town = "town";
            jobBusinessModel.premises.address.county = "county";
            jobBusinessModel.premises.address.postCode = "postcode";
            jobBusinessModel.premises.address.country = "country";

            jobBusinessModel.tasks = [];
            jobBusinessModel.tasks.push(new Task(true, false));
            jobBusinessModel.tasks.push(new Task(true, false));

            taskFactoryStub.createTaskSummaryViewModel = sandbox.stub().returns(new TaskSummaryViewModel());
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called", () => {
            let createJobSummaryViewModelSpy: Sinon.SinonSpy = sandbox.spy(jobSummaryFactory, "createJobSummaryViewModel");

            jobSummaryFactory.createJobSummaryViewModel(jobBusinessModel);

            expect(createJobSummaryViewModelSpy.calledOnce).toBeTruthy();
        });

        it("can map fields correctly", () => {
            let jobSummaryViewModel = jobSummaryFactory.createJobSummaryViewModel(jobBusinessModel);

            expect(jobSummaryViewModel).toBeDefined();
            expect(jobSummaryViewModel.jobNumber).toEqual("J123456789");

            expect(jobSummaryViewModel.specialInstructions).toEqual("These are some special instructions for the visit");
            expect(jobSummaryViewModel.earliestStartTime).toEqual(new Date(2015, 1, 1, 8, 0));
            expect(jobSummaryViewModel.latestStartTime).toEqual(new Date(2015, 1, 1, 12, 0));

            expect(jobSummaryViewModel.contactName).toEqual("Mr John Texas Smith");
            expect(jobSummaryViewModel.password).toEqual("stinky");
            expect(jobSummaryViewModel.contactTelephoneNumber).toEqual("01234567890");

            expect(jobSummaryViewModel.accessInfo).toEqual("gate code 0000");
            expect(jobSummaryViewModel.premisesId).toEqual("P1234567890");
            expect(jobSummaryViewModel.address.premisesName).toEqual("Address Line 1");
            expect(jobSummaryViewModel.address.line[0]).toEqual("Address Line 2");
            expect(jobSummaryViewModel.address.line[1]).toEqual("Address Line 3");
            expect(jobSummaryViewModel.address.town).toEqual("town");
            expect(jobSummaryViewModel.address.county).toEqual("county");
            expect(jobSummaryViewModel.address.postCode).toEqual("postcode");
            expect(jobSummaryViewModel.address.country).toEqual("country");

            expect(jobSummaryViewModel.tasks.length).toEqual(2);
        });

        it("defect", () => {

            jobBusinessModel.premises = new Premises();
            jobBusinessModel.premises.address = new Address();
            jobBusinessModel.premises.address.premisesName = "3/2,";
            jobBusinessModel.premises.address.houseNumber = "76";
            jobBusinessModel.premises.address.line = ["Howard Street"];
            jobBusinessModel.premises.address.county = "Glasgow";
            jobBusinessModel.premises.address.postCode = "4EE";
            jobBusinessModel.premises.address.country = "G1";

            let jobSummaryViewModel = jobSummaryFactory.createJobSummaryViewModel(jobBusinessModel);
            expect(jobSummaryViewModel.shortAddress).toEqual("3/2, 4EE");
            expect(jobSummaryViewModel.address.premisesName).toEqual("3/2");
        });

    });
});
