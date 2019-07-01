/// <reference path="../../../../../typings/app.d.ts" />

import {IsDate} from "../../../../../app/common/ui/validators/isDate";

describe("the IsDate module", () => {
    let isDate: IsDate;

    beforeEach(() => {
        isDate = new IsDate();
    });

    it("can be created", () => {
        expect(isDate).toBeDefined();
    });

    it("with valid date", (done) => {
        isDate.validate(new Date(2015, 11, 3), undefined).then((result: boolean) => {
            expect(result).toBeTruthy();
            done();
        });
    });

    it("with invalid date", (done) => {
        isDate.validate(new Date(""), undefined).then((result: boolean) => {
            expect(result).toBeFalsy();
            done();
        });
    });
});
