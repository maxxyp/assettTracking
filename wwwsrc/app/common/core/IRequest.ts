export interface IRequest {
    method?: string;
    headers?: { [index: string]: string };
    mode?: RequestMode;
    body?: string;
}
