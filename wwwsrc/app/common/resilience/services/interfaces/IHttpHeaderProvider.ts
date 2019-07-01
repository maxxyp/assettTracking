/// <reference path="../../../../../typings/app.d.ts" />

import {IHttpHeader} from "../../../core/IHttpHeader";

export interface IHttpHeaderProvider {
    setStaticHeaders(staticHeaders: IHttpHeader[]): void;

    getHeaders(routeName: string): Promise<IHttpHeader[]>;
}
