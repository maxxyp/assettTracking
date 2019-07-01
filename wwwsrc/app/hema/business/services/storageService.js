var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../constants/storageConstants", "../models/job", "../models/businessException", "../../core/services/hemaStorage", "../../../common/resilience/models/retryPayload"], function (require, exports, aurelia_framework_1, storageConstants_1, job_1, businessException_1, hemaStorage_1, retryPayload_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StorageService = /** @class */ (function () {
        function StorageService(storage, syncStorage) {
            this._storage = storage;
            this._syncStorage = syncStorage;
        }
        StorageService.prototype.deleteEngineer = function () {
            var _this = this;
            return this.setJobsToDo(null)
                .then(function () { return _this.setPartsCollections(null); })
                .then(function () { return _this.setWorkListJobApiFailures(null); })
                .then(function () { return _this.setEngineer(null); });
        };
        StorageService.prototype.getWorkListJobs = function () {
            var _this = this;
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_ALL_WORK_JOBS)
                .then(function (data) {
                data = data || [];
                return data.map(function (d) { return job_1.Job.fromJson(d); });
            })
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getWorkListJobs", "Getting work list", null, error);
            });
        };
        StorageService.prototype.setWorkListJobs = function (jobs) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_ALL_WORK_JOBS, jobs)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "setWorkListJobs", "Setting work list", null, error);
            });
        };
        StorageService.prototype.getPartsCollections = function () {
            var _this = this;
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_ALL_PARTSCOLLECTIONS)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getPartsCollections", "Getting work list parts collections", null, error);
            });
        };
        StorageService.prototype.setPartsCollections = function (partsCollections) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_ALL_PARTSCOLLECTIONS, partsCollections)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "setPartsCollections", "Setting work list parts collections", null, error);
            });
        };
        StorageService.prototype.getWorkListJobApiFailures = function () {
            var _this = this;
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_ALL_WORK_JOB_API_ERRORS)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getWorkListJobApiFailures", "Getting work list", null, error);
            });
        };
        StorageService.prototype.setWorkListJobApiFailures = function (jobApiFailuress) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_ALL_WORK_JOB_API_ERRORS, jobApiFailuress)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getWorkListJobApiFailures", "Setting work list", null, error);
            });
        };
        StorageService.prototype.getJobsToDo = function () {
            var _this = this;
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_ALL_JOBS)
                .then(function (data) {
                data = data || [];
                return data.map(function (d) { return job_1.Job.fromJson(d); });
            })
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getJobsToDo", "Getting job to do", null, error);
            });
        };
        StorageService.prototype.setJobsToDo = function (jobs) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_ALL_JOBS, jobs)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "setJobsToDo", "Setting job to do", null, error);
            });
        };
        StorageService.prototype.getMessages = function () {
            var _this = this;
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_MESSAGES)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getMessages", "Getting messages", null, error);
            });
        };
        StorageService.prototype.setMessages = function (messages) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_MESSAGES, messages)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "setMessages", "Setting messages", null, error);
            });
        };
        StorageService.prototype.getFavouritesList = function () {
            var _this = this;
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_FAVOURITES_LIST)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getFavouritesList", "Getting Favourite List ", null, error);
            });
        };
        StorageService.prototype.setFavouritesList = function (favouriteList) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_FAVOURITES_LIST, favouriteList)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "setFavouritesList", "Setting Favourite List", null, error);
            });
        };
        StorageService.prototype.getConsumablePartsBasket = function () {
            var _this = this;
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_CONSUMABLE_PARTS_BASKET)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getConsumablePartsBasket", "Getting consumable parts basket", null, error);
            });
        };
        StorageService.prototype.setConsumablePartsBasket = function (basket) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_CONSUMABLE_PARTS_BASKET, basket)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "setConsumablePartsBasket", "Setting consumable parts basket", null, error);
            });
        };
        StorageService.prototype.setConsumablesRead = function (read) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_CONSUMABLE_UPDATES_READ, read)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "setConsumablesRead", "Setting consumable read", null, error);
            });
        };
        StorageService.prototype.getConsumablesRead = function () {
            var _this = this;
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_CONSUMABLE_UPDATES_READ)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getConsumableRead", "Getting consumable read", null, error);
            });
        };
        StorageService.prototype.getEngineer = function () {
            var _this = this;
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_ENGINEER)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getEngineer", "Getting engineer", null, error);
            });
        };
        StorageService.prototype.setEngineer = function (engineer) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_ENGINEER, engineer)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "setEngineer", "Setting engineer", null, error);
            });
        };
        StorageService.prototype.getUserPatch = function () {
            var _this = this;
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_USER_SETTINGS, storageConstants_1.StorageConstants.HEMA_USER_PATCH)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getUserPatch", "Getting user Patch", null, error);
            });
        };
        StorageService.prototype.setUserPatch = function (userPatch) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_USER_SETTINGS, storageConstants_1.StorageConstants.HEMA_USER_PATCH, userPatch)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "setUserPatch", "Setting user patch", null, error);
            });
        };
        StorageService.prototype.getUserRegion = function () {
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_USER_SETTINGS, storageConstants_1.StorageConstants.HEMA_USER_REGION);
        };
        StorageService.prototype.setUserRegion = function (region) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_USER_SETTINGS, storageConstants_1.StorageConstants.HEMA_USER_REGION, region)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "setUserRegion", "Setting user region", null, error);
            });
        };
        StorageService.prototype.getWorkingSector = function () {
            var _this = this;
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_USER_SETTINGS, storageConstants_1.StorageConstants.HEMA_SECTOR)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getWorkingSector", "Getting working sector", null, error);
            });
        };
        StorageService.prototype.setWorkingSector = function (workingSector) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_USER_SETTINGS, storageConstants_1.StorageConstants.HEMA_SECTOR, workingSector)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "setWorkingSector", "Setting Working Sector", null, error);
            });
        };
        StorageService.prototype.getAppSettings = function () {
            var _this = this;
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_APPLICATION_SETTINGS, storageConstants_1.StorageConstants.HEMA_APP_SETTINGS).then(function (settingsString) {
                return settingsString ? JSON.parse(settingsString) : undefined;
            })
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getAppSettings", "Getting Application Settings", null, error);
            });
        };
        StorageService.prototype.setAppSettings = function (appSettings) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_APPLICATION_SETTINGS, storageConstants_1.StorageConstants.HEMA_APP_SETTINGS, appSettings ? JSON.stringify(appSettings) : undefined)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "setAppSettings", "Setting Application Settings", null, error);
            });
        };
        StorageService.prototype.getSimulationEngineer = function () {
            var _this = this;
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_SIMULATION_SETTINGS, storageConstants_1.StorageConstants.HEMA_SIMULATION_ENGINEER)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getSimulationEngineer", "Getting Simulation Engineer", null, error);
            });
        };
        StorageService.prototype.setSimulationEngineer = function (engineerId) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_SIMULATION_SETTINGS, storageConstants_1.StorageConstants.HEMA_SIMULATION_ENGINEER, engineerId)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "setSimulationEngineer", "Setting Simulation Engineer", null, error);
            });
        };
        StorageService.prototype.getLastSuccessfulSyncTime = function () {
            var _this = this;
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_INIT_SETTINGS, storageConstants_1.StorageConstants.HEMA_REFERENCE_STALE_TIME)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getLastSuccessfulSyncTime", "Getting Last Successful Sync Time", null, error);
            });
        };
        StorageService.prototype.setLastSuccessfulSyncTime = function (staleTime) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_INIT_SETTINGS, storageConstants_1.StorageConstants.HEMA_REFERENCE_STALE_TIME, staleTime)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "setLastSuccessfulSyncTime", "Setting Last Successful Sync Time", null, error);
            });
        };
        StorageService.prototype.getResilienceRetryPayloads = function (containerName) {
            try {
                var data = this._syncStorage.getSynchronous(containerName, "RETRY_PAYLOADS");
                data = data || [];
                return data.map(function (d) { return retryPayload_1.RetryPayload.fromJson(d); });
            }
            catch (error) {
                throw new businessException_1.BusinessException(this, "resilienceRetryPayloads", "Getting resilience payloads", null, error);
            }
        };
        StorageService.prototype.setResilienceRetryPayloads = function (containerName, retryPayloads) {
            try {
                return this._syncStorage.setSynchronous(containerName, storageConstants_1.StorageConstants.HEMA_RETRY_PAYLOADS, retryPayloads);
            }
            catch (error) {
                throw new businessException_1.BusinessException(this, "setResilienceRetryPayloads", "Setting resilience payloads", null, error);
            }
        };
        StorageService.prototype.userSettingsComplete = function () {
            return Promise.all([
                this.getUserPatch(),
                this.getWorkingSector(),
                this.getUserRegion()
            ])
                .then(function (vals) {
                return vals[0] !== undefined && vals[1] !== undefined && vals[2] !== undefined;
            });
        };
        StorageService.prototype.getFeatureToggleList = function () {
            var _this = this;
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_FEATURE_TOGGLE_LIST)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "getFeatureToggleList", "Getting Feature Toggle List ", null, error);
            });
        };
        StorageService.prototype.setFeatureToggleList = function (featureToggleList) {
            var _this = this;
            return this._storage.set(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_FEATURE_TOGGLE_LIST, featureToggleList)
                .catch(function (error) {
                throw new businessException_1.BusinessException(_this, "setFeatureToggleList", "Setting Feature Toggle List", null, error);
            });
        };
        StorageService.prototype.getMaterialHighValueTools = function () {
            try {
                return this._syncStorage.getSynchronous(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_MATERIAL_HIGHVALUETOOLS);
            }
            catch (error) {
                throw new businessException_1.BusinessException(this, "getMaterials", "Getting high value tools", null, error);
            }
        };
        StorageService.prototype.setMaterialHighValueTools = function (materialHighValueTools) {
            try {
                this._syncStorage.setSynchronous(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_MATERIAL_HIGHVALUETOOLS, materialHighValueTools);
            }
            catch (error) {
                throw new businessException_1.BusinessException(this, "setMaterials", "Setting high value tools", null, error);
            }
        };
        StorageService.prototype.getMaterials = function () {
            try {
                return this._syncStorage.getSynchronous(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_MATERIAL_VANSTOCK);
            }
            catch (error) {
                throw new businessException_1.BusinessException(this, "getMaterials", "Getting materials", null, error);
            }
        };
        StorageService.prototype.setMaterials = function (materials) {
            try {
                this._syncStorage.setSynchronous(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_MATERIAL_VANSTOCK, materials);
            }
            catch (error) {
                throw new businessException_1.BusinessException(this, "setMaterials", "Setting materials", null, error);
            }
        };
        StorageService.prototype.getMaterialAdjustments = function () {
            try {
                return this._syncStorage.getSynchronous(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_MATERIAL_ADJUSTMENTS);
            }
            catch (error) {
                throw new businessException_1.BusinessException(this, "getMaterialAdjustments", "Getting material adjustments", null, error);
            }
        };
        StorageService.prototype.setMaterialAdjustments = function (materialAdjustments) {
            try {
                this._syncStorage.setSynchronous(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_MATERIAL_ADJUSTMENTS, materialAdjustments);
            }
            catch (error) {
                throw new businessException_1.BusinessException(this, "setMaterialAdjustments", "Setting material adjustments", null, error);
            }
        };
        StorageService.prototype.getMaterialSearchResults = function () {
            try {
                return this._syncStorage.getSynchronous(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_MATERIAL_SEARCHRESULTS);
            }
            catch (error) {
                throw new businessException_1.BusinessException(this, "getMaterialSearchResults", "Getting search results", null, error);
            }
        };
        StorageService.prototype.setMaterialSearchResults = function (materialSearchResults) {
            try {
                return this._syncStorage.setSynchronous(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_MATERIAL_SEARCHRESULTS, materialSearchResults);
            }
            catch (error) {
                throw new businessException_1.BusinessException(this, "setMaterialSearchResults", "Setting search results", null, error);
            }
        };
        StorageService.prototype.getLastKnownLocation = function () {
            try {
                return this._syncStorage.getSynchronous(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_LAST_KNOWN_LOCATION);
            }
            catch (error) {
                throw new businessException_1.BusinessException(this, "getLastKnownLocation", "Getting last known location", null, error);
            }
        };
        StorageService.prototype.setLastKnownLocation = function (location) {
            try {
                return this._syncStorage.setSynchronous(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_STORAGE_LAST_KNOWN_LOCATION, location);
            }
            catch (error) {
                throw new businessException_1.BusinessException(this, "setLastKnownLocation", "Setting last known location", null, error);
            }
        };
        StorageService = __decorate([
            aurelia_framework_1.inject(hemaStorage_1.HemaStorage, hemaStorage_1.HemaStorage),
            __metadata("design:paramtypes", [Object, Object])
        ], StorageService);
        return StorageService;
    }());
    exports.StorageService = StorageService;
});

//# sourceMappingURL=storageService.js.map
