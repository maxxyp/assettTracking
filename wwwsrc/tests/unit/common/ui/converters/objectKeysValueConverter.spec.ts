/// <reference path="../../../../../typings/app.d.ts" />

import {ObjectKeysValueConverter} from "../../../../../app/common/ui/converters/objectKeysValueConverter";

describe("the ObjectKeysValueConverter module", () => {
    let objectKeysValueConverter: ObjectKeysValueConverter;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        objectKeysValueConverter = new ObjectKeysValueConverter();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(objectKeysValueConverter).toBeDefined();
    });

    it("can be convert a null object", () => {
        expect(objectKeysValueConverter.toView(null)).toEqual([]);
    });

    it("can be convert an object", () => {
        let o: any = {};
        o.prop = "some value";
        o.prop2 = "some value2";

        expect(objectKeysValueConverter.toView(o)).toEqual([
            {key: "prop", value: "some value", type: "string" },
            {key: "prop2", value: "some value2", type: "string"}
        ]);
    });

    it("can be convert an object without own properties", () => {
        let o: any = {};
        o.prop = "some value";
        o.prop2 = "some value2";
        o.hasOwnProperty = (prop: string): boolean => false;

        expect(objectKeysValueConverter.toView(o)).toEqual([]);
    });
});
