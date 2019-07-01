var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-logging", "aurelia-framework", "./catalogService", "../models/businessException", "../../../common/core/services/configurationService"], function (require, exports, Logging, aurelia_framework_1, catalogService_1, businessException_1, configurationService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LabelService = /** @class */ (function () {
        function LabelService(catalogService, configurationService) {
            this._catalogService = catalogService;
            this._logger = Logging.getLogger("LabelService");
        }
        LabelService.prototype.getGroup = function (groupKey) {
            var _this = this;
            return this.loadCommon().then(function () {
                return _this.loadGroup(groupKey).then(function (group) {
                    return Object.assign({}, _this._common, group);
                });
            });
        };
        LabelService.prototype.getGroupWithoutCommon = function (groupKey) {
            return this.loadGroup(groupKey);
        };
        LabelService.prototype.loadGroup = function (groupKey) {
            var _this = this;
            return this._catalogService.getLabels(groupKey)
                .then(function (data) {
                var labels = {};
                if (data) {
                    data.forEach(function (l) {
                        labels[l.id] = l.label;
                    });
                }
                return labels;
            })
                .catch(function (exc) {
                var exception = new businessException_1.BusinessException(_this, "getGroup", "Getting group for key '{0}'", [groupKey], exc);
                _this._logger.error(exception.toString());
                throw (exception);
            });
        };
        LabelService.prototype.loadCommon = function () {
            var _this = this;
            return this._common ? Promise.resolve(this._common) :
                this.loadGroup("common")
                    .then(function (common) {
                    _this._common = common;
                    return _this._common;
                });
        };
        LabelService = __decorate([
            aurelia_framework_1.inject(catalogService_1.CatalogService, configurationService_1.ConfigurationService),
            __metadata("design:paramtypes", [Object, Object])
        ], LabelService);
        return LabelService;
    }());
    exports.LabelService = LabelService;
});

//# sourceMappingURL=labelService.js.map
