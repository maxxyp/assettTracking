/// <reference path="../../../../typings/app.d.ts" />

import {NumberHelper} from "../../../../app/common/core/numberHelper";

describe("the NumberHelper module", () => {
    let numberHelper: NumberHelper;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        numberHelper = new NumberHelper();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(numberHelper).toBeDefined();
    });

    describe("the isNumber method", () => {
        it("value is not a number when null", () => {
            expect(NumberHelper.isNumber(null)).toEqual(false);
        });

        it("value is not a number when undefined", () => {
            expect(NumberHelper.isNumber(undefined)).toEqual(false);
        });

        it("value is not a number when boolean false", () => {
            expect(NumberHelper.isNumber(false)).toEqual(false);
        });

        it("value is not a number when boolean true", () => {
            expect(NumberHelper.isNumber(true)).toEqual(false);
        });

        it("value is not a number when text string", () => {
            expect(NumberHelper.isNumber("blah")).toEqual(false);
        });

        it("value is a number when numeric string", () => {
            expect(NumberHelper.isNumber("1.23")).toEqual(false);
        });

        it("value is not a number when numeric NaN", () => {
            expect(NumberHelper.isNumber(NaN)).toEqual(false);
        });

        it("value is not a number when numeric Infinite", () => {
            expect(NumberHelper.isNumber(Infinity)).toEqual(false);
        });

        it("value is not a number when numeric", () => {
            expect(NumberHelper.isNumber(1.23)).toEqual(true);
        });
    });

    describe("the canCoerceToNumber method", () => {
        it("value is not a number when null", () => {
            expect(NumberHelper.canCoerceToNumber(null)).toEqual(false);
        });

        it("value is not a number when undefined", () => {
            expect(NumberHelper.canCoerceToNumber(undefined)).toEqual(false);
        });

        it("value is not a number when boolean false", () => {
            expect(NumberHelper.canCoerceToNumber(false)).toEqual(false);
        });

        it("value is not a number when boolean true", () => {
            expect(NumberHelper.canCoerceToNumber(true)).toEqual(false);
        });

        it("value is not a number when text string", () => {
            expect(NumberHelper.canCoerceToNumber("blah")).toEqual(false);
        });

        it("value is a number when numeric string", () => {
            expect(NumberHelper.canCoerceToNumber("1.23")).toEqual(true);
        });

        it("value is not a number when numeric NaN", () => {
            expect(NumberHelper.canCoerceToNumber(NaN)).toEqual(false);
        });

        it("value is not a number when numeric Infinite", () => {
            expect(NumberHelper.canCoerceToNumber(Infinity)).toEqual(false);
        });

        it("value is not a number when numeric", () => {
            expect(NumberHelper.canCoerceToNumber(1.23)).toEqual(true);
        });
    });

    describe("the coerceToNumber method", () => {
        it("value is not a number when null", () => {
            expect(NumberHelper.coerceToNumber(null)).toEqual(null);
        });

        it("value is not a number when undefined", () => {
            expect(NumberHelper.coerceToNumber(undefined)).toEqual(undefined);
        });

        it("value is not a number when boolean false", () => {
            expect(NumberHelper.coerceToNumber(false)).toEqual(undefined);
        });

        it("value is not a number when boolean true", () => {
            expect(NumberHelper.coerceToNumber(true)).toEqual(undefined);
        });

        it("value is not a number when text string", () => {
            expect(NumberHelper.coerceToNumber("blah")).toEqual(undefined);
        });

        it("value is a number when numeric string", () => {
            expect(NumberHelper.coerceToNumber("1.23")).toEqual(1.23);
        });

        it("value is not a number when numeric NaN", () => {
            expect(NumberHelper.coerceToNumber(NaN)).toEqual(undefined);
        });

        it("value is not a number when numeric Infinite", () => {
            expect(NumberHelper.coerceToNumber(Infinity)).toEqual(undefined);
        });

        it("value is not a number when numeric", () => {
            expect(NumberHelper.coerceToNumber(1.23)).toEqual(1.23);
        });
    });

    describe("the tryCoerceToNumber method", () => {
        it("value is not a number when null", () => {
            let tryCoerce = NumberHelper.tryCoerceToNumber(null);
            expect(tryCoerce.isValid).toEqual(false);
            expect(tryCoerce.value).toEqual(null);
        });

        it("value is not a number when undefined", () => {
            let tryCoerce = NumberHelper.tryCoerceToNumber(undefined);
            expect(tryCoerce.isValid).toEqual(false);
            expect(tryCoerce.value).toEqual(undefined);
        });

        it("value is not a number when boolean false", () => {
            let tryCoerce = NumberHelper.tryCoerceToNumber(false);
            expect(tryCoerce.isValid).toEqual(false);
            expect(tryCoerce.value).toEqual(undefined);
        });

        it("value is not a number when boolean true", () => {
            let tryCoerce = NumberHelper.tryCoerceToNumber(true);
            expect(tryCoerce.isValid).toEqual(false);
            expect(tryCoerce.value).toEqual(undefined);
        });

        it("value is not a number when text string", () => {
            let tryCoerce = NumberHelper.tryCoerceToNumber("blah");
            expect(tryCoerce.isValid).toEqual(false);
            expect(tryCoerce.value).toEqual(undefined);
        });

        it("value is a number when numeric string", () => {
            let tryCoerce = NumberHelper.tryCoerceToNumber("1.23")
            expect(tryCoerce.isValid).toEqual(true);
            expect(tryCoerce.value).toEqual(1.23);
        });

         it("value is not a number with potential partsFloat issue", () => {
            let tryCoerce = NumberHelper.tryCoerceToNumber("1.w3")
            expect(tryCoerce.isValid).toEqual(false);
            expect(tryCoerce.value).toEqual(undefined);
        });

        it("value is not a number when numeric NaN", () => {
            let tryCoerce = NumberHelper.tryCoerceToNumber(NaN);
            expect(tryCoerce.isValid).toEqual(false);
            expect(tryCoerce.value).toEqual(undefined);
        });

        it("value is not a number when numeric Infinite", () => {
            let tryCoerce = NumberHelper.tryCoerceToNumber(Infinity);
            expect(tryCoerce.isValid).toEqual(false);
            expect(tryCoerce.value).toEqual(undefined);
        });

        it("value is not a number when numeric", () => {
            let tryCoerce = NumberHelper.tryCoerceToNumber(1.23);
            expect(tryCoerce.isValid).toEqual(true);
            expect(tryCoerce.value).toEqual(1.23);
        });
    });

});
