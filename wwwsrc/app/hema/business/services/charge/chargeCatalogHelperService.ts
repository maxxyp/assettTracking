import * as Logging from "aurelia-logging";

import { ICatalogService } from "../interfaces/ICatalogService";
import { CatalogService } from "../catalogService";
import { inject } from "aurelia-dependency-injection";
import { IJcChargeRules } from "../../models/reference/IJcChargeRules";
import { IStorageService } from "../interfaces/IStorageService";
import { StorageService } from "../storageService";
import { IAreaChargeRules } from "../../models/reference/IAreaChargeRules";
import { BusinessException } from "../../models/businessException";
import { IDiscount } from "../../models/reference/IDiscount";
import { IVat } from "../../models/reference/IVat";
import * as moment from "moment";
import { IChargeCatalogHelperService } from "../interfaces/charge/IChargeCatalogHelperService";
import {IChargeType} from "../../models/reference/IChargeType";

@inject(CatalogService, StorageService)
export class ChargeCatalogHelperService implements IChargeCatalogHelperService {

    private _catalogService: ICatalogService;
    private _storageService: IStorageService;
    private _logger: Logging.Logger;

    constructor(catalogService: ICatalogService,
                storageService: IStorageService) {

        this._catalogService = catalogService;
        this._storageService = storageService;
        this._logger = Logging.getLogger("ChargeCatalogHelperService");
    }

    public getValidDiscounts(discounts: IDiscount[]): IDiscount[] {

        const currentDate = moment();

        if (!discounts) {
            return [];
        }
        const discountsNoEndDate = discounts.filter(d => {
            const {discountEndDate = ""} = d;
            return discountEndDate === "";
        });

        const discountWithinDateRange = discounts.filter(d => (currentDate.isBetween(d.discountStartDate, d.discountEndDate)));

        return [...discountWithinDateRange, ...discountsNoEndDate];
    }

    public getVatRate(vatCodeToCheck: string,
                      taskStartTime: string,
                      vatDateFormat: string,
                      vats: IVat[]): number {

        // get the vat, see if we can find one where the task date lies within the date range, if not find the current
        // vat rate, i.e. the vat rate where the end date is empty

        let vat = 0;

        if (!taskStartTime) {
            return vat;
        }
        const taskDate = moment(taskStartTime, vatDateFormat);

        let foundVat = vats.find(vr => {
            // being extra safe, in case api decides to omit the field all together
            const {vatEndDate = "", vatCode} = vr;
            return vatCode === vatCodeToCheck && vatEndDate === "";
        });

        if (!foundVat) {
            foundVat = vats.find(vr => (moment(taskDate).isBetween(vr.vatStartDate, vr.vatEndDate)) && vr.vatCode === vatCodeToCheck);
        }

        if (!foundVat) {
            return vat;
        }

        return foundVat.vatRate;
    }

    public async getJobCodeChargeRule(jobType: string,
                                      applianceType: string,
                                      chargeType: string,
                                      chargeRulesDateFormat: string,
                                      chargeMethodCodeLength: number): Promise<IJcChargeRules> {

        const taskDate = moment(new Date());

        const items = await this._catalogService.getJCChargeRules(jobType, applianceType);

        let filteredItems: IJcChargeRules[] = items.filter(i => i.chargeType + i.contractType === chargeType);

        // 31-dec-68 formats to the year 1968 year, 31-dec-69 formats to 2069. So that's why we have this if, else

        const filteredItemsDateFormatted = filteredItems.filter(i => {

            const effectiveDate = moment(i.effectiveDate, chargeRulesDateFormat);
            const expirationDate = moment(i.expirationDate, chargeRulesDateFormat);

            return taskDate.isBetween(effectiveDate, expirationDate);
        });

        // check area charge rules, there can be multiple rules per location, so we need to see if we can get a charge
        // rule seq number. Note, we could have queried this first, but its a big table and a area charge code lookup
        // will not be required in most cases. Check only if necessary.
        // if more than one charge rule, assume multiple location-based charging and get rule sequence

        if (!filteredItemsDateFormatted || filteredItemsDateFormatted.length === 0) {
            return null;
        }

        // need to check that location is ok as well, see DF_1881
        try {
            const areaCode = await this.getAreaChargeRules(chargeType, jobType, applianceType, taskDate, chargeMethodCodeLength, chargeRulesDateFormat);

            if (!areaCode) {
                const err = new BusinessException(this, "chargeService.getJobCodeChargeRule", "could not locate area charge rule", null,
                    `ChargeType: ${chargeType}, JobType: ${jobType}, ApplianceType: ${applianceType}`);

                this._logger.error(err.toString());

                return Promise.reject(err);
            }
            return filteredItemsDateFormatted.find(i => i.chargeRuleSequence === areaCode.chargeRuleSequence);
        } catch (exception) {
            return Promise.reject(exception);
        }
    }

    public async getChargeTypesByApplianceJob(applianceType: string, jobType: string, chargeRulesDateFormat: string,
                                              chargeMethodCodeLength: number): Promise<IChargeType[]> {

        // get charge rules first to determine valid charge types

        const chargeRules = await this._catalogService.getJCChargeRules(jobType, applianceType);

        if (!chargeRules || chargeRules.length === 0) {
            const ex = new BusinessException("context", "taskAppliance",
                `no charge rules found for appliance ${applianceType} and job type ${jobType}`, null, null);

            throw(ex);
        }

        const results = chargeRules.map(cr => `${cr.chargeType}${cr.contractType}`);

        const chargeTypes = await this._catalogService.getChargeTypes();

        // remove dups because could be area-based charging
        // would have preferred to use new Set(...results), but babel not configured to support this yet

        const deduped = results.filter((el, i, arr) => arr.indexOf(el) === i);

        return deduped.map((r: string) => chargeTypes.find(ct => ct.chargeType === r));

    }

    private async getAreaChargeRules(chargeType: string,
                                     jobType: string,
                                     applianceType: string,
                                     taskDate: moment.Moment,
                                     chargeMethodCodeLength: number,
                                     chargeRulesDateFormat: string): Promise<IAreaChargeRules> {

        const region = await this._storageService.getUserRegion();

        if (!region) {
            return Promise.reject(new BusinessException(this, "chargeService", "No region found. Check it has been set in preferences", null, null));
        }

        // get the charge type action code, task includes charge method, so remove
        const ctLen = chargeType.length;
        const appConTypeCode = chargeType.substr(chargeMethodCodeLength, ctLen);

        const areaChargeRules = await this._catalogService.getAreaChargeRules(jobType, region);

        let filteredItems: IAreaChargeRules[] = areaChargeRules.filter(
            acr => {

                return acr.applianceType === applianceType
                    && acr.contractType === appConTypeCode
                    && acr.jobType === jobType
                    && acr.companyCode === region;
            });

        // 31-dec-68 formats to the year 1968 year, 31-dec-69 formats to 2069. So that's why we have this if, else

        return filteredItems.find(i => {

            const expirationDate = moment(i.expirationDate, chargeRulesDateFormat);
            const effectiveDate = moment(i.effectiveDate, chargeRulesDateFormat);

            return taskDate.isBetween(effectiveDate, expirationDate);
        });
    }
}
