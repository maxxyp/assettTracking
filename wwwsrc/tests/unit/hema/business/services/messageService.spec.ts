import { MessageService } from "../../../../../app/hema/business/services/messageService";
import { EventAggregator } from "aurelia-event-aggregator";
import { IStorageService } from "../../../../../app/hema/business/services/interfaces/IStorageService";
import { Message } from "../../../../../app/hema/business/models/message";
import { IWorkListMemo } from "../../../../../app/hema/api/models/fft/engineers/worklist/IWorkListMemo";

describe("the MessageService class", () => {
    let sandbox: Sinon.SinonSandbox;
    let messageService: MessageService;
    let eventAggregatorStub: EventAggregator;
    let storageServiceStub: IStorageService;
    let messageStore: Message[];

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        messageStore = [];
        storageServiceStub = <IStorageService> {
            getMessages: () => Promise.resolve(messageStore),
            setMessages: (messages: Message[]) => {
                messageStore = messages;
                return Promise.resolve();
            }
        };
        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.publish = sandbox.stub();
        messageService = new MessageService(eventAggregatorStub, storageServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(messageService).toBeDefined();
    });

    it("can save new messages", (done) => {
        let memoList: IWorkListMemo[] = [
            { id: "1", memo: "one"},
            { id: "2", memo: "two"},
            { id: "3", memo: "three"}
        ];
        messageService.updateMessages(memoList)
            .then(() => messageService.getLiveMessages())
            .then((messages: Message[]) => {
                expect(messages.length).toBe(3);
                expect(messages[0].content).toBe("one");
                done();
            });
    });

    it("can mark messages as read", (done) => {
        let memoList: IWorkListMemo[] = [
            { id: "1", memo: "to_be_read"},
            { id: "2", memo: "unread"},
            { id: "3", memo: "to_be_deleted"}
        ];
        messageService.updateMessages(memoList)
            .then(() => messageService.getLiveMessages())
            .then(messages => messageService.markAsRead(messages[2]))
            .then(() => messageService.deleteRead())
            .then(() => messageService.getLiveMessages())
            .then(messages => messageService.markAsRead(messages[0]))
            .then(() => messageService.getLiveMessages())
            .then((messages: Message[]) => {
                expect(messages[0].read).toBe(true);
                expect(messages[1].read).toBe(false);
                expect(messages.length).toBe(2);
                // a deleted message is still in the underlying store DF_1828
                expect(messageStore.find(msg => msg.id === "3")).toBeDefined();
                done();
            });
    });

    it("can cound the amount of unread messages", (done) => {

        let memoList: IWorkListMemo[] = [
            { id: "1", memo: "read"},
            { id: "2", memo: "unread"},
            { id: "3", memo: "to_be_deleted"}
        ];

        messageService.updateMessages(memoList)
        .then(() => messageService.getLiveMessages())
        .then(messages => messageService.markAsRead(messages[2]))
            .then(() => messageService.getLiveMessages())
            .then(messages => messageService.markAsRead(messages[0]))
            .then(() => {
                expect(messageService.unreadCount).toBe(1);
                // a deleted message is still in the underlying store DF_1828
                expect(messageStore.find(msg => msg.id === "3")).toBeDefined();
                done();
            });
    });

    it("records the last updated date and time", (done) => {

        let memoList: IWorkListMemo[] = [
            { id: "1", memo: "read"},
            { id: "2", memo: "unread"}
        ];

        messageService.updateMessages(memoList)
            .then(() => messageService.getLiveMessages())
            .then((messages: Message[]) => {
                expect(messages[0].date).toBeDefined();
                done();
            });
    });

    it("can delete specific message", (done) => {

        let memoList: IWorkListMemo[] = [
            { id: "1", memo: "delete me"},
            { id: "2", memo: "don't delete me"}
        ];

        messageService.updateMessages(memoList)
            .then(() => messageService.getLiveMessages())
            .then(messages => messageService.delete(messages[0]))
            .then(() => messageService.getLiveMessages())
            .then((messages: Message[]) => {
                expect(messages.length).toBe(1);
                expect(messages[0].content).toBe("don't delete me");
                done();
            });
    });

    it("can delete read messages", (done) => {

        let memoList: IWorkListMemo[] = [
            { id: "1", memo: "read"},
            { id: "2", memo: "unread"}
        ];

        messageService.updateMessages(memoList)
            .then(() => messageService.getLiveMessages())
            .then(messages => messageService.markAsRead(messages[0]))
            .then(() => messageService.deleteRead())
            // DF_1828 - consectuctive "deletes read messages" actually wiped out data which we don't want
            .then(() => messageService.deleteRead())
            .then(() => messageService.getLiveMessages())
            .then((messages: Message[]) => {
                expect(messages[0].content).toBe("unread");
                // DF_1828 - consectuctive "deletes read messages" actually wiped out data which we don't want
                expect(messageStore.length).toBe(2);
                done();
            });
    });

    it("can archive old messages", (done) => {
        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        let memoList: IWorkListMemo[] = [
            { id: "1", memo: "make me old"},
            { id: "2", memo: "i'm new"},
            { id: "3", memo: "i'll be deleted"}
        ];

        messageService.updateMessages(memoList)
            .then(() => messageService.getLiveMessages())
            .then(messages => {
                messages[2].date = yesterday;
                messageService.markAsRead(messages[2])
            })
            .then(() => messageService.deleteRead())
            .then(() => messageService.getLiveMessages())
            .then((messages: Message[]) => {
                messages[0].date = yesterday;
            })
            .then(() => messageService.initialise())
            .then(() => messageService.getLiveMessages())
            .then((messages: Message[]) => {
                expect(messages.length).toBe(1);
                expect(messages[0].content).toBe("i'm new");
                // the deleted message has gone from the store
                expect(messageStore.length).toBe(1);
                done();
            });
    });
});
