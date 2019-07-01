/// <reference path="../../../../typings/app.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "./jobService", "../models/propertyGasSafetyDetail", "../models/businessException", "../models/propertyElectricalSafetyDetail", "../models/propertyUnsafeDetail", "./businessRuleService", "../models/unsafeReason", "../../../common/core/objectHelper", "../../../common/core/stringHelper", "../../common/dataStateManager"], function (require, exports, aurelia_framework_1, jobService_1, propertyGasSafetyDetail_1, businessException_1, propertyElectricalSafetyDetail_1, propertyUnsafeDetail_1, businessRuleService_1, unsafeReason_1, objectHelper_1, stringHelper_1, dataStateManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PropertySafetyService = /** @class */ (function () {
        function PropertySafetyService(jobService, businessRuleService, dataStateManager) {
            this._jobService = jobService;
            this._businessRuleService = businessRuleService;
            this._dataStateManager = dataStateManager;
        }
        PropertySafetyService.prototype.getPropertySafetyDetails = function (jobId) {
            return this._jobService.getJob(jobId).then(function (job) {
                return job.propertySafety;
            });
        };
        PropertySafetyService.prototype.saveGasSafetyDetails = function (jobId, safetyDetail, unsafeDetail) {
            var _this = this;
            return this._jobService.getJob(jobId).then(function (job) {
                if (job) {
                    if (!job.propertySafety.propertyGasSafetyDetail) {
                        job.propertySafety.propertyGasSafetyDetail = new propertyGasSafetyDetail_1.PropertyGasSafetyDetail();
                    }
                    if (!job.propertySafety.propertyUnsafeDetail) {
                        job.propertySafety.propertyUnsafeDetail = new propertyUnsafeDetail_1.PropertyUnsafeDetail();
                    }
                    Object.assign(job.propertySafety.propertyGasSafetyDetail, safetyDetail);
                    Object.assign(job.propertySafety.propertyUnsafeDetail, unsafeDetail);
                    return _this._jobService.setJob(job)
                        .catch(function () {
                        throw new businessException_1.BusinessException(_this, "saveGasSafetyDetails", "error saving property gas safety detail", null, null);
                    });
                }
                else {
                    throw new businessException_1.BusinessException(_this, "saveGasSafetyDetails", "no current job selected", null, null);
                }
            });
        };
        PropertySafetyService.prototype.saveElectricalSafetyDetails = function (jobId, safetyDetail, unsafeDetail) {
            var _this = this;
            return this._jobService.getJob(jobId).then(function (job) {
                if (job) {
                    if (!job.propertySafety.propertyElectricalSafetyDetail) {
                        job.propertySafety.propertyElectricalSafetyDetail = new propertyElectricalSafetyDetail_1.PropertyElectricalSafetyDetail();
                    }
                    Object.assign(job.propertySafety.propertyElectricalSafetyDetail, safetyDetail);
                    if (!job.propertySafety.propertyUnsafeDetail) {
                        job.propertySafety.propertyUnsafeDetail = new propertyUnsafeDetail_1.PropertyUnsafeDetail();
                    }
                    Object.assign(job.propertySafety.propertyUnsafeDetail, unsafeDetail);
                    return _this._dataStateManager.updateAppliancesDataState(job)
                        .then(function () { return _this._jobService.setJob(job); })
                        .catch(function () {
                        throw new businessException_1.BusinessException(_this, "saveElectricalSafetyDetails", "error saving electrical safety detail", null, null);
                    });
                }
                else {
                    throw new businessException_1.BusinessException(_this, "saveElectricalSafetyDetails", "no current job selected", null, null);
                }
            });
        };
        PropertySafetyService.prototype.populateGasUnsafeReasons = function (pressureDrop, gasMeterInstallationSatisfactorySelected, pressureDropThreshold, installationSatisfactoryNoType, installationSatisfactoryNoMeterType) {
            var _this = this;
            return this.loadBusinessRules()
                .then(function () {
                var reasons = [];
                if (pressureDrop && pressureDrop > pressureDropThreshold) {
                    reasons.push(_this.createUnsafeReason("pressureDropGreater8", [pressureDropThreshold]));
                }
                else if (pressureDrop && pressureDrop < pressureDropThreshold) {
                    reasons.push(_this.createUnsafeReason("pressureDropLess8", [pressureDropThreshold], false));
                }
                if (gasMeterInstallationSatisfactorySelected
                    && ((gasMeterInstallationSatisfactorySelected === installationSatisfactoryNoType)
                        || (gasMeterInstallationSatisfactorySelected === installationSatisfactoryNoMeterType))) {
                    reasons.push(_this.createUnsafeReason("gasMeterInstallation", []));
                }
                return reasons;
            });
        };
        PropertySafetyService.prototype.populateElectricalUnsafeReasons = function (safetyDetail, unableToCheckSystemType, ttSystemType, rcdPresentThreshold, safeInTopsThreshold) {
            var _this = this;
            return this.loadBusinessRules()
                .then(function () {
                var reasons = [];
                if (safetyDetail) {
                    if (safetyDetail.consumerUnitSatisfactory === false) {
                        reasons.push(_this.createUnsafeReason("consumerUnit", []));
                    }
                    if (safetyDetail.systemType === unableToCheckSystemType) {
                        reasons.push(_this.createUnsafeReason("systemType", []));
                    }
                    if (safetyDetail.noEliReadings && safetyDetail.noEliReadings === true) {
                        reasons.push(_this.createUnsafeReason("noElectricalEliReading", []));
                    }
                    else {
                        if (safetyDetail.systemType === ttSystemType) {
                            if (safetyDetail.rcdPresent !== undefined) {
                                if (safetyDetail.rcdPresent === "Y") {
                                    if (safetyDetail.eliReading > rcdPresentThreshold) {
                                        reasons.push(_this.createUnsafeReason("rcdGreater200", []));
                                    }
                                }
                                else {
                                    reasons.push(_this.createUnsafeReason("rcdNotPresent", []));
                                }
                            }
                        }
                        else {
                            if (safetyDetail.eliReading > safeInTopsThreshold && safetyDetail.eliSafeAccordingToTops === false) {
                                reasons.push(_this.createUnsafeReason("topsReadingSafe", []));
                            }
                        }
                    }
                }
                return reasons;
            });
        };
        PropertySafetyService.prototype.createUnsafeReason = function (lookupId, params, isMandatory) {
            if (isMandatory === void 0) { isMandatory = true; }
            return new unsafeReason_1.UnsafeReason(lookupId, this._businessRules.getBusinessRule(lookupId), params, isMandatory);
        };
        PropertySafetyService.prototype.loadBusinessRules = function () {
            var _this = this;
            return this._businessRules ? Promise.resolve() : this._businessRuleService.getQueryableRuleGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(this)))
                .then(function (group) {
                _this._businessRules = group;
            });
        };
        PropertySafetyService = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, businessRuleService_1.BusinessRuleService, dataStateManager_1.DataStateManager),
            __metadata("design:paramtypes", [Object, Object, Object])
        ], PropertySafetyService);
        return PropertySafetyService;
    }());
    exports.PropertySafetyService = PropertySafetyService;
});

//# sourceMappingURL=propertySafetyService.js.map
