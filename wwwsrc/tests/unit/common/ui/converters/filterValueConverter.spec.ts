/// <reference path="../../../../../typings/app.d.ts" />

import {FilterValueConverter} from "../../../../../app/common/ui/converters/filterValueConverter";

describe("the FilterValueConverter module", () => {
    let filterValueConverter: FilterValueConverter;

    beforeEach(() => {
        filterValueConverter = new FilterValueConverter();
    });

    it("can be created", () => {
        expect(filterValueConverter).toBeDefined();
    });

    it("can accept an empty array", () => {
        expect(filterValueConverter.toView(null, null, null) === null).toBeTruthy();
    });

    it("can accept an array with no expression", () => {
        expect(filterValueConverter.toView([1, 2, 3], null, null).length === 3).toBeTruthy();
    });

    it("can accept an array with a property and expression", () => {
        expect(filterValueConverter.toView(
                [
                    { name: "fred" },
                    { name: "ted" },
                    { name: "bob" }
                ], "name", "ed").length === 2).toBeTruthy();
    });

    it("can accept an array without a property and an expression", () => {
        expect(filterValueConverter.toView(
                [
                    { someField: "fred" },
                    { someOtherField: "ted" },
                    { thirdField: "bob" }
                ], null, "ed").length === 2).toBeTruthy();
    });
});
