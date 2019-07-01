import {inject} from "aurelia-dependency-injection";
import {customElement} from "aurelia-templating";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {Router} from "aurelia-router";
import {App} from "../../../../app";
import {ConfigurationService} from "../../../../common/core/services/configurationService";
import {IConfigurationService} from "../../../../common/core/services/IConfigurationService";
import { IHemaConfiguration } from "../../../IHemaConfiguration";

@customElement("nav-bar")
@inject(Router, EventAggregator, ConfigurationService)
export class NavBar {
    public showSearch: boolean;
    public breadCrumbs: string[];
    public navHistory: string[];

    public simulation: string;
    public applicationModeBadge: string;

    private _eventAggregator: EventAggregator;
    private _router: Router;

    private _routeChangeSubscription: Subscription;

    constructor(router: Router, eventAggregator: EventAggregator, configurationService: IConfigurationService) {
        this._eventAggregator = eventAggregator;
        this._router = router;

        this._routeChangeSubscription = this._eventAggregator.subscribe("router:navigation:complete", () => this.handleRouteChanged(router));

        this.breadCrumbs = [];
        this.showSearch = false;
        this.navHistory = [];

        this.applicationModeBadge = configurationService.getConfiguration<IHemaConfiguration>().applicationBadge || this.generateApplicationModeBadge(configurationService);
    }

    public showHideSearchResults(): void {
        this.showSearch = !this.showSearch;
    }

    public back(): void {
        if (this.navHistory.length > 0) {
            this.navHistory.pop();
            this._router.navigate(this.navHistory.pop());
        }
    }

    public navigateByIndex(index: number) : void {
        this._router.navigate(this.navHistory[this.navHistory.length - 1].split("/").slice(1, index + 2).join("/"));
    }

    public detached(): void {
        if (this._routeChangeSubscription) {
            this._routeChangeSubscription.dispose();
        }
    }

    private handleRouteChanged(router: Router): void {
        this.breadCrumbs = router.currentInstruction.fragment.split("/").slice(1);

        if (this.breadCrumbs.length === 1) {
            /* if we have navigated to a top level route then clear the history */
            this.navHistory = [];
        }
        this.navHistory.push(router.currentInstruction.fragment);

        /* limit to 20 entries */
        this.navHistory.slice(Math.max(this.navHistory.length - 5, 1));

        for (let i = 0; i < this.breadCrumbs.length; i++) {
            /* if the breadcrumb contains digits then treat it as an id based on the previous item */
            if (/\d/.test(this.breadCrumbs[i]) && i >= 1) {
                let previous = this.breadCrumbs[i - 1];
                if (previous.charAt(previous.length - 1) === "s") {
                    previous = previous.substr(0, previous.length - 1);
                }
                this.breadCrumbs[i] = "Details";
            } else {
                this.breadCrumbs[i] = this.titleCase(this.breadCrumbs[i].replace(/-/g, " "));
            }
        }
    }

    private titleCase(val: string): string {
        return val.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }

    private generateApplicationModeBadge(configurationService: IConfigurationService): string {
        let badge: string;
        let simulationCount = App.requiresSimulation(configurationService);
        if (simulationCount.totalRoutes === simulationCount.simulatedRoutes) {
            badge = this.applicationModeBadge = "SIMULATION";
        } else if (simulationCount.simulatedRoutes > 0) {
            badge = this.applicationModeBadge = "PARTIAL SIMULATION";
        }
        return badge;
    }
}
