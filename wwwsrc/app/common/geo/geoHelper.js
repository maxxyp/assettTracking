var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "../core/platformHelper"], function (require, exports, platformHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GeoHelper = /** @class */ (function () {
        function GeoHelper() {
        }
        GeoHelper.isPostCodeValid = function (postCode) {
            var patternCheck = new RegExp("^(?:(?:[A-PR-UWYZ][0-9]{1,2}|[A-PR-UWYZ][A-HK-Y][0-9]{1,2}|[A-PR-UWYZ]" +
                "[0-9][A-HJKSTUW]|[A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRV-Y]) [0-9][ABD-HJLNP-UW-Z]{2}|GIR 0AA)$", "gi");
            if (patternCheck.test(postCode)) {
                return true;
            }
            return false;
        };
        GeoHelper.formatPostCode = function (postCode) {
            var formattedPostCode = null;
            var pc = postCode.toUpperCase().replace(/\s/g, "");
            if (pc.length >= 5 && pc.length <= 7) {
                var pattern = "";
                var patterns = [];
                patterns.push("A9 9AA");
                patterns.push("A9A 9AA");
                patterns.push("A99 9AA");
                patterns.push("AA9 9AA");
                patterns.push("AA9A 9AA");
                patterns.push("AA99 9AA");
                for (var i = 0; i < pc.length; i++) {
                    if (/[A-Z]/.test(pc[i])) {
                        pattern += "A";
                    }
                    else if (/[0-9]/.test(pc[i])) {
                        pattern += "9";
                    }
                }
                var idx = -1;
                for (var k = 0; k < patterns.length && idx === -1; k++) {
                    if (patterns[k].replace(/\s/, "") === pattern) {
                        idx = k;
                    }
                }
                if (idx >= 0) {
                    var matchedPattern = patterns[idx];
                    var pcIdx = 0;
                    formattedPostCode = "";
                    for (var j = 0; j < matchedPattern.length; j++) {
                        if (matchedPattern[j] === "A" || matchedPattern[j] === "9") {
                            formattedPostCode += pc[pcIdx++];
                        }
                        else {
                            formattedPostCode += " ";
                        }
                    }
                }
            }
            return formattedPostCode;
        };
        GeoHelper.calculateDistance = function (lat1, lon1, lat2, lon2) {
            var R = 6371; // km
            var dLat = GeoHelper.deg2Rad(lat2 - lat1);
            var dLon = GeoHelper.deg2Rad(lon2 - lon1);
            lat1 = this.deg2Rad(lat1);
            lat2 = this.deg2Rad(lat2);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };
        GeoHelper.isLocationEnabled = function () {
            return __awaiter(this, void 0, void 0, function () {
                var accessStatus, accessStatuses;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (platformHelper_1.PlatformHelper.getPlatform() !== "wua") {
                                return [2 /*return*/, true];
                            }
                            return [4 /*yield*/, Windows.Devices.Geolocation.Geolocator.requestAccessAsync()];
                        case 1:
                            accessStatus = _a.sent();
                            accessStatuses = Windows.Devices.Geolocation.GeolocationAccessStatus;
                            switch (accessStatus) {
                                case accessStatuses.allowed:
                                    return [2 /*return*/, true];
                                case accessStatuses.denied:
                                    return [2 /*return*/, false];
                                case accessStatuses.unspecified:
                                    return [2 /*return*/, false];
                                default:
                                    return [2 /*return*/, false];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        GeoHelper.deg2Rad = function (degrees) {
            return degrees * Math.PI / 180;
        };
        return GeoHelper;
    }());
    exports.GeoHelper = GeoHelper;
});

//# sourceMappingURL=geoHelper.js.map
