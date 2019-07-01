var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "./jobService", "../models/businessException", "../../../common/core/guid", "./applianceService", "../../../hema/core/dateHelper", "../models/dataState"], function (require, exports, aurelia_framework_1, jobService_1, businessException_1, guid_1, applianceService_1, dateHelper_1, dataState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RiskService = /** @class */ (function () {
        function RiskService(jobService) {
            this._jobService = jobService;
        }
        RiskService.prototype.getRisks = function (jobId) {
            var _this = this;
            return this._jobService.getJob(jobId).then(function (job) {
                return job.risks;
            }).catch(function (ex) {
                throw new businessException_1.BusinessException(_this, "risks", "could not get risks", null, ex);
            });
        };
        RiskService.prototype.getRisk = function (jobId, riskId) {
            var _this = this;
            return this._jobService.getJob(jobId).then(function (job) {
                if (job) {
                    var idx = (job.risks || []).findIndex(function (r) { return r.id === riskId; });
                    if (idx >= 0) {
                        return job.risks[idx];
                    }
                    else {
                        throw new businessException_1.BusinessException(_this, "risks", "risk does not exist '{0}' for job '{1}'", [riskId, jobId], null);
                    }
                }
                else {
                    throw new businessException_1.BusinessException(_this, "risks", "no current job selected '{0}'", [jobId], null);
                }
            });
        };
        RiskService.prototype.updateRisk = function (jobId, risk) {
            var _this = this;
            return this._jobService.getJob(jobId).then(function (job) {
                if (job) {
                    var idx = (job.risks || []).findIndex(function (r) { return r.id === risk.id; });
                    if (idx >= 0) {
                        risk.isUpdated = true;
                        job.risks[idx] = risk;
                        return _this._jobService.setJob(job);
                    }
                    else {
                        throw new businessException_1.BusinessException(_this, "risks", "risk does not exist to update '{0}' for job '{1}'", [risk.id, jobId], null);
                    }
                }
                else {
                    throw new businessException_1.BusinessException(_this, "risks", "no current job selected '{0}'", [jobId], null);
                }
            });
        };
        RiskService.prototype.addRisk = function (jobId, risk) {
            var _this = this;
            return this._jobService.getJob(jobId).then(function (job) {
                if (job) {
                    if (!job.risks) {
                        job.risks = [];
                    }
                    risk.id = guid_1.Guid.newGuid();
                    /* allocate todays date for a new risk */
                    risk.date = dateHelper_1.DateHelper.getTodaysDate();
                    risk.isCreated = true;
                    job.risks.push(risk);
                    return _this._jobService.setJob(job).then(function () { return risk.id; });
                }
                else {
                    throw new businessException_1.BusinessException(_this, "risks", "no current job selected '{0}'", [jobId], null);
                }
            });
        };
        RiskService.prototype.deleteRisk = function (jobId, riskId) {
            var _this = this;
            return this._jobService.getJob(jobId).then(function (job) {
                if (job) {
                    var idx = (job.risks || []).findIndex(function (r) { return r.id === riskId; });
                    if (idx >= 0) {
                        var removedRisk = job.risks.splice(idx, 1).pop();
                        if (removedRisk && !removedRisk.isCreated) {
                            removedRisk.isDeleted = true;
                            removedRisk.dataState = dataState_1.DataState.dontCare;
                            job.deletedRisks = job.deletedRisks || [];
                            job.deletedRisks.push(removedRisk);
                        }
                        return _this._jobService.setJob(job);
                    }
                    else {
                        throw new businessException_1.BusinessException(_this, "risks", "risk does not exist to delete '{0}' for job '{1}'", [riskId, jobId], null);
                    }
                }
                else {
                    throw new businessException_1.BusinessException(_this, "risks", "no current job selected '{0}'", [jobId], null);
                }
            });
        };
        RiskService = __decorate([
            aurelia_framework_1.inject(jobService_1.JobService, applianceService_1.ApplianceService),
            __metadata("design:paramtypes", [Object])
        ], RiskService);
        return RiskService;
    }());
    exports.RiskService = RiskService;
});

//# sourceMappingURL=riskService.js.map
