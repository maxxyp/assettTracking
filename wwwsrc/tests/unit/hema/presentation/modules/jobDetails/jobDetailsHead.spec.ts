/// <reference path="../../../../../../typings/app.d.ts" />
import {DOM} from "aurelia-pal";
import {JobDetailsHead} from "../../../../../../app/hema/presentation/modules/jobDetails/jobDetailsHead";
import {IJobService} from "../../../../../../app/hema/business/services/interfaces/IJobService";
import {Router} from "aurelia-router";
import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {IConfigurationService} from "../../../../../../app/common/core/services/IConfigurationService";
import {ICatalogService} from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import {IBridgeBusinessService} from "../../../../../../app/hema/business/services/interfaces/IBridgeBusinessService";
import {ICustomerInfoService} from "../../../../../../app/hema/business/services/interfaces/ICustomerInfoService";
import {Job} from "../../../../../../app/hema/business/models/job";

describe("the JobDetailsHead module", () => {
    let jobDetailsHead: JobDetailsHead;
    let sandbox: Sinon.SinonSandbox;
    let jobServiceStub: IJobService;
    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let routerStub: Router;
    let configurationServiceStub: IConfigurationService;
    let catalogServiceStub: ICatalogService;
    let bridgeBusinessServiceStub: IBridgeBusinessService;
    let customerInfoServiceStub: ICustomerInfoService;

    let dispatchSpy, event, stopPropagationSpy, dialogServiceOpenSpy, custInfoOpenAppSpy, exportCustomerDetailsSpy;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        jobServiceStub = <IJobService>{};
        jobServiceStub.getJob = sandbox.stub().resolves({});

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.subscribe = sandbox.stub();
        eventAggregatorStub.publish = sandbox.stub();

        dialogServiceStub = <DialogService>{};
        dialogServiceOpenSpy = dialogServiceStub.open = sandbox.stub();

        routerStub = <Router>{};
        routerStub.navigate = sandbox.stub().returns(true);

        catalogServiceStub = <ICatalogService> {};

        customerInfoServiceStub = <ICustomerInfoService> {};
        custInfoOpenAppSpy = customerInfoServiceStub.openApp = sandbox.stub().resolves(Promise.resolve());

        dispatchSpy = sandbox.spy(DOM, "dispatchEvent");

        event = new Event("click");
        stopPropagationSpy = sandbox.spy(event, "stopPropagation");

        bridgeBusinessServiceStub = <IBridgeBusinessService> {};
        exportCustomerDetailsSpy = bridgeBusinessServiceStub.exportCustomerDetails = sandbox.stub().resolves(Promise.resolve());

        jobDetailsHead = new JobDetailsHead(labelServiceStub, jobServiceStub, eventAggregatorStub, dialogServiceStub, routerStub, configurationServiceStub, catalogServiceStub, bridgeBusinessServiceStub, customerInfoServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(jobDetailsHead).toBeDefined();
    });

    describe("navigateToAppointmentBooking method", () => {
        it("should dispatch event", () => {
            jobDetailsHead.job = <Job> {id: "1"};
            jobDetailsHead.navigateToAppointmentBooking(event);
            expect(stopPropagationSpy.called).toBeTruthy();
            expect(dispatchSpy.called).toBeTruthy();
        });
    });

    describe("showRisks method", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should call dialog service open method", () => {
            jobDetailsHead.showRisks("1", event);
            expect(dialogServiceOpenSpy.called).toBeTruthy();
        });

        it("should dispatch event", () => {
            jobDetailsHead.showRisks("1", event);
            expect(stopPropagationSpy.called).toBeTruthy();
            expect(dispatchSpy.called).toBeTruthy();
        });
    });

    describe("showLandlordDetails method", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should call dialog service open method", () => {
            jobDetailsHead.showLandlordDetails("1", event);
            expect(dialogServiceOpenSpy.called).toBeTruthy();
        });

        it("should dispatch event", () => {
            jobDetailsHead.showLandlordDetails("1", event);
            expect(stopPropagationSpy.called).toBeTruthy();
            expect(dispatchSpy.called).toBeTruthy();
        });
    });

    describe("launchCustomerInfo method", () => {
        afterEach(() => {
            sandbox.restore();
        });

        beforeEach(() =>{
            jobDetailsHead.job = <Job> {id: "1", premises: {id: "1"}};
        });

        it("should call customerInfo service openApp method", () => {
            jobDetailsHead.launchCustomerInfo(event);
            expect(custInfoOpenAppSpy.called).toBeTruthy();
        });

        it("should dispatch event", () => {
            jobDetailsHead.launchCustomerInfo(event);
            expect(stopPropagationSpy.called).toBeTruthy();
            expect(dispatchSpy.called).toBeTruthy();
        });
    });

    describe("exportCustomerDetails method", () => {
        afterEach(() => {
            sandbox.restore();
        });

        it("should call bridgeBusinessService exportCustomerDetails method", async (done) => {
            await jobDetailsHead.exportCustomerDetails(event, "1");
            expect(exportCustomerDetailsSpy.called).toBeTruthy();
            done();
        });

        it("should dispatch event", async (done) => {
            await jobDetailsHead.exportCustomerDetails(event, "1");
            expect(stopPropagationSpy.called).toBeTruthy();
            expect(dispatchSpy.called).toBeTruthy();
            done();
        });
    });
});