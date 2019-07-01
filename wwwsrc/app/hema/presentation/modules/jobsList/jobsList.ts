/// <reference path="../../../../../typings/app.d.ts" />

import {inject} from "aurelia-framework";

import {BaseViewModel} from "../../models/baseViewModel";
import {ILabelService} from "../../../business/services/interfaces/ILabelService";
import {LabelService} from "../../../business/services/labelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {EngineerService} from "../../../business/services/engineerService";
import {IEngineerService} from "../../../business/services/interfaces/IEngineerService";
import {Router, RouterConfiguration, RouteConfig, NavigationInstruction} from "aurelia-router";

@inject(LabelService, EventAggregator, DialogService, EngineerService)
export class JobsList extends BaseViewModel {
    public router: Router;

    private _engineerService: IEngineerService;

    constructor(labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                engineerService: IEngineerService) {
        super(labelService, eventAggregator, dialogService);

        this._engineerService = engineerService;
    }

    public configureRouter(config: RouterConfiguration, childRouter: Router): void {
        this.router = childRouter;
        config.map(this.getChildRoutes());
    }

    public attachedAsync(): Promise<void> {
        this.showContent();
        return Promise.resolve();
    }

    public getChildRoutes(): RouteConfig[] {
        return [
            {
                route: "",
                navigationStrategy: (instruction: NavigationInstruction) => {
                    // user should be shown the worklist or should be able to do request work irrespective of any engineer status (except End of day) if the user is signedon
                    return this._engineerService.isSignedOn()
                        .then(isSignedOn => {
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
    }
}
