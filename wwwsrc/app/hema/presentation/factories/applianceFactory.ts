import {Appliance as ApplianceBusinessModel} from "../../business/models/appliance";
import {ApplianceViewModel} from "../modules/appliances/viewModels/applianceViewModel";
import {IApplianceFactory} from "./interfaces/IApplianceFactory";
import { inject } from "aurelia-dependency-injection";
import {IObjectType} from "../../business/models/reference/IObjectType";
import {Guid} from "../../../common/core/guid";
import {BaseApplianceFactory} from "../../common/factories/baseApplianceFactory";
import {BusinessRuleService} from "../../business/services/businessRuleService";
import {CatalogService} from "../../business/services/catalogService";
import {IBusinessRuleService} from "../../business/services/interfaces/IBusinessRuleService";
import {ICatalogService} from "../../business/services/interfaces/ICatalogService";
import {ApplianceSafetyType} from "../../business/models/applianceSafetyType";
import { Job } from "../../business/models/job";
import { DataStateManager } from "../../common/dataStateManager";
import { IDataStateManager } from "../../common/IDataStateManager";

@inject(BusinessRuleService, CatalogService, DataStateManager)
export class ApplianceFactory extends BaseApplianceFactory implements IApplianceFactory {
    private _dataStateManager: IDataStateManager;

    constructor(businessRuleService: IBusinessRuleService, catalogService: ICatalogService, dataStateManager: IDataStateManager) {
        super(businessRuleService, catalogService);
        this._dataStateManager = dataStateManager;
    }

    public createNewApplianceViewModel(): ApplianceViewModel {
        let viewModel: ApplianceViewModel = new ApplianceViewModel();

        viewModel.id = Guid.newGuid();
        viewModel.dataStateGroup = "appliances";

        viewModel.hasChildAppliance = false;
        viewModel.hasParentAppliance = false;

        return viewModel;
    }

    public createApplianceViewModelFromBusinessModel(applianceBusinessModel: ApplianceBusinessModel, applianceTypeCatalogItem: IObjectType,
                                                     centralHeatingApplianceHardwareCategory: string, applianceRequiresGcCode: string,
                                                     parentApplianceBusinessModel: ApplianceBusinessModel) : ApplianceViewModel {
        let viewModel: ApplianceViewModel = new ApplianceViewModel();

        viewModel.dataStateGroup = applianceBusinessModel.dataStateGroup;
        viewModel.dataState = applianceBusinessModel.dataState;
        viewModel.dataStateId = applianceBusinessModel.dataStateId;

        viewModel.id = applianceBusinessModel.id;
        viewModel.serialId = applianceBusinessModel.serialId;
        viewModel.gcCode = applianceBusinessModel.gcCode;
        viewModel.bgInstallationIndicator = applianceBusinessModel.bgInstallationIndicator;
        viewModel.category = applianceBusinessModel.category;
        viewModel.contractType = applianceBusinessModel.contractType;
        viewModel.contractExpiryDate = applianceBusinessModel.contractExpiryDate;
        viewModel.applianceType = applianceBusinessModel.applianceType;
        viewModel.description = applianceBusinessModel.description;
        viewModel.flueType = applianceBusinessModel.flueType;
        viewModel.cylinderType = applianceBusinessModel.cylinderType;
        viewModel.energyControl = applianceBusinessModel.energyControl;
        viewModel.locationDescription = applianceBusinessModel.locationDescription;
        viewModel.condition = applianceBusinessModel.condition;
        viewModel.numberOfRadiators = applianceBusinessModel.numberOfRadiators;
        viewModel.numberOfSpecialRadiators = applianceBusinessModel.numberOfSpecialRadiators;
        viewModel.installationYear = applianceBusinessModel.installationYear;
        viewModel.systemDesignCondition = applianceBusinessModel.systemDesignCondition;
        viewModel.systemType = applianceBusinessModel.systemType;
        viewModel.notes = applianceBusinessModel.notes;
        viewModel.boilerSize = applianceBusinessModel.boilerSize;
        viewModel.parentId = applianceBusinessModel.parentId;
        viewModel.childId = applianceBusinessModel.childId;
        viewModel.isInstPremAppliance = applianceBusinessModel.isInstPremAppliance;

        viewModel.applianceSafetyType = applianceBusinessModel.applianceSafetyType;

        viewModel.isGasAppliance = viewModel.applianceSafetyType === ApplianceSafetyType.gas;
        viewModel.isCentralHeatingAppliance = applianceTypeCatalogItem.category === centralHeatingApplianceHardwareCategory;
        viewModel.requiresGcCode = applianceTypeCatalogItem.fetchGCCode === applianceRequiresGcCode;
        viewModel.hasChildAppliance = viewModel.childId !== null && viewModel.childId !== undefined;
        viewModel.hasParentAppliance = viewModel.parentId !== null && viewModel.parentId !== undefined && viewModel.parentId !== viewModel.id;

        if (viewModel.hasParentAppliance && parentApplianceBusinessModel) {
            viewModel.parentApplianceType = parentApplianceBusinessModel.applianceType;
        }

        return viewModel;
    }

    public updateApplianceViewModelApplianceType(applianceViewModel: ApplianceViewModel, applianceType: string, applianceTypeCatalogItem: IObjectType,
                                                 centralHeatingApplianceHardwareCategory: string, applianceRequiresGcCode: string,
                                                 parentApplianceIndicator: string, engineerWorkingSector: string): Promise<void> {

        let calculateApplianceSafeTypePromise: Promise<ApplianceSafetyType>;

        if (applianceTypeCatalogItem) {
            calculateApplianceSafeTypePromise = this.calculateApplianceSafetyType(applianceType, engineerWorkingSector);
        } else {
            calculateApplianceSafeTypePromise = Promise.resolve(undefined);
        }

        return calculateApplianceSafeTypePromise
            .then((applianceSafetyType) => {
                if (applianceTypeCatalogItem) {
                    applianceViewModel.applianceSafetyType = applianceSafetyType;
                    applianceViewModel.isGasAppliance = applianceViewModel.applianceSafetyType === ApplianceSafetyType.gas;
                    applianceViewModel.isCentralHeatingAppliance = applianceTypeCatalogItem.category === centralHeatingApplianceHardwareCategory;
                    applianceViewModel.requiresGcCode = applianceTypeCatalogItem.fetchGCCode === applianceRequiresGcCode;

                    // you cannot change the applianceType on a child and only in new appliance mode
                    // just to be safe clear out any parent stuff
                    applianceViewModel.hasParentAppliance = false;
                    applianceViewModel.parentApplianceType = undefined;
                    applianceViewModel.hasChildAppliance = (applianceTypeCatalogItem.association === parentApplianceIndicator);
                } else {
                    applianceViewModel.applianceSafetyType = undefined;
                    applianceViewModel.isGasAppliance = false;
                    applianceViewModel.isCentralHeatingAppliance = false;
                    applianceViewModel.requiresGcCode = undefined;

                    // you cannot change the applianceType on a child so only the has child is needed
                    // just to be safe clear out any parent stuff
                    applianceViewModel.hasParentAppliance = false;
                    applianceViewModel.parentApplianceType = undefined;
                    applianceViewModel.hasChildAppliance = false;
                }
            });
    }

    public createApplianceBusinessModelFromViewModel(applianceViewModel: ApplianceViewModel, job: Job, engineerWorkingSector: string)
        : Promise<ApplianceBusinessModel> {
        let applianceBusinessModel: ApplianceBusinessModel = new ApplianceBusinessModel();

        applianceBusinessModel.id = applianceViewModel.id;
        applianceBusinessModel.serialId = applianceViewModel.serialId;
        applianceBusinessModel.gcCode = applianceViewModel.gcCode;
        applianceBusinessModel.bgInstallationIndicator = applianceViewModel.bgInstallationIndicator;
        applianceBusinessModel.category = applianceViewModel.category;
        applianceBusinessModel.contractType = applianceViewModel.contractType;
        applianceBusinessModel.contractExpiryDate = applianceViewModel.contractExpiryDate;
        applianceBusinessModel.applianceType = applianceViewModel.applianceType;
        applianceBusinessModel.description = applianceViewModel.description;
        applianceBusinessModel.flueType = applianceViewModel.flueType;
        applianceBusinessModel.cylinderType = applianceViewModel.cylinderType;
        applianceBusinessModel.energyControl = applianceViewModel.energyControl;
        applianceBusinessModel.locationDescription = applianceViewModel.locationDescription;
        applianceBusinessModel.condition = applianceViewModel.condition;
        applianceBusinessModel.numberOfRadiators = applianceViewModel.numberOfRadiators;
        applianceBusinessModel.numberOfSpecialRadiators = applianceViewModel.numberOfSpecialRadiators;
        applianceBusinessModel.installationYear = applianceViewModel.installationYear;
        applianceBusinessModel.systemDesignCondition = applianceViewModel.systemDesignCondition;
        applianceBusinessModel.systemType = applianceViewModel.systemType;
        applianceBusinessModel.notes = applianceViewModel.notes;
        applianceBusinessModel.boilerSize = applianceViewModel.boilerSize;
        // applianceBusinessModel.applianceCategoryType = applianceViewModel.applianceCategoryType;
        applianceBusinessModel.preVisitChirpCode = undefined;
        applianceBusinessModel.applianceSafetyType = applianceViewModel.applianceSafetyType;

        return this.populateBusinessModelFields(applianceBusinessModel, engineerWorkingSector)
            .then(() => this._dataStateManager.updateApplianceDataState(applianceBusinessModel, job))
            .then(() => applianceBusinessModel);
    }

    public updateApplianceBusinessModelFromViewModel(applianceViewModel: ApplianceViewModel, applianceBusinessModel: ApplianceBusinessModel): ApplianceBusinessModel {

        applianceBusinessModel.serialId = applianceViewModel.serialId;
        applianceBusinessModel.gcCode = applianceViewModel.gcCode;
        applianceBusinessModel.bgInstallationIndicator = applianceViewModel.bgInstallationIndicator;
        applianceBusinessModel.category = applianceViewModel.category;
        applianceBusinessModel.applianceType = applianceViewModel.applianceType;
        applianceBusinessModel.description = applianceViewModel.description;
        applianceBusinessModel.flueType = applianceViewModel.flueType;
        applianceBusinessModel.cylinderType = applianceViewModel.cylinderType;
        applianceBusinessModel.energyControl = applianceViewModel.energyControl;
        applianceBusinessModel.locationDescription = applianceViewModel.locationDescription;
        applianceBusinessModel.condition = applianceViewModel.condition;
        applianceBusinessModel.numberOfRadiators = applianceViewModel.numberOfRadiators;
        applianceBusinessModel.numberOfSpecialRadiators = applianceViewModel.numberOfSpecialRadiators;
        applianceBusinessModel.installationYear = applianceViewModel.installationYear;
        applianceBusinessModel.systemDesignCondition = applianceViewModel.systemDesignCondition;
        applianceBusinessModel.systemType = applianceViewModel.systemType;
        applianceBusinessModel.notes = applianceViewModel.notes;
        applianceBusinessModel.boilerSize = applianceViewModel.boilerSize;
        // applianceBusinessModel.applianceCategoryType = applianceViewModel.applianceCategoryType;
        applianceBusinessModel.applianceSafetyType = applianceViewModel.applianceSafetyType;

        applianceBusinessModel.dataState = applianceViewModel.dataState;

        return applianceBusinessModel;
    }
}
