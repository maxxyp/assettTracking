import {IBusinessRule} from "../reference/IBusinessRule";

export class QueryableBusinessRuleGroup {
    public code: string;
    public rules: IBusinessRule[];

    public getBusinessRule<T>(ruleKey: string) : T {
        let businessRule = this.rules.find(x => x.id === ruleKey);
        if (!businessRule) {
            return null;
        } else {
            return <T>(businessRule.rule);
        }
    }

    public getBusinessRuleList<T>(ruleKey: string) : T[] {
        let businessRule = this.rules.find(x => x.id === ruleKey);
        if (!businessRule) {
            return null;
        } else if (!(typeof(businessRule.rule) === "string")) {
            return null;
        } else {
            let splits: any[] = (<string>businessRule.rule).split(",");
            return splits.map(split => (<T>split));
        }
    }
}
