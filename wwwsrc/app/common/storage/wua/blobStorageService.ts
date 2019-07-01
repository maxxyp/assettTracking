/// <reference path="../../../../typings/app.d.ts" />

import {LocalStorageService} from "./localStorageService";
import {IBlobStorageService} from "../IBlobStorageService";

export class BlobStorageService extends LocalStorageService implements IBlobStorageService {
    constructor() {
        super(Windows.Storage.ApplicationData.current.localFolder);
    }
}
