/// <reference path="../../../../../../typings/app.d.ts" />

import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { Job } from "../../../../../../app/hema/business/models/job";
import { Task } from "../../../../../../app/hema/business/models/task";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { Appointment } from "../../../../../../app/hema/business/models/appointment";
import { AppointmentBooking } from "../../../../../../app/hema/presentation/modules/appointment/appointmentBooking";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { Router } from "aurelia-router";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { IValidationService } from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import { BindingEngine, PropertyObserver } from "aurelia-binding";
import { IAppointmentBookingService } from "../../../../../../app/hema/business/services/interfaces/IAppointmentBookingService";
import { DialogService, DialogResult } from "aurelia-dialog";
import * as moment from "moment";
import { DateHelper } from "../../../../../../app/hema/core/dateHelper";
import { Engineer } from "../../../../../../app/hema/business/models/engineer";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/QueryableBusinessRuleGroup";

describe("the AppointmentBooking module", () => {
    let appointmentBooking: AppointmentBooking;
    let sandbox: Sinon.SinonSandbox;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let labelServiceStub: ILabelService;
    let routerStub: Router;
    let eventAggregatorStub: EventAggregator;
    let validationServiceStub: IValidationService;
    let businessRulesServiceStub: IBusinessRuleService;
    let catalogServiceStub: ICatalogService;
    let bindingEngineStub: BindingEngine;
    let appointmentBookingServiceStub: IAppointmentBookingService;
    let dialogServiceStub: DialogService;
    let showContentSpy: Sinon.SinonSpy;
    let subscribeSpy: Sinon.SinonSpy;
    let disposeSpy: Sinon.SinonSpy;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        jobServiceStub = <IJobService>{};
        engineerServiceStub = <IEngineerService>{};
        labelServiceStub = <ILabelService>{};
        routerStub = <Router>{};
        eventAggregatorStub = <EventAggregator>{};
        validationServiceStub = <IValidationService>{};
        businessRulesServiceStub = <IBusinessRuleService>{};
        catalogServiceStub = <ICatalogService>{};
        bindingEngineStub = <BindingEngine>{};
        appointmentBookingServiceStub = <IAppointmentBookingService>{};
        dialogServiceStub = <DialogService>{};

        engineerServiceStub.isWorking = sandbox.stub().resolves(true);

        const engineer = new Engineer();
        engineer.id = "222";

        engineerServiceStub.getCurrentEngineer = sandbox.stub().resolves(engineer);

        let businessRuleGroup = {
            "promiseDateWarningThreshold": 55,
            "cutOffTime": "12:00",
            "preferredEngineerIdMinValue": 1,
            "preferredEngineerIdMaxValue": 9,
            "appointmentAllowedActivityStatus": "IV,SE,IP",
            "estimatedEndTimeInMinutes": 1440,
            "estimatedDurationOfAppointmentPlaceholder": "",
            "preferredEngineerIdPlaceholder": "",
            "preferredEngineerIdMaxLength": "",
            "estimatedDurationOfAppointmentMaxLength": "",
            "AM": 8
        };

        businessRulesServiceStub.getRuleGroup = sandbox.stub().resolves(businessRuleGroup);

        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};

        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("activityPartsRequiredStatus").returns("IP");
        businessRulesServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);


        validationServiceStub.build = sandbox.stub().resolves([]);

        catalogServiceStub.getAppointmentBands = sandbox.stub().resolves(null);

        appointmentBookingServiceStub.hasParts = sandbox.stub().returns(Promise.resolve(true));
        appointmentBookingServiceStub.getNexAppointmentDateWithParts = sandbox.stub().returns(new Date(2016, 9, 1));
        let appointment: Appointment = new Appointment();
        appointmentBookingServiceStub.load = sandbox.stub().resolves(appointment);
        appointmentBookingServiceStub.getGeneralAccessInformation = sandbox.stub().resolves("GATE NO 1");
        appointmentBookingServiceStub.checkCutOffTimeExceededWithParts = sandbox.stub().returns(false);
        appointmentBookingServiceStub.removeAppointment = sandbox.stub().resolves(undefined);

        let subscription: Subscription = <Subscription>{};
        eventAggregatorStub.subscribe = sandbox.stub().resolves(subscription);
        eventAggregatorStub.publish = sandbox.stub();

        disposeSpy = sandbox.spy();
        subscribeSpy = sandbox.stub().returns({dispose: disposeSpy});
        bindingEngineStub.propertyObserver = sandbox.stub().returns(<PropertyObserver>{subscribe: subscribeSpy});

        appointmentBooking = new AppointmentBooking(jobServiceStub,
            engineerServiceStub,
            labelServiceStub,
            routerStub,
            eventAggregatorStub,
            validationServiceStub,
            businessRulesServiceStub,
            catalogServiceStub,
            bindingEngineStub,
            appointmentBookingServiceStub,
            dialogServiceStub);

        appointmentBooking.showContent = showContentSpy = sandbox.spy();

        appointmentBooking.labels = {
            "generalAccessInformation": "",
            "promisedDate": "",
            "promisedTimeSlot": "",
            "accessInformation": "",
            "preferredEngineer": "",
            "estimatedDurationOfAppointment": "",
            "specialRequirement": "",
            "minutes": "",
            "book": "",
            "remove": "",
            "clear": "",
            "undo": "",
            "error575": "",
            "error573": "",
            "promiseDateWarningThresholdWarning": "",
            "appointmentSaved": "",
            "appointmentNotSaved": "",
            "confirmation": "",
            "removeQuestion": "",
            "appointmentRemoved": "",
            "appointment": "",
            "yes": "",
            "no": "",
            "clearQuestion": "",
            "engineerIdValidationError": "",
            "objectName": "",
            "appointmentNotificationTitle": "Appointment"
        };

    });

    afterEach(() => {
        sandbox.restore();
    });


    describe("activateAsync", () => {
        beforeEach(() => {
            let job: Job = new Job();
            let task: Task = new Task(true, false);
            task.status = "IV";
            job.tasks = [];
            job.tasks.push(task);
            let appoint: Appointment = new Appointment();
            appoint.estimatedDurationOfAppointment = [];
            job.appointment = appoint;
            jobServiceStub.getJob = sandbox.stub().resolves(job);

        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be created", () => {
            expect(appointmentBooking).toBeDefined();
        });

        it("can call activateAsync", (done) => {
            appointmentBooking.activateAsync({jobId: "1234"}).then(() => {
                expect(showContentSpy.calledOnce).toBeTruthy();
                done();
            });
        });
    });

    describe("clearModel", () => {

        beforeEach(() => {
            let job: Job = new Job();
            let task: Task = new Task(true, false);
            task.status = "IV";
            job.tasks = [];
            job.tasks.push(task);
            let appoint: Appointment = new Appointment();
            appoint.estimatedDurationOfAppointment = [];
            job.appointment = appoint;
            jobServiceStub.getJob = sandbox.stub().resolves(job);
        })

        afterEach(() => {
            sandbox.restore();
        });

        it("is cleared", (done) => {
            let dialogResult = new DialogResult(false, null);
            dialogServiceStub.open = sandbox.stub().resolves(dialogResult);
            appointmentBooking.activateAsync({jobId: "1234"}).then(() => {
                appointmentBooking.clear().then(() => {
                    expect(appointmentBooking.promisedDate).toBeUndefined();
                    expect(appointmentBooking.preferredEngineer).toBeUndefined();
                    expect(appointmentBooking.accessInformation).toBeUndefined();
                    expect(appointmentBooking.promisedTimeSlot).toBeUndefined();
                    expect(appointmentBooking.hasAppointment).toBeFalsy();
                    expect(appointmentBooking.estimatedDurationOfAppointmentMaxValue).toBeUndefined();
                    done();
                });
            });
        });
    });

    describe("the initDate function", () => {
        let job: Job;
        let appointment: Appointment;

        beforeEach(() => {
            job = new Job();
            let task: Task = new Task(true, false);
            task.status = "IV";
            job.tasks = [];
            job.tasks.push(task);
            appointment = new Appointment();
            appointment.estimatedDurationOfAppointment = [];
            job.appointment = appointment;
            jobServiceStub.getJob = sandbox.stub().resolves(job);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("will set minDate to existing appointment date", (done) => {
            let promisedDate = moment(DateHelper.getTodaysDate()).add(1, "days").toDate();
            appointment.promisedDate = promisedDate;

            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    expect(appointmentBooking.minDate).toEqual(promisedDate);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        it("will set minDate to todays date as there are no parts", (done) => {
            let todaysDate = moment(moment().format(DateHelper.jsonISO8601Format)).toDate();

            DateHelper.getTodaysDate = sandbox.stub().returns(todaysDate);
            appointmentBookingServiceStub.hasParts = sandbox.stub().resolves(false);


            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    expect(appointmentBooking.minDate).toEqual(DateHelper.getTodaysDate());
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        it("will set minDate to tomorrows date as there are parts but cut off not passed", (done) => {
            let todaysDate = moment(moment().format(DateHelper.jsonISO8601Format)).toDate();

            DateHelper.getTodaysDate = sandbox.stub().returns(todaysDate);
            appointmentBookingServiceStub.checkCutOffTimeExceededWithParts = sandbox.stub().returns(false);


            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    expect(appointmentBooking.minDate).toEqual(moment(DateHelper.getTodaysDate()).add(1, "days").toDate());
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        it("will set minDate to next available date as there are parts and cut off has passed", (done) => {
            let nextAvailableDate = moment(moment(new Date(2017, 4, 12)).format(DateHelper.jsonISO8601Format)).toDate();
            job.tasks[0].status = "IP";

            appointmentBookingServiceStub.checkCutOffTimeExceededWithParts = sandbox.stub().returns(true);
            appointmentBookingServiceStub.getNexAppointmentDateWithParts = sandbox.stub().returns(nextAvailableDate);

            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    expect(appointmentBooking.minDate).toEqual(nextAvailableDate);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        it("should set minDate to tomorrows date when task status = Partsrequired", (done) => {
            let promisedDate = moment().toDate();
            job.tasks[0].status = "IP";

            DateHelper.getTodaysDate = sandbox.stub().returns(promisedDate);
            appointmentBookingServiceStub.checkCutOffTimeExceededWithParts = sandbox.stub().returns(false);

            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    expect(appointmentBooking.minDate).toEqual(moment(DateHelper.getTodaysDate()).add(1, "days").toDate());
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });
    });

    describe("the calendar 'Today' button", () => {
        let job: Job;
        let appointment: Appointment;

        beforeEach(() => {
            job = new Job();
            let task: Task = new Task(true, false);
            task.status = "IV";
            job.tasks = [];
            job.tasks.push(task);
            appointment = new Appointment();
            appointment.estimatedDurationOfAppointment = [];
            job.appointment = appointment;
            jobServiceStub.getJob = sandbox.stub().resolves(job);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("will show the 'Today' button to existing appointment date", (done) => {
            let todaysDate = moment(moment().format(DateHelper.jsonISO8601Format)).toDate();

            DateHelper.getTodaysDate = sandbox.stub().returns(todaysDate);
            appointment.promisedDate = todaysDate;

            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    expect(appointmentBooking.isTodaysDateAvailable).toEqual(true);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        it("will show the 'Today' button as there are no parts", (done) => {
            let todaysDate = moment(moment().format(DateHelper.jsonISO8601Format)).toDate();

            DateHelper.getTodaysDate = sandbox.stub().returns(todaysDate);
            appointmentBookingServiceStub.hasParts = sandbox.stub().resolves(false);


            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    expect(appointmentBooking.isTodaysDateAvailable).toEqual(true);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        it("will not show the 'Today' button  as there are parts but cut off not passed", (done) => {
            let todaysDate = moment(moment().format(DateHelper.jsonISO8601Format)).toDate();

            DateHelper.getTodaysDate = sandbox.stub().returns(todaysDate);
            appointmentBookingServiceStub.checkCutOffTimeExceededWithParts = sandbox.stub().returns(false);


            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    expect(appointmentBooking.isTodaysDateAvailable).toEqual(false);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        it("will not show the 'Today' button as there are parts and cut off has passed", (done) => {
            let nextAvailableDate = moment(moment(new Date(2017, 4, 12)).format(DateHelper.jsonISO8601Format)).toDate();

            appointmentBookingServiceStub.checkCutOffTimeExceededWithParts = sandbox.stub().returns(true);
            appointmentBookingServiceStub.getNexAppointmentDateWithParts = sandbox.stub().returns(nextAvailableDate);

            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    expect(appointmentBooking.isTodaysDateAvailable).toEqual(false);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });
    });

    describe("Hide Book, Clear & Remove button", () => {
        let job: Job;

        beforeEach(() => {
            job = new Job();
            let task: Task = new Task(true, false);
            task.status = "IV";
            job.tasks = [];
            job.state = 5;
            job.tasks.push(task);
            job.appointment = null;
            jobServiceStub.getJob = sandbox.stub().resolves(job);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should canBook to be true and hasAppointment to be false", (done) => {
            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    expect(appointmentBooking.canEdit).toBe(false);
                    expect(appointmentBooking.canBook).toBe(true);
                    expect(appointmentBooking.hasAppointment).toBe(false);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        })
    });

    describe("Show Book, Clear & Remove button", () => {
        let job: Job;

        beforeEach(() => {
            job = new Job();
            let task: Task = new Task(true, false);
            task.status = "IV";
            job.tasks = [];
            job.state = 2;
            job.tasks.push(task);
            job.appointment = null;
            jobServiceStub.getJob = sandbox.stub().resolves(job);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should canBook to be true and hasAppointment to be false", (done) => {
            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    expect(appointmentBooking.canEdit).toBe(false);
                    expect(appointmentBooking.canBook).toBe(true);
                    expect(appointmentBooking.hasAppointment).toBe(false);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        })
    });

    describe("Show Remove button", () => {
        let job: Job;
        let appointment: Appointment;

        beforeEach(() => {
            job = new Job();
            let task: Task = new Task(true, false);
            task.status = "IV";
            job.tasks = [];
            job.state = 2;
            job.tasks.push(task);
            appointment = new Appointment();
            appointment.estimatedDurationOfAppointment = [];
            job.appointment = appointment;
            jobServiceStub.getJob = sandbox.stub().resolves(job);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should jobDone, canBook to be true and hasAppointment to be false", (done) => {
            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    expect(appointmentBooking.canEdit).toBe(false);
                    expect(appointmentBooking.canBook).toBe(true);
                    expect(appointmentBooking.hasAppointment).toBe(true);
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        })
    });

    describe("promisedDateChanged method", () => {
        let job: Job;
        let appointment: Appointment;

        beforeEach(() => {
            job = new Job();
            let task: Task = new Task(true, false);
            task.status = "IV";
            job.tasks = [];
            job.state = 2;
            job.tasks.push(task);
            appointment = new Appointment();
            appointment.estimatedDurationOfAppointment = [];
            job.appointment = appointment;
            jobServiceStub.getJob = sandbox.stub().resolves(job);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should show warning as the promise date > 55 days", (done) => {
            let warningSpy = sandbox.spy(appointmentBooking, "showWarning");
            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    let date = moment(new Date()).add(56, "days").toDate();
                    appointmentBooking.promisedDateChanged(date);
                    expect(warningSpy.called).toBe(true);
                    done();
                });
        });

        it("should not show warning as the promise date < 55 days", (done) => {
            let warningSpy = sandbox.spy(appointmentBooking, "showWarning");
            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    appointmentBooking.promisedDateChanged(new Date());
                    expect(warningSpy.called).toBe(false);
                    done();
                });
        })
    });

    describe("promisedTimeSlotChanged method", () => {
        let job: Job;
        let appointment: Appointment;

        beforeEach(() => {
            job = new Job();
            let task: Task = new Task(true, false);
            task.status = "IV";
            job.tasks = [];
            job.state = 2;
            job.tasks.push(task);
            appointment = new Appointment();
            appointment.estimatedDurationOfAppointment = [];
            job.appointment = appointment;
            jobServiceStub.getJob = sandbox.stub().resolves(job);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("estimatedDurationOfAppointmentMaxValue should be 959", (done) => {
            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    appointmentBooking.promisedTimeSlotChanged("AM").then(() => {
                        expect(appointmentBooking.estimatedDurationOfAppointmentMaxValue).toBe(959);
                        done();
                    });
                });
        });

        it("estimatedDurationOfAppointmentMaxValue should be 119", (done) => {
            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    appointmentBooking.promisedTimeSlotChanged("22").then(() => {
                        expect(appointmentBooking.estimatedDurationOfAppointmentMaxValue).toBe(119);
                        done();
                    });
                });
        });

        it("estimatedDurationOfAppointmentMaxValue should be 0", (done) => {
            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    appointmentBooking.promisedTimeSlotChanged(undefined).then(() => {
                        expect(appointmentBooking.estimatedDurationOfAppointmentMaxValue).toBe(0);
                        done();
                    });
                });
        });
    })

    describe("preferred engineer", () => {

        let job: Job;
        let appointment: Appointment;

        beforeEach(() => {
            job = new Job();
            let task: Task = new Task(true, false);
            task.status = "IV";
            job.tasks = [];
            job.state = 2;
            job.tasks.push(task);
            appointment = new Appointment();
            appointment.estimatedDurationOfAppointment = [];
            job.appointment = appointment;
            jobServiceStub.getJob = sandbox.stub().resolves(job);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should map to current engineer on existing appointment", (done) => {

            job.appointment.preferredEngineer = "111";
            const engineer = new Engineer();
            engineer.id = "222";

            engineerServiceStub.getCurrentEngineer = sandbox.stub().resolves(engineer);

            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    expect(appointmentBooking.preferredEngineer).toEqual("111");
                    done();
                });
        });

        it("should map to current engineer when no appointment", (done) => {

            job.appointment  = undefined;
            const engineer = new Engineer();
            engineer.id = "222";

            engineerServiceStub.getCurrentEngineer = sandbox.stub().resolves(engineer);

            appointmentBooking.activateAsync({jobId: "1234"})
                .then(() => {
                    expect(appointmentBooking.preferredEngineer).toEqual("222");
                    done();
                });
        });
    });
});
