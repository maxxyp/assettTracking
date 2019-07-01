/// <reference path="../../../../../typings/app.d.ts" />

import {IObjectType} from "../../models/reference/IObjectType";
import {IApplianceElectricalType} from "../../models/reference/IApplianceElectricalType";
import {IJcApplianceCode} from "../../models/reference/IJcApplianceCode";
import {IFieldOperativeStatus} from "../../models/reference/IFieldOperativeStatus";
import {IBusinessRule} from "../../models/reference/IBusinessRule";
import {IValidation} from "../../models/reference/IValidation";
import {ILabel} from "../../models/reference/ILabel";
import {IElectricalApplianceType} from "../../models/reference/IElectricalApplianceType";
import {IGcCode} from "../../models/reference/IGcCode";
import {ISafetyAction} from "../../models/reference/ISafetyAction";
import {ISafetyNoticeType} from "../../models/reference/ISafetyNoticeType";
import {ISafetyNoticeStatus} from "../../models/reference/ISafetyNoticeStatus";
import {ISftyReasonCat} from "../../models/reference/ISftyReasonCat";
import {IJcJobCode} from "../../models/reference/IJcJobCode";
import {IJcServiceLevelCode} from "../../models/reference/IJcServiceLevelCode";
import {IPartOrderStatus} from "../../models/reference/IPartOrderStatus";
import {IGoodsItemStatus} from "../../models/reference/IGoodsItemStatus";
import {IDiscount} from "../../models/reference/IDiscount";
import {IChargeType} from "../../models/reference/IChargeType";
import {IChargeDispute} from "../../models/reference/IChargeDispute";
import {IChargeOption} from "../../models/reference/IChargeOption";
import {IGoodsType} from "../../models/reference/IGoodsType";
import {IVat} from "../../models/reference/IVat";
import {IActivityCmpnentVstStatus} from "../../models/reference/IActivityCmpnentVstStatus";
import {IChirpCode} from "../../models/reference/IChirpCode";
import {IAdviceResult} from "../../models/reference/IAdviceResult";
import {IEeaCategory} from "../../models/reference/IEeaCategory";
import {IWorkedOn} from "../../models/reference/IWorkedOn";
import {IVisitActivityCode} from "../../models/reference/IVisitActivityCode";
import {IProductGroup} from "../../models/reference/IProductGroup";
import {IPartType} from "../../models/reference/IPartType";
import {IPtFac} from "../../models/reference/IPtFac";
import {IVisitActivityFaultActionCode} from "../../models/reference/IVisitActivityFaultActionCode";
import {IFaultActionCode} from "../../models/reference/IFaultActionCode";
import {ISftyReadingCat} from "../../models/reference/ISftyReadingCat";
import {IElectricalSystemType} from "../../models/reference/IElectricalSystemType";
import {IApplianceFlueTypes} from "../../models/reference/IApplianceFlueTypes";
import {IApplianceCondition} from "../../models/reference/IApplianceCondition";
import {IApplianceSystemType} from "../../models/reference/IApplianceSystemType";
import {ISystemDesignAndCondition} from "../../models/reference/ISystemDesignAndCondition";
import {IApplianceCylinderType} from "../../models/reference/IApplianceCylinderType";
import {IEnergyControls} from "../../models/reference/IEnergyControls";
import {IJcChargeRules} from "../../models/reference/IJcChargeRules";
import {ILabourChargeRule} from "../../models/reference/ILabourChargeRule";
import {IPrimeChargeInterval} from "../../models/reference/IPrimeChargeInterval";
import {ISubsqntChargeInterval} from "../../models/reference/ISubsqntChargeInterval";
import {IAppointmentBand} from "../../models/reference/IAppointmentBand";
import {IPerformanceTestReason} from "../../models/reference/IPerformanceTestReason";
import {IPartsNotUsedReason} from "../../models/reference/IPartsNotUsedReason";
import {IYesNoNotCheckedNa} from "../../models/reference/IYesNoNotCheckedNa";
import {IYesNoNotChecked} from "../../models/reference/IYesNoNotChecked";
import {IPassFailNa} from "../../models/reference/IPassFailNa";
import {IReadTypeMapping} from "../../models/reference/IReadTypeMapping";
import {IReadingType} from "../../models/reference/IReadingType";
import {IRegion} from "../../models/reference/IRegion";
import {IAreaChargeRules} from "../../models/reference/IAreaChargeRules";
import { IApplianceContractType } from "../../models/reference/IApplianceContractType";
import { IFieldOprtvClaimType } from "../../models/reference/IFieldOprtvClaimType";
import {IFieldActivityType} from "../../models/reference/IFieldActivityType";
import { IActionType } from "../../models/reference/IActionType";
import { IIaciCode } from "../../models/reference/IIaciCode";
import { IConsumableType } from "../../models/reference/IConsumableType";

export interface ICatalogService {
    getItemDescription(catalog: string, keyFields: string[], keys: string[], descriptionField: string): Promise<string>;

    getActivityComponentVisitStatuses() : Promise<IActivityCmpnentVstStatus[]>;

    getAdviceResults(): Promise<IAdviceResult[]>;

    getApplianceConditions() : Promise<IApplianceCondition[]>;

    getApplianceContractType(id: string) : Promise<IApplianceContractType>;

    getApplianceCylinderTypes() : Promise<IApplianceCylinderType[]>;

    getApplianceElectricalType(id: string) : Promise<IApplianceElectricalType>;

    getApplianceSystemTypes() : Promise<IApplianceSystemType[]>;

    getAppointmentBands() : Promise<IAppointmentBand[]>;

    getAreaChargeRules(actionTypeCode: string, companyCode: string) : Promise<IAreaChargeRules[]>;

    getBusinessRules(viewModel: string) : Promise<IBusinessRule[]>;

    getChargeDisputes() : Promise<IChargeDispute[]>;

    getChargeOptions() : Promise<IChargeOption[]>;

    getChargeType(id: string) : Promise<IChargeType>;

    getChargeTypes() : Promise<IChargeType[]>;

    getChirpCodes(): Promise<IChirpCode[]>;

    getConsumable(id: string): Promise<IConsumableType>;    
    loadConsumables(): Promise<void>;
    getConsumables(): Promise<IConsumableType[]>;

    getDiscounts() : Promise<IDiscount[]>;

    getEnergyControls() : Promise<IEnergyControls[]>;

    getEeaCategories() : Promise<IEeaCategory[]>;

    getElectricalApplianceTypes() : Promise<IElectricalApplianceType[]>;

    getElectricalSystemTypes() : Promise<IElectricalSystemType[]>;

    getFaultActionCodes() : Promise<IFaultActionCode[]>;

    getFieldOperativeStatuses() : Promise<IFieldOperativeStatus[]>;

    getFlueTypes(): Promise<IApplianceFlueTypes[]>;

    getGCCode(id: string): Promise<IGcCode>;
    getGCCodes(objTypeCode: string): Promise<IGcCode[]>;

    getGoodsType(id: string): Promise<IGoodsType>;

    getGoodsItemStatuses(): Promise<IGoodsItemStatus[]>;

    getJCApplianceCode(id: string): Promise<IJcApplianceCode>;

    getJCChargeRules(actionTypeCode: string, objectTypeCode: string) : Promise<IJcChargeRules[]>;

    getJCJobCode(id: string): Promise<IJcJobCode>;
    getJCJobCodes(): Promise<IJcJobCode[]>;

    getJCServiceLevelCode(id: string): Promise<IJcServiceLevelCode>;

    getLabels(viewModel: string) : Promise<ILabel[]>;

    getLabourChargeRule(id: string) : Promise<ILabourChargeRule>;

    getObjectTypes() : Promise<IObjectType[]>;
    getObjectType(applianceType: string) : Promise<IObjectType>;

    getPartTypes() : Promise<IPartType[]>;

    getPartTypeFaultActions() : Promise<IPtFac[]>;

    getProductGroups() : Promise<IProductGroup[]>;

    getPartsNotUsedReasons() : Promise<IPartsNotUsedReason[]>;

    getPartOrderStatuses() : Promise<IPartOrderStatus[]>;

    getPassFailNas() : Promise<IPassFailNa[]>;

    getPerformanceTestReasons() : Promise<IPerformanceTestReason[]>;

    getPrimeChargeIntervals() : Promise<IPrimeChargeInterval[]>;

    getReadTypeMappings() : Promise<IReadTypeMapping[]>;

    getReadingTypes() : Promise<IReadingType[]>;

    getSafetyAction(id: string) : Promise<ISafetyAction>;
    getSafetyActions() : Promise<ISafetyAction[]>;

    getSafetyNoticeStatus(id: string) : Promise<ISafetyNoticeStatus>;
    getSafetyNoticeStatuses() : Promise<ISafetyNoticeStatus[]>;

    getSafetyNoticeType(id: string) : Promise<ISafetyNoticeType>;
    getSafetyNoticeTypes() : Promise<ISafetyNoticeType[]>;

    getSafetyReadingCat(flag: string, id: string) : Promise<ISftyReadingCat>;
    getSafetyReadingCats(flag: string) : Promise<ISftyReadingCat[]>;

    getSafetyReasonCats(flag: string) : Promise<ISftyReasonCat[]>;

    getSubsequentChargeIntervals() : Promise<ISubsqntChargeInterval[]>;

    getSystemDesignAndCondition() : Promise<ISystemDesignAndCondition[]>;

    getValidations(viewModel: string) : Promise<IValidation[]>;

    getVats() : Promise<IVat[]>;

    getVisitActivityCodes() : Promise<IVisitActivityCode[]>;

    getVisitActivityFaultActions() : Promise<IVisitActivityFaultActionCode[]>;

    getWorkedOns() : Promise<IWorkedOn[]>;

    getYesNoNotCheckeds() : Promise<IYesNoNotChecked[]>;

    getYesNoNotCheckedNas() : Promise<IYesNoNotCheckedNa[]>;

    getRegion(id: string) : Promise<IRegion>;
    getRegions() : Promise<IRegion[]>;

    getFieldActivityType(objectTypeCode: string): Promise<IFieldActivityType[]>;

    getActionType(actionTypeCode: string): Promise<IActionType[]>;

    getFieldOprtvClaimType() : Promise<IFieldOprtvClaimType[]>;

    getIaciCode() : Promise<IIaciCode[]>;
}
