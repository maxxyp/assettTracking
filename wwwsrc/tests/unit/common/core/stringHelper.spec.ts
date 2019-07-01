/// <reference path="../../../../typings/app.d.ts" />

import {StringHelper} from "../../../../app/common/core/stringHelper";

describe("the StringHelper module", () => {
    let stringHelper: StringHelper;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        stringHelper = new StringHelper();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(stringHelper).toBeDefined();
    });

    describe("the camelCase method", () => {
        it("can convert with null", () => {
            expect(StringHelper.toCamelCase(null)).toEqual(null);
        });

        it("can convert with undefined", () => {
            expect(StringHelper.toCamelCase(undefined)).toEqual(undefined);
        });

        it("can convert with empty string", () => {
            expect(StringHelper.toCamelCase("")).toEqual("");
        });

        it("can convert with single character string", () => {
            expect(StringHelper.toCamelCase("A")).toEqual("a");
        });

        it("can convert", () => {
            expect(StringHelper.toCamelCase("ThisIsATest")).toEqual("thisIsATest");
        });
    });

    describe("the snakeCase method", () => {
        it("can convert with null", () => {
            expect(StringHelper.toSnakeCase(null)).toEqual(null);
        });

        it("can convert with undefined", () => {
            expect(StringHelper.toSnakeCase(undefined)).toEqual(undefined);
        });

        it("can convert with empty string", () => {
            expect(StringHelper.toSnakeCase("")).toEqual("");
        });

        it("can convert with single character string", () => {
            expect(StringHelper.toSnakeCase("A")).toEqual("a");
        });

        it("can convert", () => {
            expect(StringHelper.toSnakeCase("ThisIsATest")).toEqual("this-is-a-test");
        });
    });

    describe("the isString method", () => {
        it("fails when null", () => {
            expect(StringHelper.isString(null)).toEqual(false);
        });

        it("fails when undefined", () => {
            expect(StringHelper.isString(undefined)).toEqual(false);
        });

        it("fails when a true boolean", () => {
            expect(StringHelper.isString(true)).toEqual(false);
        });

        it("fails when a false boolean", () => {
            expect(StringHelper.isString(false)).toEqual(false);
        });

        it("fails when not a number", () => {
            expect(StringHelper.isString(1.23)).toEqual(false);
        });

        it("succeeds when a empty string literal", () => {
            expect(StringHelper.isString("")).toEqual(true);
        });

        it("succeeds when a string literal", () => {
            expect(StringHelper.isString("blah")).toEqual(true);
        });

        it("succeeds when an empty string class", () => {
            expect(StringHelper.isString(new String())).toEqual(true);
        });

        it("succeeds when a value string class", () => {
            expect(StringHelper.isString(new String("Blah"))).toEqual(true);
        });
    });

    describe("the startsWith method", () => {
        it("fail when string is undefined", () => {
            expect(StringHelper.startsWith(undefined, "blah")).toEqual(false);
        });

        it("fail when string is null", () => {
            expect(StringHelper.startsWith(null, "blah")).toEqual(false);
        });

        it("fail when test is undefined", () => {
            expect(StringHelper.startsWith("blah", "test")).toEqual(false);
        });

        it("fail when test is null", () => {
            expect(StringHelper.startsWith("blah", null)).toEqual(false);
        });

        it("fail when string is empty", () => {
            expect(StringHelper.startsWith("", "blah")).toEqual(false);
        });

        it("fail when test is empty", () => {
            expect(StringHelper.startsWith("blah", "")).toEqual(false);
        });

        it("fail when test is longer than string", () => {
            expect(StringHelper.startsWith("blah", "blah2")).toEqual(false);
        });

        it("success when string ends with test and same length", () => {
            expect(StringHelper.startsWith("blah", "blah")).toEqual(true);
        });

        it("success when string ends with test and longer string", () => {
            expect(StringHelper.startsWith("blahblah", "blah")).toEqual(true);
        });
    });

    describe("the endsWith method", () => {
        it("fail when string is undefined", () => {
            expect(StringHelper.endsWith(undefined, "blah")).toEqual(false);
        });

        it("fail when string is null", () => {
            expect(StringHelper.endsWith(null, "blah")).toEqual(false);
        });

        it("fail when test is undefined", () => {
            expect(StringHelper.endsWith("blah", "test")).toEqual(false);
        });

        it("fail when test is null", () => {
            expect(StringHelper.endsWith("blah", null)).toEqual(false);
        });

        it("fail when string is empty", () => {
            expect(StringHelper.endsWith("", "blah")).toEqual(false);
        });

        it("fail when test is empty", () => {
            expect(StringHelper.endsWith("blah", "")).toEqual(false);
        });

        it("fail when test is longer than string", () => {
            expect(StringHelper.endsWith("blah", "blah2")).toEqual(false);
        });

        it("success when string ends with test and same length", () => {
            expect(StringHelper.endsWith("blah", "blah")).toEqual(true);
        });

        it("success when string ends with test and longer string", () => {
            expect(StringHelper.endsWith("blahblah", "blah")).toEqual(true);
        });
    });

    describe("the padLeft method", () => {
        it("returns original value when string is undefined", () => {
            expect(StringHelper.padLeft(undefined, undefined, undefined)).toEqual(undefined);
        });

        it("returns original value when string is null", () => {
            expect(StringHelper.padLeft(null, undefined, undefined)).toEqual(null);
        });

        it("returns original value when pad is undefined", () => {
            expect(StringHelper.padLeft("aaa", undefined, undefined)).toEqual("aaa");
        });

        it("returns original value when pad is null", () => {
            expect(StringHelper.padLeft("aaa", null, undefined)).toEqual("aaa");
        });

        it("returns original value when string is empty", () => {
            expect(StringHelper.padLeft("", "", undefined)).toEqual("");
        });

        it("returns original value when padLength is less than value length", () => {
            expect(StringHelper.padLeft("aaa", "b", 2)).toEqual("aaa");
        });

        it("returns original value when padLength is equal to value length", () => {
            expect(StringHelper.padLeft("aaa", "b", 3)).toEqual("aaa");
        });

        it("returns expanded value when padLength is greater than value length", () => {
            expect(StringHelper.padLeft("aaa", "b", 4)).toEqual("baaa");
        });

        it("returns original value when padLength is greather than value length but pad is empty", () => {
            expect(StringHelper.padLeft("aaa", "", 4)).toEqual("aaa");
        });

        it("returns expanded value when padLength is greater than value length and pad is more than 1 character", () => {
            expect(StringHelper.padLeft("aaa", "bc", 5)).toEqual("bcaaa");
        });

        it("returns truncated expanded value when padLength is greater than value length and pad is more than 1 character", () => {
            expect(StringHelper.padLeft("aaa", "bcd", 8)).toEqual("bcdbcaaa");
        });
    });

    describe("the padRight method", () => {
        it("returns original value when string is undefined", () => {
            expect(StringHelper.padRight(undefined, undefined, undefined)).toEqual(undefined);
        });

        it("returns original value when string is null", () => {
            expect(StringHelper.padRight(null, undefined, undefined)).toEqual(null);
        });

        it("returns original value when pad is undefined", () => {
            expect(StringHelper.padRight("aaa", undefined, undefined)).toEqual("aaa");
        });

        it("returns original value when pad is null", () => {
            expect(StringHelper.padRight("aaa", null, undefined)).toEqual("aaa");
        });

        it("returns original value when string is empty", () => {
            expect(StringHelper.padRight("", "", undefined)).toEqual("");
        });

        it("returns original value when padLength is less than value length", () => {
            expect(StringHelper.padRight("aaa", "b", 2)).toEqual("aaa");
        });

        it("returns original value when padLength is equal to value length", () => {
            expect(StringHelper.padRight("aaa", "b", 3)).toEqual("aaa");
        });

        it("returns expanded value when padLength is greater than value length", () => {
            expect(StringHelper.padRight("aaa", "b", 4)).toEqual("aaab");
        });

        it("returns original value when padLength is greather than value length but pad is empty", () => {
            expect(StringHelper.padRight("aaa", "", 4)).toEqual("aaa");
        });

        it("returns expanded value when padLength is greater than value length and pad is more than 1 character", () => {
            expect(StringHelper.padRight("aaa", "bc", 5)).toEqual("aaabc");
        });

        it("returns truncated expanded value when padLength is greater than value length and pad is more than 1 character", () => {
            expect(StringHelper.padRight("aaa", "bcd", 8)).toEqual("aaabcdbc");
        });
    });
});
