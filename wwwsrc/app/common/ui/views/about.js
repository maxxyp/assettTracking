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
define(["require", "exports", "../../core/services/assetService", "aurelia-dependency-injection", "../../core/platformHelper"], function (require, exports, assetService_1, aurelia_dependency_injection_1, platformHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var About = /** @class */ (function () {
        function About(assetService) {
            this._assetService = assetService;
            this.appName = "";
            this.description = "";
            this.copyright = "";
            this.version = platformHelper_1.PlatformHelper.appVersion;
            this.buildType = platformHelper_1.PlatformHelper.buildType;
            this.additionalViewModels = [];
            this.toggleReleaseDetail(false);
        }
        About.prototype.addViewModel = function (viewModel, model) {
            this.additionalViewModels.push({ viewModel: viewModel, model: model });
        };
        About.prototype.attached = function () {
            var _this = this;
            return this._assetService.loadJson("about.json")
                .then(function (about) {
                _this.appName = about.name;
                _this.description = about.description;
                _this.copyright = about.copyright;
                if (about.releaseNotes && about.releaseNotes.length > 0) {
                    _this.releaseNotes = about.releaseNotes
                        .sort(function (rn1, rn2) { return _this.semVerCompareDesc(rn1.version, rn2.version); });
                }
            });
        };
        About.prototype.toggleReleaseDetail = function (force) {
            this.toggleReleaseDetailState = force !== undefined ? force : !this.toggleReleaseDetailState;
            this.toggleReleaseDetailIcon = this.toggleReleaseDetailState ? "minus" : "plus";
            this.toggleReleaseDetailText = this.toggleReleaseDetailState ? "Hide Detail" : "Show Detail";
        };
        About.prototype.semVerCompareDesc = function (a, b) {
            var i, diff;
            var regExStrip0 = /(\.0+)+$/;
            var segmentsA = a.replace(regExStrip0, "").split("");
            var segmentsB = b.replace(regExStrip0, "").split("");
            var l = Math.min(segmentsB.length, segmentsA.length);
            for (i = 0; i < l; i++) {
                diff = parseInt(segmentsB[i], 10) - parseInt(segmentsA[i], 10);
                if (diff) {
                    return diff;
                }
            }
            return segmentsB.length - segmentsA.length;
        };
        About = __decorate([
            aurelia_dependency_injection_1.inject(assetService_1.AssetService),
            aurelia_dependency_injection_1.singleton(),
            __metadata("design:paramtypes", [Object])
        ], About);
        return About;
    }());
    exports.About = About;
});

//# sourceMappingURL=about.js.map
