var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "./workRetrievalRequestingStatus", "../../../common/core/services/configurationService", "aurelia-dependency-injection"], function (require, exports, workRetrievalRequestingStatus_1, configurationService_1, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // todo: back this by proper storage?
    var WorkRetrievalTracker = /** @class */ (function () {
        function WorkRetrievalTracker(configurationService) {
            this._configurationService = configurationService;
            // ensure that the first worklist always loads as even in the worst case where no timestamp is returned, null !== undefined.
            this._lastKnownModifiedTimestamp = null;
            this._knownItems = [];
        }
        WorkRetrievalTracker.prototype.setShouldRequestWorkOnNextCall = function (val) {
            this._requestWorkOnNextCall = val;
        };
        WorkRetrievalTracker.prototype.shouldRequestWorkOnNextCall = function () {
            return !!this._requestWorkOnNextCall;
        };
        WorkRetrievalTracker.prototype.resetLastKnownModifiedTimestamp = function () {
            this._lastKnownModifiedTimestamp = null;
        };
        WorkRetrievalTracker.prototype.getLastKnownModifiedTimestamp = function () {
            return this._lastKnownModifiedTimestamp;
        };
        WorkRetrievalTracker.prototype.isWorkListIdentifierKnown = function () {
            return this._lastKnownModifiedTimestamp !== null;
        };
        WorkRetrievalTracker.prototype.startRequesting = function () {
            this.lastRequestTime = new Date();
            this.requestingStatus = this._requestWorkOnNextCall
                ? workRetrievalRequestingStatus_1.WorkRetrievalRequestingStatus.requestingFullRequest
                : workRetrievalRequestingStatus_1.WorkRetrievalRequestingStatus.requestingRefresh;
        };
        WorkRetrievalTracker.prototype.isFirstRequestForWorkOfTheDay = function () {
            return this.requestingStatus === workRetrievalRequestingStatus_1.WorkRetrievalRequestingStatus.requestingFullRequest
                && !this._hasOneCompletionHappened;
        };
        WorkRetrievalTracker.prototype.registerItems = function (okItems, failedItems, allLiveItems) {
            var _this = this;
            this._hasOneCompletionHappened = true;
            okItems.forEach(function (item) {
                var existingItem = _this._knownItems.find(function (knownItem) { return knownItem.id === item.id && knownItem.workType === item.workType; });
                if (existingItem) {
                    existingItem.timestamp = item.timestamp;
                }
                else {
                    _this._knownItems.push(item);
                }
            });
            failedItems.forEach(function (item) {
                var existingItem = _this._knownItems.find(function (knownItem) { return knownItem.id === item.id && knownItem.workType === item.workType; });
                if (existingItem) {
                    existingItem.timestamp = undefined;
                }
                else {
                    item.timestamp = undefined;
                    _this._knownItems.push(item);
                }
            });
            // prune _knownItems once a job has left the worklist
            // (helps if a job enters and leaves the worklist to make sure it is refreshed from the api when it reappears)
            this._knownItems = this._knownItems.filter(function (item) { return allLiveItems.some(function (liveItem) { return liveItem.id === item.id && liveItem.workType === item.workType; }); });
        };
        WorkRetrievalTracker.prototype.hasItemFailedPreviously = function (item) {
            return this._knownItems.some(function (knownItem) { return knownItem.id === item.id && knownItem.workType === item.workType && !knownItem.timestamp; });
        };
        WorkRetrievalTracker.prototype.shouldRetrieveItem = function (item) {
            if (this._configurationService.getConfiguration().worklistAlwaysGetAllJobs) {
                // if we want to brute force get all jobs every time
                return true;
            }
            else {
                // otherwise we only want changed or previously failed jobs
                return this.hasItemFailedPreviously(item)
                    || !this._knownItems.some(function (knownJob) { return knownJob.id === item.id
                        && knownJob.timestamp === item.timestamp
                        && knownJob.workType === item.workType; });
            }
        };
        WorkRetrievalTracker.prototype.registerUnchangedWorklist = function () {
            this.requestingStatus = workRetrievalRequestingStatus_1.WorkRetrievalRequestingStatus.notRequesting;
        };
        WorkRetrievalTracker.prototype.registerNewWorklist = function (timestamp, isOnlyForTracking) {
            this._lastKnownModifiedTimestamp = timestamp;
            if (!isOnlyForTracking) {
                this.requestingStatus = workRetrievalRequestingStatus_1.WorkRetrievalRequestingStatus.notRequesting;
                this.lastUpdatedTime = new Date();
            }
        };
        WorkRetrievalTracker.prototype.registerFailedWorklist = function (isOnlyForTracking) {
            this._hasWorklistFailedPreviously = true;
            if (!isOnlyForTracking) {
                this.requestingStatus = workRetrievalRequestingStatus_1.WorkRetrievalRequestingStatus.notRequesting;
                this.lastFailedTime = new Date();
            }
        };
        WorkRetrievalTracker.prototype.failedRequestWork = function () {
            this.lastFailedTime = new Date();
            this.requestingStatus = workRetrievalRequestingStatus_1.WorkRetrievalRequestingStatus.notRequesting;
        };
        WorkRetrievalTracker.prototype.deregisterFailedWorklist = function () {
            this._hasWorklistFailedPreviously = false;
        };
        WorkRetrievalTracker.prototype.hasWorklistFailedPreviously = function () {
            return !!this._hasWorklistFailedPreviously;
        };
        WorkRetrievalTracker = __decorate([
            aurelia_dependency_injection_1.inject(configurationService_1.ConfigurationService),
            __metadata("design:paramtypes", [Object])
        ], WorkRetrievalTracker);
        return WorkRetrievalTracker;
    }());
    exports.WorkRetrievalTracker = WorkRetrievalTracker;
});

//# sourceMappingURL=workRetrievalTracker.js.map
