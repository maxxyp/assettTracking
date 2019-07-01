/// <reference path="../../../../../typings/app.d.ts" />
import * as bignumber from "bignumber";

import {NumberToCurrencyValueConverter} from "../../../../../app/hema/presentation/converters/numberToCurrencyValueConverter";

describe("the numberToCurrencyValueConverter module", () => {
    let numberToCurrencyValueConverter: NumberToCurrencyValueConverter;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        numberToCurrencyValueConverter = new NumberToCurrencyValueConverter();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(numberToCurrencyValueConverter).toBeDefined();
    });

    it("should return empty string", () => {
        expect(numberToCurrencyValueConverter.toView(null)).toEqual("");
        expect(numberToCurrencyValueConverter.toView(undefined)).toEqual("");
        expect(numberToCurrencyValueConverter.toView("")).toEqual("");        
    });

    it("should return a string value for the number type parameter", () => {
        let price: number = 130.2534;
        expect(numberToCurrencyValueConverter.toView(price)).toEqual("£130.25");
    });

    it("should return a string value for the string type parameter", () => {
        let price: string = "110.45634";
        expect(numberToCurrencyValueConverter.toView(price)).toEqual("£110.46");
    });

    it("should return a string value for the bignumber type parameter", () => {
        let price: bignumber.BigNumber = new bignumber.BigNumber(100.22524);
        expect(numberToCurrencyValueConverter.toView(price)).toEqual("£100.23");
    });
});
