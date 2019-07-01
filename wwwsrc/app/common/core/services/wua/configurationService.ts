/// <reference path="../../../../../typings/app.d.ts" />

import * as Logging from "aurelia-logging";
import {IConfigurationService} from "../IConfigurationService";
import {PlatformHelper} from "../../platformHelper";

export class ConfigurationService implements IConfigurationService {
    private _configuration: any;
    private _configFile: string;
    private _logger: Logging.Logger;

    constructor() {
        this._configuration = null;
        this._configFile = "app.config.json";
        this._logger = Logging.getLogger("Configuration");
    }

    public getConfiguration<T>(childName?: string): T {
        return childName ? this._configuration[childName] : this._configuration;
    }

    public load<T>(): Promise<T> {
        return new Promise<T>((resolve) => {
            if (!this._configuration) {
                /* first try and load an override config from the local state folder */

                Windows.Storage.ApplicationData.current.localFolder.getFileAsync(this._configFile).then(
                    (fileInFolder: Windows.Storage.StorageFile) => {
                        this.loadFromFile(fileInFolder)
                            .then((config) => resolve(config));
                    },
                    (err: any) => {
                        let packagedConfigFile = PlatformHelper.wwwRoot() + "\\" + this._configFile;

                        /* no local config read the one from the package */
                        Windows.ApplicationModel.Package.current.installedLocation.getFileAsync(packagedConfigFile).then(
                            (fileInFolder) => {
                                this.loadFromFile(fileInFolder)
                                    .then((config) => resolve(config));
                            },
                            (err2) => {
                                this._logger.error("Cannot load configuration file " + packagedConfigFile, err2);
                                resolve(null);
                            }
                        );
                    }
                );
            } else {
                resolve(this._configuration);
            }
        });
    }

    public overrideSettings(settings: {[key: string]: any}): void {
        Object.assign(this._configuration, settings);
    }

    private loadFromFile(fileInFolder: Windows.Storage.StorageFile) : Promise<any> {
        return new Promise<void>((resolve, reject) => {
            Windows.Storage.FileIO.readBufferAsync(fileInFolder).then(
                (buffer) => {
                    let dataReader = Windows.Storage.Streams.DataReader.fromBuffer(buffer);
                    try {
                        this._configuration = JSON.parse(dataReader.readString(buffer.length));
                    } catch (err) {
                        this._logger.error("Cannot parse configuration", err);
                        return resolve(null);
                    }
                    resolve(this._configuration);
                },
                (err) => {
                    this._logger.error("Cannot read configuration file " + this._configFile, err);
                    resolve(null);
                }
            );
        });
    }
}
