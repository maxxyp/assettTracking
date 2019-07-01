import {inject, BindingEngine} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";

@inject(DialogController, BindingEngine)
export class ConfirmDialog {
    public model: { expected: number, collected: number };
    public controller: DialogController;
    public qtyMissing: number;
    public styleCollected: string;
    public summaryMessage: string;

    constructor(dialogController: DialogController) {
        this.controller = dialogController;
        if (this.controller) {
            this.controller.settings.lock = true;
            this.model = this.controller.settings.model;
            this.qtyMissing = this.model.expected - this.model.collected;
            this.styleCollected = this.qtyMissing > 0 ? "color: red;" : "color: green";

            const partWork = (qty: number) => qty === 1 ? "part" : "parts";
            const {qtyMissing, model} = this;
            const {collected} = model;

            this.summaryMessage = `${collected} ${partWork(this.model.collected)} collected / ${qtyMissing} ${partWork(this.qtyMissing)} missing`;
        }
    }
}
