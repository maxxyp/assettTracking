/// <reference path="../../../typings/app.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* tslint:disable:ban-functions */
    var Threading = /** @class */ (function () {
        function Threading() {
        }
        Threading.nextCycle = function (method) {
            setTimeout(method, 1);
        };
        Threading.delay = function (method, delay) {
            return setTimeout(method, delay);
        };
        Threading.stopDelay = function (delayId) {
            clearTimeout(delayId);
        };
        Threading.startTimer = function (method, delay) {
            return setInterval(method, delay);
        };
        Threading.stopTimer = function (timerId) {
            clearInterval(timerId);
        };
        return Threading;
    }());
    exports.Threading = Threading;
});
/* tslint:enable:ban-functions */

//# sourceMappingURL=threading.js.map
