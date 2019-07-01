/// <reference path="../../../../../typings/app.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
define(["require", "exports", "aurelia-dependency-injection", "aurelia-http-client", "./constants/googleMapsServiceConstants", "../../../core/services/configurationService", "../../../geo/models/geoPosition", "../../../core/urlParamService", "../../models/distanceTime", "../../../core/models/baseException"], function (require, exports, aurelia_dependency_injection_1, aurelia_http_client_1, googleMapsServiceConstants_1, configurationService_1, geoPosition_1, urlParamService_1, distanceTime_1, baseException_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GOOGLE_MAPS_URI = "https://maps.googleapis.com/";
    var KEY_QS = "&key=";
    var GoogleMapsService = /** @class */ (function () {
        function GoogleMapsService(configurationService, httpClient) {
            this._configuration = configurationService.getConfiguration();
            this._httpClient = httpClient;
        }
        GoogleMapsService.prototype.getDistanceTime = function (origin, destination) {
            var _this = this;
            if (origin && destination) {
                var finalOrigin = void 0;
                var finalDestination = void 0;
                if (origin instanceof geoPosition_1.GeoPosition) {
                    var originGeo = origin;
                    finalOrigin = originGeo.latitude + "," + originGeo.longitude;
                }
                else {
                    finalOrigin = origin;
                }
                if (destination instanceof geoPosition_1.GeoPosition) {
                    var desinationGeo = destination;
                    finalDestination = desinationGeo.latitude + "," + desinationGeo.longitude;
                }
                else {
                    finalDestination = destination;
                }
                var endPointWithVariables = urlParamService_1.UrlParamService.getParamEndpoint(googleMapsServiceConstants_1.GoogleMapsServiceConstants.DISTANCE_MATRIX, {
                    "origins": finalOrigin,
                    "destinations": finalDestination
                });
                endPointWithVariables += KEY_QS + this._configuration.googleClientKey;
                endPointWithVariables = GOOGLE_MAPS_URI + endPointWithVariables;
                return this._httpClient.get(endPointWithVariables)
                    .then(function (res) {
                    var response = JSON.parse(res.response);
                    var dt = new distanceTime_1.DistanceTime();
                    if (response && response.rows && response.rows.length > 0) {
                        if (response.rows[0].elements && response.rows[0].elements.length > 0) {
                            if (response.rows[0].elements[0].distance) {
                                dt.distanceInMetres = response.rows[0].elements[0].distance.value;
                            }
                            if (response.rows[0].elements[0].duration) {
                                dt.timeInSeconds = response.rows[0].elements[0].duration.value;
                            }
                        }
                    }
                    return dt;
                })
                    .catch(function (err) {
                    throw new baseException_1.BaseException(_this, "getDistanceTime", "Unable to call distancematrix API", undefined, err);
                });
            }
            else {
                return Promise.resolve(null);
            }
        };
        GoogleMapsService.prototype.launchMap = function (location) {
            return new Promise(function (resolve, reject) {
                reject("Not supported");
            });
        };
        GoogleMapsService.prototype.launchDirections = function (origin, destination) {
            return new Promise(function (resolve, reject) {
                reject("Not supported");
            });
        };
        GoogleMapsService.prototype.getGeoPosition = function (address) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var endPointWithVariables;
                return __generator(this, function (_a) {
                    if (address) {
                        endPointWithVariables = urlParamService_1.UrlParamService.getParamEndpoint(googleMapsServiceConstants_1.GoogleMapsServiceConstants.GEOCODING, {
                            "address": address,
                        });
                        endPointWithVariables += KEY_QS + this._configuration.googleClientKey;
                        endPointWithVariables = GOOGLE_MAPS_URI + endPointWithVariables;
                        return [2 /*return*/, this._httpClient.get(endPointWithVariables)
                                .then(function (res) {
                                var response = JSON.parse(res.response);
                                var geoPosition = new geoPosition_1.GeoPosition(0, 0);
                                if (response && response.results && response.results.length > 0
                                    && response.results[0] && response.results[0].geometry && response.results[0].geometry.location) {
                                    geoPosition.latitude = response.results[0].geometry.location.lat || 0;
                                    geoPosition.longitude = response.results[0].geometry.location.lng || 0;
                                }
                                return geoPosition;
                            })
                                .catch(function (err) {
                                throw new baseException_1.BaseException(_this, "getGeoPosition", "Unable to call geocoding API", undefined, err);
                            })];
                    }
                    else {
                        return [2 /*return*/, Promise.resolve(null)];
                    }
                    return [2 /*return*/];
                });
            });
        };
        GoogleMapsService = __decorate([
            aurelia_dependency_injection_1.inject(configurationService_1.ConfigurationService, aurelia_http_client_1.HttpClient),
            __metadata("design:paramtypes", [Object, aurelia_http_client_1.HttpClient])
        ], GoogleMapsService);
        return GoogleMapsService;
    }());
    exports.GoogleMapsService = GoogleMapsService;
});

//# sourceMappingURL=googleMapsService.js.map
