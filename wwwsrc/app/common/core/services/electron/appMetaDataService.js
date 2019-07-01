var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../assetService"], function (require, exports, aurelia_framework_1, assetService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppMetaDataService = /** @class */ (function () {
        function AppMetaDataService(assetService) {
            this._assetService = assetService;
        }
        AppMetaDataService.prototype.get = function () {
            return this._assetService.loadJson("about.json")
                .then(function (aboutData) {
                return {
                    appName: aboutData.name,
                    appId: aboutData.name,
                    appVersion: window.appVersion,
                    appInstallerId: aboutData.name,
                    env: window.appBuildType
                };
            });
        };
        AppMetaDataService = __decorate([
            aurelia_framework_1.inject(assetService_1.AssetService),
            __metadata("design:paramtypes", [Object])
        ], AppMetaDataService);
        return AppMetaDataService;
    }());
    exports.AppMetaDataService = AppMetaDataService;
});

//# sourceMappingURL=appMetaDataService.js.map
