/// <reference path="../../../../../typings/app.d.ts" />

import {TelephoneBox} from "../../../../../app/common/ui/elements/telephoneBox";

describe("the TelephoneBox module", () => {
    let telephoneBox: TelephoneBox;

    it("can be created", () => {
        telephoneBox = new TelephoneBox(<Element>{});
        expect(telephoneBox).toBeDefined();
    });
});
