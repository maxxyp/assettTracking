/// <reference path="../../../../typings/app.d.ts" />
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
    var AssetService = /** @class */ (function (_super) {
        __extends(AssetService, _super);
        function AssetService() {
            return _super.call(this, "common/core/services", "AssetService") || this;
        }
        AssetService.prototype.loadText = function (assetName) {
            return this.loadModule().then(function (module) {
                return module.loadText(assetName);
            });
        };
        AssetService.prototype.loadArrayBuffer = function (assetName) {
            return this.loadModule().then(function (module) {
                return module.loadArrayBuffer(assetName);
            });
        };
        AssetService.prototype.loadJson = function (assetName) {
            return this.loadModule().then(function (module) {
                return module.loadJson(assetName);
            });
        };
        return AssetService;
    }(platformServiceBase_1.PlatformServiceBase));
    exports.AssetService = AssetService;
});

//# sourceMappingURL=assetService.js.map
