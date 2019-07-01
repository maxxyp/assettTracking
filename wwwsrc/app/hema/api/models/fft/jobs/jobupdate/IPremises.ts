import {IUnsafeDetail} from "./IUnsafeDetail";
import {IRisk} from "./IRisk";
import {ISafety} from "./ISafety";
import {IContact} from "./IContact";
import {IAddress} from "./IAddress";

export interface IPremises {
    updateMarker: string;
    id: string;
    newPremisesId: string;
    specialAccessInstructions: string;
    address: IAddress;
    contact: IContact;
    risks: IRisk[];
    safety: ISafety;
    unsafeDetail: IUnsafeDetail;
}
