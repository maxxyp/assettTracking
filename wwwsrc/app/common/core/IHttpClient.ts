import {IHttpHeader} from "./IHttpHeader";

export interface IHttpClient {
    setup(options: { username?: string, password?: string, noCredentialsHeader?: boolean, defaultQueryParams?: {[index: string]: string} }) : void;
    fetch(url: string, request?: RequestInit): Promise<Response>;
    getData<T>(baseEndpoint: string, endPoint: string, params: { [id: string]: any }, breakCache?: boolean, headers?: IHttpHeader[]): Promise<T>;
    postData<T, V>(baseEndPoint: string, endPoint: string, params: { [id: string]: any }, data: T, headers?: IHttpHeader[]): Promise<V>;
    putData<T, V>(baseEndPoint: string, endPoint: string, params: { [id: string]: any }, data: T, headers?: IHttpHeader[]): Promise<V>;
}
