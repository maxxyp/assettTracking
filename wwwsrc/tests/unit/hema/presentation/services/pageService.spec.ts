/// <reference path="../../../../../typings/app.d.ts" />
import { EventAggregator } from "aurelia-event-aggregator";
import { IPageService } from "../../../../../app/hema/presentation/services/interfaces/IPageService";
import { PageService } from "../../../../../app/hema/presentation/services/pageService";
import { JobServiceConstants } from "../../../../../app/hema/business/services/constants/jobServiceConstants";
import { ILabelService } from "../../../../../app/hema/business/services/interfaces/ILabelService";

describe("PageService module ", () => {
    let sandbox: Sinon.SinonSandbox;
    let eventAggregatorStub: EventAggregator;
    let labelServiceStub: ILabelService;
    let pageService: IPageService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        eventAggregatorStub = new EventAggregator();

        let labels = {
            "taskMain": "activities",
            "applianceMain": "appliances",
            "propertySafetyMain": "property-safety",
            "partsMain": "parts",
            "activities": "details",
            "appliances": "appliance-details"
        };

        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sandbox.stub().resolves(labels);
        pageService = new PageService(eventAggregatorStub, labelServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(pageService).toBeDefined();
    });

    it("should return undefined", async done => {
        await pageService.addOrUpdateLastVisitedPage("activity/121212/details");
        expect(pageService.getLastVisitedPage("taskMain")).toEqual(undefined);
        done();
    });

    it("should update details route for activities page and return the same when getLastVisitedPage method is called", async done => {
        await pageService.addOrUpdateLastVisitedPage("activities/111/details");
        expect(pageService.getLastVisitedPage("taskMain", "111")).toEqual("details");

        await pageService.addOrUpdateLastVisitedPage("activities/222/previous-activities");
        expect(pageService.getLastVisitedPage("taskMain", "222")).toEqual("previous-activities");
        done();
    });

    it("should update previous-activities route for activities page and return the same when getLastVisitedPage method is called", async done => {
        await pageService.addOrUpdateLastVisitedPage("activities/111/previous-activities");
        expect(pageService.getLastVisitedPage("taskMain", "111")).toEqual("previous-activities");
        expect(pageService.getLastVisitedPage("taskMain", "333")).toEqual(undefined);
        done();
    });

    it("should update parts-basket route for parts page and return the same when getLastVisitedPage method is called", async done => {
        await pageService.addOrUpdateLastVisitedPage("parts/parts-basket");
        expect(pageService.getLastVisitedPage("partsMain")).toEqual("parts-basket");
        done();
    });

    it("should replace appliance-details with gas-safety route and return the url", async done => {
        await pageService.addOrUpdateLastVisitedPage("appliances/111/gas-safety");
        let lastVisitedUrl = await pageService.getLastVisitedPageUrl("appliances/111/appliance-details");
        expect(lastVisitedUrl).toEqual("appliances/111/gas-safety");
        done();
    });

    it("should update the default route for activities and return the same when getLastVisitedPage method is called", async done => {
        await pageService.addOrUpdateLastVisitedPage("activities/111/");
        expect(pageService.getLastVisitedPage("taskMain", "111")).toEqual("details");
        done();
    });

    it("should update the default route for appliaces and return the same when getLastVisitedPage method is called", async done => {
        await pageService.addOrUpdateLastVisitedPage("appliances/1001/");
        expect(pageService.getLastVisitedPage("applianceMain", "1001")).toEqual("appliance-details");
        done();
    });

    it("should return the same url", async done => {
        let lastVisitedUrl = await pageService.getLastVisitedPageUrl("appliances/222/appliance-details");
        expect(lastVisitedUrl).toEqual("appliances/222/appliance-details");
        done();
    });

    it("should call clearPageVisitedHistory method", () => {
        let clearPageVisitedHistorySpy = sandbox.spy(pageService, "clearPageVisitedHistory");
        eventAggregatorStub.publish(JobServiceConstants.JOB_STATE_CHANGED, () => this.clearPageVisitedHistory());
        expect(clearPageVisitedHistorySpy.called).toBeTruthy();
    });
});