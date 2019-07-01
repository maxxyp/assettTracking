import {inject} from "aurelia-dependency-injection";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogController, DialogService} from "aurelia-dialog";

import {BusinessRulesViewModel} from "../../../models/businessRulesViewModel";
import {ILabelService} from "../../../../business/services/interfaces/ILabelService";
import {LabelService} from "../../../../business/services/labelService";
import {IBusinessRuleService} from "../../../../business/services/interfaces/IBusinessRuleService";
import {BusinessRuleService} from "../../../../business/services/businessRuleService";
import {ICatalogService} from "../../../../business/services/interfaces/ICatalogService";
import {CatalogService} from "../../../../business/services/catalogService";
import {IAssetService} from "../../../../../common/core/services/IAssetService";
import {AssetService} from "../../../../../common/core/services/assetService";
import {LandlordFactory} from "../../../factories/landlordFactory";
import {ILandlordFactory} from "../../../factories/interfaces/ILandlordFactory";
import {IValidationService} from "../../../../business/services/interfaces/IValidationService";
import {ValidationService} from "../../../../business/services/validationService";

import {LandlordSafetyCertificateViewModel} from "../../../models/landlordSafetyCertificateViewModel";
import {InlineViewStrategy} from "aurelia-framework";
import {CatalogConstants} from "../../../../business/services/constants/catalogConstants";
import {LandlordService} from "../../../../business/services/landlordService";
import {ILandlordService} from "../../../../business/services/interfaces/ILandlordService";

@inject(LabelService, EventAggregator, DialogService,
    CatalogService, BusinessRuleService,
    LandlordFactory, AssetService, DialogController, ValidationService,
    LandlordService)

export class LandlordSafetyCertificate extends BusinessRulesViewModel {

    public model: LandlordSafetyCertificateViewModel;
    public viewHtml: InlineViewStrategy;
    public controller: DialogController;

    private _assetService: IAssetService;
    private _landlordService: ILandlordService;
    private _landlordFactory: ILandlordFactory;
    private _jobId: string;

    constructor(labelService: ILabelService,
                eventAggregator: EventAggregator,
                dialogService: DialogService,
                catalogService: ICatalogService,
                businessRulesService: IBusinessRuleService,
                landlordFactory: ILandlordFactory,
                assetService: IAssetService,
                controller: DialogController,
                validationService: IValidationService,
                landlordService: ILandlordService) {

        super(labelService, eventAggregator, dialogService, validationService, businessRulesService, catalogService);

        this._catalogService = catalogService;
        this._landlordFactory = landlordFactory;
        this._assetService = assetService;
        this.controller = controller;
        this._landlordService = landlordService;
    }

    public activateAsync(params: { jobId: string }): Promise<void> {
        this._jobId = params.jobId;

        return this.loadBusinessRules()
            .then(() => {

                return Promise.all([
                    this._landlordService.getLandlordSafetyCertificate(this._jobId),
                    this._assetService.loadText(this.getBusinessRule<string>("templateAssetPath"))
                ]).then(([landlordCertificateBusinessModel, viewHtml]) => {

                    this.model = this._landlordFactory.createLandlordSafetyCertificateViewModel(landlordCertificateBusinessModel, this.labels);
                    // this.model = LandlordSafetyCertificateViewModel.dummy();
                    return this.getRequiredCatalogValues(this.model)
                        .then(() => {
                            this.padTableRows(this.model, this.getBusinessRule<number>("minApplianceLines"));
                            this.viewHtml = new InlineViewStrategy(viewHtml);
                            this.showContent();
                        });
                });
            });
    }

    private getRequiredCatalogValues(viewModel: LandlordSafetyCertificateViewModel): Promise<void> {
        let catalogValueLookupPromises: Promise<void>[] = [];

        // get all the flue types
        if (viewModel && viewModel.appliances && viewModel.appliances.length > 0) {

            viewModel.appliances.forEach(appliance => {
                if (appliance.flueType !== this.getLabel("incomplete")) {
                    catalogValueLookupPromises.push(
                        this._catalogService.getItemDescription(CatalogConstants.APPLIANCE_FLUE_TYPES,
                            [CatalogConstants.APPLIANCE_FLUE_TYPES_ID],
                            [appliance.flueType],
                            CatalogConstants.APPLIANCE_FLUE_TYPES_DESCRIPTION)
                            .then(lookupValue => {
                                appliance.flueType = lookupValue;
                            })
                    );
                }
            });
        }

        if (viewModel && viewModel.defects && viewModel.defects.length > 0) {

            // todo: when a lookup value is null or undefined, then what should the value be?

            viewModel.defects.forEach((defect) => {
                if ((defect.actionTaken !== this.getLabel("notApplicable")) && (defect.actionTaken !== this.getLabel("incomplete"))) {
                    catalogValueLookupPromises.push(
                        this._catalogService.getItemDescription(CatalogConstants.SAFETY_ACTION,
                            [CatalogConstants.SAFETY_ACTION_ID],
                            [defect.actionTaken],
                            CatalogConstants.SAFETY_ACTION_DESCRIPTION)
                            .then(lookupValue => {
                                defect.actionTaken = lookupValue;
                            }));
                }

                if ((defect.conditionOfAppliance !== this.getLabel("notApplicable")) && (defect.conditionOfAppliance !== this.getLabel("incomplete"))) {
                    catalogValueLookupPromises.push(
                        this._catalogService.getItemDescription(CatalogConstants.SAFETY_NOTICE_TYPE,
                            [CatalogConstants.SAFETY_NOTICE_TYPE_ID],
                            [defect.conditionOfAppliance],
                            CatalogConstants.SAFETY_NOTICE_TYPE_DESCRIPTION)
                            .then(lookupValue => {
                                defect.conditionOfAppliance = lookupValue;
                            }));
                }
            });
        }

        if (viewModel && viewModel.instPremDefect) {
            if ((viewModel.instPremDefect.actionTaken !== this.getLabel("notApplicable")) && (viewModel.instPremDefect.actionTaken !== this.getLabel("incomplete"))) {
                catalogValueLookupPromises.push(
                    this._catalogService.getItemDescription(CatalogConstants.SAFETY_ACTION,
                        [CatalogConstants.SAFETY_ACTION_ID],
                        [viewModel.instPremDefect.actionTaken],
                        CatalogConstants.SAFETY_ACTION_DESCRIPTION)
                        .then(lookupValue => {
                            viewModel.instPremDefect.actionTaken = lookupValue;
                        }));
            }

            if ((viewModel.instPremDefect.conditionOfAppliance !== this.getLabel("notApplicable")) && (viewModel.instPremDefect.conditionOfAppliance !== this.getLabel("incomplete"))) {
                catalogValueLookupPromises.push(
                    this._catalogService.getItemDescription(CatalogConstants.SAFETY_NOTICE_TYPE,
                        [CatalogConstants.SAFETY_NOTICE_TYPE_ID],
                        [viewModel.instPremDefect.conditionOfAppliance],
                        CatalogConstants.SAFETY_NOTICE_TYPE_DESCRIPTION)
                        .then(lookupValue => {
                            viewModel.instPremDefect.conditionOfAppliance = lookupValue;
                        }));
            }
        }

        return Promise.all(catalogValueLookupPromises).then(() => Promise.resolve());
    }

    private padTableRows(model: LandlordSafetyCertificateViewModel, minLines: number): void {
        if (model && model.appliances && model.appliances.length > 0) {
            while (model.appliances.length < minLines) {
                model.appliances.push(null);
            }
        }

        if (model && model.defects && model.defects.length > 0) {
            while (model.defects.length < minLines) {
                model.defects.push(null);
            }
        }
    }

}
