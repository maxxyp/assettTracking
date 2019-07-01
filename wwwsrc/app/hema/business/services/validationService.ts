import * as Logging from "aurelia-logging";
import {IValidationService} from "./interfaces/IValidationService";
import {CatalogService} from "./catalogService";
import {ICatalogService} from "./interfaces/ICatalogService";
import {inject} from "aurelia-dependency-injection";
import {ValidationController} from "./validation/validationController";
import {ValidationRuleProperty} from "./validation/validationRuleProperty";
import {RequiredRule} from "./validation/rules/requiredRule";
import {IsNumberRule} from "./validation/rules/isNumberRule";
import {HasLengthBetweenRule} from "./validation/rules/hasLengthBetweenRule";
import {HasMinLengthRule} from "./validation/rules/hasMinLengthRule";
import {HasMaxLengthRule} from "./validation/rules/hasMaxLengthRule";
import {IsBetweenRule} from "./validation/rules/isBetweenRule";
import {IsGreaterThanOrEqualToRule} from "./validation/rules/isGreaterThanOrEqualToRule";
import {IsLessThanOrEqualToRule} from "./validation/rules/isLessThanOrEqualToRule";
import {RegExpRule} from "./validation/rules/regExpRule";
import {LabelService} from "./labelService";
import {ILabelService} from "./interfaces/ILabelService";
import {ValidationCombinedResult} from "./validation/validationCombinedResult";
import { ValidationPropertyResult } from "./validation/rules/validationPropertyResult";
import {IDynamicRule} from "./validation/IDynamicRule";
import {PassesRule} from "./validation/rules/passesRule";
import {StringHelper} from "../../../common/core/stringHelper";
import {BusinessException} from "../models/businessException";
import {IsDateRule} from "./validation/rules/isDateRule";
import {IsBetweenDateRule} from "./validation/rules/isBetweenDateRule";
import {IsGreaterThanOrEqualToDateRule} from "./validation/rules/isGreaterThanOrEqualToDateRule";
import {IsLessThanOrEqualToDateRule} from "./validation/rules/isLessThanOrEqualToDateRule";
import * as moment from "moment";
import {HasLengthRule} from "./validation/rules/hasLengthRule";
import {IValidationRule} from "./validation/IValidationRule";
import {IValidation} from "../models/reference/IValidation";
import {ValidationRule} from "./validation/validationRule";
import {IRuleOptions} from "./validation/IRuleOptions";

@inject(CatalogService, LabelService)
export class ValidationService implements IValidationService {
    private _catalogService: ICatalogService;
    private _labelService: ILabelService;

    private _labels: { [key: string]: string};
    private _logger: Logging.Logger;

    constructor(catalogService: ICatalogService, labelService: ILabelService) {
        this._catalogService = catalogService;
        this._labelService = labelService;

        this._logger = Logging.getLogger("ValidationService");
    }

    public build(subject: any, key: string, dynamicRules: IDynamicRule[]): Promise<ValidationController> {
        this._logger.debug("Building Validation Controller for " + key);
        if (subject && StringHelper.isString(key) && key.length > 0) {
            return this.loadLabels()
                .then(() => {
                    return this._catalogService.getValidations(key)
                        .then((ruleGroup) => {
                            let validationController: ValidationController = new ValidationController();
                            validationController.staticRules = {};
                            validationController.dynamicRules = {};
                            validationController.validationRuleProperties = {};
                            validationController.validationRuleGroups = {};

                            if (ruleGroup) {
                                ruleGroup.forEach(rule => {
                                    this.addStaticRule(validationController, rule);
                                });
                            }

                            if (dynamicRules) {
                                dynamicRules.forEach(dynamicRule => this.addDynamicRule(validationController, dynamicRule));
                            }

                            return validationController;
                        });
                });
        } else {
            return Promise.reject(new BusinessException(this, "build", "must be called with subject and key", null, null));
        }
    }

    public validate(validationController: ValidationController, subject: any, propertyName?: string): Promise<ValidationCombinedResult> {
        let validationCombinedResult: ValidationCombinedResult = new ValidationCombinedResult();

        validationCombinedResult.isValid = true;
        validationCombinedResult.propertyResults = {};
        validationCombinedResult.groups = [];

        if (validationController && validationController.validationRuleProperties) {
            /* are we validating a single property or everything */
            let propNames: string[] = [];

            if (propertyName) {
                if (StringHelper.endsWith(propertyName, "*")) {
                    let startsWith = propertyName.substr(0, propertyName.length - 1);

                    for (let vrp in validationController.validationRuleProperties) {
                        if (StringHelper.startsWith(vrp, startsWith)) {
                            propNames.push(vrp);
                        }
                    }
                } else {
                    if (validationController.validationRuleProperties[propertyName]) {
                        propNames = [propertyName];
                    }
                }
            } else {
                propNames = Object.keys(validationController.validationRuleProperties);
            }

            propNames.forEach(propName => {
                /* for each property get its associated groups */
                validationController.validationRuleProperties[propName].getGroups()
                    .forEach(groupName => {
                        /* lookup the group from the validation controller and get all the other properties in it */
                        if (validationController.validationRuleGroups[groupName]) {
                            validationController.validationRuleGroups[groupName]
                                .forEach(groupProperty => {
                                    /* add all the other group properties if they have not already been added */
                                    if (propNames.indexOf(groupProperty) < 0) {
                                        propNames.push(groupProperty);
                                    }
                                });
                        }
                    });
            });

            let promises: Promise<ValidationPropertyResult>[] = propNames.map(propName => validationController.validationRuleProperties[propName].validate(subject));

            return Promise.all(promises)
                .then((results: ValidationPropertyResult[]) => {
                    results.forEach(result => {
                        this._logger.debug("Is " + result.property + " Valid: " + (result.isValid ? "Yes" : "No"));

                        let groups = validationController.validationRuleProperties[result.property].getGroups();

                        groups.forEach(group => {
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
                .catch((error) => {
                    throw new BusinessException(this, "validationService.validate", "Couldnt validate: " + error, null, null);
                });
        } else {
            return Promise.resolve(validationCombinedResult);
        }
    }

    public addDynamicRule(validationController: ValidationController, dynamicRule: IDynamicRule): void {
        let propName: string = dynamicRule.property as string;

        if (propName) {
            let validationRuleProperty: ValidationRuleProperty;

            validationController.dynamicRules[propName] = dynamicRule;

            /* if there is an existing static rule then combine with that */
            if (validationController.validationRuleProperties[propName]) {
                validationRuleProperty = validationController.validationRuleProperties[propName];
                this._logger.debug("Merging dynamic rule for property " + propName);
            } else {
                /* otherwise create a new rule */
                validationRuleProperty = new ValidationRuleProperty(propName);
                validationController.validationRuleProperties[propName] = validationRuleProperty;
                this._logger.debug("Adding static rule for property " + propName);
            }

            if (dynamicRule.basedOn && validationController.staticRules[dynamicRule.basedOn]) {
                this.addRuleOptions(validationRuleProperty, validationController.staticRules[dynamicRule.basedOn]);
                if (validationController.staticRules[dynamicRule.basedOn].groups) {
                    dynamicRule.groups = validationController.staticRules[dynamicRule.basedOn].groups.concat(dynamicRule.groups);
                }
            }

            if (dynamicRule.groups) {
                validationRuleProperty.addGroups(dynamicRule.groups);
                dynamicRule.groups.forEach(group => {
                    validationController.validationRuleGroups[group] = validationController.validationRuleGroups[group] || [];
                    validationController.validationRuleGroups[group].push(propName);
                });
            }

            this.addRuleOptions(validationRuleProperty, dynamicRule);

            if (dynamicRule.condition) {
                validationRuleProperty.addCondition(dynamicRule.condition);
            }

            if (dynamicRule.passes) {
                dynamicRule.passes.forEach(passes => {
                    validationRuleProperty.addRule(new PassesRule(passes.test), passes.message);
                });
            }
        }
    }

    public removeDynamicRule(validationController: ValidationController, propertyName: string): void {
        if (validationController.dynamicRules[propertyName]) {
            delete validationController.dynamicRules[propertyName];
        }

        if (validationController.validationRuleProperties[propertyName]) {
            let groups = validationController.validationRuleProperties[propertyName].getGroups();

            if (groups) {
                groups.forEach(groupName => {
                    if (validationController.validationRuleGroups[groupName]) {
                        let propertyIndex = validationController.validationRuleGroups[groupName].indexOf(propertyName);

                        if (propertyIndex >= 0) {
                            validationController.validationRuleGroups[groupName].splice(propertyIndex, 1);
                        }
                    }
                });
            }

            delete validationController.validationRuleProperties[propertyName];
        }
    }

    private loadLabels(): Promise<void> {
        return this._labels ? Promise.resolve() : this._labelService.getGroup("validationRules")
            .then((labels) => {
                this._labels = labels;
            });
    }

    private addStaticRule(validationController: ValidationController, validation: IValidation): void {
        let validationRule = new ValidationRule();
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
            let validationRuleProperty: ValidationRuleProperty = new ValidationRuleProperty(validationRule.property);
            validationController.validationRuleProperties[validationRule.property] = validationRuleProperty;

            if (validationRule.groups) {
                validationRuleProperty.addGroups(validationRule.groups);

                validationRule.groups.forEach(group => {
                    validationController.validationRuleGroups[group] = validationController.validationRuleGroups[group] || [];
                    validationController.validationRuleGroups[group].push(validationRule.property);
                });
            }

            this.addRuleOptions(validationRuleProperty, validationRule);
        }
    }

    private addRuleOptions(validationRuleProperty: ValidationRuleProperty, ruleOptions: IRuleOptions): void {
        let requiredRule: RequiredRule;

        let currentRules: IValidationRule[] = validationRuleProperty.getValidationRules();
        if (currentRules && currentRules.length > 0 && currentRules[0] instanceof RequiredRule) {
            requiredRule = <RequiredRule>currentRules[0];
        } else {
            requiredRule = new RequiredRule();
            validationRuleProperty.addRule(requiredRule, this.getParameterisedLabel("required"));
        }

        requiredRule.setRequired(ruleOptions.required);

        if (ruleOptions.isNumber) {
            validationRuleProperty.addRule(new IsNumberRule(), this.getParameterisedLabel("canCoerceToNumber"));
        }

        if (ruleOptions.isAlphaNumeric) {
            validationRuleProperty.addRule(new RegExpRule(new RegExp("^[a-zA-Z0-9]*$")), this.getParameterisedLabel("isAlphaNumeric"));
        }

        if (ruleOptions.isDate) {
            validationRuleProperty.addRule(new IsDateRule(), this.getParameterisedLabel("isDate"));
        }

        if (ruleOptions.minLength !== undefined && ruleOptions.maxLength !== undefined) {
            if (ruleOptions.minLength === ruleOptions.maxLength) {
                validationRuleProperty.addRule(new HasLengthRule(ruleOptions.minLength),
                    this.getParameterisedLabel("hasLength", [ruleOptions.minLength, ruleOptions.maxLength]));
            } else {
                validationRuleProperty.addRule(new HasLengthBetweenRule(ruleOptions.minLength, ruleOptions.maxLength),
                    this.getParameterisedLabel("hasLengthBetween", [ruleOptions.minLength, ruleOptions.maxLength]));
            }
        } else if (ruleOptions.minLength !== undefined) {
            validationRuleProperty.addRule(new HasMinLengthRule(ruleOptions.minLength), this.getParameterisedLabel("hasMinLength", [ruleOptions.minLength]));
        } else if (ruleOptions.maxLength !== undefined) {
            validationRuleProperty.addRule(new HasMaxLengthRule(ruleOptions.maxLength), this.getParameterisedLabel("hasMaxLength", [ruleOptions.maxLength]));
        }

        if (ruleOptions.min !== undefined && ruleOptions.max !== undefined) {
            validationRuleProperty.addRule(new IsBetweenRule(ruleOptions.min, ruleOptions.max, ruleOptions.allowEmpty), this.getParameterisedLabel("isBetween", [ruleOptions.min, ruleOptions.max]));
        } else if (ruleOptions.min !== undefined) {
            validationRuleProperty.addRule(new IsGreaterThanOrEqualToRule(ruleOptions.min), this.getParameterisedLabel("isGreaterThanOrEqualTo", [ruleOptions.min]));
        } else if (ruleOptions.max !== undefined) {
            validationRuleProperty.addRule(new IsLessThanOrEqualToRule(ruleOptions.max), this.getParameterisedLabel("isLessThanOrEqualTo", [ruleOptions.max]));
        }

        if (ruleOptions.minDate !== undefined && ruleOptions.maxDate !== undefined) {
            validationRuleProperty.addRule(new IsBetweenDateRule(
                moment(ruleOptions.minDate).toDate(), moment(ruleOptions.maxDate).toDate()), this.getParameterisedLabel("isBetweenDate", [ruleOptions.minDate, ruleOptions.maxDate]));
        } else if (ruleOptions.minDate !== undefined) {
            validationRuleProperty.addRule(new IsGreaterThanOrEqualToDateRule(moment(ruleOptions.minDate).toDate()), this.getParameterisedLabel("isGreaterThanOrEqualToDate", [ruleOptions.minDate]));
        } else if (ruleOptions.maxDate !== undefined) {
            validationRuleProperty.addRule(new IsLessThanOrEqualToDateRule(moment(ruleOptions.maxDate).toDate()), this.getParameterisedLabel("isLessThanOrEqualToDate", [ruleOptions.maxDate]));
        }

        if (ruleOptions.regExp !== undefined) {
            validationRuleProperty.addRule(new RegExpRule(new RegExp(ruleOptions.regExp)), ruleOptions.regExpError ? ruleOptions.regExpError : this.getParameterisedLabel("regExp"));
        }

        if (ruleOptions.message !== undefined) {
            validationRuleProperty.setMessage(ruleOptions.message);
        }
    }

    private getParameterisedLabel(labelId: string, parameters?: any[]): string {
        if (this._labels && this._labels[labelId] !== undefined) {
            let labelText: string = this._labels[labelId];

            if (parameters && parameters.length > 0) {
                return labelText.replace(/{(\d+)}/g, (match, idx) => {
                    return parameters[idx];
                });
            } else {
                return labelText;
            }
        } else {
            return "<missing validation label>";
        }
    }
}
