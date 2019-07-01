/// <reference path="../../../../../typings/app.d.ts" />

import {IsInternetEmail} from "../../../../../app/common/ui/validators/isInternetEmail";

describe("the IsInternetEmail module", () => {
    let isInternetEmail: IsInternetEmail;

    beforeEach(() => {
        isInternetEmail = new IsInternetEmail();
    });

    it("can be created", () => {
        expect(isInternetEmail).toBeDefined();
    });

   it("passes an email with dot in domain", (done) => {
       isInternetEmail.validate("aaa@aaa.aaa", undefined).then(result => {
           expect(result).toBe(true);
           done();
       });
   });

   it("fails an email without dot in domain", (done) => {
       isInternetEmail.validate("aaa@aaa", undefined).then(result => {
           expect(result).toBe(false);
           done();
       });
   });

   it("fails an empty email", (done) => {
      isInternetEmail.validate("", undefined).then(result => {
          expect(result).toBe(false);
           done();
      });
   });

   it("fails a single character fragment", (done) => {
      isInternetEmail.validate("a", undefined).then(result => {
          expect(result).toBe(false);
           done();
      });
   });

   it("fails a double character fragment", (done) => {
      isInternetEmail.validate("ab", undefined).then(result => {
          expect(result).toBe(false);
           done();
      });
   });

   it("fails a single @ character fragment", (done) => {
      isInternetEmail.validate("@", undefined).then(result => {
          expect(result).toBe(false);
           done();
      });
   });

   it("fails a two char fragment beginning @", (done) => {
      isInternetEmail.validate("@a", undefined).then(result => {
          expect(result).toBe(false);
           done();
      });
   });

   it("fails a two char fragment ending @", (done) => {
      isInternetEmail.validate("a@", undefined).then(result => {
          expect(result).toBe(false);
           done();
      });
   });
});
