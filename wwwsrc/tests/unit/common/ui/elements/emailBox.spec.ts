/// <reference path="../../../../../typings/app.d.ts" />

import {EmailBox} from "../../../../../app/common/ui/elements/emailBox";

describe("the EmailBox module", () => {
    let emailBox: EmailBox;

    it("can be created", () => {
        emailBox = new EmailBox(<Element>{});
        expect(emailBox).toBeDefined();
    });
});
