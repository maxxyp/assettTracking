/// <reference path="../../../../../typings/app.d.ts" />
import * as bignumber from "bignumber";
import {NumberToBigNumberValueConverter} from "../../../../../app/hema/presentation/converters/numberToBigNumberValueConverter";

describe("the numberToCurrencyValueConverter module", () => {
    let numberToBigValueConverter: NumberToBigNumberValueConverter;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        numberToBigValueConverter = new NumberToBigNumberValueConverter();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(numberToBigValueConverter).toBeDefined();
    });

    it("should return undefined when no value", () => {
        expect(numberToBigValueConverter.toView(null)).toEqual(undefined);
        expect(numberToBigValueConverter.toView(undefined)).toEqual(undefined);
    });

    it("should return a number value for bignumber toView", () => {
        let price: bignumber.BigNumber = new bignumber.BigNumber(130.2534);
        expect(numberToBigValueConverter.toView(price)).toEqual(130.2534);
    });


    it ("should return bignumber for number fromView", () => {
        const converted = numberToBigValueConverter.fromView(130.25);
        expect(converted instanceof bignumber.BigNumber).toBeTruthy();
        expect(converted.toNumber()).toEqual(130.25);
    });
});
