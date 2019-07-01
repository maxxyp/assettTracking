/// <reference path="../../../../../typings/app.d.ts" />

import {DatabaseSchemaStoreIndex} from "../../../../../app/common/storage/models/databaseSchemaStoreIndex";

describe("the DatabaseSchemaStoreIndex module", () => {
    let databaseSchemaStoreIndex: DatabaseSchemaStoreIndex;

    beforeEach(() => {
        databaseSchemaStoreIndex = new DatabaseSchemaStoreIndex("", "", false);
    });

    it("can be created", () => {
        expect(databaseSchemaStoreIndex).toBeDefined();
    });
});
