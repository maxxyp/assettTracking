import { IConsumableType } from "../../models/reference/IConsumableType";
import { IGoodsType } from "../../models/reference/IGoodsType";
import { IObjectType } from "../../models/reference/IObjectType";
import { IChargeType } from "../../models/reference/IChargeType";
import { IDiscount } from "../../models/reference/IDiscount";
import { ILabourChargeRule } from "../../models/reference/ILabourChargeRule";
import { IPrimeChargeInterval } from "../../models/reference/IPrimeChargeInterval";
import { ISubsqntChargeInterval } from "../../models/reference/ISubsqntChargeInterval";
import { IActivityCmpnentVstStatus } from "../../models/reference/IActivityCmpnentVstStatus";
import { IApplianceFlueTypes } from "../../models/reference/IApplianceFlueTypes";
import { IEnergyControls } from "../../models/reference/IEnergyControls";
import { IFaultActionCode } from "../../models/reference/IFaultActionCode";
import { IFieldOperativeStatus } from "../../models/reference/IFieldOperativeStatus";
import { IGoodsItemStatus } from "../../models/reference/IGoodsItemStatus";
import { IIaciCode } from "../../models/reference/IIaciCode";
import { IPartsNotUsedReason } from "../../models/reference/IPartsNotUsedReason";
import { IPartType } from "../../models/reference/IPartType";
import { IProductGroup } from "../../models/reference/IProductGroup";
import { ISafetyNoticeStatus } from "../../models/reference/ISafetyNoticeStatus";
import { ISafetyNoticeType } from "../../models/reference/ISafetyNoticeType";
import { ISftyReadingCat } from "../../models/reference/ISftyReadingCat";
import { IVisitActivityCode } from "../../models/reference/IVisitActivityCode";
import { IWorkedOn } from "../../models/reference/IWorkedOn";
import { IActionType } from "../../models/reference/IActionType";
import { IApplianceContractType } from "../../models/reference/IApplianceContractType";
import { IAreaChargeRules } from "../../models/reference/IAreaChargeRules";
import { IGcCode } from "../../models/reference/IGcCode";
import { IFieldActivityType } from "../../models/reference/IFieldActivityType";
import { IJcChargeRules } from "../../models/reference/IJcChargeRules";
import { IBusinessRule } from "../../models/reference/IBusinessRule";
import { ILabel } from "../../models/reference/ILabel";
import { IValidation } from "../../models/reference/IValidation";
import { IAdviceResult } from "../../models/reference/IAdviceResult";
import { IApplianceCondition } from "../../models/reference/IApplianceCondition";
import { IApplianceCylinderType } from "../../models/reference/IApplianceCylinderType";
import { IApplianceElectricalType } from "../../models/reference/IApplianceElectricalType";
import { IApplianceSystemType } from "../../models/reference/IApplianceSystemType";
import { IChargeDispute } from "../../models/reference/IChargeDispute";
import { IChargeOption } from "../../models/reference/IChargeOption";
import { IElectricalApplianceType } from "../../models/reference/IElectricalApplianceType";
import { IElectricalSystemType } from "../../models/reference/IElectricalSystemType";
import { IJcApplianceCode } from "../../models/reference/IJcApplianceCode";
import { IJcJobCode } from "../../models/reference/IJcJobCode";
import { IJcServiceLevelCode } from "../../models/reference/IJcServiceLevelCode";
import { IPartOrderStatus } from "../../models/reference/IPartOrderStatus";
import { IPassFailNa } from "../../models/reference/IPassFailNa";
import { IPerformanceTestReason } from "../../models/reference/IPerformanceTestReason";
import { ISystemDesignAndCondition } from "../../models/reference/ISystemDesignAndCondition";
import { IYesNoNotChecked } from "../../models/reference/IYesNoNotChecked";
import { IYesNoNotCheckedNa } from "../../models/reference/IYesNoNotCheckedNa";
import { IChirpCode } from "../../models/reference/IChirpCode";
import { IFieldOprtvClaimType } from "../../models/reference/IFieldOprtvClaimType";
import { IRegion } from "../../models/reference/IRegion";
import { ISftyReasonCat } from "../../models/reference/ISftyReasonCat";
import { IEeaCategory } from "../../models/reference/IEeaCategory";
import { IAppointmentBand } from "../../models/reference/IAppointmentBand";
import { ISafetyAction } from "../../models/reference/ISafetyAction";
import { ReferenceDataManifest } from "../../models/reference/referenceDataManifest";

export class CatalogConstants {

    /* Goods Group */

    public static CONSUMABLE_TYPE: keyof ReferenceDataManifest = "consumableType"; // consumables
    public static CONSUMABLE_TYPE_ID: keyof IConsumableType = "stockReferenceId";
    public static CONSUMABLE_TYPE_DESCRIPTION: keyof IConsumableType = "consumableTypeDescription";

    public static GOODS_TYPE: keyof ReferenceDataManifest = "goodsType";
    public static GOODS_TYPE_ID: keyof IGoodsType = "stockReferenceId";

    /* Business Group */

    public static OBJECT_TYPE: keyof ReferenceDataManifest = "applianceType";
    public static OBJECT_TYPE_ID: keyof IObjectType = "applianceType";
    public static OBJECT_TYPE_DESCRIPTION: keyof IObjectType = "applianceTypeDescription";

    public static CHARGE_TYPE: keyof ReferenceDataManifest = "chargeType";
    public static CHARGE_TYPE_ID: keyof IChargeType = "chargeType";
    public static CHARGE_TYPE_DESCRIPTION: keyof IChargeType = "chargeTypeDescription";

    public static DISCOUNT: keyof ReferenceDataManifest = "discount";
    public static DISCOUNT_ID: keyof IDiscount = "discountCode";
    public static DISCOUNT_DESCRIPTION: keyof IDiscount = "discountDescription";
    public static DISCOUNT_VALUE: keyof IDiscount = "discountValue";
    public static DISCOUNT_CATEGORY: keyof IDiscount = "discountCategory";

    public static LABOUR_CHARGE_RULE: keyof ReferenceDataManifest = "labourChargeRule";
    public static LABOUR_CHARGE_RULE_ID: keyof ILabourChargeRule = "labourChargeRuleCode";

    public static PRIME_CHARGE_INTERVAL: keyof ReferenceDataManifest = "primeChargeInterval";
    public static PRIME_CHARGE_INTERVAL_ID: keyof IPrimeChargeInterval = "labourChargeRuleCode";

    public static READING_TYPE: keyof ReferenceDataManifest = "readingType";

    public static SUBSEQUENT_CHARGE_INTERVAL: keyof ReferenceDataManifest = "subsequentChargeInterval";
    public static SUBSEQUENT_CHARGE_INTERVAL_ID: keyof ISubsqntChargeInterval = "labourChargeRuleCode";

    public static VAT: keyof ReferenceDataManifest = "vat";

    /* Lookups Group */

    public static ACTIVITY_COMPONENT_VISIT_STATUS: keyof ReferenceDataManifest = "activityComponentVisitStatus";
    public static ACTIVITY_COMPONENT_VISIT_STATUS_ID: keyof IActivityCmpnentVstStatus = "status";
    public static ACTIVITY_COMPONENT_VISIT_STATUS_DESCRIPTION: keyof IActivityCmpnentVstStatus = "statusDescription";

    public static APPLIANCE_FLUE_TYPES: keyof ReferenceDataManifest = "applianceFlueTypes";
    public static APPLIANCE_FLUE_TYPES_ID: keyof IApplianceFlueTypes = "flueType";
    public static APPLIANCE_FLUE_TYPES_DESCRIPTION: keyof IApplianceFlueTypes = "flueTypeDescription";

    public static APPOINTMENT_BAND: keyof ReferenceDataManifest = "appointmentBand";
    public static APPOINTMENT_BAND_ID: keyof IAppointmentBand = "appointmentBandCode";
    public static APPOINTMENT_BAND_DESCRIPTION: keyof IAppointmentBand = "appointmentBandDescription";

    // complaintReason???

    public static ENERGY_ADVICE_CATEGORY: keyof ReferenceDataManifest = "eeaCategory";
    public static ENERGY_ADVICE_CATEGORY_ID: keyof IEeaCategory = "energyAdviceCategoryCode";
    public static ENERGY_ADVICE_CATEGORY_DESCRIPTION: keyof IEeaCategory = "energyAdviceDescription";

    public static ENERGY_CONTROLS: keyof ReferenceDataManifest = "energyControls";
    public static ENERGY_CONTROLS_ID: keyof IEnergyControls = "energyControl";
    public static ENERGY_CONTROLS_DESCRIPTION: keyof IEnergyControls = "energyControlDescription";

    public static FAULT_ACTION_CODE: keyof ReferenceDataManifest = "faultActionCode";
    public static FAULT_ACTION_CODE_ID: keyof IFaultActionCode = "faultActionCode";
    public static FAULT_ACTION_CODE_DESCRIPTION: keyof IFaultActionCode = "faultActionDescription";

    public static FIELD_OPERATIVE_STATUS: keyof ReferenceDataManifest = "fieldOperativeStatus";
    public static FIELD_OPERATIVE_STATUS_ID: keyof IFieldOperativeStatus = "fieldOperativeStatus";
    public static FIELD_OPERATIVE_STATUS_DESCRIPTION: keyof IFieldOperativeStatus = "fieldOperativeStatusDescription";

    public static GOODS_ITEM_STATUS: keyof ReferenceDataManifest = "goodsItemStatus";
    public static GOODS_ITEM_STATUS_ID: keyof IGoodsItemStatus = "status";
    public static GOODS_ITEM_STATUS_DESCRIPTION: keyof IGoodsItemStatus = "description";

    public static IACI_CODE: keyof ReferenceDataManifest = "iaciCode";
    public static IACI_CODE_ID: keyof IIaciCode = "iaciCode";
    public static IACI_CODE_DESCRIPTION: keyof IIaciCode = "iaciDescription";

    public static PARTS_NOT_USED_REASON: keyof ReferenceDataManifest = "partsNotUsedReason";
    public static PARTS_NOT_USED_REASON_ID: keyof IPartsNotUsedReason = "reasonCode";
    public static PARTS_NOT_USED_REASON_DESCRIPTION: keyof IPartsNotUsedReason = "partsNotUsedReasonDescription";

    public static PART_TYPE: keyof ReferenceDataManifest = "partType";
    public static PART_TYPE_ID: keyof IPartType = "partTypeCode";
    public static PART_TYPE_DESCRIPTION: keyof IPartType = "partTypeDescription";

    public static PART_TYPE_FAULT_ACTION: keyof ReferenceDataManifest = "ptFac";

    public static PRODUCT_GROUP: keyof ReferenceDataManifest = "productGroup";
    public static PRODUCT_GROUP_ID: keyof IProductGroup = "productGroupCode";
    public static PRODUCT_GROUP_DESCRIPTION: keyof IProductGroup = "productGroupDescription";

    public static SAFETY_ACTION: keyof ReferenceDataManifest = "safetyAction";
    public static SAFETY_ACTION_ID: keyof ISafetyAction = "actionCode";
    public static SAFETY_ACTION_DESCRIPTION: keyof ISafetyAction = "safetyActionDescription";

    public static SAFETY_NOTICE_STATUS: keyof ReferenceDataManifest = "safetyNoticeStatus";
    public static SAFETY_NOTICE_STATUS_ID: keyof ISafetyNoticeStatus = "noticeStatus";
    public static SAFETY_NOTICE_STATUS_DESCRIPTION: keyof ISafetyNoticeStatus = "safetyNoticeStatusDescription";

    public static SAFETY_NOTICE_TYPE: keyof ReferenceDataManifest = "safetyNoticeType";
    public static SAFETY_NOTICE_TYPE_ID: keyof ISafetyNoticeType = "noticeType";
    public static SAFETY_NOTICE_TYPE_DESCRIPTION: keyof ISafetyNoticeType = "safetyNoticeTypeDescription";

    public static SAFETY_READING_CAT: keyof ReferenceDataManifest = "safetyReadingCategory";
    public static SAFETY_READING_CAT_GROUP: keyof ISftyReadingCat = "safetyReadingCategoryFlag";
    public static SAFETY_READING_CAT_ID: keyof ISftyReadingCat = "safetyReadingCategoryReading";
    public static SAFETY_READING_CAT_DESCRIPTION: keyof ISftyReadingCat = "safetyReadingCategoryReading";

    public static SAFETY_READING_CAT_GROUP_INIT_ELI_READING: string = "INIT_ELI_READING";
    public static SAFETY_READING_CAT_GROUP_FINAL_ELI_READING: string = "FINAL_ELI_READING";
    public static SAFETY_READING_CAT_GROUP_FUSE_RATE_VALS: string = "FUSE_RATE_VALS";
    public static SAFETY_READING_CAT_GROUP_MCB_FUSE_RAT_VALS: string = "MCB_FUSE_RAT_VALS";
    public static SAFETY_READING_CAT_NO_READING_TAKEN: string = "NO_READING_TAKEN";

    public static SAFETY_REASON_CAT: keyof ReferenceDataManifest = "safetyReasonCat";
    public static SAFETY_REASON_CAT_GROUP: keyof ISftyReasonCat = "safetyReadingCategoryFlag";
    public static SAFETY_REASON_CAT_ID: keyof ISftyReasonCat = "safetyReasonCategoryCode";
    public static SAFETY_REASON_CAT_DESCRIPTION: keyof ISftyReasonCat = "safetyReasonCategoryReason";

    public static SAFETY_REASON_CAT_GROUP_UNSAFE_REASON: string = "UNSAFE_REASON";
    public static SAFETY_REASON_CAT_GROUP_PART_LJ_REPORT: string = "PART_LJ_REPORT";
    public static SAFETY_REASON_CAT_GROUP_RISK_REASON: string = "RISK_REASON";
    public static SAFETY_REASON_CAT_GROUP_ELI_READ_WHY_NOT: string = "ELI_READ_WHY_NOT";
    public static SAFETY_REASON_CAT_GROUP_GAS_INST_SAT: string = "GAS_INST_SAT";
    public static SAFETY_REASON_CAT_GROUP_LE_RESISTANCE_TAKEN: string = "LE_RESISTANCE_TAKEN";
    public static SAFETY_REASON_CAT_GROUP_LN_RESISTANCE_TAKEN: string = "LN_RESISTANCE_TAKEN";
    public static SAFETY_REASON_CAT_GROUP_NE_RESISTANCE_TAKEN: string = "NE_RESISTANCE_TAKEN";
    public static SAFETY_REASON_CAT_GROUP_CIRCUIT_PROTECT: string = "CIRCUIT_PROTECT";
    public static SAFETY_REASON_CAT_GROUP_MCB_FUSE_RAT_NOT_CHKD_REAS: string = "MCB_FUSE_RAT_NOT_CHKD_REAS";
    public static SAFETY_REASON_CAT_GROUP_APPLN_FUSE_RAT_NOT_CHKD_REAS: string = "APPLN_FUSE_RAT_NOT_CHKD_REAS";
    public static SAFETY_REASON_CAT_GROUP_LEAKAGE_TEST_NOT_DONE_REAS: string = "LEAKAGE_TEST_NOT_DONE_REAS";
    public static SAFETY_REASON_CAT_GROUP_PART_P_REAS: string = "PART_P_REAS";
    public static SAFETY_REASON_CAT_GROUP_RCD_PRESENT: string = "RCD_PRESENT";
    public static SAFETY_REASON_CAT_GROUP_READ_SAFE_TOPS: string = "READ_SAFE_TOPS";

    public static VISIT_ACTIVITY_CODE: keyof ReferenceDataManifest = "visitActivityCode";
    public static VISIT_ACTIVITY_CODE_ID: keyof IVisitActivityCode = "visitActivityCode";
    public static VISIT_ACTIVITY_CODE_DESCRIPTION: keyof IVisitActivityCode = "visitActivityDescription";

    public static VISIT_ACTIVITY_FAULT_ACTION: keyof ReferenceDataManifest = "visitActivityFaultActionCode";

    public static WORKED_ON: keyof ReferenceDataManifest = "workedOn";
    public static WORKED_ON_ID: keyof IWorkedOn = "workedOnCode";
    public static WORKED_ON_DESCRIPTION: keyof IWorkedOn = "workedOnDescription";

    /* Job Codes Group */

    public static ACTION_TYPE: keyof ReferenceDataManifest = "jobType";
    public static ACTION_TYPE_ID: keyof IActionType = "jobType";
    public static ACTION_TYPE_DESCRIPTION: keyof IActionType = "jobTypeDescription";

    public static APPLIANCE_CONTRACT_TYPE: keyof ReferenceDataManifest = "applianceContractType";
    public static APPLIANCE_CONTRACT_TYPE_ID: keyof IApplianceContractType = "contractType";
    public static APPLIANCE_CONTRACT_TYPE_DESCRIPTION: keyof IApplianceContractType = "applianceContractTypeDescription";

    public static AREA_CHARGE_RULE: keyof ReferenceDataManifest = "areaChargeRules";
    public static AREA_CHARGE_RULE_ACTION_TYPE_CODE: keyof IAreaChargeRules = "jobType";
    public static AREA_CHARGE_RULE_OBJECT_TYPE_CODE: keyof IAreaChargeRules = "applianceType";
    public static AREA_CHARGE_RULE_APP_CON_TYPE_CODE: keyof IAreaChargeRules = "contractType";
    public static AREA_CHARGE_RULE_COMPANY_CODE: keyof IAreaChargeRules = "companyCode";

    public static GC_CODE: keyof ReferenceDataManifest = "gasCouncilCode";
    public static GC_CODE_ID: keyof IGcCode = "gcCode";
    public static GC_CODE_OBJECT_TYPE_CODE: keyof IGcCode = "applianceTypeCode";
    public static GC_CODE_DESCRIPTION: keyof IGcCode = "gcCodeDescription";

    public static FIELD_ACTIVITY_TYPE: keyof ReferenceDataManifest = "fieldActivityType";
    public static FIELD_ACTIVITY_TYPE_CODE: keyof IFieldActivityType = "jobType";
    public static FIELD_ACTIVITY_TYPE_OBJECT_TYPE_CODE: keyof IFieldActivityType = "applianceType";

    public static JC_CHARGE_RULES: keyof ReferenceDataManifest = "jcChargeRules";
    public static JC_CHARGE_RULES_ACTION_TYPE_CODE: keyof IJcChargeRules = "jobType";
    public static JC_CHARGE_RULES_OBJECT_TYPE_CODE: keyof IJcChargeRules = "applianceType";

    /* App Config Group */

    public static BUSINESS_RULE: keyof ReferenceDataManifest = "businessRule";
    public static BUSINESS_RULE_VIEW_MODEL: keyof IBusinessRule = "viewModel";

    public static LABEL: keyof ReferenceDataManifest = "label";
    public static LABEL_VIEW_MODEL: keyof ILabel = "viewModel";

    public static VALIDATION: keyof ReferenceDataManifest = "validation";
    public static VALIDATION_VIEW_MODEL: keyof IValidation = "viewModel";

    /* Previously Hardcoded */

    public static ADVICE_RESULT: keyof ReferenceDataManifest = "adviceResult";
    public static ADVICE_RESULT_ID: keyof IAdviceResult = "id";
    public static ADVICE_RESULT_DESCRIPTION: keyof IAdviceResult = "description";

    public static APPLIANCE_CONDITION: keyof ReferenceDataManifest = "applianceCondition";
    public static APPLIANCE_CONDITION_ID: keyof IApplianceCondition = "id";
    public static APPLIANCE_CONDITION_DESCRIPTION: keyof IApplianceCondition = "description";

    public static APPLIANCE_CYLINDER_TYPE: keyof ReferenceDataManifest = "applianceCylinderType";
    public static APPLIANCE_CYLINDER_TYPE_ID: keyof IApplianceCylinderType = "id";
    public static APPLIANCE_CYLINDER_TYPE_DESCRIPTION: keyof IApplianceCylinderType = "description";

    public static APPLIANCE_ELETRICAL_TYPE: keyof ReferenceDataManifest = "applianceElectricalType";
    public static APPLIANCE_ELETRICAL_TYPE_ID: keyof IApplianceElectricalType = "id";

    public static APPLIANCE_SYSTEM_TYPE: keyof ReferenceDataManifest = "applianceSystemType";
    public static APPLIANCE_SYSTEM_TYPE_ID: keyof IApplianceSystemType = "id";
    public static APPLIANCE_SYSTEM_TYPE_DESCRIPTION: keyof IApplianceSystemType  = "description";

    public static CHARGE_DISPUTE: keyof ReferenceDataManifest = "chargeDispute";
    public static CHARGE_DISPUTE_ID: keyof IChargeDispute = "id";
    public static CHARGE_DISPUTE_DESCRIPTION: keyof IChargeDispute = "description";

    public static CHARGE_OPTION: keyof ReferenceDataManifest = "chargeOption";
    public static CHARGE_OPTION_ID: keyof IChargeOption = "id";
    public static CHARGE_OPTION_DESCRIPTION: keyof IChargeOption = "description";

    public static ELECTRICAL_APPLIANCE_TYPE: keyof ReferenceDataManifest = "electricalApplianceType";
    public static ELECTRICAL_APPLIANCE_TYPE_ID: keyof IElectricalApplianceType = "id";
    public static ELECTRICAL_APPLIANCE_TYPE_DESCRIPTION: keyof IElectricalApplianceType = "description";

    public static ELECTRICAL_SYSTEM_TYPE: keyof ReferenceDataManifest = "electricalSystemType";
    public static ELECTRICAL_SYSTEM_TYPE_ID: keyof IElectricalSystemType = "id";
    public static ELECTRICAL_SYSTEM_TYPE_DESCRIPTION: keyof IElectricalSystemType = "description";

    public static JC_APPLIANCE_CODE: keyof ReferenceDataManifest = "jcApplianceCode";
    public static JC_APPLIANCE_CODE_ID: keyof IJcApplianceCode = "code";
    public static JC_APPLIANCE_CODE_FIELD_CODE: keyof IJcApplianceCode = "fieldAppCode";
    public static JC_APPLIANCE_CODE_DESCRIPTION: keyof IJcApplianceCode = "description";

    public static JC_JOB_CODE: keyof ReferenceDataManifest = "jcJobCode";
    public static JC_JOB_CODE_ID: keyof IJcJobCode = "code";
    public static JC_JOB_CODE_DESCRIPTION: keyof IJcJobCode = "description";

    public static JC_SERVICE_LEVEL_CODE: keyof ReferenceDataManifest = "jcServiceLevelCode";
    public static JC_SERVICE_LEVEL_CODE_ID: keyof IJcServiceLevelCode = "code";
    public static JC_SERVICE_LEVEL_CODE_DESCRIPTION: keyof IJcServiceLevelCode = "careDescription";

    public static PART_ORDER_STATUS: keyof ReferenceDataManifest = "partOrderStatus";
    public static PART_ORDER_STATUS_ID: keyof IPartOrderStatus = "id";
    public static PART_ORDER_STATUS_DESCRIPTION: keyof IPartOrderStatus = "description";

    public static PASS_FAIL_NA: keyof ReferenceDataManifest = "passFailNa";
    public static PASS_FAIL_NA_ID: keyof IPassFailNa = "id";
    public static PASS_FAIL_NA_DESCRIPTION: keyof IPassFailNa = "description";

    public static PERFORMANCE_TEST_REASON: keyof ReferenceDataManifest = "performanceTestReason";
    public static PERFORMANCE_TEST_REASON_ID: keyof IPerformanceTestReason = "id";
    public static PERFORMANCE_TEST_REASON_DESCRIPTION: keyof IPerformanceTestReason = "description";

    public static READ_TYPE_MAPPING: keyof ReferenceDataManifest = "readTypeMapping";

    public static SYSTEM_DESIGN_AND_CONDITION: keyof ReferenceDataManifest = "systemDesignAndCondition";
    public static SYSTEM_DESIGN_AND_CONDITION_ID: keyof ISystemDesignAndCondition = "id";
    public static SYSTEM_DESIGN_AND_CONDITION_DESCRIPTION: keyof ISystemDesignAndCondition = "description";

    public static YES_NO_NOTCHECKED: keyof ReferenceDataManifest = "yesNoNotChecked";
    public static YES_NO_NOTCHECKED_ID: keyof IYesNoNotChecked = "id";
    public static YES_NO_NOTCHECKED_DESCRIPTION: keyof IYesNoNotChecked = "description";

    public static YES_NO_NOTCHECKED_NA: keyof ReferenceDataManifest = "yesNoNotCheckedNa";
    public static YES_NO_NOTCHECKED_NA_ID: keyof IYesNoNotCheckedNa = "id";
    public static YES_NO_NOTCHECKED_NA_DESCRIPTION: keyof IYesNoNotCheckedNa = "description";

    /* 3rd Party Data */

    public static CHIRP_CODE: keyof ReferenceDataManifest = "chirpCode";
    public static CHIRP_CODE_ID: keyof IChirpCode = "code";
    public static CHIRP_CODE_DESCRIPTION: keyof IChirpCode = "meaning";

    // ungrouped or to be determined

    public static FIELD_OPRTV_CLAIM_TYPE: keyof ReferenceDataManifest = "fieldOprtvClaimType"; // nehal??
    public static FIELD_OPRTV_CLAIM_TYPE_CODE: keyof IFieldOprtvClaimType = "fieldOprtvClmTcode";
    public static FIELD_OPRTV_CLAIM_TYPE_DESCRIPTION: keyof IFieldOprtvClaimType = "fieldOprtvClmTypeDesc";

    public static REGION: keyof ReferenceDataManifest = "region"; // wmis table?
    public static REGION_ID: keyof IRegion = "id";
    public static REGION_DESCRIPTION: keyof IRegion = "description";

    public static SETTING: keyof ReferenceDataManifest = "setting";
}
