/// <reference path="../../../../../typings/app.d.ts" />

import {BlobStorageService} from "../../../../../app/common/storage/web/blobStorageService";
import {IDatabaseService} from "../../../../../app/common/storage/IDatabaseService";

describe("the BlobStorageService Web module", () => {
    let sandbox: Sinon.SinonSandbox;
    let blobStorageService: BlobStorageService;
    let databaseServiceStub = <IDatabaseService>{};

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        blobStorageService = new BlobStorageService(databaseServiceStub);
        databaseServiceStub.exists = sandbox.stub().returns(Promise.resolve(true));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(blobStorageService).toBeDefined();
    });

    it("initialise", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        blobStorageService.initialise("Test", false).then(() => {
            done();
        });
    });

    it("initialise with remove existing", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        let destroySpy : Sinon.SinonSpy = databaseServiceStub.destroy = sandbox.stub().returns(Promise.resolve(null));

        blobStorageService.initialise("Test", true).then(() => {
            expect(destroySpy.calledWith("Test")).toBe(true);
            done();
        });
    });

    it("initialise with remove existing when destroy throws", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        databaseServiceStub.destroy = sandbox.stub().returns(Promise.reject("_error_"));

        blobStorageService.initialise("Test", true).then((error) => {
            expect(error).toBe("_error_");
            done();
        });
    });

    it("initialise when already initialised", (done) => {
        let openSpy : Sinon.SinonSpy = databaseServiceStub.open = sandbox.stub().returns(Promise.resolve(null));

        blobStorageService.initialise("Test", false)
        .then(() => blobStorageService.initialise("Test", false))
        .then(() => {
            expect(openSpy.calledOnce).toBe(true);
            done();
        });

    });

    it("not initialise resolves", (done) => {
        blobStorageService.initialise("Test", false).then(() => {
            done();
        });
    });

    it("initialise rejects", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            reject();
        }));
        blobStorageService.initialise("Test", false).catch((err) => {
            expect(err.indexOf("Unable to initialise blob storage") > -1).toBeTruthy();
            done();
        });
    });

    it("closedown", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        blobStorageService.closedown().then(() => {
            done();
        });
    });

    it("closedown initialise resolves", (done) => {
        blobStorageService.closedown().then(() => {
            done();
        });
    });

    it("closedown rejects", (done) => {
        databaseServiceStub.close = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            reject();
        }));
        blobStorageService.initialise("Test", false).then(() => {
            blobStorageService.closedown().catch((err) => {
                expect(err.indexOf("Unable to closedown blob storage") > -1).toBeTruthy();
                done();
            });
        });
    });

    it("closedown when initialised", (done) => {
        let openSpy : Sinon.SinonSpy = databaseServiceStub.close = sandbox.stub().returns(Promise.resolve(null));

        blobStorageService.initialise("Test", false)
        .then(() => blobStorageService.closedown())
        .then(() => {
            expect(openSpy.calledOnce).toBe(true);
            done();
        });
    });

    it("write rejects", (done) => {
        databaseServiceStub.set = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        blobStorageService.write<string>("path1", "file1", "blob")
            .catch((err) => {
                expect(err.indexOf("The blob storage is not initialised") > -1).toBeTruthy();
                done();
            });
    });

    it("write success", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        databaseServiceStub.set = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        blobStorageService.initialise("Test", false).then(() => {
            blobStorageService.write<string>("path1", "file1", "blob")
                .then(() => {
                    done();
                });
        });
    });

    it("write set database rejects", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        databaseServiceStub.set = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            reject();
        }));
        blobStorageService.initialise("Test", false).then(() => {
            blobStorageService.write<string>("path1", "file1", "blob")
                .catch((err) => {
                    expect(err.indexOf("Unable to write file to blob storage") > -1).toBeTruthy();
                    done();
                });
        });
    });

    it("read success", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        databaseServiceStub.get = sandbox.stub().returns(new Promise<string>((resolve, reject) => {
            resolve("db");
        }));
        blobStorageService.initialise("Test", false).then(() => {
            blobStorageService.read<string>("path1", "file1")
                .then(() => {
                    done();
                });
        });
    });

    it("read rejects", (done) => {
        databaseServiceStub.get = sandbox.stub().returns(new Promise<string>((resolve, reject) => {
            resolve("db");
        }));
        blobStorageService.read<string>("path1", "file1")
            .catch((err) => {
                expect(err.indexOf("The blob storage is not initialised") > -1).toBeTruthy();
                done();
            });
    });


    it("read get database rejects", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        databaseServiceStub.get = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            reject();
        }));
        blobStorageService.initialise("Test", false).then(() => {
            blobStorageService.read<string>("path1", "file1")
                .catch((err) => {
                    expect(err.indexOf("Unable to read file from blob storage") > -1).toBeTruthy();
                    done();
                });
        });
    });

    it("exists success", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        databaseServiceStub.get = sandbox.stub().returns(new Promise<string>((resolve, reject) => {
            resolve("db");
        }));
        blobStorageService.initialise("Test", false).then(() => {
            blobStorageService.exists("path1", "file1")
                .then((res) => {
                    expect(res).toBeTruthy();
                    done();
                });
        });
    });

    it("exists rejects", (done) => {
        blobStorageService.exists("path1", "file1")
            .catch((err) => {
                expect(err.indexOf("The blob storage is not initialised") > -1).toBeTruthy();
                done();
            });
    });

    it("exists get database rejects", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        databaseServiceStub.get = sandbox.stub().returns(new Promise<string>((resolve, reject) => {
            reject();
        }));
        blobStorageService.initialise("Test", false).then(() => {
            blobStorageService.exists("path1", "file1")
                .then((res) => {
                    expect(res).toBeFalsy();
                    done();
                });
        });
    });

    it("size", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(Promise.resolve(null));
        databaseServiceStub.get = sandbox.stub().returns(Promise.resolve({ size: 99 }));

        blobStorageService.initialise("Test", false)
        .then(() => blobStorageService.size("path1", "file1"))
        .then((size) => {
           expect(size).toBe(99);
            done();
        });
    });

    it("size throws when not intialised", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(Promise.resolve(null));
        databaseServiceStub.get = sandbox.stub().returns(Promise.resolve({ size: 99 }));

        blobStorageService.size("path1", "file1")
        .then(() => {
           fail("should fail");
        })
        .catch(() => {
            done();
        });
    });

    it("size throws when database get rejects", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(Promise.resolve(null));
        databaseServiceStub.get = sandbox.stub().returns(Promise.reject(""));

       blobStorageService.initialise("Test", false)
        .then(() => blobStorageService.size("path1", "file1"))
        .then((size) => {
           expect(size).toBe(-1);
            done();
        });
    });

    it("remove success", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        databaseServiceStub.remove = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        blobStorageService.initialise("Test", false).then(() => {
            blobStorageService.remove("path1", "file1")
                .then(() => {
                    done();
                });
        });
    });

    it("remove rejects", (done) => {
        blobStorageService.remove("path1", "file1")
            .catch((err: any) => {
                expect(err.indexOf("The blob storage is not initialised") > -1).toBeTruthy();
                done();
            });
    });

    it("remove remove database rejects", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        databaseServiceStub.remove = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            reject();
        }));
        blobStorageService.initialise("Test", false).then(() => {
            blobStorageService.remove("path1", "file1")
                .catch((err: any) => {
                    expect(err.indexOf("Unable to delete file from blob storage") > -1).toBeTruthy();
                    done();
                });
        });
    });

    it("list success", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        databaseServiceStub.getAll = sandbox.stub().returns(new Promise<any[]>((resolve, reject) => {
            let blobs: any[] = [];
            let blob: any = {};
            blob.file = {};
            blobs.push(blob);
            resolve(blobs);
        }));
        blobStorageService.initialise("Test", false).then(() => {
            blobStorageService.list("path1")
                .then((files: string[]) => {
                    expect(files.length === 1).toBeTruthy();
                    done();
                });
        });
    });

    it("list rejects", (done) => {
        blobStorageService.list("path1")
            .catch((err: any) => {
                expect(err.indexOf("The blob storage is not initialised") > -1).toBeTruthy();
                done();
            });
    });

    it("list getAll rejects", (done) => {
        databaseServiceStub.open = sandbox.stub().returns(new Promise<void>((resolve, reject) => {
            resolve();
        }));
        databaseServiceStub.getAll = sandbox.stub().returns(new Promise<any[]>((resolve, reject) => {
            reject();
        }));
        blobStorageService.initialise("Test", false).then(() => {
            blobStorageService.list("path1")
                .catch((err: any) => {
                    expect(err.indexOf("Unable to list files from blob storage") > -1).toBeTruthy();
                    done();
                });
        });
    });
});
