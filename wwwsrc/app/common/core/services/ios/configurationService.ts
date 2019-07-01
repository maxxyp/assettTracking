/// <reference path="../../../../../typings/app.d.ts" />

import * as Logging from "aurelia-logging";
import {IConfigurationService} from "../IConfigurationService";

export class ConfigurationService implements IConfigurationService {
    private _configuration: any;
    private _configFile: string;
    private _logger: Logging.Logger;

    constructor() {
        this._configuration = null;
        this._configFile = cordova.file.applicationDirectory + "www/app.config.json";
        this._logger = Logging.getLogger("Configuration");
    }

    public getConfiguration<T>(childName?: string): T {
        return childName ? this._configuration[childName] : this._configuration;
    }

    public load<T>(): Promise<T> {
        if (!!this._configuration) {
            return Promise.resolve(this._configuration);
        }

        return this.fetchConfigFile<T>();
    }

    public overrideSettings<T>(settings: T): void {
        Object.assign(this._configuration, settings);
    }

    private fetchConfigFile<T>(): Promise<T> {
         return new Promise<T>((resolve) => {
            window.resolveLocalFileSystemURL(this._configFile, (fileEntry: FileEntry) => {
                fileEntry.file((file: File) => {
                    let reader = new FileReader();
                    reader.onloadend = () => {
                        try {
                            this._configuration = JSON.parse(reader.result);
                        } catch (err) {
                            this._logger.error("Cannot parse configuration", err);
                            return resolve(null);
                        }
                        resolve(this._configuration);
                    };
                    reader.readAsText(file);

                }, (err: FileError) => {
                    this._logger.error("Cannot read configuration file " + this._configFile, err);
                    resolve(null);
                });
            }, (err) => {
                this._logger.error("Cannot load configuration file " + this._configFile, err);
                resolve(null);
            });
        });
    }
}
