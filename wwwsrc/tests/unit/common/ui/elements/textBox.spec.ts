/// <reference path="../../../../../typings/app.d.ts" />

import {TextBox} from "../../../../../app/common/ui/elements/textBox";

describe("the TextBox module", () => {
    let textBox: TextBox;

    it("can be created", () => {
        textBox = new TextBox(<Element>{});
        expect(textBox).toBeDefined();
    });
});
