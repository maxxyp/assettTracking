import {RouteConfig} from "aurelia-router";

export class ScenarioRoutes {
    public static getRoutes() : RouteConfig[] {
        return [{
            route: "scenarios",
            name: "scenarios",
            moduleId: "common/simulation/view/scenarioList",
            nav: true,
            title: "Simulator Scenarios",
            settings: {authRequired: true, icon: "fa fa-user-secret"}
        },
        {
            route: "scenarioitem/:scenario",
            name: "scenarioitem",
            moduleId: "common/simulation/view/scenarioItem",
            nav: false,
            title: "Simulator Scenario Item",
            settings: {authRequired: true}
        }];
    }
}
