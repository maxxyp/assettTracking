define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RegExpRule = /** @class */ (function () {
        function RegExpRule(regExp) {
            this._regExp = regExp;
        }
        RegExpRule.prototype.test = function (value) {
            return Promise.resolve(this._regExp.test(value));
        };
        return RegExpRule;
    }());
    exports.RegExpRule = RegExpRule;
});

//# sourceMappingURL=regExpRule.js.map
