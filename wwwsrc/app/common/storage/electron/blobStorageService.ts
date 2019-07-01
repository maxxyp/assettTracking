/// <reference path="../../../../typings/app.d.ts" />

import { IBlobStorageService } from "../IBlobStorageService";
import { inject } from "aurelia-dependency-injection";
import { IndexedDatabaseService } from "../indexedDatabaseService";
import { IDatabaseService } from "../IDatabaseService";
import { DatabaseSchema } from "../models/databaseSchema";
import { DatabaseSchemaStore } from "../models/databaseSchemaStore";
import { DatabaseSchemaStoreIndex } from "../models/databaseSchemaStoreIndex";
import { DatabaseFileBlob } from "./models/databaseFileBlob";

@inject(IndexedDatabaseService)
export class BlobStorageService implements IBlobStorageService {
    private static _STORE_NAME: string = "files";

    private _databaseService: IDatabaseService;
    private _isIntialised: boolean;
    private _storageName: string;

    constructor(databaseService: IDatabaseService) {
        this._databaseService = databaseService;
        this._isIntialised = false;
    }

    private static sanitisePath(path: string): string {
        if (path) {
            path = path.replace(/\\/g, "/");
            if (path[0] !== "/") {
                path = "/" + path;
            }
            if (path[path.length - 1] !== "/") {
                path += "/";
            }
        }

        return path;
    }

    public checkInitised(storageName: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._databaseService.exists(BlobStorageService._STORE_NAME, storageName)
                .then((exists: boolean) => {
                    if (exists) {
                        this._isIntialised = true;
                        resolve();
                    } else {
                        this._isIntialised = false;
                        resolve();
                    }
                });
        });
    }

    public initialise(storageName: string, removeExisting: boolean): Promise<void> {
        this._storageName = storageName;
        return new Promise<void>((resolve, reject) => {
            if (this._isIntialised) {
                resolve();
            } else {
                let open = () => {
                    let schema: DatabaseSchema = new DatabaseSchema(this._storageName, 1, [
                        new DatabaseSchemaStore(BlobStorageService._STORE_NAME, "fullPath", false, [
                            new DatabaseSchemaStoreIndex("path", "path", false)
                        ])
                    ]);

                    this._databaseService.exists(BlobStorageService._STORE_NAME, BlobStorageService._STORE_NAME).then((exists) => {
                        if (exists) {
                            this._databaseService.open(BlobStorageService._STORE_NAME)
                                .then(() => {
                                    this._isIntialised = true;
                                    resolve();
                                })
                                .catch(() => {
                                    reject("Unable to initialise blob storage");
                                });
                        } else {
                            this._databaseService.create(schema)
                                .then(() => {
                                    this._isIntialised = true;
                                    resolve();
                                })
                                .catch(() => {
                                    reject("Unable to initialise blob storage");
                                });
                        }
                    });

                };

                if (removeExisting) {
                    this._databaseService.destroy(this._storageName).then(() => {
                        return open();
                    }).catch((err) => {
                        resolve(err);
                    });
                } else {
                    return open();
                }
            }
        });
    }

    public closedown(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this._isIntialised) {
                resolve();
            } else {
                this._databaseService.close(BlobStorageService._STORE_NAME)
                    .then(() => {
                        this._isIntialised = false;
                        resolve();
                    })
                    .catch(() => {
                        reject("Unable to closedown blob storage");
                    });
            }
        });
    }

    public write<T>(path: string, file: string, blob: T): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this._isIntialised) {
                reject("The blob storage is not initialised");
            } else {
                path = BlobStorageService.sanitisePath(path);

                let databaseFileBlob = new DatabaseFileBlob();
                databaseFileBlob.fullPath = path + file;
                databaseFileBlob.path = path;
                databaseFileBlob.file = file;
                databaseFileBlob.blob = blob;
                databaseFileBlob.size = JSON.stringify(blob).length;

                this._databaseService.set(BlobStorageService._STORE_NAME, BlobStorageService._STORE_NAME, databaseFileBlob)
                    .then(() => {
                        resolve();
                    })
                    .catch(() => {
                        reject("Unable to write file to blob storage");
                    });
            }
        });
    }

    public read<T>(path: string, file: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (!this._isIntialised) {
                reject("The blob storage is not initialised");
            } else {
                path = BlobStorageService.sanitisePath(path);

                this._databaseService.get<DatabaseFileBlob>(BlobStorageService._STORE_NAME, BlobStorageService._STORE_NAME, "path", path + file)
                    .then((item) => {
                        resolve(item.blob);
                    })
                    .catch(() => {
                        reject("Unable to read file from blob storage");
                    });
            }
        });
    }

    public exists(path: string, file: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!this._isIntialised) {
                reject("The blob storage is not initialised");
            } else {
                path = BlobStorageService.sanitisePath(path);

                this._databaseService.get<DatabaseFileBlob>(BlobStorageService._STORE_NAME, BlobStorageService._STORE_NAME, "path", path + file)
                    .then(() => {
                        resolve(true);
                    })
                    .catch(() => {
                        resolve(false);
                    });
            }
        });
    }

    public size(path: string, file: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            if (!this._isIntialised) {
                reject("The blob storage is not initialised");
            } else {
                path = BlobStorageService.sanitisePath(path);

                this._databaseService.get<DatabaseFileBlob>(BlobStorageService._STORE_NAME, BlobStorageService._STORE_NAME, "path", path + file)
                    .then((data) => {
                        resolve(data.size);
                    })
                    .catch(() => {
                        resolve(-1);
                    });
            }
        });
    }

    public remove(path: string, file: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this._isIntialised) {
                reject("The blob storage is not initialised");
            } else {
                path = BlobStorageService.sanitisePath(path);

                this._databaseService.remove(BlobStorageService._STORE_NAME, BlobStorageService._STORE_NAME, path + file)
                    .then(() => {
                        resolve();
                    })
                    .catch(() => {
                        reject("Unable to delete file from blob storage");
                    });
            }
        });
    }

    public list(path: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            if (!this._isIntialised) {
                reject("The blob storage is not initialised");
            } else {
                path = BlobStorageService.sanitisePath(path);

                this._databaseService.getAll<DatabaseFileBlob>(BlobStorageService._STORE_NAME, "path", path)
                    .then((blobs) => {
                        let files: string[] = [];
                        if (blobs) {
                            for (let i = 0; i < blobs.length; i++) {
                                files.push(blobs[i].file);
                            }
                        }
                        resolve(files);
                    })
                    .catch(() => {
                        reject("Unable to list files from blob storage");
                    });
            }
        });
    }
}
