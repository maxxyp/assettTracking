import {IGpsService} from "./IGpsService";
import {GeoPosition} from "./models/geoPosition";

export class GpsService implements IGpsService {
    private _navigator: Navigator;
    private _lastPosition: GeoPosition;
    private _externalWatcherIdCounter: number;
    private _externalWatchers: { [id: number] : (position: GeoPosition) => void};

    constructor() {
        this._navigator = navigator;
        this._lastPosition = null;
        this._externalWatcherIdCounter = 0;
        this._externalWatchers = {};
        this.createInternalWatch();
    }

    public setNavigator(navigator: Navigator): void {
        this._navigator = navigator;
    }

    public async getLocation(): Promise<GeoPosition> {
        return this._lastPosition;
    }

    public startWatch(callback: (position: GeoPosition) => void): number {
        this._externalWatcherIdCounter++;
        this._externalWatchers[this._externalWatcherIdCounter] = callback;

        callback(this._lastPosition);

        return this._externalWatcherIdCounter;
    }

    public stopWatch(watchId: number): void {
        if (this._externalWatchers[watchId]) {
            delete this._externalWatchers[watchId];
        }
    }

    private createInternalWatch(): void {
        if (!this._navigator.geolocation) {
            return; // getLocation() will always return null to callers
        }

        const onSuccess = (position: Position) => {
            this._lastPosition = new GeoPosition(position.coords.longitude, position.coords.latitude);
            for (let watchId in this._externalWatchers) {
                this._externalWatchers[watchId](this._lastPosition);
            }
        };

        this._navigator.geolocation.watchPosition(
            onSuccess,
            () => {}, // don't worry about errors
            <PositionOptions>{
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 15000
            });
    }
}
