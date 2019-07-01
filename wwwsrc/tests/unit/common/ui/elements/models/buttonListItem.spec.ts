/// <reference path="../../../../../../typings/app.d.ts" />

import {ButtonListItem} from "../../../../../../app/common/ui/elements/models/buttonListItem";

describe("the ButtonListItem module", () => {
    let buttonListItem: ButtonListItem;

    beforeEach(() => {
        buttonListItem = new ButtonListItem("Text", "Value", false);
    });

    it("can be created", () => {
        expect(buttonListItem).toBeDefined();
    });
    it("has correct values", () => {
        expect(buttonListItem.text === "Text").toBeTruthy();
        expect(buttonListItem.value === "Value").toBeTruthy();
        expect(buttonListItem.disabled === false).toBeTruthy();
    });

});
