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
define(["require", "exports", "aurelia-dependency-injection", "../apple/ios/appleMapsService", "../google/wua/googleMapsService"], function (require, exports, aurelia_dependency_injection_1, appleMapsService_1, googleMapsService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GeoService = /** @class */ (function () {
        function GeoService(googleMapsService, appleMapsService) {
            this._googleMapsService = googleMapsService;
            this._appleMapsService = appleMapsService;
        }
        GeoService.prototype.getDistanceTime = function (origin, destination) {
            return this._googleMapsService.getDistanceTime(origin, destination);
        };
        GeoService.prototype.launchMap = function (location) {
            return this._appleMapsService.launchMap(location);
        };
        GeoService.prototype.launchDirections = function (origin, destination) {
            return this._appleMapsService.launchDirections(origin, destination);
        };
        GeoService.prototype.getGeoPosition = function (address) {
            return this._googleMapsService.getGeoPosition(address);
        };
        GeoService = __decorate([
            aurelia_dependency_injection_1.inject(googleMapsService_1.GoogleMapsService, appleMapsService_1.AppleMapsService),
            __metadata("design:paramtypes", [Object, Object])
        ], GeoService);
        return GeoService;
    }());
    exports.GeoService = GeoService;
});

//# sourceMappingURL=geoService.js.map
