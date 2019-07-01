import { IUnsafeDetail } from "./IUnsafeDetail";
import { IRisk } from "./IRisk";
import { ISafetyDetail } from "./ISafetyDetail";
import { IContact } from "./IContact";
import { IAddress } from "./IAddress";

export interface IPremises {
    id: string;
    address: IAddress;
    previousVisitCount: number;
    chirpAICode: string;
    contact: IContact;
    specialAccessInstructions: string;
    safetyDetail: ISafetyDetail;
    risks: IRisk[];
    unsafeDetail: IUnsafeDetail;
}
