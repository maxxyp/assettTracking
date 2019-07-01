import {Activity} from "./activity";
import {TaskVisit} from "./taskVisit";
import {DataStateProvider} from "./dataStateProvider";
import {DataState} from "./dataState";
import {NumberHelper} from "../../../common/core/numberHelper";
import {StringHelper} from "../../../common/core/stringHelper";

export class Task extends DataStateProvider {
    public id: string;
    public fieldTaskId: string;
    public jobType: string;
    public applianceType: string;
    public applianceId: string;
    public chargeType: string;

    public supportingText: string;
    public specialRequirement: string;

    public problemDesc: string;
    public applianceMake: string;
    public applianceModel: string;
    public applianceErrorCode: string;
    public applianceErrorDesc: string;

    public activity: string;
    public productGroup: string;
    public partType: string;
    public faultActionCode: string;
    public sequence: number;

    public discountCode: string;
    public fixedPriceQuotationAmount: number;

    public workDuration: number;
    public chargeableTime: number;
    public status: string;
    public report: string;
    public chirpCodes: string[];
    public workedOnCode: string;
    public adviceOutcome: string;
    public adviceCode: string;
    public adviceComment: string;
    public activities: Activity[];
    public endTime: string;
    public startTime: string;
    public previousVisits: TaskVisit[];
    public isNewRFA: boolean;
    public isMiddlewareDoTodayTask: boolean;
    public isNotDoingTask: boolean;
    public isTaskThatSetsJobAsNoAccessed: boolean;

    public isPotentiallyPartLJReportable: boolean;
    public isPartLJReportable: boolean;

    public isCharge: boolean;
    public orderNo: number; // just to order the task by

    public isFirstVisit: boolean;
    public showMainPartSelectedWithInvalidActivityTypeMessage: boolean;
    public showMainPartSelectedWithInvalidProductGroupTypeMessage: boolean;
    public showMainPartSelectedWithInvalidPartTypeMessage: boolean;
    public hasMainPart: boolean;
    public mainPartPartType: string;

    constructor(isCurrentTask: boolean, isNewRFA: boolean) {
        super(isCurrentTask ? DataState.notVisited : DataState.dontCare, isCurrentTask ? "activities" : "previous-jobs");
        this.isNewRFA = isNewRFA;
        this.orderNo = 1;
        this.isMiddlewareDoTodayTask = true;
        this.showMainPartSelectedWithInvalidActivityTypeMessage = false;
        this.showMainPartSelectedWithInvalidProductGroupTypeMessage = false;
        this.showMainPartSelectedWithInvalidPartTypeMessage = false;
        this.hasMainPart = false;
    }

    public static isChargeableTask(chargeType: string, noChargePrefix: string): boolean {

        if (chargeType === undefined) {
            return false;
        }

        if (noChargePrefix === undefined) {
            return false;
        }

        if (noChargePrefix === "") {
            return false;
        }

        if (chargeType === "") {
            return false;
        }

        const lenNoChargePrefix = noChargePrefix.length;

        return chargeType.substr(0, lenNoChargePrefix) !== noChargePrefix;
    }

    public static getNextTaskId(tasks: Task[]): string {
        if (!tasks || !tasks.length) {
            return null;
        }

        let sortedExistingTaskIds = tasks
            .filter(task => task && task.id)
            .map(task => task.id)
            .sort();

        if (!sortedExistingTaskIds.length) {
            return null;
        }

        let maxExistingTaskId =  sortedExistingTaskIds.pop();

        if (maxExistingTaskId.length < 3) {
            return null;
        }

        // if id is 123456789001 then root is 123456789 and suffix is 001
        let idRoot = maxExistingTaskId.substr(0, maxExistingTaskId.length - 3);
        let idSuffix = maxExistingTaskId.substr(maxExistingTaskId.length - 3);

        if (!NumberHelper.canCoerceToNumber(idSuffix)) {
            return null;
        }

        let nextIdSuffix = (NumberHelper.coerceToNumber(idSuffix) + 1).toString();

        if (nextIdSuffix.length > 3) {
            return null;
        }

        let paddedNextIdSuffix = StringHelper.padLeft(nextIdSuffix, "0", 3);

        return idRoot + paddedNextIdSuffix;
    }

    public static getFieldTaskId(taskId: string): string {
        /*  Jairam says that fieldTaskId should be a 8 digit number, e.g. "00003902".
            It should be unique across all new tasks generated for the job.
        */
        if (taskId.length < 8) {
            return StringHelper.padLeft(taskId, "0", 8);
        } else {
            return taskId.substr(taskId.length - 8);
        }
    }
}
