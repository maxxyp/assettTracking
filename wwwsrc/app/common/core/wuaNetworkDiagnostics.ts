import { EventAggregator } from "aurelia-event-aggregator";
import { PlatformHelper } from "./platformHelper";
import { inject } from "aurelia-framework";
import { WuaNetworkDiagnosticsResult } from "./wuaNetworkDiagnosticsResult";
import { WuaNetworkDiagnosticsConstants } from "./constants/wuaNetworkDiagnosticsConstants";

const PRIVATE_NETWORK_STATUS_CHANGED = "networkstatuschanged";
@inject(EventAggregator)
export class WuaNetworkDiagnostics {

    private _eventAggregator: EventAggregator;
    private _isInternetConnected: boolean;

    constructor(eventAggregator: EventAggregator) {
        if (!PlatformHelper.isWua()) {
            this._isInternetConnected = true;
            return;
        }

        this._eventAggregator = eventAggregator;

        const setIsInternetConnected = () => {
            const connectionProfile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
            this._isInternetConnected = !!(connectionProfile && (connectionProfile.isWlanConnectionProfile || connectionProfile.isWwanConnectionProfile));
        };

        Windows.Networking.Connectivity.NetworkInformation.addEventListener(
            PRIVATE_NETWORK_STATUS_CHANGED,
            () => {
                setIsInternetConnected();
                this._eventAggregator.publish(WuaNetworkDiagnosticsConstants.NETWORK_STATUS_CHANGED, this._isInternetConnected);
            }
        );
        setIsInternetConnected();
    }

    public isInternetConnected(): boolean {
        return !!this._isInternetConnected;
    }

    public getDiagnostics() : WuaNetworkDiagnosticsResult {
        if (!PlatformHelper.isWua()) {
            return {
                connection: "not-uwp-platform"
            };
        }

        try {
            const connectionProfile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
            if (!connectionProfile) {
                return {
                    connection: "no-connection-found"
                };
            }

            const {internetAccess, localAccess, constrainedInternetAccess} = Windows.Networking.Connectivity.NetworkConnectivityLevel;
            const connectivityLevelId = connectionProfile.getNetworkConnectivityLevel();

            let connectivityLevel;
            switch (connectivityLevelId) {
                case localAccess:
                    connectivityLevel = "Local Access";
                    break;
                case constrainedInternetAccess:
                    connectivityLevel = "Constrained Internet Access";
                    break;
                case internetAccess:
                    connectivityLevel = "Internet Access";
                    break;
                default:
                    connectivityLevel = "Don't Know: " + connectivityLevelId;
                    break;
            }

            const {authenticated, unauthenticated} = Windows.Networking.Connectivity.DomainConnectivityLevel;
            const domainConnectivityLevelValue = connectionProfile.getDomainConnectivityLevel();

            let domainConnectivityLevel;
            switch (domainConnectivityLevelValue) {
                case authenticated:
                    domainConnectivityLevel = "authenticated";
                    break;
                case unauthenticated:
                    domainConnectivityLevel = "unauthenticated";
                    break;
                default:
                    domainConnectivityLevel = "Don't Know: " + domainConnectivityLevelValue;
                    break;
            }

            let result = <any>{
                connectivityLevel,
                domainConnectivityLevel,
                connection: "none"
            };

            if (connectionProfile.isWlanConnectionProfile) {
                const details = connectionProfile.wlanConnectionProfileDetails;
                result = { ...result,
                            connection: "wlan",
                            ssid: details && details.getConnectedSsid()
                };

            } else if (connectionProfile.isWwanConnectionProfile) {
                let details = connectionProfile.wwanConnectionProfileDetails;
                const {none, deregistered, searching, home, roaming, partner, denied} = Windows.Networking.Connectivity.WwanNetworkRegistrationState;

                let networkRegistrationStateId = details && details.getNetworkRegistrationState();
                let networkRegistrationState;
                switch (networkRegistrationStateId) {
                    case none:
                        networkRegistrationState = "None";
                        break;
                    case deregistered:
                        networkRegistrationState = "Deregeistered";
                        break;
                    case searching:
                        networkRegistrationState = "Searching";
                        break;
                    case home:
                        networkRegistrationState = "Home";
                        break;
                    case roaming:
                        networkRegistrationState = "Roaming";
                        break;
                    case partner:
                        networkRegistrationState = "Partner";
                        break;
                    case denied:
                        networkRegistrationState = "Denied";
                        break;
                    default:
                        networkRegistrationState = "Don't Know";
                }

                result = {... result,
                            connection: "wwan",
                            signalBarsOf5: connectionProfile.getSignalBars(),
                            accessPointName: details && details.accessPointName,
                            homeProviderId: details && details.homeProviderId,
                            networkRegistrationState
                };
            }

            return result;

        } catch (error) {
            return {
                connection: "diagnostic-error",
                error: error && error.toString()
            };
        }
    }
}
