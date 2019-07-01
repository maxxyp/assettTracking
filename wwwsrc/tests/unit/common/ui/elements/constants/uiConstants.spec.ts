/// <reference path="../../../../../../typings/app.d.ts" />

import {UiConstants} from "../../../../../../app/common/ui/elements/constants/uiConstants";

describe("the UiConstants module", () => {
    let uIConstants: UiConstants;

    beforeEach(() => {
        uIConstants = new UiConstants();
    });

    it("can be created", () => {
        expect(uIConstants).toBeDefined();
    });
});
