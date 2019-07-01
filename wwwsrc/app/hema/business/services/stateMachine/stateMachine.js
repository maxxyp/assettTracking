define(["require", "exports", "../../models/businessException"], function (require, exports, businessException_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StateMachine = /** @class */ (function () {
        function StateMachine(states) {
            this._states = states;
            for (var i = 0; i < states.length; i++) {
                states[i].targetStates = [];
                if (states[i].targetValues) {
                    for (var j = 0; j < states[i].targetValues.length; j++) {
                        states[i].targetStates.push(this.lookupState(states[i].targetValues[j]));
                    }
                }
            }
        }
        StateMachine.prototype.getTargetStates = function (state) {
            var targetStates = [];
            var currentState = this.lookupState(state);
            if (currentState && currentState.targetStates) {
                for (var i = 0; i < currentState.targetStates.length; i++) {
                    targetStates.push(currentState.targetStates[i]);
                }
            }
            return targetStates;
        };
        StateMachine.prototype.trySetState = function (state, targetState) {
            var stateChanged = false;
            var currentState = this.lookupState(state);
            if (currentState) {
                /* don't do anything if we are already in that state */
                if (currentState.value !== targetState) {
                    if (currentState.targetStates && currentState.targetStates.length) {
                        var idx = currentState.targetValues.indexOf(targetState);
                        if (idx >= 0) {
                            stateChanged = true;
                            currentState = currentState.targetStates[idx];
                        }
                        else {
                            throw new businessException_1.BusinessException(this, "setState.noTarget", "Set State failed: requested state '{0}' is not a target state of current state '{1}'", [targetState, currentState.name], null);
                        }
                    }
                    else {
                        throw new businessException_1.BusinessException(this, "setState.noTargets", "Set State failed: state '{0}' has no target states", [currentState.name], null);
                    }
                }
            }
            else {
                throw new businessException_1.BusinessException(this, "setState.noNull", "Set State failed: can not transition from null state", null, null);
            }
            return stateChanged;
        };
        StateMachine.prototype.lookupState = function (value) {
            for (var i = 0; i < this._states.length; i++) {
                if (this._states[i].value === value) {
                    return this._states[i];
                }
            }
            throw new businessException_1.BusinessException(this, "lookupState", "Lookup State failed for state '{0}'", [value], null);
        };
        return StateMachine;
    }());
    exports.StateMachine = StateMachine;
});

//# sourceMappingURL=stateMachine.js.map
