/// <reference path="../../../../../../../typings/app.d.ts" />

import {HasMaxLengthRule} from "../../../../../../../app/hema/business/services/validation/rules/hasMaxLengthRule";

describe("the HasMaxLengthRule tests", () => {
    let hasMaxLengthRule: HasMaxLengthRule;
    
    it("can be created", () => {
        hasMaxLengthRule = new HasMaxLengthRule(1);
        expect(HasMaxLengthRule).toBeDefined();
     });

    it("valid string", (done) => {
        hasMaxLengthRule = new HasMaxLengthRule(10);
        
        hasMaxLengthRule.test("chars long").then((valid) => {
            expect(valid).toBeTruthy();
            done();
        });
    });

    it("invalid string - maximum", (done) => {
        hasMaxLengthRule = new HasMaxLengthRule(9);
        
        hasMaxLengthRule.test("chars long").then((valid) => {
            expect(valid).toBeFalsy();
            done();
        });
    });

    it("valid number", (done) => {
        hasMaxLengthRule = new HasMaxLengthRule(5);

        hasMaxLengthRule.test(12345).then((valid) => {
            expect(valid).toBeTruthy();
            done();
        });
    });

    it("invalid number", (done) => {
        hasMaxLengthRule = new HasMaxLengthRule(4);

        hasMaxLengthRule.test(12345).then((valid) => {
            expect(valid).toBeFalsy();
            done();
        });
    });

    it("valid array", (done) => {
        hasMaxLengthRule = new HasMaxLengthRule(6);
        
        hasMaxLengthRule.test(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"]).then((valid) => {
            expect(valid).toBeTruthy();
            done();
        });
    });

    it("invalid array", (done) => {
        hasMaxLengthRule = new HasMaxLengthRule(5);
        
        hasMaxLengthRule.test(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"]).then((valid) => {
            expect(valid).toBeFalsy();
            done();
        });
    });
});
