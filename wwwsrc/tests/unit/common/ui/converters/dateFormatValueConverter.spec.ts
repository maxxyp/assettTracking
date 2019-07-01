/// <reference path="../../../../../typings/app.d.ts" />

import {DateFormatValueConverter} from "../../../../../app/common/ui/converters/dateFormatValueConverter";

describe("the DateFormatValueConverter module", () => {
    let dateFormatValueConverter: DateFormatValueConverter;

    beforeEach(() => {
        dateFormatValueConverter = new DateFormatValueConverter();
    });

    it("can be created", () => {
        expect(dateFormatValueConverter).toBeDefined();
    });

    it("can convert a date to string", () => {
        expect(dateFormatValueConverter.toView(new Date(2015, 10, 16)) === "16 November 2015").toBeTruthy();
    });

    it("can convert a date to string formatted", () => {
        expect(dateFormatValueConverter.toView(new Date(2015, 10, 16), "YYYY-MM-DD") === "2015-11-16").toBeTruthy();
    });
});
