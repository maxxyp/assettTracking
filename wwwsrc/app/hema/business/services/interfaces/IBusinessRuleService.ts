import {QueryableBusinessRuleGroup} from "../../models/businessRules/queryableBusinessRuleGroup";

export interface IBusinessRuleService {
    getRuleGroup(groupKey: string): Promise<{ [key: string]: any}>;
    getQueryableRuleGroup(groupKey: string): Promise<QueryableBusinessRuleGroup>;
}
