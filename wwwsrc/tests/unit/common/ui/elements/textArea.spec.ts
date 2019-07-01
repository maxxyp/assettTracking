/// <reference path="../../../../../typings/app.d.ts" />

import { TextArea } from "../../../../../app/common/ui/elements/textArea";

describe("the TextArea module", () => {
    let textArea: TextArea;

    it("can be created", () => {
        textArea = new TextArea(<Element>{});
        expect(textArea).toBeDefined();
    });

    it("defines max length text", () => {
        textArea = new TextArea(<Element>{});
        expect(textArea.maxlengthText).toEqual("characters left");
    });
});
