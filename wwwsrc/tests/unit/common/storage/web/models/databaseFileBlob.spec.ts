/// <reference path="../../../../../../typings/app.d.ts" />

import {DatabaseFileBlob} from "../../../../../../app/common/storage/web/models/databaseFileBlob";

describe("the DatabaseFileBlob module", () => {
    let databaseFileBlob: DatabaseFileBlob;

    beforeEach(() => {
        databaseFileBlob = new DatabaseFileBlob();
    });

    it("can be created", () => {
        expect(databaseFileBlob).toBeDefined();
    });
});
