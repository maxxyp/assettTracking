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
define(["require", "exports", "aurelia-dependency-injection", "../../../common/resilience/services/resilientService", "../../../common/core/services/configurationService", "./storageService", "aurelia-event-aggregator", "../../../common/resilience/services/resilientHttpClientFactory", "../../../common/core/wuaNetworkDiagnostics", "../../../common/resilience/apiException", "../models/businessException", "../../api/services/vanStockHeaderProvider", "aurelia-logging"], function (require, exports, aurelia_dependency_injection_1, resilientService_1, configurationService_1, storageService_1, aurelia_event_aggregator_1, resilientHttpClientFactory_1, wuaNetworkDiagnostics_1, apiException_1, businessException_1, vanStockHeaderProvider_1, Logging) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FeatureToggleService = /** @class */ (function (_super) {
        __extends(FeatureToggleService, _super);
        function FeatureToggleService(configurationService, storageService, eventAggregator, headerProvider, resilientClientFactory, wuaNetworkDiagnostics) {
            var _this = _super.call(this, configurationService, "assetTrackingEndpoint", storageService, eventAggregator, headerProvider, resilientClientFactory, wuaNetworkDiagnostics) || this;
            _this._initialised = false;
            _this._storage = storageService;
            _this._log = Logging.getLogger("featureToggleService");
            return _this;
        }
        FeatureToggleService.prototype.initialise = function (engineerId) {
            return __awaiter(this, void 0, void 0, function () {
                var items, data, error_1, statusCode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // prevent duplicate calls of initialise, developer should only call this once
                            if (this._initialised) {
                                this._log.warn("initialise should only be called once");
                                return [2 /*return*/, Promise.resolve()];
                            }
                            if (engineerId === undefined || engineerId === null || engineerId === "") {
                                throw new businessException_1.BusinessException(this, "initialise", "empty engineer id", null, null);
                            }
                            this._isAssetTrackingEnabled = false;
                            this._initialised = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this._storage.getMaterials()];
                        case 2:
                            items = _a.sent();
                            if (items) {
                                this._log.info("asset tracking materials already in local storage, asset tracking enabled!");
                                this._isAssetTrackingEnabled = true;
                                return [2 /*return*/, Promise.resolve()];
                            }
                            return [4 /*yield*/, this.getData("materials", { engineerId: this.convertEngineerId(engineerId) })];
                        case 3:
                            data = _a.sent();
                            if (data) {
                                this._log.info("asset tracking materials endpoint returned materials, asset tracking enabled!");
                                this._isAssetTrackingEnabled = true;
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            this._log.warn("asset tracking materials endpoint failed");
                            //  no local materials data, check response of api call to get materials, 404 status implies not asset tracked
                            if (error_1 && error_1 instanceof apiException_1.ApiException) {
                                statusCode = error_1.httpStatusCode;
                                if (!!statusCode && statusCode.indexOf("404") >= 0) {
                                    this._log.warn("materials endpoint returned 404, asset tracking disabled");
                                }
                                else {
                                    this._log.error("materials endpoint error", error_1);
                                }
                            }
                            else {
                                this._log.error("problem getting materials", error_1);
                            }
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        FeatureToggleService.prototype.isAssetTrackingEnabled = function () {
            if (!this._initialised) {
                throw new businessException_1.BusinessException(this, "isAssetTrackingEnabled", "Initialisation has not been ran, call initialise method before calling isAssetTrackingEnabled", null, null);
            }
            return this._isAssetTrackingEnabled;
        };
        FeatureToggleService.prototype.convertEngineerId = function (input) {
            // return parseInt((input || "").replace(/\D/g, ""), 10);
            return input;
        };
        FeatureToggleService = __decorate([
            aurelia_dependency_injection_1.inject(configurationService_1.ConfigurationService, storageService_1.StorageService, aurelia_event_aggregator_1.EventAggregator, vanStockHeaderProvider_1.VanStockHeaderProvider, resilientHttpClientFactory_1.ResilientHttpClientFactory, wuaNetworkDiagnostics_1.WuaNetworkDiagnostics),
            __metadata("design:paramtypes", [Object, Object, aurelia_event_aggregator_1.EventAggregator, Object, resilientHttpClientFactory_1.ResilientHttpClientFactory,
                wuaNetworkDiagnostics_1.WuaNetworkDiagnostics])
        ], FeatureToggleService);
        return FeatureToggleService;
    }(resilientService_1.ResilientService));
    exports.FeatureToggleService = FeatureToggleService;
});

//# sourceMappingURL=featureToggleService.js.map
