import {DialogController} from "aurelia-dialog";
import {inject} from "aurelia-dependency-injection";

@inject(DialogController)
export class Confirmation {
    public title: string;
    public message: string;
    public yesLabel: string;
    public noLabel: string;

    public controller: DialogController;

    constructor(controller: DialogController) {
        this.controller = controller;
    }

    public activate(params: {title: string, message: string, yesLabel: string, noLabel: string}): void {
        this.title = params.title;
        this.message = params.message;
        this.yesLabel = params.yesLabel;
        this.noLabel = params.noLabel;
    }
}
