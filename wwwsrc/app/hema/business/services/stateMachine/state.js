define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var State = /** @class */ (function () {
        function State(value, name, targetValues) {
            this.value = value;
            this.name = name;
            this.targetValues = targetValues;
            this.targetStates = null;
        }
        return State;
    }());
    exports.State = State;
});

//# sourceMappingURL=state.js.map
