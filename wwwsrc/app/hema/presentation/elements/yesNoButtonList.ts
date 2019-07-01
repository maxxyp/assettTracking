import { ButtonListItem } from "../../../common/ui/elements/models/buttonListItem";
import { LabelService } from "../../business/services/labelService";
import { inject } from "aurelia-framework";
import { ILabelService } from "../../business/services/interfaces/ILabelService";
import { bindable } from "aurelia-templating";
import { bindingMode } from "aurelia-binding";

const COMMON_LABEL_GROUP: string = "common";
const YES_KEY: string = "yes";
const NO_KEY: string = "no";

@inject(Element, LabelService)
export class YesNoButtonList {

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public yesNoLookup: ButtonListItem[];

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: any;

    private  _element: Element;
    private _yesLabel: string;
    private _noLabel: string;
    private _labelService: ILabelService;

    constructor(element: Element, labelService: ILabelService) {
        this.yesNoLookup = [];

        this._element = element;
        this._labelService = labelService;
    }

    public attached(): Promise<void> {
        return this._labelService.getGroup(COMMON_LABEL_GROUP)
            .then(labels => {
                this._yesLabel = labels[YES_KEY] || "yes";
                this._noLabel = labels[NO_KEY] || "no";

                this.yesNoLookup = [
                    new ButtonListItem(this._yesLabel, true, false),
                    new ButtonListItem(this._noLabel, false, false)
                ];
            });
    }

    public valueChanged(newState: boolean, oldState: boolean): void {
        if (newState === oldState || newState === undefined) {
            return;
        }

        let eventName = newState ? "on-yes" : "on-no"; 
        this._element.dispatchEvent(new CustomEvent(eventName, {
            detail: {
                value: newState
            },
            bubbles: true
        }));
        this.value = undefined;
    }
}
