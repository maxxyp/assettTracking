/// <reference path="../../../../typings/app.d.ts" />
import { inject } from "aurelia-framework";
import { VanStockService as ApiVanStockService } from "../../api/services/vanStockService";
import { IVanStockService as IApiVanStockService } from "../../api/services/interfaces/IVanStockService";
import * as Logging from "aurelia-logging";
import { StorageService } from "./storageService";
import { IStorageService } from "./interfaces/IStorageService";
import { MaterialWithQuantities } from "../models/materialWithQuantities";
import { MaterialSearchResult } from "../models/materialSearchResult";
import { IVanStockEngine } from "./interfaces/IVanStockEngine";
import { Threading } from "../../../common/core/threading";
import { Material } from "../models/material";
import { MaterialAdjustments, MaterialAdjustment, MaterialAdjustmentsArrays, MaterialAdjustmentStatus } from "../models/materialAdjustments";
import { Guid } from "../../../common/core/guid";
import { IMaterialActions } from "../../api/models/vanStock/IMaterialActions";
import { BusinessException } from "../models/businessException";
import { MaterialRequest, MaterialRequestStatus } from "../models/materialRequest";
import { Materials } from "../models/materials";
import { MaterialSearchResults } from "../models/materialSearchResults";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { WuaNetworkDiagnosticsConstants } from "../../../common/core/constants/wuaNetworkDiagnosticsConstants";
import { VanStockConstants } from "./constants/vanStockConstants";
import { EngineerServiceConstants } from "./constants/engineerServiceConstants";

import { IConfigurationService } from "../../../common/core/services/IConfigurationService";
import { IVanStockConfiguration } from "./interfaces/IVanStockConfiguration";
import { ConfigurationService } from "../../../common/core/services/configurationService";
import { MaterialCollection } from "../models/materialCollection";
import { MaterialHighValueTools } from "../models/materialHighValueTools";
import { MaterialHighValueTool } from "../models/materialHighValueTool";
import * as moment from "moment";
import { MaterialToCollect } from "../models/materialToCollect";
import { MaterialSearchResultOnline } from "../models/materialSearchResultOnline";
import {MaterialWithReservationQuantity} from "../models/materialWithReservationQuantity";
import { VanStockStatus } from "../vanStockStatus";
import { IOnlineMaterialSearchResult } from "../../api/models/vanStock/IOnlineMaterialSearchResult";
import { PollingHelper } from "../../core/pollingHelper";
import { ITrainingModeConfiguration } from "./interfaces/ITrainingModeConfiguration";
import { InitialisationCategory } from "../models/initialisationCategory";
import { InitialisationEventConstants } from "../constants/initialisationEventConstants";

const ZONE_DUMMY_QUANTITY = 9999;
const DEFAULT_OWNER = "BGS";

@inject(ApiVanStockService, StorageService, EventAggregator, ConfigurationService)
export class VanStockEngine implements IVanStockEngine {
    private _vanStockService: IApiVanStockService;
    private _storageService: IStorageService;
    private _eventAggregator: EventAggregator;
    private _configurationService: IConfigurationService;
    private _logger: Logging.Logger;

    // we need to keep a cache of live search result objects so that user can reneter a screen and
    //  e.g. still get back a live reference to a search that is in progress that will eventaully be updated
    private _onlineSearchResultCache: MaterialSearchResults;

    private _bindableReadinessFlag: {
        isReady: boolean,
        isActionsEndpointOk: boolean
    };

    private _engineerId: string;
    private _pollingTimerId: number;
    private _networkChangeSubscription: Subscription;
    private _config: IVanStockConfiguration & ITrainingModeConfiguration;
    private _isSyncInProgress: boolean;

    constructor(vanStockService: IApiVanStockService,
        storageService: IStorageService,
        eventAggregator: EventAggregator,
        configurationService: IConfigurationService) {
        this._vanStockService = vanStockService;
        this._storageService = storageService;
        this._eventAggregator = eventAggregator;
        this._configurationService = configurationService;
        this._logger = Logging.getLogger("VanStockEngine");

        this._bindableReadinessFlag = {
            isReady: false,
            isActionsEndpointOk: false
        };
    }

    public async initialise(engineerId: string): Promise<void> {
        this._logger.warn("Initialising");
        this._config = this._configurationService.getConfiguration<IVanStockConfiguration & ITrainingModeConfiguration>();
        this._engineerId = this.convertEngineerId(engineerId);

        this._onlineSearchResultCache = this._storageService.getMaterialSearchResults()
            || new MaterialSearchResults(this._engineerId);

        // special case: if a search has been previously captured/serialized in SEARCHING state, it ain't ever going to complete as we are a completely
        //  restarted instance of the app
        this._onlineSearchResultCache.materialSearchResults = this._onlineSearchResultCache.materialSearchResults
            .filter(result => result.completionStatus !== "SEARCHING");

        this._eventAggregator.subscribe(EngineerServiceConstants.ENGINEER_SIGNED_ON_CHANGED, async (isSignedOn: boolean) => {
            // if the engineer has just signed off, lets do our best to let the backend know
            //  our http headers will let them know we are signed off
            if (!isSignedOn) {
                try {
                    await this._vanStockService.getEngineerActions(this._engineerId);
                } catch (error) {
                    // if we get a 404/500 then don't let this blow up, if it does we get a red error because it is not handled elsewhere
                }
            }
        });

        this.startSyncPolling();
        await this.syncWithServer((message) => this._eventAggregator.publish(InitialisationEventConstants.INITIALISE_CATEGORY, <InitialisationCategory>{
            category: "Initialising Van Stock",
            item: message,
            progressValue: -1,
            progressMax: -1
        }));
    }

    public getBindableVanStockStatusFlag(): VanStockStatus {
        // todo: we are exposing the boolean we use for internal purposes, what if the client mutates it!?
        return this._bindableReadinessFlag;
    }

    public startSyncPolling(): void {
        if (!this._pollingTimerId) {

            this._pollingTimerId = Threading.startTimer(
                () => this.syncWithServer(),
                (this._config.assetTrackingPollingIntervalMinutes || 5) * 60 * 1000
            );

        }

        // if we have not got fresh data because we did not have network connection when we initialised, let's listen for
        //  when the network comes back and we can immediately try again
        if (!this._networkChangeSubscription) {
            this._networkChangeSubscription = this._eventAggregator.subscribe(WuaNetworkDiagnosticsConstants.NETWORK_STATUS_CHANGED,
                (isNetworkConnected: boolean) => {
                    if (isNetworkConnected && !this._bindableReadinessFlag.isReady) {
                        this.syncWithServer();
                    }
                }
            );
        }
    }

    public async getHighValueToolList(): Promise<MaterialHighValueTool[]> {
        return this.getMaterialHighValueTools().highValueTools;
    }

    public getLocalMaterial(): MaterialWithQuantities[] {
        // some of the adjustments can have many entries per stockRefId (hence the filter and reduce rather than a straight find)
        // some are one-to-ones so a find would do, but lets just send everything through the same code
        const getTotalQuantity = <T extends { quantity: number }>(items: T[], filterFn: (item: T) => boolean) => {
            return (items || [])
                .filter(item => item && filterFn(item))
                .reduce((acc, item) => acc + item.quantity, 0);
        };

        const adjustments = this.getAdjustments();

        return this.getMaterials().materials.map(item => {
            const material = item as MaterialWithQuantities;

            material.quantityToBeCollected =  getTotalQuantity(
                adjustments.collections,
                q => q.status !== "FULFILLED_UNACKNOWLEDGED"
                    && q.status !== "FULFILLED_ACKNOWLEDGED"
                    && q.stockReferenceId === material.stockReferenceId
                    && q.jobId === material.jobId
            );

            material.quantityToBeReturned = getTotalQuantity(
                adjustments.returns,
                q => q.stockReferenceId === material.stockReferenceId
                    && q.jobId === material.jobId
            );

            material.quantityOutboundReservation = getTotalQuantity(
                adjustments.outboundMaterialRequests,
                q => this.isALiveReservationStatus(q)
                    && q.stockReferenceId === material.stockReferenceId
                    && q.jobId === material.jobId
            );

            material.quantityInboundReservation = getTotalQuantity(
                adjustments.inboundMaterialRequests,
                q => this.isALiveReservationStatus(q)
                    && q.stockReferenceId === material.stockReferenceId
                    && q.jobId === material.jobId
            );

            return material;
        });
    }

    public getBindableMaterialSearchResult(stockReferenceId: string, forceOnlineRefresh?: boolean): MaterialSearchResult {

        const getCachedOnlineSearchResult = () => {
            return this._onlineSearchResultCache.materialSearchResults
                                        .find(materialSearchResult => materialSearchResult.stockReferenceId.toUpperCase() === stockReferenceId.toUpperCase());
        };

        const cacheOnlineSearchResult = (onlineSearchResult: MaterialSearchResultOnline) => {
            this._onlineSearchResultCache.materialSearchResults.push(onlineSearchResult);
        };

        const isValidCachedOnlineSearchResult = (onlineSearchResult: MaterialSearchResultOnline) => {
            if (forceOnlineRefresh) {
                return false;
            }
            if (onlineSearchResult.completionStatus === "NOT_FOUND_OFFLINE") {
                return false;
            }
            if (onlineSearchResult
                && onlineSearchResult.timestamp
                && ((this.getNowTimeStamp() - onlineSearchResult.timestamp) > (this._config.assetTrackingSearchStaleMinutes || 5) * 60 * 1000)) {
                return false;
            }
            return true;
        };

        const removeCachedOnlineSearchResult = () => {
            this._onlineSearchResultCache.materialSearchResults = this._onlineSearchResultCache.materialSearchResults
                .filter(searchResult => searchResult.stockReferenceId.toUpperCase() !== cachedOnlineResult.stockReferenceId.toUpperCase());
        };

        const attachLocalVanstockToResult = (materialSearchResult: MaterialSearchResult) => {
            materialSearchResult.local.material  = this.getLocalMaterial()
                .find(item => item.stockReferenceId.toUpperCase() === stockReferenceId.toUpperCase()
                                && !item.jobId);

            materialSearchResult.local.completionStatus = materialSearchResult.local.material && materialSearchResult.local.material.quantity
                                                            ? "FOUND"
                                                            : "NOT_FOUND";
        };

        const tryAttachDescriptionFromLocalInfo = (materialSearchResult: MaterialSearchResult) => {
            if (materialSearchResult.local && materialSearchResult.local.material) {
                materialSearchResult.description = materialSearchResult.local.material.description;
            }

            if (!materialSearchResult.description) {
                const potentialHvtMatch = (this.getMaterialHighValueTools().highValueTools  || [])
                                .find(hvt => hvt.materialCode.toUpperCase() === materialSearchResult.stockReferenceId.toUpperCase());
                if (potentialHvtMatch) {
                    materialSearchResult.description = potentialHvtMatch.description;
                }
            }
        };

        const isNumber = (input: any) =>  !isNaN(parseFloat(input)) && isFinite(input);

        const getDistance = (onlineResult: IOnlineMaterialSearchResult): number | "UNKNOWN" => {
            if (!isNumber(onlineResult.distance)
                || (onlineResult.lat === 0 && onlineResult.lon === 0)) {
                return "UNKNOWN";
            } else {
                return Math.round(onlineResult.distance * 10) / 10;
            }
        };

        const compareDistances = (a: {distance: any}, b: {distance: any}) => {
            return  (isNumber(a.distance)  ? <number>(a.distance) : 999999999)
                    - (isNumber(b.distance)  ? <number>(b.distance) : 999999999);
        };

        const getMinimumDistance = (results: {distance: any}[]): number | "UNKNOWN"  => {
            const validDistances = results
                .filter(res => isNumber(res.distance))
                .map(res => <number>res.distance);

            if (!validDistances.length) {
                return "UNKNOWN";
            } else {
                return Math.min(...validDistances);
            }
        };

        const retrieveAndAttachOnlineResult = async () => {
            try {
                const searchResult = await this._vanStockService.getRemoteMaterialSearch(stockReferenceId);
                result.online.timestamp = this.getNowTimeStamp();
                // filter out my own online results
                searchResult.results = searchResult.results
                    .filter(item => item.engineer !== this._engineerId
                                    && item.quantity);

                if (!searchResult.isInternectConnected) {
                    result.online.completionStatus =  "NOT_FOUND_OFFLINE";
                } else if (searchResult.results.length) {
                    result.online.completionStatus = "FOUND";
                    result.online.results = searchResult.results
                        .map(onlineResult => ({
                            distance: getDistance(onlineResult),
                            lon: onlineResult.lon,
                            lat: onlineResult.lat,
                            id: onlineResult.engineer,
                            name: onlineResult.name,
                            phone: onlineResult.telephone,
                            workingStatus: <"WORKING">"WORKING",
                            material: <MaterialWithReservationQuantity>{
                                stockReferenceId: onlineResult.materialCode,
                                description: onlineResult.description,
                                quantity: onlineResult.quantity,
                                area: onlineResult.storageZone,
                                reservationQuantity: onlineResult.reservedQuantity
                            }
                        }))
                        .sort((a, b) => compareDistances(a, b));

                    result.online.summary.totalParts = result.online.results
                        .reduce((prev, curr) => prev + (curr && curr.material.quantity || 0), 0);

                    result.online.summary.totalLocations = result.online.results.length;

                    result.online.summary.nearestDistance = getMinimumDistance(result.online.results);

                    if (!result.description &&
                        result.online &&
                        result.online.results &&
                        result.online.results[0] &&
                        result.online.results[0].material) {
                        // if not in local van stock then look for remote results
                        result.description = result.online.results[0].material.description;
                    }

                } else {
                    result.online.completionStatus = "NOT_FOUND";
                    result.online.results = [];
                }

            } catch (error) {
                result.online.timestamp = this.getNowTimeStamp();
                result.online.completionStatus = "NOT_FOUND_OFFLINE";
            }
            this.saveSearches();
        };

        // spin up a new result object to give back, the .online component will be recycled from cache but the result object is always new
        const result = new MaterialSearchResult();
        result.stockReferenceId = stockReferenceId;

        attachLocalVanstockToResult(result);
        tryAttachDescriptionFromLocalInfo(result);

        let cachedOnlineResult = getCachedOnlineSearchResult();
        if (cachedOnlineResult) {
            if (isValidCachedOnlineSearchResult(cachedOnlineResult)) {
                result.online = cachedOnlineResult;
                return result;
            } else {
                removeCachedOnlineSearchResult();
            }
        }

        result.online.stockReferenceId = stockReferenceId;
        result.online.completionStatus = "SEARCHING";
        cacheOnlineSearchResult(result.online);

        /* don't await me! */ retrieveAndAttachOnlineResult();
        this.saveSearches();
        return result;
    }

    public async getPartsToCollect(): Promise<{toCollect: MaterialToCollect[], collected: MaterialCollection[], expectedReturns: Material[]}> {
        // this doesn't have to be a promise, but might be best to keep the exteral API uniformly promisey
        const adjustments = this.getAdjustments();

        const collections = adjustments.collections
            .map(item => {
                const { stockReferenceId, jobId, description, quantity} = item;
                const foundMaterial = this.getMaterials().materials
                                        .find(material => material.stockReferenceId === item.stockReferenceId);

                const area = item && item.area
                    || foundMaterial && foundMaterial.area; // todo question - will this be done for us api end?

                return {
                    material: <MaterialToCollect>{
                        stockReferenceId,
                        jobId,
                        description,
                        quantity,
                        area,
                        owner: item.owner,
                        id: item.id
                    },
                    status: item.status,
                    quantityCollected: item.quantityCollected
                };
            });

        const toCollect = collections
            .filter(item => item.status !== "FULFILLED_UNACKNOWLEDGED"
                            && item.status !== "FULFILLED_ACKNOWLEDGED")
            .map(item => item.material);

        const collected = collections
            .filter(item => item.status === "FULFILLED_UNACKNOWLEDGED"
                            || item.status === "FULFILLED_ACKNOWLEDGED")
            .map(item => {
                return <MaterialCollection>{...item.material, quantityReturned: 0, quantityCollected: item.quantityCollected};
            });

        const expectedReturns = adjustments.yesterdaysReturns
            .map(yesterdaysReturn => <Material>{
                 stockReferenceId: yesterdaysReturn.stockReferenceId,
                 jobId: yesterdaysReturn.jobId,
                 description: yesterdaysReturn.description,
                 quantity: yesterdaysReturn.quantity,
                 owner: yesterdaysReturn.owner,
                 area: yesterdaysReturn.area
            });

        return {
            toCollect,
            collected,
            expectedReturns
        };
    }

    public async getMaterialRequests(): Promise<{ inboundMaterials: MaterialRequest[], outboundMaterials: MaterialRequest[] }> {

        const mapStatus = (status: MaterialAdjustmentStatus): MaterialRequestStatus => {
            switch (status) {
                case "DELETED_ACKNOWLEDGED":
                case "DELETED_UNACKNOWLEDGED":
                    return "WITHDRAWN";
                case "ACKNOWLEDGED":
                case "UNACKNOWLEDGED":
                    return "PENDING";
                case "FULFILLED_UNACKNOWLEDGED":
                case "FULFILLED_ACKNOWLEDGED":
                    return "COMPLETE";
                case "REJECTED_ACKNOWLEDGED":
                    return "REJECTED";
                default:
                    return undefined;
            }
        };

        const mapIsSyncedToServer = (status: MaterialAdjustmentStatus) =>
                        status === "ACKNOWLEDGED"
                    || status === "DELETED_ACKNOWLEDGED"
                    || status === "FULFILLED_ACKNOWLEDGED"
                    || status === "REJECTED_ACKNOWLEDGED";

        const compareByDateAndTime = (a: MaterialRequest, b: MaterialRequest) => {
            return a.date === b.date
                    ? a.time - b.time
                    : a.date - b.date;
        };

        const adjustments = this.getAdjustments();

        const outboundMaterials = adjustments.outboundMaterialRequests
            .map(item => <MaterialRequest> {
                id: item.id,
                stockReferenceId: item.stockReferenceId,
                description: item.description,
                quantity: item.quantity,
                engineerId: item.engineerId,
                engineerName: item.engineerName,
                engineerPhone: item.engineerPhone,
                status: mapStatus(item.status),
                isSyncedToServer: mapIsSyncedToServer(item.status),
                owner: item.owner,
                date: item.date,
                time: item.time,
                isUnread: item.isUnread
            })
            .sort(compareByDateAndTime);

        const inboundMaterials = adjustments.inboundMaterialRequests
            .map(item => <MaterialRequest>{
                id: item.id,
                stockReferenceId: item.stockReferenceId,
                description: item.description,
                quantity: item.quantity,
                engineerId: item.engineerId,
                engineerName: item.engineerName,
                engineerPhone: item.engineerPhone,
                status: mapStatus(item.status),
                isSyncedToServer: mapIsSyncedToServer(item.status),
                owner: item.owner,
                date: item.date,
                time: item.time
            })
            .sort(compareByDateAndTime);

        return {
            outboundMaterials,
            inboundMaterials
        };
    }

    public async getReturns(): Promise<Material[]> {
        const materials = this.getMaterials();
        return this.getAdjustments().returns
            .map(materialReturn => {

                const { stockReferenceId, jobId, description, quantity} = materialReturn;
                const foundMaterial = materials.materials
                                        .find(material => material.stockReferenceId === materialReturn.stockReferenceId);
                const area = foundMaterial && foundMaterial.area;

                return <Material>{
                    stockReferenceId,
                    jobId,
                    description,
                    quantity,
                    area
                };
            });
    }

    public async registerMaterialRequestReads(arg: { requestIds: (number | Guid)[] }): Promise<void> {
        this.checkArguments("registerAdjustmentReads", arg);

        let unreadRequests = this.getAdjustments().outboundMaterialRequests
            .filter(request => request.isUnread
                                && (arg.requestIds || [])
                                        .some(requestId => request.id === requestId)
            );

        unreadRequests
            .forEach(request => {
                this.updateAdjustment("outboundMaterialRequests", request.id, {isUnread: false });
            });

        if (unreadRequests.length) {
            this._eventAggregator.publish(VanStockConstants.VANSTOCK_UPDATED);
        }
    }

    public async registerMaterialZoneUpdate(arg: { stockReferenceId: string, area: string }): Promise<void> {
        this.checkArguments("registerMaterialZoneUpdate", arg);

        const theseMaterials = this.getMaterials().materials
            .filter(item => item.stockReferenceId === arg.stockReferenceId);

        if (!theseMaterials.length) {
            return;
        }

        for (const thisMaterial of theseMaterials) {
            this.updateMaterial({stockReferenceId: arg.stockReferenceId, jobId: thisMaterial.jobId}, {area: arg.area});
        }

        const representativeMaterial = theseMaterials[0];

        if (representativeMaterial.area !== null && representativeMaterial.area !== undefined) {
            // if we already have an area, Chris says to set that quantity to 0.
            await this._vanStockService.sendMaterialZoneUpdate(
                arg.stockReferenceId,
                {
                    materialCode: arg.stockReferenceId,
                    description: representativeMaterial.description,
                    engineer: this._engineerId,
                    storageZone: representativeMaterial.area,
                    owner: representativeMaterial.owner || DEFAULT_OWNER,
                    quantity: 0
                }
            );
        }

        await this._vanStockService.sendMaterialZoneUpdate(
            arg.stockReferenceId,
            {
                materialCode: arg.stockReferenceId,
                description: representativeMaterial.description,
                engineer: this._engineerId,
                storageZone: arg.area,
                owner: representativeMaterial.owner || DEFAULT_OWNER,
                quantity: ZONE_DUMMY_QUANTITY
            }
        );

    }

    public async registerMaterialCollection(arg: { dispatchId: number, quantityCollected: number}): Promise<void> {
        this.checkArguments("registerMaterialCollection", arg);
        this.checkReadiness("registerMaterialCollection");

        const thisCollection = this.getAdjustments().collections
            .find(collection => collection.id === arg.dispatchId
                                && collection.status === "ACKNOWLEDGED");

        if (!thisCollection) {
            return; // what to really do here?
        }

        this.updateAdjustment("collections", thisCollection.id, {status: "FULFILLED_UNACKNOWLEDGED", quantityCollected: arg.quantityCollected });

        const thisMaterial = this.getMaterials().materials
            .find(item => item.stockReferenceId === thisCollection.stockReferenceId
                && item.jobId === thisCollection.jobId);

        if (thisMaterial) {
            this.updateMaterial(
                {
                    stockReferenceId: thisCollection.stockReferenceId,
                    jobId: thisCollection.jobId
                },
                {
                    quantity: (thisMaterial.quantity || 0) + (arg.quantityCollected || 0)
                }
            );
        } else {
            this.insertMaterials(<Material>{
                stockReferenceId: thisCollection.stockReferenceId,
                jobId: thisCollection.jobId || undefined,
                description: thisCollection.description,
                quantity: arg.quantityCollected,
                area: undefined, // the ui makes a subsequent zone call if it wants to specify zone
                amount: undefined,
                owner: thisCollection.owner
            });
        }

        const receiptDateAndTime = this.getAPIDateAndTime();

        await this._vanStockService.sendMaterialReceipt(
            thisCollection.stockReferenceId,
            {
                material: {
                    materialCode: thisCollection.stockReferenceId,
                    description: thisCollection.description,
                    engineer: this._engineerId,
                    quantity: thisCollection.quantity,
                    owner: thisCollection.owner || DEFAULT_OWNER
                },
                jobId: thisCollection.jobId || undefined,
                date: receiptDateAndTime.date,
                time: receiptDateAndTime.time,
                receiptQuantity: arg.quantityCollected,
                id: arg.dispatchId
            }
        );
    }

    public async registerMaterialReturn(arg: { stockReferenceId: string, quantityReturned: number, reason: string, jobId?: string}): Promise<void> {
        this.checkArguments("registerMaterialReturn", arg);

        const thisMaterial = this.getMaterials().materials
                .find(item => item.stockReferenceId === arg.stockReferenceId
                    && item.jobId === arg.jobId);

        this.insertAdjustments("returns", <MaterialAdjustment>{
            id: Guid.newGuid(),
            stockReferenceId: arg.stockReferenceId,
            jobId: arg.jobId,
            description: thisMaterial && thisMaterial.description,
            quantity: arg.quantityReturned,
            engineerId: undefined,
            engineerName: undefined,
            status: "FULFILLED_UNACKNOWLEDGED",
            owner: thisMaterial && thisMaterial.owner,
            reason: arg.reason,
            date: undefined,
            time: undefined
        });

        const returnDateAndTime = this.getAPIDateAndTime();
        await this._vanStockService.sendMaterialReturn(
            arg.stockReferenceId,
            {
                material: {
                    materialCode: arg.stockReferenceId,
                    description: thisMaterial && thisMaterial.description || "unknown",
                    engineer: this._engineerId,
                    quantity: arg.quantityReturned,
                    owner: thisMaterial && thisMaterial.owner || DEFAULT_OWNER
                },
                date: returnDateAndTime.date,
                time: returnDateAndTime.time,
                reason: arg.reason,
                jobId: arg.jobId
            }
        );
    }

    public async registerMaterialConsumption(arg: { stockReferenceId: string, quantityConsumed: number, jobId?: string}): Promise<void> {
        this.checkArguments("registerMaterialConsumption", arg);

        const thisMaterial = this.getMaterials().materials
            .find(item => item.stockReferenceId === arg.stockReferenceId
                && item.jobId === arg.jobId);

        if (thisMaterial) {
            this.updateMaterial(arg, {quantity: (thisMaterial.quantity || 0) - (arg.quantityConsumed || 0) });
        }

        const dateAndTime = this.getAPIDateAndTime();
        await this._vanStockService.sendMaterialConsumption(
            arg.stockReferenceId,
            {
                material: {
                    materialCode: arg.stockReferenceId,
                    description: thisMaterial && thisMaterial.description || "unknown",
                    engineer: this._engineerId,
                    quantity: arg.quantityConsumed,
                    owner: thisMaterial && thisMaterial.owner || DEFAULT_OWNER
                },

                jobId: arg.jobId || undefined,
                date: dateAndTime.date,
                time: dateAndTime.time
            }
        );
    }

    public async registerMaterialRequest(arg: {
        stockReferenceId: string,
        description: string,
        quantityRequested: number,
        engineerId: string,
        engineerName: string,
        engineerPhone: string,
        owner: string }
        ): Promise<number | Guid> {
        this.checkArguments("registerMaterialRequest", arg);
        this.checkReadiness("registerMaterialRequest");

        const dateAndTime = this.getAPIDateAndTime();
        let id =  Guid.newGuid();

        // for training, we need to let the engineers go from reserve -> collect without waiting for the actions
        //  to appear in the server endpoint, becuase there is no server in simulation!
        let status = this._config.trainingMode
                        ? "ACKNOWLEDGED"
                        : "UNACKNOWLEDGED";

        this.insertAdjustments("inboundMaterialRequests", <MaterialAdjustment> {
            id,
            stockReferenceId: arg.stockReferenceId,
            jobId: undefined,
            description: arg.description, // might not know this if the part is not in my list, but that's ok
            quantity: arg.quantityRequested,
            engineerId: arg.engineerId,
            engineerName: arg.engineerName,
            engineerPhone: arg.engineerPhone,
            status,
            owner: arg.owner,
            date: dateAndTime.date,
            time: dateAndTime.time,
            area: undefined // at the moment we do not specify a preference for a zone
        });

        await this._vanStockService.sendMaterialRequest(
            arg.stockReferenceId,
            {
                material: {
                    materialCode: arg.stockReferenceId,
                    description: arg.description,
                    engineer: arg.engineerId,
                    quantity: arg.quantityRequested,
                    owner: arg.owner || DEFAULT_OWNER
                },
                requestingEngineer: this._engineerId,
                date: dateAndTime.date,
                time: dateAndTime.time
            }
        );

        this.triggerActionsPollingBurst();

        return id;
    }

    public async registerMaterialRequestWithdrawl( arg: { requestId: number | Guid }): Promise<void> {
        this.checkArguments("registerMaterialRequestWithdrawl", arg);
        this.checkReadiness("registerMaterialRequestWithdrawl");

        const existingRequest = this.getAdjustments().inboundMaterialRequests
            .find(request => request.id === arg.requestId
                && this.isALiveReservationStatus(request));

        if (!existingRequest) {
            return;
        }

        this.updateAdjustment("inboundMaterialRequests", existingRequest.id, { status: "DELETED_UNACKNOWLEDGED"});
        await this._vanStockService.sendMaterialRequestUpdate(
            existingRequest.stockReferenceId,
            {
                material: {
                    materialCode: existingRequest.stockReferenceId,
                    description: existingRequest.description,
                    engineer: existingRequest.engineerId,
                    quantity: 0,
                    owner: existingRequest.owner || DEFAULT_OWNER
                },
                requestingEngineer: this._engineerId,
                date: existingRequest.date, // we tie to the original reservtion via date/time!
                time: existingRequest.time
            }
        );

        this.triggerActionsPollingBurst();
    }

    public async registerMaterialTransfer(arg: { requestId: number | Guid }): Promise<void> {
        this.checkArguments("registerMaterialTransfer", arg);
        this.checkReadiness("registerMaterialTransfer");

        const existingRequest = this.getAdjustments().inboundMaterialRequests
            .find(request => request.id === arg.requestId
                && this.isALiveReservationStatus(request));

        if (!existingRequest) {
            return;
        }

        const transferDateAndTime = this.getAPIDateAndTime();
        this.updateAdjustment("inboundMaterialRequests", existingRequest.id, {
            status: "FULFILLED_UNACKNOWLEDGED" ,
            partnerRecordDate: transferDateAndTime.date,
            partnerRecordTime: transferDateAndTime.time
        });

        this.insertAdjustments("inboundMaterialTransfers", <MaterialAdjustment>{
            id: Guid.newGuid(),
            stockReferenceId: existingRequest.stockReferenceId,
            jobId: undefined,
            description: existingRequest.description || "unknown",
            quantity: existingRequest.quantity,
            engineerId: existingRequest.engineerId,
            status: "FULFILLED_UNACKNOWLEDGED",
            owner: existingRequest.owner,
            date: transferDateAndTime.date,
            time: transferDateAndTime.time
        });

        const existingMaterial = this.getMaterials().materials
            .find(item => item.stockReferenceId === existingRequest.stockReferenceId
                && !item.jobId);

        if (existingMaterial) {
            this.updateMaterial(
                { stockReferenceId: existingRequest.stockReferenceId },
                { quantity: (existingMaterial.quantity || 0) + (existingRequest.quantity || 0) });
        } else {
            this.insertMaterials(<Material>{
                stockReferenceId: existingRequest.stockReferenceId,
                jobId: undefined,
                description: existingRequest.description,
                quantity: existingRequest.quantity,
                area: undefined,
                amount: undefined,
                owner: existingRequest.owner
            });
        }

        this.expireSearch(existingRequest.stockReferenceId);

        await this._vanStockService.sendMaterialRequestUpdate(
            existingRequest.stockReferenceId,
            {
                material: {
                    materialCode: existingRequest.stockReferenceId,
                    description: existingRequest.description
                                    || existingMaterial && existingMaterial.description,
                    engineer: existingRequest.engineerId,
                    quantity: 0,
                    owner: existingRequest.owner || DEFAULT_OWNER
                },
                requestingEngineer: this._engineerId,
                date: existingRequest.date,
                time: existingRequest.time
            }
        );

        await this._vanStockService.sendMaterialTransfer(
            existingRequest.stockReferenceId,
            {
                material: {
                    materialCode: existingRequest.stockReferenceId,
                    description: existingRequest.description
                                    || existingMaterial && existingMaterial.description,
                    engineer: existingRequest.engineerId,
                    quantity: existingRequest.quantity,
                    owner: existingRequest.owner || DEFAULT_OWNER
                },
                requestingEngineer: this._engineerId,
                date: transferDateAndTime.date,
                time: transferDateAndTime.time
            }
        );

        this.triggerActionsPollingBurst();
    }

    public triggerActionsPollingBurst(): void {
        // for activities when we want to see e.g. a read response come back from actions endpoint
        PollingHelper.pollIntervals(
            async () => (await this.syncWithServer()).haveAdjustmentsChanged,
            this._config.assetTrackingActivePollingPattern || [2, 2, 5, 5, 5]
        );
    }

    private getMaterials(): Materials {
        return this._storageService.getMaterials()
                || new Materials(this._engineerId);
    }

    private getAdjustments() : MaterialAdjustments {
        return this._storageService.getMaterialAdjustments()
                || new MaterialAdjustments(this._engineerId, []);
    }

    private getMaterialHighValueTools(): MaterialHighValueTools {
        return this._storageService.getMaterialHighValueTools()
                || new MaterialHighValueTools(this._engineerId);
    }

    private updateMaterial(id: { stockReferenceId: string, jobId?: string}, changes: Partial<Material>): void {
        const materials = this.getMaterials();
        const material = materials.materials.find(m => m
                                    && m.stockReferenceId === id.stockReferenceId
                                    && (m.jobId || undefined) === (id.jobId || undefined));
        if (!material) {
            this._logger.error("Applying material update", id, changes, "DOES NOT EXIST!");
        } else {
            this._logger.warn("Applying material update", id, changes, material);
            Object.assign(material, changes);
            this._logger.warn("Applied material update", material);

            this.saveMaterials(materials);
        }
    }

    private insertMaterials(...inMaterials: Material[]): void {
        const materials = this.getMaterials();

        this._logger.warn("Inserting materials", materials.materials.length, inMaterials);
        (inMaterials || []).forEach(inMaterial => {
            const materialAlreadyExists = materials.materials.some(exitingMaterial => exitingMaterial
                && exitingMaterial.stockReferenceId === inMaterial.stockReferenceId
                && (exitingMaterial.jobId || undefined) === (inMaterial.jobId || undefined));

            if (materialAlreadyExists) {
                this._logger.error("Inserting materials", {id: inMaterial.stockReferenceId, jobId: inMaterial.jobId }, "ALREADY EXISTS!");
            } else {
                materials.materials.push(inMaterial);
            }
        });
        this._logger.warn("Inserted materials", materials.materials.length);

        this.saveMaterials(materials);
    }

    private updateAdjustment(type: keyof MaterialAdjustmentsArrays, id: number | Guid, changes: Partial<MaterialAdjustment>): MaterialAdjustments {
        const adjustments = this.getAdjustments();
        const adjustment = adjustments[type].find(a => a
                                                    && a.id === id);
        if (!adjustment) {
            this._logger.error("Applying adjustment update", type, id, changes, "DOES NOT EXIST!");
        } else {
            this._logger.warn("Applying adjustment update", type, adjustment, changes);

            Object.assign(adjustment, changes);
            if (changes.status) {
                this.stampAdjustmentHistory(adjustment);
            }
            this._logger.warn("Applied adjustment update", type, adjustment);

            this.saveMaterialAdjustments(adjustments);
        }

        return adjustments;
    }

    private insertAdjustments(type: keyof MaterialAdjustmentsArrays, ...inAdjustments: MaterialAdjustment[]): MaterialAdjustments {
        const adjustments = this.getAdjustments();

        this._logger.warn("Inserting adjustments", type, adjustments[type].length, inAdjustments);
        (inAdjustments || []).forEach(inAdjustment => {
            if (adjustments[type].some(existingAdjustment => existingAdjustment.id === inAdjustment.id)) {
                this._logger.error("Inserting adjustments", type, inAdjustment.id, "ALREADY EXISTS!");
            } else {
                this.stampAdjustmentHistory(inAdjustment);
                adjustments[type].push(inAdjustment);
            }
        });
        this._logger.warn("Inserted adjustments", type, adjustments[type].length);

        this.saveMaterialAdjustments(adjustments);
        return adjustments;
    }

    private deleteAdjustments(type: keyof MaterialAdjustmentsArrays, ... ids: (number | Guid)[]): MaterialAdjustments {
        const adjustments = this.getAdjustments();

        this._logger.warn("Deleting adjustments", type, adjustments[type].length, ids);
        adjustments[type] = adjustments[type].filter(item => !ids.some(id => item.id === id));
        this._logger.warn("Deleted adjustments", type, adjustments[type].length);

        this.saveMaterialAdjustments(adjustments);
        return adjustments;
    }

    private stampAdjustmentHistory(adjustment: MaterialAdjustment): void {
        if (!adjustment) {
            return;
        }
        adjustment.history = adjustment.history || [];
        adjustment.history.push({
            status: adjustment.status,
            time: this.getAPIDateAndTime().time
        });
    }

    private saveMaterialHighValueTools(materialHighValueTools: MaterialHighValueTools): void {
        materialHighValueTools.timestamp = this.getNowTimeStamp();
        this._storageService.setMaterialHighValueTools(materialHighValueTools);
    }

    private saveMaterials(materials: Materials): void {
        materials.timestamp = this.getNowTimeStamp();
        this._storageService.setMaterials(materials);
    }

    private saveMaterialAdjustments(adjustments: MaterialAdjustments): void {
        adjustments.timestamp = this.getNowTimeStamp();
        this._storageService.setMaterialAdjustments(adjustments);
    }

    private saveSearches(): void {
        this._onlineSearchResultCache.timestamp = this.getNowTimeStamp();
        this._storageService.setMaterialSearchResults(this._onlineSearchResultCache);
    }

    private expireSearch(stockReferenceId: string): void {
        const existingSearch = this._onlineSearchResultCache.materialSearchResults
                                .find(result => result.stockReferenceId === stockReferenceId);
        if (existingSearch) {
            existingSearch.timestamp = -1;
        }
    }

    private checkArguments(callSite: string, arg: any): void {
        if (!arg) {
            throw new BusinessException(this, callSite, "material argument missing", null, null);
        }
    }

    private checkReadiness(callSite: string): void {
        if (!this._bindableReadinessFlag.isReady) {
            throw new BusinessException(this, callSite, "This action is not possible until Van Stock has refreshed from the server.", null, null);
        }
    }

    private async syncWithServer(feedbackDelegate?: (message: string) => void): Promise<{haveMaterialsChanged: boolean, haveAdjustmentsChanged: boolean}> {
        if (this._isSyncInProgress) {
            return {
                haveMaterialsChanged: false,
                haveAdjustmentsChanged: false
            };
        }

        // todo: the way that logging and feeding back within this method needs to be refactored, unified a bit
        const log = (type: "WARN" | "ERROR", message: string, ...rest: any[]) => {
            switch (type) {
                case "WARN":
                    this._logger.warn(message, rest);
                    break;
                case "ERROR":
                    this._logger.error(message, rest);
                    break;
                default:
                    break;
            }
            if (feedbackDelegate) {
                feedbackDelegate(message);
            }
        };

        this._isSyncInProgress = true;
        let haveWeHitMaterials = false;
        let haveWeHitActions = false;

        try {

            const isTimeToClearAndRebuildCache = (cache : {timestamp: number, engineerId: string}) => {
                const cutoffHHmmss = this._config.assetTrackingCacheRefreshTimeHHmm || "05:00";
                const todayCutOffTimeString = (new Date()).toISOString().split("T")[0] + "T" + cutoffHHmmss + ":00";
                const todayCutOffTime = new Date(todayCutOffTimeString).getTime();

                if (cache.engineerId !== this._engineerId) {
                     // hack for when using different engineers in dev/test/training
                    return "DIFFERENT_ENGINEER_LOGIN";
                }

                if (!cache
                    || !cache.timestamp
                    ||  (cache.timestamp < todayCutOffTime
                            && Date.now() > todayCutOffTime)) {
                    return "CACHE_EMPTY_OR_EXPIRED";
                }
                return false;
            };

            if (isTimeToClearAndRebuildCache(this._onlineSearchResultCache)) {
                log("WARN", "Clearing Searches");
                this._onlineSearchResultCache = new MaterialSearchResults(this._engineerId);
                this.saveSearches();
            }

            const adjustmentRebuildReason = isTimeToClearAndRebuildCache(this.getAdjustments());
            if (adjustmentRebuildReason) {
                const adjustments = this.getAdjustments();
                log("WARN", "Clearing Ajustments", adjustmentRebuildReason, adjustments);
                this.saveMaterialAdjustments(new MaterialAdjustments(
                    this._engineerId,
                    adjustmentRebuildReason === "DIFFERENT_ENGINEER_LOGIN"
                        ? [] // if we are different engineer then drop yesterday's data
                        : adjustments.returns // ... otherwise keep it
                ));
            }

            if (isTimeToClearAndRebuildCache(this.getMaterialHighValueTools())) {
                try {

                    log("WARN", "Trying to rebuild high value tools");

                    const serverHighValueTools = await this._vanStockService.getHighValueTools();
                    log("WARN", "Rebuilding high value tools");

                    const materialHighValueTools = new MaterialHighValueTools(this._engineerId);
                    materialHighValueTools.highValueTools = serverHighValueTools.map(hvt => ({
                        materialCode: hvt.materialCode,
                        description: hvt.materialDescription
                    }));

                    this.saveMaterialHighValueTools(materialHighValueTools);
                    log("WARN", "Rebuilt high value tools");

                } catch (error) {
                    log("ERROR", "Error rebuilding high value tools", error && error.toString());
                }
            }

            this._bindableReadinessFlag.isReady = !isTimeToClearAndRebuildCache(this.getMaterials());
            try {

                if (!this._bindableReadinessFlag.isReady) {
                    log("WARN", "Trying to rebuild materials");
                    const serverMaterials = await this._vanStockService.getEngineerMaterials(this._engineerId);
                    // if getEngineerMaterials() throws an error, we still have the old data in the cache, but the isReady flag is left as false
                    //  and no actions can be set, either through the register* methods or by hitting the actions endpoint below.

                    log("WARN", "Rebuilding materials");
                    // clear down materials
                    this.saveMaterials(new Materials(this._engineerId));

                    this.insertMaterials(
                        ...(serverMaterials || [])
                            .filter(material => !!material)
                            .map(material => (<Material>{
                                stockReferenceId: material.materialCode,
                                description: material.description,
                                quantity: material.quantity,
                                area: material.storageZone,
                                jobId:  material.jobId || undefined,
                                owner: material.owner
                            }))
                    );

                    this._bindableReadinessFlag.isReady = true;
                    haveWeHitMaterials = true;
                    log("WARN", "Rebuilt materials");
                }

                try {
                    const currentServerActions = await this._vanStockService.getEngineerActions(this._engineerId);
                    this._bindableReadinessFlag.isActionsEndpointOk = true;
                    const currentAdjustments = this.getAdjustments();
                    log("WARN", "Applying actions");
                    haveWeHitActions = this.applyRemoteActions(currentServerActions, currentAdjustments, haveWeHitMaterials);
                    log("WARN", "Applied actions", { haveWeHitActions });
                } catch (error) {
                    this._bindableReadinessFlag.isActionsEndpointOk = false;
                    log("ERROR", "Error hitting actions", error && error.toString());
                }

                if (haveWeHitMaterials || haveWeHitActions) {
                    this._eventAggregator.publish(VanStockConstants.VANSTOCK_UPDATED);
                }

            } catch (error) {
                log("ERROR", "syncWithServer error", error && error.toString());
            }

        } catch (error) {

        }
        this._isSyncInProgress = false;
        return {
            haveAdjustmentsChanged: haveWeHitActions,
            haveMaterialsChanged: haveWeHitMaterials
        };
    }

    private applyRemoteActions(currentServerActions: IMaterialActions = <IMaterialActions>{}, adjustments: MaterialAdjustments, isInitialDataBuid: boolean): boolean {

        const compareItemsBy = {
            ID: <T extends {id: Guid | number}, U extends {id: Guid | number}>(a: T, b: U) => a.id === b.id,
            // note: if using DATE_AND_TIME, make sure your local array is passed in as A, because it is those in A that are returned from the functions inA...*
            //  ... and it will be the case you need your local id, not the remote one in order to do useful subsequent work.
            DATE_AND_TIME: <T extends {date: number, time: number}, U extends {date: number, time: number}>(a: T, b: U) => a.date === b.date && a.time === b.time,
        };

        const inANotB = <T , U >(a: T[], b: U[], comparator: (a: T, b: U) => boolean) => {
            return (a || [])
                    .filter(itemInA => !(b || [])
                                .some(itemInB => itemInA && itemInB && comparator(itemInA, itemInB)));
        };

        const inAAndB = <T, U>(a: T[], b: U[], comparator: (a: T, b: U) => boolean) => {
            return (a || [])
                    .filter(itemInA => (b || [])
                                .some(itemInB => itemInA && itemInB && comparator(itemInA, itemInB)));
        };

        const {
            dispatchedMaterials: dispatches = [],
            reservedMaterials: reservations = [],
            transferredMaterials: transfers = []
        } = currentServerActions;

        const disappearedCollections = inANotB(
            adjustments.collections.filter(item => item.status !== "FULFILLED_UNACKNOWLEDGED"
                                                    && item.status !== "FULFILLED_ACKNOWLEDGED"),
            dispatches,
            compareItemsBy.ID
        );

        const freshCollections = inANotB(dispatches, adjustments.collections, compareItemsBy.ID);

        if (disappearedCollections.length) {
            // 1) disappeared collection
            adjustments = this.deleteAdjustments("collections", ...disappearedCollections.map(item => item.id));
        }

        if (freshCollections.length) {
            // 2) appeared collections
            adjustments = this.insertAdjustments("collections", ...freshCollections.map(item => (<MaterialAdjustment>{
                id: item.id,
                stockReferenceId: item.materialCode,
                jobId: item.jobId || undefined,
                description: item.description,
                quantity: item.quantity,
                engineerId: undefined,
                status: "ACKNOWLEDGED",
                owner: item.owner,
                area: item.storageZone
            })));
        }

        // transfers for parts coming to me
        const freshInboundMaterialTransfers = inAAndB(
            adjustments.inboundMaterialTransfers.filter(item => item.status === "FULFILLED_UNACKNOWLEDGED"),
            transfers.filter(item => item.destinationEngineerId === this._engineerId),
            compareItemsBy.DATE_AND_TIME
        );

        if (freshInboundMaterialTransfers.length) {
            freshInboundMaterialTransfers.forEach(item => {
                // 3) inbound transfer
                adjustments = this.updateAdjustment("inboundMaterialTransfers", item.id, {status: "FULFILLED_ACKNOWLEDGED" });

                const thisRequest = adjustments.inboundMaterialRequests
                    .find(request => (request.status === "FULFILLED_UNACKNOWLEDGED")
                                    && request.partnerRecordDate === item.date
                                    && request.partnerRecordTime === item.time);

                // 4) completed inbound request
                if (thisRequest) {
                    adjustments = this.updateAdjustment("inboundMaterialRequests", thisRequest.id, { status: "FULFILLED_ACKNOWLEDGED"} );
                }
            });
        }

        // requests for parts coming to me
        const freshInboundMaterialRequests = inAAndB(
            adjustments.inboundMaterialRequests.filter(item => item.status === "UNACKNOWLEDGED"),
            reservations.filter(reservation => !reservation.declined),
            compareItemsBy.DATE_AND_TIME
        );

        if (freshInboundMaterialRequests.length) {
            freshInboundMaterialRequests.forEach(item => {
                // 5) acknowledged inbound request
                adjustments = this.updateAdjustment("inboundMaterialRequests", item.id, { status: "ACKNOWLEDGED"});
            });
        }

        const freshRejectedInboundMaterialRequests = inAAndB(
            adjustments.inboundMaterialRequests.filter(item => item.status === "UNACKNOWLEDGED"),
            reservations.filter(reservation => reservation.declined),
            compareItemsBy.DATE_AND_TIME
        );

        if (freshRejectedInboundMaterialRequests.length) {
            // 6) acknowledged inbound request but rejected
            freshRejectedInboundMaterialRequests.forEach(item => {
                adjustments = this.updateAdjustment("inboundMaterialRequests", item.id, { status: "REJECTED_ACKNOWLEDGED"});
            });
        }

        const disappearedInboundMaterialRequests = inANotB(
            adjustments.inboundMaterialRequests.filter(item => item.status === "DELETED_UNACKNOWLEDGED"),
            reservations,
            compareItemsBy.DATE_AND_TIME
        );

        if (disappearedInboundMaterialRequests.length) {
            // 7) withdrawn inbound request
            disappearedInboundMaterialRequests.forEach(item => {
                adjustments = this.updateAdjustment("inboundMaterialRequests", item.id, { status: "DELETED_ACKNOWLEDGED" });
            });
        }

        // if the user has hit e.g. Remove User Data whilst there is an open reservation, we will lose it
        //  so look for reservations indbound to us that we do not have
        const rebuildingInboundMaterialRequests = inANotB(
            reservations.filter(reservation => !reservation.declined
                                && reservation.destinationEngineerId === this._engineerId),
            adjustments.inboundMaterialRequests,
            compareItemsBy.DATE_AND_TIME
        );

        if (rebuildingInboundMaterialRequests.length) {
            adjustments = this.insertAdjustments("inboundMaterialRequests", ...rebuildingInboundMaterialRequests.map(item => <MaterialAdjustment>{
                id: item.id,
                stockReferenceId: item.materialCode,
                jobId: undefined,
                description: item.description,
                quantity: item.quantity,
                engineerId: item.sourceEngineerId,
                engineerName: item.sourceEngineerName,
                engineerPhone: item.sourceEngineerTelephone,
                status: "ACKNOWLEDGED",
                date: item.date,
                time: item.time
            }));
        }

        const disappearedOutboundRequests = inANotB(
            adjustments.outboundMaterialRequests,
            reservations.filter(item => item.sourceEngineerId === this._engineerId),
            compareItemsBy.ID
        );

        // transfers for parts leaving me
        const freshOutboundMaterialTransfers = inANotB(
            transfers.filter(item => item.sourceEngineerId === this._engineerId),
            adjustments.outboundMaterialTransfers,
            compareItemsBy.ID
        );

        if (freshOutboundMaterialTransfers.length) {
            // 8) appeared outbound transfer
            adjustments = this.insertAdjustments("outboundMaterialTransfers", ...freshOutboundMaterialTransfers.map(item => <MaterialAdjustment>{
                id: item.id,
                stockReferenceId: item.materialCode,
                jobId: undefined,
                description: item.description,
                quantity: item.quantity,
                engineerId: item.destinationEngineerId,
                status: "FULFILLED_ACKNOWLEDGED"
            }));

            freshOutboundMaterialTransfers.forEach(item => {
                const thisMaterial = this.getMaterials().materials
                    .find(material => material.stockReferenceId === item.materialCode && !material.jobId);

                if (!isInitialDataBuid) {
                    // special case: if we have just hit the materials endpoint, the transferred quantities *should* already be accounted for in the materials data
                    this.updateMaterial({stockReferenceId: item.materialCode}, {
                        quantity: (thisMaterial && thisMaterial.quantity || 0) - (item && item.quantity || 0)
                    });
                }

                // todo: check this logic - can we match on id instead?
                const thisRequest = disappearedOutboundRequests
                    .find(request => (request.status === "ACKNOWLEDGED"
                                       || request.status === "UNACKNOWLEDGED")
                                    && request.stockReferenceId === item.materialCode
                                    && request.engineerId === item.destinationEngineerId
                                    && request.quantity === item.quantity);
                // 9) completed outbound request
                if (thisRequest) {
                    adjustments = this.updateAdjustment("outboundMaterialRequests", thisRequest.id, { status: "FULFILLED_ACKNOWLEDGED"} );
                } else {
                    // if we never received the reservation (we were in sleep mode?) then there is nothing to update,
                    //  so lets rebuild the reservation
                    adjustments = this.insertAdjustments("outboundMaterialRequests", <MaterialAdjustment>{
                        id: <Guid>(Guid.newGuid()), // do not use the transfer's id in reservations, might be id clash!
                        stockReferenceId: item.materialCode,
                        jobId: undefined,
                        description: item.description,
                        quantity: item.quantity,
                        engineerId: item.destinationEngineerId,
                        engineerName: item.destinationEngineerName,
                        engineerPhone: item.destinationEngineerTelephone,
                        status: "FULFILLED_ACKNOWLEDGED",
                        isUnread: true,
                        date: item.date,
                        time: item.time
                    });
                }
            });
        }

        // requests for parts leaving me
        const deletedOutboundRequests = inANotB(
                                            adjustments.outboundMaterialRequests.filter(item => item.status !== "FULFILLED_ACKNOWLEDGED"
                                                                                            && item.status !== "DELETED_ACKNOWLEDGED"),
                                            reservations.filter(item => item.sourceEngineerId === this._engineerId),
                                            compareItemsBy.ID
                                        );

        if (deletedOutboundRequests.length) {
            // 10) withdrawn outbound request
            deletedOutboundRequests.forEach(item => {
                adjustments = this.updateAdjustment("outboundMaterialRequests", item.id, { status: "DELETED_ACKNOWLEDGED"});
            });
        }

        const freshOutboundRequests = inANotB(
            reservations.filter(item => item.sourceEngineerId === this._engineerId),
            adjustments.outboundMaterialRequests,
            compareItemsBy.ID
        );

        if (freshOutboundRequests.length) {
            // 11) appeared outbound request
            adjustments = this.insertAdjustments("outboundMaterialRequests", ...freshOutboundRequests.map(item => <MaterialAdjustment>{
                id: item.id,
                stockReferenceId: item.materialCode,
                jobId: undefined,
                description: item.description,
                quantity: item.quantity,
                engineerId: item.destinationEngineerId,
                engineerName: item.destinationEngineerName,
                engineerPhone: item.destinationEngineerTelephone,
                status: item.declined
                            ? "REJECTED_ACKNOWLEDGED"
                            : "ACKNOWLEDGED",
                isUnread: true,
                date: item.date,
                time: item.time
            }));
        }

        const rebornOutboundRequests = inAAndB(
            reservations.filter(item => item.sourceEngineerId === this._engineerId),
            adjustments.outboundMaterialRequests.filter(item => item.status === "DELETED_ACKNOWLEDGED"),
            compareItemsBy.ID
        );

        if (rebornOutboundRequests.length) {
            // 12) *not sure* a reappeared outbound request (i.e. it disappeared for a bit and then came back, but out in-day refresh should tackle this)
            rebornOutboundRequests.forEach(item => {
                adjustments = this.updateAdjustment("outboundMaterialRequests", item.id, { status: "ACKNOWLEDGED"});
            });
        }

        return !!(disappearedCollections.length
                || freshCollections.length
                || freshInboundMaterialTransfers.length
                || freshInboundMaterialRequests.length
                || freshRejectedInboundMaterialRequests.length
                || disappearedInboundMaterialRequests.length
                || rebuildingInboundMaterialRequests.length
                || freshOutboundMaterialTransfers.length
                || deletedOutboundRequests.length
                || freshOutboundRequests.length
                || rebornOutboundRequests.length);
    }

    private getNowTimeStamp(): number {
        return (new Date()).getTime();
    }

    private getAPIDateAndTime(): { date: number, time: number } {
        const m = moment();
        return {
            date: +m.format("YYYYMMDD"),
            time: +m.format("HHmmssSS") // if the time happens to start with a zero, that zero should be removed, so this logic is correct
        };
    }

    private convertEngineerId(input: string): string {
        // e.g. "0000050" needs to be "50" (the number with no leading zeros, but as a string)
        // return parseInt((input || "").replace(/\D/g, ""), 10).toString();
        return input;
    }

    private isALiveReservationStatus(adjustment: {status: MaterialAdjustmentStatus}) : boolean {
        return adjustment.status !== "DELETED_UNACKNOWLEDGED"
                && adjustment.status !== "DELETED_ACKNOWLEDGED"
                && adjustment.status !== "FULFILLED_UNACKNOWLEDGED"
                && adjustment.status !== "FULFILLED_ACKNOWLEDGED";
    }
}
