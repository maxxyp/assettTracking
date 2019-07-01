define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var QueryableBusinessRuleGroup = /** @class */ (function () {
        function QueryableBusinessRuleGroup() {
        }
        QueryableBusinessRuleGroup.prototype.getBusinessRule = function (ruleKey) {
            var businessRule = this.rules.find(function (x) { return x.id === ruleKey; });
            if (!businessRule) {
                return null;
            }
            else {
                return (businessRule.rule);
            }
        };
        QueryableBusinessRuleGroup.prototype.getBusinessRuleList = function (ruleKey) {
            var businessRule = this.rules.find(function (x) { return x.id === ruleKey; });
            if (!businessRule) {
                return null;
            }
            else if (!(typeof (businessRule.rule) === "string")) {
                return null;
            }
            else {
                var splits = businessRule.rule.split(",");
                return splits.map(function (split) { return split; });
            }
        };
        return QueryableBusinessRuleGroup;
    }());
    exports.QueryableBusinessRuleGroup = QueryableBusinessRuleGroup;
});

//# sourceMappingURL=queryableBusinessRuleGroup.js.map
