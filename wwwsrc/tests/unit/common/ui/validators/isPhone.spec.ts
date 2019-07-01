/// <reference path="../../../../../typings/app.d.ts" />

import {IsPhone} from "../../../../../app/common/ui/validators/isPhone";
describe("the IsPhone module", () => {
    let isPhone: IsPhone;

    beforeEach(() => {
        isPhone = new IsPhone();
    });

    it("can be created", () => {
        expect(isPhone).toBeDefined();
    });

    it("with valid phone", (done) => {
        isPhone.validate("01245678901", undefined).then((result: boolean) => {
            expect(result).toBeTruthy();
            done();
        });
    });

    it("with invalid phone", (done) => {
        isPhone.validate("aaaaaaa", undefined).then((result: boolean) => {
            expect(result).toBeFalsy();
            done();
        });
    });
});
