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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-router", "../platformServiceBase", "../objectHelper"], function (require, exports, aurelia_framework_1, aurelia_router_1, platformServiceBase_1, objectHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UriSchemeService = /** @class */ (function (_super) {
        __extends(UriSchemeService, _super);
        function UriSchemeService(aurelia) {
            var _this = _super.call(this, "common/core/services", "UriSchemeService") || this;
            _this._aurelia = aurelia;
            _this._handlers = [];
            return _this;
        }
        UriSchemeService.prototype.registerPlatform = function () {
            var _this = this;
            this.loadModule().then(function (module) {
                module.registerPlatform(_this.handleCustomURI.bind(_this));
            });
        };
        UriSchemeService.prototype.navigateToInitialRoute = function () {
            if (window.initialRoute) {
                this.handleCustomURI(window.initialRoute);
            }
        };
        UriSchemeService.prototype.subscribe = function (callback) {
            this._handlers.push(callback);
        };
        UriSchemeService.prototype.unsubscribe = function (callback) {
            this._handlers = this._handlers.filter(function (item) { return item !== callback; });
        };
        UriSchemeService.prototype.publish = function (command) {
            this._handlers.forEach(function (item) { return item.call(item, command); });
        };
        UriSchemeService.prototype.handleCustomURI = function (path) {
            var command = this.parseCommand(path);
            if (command) {
                this.publish(command);
                return;
            }
            // if the uri is not in the format /command/something
            // presume the uri is a route
            var router = this._aurelia.container.get(aurelia_router_1.Router);
            router.navigate(path, { replace: true });
        };
        UriSchemeService.prototype.parseCommand = function (path) {
            var pathParts = path.split("?");
            var qs = null;
            if (pathParts.length > 1) {
                qs = pathParts[1];
            }
            var matches = path.match(new RegExp("^(command)\/([A-z]+)", "i"));
            if (!!matches && matches.length > 0 && matches[1] === "command") {
                return {
                    methodName: matches[2],
                    args: qs ? objectHelper_1.ObjectHelper.parseQueryString(qs) : null
                };
            }
            return null;
        };
        UriSchemeService = __decorate([
            aurelia_framework_1.inject(aurelia_framework_1.Aurelia),
            __metadata("design:paramtypes", [aurelia_framework_1.Aurelia])
        ], UriSchemeService);
        return UriSchemeService;
    }(platformServiceBase_1.PlatformServiceBase));
    exports.UriSchemeService = UriSchemeService;
});

//# sourceMappingURL=uriSchemeService.js.map
