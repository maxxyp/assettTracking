import * as Logging from "aurelia-logging";
import * as moment from "moment";
import { inject } from "aurelia-framework";
import { IReferenceDataService } from "./interfaces/IReferenceDataService";
import { IndexedDatabaseService } from "../../../common/storage/indexedDatabaseService";
import { FftService } from "../../api/services/fftService";
import { IDatabaseService } from "../../../common/storage/IDatabaseService";
import { IFFTService } from "../../api/services/interfaces/IFFTService";
import { DatabaseSchema } from "../../../common/storage/models/databaseSchema";
import { DatabaseSchemaStore } from "../../../common/storage/models/databaseSchemaStore";
import { DatabaseSchemaStoreIndex } from "../../../common/storage/models/databaseSchemaStoreIndex";
import { ReferenceDataConstants } from "./constants/referenceDataConstants";
import { IReferenceIndex } from "../../api/models/fft/reference/IReferenceIndex";
import { BusinessException } from "../models/businessException";
import { EventAggregator } from "aurelia-event-aggregator";
import { InitialisationEventConstants } from "../constants/initialisationEventConstants";
import { InitialisationCategory } from "../models/initialisationCategory";
import { IAssetService } from "../../../common/core/services/IAssetService";
import { AssetService } from "../../../common/core/services/assetService";
import { InitialisationUpdate } from "../models/initialisationUpdate";
import { ReferenceIndex } from "../models/reference/referenceIndex";
import { ArrayHelper } from "../../../common/core/arrayHelper";
import { ReferenceVersion } from "../models/reference/referenceVersion";
import { ReferenceDataManifest } from "../models/reference/referenceDataManifest";
import { IListObject } from "../../api/models/fft/reference/IListObject";
import { StorageService } from "./storageService";
import { IStorageService } from "./interfaces/IStorageService";
import { IConfigurationService } from "../../../common/core/services/IConfigurationService";
import { IReferenceDataConfiguration } from "./interfaces/IReferenceDataConfiguration";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { ConfigurationService } from "../../../common/core/services/configurationService";
import { DateHelper } from "../../core/dateHelper";
import { IReferenceDataGroup } from "../../api/models/fft/reference/IReferenceDataGroup";
import { IReferenceMeta } from "../../api/models/fft/reference/IReferenceMeta";
import { IReferenceDataUpdateRequest } from "../../api/models/fft/engineers/IReferenceDataUpdateRequest";
import { IReferenceDataCatalogConfig } from "../../api/models/fft/engineers/IReferenceDataCatalogConfig";
import { IReferenceDataCatalogConfigItem } from "../../api/models/fft/reference/IReferenceDataCatalogConfigItem";
import { IUpdatePattern } from "../models/reference/IUpdatePattern";
import { AnalyticsExceptionModel } from "../../../common/analytics/analyticsExceptionModel";
import { AnalyticsExceptionCodeConstants } from "../../../common/analytics/analyticsExceptionCodeConstants";
import { ITableIndex } from "../models/reference/ITableIndex";

@inject(IndexedDatabaseService, AssetService, FftService, EventAggregator, StorageService, ConfigurationService, ReferenceDataManifest)
export class ReferenceDataService implements IReferenceDataService {
    private _databaseService: IDatabaseService;
    private _fftService: IFFTService;
    private _assetService: IAssetService;
    private _storageService: IStorageService;
    private _eventAggregator: EventAggregator;
    private _logger: Logging.Logger;
    private _referenceVersions: ReferenceVersion[];
    private _remoteIndexWhenLastChecked: IReferenceIndex[];
    private _referenceDataStaleMinutes: number;
    private _targetReferenceDataTypes: string[];
    private _doesRefDataNeedsARetry: boolean;
    private _referenceDataManifest: ReferenceDataManifest;

    constructor(databaseService: IDatabaseService,
        assetService: IAssetService,
        fftService: IFFTService,
        eventAggregator: EventAggregator,
        storageService: IStorageService,
        configurationService: IConfigurationService,
        referenceDataManifest: ReferenceDataManifest) {
        this._databaseService = databaseService;
        this._fftService = fftService;
        this._assetService = assetService;
        this._eventAggregator = eventAggregator;
        this._storageService = storageService;
        this._referenceDataManifest = referenceDataManifest;
        this._referenceVersions = [];
        this._logger = Logging.getLogger("ReferenceDataService");

        this._referenceDataStaleMinutes = 1440;
        let referenceDataConfiguration = configurationService.getConfiguration<IReferenceDataConfiguration>();
        if (referenceDataConfiguration) {
            this._referenceDataStaleMinutes = referenceDataConfiguration.referenceDataStaleMinutes || this._referenceDataStaleMinutes;
            this._targetReferenceDataTypes = referenceDataConfiguration.targetReferenceDataTypes;
        }
        this._doesRefDataNeedsARetry = false;
    }

    public initialise(): Promise<void> {
        this.notifyProgress(new InitialisationCategory("Initialising Database", "", -1, -1));

        return this.initDatabase()
            .then(() => {
                let indexKeys: { [key: string]: string[] } = {};
                let localTableIndex = this._referenceDataManifest.all() || [];

                this.notifyProgress(new InitialisationCategory("Loading Local Reference Data Index", "", -1, -1));

                localTableIndex.forEach(ti => {
                    indexKeys[ti.type] = ti.indexes ? ti.indexes.split(",") : [];
                });

                this.notifyProgress(new InitialisationCategory("Loading Remote Reference Data Index", "", -1, -1));

                return this.getRemoteIndex()
                    .then((remoteIndex) => {
                        return this.populateRemoteData(remoteIndex || [], indexKeys, localTableIndex)
                            .then((remoteCatalog) => {
                                let existingTables: string[] = [];

                                /* create a list of all the tables we have already populated from the remote data */
                                remoteCatalog.forEach(rc => {
                                    existingTables = existingTables.concat((rc.tables || "").split(","));
                                });

                                /* create an updated list of the local tables with the exising ones we got from remote removed */
                                let updateIndex: IReferenceIndex[] = [];
                                localTableIndex.forEach(ti => {
                                    if (existingTables.indexOf(ti.type) < 0) {

                                        updateIndex.push({
                                            type: ti.type,
                                            eTag: ti.eTag,
                                            lastModifiedDate: ti.lastModifiedDate
                                        });
                                    }
                                });

                                return this.populateLocalData(updateIndex, existingTables, indexKeys, localTableIndex)
                                    .then(() => {
                                        this._referenceVersions = ArrayHelper.sortByColumn(this._referenceVersions, "table");
                                        this._remoteIndexWhenLastChecked = remoteIndex;
                                        return this.setLastRemoteIndexCheckTime();
                                    });
                            });
                    });
            })
            .catch((err) => {
                /* failed loading reference data see if we have non stale version we can use */
                return this.isReferenceDataOutOfDate()
                    .then((isReferenceDataOutOfDate) => {
                        if (isReferenceDataOutOfDate) {
                            throw err;
                        }
                        // otherwise we can still function with the reference data we have
                    })
                    .catch(() => {
                        let exception = new BusinessException(this, "initialise", `Cannot currently retrieve Reference Data from the server
                                            and you do not have a recent enough copy that could be used.`, [], err);
                        throw exception;
                    });
            });
    }

    public async shouldUserRefreshReferenceData(): Promise<boolean> {
        if (!await this._storageService.getLastSuccessfulSyncTime()) {
            return true;
        }

        if (!await this.isReferenceDataOutOfDate()) {
            return false;
        }
        try {
            let isThereNewReferenceDataOnServer = !ObjectHelper.isComparable(await this.getRemoteIndex(), this._remoteIndexWhenLastChecked);
            await this.setLastRemoteIndexCheckTime();
            return isThereNewReferenceDataOnServer;
        } catch (e) {
            return false;
        }
    }

    public getItems<T>(storeName: string, indexName: string, indexValue: any): Promise<T[]> {
        let indexValues: any = indexValue;
        indexName = indexName || "";

        return this._databaseService.getAll<T>(ReferenceDataConstants.REFERENCE_DATABASE, storeName, indexName, indexValues)
            .catch((err) => {
                let exception = new BusinessException(this, "getItems", "reference data with keys {0} from store '{1}' was not found", [indexValues, storeName], err);
                const analyticsModel = new AnalyticsExceptionModel(AnalyticsExceptionCodeConstants.REFERENCE_DATA_SERVICE, false,
                    exception.reference, exception.message, exception.parameters);
                this._logger.error(exception && exception.toString(), analyticsModel);
                throw exception;
            });
    }

    public getItem<T>(storeName: string, indexName: string, indexValue: any): Promise<T> {
        return this._databaseService.get<T>(ReferenceDataConstants.REFERENCE_DATABASE, storeName, indexName, indexValue)
            .catch((err) => {
                let exception = new BusinessException(this, "getItem", "reference data with key '{0}' from store '{1}' was not found", [indexValue, storeName], err);
                const analyticsModel = new AnalyticsExceptionModel(AnalyticsExceptionCodeConstants.REFERENCE_DATA_SERVICE, false,
                    exception.reference, exception.message, exception.parameters);
                this._logger.error(exception && exception.toString(), analyticsModel);
                throw exception;
            });
    }

    public async clear(): Promise<void> {
        try {
            await this._databaseService.close(ReferenceDataConstants.REFERENCE_DATABASE);
        } catch (error) {
            // if the db is not open then .close() throws
        }
        await this._databaseService.destroy(ReferenceDataConstants.REFERENCE_DATABASE);
    }

    /** clean remote index due to API limitation: .json only and take latest last modified date */
    public generateCleanRemoteIndex(listObjects: IListObject[]): IReferenceIndex[] {
        return listObjects
            .filter(x => x.documentName.indexOf(".json") > -1)
            .sort((a, b) => moment(a.lastModifiedDate).diff(moment(b.lastModifiedDate)))
            .reverse()
            .reduce((catalogs: IListObject[], currentCatalog): IListObject[] => {
                // take first unique catalog, it's will be the newest due to the sort
                let uniqueCatalogFound = !catalogs.find(x => x.documentName === currentCatalog.documentName);
                if (uniqueCatalogFound) {
                    catalogs.push(currentCatalog);
                }
                return catalogs;
            }, [])
            // convert API model to Business model
            .map((listObject: IListObject): IReferenceIndex => {
                return {
                    type: listObject.documentName.replace(/\.[^/.]+$/, "").toLowerCase(),
                    eTag: listObject.etag,
                    lastModifiedDate: listObject.lastModifiedDate
                };
            });
    }

    public getVersions(): ReferenceVersion[] {
        return this._referenceVersions;
    }

    private async isReferenceDataOutOfDate(): Promise<boolean> {
        let storedIndex = await this.getLocalIndex();
        if (!storedIndex || !storedIndex.length) {
            // we don't have anything at all
            return true;
        }
        let lastSuccessfulSyncTime = await this._storageService.getLastSuccessfulSyncTime();
        let nowMs = DateHelper.getTimestampMs();
        let timeWhenARefreshWouldBeRequiredMs = (lastSuccessfulSyncTime || 0) + (this._referenceDataStaleMinutes * 60 * 1000);

        return nowMs >= timeWhenARefreshWouldBeRequiredMs;
    }

    private setLastRemoteIndexCheckTime(): Promise<void> {
        if (this._doesRefDataNeedsARetry) {
            return this._storageService.setLastSuccessfulSyncTime(undefined);
        }
        return this._storageService.setLastSuccessfulSyncTime(DateHelper.getTimestampMs());
    }

    private async getRemoteIndex(): Promise<IReferenceIndex[]> {
        let indexes = await this._fftService.getRemoteReferenceDataIndex();
        let referenceIndexes = this.generateCleanRemoteIndex(indexes);
        return this.getTargetReferenceDocuments(referenceIndexes);
    }

    private getTargetReferenceDocuments(indexList: IReferenceIndex[]): IReferenceIndex[] {
        let isATargetDocument = (type: string) => this._targetReferenceDataTypes && this._targetReferenceDataTypes
            .some(expectedDocument => type === expectedDocument);

        return indexList.filter(documentIndex => isATargetDocument(documentIndex.type));
    }

    private initDatabase(): Promise<void> {
        this.notifyProgress(new InitialisationCategory("Creating Reference Database", "", -1, -1));

        return this._databaseService.exists(ReferenceDataConstants.REFERENCE_DATABASE, ReferenceDataConstants.REFERENCE_DATABASE)
            .then((exists) => {
                if (exists) {
                    return this._databaseService.open(ReferenceDataConstants.REFERENCE_DATABASE);
                } else {
                    return this._databaseService.create(
                        new DatabaseSchema(ReferenceDataConstants.REFERENCE_DATABASE,
                            ReferenceDataConstants.REFERENCE_DATABASE_VERSION,
                            [
                                new DatabaseSchemaStore(ReferenceDataConstants.REMOTE_REFERENCE_INDEX, "container", false, [new DatabaseSchemaStoreIndex("container", "container", true)]),
                                new DatabaseSchemaStore(ReferenceDataConstants.LOCAL_REFERENCE_INDEX, "container", false, [new DatabaseSchemaStoreIndex("container", "container", true)])
                            ]));
                }
            });
    }

    /* tslint:disable:promise-must-complete*/
    private populateRemoteData(newIndex: IReferenceIndex[], indexKeys: { [key: string]: string[] }, localTableIndex: ITableIndex[]): Promise<ReferenceIndex[]> {
        return new Promise<ReferenceIndex[]>((resolve, reject) => {
            this.getLocalIndex()
                .then((storedIndex: ReferenceIndex[]) => {
                    let updatePattern = this.calculateUpdatePattern(storedIndex, newIndex);
                    this.notifyProgress(new InitialisationCategory("Updating From Remote Data", "", 0, updatePattern.length));

                    this._logger.info("Stored Remote Index", storedIndex);
                    this._logger.info("New Remote Index", newIndex);

                    let idx = 0;
                    let remoteReferenceDataIndex: ReferenceIndex[] = []; // the etag and grouping of remote ref data tables
                    let docVersionUpdateList: IReferenceDataCatalogConfigItem[] = [];
                    let needToMakeAnUpdateCall = 0;

                    let document: string;
                    let majorVersion: number;
                    let minorVersion: number;
                    let catSequence: number;
                    let eTag: string;
                    let tablesList: string;

                    let doNext = () => {
                        if (idx < updatePattern.length) {
                            this.notifyProgress(new InitialisationUpdate("Downloading Remote Data '" + updatePattern[idx].type + "'", idx));

                            // default values, if api call fails, will need default settings currently in indexdb

                            document = updatePattern[idx].type;
                            majorVersion = updatePattern[idx].majorVersion;
                            minorVersion = updatePattern[idx].minorVersion;
                            catSequence = updatePattern[idx].sequence;
                            tablesList = updatePattern[idx].tables;

                            // get catalog from api
                            this.populateRemoteCatalogReferenceData(updatePattern[idx].type,
                                updatePattern[idx].retrieveData,
                                updatePattern[idx].deleteCatalog,
                                updatePattern[idx].tables.split(","),
                                indexKeys,
                                updatePattern[idx].eTag,
                                localTableIndex)
                                .then((refDataResponse) => {

                                    if (!updatePattern[idx].deleteCatalog) {
                                        eTag = refDataResponse.etag;
                                        tablesList = refDataResponse.tables.join(",");

                                        // updates the list of tables in the "remoteReferenceIndex" for a group

                                        if (refDataResponse.meta && updatePattern[idx].retrieveData) {
                                            const { currentMajorVersion = null, currentMinorVersion = null, sequence: refSequence = null } = refDataResponse.meta;
                                            majorVersion = currentMajorVersion;
                                            minorVersion = currentMinorVersion;
                                            catSequence = refSequence;
                                        }

                                        // updates the list of tables in the "remoteReferenceIndex" for a group

                                        refDataResponse.tables.forEach(table => {
                                            this._referenceVersions.push({
                                                table: table,
                                                version: updatePattern[idx].eTag,
                                                majorVersion: majorVersion,
                                                minorVersion: minorVersion,
                                                sequence: catSequence,
                                                isLocal: localTableIndex.find(t => t.type === table).sourceDocument === "local" || false,
                                                lastAttemptFailed: false,
                                                lastModifiedDate: updatePattern[idx].lastModifiedDate,
                                                source: localTableIndex.find(t => t.type === table).sourceDocument || undefined,
                                            });
                                        });
                                    }
                                })
                                .catch(err => {
                                    const errorText = "failed to get catalog data";
                                    const analyticsModel = new AnalyticsExceptionModel(AnalyticsExceptionCodeConstants.REFERENCE_DATA_SERVICE, true, errorText);
                                    this._logger.error(errorText, err, analyticsModel);
                                    eTag = undefined;
                                    return this._storageService.getLastSuccessfulSyncTime()
                                        .then((lastSyncTime) => {
                                        if (!lastSyncTime && (localTableIndex.filter(ti => ti.sourceDocument === updatePattern[idx].type) || []).every(t => !t.canItBeEmpty)) {
                                            this._doesRefDataNeedsARetry = true;
                                        }     
                                        
                                        if (tablesList && tablesList.length > 0) {
                                            tablesList.split(",").forEach(table => {
                                                this._referenceVersions.push({
                                                    table,
                                                    version: updatePattern[idx].eTag,
                                                    majorVersion,
                                                    minorVersion,
                                                    sequence: catSequence,
                                                    isLocal: localTableIndex.find(t => t.type === table).sourceDocument === "local" || false,
                                                    lastAttemptFailed: true,
                                                    lastModifiedDate: updatePattern[idx].lastModifiedDate,
                                                    source: localTableIndex.find(t => t.type === table).sourceDocument || undefined,
                                                });
                                            });
                                        }  
                                    });                                                                      
                                })
                                .then(() => {

                                    let catalogIndex: ReferenceIndex = new ReferenceIndex();

                                    // new versions from remote api endpoint, these are required for put calls
                                    // in final block

                                    catalogIndex.container = document;
                                    catalogIndex.eTag = eTag;
                                    catalogIndex.tables = tablesList;
                                    catalogIndex.majorVersion = majorVersion;
                                    catalogIndex.minorVersion = minorVersion;
                                    catalogIndex.sequence = catSequence;

                                    remoteReferenceDataIndex.push(catalogIndex);

                                    needToMakeAnUpdateCall += updatePattern[idx].retrieveData ? 1 : 0;

                                    docVersionUpdateList.push({
                                        documentName: `${document}.json`,
                                        majorVersion: majorVersion ? majorVersion.toString() : "",
                                        minorVersion: minorVersion ? minorVersion.toString() : "",
                                        sequenceNumber: catSequence ? catSequence.toString() : ""
                                    });

                                    idx++;
                                    doNext();
                                });
                        } else {
                            this.notifyProgress(new InitialisationCategory("Remote From Data Update Complete", "", -1, -1));
                            this.populateTable(remoteReferenceDataIndex, ReferenceDataConstants.REMOTE_REFERENCE_INDEX)
                                .then(() => needToMakeAnUpdateCall > 0 ? this.updateRefDataVersion(docVersionUpdateList) : Promise.resolve())
                                .then(() => resolve(remoteReferenceDataIndex))
                                .catch((err) => {
                                    reject(err);
                                });
                        }
                    };
                    doNext();
                });
        });

    }

    private getLocalIndex(): Promise<ReferenceIndex[]> {
        return this._databaseService.getAll<ReferenceIndex>(ReferenceDataConstants.REFERENCE_DATABASE, ReferenceDataConstants.REMOTE_REFERENCE_INDEX);
    }

    private updateRefDataVersion(list: IReferenceDataCatalogConfigItem[]): Promise<void> {

        if (!list || list.length === 0) {
            return Promise.resolve();
        }

        return this._storageService.getEngineer().then(engineer => {

            let request = <IReferenceDataUpdateRequest>{};
            let data = <IReferenceDataCatalogConfig>{};

            data.catalogueConfig = [{
                engineerId: engineer.id,
                list
            }];

            request.data = data;

            this._logger.info("Updating Reference Data Versions", list);

            return this._fftService.updateRemoteReferenceData(request).then(() =>
                this._logger.info("Updated Reference Data Versions")
            );
        });

    }

    private populateLocalData(newIndex: IReferenceIndex[], exemptFromDelete: string[], indexKeys: { [key: string]: string[] }, localTableIndex: ITableIndex[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._databaseService.getAll<ReferenceIndex>(ReferenceDataConstants.REFERENCE_DATABASE, ReferenceDataConstants.LOCAL_REFERENCE_INDEX)
                .then((storedIndex: ReferenceIndex[]) => {
                    let updatePattern = this.calculateUpdatePattern(storedIndex, newIndex);
                    this.notifyProgress(new InitialisationCategory("Updating From Local Data", "", 0, updatePattern.length));

                    this._logger.info("Stored Local Index", storedIndex);
                    this._logger.info("New Local Index", newIndex);

                    let idx = 0;
                    let finalIndex: ReferenceIndex[] = [];

                    let doNext = () => {
                        if (idx < updatePattern.length) {
                            let p: Promise<any[]>;

                            if (updatePattern[idx].retrieveData) {
                                this.notifyProgress(new InitialisationUpdate("Importing Local Data '" + updatePattern[idx].type + "'", idx));
                                p = this._assetService.loadJson<any[]>("services/reference/" + updatePattern[idx].type + ".json");
                            } else {
                                p = Promise.resolve(undefined);
                            }

                            p.then((jsonData) => {
                                this.populateTableReferenceData(updatePattern[idx].type, jsonData, updatePattern[idx].deleteCatalog, idx, exemptFromDelete, indexKeys[updatePattern[idx].type])
                                    .then(() => {
                                        if (!updatePattern[idx].deleteCatalog) {
                                            let catalogIndex: ReferenceIndex = new ReferenceIndex();
                                            catalogIndex.container = updatePattern[idx].type;
                                            catalogIndex.eTag = updatePattern[idx].eTag;
                                            catalogIndex.tables = updatePattern[idx].type;
                                            catalogIndex.majorVersion = updatePattern[idx].majorVersion;

                                            catalogIndex.minorVersion = updatePattern[idx].minorVersion;
                                            catalogIndex.sequence = updatePattern[idx].sequence;
                                            finalIndex.push(catalogIndex);

                                            this._referenceVersions.push({
                                                table: updatePattern[idx].type,
                                                version: updatePattern[idx].eTag,
                                                lastModifiedDate: updatePattern[idx].lastModifiedDate,
                                                isLocal: localTableIndex.find(t => t.type === updatePattern[idx].type).sourceDocument === "local" || false,
                                                source: localTableIndex.find(t => t.type === updatePattern[idx].type).sourceDocument
                                            });
                                        }

                                        idx++;
                                        doNext();
                                    })
                                    .catch((err) => {
                                        reject(err);
                                    });
                            });
                        } else {
                            this.notifyProgress(new InitialisationCategory("Local From Data Update Complete", "", -1, -1));
                            this.populateTable(finalIndex, ReferenceDataConstants.LOCAL_REFERENCE_INDEX)
                                .then(() => resolve())
                                .catch((err) => {
                                    reject(err);
                                });
                        }
                    };

                    doNext();
                });
        });
    }

    private calculateUpdatePattern(storedIndex: ReferenceIndex[], newIndex: IReferenceIndex[]): IUpdatePattern[] {

        let updatePattern: IUpdatePattern[] = [];

        if (storedIndex) {
            for (let i = 0; i < storedIndex.length; i++) {
                let remoteType = newIndex.find(x => x.type === storedIndex[i].container);
                if (remoteType) {

                    /* we found no etag - take the lastest (useful for development) */
                    /* we found the catalog in the new data, has it been updated */

                    if (remoteType.eTag === "-1" || storedIndex[i].eTag !== remoteType.eTag) {
                        /* yes so update data from remote */
                        updatePattern.push({
                            type: remoteType.type,
                            retrieveData: true,
                            deleteCatalog: false,
                            tables: storedIndex[i].tables,
                            eTag: remoteType.eTag,
                            majorVersion: storedIndex[i].majorVersion,
                            minorVersion: storedIndex[i].minorVersion,
                            sequence: storedIndex[i].sequence,
                            lastModifiedDate: remoteType.lastModifiedDate
                        });
                    } else {
                        /* no, so just keep data intact */
                        updatePattern.push({
                            type: remoteType.type,
                            retrieveData: false,
                            deleteCatalog: false,
                            tables: storedIndex[i].tables,
                            eTag: remoteType.eTag,
                            majorVersion: storedIndex[i].majorVersion, // * use remote type because new prop that will initially not be there
                            minorVersion: storedIndex[i].minorVersion, // * see above
                            sequence: storedIndex[i].sequence, // * see above
                            lastModifiedDate: remoteType.lastModifiedDate
                        });
                    }
                } else {
                    /* catalog was in the in stored index but not in new index, so delete */
                    updatePattern.push({
                        type: storedIndex[i].container,
                        retrieveData: false,
                        deleteCatalog: true,
                        tables: storedIndex[i].tables,
                        eTag: storedIndex[i].eTag,
                        majorVersion: null,
                        minorVersion: null,
                        sequence: null,
                        lastModifiedDate: ""
                    });
                }
            }

            /* now see if there are any new tables in the remote index that we don't have locally */
            for (let i = 0; i < newIndex.length; i++) {
                let stored = storedIndex.find(x => x.container === newIndex[i].type);

                if (!stored) {
                    updatePattern.push({
                        type: newIndex[i].type,
                        retrieveData: true,
                        deleteCatalog: false,
                        tables: "",
                        majorVersion: newIndex[i].currentMajorVersion,
                        minorVersion: newIndex[i].currentMinorVersion,
                        sequence: newIndex[i].sequence,
                        eTag: newIndex[i].eTag,
                        lastModifiedDate: newIndex[i].lastModifiedDate
                    });
                }
            }
        }

        return updatePattern;
    }

    private populateTable<T>(data: T[], tableName: string): Promise<void> {
        return this._databaseService.removeAll(ReferenceDataConstants.REFERENCE_DATABASE, tableName).then(() => {
            return this._databaseService.setAll<T>(ReferenceDataConstants.REFERENCE_DATABASE, tableName, data);
        });
    }

    private populateRemoteCatalogReferenceData(catalog: string, retrieveData: boolean, deleteCatalog: boolean,
        tables: string[], indexKeys: { [key: string]: string[] }, etag: string, localTableIndex: ITableIndex[]): Promise<{ meta: IReferenceMeta, tables: string[], etag: string }> {
        return new Promise<{ meta: IReferenceMeta, tables: string[], etag: string }>((resolve, reject) => {

            let hasTheResponseGotAllTheData = (data: any): boolean => {
                let tablesBelongToDoc: ITableIndex[] = localTableIndex.filter(ti => ti.sourceDocument === catalog);
                let res: boolean = true;
                tablesBelongToDoc.forEach(t => {
                    let table = data[t.type];
                    if (!t.canItBeEmpty && (!table || table.length === 0)) {
                        res = false;

                        // removing empty table from data object to let it to fall over to the local index
                        if (table) {
                            delete data[t.type];
                        }
                    }
                });
                return res;
            };

            let result: {
                tables: string[],
                meta: IReferenceMeta,
                etag: string
            } = { tables: [], meta: null, etag: etag };

            result.tables = tables;

            let idx = 0;
            let getReferenceDataGroup: Promise<IReferenceDataGroup>;

            if (retrieveData) {
                getReferenceDataGroup = this._fftService.getRemoteReferenceDataCatalog(catalog);
            } else {
                getReferenceDataGroup = Promise.resolve(undefined); // todo why can't we just exit early
            }

            getReferenceDataGroup.then((referenceDataGroup) => {
                if (!referenceDataGroup || !referenceDataGroup.meta || !referenceDataGroup.data) {
                    return resolve(result);
                }

                const { data, meta } = referenceDataGroup;              

                if (!hasTheResponseGotAllTheData(data)) {
                    result.etag = undefined;
                    this._doesRefDataNeedsARetry = true;
                }

                result.tables = Object.keys(data);
                result.meta = { ...meta };

                this._logger.info(catalog + " documents has got tables " + result.tables);

                const { tables: rTables } = result;

                let doNext = () => {
                    if (idx < rTables.length) {

                        let tableData: any[] = data[rTables[idx]];

                        const type = rTables[idx];

                        this.populateTableReferenceData(type, tableData, deleteCatalog, idx, [], indexKeys[type])
                            .then(() => {
                                idx++;
                                doNext();
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    } else {
                        resolve(result);
                    }
                };

                doNext();
            }).catch(err => {
                reject(err);
            });
        });
    }

    private populateTableReferenceData(type: string, data: any[], deleteCatalog: boolean, idx: number, exemptFromDelete: string[], indexKeys: string[]): Promise<void> {
        return this._databaseService.storeExists(ReferenceDataConstants.REFERENCE_DATABASE, type)
            .then((exists) => {
                if (deleteCatalog) {
                    if (exemptFromDelete.indexOf(type) === -1) {
                        this.notifyProgress(new InitialisationUpdate("Deleting Data '" + type + "'", idx));
                        if (exists) {
                            this._logger.info("Deleting " + type + " from database");
                            return this._databaseService.storeRemove(ReferenceDataConstants.REFERENCE_DATABASE, type);
                        } else {
                            this._logger.info("Deleting " + type);
                            return undefined;
                        }
                    } else {
                        this._logger.info("Defering " + type + " to remote data from database");
                        this.notifyProgress(new InitialisationUpdate("Defering To Remote Data '" + type + "'", idx));
                        return undefined;
                    }
                } else if (exists && data === undefined) {
                    this._logger.info("No Change " + type);
                    this.notifyProgress(new InitialisationUpdate("No Change In Data '" + type + "'", idx));
                    return undefined;
                } else {
                    const noOfRows = data ? data.length : 0;
                    if (exists) {
                        this._logger.info("Updating " + type + " table with " + noOfRows + " rows of data");
                        this.notifyProgress(new InitialisationUpdate("Updating Data '" + type + "'", idx));
                        return this.populateTable(data, type);
                    } else {
                        this._logger.info("Creating " + type + " table with " + noOfRows + " rows of data");
                        let indexes = indexKeys.map(ik => new DatabaseSchemaStoreIndex(ik, ik, false));

                        for (let i = 0; i < indexKeys.length; i++) {
                            for (let j = 0; j < indexKeys.length; j++) {
                                if (indexKeys[i] !== indexKeys[j]) {
                                    let combinedIndex = indexKeys[i] + "_" + indexKeys[j];
                                    indexes.push(new DatabaseSchemaStoreIndex(combinedIndex, [indexKeys[i], indexKeys[j]], false));
                                }
                            }
                        }

                        this.notifyProgress(new InitialisationUpdate("Creating Data '" + type + "'", idx));
                        return this._databaseService.storeCreate(ReferenceDataConstants.REFERENCE_DATABASE,
                            new DatabaseSchemaStore(
                                type,
                                undefined,
                                true,
                                indexes
                            ))
                            .then(() => this.populateTable(data, type));
                    }
                }
            });
    }

    private notifyProgress(payload: InitialisationUpdate | InitialisationCategory): void {
        let event = payload instanceof InitialisationUpdate ? InitialisationEventConstants.INITIALISE_UPDATE : InitialisationEventConstants.INITIALISE_CATEGORY;
        this._eventAggregator.publish(event, payload);
    }
}
