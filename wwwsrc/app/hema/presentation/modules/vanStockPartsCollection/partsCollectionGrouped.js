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
define(["require", "exports", "aurelia-dependency-injection", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "../../models/baseViewModel"], function (require, exports, aurelia_dependency_injection_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, baseViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PartsCollectionGrouped = /** @class */ (function (_super) {
        __extends(PartsCollectionGrouped, _super);
        function PartsCollectionGrouped(labelService, eventAggregator, dialogService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this.VANSTOCK_ID = "VANSTOCK_ID";
            _this.groups = {};
            _this.groupNames = [];
            return _this;
        }
        PartsCollectionGrouped.prototype.activateAsync = function (params) {
            var _this = this;
            if (!params) {
                return Promise.resolve();
            }
            var parts = params.parts, myVanAreas = params.myVanAreas;
            parts.forEach(function (m) {
                var _a = m.jobId, groupId = _a === void 0 ? _this.VANSTOCK_ID : _a; // undefined job id means van stock item
                if (_this.groups[groupId]) {
                    _this.groups[groupId].push(m);
                }
                else {
                    _this.groups[groupId] = [m];
                }
            });
            this.groupNames = Object.keys(this.groups);
            this.myVanAreas = myVanAreas;
            this.returns = params.returns;
            return Promise.resolve();
        };
        PartsCollectionGrouped = __decorate([
            aurelia_dependency_injection_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService])
        ], PartsCollectionGrouped);
        return PartsCollectionGrouped;
    }(baseViewModel_1.BaseViewModel));
    exports.PartsCollectionGrouped = PartsCollectionGrouped;
});

//# sourceMappingURL=partsCollectionGrouped.js.map
