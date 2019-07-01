import { inject } from "aurelia-framework";
import { observable } from "aurelia-binding";
import { EditableViewModel } from "../../models/editableViewModel";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { EngineerService } from "../../../business/services/engineerService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { ValidationService } from "../../../business/services/validationService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { CatalogService } from "../.././../business/services/catalogService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { IConsumableType } from "../../../business/models/reference/IConsumableType";
import { IConsumableService } from "../../../business/services/interfaces/IConsumableService";
import { ConsumableService } from "../../../business/services/consumableService";
import { ConsumablesBasket as ConsumablePartsBasket } from "../../../business/models/consumablesBasket";
import { ConsumablePart } from "../../../business/models/consumablePart";
import { FavouriteService } from "../../../business/services/favouriteService";
import { IFavouriteService } from "../../../business/services/interfaces/IFavouriteService";
import { ConsumableServiceConstants } from "../../../business/services/constants/consumableServiceConstants";
import { AdaptBusinessServiceConstants } from "../../../business/services/constants/adaptBusinessServiceConstants";

@inject(JobService, EngineerService, LabelService, EventAggregator,
    DialogService, ValidationService, BusinessRuleService, CatalogService, ConsumableService, FavouriteService)
export class ConsumablesBasket extends EditableViewModel {

    public static READ_CONSUMBALES_BASKET: string = "READ_CONSUMABLES_BASKET";

    public consumablesBasket: ConsumablePartsBasket;
    public showFaves: boolean;
    public consumablePartsList: IConsumableType[];
    public selectedConsumable: string;
    @observable
    public selectedConsumableItem: IConsumableType;
    public selectedConsumableQuantity: number;
    public noRecords: boolean;
    public showManual: boolean;
    public showFaveButton: boolean;
    public filteredItems: number;
    @observable
    public manualConsumablePartRef: string;
    @observable
    public manualConsumablePartDescription: string;
    @observable
    public manualConsumablePartQuantity: number;
    public dropDownElement: HTMLInputElement;
    public isConsumableValid: boolean;
    private _consumableService: IConsumableService;
    private _favouriteService: IFavouriteService;
    private _eventSubscriptions: Subscription[];
    private _consumableStockReferenceIdPrefixRule: string;

    constructor(
        jobService: IJobService,
        engineerService: IEngineerService,
        labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRulesService: IBusinessRuleService,
        catalogService: ICatalogService,
        consumableService: IConsumableService,
        favouriteService: IFavouriteService) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService);
        this._consumableService = consumableService;
        this.selectedConsumableQuantity = 1;
        this.showFaves = false;
        this.showManual = false;
        this._favouriteService = favouriteService;
        this.manualConsumablePartQuantity = 1;
        this._eventSubscriptions = [];
    }

    public activateAsync(): Promise<any> {
        this.canEdit = true;
        this.validationToggle(true);

        this._eventSubscriptions.push(
            this._eventAggregator.subscribe(AdaptBusinessServiceConstants.ADAPT_PARTS_SELECTED, (partIds: string[]) => this.updateConsumablesBasket(partIds))
        );

        this._eventAggregator.publish(ConsumablesBasket.READ_CONSUMBALES_BASKET);

        return this.loadBusinessRules()
            .then(() => this.loadCatalogs())
            .then(() => this.load())
            .then(() => this.buildValidationRules())
            .then(() => this.showContent());
    }

    public deactivateAsync(): Promise<void> {
        this.disposeEventSubscriptions();
        return Promise.resolve();
    }

    public addConsumable(): Promise<void> {
        return this.checkAllRules().then((validationResult) => {
            if (validationResult) {
                let consumablePart = () => {
                    return new ConsumablePart(
                        this.showManual ? this.manualConsumablePartRef.toUpperCase() : this.selectedConsumableItem.stockReferenceId.toUpperCase(),
                        this.showManual ? this.manualConsumablePartDescription : this.selectedConsumableItem.consumableTypeDescription,
                        this.showManual ? this.manualConsumablePartQuantity : this.selectedConsumableQuantity
                    );
                };

                this._consumableService.addConsumableToBasket(consumablePart())
                    .then(() => {
                        return this.fetchBasket().then(() => {
                            this.selectedConsumable = undefined;
                            this.selectedConsumableQuantity = 1;
                            this.showManual = false;
                            this.manualConsumablePartRef = undefined;
                            this.manualConsumablePartDescription = undefined;
                            this.manualConsumablePartQuantity = 1;
                        });
                    });
            } else {
                this.buildValidation();
            }
        });
    }

    public removeFavourite(index: number): Promise<void> {
        return this.showDeleteConfirmation()
            .then((shouldDelete) => {
                if (shouldDelete) {
                    this._consumableService.removeFavourite(index)
                        .then(() => {
                            return this.fetchBasket().then(() => this.selectedConsumableItemChanged());
                        });
                }
            });
    }

    public reOrder(item: ConsumablePart): void {
        if (item) {
            item.sent = false;
            this._consumableService.addConsumableToBasket(<ConsumablePart>item)
                .then(() => {
                    this.fetchBasket();
                });
        }
    }

    public placeConsumablesOrder(): void {
        // if the fave flag is set then add to favourites
        this.consumablesBasket.partsInBasket.forEach(part => {
            if (part.favourite && !part.sent) {
                this._favouriteService.addFavouriteConsumablePart(<ConsumablePart>part);
            }
        });

        this._consumableService.placeOrder(this.consumablesBasket).then(() => this.fetchBasket());
        this.showSuccess(this.getLabel("savedTitle"), this.getLabel("savedMessage"));
    }

    public removeConsumable(referenceId: string): void {
        this.showDeleteConfirmation()
            .then((shouldDelete) => {
                if (shouldDelete) {
                    this._consumableService.removeConsumableFromBasket(referenceId)
                        .then(() => {
                            this.fetchBasket();
                        });
                }
            });
    }

    public updateBasket(): void {
        this._consumableService.saveBasket(this.consumablesBasket);
    }

    public toggleFaves(): void {
        this.showFaves = !this.showFaves;
    }

    public selectedConsumableItemChanged(): void {
        if (this.selectedConsumable) {
            if (this.consumablesBasket.favourites.find(f => f.referenceId === this.selectedConsumableItem.stockReferenceId && f.sent === false)) {
                this.showFaveButton = false;
            } else {
                this.showFaveButton = true;
            }
        } else {
            this.showFaveButton = false;
        }
    }

    public saveAndSendBadgeEvent(item: ConsumablePart): void {
        this._consumableService.saveBasket(this.consumablesBasket).then(() => {
            this._consumableService.orderItemCount().then((total) => {
                this._eventAggregator.publish(ConsumableServiceConstants.CONSUMABLE_ADDED, total);
            });
        });
    }
    public showManualAdd(): void {
        this.showManual = true;
        let typedValue = <HTMLInputElement>this.dropDownElement.querySelector(".search-box");
        this.manualConsumablePartRef = typedValue.value.substr(0, 6);
        this.manualConsumablePartDescription = undefined;
        this.validateSingleRule("manualConsumablePartRef");
        this.validateSingleRule("manualConsumablePartDescription");
    }
    public hideManualAdd(): void {
        this.showManual = false;
        this.manualConsumablePartRef = undefined;
        this.manualConsumablePartDescription = undefined;
        this.manualConsumablePartQuantity = 1;
    }    

    public manualConsumablePartRefChanged(newValue: string, oldValue: string): void {
        this.testValidConsumable();
    }

    public manualConsumablePartDescriptionChanged(newValue: string, oldValue: string): void {
        this.testValidConsumable();
    }

    protected loadModel(): Promise<void> {
        this._consumableStockReferenceIdPrefixRule = this.getBusinessRule<string>("consumableStockRefIdPrefixRule");
        this.consumablesBasket = new ConsumablePartsBasket();
        return this._consumableService.clearOldOrders(60).then(() => {
            this._consumableService.getConsumablesBasket().then(partsBasket => {
                this.consumablesBasket = partsBasket;
                this.checkForOrdersPending();
            });
        });
    }

    private loadCatalogs(): Promise<void> {
        return this._catalogService.getConsumables()
            .then(consumables => {
                if (consumables && consumables.length > 0) {
                    this.consumablePartsList = consumables;
                } else {
                    return undefined;
                }
            });
    }
    private fetchBasket(): Promise<void> {
        return this._consumableService.getConsumablesBasket().then(partsBasket => {
            this.consumablesBasket = partsBasket;
            this.checkForOrdersPending();
        });
    }
    private buildValidationRules(): Promise<void> {
        return this.buildValidation([
            {
                property: "manualConsumablePartRef",
                condition: () => this.showManual
            },
            {
                property: "manualConsumablePartDescription",
                condition: () => this.showManual
            }]);
    }

    private checkForOrdersPending(): void {
        this.noRecords = this.consumablesBasket.partsInBasket.filter((p) => p.sent === false).length === 0;
    }

    private disposeEventSubscriptions(): void {
        if (this._eventSubscriptions) {
            this._eventSubscriptions.forEach(s => s.dispose());
            this._eventSubscriptions = [];
        }
    }

    private async updateConsumablesBasket(partIds: string[]): Promise<void> {
        let consumablePartsBasket = await this._consumableService.getConsumablesBasket();
        let partsAddedFromAdapt = consumablePartsBasket.partsInBasket.filter(p => partIds.indexOf(p.referenceId) !== -1 && p.sent === false);

        partsAddedFromAdapt.map(part => {
            let partIndex: number = this.consumablesBasket.partsInBasket.findIndex(p => p.referenceId === part.referenceId && p.sent === false);

            if (partIndex > -1) {
                this.consumablesBasket.partsInBasket[partIndex].quantity += 1;
            } else {
                this.consumablesBasket.partsInBasket.push(part);
            }
        });

        this.checkForOrdersPending();
    }

    private testValidConsumable(): void {
        this.isConsumableValid = false;
        if (!!this.manualConsumablePartRef && !!this.manualConsumablePartDescription && this.manualConsumablePartRef.length === this.validationRules.manualConsumablePartRef.maxLength) {
            let regexTest = new RegExp(this._consumableStockReferenceIdPrefixRule);            
            this.isConsumableValid = !regexTest.test(this.manualConsumablePartRef.substr(0, 1));
        }
    }
}
