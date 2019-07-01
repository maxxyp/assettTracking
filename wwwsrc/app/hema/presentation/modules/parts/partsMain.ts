/// <reference path="./../../../../../typings/app.d.ts" />

import {inject} from "aurelia-dependency-injection";
import {Router, RouterConfiguration, RouteConfig} from "aurelia-router";
import {IJobService} from "../../../business/services/interfaces/IJobService";
import {JobService} from "../../../business/services/jobService";
import {LabelService} from "../../../business/services/labelService";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {DataState} from "../../../business/models/dataState";
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
import {IPageService} from "../../services/interfaces/IPageService";
import {PageService} from "../../services/pageService";
import { ObjectHelper } from "../../../../common/core/objectHelper";

@inject(LabelService, JobService, EngineerService, EventAggregator, DialogService, ValidationService, BusinessRuleService, CatalogService, PageService)
export class PartsMain extends EditableViewModel {
    public router: Router;
    public isFullScreen: boolean;

    private _childRoutes: RouteConfig[];
    private _jobDataStateSubscription: Subscription;
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
                if (!this.canEdit) {                    
                    this.router.navigateToRoute("previously-fitted-parts");
                }

                this._childRoutes.find(config => config.name === "consumables-favourites").settings.alwaysShow = this.canEdit;
            });
    }

    protected loadModel(): Promise<void> {
                this._jobDataStateSubscription = this._eventAggregator.subscribe(JobServiceConstants.JOB_DATA_STATE_CHANGED, () => this.updateDataState());
        this.updateDataState();
        return Promise.resolve();
    }

    private getRedirectRoute(): string {
        let landingPage = this._pageService.getLastVisitedPage(ObjectHelper.getClassName(this));
        return landingPage || "todays-parts";
    }

    private setupChildRoutes(): void {
        this._childRoutes = [{
            route: "",
            redirect: this.getRedirectRoute()
        }];

        this._childRoutes.push({
            route: "todays-parts",
            moduleId: "hema/presentation/modules/parts/todaysParts",
            name: "todays-parts",
            nav: true,
            title: "Today's Parts",
            settings: {
                tabGroupParent: "parts",
                dataState: DataState.dontCare,
                alwaysShow: true
            }
        });
        this._childRoutes.push({
            route: "parts-basket",
            moduleId: "hema/presentation/modules/parts/partsBasket",
            name: "parts-basket",
            nav: true,
            title: "Parts Basket",
            settings: {
                tabGroupParent: "parts",
                dataState: DataState.dontCare,
                alwaysShow: true
            }
        });
        this._childRoutes.push({
            route: "previously-fitted-parts",
            moduleId: "hema/presentation/modules/parts/previouslyFittedParts",
            name: "previously-fitted-parts",
            nav: true,
            title: "Previously Fitted Parts",
            settings: {
                tabGroupParent: "parts",
                dataState: DataState.dontCare,
                alwaysShow: true
            }
        });
        this._childRoutes.push({
            route: "consumables-favourites",
            moduleId: "hema/presentation/modules/parts/consumablesFavourites",
            name: "consumables-favourites",
            nav: true,
            title: "Favourites",
            settings: {
                dataState: DataState.dontCare,
                alwaysShow: this.canEdit
            }
        });
    }

    private updateDataState(): void {
        let isActivitiesOverride = DataStateSummary.dataStateCompletionOverrideGroup === "activities";
        let partsBasketRoute = this._childRoutes.find(r => r.route === "parts-basket");
        let todaysPartsRoute = this._childRoutes.find(r => r.route === "todays-parts");

        if (isActivitiesOverride) {
            partsBasketRoute.settings.dataState = DataState.dontCare;
            todaysPartsRoute.settings.dataState = DataState.dontCare;
        } else {
             this._jobService.getJob(this.jobId)
                .then((job) => {
                    if (job) {
                        partsBasketRoute.settings.dataState = job.partsDetail && job.partsDetail.partsBasket
                            ? job.partsDetail.partsBasket.dataState
                            : DataState.dontCare;

                        todaysPartsRoute.settings.dataState = job.partsDetail && job.partsDetail.partsToday
                            ? job.partsDetail.partsToday.dataState
                            : DataState.dontCare;
                    }
                });
        }
    }
}
