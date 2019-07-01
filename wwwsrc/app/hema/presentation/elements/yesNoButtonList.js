var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../../../common/ui/elements/models/buttonListItem", "../../business/services/labelService", "aurelia-framework", "aurelia-templating", "aurelia-binding"], function (require, exports, buttonListItem_1, labelService_1, aurelia_framework_1, aurelia_templating_1, aurelia_binding_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var COMMON_LABEL_GROUP = "common";
    var YES_KEY = "yes";
    var NO_KEY = "no";
    var YesNoButtonList = /** @class */ (function () {
        function YesNoButtonList(element, labelService) {
            this.yesNoLookup = [];
            this._element = element;
            this._labelService = labelService;
        }
        YesNoButtonList.prototype.attached = function () {
            var _this = this;
            return this._labelService.getGroup(COMMON_LABEL_GROUP)
                .then(function (labels) {
                _this._yesLabel = labels[YES_KEY] || "yes";
                _this._noLabel = labels[NO_KEY] || "no";
                _this.yesNoLookup = [
                    new buttonListItem_1.ButtonListItem(_this._yesLabel, true, false),
                    new buttonListItem_1.ButtonListItem(_this._noLabel, false, false)
                ];
            });
        };
        YesNoButtonList.prototype.valueChanged = function (newState, oldState) {
            if (newState === oldState || newState === undefined) {
                return;
            }
            var eventName = newState ? "on-yes" : "on-no";
            this._element.dispatchEvent(new CustomEvent(eventName, {
                detail: {
                    value: newState
                },
                bubbles: true
            }));
            this.value = undefined;
        };
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.oneWay }),
            __metadata("design:type", Array)
        ], YesNoButtonList.prototype, "yesNoLookup", void 0);
        __decorate([
            aurelia_templating_1.bindable({ defaultBindingMode: aurelia_binding_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], YesNoButtonList.prototype, "value", void 0);
        YesNoButtonList = __decorate([
            aurelia_framework_1.inject(Element, labelService_1.LabelService),
            __metadata("design:paramtypes", [Element, Object])
        ], YesNoButtonList);
        return YesNoButtonList;
    }());
    exports.YesNoButtonList = YesNoButtonList;
});

//# sourceMappingURL=yesNoButtonList.js.map
