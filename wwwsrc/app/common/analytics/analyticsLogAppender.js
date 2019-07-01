var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-dependency-injection", "./analytics", "./analyticsExceptionModel"], function (require, exports, aurelia_dependency_injection_1, analytics_1, analyticsExceptionModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AnalyticsLogAppender = /** @class */ (function () {
        function AnalyticsLogAppender(analytics) {
            this._analytics = analytics;
        }
        AnalyticsLogAppender.prototype.debug = function (logger) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
        };
        AnalyticsLogAppender.prototype.info = function (logger) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
        };
        AnalyticsLogAppender.prototype.warn = function (logger) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
        };
        // find the object which is of type AnalyticsExceptionModel
        // if any exception happens during the execution of the following,
        // just swallow it.
        AnalyticsLogAppender.prototype.error = function (logger) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            try {
                if (logger && rest) {
                    var exception = rest.find(function (x) { return typeof x === "object" && x instanceof analyticsExceptionModel_1.AnalyticsExceptionModel; });
                    if (exception) {
                        exception.loggerId = logger.id;
                        this._analytics.exception(JSON.stringify(exception), exception.isFatal);
                        return;
                    }
                }
                return;
            }
            catch (_a) {
                // do nothing
            }
        };
        AnalyticsLogAppender = __decorate([
            aurelia_dependency_injection_1.inject(analytics_1.Analytics),
            __metadata("design:paramtypes", [Object])
        ], AnalyticsLogAppender);
        return AnalyticsLogAppender;
    }());
    exports.AnalyticsLogAppender = AnalyticsLogAppender;
});

//# sourceMappingURL=analyticsLogAppender.js.map
