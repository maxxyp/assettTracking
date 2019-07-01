/// <reference path="../../../../typings/app.d.ts" />

import * as ScenarioStoreWeb from "../web/scenarioStore";
import {IAssetService} from "../../core/services/IAssetService";
import {AssetService} from "../../core/services/assetService";
import {inject} from "aurelia-dependency-injection";

@inject(AssetService)
export class ScenarioStore extends ScenarioStoreWeb.ScenarioStore {
    constructor(assetService: IAssetService) {
        super(assetService);
    }
}
