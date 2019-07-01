var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../../models/baseViewModel", "../../../business/services/consumableService", "../../../business/models/consumablesBasket", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "moment"], function (require, exports, aurelia_framework_1, baseViewModel_1, consumableService_1, consumablesBasket_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConsumablesHistory = /** @class */ (function (_super) {
        __extends(ConsumablesHistory, _super);
        function ConsumablesHistory(labelService, eventAggregator, dialogService, consumableService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this.consumableService = consumableService;
            return _this;
        }
        ConsumablesHistory.prototype.activateAsync = function () {
            var _this = this;
            this.consumablesBasket = new consumablesBasket_1.ConsumablesBasket();
            return this.consumableService.clearOldOrders(60).then(function () {
                _this.consumableService.getConsumablesBasket().then(function (partsBasket) {
                    partsBasket.partsInBasket.forEach(function (part) {
                        part.dateAdded = moment(part.dateAdded).format("YYYY-MM-DD");
                    });
                    _this.consumablesBasket = partsBasket;
                    _this.showContent();
                });
            });
        };
        ConsumablesHistory.prototype.reOrder = function (partItem) {
            // mark confimed that a reorder part item quantity from order-history will always be one - defect DF_1350
            // quantity can be changed in the consumable-basket view before placing an order.
            var part = {
                referenceId: partItem.referenceId,
                description: partItem.description,
                quantity: 1
            };
            this.consumableService.addConsumableToBasket(part);
        };
        ConsumablesHistory = __decorate([
            aurelia_framework_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, consumableService_1.ConsumableService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object])
        ], ConsumablesHistory);
        return ConsumablesHistory;
    }(baseViewModel_1.BaseViewModel));
    exports.ConsumablesHistory = ConsumablesHistory;
});

//# sourceMappingURL=consumablesHistory.js.map
