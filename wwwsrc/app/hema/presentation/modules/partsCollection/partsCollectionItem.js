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
define(["require", "exports", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "aurelia-framework", "../../models/baseViewModel"], function (require, exports, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, aurelia_framework_1, baseViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PartsCollectionItem = /** @class */ (function (_super) {
        __extends(PartsCollectionItem, _super);
        function PartsCollectionItem(labelService, eventAggregator, dialogService) {
            return _super.call(this, labelService, eventAggregator, dialogService) || this;
        }
        PartsCollectionItem.prototype.activateAsync = function (params) {
            if (params) {
                this.viewModel = params.partDetails;
                this.isDone = params.isDone;
            }
            return Promise.resolve();
        };
        PartsCollectionItem = __decorate([
            aurelia_framework_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService])
        ], PartsCollectionItem);
        return PartsCollectionItem;
    }(baseViewModel_1.BaseViewModel));
    exports.PartsCollectionItem = PartsCollectionItem;
});

//# sourceMappingURL=partsCollectionItem.js.map
