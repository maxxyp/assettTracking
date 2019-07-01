import * as ga from "universal-ga";
import { EventAggregator } from "aurelia-event-aggregator";
import { IConfigurationService } from "../core/services/IConfigurationService";
import { IAppMetaDataService } from "../core/services/IAppMetaDataService";
import { IAnalyticsConfiguration } from "./IAnalyticsConfiguration";
import { inject } from "aurelia-framework";
import { ConfigurationService } from "../core/services/configurationService";
import { AppMetaDataService } from "../core/services/appMetaDataService";
import { NavigationInstruction } from "aurelia-router";
import { IAppMetaData } from "../core/services/IAppMetaData";
import { IAnalyticsService } from "./IAnalyticsService";
import * as Logging from "aurelia-logging";
import { IAnalyticsEvent } from "./IAnalyticsEvent";
import { AnalyticsConstants } from "./analyticsConstants";
import { ENGINEER_ID_DIEMENTION4, ENGINEER_GEO_POSITION_DIEMENTION5, UNIQUE_ID_DIEMENTION7 } from "./analyticsCustomDimentions";
import { GpsService } from "../geo/gpsService";
import { IGpsService } from "../geo/IGpsService";

@inject(EventAggregator, ConfigurationService, AppMetaDataService, GpsService)
export class Analytics implements IAnalyticsService {

    private _eventAggregator: EventAggregator;
    private _configurationService: IConfigurationService;
    private _appMetaDataService: IAppMetaDataService;
    private _gpsService: IGpsService;

    private _bootstrapped: boolean;
    private _logger: Logging.Logger;
    private _config: IAnalyticsConfiguration;

    private _lastCustomData: string;

    constructor(eventAggregator: EventAggregator,
        configurationService: IConfigurationService,
        appMetaDataService: IAppMetaDataService,
        gpsService: IGpsService) {
        this._eventAggregator = eventAggregator;
        this._configurationService = configurationService;
        this._appMetaDataService = appMetaDataService;
        this._gpsService = gpsService;

        this._bootstrapped = false;
        this._logger = Logging.getLogger("Analytics");
    }

    public initialize(userId?: string, opts?: { trackNavigation?: boolean }): Promise<void> {
        this._config = this._configurationService.getConfiguration<IAnalyticsConfiguration>();
        if (this._config && this._config.analyticsEnabled) {
            return this._appMetaDataService.get()
                .then(metaData => {
                    ga.initialize(this._config.analyticsTrackingId, { debug: true });
                    // hack - fix issue when running as WUA app.
                    (<any>window).ga("set", "checkProtocolTask", () => { });
                    ga.set("appName", metaData.appName);
                    ga.set("appId", metaData.appId);
                    ga.set("appVersion", metaData.appVersion);
                    ga.set("appInstallerId", metaData.appInstallerId);

                    if (!!userId) {
                        ga.set(ENGINEER_ID_DIEMENTION4, userId);
                        this.logGeoPosition();
                    }

                    this._logger.debug("initalised.");

                    if (opts && !!opts.trackNavigation) {
                        this.trackRouterNavigation(metaData);
                        this._logger.debug("tracking router navigation.");
                    }
                    this._eventAggregator.subscribe(AnalyticsConstants.ANALYTICS_EVENT, (event: IAnalyticsEvent) => {
                        try {
                            if (event) {
                                ga.set(UNIQUE_ID_DIEMENTION7, Date.now() + "");
                                (<any>ga).event(event.category, event.action, {
                                    "eventLabel": event.label,
                                    "eventValue": event.metric
                                });
                            }
                        } catch {
                            // do nothing
                        }
                    });
                    this._bootstrapped = true;
                    this._logger.info("bootstrapped.");
                })
                .catch(err => {
                    this._logger.debug(err);
                });
        }

        this._logger.info("No analytics configuration defined.");
        return Promise.resolve();
    }
    public setUserId(userId: string): void {
        if (userId) {
            ga.set(ENGINEER_ID_DIEMENTION4, userId);
        }
    }

    public setCustomMetaData(data: { [index: string]: string }, customDimensionMap: { [index: string]: keyof ga.IFieldObjectDimension }): void {
        let hash = JSON.stringify(data);

        if (this._bootstrapped && hash !== this._lastCustomData) {
            this._lastCustomData = hash;

            Object.keys(customDimensionMap).map(mapKey => {
                let mapKeyValue = customDimensionMap[mapKey];
                let attribute = data && data[mapKey];
                if (attribute) {
                    ga.set(mapKeyValue, attribute);
                }
            });
        }
    }

    public exception(errorMessage: string, isFatal: boolean): void {
        if (this._bootstrapped) {
            try {
                ga.exception(errorMessage, isFatal);
            } catch {
                // do nothing
            }
        }
    }

    public logGeoPosition(): void {
        try {
            if (this._config && this._config.analyticsEnabled && this._config.logGeoLocation) {
                this._gpsService.getLocation().then((location) => {
                    if (location && location.latitude && location.longitude) {
                        ga.set(ENGINEER_GEO_POSITION_DIEMENTION5, location.latitude + "," + location.longitude);
                    }
                }).catch(() => { /* do nothing */ });
            }
        } catch {
            // do nothing
        }
    }

    private trackRouterNavigation(metaData: IAppMetaData): void {
        this._eventAggregator.subscribe("router:navigation:complete", (params: {
            instruction: NavigationInstruction,
            result: { completed: boolean }
        }) => {
            let targetInstruction = (params.instruction.getAllInstructions() || []).splice(-1)[0];
            if (params && params.result && params.result && targetInstruction && targetInstruction.config && targetInstruction.config.name) {
                ga.screenview(targetInstruction.config.name);
            }
        });
    }
}
