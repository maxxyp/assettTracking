/// <reference path="../../../../../typings/app.d.ts" />

import {TitleCaseValueConverter} from "../../../../../app/common/ui/converters/titleCaseValueConverter";

describe("the TitleCaseValueConverter module", () => {
    let titleCaseValueConverter: TitleCaseValueConverter;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        titleCaseValueConverter = new TitleCaseValueConverter();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(titleCaseValueConverter).toBeDefined();
    });

    it("can convert a null string", () => {
        expect(titleCaseValueConverter.toView(null)).toEqual("");
    });

    it("can convert a short string", () => {
        expect(titleCaseValueConverter.toView("a")).toEqual("A");
    });

    it("can convert a string", () => {
        expect(titleCaseValueConverter.toView("thisIsATest")).toEqual("This Is A Test");
    });
});
