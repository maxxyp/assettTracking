/// <reference path="../../../../../../typings/app.d.ts" />

import {Notification} from "../../../../../../app/common/ui/elements/models/notification";

describe("The Notification module", () => {
    let notificationObject: Notification;

    beforeEach(() => {
        notificationObject = new Notification("TestNotification", "Test", "fa-send",
            () => {
            return new Promise<void>((resolve, reject) => {
                  resolve();
            });
        });
    });

    it("can be created", () => {
        expect(notificationObject).toBeDefined();
    });
});
