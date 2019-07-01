/// <reference path="../../../../../typings/app.d.ts" />

import {History} from "../../../../../app/hema/business/models/history";

describe("the History module", () => {
    let history: History;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        history = new History();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(history).toBeDefined();
        expect(history.tasks).toBeUndefined();
        expect(history.appliances).toBeUndefined();
    });
});
