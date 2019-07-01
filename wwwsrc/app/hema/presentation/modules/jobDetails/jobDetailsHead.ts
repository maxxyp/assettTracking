import { IIaciCode } from "../../../business/models/reference/IIaciCode";
import { inject } from "aurelia-dependency-injection";
import { Router } from "aurelia-router";
import {DOM} from "aurelia-pal";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { Job } from "../../../business/models/job";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import * as moment from "moment";
import {Threading} from "../../../../common/core/threading";
import {JobSummaryViewModel} from "../../models/jobSummaryViewModel";
import {BaseViewModel} from "../../models/baseViewModel";
import {LabelService} from "../../../business/services/labelService";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {JobState} from "../../../business/models/jobState";
import {Notice} from "../notice/notice";
import {DialogService} from "aurelia-dialog";
import {JobServiceConstants} from "../../../business/services/constants/jobServiceConstants";
import {LandlordDetail} from "../landlord/landlordDetail";
import {IConfigurationService} from "../../../../common/core/services/IConfigurationService";
import {ConfigurationService} from "../../../../common/core/services/configurationService";
import {IToastItem} from "../../../../common/ui/elements/models/IToastItem";
import {Guid} from "../../../../common/core/guid";
import {AppConstants} from "../../../../appConstants";
import {Appliance} from "../../../business/models/appliance";
import {CatalogService} from "../../../business/services/catalogService";
import {ICatalogService} from "../../../business/services/interfaces/ICatalogService";
import {IBridgeBusinessService} from "../../../business/services/interfaces/IBridgeBusinessService";
import {BridgeBusinessService} from "../../../business/services/bridgeBusinessService";
import { ICustomerInfoService } from "../../../business/services/interfaces/ICustomerInfoService";
import { CustomerInfoService } from "../../../business/services/customerInfoService";
import { ITrainingModeConfiguration } from "../../../business/services/interfaces/ITrainingModeConfiguration";

@inject(LabelService, JobService, EventAggregator, DialogService,
    Router, ConfigurationService, CatalogService, BridgeBusinessService, CustomerInfoService)
export class JobDetailsHead extends BaseViewModel {
    public viewModel: JobSummaryViewModel;
    public landlordDialogOpen: boolean;

    public clickable: boolean;

    public timeToJobAddressText: string;
    public timeToJobAddress: number;

    public startTime: Date;
    public elapsedTime: number;
    public isActiveJob: boolean;
    public jobState: string;
    public isDone: boolean;
    public trainingMode: boolean;
    public safetyStatusCssClass: "alert" | "critical";

    public job: Job;
    private _jobService: IJobService;
    private _subscriptions: Subscription[];
    private _timerId: number;
    private _router: Router;
    private _configurationService: IConfigurationService;
    private _iaciCodes: IIaciCode[];
    private _catalogService: ICatalogService;
    private _adaptBusinessService: IBridgeBusinessService;
    private _customerInfoService: ICustomerInfoService;

    constructor(labelService: ILabelService,
        jobService: IJobService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        router: Router,
        configurationService: IConfigurationService,
        catalogService: ICatalogService,
        adaptBusinessService: IBridgeBusinessService,
        customerInfoService: ICustomerInfoService) {

        super(labelService, eventAggregator, dialogService);

        this._jobService = jobService;
        this._dialogService = dialogService;
        this._router = router;
        this._configurationService = configurationService;
        this._adaptBusinessService = adaptBusinessService;
        this._customerInfoService = customerInfoService;

        this.startTime = null;
        this.elapsedTime = -1;
        this._timerId = -1;
        this.isActiveJob = false;
        this.isDone = false;
        this.trainingMode = false;

        this.landlordDialogOpen = false;
        this._catalogService = catalogService;
        this._subscriptions = [];
    }

    public attachedAsync(): Promise<void> {
        this._subscriptions.push(this._eventAggregator.subscribe(JobServiceConstants.JOB_STATE_CHANGED, () => {
            this.updateState();
            this.showNotices();
            this.showChirpCodeWarning();
        }));
        this._subscriptions.push(this._eventAggregator.subscribe(JobServiceConstants.JOB_DATA_STATE_CHANGED, () => this.updateRiskIndicator()));

        this._timerId = Threading.startTimer(() => this.updateState(), 10 * 1000);
        if (this.viewModel) {
            this.viewModel.viewCount++;
        }
        this.trainingMode = !!this._configurationService
            .getConfiguration<ITrainingModeConfiguration>()
            .trainingMode;
        return Promise.resolve();
    }

    public detachedAsync(): Promise<void> {
        if (this._timerId !== -1) {
            Threading.stopTimer(this._timerId);
            this._timerId = -1;
        }
        this._subscriptions.forEach(subscription => subscription.dispose());
        this._subscriptions = null;

        return Promise.resolve();
    }

    public activateAsync(params: { clickable: boolean, job: Job, jobSummary: JobSummaryViewModel }): Promise<void> {
        if (params.jobSummary) {
            this.job = params.job;
            this.viewModel = params.jobSummary;
            this.clickable = params.clickable;
            this.updateState();
            this.updateRiskIndicator();
        }

        return this._catalogService.getIaciCode().then((iaciCodes) => {
            this._iaciCodes = iaciCodes;
        });
    }

    public headerClicked(): void {
        if (this.clickable) {
            const routeName = this.job.state === JobState.done ? "doneJob" : "job";
            this._router.navigateToRoute(routeName, { jobId: this.viewModel.jobNumber });
        }
    }

    public navigateToAppointmentBooking(event: Event): void {
        this._router.navigate("/customers/to-do/" + this.job.id + "/appointment/book-an-appointment");
        this.dispatchClickEvent(event);
    }

    public showRisks(jobId: string, event: Event): void {
        this._dialogService.open({ viewModel: Notice, model: { jobId: jobId } });
        this.dispatchClickEvent(event);
    }

    public showLandlordDetails(jobId: string, event: Event): void {
        this._dialogService.open({ viewModel: LandlordDetail, model: { jobId: jobId } });
        this.dispatchClickEvent(event);
    }

    public launchCustomerInfo(event: Event): void {
        this._customerInfoService.openApp(this.job.premises.id);
        this.dispatchClickEvent(event);
    }

    public exportCustomerDetails(event: Event, jobId: string): Promise<string> {
        this.dispatchClickEvent(event);

        return this._adaptBusinessService.exportCustomerDetails(jobId, false).then(
            () => {
                return this.showInfo("Exported data", "Successfully exported customer details");
            });
    }

    private showNotices(): void {
        this._jobService.getJob(this.viewModel.jobNumber)
            .then((job) => {
                if (job.state === JobState.enRoute && job.risks && job.risks.length > 0) {
                    this.showRisks(this.viewModel.jobNumber, null);
                }
            });
    }

    private updateState(): void {

        if (this.job) {
            this.jobState = JobState[this.job.state];
            this.isActiveJob = this.job.state === JobState.arrived;
            this.isDone = this.job.state === JobState.done;

            if (this.isActiveJob) {
                this.startTime = this.job.onsiteTime;
                let endTime = this.job.completionTime;

                if (this.startTime) {
                    if (endTime) {
                        this.elapsedTime = moment(endTime).diff(moment(this.startTime), "minutes");
                    } else {
                        this.elapsedTime = moment(new Date()).diff(moment(this.startTime), "minutes");
                    }
                    if (this.elapsedTime < 5) {
                        this.elapsedTime = 0;
                    } else {
                        this.elapsedTime = Math.ceil(Math.max(this.elapsedTime, 1) / 5) * 5;
                    }
                } else {
                    this.startTime = null;
                    this.elapsedTime = -1;
                }
            } else {
                this.startTime = null;
                this.elapsedTime = -1;
            }
        }

    }

    private updateRiskIndicator(): void {
        if (this.job) {
            let hasHazardAndRisk = Job.hasHazardAndRisk(this.job);
            this.safetyStatusCssClass = hasHazardAndRisk.hasHazard
                                        ? "critical"
                                        : hasHazardAndRisk.hasRisk
                                            ? "alert"
                                            : null;
        }
    }

    private showChirpCodeWarning(): void {
        if (this.job) {
            this.jobState = JobState[this.job.state];
            if (this.job.state === JobState.arrived) {
                let chirpCodes = this.previousChirpCode();
                if (chirpCodes) {
                    chirpCodes.forEach(code => {
                        if (code) {
                            let iaciDescription = this._iaciCodes.find(x => x.iaciCode === code.code);
                            if (iaciDescription) {
                                let toastItem: IToastItem = {
                                    id: Guid.newGuid(),
                                    title: this.getLabel("previousChirpCodeWarningTitle"),
                                    content: this.getParameterisedLabel("previousChirpCodeWarning",
                                        [iaciDescription.iaciDescription, code.applinace.applianceType, code.applinace.locationDescription]),
                                    style: "warning",
                                    dismissTime: 0
                                };

                                this._eventAggregator.publish(AppConstants.APP_TOAST_ADDED, toastItem);
                            }
                        }
                    });
                }
            }
        }
    }

    private previousChirpCode(): { code: string, applinace: Appliance }[] {
        let codes: any = [];
        if (this.job && this.job.history && this.job.history.appliances) {
            this.job.history.appliances.forEach(appliance => {
                if (appliance && appliance.preVisitChirpCode) {
                    codes.push({ code: appliance.preVisitChirpCode.code, applinace: appliance });
                }
            });
        }
        return codes;
    }

    private dispatchClickEvent(event: Event): void {
        if (event !== null) {
            event.stopPropagation();
            DOM.dispatchEvent(new Event("click"));
        }
    }
}
