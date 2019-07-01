/// <reference path="../../../../typings/app.d.ts" />

import {inject, singleton} from "aurelia-framework";
import {DialogService, DialogController} from "aurelia-dialog";
import {IModalBusyService} from "./IModalBusyService";
import {BusyDialog} from "../dialogs/busyDialog";
import {BusyDialogModel} from "../dialogs/models/busyDialogModel";

@inject(DialogService)
@singleton()
export class ModalBusyService implements IModalBusyService {
    private _dialogService: DialogService;
    private _dialogController: DialogController;

    private _model: BusyDialogModel;
    private _contextMessages: { [id: string]: string};

    constructor(dialogService: DialogService) {
        this._dialogService = dialogService;
        this._model = new BusyDialogModel();
        this._contextMessages = {};
        this._model.isComplete = true;
    }

    public showBusy(context: string, message: string, linkMessage?: string, linkCallback?: () => void): Promise<void> {
        let isNew: boolean = false;
        if (!this._contextMessages[context]) {
            isNew = true;
        }
        this._contextMessages[context] = message;
        this._model.linkMessage = linkMessage;
        this._model.linkCallback = linkCallback;

        if (this.updateMessages() === 1 && isNew) {
            this._model.isComplete = false;

            return this._dialogService.openAndYieldController({viewModel: BusyDialog, model: this._model})
                .then((controller) => {
                    this._dialogController = controller;
                });
        }

        return Promise.resolve();
    }

    public hideBusy(context: string): Promise<void> {
        if (this._contextMessages[context]) {
            delete this._contextMessages[context];
        }

        if (this.updateMessages() === 0 && this._dialogController && this._dialogService.hasActiveDialog) {
            return this._dialogController.close(true, null)
                .then(() => {
                    this._model.isComplete = true;
                });
        }

        return Promise.resolve();
    }

    private updateMessages(): number {
        let messages: string[] = [];

        for (let contextKey in this._contextMessages) {
            messages.push(this._contextMessages[contextKey]);
        }

        this._model.message = messages.join("<br/>");
        return messages.length;
    }
}
