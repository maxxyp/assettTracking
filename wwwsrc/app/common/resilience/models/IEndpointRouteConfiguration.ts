import { SuccessLoggingMode } from "./successLoggingMode";
export interface IEndpointRouteConfiguration {
    route: string;
    client: string;
    path: string;
    successLoggingMode?: SuccessLoggingMode;
}
