import * as Logging from "aurelia-logging";
import { ChargeServiceConstants } from "../constants/chargeServiceConstants";
import { IChargeService } from "../interfaces/charge/IChargeService";
import { ChargeableTask } from "../../models/charge/chargeableTask";
import { IJobService } from "../interfaces/IJobService";
import { ICatalogService } from "../interfaces/ICatalogService";
import { Task } from "../../models/task";
import { CatalogService } from "../catalogService";
import { JobService } from "../jobService";
import { inject } from "aurelia-dependency-injection";
import * as moment from "moment";
import { Charge } from "../../models/charge/charge";
import * as bignumber from "bignumber";
import { BusinessRuleService } from "../businessRuleService";
import { IBusinessRuleService } from "../interfaces/IBusinessRuleService";
import { Job } from "../../models/job";
import { EventAggregator } from "aurelia-event-aggregator";
import { DataState } from "../../models/dataState";
import { BusinessException } from "../../models/businessException";
import { IDiscount } from "../../models/reference/IDiscount";
import { IActivityCmpnentVstStatus } from "../../models/reference/IActivityCmpnentVstStatus";
import { JobServiceConstants } from "../constants/jobServiceConstants";
import { Router } from "aurelia-router";
import { IVat } from "../../models/reference/IVat";
import { ChargeCatalogHelperService } from "./chargeCatalogHelperService";
import { IChargeCatalogHelperService } from "../interfaces/charge/IChargeCatalogHelperService";
import { IJcChargeRules } from "../../models/reference/IJcChargeRules";
import { ChargePartsHelperService } from "./chargePartsHelperService";
import { IChargePartsHelperService } from "../interfaces/charge/IChargePartsHelperService";
import { ChargeLabourHelperService } from "./chargeLabourHelperService";
import { IChargeLabourHelperService } from "../interfaces/charge/IChargeLabourHelperService";
import { IChargePartsCatalogDependencies } from "../interfaces/charge/IChargePartsCatalogDependencies";
import { IChargeLabourCatalogDependencies } from "../interfaces/charge/IChargeLabourCatalogDependencies";

@inject(JobService, CatalogService, BusinessRuleService, EventAggregator,
    ChargeCatalogHelperService, ChargePartsHelperService, ChargeLabourHelperService)
export class ChargeService implements IChargeService {

    private _jobService: IJobService;
    private _catalogService: ICatalogService;

    private _businessRuleService: IBusinessRuleService;
    private _chargeCatalogHelper: IChargeCatalogHelperService;
    private _chargePartsHelperService: IChargePartsHelperService;
    private _chargeLabourHelperService: IChargeLabourHelperService;
    private _partsChargeCatalogDependencies: IChargePartsCatalogDependencies;
    private _chargeLabourCatalogDependencies: IChargeLabourCatalogDependencies;

    // business rules
    private _dateFormatVat: string;
    private _chargeRulesDateFormat: string;

    private _discountPercentageCode: string;
    private _discountFixedCode: string;
    private _noDiscountCode: string;
    private _fixedPriceQuotationCurrencyUnit: number;

    private _eventAggregator: EventAggregator;
    private _chargesUpdated: boolean;
    private _chargeStatusCatCodes: string[];
    private _excludeChargeStatusCatCode: string;
    private _activityComponentVisitStatuses: IActivityCmpnentVstStatus[];
    private _chargeMethodCodeLength: number;
    private _logger: Logging.Logger;
    private _vats: IVat[];
    private _discounts: IDiscount[];
    private _incompleteStatus: string[];

    constructor(jobService: IJobService, catalogService: ICatalogService,
                businessRuleService: IBusinessRuleService, eventAggregator: EventAggregator
        , chargeCatalogHelper: IChargeCatalogHelperService
        , chargePartsHelperService: IChargePartsHelperService, chargeLabourHelperService: IChargeLabourHelperService) {

        this._jobService = jobService;
        this._catalogService = catalogService;
        this._businessRuleService = businessRuleService;
        this._eventAggregator = eventAggregator;
        this._chargesUpdated = true;
        this._activityComponentVisitStatuses = [];
        this._vats = [];
        this._discounts = [];
        this._chargeCatalogHelper = chargeCatalogHelper;
        this._chargePartsHelperService = chargePartsHelperService;
        this._chargeLabourHelperService = chargeLabourHelperService;
        this._logger = Logging.getLogger("ChargeService");
        this._incompleteStatus = [];
        this._partsChargeCatalogDependencies = <IChargePartsCatalogDependencies>{};
        this._chargeLabourCatalogDependencies = <IChargeLabourCatalogDependencies>{};

        this._eventAggregator.subscribe(ChargeServiceConstants.CHARGE_UPDATE_START, (jobId: string) => this.startCharges(jobId));
    }

    /**
     *
     * @param {Job} job
     * @param {number} monthLimit
     * @returns {boolean}
     */
    public static previousChargeSameAppliance(job: Job, monthLimit: number = 12): boolean {

        if (!Job.hasCharge(job)) {
            return false;
        }

        const existTasksWherePreviousAppliance = job.tasks.filter(task => {

            if (!task.isCharge) {
                return false;
            }

            if (!job || !job.history || !job.history.tasks) {
                return false;

            }

            const {history} = job;
            const {tasks} = history;

            const oldestAllowed = moment(new Date()).subtract(monthLimit, "months");

            return tasks.some(previousTask => {
                if (previousTask.activities && previousTask.activities.length > 0) {
                    return previousTask.activities.some(activity =>
                        moment(activity.date).isAfter(oldestAllowed) && previousTask.applianceType === task.applianceType
                    );
                }
                return false;
            });

        });

        return existTasksWherePreviousAppliance && existTasksWherePreviousAppliance.length > 0;
    }

    /**
     *
     * @param {Job} job
     * @param {Router} router
     */
    public static showHideChargeRoute(job: Job, router: Router): void {

        if (router && router.routes) {
            const jobHasCharge = Job.hasCharge(job);
            let route = router.routes.find(r => r.name === "charges");
            route.settings.visible = jobHasCharge;
        }
    }

    /**
     * applies charges, but also refereshes data state. We have this becuase some pages might require
     * this to be resolved
     *
     * @param {string} jobId
     * @returns {Promise<void>}
     */
    public async startCharges(jobId: string): Promise<void> {
        return this._jobService.getJob(jobId).then(job => {

            let existingTaskIds = (job.tasks || []).map(task => task.id);
            let chargeableTaskTaskIds = (job.charge.tasks || [])
                .filter(chargeableTask => chargeableTask.task)
                .map(chargeableTask => chargeableTask.task.id);

            // chargeableTask retains a reference to tasks, even after they have been removed from the job.tasks array when deleting a newRfa task
            //  so in the case that an orphan reference exists, we need to not quit early and do a full recalculation
            //  if we don't, the orphan task reference still remains and contributes to dataState calculations!
            let doesAnOrphanExist = chargeableTaskTaskIds.some(chargeableTaskTaskId =>
                existingTaskIds.indexOf(chargeableTaskTaskId) === -1);

            if (!Job.hasCharge(job) && !doesAnOrphanExist) {
                job.charge.dataState = DataState.dontCare;
                this._eventAggregator.publish(ChargeServiceConstants.CHARGE_UPDATE_COMPLETED);
                this._eventAggregator.publish(JobServiceConstants.JOB_DATA_STATE_CHANGED);
                return Promise.resolve();
            }

            if (job.charge) {
                job.charge.dataState = DataState.notVisited;
                job.charge.chargeOption = undefined;
                this._eventAggregator.publish(JobServiceConstants.JOB_DATA_STATE_CHANGED);
            }

            this._chargesUpdated = false;
            return this._jobService.setJob(job)
                .then(() => this.applyCharges(jobId))
                .then((charge => this.saveCharges(charge)))
                .then(() => {
                    this._chargesUpdated = true;
                    this._eventAggregator.publish(ChargeServiceConstants.CHARGE_UPDATE_COMPLETED);
                    this._eventAggregator.publish(JobServiceConstants.JOB_DATA_STATE_CHANGED);
                });
        }).catch(() => {
            // do nothing. there may not be active jobs
        });
    }

    /**
     *
     * @returns {boolean}
     */
    public areChargesUptoDate(): boolean {
        return this._chargesUpdated === true;
    }

    /**
     * go through each task in the job and create a chargeableTask
     * for each chargeable task decide if to charge for prime or sub prime
     * apply discounts
     * update totals
     * @param {string} jobId
     * @returns {Promise<Charge>}
     */
    public async applyCharges(jobId: string): Promise<Charge> {

        // we are rewriting charges model so  want a reference to discounted tasks to reapply later
        let discountedTasks: { [index: string]: string } = {};
        let remarks: string;
        let chargeOption: string;
        let complaintActionCategoryCharge: string;
        let previousChargeSameApplianceConfirmed: boolean;

        let model = new Charge();
        model.jobId = jobId;

        try {

            let createChargeableTaskPromises: Promise<ChargeableTask>[] = [];
            let calcChargesPromises: Promise<ChargeableTask>[] = [];

            await this.getRulesAndCatalogData();
            const charges = await this.loadCharges(jobId);

            if (charges && charges.tasks) {
                charges.tasks.forEach(ct => discountedTasks[ct.task.id] = ct.discountCode);
                remarks = charges.remarks;
                chargeOption = charges.chargeOption;
                complaintActionCategoryCharge = charges.complaintActionCategoryCharge;
                previousChargeSameApplianceConfirmed = charges.previousChargeSameApplianceConfirmed;
            }

            const job = await this._jobService.getJob(jobId);

            // include all tasks (including previous tasks). So that we can establish prime and sub prime, see DF_1768
            const tasks = [...job.tasks, ...job.tasksNotToday];

            this._logger.debug("calculate charges for tasks", tasks);

            if (!tasks || tasks.length === 0) {
                return model;
            }

            // create charge tasks
            tasks.forEach(task => {
                if (!this.excludeCharge(task)) { // task status category is excluded, e.g cancelled
                    createChargeableTaskPromises.push(this.createChargeableTask(task));
                }
            });

            // now calculate charges
            const chargeableTasks = await Promise.all(createChargeableTaskPromises);

            chargeableTasks.forEach(ct => {
                if (ct.shouldCharge(this._activityComponentVisitStatuses, this._chargeStatusCatCodes)) {
                    // no error (from initialisation) and task status category is chargeable, e.g. 'D' for 'done'
                    calcChargesPromises.push(this.calculateCharges(ct, jobId));
                } else {
                    calcChargesPromises.push(Promise.resolve(ct));
                }
            });

            const newChargeableTasks = await Promise.all(calcChargesPromises);

            if (!newChargeableTasks || newChargeableTasks.length === 0) {
                return model;
            }

            model.tasks = newChargeableTasks;

            // work out what each task charge should be, decide if we should use prime or sub
            model.calculatePrimeAndSubCharges();

            // update net totals for labour items
            model.tasks.forEach(t => {
                if (!t.useFixedPriceQuotation && !t.error) {
                    t.labourItem.netAmount = t.isSubsequent ? t.labourItem.chargePair.subsequentCharge : t.labourItem.chargePair.primeCharge;
                }
            });

            // reapply discounts

            model.tasks.forEach(task => {
                task.discountCode = discountedTasks[task.task.id];
                const validDiscounts = this._chargeCatalogHelper.getValidDiscounts(this._discounts);
                this.applyDiscountToTask(task, validDiscounts, this._discountPercentageCode, this._discountFixedCode, this._noDiscountCode);
            });

            // reapply charge option

            model.complaintActionCategoryCharge = complaintActionCategoryCharge;
            model.remarks = remarks;
            model.chargeOption = chargeOption;
            model.previousChargeSameApplianceConfirmed = previousChargeSameApplianceConfirmed;

            this.updateTotals(model);

            // do not send back tasks marked as completed from the middleware, just needed it to work out prime and sub

            model.tasks = model.tasks.filter(t => t.task.isMiddlewareDoTodayTask);

            return model;
        } catch (exception) {
            this._logger.error(exception && exception.toString());
            return model;
        }
    }

    /**
     *
     * @param {string} jobId
     * @returns {Promise<Charge>}
     */
    public async loadCharges(jobId: string): Promise<Charge> {
        const job = await this._jobService.getJob(jobId);

        if (!job || !job.charge || job.charge.tasks.length === 0) {
            return Promise.resolve(null);
        }

        job.charge.previousChargeSameAppliance = ChargeService.previousChargeSameAppliance(job);
        return Promise.resolve(job.charge);
    }

    /**
     *
     * @param {Charge} charges
     * @returns {Promise<void>}
     */
    public async saveCharges(charges: Charge): Promise<void> {
        const job = await this._jobService.getJob(charges.jobId);
        job.charge = charges;
        return this._jobService.setJob(job);
    }

    /**
     *
     * @param {Charge} model
     */
    public updateTotals(model: Charge): void {
        if (model) {
            model.netTotal = new bignumber.BigNumber(0);
            model.chargeTotal = new bignumber.BigNumber(0);

            let netT: bignumber.BigNumber = new bignumber.BigNumber(model.netTotal);
            let totalVatAmount = new bignumber.BigNumber(0);
            let totalDiscount = new bignumber.BigNumber(0);

            if (netT.greaterThanOrEqualTo(0)) {

                model.tasks.forEach(x => {
                    totalVatAmount = totalVatAmount.plus(x.calculatedVatAmount.round(2));
                    netT = netT.plus(x.netTotal.round(2));
                    if (x.discountAmount) {
                        totalDiscount = totalDiscount.plus(x.discountAmount.round(2));
                    }
                });

                model.totalVatAmount = totalVatAmount;
                model.netTotal = netT;
                model.discountAmount = totalDiscount;

                const chargeTotal = netT.plus(totalVatAmount);

                if (chargeTotal.lessThanOrEqualTo(0)) {
                    model.chargeTotal = new bignumber.BigNumber(0);
                    model.netTotal = new bignumber.BigNumber(0);
                    model.totalVatAmount = new bignumber.BigNumber(0);
                } else {
                    model.chargeTotal = chargeTotal;
                }

            }
            if (new bignumber.BigNumber(model.netTotal).lessThanOrEqualTo(0)) {
                model.dataState = DataState.dontCare;
            }
        }
    }

    /**
     *
     * @param {ChargeableTask} task
     * @param {IDiscount[]} allDiscounts
     * @param {string} discountPercentageCode
     * @param {string} discountFixedCode
     * @param {string} noDiscountCode
     */
    public applyDiscountToTask(task: ChargeableTask, allDiscounts: IDiscount[], discountPercentageCode: string, discountFixedCode: string, noDiscountCode: string): void {

        // if no task, or fixed price (discount not allowed for fixed price), missing discount code exit early

        if (!task) {
            return;
        }

        const {fixedPriceQuotationAmount = new bignumber.BigNumber(0), netTotal = new bignumber.BigNumber(0), discountCode} = task;

        if (netTotal.equals(0) || !discountCode || fixedPriceQuotationAmount.greaterThan(0)) {
            return;
        }

        // if no discount code set to 0 discount and exit
        if (discountCode === noDiscountCode) {

            task.discountAmount = undefined;
            task.discountText = "";

            return;
        }

        // find discount
        const discount = allDiscounts.find(d => d.discountCode === task.discountCode);

        // if discount not found, or missing attributes exit
        if (!discount) {
            return;
        }

        const {discountCategory, discountValue} = discount;

        if (!discountCategory || !discountValue) {
            return;
        }

        // calculate discount

        // initialise to zero otherwise getter grossTotal will be wrong . see test "applies correct discount after multiple changes" in chargeService.spec
        task.discountAmount = new bignumber.BigNumber(0);
        task.discountCode = discountCode;

        if (discountCategory === discountPercentageCode) {
            task.discountAmount = new bignumber.BigNumber(discountValue).times(task.netTotal).dividedBy(100).round(2);
            task.discountText = `${discountValue}% applied`;
        } else if (discountCategory === discountFixedCode) { // fixed price e.g. #17.01
            const discValue = new bignumber.BigNumber(discountValue).dividedBy(100).round(2);
            task.discountAmount = discValue;
            task.discountText = `£${discValue} applied`;
        }

        return;
    }

    /**
     *
     * @param {Task} task
     * @returns {Promise<ChargeableTask>}
     */
    private async createChargeableTask(task: Task): Promise<ChargeableTask> {

        const chargeType = await this._catalogService.getChargeType(task.chargeType);

        this._logger.debug("Charge type found", [chargeType]);

        let chargeableTask = new ChargeableTask();
        chargeableTask.task = task;

        if (!chargeType) {
            const message = `charge type ${task.chargeType} not found in catalog data`;
            this._logger.error(message, task);
            chargeableTask.setChargeableTaskAsError(message);
            return chargeableTask;
        }

        chargeableTask.isLabourCharge = chargeType.chargeLabourIndicator === "Y";
        chargeableTask.isPartsCharge = chargeType.chargePartsIndicator === "Y";
        chargeableTask.chargeDescription = chargeType.chargeTypeDescription;
        chargeableTask.vatCode = chargeType.vatCode;
        chargeableTask.discountCode = task.discountCode;

        if (task.fixedPriceQuotationAmount && task.fixedPriceQuotationAmount > 0) {
            this._logger.debug("Fixed price quotation detected", []);
            chargeableTask.fixedPriceQuotationAmount = new bignumber.BigNumber(task.fixedPriceQuotationAmount).times(this._fixedPriceQuotationCurrencyUnit);
        }

        this._logger.debug("ChargeableTask created, now getting vat rate", [chargeableTask]);

        const vat = this._chargeCatalogHelper.getVatRate(chargeType.vatCode, chargeableTask.task.startTime, this._dateFormatVat, this._vats);

        this._logger.debug("Got VAT", [vat]);
        chargeableTask.vat = new bignumber.BigNumber(vat);
        return chargeableTask;
    }

    /**
     * get charge rule from catalog, then use it to determine if we need to calculate parts, labour charges
     * @param {ChargeableTask} chargeableTask
     * @param {string} jobId
     * @returns {Promise<ChargeableTask>}
     */
    private async calculateCharges(chargeableTask: ChargeableTask, jobId: string): Promise<ChargeableTask> {

        this._logger.debug("Calculating charges for chargeable task", [chargeableTask]);

        // if error from earlier process, for .e.g. failed to get charge rule reset, if here then presume that issue is now fixed
        chargeableTask.error = false;
        chargeableTask.errorDescription = "";
        chargeableTask.partItems = [];

        let jcChargeRule: IJcChargeRules = null;
        const {jobType, applianceType, chargeType} = chargeableTask.task;

        try {
            jcChargeRule = await this._chargeCatalogHelper.getJobCodeChargeRule(jobType, applianceType, chargeType,
                this._chargeRulesDateFormat, this._chargeMethodCodeLength);

            this._logger.debug("Charge rule found", [jcChargeRule]);

            const isPrime = jcChargeRule && jcChargeRule.primeJobProcessIndicator === "Y";
            chargeableTask.isSubsequent = !isPrime;

            // important - be careful changing the order of if blocks

            if (chargeableTask.useFixedPriceQuotation) {
                // if fixed price
                this._logger.debug("Fixed price quotation, initialise empty part item, no point doing further calculations", []);
                chargeableTask.addPartItem("", new bignumber.BigNumber(0), false, false, 0, 0, "", 0, 0);
                return Promise.resolve(chargeableTask);
            }

            // further visit status, e.g. Wait Advice, Further Visit Required etc.
            // we need to retain the prime and sub charge status but don't need to calculate yet
            if (this._incompleteStatus.some(s => s === chargeableTask.task.status)) {
                this._logger.debug("I status activity, initialise empty part item, no point doing further calculations", []);
                chargeableTask.addPartItem("", new bignumber.BigNumber(0), false, false, 0, 0, "", 0, 0);
                return Promise.resolve(chargeableTask);
            }

            const chargeWithParts = await this._chargePartsHelperService.addPartsCharge(chargeableTask, jobId,
                chargeableTask.isPartsCharge, this._partsChargeCatalogDependencies);

            // no parts, add item to indicate 0 parts charge
            if (chargeWithParts.partItems.length === 0) {
                chargeableTask.addPartItem("", new bignumber.BigNumber(0), false, false, 0, 0, "", 0, 0);
            }
            // calculate labour charge
            // you will need a start time in order to calculate labour charge
            if (!chargeableTask.task.startTime) {
                return Promise.resolve(chargeWithParts);
            }

            return await this._chargeLabourHelperService.calculateLabourCharge(chargeWithParts, jcChargeRule, this._chargeLabourCatalogDependencies);
        } catch (exception) {

            this._logger.error(exception && exception.toString());

            if (!jcChargeRule) {

                // check task and task start time, cannot get charge rule if no task start time initialised, for example
                // on first visit to screen no need to set error

                if (chargeableTask.isLabourCharge === true && chargeableTask.task && chargeableTask.task.startTime) {
                    const chargeRuleErrorMessage = "job code charge rules not found in catalog data";
                    this._logger.error(chargeRuleErrorMessage, chargeableTask);
                    chargeableTask.setChargeableTaskAsError(chargeRuleErrorMessage);
                    return chargeableTask;
                }
                // part type charge jobs will not map to a job charge rule so ok to return with no error
            }
            const message: string = "failed to calculate charges";
            this._logger.error(new BusinessException(this, "chargeService", message, null, chargeableTask).toString());
            chargeableTask.setChargeableTaskAsError(message);

            return chargeableTask;
        }
    }

    /**
     *
     * @param {Task} task
     * @returns {boolean}
     */
    private excludeCharge(task: Task): boolean {
        if (!task.applianceType) {
            return true;
        }

        if (!task.status) {
            return true;
        }

        const status = this._activityComponentVisitStatuses.find(a => a.status === task.status);

        if (status && this._excludeChargeStatusCatCode) {
            return this._excludeChargeStatusCatCode === status.jobStatusCategory;
        }

        return false;
    }

    /**
     *
     * @returns {Promise<void>}
     */
    private async getRulesAndCatalogData(): Promise<void> {
        const ruleGroup = await this._businessRuleService.getQueryableRuleGroup("chargeService");
        // setup rules
        this._dateFormatVat = ruleGroup.getBusinessRule<string>("dateFormatVat");
        this._chargeRulesDateFormat = ruleGroup.getBusinessRule<string>("chargeRulesDateFormat");
        this._fixedPriceQuotationCurrencyUnit = ruleGroup.getBusinessRule<number>("fixedPriceQuotationCurrencyUnit");
        this._discountPercentageCode = ruleGroup.getBusinessRule<string>("discountPercentageCode");
        this._discountFixedCode = ruleGroup.getBusinessRule<string>("discountFixedCode");
        this._noDiscountCode = ruleGroup.getBusinessRule<string>("noDiscountCode");
        this._excludeChargeStatusCatCode = ruleGroup.getBusinessRule<string>("excludeChargeStatusCatCode");
        this._chargeMethodCodeLength = ruleGroup.getBusinessRule<number>("chargeMethodCodeLength");
        this._chargeStatusCatCodes = ruleGroup.getBusinessRuleList<string>("chargeStatusCatCodes");

        this._incompleteStatus = ruleGroup.getBusinessRuleList<string>("incompleteVisitStatus");

        const tieredLabourChargeCurrencyUnit = ruleGroup.getBusinessRule<number>("tieredLabourChargeCurrencyUnit");
        const fixedLabourChargeCurrencyUnit = ruleGroup.getBusinessRule<number>("fixedLabourChargeCurrencyUnit");

        const visitStatuses = ruleGroup.getBusinessRuleList<string>("visitStatuses");
        const notUsedStatusCode = ruleGroup.getBusinessRule<string>("notUsedStatusCode");
        const vanStockPartOrderStatus = ruleGroup.getBusinessRule<string>("vanStockPartOrderStatus");
        const excludePartStatusPrevious = ruleGroup.getBusinessRuleList<string>("excludePartStatusPrevious");

        const [statuses, vats, primeChargeIntervals, subChargeIntervals, discounts] =
            await Promise.all([this._catalogService.getActivityComponentVisitStatuses()
                , this._catalogService.getVats()
                , this._catalogService.getPrimeChargeIntervals()
                , this._catalogService.getSubsequentChargeIntervals()
                , this._catalogService.getDiscounts()
            ]);

        this._activityComponentVisitStatuses = statuses;
        this._vats = vats;
        this._discounts = discounts;

        this._partsChargeCatalogDependencies.excludePartStatusPrevious = excludePartStatusPrevious;
        this._partsChargeCatalogDependencies.notUsedStatusCode = notUsedStatusCode;
        this._partsChargeCatalogDependencies.visitStatuses = visitStatuses;
        this._partsChargeCatalogDependencies.vanStockPartOrderStatus = vanStockPartOrderStatus;

        this._chargeLabourCatalogDependencies.fixedLabourChargeCurrencyUnit = fixedLabourChargeCurrencyUnit;
        this._chargeLabourCatalogDependencies.tieredLabourChargeCurrencyUnit = tieredLabourChargeCurrencyUnit;
        this._chargeLabourCatalogDependencies.primeChargeIntervals = primeChargeIntervals;
        this._chargeLabourCatalogDependencies.subChargeIntervals = subChargeIntervals;

    }
}
