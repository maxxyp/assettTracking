import { inject, BindingEngine, observable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { LabelService } from "../../../business/services/labelService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { ValidationService } from "../../../business/services/validationService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { IApplianceService } from "../../../business/services/interfaces/IApplianceService";
import { ApplianceService } from "../../../business/services/applianceService";
import { CatalogService } from "../.././../business/services/catalogService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { Job } from "../../../business/models/job";
import { Appliance as ApplianceBusinessModel } from "../../../business/models/appliance";
import { EditableViewModel } from "../../models/editableViewModel";
import { ButtonListItem } from "../../../../common/ui/elements/models/buttonListItem";
import { Guid } from "../../../../common/core/guid";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { EngineerService } from "../../../business/services/engineerService";
import { DialogService } from "aurelia-dialog";
import { ApplianceFactory } from "../../factories/applianceFactory";
import { IApplianceFactory } from "../../factories/interfaces/IApplianceFactory";
import { ApplianceViewModel } from "./viewModels/applianceViewModel";
import { IObjectType } from "../../../business/models/reference/IObjectType";
import { IGcCode } from "../../../business/models/reference/IGcCode";
import { ApplianceDetailsConstants } from "../../constants/applianceDetailsConstants";
import { IApplianceFlueTypes } from "../../../business/models/reference/IApplianceFlueTypes";
import { IApplianceCondition } from "../../../business/models/reference/IApplianceCondition";
import { IApplianceSystemType } from "../../../business/models/reference/IApplianceSystemType";
import { ISystemDesignAndCondition } from "../../../business/models/reference/ISystemDesignAndCondition";
import { IApplianceCylinderType } from "../../../business/models/reference/IApplianceCylinderType";
import { IEnergyControls } from "../../../business/models/reference/IEnergyControls";
import { CatalogConstants } from "../../../business/services/constants/catalogConstants";
import { IStorageService } from "../../../business/services/interfaces/IStorageService";
import { StorageService } from "../../../business/services/storageService";
import { BusinessException } from "../../../business/models/businessException";
import { ObjectHelper } from "../../../../common/core/objectHelper";

@inject(JobService, EngineerService, LabelService, ApplianceService, ApplianceFactory, Router,
    EventAggregator, DialogService, ValidationService, BusinessRuleService, CatalogService, BindingEngine, StorageService)
export class ApplianceDetails extends EditableViewModel {

    public viewModel: ApplianceViewModel;

    // below here are the old vars

    public parentApplianceType: string;

    public bgInstallationYesNoLookup: ButtonListItem[];
    public applianceTypeCatalog: IObjectType[];
    public creatableApplianceTypesCatalog: IObjectType[];

    public flueTypesCatalog: IApplianceFlueTypes[];
    public applianceConditionCatalog: IApplianceCondition[];
    public systemTypeCatalog: IApplianceSystemType[];
    public systemDesignAndConditionCatalog: ISystemDesignAndCondition[];
    public cylinderTypeCatalog: IApplianceCylinderType[];
    public energyControlsCatalog: IEnergyControls[];

    public isDefaultGcCodeOptionAvailable: boolean;
    public defaultGcCodeCatalogItems: IGcCode[];
    @observable
    public selectedDefaultGcCode: string;
    // public isEditingChildAppliance: boolean;
    // public isChildApplianceRequired: boolean;
    public isKnownGcCodeSelected: boolean;
    // .DF_1681 we need to stop multiple submissions of the same new record
    public isCompleteTriggeredAlready: boolean;
    public replaceAppliance: boolean;
    public contractTypeDescription: string;
    private _applianceId: string;
    private _applianceService: IApplianceService;
    private _router: Router;
    private _bindingEngine: BindingEngine;
    private _propertySubscriptions: Subscription[];
    private _storageService: IStorageService;
    private _applianceFactory: IApplianceFactory;

    // business rule vars
    private _centralHeatingApplianceHardwareCategory: string;
    private _applianceRequiresGcCode: string;
    private _isDefaultGcCode: string;
    private _applianceTyepAllowsCreation: string;
    private _parentApplianceIndicator: string;
    private _instPremApplianceType: string;
    // private _childApplianceIndicator: string;
    private _applianceTypeCatalogExclusions: string[];
    private _job: Job;
    private _engineerWorkingSector: string;
    private _gcCodeChanged: boolean;
    private _newGcCode: string;
    private _savedGcCode: string;
    private _isGcCodeChangedConfirmationShown: boolean;
    private _isLoading: boolean;
    private _oldApplianceId: string;

    public constructor(
        jobService: IJobService,
        engineerService: IEngineerService,
        labelService: ILabelService,
        applianceService: IApplianceService,
        applianceFactory: IApplianceFactory,
        router: Router,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRulesService: IBusinessRuleService,
        catalogService: ICatalogService,
        bindingEngine: BindingEngine,
        storageService: IStorageService) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService);
        this._applianceService = applianceService;
        this._applianceFactory = applianceFactory;
        this._router = router;
        this._bindingEngine = bindingEngine;
        this._propertySubscriptions = [];
        this._storageService = storageService;
        this._gcCodeChanged = false;
        this._isGcCodeChangedConfirmationShown = false;
    }

    public activateAsync(params: { applianceId: string, newGcCode: string, oldApplianceId: string }): Promise<any> {
        this._applianceId = params.applianceId;
        this.isNew = this._applianceId === Guid.empty;
        this._newGcCode = params.newGcCode || undefined;
        this._oldApplianceId = params.oldApplianceId;
        this.replaceAppliance = (this.isNew && this._newGcCode !== undefined && this._oldApplianceId !== undefined);
        this.isCompleteTriggeredAlready = false;
        if (this._isCleanInstance) {
            return this.loadBusinessRules()
                .then(() => this.buildBusinessRules())
                .then(() => this.buildValidationRules())
                .then(() => this.loadCatalogs())
                .then(() => this.load())
                .then(() => this.showContent());
        } else {
            return this.load();
        }
    }

    public completeOk(): Promise<boolean> {
        if (this.isCompleteTriggeredAlready) {
            return Promise.resolve(false);
        }
        this.isCompleteTriggeredAlready = true;
        return this.save()
            .then((success) => {
                if (success) {
                    return this._router.navigateToRoute("appliances");
                } else {
                    return false;
                }
            });
    }

    public completeCancel(): void {
        this._router.navigateToRoute("appliances");
    }

    public selectDefaultGcCodes(): void {
        this._catalogService.getGCCodes(this.viewModel.applianceType)
            .then((gcCodes) => {
                if (gcCodes) {
                    this.defaultGcCodeCatalogItems = gcCodes.filter(x => x.defaultIndicator === this._isDefaultGcCode);
                    this.isDefaultGcCodeOptionAvailable = true;
                    this.selectedDefaultGcCode = "";
                }
            })
            .catch(error => this.showError(error));
    }

    public hideDefaultGcCodes(): void {
        this.isDefaultGcCodeOptionAvailable = false;
    }

    public loadParentAppliance(): void {
        this._router.navigateToRoute("appliance", { "applianceId": this.viewModel.parentId });
    }

    public loadChildAppliance(): void {
        if (this.isNew) {
            if (this.isCompleteTriggeredAlready) {
                return;
            }
            this.isCompleteTriggeredAlready = true;
            this.save()
                .then(() => {
                    return this._applianceService.getChildApplianceId(this.jobId, this.viewModel.id)
                        .then((childApplianceId) => {
                            this._router.navigateToRoute("appliance", { "applianceId": childApplianceId });
                        });
                });
        } else {
            this._router.navigateToRoute("appliance", { "applianceId": this.viewModel.childId });
        }
    }

    public applianceTypeChanged(newValue: string, oldValue: string): void {
        if (!this._isLoading) {
            this.viewModel.gcCode = undefined;
            this.isKnownGcCodeSelected = false;
            this.viewModel.description = undefined;
        }

        this.hideDefaultGcCodes();

        let applianceTypeCatalogItem = this.applianceTypeCatalog.find(a => a.applianceType === this.viewModel.applianceType);

        this._applianceFactory.updateApplianceViewModelApplianceType(this.viewModel, this.viewModel.applianceType, applianceTypeCatalogItem,
            this._centralHeatingApplianceHardwareCategory, this._applianceRequiresGcCode,
            this._parentApplianceIndicator, this._engineerWorkingSector);
    }

    public async gcCodeChanged(newValue: string, oldValue: string): Promise<void> {
        this.isKnownGcCodeSelected = false;
        this.viewModel.description = undefined;
        this.isDefaultGcCodeOptionAvailable = false;
        this._gcCodeChanged = true;

        if (this.viewModel.requiresGcCode
            && this.viewModel.gcCode
            && this.viewModel.gcCode.length === this.getValidationRule("viewModel.gcCode").maxLength) {
            // because the gccode is correct size, do the lookup
            if (!this._isGcCodeChangedConfirmationShown && !this.isNew && !this._isLoading && this.viewModel.gcCode !== this._savedGcCode) {
                this._isGcCodeChangedConfirmationShown = true;
                return this.checkIfApplianceReplacementOrAmendmentRequired();
            } else {
                this._isGcCodeChangedConfirmationShown = false;
                return this.getGCCodeDescription();
            }
        } else {
            this._isGcCodeChangedConfirmationShown = false;
            this.publishApplianceDetailsChangedEvent();
            return Promise.resolve();
        }
    }

    public applianceDescriptionChanged(newValue: string, oldValue: string): void {
        if (newValue !== oldValue) {
            this.publishApplianceDetailsChangedEvent();
        }
    }

    public selectedDefaultGcCodeChanged(newValue: string, oldValue: string): void {
        if (newValue) {
            this.viewModel.gcCode = newValue;
            this.isDefaultGcCodeOptionAvailable = false;

            this.publishApplianceDetailsChangedEvent();
        }
    }

    public deactivateAsync(): Promise<void> {
        this.disposeSubscriptions();
        return Promise.resolve();
    }

    public navigateToReadings(): void {
        this._router.navigateToRoute("notyetimplemented");
    }

    public navigateToSafety(): void {
        this._router.navigateToRoute("appliancesafety", {
            jobId: this.jobId,
            applianceId: this.viewModel.id
        });
    }

    protected loadModel(): Promise<void> {
        this.isDefaultGcCodeOptionAvailable = false;
        this.isKnownGcCodeSelected = false;
        this._isLoading = true;

        return this._storageService.getWorkingSector()
            .then((engineerWorkingSector) => {
                if (engineerWorkingSector) {
                    this._engineerWorkingSector = engineerWorkingSector;
                } else {
                    throw new BusinessException(this, "loadModel", "Required engineer working sector not found", null, null);
                }
            })
            .then(() => this._jobService.getJob(this.jobId))
            .then((job) => { this._job = job; })
            .then(() => {
                if (this.isNew) {
                    return this._applianceFactory.createNewApplianceViewModel();
                } else {
                    return this._applianceService.getAppliance(this.jobId, this._applianceId)
                        .then((applianceBusinessModel) => {

                            let getParentAppliancePromise: Promise<ApplianceBusinessModel>;

                            if (applianceBusinessModel.parentId) {
                                getParentAppliancePromise = this._applianceService.getAppliance(this.jobId, applianceBusinessModel.parentId);
                            } else {
                                getParentAppliancePromise = Promise.resolve(null);
                            }

                            return getParentAppliancePromise
                                .then((parentAppliance) => {
                                    let applianceTypeCatalogItem = this.applianceTypeCatalog.find(a => a.applianceType === applianceBusinessModel.applianceType);
                                    return this._applianceFactory
                                        .createApplianceViewModelFromBusinessModel(applianceBusinessModel, applianceTypeCatalogItem,
                                        this._centralHeatingApplianceHardwareCategory, this._applianceRequiresGcCode,
                                        parentAppliance);
                                });
                        });
                }
            })
            .then((applianceViewModel) => {
                this.viewModel = applianceViewModel;
                this.viewModel.gcCode = (this.replaceAppliance) ? this._newGcCode : this.viewModel.gcCode;
                this._savedGcCode = this.viewModel.gcCode;                

                let p: Promise<void> = Promise.resolve();
                if (this.replaceAppliance) {
                    p = this._catalogService.getGCCode(this.viewModel.gcCode)
                        .then((catalogItem) => {
                            if (catalogItem) {
                                this.viewModel.description = catalogItem.gcCodeDescription.substr(0, this.getValidationRule("viewModel.description").maxLength);
                                this.viewModel.applianceType = catalogItem.applianceTypeCode;

                                this.applianceTypeChanged(this.viewModel.applianceType, undefined);
                            }
                        });
                }

                return p.then(() => {
                    if (this.isNew) {
                        this.setNewDataState(this.viewModel.dataStateGroup);
                    } else {
                        this.setInitialDataState(this.viewModel.dataStateId, this.viewModel.dataState);
                    }
                    // if we are hitting undo, we need to transmit the gcCode/description change
                    this.publishApplianceDetailsChangedEvent();   

                    if (!!this.viewModel.contractType) {
                        return this._catalogService.getApplianceContractType(this.viewModel.contractType).then(applianceContractType => {
                            this.contractTypeDescription = applianceContractType.applianceContractTypeDescription || undefined;
                        });  
                    }  
                    return Promise.resolve();         
                }); 
            })
            // call setPropertyChangeHandlers() in a subsequent "then" after a delay to avoid the bug described in the comments in #17576
            .delay(1)
            .then(() => {
                this.setPropertyChangeHandlers();     
                this._isLoading = false;           
            });               
    }

    protected saveModel(): Promise<void> {

        if (this.isNew) {
            // this.isNew = false;
            return this._applianceFactory.createApplianceBusinessModelFromViewModel(this.viewModel, this._job, this._engineerWorkingSector)
                .then((applianceBusinessModel) => {
                    applianceBusinessModel.dataState = this.getFinalDataState();
                    if (this.replaceAppliance) {
                        return this._applianceService.replaceAppliance(this._job.id, applianceBusinessModel, this._oldApplianceId);
                    }
                    return this._applianceService.createAppliance(this._job.id, applianceBusinessModel);
                });
        } else {
            // get the existing appliance business model first
            return this._applianceService.getAppliance(this._job.id, this.viewModel.id)
                .then((applianceBusinessModel) => this._applianceFactory.updateApplianceBusinessModelFromViewModel(this.viewModel, ObjectHelper.clone(applianceBusinessModel)))
                .then((applianceBusinessModel) => {
                    applianceBusinessModel.dataState = this.getFinalDataState();
                    return this._applianceService.updateAppliance(this._job.id, applianceBusinessModel, this._isDirty, this._gcCodeChanged);
                });
        }
    }

    protected clearModel(): Promise<void> {
        this.viewModel.gcCode = undefined;
        this.viewModel.description = undefined;
        this.viewModel.locationDescription = undefined;
        this.viewModel.installationYear = undefined;
        this.viewModel.serialId = undefined;
        this.viewModel.flueType = undefined;
        this.viewModel.bgInstallationIndicator = undefined;
        this.viewModel.condition = undefined;
        this.viewModel.systemType = undefined;
        this.viewModel.systemDesignCondition = undefined;
        this.viewModel.numberOfRadiators = undefined;
        this.viewModel.numberOfSpecialRadiators = undefined;
        this.viewModel.boilerSize = undefined;
        this.viewModel.cylinderType = undefined;
        this.viewModel.energyControl = undefined;
        return Promise.resolve();
    }

    private publishApplianceDetailsChangedEvent(): void {
        this._eventAggregator.publish(ApplianceDetailsConstants.DETAILS_CHANGED,
            {
                description: this.viewModel.description,
                gccode: this.viewModel.gcCode
            });
    }

    private setPropertyChangeHandlers(): void {
        this.disposeSubscriptions();

        let applianceTypeSubscription = this._bindingEngine
            .propertyObserver(this.viewModel, "applianceType")
            .subscribe((newValue, oldValue) => this.applianceTypeChanged(newValue, oldValue));
        this._propertySubscriptions.push(applianceTypeSubscription);

        let gcCodeSubscription = this._bindingEngine
            .propertyObserver(this.viewModel, "gcCode")
            .subscribe((newValue, oldValue) => this.gcCodeChanged(newValue, oldValue));
        this._propertySubscriptions.push(gcCodeSubscription);

        let applianceDescription = this._bindingEngine
            .propertyObserver(this.viewModel, "description")
            .subscribe((newValue, oldValue) => this.applianceDescriptionChanged(newValue, oldValue));
        this._propertySubscriptions.push(applianceDescription);
    }

    private disposeSubscriptions(): void {
        if (this._propertySubscriptions) {
            this._propertySubscriptions.forEach(subscription => subscription.dispose());
            this._propertySubscriptions = [];
        }
    }

    private buildBusinessRules(): Promise<void> {
        this._centralHeatingApplianceHardwareCategory = this.getBusinessRule<string>("centralHeatingApplianceHardwareCategory");
        this._applianceRequiresGcCode = this.getBusinessRule<string>("applianceRequiresGcCode");
        this._isDefaultGcCode = this.getBusinessRule<string>("isDefaultGcCode");
        this._applianceTyepAllowsCreation = this.getBusinessRule<string>("applianceTypeAllowsCreation");
        this._applianceTypeCatalogExclusions = this.getBusinessRule<string>("applianceTypeCatalogExclusions").split(";");
        this._parentApplianceIndicator = this.getBusinessRule<string>("parentApplianceIndicator");

        return this._businessRuleService.getQueryableRuleGroup("applianceFactory").then(applianceFactoryBusinessRules => {
            this._instPremApplianceType = applianceFactoryBusinessRules.getBusinessRule<string>("instPremApplianceType");
        });
    }

    private loadCatalogs(): Promise<void> {
        return Promise.all([
            this.buildNoYesList(),
            this._catalogService.getObjectTypes(),
            this._catalogService.getFlueTypes(),
            this._catalogService.getApplianceConditions(),
            this._catalogService.getApplianceSystemTypes(),
            this._catalogService.getSystemDesignAndCondition(),
            this._catalogService.getApplianceCylinderTypes(),
            this._catalogService.getEnergyControls(),
            this._applianceService.getAppliances(this.jobId)]
        )
            .then(([
                bgInstallationYesNo,
                applianceTypesCatalog,
                flueTypesCatalog,
                applianceConditionCatalog,
                systemTypeCatalog,
                systemDesignAndConditionCatalog,
                cylinderTypeCatalog,
                energyControlsCatalog,
                appliances
            ]) => {
                this.bgInstallationYesNoLookup = bgInstallationYesNo;
                this.applianceTypeCatalog = applianceTypesCatalog;
                let isINSApplianceExists: boolean = appliances.some(a => a.applianceType === this._instPremApplianceType);
                this.creatableApplianceTypesCatalog = applianceTypesCatalog
                    .filter(c => c.allowCreateInField === this._applianceTyepAllowsCreation)
                    .filter(c => (this._applianceTypeCatalogExclusions || []).indexOf(c.applianceType) === -1)
                    .filter(c => isINSApplianceExists ? c.applianceType !== this._instPremApplianceType : true);

                this.flueTypesCatalog = flueTypesCatalog;
                this.applianceConditionCatalog = applianceConditionCatalog;
                this.systemTypeCatalog = systemTypeCatalog;
                this.systemDesignAndConditionCatalog = systemDesignAndConditionCatalog;
                this.cylinderTypeCatalog = cylinderTypeCatalog;
                this.energyControlsCatalog = this.toSortedArray(energyControlsCatalog, CatalogConstants.ENERGY_CONTROLS_ID);
            });
    }

    private buildValidationRules(): Promise<void> {

        return this.buildValidation([
            {
                property: "viewModel.installationYear",
                passes: [
                    {
                        test: () => this.viewModel.installationYear && this.viewModel.installationYear.toString().length === 4 ?
                            this.viewModel.installationYear <= new Date().getFullYear() : true,
                        message: this.getLabel("invalidYear")
                    }
                ]
            }, {
                property: "viewModel.flueType",
                condition: () => this.viewModel.isGasAppliance && this.viewModel.applianceType !== "INS",
            }, { property: "viewModel.condition", condition: () => this.viewModel.isCentralHeatingAppliance },
            { property: "viewModel.systemType", condition: () => this.viewModel.isCentralHeatingAppliance },
            { property: "viewModel.serialId", condition: () => this.viewModel.serialId !== null && this.viewModel.serialId !== undefined && this.viewModel.serialId !== "" },
            { property: "viewModel.systemDesignCondition", condition: () => this.viewModel.isCentralHeatingAppliance },
            { property: "viewModel.numberOfRadiators", condition: () => this.viewModel.isCentralHeatingAppliance },
            {
                property: "viewModel.numberOfSpecialRadiators",
                condition: () => this.viewModel.isCentralHeatingAppliance,
                passes: [
                    {
                        test: () => this.viewModel.numberOfSpecialRadiators > 0
                            ? +this.viewModel.numberOfRadiators >= +this.viewModel.numberOfSpecialRadiators
                            : true,
                        message: this.getLabel("invalidNumberOfSpecialRadiators")
                    }
                ]
            },
            { property: "viewModel.boilerSize", condition: () => this.viewModel.isCentralHeatingAppliance },
            { property: "viewModel.cylinderType", condition: () => this.viewModel.isCentralHeatingAppliance },
            { property: "viewModel.energyControl", condition: () => this.viewModel.isCentralHeatingAppliance },
            { property: "viewModel.description", condition: () => !this.viewModel.requiresGcCode },
            {
                property: "viewModel.gcCode",
                // validate gcCode rules (maxLength etc.) if type is requiresGcCode, or the user has entered some text
                // remember that condition() turns on/off all of the standard rules as well as the custom "passes" rules
                // #18271 removed condition to make all GC Codes required, but still check validity when requiresGcCode = true
                condition: () => true,
                passes: [
                    {
                        // but if not a requiresGcCode type, then do not check the reference data as it will never be in there.
                        // remember that this rule only kicks in only if all other previously tested rules for this property have passed
                        test: () => !this.viewModel.requiresGcCode
                            || this.hasValidGcCode(),

                        message: this.getLabel("invalidGcCode")
                    }
                ]
            }
        ]);
    }

    private hasValidGcCode(): Promise<boolean> {
        return this._catalogService.getGCCode(this.viewModel.gcCode)
            .then((catalogItem) => catalogItem && catalogItem.applianceTypeCode === this.viewModel.applianceType);
    }

    private async getGCCodeDescription(): Promise<void> {
        return this._catalogService.getGCCode(this.viewModel.gcCode)
            .then((catalogItem) => {
                if (catalogItem && (catalogItem.applianceTypeCode === this.viewModel.applianceType)) {
                    this.viewModel.description = catalogItem.gcCodeDescription.substr(0, this.getValidationRule("viewModel.description").maxLength);
                    this.isKnownGcCodeSelected = true;
                }
                this.publishApplianceDetailsChangedEvent();
            });
    }

    private async checkIfApplianceReplacementOrAmendmentRequired(): Promise<void> {
        let isGCCodeValid = await this.hasValidGcCode();
        if (isGCCodeValid) {
            let applianceReplacementConfirmation = await this.showConfirmation(this.getLabel("confirmation"), this.getLabel("replaceApplianceQuestion"));
            if (applianceReplacementConfirmation.wasCancelled) {
                let applianceAmendmentConfirmation = await this.showConfirmation(this.getLabel("confirmation"), this.getLabel("amendApplianceQuestion"));
                if (applianceAmendmentConfirmation.wasCancelled) {
                    this.viewModel.gcCode = this._savedGcCode;
                    return Promise.resolve();
                } else {
                    return this.getGCCodeDescription();
                }
            } else {
                let newApplianceGcCode = this.viewModel.gcCode;
                this.viewModel.gcCode = this._savedGcCode;
                this._router.navigateToRoute("appliance", { applianceId: Guid.empty, newGcCode: newApplianceGcCode, oldApplianceId: this.viewModel.id });
            }
        }
    }
}
