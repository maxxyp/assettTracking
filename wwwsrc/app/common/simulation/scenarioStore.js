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
    var ScenarioStore = /** @class */ (function (_super) {
        __extends(ScenarioStore, _super);
        function ScenarioStore() {
            return _super.call(this, "common/simulation", "ScenarioStore") || this;
        }
        ScenarioStore.prototype.initialise = function (baseDir) {
            return this.loadModule().then(function (module) {
                return module.initialise(baseDir);
            });
        };
        ScenarioStore.prototype.loadScenarios = function () {
            return this.loadModule().then(function (module) {
                return module.loadScenarios();
            });
        };
        ScenarioStore.prototype.loadScenario = function (route) {
            return this.loadModule().then(function (module) {
                return module.loadScenario(route);
            });
        };
        return ScenarioStore;
    }(platformServiceBase_1.PlatformServiceBase));
    exports.ScenarioStore = ScenarioStore;
});

//# sourceMappingURL=scenarioStore.js.map
