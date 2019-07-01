/// <reference path="./../../../../../typings/app.d.ts" />

import {inject} from "aurelia-dependency-injection";
import {Router, RouterConfiguration, RouteConfig} from "aurelia-router";
import {IJobService} from "../../../business/services/interfaces/IJobService";
import {JobService} from "../../../business/services/jobService";
import {PropertySafetyType} from "../../../business/models/propertySafetyType";
import {LabelService} from "../../../business/services/labelService";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import { DataState } from "../../../business/models/dataState";
import {ICatalogService} from "../../../business/services/interfaces/ICatalogService";
import {IBusinessRuleService} from "../../../business/services/interfaces/IBusinessRuleService";
import {IValidationService} from "../../../business/services/interfaces/IValidationService";
import {CatalogService} from "../../../business/services/catalogService";
import {BusinessRuleService} from "../../../business/services/businessRuleService";
import {ValidationService} from "../../../business/services/validationService";
import {EditableViewModel} from "../../models/editableViewModel";
import {EngineerService} from "../../../business/services/engineerService";
import {IEngineerService} from "../../../business/services/interfaces/IEngineerService";
import {DialogService} from "aurelia-dialog";
import {JobServiceConstants} from "../../../business/services/constants/jobServiceConstants";
import {DataStateSummary} from "../../../business/models/dataStateSummary";
import {JobState} from "../../../business/models/jobState";
import {IPageService} from "../../services/interfaces/IPageService";
import {PageService} from "../../services/pageService";
import { ObjectHelper } from "../../../../common/core/objectHelper";

@inject(LabelService, JobService, EngineerService, EventAggregator, DialogService, ValidationService, BusinessRuleService, CatalogService, PageService)
export class PropertySafetyMain extends EditableViewModel {

    public jobId: string;
    public propertySafetyType: PropertySafetyType;
    public router: Router;
    public isFullScreen: boolean;

    private _childRoutes: RouteConfig[];
    private _jobDataStateSubscription: Subscription;
    private _jobState: JobState;
    private _pageService: IPageService;

    constructor(labelService: ILabelService,
                jobService: IJobService,
                engineerService: IEngineerService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                validationService: IValidationService,
                businessRuleService: IBusinessRuleService,
                catalogService: ICatalogService,
                pageService: IPageService) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService);
        this.isFullScreen = window.isFullScreen;
        this._pageService = pageService;
    }

    public configureRouter(config: RouterConfiguration, childRouter: Router): void {
        this.router = childRouter;
        this.setupChildRoutes();
        config.map(this._childRoutes);
    }

    public activateAsync(params: { jobId: string }): Promise<any> {
        return this.load()
                .then(() => this.showContent());
    }

    public deactivateAsync(): Promise<void> {
        if (this._jobDataStateSubscription) {
            this._jobDataStateSubscription.dispose();
            this._jobDataStateSubscription = null;
        }

        return Promise.resolve();
    }

    public navigateToRoute(name: string): void {
        this.router.navigateToRoute(name);
    }

    protected stateChanged(): Promise<void> {
        return super.stateChanged()
            .then(() => {
                this.router.navigateToRoute((!this.canEdit && this._jobState !== JobState.done) ? "previous-detail" : this.getRedirectRoute());
             });
    }

    protected loadModel(): Promise<void> {
        return this._jobService.getJob(this.jobId)
            .then(job => {
                this.propertySafetyType = job.propertySafetyType;
                this._jobState = job.state;
                this._jobDataStateSubscription = this._eventAggregator.subscribe(JobServiceConstants.JOB_DATA_STATE_CHANGED, () => this.updateDataState());
                this.updateDataState();
            });
    }

    private getRedirectRoute() : string {
        let landingPage = this._pageService.getLastVisitedPage(ObjectHelper.getClassName(this));
        if (!landingPage) {        
            switch (this.propertySafetyType) {
                case PropertySafetyType.gas:
                    return "current-detail-gas";
                case PropertySafetyType.electrical:
                    return "current-detail-electrical";
                default:
                    return "previous-detail";
            }
        }
        return landingPage;
    }

    private setupChildRoutes(): void {
        this._childRoutes = [];

        this._childRoutes.push({
            route: "current-detail-gas",
            moduleId: "hema/presentation/modules/propertySafety/gasSafetyDetail",
            name: "current-detail-gas",
            nav: true,
            title: "Property Safety Details",
            settings: {
                tabGroupParent: "property-safety",
                propertySafetyType: PropertySafetyType.gas,
                dataState: DataState.dontCare
            }
        });

        this._childRoutes.push({
            route: "current-detail-electrical",
            moduleId: "hema/presentation/modules/propertySafety/electricalSafetyDetail",
            name: "current-detail-electrical",
            nav: true,
            title: "Property Safety Details",
            settings: {
                tabGroupParent: "property-safety",
                propertySafetyType: PropertySafetyType.electrical,
                dataState: DataState.dontCare
            }
        });

        this._childRoutes.push({
            route: "",
            redirect: this.getRedirectRoute()
        });

        this._childRoutes.push({
            route: "previous-detail",
            moduleId: "hema/presentation/modules/propertySafety/previousSafetyDetail",
            name: "previous-detail",
            nav: true,
            title: "Previous Safety Detail",
            settings: {
                tabGroupParent: "property-safety",
                dataState: DataState.dontCare
            }
        });
    }

    private updateDataState(): void {
        let isActivitiesOverride = DataStateSummary.dataStateCompletionOverrideGroup === "activities";
        if (isActivitiesOverride) {
            this._childRoutes
                .filter(rt => !rt.redirect)
                .forEach(rt => rt.settings.dataState = DataState.dontCare);
        } else {

            this._jobService.getJob(this.jobId)
                .then((job) => {
                    if (job) {
                        if (this.propertySafetyType === PropertySafetyType.gas) {
                            let currentDetailRoute = this._childRoutes.find(r => r.route === "current-detail-gas");

                            currentDetailRoute.settings.dataState = job.propertySafety &&
                                job.propertySafety.propertyGasSafetyDetail ?
                                job.propertySafety.propertyGasSafetyDetail.dataState : DataState.dontCare;

                        } else if (this.propertySafetyType === PropertySafetyType.electrical) {
                            let currentDetailRoute = this._childRoutes.find(r => r.route === "current-detail-electrical");

                            currentDetailRoute.settings.dataState = job.propertySafety &&
                                job.propertySafety.propertyElectricalSafetyDetail ?
                                job.propertySafety.propertyElectricalSafetyDetail.dataState : DataState.dontCare;

                        }
                    }
                });
        }
    }
}
