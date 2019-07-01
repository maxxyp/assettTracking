/// <reference path="../../../../typings/app.d.ts" />
import * as Logging from "aurelia-logging";
import {IBusinessRuleService} from "./interfaces/IBusinessRuleService";
import {inject} from "aurelia-framework";
import {CatalogService} from "./catalogService";
import {ICatalogService} from "./interfaces/ICatalogService";
import {BusinessException} from "../models/businessException";
import {QueryableBusinessRuleGroup} from "../models/businessRules/queryableBusinessRuleGroup";
import {ConfigurationService} from "../../../common/core/services/configurationService";
import {IConfigurationService} from "../../../common/core/services/IConfigurationService";
import {IBusinessRule} from "../models/reference/IBusinessRule";

@inject(CatalogService, ConfigurationService)
export class BusinessRuleService implements IBusinessRuleService {
    private _catalogService: ICatalogService;
    private _logger: Logging.Logger;

    constructor(catalogService: ICatalogService, configurationService: IConfigurationService) {
        this._catalogService = catalogService;

        this._logger = Logging.getLogger("BusinessRuleService");
    }

    public getRuleGroup(ruleGroupKey: string): Promise<{ [key: string]: any}> {
        return this._catalogService.getBusinessRules(ruleGroupKey)
            .then((data: IBusinessRule[]) => {
                let rules: {[key: string]: any} = {};
                if (data) {
                    data.forEach(r => {
                        rules[r.id] = r.rule;
                    });
                }
                return rules;
            })
            .catch((exc) => {
                let exception = new BusinessException(this, "getRuleGroup", "Getting rule group for key '{0}'", [ruleGroupKey], exc);
                this._logger.error(exception.toString());
                throw(exception);
            });
    }

    public getQueryableRuleGroup(ruleGroupKey: string): Promise<QueryableBusinessRuleGroup> {
        return this._catalogService.getBusinessRules(ruleGroupKey)
            .then((data: IBusinessRule[]) => {
                let ruleGroup: QueryableBusinessRuleGroup = new QueryableBusinessRuleGroup();
                ruleGroup.code = ruleGroupKey;
                ruleGroup.rules = [];

                if (data) {
                    ruleGroup.rules = data;
                }

                return ruleGroup;
            })
            .catch((exc) => {
                let exception = new BusinessException(this, "getRuleGroup", "Getting rule group for key '{0}'", [ruleGroupKey], exc);
                this._logger.error(exception.toString());
                throw(exception);
            });
    }
}
