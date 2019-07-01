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
define(["require", "exports", "aurelia-dependency-injection", "../../core/services/assetService"], function (require, exports, aurelia_dependency_injection_1, assetService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScenarioStore = /** @class */ (function () {
        function ScenarioStore(assetService) {
            this._assetService = assetService;
        }
        ScenarioStore.prototype.initialise = function (baseDir) {
            this._baseDir = baseDir;
            return Promise.resolve();
        };
        ScenarioStore.prototype.loadScenarios = function () {
            return this._assetService.loadJson(this._baseDir + "/scenarioList.json");
        };
        ScenarioStore.prototype.loadScenario = function (route) {
            var url = this._baseDir + "/" + route + "/scenario.json";
            url = url + "?_t=" + new Date().getTime();
            return this._assetService.loadJson(url);
        };
        ScenarioStore = __decorate([
            aurelia_dependency_injection_1.inject(assetService_1.AssetService),
            __metadata("design:paramtypes", [Object])
        ], ScenarioStore);
        return ScenarioStore;
    }());
    exports.ScenarioStore = ScenarioStore;
});

//# sourceMappingURL=scenarioStore.js.map
