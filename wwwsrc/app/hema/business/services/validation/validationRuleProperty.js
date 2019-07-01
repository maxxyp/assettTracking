define(["require", "exports", "./rules/validationPropertyResult", "../../../../common/core/objectHelper", "./rules/passesRule"], function (require, exports, validationPropertyResult_1, objectHelper_1, passesRule_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidationRuleProperty = /** @class */ (function () {
        function ValidationRuleProperty(propertyName) {
            this._propertyName = propertyName;
            this._groups = [];
            this._validationRules = [];
            this._validationRuleMessages = [];
        }
        ValidationRuleProperty.prototype.addCondition = function (condition) {
            this._condition = condition;
        };
        ValidationRuleProperty.prototype.addRule = function (validationRule, message) {
            this._validationRules.push(validationRule);
            this._validationRuleMessages.push(message);
        };
        ValidationRuleProperty.prototype.addGroups = function (groups) {
            if (groups) {
                this._groups = this._groups || [];
                this._groups = this._groups.concat(groups);
            }
        };
        ValidationRuleProperty.prototype.getGroups = function () {
            return this._groups;
        };
        ValidationRuleProperty.prototype.getValidationRules = function () {
            return this._validationRules;
        };
        ValidationRuleProperty.prototype.getValidationRuleMessages = function () {
            return this._validationRuleMessages;
        };
        ValidationRuleProperty.prototype.setMessage = function (message) {
            this._message = message;
        };
        ValidationRuleProperty.prototype.getMessage = function () {
            return this._message;
        };
        ValidationRuleProperty.prototype.requiresValidating = function () {
            var requiresValidating = true;
            if (this._condition && !this._condition()) {
                requiresValidating = false;
            }
            return requiresValidating;
        };
        ValidationRuleProperty.prototype.validate = function (subject) {
            var _this = this;
            var validationPropertyResult = new validationPropertyResult_1.ValidationPropertyResult();
            validationPropertyResult.property = this._propertyName;
            var requiresValidating = this.requiresValidating();
            if (requiresValidating && this._validationRules.length > 0) {
                var ruleCounter_1 = 0;
                var value_1 = objectHelper_1.ObjectHelper.getPathValue(subject, this._propertyName);
                var doNextRule_1 = function () {
                    return _this._validationRules[ruleCounter_1].test(value_1)
                        .then(function (isValid) {
                        validationPropertyResult.isValid = isValid;
                        if (!isValid) {
                            var isPasses = _this._validationRules[ruleCounter_1] instanceof passesRule_1.PassesRule;
                            if (_this._message && !isPasses) {
                                validationPropertyResult.message = _this._message;
                            }
                            else {
                                if (_this._validationRuleMessages[ruleCounter_1] instanceof Function) {
                                    validationPropertyResult.message = _this._validationRuleMessages[ruleCounter_1]();
                                }
                                else {
                                    validationPropertyResult.message = _this._validationRuleMessages[ruleCounter_1];
                                }
                            }
                            return validationPropertyResult;
                        }
                        else {
                            ruleCounter_1++;
                            if (ruleCounter_1 < _this._validationRules.length) {
                                return doNextRule_1();
                            }
                            else {
                                return validationPropertyResult;
                            }
                        }
                    });
                };
                return doNextRule_1();
            }
            else {
                validationPropertyResult.isValid = true;
                return Promise.resolve(validationPropertyResult);
            }
        };
        return ValidationRuleProperty;
    }());
    exports.ValidationRuleProperty = ValidationRuleProperty;
});

//# sourceMappingURL=validationRuleProperty.js.map
