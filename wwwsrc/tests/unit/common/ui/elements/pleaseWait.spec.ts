/// <reference path="../../../../../typings/app.d.ts" />

import {PleaseWait} from "../../../../../app/common/ui/elements/pleaseWait";

describe("the PleaseWait module", () => {
    let pleaseWait: PleaseWait;

    beforeEach(() => {
        pleaseWait = new PleaseWait();
    });

    it("can be created", () => {
        expect(pleaseWait).toBeDefined();
    });

    it("can populated with no entries", () => {
        pleaseWait.complete = true;

        expect(pleaseWait.complete === true).toBeTruthy();
    });
});
