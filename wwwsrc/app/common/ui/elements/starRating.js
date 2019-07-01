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
define(["require", "exports", "aurelia-framework", "aurelia-framework"], function (require, exports, aurelia_framework_1, aurelia_framework_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StarRating = /** @class */ (function () {
        function StarRating() {
            this.value = 0;
            this.ratingTexts = [];
            this.valueText = "";
        }
        StarRating.prototype.attached = function () {
            if (this.ratingTexts.length > 0) {
                this.valueText = this.ratingTexts[this.value];
            }
        };
        StarRating.prototype.ratingClick = function (index) {
            this.value = index;
            if (this.ratingTexts.length > 0) {
                this.valueText = this.ratingTexts[this.value];
            }
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], StarRating.prototype, "value", void 0);
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", Array)
        ], StarRating.prototype, "ratingTexts", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", String)
        ], StarRating.prototype, "valueText", void 0);
        StarRating = __decorate([
            aurelia_framework_1.customElement("star-rating"),
            __metadata("design:paramtypes", [])
        ], StarRating);
        return StarRating;
    }());
    exports.StarRating = StarRating;
});

//# sourceMappingURL=starRating.js.map
