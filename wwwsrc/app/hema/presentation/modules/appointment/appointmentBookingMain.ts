import {inject} from "aurelia-dependency-injection";
import {RouterConfiguration, Router, RouteConfig} from "aurelia-router";
import {JobService} from "../../../business/services/jobService";
import {IJobService} from "../../../business/services/interfaces/IJobService";
import {LabelService} from "../../../business/services/labelService";
import {BaseViewModel} from "../../models/baseViewModel";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {Job as JobBusinessModel} from "../../../business/models/job";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {JobSummaryViewModel} from "../../models/jobSummaryViewModel";
import {JobSummaryFactory} from "../../factories/jobSummaryFactory";
import {IJobSummaryFactory} from "../../factories/interfaces/IJobSummaryFactory";

@inject(LabelService, EventAggregator, DialogService, JobService, JobSummaryFactory)
export class AppointmentBookingMain extends BaseViewModel {

    public childRoutes: RouteConfig[];

    public jobSummaryViewModel: JobSummaryViewModel;
    public job: JobBusinessModel;

    private _jobSummaryFactory: IJobSummaryFactory;
    private _jobService: IJobService;

    constructor(labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                jobService: IJobService,
                jobSummaryFactory: IJobSummaryFactory) {
        super(labelService, eventAggregator, dialogService);

        this._jobService = jobService;
        this._jobSummaryFactory = jobSummaryFactory;
        this.childRoutes = this.getAppointmentBookingChildRoute();
    }

    public configureRouter(config: RouterConfiguration, childRouter: Router): void {
        config.map(this.childRoutes);
    }

    public activateAsync(params: {jobId: string, addressId: string}): Promise<void> {
        return this._jobService.getJob(params.jobId).then(job => {
            this.job = job;
            this.jobSummaryViewModel = this._jobSummaryFactory.createJobSummaryViewModel(this.job);
            this.showContent();
        });
    }

    public getAppointmentBookingChildRoute(): RouteConfig[] {
        return [
            {
                route: "",
                redirect: "book-an-appointment"
            },
            {
                route: "book-an-appointment",
                moduleId: "hema/presentation/modules/appointment/appointmentBooking",
                name: "book-an-appointment",
                nav: false,
                title: "Book an Appointment",
                settings: {
                    canEditCancelledJob: true
                }
            }
        ];
    }
}
