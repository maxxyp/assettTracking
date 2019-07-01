/// <reference path="../../../../../typings/app.d.ts" />

import { TaskService } from "../../../../../app/hema/business/services/taskService";
import { IPartService } from "../../../../../app/hema/business/services/interfaces/IPartService";
import { IJobService } from "../../../../../app/hema/business/services/interfaces/IJobService";
import { Job } from "../../../../../app/hema/business/models/job";
import { Task } from "../../../../../app/hema/business/models/task";
import { BusinessException } from "../../../../../app/hema/business/models/businessException";
import { IBusinessRuleService } from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { QueryableBusinessRuleGroup } from "../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { Appointment } from "../../../../../app/hema/business/models/appointment";
import { AppointmentDurationItem } from "../../../../../app/hema/business/models/appointmentDurationItem";
import { IDataStateManager } from "../../../../../app/hema/common/IDataStateManager";
import { EventAggregator } from "aurelia-event-aggregator";
import { UiConstants } from "../../../../../app/common/ui/elements/constants/uiConstants";

describe("the TaskService module", () => {
    let taskService: TaskService;
    let sandbox: Sinon.SinonSandbox;
    let businessRuleServiceStub: IBusinessRuleService;

    let jobServiceStub: IJobService;

    let partServiceStub: IPartService;
    let setJobNoAccessedStub: Sinon.SinonStub;

    let dataStateManagerStub: IDataStateManager;

    let eventAggregatorStub: EventAggregator;
    let eventPublishSpy: Sinon.SinonSpy;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        let ruleGroup = <QueryableBusinessRuleGroup>{};
        ruleGroup.getBusinessRule = sandbox.stub().returns("");
        ruleGroup.getBusinessRuleList = sandbox.stub().returns([]);

        businessRuleServiceStub = <IBusinessRuleService>{};
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(ruleGroup);
        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves({});
        partServiceStub = <IPartService>{};

        let newjob: Job = new Job();
        newjob.tasks = [];
        let task = new Task(true, true);
        task.id = "t1";
        newjob.tasks.push(task);

        jobServiceStub = <IJobService>{};
        jobServiceStub.getJob = sandbox.stub().resolves(newjob);
        jobServiceStub.setJob = sandbox.stub().resolves(undefined);
        setJobNoAccessedStub = jobServiceStub.setJobNoAccessed = sandbox.stub().resolves(null);

        dataStateManagerStub = <IDataStateManager>{
            updateApplianceDataState: sandbox.stub().resolves(null),
            updateAppliancesDataState: sandbox.stub().resolves(null),
            updatePropertySafetyDataState: sandbox.stub()
        };

        partServiceStub.setPartsRequiredForTask = sandbox.stub();
        partServiceStub.deletePartsAssociatedWithTask = sandbox.stub();

        eventAggregatorStub = <EventAggregator>{};
        eventPublishSpy = eventAggregatorStub.publish = sandbox.spy();

        taskService = new TaskService(jobServiceStub,
            businessRuleServiceStub,
            dataStateManagerStub,
            partServiceStub,
            eventAggregatorStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(taskService).toBeDefined();
    });

    describe("getTasks", () => {

        it("can reject when job serive loadJob throws", done => {
            jobServiceStub.getJob = sandbox.stub().returns(Promise.reject(null));
            taskService.getTasks("0").catch(err => {
                expect(err instanceof BusinessException).toBe(true);
                done();
            });
        });
    });

    describe("deleteTask", () => {
        it("can delete task and update parts datastate", done => {
            taskService.deleteTask("0", "t1").then(err => {
                expect((partServiceStub.deletePartsAssociatedWithTask as Sinon.SinonStub).called).toBe(true);
                done();
            });
        });

        it("job not found throws Exception", done => {
            jobServiceStub.getJob = sandbox.stub().resolves(undefined);
            taskService.deleteTask("0", "t1").catch(err => {
                expect(err instanceof BusinessException).toBe(true);
                done();
            });
        });
    });

    describe("saveTask function", () => {

        let job: Job;
        let task1: Task;
        let task2: Task;

        beforeEach(() => {
            let ruleGroup = <QueryableBusinessRuleGroup>{};
            ruleGroup.getBusinessRuleList = sandbox.stub().returns(["NA","VO"]);

            let getBusinessRuleStub = ruleGroup.getBusinessRule = sandbox.stub();
            getBusinessRuleStub.withArgs("completedOrCancelledActivityStatuses").returns("C,CX");
            getBusinessRuleStub.withArgs("appointmentAllowedActivityStatus").returns("IA, IF");

            businessRuleServiceStub = <IBusinessRuleService>{};
            businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(ruleGroup);

            let statusesRuleGroup = {
                notDoingJobStatuses: "foo,bar",
                notDoingTaskStatuses: "buzz,baz"
            };

            businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(statusesRuleGroup);

            job = <Job>{};
            job.id = "1234";
            task1 = <Task>{ id: "1" };
            task2 = <Task>{ id: "2" };
            job.tasks = [task1, task2];

            jobServiceStub.setJob = sandbox.stub().resolves(Promise.resolve());

            taskService = new TaskService(jobServiceStub,
                businessRuleServiceStub,
                dataStateManagerStub,
                partServiceStub,
                eventAggregatorStub);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should job.appointment be undefined", (done) => {
            task1 = <Task>{ id: "1" };
            task1.status = "C";

            let appointment: Appointment = new Appointment();
            appointment.preferredEngineer = "50";

            let appointmentDurationItem = new AppointmentDurationItem();
            appointmentDurationItem.duration = 30;
            appointmentDurationItem.specialRequirement = "test req";
            appointmentDurationItem.taskId = "1";
            appointment.estimatedDurationOfAppointment = [appointmentDurationItem];

            job.appointment = appointment;

            jobServiceStub.getJob = sandbox.stub().resolves(job);

            taskService.saveTask("1234", task1)
                .then(() => {
                    expect(job.appointment).toBe(undefined);
                    done();
                })
        });

        it("should sestimatedDurationOfAppointment array count be 1", (done) => {
            job.tasks[0].status = "C";

            task2 = <Task>{ id: "2" };
            task2.status = "IA";

            let appointment: Appointment = new Appointment();
            appointment.preferredEngineer = "50";

            let appointmentDurationItem = new AppointmentDurationItem();
            appointmentDurationItem.duration = 30;
            appointmentDurationItem.specialRequirement = "test req";
            appointmentDurationItem.taskId = "1";

            let appointmentDurationItem1 = new AppointmentDurationItem();
            appointmentDurationItem1.duration = 20;
            appointmentDurationItem1.specialRequirement = "test req1";
            appointmentDurationItem1.taskId = "2";

            let appointmentDurationItem2 = new AppointmentDurationItem();
            appointmentDurationItem2.duration = 20;
            appointmentDurationItem2.specialRequirement = "test req2";
            appointmentDurationItem2.taskId = "3";

            appointment.estimatedDurationOfAppointment = [appointmentDurationItem, appointmentDurationItem1, appointmentDurationItem2];

            job.appointment = appointment;

            jobServiceStub.getJob = sandbox.stub().resolves(job);

            taskService.saveTask("1234", task2)
                .then(() => {
                    expect(job.appointment.estimatedDurationOfAppointment.length).toBe(1);
                    expect(job.appointment.estimatedDurationOfAppointment[0].taskId).toBe("2");
                    done();
                })
        });

        it("should job.appointment be undefined", (done) => {
            job.tasks[0].status = "C";

            task2 = <Task>{ id: "2" };
            task2.status = "CX";

            let appointment: Appointment = new Appointment();
            appointment.preferredEngineer = "50";

            let appointmentDurationItem = new AppointmentDurationItem();
            appointmentDurationItem.duration = 30;
            appointmentDurationItem.specialRequirement = "test req";
            appointmentDurationItem.taskId = "1";

            let appointmentDurationItem1 = new AppointmentDurationItem();
            appointmentDurationItem1.duration = 20;
            appointmentDurationItem1.specialRequirement = "test req1";
            appointmentDurationItem1.taskId = "2";

            appointment.estimatedDurationOfAppointment = [appointmentDurationItem, appointmentDurationItem1];

            job.appointment = appointment;

            jobServiceStub.getJob = sandbox.stub().resolves(job);

            taskService.saveTask("1234", task2)
                .then(() => {
                    expect(job.appointment).toBe(undefined);
                    done();
                })
        });

        it("save should always call jobService.setJobNoAccessed", done => {
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            taskService.saveTask("1234", task2)
                .then(() => {
                    expect(setJobNoAccessedStub.called).toBe(true);
                    done();
                })
    });


    describe("createTask function", () => {
        beforeEach(() => {
            let ruleGroup = <QueryableBusinessRuleGroup>{};
            let getBusinessRuleStub = ruleGroup.getBusinessRule = sandbox.stub();
            getBusinessRuleStub.withArgs("completedOrCancelledActivityStatuses").returns("C,CX");
            getBusinessRuleStub.withArgs("appointmentAllowedActivityStatus").returns("IA, IF");
            ruleGroup.getBusinessRuleList = sandbox.stub().returns(["NA", "VO"]);
            businessRuleServiceStub = <IBusinessRuleService>{};
            businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(ruleGroup);
            businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves({
                intervalInMinutes: 1,
                notDoingJobStatuses: "",
                notDoingTaskStatuses: ""
            });
            job = <Job>{};
            job = <Job>{};
            job.id = "1234";
            task1 = <Task>{ id: "1", adviceCode: "t1adviceCode", adviceComment: "t1adviceComment", adviceOutcome: "t1adviceOutcome", orderNo: 1 };
            task2 = <Task>{ id: "2", adviceCode: "t2adviceCode", adviceComment: "t2adviceComment", adviceOutcome: "t2adviceOutcome", orderNo: 2 };
            job.tasks = [task1, task2];
            jobServiceStub.setJob = sandbox.stub().resolves(Promise.resolve());

            taskService = new TaskService(jobServiceStub,
                businessRuleServiceStub,
                dataStateManagerStub,
                partServiceStub,
                eventAggregatorStub);
        });
        afterEach(() => {
            sandbox.restore();
        });
        it("should set advise code as first task", (done) => {
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let newTask: Task = new Task(true, true);
            newTask.id = "newtask001";
            taskService.createTask("1234", newTask)
                .then(() => {
                    let t = job.tasks.find(x => x.id === "newtask001");
                    expect(t).toBeDefined();
                    expect(t.adviceCode === "t1adviceCode").toBeDefined();
                    expect(t.adviceComment === "t1adviceComment").toBeDefined();
                    expect(t.adviceOutcome === "t1adviceOutcome").toBeDefined();
                    done();
                });
        });

        // it("should set job.tasksEndTime to new Task endtime", (done) => {
        //     jobServiceStub.getJob = sandbox.stub().resolves(job);
        //     let newTask: Task = new Task(true, true);
        //     newTask.id = "newtask001";
        //     newTask.endTime = "18:31";
        //     taskService.createTask("1234", newTask)
        //         .then(() => {
        //             let t = job.tasks.find(x => x.id === "newtask001");
        //             expect(t).toBeDefined();
        //             expect(job.tasksEndTime).toBe("18:31");
        //             done();
        //         });
        // });
    });


    describe("cancelling and noaccessing", () => {

        beforeEach(() => {
                jobServiceStub.getJob = sandbox.stub().resolves(job);
            });

            it("should set a task as cancelling the job if it has the appropriate status", done => {
                task2.status = "foo";
                taskService.saveTask("1234", task2)
                .then(() => {
                    expect(task1.isTaskThatSetsJobAsNoAccessed).toBeFalsy();
                    expect(task2.isTaskThatSetsJobAsNoAccessed).toBe(true);
                    done();
                })
            })

            it("should not set a task as cancelling the job if it has the appropriate status but another task is already no accessing the job", done => {
                task1.isTaskThatSetsJobAsNoAccessed = true;
                task2.status = "foo";
                taskService.saveTask("1234", task2)
                .then(() => {
                    expect(task1.isTaskThatSetsJobAsNoAccessed).toBe(true);
                    expect(task2.isTaskThatSetsJobAsNoAccessed).toBeFalsy();
                    done();
                })
            })

            it("should set the task as isCancelled if it has the appropriate status", done => {
                task2.status = "baz";
                taskService.saveTask("1234", task2)
                .then(() => {
                    expect(task2.isTaskThatSetsJobAsNoAccessed).toBeFalsy();
                    expect(task2.isNotDoingTask).toBe(true);
                    done();
                })
            })

            it("should not set the task as isCancelled if it hasn't the appropriate status", done => {
                task2.status = "statusX";
                taskService.saveTask("1234", task2)
                .then(() => {
                    expect(task2.isTaskThatSetsJobAsNoAccessed).toBeFalsy();
                    expect(task2.isNotDoingTask).toBeFalsy();
                    done();
                })
            })

        });

    });

    describe("identifying landlord jobs", () => {

        beforeEach(() => {
            let statusesRuleGroup = {
                notDoingJobStatuses: "NA",
                notDoingTaskStatuses: "XB,XC"
            };

            businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(statusesRuleGroup);
        });

        describe("when editing a task appliance", () => {
            it("can transition out of a landlord job", async done => {
                let job = <Job>{
                    id: "j1",
                    wasOriginallyLandlordJob: true,
                    isLandlordJob: true,
                    tasks:[
                        {id: "1", jobType: "FOO", applianceType: "BAR", status: "D"},
                        {id: "2", jobType: "AS", applianceType: "INS", status: "D"}
                    ]
                }
                jobServiceStub.getJob = sandbox.stub().resolves(job);

                await taskService.updateTaskAppliance("j1", "2", "INS", "2", "IB", null);
                expect(eventPublishSpy.calledWith(UiConstants.TOAST_ADDED)).toBe(true);
                expect(job.isLandlordJob).toBe(false);
                done();
            });

            it("can transition back into a landlord job", async done => {
                let job = <Job>{
                    id: "j1",
                    wasOriginallyLandlordJob: true,
                    isLandlordJob: false,
                    tasks:[
                        {id: "1", jobType: "FOO", applianceType: "BAR", status: "D"},
                        {id: "2", jobType: "IB", applianceType: "INS", status: "D"}
                    ]
                }
                jobServiceStub.getJob = sandbox.stub().resolves(job);

                await taskService.updateTaskAppliance("j1", "2", "INS", "2", "AS", null);
                expect(eventPublishSpy.calledWith(UiConstants.TOAST_ADDED)).toBe(true);
                expect(job.isLandlordJob).toBe(true);
                done();
            });

            it("cannot transition back into a landlord job if no originally a landlord job", async done => {
                let job = <Job>{
                    id: "j1",
                    wasOriginallyLandlordJob: false,
                    isLandlordJob: false,
                    tasks:[
                        {id: "1", jobType: "FOO", applianceType: "BAR", status: "D"},
                        {id: "2", jobType: "IB", applianceType: "INS", status: "D"}
                    ]
                }
                jobServiceStub.getJob = sandbox.stub().resolves(job);

                await taskService.updateTaskAppliance("j1", "2", "INS", "2", "AS", null);
                expect(eventPublishSpy.called).toBe(false);
                expect(job.isLandlordJob).toBe(false);
                done();
            });
        });

        describe("when editing a task status", () => {
            it("can transition out of a landlord job", async done => {
                let job = <Job>{
                    id: "j1",
                    wasOriginallyLandlordJob: true,
                    isLandlordJob: true,
                    tasks:[
                        {id: "1", jobType: "FOO", applianceType: "BAR", status: "D"},
                        {id: "2", jobType: "AS", applianceType: "INS", status: "D"}
                    ]
                }
                jobServiceStub.getJob = sandbox.stub().resolves(job);

                let editedTask = <Task>{id: "2", jobType: "AS", applianceType: "INS", status: "XB"};

                await taskService.saveTask("j1", editedTask);
                expect(eventPublishSpy.calledWith(UiConstants.TOAST_ADDED)).toBe(true);
                expect(job.isLandlordJob).toBe(false);
                done();
            });

            it("can transition out of a landlord job but not alert the user if there are no active tasks left", async done => {
                let job = <Job>{
                    id: "j1",
                    wasOriginallyLandlordJob: true,
                    isLandlordJob: true,
                    tasks:[
                        {id: "1", jobType: "FOO", applianceType: "BAR", status: "D", isNotDoingTask: true},
                        {id: "2", jobType: "AS", applianceType: "INS", status: "D"}
                    ]
                }
                jobServiceStub.getJob = sandbox.stub().resolves(job);

                let editedTask = <Task>{id: "2", jobType: "AS", applianceType: "INS", status: "XB"};

                await taskService.saveTask("j1", editedTask);
                expect(eventPublishSpy.calledWith(UiConstants.TOAST_ADDED)).toBe(false);
                expect(job.isLandlordJob).toBe(false);
                done();
            });

            it("can transition back into a landlord job", async done => {
                let job = <Job>{
                    id: "j1",
                    wasOriginallyLandlordJob: true,
                    isLandlordJob: false,
                    tasks:[
                        {id: "1", jobType: "FOO", applianceType: "BAR", status: "D"},
                        {id: "2", jobType: "AS", applianceType: "INS", status: "XB", isNotDoingTask: true}
                    ]
                }
                jobServiceStub.getJob = sandbox.stub().resolves(job);

                let editedTask = <Task>{id: "2", jobType: "AS", applianceType: "INS", status: "D"};

                await taskService.saveTask("j1", editedTask);
                expect(eventPublishSpy.calledWith(UiConstants.TOAST_ADDED)).toBe(true);
                expect(job.isLandlordJob).toBe(true);
                done();
            });

            it("cannot transition back into a landlord job if no originally a landlord job", async done => {
                let job = <Job>{
                    id: "j1",
                    wasOriginallyLandlordJob: false,
                    isLandlordJob: false,
                    tasks:[
                        {id: "1", jobType: "FOO", applianceType: "BAR", status: "D"},
                        {id: "2", jobType: "AS", applianceType: "INS", status: "XB", isNotDoingTask: true}
                    ]
                }
                jobServiceStub.getJob = sandbox.stub().resolves(job);

                let editedTask = <Task>{id: "2", jobType: "AS", applianceType: "INS", status: "D"};

                await taskService.saveTask("j1", editedTask);
                expect(eventPublishSpy.called).toBe(false);
                expect(job.isLandlordJob).toBe(false);
                done();
            });
        });

    });
});
