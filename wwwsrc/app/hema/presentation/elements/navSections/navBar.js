var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-dependency-injection", "aurelia-templating", "aurelia-event-aggregator", "aurelia-router", "../../../../app", "../../../../common/core/services/configurationService"], function (require, exports, aurelia_dependency_injection_1, aurelia_templating_1, aurelia_event_aggregator_1, aurelia_router_1, app_1, configurationService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NavBar = /** @class */ (function () {
        function NavBar(router, eventAggregator, configurationService) {
            var _this = this;
            this._eventAggregator = eventAggregator;
            this._router = router;
            this._routeChangeSubscription = this._eventAggregator.subscribe("router:navigation:complete", function () { return _this.handleRouteChanged(router); });
            this.breadCrumbs = [];
            this.showSearch = false;
            this.navHistory = [];
            this.applicationModeBadge = configurationService.getConfiguration().applicationBadge || this.generateApplicationModeBadge(configurationService);
        }
        NavBar.prototype.showHideSearchResults = function () {
            this.showSearch = !this.showSearch;
        };
        NavBar.prototype.back = function () {
            if (this.navHistory.length > 0) {
                this.navHistory.pop();
                this._router.navigate(this.navHistory.pop());
            }
        };
        NavBar.prototype.navigateByIndex = function (index) {
            this._router.navigate(this.navHistory[this.navHistory.length - 1].split("/").slice(1, index + 2).join("/"));
        };
        NavBar.prototype.detached = function () {
            if (this._routeChangeSubscription) {
                this._routeChangeSubscription.dispose();
            }
        };
        NavBar.prototype.handleRouteChanged = function (router) {
            this.breadCrumbs = router.currentInstruction.fragment.split("/").slice(1);
            if (this.breadCrumbs.length === 1) {
                /* if we have navigated to a top level route then clear the history */
                this.navHistory = [];
            }
            this.navHistory.push(router.currentInstruction.fragment);
            /* limit to 20 entries */
            this.navHistory.slice(Math.max(this.navHistory.length - 5, 1));
            for (var i = 0; i < this.breadCrumbs.length; i++) {
                /* if the breadcrumb contains digits then treat it as an id based on the previous item */
                if (/\d/.test(this.breadCrumbs[i]) && i >= 1) {
                    var previous = this.breadCrumbs[i - 1];
                    if (previous.charAt(previous.length - 1) === "s") {
                        previous = previous.substr(0, previous.length - 1);
                    }
                    this.breadCrumbs[i] = "Details";
                }
                else {
                    this.breadCrumbs[i] = this.titleCase(this.breadCrumbs[i].replace(/-/g, " "));
                }
            }
        };
        NavBar.prototype.titleCase = function (val) {
            return val.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        };
        NavBar.prototype.generateApplicationModeBadge = function (configurationService) {
            var badge;
            var simulationCount = app_1.App.requiresSimulation(configurationService);
            if (simulationCount.totalRoutes === simulationCount.simulatedRoutes) {
                badge = this.applicationModeBadge = "SIMULATION";
            }
            else if (simulationCount.simulatedRoutes > 0) {
                badge = this.applicationModeBadge = "PARTIAL SIMULATION";
            }
            return badge;
        };
        NavBar = __decorate([
            aurelia_templating_1.customElement("nav-bar"),
            aurelia_dependency_injection_1.inject(aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator, configurationService_1.ConfigurationService),
            __metadata("design:paramtypes", [aurelia_router_1.Router, aurelia_event_aggregator_1.EventAggregator, Object])
        ], NavBar);
        return NavBar;
    }());
    exports.NavBar = NavBar;
});

//# sourceMappingURL=navBar.js.map
