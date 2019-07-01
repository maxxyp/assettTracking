import { ChargeableTask } from "./chargeableTask";
import { DataState } from "../dataState";
import * as bignumber from "bignumber";
import { DataStateProvider } from "../dataStateProvider";

// import { Task } from "../task";

export class Charge extends DataStateProvider {

    public static CHARGE_OK: string = "1";
    public static CHARGE_NOT_OK: string = "2";

    public jobId: string;
    public discountAmount: bignumber.BigNumber;
    public complaintReasonCodeCharge: string;
    public chargeOption: string;
    public complaintActionCategoryCharge: string;
    public remarks: string;
    public netTotal: bignumber.BigNumber;
    public chargeTotal: bignumber.BigNumber;
    public totalVatAmount: bignumber.BigNumber;
    public tasks: ChargeableTask[];
    public error: boolean;

    public previousChargeSameAppliance: boolean;
    public previousChargeSameApplianceConfirmed: boolean;

    constructor() {
        super(DataState.notVisited, "charges");
        this.tasks = [];
    }

    public get grossTotal(): bignumber.BigNumber {
        let total = new bignumber.BigNumber(0);

        for (let task of this.tasks) {
            if (task.error) {
                this.error = true;
                return new bignumber.BigNumber(0);
            }
            if (task.grossTotal) {
                total = total.plus(task.grossTotal);
            }
        }
        return total;
    }

    public calculatePrimeAndSubCharges(): void {

        const {tasks} = this;

        let [firstTask, ...otherTasks] = this.tasks; // prerequisite api has ordered tasks correctly

        // this scenario if all the tasks are no-charge and non-prime set first one as prime
        const noChargeTasks = this.tasks.filter(t => t.task.chargeType.substr(0, 2) === "NC");

        if (noChargeTasks.length === tasks.length) {

            // if at least one prime found just return as is
            const existsPrime = tasks.some(t => t.isSubsequent === false);

            if (existsPrime) {
                return;
            }

            // else we'll need to flag the first item as prime
            firstTask.isSubsequent = false;
            otherTasks.forEach(t => t.isSubsequent = true);
            return;
        }

        // single item only
        if (tasks.length === 1) {

            if (firstTask.labourItem && !firstTask.error) {
                firstTask.isSubsequent = false;
            }

            // check no errors for single task, e.g. missing prime charge
            firstTask.setErrorsPrimeAndSubCharges(true);

            return;
        }
        // more than one task

        let mostExpensiveTask: ChargeableTask;
        let currentMaxPrimeCharge = new bignumber.BigNumber(0);
        let numberOfPrimeTasks = 0;

        // find out how many prime tasks
        tasks.forEach(t => {
            if (t && !t.error) {

                if (t.isSubsequent === false) {
                    numberOfPrimeTasks += 1;
                }

                if (t.labourItem && t.labourItem.chargePair && t.labourItem.chargePair.primeCharge.greaterThan(currentMaxPrimeCharge)) {
                    mostExpensiveTask = t;
                    currentMaxPrimeCharge = t.labourItem.chargePair.primeCharge;
                }
            }
        });

        // if job has all prime tasks or single task job then no need raise errors if sub charge interval not found

        const ignoreSubsequentCharges = ((numberOfPrimeTasks === tasks.length) || tasks.length === 1);

        // check no errors as result of missing charges in catalog data
        tasks.map(task => task.setErrorsPrimeAndSubCharges(ignoreSubsequentCharges));

        if (numberOfPrimeTasks === 1) {
            tasks.forEach(t => {
                if (!t.useFixedPriceQuotation && !t.error) {
                    if (t.isSubsequent) {
                        t.labourItem.netAmount = t.labourItem.chargePair.subsequentCharge;
                    } else {
                        t.labourItem.netAmount = t.labourItem.chargePair.primeCharge;
                    }
                }
            });
            return;
        }

        if (numberOfPrimeTasks === 0) {

            // df_1775
            // if exists completed task, flag first completed as already completed and remaining subsequent

            const completedIndex = tasks.findIndex(t => !t.task.isMiddlewareDoTodayTask && t.task.chargeType.substr(0, 2) !== "NC");

            if (completedIndex > -1) {
                tasks.forEach((task, idx) => task.isSubsequent = idx !== completedIndex && task.task.isMiddlewareDoTodayTask);
                return;
            }
            // find the most expensive prime task
            // mark most expensive item as prime, and use prime charge

            const mostExpensiveIndex = tasks.findIndex(t => t === mostExpensiveTask);

            if (mostExpensiveTask) {

                if (!mostExpensiveTask.useFixedPriceQuotation && !mostExpensiveTask.error) {
                    tasks[mostExpensiveIndex].labourItem.netAmount = tasks[mostExpensiveIndex].labourItem.chargePair.primeCharge;
                    tasks[mostExpensiveIndex].isSubsequent = false;
                }

                // others can be set to supplementary

                for (let i = 0; i < tasks.length; i++) {
                    if (i !== mostExpensiveIndex) {
                        if (!tasks[i].useFixedPriceQuotation && !tasks[i].error) {
                            tasks[i].labourItem.netAmount = tasks[i].labourItem.chargePair.subsequentCharge;
                            tasks[i].isSubsequent = true;

                        }
                    }
                }
            } else {
                // so there might be a single chargeable job amongst non-chargeables, we should flag that as prime
                const findChargeIndex = tasks.findIndex(t => t.task.isCharge);
                tasks.forEach((t, i) => t.isSubsequent = i !== findChargeIndex);
            }
        }
    }

}
