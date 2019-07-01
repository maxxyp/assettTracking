import { HelpOverlayStep } from "./helpOverlayStep";
export class HelpOverlayConfig {
    public page: string;
    public allSteps: boolean;
    public steps: HelpOverlayStep[];
    constructor(page: string, steps: HelpOverlayStep[]) {
        this.page = page;
        this.steps = steps;
    }
}
