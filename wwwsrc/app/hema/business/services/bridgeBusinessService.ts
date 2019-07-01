/// <reference path="../../../../typings/app.d.ts" />
import * as Logging from "aurelia-logging";
import { inject } from "aurelia-framework";
import * as moment from "moment";
import { IBridgeBusinessService } from "./interfaces/IBridgeBusinessService";
import { IBridgeApiService } from "../../api/services/interfaces/IBridgeApiService";
import { BridgeApiService } from "../../api/services/bridgeApiService";
import { IAdaptModel } from "../../api/models/adapt/IAdaptModel";
import { IAdaptModelAttribute } from "../../api/models/adapt/IAdaptModelAttribute";
import { AdaptAttributeConstants } from "./constants/adaptAttributeConstants";
import { IAdaptModelResponse } from "../../api/models/adapt/IAdaptModelResponse";
import { IAdaptPartsSelectedResponse } from "../../api/models/adapt/IAdaptPartsSelectedResponse";
import { AdaptAvailabilityAttributeType } from "./constants/adaptAvailabilityAttributeType";
import { ExternalApplianceAppModel } from "../models/adapt/externalApplianceAppModel";
import { UserSettings } from "../models/adapt/UserSettings";
import { BusinessException } from "../models/businessException";
import { EventAggregator } from "aurelia-event-aggregator";
import { IJobService } from "./interfaces/IJobService";
import { JobService } from "./jobService";
import { Threading } from "../../../common/core/threading";
import { JobState } from "../models/jobState";
import { Part as PartBusinessModel } from "../models/part";
import { Job } from "../models/job";
import { PartFactory } from "../factories/partFactory";
import { IPartFactory } from "../factories/interfaces/IPartFactory";
import { PartsDetail } from "../models/partsDetail";
import { JobServiceConstants } from "./constants/jobServiceConstants";
import { AdaptBusinessServiceConstants } from "./constants/adaptBusinessServiceConstants";
import { DataState } from "../models/dataState";
import { IConfigurationService } from "../../../common/core/services/IConfigurationService";
import { ConfigurationService } from "../../../common/core/services/configurationService";
import { IHemaConfiguration } from "../../IHemaConfiguration";
import { BusinessRuleService } from "./businessRuleService";
import { IBusinessRuleService } from "./interfaces/IBusinessRuleService";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { PartsBasket, PartsBasket as PartsBasketBusinessModel } from "../models/partsBasket";
import { StringHelper } from "../../../common/core/stringHelper";
import { BaseException } from "../../../common/core/models/baseException";
import { IAdaptPartSelected } from "../../api/models/adapt/IAdaptPartSelected";
import { ConsumableService } from "./consumableService";
import { IConsumableService } from "./interfaces/IConsumableService";
import { ConsumablePart } from "../models/consumablePart";
import { ICatalogService } from "./interfaces/ICatalogService";
import { CatalogService } from "./catalogService";
import * as bignumber from "bignumber";
import { IQuoteCustomerDetails } from "../../api/models/adapt/IQuoteCustomerDetails";
import { AppConstants } from "../../../appConstants";
import { IToastItem } from "../../../common/ui/elements/models/IToastItem";
import { Guid } from "../../../common/core/guid";
import { ITrainingModeConfiguration } from "./interfaces/ITrainingModeConfiguration";
import { BridgeDiagnostic } from "../models/bridgeDiagnostic";
// import { ConsumablesBasket } from "../models/consumablesBasket";

/**
 * Business service to communicate with Adapt database, work out parts availability and safety risks for appliance
 */
@inject(BridgeApiService, JobService, EventAggregator, PartFactory, ConfigurationService, BusinessRuleService, ConsumableService, CatalogService)

export class BridgeBusinessService implements IBridgeBusinessService {

    private _bridgeApiService: IBridgeApiService;
    private _jobService: IJobService;
    private _eventAggregator: EventAggregator;
    private _partFactory: IPartFactory;
    private _configurationService: IConfigurationService;
    private _businessRuleService: IBusinessRuleService;
    private _consumableService: IConsumableService;
    private _catalogService: ICatalogService;

    private _monitorAdaptPartsSelectedIntervalId: number;
    private _isPartConsumableStockReferencePrefixes: string[];
    private _logger: Logging.Logger;

    constructor(bridgeApiService: IBridgeApiService, jobService: IJobService, eventAggregator: EventAggregator, partFactory: IPartFactory,
        configurationService: IConfigurationService, businessRuleService: IBusinessRuleService,
        consumableService: IConsumableService, catalogService: ICatalogService) {
        this._bridgeApiService = bridgeApiService;
        this._eventAggregator = eventAggregator;
        this._jobService = jobService;
        this._partFactory = partFactory;
        this._configurationService = configurationService;
        this._businessRuleService = businessRuleService;
        this._consumableService = consumableService;
        this._catalogService = catalogService;
        this._logger = Logging.getLogger("BridgeBusinessService");

        this._monitorAdaptPartsSelectedIntervalId = -1;
    }

    public initialise(): Promise<void> {

        // want to generate customer qoute text file on job status change (arrived state)
        let isTrainingMode = this._configurationService.getConfiguration<ITrainingModeConfiguration>().trainingMode;
        if (!isTrainingMode) {
            this._eventAggregator.subscribe(JobServiceConstants.JOB_STATE_CHANGED, () => this.handleJobStateChanged());
        }

        return this.buildBusinessRules().then(() => {
            this.stopStartAdaptMonitoring(true);
        }).catch((error: BaseException) => {
            this._logger.error(error && error.toString());
        });
    }

    public stopStartAdaptMonitoring(startMonitoring: boolean): void {

        let hemaConfiguration = this._configurationService.getConfiguration<IHemaConfiguration>();
        let isPollingSwitchedOn = hemaConfiguration && !!hemaConfiguration.adaptPollingInterval;

        if (startMonitoring && isPollingSwitchedOn) {
            this._monitorAdaptPartsSelectedIntervalId = Threading.startTimer(() => this.monitorAdaptPartsSelectedElapsed(), hemaConfiguration.adaptPollingInterval);
        } else {
            if (this._monitorAdaptPartsSelectedIntervalId !== -1) {
                Threading.stopTimer(this._monitorAdaptPartsSelectedIntervalId);
                this._monitorAdaptPartsSelectedIntervalId = -1;
            }
        }
    }

    public monitorAdaptPartsSelectedElapsed(): Promise<void> {

        let isPartConsumable = (part: IAdaptPartSelected) => {
            return part
                && part.stockReferenceId
                && this._isPartConsumableStockReferencePrefixes
                && this._isPartConsumableStockReferencePrefixes.some(prefix => StringHelper.startsWith(part.stockReferenceId, prefix));
        };

        return Promise.all<IAdaptPartsSelectedResponse, Job | null>([
            this._bridgeApiService.getPartsSelected(),
            this._jobService.getActiveJobId()
                .then(activeJobId => activeJobId ? this._jobService.getJob(activeJobId) : null)
        ])
            .then(([partsSelected, activeJob]) => {

                this._logger.debug("parts located in adapt", [JSON.stringify(partsSelected)]);

                if (partsSelected && partsSelected.parts && partsSelected.parts.length) {
                    if (activeJob && activeJob.state === JobState.arrived) {

                        this._logger.debug("add parts basket, activeJob status", [JSON.stringify(activeJob)]);

                        return this.addToPartsBasket(partsSelected.parts, activeJob);
                    } else {

                        this._logger.debug("add consumable parts basket", []);

                        let consumableParts = partsSelected.parts.filter(x => isPartConsumable(x));
                        if (consumableParts && consumableParts.length) {
                            return this.addToConsumableBasket(consumableParts);                                
                        }
                    }
                }

                this._logger.debug("no parts found from adapt", []);
                return undefined;
            })
            .catch((error: BaseException) => {
                this._logger.error(error && error.toString());
                this.stopStartAdaptMonitoring(false);

                this._eventAggregator.publish(AppConstants.APP_TOAST_ADDED, <IToastItem>{
                    id: Guid.newGuid(),
                    title: "Adapt Connection Problem",
                    style: "warning",
                    content: "Could not check for parts from Adapt. Ensure adapt and the Bridge Service are running.",
                    dismissTime: 0
                });
            });
    }

    /**
     * gets the user information specified in the adapt settings
     * @returns {string}
     *
     * Note: 22/11/2017 - this method returns a set of details describing the user (name, phone, region, etc) from the ADAPT application.
     *  These settings from ADAPT include working sector, region and patch.  EWB is also interested in these three settings.
     *  The problem is that the values ADAPT keeps are in a different format to how EWB keeps them, hence there is no usefulness
     *  in using this endpoint at the current time.  This may change in the future, hence this method is left in.
     *
     */
    public getUserSettings(): Promise<UserSettings> {
        return this._bridgeApiService.getUserSettings();
    }

    /**
     * used to export customer details, generates a post JSON body with customer details for api call to bridge service
     * @param jobId
     * @param hasTobeActiveState - if want to manually invoke (e.g. clicking button) set to false
     * @returns {Promise<Job>}
     */
    public exportCustomerDetails(jobId: string, hasTobeActiveState: boolean = true): Promise<void> {

        let req = <IQuoteCustomerDetails>{};

        return this._jobService.getJob(jobId).then(job => {

            if (!job) {
                return Promise.resolve();
            }

            if (hasTobeActiveState && job.state !== JobState.arrived) {
                return Promise.resolve();
            }

            const { id, contact, customerContact, premises } = job;

            if (contact) {
                const { lastName: custName = "", workPhone: custWorkPhone, homePhone: custHomePhone } = contact;

                req.wMISnumber = id;
                req.workcontactnumber = custWorkPhone;
                req.homecontactnumber = custHomePhone;
                req.custName = custName;
            }

            if (customerContact) {
                const { lastName: billName = "", address: billAddress } = customerContact;

                req.billName = billName;

                if (billAddress) {
                    const {
                        line: billLine, premisesName: billHouseName, houseNumber: billHouseNumber, town: billTown,
                        county: billCounty, postCodeIn: billPostCodeIn, postCodeOut: billPostCodeOut
                    } = billAddress;

                    req.billhousenumber = billHouseNumber;
                    req.billhousename = billHouseName;
                    req.billcity = billCounty;
                    req.billsuburb = billTown;
                    req.billpostin = billPostCodeIn;
                    req.billpostout = billPostCodeOut;

                    if (billLine && billLine.length > 0) {
                        if (billLine[0]) {
                            req.billstreet1 = billLine[0];
                        }
                        if (billLine[1]) {
                            req.billstreet2 = billLine[1];
                        }
                    }
                }
            }

            if (premises) {
                const { address: jobAddress } = premises;

                if (jobAddress) {
                    const {
                        line: jobLine, premisesName: jobHouseName, houseNumber: jobHouseNumber, town: jobTown,
                        county: jobCounty, postCodeIn: jobPostCodeIn, postCodeOut: jobPostCodeOut
                    } = jobAddress;

                    req.jobhousenumber = jobHouseNumber;
                    req.jobhousename = jobHouseName;
                    req.jobcity = jobCounty;
                    req.jobsuburb = jobTown;
                    req.jobpostin = jobPostCodeIn;
                    req.jobpostout = jobPostCodeOut;

                    if (jobLine && jobLine.length > 0) {
                        if (jobLine[0]) {
                            req.jobaddress1 = jobLine[0];
                        }
                        if (jobLine[1]) {
                            req.jobaddress2 = jobLine[1];
                        }
                    }
                }
            }

            return this._bridgeApiService.postCustomerDetails(req)
                .catch(err => {

                    const content = "Could not export customer details. Check Bridge Service and Quote folder exists";
                    const title = "Customer Export Failure";

                    this._eventAggregator.publish(AppConstants.APP_TOAST_ADDED, <IToastItem>{
                        id: Guid.newGuid(),
                        title,
                        style: "warning",
                        content,
                        dismissTime: 0
                    });

                    this._logger.error(content, err);

                    return Promise.resolve(null);
                });
        });
    }

    /**
     * Call api to get appliance information, first get models, then use model id to get model attributes
     * @param applianceGCCode
     * @returns {Promise<ExternalApplianceAppModel>}
     */
    public getApplianceInformation(applianceGCCode: string): Promise<ExternalApplianceAppModel> {
        let formattedGCCode = this.formatGCCode(applianceGCCode);

        return this._bridgeApiService.getModels(formattedGCCode)
            .then((response: IAdaptModelResponse) => {
                if (response && response.models && response.models.length) {

                    // there can be more than one model for the gc code
                    let getModelCalls = response.models.map(model => this._bridgeApiService.getModelAttributes(model.imModKey));

                    return Promise.all(getModelCalls).then(result => {

                        let apiAttributes: IAdaptModelAttribute[] = [];
                        result.forEach(r => apiAttributes.push(...r.attributes));

                        let representativeModelForResult = this.getRepresentativeDescriptionAndManufacturer(response.models);
                        return this.mapApiAttributesToModel(apiAttributes, representativeModelForResult);

                    }).catch((error) => {
                        throw new BusinessException(this, "adaptBusinessService", `could not get product with gc no ${formattedGCCode} from adapt`, [formattedGCCode], error);
                    });

                }
                return Promise.resolve(new ExternalApplianceAppModel(false));
            })
            .catch(error => {
                throw new BusinessException(this, "adaptBusinessService.getApplianceInformation", "could not get product with gc no '{0}'", [applianceGCCode], error);
            });
    }

    /**
     * formats the plain gcCode into the formatted one for adapt
     * @returns {string}
     * @param gcCode
     */
    public formatGCCode(gcCode: string): string {
        if (gcCode.length === 7) {
            return gcCode.substr(0, 2) + "-" + gcCode.substr(2, 3) + "-" + gcCode.substr(5, 2);
        } else {
            return gcCode;
        }
    }

    public buildBusinessRules(): Promise<void> {
        return this._businessRuleService.getQueryableRuleGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(PartsBasket)))
            .then((ruleGroup) => {
                let consumableRules = ruleGroup.getBusinessRule<string>("isPartConsumableStockReferencePrefix");
                if (consumableRules) {
                    this._isPartConsumableStockReferencePrefixes = consumableRules.split(",");
                }
            });
    }

    public async getDiagnostic(): Promise<BridgeDiagnostic> {

        let diagnosticSummary = new BridgeDiagnostic();
        diagnosticSummary.timestamp = new Date();

        try {
            await this._bridgeApiService.getStatusOk();

            const version = await this._bridgeApiService.getVersion();
            diagnosticSummary.statusOk = true;
            diagnosticSummary.version = version;

        } catch (ex) { }
        return diagnosticSummary;
    }

    private handleJobStateChanged(): Promise<void> {
        return this._jobService.getActiveJobId()
            .then(activeJobId => activeJobId
                ? this.exportCustomerDetails(activeJobId)
                : Promise.resolve() // the job may have just been completed, so activeJobId is null
            );
    }

    private getMaxDateFromTimestamps(timestamps: string[]): Date {
        let dates = timestamps.map(timestamp => new Date(timestamp));
        return new Date(Math.max.apply(null, dates));
    }

    private isRecentPart(partTimestamp: string, lastBasketDate: Date): boolean {
        return !lastBasketDate || moment(partTimestamp).isAfter(lastBasketDate);
    }

    private addToConsumableBasket(validConsumablePartsSelected: IAdaptPartSelected[]): Promise<void> {
        return this._consumableService.getConsumablesBasket()
            .then((basket) => {
                if (basket) {
                    let validPartsSelected = validConsumablePartsSelected.filter(x => this.isRecentPart(x.timestamp, basket.lastPartGatheredTime));
                    basket.lastPartGatheredTime = this.getMaxDateFromTimestamps(validConsumablePartsSelected.map(a => a.timestamp));

                    if (validPartsSelected && validPartsSelected.length) {
                        return this._consumableService.saveBasket(basket)
                            .then(() => {
                                let promises = validPartsSelected.map(validPart => {
                                    let part = this._partFactory.createPartBusinessModelFromAdaptApiModel(validPart);
                                    return this._consumableService.addConsumableToBasket(new ConsumablePart(part.stockReferenceId, part.description, part.quantity));
                                });

                                return Promise.all(promises);                                    
                            })
                            .then(() => {
                                this._eventAggregator.publish(AdaptBusinessServiceConstants.ADAPT_PARTS_SELECTED, validPartsSelected.map(p => p.stockReferenceId));
                            });                      
                    }
                }
                return undefined;
            });
    }

    private addToPartsBasket(partsSelected: IAdaptPartSelected[], job: Job): Promise<void> {
        if (!job.partsDetail) {
            job.partsDetail = new PartsDetail();
        }

        if (!job.partsDetail.partsBasket) {
            job.partsDetail.partsBasket = new PartsBasketBusinessModel();
        }

        if (!job.partsDetail.partsBasket.lastPartGatheredTime) {
            job.partsDetail.partsBasket.lastPartGatheredTime = job.onsiteTime;
        }

        let validPartsSelected = partsSelected.filter(x => this.isRecentPart(x.timestamp, job.partsDetail.partsBasket.lastPartGatheredTime));
        job.partsDetail.partsBasket.lastPartGatheredTime = this.getMaxDateFromTimestamps(partsSelected.map(a => a.timestamp));

        if (validPartsSelected && validPartsSelected.length) {
            let partBusinessModels: PartBusinessModel[] = [];

            let partBusinessModelPromises: Promise<void>[] = [];

            partBusinessModelPromises = validPartsSelected.map((partSelected) => {
                return this._catalogService.getGoodsType(partSelected.stockReferenceId)
                    .then((catalogLookedUpPart) => {
                        let partBusinessModel = this._partFactory.createPartBusinessModelFromAdaptApiModel(partSelected);

                        if (catalogLookedUpPart) {
                            let catalogLookedUpPartPrice = catalogLookedUpPart.charge
                                ? new bignumber.BigNumber(catalogLookedUpPart.charge / 100)
                                : new bignumber.BigNumber(0);

                            if (catalogLookedUpPartPrice !== partBusinessModel.price) {
                                partBusinessModel.isCatalogPriceDifferentFromAdapt = true;
                                partBusinessModel.price = catalogLookedUpPartPrice;
                            }
                        }

                        partBusinessModels.push(partBusinessModel);
                    });
            });

            return Promise.all(partBusinessModelPromises)
                .then(() => {
                    job.partsDetail.partsBasket.partsToOrder.push(...partBusinessModels);
                    job.partsDetail.partsBasket.dataState = DataState.notVisited;

                    // todo undecided on approach, if on parts basket page should we persist to job, so that undo can work?
                    // if on partsBasketPage then publish event otherwise setJob and publish event
                    return this._jobService.setJob(job)
                        .then(() => {
                            this._eventAggregator.publish(AdaptBusinessServiceConstants.ADAPT_PARTS_SELECTED,
                                partBusinessModels.map(part => part.id)
                            );
                            this._eventAggregator.publish(JobServiceConstants.JOB_DATA_STATE_CHANGED);
                        });
                })
                .catch((error) => {
                    // couldn't check the part lookup prices
                    throw new BusinessException(this, "adaptBusinessService.savePartsBasket", "couldn't check the part lookup prices for parts added via adapt", null, error);
                });
        } else {
            return undefined;
        }
    }

    private getRepresentativeDescriptionAndManufacturer(models: IAdaptModel[]): { description: string, manufacturer: string } {
        // todo: is there any logic that we need to apply to get the best model
        //  e.g. if there is more than one model in the result set, should be return a comma delimited list of all (distinct) descriptions.
        return models[0];
    }

    private mapApiAttributesToModel(apiAttributes: IAdaptModelAttribute[], descriptionAndManufacturer: { description: string, manufacturer: string }): ExternalApplianceAppModel {

        let hasAttribute = (attr: IAdaptModelAttribute) => apiAttributes.some(apiAttr => apiAttr.attributeType === attr.attributeType
            && (attr.attributeValue === undefined || (apiAttr.attributeValue === attr.attributeValue))
        );

        let result = new ExternalApplianceAppModel(true);

        result.description = descriptionAndManufacturer.description;
        result.manufacturer = descriptionAndManufacturer.manufacturer;

        result.ceased = hasAttribute(AdaptAttributeConstants.CEASED_PRODUCTION);
        result.safetyNotice = hasAttribute(AdaptAttributeConstants.SAFETY_NOTICE);

        // since there can be more than one model for a gc, need to establish 'worst case' to report
        // worts case precedence: FOLIO, WITHDRAWN, REDUCED_PARTS_LIST, SERVICE_LISTED, NA
        if (hasAttribute(AdaptAttributeConstants.FOLIO)) {
            result.availabilityStatus = AdaptAvailabilityAttributeType.FOLIO;
        } else if (hasAttribute(AdaptAttributeConstants.WITHDRAWN)) {
            result.availabilityStatus = AdaptAvailabilityAttributeType.WITHDRAWN;
        } else if (hasAttribute(AdaptAttributeConstants.REDUCED_PARTS_LIST)) {
            result.availabilityStatus = AdaptAvailabilityAttributeType.REDUCED_PARTS_LIST;
        } else if (hasAttribute(AdaptAttributeConstants.SERVICE_LISTED)) {
            result.availabilityStatus = AdaptAvailabilityAttributeType.SERVICE_LISTED;
        } else {
            result.availabilityStatus = AdaptAvailabilityAttributeType.NA;
        }

        return result;
    }
}
