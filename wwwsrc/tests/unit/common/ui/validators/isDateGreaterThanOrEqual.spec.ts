/// <reference path="../../../../../typings/app.d.ts" />

import {IsDateGreaterThanOrEqual} from "../../../../../app/common/ui/validators/isDateGreaterThanOrEqual";

describe("the IsDateGreaterThanOrEqual module", () => {
    let isDateGreaterThanOrEqual: IsDateGreaterThanOrEqual;

    beforeEach(() => {
        isDateGreaterThanOrEqual = new IsDateGreaterThanOrEqual(new Date("2015-01-01"));
    });

    it("can be created", () => {
        expect(isDateGreaterThanOrEqual).toBeDefined();
    });

    it("with valid date", (done) => {
        isDateGreaterThanOrEqual.validate(new Date("2015-01-02"), undefined).then((result: boolean) => {
            expect(result).toBeTruthy();
            done();
        });
    });

    it("with valid date", (done) => {
        isDateGreaterThanOrEqual.validate(new Date("2015-01-01"), undefined).then((result: boolean) => {
            expect(result).toBeTruthy();
            done();
        });
    });

    it("with invalid date", (done) => {
        isDateGreaterThanOrEqual.validate(new Date("2014-12-31"), undefined).then((result: boolean) => {
            expect(result).toBeFalsy();
            done();
        });
    });
});
