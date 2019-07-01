/// <reference path="../../../../../typings/app.d.ts" />

import {LimitValueConverter} from "../../../../../app/common/ui/converters/limitValueConverter";

describe("the LimitValueConverter module", () => {
    let limitValueConverter: LimitValueConverter;

    beforeEach(() => {
        limitValueConverter = new LimitValueConverter();
    });

    it("can be created", () => {
        expect(limitValueConverter).toBeDefined();
    });

    it("can limit an array", () => {
        expect(limitValueConverter.toView(
                [1, 2, 3, 4, 5], 3).length === 3).toBeTruthy();
    });

    it("can limit larger than array", () => {
        expect(limitValueConverter.toView(
                [1, 2, 3, 4, 5], 10).length === 5).toBeTruthy();
    });

    it("can limit an empty array", () => {
        expect(limitValueConverter.toView(
                null, 3).length === 0).toBeTruthy();
    });
});
