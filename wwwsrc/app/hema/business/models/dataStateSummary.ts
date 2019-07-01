import {DataState} from "./dataState";
import {IDataStateProvider} from "./IDataStateProvider";
import {DataStateTotals} from "./dataStateTotals";
import {ArrayHelper} from "../../../common/core/arrayHelper";

export class DataStateSummary {

    public static dataStateCompletionOverrideGroup: string;

    private _states: { [key: string]: DataStateTotals};

    constructor(object: any) {
        this._states = {};
        this.calculate(object);

        if (DataStateSummary.dataStateCompletionOverrideGroup) {
            this.applyCompletionOverride();
        }
    }

    public static clearDataStateCompletionOverrideGroup(): void {
        DataStateSummary.dataStateCompletionOverrideGroup = undefined;
    }

    public getTotals(group: string): DataStateTotals {
        return this._states[group] ? this._states[group] : null;
    }

    public getCombinedTotals(): DataStateTotals {
        let combined: DataStateTotals = new DataStateTotals();

        for (let group in this._states) {
            combined.dontCare += this._states[group].dontCare;
            combined.notVisited += this._states[group].notVisited;
            combined.invalid += this._states[group].invalid;
            combined.valid += this._states[group].valid;
        }

        return combined;
    }

    /*
        When no-accessing a job on the task screen, we want all the tabs to go "dont care",
         and the task tab data state to reflect the state of the task in focus, i.e. have the live state.
    */
    private applyCompletionOverride(): void {
        let buildDontCareTotals = (): DataStateTotals => {
            let totals = new DataStateTotals();
            totals.dontCare = 1;
            return totals;
        };

        for (let key in this._states) {
            this._states[key] = (key === DataStateSummary.dataStateCompletionOverrideGroup)
                ? this._states[DataStateSummary.dataStateCompletionOverrideGroup]
                : buildDontCareTotals();
        }
    }

    private calculate(object: any): void {
        if (object) {
            if (this.isDataStateProvider(object)) {
                this.update(object);
            }

            for (let prop in object) {
                let property = object[prop];

                if (ArrayHelper.isArray(property)) {
                    property.forEach((item: any) => {
                        if (property && typeof item === "object") {
                            this.calculate(item);
                        }
                    });
                } else {
                    if (property && typeof property === "object") {
                        this.calculate(property);
                    }
                }
            }
        }
    }

    private isDataStateProvider(object: any): boolean {
        return object && "dataState" in object && "dataStateGroup" in object;
    }

    private update(dataStateProvider: IDataStateProvider): void {
        this.addStateToGroup(dataStateProvider.dataState, dataStateProvider.dataStateGroup);
    }

    private addStateToGroup(dataState: DataState, dataStateGroup: string): void {
        if (!this._states[dataStateGroup]) {
            this._states[dataStateGroup] = new DataStateTotals();
        }

        switch (dataState) {
            case DataState.dontCare:
                this._states[dataStateGroup].dontCare++;
                break;
            case DataState.notVisited:
                this._states[dataStateGroup].notVisited++;
                break;
            case DataState.invalid:
                this._states[dataStateGroup].invalid++;
                break;
            case DataState.valid:
                this._states[dataStateGroup].valid++;
                break;
        }
    }

}
