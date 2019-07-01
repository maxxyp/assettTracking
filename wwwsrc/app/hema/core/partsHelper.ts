import { IPartsNotUsedReason } from "../business/models/reference/IPartsNotUsedReason";

export class PartsHelper {
    public static filterPartsNotUsedReasonsForAssetTracking(reasons: IPartsNotUsedReason[]): IPartsNotUsedReason[] {
        const returnReasonCodeFilterOut = ["WG", "OK", "DP", "NR"];
        const result = reasons
            .filter(x => returnReasonCodeFilterOut.indexOf(x.reasonCode) < 0);
        const reason1: IPartsNotUsedReason = { reasonCode: "ME", partsNotUsedReasonDescription: "Material expired" };
        result.unshift(reason1);
        const reason2: IPartsNotUsedReason = { reasonCode: "MR", partsNotUsedReasonDescription: "Material recalled" };
        result.unshift(reason2);
        const reason3: IPartsNotUsedReason = { reasonCode: "MW", partsNotUsedReasonDescription: "Material under warranty" };
        result.unshift(reason3);
        const reason4: IPartsNotUsedReason = { reasonCode: "MD", partsNotUsedReasonDescription: "Material damaged" };
        result.unshift(reason4);        
        return result;
    }
}
