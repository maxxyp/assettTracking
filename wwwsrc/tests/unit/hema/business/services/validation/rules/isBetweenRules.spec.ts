/// <reference path="../../../../../../../typings/app.d.ts" />

import {IsBetweenRule} from "../../../../../../../app/hema/business/services/validation/rules/isBetweenRule";

describe("IsBetweenRule", () => {
    let isBetweenRule: IsBetweenRule;
    
    it("can be created", () => {
        isBetweenRule = new IsBetweenRule(1, 20, true);
        expect(isBetweenRule).toBeDefined();
     });

    it("should return true if the value is undefined", (done) => {
        isBetweenRule = new IsBetweenRule(1, 20, true);
        
        isBetweenRule.test(undefined).then((valid) => {
            expect(valid).toBeTruthy();
            done();
        });
    });   

    it("should return false", (done) => {
        isBetweenRule = new IsBetweenRule(1, 20, true);
        
        isBetweenRule.test(25).then((valid) => {
            expect(valid).toBe(false);
            done();
        });
    });    

    it("should return true", (done) => {
        isBetweenRule = new IsBetweenRule(1, 20, true);
        
        isBetweenRule.test(2).then((valid) => {
            expect(valid).toBe(true);
            done();
        });
    });    
});
