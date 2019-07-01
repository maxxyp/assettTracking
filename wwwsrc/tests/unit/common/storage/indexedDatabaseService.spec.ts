/// <reference path="../../../../typings/app.d.ts" />
///<reference path="../../../../app/common/storage/models/databaseSchemaStore.ts"/>

import {IndexedDatabaseService} from "../../../../app/common/storage/indexedDatabaseService";
import {DatabaseSchemaStore} from "../../../../app/common/storage/models/databaseSchemaStore";
import {DatabaseSchema} from "../../../../app/common/storage/models/databaseSchema";

describe("the IndexedDatabaseService module", () => {
    let sandbox: Sinon.SinonSandbox;
    let indexedDatabaseService: IndexedDatabaseService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        indexedDatabaseService = new IndexedDatabaseService();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(indexedDatabaseService).toBeDefined();
    });

    it("create", (done) => {
        let stores: DatabaseSchemaStore[] = [];
        let store1: DatabaseSchemaStore = new DatabaseSchemaStore("store1", "id", false, null);
        stores.push(store1);
        let schema: DatabaseSchema = new DatabaseSchema("db1", 1, stores);
        indexedDatabaseService.create(schema).then(() => {
            done();
        })
        .catch((err) => fail(err));
    }, 10000); // add 10 second timeout for build agents. Phantomjs seems to require longer to aquire a lock

    it("destroy", (done) => {
        indexedDatabaseService.destroy("mydb").then(() => {
            done();
        });
    });

    it("get", (done) => {
        let stores: DatabaseSchemaStore[] = [];
        let store1: DatabaseSchemaStore = new DatabaseSchemaStore("store1", "id", false, null);
        stores.push(store1);
        let schema: DatabaseSchema = new DatabaseSchema("db1", 1, stores);
        indexedDatabaseService.create(schema).then(() => {
            indexedDatabaseService.get("db1","store1", undefined, undefined).then((res: any) => {
                done();
            });
        });
    });

    it("getAll", (done) => {
        let stores: DatabaseSchemaStore[] = [];
        let store1: DatabaseSchemaStore = new DatabaseSchemaStore("store1", "id", true, null);
        stores.push(store1);
        let schema: DatabaseSchema = new DatabaseSchema("db1", 1, stores);
        indexedDatabaseService.create(schema).then(() => {
            indexedDatabaseService.getAll<string>("db1","store1").then((res: any) => {
                done();
            });
        });
    });

    it("remove", (done) => {
        let stores: DatabaseSchemaStore[] = [];
        let store1: DatabaseSchemaStore = new DatabaseSchemaStore("store1", "id", true, null);
        stores.push(store1);
        let schema: DatabaseSchema = new DatabaseSchema("db1", 1, stores);
        indexedDatabaseService.create(schema).then(() => {
            indexedDatabaseService.remove("db1","store1", "id").then(() => {
                done();
            });
        });
    });

    it("removeAll", (done) => {
        let stores: DatabaseSchemaStore[] = [];
        let store1: DatabaseSchemaStore = new DatabaseSchemaStore("store1", "id", true, null);
        stores.push(store1);
        let schema: DatabaseSchema = new DatabaseSchema("db1", 1, stores);
        indexedDatabaseService.create(schema).then(() => {
            indexedDatabaseService.removeAll("db1","store1").then(() => {
                done();
            });
        });
    });
});
