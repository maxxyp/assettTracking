/// <reference path="../../../../../typings/app.d.ts" />
import {inject} from "aurelia-framework";
import {customElement, bindable, bindingMode} from "aurelia-framework";
import {Router} from "aurelia-router";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";

@customElement("tab-buttons")
@inject(Router, EventAggregator)
export class TabButtons {
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public router: Router;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public activeTab: string;
    public isFullScreen: boolean;

    private _eventAggregator: EventAggregator;
    private _routeChangeSubscription: Subscription;

    constructor(router: Router, eventAggregator: EventAggregator) {
        this.router = router;
        this._eventAggregator = eventAggregator;
        this.isFullScreen = window.isFullScreen;
    }

    public attached(): void {
        this._routeChangeSubscription = this._eventAggregator.subscribe("router:navigation:complete", () => this.handleRouteChanged());
        this.handleRouteChanged();
    }

    public detached(): void {
        if (this._routeChangeSubscription) {
            this._routeChangeSubscription.dispose();
            this._routeChangeSubscription = null;
        }
    }

    public navigateToChildRoute(routeName: string): void {
        this.router.navigateToRoute(routeName);
    }

    private handleRouteChanged(): void {
        if (this.router &&
            this.router.currentInstruction &&
            this.router.currentInstruction.config &&
            this.router.currentInstruction.config.settings) {
            this.activeTab = this.router.currentInstruction.config.settings.tabGroupParent
                ? this.router.currentInstruction.config.settings.tabGroupParent : this.router.currentInstruction.config.name;
        }
    }
}
