/// <reference path="../../../../../typings/app.d.ts" />

import {IJob} from "../../models/fft/jobs/IJob";
import {IEngineerStatusRequest} from "../../models/fft/engineers/IEngineerStatusRequest";
import {IJobUpdateRequest} from "../../models/fft/jobs/jobupdate/IJobUpdateRequest";
import {IJobStatusRequest} from "../../models/fft/jobs/status/IJobStatusRequest";
import {IWorkListResponse} from "../../models/fft/engineers/worklist/IWorkListResponse";
import {IJobHistory} from "../../models/fft/jobs/history/IJobHistory";
import {IResilientService} from "../../../../common/resilience/services/interfaces/IResilientService";
import {IPartsOrderedRequest} from "../../models/fft/jobs/orderparts/IPartsOrderedRequest";
import {IOrderConsumablesRequest} from "../../models/fft/engineers/IOrderConsumablesRequest";
import { IListObject } from "../../models/fft/reference/IListObject";
import { IReferenceDataGroup } from "../../models/fft/reference/IReferenceDataGroup";
import { IReferenceDataUpdateRequest } from "../../models/fft/engineers/IReferenceDataUpdateRequest";
import { IPartCollectionResponse } from "../../models/fft/jobs/parts/IPartCollectionResponse";
import {IAmIContractEngineer} from "../../models/fft/engineers/IAmIContractEngineer";

export interface IFFTService extends IResilientService {
    requestWork(engineerId: string): Promise<void>;
    getWorkList(engineerId: string, breakCache?: boolean): Promise<IWorkListResponse>;
    orderConsumables(engineerId: string, orderConsumablesRequest: IOrderConsumablesRequest): Promise<void>;

    getJob(jobId: string, breakCache?: boolean): Promise<IJob>;
    getJobHistory(jobId: string, breakCache?: boolean): Promise<IJobHistory>;
    updateJob(jobId: string, jobUpdateRequest: IJobUpdateRequest): Promise<void>;
    jobStatusUpdate(jobId: string, jobStatusRequest: IJobStatusRequest): Promise<void>;
    orderPartsForJob(jobId: string, partsOrderedRequest: IPartsOrderedRequest): Promise<void>;

    engineerStatusUpdate(engineerId: string, engineerStatusRequest: IEngineerStatusRequest): Promise<void>;
    engineerStatusUpdateEod(engineerId: string, engineerStatusUpdateRequest: IEngineerStatusRequest): Promise<void>;

    getRemoteReferenceDataIndex(): Promise<IListObject[]>;
    getRemoteReferenceDataCatalog(catalogName: string): Promise<IReferenceDataGroup>;
    updateRemoteReferenceData(referenceDataUpdateRequest: IReferenceDataUpdateRequest): Promise<void>;
    getPartsCollection(jobId: string, breakCache?: boolean): Promise<IPartCollectionResponse>;
    getAmIContractEngineerInfo(engineerId: string): Promise<IAmIContractEngineer>;
}
