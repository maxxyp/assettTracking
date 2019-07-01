export interface IResponse {
    type: string | ResponseType;
    url: string;
    status: number;
    ok: boolean;
    statusText: string;
    headers: any;
    json<T>(): Promise<T>;
}
