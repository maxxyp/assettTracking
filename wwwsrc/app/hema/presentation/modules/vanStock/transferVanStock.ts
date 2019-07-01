
import { inject, BindingEngine } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { Subscription } from "aurelia-event-aggregator";
import { TransferVanStockItemViewModel } from "./viewModels/transferVanStockItemViewModel";

@inject(DialogController, BindingEngine)
export class TransferVanStock {
    public summary: string;
    public model: TransferVanStockItemViewModel[];
    public availableReturnQuantity: number;
    public minReturnQuantity: number;
    public controller: DialogController;
    public isValid: boolean;

    private _bindingEngine: BindingEngine;
    private _subs: Subscription[];

    constructor(dialogController: DialogController, bindingEngine: BindingEngine) {
        this.isValid = false;
        this._subs = [];
        this._bindingEngine = bindingEngine;
        this.minReturnQuantity = 1;
        this.controller = dialogController;
        if (this.controller) {
            this.controller.settings.lock = true;
            this.model = this.controller.settings.model;
            this.summary = this.controller.settings.summary;
        }
    }

    public async attached(): Promise<void> {
        this.model.forEach(p => {
            let sub = this._bindingEngine.propertyObserver(p, "quantityRequested")
                .subscribe(() => {
                    this.isValid = !this.model
                        .map(q => q.quantityRequested)
                        .every(i => i === 0);
                });
            this._subs.push(sub);
        });
        return Promise.resolve();
    }

    public detached(): Promise<void> {
        if (this._subs) {
            this._subs.forEach(s => {
                s.dispose();
                s = null;
            });
            this._subs = [];
        }
        return Promise.resolve();
    }

}
