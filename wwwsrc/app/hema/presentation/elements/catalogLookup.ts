import {inject, bindable} from "aurelia-framework";
import {CatalogService} from "../../business/services/catalogService";
import {ICatalogService} from "../../business/services/interfaces/ICatalogService";

@inject(CatalogService)
export class CatalogLookup {
    @bindable public catalog: string;
    @bindable public keyField: string;
    @bindable public descriptionField: string;
    @bindable public splitIndex: number;
    @bindable public value: string;

    public display: string;

    private _catalogService: ICatalogService;

    constructor(catalogService: ICatalogService) {
        this._catalogService = catalogService;
    }

    public catalogChanged(): void {
        this.updateDisplay();
    }

    public keyFieldChanged(): void {
        this.updateDisplay();
    }

    public descriptionFieldChanged(): void {
        this.updateDisplay();
    }

    public valueChanged(): void {
        this.updateDisplay();
    }

    public splitIndexChanged(): void {
        this.updateDisplay();
    }

    public updateDisplay(): void {
        this.display = this.value;

        if (this.catalog && this.keyField && this.descriptionField && this.value) {
            let keyFields: string[];
            let values: string[];
            if (this.keyField.indexOf("|") > 0) {
                keyFields = this.keyField.split("|");
            } else {
                keyFields = [this.keyField];
            }
            if (this.value.indexOf("|") > 0) {
                values = this.value.split("|");
            } else {
                values = [this.value];
            }
            this._catalogService.getItemDescription(this.catalog, keyFields, values, this.descriptionField)
                .then(description => {
                   if (description) {
                       if (this.splitIndex !== undefined) {
                           // this is the extra long hyphen
                           let splitParts: string[] = description.split("–");
                           if (splitParts.length === 1) {
                               // regular hyphen
                               splitParts = description.split("–");
                           }

                           if (splitParts.length > this.splitIndex) {
                               this.display = splitParts[this.splitIndex].trim();
                           } else {
                               this.display = description;
                           }

                       } else {
                           this.display = description;
                       }
                   }
                })
                .catch(() => {});
        }
    }
}
