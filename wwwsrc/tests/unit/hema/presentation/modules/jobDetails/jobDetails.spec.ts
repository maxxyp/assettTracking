/// <reference path="../../../../../../typings/app.d.ts" />
import { BrowserHistory } from "aurelia-history-browser";
import {JobDetails} from "../../../../../../app/hema/presentation/modules/jobDetails/jobDetails";
import {IJobService} from "../../../../../../app/hema/business/services/interfaces/IJobService";
import {RouterConfiguration, Router} from "aurelia-router";
import {Container} from "aurelia-dependency-injection";
import {Job} from "../../../../../../app/hema/business/models/job";
import {Appliance} from "../../../../../../app/hema/business/models/appliance";
import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DataStateSummary} from "../../../../../../app/hema/business/models/dataStateSummary";
import {IEngineerService} from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import {DialogService} from "aurelia-dialog";
import {IJobSummaryFactory} from "../../../../../../app/hema/presentation/factories/interfaces/IJobSummaryFactory";

describe("the JobDetails module", () => {
    let jobDetails: JobDetails;
    let sandbox: Sinon.SinonSandbox;
    let jobServiceStub: IJobService;
    let jobSummaryFactoryStub: IJobSummaryFactory;
    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let routerStub: Router;
    let routerConfigurationStub: RouterConfiguration;
    let engineerServiceStub: IEngineerService;
    let history: BrowserHistory;
    let router: Router = new Router(new Container(), history);
    let routerConfiguration: RouterConfiguration = new RouterConfiguration();

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        jobServiceStub = <IJobService>{};
        jobServiceStub.getJobState = sandbox.stub().resolves({ value: 1});
        jobServiceStub.getDataStateSummary = sandbox.stub().resolves(new DataStateSummary(null));

        jobSummaryFactoryStub = <IJobSummaryFactory>{};
        jobSummaryFactoryStub.createJobSummaryViewModel = sandbox.stub().returns({});

        routerConfigurationStub = <RouterConfiguration>{};
        routerConfigurationStub.map = sandbox.stub();

        routerStub = <Router>{};
        routerStub.navigation = [];
        routerStub.navigateToRoute = sandbox.stub();
        routerStub.addRoute = sandbox.stub();
        routerStub.refreshNavigation = sandbox.stub();

        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);

        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sinon.stub().returns(Promise.resolve({}));

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.subscribe = sandbox.stub();
        dialogServiceStub = <DialogService>{};

        history = <BrowserHistory>{};

        jobDetails = new JobDetails(jobServiceStub, jobSummaryFactoryStub, engineerServiceStub, labelServiceStub, eventAggregatorStub, dialogServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(jobDetails).toBeDefined();
    });

    it("can call configureRouter", () => {
        let mapSpy = routerConfigurationStub.map = sandbox.spy();

        jobDetails.configureRouter(routerConfigurationStub, routerStub);

        expect(mapSpy.called).toBe(true);
   });

    describe("activateAsync", () => {
        beforeEach(() => {
            jobDetails.configureRouter(routerConfigurationStub, routerStub);
        });

        it("can call activateAsync and show view", (done) => {
            let job = <Job>{};
            job.id = "0";
            jobServiceStub.getJob = sandbox.stub().returns(Promise.resolve(job));

            let showContentSpy = sandbox.spy(jobDetails, "showContent");

            jobDetails.activateAsync({jobId: "0"}).then(() => {
                expect(jobDetails.job).toBe(job);
                expect(showContentSpy.called).toBe(true);
                done();
            });
        });

        it("can call activateAsync and show error when load job throws", (done) => {
            jobServiceStub.getJob = sandbox.stub().returns(Promise.reject(null));

            jobDetails.activateAsync({jobId: "0"})
                .then(() => {
                    fail("should not have succeeded");
                    done();
                })
                .catch(() => {
                    done();
                });
        });

        describe("updateRiskIndicators method", () => {
           let appliance = <Appliance> {
                isDeleted: false,
                safety: {
                        previousApplianceUnsafeDetail: {
                            applianceSafe: false,
                            noticeType: "AR"
                        }
                    }
            };

            let job = <Job> {
                    id: "1",
                    history:  { appliances: [appliance]}
            };

            it("appliance settings object in the router should have riskType = alert", done => {
                jobServiceStub.getJob = sandbox.stub().returns(Promise.resolve(job));
               
                jobDetails.configureRouter(routerConfiguration, router);
                routerConfiguration.exportToRouter(router);
                router.configure(routerConfiguration);
                
                jobDetails.activateAsync({jobId: "0"}).then(() => {
                     expect(jobDetails.router.navigation.find(n => n.config.name === "appliances").settings.riskType).toEqual("alert");
                     done();
                 });
            });

            it("appliance settings object in the router should have riskType = null", done => {
                job.history.appliances[0].safety.previousApplianceUnsafeDetail.applianceSafe = true;
                job.history.appliances[0].safety.previousApplianceUnsafeDetail.noticeType = undefined;
                jobServiceStub.getJob = sandbox.stub().returns(Promise.resolve(job));

                jobDetails.configureRouter(routerConfiguration, router);
                routerConfiguration.exportToRouter(router);
                router.configure(routerConfiguration);

                jobDetails.activateAsync({jobId: "0"}).then(() => {
                     expect(jobDetails.router.navigation.find(n => n.config.name === "appliances").settings.riskType).toEqual(null);
                     done();
                 });
            });
        });
    });
});
