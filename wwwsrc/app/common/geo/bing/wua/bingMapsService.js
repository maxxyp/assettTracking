/// <reference path="../../../../../typings/app.d.ts" />
define(["require", "exports", "../../../geo/models/geoPosition"], function (require, exports, geoPosition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BingMapsService = /** @class */ (function () {
        function BingMapsService() {
        }
        BingMapsService.prototype.launchMap = function (location) {
            return new Promise(function (resolve, reject) {
                var uri = "bingmaps:?";
                if (location instanceof geoPosition_1.GeoPosition) {
                    var originGeo = location;
                    uri += "cp=" + originGeo.latitude + "~" + originGeo.longitude;
                }
                else {
                    uri += "where=" + encodeURIComponent(location);
                }
                window.Windows.System.Launcher.launchUriAsync(new window.Windows.Foundation.Uri(uri));
                resolve();
            });
        };
        BingMapsService.prototype.launchDirections = function (origin, destination) {
            return new Promise(function (resolve, reject) {
                var uri = "bingmaps:?rtp=";
                if (origin instanceof geoPosition_1.GeoPosition) {
                    var originGeo = origin;
                    uri += "pos." + originGeo.latitude + "_" + originGeo.longitude;
                }
                else {
                    uri += "adr." + encodeURIComponent(origin);
                }
                uri += "~";
                if (destination instanceof geoPosition_1.GeoPosition) {
                    var desinationGeo = destination;
                    uri += "pos." + desinationGeo.latitude + "_" + desinationGeo.longitude;
                }
                else {
                    uri += "adr." + encodeURIComponent(destination);
                }
                uri += "&mode=d";
                window.Windows.System.Launcher.launchUriAsync(new window.Windows.Foundation.Uri(uri));
                resolve();
            });
        };
        return BingMapsService;
    }());
    exports.BingMapsService = BingMapsService;
});

//# sourceMappingURL=bingMapsService.js.map
