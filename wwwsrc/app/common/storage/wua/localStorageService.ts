/// <reference path="../../../../typings/app.d.ts" />

export class LocalStorageService {
    private _rootStorageFolder: Windows.Storage.StorageFolder;
    private _rootFolder: string;

    constructor(rootStorageFolder: Windows.Storage.StorageFolder) {
        this._rootStorageFolder = rootStorageFolder;
    }

    public checkInitised(storageName: string): Promise<void> {
        return Promise.resolve();
    }    

    public initialise(storageName: string, removeExisting: boolean): Promise<void> {
        this._rootFolder = storageName;

        return new Promise<void>((resolve) => {
            if (removeExisting) {
                this._rootStorageFolder.getFolderAsync(this._rootFolder).then(
                    (folder) => {
                        folder.deleteAsync().then(
                            () => {
                                resolve();
                            },
                            () => {
                                resolve();
                            }
                        );
                    },
                    (err) => {
                        resolve(err);
                    }
                );
            } else {
                resolve();
            }
        });
    }

    public closedown(): Promise<void> {
        return new Promise<void>((resolve) => {
            resolve();
        });
    }

    public write<T>(path: string, file: string, blob: T): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            path = this.sanitisePath(path);

            this._rootStorageFolder.createFolderAsync(path, Windows.Storage.CreationCollisionOption.openIfExists).then(
                (folder) => {
                    folder.createFileAsync(file, Windows.Storage.CreationCollisionOption.replaceExisting).then(
                        (fileInFolder) => {
                            let memoryStream = new Windows.Storage.Streams.InMemoryRandomAccessStream();
                            let dataWriter = new Windows.Storage.Streams.DataWriter(memoryStream);
                            dataWriter.writeString(JSON.stringify(blob));
                            let buffer = dataWriter.detachBuffer();
                            dataWriter.close();

                            Windows.Storage.FileIO.writeBufferAsync(fileInFolder, buffer).then(
                                () => {
                                    resolve();
                                },
                                (error) => {
                                    reject(error);
                                }
                            );
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    public read<T>(path: string, file: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            path = this.sanitisePath(path);

            this._rootStorageFolder.getFileAsync(path + file).then(
                (fileInFolder) => {
                    Windows.Storage.FileIO.readBufferAsync(fileInFolder).then(
                        (buffer) => {
                            let dataReader = Windows.Storage.Streams.DataReader.fromBuffer(buffer);
                            resolve(JSON.parse(dataReader.readString(buffer.length)));
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    public exists(path: string, file: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            path = this.sanitisePath(path);

            this._rootStorageFolder.getFileAsync(path + file).then(
                () => {
                    resolve(true);
                },
                () => {
                    resolve(false);
                }
            );
        });
    }

    public size(path: string, file: string): Promise<number> {
        return new Promise<number>((resolve) => {
            path = this.sanitisePath(path);

            this._rootStorageFolder.getFileAsync(path + file).then(
                (storageFile) => {
                    storageFile.getBasicPropertiesAsync().then(
                        (props) => {
                            resolve(props.size);
                        },
                        () => {
                            resolve(-1);
                        }
                    );
                },
                () => {
                    resolve(-1);
                }
            );
        });
    }

    public remove(path: string, file: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            path = this.sanitisePath(path);

            this._rootStorageFolder.getFileAsync(file).then(
                (fileInFolder) => {
                    fileInFolder.deleteAsync().then(
                        () => {
                            resolve();
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    public list(path: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            path = this.sanitisePath(path);

            this._rootStorageFolder.getFolderAsync(path).then(
                (folder) => {
                    folder.getFilesAsync().then(
                        (filesInFolder) => {
                            let files: string[] = [];
                            filesInFolder.forEach((file) => {
                                files.push(file.name);
                            });
                            resolve(files);
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    private sanitisePath(path: string): string {
        if (path) {
            path = path.replace(/\//g, "\\");
            if (path[0] === "\\") {
                path = path.substr(1);
            }
            if (path[path.length - 1] !== "\\") {
                path = path + "\\";
            }
        }

        return this._rootFolder + "\\" + path;
    }
}
