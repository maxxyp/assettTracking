import {IPhoneService} from "../IPhoneService";

export class PhoneService implements IPhoneService {

    public hasPhone(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public showPhoneCallUI(phone: string, name?: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (phone) {
                window.open("tel:" + phone, "_blank");
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }
    public showPhoneSMSUI(recipientsPhone: string[], message: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (recipientsPhone && recipientsPhone.length > 0) {
                window.open("sms:" + recipientsPhone[0], "_blank");
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }
}
