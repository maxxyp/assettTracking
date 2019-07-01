/// <reference path="../../../../../typings/app.d.ts" />

import {LocalStorageService} from "../../../../../app/common/storage/wua/localStorageService";

describe("the LocalStorageService Wua module", () => {
    let localStorageService: LocalStorageService;
    let storageFolderStub: any;

    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        window.Windows = {};
        window.Windows.Storage = Windows.Storage;
        window.Windows.Storage.Streams = Windows.Storage.Streams;
        window.Windows.Storage.StorageFolder = Windows.Storage.StorageFolder;
        window.Windows.Storage.StorageFile = Windows.Storage.StorageFile;
        storageFolderStub = new Windows.Storage.StorageFolder();
        localStorageService = new LocalStorageService(storageFolderStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(localStorageService).toBeDefined();
    });

    it("initialise", (done) => {
        localStorageService.initialise("Test", true).then(() => {
            done();
        });
    });

    it("initialise without remove", (done) => {
        localStorageService.initialise("Test", false).then(() => {
            done();
        });
    });

    it("initialise", (done) => {

        localStorageService.initialise("Test", true).then(() => {
            done();
        });
    });

    it("closedown", (done) => {
        localStorageService.closedown().then(() => {
            done();
        });
    });

    it("write success", (done) => {
        localStorageService.write<string>("path1", "file1", "myblob").then(() => {
            done();
        });
    });
    
    it("write createFolderAsync rejects", (done) => {
        localStorageService.write<string>("path2", "file1", "myblob").catch(() => {
            done();
        });
    });

    it("write createFileAsync rejects", (done) => {
        localStorageService.write<string>("path1", "file2", "myblob").catch(() => {
            done();
        });
    });

    it("read success", (done) => {
        localStorageService.read<string>("path1", "file1").then((res: string) => {
            expect(res === "foo").toBeTruthy();
            done();
        });
    });

    it("read getFileAsync rejects", (done) => {
        localStorageService.read<string>("path1", "file2").catch((res: string) => {
            done();
        });
    });

    it("exists success", (done) => {
        localStorageService.exists("path1", "file1").then((res: boolean) => {
            expect(res).toBeTruthy();
            done();
        });
    });

    it("file does not exists", (done) => {
        localStorageService.exists("path1", "file2").then((res: boolean) => {
            expect(res).toBeFalsy();
            done();
        });
    });

    it("remove success", (done) => {
        localStorageService.remove("path1", "file1").then(() => {
            done();
        });
    });

    it("remove file not found", (done) => {
        localStorageService.remove("path1", "file2").catch(() => {
            done();
        });
    });

    it("list success", (done) => {
        localStorageService.list("path1").then((files: string[]) => {
            expect(files.length === 1).toBeTruthy();
            expect(files[0] === "myfile").toBeTruthy();
            done();
        });
    });

    it("list folder not found rejects", (done) => {
        localStorageService.list("path2").catch(() => {
            done();
        });
    });
});

module Windows.Storage.Streams {

    export class DataReader {
        public static fromBuffer(buffer: any): any {
            return { readString(buffer: any): any { return '"foo"'; } };
        }
    }

    export class DataWriter {
        public writeString(blob: any): void { }
        public detachBuffer(): any {
            return {};
        }
        public close(): void { }
    }

    export class InMemoryRandomAccessStream {

    }

}

module Windows.Storage {
    export class StorageFolder {
        public createFolderAsync(path: any, openIfExists: any): Promise<StorageFolder> {
            return new Promise<StorageFolder>((resolve, reject) => {
                let folder: StorageFolder = new StorageFolder();
                if (path.indexOf("path1") > -1) {
                    resolve(folder);
                } else {
                    reject(folder)
                }
            });
        }
        public createFileAsync(filename: any, replaceExisting: any): Promise<StorageFile> {
            return new Promise<StorageFile>((resolve, reject) => {
                let file: StorageFile = new StorageFile();
                if (filename.indexOf("file1") > -1) {
                    resolve(file);
                } else {
                    reject(file);
                }
            });
        }

        public getFolderAsync(path: any): Promise<StorageFolder> {
            return new Promise<StorageFolder>((resolve, reject) => {
                let folder: StorageFolder = new StorageFolder();
                if (path.indexOf("path1") > -1) {
                    resolve(folder);
                } else {
                    reject(folder);
                }
            });
        }

        public getFileAsync(filename: any): Promise<StorageFile> {
            return new Promise<StorageFile>((resolve, reject) => {
                let file: StorageFile = new StorageFile();
                if (filename.indexOf("file1") > -1) {
                    resolve(file);
                } else {
                    reject(file);
                }
            });
        }

        public getFilesAsync(): Promise<StorageFile[]> {
            return new Promise<StorageFile[]>((resolve, reject) => {
                let files: StorageFile[] = [];
                let file: StorageFile = new StorageFile();
                file.name = "myfile";
                files.push(file);
                resolve(files)
            });
        }
    }
    export class StorageFile {

        public name: string;

        public deleteAsync(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                resolve();
            });
        }
    }

    export class CreationCollisionOption {
        openIfExists: any;
        replaceExisting: any;
    }

    export class FileIO {
        public static writeBufferAsync(fileInFolder: any, buffer: any): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                resolve();
            });
        }

        public static readBufferAsync(fileInFolder: any): Promise<any[]> {
            return new Promise<any[]>((resolve, reject) => {
                let buffer: any[] = [];
                resolve(buffer);
            });
        }
    }
}
