/// <reference path="./../../../../../typings/app.d.ts" />

import { inject } from "aurelia-dependency-injection";
import { Router, RouterConfiguration, RouteConfig, NavigationInstruction } from "aurelia-router";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";

import { LabelService } from "../../../business/services/labelService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { IApplianceService } from "../../../business/services/interfaces/IApplianceService";
import { ApplianceService } from "../../../business/services/applianceService";
import { Appliance } from "../../../business/models/appliance";
import { DataState } from "../../../business/models/dataState";
import { EditableViewModel } from "../../models/editableViewModel";
import { CatalogService } from "../../../business/services/catalogService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { ValidationService } from "../../../business/services/validationService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { EngineerService } from "../../../business/services/engineerService";
import { Guid } from "../../../../common/core/guid";
import { DialogService } from "aurelia-dialog";
import { JobServiceConstants } from "../../../business/services/constants/jobServiceConstants";
import { DataStateSummary } from "../../../business/models/dataStateSummary";
import { ApplianceDetailsConstants } from "../../constants/applianceDetailsConstants";
import { AnimationService } from "../../../../common/ui/services/animationService";
import { IAnimationService } from "../../../../common/ui/services/IAnimationService";
import { IAppLauncher } from "../../../../common/core/services/IAppLauncher";
import { IConfigurationService } from "../../../../common/core/services/IConfigurationService";
import { AppLauncher } from "../../../../common/core/services/appLauncher";
import { ConfigurationService } from "../../../../common/core/services/configurationService";
import { IHemaConfiguration } from "../../../IHemaConfiguration";
import { observable } from "aurelia-binding";
import {ApplianceSafetyType} from "../../../business/models/applianceSafetyType";
import {IPageService} from "../../services/interfaces/IPageService";
import {PageService} from "../../services/pageService";
import { ObjectHelper } from "../../../../common/core/objectHelper";

@inject(LabelService, JobService, EngineerService, EventAggregator, DialogService, ValidationService, BusinessRuleService, CatalogService,
    ApplianceService, AnimationService, AppLauncher, ConfigurationService, PageService)
export class ApplianceMain extends EditableViewModel {

    public router: Router;
    public applianceIds: string[];
    public title: string;
    public isNew: boolean;

    public appliance: Appliance;
    public card: HTMLElement;
    public applianceType: string;

    public description: string;
    public gcCode: string;
    @observable()
    public applianceSafetyType: ApplianceSafetyType;
    @observable()
    public isInstPremAppliance: boolean;
    public isFullScreen : boolean;

    private _childRoutes: RouteConfig[];

    private _applianceId: string;
    private _applianceService: IApplianceService;
    private _jobDataStateSubscription: Subscription;
    private _applianceDetailsSubscription: Subscription;

    private _itemPosition: number;
    private _animationService: IAnimationService;
    private _appLauncher: IAppLauncher;
    private _configurationService: IConfigurationService;
    private _pageService: IPageService;
    private _landingPage: string;

    constructor(labelService: ILabelService,
        jobService: IJobService,
        engineerService: IEngineerService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRuleService: IBusinessRuleService,
        catalogService: ICatalogService,
        applianceService: IApplianceService,
        animationService: IAnimationService,
        appLauncher: IAppLauncher,
        configurationService: IConfigurationService,
        pageService: IPageService) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService);
        this._applianceService = applianceService;
        this._animationService = animationService;
        this._appLauncher = appLauncher;
        this._configurationService = configurationService;
        this.isFullScreen = window.isFullScreen;    
        this._pageService = pageService;           
    }

    public configureRouter(config: RouterConfiguration, childRouter: Router, ...args: any[]): void {
        this.router = childRouter;
        this._landingPage = (args && 
                                args.length >= 3 && 
                                args[2] instanceof NavigationInstruction && 
                                (<NavigationInstruction> args[2]).params && 
                                (<NavigationInstruction> args[2]).params.applianceId) ? 
                                    this._pageService.getLastVisitedPage(ObjectHelper.getClassName(this), (<NavigationInstruction> args[2]).params.applianceId) || "appliance-details" :
                                    "appliance-details";
        this.setupChildRoutes();
        config.map(this._childRoutes);
    }

    public activateAsync(params: { jobId: string, applianceId: string }): Promise<any> {
        this._applianceId = params.applianceId;
        this.isNew = this._applianceId === Guid.empty;

        return this.loadBusinessRules()
            .then(() => this.load());
    }

    public deactivateAsync(): Promise<void> {
        if (this._jobDataStateSubscription) {
            this._jobDataStateSubscription.dispose();
            this._jobDataStateSubscription = null;
        }

        if (this._applianceDetailsSubscription) {
            this._applianceDetailsSubscription.dispose();
            this._applianceDetailsSubscription = null;
        }

        return Promise.resolve();
    }

    public navigateToRoute(name: string): void {
        this.router.navigateToRoute(name);
    }

    public swipeFunction(swipeDirection: string): void {
        if (this._itemPosition !== -1) {
            if (swipeDirection === "left") {
                this._animationService.swipe(this.card, this.applianceIds, this._itemPosition, swipeDirection, "slide-in-right", "slide-out-left", 300).then((position) => {
                    this.router.parent.navigate(this.router.parent.currentInstruction.fragment.replace(this.applianceIds[this._itemPosition], this.applianceIds[position]));
                    this._itemPosition = position;
                })
                    .catch();
            } else {
                this._animationService.swipe(this.card, this.applianceIds, this._itemPosition, swipeDirection, "slide-in-left", "slide-out-right", 300).then((position) => {
                    this.router.parent.navigate(this.router.parent.currentInstruction.fragment.replace(this.applianceIds[this._itemPosition], this.applianceIds[position]));
                    this._itemPosition = position;
                })
                    .catch();
            }
        }
    }

    public launchAdapt(gcCode: string): void {
        this._appLauncher.launchApplication(this._configurationService.getConfiguration<IHemaConfiguration>().adaptLaunchUri + " " + gcCode);
    }

    protected stateChanged(): Promise<void> {
        return super.stateChanged()
            .then(() => {                    
                if (!this.canEdit) {
                    this.router.navigateToRoute("appliance-details");
                } 
            });
    }

   protected loadModel(): Promise<void> {
         return this._applianceService.getAppliances(this.jobId)
            .then((appliances) => {
                this.applianceIds = appliances.map(a => a.id);
                this.appliance = appliances.find(a => a.id === this._applianceId);

                if (this.isNew) {
                    this.description = "";
                    this._itemPosition = -1;
                } else {
                    this.applianceSafetyType = this.appliance.applianceSafetyType;
                    this.isInstPremAppliance = this.appliance.isInstPremAppliance;
                    this.applianceType = this.appliance.applianceType;
                    this.updateApplianceDetails(this.appliance.description, this.appliance.gcCode);
                    this._itemPosition = this.applianceIds.indexOf(this.appliance.id);
                }
                this._applianceDetailsSubscription = this._eventAggregator.subscribe(ApplianceDetailsConstants.DETAILS_CHANGED,
                    (arg: { description: string, gccode: string }) => this.updateApplianceDetails(arg.description, arg.gccode));

                this._jobDataStateSubscription = this._eventAggregator.subscribe(JobServiceConstants.JOB_DATA_STATE_CHANGED, () => this.updateDataState());
                this.updateDataState();
                this.showContent();
                this.scrollToTop();
            });
     }

    private updateApplianceDetails(description: string, gccode: string): Promise<void> {
        return this._applianceService.isFullGcCode(gccode)
            .then(isFullGcCode => {
                this.gcCode = isFullGcCode ? gccode : "";
                this.description = description;
            });
    }

    private setupChildRoutes(): void {

        this._childRoutes = [
            {
                route: "",
                redirect: this._landingPage
            },
            {
                route: "appliance-details",
                moduleId: "hema/presentation/modules/appliances/applianceDetails",
                name: "appliance-details",
                nav: true,
                title: "Appliance Details",
                settings: {
                    tabGroupParent: "appliances",
                    dataState: DataState.valid,
                    alwaysShow: true,
                    hideIfInstPrem: false
                }
            },
            {
                route: "reading",
                moduleId: "hema/presentation/modules/appliances/applianceReading",
                name: "reading",
                nav: true,
                title: "Appliance Reading",
                settings: {
                    dataState: DataState.dontCare,
                    applianceSafetyType: ApplianceSafetyType.gas,
                    hideIfInstPrem: true
                }
            },
            {
                route: "gas-safety",
                moduleId: "hema/presentation/modules/appliances/gasSafety",
                name: "gas-safety",
                nav: true,
                title: "Gas Safety",
                settings: {
                    dataState: DataState.dontCare,
                    applianceSafetyType: ApplianceSafetyType.gas,
                    hideIfInstPrem: true
                }
            },
            {
                route: "previous-gas-safety",
                moduleId: "hema/presentation/modules/appliances/prevGasSafety",
                name: "previous-gas-safety",
                nav: true,
                title: "Previous Unsafe Situation",
                settings: {
                    dataState: DataState.dontCare,
                    applianceSafetyType: ApplianceSafetyType.gas,
                    alwaysShow: true,
                    hideIfInstPrem: true
                }
            },
            {
                route: "electrical-safety",
                moduleId: "hema/presentation/modules/appliances/electricalSafety",
                name: "electrical-safety",
                nav: true,
                title: "Electrical Safety",
                settings: {
                    dataState: DataState.valid,
                    applianceSafetyType: ApplianceSafetyType.electrical,
                    hideIfInstPrem: true
                }
            },
            {
                route: "previous-electrical-unsafe-detail",
                moduleId: "hema/presentation/modules/appliances/previousElectricalUnsafeDetail",
                name: "previous-electrical-unsafe-detail",
                nav: true,
                title: "Previous Electrical Unsafe Detail",
                settings: {
                    dataState: DataState.dontCare,
                    applianceSafetyType: ApplianceSafetyType.electrical,
                    alwaysShow: true,
                    hideIfInstPrem: true
                }
            },
            {
                route: "other-safety",
                moduleId: "hema/presentation/modules/appliances/otherSafety",
                name: "other-safety",
                nav: true,
                title: "Other Safety",
                settings: {
                    dataState: DataState.dontCare,
                    applianceSafetyType: ApplianceSafetyType.other,
                    hideIfInstPrem: true
                }
            },
            {
                route: "previous-other-safety",
                moduleId: "hema/presentation/modules/appliances/prevOtherSafety",
                name: "previous-other-safety",
                nav: true,
                title: "Previous Unsafe Situation",
                settings: {
                    dataState: DataState.dontCare,
                    applianceSafetyType: ApplianceSafetyType.other,
                    alwaysShow: true,
                    hideIfInstPrem: true
                }
            }
        ];
    }

    private updateDataState(): Promise<void> {
        if (this.isNew) {
            return null;
        }

        let isDataStateOverridden = DataStateSummary.dataStateCompletionOverrideGroup !== undefined;
        if (isDataStateOverridden) {
            this.router.routes
                .filter(rt => !rt.redirect)
                .forEach(rt => rt.settings.dataState = DataState.dontCare);
            return null;
        }

        return this._applianceService.getAppliance(this.jobId, this._applianceId)
            .then(appliance => {
                let applianceRoute = this.router.routes.find(r => r.route === "appliance-details");
                applianceRoute.settings.dataState = appliance.dataState;

                if (this.appliance.applianceSafetyType === ApplianceSafetyType.electrical) {
                    let electricalApplianceSafetyRoute = this.router.routes.find(r => r.route === "electrical-safety");
                    electricalApplianceSafetyRoute.settings.dataState = appliance.safety.applianceElectricalSafetyDetail.dataState;

                } else if (this.appliance.applianceSafetyType === ApplianceSafetyType.gas) {
                    let readingRoute = this.router.routes.find(r => r.route === "reading");
                    readingRoute.settings.dataState = appliance.safety.applianceGasReadingsMaster.dataState;

                    let gasSafetyRoute = this.router.routes.find(r => r.route === "gas-safety");
                    gasSafetyRoute.settings.dataState = appliance.safety.applianceGasSafety.dataState;

                } else if (this.appliance.applianceSafetyType === ApplianceSafetyType.other) {
                    let otherApplianceSafetyRoute = this.router.routes.find(r => r.route === "other-safety");
                    otherApplianceSafetyRoute.settings.dataState = appliance.safety.applianceOtherSafety.dataState;
                }
            });
    }    
}
