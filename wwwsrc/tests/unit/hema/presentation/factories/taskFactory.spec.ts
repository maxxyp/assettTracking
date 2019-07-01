/// <reference path="../../../../../typings/app.d.ts" />

import {Task as TaskBusinessModel} from "../../../../../app/hema/business/models/task";
import {TaskFactory} from "../../../../../app/hema/presentation/factories/taskFactory";

describe("the taskFactory factory", () => {
    let taskFactory: TaskFactory;

    beforeEach(() => {
        taskFactory = new TaskFactory();
    });

    it("can be created", () => {
        expect(taskFactory).toBeDefined();
    });

    describe("the createTaskSummaryViewModel function", () => {
        let taskBusinessModel: TaskBusinessModel;

        beforeEach(() => {
            taskBusinessModel = new TaskBusinessModel(true, false);
            taskBusinessModel.jobType = "JT";
            taskBusinessModel.applianceType = "AT";
            taskBusinessModel.chargeType = "CT";
            taskBusinessModel.supportingText = "the boiler is broken";
            taskBusinessModel.specialRequirement = "something special";
            taskBusinessModel.activities = [];
        });
        
        it("can map fields correctly - no appliance", () => {
            let takSummaryViewModel = taskFactory.createTaskSummaryViewModel(taskBusinessModel);

            expect(takSummaryViewModel).toBeDefined();
            expect(takSummaryViewModel.jobType).toEqual(taskBusinessModel.jobType);
            expect(takSummaryViewModel.applianceType).toEqual(taskBusinessModel.applianceType);
            expect(takSummaryViewModel.chargeType).toEqual(taskBusinessModel.chargeType);
            expect(takSummaryViewModel.supportingText).toEqual(taskBusinessModel.supportingText);
            expect(takSummaryViewModel.specialRequirement).toEqual(taskBusinessModel.specialRequirement);
            expect(takSummaryViewModel.applianceName).toEqual(undefined);
        });
    });
});
