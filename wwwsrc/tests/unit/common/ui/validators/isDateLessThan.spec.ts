/// <reference path="../../../../../typings/app.d.ts" />

import {IsDateLessThan} from "../../../../../app/common/ui/validators/isDateLessThan";

describe("the IsDateLessThan module", () => {
    let isDateLessThan: IsDateLessThan;

    beforeEach(() => {
        isDateLessThan = new IsDateLessThan(new Date("2015-01-01"));
    });

    it("can be created", () => {
        expect(isDateLessThan).toBeDefined();
    });

    it("with valid date", (done) => {
        isDateLessThan.validate(new Date("2014-12-31"), undefined).then((result: boolean) => {
            expect(result).toBeTruthy();
            done();
        });
    });

    it("with invalid date", (done) => {
        isDateLessThan.validate(new Date("2015-01-01"), undefined).then((result: boolean) => {
            expect(result).toBeFalsy();
            done();
        });
    });
});
