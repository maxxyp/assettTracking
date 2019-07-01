import { inject } from "aurelia-dependency-injection";
import { RouteConfig, Router, RouterConfiguration, NavModel } from "aurelia-router";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { Job } from "../../../business/models/job";
import { BaseViewModel } from "../../models/baseViewModel";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { JobState } from "../../../business/models/jobState";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { DataStateSummary } from "../../../business/models/dataStateSummary";
import { DataState } from "../../../business/models/dataState";
import { DataStateTotals } from "../../../business/models/dataStateTotals";
import { EngineerService } from "../../../business/services/engineerService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { DialogService } from "aurelia-dialog";
import { EngineerServiceConstants } from "../../../business/services/constants/engineerServiceConstants";
import { JobServiceConstants } from "../../../business/services/constants/jobServiceConstants";
import { JobSummaryFactory } from "../../factories/jobSummaryFactory";
import { IJobSummaryFactory } from "../../factories/interfaces/IJobSummaryFactory";
import { JobSummaryViewModel } from "../../models/jobSummaryViewModel";
import { ChargeService } from "../../../business/services/charge/chargeService";
import { ChargeServiceConstants } from "../../../business/services/constants/chargeServiceConstants";

@inject(JobService, JobSummaryFactory, EngineerService, LabelService, EventAggregator, DialogService)
export class JobDetails extends BaseViewModel {
    public job: Job;
    public jobSummaryViewModel: JobSummaryViewModel;
    public router: Router;

    private _jobService: IJobService;
    private _jobSummaryFactory: IJobSummaryFactory;
    private _engineerService: IEngineerService;
    private _subscriptions: Subscription[];

    constructor(jobService: IJobService,
        jobSummaryFactory: IJobSummaryFactory,
        engineerService: IEngineerService,
        labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService) {
        super(labelService, eventAggregator, dialogService);
        this._jobService = jobService;
        this._jobSummaryFactory = jobSummaryFactory;
        this._engineerService = engineerService;
        this._subscriptions = [];
    }

    public configureRouter(config: RouterConfiguration, childRouter: Router): void {
        this.router = childRouter;
        config.map(this.getJobChildRoutes());
    }

    public activateAsync(params: { jobId: string }): Promise<void> {
        return this._jobService.getJob(params.jobId)
            .then(job => {
                this.job = job;
                this.jobSummaryViewModel = this._jobSummaryFactory.createJobSummaryViewModel(this.job);

                this._subscriptions.push(this._eventAggregator.subscribe(JobServiceConstants.JOB_STATE_CHANGED, () => this.updateDataState()));
                this._subscriptions.push(this._eventAggregator.subscribe(JobServiceConstants.JOB_DATA_STATE_CHANGED, () => this.updateDataState()));
                this._subscriptions.push(this._eventAggregator.subscribe(EngineerServiceConstants.ENGINEER_WORKING_CHANGED, () => this.updateDataState()));
                this._subscriptions.push(this._eventAggregator.subscribe(ChargeServiceConstants.CHARGE_UPDATE_COMPLETED,
                    () => ChargeService.showHideChargeRoute(job, this.router)
                ));

                this.updateRiskIndicators();

                // adding dynamic routes like this because in edge it doesnt work in line
                this.addDynamicRoutes();

                this.updateDataState();
            })
            .then(() => this.showContent());
    }

    public deactivateAsync(): Promise<void> {
        this._subscriptions.forEach(s => s.dispose());
        this._subscriptions = [];

        return Promise.resolve();
    }

    public navigateToJob(): void {

        const routeName = this.job.state === JobState.done ? "doneJob" : "job";

        this.router.navigateToRoute(routeName, { jobId: this.job.id });
    }

    public getJobChildRoutes(): RouteConfig[] {
        return [
            {
                route: "",
                redirect: "risks"
            },
            {
                route: "risks",
                moduleId: "hema/presentation/modules/risks/risks",
                name: "risks",
                nav: true,
                title: "Risks",
                settings: {}
            },
            {
                route: "property-safety",
                moduleId: "hema/presentation/modules/propertySafety/propertySafetyMain",
                name: "property-safety",
                nav: true,
                title: "Property Safety",
                settings: {}
            },
            {
                route: "risks/:riskId",
                moduleId: "hema/presentation/modules/risks/riskMain",
                name: "risk",
                nav: false,
                title: "Risk",
                settings: {
                    tabGroupParent: "risks",
                }
            },
            {
                route: "appliances",
                moduleId: "hema/presentation/modules/appliances/appliances",
                name: "appliances",
                nav: true,
                title: "Appliances",
                settings: {}
            },
            {
                route: "appliances/:applianceId",
                moduleId: "hema/presentation/modules/appliances/applianceMain",
                name: "appliance",
                nav: false,
                title: "Appliance",
                settings: { tabGroupParent: "appliances" }
            },
            {
                route: "activities",
                moduleId: "hema/presentation/modules/tasks/tasks",
                name: "activities",
                nav: true,
                title: "Activities",
                settings: {
                    canEditCancelledJob: true
                }
            },
            {
                route: "activities/:taskId",
                moduleId: "hema/presentation/modules/tasks/taskMain",
                name: "activity",
                nav: false,
                title: "Activity",
                settings: { tabGroupParent: "activities" }
            },
            {
                route: "task-appliance/:jobId",
                moduleId: "hema/presentation/modules/tasks/taskAppliance",
                name: "task-appliance",
                nav: false,
                title: "Activity Appliance",
                settings: {
                    tabGroupParent: "activities",
                    canEditCancelledJob: true
                }
            },
            {
                route: "parts",
                moduleId: "hema/presentation/modules/parts/partsMain",
                name: "parts",
                nav: true,
                title: "Parts",
                settings: {
                    tabGroupParent: "parts"
                }
            },
            {
                route: "charges",
                moduleId: "hema/presentation/modules/charges/charges",
                name: "charges",
                nav: true,
                title: "Charges",
                settings: {
                    visible: false
                }
            },
            {
                route: "appointment",
                name: "appointmentMain",
                moduleId: "hema/presentation/modules/appointment/appointmentBookingMain",
                nav: false,
                title: "Book an Appointment",
                settings: {}
            },
            {
                route: "landlord-certificate",
                moduleId: "hema/presentation/modules/landlord/certificate/landlordSafetyCertificate",
                name: "landlord-certificate",
                nav: true,
                title: "Certificate",
                settings: {}
            }
        ];
    }

    private addDynamicRoutes(): void {
        this.addPreviousJobsRoutes();
        ChargeService.showHideChargeRoute(this.job, this.router);
    }

    private addPreviousJobsRoutes(): void {
        let previousJobsRoutes: RouteConfig[] = [{
            route: "previous-jobs",
            moduleId: "hema/presentation/modules/previousJobs/previousJobs",
            name: "previous-jobs",
            nav: true,
            title: "Previous Activities",
            settings: {}
        },
        {
            route: "previous-jobs/:previousJobId",
            moduleId: "hema/presentation/modules/previousJobs/previousJobDetail",
            name: "previous-job",
            nav: false,
            title: "Previous Activities",
            settings: { tabGroupParent: "previous-jobs" }
        }];

        previousJobsRoutes.forEach(route => this.router.addRoute(route));
    }

    private updateDataState(): void {
        this._engineerService.isWorking()
            .then(isWorking => {
                if (isWorking) {
                    this.updateRiskIndicators();

                    this._jobService.getDataStateSummary(this.job.id)
                        .then((dataStateSummary) => {
                            if (dataStateSummary) {
                                this._jobService.getJobState(this.job.id).then((state) => {
                                    this.updateRouterState("activities", dataStateSummary, state.value);
                                    this.updateRouterState("property-safety", dataStateSummary, state.value);
                                    this.updateRouterState("risks", dataStateSummary, state.value);
                                    this.updateRouterState("appliances", dataStateSummary, state.value);
                                    this.updateRouterState("previous-jobs", dataStateSummary, state.value);
                                    this.updateRouterState("parts", dataStateSummary, state.value);
                                    this.updateRouterState("charges", dataStateSummary, state.value);
                                    // special case: we take certificate dataState as the combination of
                                    //  propertySafety and appliances
                                    this.updateCertificateState(dataStateSummary, state.value);
                                });
                            }
                        });
                }
            });
    }

    private updateRouterState(configName: string, dataStateSummary: DataStateSummary, jobState: JobState): void {
        let navModel: NavModel = this.router.navigation.find(n => n.config.name === configName);
        if (navModel) {
            let dataState = this.getRouteState(configName, dataStateSummary, jobState);
            let cssClass = this.getCssClassFromState(dataState);
            navModel.settings.stateClass = cssClass;
        }
    }

    private updateCertificateState(dataStateSummary: DataStateSummary, jobState: JobState): void {
        let navModel: NavModel = this.router.navigation.find(n => n.config.name === "landlord-certificate");
        if (navModel) {
            navModel.settings.visible = this.job.isLandlordJob;
            let propertySafetyDataState = this.getRouteState("property-safety", dataStateSummary, jobState);
            let appliancesDataState = this.getRouteState("appliances", dataStateSummary, jobState);

            let dataState = this.getWorstCaseDataState(propertySafetyDataState, appliancesDataState);
            let cssClass = this.getCssClassFromState(dataState);
            navModel.settings.stateClass = cssClass;
        }
    }

    private updateRiskIndicators(): void {
        if (this.job) {
            let propertySafetyNav = this.router.navigation.find(n => n.config.name === "property-safety");
            if (this.job.propertySafety && this.job.propertySafety.previousPropertySafetyDetail) {
                propertySafetyNav.settings.riskType = "critical";
            }

            let risksNav = this.router.navigation.find(n => n.config.name === "risks");
            if (risksNav) {
                let existsHazardAndRisk = Job.hasHazardAndRisk(this.job);
                risksNav.settings.riskType = existsHazardAndRisk.hasHazard ? "critical" : existsHazardAndRisk.hasRisk ? "alert" : null;
            }

            let appliancesNav = this.router.navigation.find(n => n.config.name === "appliances");
            if (appliancesNav) {
                let hasUnSafe = this.job.history.appliances
                                && this.job.history.appliances.some(a => !a.isDeleted
                                                                            && !a.isExcluded
                                                                            && a.safety
                                                                            && a.safety.previousApplianceUnsafeDetail
                                                                            && a.safety.previousApplianceUnsafeDetail.noticeType !== undefined);
                appliancesNav.settings.riskType = hasUnSafe ? "alert" : null;
            }
        }
    }

    private getRouteState(configName: string, dataStateSummary: DataStateSummary, jobState: JobState): DataState {
        if (jobState === JobState.arrived) {
            let dataStateTotals: DataStateTotals = dataStateSummary.getTotals(configName);

            if (dataStateTotals) {
                if (dataStateTotals.invalid > 0) {
                    return DataState.invalid;
                } else if (dataStateTotals.notVisited > 0) {
                    return DataState.notVisited;
                } else if (dataStateTotals.dontCare > 0 && dataStateTotals.valid === 0) {
                    return DataState.dontCare;
                } else {
                    return DataState.valid;
                }
            } else {
                return DataState.dontCare;
            }
        } else {
            return DataState.dontCare;
        }
    }

    private getCssClassFromState(dataState: DataState): string {
        switch (dataState) {
            case DataState.valid:
                return "state-valid";
            case DataState.notVisited:
                return "state-not-visited";
            case DataState.invalid:
                return "state-invalid";
            case DataState.dontCare:
                return "state-dont-care";
            default:
                return "state-none";
        }
    }

    private getWorstCaseDataState(...dataStates: DataState[]): DataState {
        if (dataStates.some(state => state === DataState.invalid)) {
            return DataState.invalid;
        }
        if (dataStates.some(state => state === DataState.notVisited)) {
            return DataState.notVisited;
        }
        if (dataStates.some(state => state === DataState.valid)) {
            return DataState.valid;
        }
        return DataState.dontCare;
    }
}
