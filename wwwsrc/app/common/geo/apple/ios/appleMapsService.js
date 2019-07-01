/// <reference path="../../../../../typings/app.d.ts" />
define(["require", "exports", "../../../geo/models/geoPosition"], function (require, exports, geoPosition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppleMapsService = /** @class */ (function () {
        function AppleMapsService() {
        }
        AppleMapsService.prototype.launchMap = function (location) {
            return new Promise(function (resolve, reject) {
                var uri = "maps:?";
                if (location instanceof geoPosition_1.GeoPosition) {
                    var originGeo = location;
                    uri += "ll=" + originGeo.latitude + "," + originGeo.longitude;
                }
                else {
                    uri += "address=" + encodeURIComponent(location);
                }
                cordova.InAppBrowser.open(uri, "_system");
                resolve();
            });
        };
        AppleMapsService.prototype.launchDirections = function (origin, destination) {
            return new Promise(function (resolve, reject) {
                var uri = "maps:?";
                if (origin instanceof geoPosition_1.GeoPosition) {
                    var originGeo = origin;
                    uri += "saddr=" + originGeo.latitude + "," + originGeo.longitude;
                }
                else {
                    uri += "saddr=" + encodeURIComponent(origin || "Current Location");
                }
                uri += "&";
                if (destination instanceof geoPosition_1.GeoPosition) {
                    var desinationGeo = destination;
                    uri += "daddr=" + desinationGeo.latitude + "," + desinationGeo.longitude;
                }
                else {
                    uri += "daddr=" + encodeURIComponent(destination);
                }
                uri += "&dirflg=d";
                cordova.InAppBrowser.open(uri, "_system");
                resolve();
            });
        };
        return AppleMapsService;
    }());
    exports.AppleMapsService = AppleMapsService;
});

//# sourceMappingURL=appleMapsService.js.map
