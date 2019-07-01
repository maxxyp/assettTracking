/// <reference path="./../../../../../typings/app.d.ts" />
import { inject } from "aurelia-framework";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { BindingEngine, observable } from "aurelia-binding";
import { Router } from "aurelia-router";
import { CatalogService } from "../.././../business/services/catalogService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { AppLauncher } from "../../../../common/core/services/appLauncher";
import { IAppLauncher } from "../../../../common/core/services/IappLauncher";
import { IConfigurationService } from "../../../../common/core/services/IConfigurationService";
import { ConfigurationService } from "../../../../common/core/services/configurationService";
import { IHemaConfiguration } from "../../../IHemaConfiguration";
import { IPartService } from "../../../business/services/interfaces/IPartService";
import { PartService } from "../../../business/services/partService";
import { StorageService } from "../../../business/services/storageService";
import { IStorageService } from "../../../business/services/interfaces/IStorageService";
import { LabelService } from "../../../business/services/labelService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { ValidationService } from "../../../business/services/validationService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { EngineerService } from "../../../business/services/engineerService";
import { IVanStockService } from "../../../business/services/interfaces/IVanStockService";
import { VanStockService } from "../../../business/services/vanStockService";
import { EditableViewModel } from "../../models/editableViewModel";
import { VanStockNotice } from "../vanStock/vanStockNotice";
import { Guid } from "../../../../common/core/guid";
import { Part } from "../../../business/models/part";
import { ButtonListItem } from "../../../../common/ui/elements/models/buttonListItem";
import { AdaptBusinessServiceConstants } from "../../../business/services/constants/adaptBusinessServiceConstants";
import { ChargeServiceConstants } from "../../../business/services/constants/chargeServiceConstants";
import { AppointmentBookingService } from "../../../business/services/appointmentBookingService";
import { IAppointmentBookingService } from "../../../business/services/interfaces/IAppointmentBookingService";
import { StringHelper } from "../../../../common/core/stringHelper";
import { ObjectHelper } from "../../../../common/core/objectHelper";
import { AppointmentBooking } from "../appointment/appointmentBooking";
import { PartsBasketFactory } from "../../factories/partsBasketFactory";
import { PartsBasketViewModel } from "../../models/partsBasketViewModel";
import { IPartsBasketFactory } from "../../factories/interfaces/IPartsBasketFactory";
import * as bignumber from "bignumber";
import { ConsumableService } from "../../../business/services/consumableService";
import { IConsumableService } from "../../../business/services/interfaces/IConsumableService";
import { ConsumablePart } from "../../../business/models/consumablePart";
import { FavouriteService } from "../../../business/services/favouriteService";
import { IFavouriteService } from "../../../business/services/interfaces/IFavouriteService";
import { DateHelper } from "../../../core/dateHelper";
import { Job } from "../../../business/models/job";
import * as moment from "moment";
import { Task } from "../../../business/models/task";
import { ValidationCombinedResult } from "../../../business/services/validation/validationCombinedResult";
import { MaterialSearchResult } from "../../../business/models/materialSearchResult";
import { MaterialDialog } from "./materialDialog";
import { FeatureToggleService } from "../../../business/services/featureToggleService";
import { IFeatureToggleService } from "../../../business/services/interfaces/IFeatureToggleService";
import { VanStockReservationHelper } from "../vanStock/vanStockReservationHelper";
import { MaterialWithQuantities } from "../../../business/models/materialWithQuantities";

@inject(
    CatalogService,
    EngineerService,
    JobService,
    LabelService,
    PartService,
    EventAggregator,
    DialogService,
    ValidationService,
    BusinessRuleService,
    BindingEngine,
    Router,
    VanStockService,
    StorageService,
    AppLauncher,
    ConfigurationService,
    AppointmentBookingService,
    PartsBasketFactory,
    ConsumableService,
    FavouriteService,
    FeatureToggleService
)
export class PartsBasket extends EditableViewModel {
    public viewModel: PartsBasketViewModel;
    public tasksCatalog: { id: string; text: string }[];
    @observable public partsToOrderTotalPrice: number;
    @observable public showPartsToOrderList: boolean;
    public hideDeliverToSiteCheckbox: boolean;
    public yesNoLookup: ButtonListItem[];
    public quantityIncrementStep: number;
    public priceDecimalPlaces: number;
    @observable public showBookAppointmentButton: boolean;
    public search: Element;
    public brPartOrderStatus: string;
    public brVanStockPartOrderStatus: string;
    public isFullScreen: boolean;
    public materialSearchResults: { [stockReferenceId: string]: MaterialSearchResult };
    public inboundReservations: { [stockReferenceId: string]: number };

    public isVanStockEnabled: boolean;

    private _partService: IPartService;
    private _eventSubscriptions: Subscription[];
    private _bindingEngine: BindingEngine;
    private _viewModelPropertySubscriptions: Subscription[];
    private _userPatch: string;
    private _userSector: string;
    private _router: Router;
    private _vanStockService: IVanStockService;
    private _storageService: IStorageService;
    private _consumableService: IConsumableService;
    private _favouriteService: IFavouriteService;
    private _featureToggleService: IFeatureToggleService;

    private _consumablesRule: string;
    private _brWorkedOnClaimRejectCoveredCode: string;
    private _brFirstVisitJobType: string;
    private _partsCurrencyUnit: number;
    private _appLauncher: IAppLauncher;
    private _configurationService: IConfigurationService;
    private _appointmentBookingService: IAppointmentBookingService;
    private _partsBasketFactory: IPartsBasketFactory;
    private _isPartConsumableStockReferencePrefix: string[];
    private _job: Job;

    constructor(
        catalogService: ICatalogService,
        engineerService: IEngineerService,
        jobService: IJobService,
        labelService: ILabelService,
        partService: IPartService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRuleService: IBusinessRuleService,
        bindingEngine: BindingEngine,
        router: Router,
        vanStockService: IVanStockService,
        storageService: IStorageService,
        appLauncher: IAppLauncher,
        configurationService: IConfigurationService,
        appointmentBookingService: IAppointmentBookingService,
        partsBasketFactory: IPartsBasketFactory,
        consumableService: IConsumableService,
        favouriteService: IFavouriteService,
        featureToggleService: IFeatureToggleService
    ) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService);
        this._partService = partService;
        this._eventSubscriptions = [];
        this._viewModelPropertySubscriptions = [];
        this._bindingEngine = bindingEngine;
        this._router = router;
        this._vanStockService = vanStockService;
        this._storageService = storageService;
        this._appLauncher = appLauncher;
        this._configurationService = configurationService;
        this._appointmentBookingService = appointmentBookingService;
        this._partsBasketFactory = partsBasketFactory;
        this._consumableService = consumableService;
        this._favouriteService = favouriteService;
        this._featureToggleService = featureToggleService;
        this.isFullScreen = window.isFullScreen;
        this.materialSearchResults = {};
    }

    public async activateAsync(): Promise<any> {
        this.isVanStockEnabled = this._featureToggleService.isAssetTrackingEnabled();
        this._eventSubscriptions.push(
            this._eventAggregator.subscribe(AdaptBusinessServiceConstants.ADAPT_PARTS_SELECTED, (partIds: Guid[]) => this.adaptPartLiveUpdate(partIds))
        );

        this._userPatch = await this._storageService.getUserPatch();
        this._userSector = await this._storageService.getWorkingSector();

        await this.loadBusinessRules();
        await this.buildBusinessRules();
        this.yesNoLookup = await this.buildNoYesList();

        await this.load();
        this.showContent();
    }

    public async deactivateAsync(): Promise<void> {
        this.disposeViewModelPropertySubscriptions();
        this._eventSubscriptions.forEach(s => s.dispose());
    }

    public async showSearchResults(part: Part): Promise<void> {
        if (this.isVanStockEnabled) {
            await VanStockReservationHelper.launchReservationDialog(
                this._dialogService,
                this._vanStockService,
                this.materialSearchResults[part.stockReferenceId],
                async hasAReservationBeenMade => {
                    if (hasAReservationBeenMade) {
                        this.showSuccess("Material Request", "Material request sent.");
                        await this.rebuildInboundReservations();
                    }
                }
            );
        } else {
            await this._dialogService.open({
                viewModel: VanStockNotice,
                model: {
                    jobId: this.jobId,
                    part: part,
                    userPatch: this._userPatch
                }
            });
        }
    }

    public goToInOutScreen(): void {
        this._router.navigate("/consumables/in-out-stock");
    }

    public launchAdapt(): void {
        this._appLauncher.launchApplication(this._configurationService.getConfiguration<IHemaConfiguration>().adaptLaunchUri);
    }

    public async launchMaterialDialog(params: { part: Part }): Promise<void> {
        const {part} = params;

        await this._dialogService.open({
            viewModel: MaterialDialog,
            model : {
                part,
                MaterialSearchResult: this.materialSearchResults[part.stockReferenceId]
            }
        });
    }

    public bookAnAppointment(): void {
        this._router.navigateToRoute("appointmentMain", { jobId: this.jobId });
    }

    public setSameRefAsOriginal(part: Part): void {
        part.warrantyReturn.removedPartStockReferenceId = part.stockReferenceId;
    }

    public testValidConsumable(consumableCode: string): boolean {
        let regexTest = new RegExp(this._consumablesRule);
        return regexTest.test(consumableCode[0]); // todo doesn't work
    }

    public async toggleFavourite(part: Part): Promise<void> {
        part.isFavourite = !part.isFavourite;

        this.viewModel.partsInBasket
            .filter(p => p.description === part.description)
            .forEach(p => {
                p.isFavourite = part.isFavourite;
            });

        if (part.isFavourite) {
            await this._favouriteService.addFavouritePart(part);
        } else {
            // todo: favouriteService needs a better
            let favouritesResult = await this._favouriteService.getFavouritesList();
            if (favouritesResult && favouritesResult.favourites) {
                let foundPartIndex = favouritesResult.favourites.findIndex(favouritePart => (<Part>favouritePart).description === part.description);
                if (foundPartIndex !== -1) {
                    await this._favouriteService.removeFavourite(foundPartIndex);
                }
            }
        }
    }

    public quickAdd(part: Part): void {
        part.quantity = 1;
        part.partOrderStatus = this.materialSearchResults[part.stockReferenceId].local.completionStatus === "FOUND"
            ? "V"
            : "O";
    }

    public showAddPartManually(): void {
        if (this.viewModel.showAddPartManually) {
            return;
        }
        this.viewModel.showAddPartManually = true;
        this.viewModel.showRemainingAddPartManuallyFields = false;
        this.viewModel.manualPartDetail = new Part();
    }

    public hideAddPartManually(): void {
        if (!this.viewModel.showAddPartManually) {
            return;
        }
        this.viewModel.showAddPartManually = false;
        this.viewModel.showRemainingAddPartManuallyFields = false;
        this.viewModel.manualPartDetail = undefined;
    }

    public async searchForManuallyAddedPart(): Promise<void> {
        let validationResult = await this.validateSingleRule("viewModel.manualPartDetail.stockReferenceId");
        if (!validationResult.isValid) {
            return;
        }

        this.viewModel.manualPartDetail.stockReferenceId = this.viewModel.manualPartDetail.stockReferenceId.toUpperCase();

        this.viewModel.showRemainingAddPartManuallyFields = true;
        let partFoundInCatalog = await this._catalogService.getGoodsType(this.viewModel.manualPartDetail.stockReferenceId);
        
        let populate = (description: string, charge: number, isFound: boolean) => {            
            this.viewModel.manualPartDetail.description = description;
            this.viewModel.manualPartDetail.price = new bignumber.BigNumber(charge).times(this._partsCurrencyUnit);
            this.viewModel.manualPartDetail.quantity = 0;
            this.viewModel.manualPartDetail.wasFoundUsingManualEntry = isFound;
        };

        if (partFoundInCatalog) {
            populate(partFoundInCatalog.description, partFoundInCatalog.charge, true);
        } else {
            let ruleString = "viewModel.manualPartDetail.*";
            let partFoundInVanStock: MaterialWithQuantities[] = await this._vanStockService.searchLocalVanStock(1, undefined, this.viewModel.manualPartDetail.stockReferenceId) || [];
            
            if (!!partFoundInVanStock.length && partFoundInVanStock[0].description) {
                populate(partFoundInVanStock[0].description, 0, false);
                ruleString = "viewModel.manualPartDetail.price";
            } 
            
            this.validateSingleRule(ruleString);
        }
    }

    public async addManualPartToOrderList(): Promise<void> {
        let validationCombinedResult = await this.validateSingleRule("viewModel.manualPartDetail.*");
        if (!validationCombinedResult.isValid) {
            return;
        }
        await this.insertPartsIntoBasket([ObjectHelper.clone(this.viewModel.manualPartDetail)]);
        this.hideAddPartManually();
    }

    public async adaptPartLiveUpdate(incomingPartIds: Guid[] = []): Promise<void> {
        let partsDetail = await this._partService.getPartsBasket(this.jobId);

        let partsNotAlreadyInBasket = incomingPartIds
            .map(incomingPartId => partsDetail.partsToOrder.find(partToOrder => partToOrder.id === incomingPartId))
            .filter(incomingPart => !this.viewModel.partsInBasket.some(partInBasket => partInBasket === incomingPart.id));

        await this.insertPartsIntoBasket(partsNotAlreadyInBasket);
    }

    public async removePart(event: MouseEvent, part: Part, isATransferToConsumables: boolean): Promise<void> {
        event.stopPropagation();

        if (isATransferToConsumables) {
            let result = await this.showConfirmation(this.getLabel("confirmation"), this.getLabel("addToConsumablesQuestion"));
            if (result.wasCancelled) {
                return;
            }
            await this._consumableService.addConsumableToBasket(new ConsumablePart(part.stockReferenceId, part.description, part.quantity));
        } else {
            let shouldDelete = await this.showDeleteConfirmation();
            if (!shouldDelete) {
                return;
            }
        }

        this.viewModel.partsInBasket.splice(this.viewModel.partsInBasket.indexOf(part), 1);
        this.removePartsValidationRules(this.viewModel.partsInBasket.length);
        await this.setAndTriggerViewModelPropertyChangeHandlers();
    }

    public async selectMainPart(part: Part, isSelected: boolean): Promise<void> {
        this.setDirty(true); // by using a changeHandler rather than binding, the checkboxes will not inherently register a dirty change
        if (isSelected) {
            let result = await this.showConfirmation(this.getLabel("confirmation"), this.getLabel("selectMainPartQuestion"));
            if (!result.wasCancelled) {
                let preexistingMainPartForThisTask = this.viewModel.partsInBasket.find(p => p.taskId === part.taskId && p.isMainPart && p !== part);
                if (!preexistingMainPartForThisTask) {
                    part.isMainPart = true;
                    return;
                } else {
                    let confirmResult = await this.showConfirmation(this.getLabel("confirmation"), this.getLabel("makeMainPartForActivity"));
                    if (!confirmResult.wasCancelled) {
                        part.isMainPart = true;
                        preexistingMainPartForThisTask.isMainPart = false;
                        return;
                    }
                }
            }
        }
        // if here then user unset the checkbox, or has set the box but then declined one of the dialogs
        part.isMainPart = true; // hack so that the screen checkbox ui updates
        part.isMainPart = false;
    }

    // todo: delete me once we can toggle via modal
    public selectOrderType(part: Part, isSelected: boolean): void {
        this.setDirty(true); // by using a changeHandler rather than binding, the checkboxes will not inherently register a dirty change
        part.partOrderStatus = isSelected ? this.brVanStockPartOrderStatus : this.brPartOrderStatus;
    }

    protected async loadModel(): Promise<void> {

        await this.rebuildInboundReservations();

        this._job = await this._jobService.getJob(this.jobId);

        let getTaskLookup = async (task: Task) => {
            let jobCodeCatalogEntry = await this._catalogService.getJCJobCode(task.jobType);
            let objectTypeCatalogEntry = await this._catalogService.getObjectType(task.applianceType);
            let chargeTypeCatalog = await this._catalogService.getChargeType(task.chargeType);

            let text = `${(jobCodeCatalogEntry && jobCodeCatalogEntry.fieldAppCode) || task.jobType} -
                                ${(objectTypeCatalogEntry &&
                                        objectTypeCatalogEntry.applianceTypeDescription) ||
                                        task.applianceType} -
                                ${(chargeTypeCatalog && chargeTypeCatalog.chargeTypeDescription) ||
                                        task.chargeType}`;

            return { id: task.id, text };
        };

        this.tasksCatalog = await Promise.all(
            this._job.tasks.filter(task => task && task.applianceType && task.isMiddlewareDoTodayTask).map(async task => await getTaskLookup(task))
        );

        let partsDetail = await this._partService.getPartsBasket(this.jobId);
        this.viewModel = this._partsBasketFactory.createPartsBasketViewModel(partsDetail);
        this.setInitialDataState(this.viewModel.dataStateId, this.viewModel.dataState);

        await this.initialiseNonPartsValidationRules();
        await this.insertPartsIntoBasket(this.viewModel.partsToOrder);

        // think this is here in case the taskItem screen has not been visited, is this mutating stored data
        // todo: why
        await this._partService.setPartsRequiredForTask(this._job.id);
        await this.validateAllRules();
    }

    protected async saveModel(): Promise<void> {
        this.viewModel.dataState = this.getFinalDataState();
        this.viewModel.partsToOrder = this.viewModel.partsInBasket;

        if (this.viewModel.partsInBasket.some(x => x.partOrderStatus === this.brPartOrderStatus)) {
            let appointment = await this._appointmentBookingService.load(this.jobId);

            if (appointment && appointment.promisedDate) {
                let businessRules = await this._businessRuleService.getRuleGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(AppointmentBooking)));
                if (
                    this._appointmentBookingService.checkIfAppointmentNeedsToBeRebooked(
                        appointment.promisedDate,
                        moment(DateHelper.getTodaysDate()).toDate(),
                        businessRules["cutOffTime" + ""]
                    )
                ) {
                    this.showInfo(this.getLabel("appointmentBooking"), this.getLabel("appointmentBookingMessage"));
                }
            }
        }

        await this._partService.savePartsBasket(this.jobId, this.viewModel);

        if (this._isDirty) {
            this._eventAggregator.publish(ChargeServiceConstants.CHARGE_UPDATE_START, this.jobId);
        }
    }

    protected async clearModel(): Promise<void> {
        this.viewModel.partsInBasket.forEach((_, index) => this.removePartsValidationRules(index));
        this.viewModel.partsInBasket = [];
        this.viewModel.manualPartDetail = undefined;
        this.viewModel.showAddPartManually = false;
        this.viewModel.showRemainingAddPartManuallyFields = false;
        await this.setAndTriggerViewModelPropertyChangeHandlers();
    }

    protected validationUpdated(result: ValidationCombinedResult): void {
        result.groups.forEach(group => {
            let overallPartValidity = Object.keys(result.propertyResults)
                .filter(key => key !== group && result.propertyResults[key].property.lastIndexOf("viewModel." + group) === 0)
                .every(key => result.propertyResults[key].isValid);

            let part: Part = ObjectHelper.getPathValue(this.viewModel, group);
            if (part) {
                part.isValid = overallPartValidity;
            }
        });
    }

    private async insertPartsIntoBasket(partsToAdd: Part[]): Promise<void> {
        for (let part of partsToAdd) {
            this.viewModel.partsInBasket.push(part);
            this.insertPartsValidationRules(this.viewModel.partsInBasket.length - 1);
        }
        await this.setAndTriggerViewModelPropertyChangeHandlers();
    }

    private async setAndTriggerViewModelPropertyChangeHandlers(): Promise<void> {
        this.disposeViewModelPropertySubscriptions();

        let hasFullCatalogs = async (stockReferenceId: string) => {
            if (!stockReferenceId) {
                return false;
            }
            let foundPartInCatalog = await this._catalogService.getGoodsType(stockReferenceId);
            if (!foundPartInCatalog) {
                return false;
            }
            let foundProductGroup = (await this._catalogService.getProductGroups()).find(x => x.productGroupCode === foundPartInCatalog.productGroupCode);
            if (!foundProductGroup) {
                return false;
            }
            return (await this._catalogService.getPartTypes()).some(
                partType => partType.productGroupCode === foundProductGroup.productGroupCode && partType.partTypeCode === foundPartInCatalog.partTypeCode
            );
        };

        let partOrListChanged = async (forceWarrantyCheckPart?: Part) => {
            for (let part of this.viewModel.partsInBasket) {
                part.id = part.id || Guid.newGuid();
                part.quantity = part.quantity || 1;
                part.partOrderStatus = part.partOrderStatus || this.brPartOrderStatus;
                part.taskId = this.tasksCatalog.length === 1 ? this.tasksCatalog[0].id : part.taskId;

                if (part.partOrderStatus === this.brVanStockPartOrderStatus) {
                    part.isPriorityPart = false;
                }

                if (part.isConsumable === undefined) {
                    part.isConsumable =
                        part.stockReferenceId && this._isPartConsumableStockReferencePrefix.some(prefix => StringHelper.startsWith(part.stockReferenceId, prefix));
                }

                let favouritesModel = await this._favouriteService.getFavouritesList();
                part.isFavourite = favouritesModel && favouritesModel.favourites && favouritesModel.favourites.some(x => x.description === part.description);

                if (part.warrantyEstimate === undefined || forceWarrantyCheckPart === part) {
                    part.warrantyEstimate = await this._partService.getPartWarrantyEstimate(this.jobId, part.stockReferenceId, part.taskId);
                }

                if (this.isVanStockEnabled) {
                    if (!this.materialSearchResults[part.stockReferenceId]) {
                        this.materialSearchResults[part.stockReferenceId] = await this._vanStockService.getBindableMaterialSearchResult(part.stockReferenceId);
                    }
                } else {
                    if (part.isInPatchVanStock === undefined) {
                        let engineersWithPart = (await this._vanStockService.getEngineersWithPart(this._userPatch, this._userSector, part.stockReferenceId)) || [];
                        part.isInPatchVanStock = !!engineersWithPart.length;
                        part.patchVanStockEngineers = engineersWithPart;
                    }
                }

                // if (!part.partOrderStatus) {
                //     part.partOrderStatus = this.materialSearchResults[part.stockReferenceId].local.completionStatus === "FOUND"
                //         ? this.brVanStockPartOrderStatus
                //         : this.brPartOrderStatus;
                // }

                if (part.hasFullCatalogsForMainPart === undefined) {
                    part.hasFullCatalogsForMainPart = await hasFullCatalogs(part.stockReferenceId);
                }

                let taskItem = part.taskId && this._job.tasks.find(task => task.id === part.taskId);
                part.isMainPartOptionAvailable =
                    part.hasFullCatalogsForMainPart &&
                    taskItem &&
                    taskItem.workedOnCode !== this._brWorkedOnClaimRejectCoveredCode &&
                    taskItem.jobType !== this._brFirstVisitJobType;

                if (!part.isMainPartOptionAvailable) {
                    part.isMainPart = false;
                }

                part.hasTaskWithWrongStatus = !(await this._partService.getPartStatusValidity(part, this._job));
            }

            this.showPartsToOrderList = !!this.viewModel.partsInBasket.length;
            this.showBookAppointmentButton = this.viewModel.partsInBasket.some(x => x.partOrderStatus === this.brPartOrderStatus);
            this.hideDeliverToSiteCheckbox = this.viewModel.partsInBasket.every(p => p.partOrderStatus === this.brVanStockPartOrderStatus);
            this.viewModel.deliverPartsToSite = this.viewModel.partsInBasket.length ? this.viewModel.deliverPartsToSite : null;

            let everyMandatoryTaskIsHappy = this._job.tasks
                .filter(task => task.status === "IP") // todo: is this right, should WA be included
                .every(task => this.viewModel.partsInBasket.some(p => p.taskId === task.id && p.partOrderStatus === this.brPartOrderStatus));

            this.viewModel.hasAtLeastOneWrongActivityStatus = !everyMandatoryTaskIsHappy || this.viewModel.partsInBasket.some(p => p.hasTaskWithWrongStatus);

            this.partsToOrderTotalPrice = this.viewModel.partsInBasket.reduce((prev, curr) => {
                return prev + (curr.quantity || 0) * new bignumber.BigNumber(curr.price).toNumber();
            }, 0);

            await this.validateAllRules();
        };

        this._viewModelPropertySubscriptions.push(this._bindingEngine.collectionObserver(this.viewModel.partsInBasket).subscribe(() => {
            partOrListChanged();
        }));
        this.viewModel.partsInBasket.forEach(part => {
            this._viewModelPropertySubscriptions.push(
                this._bindingEngine.propertyObserver(part, "quantity").subscribe(() => {
                    partOrListChanged();
                }),
                this._bindingEngine.propertyObserver(part, "taskId").subscribe(() => {
                    partOrListChanged(part);
                }),
                this._bindingEngine.propertyObserver(part, "partOrderStatus").subscribe(() => {
                    partOrListChanged();
                })
            );
        });

        await partOrListChanged();
    }

    private disposeViewModelPropertySubscriptions(): void {
        this._viewModelPropertySubscriptions.forEach(subscription => subscription.dispose());
    }

    private async buildBusinessRules(): Promise<void> {
        this._consumablesRule = this.getBusinessRule<string>("consumablesRule");
        this.brVanStockPartOrderStatus = this.getBusinessRule<string>("vanStockPartOrderStatus");
        this.brPartOrderStatus = this.getBusinessRule<string>("partOrderStatus");
        this.quantityIncrementStep = this.getBusinessRule<number>("quantityIncrementStep");
        this.priceDecimalPlaces = this.getBusinessRule<number>("priceDecimalPlaces");
        this._brWorkedOnClaimRejectCoveredCode = this.getBusinessRule<string>("workedOnClaimRejectCoveredCode");
        this._partsCurrencyUnit = this.getBusinessRule<number>("partsCurrencyUnit");
        this._isPartConsumableStockReferencePrefix = (this.getBusinessRule<string>("isPartConsumableStockReferencePrefix") || "").split(",");
        this._brFirstVisitJobType = (await this._businessRuleService.getQueryableRuleGroup("taskItem")).getBusinessRule<string>("firstVisitJob");
    }

    private async initialiseNonPartsValidationRules(): Promise<void> {
        await this.buildValidation([
            {
                property: "viewModel.manualPartDetail.stockReferenceId",
                groups: ["manualPartDetail"],
                condition: () => this.viewModel.showAddPartManually
            },
            {
                property: "viewModel.manualPartDetail.description",
                groups: ["manualPartDetail"],
                condition: () => this.viewModel.showAddPartManually && this.viewModel.showRemainingAddPartManuallyFields
            },
            {
                property: "viewModel.manualPartDetail.price",
                groups: ["manualPartDetail"],
                condition: () => this.viewModel.showAddPartManually && this.viewModel.showRemainingAddPartManuallyFields
            },
            {
                property: "viewModel.partsListValidation",
                required: false,
                passes: [
                    {
                        test: () => !this.viewModel.hasAtLeastOneWrongActivityStatus,
                        message: "At least one of the activities has an incorrect status"
                    }
                ]
            }
        ]);
    }

    private insertPartsValidationRules(index: number): void {
        // todo: are some of these basedOns wrong?                They don't seem to exists!                Maybe Sumair did it...?
        let isVanStock = () =>
            this.viewModel.partsInBasket &&
            this.viewModel.partsInBasket[index] &&
            this.viewModel.partsInBasket[index].partOrderStatus === this.brVanStockPartOrderStatus;

        let isVanStockWarrantyReturn = () =>
            isVanStock() && this.viewModel.partsInBasket[index].warrantyReturn && this.viewModel.partsInBasket[index].warrantyReturn.isWarrantyReturn;

        let root = "viewModel.partsInBasket[" + index + "].";
        [
            {
                property: root + "taskId",
                groups: ["partsInBasket[" + index + "]"],
                basedOn: "viewModel.manualPartDetail.taskId",
                passes: [
                    {
                        test: () => {
                            return !this.viewModel.partsInBasket[index].hasTaskWithWrongStatus;
                        },
                        message: "** The associated task an incompatible status **"
                    }
                ],
                message: "Select the associated task"
            },
            {
                property: root + "quantity",
                groups: ["partsInBasket[" + index + "]"],
                // basedOn: "viewModel.manualPartDetail.quantity",
                passes: [
                    {
                        test: () => !!this.viewModel.partsInBasket[index].quantity,
                        message: ""
                    }
                ]
            },
            {
                property: root + "partOrderStatus",
                groups: ["partsInBasket[" + index + "]"],
                // basedOn: "viewModel.manualPartDetail.partOrderStatus",
                passes: [
                    {
                        test: () => !!this.viewModel.partsInBasket[index].partOrderStatus,
                        message: ""
                    }
                ]
            },
            {
                property: root + "warrantyReturn.isWarrantyReturn",
                groups: ["partsInBasket[" + index + "]"],
                basedOn: "viewModel.manualPartDetail.warrantyReturn.isWarrantyReturn",
                condition: () => isVanStock()
            },
            {
                property: root + "warrantyReturn.quantityToClaimOrReturn",
                groups: ["partsInBasket[" + index + "]"],
                basedOn: "viewModel.manualPartDetail.warrantyReturn.quantityToClaimOrReturn",
                condition: () => isVanStockWarrantyReturn(),
                passes: [
                    {
                        test: () => this.viewModel.partsInBasket[index].quantity >= this.viewModel.partsInBasket[index].warrantyReturn.quantityToClaimOrReturn,
                        message: ""
                    }
                ]
            },
            {
                property: root + "warrantyReturn.removedPartStockReferenceId",
                groups: ["partsInBasket[" + index + "]"],
                basedOn: "viewModel.manualPartDetail.stockReferenceId",
                condition: () => isVanStockWarrantyReturn()
            },
            {
                property: root + "warrantyReturn.reasonForClaim",
                groups: ["partsInBasket[" + index + "]"],
                basedOn: "parts.warrantyReturn.reasonForClaim",
                condition: () => isVanStockWarrantyReturn()
            }
        ].forEach(rule => this._validationService.addDynamicRule(this._validationController, rule));
    }

    private removePartsValidationRules(index: number): void {
        [
            "viewModel.partsInBasket[" + index + "].taskId",
            "viewModel.partsInBasket[" + index + "].quantity",
            "viewModel.partsInBasket[" + index + "].partOrderStatus",
            "viewModel.partsInBasket[" + index + "].warrantyReturn.isWarrantyReturn",
            "viewModel.partsInBasket[" + index + "].warrantyReturn.quantityToClaimOrReturn",
            "viewModel.partsInBasket[" + index + "].warrantyReturn.removedPartStockReferenceId",
            "viewModel.partsInBasket[" + index + "].warrantyReturn.reasonForClaim"
        ].forEach(ruleKey => this._validationService.removeDynamicRule(this._validationController, ruleKey));
    }

    private async rebuildInboundReservations(): Promise<void> {
        try {
            this.inboundReservations = (await this._vanStockService.getMaterialRequests()).inboundMaterials
                                        .filter(reservation => reservation.status === "PENDING")
                                        .reduce((acc, curr) => {
                                            acc[curr.stockReferenceId] = (acc[curr.stockReferenceId] || 0) + curr.quantity;
                                            return acc;
                                        }, <{ [stockReferenceId: string]: number }>{});
        } catch (error) {

        }
    }
}
