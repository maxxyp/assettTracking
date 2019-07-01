import {inject} from "aurelia-framework";

import {ISharePriceService} from "./interfaces/ISharePriceService";
import {Ticker} from "../models/sharePrice/ticker"; 

import {ISharePriceService as IApiSharePriceService} from "../../api/services/interfaces/ISharePriceService";
import {SharePriceService as ApiSharePriceService} from "../../api/services/sharePriceService";
import {ITicker as ApiTicker} from "../../api/models/sharePrice/ITicker";

@inject(ApiSharePriceService)
export class SharePriceService implements ISharePriceService {

    private _sharePriceService: IApiSharePriceService;

    constructor(sharePriceService: IApiSharePriceService) {
        this._sharePriceService = sharePriceService;
    }

    public getSharePrice(): Promise<Ticker> {
        return this._sharePriceService.getSharePrice()
            .then(res => this.mapToModel(res));
    }

     public mapToModel(apiTicker: ApiTicker): Ticker {
        let ticker = new Ticker();
        ticker.change = apiTicker.c;
        ticker.date = new Date(apiTicker.lt_dts);
        ticker.exchange = apiTicker.e;
        ticker.percentageChange = apiTicker.cp;
        ticker.price = apiTicker.l;
        ticker.symbol = apiTicker.t;
        return ticker;
    }
}
