/// <reference path="../../../../../typings/app.d.ts" />

import {BrowserLocalStorage} from "../../../../../app/common/core/services/browserLocalStorage";

describe("the BrowserLocalStorage module", () => {
    let localStorage: BrowserLocalStorage;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        localStorage = new BrowserLocalStorage();
        localStorage.clear();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(localStorage).toBeDefined();
    });

    it("can get known data", (done) => {
        localStorage.set<string>("test1", "test2", "hello");
        localStorage.get<string>("test1", "test2").then((val) => {
            expect(val === "hello").toBeTruthy();
            done();
        });
    });

    it("cannot get unknown data", (done) => {
        localStorage.get<string>("test1", "test2").then((val) => {
            expect(val === null).toBeTruthy();
            done();
        });
    });

    it("can delete known data", (done) => {
        localStorage.set<string>("test1", "test2", "hello");
        localStorage.get<string>("test1", "test2").then((val) => {
            expect(val === "hello").toBeTruthy();
            localStorage.remove("test1", "test2");
            localStorage.get<string>("test1", "test2").then((val2) => {
                expect(val2 === null).toBeTruthy();
                done();
            });
        });
    });

    it("cannot delete unknown data", (done) => {
        localStorage.remove("test1", "test2");
        localStorage.get<string>("test1", "test2").then((val2) => {
            expect(val2 === null).toBeTruthy();
            done();
        });
    });

    it("can delete all data", (done) => {
        localStorage.set<string>("test1", "test2", "hello");
        localStorage.set<string>("test1", "test3", "hello2");
        localStorage.get<string>("test1", "test2").then((val) => {
            expect(val === "hello").toBeTruthy();
            localStorage.get<string>("test1", "test3").then((val2) => {
                expect(val2 === "hello2").toBeTruthy();
                localStorage.clear();
                localStorage.get<string>("test1", "test2").then((val3) => {
                    expect(val3 === null).toBeTruthy();
                    localStorage.get<string>("test1", "test2").then((val4) => {
                        expect(val4 === null).toBeTruthy();
                        done();
                    });
                });
            });
        });
    });
});
