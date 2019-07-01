import {IHttpHeader} from "../../core/IHttpHeader";
import { DateHelper } from "../../../hema/core/dateHelper";
export class RetryPayload {
    public correlationId: string;
    public httpMethod: "GET" | "POST" | "PUT";
    public createdTime: Date;
    public expiryTime: Date;
    public lastRetryTime: Date;
    public routeName: string;
    public headers: IHttpHeader[];
    public params: { [id: string]: any };
    public data: any;
    public isRetrying: boolean;
    
    public lastFailureMessage: string;
    public lastKnownFailureStatus: string;
    public failureWithStatusCount: number;
    public failureWithoutStatusCount: number;

    public static fromJson(raw: any): RetryPayload {
        let retryPayload = new RetryPayload();

        Object.assign(retryPayload, raw);

        retryPayload.createdTime = DateHelper.convertDateTime(raw.createdTime);
        retryPayload.expiryTime = DateHelper.convertDateTime(raw.expiryTime);
        retryPayload.lastRetryTime = DateHelper.convertDateTime(raw.lastRetryTime);

        // for backwards compatibility (if we have old versions of RetryPayload in storage they will not
        //  have the counts initialised, so ensure initialisation here)
        retryPayload.failureWithoutStatusCount = retryPayload.failureWithoutStatusCount || 0;
        retryPayload.failureWithStatusCount = retryPayload.failureWithStatusCount || 0;
        retryPayload.createdTime = retryPayload.createdTime || new Date();
        return retryPayload;
    }
}
