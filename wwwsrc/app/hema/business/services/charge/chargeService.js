var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "aurelia-logging", "../constants/chargeServiceConstants", "../../models/charge/chargeableTask", "../catalogService", "../jobService", "aurelia-dependency-injection", "moment", "../../models/charge/charge", "bignumber", "../businessRuleService", "../../models/job", "aurelia-event-aggregator", "../../models/dataState", "../../models/businessException", "../constants/jobServiceConstants", "./chargeCatalogHelperService", "./chargePartsHelperService", "./chargeLabourHelperService"], function (require, exports, Logging, chargeServiceConstants_1, chargeableTask_1, catalogService_1, jobService_1, aurelia_dependency_injection_1, moment, charge_1, bignumber, businessRuleService_1, job_1, aurelia_event_aggregator_1, dataState_1, businessException_1, jobServiceConstants_1, chargeCatalogHelperService_1, chargePartsHelperService_1, chargeLabourHelperService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargeService = /** @class */ (function () {
        function ChargeService(jobService, catalogService, businessRuleService, eventAggregator, chargeCatalogHelper, chargePartsHelperService, chargeLabourHelperService) {
            var _this = this;
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
            this._partsChargeCatalogDependencies = {};
            this._chargeLabourCatalogDependencies = {};
            this._eventAggregator.subscribe(chargeServiceConstants_1.ChargeServiceConstants.CHARGE_UPDATE_START, function (jobId) { return _this.startCharges(jobId); });
        }
        ChargeService_1 = ChargeService;
        /**
         *
         * @param {Job} job
         * @param {number} monthLimit
         * @returns {boolean}
         */
        ChargeService.previousChargeSameAppliance = function (job, monthLimit) {
            if (monthLimit === void 0) { monthLimit = 12; }
            if (!job_1.Job.hasCharge(job)) {
                return false;
            }
            var existTasksWherePreviousAppliance = job.tasks.filter(function (task) {
                if (!task.isCharge) {
                    return false;
                }
                if (!job || !job.history || !job.history.tasks) {
                    return false;
                }
                var history = job.history;
                var tasks = history.tasks;
                var oldestAllowed = moment(new Date()).subtract(monthLimit, "months");
                return tasks.some(function (previousTask) {
                    if (previousTask.activities && previousTask.activities.length > 0) {
                        return previousTask.activities.some(function (activity) {
                            return moment(activity.date).isAfter(oldestAllowed) && previousTask.applianceType === task.applianceType;
                        });
                    }
                    return false;
                });
            });
            return existTasksWherePreviousAppliance && existTasksWherePreviousAppliance.length > 0;
        };
        /**
         *
         * @param {Job} job
         * @param {Router} router
         */
        ChargeService.showHideChargeRoute = function (job, router) {
            if (router && router.routes) {
                var jobHasCharge = job_1.Job.hasCharge(job);
                var route = router.routes.find(function (r) { return r.name === "charges"; });
                route.settings.visible = jobHasCharge;
            }
        };
        /**
         * applies charges, but also refereshes data state. We have this becuase some pages might require
         * this to be resolved
         *
         * @param {string} jobId
         * @returns {Promise<void>}
         */
        ChargeService.prototype.startCharges = function (jobId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this._jobService.getJob(jobId).then(function (job) {
                            var existingTaskIds = (job.tasks || []).map(function (task) { return task.id; });
                            var chargeableTaskTaskIds = (job.charge.tasks || [])
                                .filter(function (chargeableTask) { return chargeableTask.task; })
                                .map(function (chargeableTask) { return chargeableTask.task.id; });
                            // chargeableTask retains a reference to tasks, even after they have been removed from the job.tasks array when deleting a newRfa task
                            //  so in the case that an orphan reference exists, we need to not quit early and do a full recalculation
                            //  if we don't, the orphan task reference still remains and contributes to dataState calculations!
                            var doesAnOrphanExist = chargeableTaskTaskIds.some(function (chargeableTaskTaskId) {
                                return existingTaskIds.indexOf(chargeableTaskTaskId) === -1;
                            });
                            if (!job_1.Job.hasCharge(job) && !doesAnOrphanExist) {
                                job.charge.dataState = dataState_1.DataState.dontCare;
                                _this._eventAggregator.publish(chargeServiceConstants_1.ChargeServiceConstants.CHARGE_UPDATE_COMPLETED);
                                _this._eventAggregator.publish(jobServiceConstants_1.JobServiceConstants.JOB_DATA_STATE_CHANGED);
                                return Promise.resolve();
                            }
                            if (job.charge) {
                                job.charge.dataState = dataState_1.DataState.notVisited;
                                job.charge.chargeOption = undefined;
                                _this._eventAggregator.publish(jobServiceConstants_1.JobServiceConstants.JOB_DATA_STATE_CHANGED);
                            }
                            _this._chargesUpdated = false;
                            return _this._jobService.setJob(job)
                                .then(function () { return _this.applyCharges(jobId); })
                                .then((function (charge) { return _this.saveCharges(charge); }))
                                .then(function () {
                                _this._chargesUpdated = true;
                                _this._eventAggregator.publish(chargeServiceConstants_1.ChargeServiceConstants.CHARGE_UPDATE_COMPLETED);
                                _this._eventAggregator.publish(jobServiceConstants_1.JobServiceConstants.JOB_DATA_STATE_CHANGED);
                            });
                        }).catch(function () {
                            // do nothing. there may not be active jobs
                        })];
                });
            });
        };
        /**
         *
         * @returns {boolean}
         */
        ChargeService.prototype.areChargesUptoDate = function () {
            return this._chargesUpdated === true;
        };
        /**
         * go through each task in the job and create a chargeableTask
         * for each chargeable task decide if to charge for prime or sub prime
         * apply discounts
         * update totals
         * @param {string} jobId
         * @returns {Promise<Charge>}
         */
        ChargeService.prototype.applyCharges = function (jobId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var discountedTasks, remarks, chargeOption, complaintActionCategoryCharge, previousChargeSameApplianceConfirmed, model, createChargeableTaskPromises_1, calcChargesPromises_1, charges, job, tasks, chargeableTasks, newChargeableTasks, exception_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            discountedTasks = {};
                            model = new charge_1.Charge();
                            model.jobId = jobId;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 7, , 8]);
                            createChargeableTaskPromises_1 = [];
                            calcChargesPromises_1 = [];
                            return [4 /*yield*/, this.getRulesAndCatalogData()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.loadCharges(jobId)];
                        case 3:
                            charges = _a.sent();
                            if (charges && charges.tasks) {
                                charges.tasks.forEach(function (ct) { return discountedTasks[ct.task.id] = ct.discountCode; });
                                remarks = charges.remarks;
                                chargeOption = charges.chargeOption;
                                complaintActionCategoryCharge = charges.complaintActionCategoryCharge;
                                previousChargeSameApplianceConfirmed = charges.previousChargeSameApplianceConfirmed;
                            }
                            return [4 /*yield*/, this._jobService.getJob(jobId)];
                        case 4:
                            job = _a.sent();
                            tasks = job.tasks.concat(job.tasksNotToday);
                            this._logger.debug("calculate charges for tasks", tasks);
                            if (!tasks || tasks.length === 0) {
                                return [2 /*return*/, model];
                            }
                            // create charge tasks
                            tasks.forEach(function (task) {
                                if (!_this.excludeCharge(task)) {
                                    createChargeableTaskPromises_1.push(_this.createChargeableTask(task));
                                }
                            });
                            return [4 /*yield*/, Promise.all(createChargeableTaskPromises_1)];
                        case 5:
                            chargeableTasks = _a.sent();
                            chargeableTasks.forEach(function (ct) {
                                if (ct.shouldCharge(_this._activityComponentVisitStatuses, _this._chargeStatusCatCodes)) {
                                    // no error (from initialisation) and task status category is chargeable, e.g. 'D' for 'done'
                                    calcChargesPromises_1.push(_this.calculateCharges(ct, jobId));
                                }
                                else {
                                    calcChargesPromises_1.push(Promise.resolve(ct));
                                }
                            });
                            return [4 /*yield*/, Promise.all(calcChargesPromises_1)];
                        case 6:
                            newChargeableTasks = _a.sent();
                            if (!newChargeableTasks || newChargeableTasks.length === 0) {
                                return [2 /*return*/, model];
                            }
                            model.tasks = newChargeableTasks;
                            // work out what each task charge should be, decide if we should use prime or sub
                            model.calculatePrimeAndSubCharges();
                            // update net totals for labour items
                            model.tasks.forEach(function (t) {
                                if (!t.useFixedPriceQuotation && !t.error) {
                                    t.labourItem.netAmount = t.isSubsequent ? t.labourItem.chargePair.subsequentCharge : t.labourItem.chargePair.primeCharge;
                                }
                            });
                            // reapply discounts
                            model.tasks.forEach(function (task) {
                                task.discountCode = discountedTasks[task.task.id];
                                var validDiscounts = _this._chargeCatalogHelper.getValidDiscounts(_this._discounts);
                                _this.applyDiscountToTask(task, validDiscounts, _this._discountPercentageCode, _this._discountFixedCode, _this._noDiscountCode);
                            });
                            // reapply charge option
                            model.complaintActionCategoryCharge = complaintActionCategoryCharge;
                            model.remarks = remarks;
                            model.chargeOption = chargeOption;
                            model.previousChargeSameApplianceConfirmed = previousChargeSameApplianceConfirmed;
                            this.updateTotals(model);
                            // do not send back tasks marked as completed from the middleware, just needed it to work out prime and sub
                            model.tasks = model.tasks.filter(function (t) { return t.task.isMiddlewareDoTodayTask; });
                            return [2 /*return*/, model];
                        case 7:
                            exception_1 = _a.sent();
                            this._logger.error(exception_1 && exception_1.toString());
                            return [2 /*return*/, model];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         *
         * @param {string} jobId
         * @returns {Promise<Charge>}
         */
        ChargeService.prototype.loadCharges = function (jobId) {
            return __awaiter(this, void 0, void 0, function () {
                var job;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._jobService.getJob(jobId)];
                        case 1:
                            job = _a.sent();
                            if (!job || !job.charge || job.charge.tasks.length === 0) {
                                return [2 /*return*/, Promise.resolve(null)];
                            }
                            job.charge.previousChargeSameAppliance = ChargeService_1.previousChargeSameAppliance(job);
                            return [2 /*return*/, Promise.resolve(job.charge)];
                    }
                });
            });
        };
        /**
         *
         * @param {Charge} charges
         * @returns {Promise<void>}
         */
        ChargeService.prototype.saveCharges = function (charges) {
            return __awaiter(this, void 0, void 0, function () {
                var job;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._jobService.getJob(charges.jobId)];
                        case 1:
                            job = _a.sent();
                            job.charge = charges;
                            return [2 /*return*/, this._jobService.setJob(job)];
                    }
                });
            });
        };
        /**
         *
         * @param {Charge} model
         */
        ChargeService.prototype.updateTotals = function (model) {
            if (model) {
                model.netTotal = new bignumber.BigNumber(0);
                model.chargeTotal = new bignumber.BigNumber(0);
                var netT_1 = new bignumber.BigNumber(model.netTotal);
                var totalVatAmount_1 = new bignumber.BigNumber(0);
                var totalDiscount_1 = new bignumber.BigNumber(0);
                if (netT_1.greaterThanOrEqualTo(0)) {
                    model.tasks.forEach(function (x) {
                        totalVatAmount_1 = totalVatAmount_1.plus(x.calculatedVatAmount.round(2));
                        netT_1 = netT_1.plus(x.netTotal.round(2));
                        if (x.discountAmount) {
                            totalDiscount_1 = totalDiscount_1.plus(x.discountAmount.round(2));
                        }
                    });
                    model.totalVatAmount = totalVatAmount_1;
                    model.netTotal = netT_1;
                    model.discountAmount = totalDiscount_1;
                    var chargeTotal = netT_1.plus(totalVatAmount_1);
                    if (chargeTotal.lessThanOrEqualTo(0)) {
                        model.chargeTotal = new bignumber.BigNumber(0);
                        model.netTotal = new bignumber.BigNumber(0);
                        model.totalVatAmount = new bignumber.BigNumber(0);
                    }
                    else {
                        model.chargeTotal = chargeTotal;
                    }
                }
                if (new bignumber.BigNumber(model.netTotal).lessThanOrEqualTo(0)) {
                    model.dataState = dataState_1.DataState.dontCare;
                }
            }
        };
        /**
         *
         * @param {ChargeableTask} task
         * @param {IDiscount[]} allDiscounts
         * @param {string} discountPercentageCode
         * @param {string} discountFixedCode
         * @param {string} noDiscountCode
         */
        ChargeService.prototype.applyDiscountToTask = function (task, allDiscounts, discountPercentageCode, discountFixedCode, noDiscountCode) {
            // if no task, or fixed price (discount not allowed for fixed price), missing discount code exit early
            if (!task) {
                return;
            }
            var _a = task.fixedPriceQuotationAmount, fixedPriceQuotationAmount = _a === void 0 ? new bignumber.BigNumber(0) : _a, _b = task.netTotal, netTotal = _b === void 0 ? new bignumber.BigNumber(0) : _b, discountCode = task.discountCode;
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
            var discount = allDiscounts.find(function (d) { return d.discountCode === task.discountCode; });
            // if discount not found, or missing attributes exit
            if (!discount) {
                return;
            }
            var discountCategory = discount.discountCategory, discountValue = discount.discountValue;
            if (!discountCategory || !discountValue) {
                return;
            }
            // calculate discount
            // initialise to zero otherwise getter grossTotal will be wrong . see test "applies correct discount after multiple changes" in chargeService.spec
            task.discountAmount = new bignumber.BigNumber(0);
            task.discountCode = discountCode;
            if (discountCategory === discountPercentageCode) {
                task.discountAmount = new bignumber.BigNumber(discountValue).times(task.netTotal).dividedBy(100).round(2);
                task.discountText = discountValue + "% applied";
            }
            else if (discountCategory === discountFixedCode) {
                var discValue = new bignumber.BigNumber(discountValue).dividedBy(100).round(2);
                task.discountAmount = discValue;
                task.discountText = "\u00A3" + discValue + " applied";
            }
            return;
        };
        /**
         *
         * @param {Task} task
         * @returns {Promise<ChargeableTask>}
         */
        ChargeService.prototype.createChargeableTask = function (task) {
            return __awaiter(this, void 0, void 0, function () {
                var chargeType, chargeableTask, message, vat;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._catalogService.getChargeType(task.chargeType)];
                        case 1:
                            chargeType = _a.sent();
                            this._logger.debug("Charge type found", [chargeType]);
                            chargeableTask = new chargeableTask_1.ChargeableTask();
                            chargeableTask.task = task;
                            if (!chargeType) {
                                message = "charge type " + task.chargeType + " not found in catalog data";
                                this._logger.error(message, task);
                                chargeableTask.setChargeableTaskAsError(message);
                                return [2 /*return*/, chargeableTask];
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
                            vat = this._chargeCatalogHelper.getVatRate(chargeType.vatCode, chargeableTask.task.startTime, this._dateFormatVat, this._vats);
                            this._logger.debug("Got VAT", [vat]);
                            chargeableTask.vat = new bignumber.BigNumber(vat);
                            return [2 /*return*/, chargeableTask];
                    }
                });
            });
        };
        /**
         * get charge rule from catalog, then use it to determine if we need to calculate parts, labour charges
         * @param {ChargeableTask} chargeableTask
         * @param {string} jobId
         * @returns {Promise<ChargeableTask>}
         */
        ChargeService.prototype.calculateCharges = function (chargeableTask, jobId) {
            return __awaiter(this, void 0, void 0, function () {
                var jcChargeRule, _a, jobType, applianceType, chargeType, isPrime, chargeWithParts, exception_2, chargeRuleErrorMessage, message;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this._logger.debug("Calculating charges for chargeable task", [chargeableTask]);
                            // if error from earlier process, for .e.g. failed to get charge rule reset, if here then presume that issue is now fixed
                            chargeableTask.error = false;
                            chargeableTask.errorDescription = "";
                            chargeableTask.partItems = [];
                            jcChargeRule = null;
                            _a = chargeableTask.task, jobType = _a.jobType, applianceType = _a.applianceType, chargeType = _a.chargeType;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this._chargeCatalogHelper.getJobCodeChargeRule(jobType, applianceType, chargeType, this._chargeRulesDateFormat, this._chargeMethodCodeLength)];
                        case 2:
                            jcChargeRule = _b.sent();
                            this._logger.debug("Charge rule found", [jcChargeRule]);
                            isPrime = jcChargeRule && jcChargeRule.primeJobProcessIndicator === "Y";
                            chargeableTask.isSubsequent = !isPrime;
                            // important - be careful changing the order of if blocks
                            if (chargeableTask.useFixedPriceQuotation) {
                                // if fixed price
                                this._logger.debug("Fixed price quotation, initialise empty part item, no point doing further calculations", []);
                                chargeableTask.addPartItem("", new bignumber.BigNumber(0), false, false, 0, 0, "", 0, 0);
                                return [2 /*return*/, Promise.resolve(chargeableTask)];
                            }
                            // further visit status, e.g. Wait Advice, Further Visit Required etc.
                            // we need to retain the prime and sub charge status but don't need to calculate yet
                            if (this._incompleteStatus.some(function (s) { return s === chargeableTask.task.status; })) {
                                this._logger.debug("I status activity, initialise empty part item, no point doing further calculations", []);
                                chargeableTask.addPartItem("", new bignumber.BigNumber(0), false, false, 0, 0, "", 0, 0);
                                return [2 /*return*/, Promise.resolve(chargeableTask)];
                            }
                            return [4 /*yield*/, this._chargePartsHelperService.addPartsCharge(chargeableTask, jobId, chargeableTask.isPartsCharge, this._partsChargeCatalogDependencies)];
                        case 3:
                            chargeWithParts = _b.sent();
                            // no parts, add item to indicate 0 parts charge
                            if (chargeWithParts.partItems.length === 0) {
                                chargeableTask.addPartItem("", new bignumber.BigNumber(0), false, false, 0, 0, "", 0, 0);
                            }
                            // calculate labour charge
                            // you will need a start time in order to calculate labour charge
                            if (!chargeableTask.task.startTime) {
                                return [2 /*return*/, Promise.resolve(chargeWithParts)];
                            }
                            return [4 /*yield*/, this._chargeLabourHelperService.calculateLabourCharge(chargeWithParts, jcChargeRule, this._chargeLabourCatalogDependencies)];
                        case 4: return [2 /*return*/, _b.sent()];
                        case 5:
                            exception_2 = _b.sent();
                            this._logger.error(exception_2 && exception_2.toString());
                            if (!jcChargeRule) {
                                // check task and task start time, cannot get charge rule if no task start time initialised, for example
                                // on first visit to screen no need to set error
                                if (chargeableTask.isLabourCharge === true && chargeableTask.task && chargeableTask.task.startTime) {
                                    chargeRuleErrorMessage = "job code charge rules not found in catalog data";
                                    this._logger.error(chargeRuleErrorMessage, chargeableTask);
                                    chargeableTask.setChargeableTaskAsError(chargeRuleErrorMessage);
                                    return [2 /*return*/, chargeableTask];
                                }
                                // part type charge jobs will not map to a job charge rule so ok to return with no error
                            }
                            message = "failed to calculate charges";
                            this._logger.error(new businessException_1.BusinessException(this, "chargeService", message, null, chargeableTask).toString());
                            chargeableTask.setChargeableTaskAsError(message);
                            return [2 /*return*/, chargeableTask];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         *
         * @param {Task} task
         * @returns {boolean}
         */
        ChargeService.prototype.excludeCharge = function (task) {
            if (!task.applianceType) {
                return true;
            }
            if (!task.status) {
                return true;
            }
            var status = this._activityComponentVisitStatuses.find(function (a) { return a.status === task.status; });
            if (status && this._excludeChargeStatusCatCode) {
                return this._excludeChargeStatusCatCode === status.jobStatusCategory;
            }
            return false;
        };
        /**
         *
         * @returns {Promise<void>}
         */
        ChargeService.prototype.getRulesAndCatalogData = function () {
            return __awaiter(this, void 0, void 0, function () {
                var ruleGroup, tieredLabourChargeCurrencyUnit, fixedLabourChargeCurrencyUnit, visitStatuses, notUsedStatusCode, vanStockPartOrderStatus, excludePartStatusPrevious, _a, statuses, vats, primeChargeIntervals, subChargeIntervals, discounts;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this._businessRuleService.getQueryableRuleGroup("chargeService")];
                        case 1:
                            ruleGroup = _b.sent();
                            // setup rules
                            this._dateFormatVat = ruleGroup.getBusinessRule("dateFormatVat");
                            this._chargeRulesDateFormat = ruleGroup.getBusinessRule("chargeRulesDateFormat");
                            this._fixedPriceQuotationCurrencyUnit = ruleGroup.getBusinessRule("fixedPriceQuotationCurrencyUnit");
                            this._discountPercentageCode = ruleGroup.getBusinessRule("discountPercentageCode");
                            this._discountFixedCode = ruleGroup.getBusinessRule("discountFixedCode");
                            this._noDiscountCode = ruleGroup.getBusinessRule("noDiscountCode");
                            this._excludeChargeStatusCatCode = ruleGroup.getBusinessRule("excludeChargeStatusCatCode");
                            this._chargeMethodCodeLength = ruleGroup.getBusinessRule("chargeMethodCodeLength");
                            this._chargeStatusCatCodes = ruleGroup.getBusinessRuleList("chargeStatusCatCodes");
                            this._incompleteStatus = ruleGroup.getBusinessRuleList("incompleteVisitStatus");
                            tieredLabourChargeCurrencyUnit = ruleGroup.getBusinessRule("tieredLabourChargeCurrencyUnit");
                            fixedLabourChargeCurrencyUnit = ruleGroup.getBusinessRule("fixedLabourChargeCurrencyUnit");
                            visitStatuses = ruleGroup.getBusinessRuleList("visitStatuses");
                            notUsedStatusCode = ruleGroup.getBusinessRule("notUsedStatusCode");
                            vanStockPartOrderStatus = ruleGroup.getBusinessRule("vanStockPartOrderStatus");
                            excludePartStatusPrevious = ruleGroup.getBusinessRuleList("excludePartStatusPrevious");
                            return [4 /*yield*/, Promise.all([this._catalogService.getActivityComponentVisitStatuses(),
                                    this._catalogService.getVats(),
                                    this._catalogService.getPrimeChargeIntervals(),
                                    this._catalogService.getSubsequentChargeIntervals(),
                                    this._catalogService.getDiscounts()
                                ])];
                        case 2:
                            _a = _b.sent(), statuses = _a[0], vats = _a[1], primeChargeIntervals = _a[2], subChargeIntervals = _a[3], discounts = _a[4];
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
                            return [2 /*return*/];
                    }
                });
            });
        };
        ChargeService = ChargeService_1 = __decorate([
            aurelia_dependency_injection_1.inject(jobService_1.JobService, catalogService_1.CatalogService, businessRuleService_1.BusinessRuleService, aurelia_event_aggregator_1.EventAggregator, chargeCatalogHelperService_1.ChargeCatalogHelperService, chargePartsHelperService_1.ChargePartsHelperService, chargeLabourHelperService_1.ChargeLabourHelperService),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator, Object, Object, Object])
        ], ChargeService);
        return ChargeService;
        var ChargeService_1;
    }());
    exports.ChargeService = ChargeService;
});

//# sourceMappingURL=chargeService.js.map
