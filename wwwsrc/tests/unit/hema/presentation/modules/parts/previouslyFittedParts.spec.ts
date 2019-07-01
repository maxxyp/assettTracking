/// <reference path="../../../../../../typings/app.d.ts" />
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { IPartService } from "../../../../../../app/hema/business/services/interfaces/IPartService";
import { ITaskService } from "../../../../../../app/hema/business/services/interfaces/ITaskService";
import { PreviouslyFittedParts } from "../../../../../../app/hema/presentation/modules/parts/previouslyFittedParts";
import { Part } from "../../../../../../app/hema/business/models/part";
import { Task } from "../../../../../../app/hema/business/models/task";

describe("the PreviouslyFittedParts module", () => {
    let previouslyFittedParts: PreviouslyFittedParts;
    let sandbox: Sinon.SinonSandbox;
    let labelServiceStub: ILabelService;
    let partServiceStub: IPartService;
    let taskServiceStub: ITaskService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        labelServiceStub = <ILabelService>{};
        partServiceStub = <IPartService>{};
        taskServiceStub = <ITaskService>{};
        eventAggregatorStub = <EventAggregator>{};
        dialogServiceStub = <DialogService>{};
        previouslyFittedParts = new PreviouslyFittedParts(
            labelServiceStub, eventAggregatorStub, dialogServiceStub, partServiceStub, taskServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(previouslyFittedParts).toBeDefined();
    });

    describe("the activateAsync function", () => {
        it("can be called", (done) => {
            let showContentSpy: Sinon.SinonSpy = previouslyFittedParts.showContent = sandbox.stub().resolves(null);

            let part = <Part>{ taskId: "1"};
            let task = <Task>{id: "1"};

            partServiceStub.getFittedParts = sandbox.stub().resolves([part]);
            taskServiceStub.getAllTasksEverAtProperty = sandbox.stub().resolves([task]);
            previouslyFittedParts.activateAsync({ jobId: "123" })
                .then(() => {
                    expect(showContentSpy.calledOnce).toBe(true);
                    expect(previouslyFittedParts.parts).toEqual([{part, task}]);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });
    });
});
