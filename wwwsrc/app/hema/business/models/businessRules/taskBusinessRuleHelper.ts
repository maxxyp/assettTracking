export class TaskBusinessRuleHelper {
    public static isNotDoingJobStatus(ruleGroup: {[key: string]: any}, status: string) : boolean {
        return (ruleGroup.notDoingJobStatuses as string).split(",").some(s => s === status);
    }

    public static isNotDoingTaskStatus(ruleGroup: {[key: string]: any}, status: string) : boolean {
        return (ruleGroup.notDoingTaskStatuses as string).split(",").some(s => s === status);
    }

    public static isLiveTask(ruleGroup: {[key: string]: any}, status: string): boolean {
        return !this.isNotDoingJobStatus (ruleGroup, status)
            && !this.isNotDoingTaskStatus(ruleGroup, status);
    }
}
