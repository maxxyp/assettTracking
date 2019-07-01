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
define(["require", "exports", "../../storage/wua/localStorageService", "../../core/platformHelper", "../../core/services/assetService", "aurelia-dependency-injection"], function (require, exports, localStorageService_1, platformHelper_1, assetService_1, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScenarioStore = /** @class */ (function () {
        function ScenarioStore(assetService) {
            this._assetService = assetService;
            this._fallback = false;
        }
        ScenarioStore.prototype.initialise = function (baseDir) {
            var _this = this;
            this._baseDir = baseDir;
            return new Promise(function (resolve, reject) {
                if (platformHelper_1.PlatformHelper.isMobile()) {
                    Windows.Storage.KnownFolders.removableDevices.getFoldersAsync()
                        .then(function (folders) {
                        if (!_this._localStorageService && folders && folders.length > 0) {
                            _this._localStorageService = new localStorageService_1.LocalStorageService(folders[0]);
                            _this._localStorageService.initialise("Documents\\" +
                                Windows.ApplicationModel.Package.current.displayName + "\\" + _this._baseDir, false)
                                .then(function () {
                                _this.tryLoadScenarios().then(function () {
                                    resolve();
                                });
                            });
                        }
                        else {
                            _this._fallback = true;
                            resolve();
                        }
                    }, function (error) {
                        _this._fallback = true;
                        resolve();
                    });
                }
                else {
                    _this._localStorageService =
                        new localStorageService_1.LocalStorageService(Windows.Storage.ApplicationData.current.localFolder);
                    _this._localStorageService.initialise(_this._baseDir, false).then(function () {
                        _this.tryLoadScenarios().then(function () {
                            resolve();
                        });
                    })
                        .catch(function () {
                        _this._fallback = true;
                        resolve();
                    });
                }
            });
        };
        ScenarioStore.prototype.loadScenarios = function () {
            return this._fallback ?
                this._assetService.loadJson(this._baseDir + "/scenarioList.json") :
                this._localStorageService.read("", "scenarioList.json");
        };
        ScenarioStore.prototype.loadScenario = function (route) {
            route = decodeURI(route);
            return this._fallback ?
                this._assetService.loadJson(this._baseDir + "/" + route + "/scenario.json") :
                this._localStorageService.read(route, "scenario.json");
        };
        ScenarioStore.prototype.tryLoadScenarios = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                try {
                    _this.loadScenarios()
                        .then(function (scenarios) {
                        if (scenarios && scenarios.length > 0) {
                            resolve();
                        }
                        else {
                            _this._fallback = true;
                            resolve();
                        }
                    }).catch(function () {
                        _this._fallback = true;
                        resolve();
                    });
                }
                catch (e) {
                    _this._fallback = true;
                    resolve();
                }
            });
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
