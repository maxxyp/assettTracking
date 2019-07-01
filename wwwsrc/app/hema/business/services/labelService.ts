/// <reference path="../../../../typings/app.d.ts" />
import * as Logging from "aurelia-logging";
import {ILabelService} from "./interfaces/ILabelService";
import {inject} from "aurelia-framework";
import {CatalogService} from "./catalogService";
import {ICatalogService} from "./interfaces/ICatalogService";
import {BusinessException} from "../models/businessException";
import {ConfigurationService} from "../../../common/core/services/configurationService";
import {IConfigurationService} from "../../../common/core/services/IConfigurationService";
import {ILabel} from "../models/reference/ILabel";

@inject(CatalogService, ConfigurationService)
export class LabelService implements ILabelService {
    private _catalogService: ICatalogService;
    private _common: { [key: string]: string};
    private _logger: Logging.Logger;

    constructor(catalogService: ICatalogService, configurationService: IConfigurationService) {
        this._catalogService = catalogService;
        this._logger = Logging.getLogger("LabelService");
    }

    public getGroup(groupKey: string): Promise<{ [key: string]: string}> {
        return this.loadCommon().then(() => {
            return this.loadGroup(groupKey).then((group) => {
                return Object.assign({}, this._common, group);
            });
        });
    }

    public getGroupWithoutCommon(groupKey: string): Promise<{ [key: string]: string}> {
        return this.loadGroup(groupKey);
    }

    private loadGroup(groupKey: string): Promise<{ [key: string]: string}> {
        return this._catalogService.getLabels(groupKey)
            .then((data: ILabel[]) => {
                let labels: {[key: string]: string} = {};
                if (data) {
                    data.forEach(l => {
                        labels[l.id] = l.label;
                    });
                }
                return labels;
            })
            .catch((exc) => {
                let exception = new BusinessException(this, "getGroup", "Getting group for key '{0}'", [groupKey], exc);
                this._logger.error(exception.toString());
                throw(exception);
            });
    }

    private loadCommon(): Promise<{ [key: string]: string}> {
        return this._common ? Promise.resolve(this._common) :
            this.loadGroup("common")
                .then((common) => {
                    this._common = common;
                    return this._common;
                });
    }
}
