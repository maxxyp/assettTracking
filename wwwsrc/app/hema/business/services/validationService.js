var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-logging", "./catalogService", "aurelia-dependency-injection", "./validation/validationController", "./validation/validationRuleProperty", "./validation/rules/requiredRule", "./validation/rules/isNumberRule", "./validation/rules/hasLengthBetweenRule", "./validation/rules/hasMinLengthRule", "./validation/rules/hasMaxLengthRule", "./validation/rules/isBetweenRule", "./validation/rules/isGreaterThanOrEqualToRule", "./validation/rules/isLessThanOrEqualToRule", "./validation/rules/regExpRule", "./labelService", "./validation/validationCombinedResult", "./validation/rules/passesRule", "../../../common/core/stringHelper", "../models/businessException", "./validation/rules/isDateRule", "./validation/rules/isBetweenDateRule", "./validation/rules/isGreaterThanOrEqualToDateRule", "./validation/rules/isLessThanOrEqualToDateRule", "moment", "./validation/rules/hasLengthRule", "./validation/validationRule"], function (require, exports, Logging, catalogService_1, aurelia_dependency_injection_1, validationController_1, validationRuleProperty_1, requiredRule_1, isNumberRule_1, hasLengthBetweenRule_1, hasMinLengthRule_1, hasMaxLengthRule_1, isBetweenRule_1, isGreaterThanOrEqualToRule_1, isLessThanOrEqualToRule_1, regExpRule_1, labelService_1, validationCombinedResult_1, passesRule_1, stringHelper_1, businessException_1, isDateRule_1, isBetweenDateRule_1, isGreaterThanOrEqualToDateRule_1, isLessThanOrEqualToDateRule_1, moment, hasLengthRule_1, validationRule_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidationService = /** @class */ (function () {
        function ValidationService(catalogService, labelService) {
            this._catalogService = catalogService;
            this._labelService = labelService;
            this._logger = Logging.getLogger("ValidationService");
        }
        ValidationService.prototype.build = function (subject, key, dynamicRules) {
            var _this = this;
            this._logger.debug("Building Validation Controller for " + key);
            if (subject && stringHelper_1.StringHelper.isString(key) && key.length > 0) {
                return this.loadLabels()
                    .then(function () {
                    return _this._catalogService.getValidations(key)
                        .then(function (ruleGroup) {
                        var validationController = new validationController_1.ValidationController();
                        validationController.staticRules = {};
                        validationController.dynamicRules = {};
                        validationController.validationRuleProperties = {};
                        validationController.validationRuleGroups = {};
                        if (ruleGroup) {
                            ruleGroup.forEach(function (rule) {
                                _this.addStaticRule(validationController, rule);
                            });
                        }
                        if (dynamicRules) {
                            dynamicRules.forEach(function (dynamicRule) { return _this.addDynamicRule(validationController, dynamicRule); });
                        }
                        return validationController;
                    });
                });
            }
            else {
                return Promise.reject(new businessException_1.BusinessException(this, "build", "must be called with subject and key", null, null));
            }
        };
        ValidationService.prototype.validate = function (validationController, subject, propertyName) {
            var _this = this;
            var validationCombinedResult = new validationCombinedResult_1.ValidationCombinedResult();
            validationCombinedResult.isValid = true;
            validationCombinedResult.propertyResults = {};
            validationCombinedResult.groups = [];
            if (validationController && validationController.validationRuleProperties) {
                /* are we validating a single property or everything */
                var propNames_1 = [];
                if (propertyName) {
                    if (stringHelper_1.StringHelper.endsWith(propertyName, "*")) {
                        var startsWith = propertyName.substr(0, propertyName.length - 1);
                        for (var vrp in validationController.validationRuleProperties) {
                            if (stringHelper_1.StringHelper.startsWith(vrp, startsWith)) {
                                propNames_1.push(vrp);
                            }
                        }
                    }
                    else {
                        if (validationController.validationRuleProperties[propertyName]) {
                            propNames_1 = [propertyName];
                        }
                    }
                }
                else {
                    propNames_1 = Object.keys(validationController.validationRuleProperties);
                }
                propNames_1.forEach(function (propName) {
                    /* for each property get its associated groups */
                    validationController.validationRuleProperties[propName].getGroups()
                        .forEach(function (groupName) {
                        /* lookup the group from the validation controller and get all the other properties in it */
                        if (validationController.validationRuleGroups[groupName]) {
                            validationController.validationRuleGroups[groupName]
                                .forEach(function (groupProperty) {
                                /* add all the other group properties if they have not already been added */
                                if (propNames_1.indexOf(groupProperty) < 0) {
                                    propNames_1.push(groupProperty);
                                }
                            });
                        }
                    });
                });
                var promises = propNames_1.map(function (propName) { return validationController.validationRuleProperties[propName].validate(subject); });
                return Promise.all(promises)
                    .then(function (results) {
                    results.forEach(function (result) {
                        _this._logger.debug("Is " + result.property + " Valid: " + (result.isValid ? "Yes" : "No"));
                        var groups = validationController.validationRuleProperties[result.property].getGroups();
                        groups.forEach(function (group) {
                            if (validationCombinedResult.groups.indexOf(group) < 0) {
                                validationCombinedResult.groups.push(group);
                            }
                        });
                        validationCombinedResult.propertyResults[result.property] = result;
                        if (!result.isValid) {
                            validationCombinedResult.isValid = false;
                        }
                    });
                    return validationCombinedResult;
                })
                    .catch(function (error) {
                    throw new businessException_1.BusinessException(_this, "validationService.validate", "Couldnt validate: " + error, null, null);
                });
            }
            else {
                return Promise.resolve(validationCombinedResult);
            }
        };
        ValidationService.prototype.addDynamicRule = function (validationController, dynamicRule) {
            var propName = dynamicRule.property;
            if (propName) {
                var validationRuleProperty_2;
                validationController.dynamicRules[propName] = dynamicRule;
                /* if there is an existing static rule then combine with that */
                if (validationController.validationRuleProperties[propName]) {
                    validationRuleProperty_2 = validationController.validationRuleProperties[propName];
                    this._logger.debug("Merging dynamic rule for property " + propName);
                }
                else {
                    /* otherwise create a new rule */
                    validationRuleProperty_2 = new validationRuleProperty_1.ValidationRuleProperty(propName);
                    validationController.validationRuleProperties[propName] = validationRuleProperty_2;
                    this._logger.debug("Adding static rule for property " + propName);
                }
                if (dynamicRule.basedOn && validationController.staticRules[dynamicRule.basedOn]) {
                    this.addRuleOptions(validationRuleProperty_2, validationController.staticRules[dynamicRule.basedOn]);
                    if (validationController.staticRules[dynamicRule.basedOn].groups) {
                        dynamicRule.groups = validationController.staticRules[dynamicRule.basedOn].groups.concat(dynamicRule.groups);
                    }
                }
                if (dynamicRule.groups) {
                    validationRuleProperty_2.addGroups(dynamicRule.groups);
                    dynamicRule.groups.forEach(function (group) {
                        validationController.validationRuleGroups[group] = validationController.validationRuleGroups[group] || [];
                        validationController.validationRuleGroups[group].push(propName);
                    });
                }
                this.addRuleOptions(validationRuleProperty_2, dynamicRule);
                if (dynamicRule.condition) {
                    validationRuleProperty_2.addCondition(dynamicRule.condition);
                }
                if (dynamicRule.passes) {
                    dynamicRule.passes.forEach(function (passes) {
                        validationRuleProperty_2.addRule(new passesRule_1.PassesRule(passes.test), passes.message);
                    });
                }
            }
        };
        ValidationService.prototype.removeDynamicRule = function (validationController, propertyName) {
            if (validationController.dynamicRules[propertyName]) {
                delete validationController.dynamicRules[propertyName];
            }
            if (validationController.validationRuleProperties[propertyName]) {
                var groups = validationController.validationRuleProperties[propertyName].getGroups();
                if (groups) {
                    groups.forEach(function (groupName) {
                        if (validationController.validationRuleGroups[groupName]) {
                            var propertyIndex = validationController.validationRuleGroups[groupName].indexOf(propertyName);
                            if (propertyIndex >= 0) {
                                validationController.validationRuleGroups[groupName].splice(propertyIndex, 1);
                            }
                        }
                    });
                }
                delete validationController.validationRuleProperties[propertyName];
            }
        };
        ValidationService.prototype.loadLabels = function () {
            var _this = this;
            return this._labels ? Promise.resolve() : this._labelService.getGroup("validationRules")
                .then(function (labels) {
                _this._labels = labels;
            });
        };
        ValidationService.prototype.addStaticRule = function (validationController, validation) {
            var validationRule = new validationRule_1.ValidationRule();
            validationRule.property = validation.property;
            validationRule.required = validation.required;
            validationRule.minLength = validation.minLength;
            validationRule.maxLength = validation.maxLength;
            validationRule.min = validation.min;
            validationRule.max = validation.max;
            validationRule.allowEmpty = validation.allowEmpty;
            validationRule.isNumber = validation.isNumber;
            validationRule.isDate = validation.isDate;
            validationRule.minDate = validation.minDate;
            validationRule.maxDate = validation.maxDate;
            validationRule.message = validation.message;
            validationRule.regExp = validation.regExp;
            validationRule.regExpError = validation.regExpError;
            validationRule.groups = validation.groups ? validation.groups.split(",") : undefined;
            validationRule.isAlphaNumeric = validation.isAlphaNumeric;
            validationRule.isBaseRule = validation.isBaseRule;
            this._logger.debug("Adding static rule for property " + validationRule.property);
            validationController.staticRules[validationRule.property] = validationRule;
            if (!validationRule.isBaseRule) {
                var validationRuleProperty = new validationRuleProperty_1.ValidationRuleProperty(validationRule.property);
                validationController.validationRuleProperties[validationRule.property] = validationRuleProperty;
                if (validationRule.groups) {
                    validationRuleProperty.addGroups(validationRule.groups);
                    validationRule.groups.forEach(function (group) {
                        validationController.validationRuleGroups[group] = validationController.validationRuleGroups[group] || [];
                        validationController.validationRuleGroups[group].push(validationRule.property);
                    });
                }
                this.addRuleOptions(validationRuleProperty, validationRule);
            }
        };
        ValidationService.prototype.addRuleOptions = function (validationRuleProperty, ruleOptions) {
            var requiredRule;
            var currentRules = validationRuleProperty.getValidationRules();
            if (currentRules && currentRules.length > 0 && currentRules[0] instanceof requiredRule_1.RequiredRule) {
                requiredRule = currentRules[0];
            }
            else {
                requiredRule = new requiredRule_1.RequiredRule();
                validationRuleProperty.addRule(requiredRule, this.getParameterisedLabel("required"));
            }
            requiredRule.setRequired(ruleOptions.required);
            if (ruleOptions.isNumber) {
                validationRuleProperty.addRule(new isNumberRule_1.IsNumberRule(), this.getParameterisedLabel("canCoerceToNumber"));
            }
            if (ruleOptions.isAlphaNumeric) {
                validationRuleProperty.addRule(new regExpRule_1.RegExpRule(new RegExp("^[a-zA-Z0-9]*$")), this.getParameterisedLabel("isAlphaNumeric"));
            }
            if (ruleOptions.isDate) {
                validationRuleProperty.addRule(new isDateRule_1.IsDateRule(), this.getParameterisedLabel("isDate"));
            }
            if (ruleOptions.minLength !== undefined && ruleOptions.maxLength !== undefined) {
                if (ruleOptions.minLength === ruleOptions.maxLength) {
                    validationRuleProperty.addRule(new hasLengthRule_1.HasLengthRule(ruleOptions.minLength), this.getParameterisedLabel("hasLength", [ruleOptions.minLength, ruleOptions.maxLength]));
                }
                else {
                    validationRuleProperty.addRule(new hasLengthBetweenRule_1.HasLengthBetweenRule(ruleOptions.minLength, ruleOptions.maxLength), this.getParameterisedLabel("hasLengthBetween", [ruleOptions.minLength, ruleOptions.maxLength]));
                }
            }
            else if (ruleOptions.minLength !== undefined) {
                validationRuleProperty.addRule(new hasMinLengthRule_1.HasMinLengthRule(ruleOptions.minLength), this.getParameterisedLabel("hasMinLength", [ruleOptions.minLength]));
            }
            else if (ruleOptions.maxLength !== undefined) {
                validationRuleProperty.addRule(new hasMaxLengthRule_1.HasMaxLengthRule(ruleOptions.maxLength), this.getParameterisedLabel("hasMaxLength", [ruleOptions.maxLength]));
            }
            if (ruleOptions.min !== undefined && ruleOptions.max !== undefined) {
                validationRuleProperty.addRule(new isBetweenRule_1.IsBetweenRule(ruleOptions.min, ruleOptions.max, ruleOptions.allowEmpty), this.getParameterisedLabel("isBetween", [ruleOptions.min, ruleOptions.max]));
            }
            else if (ruleOptions.min !== undefined) {
                validationRuleProperty.addRule(new isGreaterThanOrEqualToRule_1.IsGreaterThanOrEqualToRule(ruleOptions.min), this.getParameterisedLabel("isGreaterThanOrEqualTo", [ruleOptions.min]));
            }
            else if (ruleOptions.max !== undefined) {
                validationRuleProperty.addRule(new isLessThanOrEqualToRule_1.IsLessThanOrEqualToRule(ruleOptions.max), this.getParameterisedLabel("isLessThanOrEqualTo", [ruleOptions.max]));
            }
            if (ruleOptions.minDate !== undefined && ruleOptions.maxDate !== undefined) {
                validationRuleProperty.addRule(new isBetweenDateRule_1.IsBetweenDateRule(moment(ruleOptions.minDate).toDate(), moment(ruleOptions.maxDate).toDate()), this.getParameterisedLabel("isBetweenDate", [ruleOptions.minDate, ruleOptions.maxDate]));
            }
            else if (ruleOptions.minDate !== undefined) {
                validationRuleProperty.addRule(new isGreaterThanOrEqualToDateRule_1.IsGreaterThanOrEqualToDateRule(moment(ruleOptions.minDate).toDate()), this.getParameterisedLabel("isGreaterThanOrEqualToDate", [ruleOptions.minDate]));
            }
            else if (ruleOptions.maxDate !== undefined) {
                validationRuleProperty.addRule(new isLessThanOrEqualToDateRule_1.IsLessThanOrEqualToDateRule(moment(ruleOptions.maxDate).toDate()), this.getParameterisedLabel("isLessThanOrEqualToDate", [ruleOptions.maxDate]));
            }
            if (ruleOptions.regExp !== undefined) {
                validationRuleProperty.addRule(new regExpRule_1.RegExpRule(new RegExp(ruleOptions.regExp)), ruleOptions.regExpError ? ruleOptions.regExpError : this.getParameterisedLabel("regExp"));
            }
            if (ruleOptions.message !== undefined) {
                validationRuleProperty.setMessage(ruleOptions.message);
            }
        };
        ValidationService.prototype.getParameterisedLabel = function (labelId, parameters) {
            if (this._labels && this._labels[labelId] !== undefined) {
                var labelText = this._labels[labelId];
                if (parameters && parameters.length > 0) {
                    return labelText.replace(/{(\d+)}/g, function (match, idx) {
                        return parameters[idx];
                    });
                }
                else {
                    return labelText;
                }
            }
            else {
                return "<missing validation label>";
            }
        };
        ValidationService = __decorate([
            aurelia_dependency_injection_1.inject(catalogService_1.CatalogService, labelService_1.LabelService),
            __metadata("design:paramtypes", [Object, Object])
        ], ValidationService);
        return ValidationService;
    }());
    exports.ValidationService = ValidationService;
});

//# sourceMappingURL=validationService.js.map
