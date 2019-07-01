/// <reference path="../../../../../typings/app.d.ts" />

import {DatabaseSchemaStore} from "../../../../../app/common/storage/models/databaseSchemaStore";

describe("the DatabaseSchemaStore module", () => {
    let databaseSchemaStore: DatabaseSchemaStore;

    beforeEach(() => {
        databaseSchemaStore = new DatabaseSchemaStore("", null, false, null);
    });

    it("can be created", () => {
        expect(databaseSchemaStore).toBeDefined();
    });
});
