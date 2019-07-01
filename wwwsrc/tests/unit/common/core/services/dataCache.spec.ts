/// <reference path="../../../../../typings/app.d.ts" />

import {DataCache} from "../../../../../app/common/core/services/dataCache";

describe("the DataCache module", () => {
    let dataCache: DataCache;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        dataCache = new DataCache();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(dataCache).toBeDefined();
    });

    it("can get known data", (done) => {
        dataCache.set<string>("test1", "test2", "hello");
        dataCache.get<string>("test1", "test2").then((val) => {
            expect(val === "hello").toBeTruthy();
            done();
        });
    });

    it("cannot get unknown data", (done) => {
        dataCache.get<string>("test1", "test2").then((val) => {
            expect(val === null).toBeTruthy();
            done();
        });
    });

    it("can delete known data", (done) => {
        dataCache.set<string>("test1", "test2", "hello").then(() => {
            dataCache.get<string>("test1", "test2").then((val) => {
                expect(val === "hello").toBeTruthy();
                dataCache.remove("test1", "test2").then((resolve) => {
                    dataCache.get<string>("test1", "test2").then((val2) => {
                        expect(val2 === null).toBeTruthy();
                        done();
                    });
                });
            });
        });
    });

    it("cannot delete unknown data", (done) => {
        dataCache.remove("test1", "test2").then(() => {
            dataCache.get<string>("test1", "test2").then((val2) => {
                expect(val2 === null).toBeTruthy();
                done();
            });
        });
    });

    it("can delete all data", (done) => {
        dataCache.set<string>("test1", "test2", "hello").then(() => {
            dataCache.set<string>("test1", "test3", "hello2").then(() => {
                dataCache.get<string>("test1", "test2").then((val) => {
                    expect(val === "hello").toBeTruthy();
                    dataCache.get<string>("test1", "test3").then((val2) => {
                        expect(val2 === "hello2").toBeTruthy();
                        dataCache.clear();
                        dataCache.get<string>("test1", "test2").then((val3) => {
                            expect(val3 === null).toBeTruthy();
                            dataCache.get<string>("test1", "test2").then((val4) => {
                                expect(val4 === null).toBeTruthy();
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
});
