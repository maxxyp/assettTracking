var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../../../models/baseViewModel", "aurelia-event-aggregator", "aurelia-dialog", "../../../../business/services/labelService", "aurelia-dependency-injection"], function (require, exports, baseViewModel_1, aurelia_event_aggregator_1, aurelia_dialog_1, labelService_1, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseInformation = /** @class */ (function (_super) {
        __extends(BaseInformation, _super);
        function BaseInformation(labelService, eventAggregator, dialogService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this.isExpanded = true;
            return _this;
        }
        BaseInformation.prototype.toggleExpanded = function () {
            this.isExpanded = !this.isExpanded;
        };
        BaseInformation = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService])
        ], BaseInformation);
        return BaseInformation;
    }(baseViewModel_1.BaseViewModel));
    exports.BaseInformation = BaseInformation;
});

//# sourceMappingURL=baseInformation.js.map
