/// <reference path="../../../../typings/app.d.ts" />

import { HttpClient } from "aurelia-http-client";
import {SharePriceServiceConstants} from "./constants/sharePriceServiceConstants";
import {ITicker} from "../models/sharePrice/ITicker";
import {ApiException} from "../../../common/resilience/apiException";
import {ISharePriceService} from "./interfaces/ISharePriceService";

const { SHARE_PRICE_ENDPOINT } = SharePriceServiceConstants;

export class SharePriceService implements ISharePriceService { 

    private _httpClient: HttpClient;

    constructor() {
        this._httpClient = new HttpClient();
    }
    
    public getSharePrice(): Promise<ITicker> {
        return this._httpClient.get(SHARE_PRICE_ENDPOINT)
            .then((response) => {           
                let tickers: ITicker[];
                try {
                    tickers = JSON.parse(response.response.replace("//", ""));
                    return tickers[0];
                } catch (e) {
                    throw e;
                }
                
            })
            .catch((error) => {
                throw new ApiException(this, "getSharePrice", "There was an error obtaining the share price", null, error, null);
            });
    }
}
