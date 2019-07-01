import { Router } from "aurelia-router";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { IValidationService } from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { ITaskService } from "../../../../../../app/hema/business/services/interfaces/ITaskService";
import { Job } from "../../../../../../app/hema/business/models/Job";
import { IApplianceService } from "../../../../../../app/hema/business/services/interfaces/IApplianceService";
import { Appliance } from "../../../../../../app/hema/business/models/appliance";
import { IFieldActivityType } from "../../../../../../app/hema/business/models/reference/IFieldActivityType";
import * as moment from "moment";
import { Task } from "../../../../../../app/hema/business/models/task";
import { BindingEngine, PropertyObserver } from "aurelia-framework";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { IActionType } from '../../../../../../app/hema/business/models/reference/IActionType';
import { IChargeCatalogHelperService } from "../../../../../../app/hema/business/services/interfaces/charge/IChargeCatalogHelperService";
import { TaskAppliance } from '../../../../../../app/hema/presentation/modules/tasks/taskAppliance';
import { IChargeService } from "../../../../../../app/hema/business/services/interfaces/charge/IChargeService";

describe("the TaskAppliance module", () => {
    let taskAppliance: TaskAppliance;
    let sandbox: Sinon.SinonSandbox;

    let catalogServiceStub: ICatalogService;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let labelServiceStub: ILabelService;
    let taskServiceStub: ITaskService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let applianceServiceStub: IApplianceService;
    let bindingEngineStub: BindingEngine;
    let chargeCatalogHelperStub: IChargeCatalogHelperService;

    let chargeServiceStub: IChargeService;

    let routerStub: Router;
    let job: Job;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        catalogServiceStub = <ICatalogService>{};
        let fieldActivityTypes: IFieldActivityType[] = [];
        let fieldActivityType1: IFieldActivityType = <IFieldActivityType>{};

        fieldActivityType1.jobType = "actcode";
        fieldActivityType1.applianceType = "objcode";
        fieldActivityType1.fieldActivityTypeStartDate = moment().toDate().toString();
        fieldActivityType1.fieldActivityTypeEndDate = moment().add(30, "days").toDate().toString();

        fieldActivityTypes.push(fieldActivityType1);
        catalogServiceStub.getFieldActivityType = sandbox.stub().resolves(undefined);
        catalogServiceStub.getJCChargeRules = sandbox.stub().resolves([]);
        catalogServiceStub.getChargeTypes = sandbox.stub().resolves([]);
        jobServiceStub = <IJobService>{};
        jobServiceStub.getJob = sandbox.stub().resolves(undefined);
        engineerServiceStub = <IEngineerService>{};
        labelServiceStub = <ILabelService>{};
        taskServiceStub = <ITaskService>{};

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.subscribe = sandbox.stub();
        eventAggregatorStub.publish = sandbox.stub();
        dialogServiceStub = <DialogService>{};
        validationServiceStub = <IValidationService>{};
        businessRuleServiceStub = <IBusinessRuleService>{};
        applianceServiceStub = <IApplianceService>{};
        routerStub = <Router>{};
        bindingEngineStub = <BindingEngine>{};

        chargeServiceStub = <IChargeService>{};
        chargeServiceStub.startCharges = sandbox.stub().resolves(true);

        let propertyObserverStub: Sinon.SinonStub = bindingEngineStub.propertyObserver = sandbox.stub().returns(<PropertyObserver>{
            subscribe: () => <Subscription>{
                dispose: () => {
                }
            }
        });
        propertyObserverStub.withArgs(taskAppliance, "selectedApplianceId").returns(<PropertyObserver>{
            subscribe: () => <Subscription>{
                dispose: () => {
                }
            }
        });
        propertyObserverStub.withArgs(taskAppliance, "selectedActionType").returns(<PropertyObserver>{
            subscribe: () => <Subscription>{
                dispose: () => {
                }
            }
        });
        job = <Job>{};
        job.isLandlordJob = false;

        let businessRules: { [key: string]: any } = {};
        businessRules["fmtFieldActivityType"] = "YYYY-MM-DD";
        businessRules["fmtJcChargeStart"] = "";
        businessRules["fmtJcChargeEnd"] = "";
        businessRules["NewTask"] = "";
        businessRules["noChargePrefix"] = "NC";
        businessRules["validNewWorkInd"] = "N";
        businessRules["ctlgEntDelnMkr"] = "Y";
        businessRules["landlordApplianceTypes"] = "";
        businessRules["landlordActionTypes"] = "";
        businessRules["landlordChargeAppCondTypes"] = "";
        businessRules["firstVisitRestrictions"] = "";
        businessRules["chargeRulesExpirationYearCutOff"] = "";

        businessRuleServiceStub = <IBusinessRuleService>{};
        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};
        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();

        let errorMessageLabels: { [key: string]: any } = {};
        errorMessageLabels["chargeTypeInvalidErrorMsg"] = "Chargetype invalid";
        errorMessageLabels["actionTypeInvalidErrorMsg"] = "Actiontype invalid";
        labelServiceStub.getGroup = sandbox.stub().resolves(errorMessageLabels);

        getBusinessRuleStub.withArgs("noChargePrefix").returns("NC");
        getBusinessRuleStub.withArgs("firstVisitSequence").returns(1);
        getBusinessRuleStub.withArgs("intervalInMinutes").returns(1);

        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);
        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(businessRules);
        let appliances: Appliance[] = [];
        let app1 = new Appliance();
        app1.id = "app1";
        app1.applianceType = "BBF";
        appliances.push(app1);
        applianceServiceStub.getAppliances = sandbox.stub().resolves(appliances);
        let tasks: Task[] = [];
        let task1 = new Task(true, true);
        task1.id = "1343527001001";
        task1.applianceId = "app1";
        task1.sequence = 1;
        task1.orderNo = 1;
        task1.startTime = "12:00";
        task1.endTime = "12:30";
        tasks.push(task1);
        taskServiceStub.getTasks = sandbox.stub().resolves(tasks);
        taskServiceStub.getTasksAndCompletedTasks = sandbox.stub().resolves(tasks);

        job.tasks = tasks;
        jobServiceStub.getJob = sandbox.stub().resolves(job);

        taskServiceStub.createTask = sandbox.stub().resolves(undefined);
        taskServiceStub.updateTaskAppliance = sandbox.stub().resolves(undefined);
        routerStub.navigateToRoute = sandbox.stub().returns(undefined);

        taskAppliance = new TaskAppliance(catalogServiceStub, jobServiceStub, engineerServiceStub,
            labelServiceStub, eventAggregatorStub, dialogServiceStub, validationServiceStub,
            businessRuleServiceStub, applianceServiceStub, taskServiceStub, routerStub, bindingEngineStub, chargeCatalogHelperStub, chargeServiceStub);

        taskAppliance.labels = {
            "objectName": "",
            "taskSaved": "",
            "newTaskTitle": "",
            "applianceType": "",
            "actionType": "",
            "chargeType": "",
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(taskAppliance).toBeDefined();
    });

    it("can be activate", (done) => {
        taskAppliance.activateAsync({ jobId: "1234", taskId: "2354" }).then(() => {
            expect(taskAppliance.viewStateText === "").toBeTruthy();
            expect(taskAppliance.actionTypeErrorMsg).toBe("Actiontype invalid");
            expect(taskAppliance.chargeTypeErrorMsg).toBe("Chargetype invalid");
            done();
        });
    });

    it("can be activate", (done) => {
        taskAppliance.activateAsync({jobId: "1234", taskId: "1343527001001"}).then(() => {
            expect(taskAppliance.viewStateText === "").toBeTruthy();
            expect(taskAppliance.selectedApplianceId === "app1").toBeTruthy();
             expect(taskAppliance.actionTypeErrorMsg).toBe("Actiontype invalid");
            expect(taskAppliance.chargeTypeErrorMsg).toBe("Chargetype invalid");
            done();
        });
    });

    it("can save taskappliance", (done) => {
        taskAppliance.activateAsync({jobId: "1234", taskId: "1343527001001"}).then(() => {
            taskAppliance.saveTask();
            expect(taskAppliance.selectedApplianceId === "app1").toBeTruthy();
            done();
        });
    });

    it("should isFirstVisitActivity be true", (done) => {
        job.tasks[0].sequence = 1;
        taskAppliance.activateAsync({jobId: "1234", taskId: "1343527001001"}).then(() => {
            expect(taskAppliance.isFirstVisitActivity).toBe(true);
            done();
        });
    });

    it("should isFirstVisitActivity be false", (done) => {
        job.tasks[0].sequence = 2;
        taskAppliance.activateAsync({jobId: "1234", taskId: "1343527001001"}).then(() => {
            expect(taskAppliance.isFirstVisitActivity).toBe(false);
            done();
        });
    });

    it("selectedApplianceTypeChanged can be called with newValue = undefined, ", (done) => {
        taskAppliance.activateAsync({ jobId: "1234", taskId: "1343527001001" }).then(() => {
            taskAppliance.selectedActionTypeChanged(undefined, "").then(() => {
                done();
            });
        });
    });

    it("selectedApplianceTypeChanged can be called with newValue, ", (done) => {
        taskAppliance.activateAsync({ jobId: "1234", taskId: "1343527001001" }).then(() => {
            taskAppliance.selectedActionTypeChanged("BBF", "").then(() => {
                expect(taskAppliance.actionTypes.length === 0).toBeTruthy();
                done();
            });
        });
    });

    it("can be reset", (done) => {
        taskAppliance.activateAsync({ jobId: "1234", taskId: "2354" }).then(() => {
            taskAppliance.selectedApplianceId = "old";
            taskAppliance.selectedApplianceDescription = "old";
            taskAppliance.actionTypes = undefined;
            taskAppliance.selectedActionType = "old";
            taskAppliance.chargeTypes = undefined;
            taskAppliance.selectedChargeType = undefined;
            taskAppliance.resetViewModel().then(() => {
                expect(taskAppliance.selectedApplianceId === undefined).toBeTruthy();
                expect(taskAppliance.selectedApplianceDescription === undefined).toBeTruthy();
                expect(taskAppliance.selectedActionType === undefined).toBeTruthy();
                expect(taskAppliance.actionTypes.length === 0).toBeTruthy();
                expect(taskAppliance.chargeTypes.length === 0).toBeTruthy();
                expect(taskAppliance.selectedChargeType === undefined).toBeTruthy();
                done();
            });
        });
    });

    it("can save new task", (done) => {
        taskAppliance.activateAsync({ jobId: "1234", taskId: undefined }).then(() => {
            let showInfoSpy: Sinon.SinonSpy = sandbox.spy(taskAppliance, "showInfo");
            taskAppliance.saveTask().then(() => {
                expect(showInfoSpy.calledOnce).toBeTruthy();
                done();
            });
        });
    });

    it("can not double save new tasks", (done) => {
        let showInfoSpy: Sinon.SinonSpy = sandbox.spy(taskAppliance, "showInfo");
        taskAppliance.activateAsync({ jobId: "1234", taskId: undefined }).then(() => {

            taskAppliance.saveTask().then(() => {

                expect(showInfoSpy.calledOnce).toBeTruthy();
                expect(taskAppliance.isCompleteTriggeredAlready).toBe(true);
                showInfoSpy.reset();

                taskAppliance.saveTask().then(() => {
                    expect(showInfoSpy.called).toBe(false);
                    done();
                });
            });
        });
    });

    describe("the selectedApplianceIdChanged", () => {
        beforeEach(() => {
            let businessRules: { [key: string]: any } = {};
            businessRules["fmtFieldActivityType"] = "YYYY-MM-DD";
            businessRules["fmtJcChargeStart"] = "";
            businessRules["fmtJcChargeEnd"] = "";
            businessRules["NewTask"] = "";
            businessRules["noChargePrefix"] = "NC";
            businessRules["validNewWorkInd"] = "N";
            businessRules["ctlgEntDelnMkr"] = "Y";
            businessRules["landlordApplianceTypes"] = "";
            businessRules["landlordActionTypes"] = "";
            businessRules["landlordChargeAppCondTypes"] = "";
            businessRules["firstVisitRestrictions"] = "";
            let appliances: Appliance[] = [];
            let app1 = new Appliance();
            app1.id = "app1";
            app1.applianceType = "BBF";
            appliances.push(app1);
            applianceServiceStub.getAppliances = sandbox.stub().resolves(appliances);
            let fieldAT1: IFieldActivityType = <IFieldActivityType>{};
            fieldAT1.applianceType = "BBF";
            fieldAT1.fieldActivityTypeEndDate = moment().add(3, "days").toISOString();
            fieldAT1.fieldActivityTypeStartDate = moment().add(-3, "days").toISOString();
            fieldAT1.validNewWorkIndicator = "N";
            fieldAT1.jobType = "jt";

            let fieldAT2: IFieldActivityType = <IFieldActivityType>{};
            fieldAT2.applianceType = "BBF";
            fieldAT2.fieldActivityTypeEndDate = moment().add(3, "days").toISOString();
            fieldAT2.fieldActivityTypeStartDate = moment().add(-3, "days").toISOString();
            fieldAT2.validNewWorkIndicator = "Y";
            fieldAT2.jobType = "jt";
            catalogServiceStub.getFieldActivityType = sandbox.stub().resolves([fieldAT1, fieldAT2]);
            let actionType: IActionType = <IActionType>{};
            actionType.jobType = "jt";
            actionType.jobSafetyNotRequired = "N";
            catalogServiceStub.getActionType = sandbox.stub().resolves([actionType]);

            let task1 = new Task(true, false);
            task1.id = "1343527001001";
            task1.sequence = 1;
            job.tasks = [task1];
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            taskAppliance = new TaskAppliance(catalogServiceStub, jobServiceStub, engineerServiceStub,
                labelServiceStub, eventAggregatorStub, dialogServiceStub, validationServiceStub,
                businessRuleServiceStub, applianceServiceStub, taskServiceStub, routerStub, bindingEngineStub, chargeCatalogHelperStub, chargeServiceStub);

            taskAppliance.labels = {
                "objectName": "",
                "taskSaved": "",
                "newTaskTitle": "",
                "applianceType": "",
                "actionType": "",
                "chargeType": "",
            };
        });

        it("is new RFA", (done) => {
            taskAppliance.activateAsync({ jobId: "1343527001", taskId: undefined }).then(() => {
                taskAppliance.selectedApplianceIdChanged("app1", undefined).then(() => {
                    expect(taskAppliance.isNewTask).toBeTruthy();
                    done();
                });
            });
        });

        it("is existing RFA", (done) => {
            taskAppliance.activateAsync({ jobId: "1343527001", taskId: "1343527001001" }).then(() => {
                taskAppliance.selectedApplianceIdChanged("app1", undefined).then(() => {
                    expect(taskAppliance.isNewTask).toBeFalsy();
                    done();
                });
            });
        });

        it("isNewRFA false, do not filter actionType where validNewWorkIndicator = 'N'", (done) => {
            taskAppliance.activateAsync({ jobId: "1343527001", taskId: "1343527001001" }).then(() => {
                taskAppliance.selectedApplianceIdChanged("app1", undefined).then(() => {
                    expect(taskAppliance.actionTypes.length === 2).toBeTruthy();
                    done();
                });
            });
        });

        it("isNewRFA true, filter actionType where validNewWorkIndicator = 'N'", (done) => {
            taskAppliance.activateAsync({ jobId: "1343527001", taskId: undefined }).then(() => {
                taskAppliance.selectedApplianceIdChanged("app1", undefined).then(() => {
                    expect(taskAppliance.actionTypes.length === 1).toBeTruthy();
                    done();
                });
            });
        });
    });
});
