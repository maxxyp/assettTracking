/// <reference path="../../../../typings/app.d.ts" />
import {inject} from "aurelia-framework";

import {ILandlordService} from "./interfaces/ILandlordService";
import {IJobService} from "./interfaces/IJobService";
import {JobService} from "./jobService";
import {LandlordSafetyCertificate as LandlordSafetyCertificateBusinessModel} from "../models/landlord/landlordSafetyCertificate";
import {BusinessException} from "../models/businessException";

import {BusinessRuleService} from "./businessRuleService";
import {IBusinessRuleService} from "./interfaces/IBusinessRuleService";
import {ILandlordFactory} from "../factories/interfaces/ILandlordFactory";
import {LandlordFactory} from "../factories/landlordFactory";
import {IEngineerService} from "./interfaces/IEngineerService";
import {EngineerService} from "./engineerService";
import { IApplianceService } from "./interfaces/IApplianceService";
import { ApplianceService } from "./applianceService";

@inject(JobService, BusinessRuleService, EngineerService, LandlordFactory, ApplianceService)
export class LandlordService implements ILandlordService {

    private _jobService: IJobService;
    private _businessRuleService: IBusinessRuleService;
    private _engineerService: IEngineerService;
    private _landlordFactory: ILandlordFactory;
    private _applianceService: IApplianceService;

    constructor(jobService: IJobService, businessRuleService: IBusinessRuleService,
                engineerService: IEngineerService, landlordFactory: ILandlordFactory, applianceService: IApplianceService) {
        this._jobService = jobService;
        this._businessRuleService = businessRuleService;
        this._landlordFactory = landlordFactory;
        this._engineerService = engineerService;
        this._applianceService = applianceService;
    }

    public getLandlordSafetyCertificate(jobId: string): Promise<LandlordSafetyCertificateBusinessModel> {
        return Promise.all([
            this._businessRuleService.getQueryableRuleGroup("landlordSafetyCertificate"),
            this._jobService.getJob(jobId),
            this._engineerService.getCurrentEngineer(),
            this._applianceService.getAppliancesForLandlordsCertificate(jobId)
        ])
        .then(([ruleGroup, job, engineer, appliances]) => {
                if (!job) {
                    throw new BusinessException(this, "landlordService.getLandlordSafetyCertificate", "no current job selected", null, null);
                }

                if (!ruleGroup || !ruleGroup.rules || ruleGroup.rules.length < 1) {
                    throw new BusinessException(this, "landlordService.getLandlordSafetyCertificate", "no business rules available", null, null);
                }

                return this._landlordFactory.createLandlordSafetyCertificate(
                    job,
                    engineer,
                    ruleGroup,
                    appliances
                );
        })
        .catch(ex => {
            throw new BusinessException(this, "landlordService", "could not get landlord safety certificate", null, ex);
        });
    }
}
