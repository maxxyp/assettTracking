/// <reference path="../../../../../../../typings/app.d.ts" />

import {HasLengthRule} from "../../../../../../../app/hema/business/services/validation/rules/hasLengthRule";

describe("the HasLengthRule tests", () => {
    let hasLengthRule: HasLengthRule;
    
    it("can be created", () => {
        hasLengthRule = new HasLengthRule(1);
        expect(hasLengthRule).toBeDefined();
     });

    it("valid string", (done) => {
        hasLengthRule = new HasLengthRule(10);
        
        hasLengthRule.test("chars long").then((valid) => {
            expect(valid).toBeTruthy();
            done();
        });
    });

    it("invalid string", (done) => {
        hasLengthRule = new HasLengthRule(10);
        
        hasLengthRule.test("chars longer").then((valid) => {
            expect(valid).toBeFalsy();
            done();
        });
    });
    
    it("valid number", (done) => {
        hasLengthRule = new HasLengthRule(5);

        hasLengthRule.test(12345).then((valid) => {
            expect(valid).toBeTruthy();
            done();
        });
    });

    it("invalid number", (done) => {
        hasLengthRule = new HasLengthRule(10);

        hasLengthRule.test(123456).then((valid) => {
            expect(valid).toBeFalsy();
            done();
        });
    });

    it("valid array", (done) => {
        hasLengthRule = new HasLengthRule(6);
        
        hasLengthRule.test(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"]).then((valid) => {
            expect(valid).toBeTruthy();
            done();
        });
    });

    it("invalid array", (done) => {
        hasLengthRule = new HasLengthRule(6);
        
        hasLengthRule.test(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8"]).then((valid) => {
            expect(valid).toBeFalsy();
            done();
        });
    });
});
