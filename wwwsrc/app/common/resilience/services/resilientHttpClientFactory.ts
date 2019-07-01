import { IHttpClient } from "../../core/IHttpClient";
import { IEndpointClientConfiguration } from "../models/IEndpointClientConfiguration";
import { Container } from "aurelia-framework";

export class ResilientHttpClientFactory {
    public getHttpClient(endpointConfiguration: IEndpointClientConfiguration): IHttpClient {

        switch (endpointConfiguration.type) {
            case "simulation":
                return Container.instance.get("SimulationClient");
            case "basic":
            let client = Container.instance.get("BasicHttpClient");
                client.setup({
                    username: endpointConfiguration.userName,
                    password: endpointConfiguration.password,
                    noCredentialsHeader: true,
                    defaultQueryParams: endpointConfiguration.envQueryParams
                });
                return client;
            case "http":
                return Container.instance.get("HttpClient");
            default:
                throw "Unsupported httpClient requested: " + endpointConfiguration.type;
        }

    }
}
