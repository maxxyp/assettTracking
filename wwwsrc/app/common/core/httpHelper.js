define(["require", "exports", "aurelia-logging"], function (require, exports, Logging) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HttpHelper = /** @class */ (function () {
        function HttpHelper() {
            this._logger = Logging.getLogger("HttpHelper");
        }
        HttpHelper.prototype.intialise = function () {
            var _this = this;
            if (window.Windows &&
                window.Windows.UI &&
                window.Windows.UI.WebUI &&
                window.Windows.UI.WebUI.WebUIApplication) {
                window.Windows.UI.WebUI.WebUIApplication.addEventListener("suspending", function (args) {
                    _this._logger.warn("HttpHelper: suspending event fired");
                    _this.isSuspendingEventFired = true;
                });
            }
            if (window.Windows &&
                window.Windows.UI &&
                window.Windows.UI.WebUI &&
                window.Windows.UI.WebUI.WebUIApplication) {
                window.Windows.UI.WebUI.WebUIApplication.addEventListener("resuming", function (args) {
                    _this._logger.warn("HttpHelper: resuming event fired");
                    _this.isSuspendingEventFired = false;
                });
            }
        };
        return HttpHelper;
    }());
    exports.HttpHelper = HttpHelper;
});

//# sourceMappingURL=httpHelper.js.map
