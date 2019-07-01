/// <reference path="../../../../../typings/app.d.ts" />

import {IWhoAmI} from "../../models/fft/whoAmI/IWhoAmI";
import {IResilientService} from "../../../../common/resilience/services/interfaces/IResilientService";

export interface IWhoAmIService extends IResilientService {
    whoAmI(attributes: string[], roles: string[]): Promise<IWhoAmI>;
}
