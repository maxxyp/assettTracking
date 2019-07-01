/// <reference path="../../../../../../../typings/app.d.ts" />

import {SupportOperations} from "../../../../../../../app/hema/presentation/modules/settings/about/supportOperations";
import { EventAggregator } from "../../../../../../../typings/lib/aurelia/aurelia-event-aggregator/index";
import { ILabelService } from "../../../../../../../app/hema/business/services/interfaces/ILabelService";
import { DialogService } from "../../../../../../../typings/lib/aurelia/aurelia-dialog/index";
import { IStorage } from "../../../../../../../app/common/core/services/IStorage";
import { IReferenceDataService } from "../../../../../../../app/hema/business/services/interfaces/IReferenceDataService";
import { IJobService } from "../../../../../../../app/hema/business/services/interfaces/IJobService";
import { Job } from "../../../../../../../app/hema/business/models/job";
import { IBridgeBusinessService } from "../../../../../../../app/hema/business/services/interfaces/IBridgeBusinessService";
import { BridgeDiagnostic } from "../../../../../../../app/hema/business/models/bridgeDiagnostic";
import * as Logging from "aurelia-logging";
import { WindowHelper } from "../../../../../../../app/hema/core/windowHelper";
import { IFFTService } from '../../../../../../../app/hema/api/services/interfaces/IFFTService';
import { ISupportService } from "../../../../../../../app/hema/business/services/interfaces/ISupportService";

describe("the SupportOperations module", () => {
    let supportOperations: SupportOperations;
    let sandbox: Sinon.SinonSandbox;

    let labelServiceStub: ILabelService;
    let dialogServiceStub: DialogService;
    let storageStub: IStorage;
    let referenceDataServiceStub: IReferenceDataService;
    let jobServiceStub: IJobService;
    let bridgeBusinessServiceStub: IBridgeBusinessService;
    let fftServiceStub: IFFTService;
    let supportServiceStub: ISupportService;

    let realLoggerFn = Logging.getLogger;
    let warnStub: Sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        labelServiceStub = <ILabelService> {};
        labelServiceStub.getGroup = sandbox.stub().resolves({
            "questionTitle": "foo",
            "question": "bar",
            "logJobTitle": "logJobTitle",
            "logJobNoActiveJob": "logJobNoActiveJob",
            "logJobCantGetJob": "logJobCantGetJob",
            "logJobSuccess": "logJobSuccess",
            "haveUnsentPayloadsTitle": "haveUnsentPayloadsTitle", 
            "haveUnsentPayloads": "haveUnsentPayloads",
        });

        dialogServiceStub = <DialogService>{};
        dialogServiceStub.open = sandbox.stub().resolves({});

        storageStub = <IStorage>{};

        referenceDataServiceStub = <IReferenceDataService>{};

        jobServiceStub = <IJobService> {};
        bridgeBusinessServiceStub = <IBridgeBusinessService>{};
        bridgeBusinessServiceStub.getDiagnostic = sandbox.stub().resolves(<BridgeDiagnostic> {});

        realLoggerFn = Logging.getLogger;
        warnStub = sandbox.stub();
        (<any>Logging).getLogger = sandbox.stub().returns({
            debug: () => {},
            warn: warnStub
        });

        supportServiceStub = <ISupportService>{};
        supportServiceStub.getLastJobUpdate = sandbox.stub().resolves({});

        fftServiceStub = <IFFTService>{};
        fftServiceStub.getUnsentPayloads = sandbox.stub().resolves([]);

        supportOperations = new SupportOperations(
            labelServiceStub, <EventAggregator>{}, dialogServiceStub, storageStub, referenceDataServiceStub,
            jobServiceStub, bridgeBusinessServiceStub, fftServiceStub, supportServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
        (<any>Logging).getLogger = realLoggerFn;
    });

    it("can be created", () => {
        expect(supportOperations).toBeDefined();
    });

    describe("bridge diagnostics", () => {
        it("will populate bridge diagnostics on activate", async done => {
            let diagnostic = <BridgeDiagnostic> {};
            bridgeBusinessServiceStub.getDiagnostic = sandbox.stub().resolves(diagnostic);

            await supportOperations.activateAsync();
            expect(supportOperations.bridgeDiagnosticSummary).toBe(diagnostic);
            done();
        });
    });

    describe("logging current job state", () => {
        it("will not log if no current job", async done => {
            jobServiceStub.getActiveJobId = sandbox.stub().resolves(undefined);

            await supportOperations.activate();
            await supportOperations.logCurrentJobState();

            expect((dialogServiceStub.open as Sinon.SinonStub).args[0][0].model.infoMessage).toEqual("logJobNoActiveJob");
            expect(warnStub.called).toBe(false);
            done();
        });

        it("will not log cannot get job", async done => {
            jobServiceStub.getActiveJobId = sandbox.stub().resolves("1");
            jobServiceStub.getJob = sandbox.stub().resolves(null);

            await supportOperations.activate();
            await supportOperations.logCurrentJobState();

            expect((dialogServiceStub.open as Sinon.SinonStub).args[0][0].model.infoMessage).toEqual("logJobCantGetJob1");
            expect(warnStub.called).toBe(false);
            done();
        });

        it("will log if there is an active job", async done => {
            let job = <Job> {};
            jobServiceStub.getActiveJobId = sandbox.stub().resolves("1");
            jobServiceStub.getJob = sandbox.stub().resolves(job);

            await supportOperations.activate();
            await supportOperations.logCurrentJobState();

            expect((dialogServiceStub.open as Sinon.SinonStub).args[0][0].model.infoMessage).toEqual("logJobSuccess1");
            expect(warnStub.args[0][1]).toBe(job);
            done();
        });
    });

    describe("removing user data", () => {
        beforeEach(() => {
            dialogServiceStub.open = sandbox.stub().resolves({wasCancelled: false});
            storageStub.clear = sandbox.stub().resolves({});
            referenceDataServiceStub.clear = sandbox.stub().resolves({});
            WindowHelper.reload = sandbox.stub();
        });

        it("will not remove data if user cancels", async done => {
            dialogServiceStub.open = sandbox.stub().resolves({wasCancelled: true});

            await supportOperations.activate();
            await supportOperations.removeData({user: true, catalog: true});

            expect((storageStub.clear as Sinon.SinonStub).called).toBe(false);
            expect((referenceDataServiceStub.clear as Sinon.SinonStub).called).toBe(false);
            expect((WindowHelper.reload as Sinon.SinonStub).called).toBe(false);
            done();
        });

        it("will not remove data if resilience info exists and user cancels", async done => {
            let stub = dialogServiceStub.open = sandbox.stub();
            fftServiceStub.getUnsentPayloads = sandbox.stub().resolves([{}]);

            stub.onFirstCall().resolves({wasCancelled: false});
            stub.onSecondCall().resolves({wasCancelled: true});
            
            await supportOperations.activate();
            await supportOperations.removeData({user: true, catalog: false});

            expect((storageStub.clear as Sinon.SinonStub).called).toBe(false);
            expect((referenceDataServiceStub.clear as Sinon.SinonStub).called).toBe(false);
            expect((WindowHelper.reload as Sinon.SinonStub).called).toBe(false);
            done();
        });

        it("will remove data if resilience info exists and user oks", async done => {
            let stub = dialogServiceStub.open = sandbox.stub();
            fftServiceStub.getUnsentPayloads = sandbox.stub().resolves([{}]);

            stub.onFirstCall().resolves({wasCancelled: false});
            stub.onSecondCall().resolves({wasCancelled: false});
            
            await supportOperations.activate();
            await supportOperations.removeData({user: true, catalog: false});

            expect((storageStub.clear as Sinon.SinonStub).called).toBe(true);
            expect((referenceDataServiceStub.clear as Sinon.SinonStub).called).toBe(false);
            expect((WindowHelper.reload as Sinon.SinonStub).called).toBe(true);
            done();
        });

        it("will remove user data", async done => {
            await supportOperations.activate();
            await supportOperations.removeData({user: true});

            expect((storageStub.clear as Sinon.SinonStub).called).toBe(true);
            expect((referenceDataServiceStub.clear as Sinon.SinonStub).called).toBe(false);
            expect((WindowHelper.reload as Sinon.SinonStub).called).toBe(true);
            done();
        });


        it("will remove catalog data", async done => {
            await supportOperations.activate();
            await supportOperations.removeData({catalog: true});

            expect((storageStub.clear as Sinon.SinonStub).called).toBe(false);
            expect((referenceDataServiceStub.clear as Sinon.SinonStub).called).toBe(true);
            expect((WindowHelper.reload as Sinon.SinonStub).called).toBe(true);
            done();
        });

        it("will remove all data", async done => {
            await supportOperations.activate();
            await supportOperations.removeData({user: true, catalog: true});

            expect((storageStub.clear as Sinon.SinonStub).called).toBe(true);
            expect((referenceDataServiceStub.clear as Sinon.SinonStub).called).toBe(true);
            expect((WindowHelper.reload as Sinon.SinonStub).called).toBe(true);
            done();
        });

        it("will remove catalog data even if the referenceDataService throws", async done => {
            referenceDataServiceStub.clear = sandbox.stub().rejects({});

            await supportOperations.activate();
            await supportOperations.removeData({user: true, catalog: true});

            expect((storageStub.clear as Sinon.SinonStub).called).toBe(true);
            expect((referenceDataServiceStub.clear as Sinon.SinonStub).called).toBe(true);
            expect((WindowHelper.reload as Sinon.SinonStub).called).toBe(true);
            done();
        });
    });
});
