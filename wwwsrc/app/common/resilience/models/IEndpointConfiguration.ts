import {IEndpointClientConfiguration} from "./IEndpointClientConfiguration";
import {IEndpointRouteConfiguration} from "./IEndpointRouteConfiguration";

export interface IEndpointConfiguration {
    clients: IEndpointClientConfiguration[];
    routes: IEndpointRouteConfiguration[];
    sendAnalyticsOnSuccess?: boolean;
}
