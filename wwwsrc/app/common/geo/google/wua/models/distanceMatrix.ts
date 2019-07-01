import {DistanceMatrixRow} from "./distanceMatrixRow";

export class DistanceMatrix {
    public "destination_addresses": string[];
    public "origin_addresses": string[];
    public rows: DistanceMatrixRow[];
    public status: string;
}
