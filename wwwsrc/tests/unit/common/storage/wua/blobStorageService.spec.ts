/// <reference path="../../../../../typings/app.d.ts" />

import {BlobStorageService} from "../../../../../app/common/storage/wua/blobStorageService";

describe("the BlobStorageService Wua module", () => {
    let sandbox: Sinon.SinonSandbox;
    let blobStorageService: BlobStorageService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        window.Windows = {};
        window.Windows.Storage = {};
        window.Windows.Storage.ApplicationData = {};
        window.Windows.Storage.ApplicationData.current = {};
        window.Windows.Storage.ApplicationData.current.localFolder = {}
        blobStorageService = new BlobStorageService();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(blobStorageService).toBeDefined();
    });
});
