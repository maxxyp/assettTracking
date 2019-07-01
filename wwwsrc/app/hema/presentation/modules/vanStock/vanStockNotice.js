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
define(["require", "exports", "../../models/baseViewModel", "../../../business/services/labelService", "aurelia-dependency-injection", "moment", "aurelia-dialog", "aurelia-event-aggregator"], function (require, exports, baseViewModel_1, labelService_1, aurelia_dependency_injection_1, moment, aurelia_dialog_1, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VanStockNotice = /** @class */ (function (_super) {
        __extends(VanStockNotice, _super);
        function VanStockNotice(labelService, eventAggregator, dialogService, controller) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this.controller = controller;
            return _this;
        }
        VanStockNotice.prototype.activateAsync = function (params) {
            var parts = [];
            this.part = params.part;
            this.jobId = params.jobId;
            parts.push(this.part);
            this.showContent();
            return Promise.resolve();
        };
        VanStockNotice.prototype.getYear = function (dt) {
            return moment(dt).format("YYYY");
        };
        VanStockNotice = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, aurelia_dialog_1.DialogController),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService,
                aurelia_dialog_1.DialogController])
        ], VanStockNotice);
        return VanStockNotice;
    }(baseViewModel_1.BaseViewModel));
    exports.VanStockNotice = VanStockNotice;
});

//# sourceMappingURL=vanStockNotice.js.map
