/// <reference path="../../../../../typings/app.d.ts" />

import {Radio} from "../../../../../app/common/ui/elements/radio";

describe("the Radio module", () => {
    let radio: Radio;

    it("can be created", () => {
        radio = new Radio();
        expect(radio).toBeDefined();
    });
});
