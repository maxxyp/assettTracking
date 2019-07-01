/// <reference path="../../../typings/app.d.ts" />

import "whatwg-fetch";
import * as Logging from "aurelia-logging";
import {UriSchemeService} from "./services/uriSchemeService";
import {Aurelia} from "aurelia-framework";
import {PlatformHelper} from "./platformHelper";
import {IConfigurationService} from "./services/IConfigurationService";
import {ConfigurationService} from "./services/configurationService";
import {ErrorHandler} from "./errorHandler";
import { LoggerService } from "./services/loggerService";
import { ILogConfiguration } from "./services/ILogConfiguration";
import { ILoggerService } from "./services/ILoggerService";

export class Startup {
    public static configure(aurelia: Aurelia, resources: string[], plugins: string[]) : Promise<Aurelia> {

        PlatformHelper.isDevelopment = window.appIsDevelopment ? window.appIsDevelopment : false;
        PlatformHelper.appVersion = window.appVersion ? window.appVersion : "<local>";
        PlatformHelper.buildType = window.appBuildType ? window.appBuildType : "dev";
        PlatformHelper.isSource = window.appIsSource ? window.appIsSource : false;

        aurelia.use
               .defaultBindingLanguage()
               .defaultResources()
               .router()
               .eventAggregator()
               .plugin("aurelia-validation")
               .plugin("aurelia-dialog", (config: any) => {
                   config.useDefaults().useCSS("");
               });

        if (resources) {
            for (let i = 0; i < resources.length; i++) {
                aurelia.use.globalResources(PlatformHelper.appRoot() + resources[i]);
            }
        }

        if (plugins) {
            for (let i = 0; i < plugins.length; i++) {
                aurelia.use.plugin(plugins[i]);
            }
        }

        if (PlatformHelper.getPlatform() === "wua") {
            aurelia.use.plugin(PlatformHelper.appRoot() + "common/core/plugins/historyWua/index");
        } else {
            aurelia.use.history();
        }

        let configService: IConfigurationService = aurelia.container.get(ConfigurationService);
        let uriSchemeService: UriSchemeService = aurelia.container.get(UriSchemeService);

        return ErrorHandler.init(aurelia)
                .then(() => configService.load())
                .then(() => aurelia.start())
                .then(() => {
                    let loggerService = <ILoggerService>aurelia.container.get(LoggerService);
                    return loggerService.initialize(aurelia, configService.getConfiguration<ILogConfiguration>());
                })
                .then(() => {
                    let logger: Logging.Logger = Logging.getLogger("Platform");
                    logger.debug("Platform: " + PlatformHelper.getPlatform());
                    logger.debug("Is Cordova: " + PlatformHelper.isCordova());
                    logger.debug("Is Mobile: " + PlatformHelper.isMobile());
                    if (PlatformHelper.isCordova()) {
                        logger.debug("Cordova Version: " + PlatformHelper.cordovaVersion());
                        logger.debug("Cordova Platform Id: " + PlatformHelper.cordovaPlatformId());
                    }
                    logger.debug("Screen Width: " + window.innerWidth);
                    logger.debug("Screen Height: " + window.innerHeight);
                    logger.warn("App Version: " + PlatformHelper.appVersion);

                    uriSchemeService.registerPlatform();
                    uriSchemeService.navigateToInitialRoute();

                    return aurelia;
                })
                .then(() => aurelia.setRoot());
    }
}
