export interface IModalBusyService {
    showBusy(context: string, message: string, linkMessage?: string, linkCallback?: () => void) : Promise<void>;
    hideBusy(context: string) : Promise<void>;
}
