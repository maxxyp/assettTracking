import {Appliance as ApplianceBusinessModel} from "../../../business/models/appliance";
import {ApplianceViewModel} from "../../modules/appliances/viewModels/applianceViewModel";
import {IObjectType} from "../../../business/models/reference/IObjectType";
import {IBaseApplianceFactory} from "../../../common/factories/interfaces/IBaseApplianceFactory";
import { Job } from "../../../business/models/job";

export interface IApplianceFactory extends IBaseApplianceFactory {
    createNewApplianceViewModel(): ApplianceViewModel;
    createApplianceViewModelFromBusinessModel(applianceBusinessModel: ApplianceBusinessModel, applianceTypeCatalogItem: IObjectType,
                                              centralHeatingApplianceHardwareCategory: string, applianceRequiresGcCode: string,
                                              parentApplianceBusinessModel: ApplianceBusinessModel): ApplianceViewModel;
    updateApplianceViewModelApplianceType(applianceViewModel: ApplianceViewModel, applianceType: string, applianceTypeCatalogItem: IObjectType,
                                          centralHeatingApplianceHardwareCategory: string, applianceRequiresGcCode: string,
                                          parentApplianceIndicator: string, engineerWorkingSector: string): Promise<void>;
    createApplianceBusinessModelFromViewModel(applianceViewModel: ApplianceViewModel, job: Job, engineerWorkingSector: string): Promise<ApplianceBusinessModel>;
    updateApplianceBusinessModelFromViewModel(applianceViewModel: ApplianceViewModel, applianceBusinessModel: ApplianceBusinessModel): ApplianceBusinessModel;
}
