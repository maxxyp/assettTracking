/// <reference path="../../../../../typings/app.d.ts" />

import {HtmlFormatValueConverter} from "../../../../../app/common/ui/converters/htmlFormatValueConverter";

describe("the HtmlFormatValueConverter module", () => {
    let htmlFormatValueConverter: HtmlFormatValueConverter;

    beforeEach(() => {
        htmlFormatValueConverter = new HtmlFormatValueConverter();
    });

    it("can be created", () => {
        expect(htmlFormatValueConverter).toBeDefined();
    });

    it("can accept an empty value", () => {
        expect(htmlFormatValueConverter.toView(null) === null).toBeTruthy();
    });

    it("can accept a value with line breaks", () => {
        expect(htmlFormatValueConverter.toView("a\nb") === "a<br />b").toBeTruthy();
    });
});
