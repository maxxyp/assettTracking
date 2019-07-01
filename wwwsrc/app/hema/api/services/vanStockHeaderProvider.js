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
define(["require", "exports", "aurelia-dependency-injection", "../../../common/geo/gpsService", "../../business/services/engineerService", "../../../common/core/guid", "../../business/services/storageService", "../../../common/geo/geoService", "../../business/services/jobCacheService", "../../business/models/jobState"], function (require, exports, aurelia_dependency_injection_1, gpsService_1, engineerService_1, guid_1, storageService_1, geoService_1, jobCacheService_1, jobState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DUMMY_GEOPOSTION = { latitude: 0, longitude: 0 };
    var VanStockHeaderProvider = /** @class */ (function () {
        function VanStockHeaderProvider(gpsService, engineerService, storageService, geoService, jobCacheService) {
            this._gpsService = gpsService;
            this._engineerService = engineerService;
            this._storageService = storageService;
            this._geoService = geoService;
            this._jobCacheService = jobCacheService;
        }
        VanStockHeaderProvider.prototype.setStaticHeaders = function (staticHeaders) {
            this._staticHeaders = staticHeaders;
        };
        VanStockHeaderProvider.prototype.getHeaders = function (routeName) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var headers, isSignedOn, error_1, location, result, getJobPostCode, postCode, geoPosition, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            headers = (this._staticHeaders || []).slice(0);
                            headers.push({ name: "X-Request-ID", value: guid_1.Guid.newGuid() });
                            isSignedOn = false;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this._engineerService.getCurrentEngineer()];
                        case 2:
                            isSignedOn = (_a.sent()).isSignedOn;
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            return [3 /*break*/, 4];
                        case 4:
                            headers.push({ name: "X-Engineer-Status", value: isSignedOn.toString() });
                            location = DUMMY_GEOPOSTION;
                            _a.label = 5;
                        case 5:
                            _a.trys.push([5, 11, , 12]);
                            return [4 /*yield*/, this._gpsService.getLocation()];
                        case 6:
                            result = _a.sent();
                            if (result && result.latitude !== undefined && result.longitude !== undefined) {
                                location = result;
                                this._storageService.setLastKnownLocation(location);
                            }
                            if (!(location === DUMMY_GEOPOSTION)) return [3 /*break*/, 10];
                            result = this._storageService.getLastKnownLocation();
                            if (!(result && result.latitude !== undefined && result.longitude !== undefined)) return [3 /*break*/, 7];
                            location = result;
                            return [3 /*break*/, 10];
                        case 7:
                            getJobPostCode = function () { return __awaiter(_this, void 0, void 0, function () {
                                var jobsToDo, liveJob, liveJobs, attendedJob, job;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._jobCacheService.getJobsToDo()];
                                        case 1:
                                            jobsToDo = (_a.sent()) || [];
                                            liveJob = jobsToDo.find(function (x) { return x.state === jobState_1.JobState.arrived; });
                                            liveJobs = jobsToDo.filter(function (x) { return x.state !== jobState_1.JobState.done; }) || [];
                                            attendedJob = jobsToDo.filter(function (x) { return x.state === jobState_1.JobState.done; }) || [];
                                            job = liveJob ? liveJob : liveJobs.length && liveJobs[0] || attendedJob.length && attendedJob[0];
                                            return [2 /*return*/, job && job.customerAddress && job.customerAddress.postCode || undefined];
                                    }
                                });
                            }); };
                            return [4 /*yield*/, getJobPostCode()];
                        case 8:
                            postCode = _a.sent();
                            if (!postCode) return [3 /*break*/, 10];
                            return [4 /*yield*/, this._geoService.getGeoPosition(postCode)];
                        case 9:
                            geoPosition = _a.sent();
                            if (geoPosition && geoPosition.latitude && geoPosition.longitude) {
                                location = geoPosition;
                                this._storageService.setLastKnownLocation(location);
                            }
                            _a.label = 10;
                        case 10: return [3 /*break*/, 12];
                        case 11:
                            error_2 = _a.sent();
                            return [3 /*break*/, 12];
                        case 12:
                            headers.push({ name: "X-Engineer-Lat", value: location.latitude.toString() }, { name: "X-Engineer-Lon", value: location.longitude.toString() });
                            return [2 /*return*/, headers];
                    }
                });
            });
        };
        VanStockHeaderProvider = __decorate([
            aurelia_dependency_injection_1.inject(gpsService_1.GpsService, engineerService_1.EngineerService, storageService_1.StorageService, geoService_1.GeoService, jobCacheService_1.JobCacheService),
            __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
        ], VanStockHeaderProvider);
        return VanStockHeaderProvider;
    }());
    exports.VanStockHeaderProvider = VanStockHeaderProvider;
});

//# sourceMappingURL=vanStockHeaderProvider.js.map
