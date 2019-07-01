/// <reference path="../../../../../typings/app.d.ts" />
import {History} from "aurelia-history";
import {FrameworkConfiguration} from "aurelia-framework";
import {HistoryWua} from "./historyWua";

export function configure(config: FrameworkConfiguration): void {
    config.singleton(History, HistoryWua);
}
