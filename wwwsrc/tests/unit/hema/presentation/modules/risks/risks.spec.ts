/// <reference path="../../../../../../typings/app.d.ts" />

import {ICatalogService} from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import {EventAggregator} from "aurelia-event-aggregator";
import {Risks} from "../../../../../../app/hema/presentation/modules/risks/risks";
import {IRiskService} from "../../../../../../app/hema/business/services/interfaces/IRiskService";
import {Risk} from "../../../../../../app/hema/business/models/risk";
import {RiskViewModel} from "../../../../../../app/hema/presentation/modules/risks/viewModels/riskViewModel";
import {IJobService} from "../../../../../../app/hema/business/services/interfaces/IJobService";
import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {IValidationService} from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import {IBusinessRuleService} from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {Guid} from "../../../../../../app/common/core/guid";
import {Router} from "aurelia-router";
import {IEngineerService} from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import {DialogService} from "aurelia-dialog";
import {ISftyReasonCat} from "../../../../../../app/hema/business/models/reference/ISftyReasonCat";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { Job } from "../../../../../../app/hema/business/models/job";
import { Task } from "../../../../../../app/hema/business/models/task";
import {Threading} from "../../../../../../app/common/core/threading";

describe("the Risks module", () => {
    let risksVm: Risks;
    let sandbox: Sinon.SinonSandbox;
    let riskServiceStub: IRiskService;
    let catalogServiceStub: ICatalogService;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let eaStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let labelServiceStub: ILabelService;
    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;

    let risk: Risk;
    let risks: Risk [] = [];
    let safetyRisks: ISftyReasonCat [] = [];

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        // stub catalog service
        let safetyRisk = <ISftyReasonCat>{};
        safetyRisk.safetyReasonCategoryCode = "R1";
        safetyRisk.safetyReasonCategoryReason = "reason1";

        let safetyRisk1 = <ISftyReasonCat>{};
        safetyRisk1.safetyReasonCategoryCode = "R2";
        safetyRisk1.safetyReasonCategoryReason = "reason2";

        let safetyRisk2 = <ISftyReasonCat>{};
        safetyRisk2.safetyReasonCategoryCode = "R3";
        safetyRisk2.safetyReasonCategoryReason = "reason3";

        let safetyRisk3 = <ISftyReasonCat>{};
        safetyRisk3.safetyReasonCategoryCode = "R4";
        safetyRisk3.safetyReasonCategoryReason = "reason4";

        safetyRisks.push(safetyRisk);
        safetyRisks.push(safetyRisk1);
        safetyRisks.push(safetyRisk2);
        safetyRisks.push(safetyRisk3);

        catalogServiceStub = <ICatalogService>{};
        catalogServiceStub.getSafetyReasonCats = sandbox.stub().resolves(safetyRisks);

        jobServiceStub = <IJobService>{};
        let job = new Job();
        let task = new Task(true, false);
        task.status = "NA";
        job.tasks = [task];
        jobServiceStub.getJob = sandbox.stub().resolves(job);

        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);

        // current selected risk for vm to use in tests
        risk = new Risk();
        risk.id = Guid.empty;
        risk.reason = "R1";
        risk.report = "some report";
        risks.push(risk);

        riskServiceStub = <IRiskService>{};
        riskServiceStub.getRisks = sandbox.stub().returns(Promise.resolve(risks));
        riskServiceStub.updateRisk = sandbox.stub().returns(Promise.resolve());

        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sinon.stub().returns(Promise.resolve({}));

        validationServiceStub = <IValidationService>{};

        eaStub = <EventAggregator>{};
        eaStub.publish = sandbox.stub();

        businessRuleServiceStub = <IBusinessRuleService>{};
        let businessRules: { [key: string]: any} = {};
        businessRuleServiceStub.getRuleGroup = sandbox.stub().returns(Promise.resolve(businessRules));

        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};

        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("notDoingJobStatuses").returns("NA");
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        let routerStub = <Router>{};

        dialogServiceStub = <DialogService>{};

        // create vm to test
        risksVm = new Risks(labelServiceStub, riskServiceStub, jobServiceStub, engineerServiceStub, catalogServiceStub, eaStub,
            dialogServiceStub, validationServiceStub, businessRuleServiceStub, routerStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(risksVm).toBeDefined();
    });

     describe("call activateAsync", () => {

        beforeEach(() => {

        });

        it("should canEdit be equal to false", (done) => {
            risksVm.activateAsync({ jobId: "1" }).then(() => {
                expect(risksVm.canEdit).toBe(false);
                done();
            });
        });
     });

     describe("deleteRisk method", () => {
        let eventstub: MouseEvent;
        let notifyDataStateChangedSpy

        beforeEach(() => {
            eventstub = <MouseEvent>{};
            eventstub.stopPropagation = sandbox.stub();
            riskServiceStub.deleteRisk = sandbox.stub().resolves(Promise.resolve());
            notifyDataStateChangedSpy = sandbox.spy(risksVm, "notifyDataStateChanged");
            risksVm.showDeleteConfirmation = sandbox.stub().resolves(true);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should delete a risk", (done) => {
            risksVm.riskViewModels = [<RiskViewModel>{risk: risk}];
            risksVm.deleteRisk(eventstub, risksVm.riskViewModels[0].risk.id);
            Threading.delay(() => {
                expect(risksVm.riskViewModels.length).toBe(0);
                expect(notifyDataStateChangedSpy.called).toBeTruthy();
                done();
            }, 250);
         });
     });
});
