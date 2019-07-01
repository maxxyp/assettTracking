var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../modules/previousJobs/viewModels/previousJobViewModel", "moment", "../../../common/core/arrayHelper", "../../core/dateHelper", "../../business/models/task", "../../business/services/businessRuleService"], function (require, exports, aurelia_framework_1, previousJobViewModel_1, moment, arrayHelper_1, dateHelper_1, task_1, businessRuleService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The objective of this view model is to 'group' the tasks received from the api into their respective worklist
     * The grouping is achieved by taking the first 10 characters from the task id
     *
     * The other job is to establish the job date, this is derived by getting the earliest visit from all the tasks
     */
    var PreviousJobsFactory = /** @class */ (function () {
        function PreviousJobsFactory(businessRuleService) {
            this._businessRuleService = businessRuleService;
        }
        PreviousJobsFactory.prototype.createPreviousJobsViewModel = function (job) {
            var _this = this;
            var previousJobsLookup = {};
            var previousJobs = [];
            return this._businessRuleService.getQueryableRuleGroup("previousJobsFactory").then(function (jobFactoryRuleGroup) {
                var previousJobsAllowedInMonths = jobFactoryRuleGroup.getBusinessRule("previousJobsAllowedInMonths");
                var oldestAllowed = moment(new Date()).subtract(previousJobsAllowedInMonths, "months").toDate();
                return _this._businessRuleService.getQueryableRuleGroup("chargeService").then(function (ruleGroup) {
                    var noChargePrefix = ruleGroup.getBusinessRule("noChargePrefix");
                    if (job && job.history && job.history.tasks) {
                        job.history.tasks.forEach(function (task) {
                            var visitDates = task.activities
                                .map(function (a) { return a.date ? new Date(a.date) : null; })
                                .filter(function (d) { return d instanceof Date; });
                            var mostRecent = null;
                            if (visitDates.length > 0) {
                                mostRecent = new Date(Math.max.apply(null, visitDates));
                            }
                            var jobId = task.id.substring(0, 10);
                            if (previousJobsLookup[jobId]) {
                                previousJobsLookup[jobId].tasks.push(task);
                                if (dateHelper_1.DateHelper.isDate(previousJobsLookup[jobId].date) && dateHelper_1.DateHelper.isValidDate(previousJobsLookup[jobId].date) && previousJobsLookup[jobId].date < mostRecent) {
                                    previousJobsLookup[jobId].date = mostRecent;
                                }
                            }
                            else {
                                previousJobsLookup[jobId] = new previousJobViewModel_1.PreviousJobViewModel(jobId, mostRecent, undefined, [task]); // undefined because we are populating description later
                            }
                        });
                        for (var jobId in previousJobsLookup) {
                            previousJobs.push(previousJobsLookup[jobId]);
                        }
                        var jobs = arrayHelper_1.ArrayHelper.sortByColumnDescending(previousJobs, "date");
                        previousJobs = [];
                        for (var i = 0; i < jobs.length; i++) {
                            // a single job can contain many tasks
                            // populating description in a way so it contains details of every task
                            // earlier it was displayed with 2 Years and later it changed to last 10 visits. 
                            // as per the new request in part of this incident - INC09871740, It changed to display the previous visits for last 60 Months (5 Years) irrespective of the visits.
                            var isNewerThanLimit = jobs[i].date && jobs[i].date >= oldestAllowed;
                            if (isNewerThanLimit) {
                                jobs[i].isCharge = jobs[i].tasks.some(function (t) { return task_1.Task.isChargeableTask(t.chargeType, noChargePrefix); });
                                previousJobs.push(jobs[i]);
                            }
                        }
                    }
                    return previousJobs;
                });
            });
        };
        PreviousJobsFactory = __decorate([
            aurelia_framework_1.inject(businessRuleService_1.BusinessRuleService),
            __metadata("design:paramtypes", [Object])
        ], PreviousJobsFactory);
        return PreviousJobsFactory;
    }());
    exports.PreviousJobsFactory = PreviousJobsFactory;
});

//# sourceMappingURL=previousJobsFactory.js.map
