/// <reference path="../../../../../typings/app.d.ts" />

import { TimePicker } from "../../../../../app/common/ui/elements/timePicker";

describe("the TimePicker module", () => {
    let timePicker: TimePicker;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        timePicker = new TimePicker(<Element>{});
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(timePicker).toBeDefined();
    });

    it("can add value", () => {
        timePicker.value = "11:30";
        timePicker.intervalInMinutes = 5;
        timePicker.add();
        expect(timePicker.value).toEqual("11:35");
    });
    it("can add multiple values", () => {
        timePicker.value = "10:55";
        timePicker.intervalInMinutes = 5;
        timePicker.add();
        timePicker.add();
        expect(timePicker.value).toEqual("11:05");
    });
    it("can subtract value", () => {
        timePicker.value = "11:30";
        timePicker.intervalInMinutes = 5;
        timePicker.subtract();
        expect(timePicker.value).toEqual("11:25");
    });
    it("can subtract muliple values", () => {
        timePicker.value = "11:00";
        timePicker.intervalInMinutes = 5;
        timePicker.subtract();
        timePicker.subtract();
        expect(timePicker.value).toEqual("10:50");
    });

});
