/// <reference path="../../../../../../typings/app.d.ts" />
import { Redirect } from "aurelia-router";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { PropertyObserver } from "aurelia-framework";
import { BindingEngine } from "aurelia-binding";
import { DialogService, DialogResult } from "aurelia-dialog";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { IValidationService } from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { IPartService } from "../../../../../../app/hema/business/services/interfaces/IPartService";
import { ITaskService } from "../../../../../../app/hema/business/services/interfaces/ITaskService";
import { Job } from "../../../../../../app/hema/business/models/job";
import { TaskItem } from "../../../../../../app/hema/presentation/modules/tasks/taskItem";
import { ValidationController } from "../../../../../../app/hema/business/services/validation/validationController";
import { ValidationCombinedResult } from "../../../../../../app/hema/business/services/validation/validationCombinedResult";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { IBusinessRule } from "../../../../../../app/hema/business/models/reference/IBusinessRule";
import { Task } from "../../../../../../app/hema/business/models/task";
import { ChargeServiceConstants } from "../../../../../../app/hema/business/services/constants/chargeServiceConstants";
import { Part } from "../../../../../../app/hema/business/models/part";
import { Threading } from "../../../../../../app/common/core/threading";
import { ValidationRule } from "../../../../../../app/hema/business/services/validation/validationRule";
import { IChirpCode } from "../../../../../../app/hema/business/models/reference/IChirpCode";
import { ITaskItemFactory } from "../../../../../../app/hema/presentation/factories/interfaces/ITaskItemFactory";
import { TaskItemViewModel } from '../../../../../../app/hema/presentation/modules/tasks/viewModels/taskItemViewModel';
import { Activity } from "../../../../../../app/hema/business/models/activity";

describe("the TaskItem module", () => {
    let taskItem: TaskItem;
    let sandbox: Sinon.SinonSandbox;

    let catalogServiceStub: ICatalogService;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let labelServiceStub: ILabelService;
    let taskServiceStub: ITaskService;
    let eventAggregator: EventAggregator;
    let dialogServiceStub: DialogService;
    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let businessRules: QueryableBusinessRuleGroup;
    let partServiceStub: IPartService;
    let taskItemFactoryStub: ITaskItemFactory;
    const filteredOutActivityStatusesBR = ["PD", "IZ"];

    let bindingEngineStub: BindingEngine;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        catalogServiceStub = <ICatalogService>{};
        jobServiceStub = <IJobService>{};
        engineerServiceStub = <IEngineerService>{};
        labelServiceStub = <ILabelService>{};
        taskServiceStub = <ITaskService>{};
        eventAggregator = new EventAggregator();
        dialogServiceStub = <DialogService>{};

        businessRuleServiceStub = <IBusinessRuleService>{};
        bindingEngineStub = <BindingEngine>{};
        partServiceStub = <IPartService>{};
        taskItemFactoryStub = <ITaskItemFactory>{};

        let validationCombinedResult: ValidationCombinedResult = {
            isValid: true,
            propertyResults: {},
            groups: []
        };

        // bindingEngineStub = Container.instance.get(BindingEngine);
        bindingEngineStub.propertyObserver = sandbox.stub().returns(<PropertyObserver>{
            subscribe: () => <Subscription>{
                dispose: () => {
                }
            }
        });

        let rulesMockData = {
            adviceResultsThatNeedCategory: "test",
            firstVisitJob: "fvj",
            firstVisitTask: "test",
            visitCodesProductGroupPartsRequired: "test",
            claimRejNotCoveredVisitCodesPattern: "test",
            workedOnClaimRejNotCovered: "test",
            notDoingJobStatuses: "NA,VO",
            notDoingTaskStatuses: "XB,XC",
            taskStatusDoToday: "D",
            activityPartsRequiredStatus: "IP",
            waitAdvicePartsStatus: "WA",
            appointmentRequiredActivityStatus: "A,B",
            insAnnualServiceActivityStatuses: "C,CX,D,NA,VO,XB,XC",
            instPremApplianceType: "INS",
            annualServiceJobType: "AS",
            intervalInMinutes: 1,
            filteredOutActivityStatuses: filteredOutActivityStatusesBR.join(","),
        };

        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(rulesMockData);

        businessRules = new QueryableBusinessRuleGroup();
        businessRules.rules = <IBusinessRule[]>[
            { id: "instPremApplianceType", rule: "INS" },
            { id: "annualServiceJobType", rule: "AS" },
            { id: "adviceResultsThatNeedCategory", rule: "XX" }
        ];
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(businessRules);

        validationServiceStub = <IValidationService>{};
        let valRules = <ValidationController>{};
        valRules.staticRules = {};
        let vRule = <ValidationRule>{};
        vRule.maxLength = 10;
        valRules.staticRules["viewModel.taskReport"] = vRule;
        validationServiceStub.build = sandbox.stub().resolves(valRules);

        validationCombinedResult = <ValidationCombinedResult>{};
        validationServiceStub.validate = sandbox.stub().resolves(validationCombinedResult);

        let activityComponentVisitStatusesMock = [{
            status: "QP",
            statusDescription: "QUOTATION PRODUCED",
            jobStatusCategory: "I"
        },
        {
            status: "D",
            statusDescription: "DO TODAY",
            jobStatusCategory: "D"
        },
        {
            status: "IZ",
            statusDescription: "INCOMPLETE",
            jobStatusCategory: "I",
        },
        {
            status: "C",
            statusDescription: "COMPLETE",
            jobStatusCategory: "C",
        },
        {
            status: "IA",
            statusDescription: "ANOTHER VISIT REQ'D",
            jobStatusCategory: "I",
        },
        {
            status: "IF",
            statusDescription: "FIELD MANAGER REQ'D",
            jobStatusCategory: "I",
        },
        {
            status: "IH",
            statusDescription: "TECHNICAL HELP REQ'D",
            jobStatusCategory: "I",
        },
        {
            status: "IP",
            statusDescription: "PARTS REQUIRED",
            jobStatusCategory: "I",
        },
        {
            status: "NA",
            statusDescription: "NO ACCESS",
            jobStatusCategory: "N",
        },
        {
            status: "VO",
            statusDescription: "NOT VISITED/OTHER",
            jobStatusCategory: "V",
        },
        {
            status: "VR",
            statusDescription: "*****DO NOT USE*****",
            jobStatusCategory: "V",
        },
        {
            status: "WA",
            statusDescription: "WAIT ADVICE",
            jobStatusCategory: "I",
        },
        {
            status: "XB",
            statusDescription: "CANCELLED/B G S",
            jobStatusCategory: "X",
        },
        {
            status: "XC",
            statusDescription: "CANCELLED/CUSTOMER",
            jobStatusCategory: "X",
        },
        {
            status: "CX",
            statusDescription: "COMPLETE/CANCELLED",
            jobStatusCategory: "C",
        },
        {
            status: "PD",
            statusDescription: "PRE DIAGNOSTICS",
            jobStatusCategory: "I",
        }
        ];
        catalogServiceStub.getActivityComponentVisitStatuses = sandbox.stub().resolves(activityComponentVisitStatusesMock);

        let JCJobCodesMock = [{
            key: "123",
            code: "code",
            fieldAppCode: "appcode",
            description: "desc",
            ctlgEntDelnMkr: "test"
        }];
        catalogServiceStub.getJCJobCodes = sandbox.stub().resolves(JCJobCodesMock);

        let chirpCodesMock = [{
            key: "123",
            code: "code",
            whenToUse: "test",
            resultingAction: "action",
            meaning: true,
            ctlgEntDelnMkr: "test"
        }];
        catalogServiceStub.getChirpCodes = sandbox.stub().resolves(chirpCodesMock);

        let adviceResultMock = [{
            key: "123",
            id: "id",
            description: "desc",
            ctlgEntDelnMkr: "test"
        }];
        catalogServiceStub.getAdviceResults = sandbox.stub().resolves(adviceResultMock);

        let eaCategoryMock = [{
            key: "123",
            eeaCategory: "test",
            eeaDescription: "desc",
            ctlgEntDelnMkr: "test"
        }];
        catalogServiceStub.getEeaCategories = sandbox.stub().resolves(eaCategoryMock);

        let workedOnMock = [{
            key: "123",
            workedOnCode: "ap",
            workedOnDescription: "applicance",
            ctlgEntDelnMkr: "test",
            insUpdFlag: "flag"
        }];
        catalogServiceStub.getWorkedOns = sandbox.stub().resolves(workedOnMock);

        labelServiceStub.getGroup = sandbox.stub().resolves({
            "yes": "yes",
            "no": "no",
            "errorTitle": "",
            "doTodayTaskStatusMessage": "",
            "chargeableTimeMessage": "",
            "confirmation": "",
            "incorrectActivityProductGroupOrPartTypeQuestion": ""
        });

        let visitActivityCodeMock = [{
            key: "123",
            visitActivityCode: "code",
            visitActivityDescr: "desc",
            partDataReqd: "part",
            ctlgEntDelnMkr: "test",
            insUpdFlag: "flag"
        }];
        catalogServiceStub.getVisitActivityCodes = sandbox.stub().resolves(visitActivityCodeMock);

        let productGroupMock = [{
            key: "123",
            productGroupCode: "test",
            productGroupDescr: "test",
            productGroupSource: "test",
            ctlgEntDelnMkr: "test",
            insUpdFlag: "flag"
        }];
        catalogServiceStub.getProductGroups = sandbox.stub().resolves(productGroupMock);

        let partTypeMock = [{
            key: "123",
            productGroupCode: "code",
            partTypeCode: "part",
            partTypeDescr: "desc",
            partTypeSource: "src",
            ctlgEntDelnMkr: "test",
            insUpdFlag: "flag"
        }];
        catalogServiceStub.getPartTypes = sandbox.stub().resolves(partTypeMock);

        let ptFacMock = [{
            key: "123",
            productGroupCode: "grp",
            partTypeCode: "part",
            faultActionCode: "test",
            ctlgEntDelnMkr: "test",
            insUpdFlag: "flag"
        }];
        catalogServiceStub.getPartTypeFaultActions = sandbox.stub().resolves(ptFacMock);

        let ivaFacMock = [{
            key: "123",
            visitActivityCode: "code",
            faultActionCode: "test",
            ctlgEntDelnMkr: "code",
            insUpdFlag: "flag"
        }];
        catalogServiceStub.getVisitActivityFaultActions = sandbox.stub().resolves(ivaFacMock);

        let faultCodeStub = [{
            key: "123",
            faultActionCode: "test",
            faultActionDescr: "desc",
            ctlgEntDelnMkr: "test",
            insUpdFlag: "flag"
        }];
        catalogServiceStub.getFaultActionCodes = sandbox.stub().resolves(faultCodeStub);

        taskServiceStub.getTasks = sandbox.stub().resolves(null);
        taskServiceStub.saveTask = sandbox.stub().resolves(null);
        jobServiceStub.getJob = sandbox.stub().resolves(null);

        partServiceStub.setPartsRequiredForTask = sandbox.stub().resolves(true);

        taskItem = new TaskItem(catalogServiceStub, jobServiceStub, engineerServiceStub,
            labelServiceStub, taskServiceStub, eventAggregator, dialogServiceStub, validationServiceStub,
            businessRuleServiceStub, bindingEngineStub, partServiceStub, taskItemFactoryStub);

        taskItem.labels = {
            "doTodayTaskStatusMessage": "",
            "yes": "",
            "no": "",
            "TaskItem": "",
            "chargeableTimeMessage": "",
            "objectName": "foo",
            "savedDescription": "bar",
            "savedTitle": "",
            "confirmation": "",
            "errorTitle": "",
            "errorDescription": "",
            "incorrectActivityProductGroupOrPartTypeQuestion": ""
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(taskItem).toBeDefined();
    });

    describe("activateAsync", () => {
        beforeEach(() => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("123", job, task);
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            sandbox.restore();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("Should call activateAsync method", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            let loadBusinessRulesSpy = sandbox.spy(taskItem, "loadBusinessRules");
            let buildBusinessRulesSpy = sandbox.spy(taskItem, "buildBusinessRules");
            let buildValidationRulesSpy = sandbox.spy(taskItem, "buildValidationRules");
            let loadCatalogsSpy = sandbox.spy(taskItem, "loadCatalogs");
            let loadSpy = sandbox.spy(taskItem, "load");
            let showContentSpy = sandbox.spy(taskItem, "showContent");
            taskItem.getLabel = sandbox.stub().returns("yes");

            taskItem.activateAsync(params).then(() => {
                expect(loadBusinessRulesSpy.calledOnce);
                expect(buildBusinessRulesSpy.calledOnce);
                expect(buildValidationRulesSpy.calledOnce);
                expect(loadCatalogsSpy.calledOnce);
                expect(loadSpy.calledOnce);
                expect(showContentSpy.calledOnce);
                done();
            });
        });

        it("selectedChirpCode should be undefined", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params).then(() => {
                expect(taskItem.viewModel.selectedChirpCode).toBeUndefined();
                done();
            });
        });

        it("will not set product group if not main part", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params).then(() => {
                taskItem.viewModel.mainPartProductGroup = "MPPG";

                taskItem.viewModel.productGroup = "PG";
                taskItem.viewModel.hasMainPart = false;

                taskItem.loadProductGroupFromMainPart();

                expect(taskItem.viewModel.productGroup).toBe("PG");
                done();
            });
        });

        it("will set product group if main part", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params).then(() => {
                taskItem.viewModel.mainPartProductGroup = "MPPG";

                taskItem.viewModel.productGroup = "PG";
                taskItem.viewModel.hasMainPart = true;

                taskItem.loadProductGroupFromMainPart();

                expect(taskItem.viewModel.productGroup).toBe("MPPG");
                done();
            });
        });

        it("will not set part type if not main part", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params).then(() => {
                taskItem.viewModel.mainPartPartType = "MPPT";

                taskItem.viewModel.partType = "PT";
                taskItem.viewModel.hasMainPart = false;

                taskItem.loadPartTypeFromMainPart();

                expect(taskItem.viewModel.partType).toBe("PT");
                done();
            });
        });

        it("will set part type if main part", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params).then(() => {
                taskItem.viewModel.mainPartPartType = "MPPT";

                taskItem.viewModel.partType = "PT";
                taskItem.viewModel.hasMainPart = true;

                taskItem.loadPartTypeFromMainPart();

                expect(taskItem.viewModel.partType).toBe(undefined);
                done();
            });
        });

        it("should filterout acitivity statuses", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params).then(() => {
                expect(taskItem.jobStatusesCatalog.find(x => filteredOutActivityStatusesBR.indexOf(x.status) >= 0)).toBeUndefined();
                done();
            });
        });
    });

    describe("workedOnCodeChanged", () => {
        it("workedOnCode is undefined, visit activity unchanged", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("123", job, task);
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let updateVisitActivitiesSpy = sandbox.spy(taskItem, "updateVisitActivities");
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params).then(() => {
                taskItem.workedOnCodeChanged(undefined, undefined);
                expect(updateVisitActivitiesSpy.notCalled).toBeTruthy();
                done();
            });
        });
    });

    describe("statusChanged", () => {
        beforeEach(() => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("123", job, task);
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            sandbox.restore();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("'NA', isInCancellingStatus set to true", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.status = "NA";
                    taskItem.statusChanged();
                    expect(taskItem.viewModel.isInCancellingStatus).toBeTruthy();
                    done();
                });

        });

        it("'C', isInCancellingStatus set to false", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.status = "C";
                    taskItem.statusChanged();
                    expect(taskItem.viewModel.isInCancellingStatus).toBeFalsy();
                    done();
                });
        });

        it("'CX', isInCancellingStatus set to false", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.status = "CX";
                    taskItem.statusChanged();
                    expect(taskItem.viewModel.isInCancellingStatus).toBeFalsy();
                    done();
                });
        });

        it("'D', isInCancellingStatus set to false", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.status = "D";
                    taskItem.statusChanged();
                    expect(taskItem.viewModel.isInCancellingStatus).toBeFalsy();
                    done();
                });
        });

        it("'IA', isInCancellingStatus set to false", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.status = "IA";
                    taskItem.statusChanged();
                    expect(taskItem.viewModel.isInCancellingStatus).toBeFalsy();
                    done();
                });
        });

        it("'IF', isInCancellingStatus set to false", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.status = "IF";
                    taskItem.statusChanged();
                    expect(taskItem.viewModel.isInCancellingStatus).toBeFalsy();
                    done();
                });
        });

        it("'IH', isInCancellingStatus set to false", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.status = "IH";
                    taskItem.statusChanged();
                    expect(taskItem.viewModel.isInCancellingStatus).toBeFalsy();
                    done();
                });
        });

        it("'IP', isInCancellingStatus set to false", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.status = "IP";
                    taskItem.statusChanged();
                    expect(taskItem.viewModel.isInCancellingStatus).toBeFalsy();
                    done();
                });
        });

        it("'QP', isInCancellingStatus set to false", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.status = "QP";
                    taskItem.statusChanged();
                    expect(taskItem.viewModel.isInCancellingStatus).toBeFalsy();
                    done();
                });
        });

        it("'VO', isInCancellingStatus set to true", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.status = "VO";
                    taskItem.statusChanged();
                    expect(taskItem.viewModel.isInCancellingStatus).toBeTruthy();
                    done();
                });
        });

        it("'WA', isInCancellingStatus set to false", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.status = "WA";
                    taskItem.statusChanged();
                    expect(taskItem.viewModel.isInCancellingStatus).toBeFalsy();
                    done();
                });
        });

        it("'XB', isInCancellingStatus set to true", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.status = "XB";
                    taskItem.statusChanged();
                    expect(taskItem.viewModel.isInCancellingStatus).toBeTruthy();
                    done();
                });
        });

        it("'XC', isInCancellingStatus set to true", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.status = "XC";
                    taskItem.statusChanged();
                    expect(taskItem.viewModel.isInCancellingStatus).toBeTruthy();
                    done();
                });
        });
    });

    describe("updateVisitActivities", () => {

        it("isFirstVisit true, not reset visit activities", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("123", job, task);
            vm.isFirstVisit = true;
            vm.productGroup = "PG";
            vm.activity = "AT";
            vm.partType = "PT";
            vm.faultActionCode = "FAC";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);

            let filterVisitActivityCatalogSpy = sandbox.stub();
            TaskItemViewModel.filterVisitActivityCatalog = filterVisitActivityCatalogSpy;

            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.updateVisitActivities(undefined);
                    expect(taskItem.viewModel.isFirstVisit).toBeTruthy();
                    expect(taskItem.viewModel.productGroup === "PG").toBeTruthy();
                    expect(taskItem.viewModel.activity === "AT").toBeTruthy();
                    expect(taskItem.viewModel.partType === "PT").toBeTruthy();
                    expect(taskItem.viewModel.faultActionCode === "FAC").toBeTruthy();
                    expect(taskItem.viewModel.showProductGroupAndPartTypes).toBeFalsy();
                    expect(filterVisitActivityCatalogSpy.called).toBeTruthy();
                    done();
                });
        });

        it("isFirstVisit true, reset visit activities", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("123", job, task);
            vm.isFirstVisit = false;
            vm.productGroup = "PG";
            vm.activity = "AT";
            vm.partType = "PT";
            vm.faultActionCode = "FAC";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);

            let filterVisitActivityCatalogSpy = sandbox.stub();
            TaskItemViewModel.filterVisitActivityCatalog = filterVisitActivityCatalogSpy;

            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.updateVisitActivities(undefined);
                    expect(taskItem.viewModel.isFirstVisit).toBeFalsy();
                    expect(taskItem.viewModel.productGroup === undefined).toBeTruthy();
                    expect(taskItem.viewModel.activity === undefined).toBeTruthy();
                    expect(taskItem.viewModel.partType === undefined).toBeTruthy();
                    expect(taskItem.viewModel.faultActionCode === undefined).toBeTruthy();
                    expect(taskItem.viewModel.showProductGroupAndPartTypes).toBeFalsy();
                    expect(filterVisitActivityCatalogSpy.called).toBeTruthy();
                    done();
                });
        });

        it("isFirstVisit true, not firstVisitJob, has workedOnCode, reset visit activities", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.isFirstVisit = false;
            vm.productGroup = "PG";
            vm.activity = "AT";
            vm.partType = "PT";
            vm.faultActionCode = "FAC";
            vm.jobType = "foobar"
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.updateVisitActivities("test1");
                    expect(taskItem.viewModel.isFirstVisit).toBeFalsy();
                    expect(taskItem.viewModel.productGroup === undefined).toBeTruthy();
                    expect(taskItem.viewModel.activity === undefined).toBeTruthy();
                    expect(taskItem.viewModel.partType === undefined).toBeTruthy();
                    expect(taskItem.viewModel.faultActionCode === undefined).toBeTruthy();
                    expect(taskItem.viewModel.showProductGroupAndPartTypes).toBeFalsy();
                    done();
                });
        });
    });

    describe("updateFaultCodesBasedOnActivity", () => {

        it("reset visit faultcodes", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.isFirstVisit = false;
            vm.productGroup = "PG";
            vm.partType = "PT";
            vm.faultActionCode = "FAC";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    partServiceStub.getMainPartForTask = sandbox.stub().resolves(undefined);
                    Promise.resolve(taskItem.updateFaultCodesBasedOnActivity(undefined)).then(() => {
                        expect(taskItem.viewModel.productGroup === undefined).toBeTruthy();
                        expect(taskItem.viewModel.partType === undefined).toBeTruthy();
                        expect(taskItem.viewModel.faultActionCode === undefined).toBeTruthy();
                        expect(taskItem.viewModel.hasMainPart).toBeFalsy();
                        expect(taskItem.viewModel.mainPartProductGroup === undefined).toBeTruthy();
                        expect(taskItem.viewModel.mainPartPartType === undefined).toBeTruthy();
                        expect(taskItem.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage).toBeFalsy();
                        done();
                    });
                });
        });

        it("reset visit faultcodes", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.isFirstVisit = false;
            vm.productGroup = "PG";
            vm.partType = "PT";
            vm.faultActionCode = "FAC";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    partServiceStub.getMainPartForTask = sandbox.stub().resolves(undefined);
                    Promise.resolve(taskItem.updateFaultCodesBasedOnActivity("test")).then(() => {
                        expect(taskItem.viewModel.productGroup === undefined).toBeTruthy();
                        expect(taskItem.viewModel.partType === undefined).toBeTruthy();
                        expect(taskItem.viewModel.faultActionCode === undefined).toBeTruthy();
                        expect(taskItem.viewModel.hasMainPart).toBeFalsy();
                        expect(taskItem.viewModel.mainPartProductGroup === undefined).toBeTruthy();
                        expect(taskItem.viewModel.mainPartPartType === undefined).toBeTruthy();
                        expect(taskItem.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage).toBeFalsy();
                        expect(taskItem.viewModel.showProductGroupAndPartTypes).toBeFalsy();
                        done();
                    });
                });
        });

        it("has Main part", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.isFirstVisit = false;
            vm.productGroup = "PG";
            vm.partType = "PT";
            vm.faultActionCode = "FAC";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    let part = <Part>{};
                    part.stockReferenceId = "123445";
                    partServiceStub.getMainPartForTask = sandbox.stub().resolves(part);
                    // let goodsType = <IGoodsType>{};
                    catalogServiceStub.getGoodsType = sandbox.stub().resolves(undefined);
                    Promise.resolve(taskItem.updateFaultCodesBasedOnActivity("test")).then(() => {
                        expect(taskItem.viewModel.productGroup === undefined).toBeTruthy();
                        expect(taskItem.viewModel.partType === undefined).toBeTruthy();
                        expect(taskItem.viewModel.faultActionCode === undefined).toBeTruthy();
                        expect(taskItem.viewModel.hasMainPart).toBeFalsy();
                        expect(taskItem.viewModel.mainPartProductGroup === undefined).toBeTruthy();
                        expect(taskItem.viewModel.mainPartPartType === undefined).toBeTruthy();
                        expect(taskItem.viewModel.showMainPartSelectedWithInvalidActivityTypeMessage).toBeFalsy();
                        expect(taskItem.viewModel.showProductGroupAndPartTypes).toBeFalsy();
                        expect(taskItem.viewModel.mainPartInformationRetrieved).toBeTruthy();
                        done();
                    });
                });
        });
    });

    describe("updateParts", () => {
        it("productCode is undefined, props unchanged", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.partType = "PT";
            vm.faultActionCode = "FAC";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.updateParts(undefined);
                    expect(taskItem.viewModel.partType === "PT").toBeTruthy();
                    expect(taskItem.viewModel.faultActionCode === "FAC").toBeTruthy();
                    done();
                });
        });

        it("productCode has value, props are undefined", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.partType = "PT";
            vm.faultActionCode = "FAC";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.updateParts("test");
                    expect(taskItem.viewModel.partType === undefined).toBeTruthy();
                    expect(taskItem.viewModel.faultActionCode === undefined).toBeTruthy();
                    done();
                });
        });

        it("productCode has value, hasMainPart false, showMainPartSelectedWithInvalidProductGroupTypeMessage false", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.partType = "PT";
            vm.faultActionCode = "FAC";
            vm.hasMainPart = false;
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.updateParts("test");
                    expect(taskItem.viewModel.partType === undefined).toBeTruthy();
                    expect(taskItem.viewModel.faultActionCode === undefined).toBeTruthy();
                    expect(taskItem.viewModel.showMainPartSelectedWithInvalidProductGroupTypeMessage).toBeFalsy();
                    done();
                });
        });

        it("productCode has value, hasMainPart true, showMainPartSelectedWithInvalidProductGroupTypeMessage true", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.partType = "PT";
            vm.faultActionCode = "FAC";
            vm.hasMainPart = true;
            vm.mainPartProductGroup = "test1";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.updateParts("test");
                    expect(taskItem.viewModel.partType === undefined).toBeTruthy();
                    expect(taskItem.viewModel.faultActionCode === undefined).toBeTruthy();
                    expect(taskItem.viewModel.showMainPartSelectedWithInvalidProductGroupTypeMessage).toBeTruthy();
                    done();
                });
        });

        it("productCode has value, hasMainPart true, showMainPartSelectedWithInvalidProductGroupTypeMessage false", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.partType = "PT";
            vm.faultActionCode = "FAC";
            vm.hasMainPart = true;
            vm.mainPartProductGroup = "test"
            vm.mainPartPartType = "MPT";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.updateParts("test");
                    expect(taskItem.viewModel.partType === undefined).toBeTruthy();
                    expect(taskItem.viewModel.faultActionCode === undefined).toBeTruthy();
                    expect(taskItem.viewModel.showMainPartSelectedWithInvalidProductGroupTypeMessage).toBeFalsy();
                    Threading.nextCycle(() => {
                        expect(taskItem.viewModel.partType === "MPT").toBeTruthy();
                        done();
                    });
                });
        });

    });

    describe("updateFaultCodesBasedOnPartType", () => {

        it("partTypeCode is undefined, showMainPartSelectedWithInvalidPartTypeMessage remains undefined", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.showMainPartSelectedWithInvalidPartTypeMessage = undefined;
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.showMainPartSelectedWithInvalidPartTypeMessage = undefined;
                    taskItem.updateFaultCodesBasedOnPartType(undefined);
                    expect(taskItem.viewModel.showMainPartSelectedWithInvalidPartTypeMessage === undefined).toBeTruthy();
                    done();
                });
        });

        it("partTypeCode is MPT, hasMainPart, showMainPartSelectedWithInvalidPartTypeMessage false", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.mainPartPartType = "MPT";
            vm.hasMainPart = true;
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.updateFaultCodesBasedOnPartType("MPT");
                    expect(taskItem.viewModel.showMainPartSelectedWithInvalidPartTypeMessage).toBeFalsy();
                    expect(taskItem.viewModel.faultActionCode === undefined).toBeTruthy();
                    done();
                });
        });

        it("partTypeCode is MPT1, hasMainPart, showMainPartSelectedWithInvalidPartTypeMessage true", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.mainPartPartType = "MPT";
            vm.hasMainPart = true;
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.updateFaultCodesBasedOnPartType("MPT1");
                    expect(taskItem.viewModel.showMainPartSelectedWithInvalidPartTypeMessage).toBeTruthy();
                    expect(taskItem.viewModel.faultActionCode === undefined).toBeTruthy();
                    done();
                });
        });

        it("hasMainPart false, showMainPartSelectedWithInvalidPartTypeMessage false", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.hasMainPart = false;
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.updateFaultCodesBasedOnPartType("MPT");
                    expect(taskItem.viewModel.showMainPartSelectedWithInvalidPartTypeMessage).toBeFalsy();
                    expect(taskItem.viewModel.faultActionCode === undefined).toBeTruthy();
                    done();
                });
        });

        it("foundPartType true, faultActionCodeFilteredCatalog has one item", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            task.partType = "part";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.hasMainPart = false;
            vm.productGroup = "grp";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.updateFaultCodesBasedOnPartType("part");
                    expect(taskItem.viewModel.faultActionCodeFilteredCatalog.length === 1).toBeTruthy();
                    done();
                });
        });

        it("foundPartType false, faultActionCodeFilteredCatalog has zero item", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            task.partType = undefined;
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.hasMainPart = false;
            vm.productGroup = "grp1";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.updateFaultCodesBasedOnPartType("part");
                    expect(taskItem.viewModel.faultActionCodeFilteredCatalog.length === 0).toBeTruthy();
                    done();
                });
        });
    });

    describe("calculateCharactersLeft", () => {
        it("validation rule disabled, charactersLeftNum is undefined", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            task.partType = undefined;
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.hasMainPart = false;
            vm.productGroup = "grp1";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.canEdit = true;
                    taskItem.validationToggle(false);
                    taskItem.calculateCharactersLeft();
                    expect(taskItem.viewModel.charactersLeftNum === undefined).toBeTruthy();
                    done();
                });
        });

        it("selectedChirpCode is undefined, charactersLeftNum is maxLength", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            task.partType = undefined;
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.hasMainPart = false;
            vm.productGroup = "grp1";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.canEdit = true;
                    taskItem.validationToggle(true);
                    taskItem.calculateCharactersLeft();
                    expect(taskItem.viewModel.charactersLeftNum === 10).toBeTruthy();
                    done();
                });
        });

        it("selectedChirpCode is undefined, charactersLeftNum is maxLength", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            task.partType = undefined;
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.hasMainPart = false;
            vm.productGroup = "grp1";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.canEdit = true;
                    taskItem.validationToggle(true);
                    taskItem.viewModel.chirpCodes = [];
                    let ccode = <IChirpCode>{};
                    ccode.code = "c1";
                    taskItem.viewModel.chirpCodes.push(ccode);
                    taskItem.calculateCharactersLeft();
                    expect(taskItem.viewModel.charactersLeftNum === 7).toBeTruthy();
                    done();
                });
        });
    });

    describe("canDeactivateAsync", () => {
        it("hasMainPart false, returns true", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            task.partType = undefined;
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.hasMainPart = false;
            vm.productGroup = "grp1";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.hasMainPart = false;
                    taskItem.canDeactivateAsync().then((result) => {
                        expect(result).toBeTruthy();
                        done();
                    });
                });
        });

        it("hasMainPart true, workedOnCode undefined, returns true", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            task.partType = undefined;
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.hasMainPart = false;
            vm.productGroup = "grp1";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.hasMainPart = true;
                    taskItem.canDeactivateAsync().then((result) => {
                        expect(result).toBeTruthy();
                        done();
                    });
                });
        });

        it("hasMainPart false, dialog not cancelled returns true", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            task.partType = undefined;
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.hasMainPart = false;
            vm.productGroup = "grp1";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let dialogResult = <DialogResult>{};
            dialogResult.wasCancelled = false;
            dialogServiceStub.open = sandbox.stub().resolves(dialogResult);
            partServiceStub.clearMainPartForTask = sandbox.stub().resolves(undefined);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.hasMainPart = true;
                    taskItem.viewModel.workedOnCode = "abc";
                    taskItem.viewModel.activity = "test";
                    taskItem.canDeactivateAsync().then((result) => {
                        expect(result).toBeTruthy();
                        done();
                    });
                });
        });

        it("hasMainPart false, dialog cancelled returns false", (done) => {
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            task.partType = undefined;
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.hasMainPart = false;
            vm.productGroup = "grp1";
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            let dialogResult = <DialogResult>{};
            dialogResult.wasCancelled = true;
            dialogServiceStub.open = sandbox.stub().resolves(dialogResult);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.viewModel.hasMainPart = true;
                    taskItem.viewModel.workedOnCode = "abc";
                    taskItem.viewModel.activity = "test";
                    taskItem.canDeactivateAsync().then((result) => {
                        expect(result).toBeFalsy();
                        done();
                    });
                });
        });
    });

    describe("chargeableTimeChanged", () => {
        it("chargeableTime is less then job duration", () => {
            taskItem.viewModel = <TaskItemViewModel>{};
            taskItem.viewModel.workDuration = 20
            taskItem.workDurationChanged(taskItem.viewModel.workDuration, undefined);
            taskItem.viewModel.chargeableTime = 10;
            expect(taskItem.viewModel.chargeableTime === 10).toBeTruthy();
        });

        it("chargeableTime is equal then job duration", () => {
            taskItem.viewModel = <TaskItemViewModel>{};
            taskItem.viewModel.workDuration = 20
            taskItem.workDurationChanged(taskItem.viewModel.workDuration, undefined);
            taskItem.viewModel.chargeableTime = 20;
            expect(taskItem.viewModel.chargeableTime === 20).toBeTruthy();
        });

        it("chargeableTime is greater then job duration", () => {
            taskItem.viewModel = <TaskItemViewModel>{};
            taskItem.viewModel.workDuration = 20
            taskItem.workDurationChanged(taskItem.viewModel.workDuration, undefined);
            taskItem.viewModel.chargeableTime = 20;
            expect(taskItem.viewModel.chargeableTime === 20).toBeTruthy();
        });
    });

    describe("loadModel", () => {
        it("task's appliance is INSTAPREM/ANNUALSERVICE, show filterout activity types", (done) => {
            let params = { jobId: "1234", taskId: "1" };
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            partServiceStub.getMainPartForTask = sandbox.stub().resolves(undefined);
            let filterVisitActivityCatalogSpy = sandbox.stub();
            TaskItemViewModel.filterVisitActivityCatalog = filterVisitActivityCatalogSpy;
            let calculateCharactersLeftSpy = sandbox.spy(taskItem, "calculateCharactersLeft");
            taskItem.activateAsync(params).then(() => {
                expect(taskItem.jobStatusesCatalog.length === 7).toBeTruthy();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "C")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "CX")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "D")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "NA")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "VO")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "XB")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "XC")).toBeDefined();
                expect(filterVisitActivityCatalogSpy.called).toBeTruthy();
                expect(calculateCharactersLeftSpy.calledOnce).toBeTruthy();
                done();
            });
        });

        it("task's appliance is other then INSTAPREM/ANNUALSERVICE, show all activity types", (done) => {
            let params = { jobId: "1234", taskId: "1" };
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "CHB";
            task.jobType = "AS";
            task.status = "D";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            vm.isFirstVisit = true;
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            partServiceStub.getMainPartForTask = sandbox.stub().resolves(undefined);
            let filterVisitActivityCatalogSpy = sandbox.stub();
            TaskItemViewModel.filterVisitActivityCatalog = filterVisitActivityCatalogSpy;
            taskItem.activateAsync(params).then(() => {
                expect(taskItem.jobStatusesCatalog.length === 14).toBeTruthy();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "C")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "CX")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "D")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "IA")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "IF")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "IH")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "IP")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "NA")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "QP")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "VO")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "VR")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "WA")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "XB")).toBeDefined();
                expect(taskItem.jobStatusesCatalog.find(x => x.status === "XC")).toBeDefined();
                expect(filterVisitActivityCatalogSpy.called).toBeTruthy();
                done();
            });
        });

        it("resetMainPartFlags called", (done) => {
            let params = { jobId: "1234", taskId: "1" };
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "CHB";
            task.jobType = "AS";
            task.status = "D";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            partServiceStub.getMainPartForTask = sandbox.stub().resolves(undefined);
            let resetMainPartFlagsSpy = sandbox.spy(taskItem, "resetMainPartFlags");
            taskItem.activateAsync(params).then(() => {
                expect(resetMainPartFlagsSpy.calledOn).toBeTruthy();
                done();
            });
        });

        it("should set activity to undefined", done => {
            let params = { jobId: "1234", taskId: "1" };
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "CHB";
            task.jobType = "AS";
            task.status = "D";
            task.activity = "test";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            partServiceStub.getMainPartForTask = sandbox.stub().resolves(undefined);
            taskItem.activateAsync(params).then(() => {
                expect(taskItem.viewModel.activity).toBeUndefined();
                done();
            });
        });

        it("should not set activity to undefined", done => {
            let params = { jobId: "1234", taskId: "1" };
            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "CHB";
            task.jobType = "AS";
            task.status = "D";
            task.activity = "xyz";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            partServiceStub.getMainPartForTask = sandbox.stub().resolves(undefined);
            taskItem.activateAsync(params).then(() => {
                expect(taskItem.viewModel.activity).not.toBeUndefined();
                done();
            });
        });
    });

    describe("save", () => {

        let params = { jobId: "1234", taskId: "1" };
        let eaSpy: Sinon.SinonStub;

        beforeEach(() => {

            let job: Job = new Job();
            job.id = "1234";
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "CHB";
            task.jobType = "AS";
            task.status = "D";
            job.tasks = [];
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            let vm = new TaskItemViewModel("1234", job, task);
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
            taskItemFactoryStub.createTaskItemBusinessModel = sandbox.stub().returns(task);
            partServiceStub.getMainPartForTask = sandbox.stub().resolves(undefined);
            partServiceStub.setPartsRequiredForTask = sandbox.stub().resolves(undefined);
            taskServiceStub.saveTask = sandbox.stub().resolves(undefined);
            eaSpy = eventAggregator.publish = sandbox.stub();

        });

        it("will not call a charge update event if not dirty", done => {
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.setDirty(false);
                    return taskItem.save()
                        .then(() => {
                            expect(eaSpy.calledWith(ChargeServiceConstants.CHARGE_UPDATE_START, "1234")).toBe(false);
                            done();
                        }
                        )
                });
        });

        it("will call a charge update event if dirty", done => {
            taskItem.activateAsync(params)
                .then(() => {
                    taskItem.setDirty(true);
                    return taskItem.save()
                        .then(() => {
                            expect(eaSpy.calledWith(ChargeServiceConstants.CHARGE_UPDATE_START, "1234")).toBe(true);
                            done();
                        }
                        )
                });
        });

        it("isDirty true, EA called, saves model successfully", (done) => {
            let dialogResult = <DialogResult>{};
            dialogResult.wasCancelled = true;
            dialogServiceStub.open = sandbox.stub().resolves(dialogResult);
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    let updateDataStateSpy = sandbox.spy(taskItem, "updateDataState");
                    let setPartsRequiredForTaskSpy = sandbox.spy(taskItem, "setPartsRequiredForTask");
                    let eaSpy = eventAggregator.publish = sandbox.stub();
                    taskItem.setDirty(true);
                    taskItem.save().then(() => {
                        expect(updateDataStateSpy.calledOnce).toBeTruthy();
                        expect(setPartsRequiredForTaskSpy.calledOnce).toBeTruthy();
                        expect(eaSpy.calledWith(ChargeServiceConstants.CHARGE_UPDATE_START, "1234")).toBeTruthy();
                        done();
                    });
                });
        });

        it("isDirty false, EA is not called, saves model successfully", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params)
                .then(() => {
                    let updateDataStateSpy = sandbox.spy(taskItem, "updateDataState");
                    let setPartsRequiredForTaskSpy = sandbox.spy(taskItem, "setPartsRequiredForTask");
                    let eaSpy = eventAggregator.publish = sandbox.stub();
                    taskItem.setDirty(false);
                    taskItem.save().then(() => {
                        expect(updateDataStateSpy.calledOnce).toBeTruthy();
                        expect(setPartsRequiredForTaskSpy.calledOnce).toBeTruthy();
                        expect(eaSpy.calledWith(ChargeServiceConstants.CHARGE_UPDATE_START, "1234")).toBeFalsy();
                        done();
                    });
                });
        });
    });

    describe("redirecting done tasks", () => {
        it("will not redirect a todays task", done => {
            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{
                tasks: [{ id: "1", isMiddlewareDoTodayTask: true }],
                tasksNotToday: [{ id: "2", isMiddlewareDoTodayTask: false }]
            });

            taskItem.canActivate({ jobId: "0", taskId: "1" }).then(result => {
                expect(result).toBe(true);
                done();
            });
        });

        it("will redirect a not todays task", done => {
            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{
                tasks: [{ id: "1", isMiddlewareDoTodayTask: true }],
                tasksNotToday: [{ id: "2", isMiddlewareDoTodayTask: false }]
            });

            taskItem.canActivate({ jobId: "0", taskId: "2" }).then((result: Redirect) => {
                expect(result instanceof Redirect).toBe(true);
                done();
            });
        });
    });

    describe("bind reset values", () => {
        it("status, workedOnCode, chargeableTime, taskItem is reset", (done) => {
            let params = { jobId: "1234", taskId: "1234" };
            taskItem.activateAsync(params).then(() => {
                taskItem.bind(undefined, undefined);
                expect(taskItem.viewModel.status === "").toBeTruthy();
                expect(taskItem.viewModel.workedOnCode === "").toBeTruthy();
                expect(taskItem.viewModel.chargeableTime === 0).toBeTruthy();
                expect(taskItem.viewModel.taskTime === undefined).toBeTruthy();
                done();
            });
        });
    });

    describe("chargeableTimeChanged method", () => {
        let job: Job;
        let vm: TaskItemViewModel;
        beforeEach(() => {
            job = new Job();
            job.id = "1234";
            job.tasks = [];
            let task: Task = new Task(true, false);
            task.id = "1";
            task.applianceType = "INS";
            task.jobType = "AS";
            task.status = "D";
            task.jobType = "foo";
            task.activity = "test";
            task.activities = [];
            let activity = new Activity();
            activity.report = "report";
            activity.status = "IP";
            activity.engineerName = "engineer";
            task.activities.push(activity);            
            job.tasks.push(task);
            jobServiceStub.getJob = sandbox.stub().resolves(job);
            vm = new TaskItemViewModel("1", job, job.tasks[0]);
            taskItemFactoryStub.createTaskItemViewModel = sandbox.stub().returns(vm);
        });

        it("should set totalChargableTime when vm.totalPreviousWorkDuration is undefined", (done) => {            
            let params = { jobId: "1234", taskId: "1" };
            taskItem.activateAsync(params).then(() => {
                taskItem.viewModel.chargeableTime = 10;
                taskItem.chargeableTimeChanged();
                expect(taskItem.totalChargableTime).toEqual(10);
                done();
            });           
        });

        it("should set totalChargableTime when vm.totalPreviousWorkDuration is defined", (done) => {
            vm.totalPreviousWorkDuration = 20;
            let params = { jobId: "1234", taskId: "1" };
            taskItem.activateAsync(params).then(() => {
                taskItem.viewModel.chargeableTime = 10;
                taskItem.chargeableTimeChanged();
                expect(taskItem.totalChargableTime).toEqual(30);
                done();
            });           
        });

        it("should set totalChargableTime when viewModel.chargeableTime is undefined", (done) => {            
            let params = { jobId: "1234", taskId: "1" };
            taskItem.activateAsync(params).then(() => {
                taskItem.chargeableTimeChanged();
                expect(taskItem.totalChargableTime).toEqual(0);
                done();
            });           
        });

        it("should set totalChargableTime when viewModel.chargeableTime is defined", (done) => {
            vm.totalPreviousWorkDuration = 20;
            let params = { jobId: "1234", taskId: "1" };
            taskItem.activateAsync(params).then(() => {
                taskItem.viewModel.chargeableTime = 10;
                taskItem.chargeableTimeChanged();
                expect(taskItem.totalChargableTime).toEqual(30);
                done();
            });           
        });
    });
});
