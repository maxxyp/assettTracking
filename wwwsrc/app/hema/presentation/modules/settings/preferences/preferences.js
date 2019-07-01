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
define(["require", "exports", "aurelia-dependency-injection", "../../../../business/services/labelService", "../../../models/baseViewModel", "aurelia-event-aggregator", "aurelia-dialog", "../../../../../common/core/services/configurationService", "../../../../business/services/storageService", "../../../../../common/core/platformHelper"], function (require, exports, aurelia_dependency_injection_1, labelService_1, baseViewModel_1, aurelia_event_aggregator_1, aurelia_dialog_1, configurationService_1, storageService_1, platformHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Preferences = /** @class */ (function (_super) {
        __extends(Preferences, _super);
        function Preferences(labelService, eventAggregator, dialogService, configurationService, storageService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._configurationService = configurationService;
            _this._storageService = storageService;
            _this._appConfig = _this._configurationService.getConfiguration();
            return _this;
        }
        Preferences.prototype.activateAsync = function () {
            this.showSimulation = !!this._appConfig.simulation || !!platformHelper_1.PlatformHelper.isDevelopment;
            return Promise.resolve();
        };
        Preferences.prototype.canDeactivateAsync = function () {
            return this._storageService.userSettingsComplete();
        };
        Preferences = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, configurationService_1.ConfigurationService, storageService_1.StorageService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, Object, Object])
        ], Preferences);
        return Preferences;
    }(baseViewModel_1.BaseViewModel));
    exports.Preferences = Preferences;
});

//# sourceMappingURL=preferences.js.map
