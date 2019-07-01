define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GoogleMapsServiceConstants = /** @class */ (function () {
        function GoogleMapsServiceConstants() {
        }
        GoogleMapsServiceConstants.DISTANCE_MATRIX = "maps/api/distancematrix/json?units=imperial&origins={origins}&destinations={destinations}";
        GoogleMapsServiceConstants.GEOCODING = "maps/api/geocode/json?address={address}";
        return GoogleMapsServiceConstants;
    }());
    exports.GoogleMapsServiceConstants = GoogleMapsServiceConstants;
});

//# sourceMappingURL=googleMapsServiceConstants.js.map
