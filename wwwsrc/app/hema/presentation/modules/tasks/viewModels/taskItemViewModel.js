define(["require", "exports", "../../../../../common/core/objectHelper"], function (require, exports, objectHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TaskItemViewModel = /** @class */ (function () {
        function TaskItemViewModel(taskId, job, task) {
            this.dataStateId = task.dataStateId;
            this.dataState = task.dataState;
            this.taskIds = job.tasks.map(function (t) { return t.id; });
            this.isCharge = task.isCharge;
            this.isNewRFA = task.isNewRFA;
            this.tasks = job.tasks;
            this.job = job;
            this.orderNo = task.orderNo;
            this.applianceType = task.applianceType;
            this.jobType = task.jobType;
            this.status = task.status;
            this.workedOnCode = task.workedOnCode;
            this.adviceOutcome = task.adviceOutcome;
            this.adviceCode = task.adviceCode;
            this.adviceComment = task.adviceComment;
            this.taskReport = task.report;
            this.workDuration = task.workDuration;
            this.chargeableTime = task.chargeableTime;
            this.activity = task.activity;
            this.productGroup = task.productGroup;
            this.partType = task.partType;
            this.faultActionCode = task.faultActionCode;
            this.isPotentiallyPartLJReportable = task.isPotentiallyPartLJReportable;
            this.isPartLJReportable = task.isPartLJReportable;
            this.isFirstVisit = task.isFirstVisit;
            this.hasMainPart = task.hasMainPart;
            this.mainPartPartType = task.mainPartPartType;
            this.currentApplianceId = task.applianceId;
            this.showMainPartSelectedWithInvalidActivityTypeMessage = task.showMainPartSelectedWithInvalidActivityTypeMessage;
            this.showMainPartSelectedWithInvalidProductGroupTypeMessage = task.showMainPartSelectedWithInvalidProductGroupTypeMessage;
            this.showMainPartSelectedWithInvalidPartTypeMessage = task.showMainPartSelectedWithInvalidPartTypeMessage;
            this.showProductGroupAndPartTypes = true;
            this.notCompletingJob = false;
            this.notCompletingTask = false;
            this.mainPartInformationRetrieved = false;
            this.chirpCodes = [];
            this.faultActionCodeFilteredCatalog = [];
            this.partTypeFilteredCatalog = [];
            this.visitActivityFilteredCatalog = [];
            this.mainPartProductGroup = "";
            this.totalPreviousWorkDuration = TaskItemViewModel.getTotalPreviousChargeableTime(task);
        }
        TaskItemViewModel.getTotalPreviousChargeableTime = function (task) {
            var totalChargeableTime = 0;
            if (task && task.activities) {
                for (var i = 0; i < task.activities.length; i++) {
                    var activity = task.activities[i];
                    if (activity && activity.chargeableTime) {
                        totalChargeableTime += activity.chargeableTime;
                    }
                }
            }
            return totalChargeableTime;
        };
        TaskItemViewModel.filterVisitActivityCatalog = function (viewModel, workedOnCode, firstVisitJobCode, firstVisitTaskCode, visitActivityCatalog, claimRejNotCoveredVisitCodesPattern, workedOnClaimRejNotCovered) {
            // if job type is first visit then visit activity defaults to first visit code, other have other job types, except first visit
            if (viewModel.jobType === firstVisitJobCode) {
                viewModel.isFirstVisit = true; // used for view and stops reloading on second visit
                viewModel.activity = firstVisitTaskCode;
                viewModel.visitActivityFilteredCatalog = visitActivityCatalog.filter(function (v) { return v.visitActivityCode === firstVisitTaskCode; });
            }
            else {
                viewModel.isFirstVisit = false;
                // get claim rej type products
                if (workedOnCode !== undefined) {
                    if (viewModel.workedOnCode === workedOnClaimRejNotCovered) {
                        viewModel.visitActivityFilteredCatalog = visitActivityCatalog.filter(function (v) {
                            return v.visitActivityCode.substr(0, claimRejNotCoveredVisitCodesPattern.length) === claimRejNotCoveredVisitCodesPattern
                                && v.visitActivityCode !== firstVisitTaskCode;
                        }).map(function (item) {
                            /* Since the WMIS data is prefixed with X for this category strip it off using a cloned version of the object */
                            var newItem = objectHelper_1.ObjectHelper.clone(item);
                            newItem.visitActivityDescr = newItem.visitActivityDescription.substr(1);
                            return newItem;
                        });
                    }
                    else {
                        viewModel.visitActivityFilteredCatalog = visitActivityCatalog.filter(function (v) {
                            return v.visitActivityCode.substr(0, claimRejNotCoveredVisitCodesPattern.length) !== claimRejNotCoveredVisitCodesPattern
                                && v.visitActivityCode !== firstVisitTaskCode;
                        });
                    }
                }
            }
        };
        TaskItemViewModel.filterFaultActionCodeCatalog = function (viewModel, visitActFaultActLinkCatalog, faultMap, visitCodesProductGroupPartsRequired) {
            var faultCodes = visitActFaultActLinkCatalog.filter(function (lookup) { return lookup.visitActivityCode === viewModel.activity; });
            // if no fault codes associated to visit type, then it implies that a part and product group is needed
            if (faultCodes && faultCodes.length > 0) {
                var filteredFaultCodes = faultCodes.map(function (f) { return faultMap[f.faultActionCode]; });
                if (filteredFaultCodes) {
                    viewModel.showProductGroupAndPartTypes = false;
                    viewModel.faultActionCodeFilteredCatalog = filteredFaultCodes;
                }
            }
            else {
                viewModel.showProductGroupAndPartTypes = visitCodesProductGroupPartsRequired.indexOf(viewModel.activity) !== -1;
            }
        };
        TaskItemViewModel.filterFaultActionCodeBasedOnPartType = function (viewModel, partTypeFaultActLinkCatalog, partTypeCatalog, faultMap) {
            if (viewModel.partType && partTypeFaultActLinkCatalog && partTypeFaultActLinkCatalog.length > 0) {
                var foundPartType_1 = partTypeCatalog.find(function (pt) { return pt.partTypeCode === viewModel.partType; });
                if (!foundPartType_1) {
                    return;
                }
                var faultCodes = partTypeFaultActLinkCatalog.filter(function (pType) { return pType.productGroupCode === viewModel.productGroup && pType.partTypeCode === foundPartType_1.partTypeCode; });
                // being defensive by using filter in case the faultCode mapping does not contain the faultActionCode
                if (faultCodes && faultCodes.length > 0) {
                    viewModel.faultActionCodeFilteredCatalog = faultCodes
                        .filter(function (f) { return faultMap[f.faultActionCode]; }) // only return if fault exists
                        .map(function (f) { return faultMap[f.faultActionCode]; }) // return fault code
                        .sort(function (a, b) {
                        if (a.faultActionDescription < b.faultActionDescription) {
                            return -1;
                        }
                        if (a.faultActionDescription > b.faultActionDescription) {
                            return 1;
                        }
                        return 0;
                    });
                }
            }
        };
        TaskItemViewModel.filterPartTypeCatalog = function (viewModel, partTypeCatalog) {
            if (partTypeCatalog && partTypeCatalog.length > 0) {
                var partsTypes = partTypeCatalog.filter(function (ptc) { return ptc.productGroupCode === viewModel.productGroup; });
                if (partsTypes && partsTypes.length > 0) {
                    viewModel.partTypeFilteredCatalog = partsTypes;
                }
            }
        };
        return TaskItemViewModel;
    }());
    exports.TaskItemViewModel = TaskItemViewModel;
});

//# sourceMappingURL=taskItemViewModel.js.map
