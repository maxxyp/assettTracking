/// <reference path="../../../../typings/app.d.ts" />

import {LocalStorageDbService} from "../../../../app/common/storage/localStorageDbService";
import { DatabaseSchema } from "../../../../app/common/storage/models/databaseSchema";
import { DatabaseSchemaStore } from "../../../../app/common/storage/models/databaseSchemaStore";

describe("the LocalStorageDbService module", () => {
    let localStorageDbService: LocalStorageDbService;
    let sandbox: Sinon.SinonSandbox;
    const DB_NAME = "DB";
    const STORE_NAME = "STORE";
    const STORE_NAME_2 = "STORE2";
    const STORE_KEY = "db:DB:STORE"
    const STORE_KEY_2 = "db:DB:STORE2"
    const STORE_PK = "id";
    const OTHER_STORE_ID = "some_other_store";

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        localStorageDbService = new LocalStorageDbService();
        expect(window.localStorage.getItem(STORE_KEY)).toBeFalsy();
    });

    afterEach(async () => {
        sandbox.restore();

        await localStorageDbService.destroy(DB_NAME);
        expect(window.localStorage.getItem(STORE_KEY)).toBeFalsy();

        window.localStorage.removeItem(OTHER_STORE_ID);
    });

    it("can be created", () => {
        expect(localStorageDbService).toBeDefined();
    });

    describe("store creation", () => {
        it("can create a db with no stores and not error (this is a noop, in effect)", async done => {
            await localStorageDbService.create(<DatabaseSchema>{
                name: DB_NAME,
                version: 0
            });

            done();
        });

        it("can create a db with stores and tell it exists", async done => {
            await localStorageDbService.create(<DatabaseSchema>{
                name: DB_NAME,
                version: 0,
                storeSchemas: [
                    {
                        name: STORE_NAME,
                        keyPath: STORE_PK
                    }
                ]
            });

            expect(await localStorageDbService.exists(DB_NAME, DB_NAME)).toBe(true);
            expect(await localStorageDbService.storeExists(DB_NAME, STORE_NAME)).toBe(true);
            expect(window.localStorage.getItem(STORE_KEY)).toBeTruthy();
            done();
        });

        it("can create a store after the db has been created", async done => {
            await localStorageDbService.create(<DatabaseSchema>{
                name: DB_NAME,
                version: 0
            });

            await localStorageDbService.storeCreate(DB_NAME, <DatabaseSchemaStore>{
                name: STORE_NAME,
                keyPath: STORE_PK
            });

            expect(await localStorageDbService.exists(DB_NAME, DB_NAME)).toBe(true);
            expect(await localStorageDbService.storeExists(DB_NAME, STORE_NAME)).toBe(true);
            expect(window.localStorage.getItem(STORE_KEY)).toBeTruthy();

            // does not error if called twice
            await localStorageDbService.storeCreate(DB_NAME, <DatabaseSchemaStore>{
                name: STORE_NAME,
                keyPath: STORE_PK
            });

            done();
        });
    });


    describe("post-creation tests", () => {
        beforeEach(async done => {
            await localStorageDbService.create(<DatabaseSchema>{
                name: DB_NAME,
                version: 0,
                storeSchemas: [
                    {
                        name: STORE_NAME,
                        keyPath: STORE_PK
                    },
                    {
                        name: STORE_NAME_2,
                        keyPath: STORE_PK,
                        autoIncrement: true
                    },
                ]
            });

            // base-line check
            expect(await localStorageDbService.exists(DB_NAME, DB_NAME)).toBe(true);
            expect(await localStorageDbService.storeExists(DB_NAME, STORE_NAME)).toBe(true);
            expect(await localStorageDbService.storeExists(DB_NAME, STORE_NAME_2)).toBe(true);
            expect(window.localStorage.getItem(STORE_KEY)).toBeTruthy();
            expect(window.localStorage.getItem(STORE_KEY_2)).toBeTruthy();
            done();
        });

        it("open should not error", async done => {
            await localStorageDbService.open(DB_NAME);
            done();
        });

        it("close should not error", async done => {
            await localStorageDbService.close(DB_NAME);
            done();
        });

        it("getIndexes should return an appropriate stub", () => {
            let indexList = localStorageDbService.getIndexes(DB_NAME, STORE_NAME);
            // this is all just a guess, and implemented for compatibility with an indexedDb implementation
            expect(indexList.length).toBe(1);
            expect(indexList.contains(STORE_PK)).toBe(true);
            expect(indexList.contains("foofoo")).toBe(false);
            expect(indexList.item(0)).toBe(STORE_PK);
            expect(indexList.item(1)).toBeNull();
            expect(indexList[0]).toBe(STORE_PK);
            expect(indexList[1]).toBeFalsy();
        });

        describe("destruction and existence", () => {
            it("can delete a database, leave other keys intact and check existence", async done => {

                window.localStorage[OTHER_STORE_ID] = "foo";

                await localStorageDbService.destroy(DB_NAME);

                expect(await localStorageDbService.exists(DB_NAME, DB_NAME)).toBe(false);
                expect(await localStorageDbService.storeExists(DB_NAME, STORE_NAME)).toBe(false);
                expect(await localStorageDbService.storeExists(DB_NAME, STORE_NAME_2)).toBe(false);
                expect(window.localStorage.getItem(STORE_KEY)).toBeFalsy();
                expect(window.localStorage.getItem(STORE_KEY_2)).toBeFalsy();
                expect(window.localStorage[OTHER_STORE_ID]).toBe("foo");
                done();
            });

            it("can delete a single store and check existence", async done => {

                await localStorageDbService.storeRemove(DB_NAME, STORE_NAME);

                expect(await localStorageDbService.exists(DB_NAME, DB_NAME)).toBe(true);
                expect(await localStorageDbService.storeExists(DB_NAME, STORE_NAME)).toBe(false);
                expect(await localStorageDbService.storeExists(DB_NAME, STORE_NAME_2)).toBe(true);
                expect(window.localStorage.getItem(STORE_KEY)).toBeFalsy();
                expect(window.localStorage.getItem(STORE_KEY_2)).toBeTruthy();
                done();
            });
        });

        describe("setting, reading and removing", () => {
            describe("non-autoincrement store", () => {
                it("can fail to add a record with no-pk", async done => {
                    try {
                        await localStorageDbService.set(DB_NAME, STORE_NAME, {value: "foo"});
                    } catch (error) {
                        done();
                    }
                });

                it("can add, update, read and remove records one-by-one", async done => {
                    let readAndAssert = async (expectedRecords: any[]) => {
                        let storedRecords = await localStorageDbService.getAll(DB_NAME, STORE_NAME);
                        expect(storedRecords).toEqual(expectedRecords);
                    }
                    // add
                    await localStorageDbService.set(DB_NAME, STORE_NAME, {id: 0, value: "foo"});
                    readAndAssert([{id: 0, value: "foo"}]);
                    // add
                    await localStorageDbService.set(DB_NAME, STORE_NAME, {id: 1, value: "bar"});
                    readAndAssert([{id: 0, value: "foo"}, {id: 1, value: "bar"}]);
                    // update
                    await localStorageDbService.set(DB_NAME, STORE_NAME, {id: 1, value: "baz"});
                    readAndAssert([{id: 0, value: "foo"}, {id: 1, value: "baz"}]);

                    let item0 = await localStorageDbService.get(DB_NAME, STORE_NAME, "id", 0);
                    expect(item0).toEqual({id: 0, value: "foo"});
                    let item1 = await localStorageDbService.get(DB_NAME, STORE_NAME, "id", 1);
                    expect(item1).toEqual({id: 1, value: "baz"});
                    let itemMissing = await localStorageDbService.get(DB_NAME, STORE_NAME, "id", 2);
                    expect(itemMissing).toBeUndefined();

                    // remove
                    await localStorageDbService.remove(DB_NAME, STORE_NAME, 0);
                    readAndAssert([{id: 1, value: "baz"}]);
                    // remove
                    await localStorageDbService.remove(DB_NAME, STORE_NAME, 1);
                    readAndAssert([]);

                    done();
                });

                it("can add, update, read and remove records in multiples", async done => {
                    let readAndAssert = async (expectedRecords: any[]) => {
                        let storedRecords = await localStorageDbService.getAll(DB_NAME, STORE_NAME);
                        expect(storedRecords).toEqual(expectedRecords);
                    }
                    // add
                    await localStorageDbService.setAll(DB_NAME, STORE_NAME, [{id: 0, value: "foo"}, {id: 1, value: "bar"}]);
                    readAndAssert([{id: 0, value: "foo"}, {id: 1, value: "bar"}]);

                    //add
                    await localStorageDbService.setAll(DB_NAME, STORE_NAME, [{id: 2, value: "baz"}, {id: 3, value: "buz"}]);
                    readAndAssert([{id: 0, value: "foo"}, {id: 1, value: "bar"}, {id: 2, value: "baz"}, {id: 3, value: "buz"}]);

                    // update
                    await localStorageDbService.setAll(DB_NAME, STORE_NAME, [{id: 2, value: "bazz"}, {id: 3, value: "buzz"}]);
                    readAndAssert([{id: 0, value: "foo"}, {id: 1, value: "bar"}, {id: 2, value: "bazz"}, {id: 3, value: "buzz"}]);

                    // mix add and update
                    await localStorageDbService.setAll(DB_NAME, STORE_NAME, [{id: 2, value: "baz"}, {id: 4, value: "buzz"}]);
                    readAndAssert([{id: 0, value: "foo"}, {id: 1, value: "bar"}, {id: 2, value: "baz"}, {id: 3, value: "buzz"}, {id: 4, value: "buzz"}]);

                    // read many
                    let items = await localStorageDbService.getAll(DB_NAME, STORE_NAME, "value", "buzz");
                    expect(items).toEqual([{id: 3, value: "buzz"}, {id: 4, value: "buzz"}]);

                    // remove all
                    await localStorageDbService.removeAll(DB_NAME, STORE_NAME);
                    readAndAssert([]);

                    done();
                });

                describe("autoincrement store", () => {

                    it("can add, update, read and remove records one-by-one", async done => {
                        let readAndAssert = async (expectedRecords: any[]) => {
                            let storedRecords = await localStorageDbService.getAll(DB_NAME, STORE_NAME_2);
                            expect(storedRecords).toEqual(expectedRecords);
                        }
                        // add
                        await localStorageDbService.set(DB_NAME, STORE_NAME_2, {value: "foo"});
                        readAndAssert([{id: 0, value: "foo"}]);
                        // add
                        await localStorageDbService.set(DB_NAME, STORE_NAME_2, {value: "bar"});
                        readAndAssert([{id: 0, value: "foo"}, {id: 1, value: "bar"}]);
                        // update
                        await localStorageDbService.set(DB_NAME, STORE_NAME_2, {id: 1, value: "baz"});
                        readAndAssert([{id: 0, value: "foo"}, {id: 1, value: "baz"}]);
                        // remove
                        await localStorageDbService.remove(DB_NAME, STORE_NAME_2, 0);
                        readAndAssert([{id: 1, value: "baz"}]);
                        // remove
                        await localStorageDbService.remove(DB_NAME, STORE_NAME_2, 1);
                        readAndAssert([]);

                        // add - check autoIncrementing is ok
                        await localStorageDbService.set(DB_NAME, STORE_NAME_2, {value: "foo"});
                        readAndAssert([{id: 2, value: "foo"}]);

                        done();
                    });

                    it("can add, update, read and remove records in multiples", async done => {
                        let readAndAssert = async (expectedRecords: any[]) => {
                            let storedRecords = await localStorageDbService.getAll(DB_NAME, STORE_NAME_2);
                            expect(storedRecords).toEqual(expectedRecords);
                        }
                        // add
                        await localStorageDbService.setAll(DB_NAME, STORE_NAME_2, [{value: "foo"}, {value: "bar"}]);
                        readAndAssert([{id: 0, value: "foo"}, {id: 1, value: "bar"}]);

                        //add
                        await localStorageDbService.setAll(DB_NAME, STORE_NAME_2, [{value: "baz"}, {value: "buz"}]);
                        readAndAssert([{id: 0, value: "foo"}, {id: 1, value: "bar"}, {id: 2, value: "baz"}, {id: 3, value: "buz"}]);

                        // update
                        await localStorageDbService.setAll(DB_NAME, STORE_NAME_2, [{id: 2, value: "bazz"}, {id: 3, value: "buzz"}]);
                        readAndAssert([{id: 0, value: "foo"}, {id: 1, value: "bar"}, {id: 2, value: "bazz"}, {id: 3, value: "buzz"}]);

                        // mix add and update
                        await localStorageDbService.setAll(DB_NAME, STORE_NAME_2, [{id: 2, value: "baz"}, {value: "buzz"}]);
                        readAndAssert([{id: 0, value: "foo"}, {id: 1, value: "bar"}, {id: 2, value: "baz"}, {id: 3, value: "buzz"}, {id: 4, value: "buzz"}]);

                        // read many
                        let items = await localStorageDbService.getAll(DB_NAME, STORE_NAME_2, "value", "buzz");
                        expect(items).toEqual([{id: 3, value: "buzz"}, {id: 4, value: "buzz"}]);

                        // remove all
                        await localStorageDbService.removeAll(DB_NAME, STORE_NAME_2);
                        readAndAssert([]);

                         // add - check autoIncrementing is ok
                         await localStorageDbService.setAll(DB_NAME, STORE_NAME_2, [{value: "foo"}, {value: "bar"}]);
                         readAndAssert([{id: 5, value: "foo"}, {id: 6, value: "bar"}]);

                        done();
                    });
            });
        });

    });

    });
});
