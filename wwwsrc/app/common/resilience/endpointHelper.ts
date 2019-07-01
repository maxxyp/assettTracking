import {IConfigurationService} from "../core/services/IConfigurationService";
import {IEndpointConfiguration} from "./models/IEndpointConfiguration";
import {ObjectHelper} from "../core/objectHelper";

export class EndpointHelper {
    public static appRequiresSimulation(configurationService: IConfigurationService, endpointNames: string[]): { totalRoutes: number, simulatedRoutes: number} {
        let totalRoutes: number = 0,
            simulatedRoutes: number = 0;

        let config = configurationService.getConfiguration();

        if (config) {
            if (endpointNames) {
                endpointNames.forEach(endpointName => {
                    let singleSimulationCount: number[] = EndpointHelper.endpointRequiresSimulation(ObjectHelper.getPathValue(config, endpointName));

                    if (singleSimulationCount) {
                        totalRoutes += singleSimulationCount[0];
                        simulatedRoutes += singleSimulationCount[1];
                    }
                });
            }
        }

        return {totalRoutes, simulatedRoutes};
    }

    public static endpointRequiresSimulation(endpointConfiguration: IEndpointConfiguration): number[] {
        let simulationCount: number[] = [0, 0];

        if (endpointConfiguration &&
            endpointConfiguration.clients &&
            endpointConfiguration.routes) {

            simulationCount[0] += endpointConfiguration.routes.length;

            let simClient = endpointConfiguration.clients.find(client => client.type === "simulation");

            if (simClient) {
                simulationCount[1] += endpointConfiguration.routes.filter(route => route.client === simClient.name).length;
            }
        }

        return simulationCount;
    }
}
