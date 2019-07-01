/// <reference path="../../../../typings/app.d.ts" />

import {inject} from "aurelia-framework";
import {IPropertySafetyService} from "./interfaces/IPropertySafetyService";
import {IJobService} from "./interfaces/IJobService";
import {JobService} from "./jobService";
import {PropertyGasSafetyDetail as PropertyGasSafetyDetailBusinessModel} from "../models/propertyGasSafetyDetail";
import {BusinessException} from "../models/businessException";
import {PropertyElectricalSafetyDetail} from "../models/propertyElectricalSafetyDetail";
import {PropertyUnsafeDetail} from "../models/propertyUnsafeDetail";
import {IBusinessRuleService} from "./interfaces/IBusinessRuleService";
import {BusinessRuleService} from "./businessRuleService";
import {UnsafeReason} from "../models/unsafeReason";
import {PropertySafety} from "../models/propertySafety";
import {QueryableBusinessRuleGroup} from "../models/businessRules/queryableBusinessRuleGroup";
import {ObjectHelper} from "../../../common/core/objectHelper";
import {StringHelper} from "../../../common/core/stringHelper";
import { DataStateManager } from "../../common/dataStateManager";
import { IDataStateManager } from "../../common/IDataStateManager";

@inject(JobService, BusinessRuleService, DataStateManager)
export class PropertySafetyService implements IPropertySafetyService {
    private _jobService: IJobService;
    private _businessRuleService: IBusinessRuleService;

    private _businessRules: QueryableBusinessRuleGroup;
    private _dataStateManager: IDataStateManager;

    constructor(jobService: IJobService, businessRuleService: IBusinessRuleService, dataStateManager: IDataStateManager) {
        this._jobService = jobService;
        this._businessRuleService = businessRuleService;
        this._dataStateManager = dataStateManager;
    }

    public getPropertySafetyDetails(jobId: string): Promise<PropertySafety> {
        return this._jobService.getJob(jobId).then(job => {
            return job.propertySafety;
        });
    }

    public saveGasSafetyDetails(jobId: string,
                                safetyDetail: PropertyGasSafetyDetailBusinessModel,
                                unsafeDetail: PropertyUnsafeDetail): Promise<void> {
        return this._jobService.getJob(jobId).then(job => {
            if (job) {
                if (!job.propertySafety.propertyGasSafetyDetail) {
                    job.propertySafety.propertyGasSafetyDetail = new PropertyGasSafetyDetailBusinessModel();
                }

                if (!job.propertySafety.propertyUnsafeDetail) {
                    job.propertySafety.propertyUnsafeDetail = new PropertyUnsafeDetail();
                }
                Object.assign(job.propertySafety.propertyGasSafetyDetail, safetyDetail);
                Object.assign(job.propertySafety.propertyUnsafeDetail, unsafeDetail);
                return this._jobService.setJob(job)
                    .catch(() => {
                        throw new BusinessException(this, "saveGasSafetyDetails", "error saving property gas safety detail", null, null);
                    });
            } else {
                throw new BusinessException(this, "saveGasSafetyDetails", "no current job selected", null, null);
            }
        });
    }

    public saveElectricalSafetyDetails(jobId: string,
                                       safetyDetail: PropertyElectricalSafetyDetail,
                                       unsafeDetail: PropertyUnsafeDetail): Promise<void> {
        return this._jobService.getJob(jobId).then(job => {
            if (job) {
                if (!job.propertySafety.propertyElectricalSafetyDetail) {
                    job.propertySafety.propertyElectricalSafetyDetail = new PropertyElectricalSafetyDetail();
                }
                Object.assign(job.propertySafety.propertyElectricalSafetyDetail, safetyDetail);
                if (!job.propertySafety.propertyUnsafeDetail) {
                    job.propertySafety.propertyUnsafeDetail = new PropertyUnsafeDetail();
                }
                Object.assign(job.propertySafety.propertyUnsafeDetail, unsafeDetail);

                return this._dataStateManager.updateAppliancesDataState(job)
                    .then(() => this._jobService.setJob(job))
                    .catch(() => {
                        throw new BusinessException(this, "saveElectricalSafetyDetails", "error saving electrical safety detail", null, null);
                    });
            } else {
                throw new BusinessException(this, "saveElectricalSafetyDetails", "no current job selected", null, null);
            }
        });
    }

    public populateGasUnsafeReasons(pressureDrop: number,
                                    gasMeterInstallationSatisfactorySelected: string,
                                    pressureDropThreshold: number,
                                    installationSatisfactoryNoType: string,
                                    installationSatisfactoryNoMeterType: string): Promise<UnsafeReason[]> {

        return this.loadBusinessRules()
            .then(() => {
                let reasons: UnsafeReason[] = [];

                if (pressureDrop && pressureDrop > pressureDropThreshold) {
                    reasons.push(this.createUnsafeReason("pressureDropGreater8", [pressureDropThreshold]));
                } else if (pressureDrop && pressureDrop < pressureDropThreshold) {
                    reasons.push(this.createUnsafeReason("pressureDropLess8", [pressureDropThreshold], false));
                }

                if (gasMeterInstallationSatisfactorySelected
                    && ((gasMeterInstallationSatisfactorySelected === installationSatisfactoryNoType)
                    || (gasMeterInstallationSatisfactorySelected === installationSatisfactoryNoMeterType))) {
                    reasons.push(this.createUnsafeReason("gasMeterInstallation", []));
                }
                return reasons;
            });
    }

    public populateElectricalUnsafeReasons(safetyDetail: PropertyElectricalSafetyDetail,
                                           unableToCheckSystemType: string,
                                           ttSystemType: string,
                                           rcdPresentThreshold: number,
                                           safeInTopsThreshold: number): Promise<UnsafeReason[]> {

        return this.loadBusinessRules()
            .then(() => {
                let reasons: UnsafeReason[] = [];

                if (safetyDetail) {
                    if (safetyDetail.consumerUnitSatisfactory === false) {
                        reasons.push(this.createUnsafeReason("consumerUnit", []));
                    }

                    if (safetyDetail.systemType === unableToCheckSystemType) {
                        reasons.push(this.createUnsafeReason("systemType", []));
                    }

                    if (safetyDetail.noEliReadings && safetyDetail.noEliReadings === true) {
                        reasons.push(this.createUnsafeReason("noElectricalEliReading", []));
                    } else {
                        if (safetyDetail.systemType === ttSystemType) {
                            if (safetyDetail.rcdPresent !== undefined) {
                                if (safetyDetail.rcdPresent === "Y") {
                                    if (safetyDetail.eliReading > rcdPresentThreshold) {
                                        reasons.push(this.createUnsafeReason("rcdGreater200", []));
                                    }
                                } else {
                                    reasons.push(this.createUnsafeReason("rcdNotPresent", []));
                                }
                            }
                        } else {
                            if (safetyDetail.eliReading > safeInTopsThreshold && safetyDetail.eliSafeAccordingToTops === false) {
                                reasons.push(this.createUnsafeReason("topsReadingSafe", []));
                            }
                        }
                    }
                }

                return reasons;
            });
    }

    private createUnsafeReason(lookupId: string, params: any[], isMandatory: boolean = true): UnsafeReason {
        return new UnsafeReason(lookupId, this._businessRules.getBusinessRule<string>(lookupId), params, isMandatory);
    }

    private loadBusinessRules(): Promise<void> {
        return this._businessRules ? Promise.resolve() : this._businessRuleService.getQueryableRuleGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(this)))
            .then((group) => {
                this._businessRules = group;
            });
    }
}
