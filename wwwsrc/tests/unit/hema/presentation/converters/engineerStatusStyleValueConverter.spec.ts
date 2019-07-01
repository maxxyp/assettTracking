/// <reference path="../../../../../typings/app.d.ts" />

import {EngineerStatusStyleValueConverter} from "../../../../../app/hema/presentation/converters/engineerStatusStyleValueConverter";

describe("the EngineerStatusStyleValueConverter module", () => {
    let engineerStatusStyleValueConverter: EngineerStatusStyleValueConverter;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        engineerStatusStyleValueConverter = new EngineerStatusStyleValueConverter();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(engineerStatusStyleValueConverter).toBeDefined();
    });

    it("can view null", () => {
        expect(engineerStatusStyleValueConverter.toView(null)).toEqual("");
    });

    it("can view undefined", () => {
        expect(engineerStatusStyleValueConverter.toView(null)).toEqual("");
    });

    it("can view state", () => {
        expect(engineerStatusStyleValueConverter.toView("FooBar")).toEqual("hema-icon-foo-bar");
    });
});
