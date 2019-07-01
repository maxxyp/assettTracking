/// <reference path="../../../../typings/app.d.ts" />

import { inject } from "aurelia-dependency-injection";
import { ICatalogService } from "./interfaces/ICatalogService";
import { ReferenceDataService } from "./referenceDataService";
import { IReferenceDataService } from "./interfaces/IReferenceDataService";
import { ConfigurationService } from "../../../common/core/services/configurationService";
import { IConfigurationService } from "../../../common/core/services/IConfigurationService";
import { IObjectType } from "../models/reference/IObjectType";
import { IApplianceElectricalType } from "../models/reference/IApplianceElectricalType";
import { IJcApplianceCode } from "../models/reference/IJcApplianceCode";
import { IFieldOperativeStatus } from "../models/reference/IFieldOperativeStatus";
import { ILabel } from "../models/reference/ILabel";
import { IValidation } from "../models/reference/IValidation";
import { IBusinessRule } from "../models/reference/IBusinessRule";
import { IElectricalApplianceType } from "../models/reference/IElectricalApplianceType";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { IGcCode } from "../models/reference/IGcCode";
import { ISafetyAction } from "../models/reference/ISafetyAction";
import { ISafetyNoticeType } from "../models/reference/ISafetyNoticeType";
import { ISafetyNoticeStatus } from "../models/reference/ISafetyNoticeStatus";
import { ISftyReasonCat } from "../models/reference/ISftyReasonCat";
import { CatalogConstants } from "./constants/catalogConstants";
import { IJcJobCode } from "../models/reference/IJcJobCode";
import { IJcServiceLevelCode } from "../models/reference/IJcServiceLevelCode";
import { IPartOrderStatus } from "../models/reference/IPartOrderStatus";
import { IGoodsItemStatus } from "../models/reference/IGoodsItemStatus";
import { IDiscount } from "../models/reference/IDiscount";
import { IChargeType } from "../models/reference/IChargeType";
import { IChargeOption } from "../models/reference/IChargeOption";
import { IChargeDispute } from "../models/reference/IChargeDispute";
import { IGoodsType } from "../models/reference/IGoodsType";
import { IVat } from "../models/reference/IVat";
import { IActivityCmpnentVstStatus } from "../models/reference/IActivityCmpnentVstStatus";
import { IChirpCode } from "../models/reference/IChirpCode";
import { IAdviceResult } from "../models/reference/IAdviceResult";
import { IEeaCategory } from "../models/reference/IEeaCategory";
import { IWorkedOn } from "../models/reference/IWorkedOn";
import { IVisitActivityCode } from "../models/reference/IVisitActivityCode";
import { IProductGroup } from "../models/reference/IProductGroup";
import { IPartType } from "../models/reference/IPartType";
import { IPtFac } from "../models/reference/IPtFac";
import { IVisitActivityFaultActionCode } from "../models/reference/IVisitActivityFaultActionCode";
import { IFaultActionCode } from "../models/reference/IFaultActionCode";
import { ISftyReadingCat } from "../models/reference/ISftyReadingCat";
import { IElectricalSystemType } from "../models/reference/IElectricalSystemType";
import { IApplianceFlueTypes } from "../models/reference/IApplianceFlueTypes";
import { IApplianceCondition } from "../models/reference/IApplianceCondition";
import { IApplianceSystemType } from "../models/reference/IApplianceSystemType";
import { ISystemDesignAndCondition } from "../models/reference/ISystemDesignAndCondition";
import { IApplianceCylinderType } from "../models/reference/IApplianceCylinderType";
import { IEnergyControls } from "../models/reference/IEnergyControls";
import { IJcChargeRules } from "../models/reference/IJcChargeRules";
import { ILabourChargeRule } from "../models/reference/ILabourChargeRule";
import { IPrimeChargeInterval } from "../models/reference/IPrimeChargeInterval";
import { ISubsqntChargeInterval } from "../models/reference/ISubsqntChargeInterval";
import { IAppointmentBand } from "../models/reference/IAppointmentBand";
import { IPerformanceTestReason } from "../models/reference/IPerformanceTestReason";
import { IPartsNotUsedReason } from "../models/reference/IPartsNotUsedReason";
import { IPassFailNa } from "../models/reference/IPassFailNa";
import { IYesNoNotCheckedNa } from "../models/reference/IYesNoNotCheckedNa";
import { IYesNoNotChecked } from "../models/reference/IYesNoNotChecked";
import { IReadTypeMapping } from "../models/reference/IReadTypeMapping";
import { IReadingType } from "../models/reference/IReadingType";
import { IRegion } from "../models/reference/IRegion";
import { IAreaChargeRules } from "../models/reference/IAreaChargeRules";
import { IApplianceContractType } from "../models/reference/IApplianceContractType";
import { IFieldOprtvClaimType } from "../models/reference/IFieldOprtvClaimType";
import { IFieldActivityType } from "../models/reference/IFieldActivityType";
import { IActionType } from "../models/reference/IActionType";
import { IIaciCode } from "../models/reference/IIaciCode";
import { IConsumableType } from "../models/reference/IConsumableType";

@inject(ReferenceDataService, ConfigurationService)
export class CatalogService implements ICatalogService {
    private _referenceDataService: IReferenceDataService;
    private _catalogCahe: {[key: string]: any};

    constructor(referenceDataService: IReferenceDataService, configurationService: IConfigurationService) {
        this._referenceDataService = referenceDataService;
        this._catalogCahe = {};
    }

    public getItemDescription(catalog: string, keyFields: string[], keys: string[], descriptionField: string): Promise<string> {
        let indexName: string = "";
        let keysValue: any;

        if (keyFields) {
            indexName = keyFields.join("_");
        }

        if (keys) {
            /* Indexed DB lookups with single index name will only accept a single value not an array for the lookup
             * so grab the first element if its a singular */
            if (keys.length === 1) {
                keysValue = keys[0];
            } else {
                keysValue = keys;
            }
        }

        return !(catalog && indexName && keysValue && descriptionField) ? Promise.resolve(undefined) :
            this._referenceDataService.getItem(catalog, indexName, keysValue)
                .then((item) => ObjectHelper.getPathValue(item, descriptionField))
                .then((description) => {
                    return description;
                });
    }

    /* Ungrouped */

    public getActivityComponentVisitStatuses(): Promise<IActivityCmpnentVstStatus[]> {
        return this._referenceDataService.getItems<IActivityCmpnentVstStatus>(CatalogConstants.ACTIVITY_COMPONENT_VISIT_STATUS, undefined, undefined);
    }

    public getAdviceResults(): Promise<IAdviceResult[]> {
        return this._referenceDataService.getItems<IAdviceResult>(CatalogConstants.ADVICE_RESULT, undefined, undefined);
    }

    public getApplianceConditions(): Promise<IApplianceCondition[]> {
        return this._referenceDataService.getItems<IApplianceCondition>(CatalogConstants.APPLIANCE_CONDITION, undefined, undefined);
    }

    public getApplianceContractType(id: string): Promise<IApplianceContractType> {
        return this._referenceDataService.getItem<IApplianceContractType>(CatalogConstants.APPLIANCE_CONTRACT_TYPE, CatalogConstants.APPLIANCE_CONTRACT_TYPE_ID, id);
    }

    public getApplianceCylinderTypes(): Promise<IApplianceCylinderType[]> {
        return this._referenceDataService.getItems<IApplianceCylinderType>(CatalogConstants.APPLIANCE_CYLINDER_TYPE, undefined, undefined);
    }

    public getApplianceElectricalType(id: string): Promise<IApplianceElectricalType> {
        return this._referenceDataService.getItem<IApplianceElectricalType>(CatalogConstants.APPLIANCE_ELETRICAL_TYPE, CatalogConstants.APPLIANCE_ELETRICAL_TYPE_ID, id);
    }

    public getApplianceSystemTypes(): Promise<IApplianceSystemType[]> {
        return this._referenceDataService.getItems<IApplianceSystemType>(CatalogConstants.APPLIANCE_SYSTEM_TYPE, undefined, undefined);
    }

    public getAppointmentBands(): Promise<IAppointmentBand[]> {
        return this._referenceDataService.getItems<IAppointmentBand>(CatalogConstants.APPOINTMENT_BAND, undefined, undefined);
    }

    public getAreaChargeRules(actionType: string, companyCode: string): Promise<IAreaChargeRules[]> {
        return this._referenceDataService.getItems<IAreaChargeRules>(CatalogConstants.AREA_CHARGE_RULE,
            CatalogConstants.AREA_CHARGE_RULE_ACTION_TYPE_CODE + "_" + CatalogConstants.AREA_CHARGE_RULE_COMPANY_CODE, [actionType, companyCode]);
    }

    public getBusinessRules(viewModel: string): Promise<IBusinessRule[]> {
        return this._referenceDataService.getItems<IBusinessRule>(CatalogConstants.BUSINESS_RULE, CatalogConstants.BUSINESS_RULE_VIEW_MODEL, viewModel);
    }

    public getChargeDisputes(): Promise<IChargeDispute[]> {
        return this._referenceDataService.getItems<IChargeDispute>(CatalogConstants.CHARGE_DISPUTE, undefined, undefined);
    }

    public getChargeOptions(): Promise<IChargeOption[]> {
        return this._referenceDataService.getItems<IChargeOption>(CatalogConstants.CHARGE_OPTION, undefined, undefined);
    }

    public getChargeType(id: string): Promise<IChargeType> {
        return this._referenceDataService.getItem<IChargeType>(CatalogConstants.CHARGE_TYPE, CatalogConstants.CHARGE_TYPE_ID, id);
    }

    public getChargeTypes(): Promise<IChargeType[]> {
        return this._referenceDataService.getItems<IChargeType>(CatalogConstants.CHARGE_TYPE, undefined, undefined);
    }

    public getChirpCodes(): Promise<IChirpCode[]> {
        return this._referenceDataService.getItems<IChirpCode>(CatalogConstants.CHIRP_CODE, undefined, undefined);
    }

    public getConsumable(id: string): Promise<IConsumableType> {
        return this._referenceDataService.getItem<IConsumableType>(CatalogConstants.CONSUMABLE_TYPE, CatalogConstants.CONSUMABLE_TYPE_ID, id);
    }

    public async loadConsumables(): Promise<void> {
        this._catalogCahe[CatalogConstants.CONSUMABLE_TYPE] = await this._referenceDataService.getItems<IConsumableType>(CatalogConstants.CONSUMABLE_TYPE, undefined, undefined);
    }

    public async getConsumables(): Promise<IConsumableType[]> {
        if (!this._catalogCahe[CatalogConstants.CONSUMABLE_TYPE]) {
            await this.loadConsumables();
        } 

        return this._catalogCahe[CatalogConstants.CONSUMABLE_TYPE];
    }

    public getDiscounts(): Promise<IDiscount[]> {
        return this._referenceDataService.getItems<IDiscount>(CatalogConstants.DISCOUNT, undefined, undefined);
    }

    public getEnergyControls(): Promise<IEnergyControls[]> {
        return this._referenceDataService.getItems<IEnergyControls>(CatalogConstants.ENERGY_CONTROLS, undefined, undefined);
    }

    public getEeaCategories(): Promise<IEeaCategory[]> {
        return this._referenceDataService.getItems<IEeaCategory>(CatalogConstants.ENERGY_ADVICE_CATEGORY, undefined, undefined);
    }

    public getObjectType(applianceType: string): Promise<IObjectType> {
        return this._referenceDataService.getItem<IObjectType>(CatalogConstants.OBJECT_TYPE, CatalogConstants.OBJECT_TYPE_ID, applianceType);
    }

    public getObjectTypes(): Promise<IObjectType[]> {
        return this._referenceDataService.getItems<IObjectType>(CatalogConstants.OBJECT_TYPE, undefined, undefined);
    }

    public getElectricalApplianceTypes(): Promise<IElectricalApplianceType[]> {
        return this._referenceDataService.getItems<IElectricalApplianceType>(CatalogConstants.ELECTRICAL_APPLIANCE_TYPE, undefined, undefined);
    }

    public getElectricalSystemTypes(): Promise<IElectricalSystemType[]> {
        return this._referenceDataService.getItems<IElectricalSystemType>(CatalogConstants.ELECTRICAL_SYSTEM_TYPE, undefined, undefined);
    }

    public getFaultActionCodes(): Promise<IFaultActionCode[]> {
        return this._referenceDataService.getItems<IFaultActionCode>(CatalogConstants.FAULT_ACTION_CODE, undefined, undefined);
    }

    public getFieldOperativeStatuses(): Promise<IFieldOperativeStatus[]> {
        return this._referenceDataService.getItems<IFieldOperativeStatus>(CatalogConstants.FIELD_OPERATIVE_STATUS, undefined, undefined);
    }

    public getFlueTypes(): Promise<IApplianceFlueTypes[]> {
        return this._referenceDataService.getItems<IApplianceFlueTypes>(CatalogConstants.APPLIANCE_FLUE_TYPES, undefined, undefined);
    }

    public getGCCode(id: string): Promise<IGcCode> {
        return this._referenceDataService.getItem<IGcCode>(CatalogConstants.GC_CODE, CatalogConstants.GC_CODE_ID, id);
    }

    public getGCCodes(objTypeCode: string): Promise<IGcCode[]> {
        return this._referenceDataService.getItems<IGcCode>(CatalogConstants.GC_CODE, CatalogConstants.GC_CODE_OBJECT_TYPE_CODE, objTypeCode);
    }

    public getGoodsType(id: string): Promise<IGoodsType> {
        return this._referenceDataService.getItem<IGoodsType>(CatalogConstants.GOODS_TYPE, CatalogConstants.GOODS_TYPE_ID, id);
    }

    public getGoodsItemStatuses(): Promise<IGoodsItemStatus[]> {
        return this._referenceDataService.getItems<IGoodsItemStatus>(CatalogConstants.GOODS_ITEM_STATUS, undefined, undefined);
    }

    public getJCApplianceCode(id: string): Promise<IJcApplianceCode> {
        return this._referenceDataService.getItem<IJcApplianceCode>(CatalogConstants.JC_APPLIANCE_CODE, CatalogConstants.JC_APPLIANCE_CODE_ID, id);
    }

    public getJCChargeRules(actionTypeCode: string, objectTypeCode: string): Promise<IJcChargeRules[]> {
        return this._referenceDataService.getItems<IJcChargeRules>(CatalogConstants.JC_CHARGE_RULES,
            CatalogConstants.JC_CHARGE_RULES_ACTION_TYPE_CODE + "_" + CatalogConstants.JC_CHARGE_RULES_OBJECT_TYPE_CODE, [actionTypeCode, objectTypeCode]);
    }

    public getJCJobCode(id: string): Promise<IJcJobCode> {
        return this._referenceDataService.getItem<IJcJobCode>(CatalogConstants.JC_JOB_CODE, CatalogConstants.JC_JOB_CODE_ID, id);
    }

    public getJCJobCodes(): Promise<IJcJobCode[]> {
        return this._referenceDataService.getItems<IJcJobCode>(CatalogConstants.JC_JOB_CODE, undefined, undefined);
    }

    public getJCServiceLevelCode(id: string): Promise<IJcServiceLevelCode> {
        return this._referenceDataService.getItem<IJcServiceLevelCode>(CatalogConstants.JC_SERVICE_LEVEL_CODE, CatalogConstants.JC_SERVICE_LEVEL_CODE_ID, id);
    }

    public getLabels(viewModel: string): Promise<ILabel[]> {
        return this._referenceDataService.getItems<ILabel>(CatalogConstants.LABEL, CatalogConstants.LABEL_VIEW_MODEL, viewModel);
    }

    public getLabourChargeRule(id: string): Promise<ILabourChargeRule> {
        return this._referenceDataService.getItem<ILabourChargeRule>(CatalogConstants.LABOUR_CHARGE_RULE, CatalogConstants.LABOUR_CHARGE_RULE_ID, id);
    }

    public getPartTypes(): Promise<IPartType[]> {
        return this._referenceDataService.getItems<IPartType>(CatalogConstants.PART_TYPE, undefined, undefined);
    }

    public getPartTypeFaultActions(): Promise<IPtFac[]> {
        return this._referenceDataService.getItems<IPtFac>(CatalogConstants.PART_TYPE_FAULT_ACTION, undefined, undefined);
    }

    public getProductGroups(): Promise<IProductGroup[]> {
        return this._referenceDataService.getItems<IProductGroup>(CatalogConstants.PRODUCT_GROUP, undefined, undefined);
    }

    public getPartsNotUsedReasons(): Promise<IPartsNotUsedReason[]> {
        return this._referenceDataService.getItems<IPartsNotUsedReason>(CatalogConstants.PARTS_NOT_USED_REASON, undefined, undefined);
    }

    public getPartOrderStatuses(): Promise<IPartOrderStatus[]> {
        return this._referenceDataService.getItems<IPartOrderStatus>(CatalogConstants.PART_ORDER_STATUS, undefined, undefined);
    }

    public getPassFailNas(): Promise<IPassFailNa[]> {
        return this._referenceDataService.getItems<IPassFailNa>(CatalogConstants.PASS_FAIL_NA, undefined, undefined);
    }

    public getPerformanceTestReasons(): Promise<IPerformanceTestReason[]> {
        return this._referenceDataService.getItems<IPerformanceTestReason>(CatalogConstants.PERFORMANCE_TEST_REASON, undefined, undefined);
    }

    public getPrimeChargeIntervals(): Promise<IPrimeChargeInterval[]> {
        return this._referenceDataService.getItems<IPrimeChargeInterval>(CatalogConstants.PRIME_CHARGE_INTERVAL, undefined, undefined);
    }

    public getReadTypeMappings(): Promise<IReadTypeMapping[]> {
        return this._referenceDataService.getItems<IReadTypeMapping>(CatalogConstants.READ_TYPE_MAPPING, undefined, undefined);
    }

    public getReadingTypes(): Promise<IReadingType[]> {
        return this._referenceDataService.getItems<IReadingType>(CatalogConstants.READING_TYPE, undefined, undefined);
    }

    public getSafetyAction(id: string): Promise<ISafetyAction> {
        return this._referenceDataService.getItem<ISafetyAction>(CatalogConstants.SAFETY_ACTION, CatalogConstants.SAFETY_ACTION_ID, id);
    }

    public getSafetyActions(): Promise<ISafetyAction[]> {
        return this._referenceDataService.getItems<ISafetyAction>(CatalogConstants.SAFETY_ACTION, undefined, undefined);
    }

    public getSafetyNoticeStatus(id: string): Promise<ISafetyNoticeStatus> {
        return this._referenceDataService.getItem<ISafetyNoticeStatus>(CatalogConstants.SAFETY_NOTICE_STATUS, CatalogConstants.SAFETY_NOTICE_STATUS_ID, id);
    }

    public getSafetyNoticeStatuses(): Promise<ISafetyNoticeStatus[]> {
        return this._referenceDataService.getItems<ISafetyNoticeStatus>(CatalogConstants.SAFETY_NOTICE_STATUS, undefined, undefined);
    }

    public getSafetyNoticeType(id: string): Promise<ISafetyNoticeType> {
        return this._referenceDataService.getItem<ISafetyNoticeType>(CatalogConstants.SAFETY_NOTICE_TYPE, CatalogConstants.SAFETY_NOTICE_TYPE_ID, id);
    }

    public getSafetyNoticeTypes(): Promise<ISafetyNoticeType[]> {
        return this._referenceDataService.getItems<ISafetyNoticeType>(CatalogConstants.SAFETY_NOTICE_TYPE, undefined, undefined);
    }

    public getSafetyReadingCat(flag: string, id: string): Promise<ISftyReadingCat> {
        return this._referenceDataService.getItem<ISftyReadingCat>(CatalogConstants.SAFETY_READING_CAT,
            CatalogConstants.SAFETY_READING_CAT_GROUP + "_" + CatalogConstants.SAFETY_READING_CAT_ID, [flag, id]);
    }

    public getSafetyReadingCats(flag: string): Promise<ISftyReadingCat[]> {
        return this._referenceDataService.getItems<ISftyReadingCat>(CatalogConstants.SAFETY_READING_CAT, CatalogConstants.SAFETY_READING_CAT_GROUP, flag);
    }

    public getSafetyReasonCats(flag: string): Promise<ISftyReasonCat[]> {
        return this._referenceDataService.getItems<ISftyReasonCat>(CatalogConstants.SAFETY_REASON_CAT, CatalogConstants.SAFETY_REASON_CAT_GROUP, flag)
            .then((safetyReasons) => safetyReasons.filter(safetyReason => safetyReason.safetyReasonCategoryCode !== "NRENG"));
    }

    public getSubsequentChargeIntervals(): Promise<ISubsqntChargeInterval[]> {
        return this._referenceDataService.getItems<ISubsqntChargeInterval>(CatalogConstants.SUBSEQUENT_CHARGE_INTERVAL, undefined, undefined);
    }

    public getSystemDesignAndCondition(): Promise<ISystemDesignAndCondition[]> {
        return this._referenceDataService.getItems<ISystemDesignAndCondition>(CatalogConstants.SYSTEM_DESIGN_AND_CONDITION, undefined, undefined);
    }

    public getValidations(viewModel: string): Promise<IValidation[]> {
        return this._referenceDataService.getItems<IValidation>(CatalogConstants.VALIDATION, CatalogConstants.VALIDATION_VIEW_MODEL, viewModel);
    }

    public getVats(): Promise<IVat[]> {
        return this._referenceDataService.getItems<IVat>(CatalogConstants.VAT, undefined, undefined);
    }

    public getVisitActivityCodes(): Promise<IVisitActivityCode[]> {
        return this._referenceDataService.getItems<IVisitActivityCode>(CatalogConstants.VISIT_ACTIVITY_CODE, undefined, undefined);
    }

    public getVisitActivityFaultActions(): Promise<IVisitActivityFaultActionCode[]> {
        return this._referenceDataService.getItems<IVisitActivityFaultActionCode>(CatalogConstants.VISIT_ACTIVITY_FAULT_ACTION, undefined, undefined);
    }

    public getWorkedOns(): Promise<IWorkedOn[]> {
        return this._referenceDataService.getItems<IWorkedOn>(CatalogConstants.WORKED_ON, undefined, undefined);
    }

    public getYesNoNotCheckeds(): Promise<IYesNoNotChecked[]> {
        return this._referenceDataService.getItems<IYesNoNotChecked>(CatalogConstants.YES_NO_NOTCHECKED, undefined, undefined);
    }

    public getYesNoNotCheckedNas(): Promise<IYesNoNotCheckedNa[]> {
        return this._referenceDataService.getItems<IYesNoNotCheckedNa>(CatalogConstants.YES_NO_NOTCHECKED_NA, undefined, undefined);
    }

    public getRegion(id: string): Promise<IRegion> {
        return this._referenceDataService.getItem<IRegion>(CatalogConstants.REGION, CatalogConstants.REGION_ID, id);
    }

    public getRegions(): Promise<IRegion[]> {
        return this._referenceDataService.getItems<IRegion>(CatalogConstants.REGION, undefined, undefined);
    }

    public getFieldActivityType(objectTypeCode: string): Promise<IFieldActivityType[]> {
        return this._referenceDataService.getItems<IFieldActivityType>(CatalogConstants.FIELD_ACTIVITY_TYPE, CatalogConstants.FIELD_ACTIVITY_TYPE_OBJECT_TYPE_CODE, objectTypeCode);
    }

    public getActionType(actionTypeCode: string): Promise<IActionType[]> {
        return this._referenceDataService.getItems<IActionType>(CatalogConstants.ACTION_TYPE, CatalogConstants.ACTION_TYPE_ID, actionTypeCode);
    }

    public getFieldOprtvClaimType(): Promise<IFieldOprtvClaimType[]> {
        return this._referenceDataService.getItems<IFieldOprtvClaimType>(CatalogConstants.FIELD_OPRTV_CLAIM_TYPE, undefined, undefined);
    }

    public getIaciCode(): Promise<IIaciCode[]> {
        return this._referenceDataService.getItems<IIaciCode>(CatalogConstants.IACI_CODE, undefined, undefined);
    }
}
