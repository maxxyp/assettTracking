/// <reference path="../../../../typings/app.d.ts" />
import {inject} from "aurelia-framework";

import {IStorageService} from "./interfaces/IStorageService";
import {IStorage} from "../../../common/core/services/IStorage";
import {StorageConstants} from "../constants/storageConstants";
import {Job} from "../models/job";
import {Message} from "../models/message";
import {Engineer} from "../models/engineer";
import {BusinessException} from "../models/businessException";
import {HemaStorage} from "../../core/services/hemaStorage";
import {ApplicationSettings} from "../../business/models/applicationSettings";
import {ConsumablesBasket as ConsumablePartsBasket} from "../../business/models/consumablesBasket";
import {FavouriteList} from "../models/favouriteList";
import {JobApiFailure} from "../models/jobApiFailure";
import {RetryPayload} from "../../../common/resilience/models/retryPayload";
import {JobPartsCollection} from "../models/jobPartsCollection";
import {ISynchronousStorage} from "../../../common/core/services/ISynchronousStorage";
import {MaterialAdjustments} from "../models/materialAdjustments";
import {Materials} from "../models/materials";
import {MaterialSearchResults} from "../models/materialSearchResults";
import {MaterialHighValueTools} from "../models/materialHighValueTools";
import { GeoPosition } from "../../../common/geo/models/geoPosition";

@inject(HemaStorage, HemaStorage)
export class StorageService implements IStorageService {
    private _storage: IStorage;
    private _syncStorage: ISynchronousStorage;

    constructor(storage: IStorage, syncStorage: ISynchronousStorage) {
        this._storage = storage;
        this._syncStorage = syncStorage;
    }

    public deleteEngineer(): Promise<void> {
        return this.setJobsToDo(null)
            .then(() => this.setPartsCollections(null))
            .then(() => this.setWorkListJobApiFailures(null))
            .then(() => this.setEngineer(null));
    }

    public getWorkListJobs(): Promise<Job[]> {
        return this._storage.get<Job[]>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_ALL_WORK_JOBS)
            .then(data => {
                data = data || [];
                return data.map(d => Job.fromJson(d));
            })
            .catch((error) => {
                throw new BusinessException(this, "getWorkListJobs", "Getting work list", null, error);
            });
    }

    public setWorkListJobs(jobs: Job[]): Promise<void> {
        return this._storage.set<Job[]>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_ALL_WORK_JOBS, jobs)
            .catch((error) => {
                throw new BusinessException(this, "setWorkListJobs", "Setting work list", null, error);
            });
    }

    public getPartsCollections(): Promise<JobPartsCollection[]> {
        return this._storage.get<JobPartsCollection[]>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_ALL_PARTSCOLLECTIONS)
            .catch((error) => {
                throw new BusinessException(this, "getPartsCollections", "Getting work list parts collections", null, error);
            });
    }

    public setPartsCollections(partsCollections: JobPartsCollection[]): Promise<void> {
        return this._storage.set<JobPartsCollection[]>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_ALL_PARTSCOLLECTIONS, partsCollections)
            .catch((error) => {
                throw new BusinessException(this, "setPartsCollections", "Setting work list parts collections", null, error);
            });
    }

    public getWorkListJobApiFailures(): Promise<JobApiFailure[]> {
        return this._storage.get<JobApiFailure[]>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_ALL_WORK_JOB_API_ERRORS)
            .catch((error) => {
                throw new BusinessException(this, "getWorkListJobApiFailures", "Getting work list", null, error);
            });
    }

    public setWorkListJobApiFailures(jobApiFailuress: JobApiFailure[]): Promise<void> {
        return this._storage.set<JobApiFailure[]>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_ALL_WORK_JOB_API_ERRORS, jobApiFailuress)
            .catch((error) => {
                throw new BusinessException(this, "getWorkListJobApiFailures", "Setting work list", null, error);
            });
    }

    public getJobsToDo(): Promise<Job[]> {
        return this._storage.get<Job[]>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_ALL_JOBS)
            .then(data => {
                data = data || [];
                return data.map(d => Job.fromJson(d));
            })
            .catch((error) => {
                throw new BusinessException(this, "getJobsToDo", "Getting job to do", null, error);
            });
    }

    public setJobsToDo(jobs: Job[]): Promise<void> {
        return this._storage.set<Job[]>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_ALL_JOBS, jobs)
            .catch((error) => {
                throw new BusinessException(this, "setJobsToDo", "Setting job to do", null, error);
            });
    }

    public getMessages(): Promise<Message[]> {
        return this._storage.get<Message[]>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_MESSAGES)
            .catch((error) => {
                throw new BusinessException(this, "getMessages", "Getting messages", null, error);
            });
    }

    public setMessages(messages: Message[]): Promise<void> {
        return this._storage.set<Message[]>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_MESSAGES, messages)
            .catch((error) => {
                throw new BusinessException(this, "setMessages", "Setting messages", null, error);
            });
    }

    public getFavouritesList(): Promise<FavouriteList> {
        return this._storage.get<FavouriteList>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_FAVOURITES_LIST)
            .catch((error) => {
                throw new BusinessException(this, "getFavouritesList", "Getting Favourite List ", null, error);
            });
    }

    public setFavouritesList(favouriteList: FavouriteList): Promise<void> {
        return this._storage.set<FavouriteList>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_FAVOURITES_LIST, favouriteList)
            .catch((error) => {
                throw new BusinessException(this, "setFavouritesList", "Setting Favourite List", null, error);
            });
    }

    public getConsumablePartsBasket(): Promise<ConsumablePartsBasket> {
        return this._storage.get<ConsumablePartsBasket>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_CONSUMABLE_PARTS_BASKET)
            .catch((error) => {
                throw new BusinessException(this, "getConsumablePartsBasket", "Getting consumable parts basket", null, error);
            });
    }

    public setConsumablePartsBasket(basket: ConsumablePartsBasket): Promise<void> {
        return this._storage.set<ConsumablePartsBasket>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_CONSUMABLE_PARTS_BASKET, basket)
            .catch((error) => {
                throw new BusinessException(this, "setConsumablePartsBasket", "Setting consumable parts basket", null, error);
            });
    }

    public setConsumablesRead(read: boolean): Promise<void> {
        return this._storage.set<boolean>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_CONSUMABLE_UPDATES_READ, read)
            .catch((error) => {
                throw new BusinessException(this, "setConsumablesRead", "Setting consumable read", null, error);
            });
    }

    public getConsumablesRead(): Promise<boolean> {
        return this._storage.get<boolean>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_CONSUMABLE_UPDATES_READ)
            .catch((error) => {
                throw new BusinessException(this, "getConsumableRead", "Getting consumable read", null, error);
            });
    }

    public getEngineer(): Promise<Engineer> {
        return this._storage.get<Engineer>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_ENGINEER)
            .catch((error) => {
                throw new BusinessException(this, "getEngineer", "Getting engineer", null, error);
            });
    }

    public setEngineer(engineer: Engineer): Promise<void> {
        return this._storage.set<Engineer>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_STORAGE_ENGINEER, engineer)
            .catch((error) => {
                throw new BusinessException(this, "setEngineer", "Setting engineer", null, error);
            });
    }

    public getUserPatch(): Promise<string> {
        return this._storage.get<string>(StorageConstants.HEMA_USER_SETTINGS,
            StorageConstants.HEMA_USER_PATCH)
            .catch((error) => {
                throw new BusinessException(this, "getUserPatch", "Getting user Patch", null, error);
            });
    }

    public setUserPatch(userPatch: string): Promise<void> {
        return this._storage.set<string>(StorageConstants.HEMA_USER_SETTINGS,
            StorageConstants.HEMA_USER_PATCH, userPatch)
            .catch((error) => {
                throw new BusinessException(this, "setUserPatch", "Setting user patch", null, error);
            });
    }

    public getUserRegion(): Promise<string> {
        return this._storage.get<string>(StorageConstants.HEMA_USER_SETTINGS, StorageConstants.HEMA_USER_REGION);
    }

    public setUserRegion(region: string): Promise<void> {
        return this._storage.set<string>(StorageConstants.HEMA_USER_SETTINGS,
            StorageConstants.HEMA_USER_REGION, region)
            .catch((error) => {
                throw new BusinessException(this, "setUserRegion", "Setting user region", null, error);
            });
    }

    public getWorkingSector(): Promise<string> {
        return this._storage.get<string>(StorageConstants.HEMA_USER_SETTINGS,
            StorageConstants.HEMA_SECTOR)
            .catch((error) => {
                throw new BusinessException(this, "getWorkingSector", "Getting working sector", null, error);
            });
    }

    public setWorkingSector(workingSector: string): Promise<void> {
        return this._storage.set<string>(StorageConstants.HEMA_USER_SETTINGS,
            StorageConstants.HEMA_SECTOR, workingSector)
            .catch((error) => {
                throw new BusinessException(this, "setWorkingSector", "Setting Working Sector", null, error);
            });
    }

    public getAppSettings(): Promise<ApplicationSettings> {
        return this._storage.get<string>(StorageConstants.HEMA_APPLICATION_SETTINGS,
            StorageConstants.HEMA_APP_SETTINGS).then((settingsString) => {
            return settingsString ? <ApplicationSettings>JSON.parse(settingsString) : undefined;
        })
            .catch((error) => {
                throw new BusinessException(this, "getAppSettings", "Getting Application Settings", null, error);
            });
    }

    public setAppSettings(appSettings: ApplicationSettings): Promise<void> {
        return this._storage.set<string>(StorageConstants.HEMA_APPLICATION_SETTINGS,
            StorageConstants.HEMA_APP_SETTINGS, appSettings ? JSON.stringify(appSettings) : undefined)
            .catch((error) => {
                throw new BusinessException(this, "setAppSettings", "Setting Application Settings", null, error);
            });
    }

    public getSimulationEngineer(): Promise<string> {
        return this._storage.get<string>(StorageConstants.HEMA_SIMULATION_SETTINGS,
            StorageConstants.HEMA_SIMULATION_ENGINEER)
            .catch((error) => {
                throw new BusinessException(this, "getSimulationEngineer", "Getting Simulation Engineer", null, error);
            });
    }

    public setSimulationEngineer(engineerId: string): Promise<void> {
        return this._storage.set<string>(StorageConstants.HEMA_SIMULATION_SETTINGS,
            StorageConstants.HEMA_SIMULATION_ENGINEER, engineerId)
            .catch((error) => {
                throw new BusinessException(this, "setSimulationEngineer", "Setting Simulation Engineer", null, error);
            });
    }

    public getLastSuccessfulSyncTime(): Promise<number> {
        return this._storage.get<number>(StorageConstants.HEMA_INIT_SETTINGS,
            StorageConstants.HEMA_REFERENCE_STALE_TIME)
            .catch((error) => {
                throw new BusinessException(this, "getLastSuccessfulSyncTime", "Getting Last Successful Sync Time", null, error);
            });
    }

    public setLastSuccessfulSyncTime(staleTime: number): Promise<void> {
        return this._storage.set<number>(StorageConstants.HEMA_INIT_SETTINGS,
            StorageConstants.HEMA_REFERENCE_STALE_TIME, staleTime)
            .catch((error) => {
                throw new BusinessException(this, "setLastSuccessfulSyncTime", "Setting Last Successful Sync Time", null, error);
            });
    }

    public getResilienceRetryPayloads(containerName: string): RetryPayload[] {
        try {
            let data = this._syncStorage.getSynchronous<RetryPayload[]>(containerName, "RETRY_PAYLOADS");
            data = data || [];
            return data.map(d => RetryPayload.fromJson(d));
        } catch (error) {
            throw new BusinessException(this, "resilienceRetryPayloads", "Getting resilience payloads", null, error);
        }
    }

    public setResilienceRetryPayloads(containerName: string, retryPayloads: RetryPayload[]): void {
        try {
            return this._syncStorage.setSynchronous<RetryPayload[]>(containerName, StorageConstants.HEMA_RETRY_PAYLOADS, retryPayloads);
        } catch (error) {
            throw new BusinessException(this, "setResilienceRetryPayloads", "Setting resilience payloads", null, error);
        }
    }

    public userSettingsComplete(): Promise<boolean> {
        return Promise.all([
            this.getUserPatch(),
            this.getWorkingSector(),
            this.getUserRegion()
        ])
            .then((vals) => {
                return vals[0] !== undefined && vals[1] !== undefined && vals[2] !== undefined;
            });
    }

    public getFeatureToggleList(): Promise<{ [featureName: string]: boolean }> {
        return this._storage.get<{ [featureName: string]: boolean }>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_FEATURE_TOGGLE_LIST)
            .catch((error) => {
                throw new BusinessException(this, "getFeatureToggleList", "Getting Feature Toggle List ", null, error);
            });
    }

    public setFeatureToggleList(featureToggleList: { [featureName: string]: boolean }): Promise<void> {
        return this._storage.set<{ [featureName: string]: boolean }>(StorageConstants.HEMA_STORAGE_CONTAINER,
            StorageConstants.HEMA_FEATURE_TOGGLE_LIST, featureToggleList)
            .catch((error) => {
                throw new BusinessException(this, "setFeatureToggleList", "Setting Feature Toggle List", null, error);
            });
    }

    public getMaterialHighValueTools(): MaterialHighValueTools {
        try {
            return this._syncStorage.getSynchronous<MaterialHighValueTools>(StorageConstants.HEMA_STORAGE_CONTAINER, StorageConstants.HEMA_STORAGE_MATERIAL_HIGHVALUETOOLS);
        } catch (error) {
            throw new BusinessException(this, "getMaterials", "Getting high value tools", null, error);
        }
    }

    public setMaterialHighValueTools(materialHighValueTools: MaterialHighValueTools): void {
        try {
            this._syncStorage.setSynchronous<MaterialHighValueTools>(StorageConstants.HEMA_STORAGE_CONTAINER, StorageConstants.HEMA_STORAGE_MATERIAL_HIGHVALUETOOLS, materialHighValueTools);
        } catch (error) {
            throw new BusinessException(this, "setMaterials", "Setting high value tools", null, error);
        }
    }

    public getMaterials(): Materials {
        try {
            return this._syncStorage.getSynchronous<Materials>(StorageConstants.HEMA_STORAGE_CONTAINER, StorageConstants.HEMA_STORAGE_MATERIAL_VANSTOCK);
        } catch (error) {
            throw new BusinessException(this, "getMaterials", "Getting materials", null, error);
        }
    }

    public setMaterials(materials: Materials): void {
        try {
            this._syncStorage.setSynchronous<Materials>(StorageConstants.HEMA_STORAGE_CONTAINER, StorageConstants.HEMA_STORAGE_MATERIAL_VANSTOCK, materials);
        } catch (error) {
            throw new BusinessException(this, "setMaterials", "Setting materials", null, error);
        }
    }

    public getMaterialAdjustments(): MaterialAdjustments {
        try {
            return this._syncStorage.getSynchronous<MaterialAdjustments>(StorageConstants.HEMA_STORAGE_CONTAINER, StorageConstants.HEMA_STORAGE_MATERIAL_ADJUSTMENTS);
        } catch (error) {
            throw new BusinessException(this, "getMaterialAdjustments", "Getting material adjustments", null, error);
        }
    }

    public setMaterialAdjustments(materialAdjustments: MaterialAdjustments): void {
        try {
            this._syncStorage.setSynchronous<MaterialAdjustments>(StorageConstants.HEMA_STORAGE_CONTAINER, StorageConstants.HEMA_STORAGE_MATERIAL_ADJUSTMENTS, materialAdjustments);
        } catch (error) {
            throw new BusinessException(this, "setMaterialAdjustments", "Setting material adjustments", null, error);
        }
    }

    public getMaterialSearchResults(): MaterialSearchResults {
        try {
            return this._syncStorage.getSynchronous<MaterialSearchResults>(StorageConstants.HEMA_STORAGE_CONTAINER, StorageConstants.HEMA_STORAGE_MATERIAL_SEARCHRESULTS);
        } catch (error) {
            throw new BusinessException(this, "getMaterialSearchResults", "Getting search results", null, error);
        }
    }

    public setMaterialSearchResults(materialSearchResults: MaterialSearchResults): void {
        try {
            return this._syncStorage.setSynchronous<MaterialSearchResults>(StorageConstants.HEMA_STORAGE_CONTAINER, StorageConstants.HEMA_STORAGE_MATERIAL_SEARCHRESULTS, materialSearchResults);
        } catch (error) {
            throw new BusinessException(this, "setMaterialSearchResults", "Setting search results", null, error);
        }
    }

    public getLastKnownLocation(): GeoPosition {
        try {
            return this._syncStorage.getSynchronous<GeoPosition>(StorageConstants.HEMA_STORAGE_CONTAINER, StorageConstants.HEMA_STORAGE_LAST_KNOWN_LOCATION);
        } catch (error) {
            throw new BusinessException(this, "getLastKnownLocation", "Getting last known location", null, error);
        }
    }

    public setLastKnownLocation(location: GeoPosition): void {
        try {
            return this._syncStorage.setSynchronous<GeoPosition>(StorageConstants.HEMA_STORAGE_CONTAINER, StorageConstants.HEMA_STORAGE_LAST_KNOWN_LOCATION, location);
        } catch (error) {
            throw new BusinessException(this, "setLastKnownLocation", "Setting last known location", null, error);
        }
    }    
}
