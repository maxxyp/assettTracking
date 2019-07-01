/// <reference path="../../../../../typings/app.d.ts" />

import { IJobService } from "../../../../../app/hema/business/services/interfaces/IJobService";
import { Job } from "../../../../../app/hema/business/models/job";
import { IAppointmentBookingService } from "../../../../../app/hema/business/services/interfaces/IAppointmentBookingService";
import { AppointmentBookingService } from "../../../../../app/hema/business/services/appointmentBookingService";
import { Premises } from "../../../../../app/hema/business/models/premises";
import { Appointment } from "../../../../../app/hema/business/models/appointment";
import { PartsDetail } from "../../../../../app/hema/business/models/partsDetail";
import { Part } from "../../../../../app/hema/business/models/part";
import { PartsBasket } from "../../../../../app/hema/business/models/partsBasket";
import { IBusinessRuleService } from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { QueryableBusinessRuleGroup } from '../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup';
import { DateHelper } from "../../../../../app/hema/core/dateHelper";

describe("the AppointmentBookingService module", () => {
    let appointmentBookingService: IAppointmentBookingService;
    let sandbox: Sinon.SinonSandbox;
    let jobServiceStub: IJobService;
    let businessRuleServiceStub: IBusinessRuleService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        jobServiceStub = <IJobService>{};
        businessRuleServiceStub = <IBusinessRuleService>{};

        appointmentBookingService = new AppointmentBookingService(jobServiceStub, businessRuleServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(appointmentBookingService).toBeDefined();
    });

    it("getGeneralAccessInformation, returns accessinfo", (done) => {
        let job: Job = new Job();
        let premises: Premises = new Premises();
        premises.accessInfo = "GATE NO 123";
        job.premises = premises;
        jobServiceStub.getJob = sandbox.stub().resolves(job);
        appointmentBookingService.getGeneralAccessInformation("sdfsdf").then((accessInfo) => {
            expect(accessInfo === "GATE NO 123").toBeTruthy();
            done();
        });
    });

    it("getGeneralAccessInformation, returns undefined", (done) => {
        jobServiceStub.getJob = sandbox.stub().resolves(undefined);
        appointmentBookingService.getGeneralAccessInformation("sdfsdf").then((accessInfo) => {
            expect(accessInfo === undefined).toBeTruthy();
            done();
        });
    });

    it("save, saves job", (done) => {
        let job: Job = new Job();
        let premises: Premises = new Premises();
        premises.accessInfo = "GATE NO 123";
        job.premises = premises;
        jobServiceStub.getJob = sandbox.stub().resolves(job);
        jobServiceStub.setJob = sandbox.stub().resolves(undefined);
        let appointment: Appointment = new Appointment();
        appointment.jobId = "1234";
        appointmentBookingService.save(appointment).then(() => {
            expect(1 === 1).toBeTruthy();
            done();
        });
    });

    it("removeAppointment, appointment removed", (done) => {
        let job: Job = new Job();
        let premises: Premises = new Premises();
        premises.accessInfo = "GATE NO 123";
        job.premises = premises;
        jobServiceStub.getJob = sandbox.stub().resolves(job);
        jobServiceStub.setJob = sandbox.stub().resolves(undefined);
        appointmentBookingService.removeAppointment("1234").then(() => {
            expect(1 === 1).toBeTruthy();
            done();
        });
    });

    it("load, appointment loaded", (done) => {
        let job: Job = new Job();
        let premises: Premises = new Premises();
        premises.accessInfo = "GATE NO 123";
        job.premises = premises;
        job.appointment = new Appointment();
        jobServiceStub.getJob = sandbox.stub().resolves(job);
        appointmentBookingService.load("1234").then((appointment) => {
            expect(appointment).toBeDefined();
            done();
        });
    });

    it("hasParts, return true", (done) => {
        let job: Job = new Job();

        let partToOrder: Part = new Part();
        partToOrder.partOrderStatus = "O";

        let partsBasket: PartsBasket = new PartsBasket();
        partsBasket.partsToOrder = [];
        partsBasket.partsToOrder.push(partToOrder);

        let partDetail: PartsDetail = new PartsDetail();
        partDetail.partsBasket = partsBasket;

        job.partsDetail = partDetail;
        jobServiceStub.getJob = sandbox.stub().resolves(job);
        let ruleGroup = <QueryableBusinessRuleGroup>{};
        let getBusinessRuleStub = ruleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("partOrderStatus").returns("O");
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(ruleGroup);
        appointmentBookingService.hasParts("1234").then((hasParts) => {
            expect(hasParts).toBeTruthy();
            done();
        });
    });

    it("hasParts, return false", (done) => {
        let job: Job = new Job();
        jobServiceStub.getJob = sandbox.stub().resolves(job);
        let ruleGroup = <QueryableBusinessRuleGroup>{};
        let getBusinessRuleStub = ruleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("partOrderStatus").returns("O");
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(ruleGroup);
        appointmentBookingService.hasParts("1234").then((hasParts) => {
            expect(hasParts).toBeFalsy();
            done();
        });
    });

    describe("checkCutOffTimeExceededWithParts", () => {
        it("Should return false if its sunday - friday within cutoff time limit", () => {
            let dateOnly: Date = new Date(2016, 9, 2);
            let timeOnly: Date = new Date(2016, 9, 2, 11, 0);

            let cutOffTime = "18:00";
            let actual = appointmentBookingService.checkCutOffTimeExceededWithParts(dateOnly, timeOnly, cutOffTime);
            expect(actual).toBeFalsy();
        });

        it("Should return true if its sunday - friday past cutoff time limit", () => {
            let dateOnly: Date = new Date(2016, 9, 2);
            let timeOnly: Date = new Date(2016, 9, 2, 20, 0);

            let cutOffTime = "18:00";
            let actual = appointmentBookingService.checkCutOffTimeExceededWithParts(dateOnly, timeOnly, cutOffTime);
            expect(actual).toBeTruthy();
        });

        it("saturday, returns true", () => {
            let dateOnly: Date = new Date(2016, 9, 1, 20, 0);
            let timeOnly: Date = new Date(2016, 9, 1, 20, 0);

            let cutOffTime = "18:00";
            let actual = appointmentBookingService.checkCutOffTimeExceededWithParts(dateOnly, timeOnly, cutOffTime);
            expect(actual).toBeTruthy();
        });
    });

    describe("getNexAppointmentDateWithParts", () => {
        it("MonToSaturday, returns same date", () => {
            let dateAndTime: Date = new Date(2016, 9, 1);
            let actual = appointmentBookingService.getNexAppointmentDateWithParts(dateAndTime);
            expect(actual.getDate() === dateAndTime.getDate()).toBeTruthy();
            expect(actual.getMonth() === dateAndTime.getMonth()).toBeTruthy();
            expect(actual.getFullYear() === dateAndTime.getFullYear()).toBeTruthy();
        });

        it("sunday, returns next day", () => {
            let dateAndTime: Date = new Date(2016, 9, 2);
            let actual = appointmentBookingService.getNexAppointmentDateWithParts(dateAndTime);
            expect(actual.getDate() === 3).toBeTruthy();
            expect(actual.getMonth() === dateAndTime.getMonth()).toBeTruthy();
            expect(actual.getFullYear() === dateAndTime.getFullYear()).toBeTruthy();
        });
    });

    describe("checkIfAppointmentNeedsToBeRebooked", () => {
        it("Should return true if an appointment is booked for today", () => {
            let appointmentDate: Date = new Date(2017, 9, 2, 12, 0);
            let timeSlot: Date = new Date(2017, 9, 2, 12, 0);
            DateHelper.getTodaysDate = sandbox.stub().returns(new Date(2017, 9, 2));

            let cutOffTime = "18:00";
            let NeedsRebook = appointmentBookingService.checkIfAppointmentNeedsToBeRebooked(appointmentDate, timeSlot, cutOffTime);
            expect(NeedsRebook).toBeTruthy();
        });

        it("Should return true if an appointment is booked after the cutoff time", () => {
            let appointmentDate: Date = new Date(2017, 9, 2, 20, 0);
            let timeSlot: Date = new Date(2017, 9, 2, 20, 0);
            DateHelper.getTodaysDate = sandbox.stub().returns(new Date(2017, 9, 1));

            let cutOffTime = "18:00";
            let NeedsRebook = appointmentBookingService.checkIfAppointmentNeedsToBeRebooked(appointmentDate, timeSlot, cutOffTime);
            expect(NeedsRebook).toBeTruthy();
        });

        it("Should return true if an appointment is booked for sunday", () => {
            let appointmentDate: Date = new Date(2017, 9, 1, 20, 0);
            let timeSlot: Date = new Date(2017, 9, 1, 12, 0);
            DateHelper.getTodaysDate = sandbox.stub().returns(new Date(2017, 8, 30));

            let cutOffTime = "18:00";
            let NeedsRebook = appointmentBookingService.checkIfAppointmentNeedsToBeRebooked(appointmentDate, timeSlot, cutOffTime);
            expect(NeedsRebook).toBeTruthy();
        });

        it("Should return false if an appointment is booked for tomorrow before cutoff time", () => {
            let appointmentDate: Date = new Date(2017, 9, 3, 10, 0);
            let timeSlot: Date = new Date(2017, 9, 3, 12, 0);
            DateHelper.getTodaysDate = sandbox.stub().returns(new Date(2017, 9, 2));

            let cutOffTime = "18:00";
            let NeedsRebook = appointmentBookingService.checkIfAppointmentNeedsToBeRebooked(appointmentDate, timeSlot, cutOffTime);
            expect(NeedsRebook).toBeFalsy();
        });
    });
});
