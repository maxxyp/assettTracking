/// <reference path="../../../../typings/app.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-event-aggregator", "aurelia-framework", "aurelia-router", "./constants/uiConstants", "../../core/platformHelper", "../../ui/domHelper"], function (require, exports, aurelia_event_aggregator_1, aurelia_framework_1, aurelia_router_1, uiConstants_1, platformHelper_1, domHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NavBarMenu = /** @class */ (function () {
        function NavBarMenu(eventAggregator) {
            var _this = this;
            this.showMenu = false;
            this.showNotifications = false;
            this.homeShowBackButton = false;
            this.overrideShowBackButton = false;
            this.isActive = true;
            this._eventAggregator = eventAggregator;
            this._lastShow = 0;
            this._eventTarget = document;
            this._clickCheck = function () {
                // only hide if we have not just shown it
                if (new Date().getTime() - _this._lastShow > 500) {
                    _this.hideMenus();
                }
            };
            this._backEventListener = function (eventargs) {
                eventargs.handled = _this.homeShowBackButton;
                if (eventargs.handled) {
                    _this.backClicked();
                }
            };
            this._eventAggregator.subscribe("router:navigation:complete", function (e) { return _this.checkHomeRoute(e); });
        }
        NavBarMenu.prototype.setEventTarget = function (eventTarget) {
            this._eventTarget = eventTarget;
        };
        NavBarMenu.prototype.attached = function () {
            if (platformHelper_1.PlatformHelper.getPlatform() === "wua" && window.Windows.UI.Core.SystemNavigationManager) {
                // to simulate hardware back button on Windows desktop WUA
                // window.Windows.UI.Core.SystemNavigationManager.getForCurrentView().appViewBackButtonVisibility =
                //     window.Windows.UI.Core.AppViewBackButtonVisibility.visible;
                window.Windows.UI.Core.SystemNavigationManager.getForCurrentView()
                    .addEventListener("backrequested", this._backEventListener);
            }
            this.isActiveChanged(this.isActive, false);
        };
        NavBarMenu.prototype.detached = function () {
            this.hideMenus();
            if (platformHelper_1.PlatformHelper.getPlatform() === "wua" && window.Windows.UI.Core.SystemNavigationManager) {
                window.Windows.UI.Core
                    .SystemNavigationManager.removeEventListener("backrequested", this._backEventListener);
            }
        };
        NavBarMenu.prototype.toggleSideMenu = function () {
            this.showNotifications = false;
            this.showMenu = this.showMenu === true ? false : true;
            document.body.classList.toggle("noscroll", this.showMenu);
            if (this.showMenu) {
                /* Update the menu entries so any with dynamic visibility update */
                if (this.router && this.router.navigation) {
                    for (var i = 0; i < this.router.navigation.length; i++) {
                        this.showHideMenuItem(this.router.navigation[i], this.isActive);
                    }
                }
                this._lastShow = new Date().getTime();
                this._eventTarget.addEventListener("click", this._clickCheck);
            }
        };
        NavBarMenu.prototype.toggleNotificationsMenu = function () {
            this.showMenu = false;
            this.showNotifications = this.showNotifications === true ? false : true;
            document.body.classList.toggle("noscroll", this.showMenu);
            if (this.showNotifications) {
                this._lastShow = new Date().getTime();
                this._eventTarget.addEventListener("click", this._clickCheck);
            }
        };
        NavBarMenu.prototype.backClicked = function () {
            var el = this._eventAggregator.eventLookup;
            if (el &&
                el[uiConstants_1.UiConstants.EVENT_BACKCLICK] &&
                el[uiConstants_1.UiConstants.EVENT_BACKCLICK].length > 0) {
                this._eventAggregator.publish(uiConstants_1.UiConstants.EVENT_BACKCLICK);
            }
            else {
                this.router.navigateBack();
            }
        };
        NavBarMenu.prototype.notificationActioned = function (notification) {
            this.hideMenus();
            notification.callback();
        };
        NavBarMenu.prototype.hideMenus = function () {
            if (this.showMenu || this.showNotifications) {
                this._eventTarget.removeEventListener("click", this._clickCheck);
            }
            this.showMenu = false;
            this.showNotifications = false;
            document.body.classList.toggle("noscroll", false);
        };
        NavBarMenu.prototype.navigateTo = function (navModel) {
            var settings = navModel.settings;
            if (!!settings && settings.callback) {
                settings.callback(this.router);
                return;
            }
            domHelper_1.DomHelper.jumpToTop();
            this.hideMenus();
            this.router.navigateToRoute(navModel.config.name, settings && settings.defaultParam
                ? settings.defaultParam : undefined);
        };
        NavBarMenu.prototype.isActiveChanged = function (newValue, oldValue) {
            for (var i = 0; i < this.router.navigation.length; i++) {
                this.showHideMenuItem(this.router.navigation[i], newValue);
            }
        };
        NavBarMenu.prototype.showHideMenuItem = function (row, isactive) {
            if (row.settings === undefined || row.settings === null) {
                row.settings = {};
            }
            var settings = row.settings;
            var show = true;
            if (settings.ignoreAuthRequired) {
                show = true;
            }
            else {
                if (isactive) {
                    if ((settings.authRequired === true ||
                        settings.authRequired === undefined)) {
                        show = true;
                    }
                    else {
                        show = false;
                    }
                }
                else {
                    if (!settings.authRequired) {
                        show = true;
                    }
                    else {
                        show = false;
                    }
                }
            }
            if (settings.dynamicVisible) {
                show = settings.dynamicVisible();
            }
            settings.showItem = show;
        };
        NavBarMenu.prototype.checkHomeRoute = function (eventArgs) {
            if (this.router.currentInstruction.config.navModel.relativeHref.length === 0) {
                this.homeShowBackButton = false;
            }
            else {
                this.homeShowBackButton = true;
            }
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", aurelia_router_1.Router)
        ], NavBarMenu.prototype, "router", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Array)
        ], NavBarMenu.prototype, "notifications", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], NavBarMenu.prototype, "notificationsTotal", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], NavBarMenu.prototype, "showMenu", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], NavBarMenu.prototype, "showNotifications", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Boolean)
        ], NavBarMenu.prototype, "isActive", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], NavBarMenu.prototype, "navBarTitle", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], NavBarMenu.prototype, "overrideShowBackButton", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], NavBarMenu.prototype, "isSimMode", void 0);
        NavBarMenu = __decorate([
            aurelia_framework_1.customElement("nav-bar-menu"),
            aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator),
            __metadata("design:paramtypes", [aurelia_event_aggregator_1.EventAggregator])
        ], NavBarMenu);
        return NavBarMenu;
    }());
    exports.NavBarMenu = NavBarMenu;
});

//# sourceMappingURL=navBarMenu.js.map
