/// <reference path="../../../../../typings/app.d.ts" />

import { TimePicker2 } from "../../../../../app/hema/core/elements/timePicker2";
import { Threading } from "../../../../../app/common/core/threading";

describe("the TimePicker2 module", () => {
    let timePicker2: TimePicker2;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        timePicker2 = new TimePicker2(<Element>{});
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(timePicker2).toBeDefined();
    });

    it("can add value", () => {
        timePicker2.value = "11:30";
        timePicker2.intervalInMinutes = 5;
        timePicker2.add();
        expect(timePicker2.value).toEqual("11:35");
    });
    it("can add multiple values", () => {
        timePicker2.value = "10:55";
        timePicker2.intervalInMinutes = 5;
        timePicker2.add();
        timePicker2.add();
        expect(timePicker2.value).toEqual("11:05");
    });
    it("can subtract value", () => {
        timePicker2.value = "11:30";
        timePicker2.intervalInMinutes = 5;
        timePicker2.subtract();
        expect(timePicker2.value).toEqual("11:25");
    });
    it("can subtract muliple values", () => {
        timePicker2.value = "11:00";
        timePicker2.intervalInMinutes = 5;
        timePicker2.subtract();
        timePicker2.subtract();
        expect(timePicker2.value).toEqual("10:50");
    });

    describe("valueChanged", () => {

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            timePicker2 = new TimePicker2(<Element>{});
        });

        afterEach(() => {
            sandbox.restore();
            timePicker2 = undefined;
        });

        it("newValue is undefined", () => {
            timePicker2.value = undefined;
            timePicker2.valueChanged(undefined);
            expect(timePicker2.value).toEqual(undefined);
        });

        it("newValue is invalid ", () => {
            timePicker2.value = "324423423423432";
            timePicker2.valueChanged("324423423423432");
            Threading.nextCycle(() => {
                expect(timePicker2.value).toEqual(undefined);
            });
        });

        it("newValue is valid time without colon, returns valid time ", () => {
            timePicker2.valueChanged("1030");
            Threading.nextCycle(() => {
                expect(timePicker2.value).toEqual("10:30");
            });
        });

        it("newValue is 0000, returns valid time ", () => {
            timePicker2.valueChanged("0000");
            Threading.nextCycle(() => {
                expect(timePicker2.value).toEqual(undefined);
            });
        });        
    });

});
