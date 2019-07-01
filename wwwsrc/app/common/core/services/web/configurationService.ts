/// <reference path="../../../../../typings/app.d.ts" />

import * as Logging from "aurelia-logging";
import {inject} from "aurelia-framework";
import {IConfigurationService} from "../IConfigurationService";
import {PlatformHelper} from "../../platformHelper";
import {HttpClient} from "../../httpClient";
import {IHttpClient} from "../../IHttpClient";

@inject(HttpClient)
export class ConfigurationService implements IConfigurationService {
    private _configuration: any;
    private _httpClient: IHttpClient;
    private _configFile: string;
    private _logger: Logging.Logger;

    constructor(httpClient: IHttpClient) {
        this._configuration = null;
        this._httpClient = httpClient;
        this._logger = Logging.getLogger("Configuration");

        this._configFile = PlatformHelper.loaderPrefix + "app.config.json";
    }

    public getConfiguration<T>(childName?: string): T {
        return childName ? this._configuration[childName] : this._configuration;
    }

    public load<T>(): Promise<T> {
        return new Promise<T>((resolve) => {
            if (!this._configuration) {
                this._httpClient.fetch(this._configFile)
                    .then((response: Response) => response.json())
                    .then((json: T) => {
                        this._configuration = json;
                        resolve(this._configuration);
                    }).catch((err) => {
                         this._logger.error("Cannot parse configuration", err);
                        resolve(null);
                    });
            } else {
                resolve(this._configuration);
            }
        });
    }

    public overrideSettings(settings: {[key: string]: any}): void {
        Object.assign(this._configuration, settings);
    }
}
