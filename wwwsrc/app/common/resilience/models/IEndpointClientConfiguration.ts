export interface IEndpointClientConfiguration {
    name: string;

    type: "simulation" | "basic" | "http";

    root?: string;
    userName?: string;
    password?: string;
    envQueryParams?: { [index: string]: string };
}
