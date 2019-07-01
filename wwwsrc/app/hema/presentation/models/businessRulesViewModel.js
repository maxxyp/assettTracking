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
define(["require", "exports", "./validatableViewModel", "../../../common/ui/elements/models/buttonListItem", "../../../common/core/arrayHelper", "../../business/models/businessException", "../../../common/core/objectHelper", "../../../common/core/stringHelper", "../../business/models/yesNoNa"], function (require, exports, validatableViewModel_1, buttonListItem_1, arrayHelper_1, businessException_1, objectHelper_1, stringHelper_1, yesNoNa_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BusinessRulesViewModel = /** @class */ (function (_super) {
        __extends(BusinessRulesViewModel, _super);
        function BusinessRulesViewModel(labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService, validationService) || this;
            _this._businessRuleService = businessRuleService;
            _this._catalogService = catalogService;
            _this.businessRules = {};
            return _this;
        }
        BusinessRulesViewModel.numericSorter = function (columnName, descending) {
            if (descending === void 0) { descending = false; }
            return function (a, b) {
                if (+a[columnName] > +b[columnName]) {
                    return descending ? -1 : 1;
                }
                if (+a[columnName] < +b[columnName]) {
                    return descending ? 1 : -1;
                }
                return 0;
            };
        };
        BusinessRulesViewModel.prototype.loadBusinessRules = function () {
            var _this = this;
            return this._businessRuleService.getRuleGroup(stringHelper_1.StringHelper.toCamelCase(objectHelper_1.ObjectHelper.getClassName(this)))
                .then(function (businessRules) {
                _this.businessRules = businessRules;
                return;
            });
        };
        BusinessRulesViewModel.prototype.getBusinessRule = function (ruleKey) {
            if (!(ruleKey in this.businessRules)) {
                throw new businessException_1.BusinessException(this, "getBusinessRule", "Unable to get rule '{0}' for viewModel '{1}'", [ruleKey, objectHelper_1.ObjectHelper.getClassName(this)], null);
            }
            var ruleValue = this.businessRules[ruleKey];
            return ruleValue;
        };
        BusinessRulesViewModel.prototype.buildNoYesList = function () {
            var buttonListItems = [];
            buttonListItems.push(new buttonListItem_1.ButtonListItem(this.getLabel("no"), false, false));
            buttonListItems.push(new buttonListItem_1.ButtonListItem(this.getLabel("yes"), true, false));
            return Promise.resolve(buttonListItems);
        };
        BusinessRulesViewModel.prototype.buildYesNoList = function () {
            var buttonListItems = [];
            buttonListItems.push(new buttonListItem_1.ButtonListItem(this.getLabel("yes"), true, false));
            buttonListItems.push(new buttonListItem_1.ButtonListItem(this.getLabel("no"), false, false));
            return Promise.resolve(buttonListItems);
        };
        BusinessRulesViewModel.prototype.buildNoYesNaList = function () {
            var buttonListItems = [];
            buttonListItems.push(new buttonListItem_1.ButtonListItem(this.getLabel("no"), yesNoNa_1.YesNoNa.No, false));
            buttonListItems.push(new buttonListItem_1.ButtonListItem(this.getLabel("yes"), yesNoNa_1.YesNoNa.Yes, false));
            buttonListItems.push(new buttonListItem_1.ButtonListItem(this.getLabel("na"), yesNoNa_1.YesNoNa.Na, false));
            return Promise.resolve(buttonListItems);
        };
        BusinessRulesViewModel.prototype.buildNoNaList = function () {
            var buttonListItems = [];
            buttonListItems.push(new buttonListItem_1.ButtonListItem(this.getLabel("no"), yesNoNa_1.YesNoNa.No, false));
            buttonListItems.push(new buttonListItem_1.ButtonListItem(this.getLabel("na"), yesNoNa_1.YesNoNa.Na, false));
            return Promise.resolve(buttonListItems);
        };
        BusinessRulesViewModel.prototype.toSortedArray = function (values, sort) {
            if (!values) {
                return [];
            }
            else {
                var sortedValues = void 0;
                if (stringHelper_1.StringHelper.isString(sort)) {
                    sortedValues = arrayHelper_1.ArrayHelper.sortByColumn(values, sort);
                }
                else if (typeof (sort) === "function") {
                    sortedValues = values.sort(sort);
                }
                else {
                    sortedValues = values;
                }
                return sortedValues;
            }
        };
        BusinessRulesViewModel.prototype.toButtonListItemArray = function (values, valueField, descriptionField, sort) {
            var _this = this;
            return this.toSortedArray(values, sort).map(function (item) { return _this.toButtonListItem(item, valueField, descriptionField); });
        };
        BusinessRulesViewModel.prototype.toButtonListItem = function (value, valueField, descriptionField) {
            return new buttonListItem_1.ButtonListItem(objectHelper_1.ObjectHelper.getPathValue(value, descriptionField), objectHelper_1.ObjectHelper.getPathValue(value, valueField), false);
        };
        return BusinessRulesViewModel;
    }(validatableViewModel_1.ValidatableViewModel));
    exports.BusinessRulesViewModel = BusinessRulesViewModel;
});

//# sourceMappingURL=businessRulesViewModel.js.map
