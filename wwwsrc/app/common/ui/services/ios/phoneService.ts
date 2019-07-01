import {inject} from "aurelia-framework";
import {IPhoneService} from "../IPhoneService";
import {AppLauncher} from "../../../core/services/appLauncher";
import {IAppLauncher} from "../../../core/services/IAppLauncher";

const IOS_TEL_URI: string = "tel:";
const IOS_SMS_URI: string = "sms:";

// dependency on cordova-plugin-inappbrowser
@inject(AppLauncher)
export class PhoneService implements IPhoneService {

    private _appLauncher: IAppLauncher;

    constructor(appLauncher: IAppLauncher) {
        this._appLauncher = appLauncher;
    }

    public hasPhone(): Promise<boolean> {
        return this._appLauncher.checkInstalled(IOS_TEL_URI);
    }

    public showPhoneCallUI(phone: string, name?: string): Promise<boolean> {
        return this._appLauncher.checkInstalled(IOS_TEL_URI)
            .then(result => {
                if (!result) {
                    return result;
                }
                cordova.InAppBrowser.open(IOS_TEL_URI + phone.replace(/\s/g, ""), "_system");
                return true;
            });
    }

    public showPhoneSMSUI(recipientsPhone: string[], message: string): Promise<boolean> {
        return this._appLauncher.checkInstalled(IOS_SMS_URI)
            .then(result => {
                if (!result) {
                    return result;
                }
                cordova.InAppBrowser.open(IOS_SMS_URI + recipientsPhone[0].replace(/\s/g, "") + "&body=" + encodeURIComponent(message), "_system");
                return true;
            });
    }
}
