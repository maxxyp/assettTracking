/// <reference path="./../../../../../typings/app.d.ts" />

import { inject } from "aurelia-framework";
import { Router, RouterConfiguration, RouteConfig } from "aurelia-router";

import { IRiskService } from "../../../business/services/interfaces/IRiskService";
import { RiskService } from "../../../business/services/RiskService";
import { LabelService } from "../../../business/services/labelService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { EditableViewModel } from "../../models/editableViewModel";
import { CatalogService } from "../../../business/services/catalogService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { ValidationService } from "../../../business/services/validationService";
import { JobService } from "../../../business/services/jobService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { EngineerService } from "../../../business/services/engineerService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { DialogService } from "aurelia-dialog";
import { AnimationService } from "../../../../common/ui/services/animationService";
import { IAnimationService } from "../../../../common/ui/services/IAnimationService";

@inject(JobService, EngineerService, RiskService, LabelService, EventAggregator, DialogService, ValidationService, BusinessRuleService, CatalogService, AnimationService)
export class RiskMain extends EditableViewModel {
    public router: Router;

    public jobId: string;
    public riskId: string;
    public riskIds: string[];
    public card: HTMLElement;

    private _childRoutes: RouteConfig[];
    private _riskPosition: number;
    private _animationService: IAnimationService;
    private _riskService: IRiskService;

    constructor(jobService: IJobService,
        engineerService: IEngineerService,
        riskService: IRiskService,
        labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRuleService: IBusinessRuleService,
        catalogService: ICatalogService,
        animationService: IAnimationService) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService);
        this._animationService = animationService;
        this._riskService = riskService;
        this.riskIds = [];
    }

    public configureRouter(config: RouterConfiguration, childRouter: Router): void {
        this.router = childRouter;

        this.setupChildRoutes();
        config.map(this._childRoutes);
    }

    public activateAsync(params: { jobId: string, riskId: string }): Promise<void> {
        this.jobId = params.jobId;
        this.riskId = params.riskId;

        return this.load()
                .then(() => this.showContent());

    }
    public swipeFunction(swipeDirection: string): void {
        if (this._riskPosition !== -1) {
            if (swipeDirection === "left") {
                this._animationService.swipe(this.card, this.riskIds, this._riskPosition, swipeDirection, "slide-in-right", "slide-out-left", 300).then((position) => {
                    this.router.parent.navigate(this.router.parent.currentInstruction.fragment.replace(this.riskIds[this._riskPosition], this.riskIds[position]));
                    this._riskPosition = position;
                })
                    .catch();
            } else {
                this._animationService.swipe(this.card, this.riskIds, this._riskPosition, swipeDirection, "slide-in-left", "slide-out-right", 300).then((position) => {
                    this.router.parent.navigate(this.router.parent.currentInstruction.fragment.replace(this.riskIds[this._riskPosition], this.riskIds[position]));
                    this._riskPosition = position;
                })
                    .catch();
            }
        }
    }

    protected loadModel(): Promise<void> {
        return this._riskService.getRisks(this.jobId)
            .then(risks => {
                if (risks) {
                    this.riskIds = risks.map(r => r.id);
                    this._riskPosition = this.riskIds.indexOf(this.riskId);
                }
            });
    }

    private setupChildRoutes(): void {
        this._childRoutes = [
            {
                route: "",
                redirect: "details"
            },
            {
                route: "details",
                moduleId: "hema/presentation/modules/risks/riskItem",
                name: "details",
                nav: true,
                title: "Details",
                settings: { tabGroupParent: "risks" }
            }
        ];
    }

}
