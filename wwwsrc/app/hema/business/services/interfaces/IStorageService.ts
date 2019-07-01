import {Job} from "../../models/job";
import {JobApiFailure} from "../../models/jobApiFailure";
import {Message} from "../../models/message";
import {Engineer} from "../../models/engineer";
import {ApplicationSettings} from "../../../business/models/applicationSettings";
import { ConsumablesBasket as ConsumablePartsBasket } from "../../../business/models/consumablesBasket";
import { FavouriteList } from "../../models/favouriteList";
import { RetryPayload } from "../../../../common/resilience/models/retryPayload";
import { JobPartsCollection } from "../../models/jobPartsCollection";
import { MaterialAdjustments } from "../../models/materialAdjustments";
import { Materials } from "../../models/materials";
import { MaterialSearchResults } from "../../models/materialSearchResults";
import { MaterialHighValueTools } from "../../models/materialHighValueTools";
import { GeoPosition } from "../../../../common/geo/models/geoPosition";

export interface IStorageService {
    getWorkListJobs(): Promise<Job[]>;
    setWorkListJobs(jobs: Job[]): Promise<void>;

    getPartsCollections(): Promise<JobPartsCollection[]>;
    setPartsCollections(partsCollections: JobPartsCollection[]): Promise<void>;

    getWorkListJobApiFailures(): Promise<JobApiFailure[]>;
    setWorkListJobApiFailures(jobApiFailures: JobApiFailure[]): Promise<void>;

    getJobsToDo(): Promise<Job[]>;
    setJobsToDo(jobs: Job[]): Promise<void>;

    getMessages(): Promise<Message[]>;
    setMessages(messages: Message[]): Promise<void>;

    getEngineer(): Promise<Engineer>;
    setEngineer(engineer: Engineer): Promise<void>;
    deleteEngineer(): Promise<void>;

    getUserPatch(): Promise<string>;
    setUserPatch(userPatch: string): Promise<void>;

    getUserRegion(): Promise<string>;
    setUserRegion(region: string): Promise<void>;

    getWorkingSector(): Promise<string>;
    setWorkingSector(workingSector: string): Promise<void>;

    getFavouritesList(): Promise<FavouriteList>;
    setFavouritesList(favouriteList: FavouriteList): Promise<void>;

    getConsumablePartsBasket(): Promise<ConsumablePartsBasket>;
    setConsumablePartsBasket(basket: ConsumablePartsBasket): Promise<void>;

    getConsumablesRead(): Promise<boolean>;
    setConsumablesRead(read: boolean): Promise<void>;

    getAppSettings(): Promise<ApplicationSettings>;
    setAppSettings(appSettings: ApplicationSettings): Promise<void>;

    getSimulationEngineer(): Promise<string>;
    setSimulationEngineer(engineerId: string): Promise<void>;

    getLastSuccessfulSyncTime() : Promise<number>;
    setLastSuccessfulSyncTime(syncTime: number): Promise<void>;

    userSettingsComplete(): Promise<boolean>;

    getResilienceRetryPayloads(containerName: string): RetryPayload[];
    setResilienceRetryPayloads(containerName: string, retryPayloads: RetryPayload[]) : void;

    getFeatureToggleList(): Promise<{[featureName: string]: boolean}>;
    setFeatureToggleList(featureToggleList: {[featureName: string]: boolean}): Promise<void>;

    getMaterialHighValueTools(): MaterialHighValueTools;
    setMaterialHighValueTools(materialHighValueTools: MaterialHighValueTools): void;

    getMaterials(): Materials;
    setMaterials(materials: Materials): void;

    getMaterialAdjustments(): MaterialAdjustments;
    setMaterialAdjustments(materialAdjustments: MaterialAdjustments): void;

    getMaterialSearchResults(): MaterialSearchResults;
    setMaterialSearchResults(materialSearchResults: MaterialSearchResults): void;

    getLastKnownLocation(): GeoPosition;
    setLastKnownLocation(location: GeoPosition): void;
}
