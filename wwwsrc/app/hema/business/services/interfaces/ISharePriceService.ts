import {Ticker} from "../../models/sharePrice/ticker";

export interface ISharePriceService {
    getSharePrice(): Promise<Ticker>;
}
