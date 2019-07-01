import { ChargeServiceConstants } from "../../../business/services/constants/chargeServiceConstants";
import { ChargesFactory } from "../../factories/chargesFactory";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { CatalogService } from "../../../business/services/catalogService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { ValidationService } from "../../../business/services/validationService";
import { EditableViewModel } from "../../models/editableViewModel";
import { inject } from "aurelia-framework";
import { LabelService } from "../../../business/services/labelService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { EngineerService } from "../../../business/services/engineerService";
import { JobService } from "../../../business/services/jobService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { ButtonListItem } from "../../../../common/ui/elements/models/buttonListItem";
import { ChargeMainViewModel } from "./viewModels/chargeMainViewModel";
import { IChargesFactory } from "../../factories/interfaces/IChargesFactory";
import { IChargeService } from "../../../business/services/interfaces/charge/IChargeService";
import { ChargeService } from "../../../business/services/charge/chargeService";
import { ChargeTaskViewModel } from "./viewModels/chargeTaskViewModel";
import { Charge } from "../../../business/models/charge/charge";
import { ChargeItemPartViewModel } from "./viewModels/chargeItemPartViewModel";
import { ChargeItemLabourViewModel } from "./viewModels/chargeItemLabourViewModel";
import { IDiscount } from "../../../business/models/reference/IDiscount";
import { CatalogConstants } from "../../../business/services/constants/catalogConstants";
import { IChargeDispute } from "../../../business/models/reference/IChargeDispute";
import * as bignumber from "bignumber";
import { BindingEngine, computedFrom } from "aurelia-binding";
import { ChargeCatalogHelperService } from "../../../business/services/charge/chargeCatalogHelperService";
import { IChargeCatalogHelperService } from "../../../business/services/interfaces/charge/IChargeCatalogHelperService";
import { IGoodsItemStatus } from "../../../business/models/reference/IGoodsItemStatus";
import { Task } from "../../../business/models/task";

@inject(LabelService, EventAggregator, DialogService, EngineerService, JobService, ValidationService,
    BusinessRuleService, CatalogService, ChargesFactory, ChargeService, BindingEngine, ChargeCatalogHelperService)

export class Charges extends EditableViewModel {

    public discountCatalog: IDiscount[];
    public chargeOptionCatalog: ButtonListItem[];
    public chargeDisputeCatalog: IChargeDispute[];
    public viewModel: ChargeMainViewModel;
    public hasCharge: boolean;
    public previousChargeSameAppliance: boolean;

    private _goodsItemStatusesCatalog: IGoodsItemStatus[];

    private _jobId: string;
    private _chargesFactory: IChargesFactory;
    private _chargeService: IChargeService;
    private _viewModelSubscriptions: Subscription[];

    private _bindingEngine: BindingEngine;

    // business rules
    private _noDiscountCode: string;
    private _complaintActionCategoryCharge: string;
    private _complaintReasonCodeCharge: string;
    private _chargeUpdateCompletedSub: Subscription;

    private readonly _CHARGE_NOT_OK: string;
    private _discountPercentageCode: string;
    private _discountFixedCode: string;

    private _chargeCatalogHelper: IChargeCatalogHelperService;

    constructor(labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                engineerService: IEngineerService,
                jobService: IJobService,
                validationService: IValidationService,
                businessRulesService: IBusinessRuleService,
                catalogService: ICatalogService,
                chargesFactory: IChargesFactory,
                chargeService: IChargeService,
                bindingEngine: BindingEngine,
                chargeCatalogHelper: IChargeCatalogHelperService) {

        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService);

        this._viewModelSubscriptions = [];
        this._bindingEngine = bindingEngine;
        this._chargesFactory = chargesFactory;
        this._chargeService = chargeService;
        this._chargeCatalogHelper = chargeCatalogHelper;
        this._CHARGE_NOT_OK = Charge.CHARGE_NOT_OK;
    }

    public deactivateAsync(): Promise<void> {
        this.removeObservables();
        if (this._chargeUpdateCompletedSub) {
            this._chargeUpdateCompletedSub.dispose();
            this._chargeUpdateCompletedSub = null;
        }
        return Promise.resolve();
    }

    public activateAsync(params: { jobId: string, applianceId: string }): Promise<any> {
        this._jobId = params.jobId;
        this.setupEvents();
        return this.buildValidationRules()
            .then(() => this.populateRules())
            .then(() => this.loadCatalogs())
            .then(() => this.load())
            .then(() => {
                if (this._chargeService.areChargesUptoDate() === true) {
                    this.showContent();
                }
            });
    }

    public canDeactivateAsync(): Promise<boolean> {
        return Promise.resolve(this._chargeService.areChargesUptoDate());
    }

    public toggleItem(task: ChargeTaskViewModel): void {
        if (task) {
            task.show = !task.show;
        }
    }

    public setDiscount(task: ChargeTaskViewModel): Promise<void> {

        const taskId = task.task.id;
        let businessModel = this._chargesFactory.createChargesBusinessModel(this.viewModel);
        const taskIndex = businessModel.tasks.findIndex(t => t.task.id === taskId);

        if (task.discountCode) {
            let chargeableTask = this._chargesFactory.createChargeableTaskBusinessModel(task);

            this._chargeService.applyDiscountToTask(chargeableTask, this.discountCatalog, this._discountPercentageCode, this._discountFixedCode, this._noDiscountCode);
            task.discountAmount = chargeableTask.discountAmount;
            task.discountText = chargeableTask.discountText;
            task.discountCode = chargeableTask.discountCode;
            task.netTotal = chargeableTask.netTotal;
            task.grossTotal = chargeableTask.grossTotal;
            task.vat = chargeableTask.vat;
            task.vatCode = chargeableTask.vatCode;

            businessModel.tasks[taskIndex] = chargeableTask;

            this._chargeService.updateTotals(businessModel);

            let viewModel = this._chargesFactory.createChargesViewModel(businessModel);

            this.viewModel.chargeTotal = viewModel.chargeTotal;
            this.viewModel.grossTotal = viewModel.grossTotal;
            this.viewModel.discountAmount = viewModel.discountAmount;
            this.viewModel.netTotal = viewModel.netTotal;

            this.validateAllRules();
        }

        return Promise.resolve();
    }

    public getPartItemDescription(item: ChargeItemPartViewModel): string {
        let warrantyOrReturn: string = "";

        const partsLabel = this.getLabel("parts");
        const previousLabel = this.getLabel("previous");
        let status = this.getGoodsItemStatusDescription(item.status);

        if (status) {
            status = status.toLowerCase();
        }

        let description = `${partsLabel} ${item.isFromPreviousActivity ? ` - ${previousLabel} ${status}` : ""}`;

        if (item.isWarranty && item.warrantyQty > 0) {
            warrantyOrReturn = `x${item.warrantyQty} ${this.getLabel("warranty")}`;
        }

        if (item.isReturn && item.returnQty > 0) {
            if (warrantyOrReturn !== "") {
                warrantyOrReturn = warrantyOrReturn + ", ";
            }
            warrantyOrReturn = `${warrantyOrReturn}x${item.returnQty} ${this.getLabel("return")}`;
        }

        if (warrantyOrReturn !== "") {
            return `${description} - ${warrantyOrReturn}`;
        }

        return description;
    }

    public getLabourItemDescription(item: ChargeItemLabourViewModel): string {
        return this.getLabel("labour");
    }

    public getHasCharge(): boolean {
        let flag = false;
        if (this.viewModel && this.viewModel.netTotal) {
            if (this.viewModel.netTotal.greaterThan(0)) {
                flag = true;
            }
        }
        return flag;
    }

    public get noErrors(): boolean {

        let noErrors = true;

        if (this.viewModel && this.viewModel.tasks) {
            for (let i = 0; i <= this.viewModel.tasks.length - 1; i++) {
                if (this.viewModel.tasks[i].error) {
                    noErrors = false;
                    break;
                }
            }
        }

        return noErrors;
    }

    public get hasErrors(): boolean {
        return !this.noErrors;
    }

    public readWarning(): void {
        this.viewModel.previousChargeSameApplianceConfirmed = true;
    }

    @computedFrom("viewModel.previousChargeSameApplianceConfirmed")
    public get showChargeOkQuestions(): boolean {

        // if previousCharge make sure user has confirmed the message

        if (this.viewModel && this.viewModel.previousChargeSameAppliance) {
            return this.viewModel.previousChargeSameApplianceConfirmed;
        }

        return true;
    }

    public getTotalChargableTime(task: Task): string {
        let totalChargableTime: number = 0;
        if (task) {
            totalChargableTime = task.chargeableTime || 0;
            task.previousVisits.forEach(pv => totalChargableTime += pv.chargeableTime || 0);
        }  
        
        return totalChargableTime > 1 ? totalChargableTime + " " + this.getLabel("minutes") : totalChargableTime + " " + this.getLabel("minute");
    }

    protected saveModel(): Promise<void> {

        return this.populateRules().then(() => {

            this.viewModel.dataState = this.getFinalDataState();

            if (this.viewModel.chargeComplaintActionCategory === this._complaintActionCategoryCharge) {
                this.viewModel.chargeReasonCode = this._complaintReasonCodeCharge;
            } else {
                this.viewModel.chargeReasonCode = undefined;
            }

            let model = this._chargesFactory.createChargesBusinessModel(this.viewModel);
            return this._chargeService.saveCharges(model);
        });
    }

    protected loadModel(): Promise<void> {
        if (this._chargeService.areChargesUptoDate() === true) {
            return this.loadCharges();
        } else {
            this.showBusy(`${this.getLabel("updatingCharges")} ...`);
            return Promise.resolve();
        }
    }

    protected clearModel(): Promise<void> {

        this.removeObservables();

        if (this.viewModel) {
            this.viewModel.discountAmount = undefined;
            this.viewModel.chargeOption = undefined;
            this.viewModel.remarks = undefined;
        }

        this.viewModel.tasks.forEach(task => {
            task.discountAmount = new bignumber.BigNumber(0);
            task.discountCode = undefined;
            task.discountText = "";
        });

        let businessModel = this._chargesFactory.createChargesBusinessModel(this.viewModel);

        this._chargeService.updateTotals(businessModel);
        this.viewModel = this._chargesFactory.createChargesViewModel(businessModel);

        this.setObservables();

        return Promise.resolve();
    }

    private getGoodsItemStatusDescription(status: string): string {

        if (!status || !this._goodsItemStatusesCatalog) {
            return "";
        }

        const item = this._goodsItemStatusesCatalog.find(g => g.status === status);

        if (!item || item.status === "FP") {
            return "";
        }

        return item.description;
    }

    private setupEvents(): void {
        this._chargeUpdateCompletedSub = this._eventAggregator.subscribe(ChargeServiceConstants.CHARGE_UPDATE_COMPLETED, () => {
            if (this._chargeService.areChargesUptoDate() === true) {
                this.loadCharges().then(() => {
                    this.showContent();
                });
            }
        });
    }

    private populateRules(): Promise<void> {
        return this._businessRuleService.getQueryableRuleGroup("chargeService")
            .then((ruleGroup) => {
                // setup rules
                this._noDiscountCode = ruleGroup.getBusinessRule<string>("noDiscountCode");
                this._complaintActionCategoryCharge = ruleGroup.getBusinessRule<string>("complaintActionCategoryCharge");
                this._complaintReasonCodeCharge = ruleGroup.getBusinessRule<string>("complaintCategoryBillingQuery");
                this._discountPercentageCode = ruleGroup.getBusinessRule<string>("discountPercentageCode");
                this._discountFixedCode = ruleGroup.getBusinessRule<string>("discountFixedCode");
            });
    }

    private setObservables(): void {
        let sub1 = this._bindingEngine.propertyObserver(this.viewModel, "chargeOption")
            .subscribe((newValue: string, oldValue: string) => {
                this.chargeOptionChanged(newValue, oldValue);
            });
        this._viewModelSubscriptions.push(sub1);

        if (this.viewModel && this.viewModel.tasks) {
            this.viewModel.tasks.forEach(task => {
                let sub = this._bindingEngine.propertyObserver(task, "discountCode")
                    .subscribe((newValue: boolean, oldValue: boolean) => {
                        this.setDiscount(task);
                    });
                this._viewModelSubscriptions.push(sub);
            });
        }
    }

    private removeObservables(): void {

        this._viewModelSubscriptions.forEach(s => {
            s.dispose();
            s = null;
        });

        this._viewModelSubscriptions = [];
    }

    private setHasCharge(): void {
        this.hasCharge = false;
        if (this.viewModel && this.viewModel.netTotal) {
            if (this.viewModel.netTotal.greaterThan(0)) {
                this.hasCharge = true;
            }
        }
        this.validateAllRules();
    }

    private loadCharges(): Promise<void> {
        this.removeObservables();
        return this._chargeService.loadCharges(this._jobId)
            .then((charges) => {
                if (charges) {
                    this.populateValues(charges);
                    this.setHasCharge();
                    this.setInitialDataState(this.viewModel.dataStateId, this.viewModel.dataState);
                    this.setObservables();
                    return Promise.resolve();
                } else {
                    return this._chargeService.applyCharges(this._jobId)
                        .then((jobcharges) => {
                            if (jobcharges) {
                                this.populateValues(jobcharges);
                                if (this.chargeDisputeCatalog) {
                                    this.setChargeDisputeText(this.viewModel.chargeComplaintActionCategory);
                                    this.viewModel.chargeComplaintActionCategory = this.chargeDisputeCatalog[0].id;
                                }
                                this.setInitialDataState(this.viewModel.dataStateId, this.viewModel.dataState);
                            } else {
                                this.viewModel = new ChargeMainViewModel();
                            }
                            this.setHasCharge();
                            this.setObservables();
                        });
                }
            });
    }

    private loadCatalogs(): Promise<void> {
        let noDiscount = <IDiscount>{};
        noDiscount.discountCode = this._noDiscountCode;
        const labelKey = "nodiscount";
        noDiscount.discountDescription = this.labels[labelKey];
        // noDiscount.discountValue = -999;
        // noDiscount.discountCategory = "";

        return Promise.all([
            this._catalogService.getDiscounts(),
            this._catalogService.getChargeOptions(),
            this._catalogService.getChargeDisputes(),
            this._catalogService.getGoodsItemStatuses()
        ]).then(([discounts, chargeOptions, chargeDisputes, goodsItemStatuses]) => {
            const validDiscounts = this._chargeCatalogHelper.getValidDiscounts(discounts);
            this.discountCatalog = [noDiscount, ...validDiscounts];
            this.chargeOptionCatalog = this.toButtonListItemArray(chargeOptions, CatalogConstants.CHARGE_OPTION_ID, CatalogConstants.CHARGE_OPTION_DESCRIPTION);
            this.chargeDisputeCatalog = chargeDisputes;
            this._goodsItemStatusesCatalog = goodsItemStatuses;
        });
    }

    private buildValidationRules(): Promise<void> {
        return this.buildValidation([
            {
                property: "viewModel.chargeComplaintActionCategory",
                condition: () => this.viewModel && this.viewModel.chargeOption === this._CHARGE_NOT_OK
            },
            {
                property: "viewModel.chargeOption",
                condition: () => this.hasCharge
            },
            {
                property: "viewModel.remarks",
                condition: () => this.viewModel && this.viewModel.chargeOption === this._CHARGE_NOT_OK
            },
            {
                property: "viewModel.previousChargeSameApplianceConfirmed",
                condition: () => this.previousChargeSameAppliance,
                passes: [
                    {
                        test: () => this.viewModel && this.viewModel.previousChargeSameApplianceConfirmed,
                        message: null
                    }]
            }
        ]);
    }

    private populateValues(businessModel: Charge): void {
        this.viewModel = this._chargesFactory.createChargesViewModel(businessModel);
        businessModel = this._chargesFactory.createChargesBusinessModel(this.viewModel);
        if (businessModel) {
            this._chargeService.updateTotals(businessModel);
        }
        this.viewModel = this._chargesFactory.createChargesViewModel(businessModel);
        this.setChargeDisputeText(this.viewModel.chargeComplaintActionCategory);
    }

    private chargeOptionChanged(newValue: string, oldValue: string): Promise<void> {

        if (newValue === this._CHARGE_NOT_OK) {
            this.setChargeDisputeText(this.chargeDisputeCatalog[0].id);
            this.viewModel.chargeComplaintActionCategory = this.chargeDisputeCatalog[0].id;
        }
        return this.validateAllRules();
    }

    private setChargeDisputeText(value: string): void {
        if (value && this.chargeDisputeCatalog) {
            let dispute = this.chargeDisputeCatalog.find(x => x.id === value);
            if (dispute) {
                this.viewModel.chargeDisputeText = dispute.description + " - " + dispute.id;
            }
        }
    }    
}
