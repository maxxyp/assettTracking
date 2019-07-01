/// <reference path="../../../../../typings/app.d.ts" />

import {DateTimeFormatValueConverter} from "../../../../../app/common/ui/converters/dateTimeFormatValueConverter";

describe("the DateTimeFormatValueConverter module", () => {
    let dateTimeFormatValueConverter: DateTimeFormatValueConverter;

    beforeEach(() => {
        dateTimeFormatValueConverter = new DateTimeFormatValueConverter();
    });

    it("can be created", () => {
        expect(dateTimeFormatValueConverter).toBeDefined();
    });

    it("can convert a date/time to string", () => {
        expect(dateTimeFormatValueConverter.toView(
                new Date(2015, 10, 16, 11, 12)) === "16 November 2015 at 11:12").toBeTruthy();
    });
});
