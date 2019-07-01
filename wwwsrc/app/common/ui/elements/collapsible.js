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
define(["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Collapsible = /** @class */ (function () {
        function Collapsible() {
            this.titleText = "";
            this.titleTextExpanded = "";
            this.animate = false;
            this.isCollapsed = true;
            this.headerIcons = [];
            this.collapseIcon = "";
            this.expandIcon = "";
        }
        Collapsible.prototype.attached = function () {
            !this.isCollapsed ? this.show() : this.hide();
            if (this.contentElement) {
                this.contentElement.style.height = "auto";
            }
        };
        Collapsible.prototype.show = function () {
            this.isCollapsed = false;
            this.contentElement.style.display = "inline";
        };
        Collapsible.prototype.hide = function () {
            this.isCollapsed = true;
            this.contentElement.style.display = "none";
        };
        Collapsible.prototype.isCollapsedChanged = function (newValue) {
            if (this.contentElement) {
                newValue ? this.hide() : this.show();
            }
        };
        Collapsible.prototype.toggle = function () {
            if (this._clickCallback) {
                this._clickCallback(this);
            }
            this.isCollapsed ? this.show() : this.hide();
        };
        Collapsible.prototype.setClickCallback = function (callback) {
            this._clickCallback = callback;
        };
        Collapsible.prototype.hasHeaderIcons = function () {
            return this.headerIcons && this.headerIcons.length > 0;
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], Collapsible.prototype, "titleText", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], Collapsible.prototype, "titleTextExpanded", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], Collapsible.prototype, "animate", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], Collapsible.prototype, "isCollapsed", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Array)
        ], Collapsible.prototype, "headerIcons", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], Collapsible.prototype, "collapseIcon", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], Collapsible.prototype, "expandIcon", void 0);
        Collapsible = __decorate([
            aurelia_framework_1.customElement("collapsible"),
            __metadata("design:paramtypes", [])
        ], Collapsible);
        return Collapsible;
    }());
    exports.Collapsible = Collapsible;
});

//# sourceMappingURL=collapsible.js.map
