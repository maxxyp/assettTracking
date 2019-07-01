import {ValidatableViewModel} from "./validatableViewModel";
import {IValidationService} from "../../business/services/interfaces/IValidationService";
import {IBusinessRuleService} from "../../business/services/interfaces/IBusinessRuleService";
import {ILabelService} from "../../business/services/interfaces/ILabelService";
import {ButtonListItem} from "../../../common/ui/elements/models/buttonListItem";
import {ICatalogService} from "../../business/services/interfaces/ICatalogService";
import {ArrayHelper} from "../../../common/core/arrayHelper";
import {BusinessException} from "../../business/models/businessException";
import {EventAggregator} from "aurelia-event-aggregator";
import {ObjectHelper} from "../../../common/core/objectHelper";
import {StringHelper} from "../../../common/core/stringHelper";
import {DialogService} from "aurelia-dialog";
import {YesNoNa} from "../../business/models/yesNoNa";

export abstract class BusinessRulesViewModel extends ValidatableViewModel {
    public businessRules: { [key: string]: any };

    protected _catalogService: ICatalogService;

    protected _businessRuleService: IBusinessRuleService;

    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRuleService: IBusinessRuleService,
        catalogService: ICatalogService) {
        super(labelService, eventAggregator, dialogService, validationService);

        this._businessRuleService = businessRuleService;
        this._catalogService = catalogService;
        this.businessRules = {};
    }

    public static numericSorter(columnName: string, descending: boolean = false) : (a: any, b: any) => number {
        return (a, b) => {
            if (+a[columnName] > +b[columnName]) {
                return descending ? -1 : 1;
            }
            if (+a[columnName] < +b[columnName]) {
                return descending ? 1 : -1;
            }
            return 0;
        };
    }

    public loadBusinessRules(): Promise<void> {
        return this._businessRuleService.getRuleGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(this)))
            .then((businessRules) => {
                this.businessRules = businessRules;
                return;
            });
    }

    public getBusinessRule<T>(ruleKey: string): T {
        if (!(ruleKey in this.businessRules)) {
            throw new BusinessException(this, "getBusinessRule", "Unable to get rule '{0}' for viewModel '{1}'", [ruleKey, ObjectHelper.getClassName(this)], null);
        }

        let ruleValue = this.businessRules[ruleKey];
        return <T>ruleValue;
    }

    public buildNoYesList(): Promise<ButtonListItem[]> {
        let buttonListItems: ButtonListItem[] = [];
        buttonListItems.push(new ButtonListItem(this.getLabel("no"), false, false));
        buttonListItems.push(new ButtonListItem(this.getLabel("yes"), true, false));
        return Promise.resolve(buttonListItems);
    }

    public buildYesNoList(): Promise<ButtonListItem[]> {
        let buttonListItems: ButtonListItem[] = [];
        buttonListItems.push(new ButtonListItem(this.getLabel("yes"), true, false));
        buttonListItems.push(new ButtonListItem(this.getLabel("no"), false, false));
        return Promise.resolve(buttonListItems);
    }

    public buildNoYesNaList(): Promise<ButtonListItem[]> {
        let buttonListItems: ButtonListItem[] = [];
        buttonListItems.push(new ButtonListItem(this.getLabel("no"), YesNoNa.No, false));
        buttonListItems.push(new ButtonListItem(this.getLabel("yes"), YesNoNa.Yes, false));
        buttonListItems.push(new ButtonListItem(this.getLabel("na"), YesNoNa.Na, false));
        return Promise.resolve(buttonListItems);
    }

    public buildNoNaList(): Promise<ButtonListItem[]> {
        let buttonListItems: ButtonListItem[] = [];
        buttonListItems.push(new ButtonListItem(this.getLabel("no"), YesNoNa.No, false));
        buttonListItems.push(new ButtonListItem(this.getLabel("na"), YesNoNa.Na, false));
        return Promise.resolve(buttonListItems);
    }

    public toSortedArray(values: any[], sort?: string | ((a: any, b: any) => number)): any[] {
        if (!values) {
            return [];
        } else {
            let sortedValues: any[];

            if (StringHelper.isString(sort)) {
                sortedValues = ArrayHelper.sortByColumn(values, <string>sort);
            } else if (typeof(sort) === "function") {
                sortedValues = values.sort(<(a: any, b: any) => number>sort);
            } else {
                sortedValues = values;
            }
            return sortedValues;
        }
    }

    public toButtonListItemArray(values: any[], valueField: string, descriptionField: string, sort?: string | ((a: any, b: any) => number)): ButtonListItem[] {
        return this.toSortedArray(values, sort).map(item => this.toButtonListItem(item, valueField, descriptionField));
    }

    public toButtonListItem(value: any, valueField: string, descriptionField: string): ButtonListItem {
        return new ButtonListItem(ObjectHelper.getPathValue(value, descriptionField), ObjectHelper.getPathValue(value, valueField), false);
    }
}
