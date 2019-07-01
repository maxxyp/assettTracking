export interface IPhoneService {
    hasPhone(): Promise<boolean>;
    showPhoneCallUI(phone: string, name?: string): Promise<boolean>;
    showPhoneSMSUI(recipientsPhone: string[], message: string): Promise<boolean>;
}
