/// <reference path="../../../../../typings/app.d.ts" />

import {IsDateLessThanOrEqual} from "../../../../../app/common/ui/validators/isDateLessThanOrEqual";

describe("the IsDateLessThanOrEqual module", () => {
    let isDateLessThanOrEqual: IsDateLessThanOrEqual;

    beforeEach(() => {
        isDateLessThanOrEqual = new IsDateLessThanOrEqual(new Date("2015-01-01"));
    });

    it("can be created", () => {
        expect(isDateLessThanOrEqual).toBeDefined();
    });

    it("with valid date", (done) => {
        isDateLessThanOrEqual.validate(new Date("2014-12-31"), undefined).then((result: boolean) => {
            expect(result).toBeTruthy();
            done();
        });
    });

    it("with valid date", (done) => {
        isDateLessThanOrEqual.validate(new Date("2015-01-01"), undefined).then((result: boolean) => {
            expect(result).toBeTruthy();
            done();
        });
    });

    it("with invalid date", (done) => {
        isDateLessThanOrEqual.validate(new Date("2015-01-02"), undefined).then((result: boolean) => {
            expect(result).toBeFalsy();
            done();
        });
    });
});
