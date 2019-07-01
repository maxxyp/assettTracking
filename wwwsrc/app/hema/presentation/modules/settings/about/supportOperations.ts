import { ILabelService } from "../../../../business/services/interfaces/ILabelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { LabelService } from "../../../../business/services/labelService";
import { inject } from "aurelia-dependency-injection";
import { BaseInformation } from "./baseInformation";
import { HemaStorage } from "../../../../core/services/hemaStorage";
import { ReferenceDataService } from "../../../../business/services/referenceDataService";
import { IStorage } from "../../../../../common/core/services/IStorage";
import { IReferenceDataService } from "../../../../business/services/interfaces/IReferenceDataService";
import { ConfirmDialogModel } from "../../../../../common/ui/dialogs/models/confirmDialogModel";
import { ConfirmationDialog } from "./dialog/confirmationDialog";
import { PlatformHelper } from "../../../../../common/core/platformHelper";
import { JobService } from "../../../../business/services/jobService";
import { IJobService } from "../../../../business/services/interfaces/IJobService";
import { BridgeDiagnostic } from "../../../../business/models/bridgeDiagnostic";
import { IBridgeBusinessService } from "../../../../business/services/interfaces/IBridgeBusinessService";
import { BridgeBusinessService } from "../../../../business/services/bridgeBusinessService";
import { WindowHelper } from "../../../../core/windowHelper";
import { InformationDialog } from "./dialog/informationDialog";
import { InfoDialogModel } from "../../../../../common/ui/dialogs/models/infoDialogModel";
import { DialogResult } from "../../../../../../typings/lib/aurelia/aurelia-dialog/index";
import { IFFTService } from "../../../../api/services/interfaces/IFFTService";
import { FftService } from "../../../../api/services/fftService";
import { ISupportService } from "../../../../business/services/interfaces/ISupportService";
import { SupportService } from "../../../../business/services/supportService";
import { AnalyticsConstants } from "../../../../../common/analytics/analyticsConstants";
import * as moment from "moment";

@inject(LabelService, EventAggregator, DialogService, HemaStorage, ReferenceDataService, JobService, BridgeBusinessService, FftService, SupportService)
export class SupportOperations extends BaseInformation {
    public platform: string;
    public bridgeDiagnosticSummary: BridgeDiagnostic;
    public jobUpdate: string;
    public hiddenText: HTMLTextAreaElement;

    private _storage: IStorage;
    private _referenceDataService: IReferenceDataService;
    private _jobService: IJobService;
    private _bridgeBusinessService: IBridgeBusinessService;
    private _supportService: ISupportService;
    private _fftService: IFFTService;

    constructor(labelService: ILabelService, eventAggregator: EventAggregator, dialogService: DialogService,
        storage: IStorage, referenceDataService: IReferenceDataService, jobService: IJobService,
                bridgeBusinessService: IBridgeBusinessService, fftService: IFFTService,
                supportService: ISupportService) {
        super(labelService, eventAggregator, dialogService);

        this.isExpanded = false;
        this._storage = storage;
        this._referenceDataService = referenceDataService;
        this._jobService = jobService;
        this._bridgeBusinessService = bridgeBusinessService;
        this._supportService = supportService;

        this.platform = PlatformHelper.getPlatform();
        this.bridgeDiagnosticSummary = new BridgeDiagnostic();
        this._fftService = fftService;
    }

    public async activateAsync(): Promise<void> {
        const lastJob = await this._supportService.getLastJobUpdate();
        if (lastJob) {
            this.jobUpdate = JSON.stringify(lastJob, undefined, 2);
        }
        await this.getBridgeDiagnostic();
    }

    public async logCurrentJobState() : Promise<DialogResult> {
        let feedback = (message: string) => {
            return this._dialogService.open({
                viewModel: InformationDialog,
                model: new InfoDialogModel(this.getLabel("logJobTitle"), message )
            });
        };

        let jobId = await this._jobService.getActiveJobId();

        if (!jobId) {
            return feedback(this.getLabel("logJobNoActiveJob"));
        }

        let job = await this._jobService.getJob(jobId);
        if (!job) {
            return feedback(this.getLabel("logJobCantGetJob") + jobId);
        }

        this._logger.warn("Current Job State", job);
        return feedback(this.getLabel("logJobSuccess") + jobId);
    }

    public async getBridgeDiagnostic(): Promise<void> {
        this.bridgeDiagnosticSummary = await this._bridgeBusinessService.getDiagnostic();
    }

    public async removeData(args: {user?: boolean, catalog?: boolean}): Promise<void> {

        let buildModel = (title: string, text: string) => {
        let model: ConfirmDialogModel = new ConfirmDialogModel();
            model.header = this.getLabel(title);
            model.text = this.getLabel(text);
            return model;
        };
        
        let result = await this._dialogService.open({ 
            viewModel: ConfirmationDialog, 
            model: buildModel("questionTitle", "question") 
        });

        if (result.wasCancelled) {
            return;
        }

        if (args.user) {
            try {
                let payloads = await this._fftService.getUnsentPayloads();
                if (payloads.length) {
                    let resultPayloads = await this._dialogService.open({ 
                        viewModel: ConfirmationDialog, 
                        model: buildModel("haveUnsentPayloadsTitle", "haveUnsentPayloads") 
                    });

                    if (resultPayloads.wasCancelled) {
                        return;
                    }
                }

                this._logger.warn("Attempting to clear user data");
                await this._storage.clear();
                this.addToAnalytics(AnalyticsConstants.REMOVE_USER_DATA);
            } catch (error) {
                this._logger.warn("Error when user storage", error);
            }
        }

        if (args.catalog) {
            try {
                this._logger.warn("Attempting to clear reference data");
                await this._referenceDataService.clear();
                this.addToAnalytics(AnalyticsConstants.REMOVE_CATALOG_DATA);
            } catch (error) {
                // we have seen that even though db is deleted, a "blocked" error may still be thrown
                this._logger.warn("Error when clearing catalog", error);
            }
        }
        this._logger.warn("About to reload ...");
        // give the logger time to flush to disk
        await Promise.delay(500);
        WindowHelper.reload();
    }

    public copy(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this.populateHiddenText()) {
                this.hiddenText.select();
                try {
                    let supported: boolean = document.queryCommandSupported("copy");
                    if (supported) {
                        document.execCommand("copy");
                    }
                    this.clearHiddenText();
                    resolve();
                } catch (err) {
                    this.clearHiddenText();
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }

    private addToAnalytics(category: string) : void {
        try {
            this._eventAggregator.publish(AnalyticsConstants.ANALYTICS_EVENT, {
                category: category,
                action: AnalyticsConstants.CLICK_ACTION,
                label: moment().format(AnalyticsConstants.DATE_TIME_FORMAT),
                metric: AnalyticsConstants.METRIC
            });   
        } catch {
            // do nothing
        }
    }

    private populateHiddenText(): boolean {
        let flag: boolean = false;
        if (this.hiddenText) {
            this.hiddenText.innerText = this.jobUpdate;
            flag = true;
        }
        return flag;
    }

    private clearHiddenText(): void {
        if (this.hiddenText) {
            this.hiddenText.innerText = " ";
        }
    }
 }
