/// <reference path="../../../../typings/app.d.ts" />
import * as Logging from "aurelia-logging";
import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { IEngineerService } from "./interfaces/IEngineerService";
import { FftService } from "../../api/services/fftService";
import { IFFTService } from "../../api/services/interfaces/IFFTService";
import { IStorageService } from "./interfaces/IStorageService";
import { StorageService } from "./storageService";
import { Engineer } from "../models/engineer";
import { BusinessException } from "../models/businessException";
import { IBusinessRuleService } from "./interfaces/IBusinessRuleService";
import { StringHelper } from "../../../common/core/stringHelper";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { BusinessRuleService } from "./businessRuleService";
import { IEngineerStatusRequest } from "../../api/models/fft/engineers/IEngineerStatusRequest";
import { DateHelper } from "../../core/dateHelper";
import { EngineerServiceConstants } from "./constants/engineerServiceConstants";
import { CatalogService } from "./catalogService";
import { ICatalogService } from "./interfaces/ICatalogService";
import { IFieldOperativeStatus } from "../models/reference/IFieldOperativeStatus";
import { IWhoAmIAttributes } from "../../api/models/fft/whoAmI/IWhoAmIAttributes";
import { IConfigurationService } from "../../../common/core/services/IConfigurationService";
import { ConfigurationService } from "../../../common/core/services/configurationService";
import { IHemaConfiguration } from "../../IHemaConfiguration";
import { UnAuthorisedException } from "../models/unAuthorisedException";
import { WhoAmIServiceConstants } from "./constants/whoAmIServiceConstants";
import { IWhoAmI } from "../../api/models/fft/whoAmI/IWhoAmI";
import { WorkRetrievalServiceConstants } from "./constants/workRetrievalServiceConstants";
import { AnalyticsConstants } from "../../../common/analytics/analyticsConstants";
import * as moment from "moment";
import { ILabelService } from "./interfaces/ILabelService";
import { LabelService } from "./labelService";
import { Job } from "../models/job";
import { IAmIContractEngineer } from "../../api/models/fft/engineers/IAmIContractEngineer";
import { ApiException } from "../../../common/resilience/apiException";
import { NumberHelper } from "../../core/numberHelper";

const MAX_EMPLOYEE_ID_CHARACTERS: number = 7;
const EMPLOYEE_ID_PREFIX_CHARACTER: string = "0";
const { WHO_AM_I_EMPLOYEEID_ATTRIBUTE, WHO_AM_I_GIVENNAME_ATTRIBUTE, WHO_AM_I_SN_ATTRIBUTE, WHO_AM_I_TELEPHONE_NUMBER_ATTRIBUTE } = WhoAmIServiceConstants;
const ENGINNER_STATE_ELEMENT = "EngineerState";

@inject(StorageService, FftService, EventAggregator, CatalogService, BusinessRuleService, ConfigurationService, LabelService)
export class EngineerService implements IEngineerService {

    public static OBTAINING_MATS_STATUS: string = "11";
    public static ENGINEER_WORKING_STATUS: string = "internalWorking";
    public isPartCollectionInProgress: boolean;

    private _storageService: IStorageService;
    private _fftService: IFFTService;
    private _eventAggregator: EventAggregator;
    private _catalogService: ICatalogService;
    private _businessRuleService: IBusinessRuleService;
    private _configurationService: IConfigurationService;
    private _labelService: ILabelService;

    private _engineerStatuss: IFieldOperativeStatus[];

    private _signOnId: string;
    private _signOffId: string;

    private _logger: Logging.Logger;

    constructor(storageService: IStorageService,
        fftService: IFFTService,
        eventAggregator: EventAggregator,
        catalogService: ICatalogService,
        businessRulesService: IBusinessRuleService,
        configurationService: IConfigurationService,
        labelService: ILabelService) {
        this._storageService = storageService;
        this._fftService = fftService;
        this._eventAggregator = eventAggregator;
        this._catalogService = catalogService;
        this._businessRuleService = businessRulesService;
        this._configurationService = configurationService;
        this._labelService = labelService;

        this._logger = Logging.getLogger("EngineerService");
        this.isPartCollectionInProgress = false;
    }

    public async initialise(hasWhoAmISucceeded: boolean, whoAmI?: IWhoAmI): Promise<void> {

        let throwUnauthorised = (message: string, ...args: any[]) => {
            throw new UnAuthorisedException(this, "initialise", message, null, args);
        };

        let getWhoAmIAttributeValue = (arr: IWhoAmIAttributes[], propName: string) => {
            let attribute = (arr || []).filter(item => Object.keys(item).length === 1 && Object.keys(item)[0] === propName);
            return attribute.length ? attribute[0][propName] : "";
        };

        let isAnAllowedRolePresent = (actualRoles: string[], allowedRoles: string[]) => {
            return actualRoles.some(actualRole =>
                allowedRoles.some(allowedRole =>
                    allowedRole.toLowerCase() === actualRole.toLowerCase()
                )
            );
        };

        let tidyEngineerId = (input: string) => {
            let numericCharacters = (input || "").replace(/\D/g, "");
            return numericCharacters
                ? StringHelper.padLeft(numericCharacters, EMPLOYEE_ID_PREFIX_CHARACTER, MAX_EMPLOYEE_ID_CHARACTERS)
                : undefined;
        };

        let config = this._configurationService.getConfiguration<IHemaConfiguration>();
        let allowedActiveDirectoryRoles = (config && config.activeDirectoryRoles) || [];

        if (!allowedActiveDirectoryRoles.length) {
            throwUnauthorised("Cannot find activeDirectoryRoles", config);
        }

        let engineer = await this.getCurrentEngineer();
        let isAlreadySignedOn = engineer && engineer.isSignedOn;

        if (!hasWhoAmISucceeded) {
            if (isAlreadySignedOn) {
                // special case: if the user a) is already signed in (the app was previously closed/crashed before end of day was triggered)
                // and b) we have no connectivity, we still authenticate the user
                return;
            } else {
                throwUnauthorised("Cannot currently authorise your account as the authentication server is not responding.", config);
            }
        }

        if (!whoAmI || !whoAmI.attributes || !whoAmI.roles) {
            throwUnauthorised("There is a problem with the response from the authentication server.", whoAmI);
        }

        let rawEngineerId = getWhoAmIAttributeValue(whoAmI.attributes, WHO_AM_I_EMPLOYEEID_ATTRIBUTE);
        if (!rawEngineerId) {
            throwUnauthorised(`Your LAN user account does not have the attribute ${WHO_AM_I_EMPLOYEEID_ATTRIBUTE}.`);
        }

        let engineerId = tidyEngineerId(rawEngineerId);
        if (!engineerId) {
            throwUnauthorised("Unable to determine your WMIS engineer id from active directory.", rawEngineerId);
        }

        if (!isAnAllowedRolePresent(whoAmI.roles, allowedActiveDirectoryRoles)) {
            throwUnauthorised(
                `Your LAN user account does not have one of the required roles ${allowedActiveDirectoryRoles.join(", ")}.`,
                allowedActiveDirectoryRoles);
        }

        if (isAlreadySignedOn) {
            engineer.roles = whoAmI.roles;
        } else {
            engineer = new Engineer();
            engineer.isSignedOn = false;
            engineer.status = undefined;
            engineer.lanId = whoAmI.userid;
            engineer.id = engineerId;
            engineer.firstName = getWhoAmIAttributeValue(whoAmI.attributes, WHO_AM_I_GIVENNAME_ATTRIBUTE);
            engineer.lastName = getWhoAmIAttributeValue(whoAmI.attributes, WHO_AM_I_SN_ATTRIBUTE);
            engineer.phoneNumber = getWhoAmIAttributeValue(whoAmI.attributes, WHO_AM_I_TELEPHONE_NUMBER_ATTRIBUTE);
            engineer.roles = whoAmI.roles;
        }

        await this._storageService.setEngineer(engineer);
    }

    public getCurrentEngineer(): Promise<Engineer> {
        return this._storageService.getEngineer()
            .catch((error) => {
                throw new BusinessException(this, "getCurrentEngineer", "Getting current engineer", null, error);
            });
    }

    public getAllStatus(): Promise<IFieldOperativeStatus[]> {
        return this._engineerStatuss ?
            Promise.resolve(this._engineerStatuss) :
            this._catalogService.getFieldOperativeStatuses()
                .then((data) => {
                    this._engineerStatuss = data;
                    return this._engineerStatuss;
                });
    }

    public setStatus(engineerStatus: string): Promise<void> {
        return this.loadBusinessRules()
            .then(() => this._storageService.getEngineer())
            .then((engineer) => {
                this.addToAnalytics(engineerStatus, engineer);
                return engineer;
            })
            .then((engineer) => {
                let oldIsSignedOn = engineer.isSignedOn;
                let oldStatus = engineer.status;
                let oldIsWorking = engineer.status === undefined;
                let newIsWorking = engineerStatus === undefined;

                if (engineerStatus === this._signOnId) {
                    engineer.isSignedOn = true;
                    engineer.status = undefined;
                } else if (engineerStatus === this._signOffId) {
                    engineer.isSignedOn = false;
                    engineer.status = undefined;
                    engineer.isContractor = undefined;
                } else {
                    engineer.status = engineerStatus;
                }

                if (engineer.isSignedOn !== oldIsSignedOn || engineer.status !== oldStatus) {
                    // "isWorking" is a made-up internal-only status, (and so engineerStatus is undefined)
                    //  so do not send an update to the API
                    return (newIsWorking ? Promise.resolve() : this.sendStatusOrThrow(engineer, engineerStatus))
                        // only save if the sendStatus API call has been successful - otherwise when the end of day retry functionality
                        //  passes through here on retry attempts, it will not trigger as no change in engineer values will be seen
                        //  as the failed initial atempt changes would have got saved.
                        .then(() => {
                            return this._storageService.getJobsToDo()
                                .then(jobs => {
                                    if (jobs.some(job => Job.isActive(job))) {
                                        engineer.status = undefined;
                                        newIsWorking = true;
                                    }
                                });
                        })
                        .then(() => this._storageService.setEngineer(engineer))
                        .then(() => {
                            let shouldPublishSignedOnChanged = engineer.isSignedOn !== oldIsSignedOn;
                            let shouldPublishIsWorkingChanged = newIsWorking !== oldIsWorking;
                            let shouldPublishStatusChanged = shouldPublishSignedOnChanged || shouldPublishIsWorkingChanged || engineer.status !== oldStatus;
                            let shouldPublishWorkRetrieval = (shouldPublishSignedOnChanged && engineer.isSignedOn)
                                || (shouldPublishIsWorkingChanged && newIsWorking);

                            if (shouldPublishStatusChanged) {
                                this._eventAggregator.publish(EngineerServiceConstants.ENGINEER_STATUS_CHANGED);
                            }
                            if (shouldPublishSignedOnChanged) {
                                this._eventAggregator.publish(EngineerServiceConstants.ENGINEER_SIGNED_ON_CHANGED, engineer.isSignedOn);
                            }
                            if (shouldPublishIsWorkingChanged) {
                                this._eventAggregator.publish(EngineerServiceConstants.ENGINEER_WORKING_CHANGED);
                            }
                            if (shouldPublishWorkRetrieval) {
                                this._eventAggregator.publish(WorkRetrievalServiceConstants.REQUEST_WORK_AND_REFRESH_WORK_LIST);
                            }
                        });

                } else {
                    return undefined;
                }
            });
    }

    public getStatus(): Promise<string> {
        return this._storageService.getEngineer()
            .then((engineer) => {
                if (engineer) {
                    return engineer.status;
                } else {
                    return undefined;
                }
            });
    }

    public isWorking(): Promise<boolean> {
        return this._storageService.getEngineer()
            .then((engineer) => {
                if (engineer) {
                    return engineer.isSignedOn && engineer.status === undefined;
                } else {
                    return false;
                }
            });
    }

    public isSignedOn(): Promise<boolean> {
        return this._storageService.getEngineer()
            .then((engineer) => {
                if (engineer) {
                    return engineer.isSignedOn;
                } else {
                    return false;
                }
            });
    }

    public async getEngineerStateText(state: string): Promise<string> {
        await this.loadBusinessRules();
        const statuses = await this.getAllStatus();

        if (statuses && statuses.length > 0) {
            if (statuses && statuses.find(x => x.fieldOperativeStatus === state)) {
                return statuses.find(x => x.fieldOperativeStatus === state).fieldOperativeStatusDescription;
            }
            const labels = await this.getLabels();
            if (labels) {

                if (state === "internalWorking") {
                    return ObjectHelper.getPathValue(labels, "working");
                }

                if (state === "internalNotWorking") {
                    return ObjectHelper.getPathValue(labels, "notWorking");
                }

                if (state === this._signOnId) {
                    return ObjectHelper.getPathValue(labels, "signOn");
                } else if (state === this._signOffId) {
                    return ObjectHelper.getPathValue(labels, "signOff");
                }
                return state;
            }
            return undefined;
        }
        return undefined;
    }

    public async overrideEngineerId(engineer: Engineer): Promise<Engineer> {
        if (!!engineer && !!engineer.isContractor) {
            return engineer;
        }

        let contractEngineerResponse: IAmIContractEngineer;
        try {
            contractEngineerResponse = await this._fftService.getAmIContractEngineerInfo(engineer.id);
        } catch (error) {
            if (error && error instanceof ApiException) {
                let statusCode =  (error as ApiException).httpStatusCode;

                if (!!statusCode && statusCode.indexOf("404") >= 0) {
                    return engineer;
                }
            }

            throw new BusinessException(this, "overrideEngineerId", "Unable to get user details (contract engineer check)'{0}'.", [engineer.id], error);
        }

        const { engineerId: wmisPayrollId, workdayPayrollId, contractorInd } = contractEngineerResponse;

        if (StringHelper.isEmptyOrUndefinedOrNull(wmisPayrollId)
            || NumberHelper.isNullOrUndefined(workdayPayrollId)
            || StringHelper.isEmptyOrUndefinedOrNull(contractorInd)) {
            throw new BusinessException(this, "overrideEngineerId", "Invalid contract engineer's data received", null, null);
        }

        engineer.id = wmisPayrollId;
        engineer.isContractor = contractorInd;
        await this._storageService.setEngineer(engineer);
        return engineer;
    }

    private loadBusinessRules(): Promise<void> {
        return this._signOnId && this._signOffId ?
            Promise.resolve() :
            this._businessRuleService.getRuleGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(this)))
                .then((businessRules) => {
                    this._signOnId = ObjectHelper.getPathValue(businessRules, "signOnId");
                    this._signOffId = ObjectHelper.getPathValue(businessRules, "signOffId");

                    if (!StringHelper.isString(this._signOnId) || !StringHelper.isString(this._signOffId)) {
                        throw new BusinessException(this, "loadBusinessRules", "Unable to load signOn and signOff business rules", null, null);
                    }
                });
    }

    private sendStatusOrThrow(signedOnEngineer: Engineer, engineerStatus: string): Promise<void> {
        let engineerStatusReport = <IEngineerStatusRequest>{
            data: {
                timestamp: DateHelper.toJsonDateTimeString(new Date()),
                statusCode: engineerStatus
            }
        };

        if (engineerStatus === this._signOffId) {
            return this._fftService.engineerStatusUpdateEod(signedOnEngineer.id, engineerStatusReport)
                .catch((error) => {
                    this._logger.error(new BusinessException(this, "setStatusEod", "Setting status '{0}' for engineer '{1}'", [engineerStatus, signedOnEngineer.id], error).toString());
                    // we need to feed back to the user if the end-of-day has not gone: the calling code will handle this exception.
                    throw error;
                });
        } else {
            return this._fftService.engineerStatusUpdate(signedOnEngineer.id, engineerStatusReport)
                .catch((error) => {
                    this._logger.error(new BusinessException(this, "setStatus", "Setting status '{0}' for engineer '{1}'", [engineerStatus, signedOnEngineer.id], error).toString());
                });
        }
    }

    private async addToAnalytics(state: string, engineer: Engineer): Promise<void> {
        try {
            const stateText = await this.getEngineerStateText(state);
            if (stateText && engineer && engineer.id) {
                this._eventAggregator.publish(AnalyticsConstants.ANALYTICS_EVENT, {
                    category: AnalyticsConstants.ENGINNER_STATE_CHANGED,
                    action: stateText,
                    label: moment().format(AnalyticsConstants.DATE_TIME_FORMAT),
                    metric: AnalyticsConstants.METRIC
                });
            }
        } catch {
            // do nothing
        }
    }

    private getLabels(): Promise<{ [key: string]: string }> {
        return this._labelService.getGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(ENGINNER_STATE_ELEMENT)));
    }
}
