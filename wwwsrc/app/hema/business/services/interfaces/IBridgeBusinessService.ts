/// <reference path="../../../../../typings/app.d.ts" />

import {ExternalApplianceAppModel} from "../../models/adapt/externalApplianceAppModel";
import {UserSettings} from "../../models/adapt/UserSettings";
import { BridgeDiagnostic } from "../../models/bridgeDiagnostic";
export interface IBridgeBusinessService {
    initialise(): Promise<void>;
    getUserSettings(): Promise<UserSettings>;
    getApplianceInformation(applianceGCCode: string): Promise<ExternalApplianceAppModel>;
    exportCustomerDetails(jobId: string, hasTobeActive: boolean): Promise<void>;
    getDiagnostic(): Promise<BridgeDiagnostic>;
}
