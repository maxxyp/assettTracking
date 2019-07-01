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
define(["require", "exports", "aurelia-dependency-injection", "../../../../business/services/storageService", "../../../../business/services/labelService", "aurelia-binding", "../../../models/baseViewModel", "aurelia-event-aggregator", "aurelia-dialog"], function (require, exports, aurelia_dependency_injection_1, storageService_1, labelService_1, aurelia_binding_1, baseViewModel_1, aurelia_event_aggregator_1, aurelia_dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DisplayPreferences = /** @class */ (function (_super) {
        __extends(DisplayPreferences, _super);
        function DisplayPreferences(labelService, eventAggregator, dialogService, storage) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this.appSettings = {};
            _this._storage = storage;
            return _this;
        }
        DisplayPreferences.prototype.activateAsync = function () {
            var _this = this;
            this.toastScreenPositions = [];
            this.toastScreenPositions.push({ code: 1, position: "Top Centre" });
            this.toastScreenPositions.push({ code: 2, position: "Top Left" });
            this.toastScreenPositions.push({ code: 3, position: "Top Right" });
            this.toastScreenPositions.push({ code: 4, position: "Bottom Centre" });
            this.toastScreenPositions.push({ code: 5, position: "Bottom Left" });
            this.toastScreenPositions.push({ code: 6, position: "Bottom Right" });
            this.toastTimeValues = [];
            this.toastTimeValues.push({ timeInSecond: 1, description: "1 Second" });
            this.toastTimeValues.push({ timeInSecond: 2, description: "2 Seconds" });
            this.toastTimeValues.push({ timeInSecond: 3, description: "3 Seconds" });
            this.toastTimeValues.push({ timeInSecond: 5, description: "5 Seconds" });
            this.toastTimeValues.push({ timeInSecond: 7, description: "7 Seconds" });
            this.toastTimeValues.push({ timeInSecond: 10, description: "10 Seconds" });
            this.dropdownTypeValues = [];
            this.dropdownTypeValues.push({ code: 1, description: "Normal" });
            this.dropdownTypeValues.push({ code: 2, description: "Smash Buttons" });
            this.dropdownSoundNotificationValues = [];
            this.dropdownSoundNotificationValues.push({ code: 1, description: "Off" });
            this.dropdownSoundNotificationValues.push({ code: 2, description: "On" });
            return this._storage.getAppSettings()
                .then(function (settings) {
                _this.appSettings = settings;
                _this.dropdownType = _this.appSettings.dropdownType;
                _this.toastDelay = _this.appSettings.notificationDisplayTime;
                _this.toastSelectedPosition = _this.appSettings.notificationPosition;
                _this.sound = _this.appSettings.soundEnabled ? 2 : 1;
            });
        };
        DisplayPreferences.prototype.toastDelayChanged = function (newValue, oldValue) {
            this.appSettings.notificationDisplayTime = newValue;
            this._storage.setAppSettings(this.appSettings);
        };
        DisplayPreferences.prototype.toastSelectedPositionChanged = function (newValue, oldValue) {
            this.appSettings.notificationPosition = newValue;
            this._storage.setAppSettings(this.appSettings);
        };
        DisplayPreferences.prototype.dropdownTypeChanged = function (newValue, oldValue) {
            this.appSettings.dropdownType = newValue;
            this._storage.setAppSettings(this.appSettings);
        };
        DisplayPreferences.prototype.soundChanged = function (newValue, oldValue) {
            this.appSettings.soundEnabled = newValue === 2;
            this._storage.setAppSettings(this.appSettings);
        };
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", Number)
        ], DisplayPreferences.prototype, "toastSelectedPosition", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", Number)
        ], DisplayPreferences.prototype, "toastDelay", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", Number)
        ], DisplayPreferences.prototype, "dropdownType", void 0);
        __decorate([
            aurelia_binding_1.observable,
            __metadata("design:type", Number)
        ], DisplayPreferences.prototype, "sound", void 0);
        DisplayPreferences = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, storageService_1.StorageService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, Object])
        ], DisplayPreferences);
        return DisplayPreferences;
    }(baseViewModel_1.BaseViewModel));
    exports.DisplayPreferences = DisplayPreferences;
});

//# sourceMappingURL=displayPreferences.js.map
