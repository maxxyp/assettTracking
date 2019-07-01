import {GeoPosition} from "./models/geoPosition";

export interface IProximityService {
    startMonitoringDistance(destination: GeoPosition, delay: number): void;
    getDistance(): number;
    stopMonitoringDistance(): void;
}
