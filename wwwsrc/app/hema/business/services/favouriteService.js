var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../models/favouriteList", "../models/part", "./storageService", "../../business/services/consumableService", "./partService", "./jobService", "./businessRuleService", "../models/businessException"], function (require, exports, aurelia_framework_1, favouriteList_1, part_1, storageService_1, consumableService_1, partService_1, jobService_1, businessRuleService_1, businessException_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import * as bignumber from "bignumber";
    var FavouriteService = /** @class */ (function () {
        function FavouriteService(storageService, jobService, consumableService, partService, businessRuleService) {
            var _this = this;
            this._storageService = storageService;
            this._jobService = jobService;
            this._consumablesService = consumableService;
            this._partService = partService;
            this._businessRuleService = businessRuleService;
            // todo promise in contructor??
            this.getFavouritesList().then(function (favouriteList) {
                _this.favouritesList = favouriteList;
            });
        }
        FavouriteService.prototype.addFavouriteConsumablePart = function (favouriteItem) {
            return this.addFavourite(favouriteItem, "ConsumablePart");
        };
        FavouriteService.prototype.addFavouritePart = function (favouriteItem) {
            return this.addFavourite(favouriteItem, "Part");
        };
        FavouriteService.prototype.removeFavourite = function (index) {
            this.favouritesList.favourites.splice(index, 1);
            return this.saveFavouritesList();
        };
        FavouriteService.prototype.reOrder = function (favouriteItem, isPart) {
            var _this = this;
            if (!isPart) {
                return this._consumablesService.addConsumableToBasket(favouriteItem).then(function () { return Promise.resolve(); });
            }
            return this._businessRuleService.getQueryableRuleGroup("partsBasket")
                .then(function (ruleGroup) {
                if (ruleGroup) {
                    var partOrderStatus_1 = ruleGroup.getBusinessRule("partOrderStatus");
                    if (partOrderStatus_1) {
                        return _this._jobService.getActiveJobId()
                            .then(function (jobId) {
                            return _this._partService.getPartsBasket(jobId)
                                .then(function (basket) {
                                favouriteItem.partOrderStatus = partOrderStatus_1;
                                favouriteItem.isMainPart = false;
                                favouriteItem.isFavourite = true;
                                basket.partsToOrder.push(favouriteItem);
                                return _this._partService.savePartsBasket(jobId, basket)
                                    .then(function () { return _this._partService.setPartsRequiredForTask(jobId); })
                                    .thenReturn();
                            });
                        });
                    }
                    else {
                        throw new businessException_1.BusinessException(_this, "FavouriteService.reOrder", "business rule group missing", null, null);
                    }
                }
                else {
                    throw new businessException_1.BusinessException(_this, "FavouriteService.reOrder", "business rule missing", null, null);
                }
            });
        };
        FavouriteService.prototype.getFavouritesList = function () {
            var _this = this;
            return this._storageService.getFavouritesList().then(function (favouritesList) {
                if (favouritesList) {
                    // hydrate
                    var newFavourites = favouritesList.favourites.map(function (f) {
                        if (!f || !Object.keys(f).some(function (p) { return p === "price"; })) {
                            return f;
                        }
                        return part_1.Part.fromJson(f);
                    });
                    return _this.favouritesList = __assign({}, favouritesList, { favourites: newFavourites });
                }
                else {
                    return new favouriteList_1.FavouriteList();
                }
            });
        };
        FavouriteService.prototype.addFavourite = function (favouriteItem, type) {
            var _this = this;
            return this.getFavouritesList().then(function (favouriteList) {
                var faveItem = JSON.parse(JSON.stringify(favouriteItem));
                var foundPart = favouriteList.favourites.findIndex(function (favePart) { return favePart.description === faveItem.description; });
                if (foundPart === -1) {
                    faveItem.quantity = 1;
                    if (type === "Part") {
                        // clear down any warranty information
                        if (faveItem.warrantyReturn) {
                            faveItem.warrantyReturn.isWarrantyReturn = undefined;
                            faveItem.warrantyReturn.quantityToClaimOrReturn = 1;
                            faveItem.warrantyReturn.reasonForClaim = undefined;
                            faveItem.warrantyReturn.removedPartStockReferenceId = undefined;
                        }
                        faveItem.isMainPart = undefined;
                        faveItem.partOrderStatus = undefined;
                        faveItem.taskId = undefined;
                    }
                    _this.favouritesList.favourites.push(faveItem);
                    return _this.saveFavouritesList();
                }
                else {
                    return Promise.resolve();
                }
            });
        };
        FavouriteService.prototype.saveFavouritesList = function () {
            return this._storageService.setFavouritesList(this.favouritesList);
        };
        FavouriteService = __decorate([
            aurelia_framework_1.inject(storageService_1.StorageService, jobService_1.JobService, consumableService_1.ConsumableService, partService_1.PartService, businessRuleService_1.BusinessRuleService),
            __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
        ], FavouriteService);
        return FavouriteService;
    }());
    exports.FavouriteService = FavouriteService;
});

//# sourceMappingURL=favouriteService.js.map
