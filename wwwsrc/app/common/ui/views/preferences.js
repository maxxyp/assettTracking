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
define(["require", "exports", "aurelia-dependency-injection", "../../core/services/browserLocalStorage", "aurelia-dependency-injection"], function (require, exports, aurelia_dependency_injection_1, browserLocalStorage_1, aurelia_dependency_injection_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Preferences = /** @class */ (function () {
        function Preferences(storageService) {
            this.preferences = [];
            this._storageService = storageService;
        }
        Preferences.prototype.add = function (view, viewModel, consumer) {
            this.preferences.push({ view: view, viewModel: viewModel, consumer: consumer });
        };
        Preferences.prototype.attached = function () {
            var _this = this;
            this.errorMessage = "";
            this.successMessage = "";
            return this.loadPreferences().then(function () {
                for (var i = 0; i < _this.preferences.length; i++) {
                    _this.preferences[i].viewModel.consumerToView(_this.preferences[i].consumer);
                }
            });
        };
        Preferences.prototype.loadPreferences = function () {
            var loadPromises = [];
            for (var i = 0; i < this.preferences.length; i++) {
                loadPromises.push(this.preferences[i].consumer.load(this._storageService));
            }
            return Promise.all(loadPromises);
        };
        Preferences.prototype.savePreferences = function () {
            var savePromises = [];
            for (var i = 0; i < this.preferences.length; i++) {
                savePromises.push(this.preferences[i].consumer.save(this._storageService));
            }
            return Promise.all(savePromises);
        };
        Preferences.prototype.validateAndSavePreferences = function () {
            var _this = this;
            this.errorMessage = "";
            this.successMessage = "";
            return new Promise(function (resolve, reject) {
                var validatePromises = [];
                for (var i = 0; i < _this.preferences.length; i++) {
                    validatePromises.push(_this.preferences[i].viewModel.validate());
                }
                Promise.all(validatePromises).then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        if (!results[i]) {
                            _this.errorMessage = "Preferences not saved, please check your input and try again.";
                            resolve();
                            break;
                        }
                    }
                    if (!_this.errorMessage) {
                        for (var i = 0; i < _this.preferences.length; i++) {
                            _this.preferences[i].viewModel.viewToConsumer(_this.preferences[i].consumer);
                        }
                        _this.savePreferences().then(function () {
                            _this.successMessage = "Preferences successfully saved.";
                            resolve();
                        });
                    }
                });
            });
        };
        Preferences.prototype.reset = function () {
            this.errorMessage = "";
            this.successMessage = "";
            for (var i = 0; i < this.preferences.length; i++) {
                this.preferences[i].viewModel.reset();
            }
        };
        Preferences = __decorate([
            aurelia_dependency_injection_1.singleton(),
            aurelia_dependency_injection_2.inject(browserLocalStorage_1.BrowserLocalStorage),
            __metadata("design:paramtypes", [Object])
        ], Preferences);
        return Preferences;
    }());
    exports.Preferences = Preferences;
});

//# sourceMappingURL=preferences.js.map
