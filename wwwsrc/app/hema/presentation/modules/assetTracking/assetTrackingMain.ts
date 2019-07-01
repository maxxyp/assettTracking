import { EditableViewModel } from "../../models/editableViewModel";
import { JobService } from "../../../business/services/jobService";
import { EngineerService } from "../../../business/services/engineerService";
import { LabelService } from "../../../business/services/labelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { ValidationService } from "../../../business/services/validationService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { CatalogService } from "../../../business/services/catalogService";
import { inject } from "aurelia-framework";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";

@inject(JobService, EngineerService, LabelService, EventAggregator, DialogService, ValidationService, BusinessRuleService, CatalogService)
export class AssetTrackingMain extends EditableViewModel {

    constructor(jobService: IJobService,
        engineerService: IEngineerService,
        labelService: ILabelService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRuleService: IBusinessRuleService,
        catalogService: ICatalogService) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService);
    }

    public activateAsync(): Promise<void> {
        return this.loadModel().then(() => this.showContent());
    }
}
