import { Router } from "aurelia-router";
import { inject } from "aurelia-dependency-injection";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { NavModel } from "aurelia-router";
import { observable } from "aurelia-binding";
import { HelpOverlayService } from "../../../../common/ui/services/helpOverlayService/helpOverlayService";
import { IHelpOverlayService } from "../../../../common/ui/services/helpOverlayService/interfaces/IHelpOverlayService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { EngineerService } from "../../../business/services/engineerService";
import { PlatformHelper } from "../../../../common/core/platformHelper";

@inject(Router, EventAggregator, HelpOverlayService, EngineerService, PlatformHelper)
export class IconNavBar {
    public router: Router;
    @observable
    public navTitle: string;
    public consumablePartsCount: number;
    public helpOverlayService: IHelpOverlayService;
    public isAdmin: boolean;
    public platform: string;
    public workListRequestInProgess: boolean;
    public appVersion: string;
    public buildType: string;

    private _eventAggregator: EventAggregator;
    private _routeChangeSubscription: Subscription;

    constructor(router: Router, eventAggregator: EventAggregator, helpOverlayService: IHelpOverlayService, engineerService: IEngineerService) {
        this.router = router;
        this._eventAggregator = eventAggregator;
        this._routeChangeSubscription = this._eventAggregator.subscribe("router:navigation:complete", () => this.handleRouteChanged());
        this.helpOverlayService = helpOverlayService;
        engineerService.getCurrentEngineer()
            .then((engineer) => {
                if (engineer && engineer.roles && engineer.roles.indexOf("SR-Field-Admin")) {
                    this.isAdmin = true;
                } else {
                    this.isAdmin = false;
                }
            });
        this.platform = PlatformHelper.getPlatform();
        this.appVersion = PlatformHelper.appVersion;
        this.buildType = PlatformHelper.buildType;
    }

    public attached(): void {
        this.handleRouteChanged();
    }

    public detached(): void {
        if (this._routeChangeSubscription) {
            this._routeChangeSubscription.dispose();
        }
    }

    public navigateTo(navModel: NavModel): void {
        let settings: { defaultParam: any } = <{ defaultParam: any }>navModel.settings;
        this.router.navigateToRoute(navModel.config.name, settings && settings.defaultParam
            ? settings.defaultParam : undefined);
    }

    private handleRouteChanged(): void {
        if (this.router && this.router.currentInstruction && this.router.currentInstruction.fragment) {
            let route = this.router.currentInstruction.fragment.replace("/", "");
            this.router.navigation.forEach(row => {
                if ((row.config.redirect && route.lastIndexOf(row.config.redirect, 0) === 0) || route.lastIndexOf(<string>row.config.route, 0) === 0) {
                    this.navTitle = row.title;
                }
            });
        }
    }
}
