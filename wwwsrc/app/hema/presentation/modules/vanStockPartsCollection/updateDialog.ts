import {BindingEngine, Disposable, inject} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";
import {PartCollectionItemViewModel} from "./viewModels/partCollectionItemViewModel";

@inject(DialogController, BindingEngine)
export class UpdateDialog {

    public part: PartCollectionItemViewModel;
    public myVanAreas: string[];
    public controller: DialogController;
    public isEmptyQuantity: boolean;
    public isAreaValid: boolean;
    private _bindingEngine: BindingEngine;
    private _subscriptions: Disposable[];

    constructor(dialogController: DialogController, bindingEngine: BindingEngine) {
        this._subscriptions = [];
        this.controller = dialogController;
        this._bindingEngine = bindingEngine;

        if (this.controller) {
            this.controller.settings.lock = true;
            this.part = this.controller.settings.model.part;
            this.isEmptyQuantity = this.part.quantityCollected === 0;
            this.myVanAreas = this.controller.settings.model.myVanAreas;
        }
    }

    public attached(): void {

        const quantityCollectedChanged = (newVal: number, oldVal: number) => {
            if (newVal === 0) {
                this.part.area = undefined;
                this.isEmptyQuantity = true;
                return;
            }

            this.isEmptyQuantity = false;
        };

        this._subscriptions.push(
            this._bindingEngine.propertyObserver(this.part, "quantityCollected")
                .subscribe(quantityCollectedChanged),
            this._bindingEngine.propertyObserver(this.part, "area")
                .subscribe(() => this.checkArea()),

        );
        this.checkArea();
    }

    public detached(): void {
        (this._subscriptions || [])
            .forEach(subscription => {
                if (subscription) {
                    subscription.dispose();
                }
            });
    }

    public toggleNoPartsCollected(): void {
        this.part.area = undefined;
        this.part.quantityCollected = this.part.quantityCollected === 0 ? this.part.quantityExpected : 0;
    }

    private checkArea(): void {
        const isThereABadChar = this.part
                                && this.part.area
                                && this.part.area.match(/[^\x20-\x7E|\xA3]/g);
        this.isAreaValid = !isThereABadChar;
    }
}
