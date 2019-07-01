/// <reference path="../../../../../../typings/app.d.ts" />

import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {Notice} from "../../../../../../app/hema/presentation/modules/notice/notice";
import {IRiskService} from "../../../../../../app/hema/business/services/interfaces/IRiskService";
import {Risk} from "../../../../../../app/hema/business/models/risk";
import {DialogController, DialogService} from "aurelia-dialog";
import {EventAggregator} from "aurelia-event-aggregator";
import SinonSpy = Sinon.SinonSpy;

describe("the notice module", () => {
    let notice: Notice;
    let labelServiceStub: ILabelService;
    let sandbox: Sinon.SinonSandbox;
    let riskServiceStub: IRiskService;
    let dialogStub: DialogController;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;

    let showContentSpy: SinonSpy;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        riskServiceStub = <IRiskService>{};
        labelServiceStub = <ILabelService>{};
        dialogStub = <DialogController>{};
        eventAggregatorStub = <EventAggregator>{};
        dialogServiceStub = <DialogService>{};

        showContentSpy = sandbox.spy();

        notice = new Notice(labelServiceStub, eventAggregatorStub, dialogServiceStub, riskServiceStub, dialogStub);
        notice.showContent = showContentSpy;
        notice.labels = { "hazard": "ASBESTOS"};

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(notice).toBeDefined();
    });

    describe("the activateAsync function", () => {
        beforeEach(() => {
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called, initialises risks and hazard properties", (done) => {
            let risks: Risk[] = [];
            riskServiceStub.getRisks = sandbox.stub().resolves(risks);

            notice.activateAsync({jobId: "1"})
                .then(() => {
                    expect(notice.risks).toBeTruthy();
                    expect(notice.hazard).toBeFalsy();
                    expect(notice.hazardTitle).toEqual("");
                    done();
                });
        });

        it("initialises hazards if exist in risks", (done) => {
            let risks: Risk[] = [];
            let hazard = new Risk();
            hazard.id = "hazard";
            hazard.report = "in the garden shed";
            hazard.reason = "HAZ";
            hazard.isHazard = true;
            risks.push(hazard);

            riskServiceStub.getRisks = sandbox.stub().resolves(risks);

            notice.activateAsync({jobId: "1"})
                .then(() => {
                    expect(notice.hazard).toBeTruthy();
                    expect(notice.hazardTitle).toEqual("ASBESTOS");
                    done();
                });
        });

         it("initialises looks up safety risk `HAZ` catalog description", (done) => {
            let risks: Risk[] = [];
            let hazard = new Risk();
            hazard.id = "hazard";
            hazard.report = "in the garden shed";
            hazard.reason = "HAZ";
            hazard.isHazard = true;
            risks.push(hazard);

            riskServiceStub.getRisks = sandbox.stub().resolves(risks);

            notice.activateAsync({jobId: "1"})
                .then(() => {
                    expect(notice.hazardTitle).toEqual("ASBESTOS");
                    done();
                });
        });

        it("shows content if there are risks", (done) => {
            let risks: Risk[] = [];
            let hazard = new Risk();
            hazard.id = "hazard";
            hazard.reason = "HAZ";
            hazard.report = "asbestos";
            hazard.isHazard = true;
            risks.push(hazard);

            riskServiceStub.getRisks = sandbox.stub().resolves(risks);

            notice.activateAsync({jobId: "1"})
                .then(() => {
                    expect(notice.hazard).toBeTruthy();
                    expect(notice.hazardTitle).toEqual("ASBESTOS");
                    done();
                });
        });
    });
});
