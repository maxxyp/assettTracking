/// <reference path="../../../../../typings/app.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../../httpClient", "../../platformHelper"], function (require, exports, aurelia_framework_1, httpClient_1, platformHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AssetService = /** @class */ (function () {
        function AssetService(httpClient) {
            this._httpClient = httpClient;
        }
        AssetService.prototype.loadText = function (assetName) {
            var _this = this;
            return new Promise(function (resolve) {
                _this._httpClient.fetch(platformHelper_1.PlatformHelper.loaderPrefix + "./assets/" + assetName)
                    .then(function (response) { return response.text(); })
                    .then(function (text) {
                    resolve(text);
                }).catch(function () {
                    resolve(null);
                });
            });
        };
        AssetService.prototype.loadArrayBuffer = function (assetName) {
            var _this = this;
            return new Promise(function (resolve) {
                _this._httpClient.fetch(platformHelper_1.PlatformHelper.loaderPrefix + "./assets/" + assetName)
                    .then(function (response) { return response.arrayBuffer(); })
                    .then(function (arrayBuffer) {
                    resolve(arrayBuffer);
                })
                    .catch(function () {
                    resolve(null);
                });
            });
        };
        AssetService.prototype.loadJson = function (assetName) {
            var _this = this;
            return new Promise(function (resolve) {
                _this._httpClient.fetch(platformHelper_1.PlatformHelper.loaderPrefix + "./assets/" + assetName)
                    .then(function (response) { return response.json(); })
                    .then(function (json) {
                    resolve(json);
                })
                    .catch(function () {
                    resolve(null);
                });
            });
        };
        AssetService = __decorate([
            aurelia_framework_1.inject(httpClient_1.HttpClient),
            __metadata("design:paramtypes", [Object])
        ], AssetService);
        return AssetService;
    }());
    exports.AssetService = AssetService;
});

//# sourceMappingURL=assetService.js.map
