import {ITicker} from "../../models/sharePrice/ITicker";

export interface ISharePriceService {
    getSharePrice(): Promise<ITicker>;
}
