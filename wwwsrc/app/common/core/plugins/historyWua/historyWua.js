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
define(["require", "exports", "aurelia-history", "aurelia-dependency-injection", "../../threading", "./defaultLinkHandler"], function (require, exports, aurelia_history_1, aurelia_dependency_injection_1, threading_1, defaultLinkHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HistoryWua = /** @class */ (function (_super) {
        __extends(HistoryWua, _super);
        function HistoryWua(linkHandler) {
            var _this = _super.call(this) || this;
            _this._linkHandler = linkHandler;
            return _this;
        }
        HistoryWua.prototype.activate = function (options) {
            this._stack = [];
            options.root = options.root || "/";
            this._stack.push(options.root);
            this._routeHandler = options.routeHandler;
            this._linkHandler.activate(this);
            return this._routeHandler(options.root);
        };
        HistoryWua.prototype.deactivate = function () {
            this._linkHandler.deactivate();
        };
        HistoryWua.prototype.navigate = function (fragment, options) {
            if (fragment.length > 0 && fragment[0] === "#") {
                fragment = fragment.substr(1);
            }
            fragment = fragment.replace(/^\/+|\/+$/g, "/");
            var replace = options && options.replace;
            if (this._stack[this._stack.length - 1] !== fragment || replace) {
                if (replace) {
                    this._stack[this._stack.length - 1] = fragment;
                }
                else {
                    this._stack.push(fragment);
                }
            }
            if (!options || options.trigger || replace) {
                return this._routeHandler(fragment);
            }
            else {
                return false;
            }
        };
        HistoryWua.prototype.navigateBack = function () {
            var _this = this;
            if (this._stack.length > 1) {
                this._stack.pop();
                threading_1.Threading.nextCycle(function () { return _this.navigate(_this._stack.pop()); });
            }
        };
        HistoryWua.prototype.setTitle = function (title) {
        };
        HistoryWua.prototype.setState = function (key, value) {
        };
        HistoryWua.prototype.getState = function (key) {
        };
        HistoryWua = __decorate([
            aurelia_dependency_injection_1.inject(defaultLinkHandler_1.DefaultLinkHandler),
            __metadata("design:paramtypes", [Object])
        ], HistoryWua);
        return HistoryWua;
    }(aurelia_history_1.History));
    exports.HistoryWua = HistoryWua;
});

//# sourceMappingURL=historyWua.js.map
