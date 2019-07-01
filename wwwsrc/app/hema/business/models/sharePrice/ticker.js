define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Ticker = /** @class */ (function () {
        function Ticker() {
        }
        Object.defineProperty(Ticker.prototype, "isUp", {
            get: function () {
                return this.change.indexOf("+") === 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ticker.prototype, "isDown", {
            get: function () {
                return this.change.indexOf("-") === 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ticker.prototype, "movement", {
            get: function () {
                return this.isUp ? "up" : (this.isDown ? "down" : "");
            },
            enumerable: true,
            configurable: true
        });
        return Ticker;
    }());
    exports.Ticker = Ticker;
});

//# sourceMappingURL=ticker.js.map
