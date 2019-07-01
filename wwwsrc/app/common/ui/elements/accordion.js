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
define(["require", "exports", "aurelia-framework", "aurelia-templating"], function (require, exports, aurelia_framework_1, aurelia_templating_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Accordion = /** @class */ (function () {
        function Accordion() {
            this.showControls = false;
            this.controlsExpandedText = "<i class='fa fa-plus'></i> Expand All";
            this.controlsCollapsedText = "<i class='fa fa-minus'></i> Collapse All";
            this._allExpanded = false;
        }
        Accordion.prototype.attached = function () {
            var _this = this;
            if (this.sections) {
                for (var collapsibleCount = 0; collapsibleCount < this.sections.length; collapsibleCount++) {
                    this.sections[collapsibleCount].setClickCallback(function (item) { return _this.clickCallback(item); });
                }
            }
        };
        Accordion.prototype.expandAll = function () {
            if (this.sections) {
                for (var collapsibleCount = 0; collapsibleCount < this.sections.length; collapsibleCount++) {
                    this.sections[collapsibleCount].show();
                }
                this._allExpanded = true;
            }
        };
        Accordion.prototype.collapseAll = function () {
            if (this.sections) {
                for (var collapsibleCount = 0; collapsibleCount < this.sections.length; collapsibleCount++) {
                    this.sections[collapsibleCount].hide();
                }
                this._allExpanded = false;
            }
        };
        Accordion.prototype.clickCallback = function (collapsible) {
            if (this.showControls) {
                return;
            }
            if (this.sections) {
                for (var collapsibleCount = 0; collapsibleCount < this.sections.length; collapsibleCount++) {
                    if (!this.sections[collapsibleCount].isCollapsed
                        && this.sections[collapsibleCount] !== collapsible) {
                        this.sections[collapsibleCount].hide();
                    }
                }
                if (this._allExpanded) {
                    collapsible.isCollapsed = true;
                    this._allExpanded = false;
                }
            }
        };
        __decorate([
            aurelia_templating_1.children({ name: "sections", selector: "collapsible" }),
            __metadata("design:type", Array)
        ], Accordion.prototype, "sections", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", Boolean)
        ], Accordion.prototype, "showControls", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], Accordion.prototype, "controlsExpandedText", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneWay }),
            __metadata("design:type", String)
        ], Accordion.prototype, "controlsCollapsedText", void 0);
        Accordion = __decorate([
            aurelia_framework_1.customElement("accordion"),
            __metadata("design:paramtypes", [])
        ], Accordion);
        return Accordion;
    }());
    exports.Accordion = Accordion;
});

//# sourceMappingURL=accordion.js.map
