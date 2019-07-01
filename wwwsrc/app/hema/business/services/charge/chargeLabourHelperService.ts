import * as Logging from "aurelia-logging";
import { ChargeableTask } from "../../models/charge/chargeableTask";
import { IJcChargeRules } from "../../models/reference/IJcChargeRules";
import { IPricingInterval } from "../../models/charge/IPricingInterval";
import { PrimeSubCharge } from "../../models/charge/primeSubCharge";
import { PrimePricingInterval } from "../../models/charge/primePricingInterval";
import { SubPricingInterval } from "../../models/charge/subPricingInterval";
import { ILabourChargeRule } from "../../models/reference/ILabourChargeRule";
import { IPrimeChargeInterval } from "../../models/reference/IPrimeChargeInterval";
import { ISubsqntChargeInterval } from "../../models/reference/ISubsqntChargeInterval";
import { ICatalogService } from "../interfaces/ICatalogService";
import { CatalogService } from "../catalogService";
import { inject } from "aurelia-dependency-injection";
import * as bignumber from "bignumber";
import { IChargeLabourCatalogDependencies } from "../interfaces/charge/IChargeLabourCatalogDependencies";
import { NumberHelper } from "../../../../hema/core/numberHelper";

@inject(CatalogService)
export class ChargeLabourHelperService {

    private _logger: Logging.Logger;
    private _catalogService: ICatalogService;

    constructor(catalogService: ICatalogService) {
        this._catalogService = catalogService;
        this._logger = Logging.getLogger("ChargeLabourHelperService");
    }

    /**
     *
     * @param {ChargeableTask} chargeableTask
     * @param {IJcChargeRules} jcChargeRule
     * @param {IChargeLabourCatalogDependencies} catalogDependencies
     * @returns {Promise<ChargeableTask>}
     */
    public async calculateLabourCharge(chargeableTask: ChargeableTask, jcChargeRule: IJcChargeRules
        , catalogDependencies: IChargeLabourCatalogDependencies): Promise<ChargeableTask> {

        const {fixedLabourChargeCurrencyUnit, tieredLabourChargeCurrencyUnit, primeChargeIntervals, subChargeIntervals}
            = catalogDependencies;

        const labourChargeRuleCode = jcChargeRule.labourChargeRuleCode;

        if (!labourChargeRuleCode) {

            // this is standard one off charge to apply
            // work out both prime and sub charge, we'll find out which one to use later on when we have all the tasks,
            // the most expensive becomes the prime task

            let cp = new PrimeSubCharge(0, 0);

            const primeCharge = jcChargeRule.standardLabourChargePrime;
            const subsequentCharge = jcChargeRule.standardLabourChargeSubs;

            let primeChargeVal = new bignumber.BigNumber(0);
            let subsequentChargeVal = new bignumber.BigNumber(0);

            if (!NumberHelper.isNullOrUndefined(primeCharge)) { // prime charge of 0 is valid
                const chargeBig = new bignumber.BigNumber(primeCharge);
                primeChargeVal = new bignumber.BigNumber(fixedLabourChargeCurrencyUnit).times(chargeBig);
                cp.primeCharge = primeChargeVal;
            } else {
                cp.noPrimeChargesFound = true;
            }

            if (!NumberHelper.isNullOrUndefined(subsequentCharge)) { // sub charge of 0 is valid
                const chargeBig = new bignumber.BigNumber(subsequentCharge);
                subsequentChargeVal = new bignumber.BigNumber(fixedLabourChargeCurrencyUnit).times(chargeBig);
                cp.subsequentCharge = subsequentChargeVal;
            } else {
                cp.noSubsequentChargesFound = true;
            }

            chargeableTask.updateLabourItem("", cp, true);

            this._logger.debug("Standard fixed price charge used", [cp]);

            return chargeableTask;
        }

        // tiered charging model, so get labour code rule and calculate charges
        const rule = await this._catalogService.getLabourChargeRule(labourChargeRuleCode);
        this._logger.debug("Labour Charge Rule found", [rule]);

        if (!rule) {
            const message = `labour charge rule ${labourChargeRuleCode} not found in catalogData`;
            this._logger.error(message, labourChargeRuleCode);
            chargeableTask.setChargeableTaskAsError(message);
            return chargeableTask;
        }

        const chargeableTime = chargeableTask.task.chargeableTime + chargeableTask.getTotalPreviousChargeableTimeForTask;

        this._logger.debug("Chargeable time is", [chargeableTime]);

        const chargePair =
            this.calculateChargeUsingLabourRule(rule, chargeableTime, primeChargeIntervals, subChargeIntervals);

        chargePair.primeCharge = new bignumber.BigNumber(chargePair.primeCharge).times(tieredLabourChargeCurrencyUnit);
        chargePair.subsequentCharge =
            new bignumber.BigNumber(chargePair.subsequentCharge).times(tieredLabourChargeCurrencyUnit);

        this._logger.debug("Tier charge calculated", [chargePair]);

        chargeableTask.updateLabourItem("", chargePair, false);

        return chargeableTask;

    }

    /**
     *
     * @param {number} minimumCharge
     * @param {number} minimumPeriod
     * @param {number} totalChargeableTime
     * @param {IPricingInterval[]} intervals
     * @returns {number}
     */
    private calculateTierCharge(minimumCharge: number, minimumPeriod: number, totalChargeableTime: number,
                                intervals: IPricingInterval[]): number {

        this._logger.debug("Calculate tier charge", []);

        let totalTime = totalChargeableTime - minimumPeriod;
        let runningCharge = minimumCharge;

        if (intervals && intervals.length > 0) {
            intervals.forEach(interval => {

                while (totalTime > 0) {
                    if (totalTime > interval.chargePeriod) {
                        runningCharge += (interval.chargePeriod / interval.chargeInterval) * interval.chargeIntervalPrice;
                        totalTime -= interval.chargePeriod;
                    } else {
                        while (totalTime > 0) {
                            runningCharge += interval.chargeIntervalPrice;
                            totalTime -= interval.chargeInterval;
                        }
                    }
                    break;
                }
            });
        }

        return runningCharge;
    }

    /**
     *
     * @param {ILabourChargeRule} labourChargeRule
     * @param {number} totalChargeDuration
     * @param {IPrimeChargeInterval[]} primeChargeIntervals
     * @param {ISubsqntChargeInterval[]} subChargeIntervals
     * @returns {PrimeSubCharge}
     */
    private calculateChargeUsingLabourRule(labourChargeRule: ILabourChargeRule,
                                           totalChargeDuration: number, primeChargeIntervals: IPrimeChargeInterval[],
                                           subChargeIntervals: ISubsqntChargeInterval[]): PrimeSubCharge {

        const primeMinCharge = labourChargeRule.minimumChargeIfPrime;
        const primeMinPeriod = labourChargeRule.minimumPdIfPrime;
        const subMinCharge = labourChargeRule.minimumChargeIfSbsqt;
        const subMinPeriod = labourChargeRule.minimumPdIfSbsqt;

        const primeIntervals = this.mapCatalogLabourChargeRuleToPricingInterval(
            labourChargeRule.labourChargeRuleCode, true, primeChargeIntervals, subChargeIntervals);

        let primeCharge = 0;
        let noPrimeChargesFound = false;

        if (primeIntervals && primeIntervals.length > 0) {
            this._logger.debug("Prime charge intervals found", primeIntervals);
            primeCharge = this.calculateTierCharge(primeMinCharge, primeMinPeriod, totalChargeDuration, primeIntervals);
        } else {
            noPrimeChargesFound = true;
        }

        let chargePair = new PrimeSubCharge(primeCharge, 0);
        chargePair.noPrimeChargesFound = noPrimeChargesFound;

        const subIntervals = this.mapCatalogLabourChargeRuleToPricingInterval(labourChargeRule.labourChargeRuleCode,
            false, primeChargeIntervals, subChargeIntervals);

        if (subIntervals && subIntervals.length > 0) {
            this._logger.debug("Subsequent charge intervals found", subIntervals);
            const subCharge = this.calculateTierCharge(subMinCharge, subMinPeriod, totalChargeDuration, subIntervals);
            chargePair.subsequentCharge = new bignumber.BigNumber(subCharge);
        } else {
            chargePair.noSubsequentChargesFound = true;
        }

        return chargePair;
    }

    /**
     *
     * @param {string} labourChargeRuleCode
     * @param {boolean} isPrime
     * @param {IPrimeChargeInterval[]} primeChargeIntervals
     * @param {ISubsqntChargeInterval[]} subChargeIntervals
     * @returns {IPricingInterval[]}
     */
    private mapCatalogLabourChargeRuleToPricingInterval(labourChargeRuleCode: string, isPrime: boolean,
                                                        primeChargeIntervals: IPrimeChargeInterval[],
                                                        subChargeIntervals: ISubsqntChargeInterval[]): IPricingInterval[] {
        if (isPrime) {
            return primeChargeIntervals.filter(item => item.labourChargeRuleCode === labourChargeRuleCode).map(item =>
                new PrimePricingInterval(item));
        }

        return subChargeIntervals.filter(item => item.labourChargeRuleCode === labourChargeRuleCode).map(item =>
            new SubPricingInterval(item));
    }
}
