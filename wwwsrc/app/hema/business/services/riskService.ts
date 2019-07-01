/// <reference path="../../../../typings/app.d.ts" />
import {inject} from "aurelia-framework";

import {IRiskService} from "./interfaces/IRiskService";
import {IJobService} from "./interfaces/IJobService";
import {JobService} from "./jobService";
import {Risk as RiskBusinessModel} from "../models/risk";
import {BusinessException} from "../models/businessException";
import {Guid} from "../../../common/core/guid";
import {ApplianceService} from "./applianceService";
import {DateHelper} from "../../../hema/core/dateHelper";
import { DataState } from "../models/dataState";

@inject(JobService, ApplianceService)
export class RiskService implements IRiskService {
    private _jobService: IJobService;

    constructor(jobService: IJobService) {
        this._jobService = jobService;
    }

    public getRisks(jobId: string): Promise<RiskBusinessModel[]> {
        return this._jobService.getJob(jobId).then(job => {
            return job.risks;
        }).catch(ex => {
            throw new BusinessException(this, "risks", "could not get risks", null, ex);
        });
    }

    public getRisk(jobId: string, riskId: string): Promise<RiskBusinessModel> {
        return this._jobService.getJob(jobId).then(job => {
            if (job) {
                let idx = (job.risks || []).findIndex(r => r.id === riskId);
                if (idx >= 0) {
                    return job.risks[idx];
                } else {
                    throw new BusinessException(this, "risks", "risk does not exist '{0}' for job '{1}'", [riskId, jobId], null);
                }
            } else {
                throw new BusinessException(this, "risks", "no current job selected '{0}'", [jobId], null);
            }
        });
    }

    public updateRisk(jobId: string, risk: RiskBusinessModel): Promise<void> {
        return this._jobService.getJob(jobId).then(job => {
            if (job) {
                let idx = (job.risks || []).findIndex(r => r.id === risk.id);
                if (idx >= 0) {
                    risk.isUpdated = true;
                    job.risks[idx] = risk;
                    return this._jobService.setJob(job);
                } else {
                    throw new BusinessException(this, "risks", "risk does not exist to update '{0}' for job '{1}'", [risk.id, jobId], null);
                }
            } else {
                throw new BusinessException(this, "risks", "no current job selected '{0}'", [jobId], null);
            }
        });
    }

    public addRisk(jobId: string, risk: RiskBusinessModel): Promise<string> {
        return this._jobService.getJob(jobId).then(job => {
            if (job) {
                if (!job.risks) {
                    job.risks = [];
                }
                risk.id = Guid.newGuid();
                /* allocate todays date for a new risk */
                risk.date = DateHelper.getTodaysDate();
                risk.isCreated = true;
                job.risks.push(risk);
                return this._jobService.setJob(job).then(() => risk.id);
            } else {
                throw new BusinessException(this, "risks", "no current job selected '{0}'", [jobId], null);
            }
        });
    }

    public deleteRisk(jobId: string, riskId: string): Promise<void> {
        return this._jobService.getJob(jobId).then(job => {
            if (job) {
                let idx = (job.risks || []).findIndex(r => r.id === riskId);
                if (idx >= 0) {

                    let removedRisk = job.risks.splice(idx, 1).pop();
                    if (removedRisk && !removedRisk.isCreated) {
                        removedRisk.isDeleted = true;
                        removedRisk.dataState = DataState.dontCare;
                        job.deletedRisks = job.deletedRisks || [];
                        job.deletedRisks.push(removedRisk);
                    }

                    return this._jobService.setJob(job);
                } else {
                    throw new BusinessException(this, "risks", "risk does not exist to delete '{0}' for job '{1}'", [riskId, jobId], null);
                }
            } else {
                throw new BusinessException(this, "risks", "no current job selected '{0}'", [jobId], null);
            }
        });
    }
}
