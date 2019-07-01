import {inject} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";
import { ErrorDialogModel } from "../../../../common/ui/dialogs/models/errorDialogModel";

@inject(DialogController)
export class EndOfDayFail {
    public controller: DialogController;
    public model: ErrorDialogModel;

    constructor(dialogController: DialogController) {
        this.controller = dialogController;
        if (this.controller) {
            this.controller.settings.lock = true;
            this.model = this.controller.settings.model;
        }
    }
}
