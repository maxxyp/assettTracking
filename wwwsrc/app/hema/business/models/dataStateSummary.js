define(["require", "exports", "./dataState", "./dataStateTotals", "../../../common/core/arrayHelper"], function (require, exports, dataState_1, dataStateTotals_1, arrayHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataStateSummary = /** @class */ (function () {
        function DataStateSummary(object) {
            this._states = {};
            this.calculate(object);
            if (DataStateSummary.dataStateCompletionOverrideGroup) {
                this.applyCompletionOverride();
            }
        }
        DataStateSummary.clearDataStateCompletionOverrideGroup = function () {
            DataStateSummary.dataStateCompletionOverrideGroup = undefined;
        };
        DataStateSummary.prototype.getTotals = function (group) {
            return this._states[group] ? this._states[group] : null;
        };
        DataStateSummary.prototype.getCombinedTotals = function () {
            var combined = new dataStateTotals_1.DataStateTotals();
            for (var group in this._states) {
                combined.dontCare += this._states[group].dontCare;
                combined.notVisited += this._states[group].notVisited;
                combined.invalid += this._states[group].invalid;
                combined.valid += this._states[group].valid;
            }
            return combined;
        };
        /*
            When no-accessing a job on the task screen, we want all the tabs to go "dont care",
             and the task tab data state to reflect the state of the task in focus, i.e. have the live state.
        */
        DataStateSummary.prototype.applyCompletionOverride = function () {
            var buildDontCareTotals = function () {
                var totals = new dataStateTotals_1.DataStateTotals();
                totals.dontCare = 1;
                return totals;
            };
            for (var key in this._states) {
                this._states[key] = (key === DataStateSummary.dataStateCompletionOverrideGroup)
                    ? this._states[DataStateSummary.dataStateCompletionOverrideGroup]
                    : buildDontCareTotals();
            }
        };
        DataStateSummary.prototype.calculate = function (object) {
            var _this = this;
            if (object) {
                if (this.isDataStateProvider(object)) {
                    this.update(object);
                }
                var _loop_1 = function (prop) {
                    var property = object[prop];
                    if (arrayHelper_1.ArrayHelper.isArray(property)) {
                        property.forEach(function (item) {
                            if (property && typeof item === "object") {
                                _this.calculate(item);
                            }
                        });
                    }
                    else {
                        if (property && typeof property === "object") {
                            this_1.calculate(property);
                        }
                    }
                };
                var this_1 = this;
                for (var prop in object) {
                    _loop_1(prop);
                }
            }
        };
        DataStateSummary.prototype.isDataStateProvider = function (object) {
            return object && "dataState" in object && "dataStateGroup" in object;
        };
        DataStateSummary.prototype.update = function (dataStateProvider) {
            this.addStateToGroup(dataStateProvider.dataState, dataStateProvider.dataStateGroup);
        };
        DataStateSummary.prototype.addStateToGroup = function (dataState, dataStateGroup) {
            if (!this._states[dataStateGroup]) {
                this._states[dataStateGroup] = new dataStateTotals_1.DataStateTotals();
            }
            switch (dataState) {
                case dataState_1.DataState.dontCare:
                    this._states[dataStateGroup].dontCare++;
                    break;
                case dataState_1.DataState.notVisited:
                    this._states[dataStateGroup].notVisited++;
                    break;
                case dataState_1.DataState.invalid:
                    this._states[dataStateGroup].invalid++;
                    break;
                case dataState_1.DataState.valid:
                    this._states[dataStateGroup].valid++;
                    break;
            }
        };
        return DataStateSummary;
    }());
    exports.DataStateSummary = DataStateSummary;
});

//# sourceMappingURL=dataStateSummary.js.map
