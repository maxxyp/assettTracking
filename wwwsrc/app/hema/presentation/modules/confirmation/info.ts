import {DialogController} from "aurelia-dialog";
import {inject} from "aurelia-dependency-injection";

@inject(DialogController)
export class Info {
    public title: string;
    public message: string;
    public okLabel: string;

    public controller: DialogController;

    constructor(controller: DialogController) {
        this.controller = controller;
    }

    public activate(params: {title: string, message: string, okLabel: string}): void {
        this.title = params.title;
        this.message = params.message;
        this.okLabel = params.okLabel;
    }
}
