/// <reference path="../../../../../typings/app.d.ts" />

import {Toggle} from "../../../../../app/common/ui/elements/toggle";

describe("Toggle Control", () => {
    let toggle: Toggle;

    beforeEach(() => {
        toggle = new Toggle();
    });

    it("can be created", () => {
        expect(toggle).toBeDefined();
        expect(toggle.isTrueText === "Yes").toBeTruthy();
        expect(toggle.isFalseText === "No").toBeTruthy();
        expect(toggle.value === false).toBeTruthy();
    });

    it("toggle click changed toggle", () => {
        expect(toggle.value === false).toBeTruthy();
        toggle.toggleClick(true);
        expect(toggle.value === true).toBeTruthy();
    });
});
