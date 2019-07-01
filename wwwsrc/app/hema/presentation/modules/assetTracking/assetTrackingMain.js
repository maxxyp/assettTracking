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
define(["require", "exports", "../../models/editableViewModel", "../../../business/services/jobService", "../../../business/services/engineerService", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "../../../business/services/validationService", "../../../business/services/businessRuleService", "../../../business/services/catalogService", "aurelia-framework"], function (require, exports, editableViewModel_1, jobService_1, engineerService_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, validationService_1, businessRuleService_1, catalogService_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AssetTrackingMain = /** @class */ (function (_super) {
        __extends(AssetTrackingMain, _super);
        function AssetTrackingMain(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) {
            return _super.call(this, jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) || this;
        }
        AssetTrackingMain.prototype.activateAsync = function () {
            var _this = this;
            return this.loadModel().then(function () { return _this.showContent(); });
        };
        AssetTrackingMain = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, engineerService_1.EngineerService, labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, validationService_1.ValidationService, businessRuleService_1.BusinessRuleService, catalogService_1.CatalogService),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object, Object])
        ], AssetTrackingMain);
        return AssetTrackingMain;
    }(editableViewModel_1.EditableViewModel));
    exports.AssetTrackingMain = AssetTrackingMain;
});

//# sourceMappingURL=assetTrackingMain.js.map
