/// <reference path="../../../../../typings/app.d.ts" />

import {ComplaintFactory} from "../../../../../app/hema/business/factories/complaintFactory";
import {Job as JobApiBusinessModel} from "../../../../../app/hema/business/models/job";
import {Task} from "../../../../../app/hema/business/models/task";
import {Charge} from "../../../../../app/hema/business/models/charge/charge";

describe("the ComplaintFactory module", () => {
    let complaintFactory: ComplaintFactory;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        complaintFactory = new ComplaintFactory();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(complaintFactory).toBeDefined();
    });

    it("can create undefined complaintModel from undefined charge model", () => {
        let jobBusinessModel = new JobApiBusinessModel();
        let apiModel = complaintFactory.createComplaintApiModel(jobBusinessModel);

        expect(apiModel).toBeUndefined();
    });

    it("can create undefined complaintModel from model with no charge on job", () => {
        let jobBusinessModel = new JobApiBusinessModel();
        jobBusinessModel.tasks = [<Task>{isCharge: false}];
        let chargeModel = new Charge();
        chargeModel.chargeOption = "2";

        let apiModel = complaintFactory.createComplaintApiModel(jobBusinessModel);

        expect(apiModel).toBeUndefined();
    });

    it("can create undefined complaintModel from model with chargeOption === 1 (charge ok)", () => {
        let jobBusinessModel = new JobApiBusinessModel();
        jobBusinessModel.tasks = [<Task>{isCharge: true}];
        let chargeModel = new Charge();
        chargeModel.chargeOption = "1";

        let apiModel = complaintFactory.createComplaintApiModel(jobBusinessModel);

        expect(apiModel).toBeUndefined();
    });

    it("can only create complaintModel from model with properties when chargeable job and chargeOption === 2 (charge not ok)", () => {
        let jobBusinessModel = new JobApiBusinessModel();
        jobBusinessModel.tasks = [<Task>{isCharge: true}];

        let chargeModel = new Charge();
        chargeModel.complaintActionCategoryCharge = "D";
        chargeModel.remarks = "remarks";
        chargeModel.chargeOption = "2";
        chargeModel.complaintReasonCodeCharge = "BQ";

        jobBusinessModel.charge = chargeModel;

        let apiModel = complaintFactory.createComplaintApiModel(jobBusinessModel);

        expect(apiModel.complaintReasonCode).toEqual("BQ");
        expect(apiModel.complaintActionCategory).toEqual("D");
        expect(apiModel.complaintRemarks).toEqual("remarks");
        expect(apiModel.compensationAmount).toBeUndefined();
    });


});
