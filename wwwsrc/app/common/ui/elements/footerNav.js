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
define(["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-dependency-injection"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FooterNav = /** @class */ (function () {
        function FooterNav(router) {
            this._router = router;
        }
        FooterNav.prototype.attached = function () {
            this.setActiveButton(this.setSelected);
            if (this.navStyle === "card") {
                this.navPosition = "styleAbsolute";
            }
            else {
                this.navPosition = "styleFixed";
            }
            if (this.navStyle !== "card") {
                this.navStyle = "";
            }
            if (this.expanded !== undefined) {
                this.showHideNav = this.expanded;
            }
        };
        FooterNav.prototype.setSelectedChanged = function () {
            this.setActiveButton(this.setSelected);
        };
        FooterNav.prototype.footerNavObjectChanged = function () {
            this.setActiveButton(this.setSelected);
        };
        FooterNav.prototype.setActiveButton = function (activeButton) {
            if (!isNaN(activeButton)) {
                if (this.footerNavObject && activeButton < this.footerNavObject.length) {
                    this.footerNavObject[activeButton].selected = true;
                }
            }
        };
        FooterNav.prototype.showHideNavDetails = function () {
            this.showHideNav = this.showHideNav === true ? false : true;
        };
        FooterNav.prototype.navigate = function (navObject) {
            navObject.selected = true;
            if (navObject.callback) {
                navObject.callback();
            }
            else {
                this._router.navigateToRoute(navObject.routeName, navObject.paramObject);
            }
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Array)
        ], FooterNav.prototype, "footerNavObject", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Number)
        ], FooterNav.prototype, "setSelected", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], FooterNav.prototype, "navStyle", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], FooterNav.prototype, "expanded", void 0);
        FooterNav = __decorate([
            aurelia_framework_1.customElement("footer-nav"),
            aurelia_dependency_injection_1.inject(aurelia_router_1.Router),
            __metadata("design:paramtypes", [aurelia_router_1.Router])
        ], FooterNav);
        return FooterNav;
    }());
    exports.FooterNav = FooterNav;
});

//# sourceMappingURL=footerNav.js.map
