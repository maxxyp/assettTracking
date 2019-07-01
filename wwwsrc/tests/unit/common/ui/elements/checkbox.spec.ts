/// <reference path="../../../../../typings/app.d.ts" />

import {Checkbox} from "../../../../../app/common/ui/elements/checkbox";

describe("the Checkbox module", () => {
    let checkbox: Checkbox;

    it("can be created", () => {
        checkbox = new Checkbox(<HTMLInputElement>{});
        expect(checkbox).toBeDefined();
    });
});
