/// <reference path="../../../../../../../typings/app.d.ts" />

import {inject} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";
import {ConfirmDialogModel} from "../../../../../../common/ui/dialogs/models/confirmDialogModel";

@inject(DialogController)
export class ConfirmationDialog  {
    public model: ConfirmDialogModel;
    public controller: DialogController;

    constructor(dialogController: DialogController) {
        this.controller = dialogController;
        if (this.controller) {
            this.controller.settings.lock = true;
            this.model = this.controller.settings.model;
        }
    }
}
