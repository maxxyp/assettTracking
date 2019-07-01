define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UriSchemeService = /** @class */ (function () {
        function UriSchemeService() {
        }
        UriSchemeService.prototype.registerPlatform = function (handleUriCallback) {
            window.handleOpenURL = function (uri) {
                if (uri.indexOf(":/") > -1) {
                    var uriPath = uri.replace(uri.substring(0, uri.indexOf(":/") + 2).replace("#", ""), "");
                    if (handleUriCallback && !!uriPath) {
                        handleUriCallback(uriPath);
                    }
                }
            };
        };
        return UriSchemeService;
    }());
    exports.UriSchemeService = UriSchemeService;
});

//# sourceMappingURL=uriSchemeService.js.map
