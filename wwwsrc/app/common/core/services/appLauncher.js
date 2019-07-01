var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../platformServiceBase", "../urlParamService"], function (require, exports, platformServiceBase_1, urlParamService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppLauncher = /** @class */ (function (_super) {
        __extends(AppLauncher, _super);
        function AppLauncher() {
            return _super.call(this, "common/core/services", "AppLauncher") || this;
        }
        AppLauncher.prototype.checkInstalled = function (uri) {
            return this.loadModule().then(function (module) {
                return module.checkApplicationInstalled(uri);
            });
        };
        AppLauncher.prototype.launchApplication = function (uri) {
            this.loadModule().then(function (module) { return module.launchApplication(uri); });
        };
        AppLauncher.prototype.launch = function (uriOrProtocol, params, options) {
            var _this = this;
            var uri = uriOrProtocol;
            if (uri.indexOf("://") === -1) {
                uri += "://";
            }
            this.generateUri(uri, params, options)
                .then(function (encodedUri) { return _this.loadModule().then(function (module) { return module.launchApplication(encodedUri); }); })
                .catch();
        };
        AppLauncher.prototype.generateUri = function (baseUri, params, options) {
            var _this = this;
            return Promise.resolve()
                .then(function () {
                if (!!options && !!options.returnUri) {
                    return _this.loadModule().then(function (module) { return module.getUriScheme(); });
                }
                return null;
            })
                .then(function (appScheme) {
                var paramsAndQs = Object.assign(params, {
                    "?returnappuri": appScheme,
                    "?returnapptext": options && options.returnUriText,
                    "?fullscreen": options && options.fullScreen
                });
                return urlParamService_1.UrlParamService.getParamEndpoint(baseUri, _this.filterFalsyParams(paramsAndQs)).replace(/{(.*)}/g, "");
            });
        };
        AppLauncher.prototype.filterFalsyParams = function (params) {
            return Object.keys(params).reduce(function (newObject, key) {
                var val = params[key];
                if (!!val) {
                    newObject[key] = val;
                }
                return newObject;
            }, {});
        };
        return AppLauncher;
    }(platformServiceBase_1.PlatformServiceBase));
    exports.AppLauncher = AppLauncher;
});

//# sourceMappingURL=appLauncher.js.map
