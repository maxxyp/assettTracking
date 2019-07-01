/// <reference path="../../../../../typings/app.d.ts" />
import {Job} from "../../../../../app/hema/business/models/job";
import {Task} from "../../../../../app/hema/business/models/task";
import {VisitFactory} from "../../../../../app/hema/business/factories/visitFactory";

describe("the VisitFactory module", () => {
    let visitFactory: VisitFactory;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        visitFactory = new VisitFactory();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(visitFactory).toBeDefined();
    });

    describe("createVisitApiModel", () => {
        it("can create a futureVisit for a task that came from WMIS", () => {
            let job = <Job>{
                tasks: [{id: "123"}],
                appointment: {
                    estimatedDurationOfAppointment: [{taskId: "123"}]
                }
            };
            let apiModel = visitFactory.createVisitApiModel(job);
            expect(apiModel.tasks[0].id).toBe("123");
            expect(apiModel.tasks[0].fieldTaskId).toBeUndefined();
        });

        it("can create a futureVisit for a task created in the field", () => {
            const fieldTaskId = Task.getFieldTaskId("34567123");
            let job = <Job>{
                tasks: [{id: "1234567123", fieldTaskId: fieldTaskId, isNewRFA: true}],
                appointment: {
                    estimatedDurationOfAppointment: [{taskId: "1234567123"}]
                }
            };
            let apiModel = visitFactory.createVisitApiModel(job);
            expect(apiModel.tasks[0].id).toBeUndefined();
            expect(apiModel.tasks[0].fieldTaskId).toBe(fieldTaskId);
        });
    });
});
