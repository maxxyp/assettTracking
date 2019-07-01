/// <reference path="../../../../../typings/app.d.ts" />

import {History} from "aurelia-history";

export interface ILinkHandler {
    activate(history: History): void;
    deactivate(): void;
}
