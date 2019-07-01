/// <reference path="../../../../../typings/app.d.ts" />

import {Preferences} from "../../../../../app/common/ui/views/preferences";
import {BrowserLocalStorage} from "../../../../../app/common/core/services/browserLocalStorage";
import {IPreferencesView} from "../../../../../app/common/ui/views/IPreferencesView";
import {IPreferencesConsumer} from "../../../../../app/common/ui/views/IPreferencesConsumer";

describe("the Preferences module", () => {
    let preferences: Preferences;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        preferences = new Preferences(new BrowserLocalStorage());
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(preferences).toBeDefined();
    });

    it("can add a preference child", () => {
        preferences.add("aview", <IPreferencesView>{}, <IPreferencesConsumer>{});
        expect(preferences).toBeDefined();
    });
});
