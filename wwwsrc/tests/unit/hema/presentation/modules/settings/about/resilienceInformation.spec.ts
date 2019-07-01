/// <reference path="../../../../../../../typings/app.d.ts" />

import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { ILabelService } from "../../../../../../../app/hema/business/services/interfaces/ILabelService";
import { ResilienceInformation } from "../../../../../../../app/hema/presentation/modules/settings/about/resilienceInformation";
import { RetryPayload } from "../../../../../../../app/common/resilience/models/retryPayload";
import { IResilientService } from "../../../../../../../app/common/resilience/services/interfaces/IResilientService";

describe("the ResilienceInformation module", () => {
    let sandbox: Sinon.SinonSandbox;
    let resilienceInformation: ResilienceInformation;
    let labelServiceStub = <ILabelService>{};
    let dialogServiceStub = <DialogService>{};
    let resilientServieStub = <IResilientService>{};
    let eventAggregatorStub = <EventAggregator>{};
    let sendAllRetryPayloadsStub: Sinon.SinonStub;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        eventAggregatorStub.subscribe = sandbox.stub();

        dialogServiceStub.open = sandbox.stub().returns(Promise.resolve(undefined));

        let retryPayload = <RetryPayload> {};
        retryPayload.headers = [{
                                    "name": "engineerId",
                                    "value": "1111111"
                                }];
        retryPayload.params = {"jobId": "1212"};
        retryPayload.data = {};
        retryPayload.routeName = "job_update";
        retryPayload.lastRetryTime = new Date();
        resilientServieStub.getUnsentPayloads = sandbox.stub().resolves([retryPayload]);
        resilientServieStub.isRetryInProgress = sandbox.stub().returns(true);

        sendAllRetryPayloadsStub = resilientServieStub.sendAllRetryPayloads = sandbox.stub();

        labelServiceStub.getGroup = sandbox.stub().resolves({});

        resilienceInformation = new ResilienceInformation(labelServiceStub, eventAggregatorStub, dialogServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should be defined", () => {
        expect(resilienceInformation).toBeDefined();
    });

    it("should unsentJobUpdates.length be equal to 1", (done) => {
        resilienceInformation.getLabel = sandbox.stub().returns("");

        resilienceInformation.activateAsync({service: resilientServieStub, title: "Foo"}).then(() => {
            expect(resilienceInformation.unsentCalls.length).toBe(1);
            expect(resilienceInformation.isRetryInProgress).toBe(true);
            done();
        })
    });

    it("should call sendAllRetryPayloads method in resilient service", async () => {
        await resilienceInformation.activateAsync({ service: resilientServieStub, title: "Foo"})
        resilienceInformation.retryAll();
        expect(sendAllRetryPayloadsStub.called).toBeTruthy();
    });
});