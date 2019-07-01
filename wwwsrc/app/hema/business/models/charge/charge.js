var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../dataState", "bignumber", "../dataStateProvider"], function (require, exports, dataState_1, bignumber, dataStateProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import { Task } from "../task";
    var Charge = /** @class */ (function (_super) {
        __extends(Charge, _super);
        function Charge() {
            var _this = _super.call(this, dataState_1.DataState.notVisited, "charges") || this;
            _this.tasks = [];
            return _this;
        }
        Object.defineProperty(Charge.prototype, "grossTotal", {
            get: function () {
                var total = new bignumber.BigNumber(0);
                for (var _i = 0, _a = this.tasks; _i < _a.length; _i++) {
                    var task = _a[_i];
                    if (task.error) {
                        this.error = true;
                        return new bignumber.BigNumber(0);
                    }
                    if (task.grossTotal) {
                        total = total.plus(task.grossTotal);
                    }
                }
                return total;
            },
            enumerable: true,
            configurable: true
        });
        Charge.prototype.calculatePrimeAndSubCharges = function () {
            var tasks = this.tasks;
            var _a = this.tasks, firstTask = _a[0], otherTasks = _a.slice(1); // prerequisite api has ordered tasks correctly
            // this scenario if all the tasks are no-charge and non-prime set first one as prime
            var noChargeTasks = this.tasks.filter(function (t) { return t.task.chargeType.substr(0, 2) === "NC"; });
            if (noChargeTasks.length === tasks.length) {
                // if at least one prime found just return as is
                var existsPrime = tasks.some(function (t) { return t.isSubsequent === false; });
                if (existsPrime) {
                    return;
                }
                // else we'll need to flag the first item as prime
                firstTask.isSubsequent = false;
                otherTasks.forEach(function (t) { return t.isSubsequent = true; });
                return;
            }
            // single item only
            if (tasks.length === 1) {
                if (firstTask.labourItem && !firstTask.error) {
                    firstTask.isSubsequent = false;
                }
                // check no errors for single task, e.g. missing prime charge
                firstTask.setErrorsPrimeAndSubCharges(true);
                return;
            }
            // more than one task
            var mostExpensiveTask;
            var currentMaxPrimeCharge = new bignumber.BigNumber(0);
            var numberOfPrimeTasks = 0;
            // find out how many prime tasks
            tasks.forEach(function (t) {
                if (t && !t.error) {
                    if (t.isSubsequent === false) {
                        numberOfPrimeTasks += 1;
                    }
                    if (t.labourItem && t.labourItem.chargePair && t.labourItem.chargePair.primeCharge.greaterThan(currentMaxPrimeCharge)) {
                        mostExpensiveTask = t;
                        currentMaxPrimeCharge = t.labourItem.chargePair.primeCharge;
                    }
                }
            });
            // if job has all prime tasks or single task job then no need raise errors if sub charge interval not found
            var ignoreSubsequentCharges = ((numberOfPrimeTasks === tasks.length) || tasks.length === 1);
            // check no errors as result of missing charges in catalog data
            tasks.map(function (task) { return task.setErrorsPrimeAndSubCharges(ignoreSubsequentCharges); });
            if (numberOfPrimeTasks === 1) {
                tasks.forEach(function (t) {
                    if (!t.useFixedPriceQuotation && !t.error) {
                        if (t.isSubsequent) {
                            t.labourItem.netAmount = t.labourItem.chargePair.subsequentCharge;
                        }
                        else {
                            t.labourItem.netAmount = t.labourItem.chargePair.primeCharge;
                        }
                    }
                });
                return;
            }
            if (numberOfPrimeTasks === 0) {
                // df_1775
                // if exists completed task, flag first completed as already completed and remaining subsequent
                var completedIndex_1 = tasks.findIndex(function (t) { return !t.task.isMiddlewareDoTodayTask && t.task.chargeType.substr(0, 2) !== "NC"; });
                if (completedIndex_1 > -1) {
                    tasks.forEach(function (task, idx) { return task.isSubsequent = idx !== completedIndex_1 && task.task.isMiddlewareDoTodayTask; });
                    return;
                }
                // find the most expensive prime task
                // mark most expensive item as prime, and use prime charge
                var mostExpensiveIndex = tasks.findIndex(function (t) { return t === mostExpensiveTask; });
                if (mostExpensiveTask) {
                    if (!mostExpensiveTask.useFixedPriceQuotation && !mostExpensiveTask.error) {
                        tasks[mostExpensiveIndex].labourItem.netAmount = tasks[mostExpensiveIndex].labourItem.chargePair.primeCharge;
                        tasks[mostExpensiveIndex].isSubsequent = false;
                    }
                    // others can be set to supplementary
                    for (var i = 0; i < tasks.length; i++) {
                        if (i !== mostExpensiveIndex) {
                            if (!tasks[i].useFixedPriceQuotation && !tasks[i].error) {
                                tasks[i].labourItem.netAmount = tasks[i].labourItem.chargePair.subsequentCharge;
                                tasks[i].isSubsequent = true;
                            }
                        }
                    }
                }
                else {
                    // so there might be a single chargeable job amongst non-chargeables, we should flag that as prime
                    var findChargeIndex_1 = tasks.findIndex(function (t) { return t.task.isCharge; });
                    tasks.forEach(function (t, i) { return t.isSubsequent = i !== findChargeIndex_1; });
                }
            }
        };
        Charge.CHARGE_OK = "1";
        Charge.CHARGE_NOT_OK = "2";
        return Charge;
    }(dataStateProvider_1.DataStateProvider));
    exports.Charge = Charge;
});

//# sourceMappingURL=charge.js.map
