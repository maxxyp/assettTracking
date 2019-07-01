/// <reference path="../../../typings/app.d.ts" />
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
define(["require", "exports", "../core/platformServiceBase"], function (require, exports, platformServiceBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BlobStorageService = /** @class */ (function (_super) {
        __extends(BlobStorageService, _super);
        function BlobStorageService() {
            return _super.call(this, "common/storage", "BlobStorageService") || this;
        }
        BlobStorageService.prototype.checkInitised = function (storageName) {
            return this.loadModule().then(function (module) {
                return module.checkInitised(storageName);
            });
        };
        BlobStorageService.prototype.initialise = function (storageName, removeExisting) {
            return this.loadModule().then(function (module) {
                return module.initialise(storageName, removeExisting);
            });
        };
        BlobStorageService.prototype.closedown = function () {
            return this.loadModule().then(function (module) {
                return module.closedown();
            });
        };
        BlobStorageService.prototype.write = function (path, file, blob) {
            return this.loadModule().then(function (module) {
                return module.write(path, file, blob);
            });
        };
        BlobStorageService.prototype.read = function (path, file) {
            return this.loadModule().then(function (module) {
                return module.read(path, file);
            });
        };
        BlobStorageService.prototype.exists = function (path, file) {
            return this.loadModule().then(function (module) {
                return module.exists(path, file);
            });
        };
        BlobStorageService.prototype.size = function (path, file) {
            return this.loadModule().then(function (module) {
                return module.size(path, file);
            });
        };
        BlobStorageService.prototype.remove = function (path, file) {
            return this.loadModule().then(function (module) {
                return module.remove(path, file);
            });
        };
        BlobStorageService.prototype.list = function (path) {
            return this.loadModule().then(function (module) {
                return module.list(path);
            });
        };
        return BlobStorageService;
    }(platformServiceBase_1.PlatformServiceBase));
    exports.BlobStorageService = BlobStorageService;
});

//# sourceMappingURL=blobStorageService.js.map
