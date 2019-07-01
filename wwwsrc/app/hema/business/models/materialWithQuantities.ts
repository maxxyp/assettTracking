import { Material } from "./material";
export class MaterialWithQuantities extends Material {
    public quantityToBeCollected: number;    // parts collection amount
    public quantityToBeReturned: number;            // amount that I have said I'm returning today
    public quantityOutboundReservation: number;     // parts I'm to lose
    public quantityInboundReservation: number;      // parts I'm to gain
}
