/// <reference path="../../../../../../../typings/app.d.ts" />

import {HasLengthBetweenRule} from "../../../../../../../app/hema/business/services/validation/rules/hasLengthBetweenRule";

describe("the hasLengthBetweenRule tests", () => {
    let hasLengthBetweenRule: HasLengthBetweenRule;
    
    it("can be created", () => {
        hasLengthBetweenRule = new HasLengthBetweenRule(1, 2);
        expect(hasLengthBetweenRule).toBeDefined();
     });

    it("valid string", (done) => {
        hasLengthBetweenRule = new HasLengthBetweenRule(1, 10);
        
        hasLengthBetweenRule.test("chars long").then((valid) => {
            expect(valid).toBeTruthy();
            done();
        });
    });

    it("invalid string - maximum", (done) => {
        hasLengthBetweenRule = new HasLengthBetweenRule(1, 10);
        
        hasLengthBetweenRule.test("chars longer").then((valid) => {
            expect(valid).toBeFalsy();
            done();
        });
    });

    it("invalid string - minimum", (done) => {
        hasLengthBetweenRule = new HasLengthBetweenRule(5, 10);

        hasLengthBetweenRule.test("char").then((valid) => {
            expect(valid).toBeFalsy();
            done();
        });
    });

    it("valid number", (done) => {
        hasLengthBetweenRule = new HasLengthBetweenRule(1, 5);

        hasLengthBetweenRule.test(12345).then((valid) => {
            expect(valid).toBeTruthy();
            done();
        });
    });

    it("invalid number - maximum", (done) => {
        hasLengthBetweenRule = new HasLengthBetweenRule(1, 5);

        hasLengthBetweenRule.test(123456).then((valid) => {
            expect(valid).toBeFalsy();
            done();
        });
    });

    it("invalid number - minimum", (done) => {
        hasLengthBetweenRule = new HasLengthBetweenRule(3, 5);

        hasLengthBetweenRule.test(1).then((valid) => {
            expect(valid).toBeFalsy();
            done();
        });
    });

    it("valid array", (done) => {
        hasLengthBetweenRule = new HasLengthBetweenRule(1, 6);
        
        hasLengthBetweenRule.test(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"]).then((valid) => {
            expect(valid).toBeTruthy();
            done();
        });
    });

    it("invalid array - maximum", (done) => {
        hasLengthBetweenRule = new HasLengthBetweenRule(1, 6);
        
        hasLengthBetweenRule.test(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8"]).then((valid) => {
            expect(valid).toBeFalsy();
            done();
        });
    });

    it("invalid array - minimum", (done) => {
        hasLengthBetweenRule = new HasLengthBetweenRule(3, 6);

        hasLengthBetweenRule.test(["Item 1", "Item 2"]).then((valid) => {
            expect(valid).toBeFalsy();
            done();
        });
    });
});
