var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-logging", "aurelia-framework", "./catalogService", "../models/businessException", "../models/businessRules/queryableBusinessRuleGroup", "../../../common/core/services/configurationService"], function (require, exports, Logging, aurelia_framework_1, catalogService_1, businessException_1, queryableBusinessRuleGroup_1, configurationService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BusinessRuleService = /** @class */ (function () {
        function BusinessRuleService(catalogService, configurationService) {
            this._catalogService = catalogService;
            this._logger = Logging.getLogger("BusinessRuleService");
        }
        BusinessRuleService.prototype.getRuleGroup = function (ruleGroupKey) {
            var _this = this;
            return this._catalogService.getBusinessRules(ruleGroupKey)
                .then(function (data) {
                var rules = {};
                if (data) {
                    data.forEach(function (r) {
                        rules[r.id] = r.rule;
                    });
                }
                return rules;
            })
                .catch(function (exc) {
                var exception = new businessException_1.BusinessException(_this, "getRuleGroup", "Getting rule group for key '{0}'", [ruleGroupKey], exc);
                _this._logger.error(exception.toString());
                throw (exception);
            });
        };
        BusinessRuleService.prototype.getQueryableRuleGroup = function (ruleGroupKey) {
            var _this = this;
            return this._catalogService.getBusinessRules(ruleGroupKey)
                .then(function (data) {
                var ruleGroup = new queryableBusinessRuleGroup_1.QueryableBusinessRuleGroup();
                ruleGroup.code = ruleGroupKey;
                ruleGroup.rules = [];
                if (data) {
                    ruleGroup.rules = data;
                }
                return ruleGroup;
            })
                .catch(function (exc) {
                var exception = new businessException_1.BusinessException(_this, "getRuleGroup", "Getting rule group for key '{0}'", [ruleGroupKey], exc);
                _this._logger.error(exception.toString());
                throw (exception);
            });
        };
        BusinessRuleService = __decorate([
            aurelia_framework_1.inject(catalogService_1.CatalogService, configurationService_1.ConfigurationService),
            __metadata("design:paramtypes", [Object, Object])
        ], BusinessRuleService);
        return BusinessRuleService;
    }());
    exports.BusinessRuleService = BusinessRuleService;
});

//# sourceMappingURL=businessRuleService.js.map
