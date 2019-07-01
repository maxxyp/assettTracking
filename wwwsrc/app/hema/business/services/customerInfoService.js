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
define(["require", "exports", "./labelService", "../../../common/core/services/configurationService", "aurelia-dependency-injection", "../../../common/core/services/appIntegrationRegistry", "../../core/dateHelper"], function (require, exports, labelService_1, configurationService_1, aurelia_dependency_injection_1, appIntegrationRegistry_1, dateHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DEFAULT_REOPEN_EXPIRY = 30;
    var CustomerInfoService = /** @class */ (function () {
        function CustomerInfoService(configurationService, appIntegrationRegistry, labelService) {
            var config = configurationService.getConfiguration();
            this._customerInfoReOpenExpiryMinutes = config.customerInfoReOpenExpiryMinutes || DEFAULT_REOPEN_EXPIRY;
            this._customerInfoAutoLaunch = config.customerInfoAutoLaunch || false;
            this._appIntegrationRegistry = appIntegrationRegistry;
            this._labelService = labelService;
            this._lastInvocations = {};
        }
        CustomerInfoService.prototype.openAppIfNotVisited = function (premisesId, force) {
            return __awaiter(this, void 0, void 0, function () {
                var lastInvocation;
                return __generator(this, function (_a) {
                    if (!this._customerInfoAutoLaunch) {
                        return [2 /*return*/];
                    }
                    lastInvocation = this._lastInvocations[premisesId];
                    if (force
                        || !lastInvocation
                        || dateHelper_1.DateHelper.getTimestampMs() >= lastInvocation + (this._customerInfoReOpenExpiryMinutes * 60 * 1000)) {
                        return [2 /*return*/, this.launchCustomerInfo(premisesId)];
                    }
                    return [2 /*return*/];
                });
            });
        };
        CustomerInfoService.prototype.openApp = function (premisesId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.launchCustomerInfo(premisesId)];
                });
            });
        };
        CustomerInfoService.prototype.registerCustomerTipsCallback = function (callback) {
            return this._appIntegrationRegistry.customerInfo.subscribe.customerTipsComplete(callback);
        };
        CustomerInfoService.prototype.launchCustomerInfo = function (premisesId) {
            return __awaiter(this, void 0, void 0, function () {
                var labels, returnToAppText;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._labelService.getGroup("customerInfoService")];
                        case 1:
                            labels = _a.sent();
                            returnToAppText = labels && labels.customerInfoReturnToApp;
                            this._appIntegrationRegistry.customerInfo.navigateTo.premises(premisesId, {
                                returnUri: true,
                                returnUriText: returnToAppText,
                                fullScreen: true
                            });
                            this._lastInvocations[premisesId] = dateHelper_1.DateHelper.getTimestampMs();
                            return [2 /*return*/];
                    }
                });
            });
        };
        CustomerInfoService = __decorate([
            aurelia_dependency_injection_1.inject(configurationService_1.ConfigurationService, appIntegrationRegistry_1.AppIntegrationRegistry, labelService_1.LabelService),
            __metadata("design:paramtypes", [Object, Object, Object])
        ], CustomerInfoService);
        return CustomerInfoService;
    }());
    exports.CustomerInfoService = CustomerInfoService;
});

//# sourceMappingURL=customerInfoService.js.map
