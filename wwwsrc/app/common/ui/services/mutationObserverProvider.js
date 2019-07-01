define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MutationObserverProvider = /** @class */ (function () {
        function MutationObserverProvider() {
        }
        MutationObserverProvider.prototype.create = function (callback) {
            return new MutationObserver(callback);
        };
        return MutationObserverProvider;
    }());
    exports.MutationObserverProvider = MutationObserverProvider;
});

//# sourceMappingURL=mutationObserverProvider.js.map
