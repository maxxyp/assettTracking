/// <reference path="../../../../../typings/app.d.ts" />

import { StorageService } from "../../../../../app/hema/business/services/storageService";
import { IStorage } from "../../../../../app/common/core/services/IStorage";
import { StorageConstants } from "../../../../../app/hema/business/constants/storageConstants";
import { DateHelper } from "../../../../../app/hema/core/dateHelper";
import { ISynchronousStorage } from "../../../../../app/common/core/services/ISynchronousStorage";

describe("the StorageService module", () => {
    let storageService: StorageService;
    let storageStub: IStorage;
    let syncStorageStub: ISynchronousStorage;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        storageStub = <IStorage>{};
        syncStorageStub = <ISynchronousStorage>{};
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        storageService = new StorageService(storageStub, syncStorageStub);
        expect(storageService).toBeDefined();
    });

    describe("user settings", () => {
        it("complete", (done) => {
            let storageGet = storageStub.get = sandbox.stub();

            storageGet.withArgs(StorageConstants.HEMA_USER_SETTINGS, StorageConstants.HEMA_USER_PATCH).resolves("patch")
                .withArgs(StorageConstants.HEMA_USER_SETTINGS, StorageConstants.HEMA_USER_REGION).resolves("region")
                .withArgs(StorageConstants.HEMA_USER_SETTINGS, StorageConstants.HEMA_SECTOR).resolves("sector");

            storageService = new StorageService(storageStub, syncStorageStub);

            storageService.userSettingsComplete().then((val) => {
                expect(val).toBeTruthy();
                done();
            });
        });

        it("incomplete - no patch", (done) => {
            let storageGet = storageStub.get = sandbox.stub();

            storageGet.withArgs(StorageConstants.HEMA_USER_SETTINGS, StorageConstants.HEMA_USER_PATCH).resolves(undefined)
                .withArgs(StorageConstants.HEMA_USER_SETTINGS, StorageConstants.HEMA_USER_REGION).resolves("region")
                .withArgs(StorageConstants.HEMA_USER_SETTINGS, StorageConstants.HEMA_SECTOR).resolves("sector");

            storageService = new StorageService(storageStub, syncStorageStub);

            storageService.userSettingsComplete().then((val) => {
                expect(val).toBeFalsy();
                done();
            });
        });

        it("incomplete - no region", (done) => {
            let storageGet = storageStub.get = sandbox.stub();

            storageGet.withArgs(StorageConstants.HEMA_USER_SETTINGS, StorageConstants.HEMA_USER_PATCH).resolves("patch")
                .withArgs(StorageConstants.HEMA_USER_SETTINGS, StorageConstants.HEMA_USER_REGION).resolves(undefined)
                .withArgs(StorageConstants.HEMA_USER_SETTINGS, StorageConstants.HEMA_SECTOR).resolves("sector");

            storageService = new StorageService(storageStub, syncStorageStub);

            storageService.userSettingsComplete().then((val) => {
                expect(val).toBeFalsy();
                done();
            });
        });

        it("incomplete - no sector", (done) => {
            let storageGet = storageStub.get = sandbox.stub();

            storageGet.withArgs(StorageConstants.HEMA_USER_SETTINGS, StorageConstants.HEMA_USER_PATCH).resolves("patch")
                .withArgs(StorageConstants.HEMA_USER_SETTINGS, StorageConstants.HEMA_USER_REGION).resolves("region")
                .withArgs(StorageConstants.HEMA_USER_SETTINGS, StorageConstants.HEMA_SECTOR).resolves(undefined);

            storageService = new StorageService(storageStub, syncStorageStub);

            storageService.userSettingsComplete().then((val) => {
                expect(val).toBeFalsy();
                done();
            });
        });
    });

    describe("getResilienceRetryPayloads", () => {
        it("will return payloads with proper dates", done => {
            storageService = new StorageService(storageStub, syncStorageStub);
            syncStorageStub.getSynchronous = sandbox.stub().returns(
                [
                    {
                        expiryTime: "2019-06-13T08:00:00.000Z",
                        lastRetryTime: "2019-06-13T08:00:00.000Z"
                    }
                ]
            );

            let payloads = storageService.getResilienceRetryPayloads("foo");
            expect(DateHelper.isDate(payloads[0].expiryTime)).toBe(true);
            expect(DateHelper.isDate(payloads[0].lastRetryTime)).toBe(true);
            done();
        
        });
    });
});
