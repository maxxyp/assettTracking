/// <reference path="../../../../../typings/app.d.ts" />

import {IncrementalNumberPicker} from "../../../../../app/common/ui/elements/incrementalNumberPicker";
import {Threading} from "../../../../../app/common/core/threading";
import {DOM} from "aurelia-pal";

describe("the IncrementalNumberPicker module", () => {
    let incrementalNumberPicker: IncrementalNumberPicker;
    let sandbox: Sinon.SinonSandbox;
    let element: Element;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        element = <Element>{};
        element.dispatchEvent = sandbox.stub().returns(true);
        incrementalNumberPicker = new IncrementalNumberPicker(element);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(incrementalNumberPicker).toBeDefined();
    });

    describe("attached", () => {

        it("can attach with no eachSide setting and set eachSide to false", () => {
            incrementalNumberPicker.attached();
            expect(incrementalNumberPicker.eachSide).toBe(false);
        });

        it("can attach with eachSide set to true and not reset eachSide", () => {
            incrementalNumberPicker.eachSide = true;
            incrementalNumberPicker.attached();
            expect(incrementalNumberPicker.eachSide).toBe(true);
        });

    });

    describe("add", () => {
        it ("can call add with no value and set the value to the default increment", () => {
            incrementalNumberPicker.add();
            expect(incrementalNumberPicker.value).toBe(1);
        });

        it ("can call add with no value and set the value to minValue plus increment if minValue is non-zero", () => {
            incrementalNumberPicker.minValue = 1;
            incrementalNumberPicker.add();
            expect(incrementalNumberPicker.value).toBe(1);
        });

        it ("can call add with no value and set the value to minValue plus increment if minValue is zero", () => {
            incrementalNumberPicker.minValue = 0;
            incrementalNumberPicker.add();
            expect(incrementalNumberPicker.value).toBe(1);
        });

        it ("can call add with a value and no increment, and increase the value by the default increment", () => {
            incrementalNumberPicker.value = 1;
            incrementalNumberPicker.add();
            expect(incrementalNumberPicker.value).toBe(2);
        });

        it ("can call add with a value and an increment, and increase the value by the increment", () => {
            incrementalNumberPicker.value = 1;
            incrementalNumberPicker.incrementStep = 2;
            incrementalNumberPicker.add();
            expect(incrementalNumberPicker.value).toBe(3);
        });

        it ("can call add with a value, an increment and maxValue set, and increase the value by the increment", () => {
            incrementalNumberPicker.value = 1;
            incrementalNumberPicker.incrementStep = 1;
            incrementalNumberPicker.maxValue = 3;
            incrementalNumberPicker.add();
            expect(incrementalNumberPicker.value).toBe(2);
        });

        it ("can call add with a value, an increment and maxValue set, and be prevented from incrementing if maxValue is violated", () => {
            incrementalNumberPicker.value = 3;
            incrementalNumberPicker.incrementStep = 1;
            incrementalNumberPicker.maxValue = 3;
            incrementalNumberPicker.add();
            expect(incrementalNumberPicker.value).toBe(3);
        });
    });

    describe("subtract", () => {
        it ("can call subtract with no value and set the value to 0", () => {
            incrementalNumberPicker.subtract();
            expect(incrementalNumberPicker.value).toBe(0);
        });

        it ("can call subtract with no value and set the value to minValue  if minValue is set", () => {
            incrementalNumberPicker.minValue = 1;
            incrementalNumberPicker.subtract();
            expect(incrementalNumberPicker.value).toBe(1);
        });

        it ("can call subtract with a value and no increment, and decrease the value by the default increment", () => {
            incrementalNumberPicker.value = 2;
            incrementalNumberPicker.subtract();
            expect(incrementalNumberPicker.value).toBe(1);
        });

        it ("can call subtract with a value and an increment, and increase the value by the increment", () => {
            incrementalNumberPicker.value = 2;
            incrementalNumberPicker.incrementStep = 2;
            incrementalNumberPicker.subtract();
            expect(incrementalNumberPicker.value).toBe(0);
        });

        it ("can call subtract with a value, an increment and minValue set, and decrease the value by the increment", () => {
            incrementalNumberPicker.value = 2;
            incrementalNumberPicker.incrementStep = 2;
            incrementalNumberPicker.minValue = 0;
            incrementalNumberPicker.subtract();
            expect(incrementalNumberPicker.value).toBe(0);
        });

        it ("can call subtract with a value, an increment and minValue set, and be prevented from incrementing if minValue is violated", () => {
            incrementalNumberPicker.value = 2;
            incrementalNumberPicker.incrementStep = 2;
            incrementalNumberPicker.minValue = 1;
            incrementalNumberPicker.subtract();
            expect(incrementalNumberPicker.value).toBe(2);
        });
    });

    describe("valueChanged", () => {
        let nextCycleStub: Sinon.SinonSpy;
        beforeEach(() => {
            nextCycleStub = sandbox.spy(Threading, "nextCycle");
        });

        it("can call valueChanged with undefined and not reset value", () => {
            incrementalNumberPicker.value = 2;
            incrementalNumberPicker.valueChanged(undefined, 999);
            expect(nextCycleStub.called).toBe(false);
            expect(incrementalNumberPicker.value).toBe(2);
        });

        it("can call valueChanged with a number value and not reset value", () => {
            incrementalNumberPicker.value = 2;
            incrementalNumberPicker.valueChanged(1, 999);
            expect(nextCycleStub.called).toBe(false);
            expect(incrementalNumberPicker.value).toBe(2);
        });

        it("can call valueChanged with a too large value and reset value on the next cycle", () => {
            incrementalNumberPicker.value = 3;
            incrementalNumberPicker.maxValue = 2;
            incrementalNumberPicker.valueChanged(3, 2);
            expect(nextCycleStub.called).toBe(true);
            nextCycleStub.args[0][0]();
            expect(incrementalNumberPicker.value).toBe(2);
        });

        it("can call valueChanged with a too small value and reset value on the next cycle", () => {
            incrementalNumberPicker.value = 3;
            incrementalNumberPicker.minValue = 4;
            incrementalNumberPicker.valueChanged(3, 4);
            expect(nextCycleStub.called).toBe(true);
            nextCycleStub.args[0][0]();
            expect(incrementalNumberPicker.value).toBe(4);
        });
    });

    it("can call focus and not error", () => {
        incrementalNumberPicker.focus();
    });

    it("can call blur and dispatch the correct DOM event", () => {

        let nextCycleStub = sandbox.spy(Threading, "nextCycle");
        element.dispatchEvent = sandbox.spy();
        let createCustomEventSpy = DOM.createCustomEvent = sandbox.spy();

        incrementalNumberPicker.blur();
        nextCycleStub.args[0][0]();

        expect(createCustomEventSpy.args[0][0]).toBe("blur");
        expect(createCustomEventSpy.args[0][1]).toEqual({
            detail: {
                value: element
            },
            bubbles: true
        });
    });
});
