define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScenarioRoutes = /** @class */ (function () {
        function ScenarioRoutes() {
        }
        ScenarioRoutes.getRoutes = function () {
            return [{
                    route: "scenarios",
                    name: "scenarios",
                    moduleId: "common/simulation/view/scenarioList",
                    nav: true,
                    title: "Simulator Scenarios",
                    settings: { authRequired: true, icon: "fa fa-user-secret" }
                },
                {
                    route: "scenarioitem/:scenario",
                    name: "scenarioitem",
                    moduleId: "common/simulation/view/scenarioItem",
                    nav: false,
                    title: "Simulator Scenario Item",
                    settings: { authRequired: true }
                }];
        };
        return ScenarioRoutes;
    }());
    exports.ScenarioRoutes = ScenarioRoutes;
});

//# sourceMappingURL=scenarioRoutes.js.map
