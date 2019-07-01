import { IWhoAmIService } from "../../api/services/interfaces/IWhoAmIService";
import { inject } from "aurelia-framework";
import { WhoAmIService } from "../../api/services/whoAmIService";
import { WhoAmIServiceConstants } from "./constants/whoAmIServiceConstants";
import { IAuthenticationService } from "./interfaces/IAuthenticationService";
import { IConfigurationService } from "../../../common/core/services/IConfigurationService";
import { IHemaConfiguration } from "../../IHemaConfiguration";
import * as Logging from "aurelia-logging";
import { IWhoAmI } from "../../api/models/fft/whoAmI/IWhoAmI";
import { ConfigurationService } from "../../../common/core/services/configurationService";
import { Threading } from "../../../common/core/threading";
import { EventAggregator } from "aurelia-event-aggregator";
import { InitialisationEventConstants } from "../constants/initialisationEventConstants";
import { InitialisationCategory } from "../models/initialisationCategory";
import { InitialisationUpdate } from "../models/initialisationUpdate";
import { AuthenticationServiceConstants } from "./authenticationServiceConstants";

const { WHO_AM_I_ATTRIBUTES } = WhoAmIServiceConstants;
const TIMEOUT_ERROR = "TimeoutError";

enum WhoAmICallResultType {
    success,
    timeout,
    httpError
}

type WhoAmICallResult = {
    resultType: WhoAmICallResultType,
    whoAmI?: IWhoAmI,
    error?: any
};

@inject(ConfigurationService, WhoAmIService, EventAggregator, AuthenticationServiceConstants)
export class AuthenticationService implements IAuthenticationService {

    private _configurationService: IConfigurationService;
    private _whoAmIService: IWhoAmIService;
    private _logger: Logging.Logger;
    private _eventAggregator: EventAggregator;
    private _authenticationServiceConstants: AuthenticationServiceConstants;

    constructor(configurationService: IConfigurationService,
                whoAmIService: IWhoAmIService,
                eventAggregator: EventAggregator,
                authenticationServiceConstants: AuthenticationServiceConstants) {
        this._configurationService = configurationService;
        this._whoAmIService = whoAmIService;
        this._eventAggregator = eventAggregator;
        this._authenticationServiceConstants = authenticationServiceConstants;

        this._logger = Logging.getLogger("EngineerAuthentication");
    }

    public async authenticate(category: string, isCurrentlySignedOn: boolean): Promise<{hasWhoAmISucceeded: boolean, result?: IWhoAmI}> {
        try {
            let result = await this.pollWhoAmI(category, isCurrentlySignedOn);
            return {hasWhoAmISucceeded: true, result};
        } catch (error) {
            return {hasWhoAmISucceeded: false};
        }
    }

    private async pollWhoAmI(category: string, isCurrentlySignedOn: boolean): Promise<IWhoAmI> {
        let config = this._configurationService.getConfiguration<IHemaConfiguration>() || <IHemaConfiguration>{};
        // if we are already signed on, don't burden the user with more than one attempt
        let timeoutPollingAttempts = config.whoAmITimeoutRetries || 1;
        let timeoutSecs = Math.round(config.whoAmITimeoutMs || this._authenticationServiceConstants.DEFAULT_TIME_OUT_MS) / 1000;
        let allowedRoles = config.activeDirectoryRoles || [];

        let timeoutAttemptIndex = 1;
        while (true) {
            let whoAmIResult = await this.makeWhoAmICall(category, timeoutSecs, allowedRoles);

            if (whoAmIResult.resultType === WhoAmICallResultType.success) {
                // a success
                return whoAmIResult.whoAmI;
            } else if (isCurrentlySignedOn) {
                // a failure, but we are currently signed on so don't bother polling more
                throw whoAmIResult.error;
            } else {
                // observe the polling attempt counter to see how long we go for
                if (timeoutAttemptIndex >= timeoutPollingAttempts) {
                    throw whoAmIResult.error;
                }
                timeoutAttemptIndex += 1;
            }
        }
    }

    private async makeWhoAmICall(category: string, timeoutSecs: number, allowedRoles: string[]): Promise<WhoAmICallResult> {

        let timerId: number;
        let startFeedingback = () => {
            this._eventAggregator.publish(InitialisationEventConstants.INITIALISE_CATEGORY,
                <InitialisationCategory>{
                    category,
                    item: `Contacting Authorisation Server. Please wait... (${timeoutSecs} seconds remaining)`,
                    progressValue: 0,
                    progressMax: timeoutSecs
            });

            let secondsElapsed = 0;
            timerId = Threading.startTimer(() => {
                secondsElapsed += 1;
                this._eventAggregator.publish(InitialisationEventConstants.INITIALISE_UPDATE,
                    <InitialisationUpdate>{
                        item: `Contacting Authorisation Server. Please wait... (${timeoutSecs - secondsElapsed} seconds remaining)`,
                        progressValue: secondsElapsed
                    });
            }, this._authenticationServiceConstants.FEEDBACK_INTERVAL_MS);
        };

        let stopFeedingback = async (resultType: WhoAmICallResultType) => {
            Threading.stopTimer(timerId);

            let reasonText = "";
            switch (resultType) {
                case WhoAmICallResultType.timeout:
                    reasonText = `Failed - server did not respond within ${timeoutSecs} seconds. Please wait...`;
                    break;
                case WhoAmICallResultType.httpError:
                    reasonText = "Failed - server returned an error. Please wait...";
                    break;
                case WhoAmICallResultType.success:
                    reasonText = "Succeeded";
                    break;
            }

            this._eventAggregator.publish(InitialisationEventConstants.INITIALISE_UPDATE,
                <InitialisationUpdate>{
                    item: `Attempt ${reasonText}`,
                    progressValue: timeoutSecs
                });

            await Promise.delay(resultType === WhoAmICallResultType.success
                ? this._authenticationServiceConstants.SUCCESS_WAIT_MS
                : this._authenticationServiceConstants.FAIL_WAIT_MS
            );
        };

        try {
            startFeedingback();
            let whoAmI = await this._whoAmIService.whoAmI(WHO_AM_I_ATTRIBUTES, allowedRoles)
                                    .timeout(timeoutSecs * 1000);
            await stopFeedingback(WhoAmICallResultType.success);

            return <WhoAmICallResult>{resultType: WhoAmICallResultType.success, whoAmI};
        } catch (error) {
            let isTimeoutError = error && error.name === TIMEOUT_ERROR;
            this._logger.warn("Unable to reach whoAmIService", {isTimeoutError, error});

            await stopFeedingback(isTimeoutError
                                    ? WhoAmICallResultType.timeout
                                    : WhoAmICallResultType.httpError
                                );

            return <WhoAmICallResult>{
                resultType: isTimeoutError
                                ? WhoAmICallResultType.timeout
                                : WhoAmICallResultType.httpError,
                error
            };
        }
    }
}
