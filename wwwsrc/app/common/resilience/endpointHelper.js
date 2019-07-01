define(["require", "exports", "../core/objectHelper"], function (require, exports, objectHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EndpointHelper = /** @class */ (function () {
        function EndpointHelper() {
        }
        EndpointHelper.appRequiresSimulation = function (configurationService, endpointNames) {
            var totalRoutes = 0, simulatedRoutes = 0;
            var config = configurationService.getConfiguration();
            if (config) {
                if (endpointNames) {
                    endpointNames.forEach(function (endpointName) {
                        var singleSimulationCount = EndpointHelper.endpointRequiresSimulation(objectHelper_1.ObjectHelper.getPathValue(config, endpointName));
                        if (singleSimulationCount) {
                            totalRoutes += singleSimulationCount[0];
                            simulatedRoutes += singleSimulationCount[1];
                        }
                    });
                }
            }
            return { totalRoutes: totalRoutes, simulatedRoutes: simulatedRoutes };
        };
        EndpointHelper.endpointRequiresSimulation = function (endpointConfiguration) {
            var simulationCount = [0, 0];
            if (endpointConfiguration &&
                endpointConfiguration.clients &&
                endpointConfiguration.routes) {
                simulationCount[0] += endpointConfiguration.routes.length;
                var simClient_1 = endpointConfiguration.clients.find(function (client) { return client.type === "simulation"; });
                if (simClient_1) {
                    simulationCount[1] += endpointConfiguration.routes.filter(function (route) { return route.client === simClient_1.name; }).length;
                }
            }
            return simulationCount;
        };
        return EndpointHelper;
    }());
    exports.EndpointHelper = EndpointHelper;
});

//# sourceMappingURL=endpointHelper.js.map
