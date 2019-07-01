/// <reference path="../../../../../typings/app.d.ts" />

import {DatabaseSchema} from "../../../../../app/common/storage/models/databaseSchema";

describe("the DatabaseSchema module", () => {
    let databaseSchema: DatabaseSchema;

    beforeEach(() => {
        databaseSchema = new DatabaseSchema("", 1, null);
    });

    it("can be created", () => {
        expect(databaseSchema).toBeDefined();
    });
});
