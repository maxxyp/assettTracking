import { TimeRange } from "../../../../../common/ui/elements/models/timeRange";
import { IChirpCode } from "../../../../business/models/reference/IChirpCode";
import { Job } from "../../../../business/models/job";
import { Task } from "../../../../business/models/task";
import { IVisitActivityCode } from "../../../../business/models/reference/IVisitActivityCode";
import { IPartType } from "../../../../business/models/reference/IPartType";
import { IFaultActionCode } from "../../../../business/models/reference/IFaultActionCode";
import { ObjectHelper } from "../../../../../common/core/objectHelper";
import { IVisitActivityFaultActionCode } from "../../../../business/models/reference/IVisitActivityFaultActionCode";
import { IPtFac } from "../../../../business/models/reference/IPtFac";
import { DataState } from "../../../../business/models/dataState";

export class TaskItemViewModel {
    public readonly dataStateId: string;
    public readonly dataState: DataState;
    public readonly taskIds: string[];
    public readonly tasks: Task[];
    public readonly job: Job;
    public readonly isCharge: boolean;
    public readonly isNewRFA: boolean;

    public currentApplianceId: string;
    public isJobNoAccessedByAnotherTask: boolean;
    public status: string;
    public workedOnCode: string;
    public activity: string;
    public adviceCode: string;
    public jobType: string;
    public workDuration: number;
    public startTime: string;
    public endTime: string;
    public chargeableTime: number;
    public charactersLeft: string;
    public charactersLeftClass: string;
    public charactersLeftNum: number;
    public isFirstVisit: boolean;
    public productGroup: string;
    public partType: string;
    public faultActionCode: string;
    public showProductGroupAndPartTypes: boolean;
    // main part stuff
    public mainPartInformationRetrieved: boolean;
    public hasMainPart: boolean;
    public mainPartProductGroup: string;
    public mainPartPartType: string;
    public showMainPartSelectedWithInvalidActivityTypeMessage: boolean;
    public showMainPartSelectedWithInvalidProductGroupTypeMessage: boolean;
    public showMainPartSelectedWithInvalidPartTypeMessage: boolean;
    public isPotentiallyPartLJReportable: boolean;
    public isPartLJReportable: boolean;
    public applianceType: string;
    public notCompletingJob: boolean;
    public notCompletingTask: boolean;
    public orderNo: number;
    public isInCancellingStatus: boolean;
    public isNotDoingJobByAnotherTask: boolean;
    public adviceOutcome: string;
    public adviceComment: string;
    public totalPreviousWorkDuration: number;
    public taskTime: TimeRange;
    public taskReport: string;
    public chirpCodes: IChirpCode[];
    public unusedChirpCodes: IChirpCode[];
    public selectedChirpCode: string;

    public visitActivityFilteredCatalog: IVisitActivityCode[];
    public partTypeFilteredCatalog: IPartType[];
    public faultActionCodeFilteredCatalog: IFaultActionCode[];

    constructor(taskId: string, job: Job, task: Task) {
        this.dataStateId = task.dataStateId;
        this.dataState = task.dataState;
        this.taskIds = job.tasks.map(t => t.id);
        this.isCharge = task.isCharge;
        this.isNewRFA = task.isNewRFA;
        this.tasks = job.tasks;
        this.job = job;

        this.orderNo = task.orderNo;
        this.applianceType = task.applianceType;
        this.jobType = task.jobType;
        this.status = task.status;
        this.workedOnCode = task.workedOnCode;
        this.adviceOutcome = task.adviceOutcome;
        this.adviceCode = task.adviceCode;
        this.adviceComment = task.adviceComment;
        this.taskReport = task.report;
        this.workDuration = task.workDuration;
        this.chargeableTime = task.chargeableTime;
        this.activity = task.activity;
        this.productGroup = task.productGroup;
        this.partType = task.partType;
        this.faultActionCode = task.faultActionCode;
        this.isPotentiallyPartLJReportable = task.isPotentiallyPartLJReportable;
        this.isPartLJReportable = task.isPartLJReportable;
        this.isFirstVisit = task.isFirstVisit;
        this.hasMainPart = task.hasMainPart;
        this.mainPartPartType = task.mainPartPartType;
        this.currentApplianceId = task.applianceId;
        this.showMainPartSelectedWithInvalidActivityTypeMessage = task.showMainPartSelectedWithInvalidActivityTypeMessage;
        this.showMainPartSelectedWithInvalidProductGroupTypeMessage = task.showMainPartSelectedWithInvalidProductGroupTypeMessage;
        this.showMainPartSelectedWithInvalidPartTypeMessage = task.showMainPartSelectedWithInvalidPartTypeMessage;
        this.showProductGroupAndPartTypes = true;
        this.notCompletingJob = false;
        this.notCompletingTask = false;
        this.mainPartInformationRetrieved = false;
        this.chirpCodes = [];
        this.faultActionCodeFilteredCatalog = [];
        this.partTypeFilteredCatalog = [];
        this.visitActivityFilteredCatalog = [];
        this.mainPartProductGroup = "";
        this.totalPreviousWorkDuration = TaskItemViewModel.getTotalPreviousChargeableTime(task);
    }

    public static getTotalPreviousChargeableTime(task: Task): number {
        let totalChargeableTime: number = 0;
        if (task && task.activities) {
            for (let i: number = 0; i < task.activities.length; i++) {
                let activity = task.activities[i];
                if (activity && activity.chargeableTime) {
                    totalChargeableTime += activity.chargeableTime;
                }
            }
        }
        return totalChargeableTime;
    }

    public static filterVisitActivityCatalog(viewModel: TaskItemViewModel,
                                             workedOnCode: string,
                                             firstVisitJobCode: string,
                                             firstVisitTaskCode: string,
                                             visitActivityCatalog: IVisitActivityCode[],
                                             claimRejNotCoveredVisitCodesPattern: string,
                                             workedOnClaimRejNotCovered: string): void {

        // if job type is first visit then visit activity defaults to first visit code, other have other job types, except first visit
        if (viewModel.jobType === firstVisitJobCode) {
            viewModel.isFirstVisit = true; // used for view and stops reloading on second visit
            viewModel.activity = firstVisitTaskCode;
            viewModel.visitActivityFilteredCatalog = visitActivityCatalog.filter(v => v.visitActivityCode === firstVisitTaskCode);
        } else {
            viewModel.isFirstVisit = false;
            // get claim rej type products
            if (workedOnCode !== undefined) {
                if (viewModel.workedOnCode === workedOnClaimRejNotCovered) {
                    viewModel.visitActivityFilteredCatalog = visitActivityCatalog.filter(v => {
                        return v.visitActivityCode.substr(0, claimRejNotCoveredVisitCodesPattern.length) === claimRejNotCoveredVisitCodesPattern
                            && v.visitActivityCode !== firstVisitTaskCode;
                    }).map((item) => {
                        /* Since the WMIS data is prefixed with X for this category strip it off using a cloned version of the object */
                        let newItem = ObjectHelper.clone(item);
                        newItem.visitActivityDescr = newItem.visitActivityDescription.substr(1);
                        return newItem;
                    });
                } else {
                    viewModel.visitActivityFilteredCatalog = visitActivityCatalog.filter(v =>
                    v.visitActivityCode.substr(0, claimRejNotCoveredVisitCodesPattern.length) !== claimRejNotCoveredVisitCodesPattern
                    && v.visitActivityCode !== firstVisitTaskCode);
                }
            }
        }
    }

    public static filterFaultActionCodeCatalog(viewModel: TaskItemViewModel,
        visitActFaultActLinkCatalog: IVisitActivityFaultActionCode[],
        faultMap: { [code: string]: IFaultActionCode },
        visitCodesProductGroupPartsRequired: string[]): void {
        const faultCodes = visitActFaultActLinkCatalog.filter(lookup => lookup.visitActivityCode === viewModel.activity);

        // if no fault codes associated to visit type, then it implies that a part and product group is needed
        if (faultCodes && faultCodes.length > 0) {
            const filteredFaultCodes = faultCodes.map(f => faultMap[f.faultActionCode]);

            if (filteredFaultCodes) {
                viewModel.showProductGroupAndPartTypes = false;
                viewModel.faultActionCodeFilteredCatalog = filteredFaultCodes;
            }
        } else {
            viewModel.showProductGroupAndPartTypes = visitCodesProductGroupPartsRequired.indexOf(viewModel.activity) !== -1;
        }
    }

    public static filterFaultActionCodeBasedOnPartType(viewModel: TaskItemViewModel,
        partTypeFaultActLinkCatalog: IPtFac[],
        partTypeCatalog: IPartType[],
        faultMap: { [code: string]: IFaultActionCode }): void {
        if (viewModel.partType && partTypeFaultActLinkCatalog && partTypeFaultActLinkCatalog.length > 0) {

            const foundPartType = partTypeCatalog.find(pt => pt.partTypeCode === viewModel.partType);

            if (!foundPartType) {
                return;
            }
            const faultCodes = partTypeFaultActLinkCatalog.filter(pType => pType.productGroupCode === viewModel.productGroup && pType.partTypeCode === foundPartType.partTypeCode);

            // being defensive by using filter in case the faultCode mapping does not contain the faultActionCode

            if (faultCodes && faultCodes.length > 0) {
                viewModel.faultActionCodeFilteredCatalog = faultCodes
                    .filter(f => faultMap[f.faultActionCode]) // only return if fault exists
                    .map(f => faultMap[f.faultActionCode]) // return fault code
                    .sort((a, b) => {
                        if (a.faultActionDescription < b.faultActionDescription) {
                            return -1;
                        }
                        if (a.faultActionDescription > b.faultActionDescription) {
                            return 1;
                        }
                        return 0;
                    });
            }
        }
    }

    public static filterPartTypeCatalog(viewModel: TaskItemViewModel, partTypeCatalog: IPartType[]): void {
        if (partTypeCatalog && partTypeCatalog.length > 0) {
            const partsTypes = partTypeCatalog.filter(ptc => ptc.productGroupCode === viewModel.productGroup);

            if (partsTypes && partsTypes.length > 0) {
                viewModel.partTypeFilteredCatalog = partsTypes;
            }
        }
    }
}
