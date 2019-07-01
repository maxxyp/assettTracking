import { IPhoneService } from "./IPhoneService";
import { PlatformServiceBase } from "../../core/platformServiceBase";

export class PhoneService extends PlatformServiceBase<IPhoneService> implements IPhoneService {
    
    constructor() {
        super("common/ui/services", "PhoneService");
    }

    public hasPhone(): Promise<boolean> {
        return this.loadModule().then((module) => {
             return module.hasPhone();
        });
    }

    public showPhoneCallUI(phone: string, name?: string): Promise<boolean> {
        return this.loadModule().then((module) => {
             return module.showPhoneCallUI(phone, name);
        });
    }

    public showPhoneSMSUI(recipientsPhone: string[], message: string): Promise<boolean> {
        return this.loadModule().then((module) => {
             return module.showPhoneSMSUI(recipientsPhone, message);
        });
    }
}
