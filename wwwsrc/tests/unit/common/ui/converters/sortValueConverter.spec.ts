/// <reference path="../../../../../typings/app.d.ts" />

import {SortValueConverter} from "../../../../../app/common/ui/converters/sortValueConverter";

describe("the SortValueConverter module", () => {
    let sortValueConverter: SortValueConverter;

    beforeEach(() => {
        sortValueConverter = new SortValueConverter();
    });

    it("can be created", () => {
        expect(sortValueConverter).toBeDefined();
    });

    it("can sort an empty array", () => {
        expect(sortValueConverter.toView(null, "key", "descending").length === 0).toBeTruthy();
    });

    it("can sort an value array", () => {
        let arr: number[] = [6, 3, 3, 4];
        expect(sortValueConverter.toView(arr, null, "ascending")[0] === 3).toBeTruthy();
    });

    it("can sort an array ascending", () => {
        let arr: any = [
            {"key": "2", "value": "200"},
            {"key": "1", "value": "700"},
            {"key": "3", "value": "300"},
            {"key": "4", "value": "100"}
        ];

        expect(sortValueConverter.toView(arr, "key", null)[0].key === "1").toBeTruthy();
    });

    it("can sort an array descending", () => {
        let arr: any = [
            {"key": "2", "value": "200"},
            {"key": "1", "value": "700"},
            {"key": "3", "value": "300"},
            {"key": "4", "value": "100"}
        ];

        expect(sortValueConverter.toView(arr, "key", "descending")[0].key === "4").toBeTruthy();
    });

    it("can not sort on unknown key", () => {
        let arr: any = [
            {"key": "2", "value": "200"},
            {"key": "1", "value": "700"},
            {"key": "3", "value": "300"},
            {"key": "4", "value": "100"}
        ];

        expect(sortValueConverter.toView(arr, "key2", "ascending")[0].key === "2").toBeTruthy();
    });

});
