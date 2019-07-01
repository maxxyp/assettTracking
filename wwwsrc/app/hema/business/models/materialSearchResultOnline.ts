import {MaterialWithReservationQuantity} from "./materialWithReservationQuantity";

export class MaterialSearchResultOnline  {
    public stockReferenceId: string;
    public timestamp: number;
    public completionStatus:
        "SEARCHING"
        | "FOUND"
        | "NOT_FOUND"
        | "NOT_FOUND_OFFLINE";

    public results: {
        distance: number | "UNKNOWN";
        lat: number;
        lon: number;
        id: string;
        name: string;
        phone: string;
        workingStatus:
            "WORKING"
            | "NOT_WORKING"
            | "FORWARD_STOCK_LOCATION";
        material: MaterialWithReservationQuantity;
    }[];

    public summary: {
        totalParts: number;
        totalLocations: number;
        nearestDistance: number | "UNKNOWN";
    };

    constructor() {
        this.results = [];
        this.summary = {
            totalParts: undefined,
            totalLocations: undefined,
            nearestDistance: undefined
        };
    }
}
