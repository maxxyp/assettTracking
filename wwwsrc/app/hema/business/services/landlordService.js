var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "./jobService", "../models/businessException", "./businessRuleService", "../factories/landlordFactory", "./engineerService", "./applianceService"], function (require, exports, aurelia_framework_1, jobService_1, businessException_1, businessRuleService_1, landlordFactory_1, engineerService_1, applianceService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LandlordService = /** @class */ (function () {
        function LandlordService(jobService, businessRuleService, engineerService, landlordFactory, applianceService) {
            this._jobService = jobService;
            this._businessRuleService = businessRuleService;
            this._landlordFactory = landlordFactory;
            this._engineerService = engineerService;
            this._applianceService = applianceService;
        }
        LandlordService.prototype.getLandlordSafetyCertificate = function (jobId) {
            var _this = this;
            return Promise.all([
                this._businessRuleService.getQueryableRuleGroup("landlordSafetyCertificate"),
                this._jobService.getJob(jobId),
                this._engineerService.getCurrentEngineer(),
                this._applianceService.getAppliancesForLandlordsCertificate(jobId)
            ])
                .then(function (_a) {
                var ruleGroup = _a[0], job = _a[1], engineer = _a[2], appliances = _a[3];
                if (!job) {
                    throw new businessException_1.BusinessException(_this, "landlordService.getLandlordSafetyCertificate", "no current job selected", null, null);
                }
                if (!ruleGroup || !ruleGroup.rules || ruleGroup.rules.length < 1) {
                    throw new businessException_1.BusinessException(_this, "landlordService.getLandlordSafetyCertificate", "no business rules available", null, null);
                }
                return _this._landlordFactory.createLandlordSafetyCertificate(job, engineer, ruleGroup, appliances);
            })
                .catch(function (ex) {
                throw new businessException_1.BusinessException(_this, "landlordService", "could not get landlord safety certificate", null, ex);
            });
        };
        LandlordService = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, businessRuleService_1.BusinessRuleService, engineerService_1.EngineerService, landlordFactory_1.LandlordFactory, applianceService_1.ApplianceService),
            __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
        ], LandlordService);
        return LandlordService;
    }());
    exports.LandlordService = LandlordService;
});

//# sourceMappingURL=landlordService.js.map
