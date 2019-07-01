export interface IDeviceService {
    getDeviceId() : Promise<string>;
    getDeviceType() : Promise<string>;
}
