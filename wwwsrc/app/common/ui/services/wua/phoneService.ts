import {IPhoneService} from "../IPhoneService";

export class PhoneService implements IPhoneService {

    private _appModel: any;

    constructor() {
        if (window.Windows && window.Windows.ApplicationModel) {
            this._appModel = window.Windows.ApplicationModel;
        }
    }

    public hasPhone(): Promise<boolean> {
        return Promise.resolve(!!this._appModel.Calls.PhoneCallManager);
    }

    public showPhoneCallUI(phone: string, name?: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (this._appModel) {
                if (this._appModel.Calls && this._appModel.Calls.PhoneCallManager) {
                    try {
                        this._appModel.Calls.PhoneCallManager.showPhoneCallUI(phone, name);
                        resolve(true);
                    } catch (err) {
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    }
    public showPhoneSMSUI(recipientsPhone: string[], message: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (this._appModel) {
                if (this._appModel.Chat &&
                    this._appModel.Chat.ChatMessage &&
                    this._appModel.Chat.ChatMessageManager) {
                    let chatMessage: any = new this._appModel.Chat.ChatMessage();
                    chatMessage.body = message;
                    for (let i: number = 0; i < recipientsPhone.length; i++) {
                        chatMessage.recipients.push(recipientsPhone[i]);
                    }
                    this._appModel.Chat.ChatMessageManager.showComposeSmsMessageAsync(chatMessage)
                        .then(() => {
                            resolve(true);
                        }).catch(() => {
                            resolve(false);
                        });
                } else {
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    }
}
