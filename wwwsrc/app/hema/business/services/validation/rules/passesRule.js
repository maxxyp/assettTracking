define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PassesRule = /** @class */ (function () {
        function PassesRule(passes) {
            this._passes = passes;
        }
        PassesRule.prototype.test = function (value) {
            return Promise.resolve(this._passes());
        };
        return PassesRule;
    }());
    exports.PassesRule = PassesRule;
});

//# sourceMappingURL=passesRule.js.map
