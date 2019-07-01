/// <reference path="../../../../../typings/app.d.ts" />

import { inject } from "aurelia-framework";
import { BaseViewModel } from "../../models/baseViewModel";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { MessageService } from "../../../business/services/messageService";
import { IMessageService } from "../../../business/services/interfaces/IMessageService";
import { Message } from "../../../business/models/message";
import { MessageServiceConstants } from "../../../business/services/constants/messageServiceConstants";

@inject(LabelService, EventAggregator, DialogService, MessageService)
export class Messages extends BaseViewModel {
    public messages: Message[];
    public lastUpdated: Date;

    private _messageService: IMessageService;
    private _subscription: Subscription;

    constructor(labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        messageService: IMessageService) {
        super(labelService, eventAggregator, dialogService);

        this._messageService = messageService;
        this._subscription = this._eventAggregator.subscribe(MessageServiceConstants.MESSAGE_SERVICE_UPDATED, (count: number) => this.updateMessages());
    }

    public attachedAsync(): Promise<any> {
        return this.updateMessages();
    }

    public detachedAsync(): Promise<void> {
        if (this._subscription) {
            this._subscription.dispose();
        }
        return Promise.resolve();
    }

    public markAsRead(message: Message): void {
        this._messageService.markAsRead(message);
    }

    public delete(message: Message): void {
        this._messageService.delete(message);
    }

    public deleteRead(): void {
        this._messageService.deleteRead();
    }

    private updateMessages(): Promise<void> {
        return this._messageService.getLiveMessages()
            .then(messages => { this.messages = messages; })
            .then(() => this._messageService.lastUpdated())
            .then(lastUpdated => { this.lastUpdated = lastUpdated; });
    }
}
