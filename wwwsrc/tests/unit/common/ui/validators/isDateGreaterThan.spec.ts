/// <reference path="../../../../../typings/app.d.ts" />

import {IsDateGreaterThan} from "../../../../../app/common/ui/validators/isDateGreaterThan";

describe("the IsDateGreaterThan module", () => {
    let isDateGreaterThan: IsDateGreaterThan;

    beforeEach(() => {
        isDateGreaterThan = new IsDateGreaterThan(new Date("2015-01-01"));
    });

    it("can be created", () => {
        expect(isDateGreaterThan).toBeDefined();
    });

    it("with valid date", (done) => {
        isDateGreaterThan.validate(new Date("2015-01-02"), undefined).then((result: boolean) => {
            expect(result).toBeTruthy();
            done();
        });
    });

    it("with invalid date", (done) => {
        isDateGreaterThan.validate(new Date("2015-01-01"), undefined).then((result: boolean) => {
            expect(result).toBeFalsy();
            done();
        });
    });
});
