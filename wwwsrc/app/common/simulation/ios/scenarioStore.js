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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../web/scenarioStore", "../../core/services/assetService", "aurelia-dependency-injection"], function (require, exports, ScenarioStoreWeb, assetService_1, aurelia_dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScenarioStore = /** @class */ (function (_super) {
        __extends(ScenarioStore, _super);
        function ScenarioStore(assetService) {
            return _super.call(this, assetService) || this;
        }
        ScenarioStore = __decorate([
            aurelia_dependency_injection_1.inject(assetService_1.AssetService),
            __metadata("design:paramtypes", [Object])
        ], ScenarioStore);
        return ScenarioStore;
    }(ScenarioStoreWeb.ScenarioStore));
    exports.ScenarioStore = ScenarioStore;
});

//# sourceMappingURL=scenarioStore.js.map
