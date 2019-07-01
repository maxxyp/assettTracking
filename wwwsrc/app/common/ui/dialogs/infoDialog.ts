/// <reference path="../../../../typings/app.d.ts" />

import {inject} from "aurelia-framework";
import {DialogController} from "aurelia-dialog";
import {InfoDialogModel} from "./models/infoDialogModel";

@inject(DialogController)
export class InfoDialog  {
    public model: InfoDialogModel;
    public controller: DialogController;

    constructor(dialogController: DialogController) {
        this.controller = dialogController;
        if (this.controller) {
            this.controller.settings.lock = true;
            this.model = this.controller.settings.model;
        }
    }

}
