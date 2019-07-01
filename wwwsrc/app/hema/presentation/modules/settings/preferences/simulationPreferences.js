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
define(["require", "exports", "aurelia-dependency-injection", "aurelia-event-aggregator", "../../../../../common/simulation/constants/simulationConstants", "aurelia-binding", "../../../../business/services/storageService", "../../../../../common/core/services/configurationService", "../../../models/baseViewModel", "aurelia-dialog", "../../../../business/services/labelService", "../../../../core/windowHelper"], function (require, exports, aurelia_dependency_injection_1, aurelia_event_aggregator_1, simulationConstants_1, aurelia_binding_1, storageService_1, configurationService_1, baseViewModel_1, aurelia_dialog_1, labelService_1, windowHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SimulationPreferences = /** @class */ (function (_super) {
        __extends(SimulationPreferences, _super);
        function SimulationPreferences(labelService, eventAggregator, dialogService, configurationService, storageService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._storageService = storageService;
            _this._configurationService = configurationService;
            _this._appConfig = _this._configurationService.getConfiguration();
            _this.simulations = _this._appConfig.simulation || [];
            return _this;
        }
        SimulationPreferences.prototype.activateAsync = function () {
            var _this = this;
            return this._storageService.getSimulationEngineer()
                .then(function (engineerId) {
                if (_this.simulations && _this.simulations.some(function (sim) { return sim.engineerId === engineerId; })) {
                    _this.engineerId = engineerId;
                }
                else {
                    _this.customEngineerId = engineerId;
                }
                _this._pageReady = true;
            });
        };
        SimulationPreferences.prototype.engineerIdChanged = function (newValue, oldValue) {
            var _this = this;
            if (this._pageReady && newValue !== oldValue) {
                var simulation = this.simulations.find(function (sim) { return sim.engineerId === _this.engineerId; });
                this.setEngineer(simulation);
            }
        };
        SimulationPreferences.prototype.assignCustomEngineerId = function () {
            var simulation = {
                firstName: "Custom",
                lastName: "Engineer",
                engineerId: this.customEngineerId
            };
            this.setEngineer(simulation);
        };
        SimulationPreferences.prototype.setEngineer = function (simulation) {
            var _this = this;
            if (simulation) {
                this._storageService.deleteEngineer()
                    .then(function () { return _this._storageService.setWorkListJobs(null); })
                    .then(function () { return _this._storageService.setMaterials(null); })
                    .then(function () { return _this._storageService.setMaterialAdjustments(null); })
                    .then(function () { return _this._storageService.setSimulationEngineer(simulation.engineerId); })
                    .then(function () { return _this._storageService.setMessages(null); })
                    .then(function () {
                    _this._eventAggregator.publish(simulationConstants_1.SimulationConstants.SIMULATION_OVERRIDE_EVENT, {
                        route: "whoami/v1",
                        data: {
                            userId: simulation.firstName.toLowerCase() + simulation.lastName.toLowerCase(),
                            attributes: [
                                {
                                    "employeeid": simulation.engineerId
                                },
                                {
                                    "givenname": simulation.firstName
                                },
                                {
                                    "sn": simulation.lastName
                                },
                                {
                                    "telephonenumber": "01234 567890"
                                }
                            ]
                        }
                    });
                    windowHelper_1.WindowHelper.reload();
                });
            }
        };
        __decorate([
            aurelia_binding_1.observable(),
            __metadata("design:type", String)
        ], SimulationPreferences.prototype, "engineerId", void 0);
        __decorate([
            aurelia_binding_1.observable(),
            __metadata("design:type", String)
        ], SimulationPreferences.prototype, "customEngineerId", void 0);
        SimulationPreferences = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, configurationService_1.ConfigurationService, storageService_1.StorageService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object, Object])
        ], SimulationPreferences);
        return SimulationPreferences;
    }(baseViewModel_1.BaseViewModel));
    exports.SimulationPreferences = SimulationPreferences;
});

//# sourceMappingURL=simulationPreferences.js.map
