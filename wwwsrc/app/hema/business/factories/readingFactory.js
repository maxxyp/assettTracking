var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../../../common/core/objectHelper", "../../core/dateHelper", "aurelia-dependency-injection", "../services/catalogService"], function (require, exports, objectHelper_1, dateHelper_1, aurelia_dependency_injection_1, catalogService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ReadingFactory = /** @class */ (function () {
        function ReadingFactory(catalogService) {
            this._catalogService = catalogService;
        }
        ReadingFactory.prototype.createReadingApiModels = function (appliance) {
            var _this = this;
            return Promise.all([
                this._catalogService.getReadTypeMappings(),
                this._catalogService.getReadingTypes()
            ]).spread(function (readTypeMappings, readTypes) {
                var readings = [];
                if (appliance && appliance.safety) {
                    return _this.findReadings(appliance.safety, readTypeMappings, readTypes, readings, appliance.isCentralHeatingAppliance)
                        .then(function () {
                        if (appliance.safety.applianceGasSafety && appliance.safety.applianceGasSafety.performanceTestsNotDoneReason) {
                            return _this.populatePerformanceTestNotDoneReason(appliance.safety.applianceGasSafety.performanceTestsNotDoneReason, readings, readTypes, appliance.isCentralHeatingAppliance);
                        }
                        return Promise.resolve();
                    })
                        .then(function () {
                        if (appliance.safety.applianceGasSafety && appliance.safety.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary) {
                            return _this.populatePerformanceTestNotDoneReason(appliance.safety.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary, readings, readTypes, appliance.isCentralHeatingAppliance);
                        }
                        return Promise.resolve();
                    })
                        .then(function () { return _this.sortAndGenerateSequenceNumber(readings); });
                }
                return Promise.resolve();
            });
        };
        ReadingFactory.prototype.findReadings = function (applianceSafety, readTypeMappings, validReadTypes, readings, isCentralHeatingAppliance) {
            readTypeMappings.forEach(function (readType) {
                var reading = objectHelper_1.ObjectHelper.getPathValue(applianceSafety, readType.group + "." + readType.id);
                var validReadType = validReadTypes.find(function (x) { return x.readingTypeCode === readType.value; });
                if (reading !== undefined && !!validReadType) {
                    readings.push({
                        dateTime: dateHelper_1.DateHelper.toJsonDateTimeString(new Date()),
                        type: isCentralHeatingAppliance === true ? readType.value : readType.value.split("").reverse().join(""),
                        value: reading,
                        sequenceNumber: 0
                    });
                }
            });
            return Promise.resolve();
        };
        ReadingFactory.prototype.sortAndGenerateSequenceNumber = function (readings) {
            return readings.sort(function (a, b) {
                var x = dateHelper_1.DateHelper.fromJsonDateTimeString(a.dateTime);
                var y = dateHelper_1.DateHelper.fromJsonDateTimeString(b.dateTime);
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }).map(function (reading, index) {
                reading.sequenceNumber = ++index;
                return reading;
            });
        };
        // performance Test not done reasons always has value 1
        ReadingFactory.prototype.populatePerformanceTestNotDoneReason = function (performanceTestsNotDoneReason, readings, validReadTypes, isCentralHeatingAppliance) {
            return this._catalogService.getPerformanceTestReasons().then(function (performanceTestReasons) {
                if (performanceTestReasons) {
                    var reason_1 = performanceTestReasons.find(function (x) { return x.id === performanceTestsNotDoneReason; });
                    var validReadType = validReadTypes.find(function (x) { return x.readingTypeCode === reason_1.id; });
                    if (reason_1 && validReadType) {
                        if (readings === null || readings === undefined) {
                            readings = [];
                        }
                        readings.push({
                            dateTime: dateHelper_1.DateHelper.toJsonDateTimeString(new Date()),
                            type: isCentralHeatingAppliance === true ? reason_1.id : reason_1.id.split("").reverse().join(""),
                            value: validReadType.readingHighRangeValue.toString(),
                            sequenceNumber: 0
                        });
                    }
                }
                return Promise.resolve();
            });
        };
        ReadingFactory = __decorate([
            aurelia_dependency_injection_1.inject(catalogService_1.CatalogService),
            __metadata("design:paramtypes", [Object])
        ], ReadingFactory);
        return ReadingFactory;
    }());
    exports.ReadingFactory = ReadingFactory;
});

//# sourceMappingURL=readingFactory.js.map
