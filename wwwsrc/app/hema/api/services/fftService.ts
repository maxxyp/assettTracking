/// <reference path="../../../../typings/app.d.ts" />

import { inject } from "aurelia-framework";
import { IFFTService } from "./interfaces/IFFTService";
import { ResilientService } from "../../../common/resilience/services/resilientService";
import { FftServiceConstants } from "./constants/fftServiceConstants";
import { IConfigurationService } from "../../../common/core/services/IConfigurationService";
import { ConfigurationService } from "../../../common/core/services/configurationService";
import { IHistoryResponse } from "../models/fft/jobs/history/IHistoryResponse";
import { IJob } from "../models/fft/jobs/IJob";
import { IEngineerStatusRequest } from "../models/fft/engineers/IEngineerStatusRequest";
import { IJobUpdateRequest } from "../models/fft/jobs/jobupdate/IJobUpdateRequest";
import { IJobStatusRequest } from "../models/fft/jobs/status/IJobStatusRequest";
import { IWorkListResponse } from "../models/fft/engineers/worklist/IWorkListResponse";
import { IJobHistory } from "../models/fft/jobs/history/IJobHistory";
import { IGetJobResponse } from "../models/fft/jobs/IGetJobResponse";
import { EventAggregator } from "aurelia-event-aggregator";
import { FftHeaderProvider } from "./fftHeaderProvider";
import { IHttpHeaderProvider } from "../../../common/resilience/services/interfaces/IHttpHeaderProvider";
import { IPartsOrderedRequest } from "../models/fft/jobs/orderparts/IPartsOrderedRequest";
import { IOrderConsumablesRequest } from "../models/fft/engineers/IOrderConsumablesRequest";
import { IListObject } from "../models/fft/reference/IListObject";
import { IReferenceDataGroup } from "../models/fft/reference/IReferenceDataGroup";
import { IListObjectResponse } from "../models/fft/reference/IListObjectResponse";
import { StorageService } from "../../business/services/storageService";
import { IStorageService } from "../../business/services/interfaces/IStorageService";
import { IReferenceDataUpdateRequest } from "../models/fft/engineers/IReferenceDataUpdateRequest";
import { ResilientHttpClientFactory } from "../../../common/resilience/services/resilientHttpClientFactory";
import { IPartCollectionResponse } from "../models/fft/jobs/parts/IPartCollectionResponse";
import { IAmIContractEngineerResponse } from "../models/fft/engineers/IAmIContractEngineerResponse";
import { IAmIContractEngineer } from "../models/fft/engineers/IAmIContractEngineer";
import { WuaNetworkDiagnostics } from "../../../common/core/wuaNetworkDiagnostics";

@inject(ConfigurationService, StorageService, EventAggregator, FftHeaderProvider, ResilientHttpClientFactory, WuaNetworkDiagnostics)
export class FftService extends ResilientService implements IFFTService {

    constructor(configurationService: IConfigurationService, storageService: IStorageService,
                eventAggregator: EventAggregator, fftHeaderProvider: IHttpHeaderProvider, resilientClientFactory: ResilientHttpClientFactory,
                wuaNetworkDiagnostics: WuaNetworkDiagnostics) {
        super(configurationService, FftServiceConstants.ENDPOINT_CONFIGURATION, storageService, eventAggregator, fftHeaderProvider, resilientClientFactory, wuaNetworkDiagnostics);
    }

    public requestWork(engineerId: string): Promise<void> {
        // .NOT a resilient call - we want immediate feedback if this has not worked
        return this.putData<any, void>("engineer_requestwork", {"engineerId": engineerId}, {});
    }

    public getWorkList(engineerId: string, breakCache?: boolean): Promise<IWorkListResponse> {
        return this.getData<IWorkListResponse>("engineer_worklist", {"engineerId": engineerId}, breakCache)
            .then(response => response ? response : undefined);
    }

    public orderConsumables(engineerId: string, orderConsumablesRequest: IOrderConsumablesRequest): Promise<void> {
        return this.putDataResilient(FftServiceConstants.ORDER_CONSUMABLES_ROUTE, {"engineerId": engineerId}, orderConsumablesRequest);
    }

    public getJob(jobId: string, breakCache?: boolean): Promise<IJob> {
        return this.getData<IGetJobResponse>("job", {"jobId": jobId}, breakCache)
            .then(response => response && response.data ? response.data.job : undefined);
    }

    public updateJob(jobId: string, jobUpdateRequest: IJobUpdateRequest): Promise<void> {
        return this.putDataResilient(FftServiceConstants.JOB_UPDATE_ROUTE, {"jobId": jobId}, jobUpdateRequest);
    }

    public jobStatusUpdate(jobId: string, jobStatusUpdateRequest: IJobStatusRequest): Promise<void> {
        return this.putDataResilient("job_status", {"jobId": jobId}, jobStatusUpdateRequest);
    }

    public engineerStatusUpdate(engineerId: string, engineerStatusUpdateRequest: IEngineerStatusRequest): Promise<void> {
        return this.putDataResilient("engineer_status", {"engineerId": engineerId}, engineerStatusUpdateRequest);
    }

    public engineerStatusUpdateEod(engineerId: string, engineerStatusUpdateRequest: IEngineerStatusRequest): Promise<void> {
        // .NOT a resilient call - if it fails the engineer cant sign off
        return this.putData<IEngineerStatusRequest, void>("engineer_status_eod", {"engineerId": engineerId}, engineerStatusUpdateRequest);
    }

    public getJobHistory(jobId: string, breakCache?: boolean): Promise<IJobHistory> {
        return this.getData<IHistoryResponse>("job_history", {"jobId": jobId}, breakCache)
            .then(response => response ? response.data : undefined);
    }

    public getRemoteReferenceDataIndex(): Promise<IListObject[]> {
        return this.getData<IListObjectResponse>("reference_index", null, true)
            .then(response => response && response.data && response.data.listObjects ? response.data.listObjects : undefined);
    }

    public getRemoteReferenceDataCatalog(catalogName: string): Promise<IReferenceDataGroup> {
        return this.getData<IReferenceDataGroup>("reference_catalog", {"catalog": catalogName}, true)
            .then(response => response && response.meta && response.data ? response : undefined);
    }

    public updateRemoteReferenceData(referenceDataUpdateRequest: IReferenceDataUpdateRequest): Promise<void> {
        return this.putDataResilient("reference_update", null, referenceDataUpdateRequest);
    }

    public orderPartsForJob(jobId: string, partsOrderedRequest: IPartsOrderedRequest): Promise<void> {
        return this.putDataResilient(FftServiceConstants.ORDER_PARTS_ROUTE, {"jobId": jobId}, partsOrderedRequest);
    }

    public getPartsCollection(jobId: string, breakCache?: boolean): Promise<IPartCollectionResponse> {
        return this.getData<IPartCollectionResponse>("parts_collection", {"jobId": jobId}, breakCache)
            .then(response => response && response.data && response.data.list ? response : undefined);
    }

    public getAmIContractEngineerInfo(engineerId: string, breakCache?: boolean): Promise<IAmIContractEngineer> {
        return this.getData<IAmIContractEngineerResponse>("contractor_info", {"engineerId": parseInt(engineerId, 10)}, breakCache)
            .then(response => response && response.data ? response.data : undefined);
    }
}
