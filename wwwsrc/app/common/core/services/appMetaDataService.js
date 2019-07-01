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
define(["require", "exports", "../platformServiceBase"], function (require, exports, platformServiceBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppMetaDataService = /** @class */ (function (_super) {
        __extends(AppMetaDataService, _super);
        function AppMetaDataService() {
            return _super.call(this, "common/core/services", "AppMetaDataService") || this;
        }
        AppMetaDataService.prototype.get = function () {
            return this.loadModule().then(function (module) {
                return module.get();
            });
        };
        return AppMetaDataService;
    }(platformServiceBase_1.PlatformServiceBase));
    exports.AppMetaDataService = AppMetaDataService;
});

//# sourceMappingURL=appMetaDataService.js.map
