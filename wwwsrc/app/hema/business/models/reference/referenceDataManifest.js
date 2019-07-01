define(["require", "exports", "../../services/constants/catalogConstants"], function (require, exports, catalogConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ReferenceDataManifest = /** @class */ (function () {
        function ReferenceDataManifest() {
            // lookups
            this.activityComponentVisitStatus = this.defineCatalog("activityComponentVisitStatus", "lookups");
            this.applianceFlueTypes = this.defineCatalog("applianceFlueTypes", "lookups", ["flueType"]);
            this.appointmentBand = this.defineCatalog("appointmentBand", "lookups");
            this.complaintReason = this.defineCatalog("complaintReason", "lookups", ["complaintReasonCode"]);
            this.eeaCategory = this.defineCatalog("eeaCategory", "lookups");
            this.energyControls = this.defineCatalog("energyControls", "lookups");
            this.faultActionCode = this.defineCatalog("faultActionCode", "lookups");
            this.fieldOperativeStatus = this.defineCatalog("fieldOperativeStatus", "lookups");
            this.goodsItemStatus = this.defineCatalog("goodsItemStatus", "lookups");
            this.iaciCode = this.defineCatalog("iaciCode", "lookups");
            this.partsNotUsedReason = this.defineCatalog("partsNotUsedReason", "lookups");
            this.partType = this.defineCatalog("partType", "lookups");
            this.ptFac = this.defineCatalog("ptFac", "lookups");
            this.productGroup = this.defineCatalog("productGroup", "lookups");
            this.safetyAction = this.defineCatalog("safetyAction", "lookups", [catalogConstants_1.CatalogConstants.SAFETY_ACTION_ID]);
            this.safetyNoticeStatus = this.defineCatalog("safetyNoticeStatus", "lookups", [catalogConstants_1.CatalogConstants.SAFETY_NOTICE_STATUS_ID]);
            this.safetyNoticeType = this.defineCatalog("safetyNoticeType", "lookups", [catalogConstants_1.CatalogConstants.SAFETY_NOTICE_TYPE_ID]);
            this.safetyReadingCategory = this.defineCatalog("safetyReadingCategory", "lookups", [catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_GROUP, catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_ID]);
            this.safetyReasonCat = this.defineCatalog("safetyReasonCat", "lookups", [catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_GROUP, catalogConstants_1.CatalogConstants.SAFETY_REASON_CAT_ID]);
            this.visitActivityFaultActionCode = this.defineCatalog("visitActivityFaultActionCode", "lookups");
            this.visitActivityCode = this.defineCatalog("visitActivityCode", "lookups");
            this.workedOn = this.defineCatalog("workedOn", "lookups");
            // goods
            this.consumableType = this.defineCatalog("consumableType", "goods", [catalogConstants_1.CatalogConstants.CONSUMABLE_TYPE_ID]);
            this.goodsType = this.defineCatalog("goodsType", "goods", [catalogConstants_1.CatalogConstants.GOODS_TYPE_ID]);
            // business
            this.applianceType = this.defineCatalog("applianceType", "business", [catalogConstants_1.CatalogConstants.OBJECT_TYPE_ID]);
            this.chargeType = this.defineCatalog("chargeType", "business", [catalogConstants_1.CatalogConstants.CHARGE_TYPE_ID]);
            this.discount = this.defineCatalog("discount", "business");
            this.labourChargeRule = this.defineCatalog("labourChargeRule", "business", [catalogConstants_1.CatalogConstants.LABOUR_CHARGE_RULE_ID]);
            this.primeChargeInterval = this.defineCatalog("primeChargeInterval", "business");
            this.readingType = this.defineCatalog("readingType", "business");
            this.subsequentChargeInterval = this.defineCatalog("subsequentChargeInterval", "business");
            this.vat = this.defineCatalog("vat", "business");
            // job codes
            this.jobType = this.defineCatalog("jobType", "jobcodes", [catalogConstants_1.CatalogConstants.ACTION_TYPE_ID]);
            this.applianceContractType = this.defineCatalog("applianceContractType", "jobcodes", [catalogConstants_1.CatalogConstants.APPLIANCE_CONTRACT_TYPE_ID]);
            this.areaChargeRules =
                this.defineCatalog("areaChargeRules", "jobcodes", [catalogConstants_1.CatalogConstants.AREA_CHARGE_RULE_ACTION_TYPE_CODE, catalogConstants_1.CatalogConstants.AREA_CHARGE_RULE_COMPANY_CODE]);
            this.gasCouncilCode = this.defineCatalog("gasCouncilCode", "jobcodes", [catalogConstants_1.CatalogConstants.GC_CODE_OBJECT_TYPE_CODE, catalogConstants_1.CatalogConstants.GC_CODE_ID]);
            this.fieldActivityType = this.defineCatalog("fieldActivityType", "jobcodes", [catalogConstants_1.CatalogConstants.FIELD_ACTIVITY_TYPE_OBJECT_TYPE_CODE]);
            this.jcChargeRules = this.defineCatalog("jcChargeRules", "jobcodes", [catalogConstants_1.CatalogConstants.JC_CHARGE_RULES_ACTION_TYPE_CODE, catalogConstants_1.CatalogConstants.JC_CHARGE_RULES_OBJECT_TYPE_CODE]);
            // app config
            this.businessRule = this.defineCatalog("businessRule", "local", [catalogConstants_1.CatalogConstants.BUSINESS_RULE_VIEW_MODEL], true);
            this.label = this.defineCatalog("label", "local", [catalogConstants_1.CatalogConstants.LABEL_VIEW_MODEL], true);
            this.validation = this.defineCatalog("validation", "local", [catalogConstants_1.CatalogConstants.VALIDATION_VIEW_MODEL], true);
            // previously harcoded
            this.adviceResult = this.defineCatalog("adviceResult", "local");
            this.applianceCondition = this.defineCatalog("applianceCondition", "local");
            this.applianceCylinderType = this.defineCatalog("applianceCylinderType", "local");
            this.applianceElectricalType = this.defineCatalog("applianceElectricalType", "local", [catalogConstants_1.CatalogConstants.APPLIANCE_ELETRICAL_TYPE_ID]);
            this.applianceSystemType = this.defineCatalog("applianceSystemType", "local");
            this.chargeDispute = this.defineCatalog("chargeDispute", "local");
            this.chargeOption = this.defineCatalog("chargeOption", "local");
            this.electricalApplianceType = this.defineCatalog("electricalApplianceType", "local");
            this.electricalSystemType = this.defineCatalog("electricalSystemType", "local", [catalogConstants_1.CatalogConstants.ELECTRICAL_SYSTEM_TYPE_ID]);
            this.jcApplianceCode = this.defineCatalog("jcApplianceCode", "local", [catalogConstants_1.CatalogConstants.JC_APPLIANCE_CODE_ID]);
            this.jcJobCode = this.defineCatalog("jcJobCode", "local", [catalogConstants_1.CatalogConstants.JC_JOB_CODE_ID]);
            this.jcServiceLevelCode = this.defineCatalog("jcServiceLevelCode", "local", [catalogConstants_1.CatalogConstants.JC_SERVICE_LEVEL_CODE_ID]);
            this.partOrderStatus = this.defineCatalog("partOrderStatus", "local");
            this.passFailNa = this.defineCatalog("passFailNa", "local");
            this.performanceTestReason = this.defineCatalog("performanceTestReason", "local");
            this.readTypeMapping = this.defineCatalog("readTypeMapping", "local");
            this.systemDesignAndCondition = this.defineCatalog("systemDesignAndCondition", "local");
            this.yesNoNotChecked = this.defineCatalog("yesNoNotChecked", "local");
            this.yesNoNotCheckedNa = this.defineCatalog("yesNoNotCheckedNa", "local");
            // 3rd party
            this.chirpCode = this.defineCatalog("chirpCode", "local");
            // ungrouped or to be determined
            this.fieldOprtvClaimType = this.defineCatalog("fieldOprtvClaimType", "local");
            this.region = this.defineCatalog("region", "local", [catalogConstants_1.CatalogConstants.REGION_ID]);
            this.setting = this.defineCatalog("setting", "config", undefined, false, undefined, true);
        }
        ReferenceDataManifest.prototype.tablesByName = function () {
            var _this = this;
            var tableByName = {};
            Object.keys(this)
                .filter(function (key) { return key.indexOf("_") !== 0 && !_this.isFunction(_this[key]); })
                .forEach(function (key) {
                tableByName[key] = _this[key];
            });
            return tableByName;
        };
        ReferenceDataManifest.prototype.all = function () {
            var _this = this;
            return Object.keys(this)
                .filter(function (key) { return key.indexOf("_") !== 0 && !_this.isFunction(_this[key]); })
                .map(function (key) {
                return _this[key];
            });
        };
        ReferenceDataManifest.prototype.defineCatalog = function (catalogName, document, indexes, alwaysUpdate, lastModifiedDate, allowEmpty) {
            var type = catalogName + ""; // keep compiler happy, ITableIndex.type is string
            return {
                type: type,
                indexes: indexes ? indexes.join(",") : undefined,
                eTag: alwaysUpdate ? "-1" : "0",
                lastModifiedDate: lastModifiedDate,
                sourceDocument: document,
                canItBeEmpty: allowEmpty
            };
        };
        ReferenceDataManifest.prototype.isFunction = function (functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === "[object Function]";
        };
        return ReferenceDataManifest;
    }());
    exports.ReferenceDataManifest = ReferenceDataManifest;
});

//# sourceMappingURL=referenceDataManifest.js.map
