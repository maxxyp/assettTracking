export interface ICustomerInfoService {
    openAppIfNotVisited(premisesId: string, force?: boolean): Promise<void>;
    openApp(premisesId: string): Promise<void>;
    registerCustomerTipsCallback(callback: (premisesId: string) => void): { dispose: () => void };
}
