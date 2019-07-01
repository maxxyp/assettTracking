/// <reference path="../../../../../typings/app.d.ts" />

import {IsDateWithFormat} from "../../../../../app/common/ui/validators/isDateWithFormat";

describe("the IsDateWithFormat module", () => {
    let isDateWithFormat: IsDateWithFormat;

    beforeEach(() => {
        isDateWithFormat = new IsDateWithFormat("YYYY-MM-DD");
    });

    it("can be created", () => {
        expect(isDateWithFormat).toBeDefined();
    });

    it("with valid date", (done) => {
        isDateWithFormat.validate("2015-12-03", undefined).then((result: boolean) => {
            expect(result).toBeTruthy();
            done();
        });
    });

    it("with invalid date", (done) => {
        isDateWithFormat.validate("kjhkjhh", undefined).then((result: boolean) => {
            expect(result).toBeFalsy();
            done();
        });
    });
});
