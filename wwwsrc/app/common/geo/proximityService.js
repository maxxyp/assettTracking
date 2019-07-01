var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-dependency-injection", "../core/threading", "./gpsService", "./geoHelper"], function (require, exports, aurelia_dependency_injection_1, threading_1, gpsService_1, geoHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ProximityService = /** @class */ (function () {
        function ProximityService(gpsService) {
            this._gpsService = gpsService;
            this._distance = null;
        }
        ProximityService.prototype.startMonitoringDistance = function (destination, delay) {
            var _this = this;
            this._timerId = threading_1.Threading.startTimer(function () {
                _this._gpsService.getLocation()
                    .then(function (postion) {
                    _this._distance = geoHelper_1.GeoHelper.calculateDistance(postion.latitude, postion.longitude, destination.latitude, destination.longitude);
                }).catch(function (err) {
                });
            }, delay);
        };
        ProximityService.prototype.getDistance = function () {
            return this._distance;
        };
        ProximityService.prototype.stopMonitoringDistance = function () {
            if (this._timerId) {
                threading_1.Threading.stopTimer(this._timerId);
                this._distance = null;
                this._timerId = undefined;
            }
        };
        ProximityService = __decorate([
            aurelia_dependency_injection_1.inject(gpsService_1.GpsService),
            __metadata("design:paramtypes", [Object])
        ], ProximityService);
        return ProximityService;
    }());
    exports.ProximityService = ProximityService;
});

//# sourceMappingURL=proximityService.js.map
