var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../models/consumablesBasket", "../models/consumablePart", "./storageService", "../../api/services/fftService", "./engineerService", "aurelia-event-aggregator", "./constants/consumableServiceConstants", "moment"], function (require, exports, aurelia_framework_1, consumablesBasket_1, consumablePart_1, storageService_1, fftService_1, engineerService_1, aurelia_event_aggregator_1, consumableServiceConstants_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConsumableService = /** @class */ (function () {
        function ConsumableService(storageService, fftService, engineerService, eventAggregator) {
            this._storageService = storageService;
            this._fftService = fftService;
            this._engineerService = engineerService;
            this._eventAggregator = eventAggregator;
        }
        ConsumableService.prototype.getConsumablesBasket = function () {
            return this._storageService.getConsumablePartsBasket().then(function (basket) {
                if (basket) {
                    basket.partsInBasket = basket.partsInBasket.sort(function (a, b) {
                        return (a.dateAdded <= b.dateAdded ? 1 : -1);
                    });
                    return basket;
                }
                else {
                    return new consumablesBasket_1.ConsumablesBasket();
                }
            });
        };
        ConsumableService.prototype.placeOrder = function (consumablesPartsBasket) {
            var _this = this;
            var engineer;
            var consumablesOrderItems;
            var orderItems = [];
            return this._engineerService.getCurrentEngineer()
                .then(function (signedOnEngineer) {
                engineer = signedOnEngineer;
            }).then(function () {
                consumablesOrderItems = consumablesPartsBasket.partsInBasket.filter(function (part) { return part.sent === false; });
                consumablesOrderItems.forEach(function (item) {
                    orderItems.push({ stockReferenceId: item.referenceId, quantityOrdered: item.quantity });
                });
                var orderConsumables = {
                    engineerId: engineer.id,
                    consumables: orderItems
                };
                var orderConsumablesRequest = {
                    data: orderConsumables
                };
                // order comsumables is a critical packet so always returns success. failed packets are queued. so no need to wait for the promise to resolve.
                _this._fftService.orderConsumables(engineer.id, orderConsumablesRequest);
                consumablesPartsBasket = _this.setProcessedOrderItemsToSent(consumablesPartsBasket);
                _this._eventAggregator.publish(consumableServiceConstants_1.ConsumableServiceConstants.CONSUMABLE_ADDED, 0);
                _this.saveBasket(consumablesPartsBasket);
                return consumablesPartsBasket;
            });
        };
        ConsumableService.prototype.removeConsumableFromBasket = function (referenceId) {
            var _this = this;
            return this.getConsumablesBasket().then(function (basket) {
                var existingBasketPart = basket.partsInBasket.find(function (a) { return a.referenceId === referenceId && a.sent === false; });
                if (existingBasketPart) {
                    basket.partsInBasket.splice(basket.partsInBasket.indexOf(existingBasketPart), 1);
                }
                _this.saveBasket(basket);
                _this.orderItemCount().then(function (total) { return _this._eventAggregator.publish(consumableServiceConstants_1.ConsumableServiceConstants.CONSUMABLE_ADDED, total); });
                return basket;
            });
        };
        ConsumableService.prototype.addConsumableToBasket = function (part) {
            var _this = this;
            return this.getConsumablesBasket().then(function (basket) {
                // check to see if the part exists already and is not deleted or sent
                var foundPart = basket.partsInBasket.findIndex(function (basketPart) { return basketPart.referenceId === part.referenceId && basketPart.sent === false && basketPart.deleted === false; });
                if (foundPart > -1) {
                    // found..  add to it
                    basket.partsInBasket[foundPart].quantity = basket.partsInBasket[foundPart].quantity + part.quantity;
                }
                else {
                    // no part found just push to basket
                    basket.partsInBasket.push(new consumablePart_1.ConsumablePart(part.referenceId, part.description, part.quantity));
                }
                _this.saveBasket(basket);
                _this.orderItemCount().then(function (total) { return _this._eventAggregator.publish(consumableServiceConstants_1.ConsumableServiceConstants.CONSUMABLE_ADDED, total); });
                return basket;
            });
        };
        ConsumableService.prototype.saveBasket = function (basket) {
            return this._storageService.setConsumablePartsBasket(basket);
        };
        ConsumableService.prototype.addFavourite = function (part) {
            var _this = this;
            return this.getConsumablesBasket().then(function (basket) {
                var foundPart = basket.favourites.findIndex(function (basketPart) { return basketPart.referenceId === part.referenceId; });
                if (foundPart === -1) {
                    basket.favourites.push(part);
                    _this.saveBasket(basket);
                }
                return basket;
            });
        };
        ConsumableService.prototype.removeFavourite = function (itemIndex) {
            var _this = this;
            return this.getConsumablesBasket().then(function (basket) {
                basket.favourites.splice(itemIndex, 1);
                _this.saveBasket(basket);
                return basket;
            });
        };
        ConsumableService.prototype.orderItemCount = function () {
            var total = 0;
            return this.getConsumablesBasket().then(function (basket) {
                basket.partsInBasket.filter(function (p) { return p.sent === false; }).forEach(function (part) {
                    total += part.quantity;
                });
                return total;
            });
        };
        ConsumableService.prototype.clearOldOrders = function (daysOld) {
            var _this = this;
            var today = new Date().getTime();
            var remainder;
            return this.getConsumablesBasket().then(function (basket) {
                var filteredParts = basket.partsInBasket.filter(function (pib) {
                    var dateAdded = moment(pib.dateAdded).toDate();
                    remainder = today - dateAdded.getTime();
                    remainder = remainder / (1000 * 60 * 60 * 24);
                    if ((remainder < daysOld && pib.sent === true) || pib.sent === false) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                basket.partsInBasket = filteredParts;
                _this.saveBasket(basket);
                return basket;
            });
        };
        ConsumableService.prototype.setProcessedOrderItemsToSent = function (basket) {
            for (var i = 0; i < basket.partsInBasket.length; i++) {
                basket.partsInBasket[i].sent = true;
                basket.partsInBasket[i].favourite = false;
            }
            return basket;
        };
        ConsumableService = __decorate([
            aurelia_framework_1.inject(storageService_1.StorageService, fftService_1.FftService, engineerService_1.EngineerService, aurelia_event_aggregator_1.EventAggregator),
            __metadata("design:paramtypes", [Object, Object, Object, aurelia_event_aggregator_1.EventAggregator])
        ], ConsumableService);
        return ConsumableService;
    }());
    exports.ConsumableService = ConsumableService;
});

//# sourceMappingURL=consumableService.js.map
