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
define(["require", "exports", "aurelia-dependency-injection", "../bing/wua/bingMapsService", "../google/wua/googleMapsService"], function (require, exports, aurelia_dependency_injection_1, bingMapsService_1, googleMapsService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GeoService = /** @class */ (function () {
        function GeoService(googleMapsService, bingMapsService) {
            this._googleMapsService = googleMapsService;
            this._bingMapsService = bingMapsService;
        }
        GeoService.prototype.getDistanceTime = function (origin, destination) {
            return this._googleMapsService.getDistanceTime(origin, destination);
        };
        GeoService.prototype.launchMap = function (location) {
            return this._bingMapsService.launchMap(location);
        };
        GeoService.prototype.launchDirections = function (origin, destination) {
            return this._bingMapsService.launchDirections(origin, destination);
        };
        GeoService.prototype.getGeoPosition = function (address) {
            return this._googleMapsService.getGeoPosition(address);
        };
        GeoService = __decorate([
            aurelia_dependency_injection_1.inject(googleMapsService_1.GoogleMapsService, bingMapsService_1.BingMapsService),
            __metadata("design:paramtypes", [Object, Object])
        ], GeoService);
        return GeoService;
    }());
    exports.GeoService = GeoService;
});

//# sourceMappingURL=geoService.js.map
