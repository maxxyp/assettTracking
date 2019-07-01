/// <reference path="../../../../../../typings/app.d.ts" />
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {IJobService} from "../../../../../../app/hema/business/services/interfaces/IJobService";
import {IValidationService} from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import {IBusinessRuleService} from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {ICatalogService} from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import {IEngineerService} from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import {ITaskService} from "../../../../../../app/hema/business/services/interfaces/ITaskService";
import {TaskVisitDetails} from "../../../../../../app/hema/presentation/modules/tasks/taskVisitDetails";
import {Task} from "../../../../../../app/hema/business/models/task";
import {TaskVisit} from "../../../../../../app/hema/business/models/taskVisit";
import {IActivityCmpnentVstStatus} from "../../../../../../app/hema/business/models/reference/IActivityCmpnentVstStatus";

describe("the TaskItem module", () => {
    let taskVisitDetails: TaskVisitDetails;
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

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        catalogServiceStub = <ICatalogService>{};
        jobServiceStub = <IJobService>{};
        engineerServiceStub = <IEngineerService>{};
        labelServiceStub = <ILabelService>{};
        taskServiceStub = <ITaskService>{};
        eventAggregatorStub = <EventAggregator>{};
        dialogServiceStub = <DialogService>{};
        validationServiceStub = <IValidationService>{};
        businessRuleServiceStub = <IBusinessRuleService>{};

        let js = <IActivityCmpnentVstStatus>{};
        js.status = "D";
        js.statusDescription = "do today";

        catalogServiceStub.getActivityComponentVisitStatuses = sandbox.stub().resolves([js]);
        taskServiceStub.getTaskItem = sandbox.stub().resolves(new Task(false, false));

        taskVisitDetails = new TaskVisitDetails(catalogServiceStub, jobServiceStub, engineerServiceStub,
            labelServiceStub, taskServiceStub, eventAggregatorStub, dialogServiceStub, validationServiceStub, businessRuleServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(taskVisitDetails).toBeDefined();
    });

    it("set default values", () => {
        expect(taskVisitDetails.noData).toBe(true);
        expect(taskVisitDetails.visits).toEqual([]);
    });

    it("should map catalog job status", (done) => {
        taskVisitDetails.activateAsync({"taskId": "1"}).then(() => {
            expect(taskVisitDetails.statuses["D"]).toEqual("do today");
            done();
        });
    });

    it("should handle no task visits", (done) => {

        let task = new Task(false, false);

        taskServiceStub.getTaskItem = sandbox.stub().resolves(task);

        taskVisitDetails.activateAsync({"taskId": "1"}).then(() => {
            expect(taskVisitDetails.visits.length).toEqual(0);
            expect(taskVisitDetails.noData).toBe(true);
            done();
        });
    });

    it("should map taskVisit", (done) => {

        let task = new Task(false, false);
        let taskVisit = new TaskVisit();
        taskVisit.date = "2001-01-01";
        taskVisit.report = "report";
        taskVisit.status = "D";
        taskVisit.engineerName = "engineer";

        task.previousVisits = [];
        task.previousVisits.push(taskVisit);

        taskServiceStub.getTaskItem = sandbox.stub().resolves(task);

        taskVisitDetails.activateAsync({"taskId": "1"}).then(() => {
            expect(taskVisitDetails.visits.length).toEqual(1);
            expect(taskVisitDetails.visits[0].engineerName).toEqual("engineer");
            expect(taskVisitDetails.visits[0].report).toEqual("report");
            expect(taskVisitDetails.visits[0].status).toEqual("D");
            expect(taskVisitDetails.visits[0].date).toEqual("2001-01-01");
            expect(taskVisitDetails.noData).toBe(false);
            done();
        });
    });


});
