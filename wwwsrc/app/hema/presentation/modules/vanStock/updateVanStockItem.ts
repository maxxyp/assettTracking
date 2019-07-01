import { inject, BindingEngine, Disposable } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { UpdateVanStockItemViewModel } from "./viewModels/updateVanStockItemViewModel";

@inject(DialogController, BindingEngine)
export class UpdateVanStockItem {
    public model: UpdateVanStockItemViewModel;
    public controller: DialogController;
    public isAreaValid: boolean;
    private _subscription: Disposable;
    private _bindingEngine: BindingEngine;

    constructor(dialogController: DialogController, bindingEngine: BindingEngine) {
        this.controller = dialogController;
        this._bindingEngine = bindingEngine;
        if (this.controller) {
            this.controller.settings.lock = true;
            this.model = this.controller.settings.model;
        }
    }

    public attached(): void {

        this._subscription = this._bindingEngine.propertyObserver(this.model.material, "area")
                                .subscribe(() => this.checkArea());
        this.checkArea();
    }

    public detached(): void {
        if (this._subscription) {
            this._subscription.dispose();
        }
    }

    private checkArea(): void {
        const isThereABadChar = this.model
                                && this.model.material
                                && this.model.material.area
                                && this.model.material.area.match(/[^\x20-\x7E|\xA3]/g);
        this.isAreaValid = !isThereABadChar;
    }
}
