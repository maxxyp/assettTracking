import { inject } from "aurelia-dependency-injection";
import { IDatabaseService } from "../../../../../common/storage/IDatabaseService";
import { IndexedDatabaseService } from "../../../../../common/storage/indexedDatabaseService";
import { DialogService } from "aurelia-dialog";
import { ILabelService } from "../../../../business/services/interfaces/ILabelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { LabelService } from "../../../../business/services/labelService";
import { computedFrom, observable } from "aurelia-binding";
import { ReferenceDataManifest } from "../../../../business/models/reference/referenceDataManifest";
import { ReferenceDataConstants } from "../../../../business/services/constants/referenceDataConstants";
import { ArrayHelper } from "../../../../../common/core/arrayHelper";
import { BaseInformation } from "./baseInformation";

const REFERENCE_DATA_MANIFEST = new ReferenceDataManifest();
const REF_DATABASE = ReferenceDataConstants.REFERENCE_DATABASE;

@inject(LabelService, EventAggregator, DialogService, IndexedDatabaseService)
export class CatalogQuery extends BaseInformation {
    public catalogs: { code: string, description: string } [];
    public indexNames: { code: string, description: string } [];

    public indexValue: string;
    public queryResult: string;
    public itemsFound: number;
    public showQuery: boolean;

    @observable
    public selectedCatalog: string;

    @observable
    public selectedIndexName: string;

    private _indexDatabaseService: IDatabaseService;

    constructor(labelService: ILabelService, eventAggregator: EventAggregator, dialogService: DialogService, indexDatabaseService: IDatabaseService) {
        super(labelService, eventAggregator, dialogService);

        const catalogTables = ArrayHelper.sortByColumn(REFERENCE_DATA_MANIFEST.all(), "type") || [];

        this.catalogs = catalogTables.map(ct => {
            const {type: code} = ct;
            return {code, description: code};
        });
        this.isExpanded = false;
        this.indexNames = [];
        this._indexDatabaseService = indexDatabaseService;
        this.indexValue = "";
        this.queryResult = "";
        this.showQuery = false;
        this.itemsFound = 0;
    }

    public async activateAsync(): Promise<any> {
        return Promise.resolve();
    }

    @computedFrom("indexNames")
    public get noIndexes(): boolean {
        return !this.indexNames || this.indexNames.length === 0;
    }

    public async selectedCatalogChanged(): Promise<void> {

        if (!this.selectedCatalog || this.selectedCatalog === "") {
            this.indexNames = [];
            return Promise.resolve();
        }

        this.itemsFound = 0;
        this.queryResult = "";
        this.indexValue = "";

        const indexes = this._indexDatabaseService.getIndexes(REF_DATABASE, this.selectedCatalog);

        if (!indexes || indexes.length === 0) {
            this.indexNames = undefined;
            this.selectedIndexName = undefined;
        }

        const {length} = indexes;

        let items = [];

        for (let i = 0; i < length; i++) {
            items.push(indexes[i]);
        }

        this.indexNames = items.map(i => {
            return {code: i, description: i};
        });

        this.selectedIndexName = undefined;
    }

    public clear(): void {
        this.indexValue = undefined;
        this.queryResult = undefined;
        this.showQuery = false;
        this.itemsFound = 0;
        this.selectedCatalog = undefined;
        this.selectedIndexName = undefined;
        this.indexNames = [];
    }

    public async queryIndex(): Promise<void> {

        this.queryResult = "";
        this.itemsFound = 0;

        this.showQuery = false;

        let indexValues: string [] | string;
        indexValues = undefined;

        let itemsFound = [];

        if (!this.indexValue) {
            itemsFound = await  this._indexDatabaseService.getAll(REF_DATABASE, this.selectedCatalog);
        } else if (this.indexValue.indexOf(",", 0) > -1) {
            indexValues = this.indexValue.split(",");
            itemsFound = await this._indexDatabaseService.getAll(REF_DATABASE, this.selectedCatalog, this.selectedIndexName, indexValues);
        } else {
            indexValues = this.indexValue;
            const singleItem = await this._indexDatabaseService.getAll(REF_DATABASE, this.selectedCatalog, this.selectedIndexName, indexValues);
            itemsFound.push(singleItem);
        }

        this.itemsFound = itemsFound.length;
        this.queryResult = JSON.stringify(itemsFound, undefined, 2);
        this.showQuery = true;
    }

}
