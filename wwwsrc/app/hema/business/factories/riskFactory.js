define(["require", "exports", "../models/risk", "../../../common/core/guid", "../../../common/core/numberHelper", "../../core/dateHelper", "../../../common/core/stringHelper"], function (require, exports, risk_1, guid_1, numberHelper_1, dateHelper_1, stringHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RiskFactory = /** @class */ (function () {
        function RiskFactory() {
        }
        RiskFactory.prototype.createRiskBusinessModel = function (riskApiModel) {
            var riskBusinessModel = new risk_1.Risk();
            riskBusinessModel.id = guid_1.Guid.newGuid();
            riskBusinessModel.reason = riskApiModel.reason;
            riskBusinessModel.report = riskApiModel.report;
            riskBusinessModel.date = dateHelper_1.DateHelper.fromJsonDateString(riskApiModel.date);
            riskBusinessModel.isHazard = false;
            return riskBusinessModel;
        };
        RiskFactory.prototype.createRiskApiModel = function (riskBusinessModel) {
            var riskApiModel = {};
            riskApiModel.reason = riskBusinessModel.reason;
            riskApiModel.report = riskBusinessModel.report;
            return riskApiModel;
        };
        RiskFactory.prototype.createRiskBusinessModelFromAppliance = function (applianceApiModel, applianceTypeHazard) {
            var riskBusinessModel = new risk_1.Risk();
            riskBusinessModel.id = stringHelper_1.StringHelper.isString(applianceApiModel.id) && applianceApiModel.id.length > 0 ? applianceApiModel.id : guid_1.Guid.newGuid();
            riskBusinessModel.reason = applianceTypeHazard;
            riskBusinessModel.report = applianceApiModel.locationDescription;
            if (numberHelper_1.NumberHelper.isNumber(applianceApiModel.installationYear)) {
                riskBusinessModel.date = new Date(applianceApiModel.installationYear, 0, 1);
            }
            riskBusinessModel.isHazard = true;
            return riskBusinessModel;
        };
        RiskFactory.prototype.createApplianceApiModel = function (riskBusinessModel, originalJob) {
            var apiModel = this.createApiModel(riskBusinessModel);
            if (riskBusinessModel.isDeleted) {
                apiModel.id = riskBusinessModel.id;
                return apiModel;
            }
            else if (riskBusinessModel.isCreated) {
                this.populateCoreFields(apiModel, riskBusinessModel);
                return apiModel;
            }
            else {
                apiModel.id = riskBusinessModel.id;
                var originalRisk = this.getOriginalRisk(riskBusinessModel, originalJob);
                this.populateCoreFields(apiModel, riskBusinessModel, originalRisk);
                return apiModel;
            }
        };
        RiskFactory.prototype.createApiModel = function (riskBusinessModel) {
            var updateMarker = riskBusinessModel.isCreated ? "C" : riskBusinessModel.isDeleted ? "D" : "A";
            return {
                updateMarker: updateMarker,
                applianceType: riskBusinessModel.reason
            };
        };
        RiskFactory.prototype.getOriginalRisk = function (riskBusinessModel, originalJob) {
            return !riskBusinessModel.isCreated
                && originalJob
                && originalJob.risks
                && originalJob.risks.find(function (risk) { return risk.id === riskBusinessModel.id; });
        };
        RiskFactory.prototype.populateCoreFields = function (apiModel, riskBusinessModel, originalRisk) {
            if (!originalRisk || (riskBusinessModel.report !== originalRisk.report)) {
                apiModel.locationDescription = riskBusinessModel.report;
            }
        };
        return RiskFactory;
    }());
    exports.RiskFactory = RiskFactory;
});

//# sourceMappingURL=riskFactory.js.map
