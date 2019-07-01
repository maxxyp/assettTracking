import { ITableIndex } from "./ITableIndex";
import { IActionType } from "./IActionType";
import { IActivityCmpnentVstStatus } from "./IActivityCmpnentVstStatus";
import { IAdviceResult } from "./IAdviceResult";
import { IApplianceCondition } from "./IApplianceCondition";
import { IApplianceContractType } from "./IApplianceContractType";
import { IApplianceCylinderType } from "./IApplianceCylinderType";
import { IApplianceElectricalType } from "./IApplianceElectricalType";
import { IApplianceFlueTypes } from "./IApplianceFlueTypes";
import { IApplianceSystemType } from "./IApplianceSystemType";
import { IAppointmentBand } from "./IAppointmentBand";
import { IAreaChargeRules } from "./IAreaChargeRules";
import { IBusinessRule } from "./IBusinessRule";
import { IChargeDispute } from "./IChargeDispute";
import { IChargeOption } from "./IChargeOption";
import { IChargeType } from "./IChargeType";
import { IChirpCode } from "./IChirpCode";
import { IComplaintReason } from "./IComplaintReason";
import { IConsumableType } from "./IConsumableType";
import { IDiscount } from "./IDiscount";
import { IEeaCategory } from "./IEeaCategory";
import { IElectricalApplianceType } from "./IElectricalApplianceType";
import { IElectricalSystemType } from "./IElectricalSystemType";
import { IEnergyControls } from "./IEnergyControls";
import { IFaultActionCode } from "./IFaultActionCode";
import { IFieldActivityType } from "./IFieldActivityType";
import { IFieldOperativeStatus } from "./IFieldOperativeStatus";
import { IFieldOprtvClaimType } from "./IFieldOprtvClaimType";
import { IGcCode } from "./IGcCode";
import { IGoodsItemStatus } from "./IGoodsItemStatus";
import { IGoodsType } from "./IGoodsType";
import { IIaciCode } from "./IIaciCode";
import { IJcApplianceCode } from "./IJcApplianceCode";
import { IJcChargeRules } from "./IJcChargeRules";
import { IJcJobCode } from "./IJcJobCode";
import { IJcServiceLevelCode } from "./IJcServiceLevelCode";
import { ILabel } from "./ILabel";
import { ILabourChargeRule } from "./ILabourChargeRule";
import { IObjectType } from "./IObjectType";
import { IPartOrderStatus } from "./IPartOrderStatus";
import { IPartsNotUsedReason } from "./IPartsNotUsedReason";
import { IPartType } from "./IPartType";
import { IPassFailNa } from "./IPassFailNa";
import { IPerformanceTestReason } from "./IPerformanceTestReason";
import { IPrimeChargeInterval } from "./IPrimeChargeInterval";
import { IProductGroup } from "./IProductGroup";
import { IPtFac } from "./IPtFac";
import { IReadingType } from "./IReadingType";
import { IReadTypeMapping } from "./IReadTypeMapping";
import { IRegion } from "./IRegion";
import { ISafetyAction } from "./ISafetyAction";
import { ISafetyNoticeStatus } from "./ISafetyNoticeStatus";
import { ISafetyNoticeType } from "./ISafetyNoticeType";
import { ISftyReadingCat } from "./ISftyReadingCat";
import { ISftyReasonCat } from "./ISftyReasonCat";
import { ISubsqntChargeInterval } from "./ISubsqntChargeInterval";
import { ISystemDesignAndCondition } from "./ISystemDesignAndCondition";
import { IVat } from "./IVat";
import { IVisitActivityFaultActionCode } from "./IVisitActivityFaultActionCode";
import { IWorkedOn } from "./IWorkedOn";
import { IVisitActivityCode } from "./IVisitActivityCode";
import { IValidation } from "./IValidation";
import { IYesNoNotChecked } from "./IYesNoNotChecked";
import { CatalogConstants } from "../../services/constants/catalogConstants";
import { ISetting } from "./ISetting";

type DocumentName = "lookups" | "goods" | "business" | "jobcodes" | "config" | "local";
export class ReferenceDataManifest {

    public jobType: ITableIndex;
    public activityComponentVisitStatus: ITableIndex;
    public adviceResult: ITableIndex;
    public applianceCondition: ITableIndex;
    public applianceContractType: ITableIndex;
    public applianceCylinderType: ITableIndex;
    public applianceElectricalType: ITableIndex;
    public applianceFlueTypes: ITableIndex;
    public applianceSystemType: ITableIndex;
    public appointmentBand: ITableIndex;
    public areaChargeRules: ITableIndex;
    public businessRule: ITableIndex;
    public chargeDispute: ITableIndex;
    public chargeOption: ITableIndex;
    public chargeType: ITableIndex;
    public chirpCode: ITableIndex;
    public complaintReason: ITableIndex;
    public consumableType: ITableIndex;
    public discount: ITableIndex;
    public eeaCategory: ITableIndex;
    public electricalApplianceType: ITableIndex;
    public electricalSystemType: ITableIndex;
    public energyControls: ITableIndex;
    public faultActionCode: ITableIndex;
    public fieldActivityType: ITableIndex;
    public fieldOperativeStatus: ITableIndex;
    public fieldOprtvClaimType: ITableIndex;
    public gasCouncilCode: ITableIndex;
    public goodsItemStatus: ITableIndex;
    public goodsType: ITableIndex;
    public iaciCode: ITableIndex;
    public jcApplianceCode: ITableIndex;
    public jcChargeRules: ITableIndex;
    public jcJobCode: ITableIndex;
    public jcServiceLevelCode: ITableIndex;
    public label: ITableIndex;
    public labourChargeRule: ITableIndex;
    public applianceType: ITableIndex;
    public partOrderStatus: ITableIndex;
    public partsNotUsedReason: ITableIndex;
    public partType: ITableIndex;
    public passFailNa: ITableIndex;
    public performanceTestReason: ITableIndex;
    public primeChargeInterval: ITableIndex;
    public productGroup: ITableIndex;
    public ptFac: ITableIndex;
    public readingType: ITableIndex;
    public readTypeMapping: ITableIndex;
    public region: ITableIndex;
    public safetyAction: ITableIndex;
    public safetyNoticeStatus: ITableIndex;
    public safetyNoticeType: ITableIndex;
    public safetyReadingCategory: ITableIndex;
    public safetyReasonCat: ITableIndex;
    public subsequentChargeInterval: ITableIndex;
    public systemDesignAndCondition: ITableIndex;
    public visitActivityFaultActionCode: ITableIndex;
    public workedOn: ITableIndex;
    public vat: ITableIndex;
    public visitActivityCode: ITableIndex;
    public validation: ITableIndex;
    public yesNoNotChecked: ITableIndex;
    public yesNoNotCheckedNa: ITableIndex;
        public setting: ITableIndex;

    constructor() {

        // lookups
        this.activityComponentVisitStatus = this.defineCatalog<IActivityCmpnentVstStatus>("activityComponentVisitStatus", "lookups");
        this.applianceFlueTypes = this.defineCatalog<IApplianceFlueTypes>("applianceFlueTypes", "lookups", ["flueType"]);
        this.appointmentBand = this.defineCatalog<IAppointmentBand>("appointmentBand", "lookups");
        this.complaintReason = this.defineCatalog<IComplaintReason>("complaintReason", "lookups", ["complaintReasonCode"]);
        this.eeaCategory = this.defineCatalog<IEeaCategory>("eeaCategory", "lookups");
        this.energyControls = this.defineCatalog<IEnergyControls>("energyControls", "lookups");
        this.faultActionCode = this.defineCatalog<IFaultActionCode>("faultActionCode", "lookups");
        this.fieldOperativeStatus = this.defineCatalog<IFieldOperativeStatus>("fieldOperativeStatus", "lookups");
        this.goodsItemStatus = this.defineCatalog<IGoodsItemStatus>("goodsItemStatus", "lookups");
        this.iaciCode = this.defineCatalog<IIaciCode>("iaciCode", "lookups");
        this.partsNotUsedReason = this.defineCatalog<IPartsNotUsedReason>("partsNotUsedReason", "lookups");
        this.partType = this.defineCatalog<IPartType>("partType", "lookups");
        this.ptFac = this.defineCatalog<IPtFac>("ptFac", "lookups");
        this.productGroup = this.defineCatalog<IProductGroup>("productGroup", "lookups");
        this.safetyAction = this.defineCatalog<ISafetyAction>("safetyAction", "lookups", [CatalogConstants.SAFETY_ACTION_ID]);
        this.safetyNoticeStatus = this.defineCatalog<ISafetyNoticeStatus>("safetyNoticeStatus", "lookups", [CatalogConstants.SAFETY_NOTICE_STATUS_ID]);
        this.safetyNoticeType = this.defineCatalog<ISafetyNoticeType>("safetyNoticeType", "lookups", [CatalogConstants.SAFETY_NOTICE_TYPE_ID]);
        this.safetyReadingCategory = this.defineCatalog<ISftyReadingCat>("safetyReadingCategory", "lookups", [CatalogConstants.SAFETY_READING_CAT_GROUP, CatalogConstants.SAFETY_READING_CAT_ID]);
        this.safetyReasonCat = this.defineCatalog<ISftyReasonCat>("safetyReasonCat", "lookups", [CatalogConstants.SAFETY_REASON_CAT_GROUP, CatalogConstants.SAFETY_REASON_CAT_ID]);
        this.visitActivityFaultActionCode = this.defineCatalog<IVisitActivityFaultActionCode>("visitActivityFaultActionCode", "lookups");
        this.visitActivityCode = this.defineCatalog<IVisitActivityCode>("visitActivityCode", "lookups");
        this.workedOn = this.defineCatalog<IWorkedOn>("workedOn", "lookups");

        // goods
        this.consumableType = this.defineCatalog<IConsumableType>("consumableType", "goods", [CatalogConstants.CONSUMABLE_TYPE_ID]);
        this.goodsType = this.defineCatalog<IGoodsType>("goodsType", "goods", [CatalogConstants.GOODS_TYPE_ID]);

        // business
        this.applianceType = this.defineCatalog<IObjectType>("applianceType", "business", [CatalogConstants.OBJECT_TYPE_ID]);
        this.chargeType = this.defineCatalog<IChargeType>("chargeType", "business", [CatalogConstants.CHARGE_TYPE_ID]);
        this.discount = this.defineCatalog<IDiscount>("discount", "business");
        this.labourChargeRule = this.defineCatalog<ILabourChargeRule>("labourChargeRule", "business", [CatalogConstants.LABOUR_CHARGE_RULE_ID]);
        this.primeChargeInterval = this.defineCatalog<IPrimeChargeInterval>("primeChargeInterval", "business");
        this.readingType = this.defineCatalog<IReadingType>("readingType", "business");
        this.subsequentChargeInterval = this.defineCatalog<ISubsqntChargeInterval>("subsequentChargeInterval", "business");
        this.vat = this.defineCatalog<IVat>("vat", "business");

        // job codes
        this.jobType = this.defineCatalog<IActionType>("jobType", "jobcodes", [CatalogConstants.ACTION_TYPE_ID]);
        this.applianceContractType = this.defineCatalog<IApplianceContractType>("applianceContractType", "jobcodes", [CatalogConstants.APPLIANCE_CONTRACT_TYPE_ID]);
        this.areaChargeRules = 
            this.defineCatalog<IAreaChargeRules>("areaChargeRules", "jobcodes", [CatalogConstants.AREA_CHARGE_RULE_ACTION_TYPE_CODE, CatalogConstants.AREA_CHARGE_RULE_COMPANY_CODE]);
        this.gasCouncilCode = this.defineCatalog<IGcCode>("gasCouncilCode", "jobcodes", [CatalogConstants.GC_CODE_OBJECT_TYPE_CODE, CatalogConstants.GC_CODE_ID]);
        this.fieldActivityType = this.defineCatalog<IFieldActivityType>("fieldActivityType", "jobcodes", [CatalogConstants.FIELD_ACTIVITY_TYPE_OBJECT_TYPE_CODE]);
        this.jcChargeRules = this.defineCatalog<IJcChargeRules>("jcChargeRules", "jobcodes", [CatalogConstants.JC_CHARGE_RULES_ACTION_TYPE_CODE, CatalogConstants.JC_CHARGE_RULES_OBJECT_TYPE_CODE]);

        // app config
        this.businessRule = this.defineCatalog<IBusinessRule>("businessRule", "local", [CatalogConstants.BUSINESS_RULE_VIEW_MODEL], true);
        this.label = this.defineCatalog<ILabel>("label", "local", [CatalogConstants.LABEL_VIEW_MODEL], true);
        this.validation = this.defineCatalog<IValidation>("validation", "local", [CatalogConstants.VALIDATION_VIEW_MODEL], true);

        // previously harcoded

        this.adviceResult = this.defineCatalog<IAdviceResult>("adviceResult", "local");
        this.applianceCondition = this.defineCatalog<IApplianceCondition>("applianceCondition", "local");
        this.applianceCylinderType = this.defineCatalog<IApplianceCylinderType>("applianceCylinderType", "local");
        this.applianceElectricalType = this.defineCatalog<IApplianceElectricalType>("applianceElectricalType", "local", [CatalogConstants.APPLIANCE_ELETRICAL_TYPE_ID]);
        this.applianceSystemType = this.defineCatalog<IApplianceSystemType>("applianceSystemType", "local");
        this.chargeDispute = this.defineCatalog<IChargeDispute>("chargeDispute", "local");
        this.chargeOption = this.defineCatalog<IChargeOption>("chargeOption", "local");
        this.electricalApplianceType = this.defineCatalog<IElectricalApplianceType>("electricalApplianceType", "local");
        this.electricalSystemType = this.defineCatalog<IElectricalSystemType>("electricalSystemType", "local", [CatalogConstants.ELECTRICAL_SYSTEM_TYPE_ID]);
        this.jcApplianceCode = this.defineCatalog<IJcApplianceCode>("jcApplianceCode", "local", [CatalogConstants.JC_APPLIANCE_CODE_ID]);
        this.jcJobCode = this.defineCatalog<IJcJobCode>("jcJobCode", "local", [CatalogConstants.JC_JOB_CODE_ID]);
        this.jcServiceLevelCode = this.defineCatalog<IJcServiceLevelCode>("jcServiceLevelCode", "local", [CatalogConstants.JC_SERVICE_LEVEL_CODE_ID]);
        this.partOrderStatus = this.defineCatalog<IPartOrderStatus>("partOrderStatus", "local");
        this.passFailNa = this.defineCatalog<IPassFailNa>("passFailNa", "local");
        this.performanceTestReason = this.defineCatalog<IPerformanceTestReason>("performanceTestReason", "local");
        this.readTypeMapping = this.defineCatalog<IReadTypeMapping>("readTypeMapping", "local");
        this.systemDesignAndCondition = this.defineCatalog<ISystemDesignAndCondition>("systemDesignAndCondition", "local");
        this.yesNoNotChecked = this.defineCatalog<IYesNoNotChecked>("yesNoNotChecked", "local");
        this.yesNoNotCheckedNa = this.defineCatalog<IYesNoNotChecked>("yesNoNotCheckedNa", "local");

        // 3rd party
        this.chirpCode = this.defineCatalog<IChirpCode>("chirpCode", "local");

        // ungrouped or to be determined
        this.fieldOprtvClaimType = this.defineCatalog<IFieldOprtvClaimType>("fieldOprtvClaimType", "local");
        this.region = this.defineCatalog<IRegion>("region", "local", [CatalogConstants.REGION_ID]);

        this.setting = this.defineCatalog<ISetting>("setting", "config", undefined, false, undefined, true);
    }

    public tablesByName(): { [index: string]: ITableIndex } {
        let tableByName: { [index: string]: ITableIndex } = {};
        Object.keys(this)
            .filter((key) => key.indexOf("_") !== 0 && !this.isFunction((<any>this)[key]))
            .forEach(key => {
                tableByName[key] = (<any>this)[key];
            });
        return tableByName;
    }

    public all(): ITableIndex[] {
        return Object.keys(this)
            .filter((key) => key.indexOf("_") !== 0 && !this.isFunction((<any>this)[key]))
            .map(key => {
                return (<any>this)[key];
            });
    }

    private defineCatalog<T>(catalogName: keyof this, 
        document: DocumentName, 
        indexes?: [keyof T] | string[], 
        alwaysUpdate?: boolean, 
        lastModifiedDate?: string,
        allowEmpty?: boolean): ITableIndex {
        let type = catalogName + ""; // keep compiler happy, ITableIndex.type is string
                
        return {
            type,
            indexes: indexes ? indexes.join(",") : undefined,
            eTag: alwaysUpdate ? "-1" : "0",
            lastModifiedDate,
            sourceDocument: document,
            canItBeEmpty: allowEmpty          
        };
    }

    private isFunction(functionToCheck: any): boolean {
        let getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === "[object Function]";
    }
}
