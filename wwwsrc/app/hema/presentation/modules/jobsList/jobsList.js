/// <reference path="../../../../../typings/app.d.ts" />
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
define(["require", "exports", "aurelia-framework", "../../models/baseViewModel", "../../../business/services/labelService", "aurelia-event-aggregator", "aurelia-dialog", "../../../business/services/engineerService"], function (require, exports, aurelia_framework_1, baseViewModel_1, labelService_1, aurelia_event_aggregator_1, aurelia_dialog_1, engineerService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JobsList = /** @class */ (function (_super) {
        __extends(JobsList, _super);
        function JobsList(labelService, eventAggregator, dialogService, engineerService) {
            var _this = _super.call(this, labelService, eventAggregator, dialogService) || this;
            _this._engineerService = engineerService;
            return _this;
        }
        JobsList.prototype.configureRouter = function (config, childRouter) {
            this.router = childRouter;
            config.map(this.getChildRoutes());
        };
        JobsList.prototype.attachedAsync = function () {
            this.showContent();
            return Promise.resolve();
        };
        JobsList.prototype.getChildRoutes = function () {
            var _this = this;
            return [
                {
                    route: "",
                    navigationStrategy: function (instruction) {
                        // user should be shown the worklist or should be able to do request work irrespective of any engineer status (except End of day) if the user is signedon
                        return _this._engineerService.isSignedOn()
                            .then(function (isSignedOn) {
                            instruction.config.redirect = isSignedOn ? "to-do" : "not-working";
                        });
                    }
                },
                {
                    route: "not-working",
                    moduleId: "hema/presentation/modules/jobsList/notWorking",
                    name: "not-working",
                    title: "Not Working",
                    settings: {}
                },
                {
                    route: "to-do",
                    moduleId: "hema/presentation/modules/jobsList/todo",
                    name: "to-do",
                    nav: true,
                    title: "View Jobs To Do",
                    settings: {}
                },
                {
                    route: "attended",
                    moduleId: "hema/presentation/modules/jobsList/done",
                    name: "attended",
                    nav: true,
                    title: "View Jobs Done",
                    settings: {}
                },
                {
                    route: "attended/:jobId",
                    name: "doneJob",
                    moduleId: "hema/presentation/modules/jobDetails/jobDetails",
                    nav: false,
                    title: "Job Details",
                    settings: {
                        tabGroupParent: "attended"
                    }
                },
                {
                    route: "attended/parts-collection",
                    name: "donePartsCollectionDetails",
                    moduleId: "hema/presentation/modules/partsCollection/partsCollectionDetails",
                    nav: false,
                    title: "Parts Collection",
                    settings: {
                        tabGroupParent: "attended"
                    }
                },
                {
                    route: "to-do/:jobId",
                    name: "job",
                    moduleId: "hema/presentation/modules/jobDetails/jobDetails",
                    nav: false,
                    title: "Job Details",
                    settings: {
                        tabGroupParent: "to-do"
                    }
                },
                {
                    route: "parts-collection",
                    name: "partsCollectionDetails",
                    moduleId: "hema/presentation/modules/partsCollection/partsCollectionDetails",
                    nav: false,
                    title: "Parts Collection",
                    settings: {
                        tabGroupParent: "to-do"
                    }
                },
                {
                    route: "vanstock-parts-collection",
                    name: "vanStockPartsCollectionDetails",
                    moduleId: "hema/presentation/modules/vanStockPartsCollection/partsCollectionMain" +
                        "",
                    nav: false,
                    title: "Parts Collection",
                    settings: {
                        tabGroupParent: "to-do"
                    }
                }
            ];
        };
        JobsList = __decorate([
            aurelia_framework_1.inject(labelService_1.LabelService, aurelia_event_aggregator_1.EventAggregator, aurelia_dialog_1.DialogService, engineerService_1.EngineerService),
            __metadata("design:paramtypes", [Object, aurelia_event_aggregator_1.EventAggregator,
                aurelia_dialog_1.DialogService, Object])
        ], JobsList);
        return JobsList;
    }(baseViewModel_1.BaseViewModel));
    exports.JobsList = JobsList;
});

//# sourceMappingURL=jobsList.js.map
