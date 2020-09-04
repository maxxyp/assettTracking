/// <reference path="../../../../typings/app.d.ts" />
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
define(["require", "exports", "../../core/platformServiceBase"], function (require, exports, platformServiceBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GoogleMapsService = /** @class */ (function (_super) {
        __extends(GoogleMapsService, _super);
        function GoogleMapsService() {
            return _super.call(this, "common/geo/google", "GoogleMapsService") || this;
        }
        GoogleMapsService.prototype.getDistanceTime = function (origin, destination) {
            return this.loadModule().then(function (module) {
                return module.getDistanceTime(origin, destination);
            });
        };
        GoogleMapsService.prototype.launchMap = function (location) {
            return this.loadModule().then(function (module) {
                return module.launchMap(location);
            });
        };
        GoogleMapsService.prototype.launchDirections = function (origin, destination) {
            return this.loadModule().then(function (module) {
                return module.launchDirections(origin, destination);
            });
        };
        GoogleMapsService.prototype.getGeoPosition = function (address) {
            return this.loadModule().then(function (module) {
                return module.getGeoPosition(address);
            });
        };
        return GoogleMapsService;
    }(platformServiceBase_1.PlatformServiceBase));
    exports.GoogleMapsService = GoogleMapsService;
});

//# sourceMappingURL=googleMapsService.js.map