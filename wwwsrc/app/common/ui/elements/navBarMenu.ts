/// <reference path="../../../../typings/app.d.ts" />

import {EventAggregator} from "aurelia-event-aggregator";
import {inject, customElement, bindable, bindingMode} from "aurelia-framework";
import {Router} from "aurelia-router";
import {Notification} from "./models/notification";
import {UiConstants} from "./constants/uiConstants";
import {NavModel} from "aurelia-router";
import {PlatformHelper} from "../../core/platformHelper";
import {DomHelper} from "../../ui/domHelper";

@customElement("nav-bar-menu")
@inject(EventAggregator)
export class NavBarMenu {
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public router: Router;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public notifications: Notification[];
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public notificationsTotal: number;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public showMenu: boolean;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public showNotifications: boolean;
    @bindable({defaultBindingMode: bindingMode.twoWay})
    public isActive: boolean;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public navBarTitle: string;
    public homeShowBackButton: boolean;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public overrideShowBackButton: boolean;
    @bindable({defaultBindingMode: bindingMode.oneWay})
    public isSimMode: boolean;

    private _lastShow: number;
    private _eventTarget: EventTarget;
    private _clickCheck: () => void;
    private _backEventListener: (eventargs: { handled: boolean }) => void;
    private _eventAggregator: any;

    constructor(eventAggregator: EventAggregator) {
        this.showMenu = false;
        this.showNotifications = false;
        this.homeShowBackButton = false;
        this.overrideShowBackButton = false;
        this.isActive = true;
        this._eventAggregator = eventAggregator;
        this._lastShow = 0;
        this._eventTarget = document;
        this._clickCheck = () => {
            // only hide if we have not just shown it
            if (new Date().getTime() - this._lastShow > 500) {
                this.hideMenus();
            }
        };
        this._backEventListener = (eventargs: { handled: boolean }) => {
            eventargs.handled = this.homeShowBackButton;

            if (eventargs.handled) {
                this.backClicked();
            }
        };
        this._eventAggregator.subscribe("router:navigation:complete", (e: any) => this.checkHomeRoute(e));
    }

    public setEventTarget(eventTarget: EventTarget): void {
        this._eventTarget = eventTarget;
    }

    public attached(): void {
        if (PlatformHelper.getPlatform() === "wua" && window.Windows.UI.Core.SystemNavigationManager) {
            // to simulate hardware back button on Windows desktop WUA
            // window.Windows.UI.Core.SystemNavigationManager.getForCurrentView().appViewBackButtonVisibility =
            //     window.Windows.UI.Core.AppViewBackButtonVisibility.visible;
            window.Windows.UI.Core.SystemNavigationManager.getForCurrentView()
                  .addEventListener("backrequested", this._backEventListener);
        }
        this.isActiveChanged(this.isActive, false);
    }

    public detached(): void {
        this.hideMenus();
        if (PlatformHelper.getPlatform() === "wua" && window.Windows.UI.Core.SystemNavigationManager) {
            window.Windows.UI.Core
                  .SystemNavigationManager.removeEventListener("backrequested", this._backEventListener);
        }
    }

    public toggleSideMenu(): void {
        this.showNotifications = false;
        this.showMenu = this.showMenu === true ? false : true;
        document.body.classList.toggle("noscroll", this.showMenu);
        if (this.showMenu) {
            /* Update the menu entries so any with dynamic visibility update */
            if (this.router && this.router.navigation) {
                for (let i: number = 0; i < this.router.navigation.length; i++) {
                    this.showHideMenuItem(this.router.navigation[i], this.isActive);
                }
            }
            this._lastShow = new Date().getTime();
            this._eventTarget.addEventListener("click", this._clickCheck);
        }
    }

    public toggleNotificationsMenu(): void {
        this.showMenu = false;
        this.showNotifications = this.showNotifications === true ? false : true;
        document.body.classList.toggle("noscroll", this.showMenu);
        if (this.showNotifications) {
            this._lastShow = new Date().getTime();
            this._eventTarget.addEventListener("click", this._clickCheck);
        }
    }

    public backClicked(): void {
        let el: { [id: string]: (() => void)[] } = <{ [id: string]: (() => void)[] }>this._eventAggregator.eventLookup;
        if (el &&
            el[UiConstants.EVENT_BACKCLICK] &&
            el[UiConstants.EVENT_BACKCLICK].length > 0) {
            this._eventAggregator.publish(UiConstants.EVENT_BACKCLICK);
        } else {
            this.router.navigateBack();
        }
    }

    public notificationActioned(notification: Notification): void {
        this.hideMenus();
        notification.callback();
    }

    public hideMenus(): void {
        if (this.showMenu || this.showNotifications) {
            this._eventTarget.removeEventListener("click", this._clickCheck);
        }
        this.showMenu = false;
        this.showNotifications = false;
        document.body.classList.toggle("noscroll", false);
    }

    public navigateTo(navModel: NavModel): void {
        let settings: { defaultParam: any, callback: (router: Router) => void } = navModel.settings;
        if (!!settings && settings.callback) {
            settings.callback(this.router);
            return;
        }

        DomHelper.jumpToTop();
        this.hideMenus();
        this.router.navigateToRoute(navModel.config.name, settings && settings.defaultParam
            ? settings.defaultParam : undefined);
    }

    public isActiveChanged(newValue: boolean, oldValue: boolean): void {
        for (let i: number = 0; i < this.router.navigation.length; i++) {
            this.showHideMenuItem(this.router.navigation[i], newValue);
        }
    }

    private showHideMenuItem(row: NavModel, isactive: boolean): void {
        if (row.settings === undefined || row.settings === null) {
            row.settings = {};
        }
        let settings: { authRequired: boolean, ignoreAuthRequired: boolean, showItem: boolean, dynamicVisible: () => boolean } =
            <{ authRequired: boolean, ignoreAuthRequired: boolean, showItem: boolean, dynamicVisible: () => boolean }>row.settings;

        let show: boolean = true;
        if (settings.ignoreAuthRequired) {
            show = true;
        } else {
            if (isactive) {
                if ((settings.authRequired === true ||
                    settings.authRequired === undefined)) {
                    show = true;
                } else {
                    show = false;
                }
            } else {
                if (!settings.authRequired) {
                    show = true;
                } else {
                    show = false;
                }
            }
        }

        if (settings.dynamicVisible) {
            show = settings.dynamicVisible();
        }

        settings.showItem = show;
    }

    private checkHomeRoute(eventArgs: any): void {
        if (this.router.currentInstruction.config.navModel.relativeHref.length === 0) {
            this.homeShowBackButton = false;
        } else {
            this.homeShowBackButton = true;
        }
    }
}
