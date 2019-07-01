/// <reference path="../../../../typings/app.d.ts" />

import {inject} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";
import {BusyDialogModel} from "./models/busyDialogModel";

@inject(DialogController)
export class BusyDialog {
    public model: BusyDialogModel;
    public controller: DialogController;

    constructor(dialogController: DialogController) {
        dialogController.settings.lock = true;

        this.controller = dialogController;
        this.model = dialogController.settings.model;
    }
}
