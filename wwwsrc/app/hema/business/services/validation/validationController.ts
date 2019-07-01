import {ValidationRuleProperty} from "./validationRuleProperty";
import {IDynamicRule} from "./IDynamicRule";
import {ValidationRule} from "./validationRule";

export class ValidationController {
    public staticRules: { [key: string]: ValidationRule };
    public dynamicRules: { [key: string]: IDynamicRule };
    public validationRuleProperties: { [key: string]: ValidationRuleProperty };
    public validationRuleGroups: { [group: string]: string[] };
}
