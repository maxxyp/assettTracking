import { IVat } from "../../../models/reference/IVat";
import { IJcChargeRules } from "../../../models/reference/IJcChargeRules";
import { IDiscount } from "../../../models/reference/IDiscount";
import { IChargeType } from "../../../models/reference/IChargeType";

export interface IChargeCatalogHelperService {

    getVatRate(vatCodeToCheck: string,
               taskStartTime: string,
               vatDateFormat: string,
               vats: IVat[]): number;

    getJobCodeChargeRule(jobType: string,
                         applianceType: string,
                         chargeType: string,
                         chargeRulesDateFormat: string,
                         chargeMethodCodeLength: number): Promise<IJcChargeRules>;

    getValidDiscounts(discounts: IDiscount[]): IDiscount[];

    getChargeTypesByApplianceJob(applianceType: string, jobType: string, chargeRulesDateFormat: string,
                                 chargeMethodCodeLength: number): Promise<IChargeType[]>;
}
