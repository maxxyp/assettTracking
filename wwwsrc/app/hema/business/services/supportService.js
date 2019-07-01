var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../../core/services/hemaStorage", "./constants/jobServiceConstants", "aurelia-event-aggregator", "../constants/storageConstants"], function (require, exports, aurelia_framework_1, hemaStorage_1, jobServiceConstants_1, aurelia_event_aggregator_1, storageConstants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SupportService = /** @class */ (function () {
        function SupportService(storage, eventAggregator) {
            var _this = this;
            this._storage = storage;
            this._eventAggregator = eventAggregator;
            this._eventAggregator.subscribe(jobServiceConstants_1.JobServiceConstants.JOB_COMPLETED, function (jobUpdate) {
                _this._storage.set(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_SOTRAGE_LAST_JOB_UPDATE, jobUpdate);
            });
        }
        SupportService.prototype.getLastJobUpdate = function () {
            return this._storage.get(storageConstants_1.StorageConstants.HEMA_STORAGE_CONTAINER, storageConstants_1.StorageConstants.HEMA_SOTRAGE_LAST_JOB_UPDATE);
        };
        SupportService = __decorate([
            aurelia_framework_1.inject(hemaStorage_1.HemaStorage, aurelia_event_aggregator_1.EventAggregator),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator])
        ], SupportService);
        return SupportService;
    }());
    exports.SupportService = SupportService;
});

//# sourceMappingURL=supportService.js.map
