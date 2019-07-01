import { IWhoAmI } from "../../../api/models/fft/whoAmI/IWhoAmI";

export interface IAuthenticationService {
    authenticate(category: string, isCurrentlySignedOn: boolean): Promise<{hasWhoAmISucceeded: boolean, result?: IWhoAmI}>;
}
