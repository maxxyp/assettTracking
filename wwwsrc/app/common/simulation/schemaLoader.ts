import {inject} from "aurelia-framework";
import {ISchemaLoader} from "./ISchemaLoader";
import * as tv4 from "tv4";
import {AssetService} from "../core/services/assetService";
import {IAssetService} from "../core/services/IAssetService";

@inject(AssetService)
export class SchemaLoader implements ISchemaLoader {

    private _loaded: boolean;
    private _assetService: IAssetService;

    constructor(assetService: IAssetService) {
        this._loaded = false;
        this._assetService = assetService;
    }

    public getSchema(name: string): Promise<tv4.JsonSchema> {
        if (this._loaded) {
            return Promise.resolve(tv4.getSchema(name));
        }
        return this.loadAllSchemas().then(() => {
            return tv4.getSchema(name);
        });
    }

    private loadAllSchemas(): Promise<void> {
        return this._assetService.loadJson<string[]>("schemas/schemaList.json")
            .then((preload) => {
                return Promise.all(preload.map((schemaName) => {
                    return this._assetService.loadJson<any>("schemas/" + schemaName);
                }));
            })
            .then(schemas => {
                schemas.forEach((schema: any) => {
                    /* if a schema was invalid json the loadJson will return null, so don't add it to tv4 */
                    if (schema) {
                        tv4.addSchema(schema);
                    }
                });
                this._loaded = true;
            });
    }
}
