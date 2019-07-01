import {Message} from "../../models/message";
import { IWorkListMemo } from "../../../api/models/fft/engineers/worklist/IWorkListMemo";

export interface IMessageService {
    unreadCount: number;
    getLiveMessages(): Promise<Message[]>;
    updateMessages(memo: IWorkListMemo[]): Promise<void>;
    lastUpdated(): Promise<Date>;
    markAsRead(message: Message): Promise<void>;
    delete(message: Message): Promise<void>;
    deleteRead(): Promise<void>;
    initialise(): Promise<void>;
}
