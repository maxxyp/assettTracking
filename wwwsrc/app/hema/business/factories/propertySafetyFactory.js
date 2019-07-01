define(["require", "exports", "../models/propertySafety", "../models/previousPropertySafetyDetail", "../models/propertyGasSafetyDetail", "../models/propertyElectricalSafetyDetail", "../models/propertyUnsafeDetail", "../models/propertySafetyType", "../../../common/core/objectHelper", "../services/constants/catalogConstants"], function (require, exports, propertySafety_1, previousPropertySafetyDetail_1, propertyGasSafetyDetail_1, propertyElectricalSafetyDetail_1, propertyUnsafeDetail_1, propertySafetyType_1, objectHelper_1, catalogConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PropertySafetyFactory = /** @class */ (function () {
        function PropertySafetyFactory() {
        }
        PropertySafetyFactory.prototype.createPropertySafetyBusinessModel = function (propertySafetyType, safetyDetail, unsafeDetail) {
            var propertySafety = new propertySafety_1.PropertySafety();
            propertySafety.propertyGasSafetyDetail = new propertyGasSafetyDetail_1.PropertyGasSafetyDetail();
            propertySafety.propertyElectricalSafetyDetail = new propertyElectricalSafetyDetail_1.PropertyElectricalSafetyDetail();
            propertySafety.propertyUnsafeDetail = new propertyUnsafeDetail_1.PropertyUnsafeDetail();
            var hasUnsafeSituation = unsafeDetail && objectHelper_1.ObjectHelper.isObject(unsafeDetail) && objectHelper_1.ObjectHelper.hasKeys(unsafeDetail);
            if (safetyDetail && hasUnsafeSituation) {
                // previousPropertySafety information is only valid if there is an unsafe sitiuation.
                // therefore only create previousPropertySafetyDetail if there is an unsafe situation
                propertySafety.previousPropertySafetyDetail = new previousPropertySafetyDetail_1.PreviousPropertySafetyDetail();
                if (propertySafetyType === propertySafetyType_1.PropertySafetyType.gas) {
                    propertySafety.previousPropertySafetyDetail.lastVisitDate = safetyDetail.lastGasVisitDate;
                    propertySafety.previousPropertySafetyDetail.safetyNoticeNotLeftReason = safetyDetail.safetyNoticeNotLeftReason;
                }
                else if (propertySafetyType === propertySafetyType_1.PropertySafetyType.electrical) {
                    propertySafety.previousPropertySafetyDetail.lastVisitDate = safetyDetail.lastElectricVisitDate;
                }
                else {
                    // if the job comes down as an "other" job, try gas then electric dates
                    propertySafety.previousPropertySafetyDetail.lastVisitDate = safetyDetail.lastGasVisitDate || safetyDetail.lastElectricVisitDate;
                }
                propertySafety.previousPropertySafetyDetail.cappedOrTurnedOff = unsafeDetail.cappedOrTurnedOff;
                propertySafety.previousPropertySafetyDetail.conditionAsLeft = unsafeDetail.conditionAsLeft;
                propertySafety.previousPropertySafetyDetail.labelAttachedOrRemoved = unsafeDetail.labelAttachedOrRemoved;
                propertySafety.previousPropertySafetyDetail.letterLeft = unsafeDetail.letterLeft;
                propertySafety.previousPropertySafetyDetail.ownedByCustomer = unsafeDetail.ownedByCustomer;
                propertySafety.previousPropertySafetyDetail.reasons = unsafeDetail.reasons;
                propertySafety.previousPropertySafetyDetail.report = unsafeDetail.report;
                propertySafety.previousPropertySafetyDetail.ownersNameAndDetails = unsafeDetail.ownersNameAndDetails;
                propertySafety.previousPropertySafetyDetail.signatureObtained = unsafeDetail.signatureObtained;
            }
            return propertySafety;
        };
        PropertySafetyFactory.prototype.createPropertySafetyApiModel = function (propertySafetyType, propertySafetyBusinessModel, hasRisks, isjobPartLJReportable) {
            var safetyDetailUpdateApiModel = {};
            if (propertySafetyBusinessModel) {
                if (propertySafetyType === propertySafetyType_1.PropertySafetyType.electrical) {
                    if (propertySafetyBusinessModel.propertyElectricalSafetyDetail) {
                        safetyDetailUpdateApiModel.electricalELIReading = propertySafetyBusinessModel.propertyElectricalSafetyDetail.noEliReadings ?
                            undefined : propertySafetyBusinessModel.propertyElectricalSafetyDetail.eliReading;
                        safetyDetailUpdateApiModel.eliReason = propertySafetyBusinessModel.propertyElectricalSafetyDetail.noEliReadings ?
                            propertySafetyBusinessModel.propertyElectricalSafetyDetail.eliReadingReason : undefined;
                        safetyDetailUpdateApiModel.consumerUnitOrFuseBoxSatisfactory = propertySafetyBusinessModel.propertyElectricalSafetyDetail.consumerUnitSatisfactory;
                        safetyDetailUpdateApiModel.electricalSystemType = propertySafetyBusinessModel.propertyElectricalSafetyDetail.systemType;
                        safetyDetailUpdateApiModel.rcdPresent = propertySafetyBusinessModel.propertyElectricalSafetyDetail.rcdPresent
                            ? propertySafetyBusinessModel.propertyElectricalSafetyDetail.rcdPresent === "Y"
                            : undefined;
                        safetyDetailUpdateApiModel.eliSafeAccordingToTheTableInTops = propertySafetyBusinessModel.propertyElectricalSafetyDetail.eliSafeAccordingToTops;
                    }
                }
                else if (propertySafetyType === propertySafetyType_1.PropertySafetyType.gas) {
                    if (propertySafetyBusinessModel.propertyGasSafetyDetail) {
                        safetyDetailUpdateApiModel.gasELIReading = propertySafetyBusinessModel.propertyGasSafetyDetail.eliReading === catalogConstants_1.CatalogConstants.SAFETY_READING_CAT_NO_READING_TAKEN
                            ? undefined
                            : propertySafetyBusinessModel.propertyGasSafetyDetail.eliReading;
                        safetyDetailUpdateApiModel.eliReason = propertySafetyBusinessModel.propertyGasSafetyDetail.eliReadingReason;
                        safetyDetailUpdateApiModel.safetyNoticeNotLeftReason = propertySafetyBusinessModel.propertyGasSafetyDetail.safetyAdviseNoticeLeft ?
                            propertySafetyBusinessModel.propertyGasSafetyDetail.safetyAdviseNoticeLeftReason : "";
                        safetyDetailUpdateApiModel.gasInstallationTightnessTestDone = propertySafetyBusinessModel.propertyGasSafetyDetail.gasInstallationTightnessTestDone;
                        safetyDetailUpdateApiModel.pressureDrop = propertySafetyBusinessModel.propertyGasSafetyDetail.gasInstallationTightnessTestDone ?
                            propertySafetyBusinessModel.propertyGasSafetyDetail.pressureDrop : undefined;
                        safetyDetailUpdateApiModel.gasMeterInstallationSafe = propertySafetyBusinessModel.propertyGasSafetyDetail.gasMeterInstallationSatisfactory;
                    }
                }
                safetyDetailUpdateApiModel.jobPartLJReportable = isjobPartLJReportable;
            }
            safetyDetailUpdateApiModel.riskIdentifiedAtProperty = !!hasRisks;
            return safetyDetailUpdateApiModel;
        };
        PropertySafetyFactory.prototype.createPropertyUnsafetyApiModel = function (propertySafetyType, propertySafetyBusinessModel) {
            var unSafeDetailUpdateApiModel = {};
            if (propertySafetyBusinessModel && propertySafetyBusinessModel.propertyUnsafeDetail) {
                if (propertySafetyType === propertySafetyType_1.PropertySafetyType.electrical || propertySafetyType === propertySafetyType_1.PropertySafetyType.gas) {
                    unSafeDetailUpdateApiModel.report = propertySafetyBusinessModel.propertyUnsafeDetail.report;
                    unSafeDetailUpdateApiModel.conditionAsLeft = propertySafetyBusinessModel.propertyUnsafeDetail.conditionAsLeft;
                    unSafeDetailUpdateApiModel.labelAttachedOrRemoved = propertySafetyBusinessModel.propertyUnsafeDetail.labelAttachedRemoved;
                    unSafeDetailUpdateApiModel.cappedOrTurnedOff = propertySafetyBusinessModel.propertyUnsafeDetail.cappedTurnedOff;
                    unSafeDetailUpdateApiModel.ownedByCustomer = propertySafetyBusinessModel.propertyUnsafeDetail.ownedByCustomer;
                    unSafeDetailUpdateApiModel.signatureObtained = propertySafetyBusinessModel.propertyUnsafeDetail.signatureObtained;
                    unSafeDetailUpdateApiModel.letterLeft = propertySafetyBusinessModel.propertyUnsafeDetail.letterLeft;
                    unSafeDetailUpdateApiModel.reasons = propertySafetyBusinessModel.propertyUnsafeDetail.reasons;
                    unSafeDetailUpdateApiModel.ownersNameAndDetails = undefined; // not used only for historical purposes only
                }
            }
            return unSafeDetailUpdateApiModel;
        };
        return PropertySafetyFactory;
    }());
    exports.PropertySafetyFactory = PropertySafetyFactory;
});

//# sourceMappingURL=propertySafetyFactory.js.map
