define(["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResilientHttpClientFactory = /** @class */ (function () {
        function ResilientHttpClientFactory() {
        }
        ResilientHttpClientFactory.prototype.getHttpClient = function (endpointConfiguration) {
            switch (endpointConfiguration.type) {
                case "simulation":
                    return aurelia_framework_1.Container.instance.get("SimulationClient");
                case "basic":
                    var client = aurelia_framework_1.Container.instance.get("BasicHttpClient");
                    client.setup({
                        username: endpointConfiguration.userName,
                        password: endpointConfiguration.password,
                        noCredentialsHeader: true,
                        defaultQueryParams: endpointConfiguration.envQueryParams
                    });
                    return client;
                case "http":
                    return aurelia_framework_1.Container.instance.get("HttpClient");
                default:
                    throw "Unsupported httpClient requested: " + endpointConfiguration.type;
            }
        };
        return ResilientHttpClientFactory;
    }());
    exports.ResilientHttpClientFactory = ResilientHttpClientFactory;
});

//# sourceMappingURL=resilientHttpClientFactory.js.map
