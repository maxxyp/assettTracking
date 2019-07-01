import {State} from "./state";
import {BusinessException} from "../../models/businessException";

export class StateMachine<T> {
    private _states: State<T>[];

    constructor(states: State<T>[]) {
        this._states = states;

        for (let i = 0; i < states.length; i++) {
            states[i].targetStates = [];

            if (states[i].targetValues) {
                for (let j = 0; j < states[i].targetValues.length; j++) {
                    states[i].targetStates.push(this.lookupState(states[i].targetValues[j]));
                }
            }
        }
    }

    public getTargetStates(state: T): State<T>[] {
        let targetStates: State<T>[] = [];

        let currentState: State<T> = this.lookupState(state);

        if (currentState && currentState.targetStates) {
            for (let i = 0; i < currentState.targetStates.length; i++) {
                targetStates.push(currentState.targetStates[i]);
            }
        }

        return targetStates;
    }

    public trySetState(state: T, targetState: T): boolean {
        let stateChanged: boolean = false;

        let currentState: State<T> = this.lookupState(state);
        if (currentState) {
            /* don't do anything if we are already in that state */
            if (currentState.value !== targetState) {
                if (currentState.targetStates && currentState.targetStates.length) {
                    let idx = currentState.targetValues.indexOf(targetState);
                    if (idx >= 0) {
                        stateChanged = true;
                        currentState = currentState.targetStates[idx];
                    } else {
                        throw new BusinessException(this, "setState.noTarget",
                            "Set State failed: requested state '{0}' is not a target state of current state '{1}'", [targetState, currentState.name], null);
                    }
                } else {
                    throw new BusinessException(this, "setState.noTargets", "Set State failed: state '{0}' has no target states", [currentState.name], null);
                }
            }
        } else {
            throw new BusinessException(this, "setState.noNull", "Set State failed: can not transition from null state", null, null);
        }

        return stateChanged;
    }

    public lookupState(value: T): State<T> {
        for (let i = 0; i < this._states.length; i++) {
            if (this._states[i].value === value) {
                return this._states[i];
            }
        }

        throw new BusinessException(this, "lookupState", "Lookup State failed for state '{0}'", [value], null);
    }
}
