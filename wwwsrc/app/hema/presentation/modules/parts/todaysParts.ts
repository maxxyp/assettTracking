import {inject} from "aurelia-framework";
import {EditableViewModel} from "../../models/editableViewModel";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {LabelService} from "../../../business/services/labelService";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {IJobService} from "../../../business/services/interfaces/IJobService";
import {JobService} from "../../../business/services/jobService";
import {IEngineerService} from "../../../business/services/interfaces/IEngineerService";
import {EngineerService} from "../../../business/services/engineerService";
import {IValidationService} from "../../../business/services/interfaces/IValidationService";
import {ValidationService} from "../../../business/services/validationService";
import {IBusinessRuleService} from "../../../business/services/interfaces/IBusinessRuleService";
import {BusinessRuleService} from "../../../business/services/businessRuleService";
import {ICatalogService} from "../../../business/services/interfaces/ICatalogService";
import {CatalogService} from "../../../business/services/catalogService";
import {IPartService} from "../../../business/services/interfaces/IPartService";
import {PartService} from "../../../business/services/partService";
import {ITaskService} from "../../../business/services/interfaces/ITaskService";
import {TaskService} from "../../../business/services/taskService";
import {Part} from "../../../business/models/part";
import {PartNotUsedReturn} from "../../../business/models/partNotUsedReturn";
import {PartWarrantyReturn} from "../../../business/models/partWarrantyReturn";

import {IDynamicRule} from "../../../business/services/validation/IDynamicRule";
import {ButtonListItem} from "../../../../common/ui/elements/models/buttonListItem";
import {DataState} from "../../../business/models/dataState";
import {ValidationCombinedResult} from "../../../business/services/validation/validationCombinedResult";
import {ObjectHelper} from "../../../../common/core/objectHelper";
import { TodaysPartViewModel } from "./viewModels/todaysPartViewModel";
import {PartsFactory} from "../../../presentation/factories/partsFactory";
import {IPartsFactory} from "../../../presentation/factories/interfaces/IPartsFactory";
import {ChargeServiceConstants} from "../../../business/services/constants/chargeServiceConstants";
import {BindingEngine} from "aurelia-binding";
import {CatalogConstants} from "../../../business/services/constants/catalogConstants";

@inject(JobService, EngineerService, LabelService, EventAggregator, DialogService,
    ValidationService, BusinessRuleService, CatalogService, PartService, TaskService, BindingEngine,
    PartsFactory)
export class TodaysParts extends EditableViewModel {

    public parts: TodaysPartViewModel[];
    public yesNoLookup: ButtonListItem[];
    public returnReasonLookup: ButtonListItem[];
    public isFullScreen: boolean;

    private _partService: IPartService;
    private _taskService: ITaskService;

    private _partSubscriptions: Subscription[];
    private _bindingEngine: BindingEngine;
    private _partsFactory: IPartsFactory;

    private _stockReferencePrefixesToStopWarrantyReturn: string[];

    constructor(jobService: IJobService,
                engineerService: IEngineerService,
                labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                validationService: IValidationService,
                businessRuleService: IBusinessRuleService,
                catalogService: ICatalogService,
                partService: IPartService,
                taskService: ITaskService,
                bindingEngine: BindingEngine,
                partsFactory: IPartsFactory) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService);
        this.validationRules = {};
        this._partService = partService;
        this._taskService = taskService;
        this._bindingEngine = bindingEngine;
        this._partsFactory = partsFactory;
        this.isFullScreen = window.isFullScreen;
    }

    public activateAsync(): Promise<any> {
        if (this._isCleanInstance) {
            return this.loadBusinessRules()
                .then(() => this.loadCatalogs())
                .then(() => this.load())
                .then(() => this.buildValidationRules())
                .then(() => this.showContent());
        } else {
            return this.load()
                .then(() => this.buildValidationRules());
        }
    }

    public deactivateAsync(): Promise<void> {
        this._partSubscriptions.forEach(subscription => subscription.dispose());
        this._partSubscriptions = [];
        return Promise.resolve();
    }

    public setSameRefAsOriginal(warrantyReturn: PartWarrantyReturn, part: Part): void {
        warrantyReturn.removedPartStockReferenceId = part.stockReferenceId;
    }

    protected validationUpdated(validationCombinedResult: ValidationCombinedResult): void {
        // to keep row indicators up to date, we hook in here to see if any given part has changed its validation state

        let getPartDataState = (partKey: string): DataState => {
            let thisPartPropertyResults = Object.keys(validationCombinedResult.propertyResults)
                .map(key => validationCombinedResult.propertyResults[key])
                .filter(propertyResult => propertyResult.property.lastIndexOf(partKey) === 0);

            return thisPartPropertyResults.some(propertyResult => !propertyResult.isValid)
                ? DataState.invalid
                : DataState.valid;
        };

        if (validationCombinedResult && validationCombinedResult.groups) {
            validationCombinedResult.groups
                .filter(groupKey => groupKey.indexOf("[") !== 1)
                .forEach(partKey => {
                    let partDataState = getPartDataState(partKey);
                    let todaysPartViewModel = <TodaysPartViewModel>ObjectHelper.getPathValue(this, partKey);
                    todaysPartViewModel.dataStateIndicator = partDataState;
                });
        }
    }

    protected loadModel(): Promise<void> {
        return Promise.all([
            this._partService.getTodaysParts(this.jobId),
            this._taskService.getTasks(this.jobId)
        ])
        .then(([partsToday, tasks]) => {

            let stockReferencePrefixesToStopWarrantyReturn = this.getBusinessRule<string>("stockReferencePrefixesToStopWarrantyReturn");

            this._stockReferencePrefixesToStopWarrantyReturn = (stockReferencePrefixesToStopWarrantyReturn && stockReferencePrefixesToStopWarrantyReturn.indexOf(",") !== -1) ?
                                                                    stockReferencePrefixesToStopWarrantyReturn.split(",") :
                                                                    [stockReferencePrefixesToStopWarrantyReturn];
            this.parts = [];

            if (partsToday.parts && tasks) {
                partsToday.parts.forEach(part => {
                    let task = tasks.find(t => t.id === part.taskId);
                    let vm = this._partsFactory.createTodaysPartViewModel(part, task);
                    vm.isWarrantyReturnOptionAvailable = (this._stockReferencePrefixesToStopWarrantyReturn.indexOf(part.stockReferenceId.substring(0, 1)) === -1);
                    this.parts.push(vm);
                });
            }

            this.setInitialDataState(partsToday.dataStateId, partsToday.dataState);

            this.addPartChangeHanders();
        });
    }

    protected saveModel(): Promise<void> {
        let partsArugment = this.parts.map(part => ({
            partId: part.part.id,
            notusedReturn: part.notUsedReturn,
            warrantyReturn: part.warrantyReturn
        }));
        return this._partService.saveTodaysPartsReturns(this.jobId, this.getFinalDataState(), partsArugment)
                    .then(() => {
                        if (this._isDirty) {
                            this._eventAggregator.publish(ChargeServiceConstants.CHARGE_UPDATE_START, this.jobId);
                        }
                    });
    }

    protected clearModel(): Promise<void> {
        this.parts.forEach(part => {
            part.warrantyReturn.isWarrantyReturn = undefined;
            part.warrantyReturn.quantityToClaimOrReturn = undefined;
            part.warrantyReturn.reasonForClaim = undefined;
            part.warrantyReturn.removedPartStockReferenceId = undefined;
            part.notUsedReturn.quantityToReturn = undefined;
            part.notUsedReturn.reasonForReturn = undefined;
        });
        return Promise.resolve();
    }

    private addPartChangeHanders(): void {
        this._partSubscriptions = [];

        this.parts.forEach(part => {

            this._partSubscriptions.push(
                this._bindingEngine
                    .propertyObserver(part.warrantyReturn, "isWarrantyReturn")
                    .subscribe(() => this.isWarrantyChangeHandler(part.warrantyReturn))
            );

            this._partSubscriptions.push(
                this._bindingEngine
                    .propertyObserver(part.warrantyReturn, "quantityToClaimOrReturn")
                    .subscribe((newValue, oldValue) => this.warrantyQuantityChangeHandler(newValue, oldValue, part))
            );

            this._partSubscriptions.push(
                this._bindingEngine
                    .propertyObserver(part.notUsedReturn, "reasonForReturn")
                    .subscribe(() => this.returnReasonChangeHandler(part.notUsedReturn))
            );

            this._partSubscriptions.push(
                this._bindingEngine
                    .propertyObserver(part.notUsedReturn, "quantityToReturn")
                    .subscribe((newValue, oldValue) => this.notUsedReturnQuantityChangeHandler(newValue, oldValue, part))
            );
        });
    }

    private isWarrantyChangeHandler(warrantyReturn: PartWarrantyReturn): void {
        if (warrantyReturn.isWarrantyReturn && !warrantyReturn.quantityToClaimOrReturn) {
            warrantyReturn.quantityToClaimOrReturn = 1;
        }
    }

    private warrantyQuantityChangeHandler(newValue: number, oldValue: number, part: TodaysPartViewModel): void {
        newValue = newValue || 0;
        oldValue = oldValue || 0;
        let partQuantity = part.part.quantity || 0;

        let isQuantityIncreasing = newValue > oldValue;
        let isQuantityValid = newValue <= partQuantity;
        let isOtherQuantityStillValid = partQuantity >= newValue + (part.notUsedReturn.quantityToReturn || 0);

        if (isQuantityIncreasing && isQuantityValid && !isOtherQuantityStillValid) {
            let newValidOtherQuantity = partQuantity - newValue;
            part.notUsedReturn.quantityToReturn = newValidOtherQuantity;
            if (newValidOtherQuantity === 0) {
                part.notUsedReturn.reasonForReturn = undefined;
            }
        }
    }

    private returnReasonChangeHandler(notusedReturn: PartNotUsedReturn): void {
        if (notusedReturn.reasonForReturn && !notusedReturn.quantityToReturn) {
            notusedReturn.quantityToReturn = 1;
        }
    }

    private notUsedReturnQuantityChangeHandler(newValue: number, oldValue: number, part: TodaysPartViewModel): void {
        newValue = newValue || 0;
        oldValue = oldValue || 0;
        let partQuantity = part.part.quantity || 0;

        let isQuantityIncreasing = newValue > oldValue;
        let isQuantityValid = newValue <= partQuantity;

        // ">" rather than ">=" so that if warrantyReturn.quantityToClaimOrReturn is 0 or undefined, warranty is set to false
        let isOtherQuantityStillValid = partQuantity > newValue + (part.warrantyReturn.quantityToClaimOrReturn || 0);

        if (isQuantityIncreasing && isQuantityValid && !isOtherQuantityStillValid) {
            let newValidOtherQuantity = partQuantity - newValue;
            part.warrantyReturn.quantityToClaimOrReturn = newValidOtherQuantity;
            if (newValidOtherQuantity === 0) {
                part.warrantyReturn.isWarrantyReturn = false;
            }
        }

        if (newValue === 0) {
            part.notUsedReturn.reasonForReturn = undefined;
        }
    }

    private buildValidationRules(): Promise<void> {
        return this.buildValidation(this.parts.reduce((prev: IDynamicRule[], curr: TodaysPartViewModel, idx: number) => {
            prev = prev.concat(this.buildPartsToOrderListItemValidationRules(idx));
            return prev;
        }, []));
    }

    private buildPartsToOrderListItemValidationRules(index: number): IDynamicRule[] {
        let itemRules: IDynamicRule[] = [];
        /*
         #13979 When the user hits the screen for the first time the tab-level indicator and all part-level indicators should be notVisited.
         As soon as one part is touched, the validation layer will turn the tab indicator to red (or green, if only one part).  The indicator for the touched part
         should go valid or invalid, and we need all other not visited parts' indicators to go red to match how the validation framework has
         set the tab indicator.  (i.e. once the tab indicator has gone red, it looks wrong that the other parts are all orange still).
         To provide this behaviour, we use the following rule which lets us make each part invalid as soon as one part is touched.
         */
        itemRules.push({
            property: `parts[${index}]`,
            condition: () => this.parts[index].notUsedReturn.quantityToReturn === undefined
            && this.parts[index].warrantyReturn.isWarrantyReturn === undefined,
            passes: [{test: () => false, message: null}],
            // parts group required to make sure all parts validation fired off whenever on part changes
            // parts[${index}] group required to isolate which part is changing within this.validationUpdated(...) method
            groups: ["parts", `parts[${index}]`],
        });

        itemRules.push({
            property: `parts[${index}].notUsedReturn.quantityToReturn`,
            basedOn: "parts.notUsedReturn.quantityToReturn",
            condition: () => this.parts[index].notUsedReturn.reasonForReturn !== undefined,
            groups: ["parts", `parts[${index}]`]
        });

        itemRules.push({
            property: `parts[${index}].notUsedReturn.reasonForReturn`,
            basedOn: "parts.notUsedReturn.reasonForReturn",
            condition: () => !!this.parts[index].notUsedReturn.quantityToReturn,
            groups: ["parts", `parts[${index}]`],
        });

        // this rule is required so that a change in isWarrantyReturn is picked up in our this.validationUpdated(...) method logic
        //  (even though we do need direct validation on this property)
        itemRules.push({
            property: `parts[${index}].warrantyReturn.isWarrantyReturn`,
            basedOn: "parts.warrantyReturn.isWarrantyReturn",
            condition: () => this.parts[index].warrantyReturn.isWarrantyReturn !== undefined,
            groups: ["parts", `parts[${index}]`]
        });

        itemRules.push({
            property: `parts[${index}].warrantyReturn.quantityToClaimOrReturn`,
            basedOn: "parts.warrantyReturn.quantityToClaimOrReturn",
            condition: () => !!this.parts[index].warrantyReturn.isWarrantyReturn,
            groups: ["parts", `parts[${index}]`]
        });

        itemRules.push({
            property: `parts[${index}].warrantyReturn.removedPartStockReferenceId`,
            basedOn: "parts.warrantyReturn.removedPartStockReferenceId",
            condition: () => !!this.parts[index].warrantyReturn.isWarrantyReturn,
            groups: ["parts", `parts[${index}]`]
        });

        itemRules.push({
            property: `parts[${index}].warrantyReturn.reasonForClaim`,
            basedOn: "parts.warrantyReturn.reasonForClaim",
            condition: () => !!this.parts[index].warrantyReturn.isWarrantyReturn,
            groups: ["parts", `parts[${index}]`]
        });

        return itemRules;
    }

    private loadCatalogs(): Promise<void> {
        return Promise.all([
            this.buildNoYesList()
                .then(yesNoList => {
                    this.yesNoLookup = yesNoList;
                }),
            this._catalogService.getPartsNotUsedReasons()
                .then(partNotUsedReasons => {
                    this.returnReasonLookup = this.toButtonListItemArray(partNotUsedReasons,
                        CatalogConstants.PARTS_NOT_USED_REASON_ID,
                        CatalogConstants.PARTS_NOT_USED_REASON_DESCRIPTION);
                })
        ]).return(null);
    }
}
