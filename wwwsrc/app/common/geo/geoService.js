/// <reference path="../../../typings/app.d.ts" />
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
define(["require", "exports", "../core/platformServiceBase"], function (require, exports, platformServiceBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GeoService = /** @class */ (function (_super) {
        __extends(GeoService, _super);
        function GeoService() {
            var _this = _super.call(this, "common/geo", "GeoService") || this;
            _this._cache = {};
            return _this;
        }
        GeoService.prototype.getDistanceTime = function (origin, destination) {
            var _this = this;
            var argsHash = JSON.stringify(arguments);
            if (this._cache[argsHash]) {
                return this._cache[argsHash];
            }
            return this.loadModule().then(function (module) {
                return _this._cache[argsHash] = module.getDistanceTime(origin, destination).then(function (res) {
                    return res;
                });
            });
        };
        GeoService.prototype.launchMap = function (location) {
            return this.loadModule().then(function (module) {
                return module.launchMap(location);
            });
        };
        GeoService.prototype.launchDirections = function (origin, destination) {
            return this.loadModule().then(function (module) {
                return module.launchDirections(origin, destination);
            });
        };
        GeoService.prototype.getGeoPosition = function (address) {
            var _this = this;
            var argsHash = JSON.stringify(arguments);
            if (this._cache[argsHash]) {
                return this._cache[argsHash];
            }
            return this.loadModule().then(function (module) {
                return _this._cache[argsHash] = module.getGeoPosition(address).then(function (res) {
                    return res;
                });
            });
        };
        return GeoService;
    }(platformServiceBase_1.PlatformServiceBase));
    exports.GeoService = GeoService;
});

//# sourceMappingURL=geoService.js.map
