/// <reference path="../../../../../typings/app.d.ts" />

import {CamelToSentenceCaseValueConverter} from "../../../../../app/common/ui/converters/camelToSentenceCaseValueConverter";

describe("the CamelToSentenceCaseValueConverter module", () => {
    let camelToSentenceCase: CamelToSentenceCaseValueConverter;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        camelToSentenceCase = new CamelToSentenceCaseValueConverter();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(camelToSentenceCase).toBeDefined();
    });

    it("can be convert a null object", () => {
        expect(camelToSentenceCase.toView(null)).toEqual("");
    });

    it("can convert standard camelcase string", () => {
        expect(camelToSentenceCase.toView("somethingLikeThis"))
            .toEqual("something Like This");
    });

     it("can convert consecutive uppercase characters camelcase string", () => {
        expect(camelToSentenceCase.toView("somethingWithABCCode"))
            .toEqual("something With ABC Code");
    });
});
