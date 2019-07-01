import { IPrimeChargeInterval } from "../../../models/reference/IPrimeChargeInterval";
import { ISubsqntChargeInterval } from "../../../models/reference/ISubsqntChargeInterval";

export interface IChargeLabourCatalogDependencies {
    fixedLabourChargeCurrencyUnit: number;
    tieredLabourChargeCurrencyUnit: number;
    primeChargeIntervals: IPrimeChargeInterval[];
    subChargeIntervals: ISubsqntChargeInterval[];
}
