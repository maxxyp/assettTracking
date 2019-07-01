define(["require", "exports", "../../objectHelper"], function (require, exports, objectHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FULLSCREEN = "fullscreen";
    var UriSchemeService = /** @class */ (function () {
        function UriSchemeService() {
        }
        UriSchemeService.prototype.registerPlatform = function (handleUriCallback) {
            var _this = this;
            if (window.Windows &&
                window.Windows.UI &&
                window.Windows.UI.WebUI &&
                window.Windows.UI.WebUI.WebUIApplication) {
                window.Windows.UI.WebUI.WebUIApplication.addEventListener("activated", function (args) {
                    var activatedEvent = args.detail.find(function (x) { return !!x; });
                    if (!!activatedEvent.uri) {
                        var rawUri = activatedEvent.uri.rawUri;
                        var scheme = activatedEvent.uri.schemeName + "://";
                        var includesRoute = (rawUri !== scheme);
                        if (includesRoute) {
                            var path = activatedEvent.uri.rawUri.replace(scheme, "").replace("/#", "").replace(/\/$/, "");
                            if (handleUriCallback && !!path) {
                                var queryParams = objectHelper_1.ObjectHelper.parseQueryString(path);
                                _this.setScreenSize(queryParams[FULLSCREEN] === "true" && _this.isTabletMode());
                                handleUriCallback(path);
                            }
                        }
                    }
                });
            }
        };
        UriSchemeService.prototype.isTabletMode = function () {
            return window.Windows.ViewManagement.UIViewSettings.getForCurrentView().userInteractionMode === window.Windows.ViewManagement.UserInteractionMode.touch;
        };
        UriSchemeService.prototype.setScreenSize = function (fullScreen) {
            window.Windows.UI.ViewManagement.ApplicationView.preferredLaunchWindowingMode = !!fullScreen
                ? window.Windows.UI.ViewManagement.ApplicationViewWindowingMode.fullScreen
                : window.Windows.UI.ViewManagement.ApplicationViewWindowingMode.preferredLaunchViewSize;
        };
        return UriSchemeService;
    }());
    exports.UriSchemeService = UriSchemeService;
});

//# sourceMappingURL=uriSchemeService.js.map
