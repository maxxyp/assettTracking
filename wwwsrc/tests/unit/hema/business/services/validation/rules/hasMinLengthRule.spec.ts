/// <reference path="../../../../../../../typings/app.d.ts" />

import {HasMinLengthRule} from "../../../../../../../app/hema/business/services/validation/rules/hasMinLengthRule";

describe("the HasMinLengthRule tests", () => {
    let hasMinLengthRule: HasMinLengthRule;
    
    it("can be created", () => {
        hasMinLengthRule = new HasMinLengthRule(1);
        expect(hasMinLengthRule).toBeDefined();
     });

    it("valid string", (done) => {
        hasMinLengthRule = new HasMinLengthRule(10);
        
        hasMinLengthRule.test("chars long").then((valid) => {
            expect(valid).toBeTruthy();
            done();
        });
    });

    it("invalid string", (done) => {
        hasMinLengthRule = new HasMinLengthRule(11);
        
        hasMinLengthRule.test("chars long").then((valid) => {
            expect(valid).toBeFalsy();
            done();
        });
    });

    it("valid number", (done) => {
        hasMinLengthRule = new HasMinLengthRule(5);

        hasMinLengthRule.test(12345).then((valid) => {
            expect(valid).toBeTruthy();
            done();
        });
    });

    it("invalid number", (done) => {
        hasMinLengthRule = new HasMinLengthRule(6);

        hasMinLengthRule.test(12345).then((valid) => {
            expect(valid).toBeFalsy();
            done();
        });
    });
    
    it("valid array", (done) => {
        hasMinLengthRule = new HasMinLengthRule(6);
        
        hasMinLengthRule.test(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"]).then((valid) => {
            expect(valid).toBeTruthy();
            done();
        });
    });

    it("invalid array - maximum", (done) => {
        hasMinLengthRule = new HasMinLengthRule(7);
        
        hasMinLengthRule.test(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"]).then((valid) => {
            expect(valid).toBeFalsy();
            done();
        });
    });
});
