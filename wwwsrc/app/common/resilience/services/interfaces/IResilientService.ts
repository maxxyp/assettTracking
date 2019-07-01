/// <reference path="../../../../../typings/app.d.ts" />

import {RetryPayload} from "../../models/retryPayload";

export interface IResilientService {
    getUnsentPayloads(): Promise<RetryPayload[]>;
    clearUnsentPayloads(): Promise<void>;
    sendAllRetryPayloads(): Promise<void>;
    isRetryInProgress(): boolean;
    getConfigurationName(): string;
}
