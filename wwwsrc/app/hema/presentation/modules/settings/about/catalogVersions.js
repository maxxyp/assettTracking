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
define(["require", "exports", "aurelia-event-aggregator", "aurelia-dialog", "../../../../business/services/labelService", "aurelia-dependency-injection", "./baseInformation", "../../../../business/services/referenceDataService", "../../../../business/services/storageService"], function (require, exports, aurelia_event_aggregator_1, aurelia_dialog_1, labelService_1, aurelia_dependency_injection_1, baseInformation_1, referenceDataService_1, storageService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CatalogVersions = /** @class */ (function (_super) {
        __extends(CatalogVersions, _super);
        function CatalogVersions(labelService, eventAggregator, dialogService, referenceDataService, storageService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this.isExpanded = false;
            _this._referenceDataService = referenceDataService;
            _this._storageService = storageService;
            return _this;
        }
        CatalogVersions.prototype.attachedAsync = function () {
            var _this = this;
            this.referenceVersions = this._referenceDataService.getVersions();
            return this._storageService.getLastSuccessfulSyncTime()
                .then(function (lastSuccessfulSyncTime) {
                _this.lastSuccessfulSyncTime = new Date(lastSuccessfulSyncTime);
            });
        };
        CatalogVersions = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, referenceDataService_1.ReferenceDataService, storageService_1.StorageService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, Object, Object])
        ], CatalogVersions);
        return CatalogVersions;
    }(baseInformation_1.BaseInformation));
    exports.CatalogVersions = CatalogVersions;
});

//# sourceMappingURL=catalogVersions.js.map
