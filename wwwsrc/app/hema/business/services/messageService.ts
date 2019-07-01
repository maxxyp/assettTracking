import { inject } from "aurelia-framework";
import { IMessageService } from "./interfaces/IMessageService";
import { Message } from "../models/message";
import { EventAggregator } from "aurelia-event-aggregator";
import { MessageServiceConstants } from "./constants/messageServiceConstants";
import { IStorageService } from "./interfaces/IStorageService";
import { StorageService } from "./storageService";
import * as moment from "moment";
import { IWorkListMemo } from "../../api/models/fft/engineers/worklist/IWorkListMemo";

@inject(EventAggregator, StorageService)
export class MessageService implements IMessageService {

    public unreadCount: number;
    private _lastUpdated: Date;
    private _eventAggregator: EventAggregator;
    private _storageService: IStorageService;

    constructor(eventAggregator: EventAggregator, storageService: IStorageService) {
        this._eventAggregator = eventAggregator;
        this._storageService = storageService;
        this.unreadCount = 0;
    }

    public initialise(): Promise<void> {
        return this.archive();
    }

    public getLiveMessages(): Promise<Message[]> {
        return this.getMessages().filter(m => !m.deleted);
    }

    public updateMessages(memos: IWorkListMemo[]): Promise<void> {
        // currently no duplicates allowed until unique id is resolved
        if (!memos || !(memos instanceof Array)) {
            return Promise.resolve();
        }
        return this.getMessages()
            .then(messages => {
                memos.forEach(memo => {
                    if (this.memoShouldBeAdded(memo, messages)) {
                        messages.push(new Message(memo.id, memo.memo));
                    }
                });
                this._lastUpdated = new Date();
                return messages;
            })
            .then(messages => this.saveMessages(messages));
    }

    public markAsRead(message: Message): Promise<void> {
        return this.getMessages()
            .then(messages => {
                let storedMessage = messages.find(m => m.id === message.id);
                if (storedMessage) {
                    storedMessage.read = true;
                }
                return messages;
            })
            .then(messages => this.saveMessages(messages));
    }

    public delete(message: Message): Promise<void> {
        return this.getMessages()
            .then(messages => messages.filter(m => m.id !== message.id))
            .then(messages => this.saveMessages(messages));
    }

    public deleteRead(): Promise<void> {
        return this.getMessages()
            .then((messages) => {
                messages.forEach(m => {
                    if (m.read) {
                        m.deleted = true;
                    }
                });
                return messages;
            })
            .then(messages => this.saveMessages(messages));
    }

    public lastUpdated(): Promise<Date> {
        return Promise.resolve(this._lastUpdated);
    }

    private async getMessages(): Promise<Message[]> {
        return (await this._storageService.getMessages()) || [];
    }

    private saveMessages(messages: Message[]): Promise<void> {
        return this._storageService.setMessages(messages)
            .then(() => this.updateUnreadCount())
            .then(() => this._eventAggregator.publish(MessageServiceConstants.MESSAGE_SERVICE_UPDATED, this.unreadCount));
    }

    private archive(): Promise<void> {
        return this.getMessages()
            .then(messages => messages.filter(message => moment().diff(moment(message.date), "days") < 1))
            .then(messages => this.saveMessages(messages));
    }

    private memoShouldBeAdded(memo: IWorkListMemo, messages: Message[]): boolean {
        return (memo.id && memo.memo && memo.memo.length > 0 && !messages.find(m => m.id === memo.id));
    }

    private updateUnreadCount(): Promise<void> {
        return this.getLiveMessages().then(messages => { this.unreadCount = messages.filter((m) => m.read === false && m.deleted === false).length; });
    }
}
