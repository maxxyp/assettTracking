/// <reference path="../../../../../../typings/app.d.ts" />

import {DialogController, DialogService} from "aurelia-dialog";
import {EventAggregator} from "aurelia-event-aggregator";

import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {ICatalogService} from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import {IBusinessRuleService} from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {ILandlordFactory} from "../../../../../../app/hema/presentation/factories/interfaces/ILandlordFactory";
import {IAssetService} from "../../../../../../app/common/core/services/IAssetService";
import {IValidationService} from "../../../../../../app/hema/business/services/interfaces/IValidationService";

import {LandlordSafetyCertificate} from "../../../../../../app/hema/presentation/modules/landlord/certificate/landlordSafetyCertificate";
import {LandlordSafetyCertificateViewModel} from "../../../../../../app/hema/presentation/models/landlordSafetyCertificateViewModel";
import {LandlordSafetyCertificateApplianceViewModel} from "../../../../../../app/hema/presentation/models/landlordSafetyCertificateApplianceViewModel";
import {LandlordSafetyCertificateDefectViewModel} from "../../../../../../app/hema/presentation/models/landlordSafetyCertificateDefectViewModel";
import {ILandlordService} from "../../../../../../app/hema/business/services/interfaces/ILandlordService";

xdescribe("the LandlordSafetyCertificate module", () => {
    let landlordSafetyCertificate: LandlordSafetyCertificate;

    let labelServiceStub: ILabelService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let catalogServiceStub: ICatalogService;
    let businessRuleServiceStub: IBusinessRuleService;
    let landlordFactoryStub: ILandlordFactory;
    let assetServiceStub: IAssetService;
    let dialogControllerStub: DialogController;
    let validationServiceStub: IValidationService;
    let landlordServiceStub: ILandlordService;

    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        labelServiceStub = <ILabelService>{};
        eventAggregatorStub = <EventAggregator>{};
        dialogServiceStub = <DialogService>{};
        catalogServiceStub = <ICatalogService>{};
        businessRuleServiceStub = <IBusinessRuleService>{};
        landlordFactoryStub = <ILandlordFactory>{};
        assetServiceStub = <IAssetService>{};
        dialogControllerStub = <DialogController>{};
        validationServiceStub = <IValidationService>{};
        landlordServiceStub = <ILandlordService>{};

        landlordSafetyCertificate = new LandlordSafetyCertificate(labelServiceStub, eventAggregatorStub, dialogServiceStub,
            catalogServiceStub, businessRuleServiceStub, landlordFactoryStub, assetServiceStub,
            dialogControllerStub, validationServiceStub, landlordServiceStub );
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(landlordSafetyCertificate).toBeDefined();
    });

    describe("the activateAsync function", () => {
        beforeEach(() => {
            landlordSafetyCertificate.loadBusinessRules = sandbox.stub().resolves(null);
            let getBusinessRuleStub = landlordSafetyCertificate.getBusinessRule = sandbox.stub();
            getBusinessRuleStub.withArgs("minApplianceLines").returns(5);
            assetServiceStub.loadText = sandbox.stub().resolves(null);
            catalogServiceStub.getItemDescription = sandbox.stub().resolves("looked up value");
        });

        afterEach(() => {
          sandbox.restore();
        });

        it("can be called", (done) => {
            landlordFactoryStub.createLandlordSafetyCertificateViewModel = sandbox.stub().returns(null);
            let showContentSpy: Sinon.SinonSpy = landlordSafetyCertificate.showContent = sandbox.stub().resolves(null);

            landlordSafetyCertificate.activateAsync({ jobId: "1" })
                .then(() => {
                    expect(showContentSpy.calledOnce).toBe(true);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can be called with appliances", (done) => {
            let viewModel = new LandlordSafetyCertificateViewModel();
            viewModel.appliances = [];

            let appliance = new LandlordSafetyCertificateApplianceViewModel();
            appliance.flueType = "R";
            viewModel.appliances.push(appliance);

            landlordFactoryStub.createLandlordSafetyCertificateViewModel = sandbox.stub().returns(viewModel);

            let showContentSpy: Sinon.SinonSpy = landlordSafetyCertificate.showContent = sandbox.stub().resolves(null);

            landlordSafetyCertificate.activateAsync({ jobId: "1" })
                .then(() => {
                    expect(showContentSpy.calledOnce).toBe(true);
                    expect(viewModel.appliances[0].flueType).toEqual("looked up value");
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can be called with defects", (done) => {
            let viewModel = new LandlordSafetyCertificateViewModel();
            viewModel.defects = [];

            let defect = new LandlordSafetyCertificateDefectViewModel();
            defect.conditionOfAppliance = "C";
            defect.actionTaken = "A";
            viewModel.defects.push(defect);

            landlordFactoryStub.createLandlordSafetyCertificateViewModel = sandbox.stub().returns(viewModel);
            let getLabelStub = landlordSafetyCertificate.getLabel = sandbox.stub();
            getLabelStub.withArgs("notApplicable").returns("N/A");
            getLabelStub.withArgs("incomplete").returns("INCOMPLETE");

            let showContentSpy: Sinon.SinonSpy = landlordSafetyCertificate.showContent = sandbox.stub().resolves(null);

            landlordSafetyCertificate.activateAsync({ jobId: "1" })
                .then(() => {
                    expect(showContentSpy.calledOnce).toBe(true);
                    expect(viewModel.defects[0].conditionOfAppliance).toEqual("looked up value");
                    expect(viewModel.defects[0].actionTaken).toEqual("looked up value");
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can be called with defects with n/a or incomplete", (done) => {
            let viewModel = new LandlordSafetyCertificateViewModel();
            viewModel.defects = [];

            let defect = new LandlordSafetyCertificateDefectViewModel();
            defect.conditionOfAppliance = "N/A";
            defect.actionTaken = "N/A";
            viewModel.defects.push(defect);

            let defect2 = new LandlordSafetyCertificateDefectViewModel();
            defect2.conditionOfAppliance = "INCOMPLETE";
            defect2.actionTaken = "INCOMPLETE";
            viewModel.defects.push(defect2);

            landlordFactoryStub.createLandlordSafetyCertificateViewModel = sandbox.stub().returns(viewModel);
            let getLabelStub = landlordSafetyCertificate.getLabel = sandbox.stub();
            getLabelStub.withArgs("notApplicable").returns("N/A");
            getLabelStub.withArgs("incomplete").returns("INCOMPLETE");

            let showContentSpy: Sinon.SinonSpy = landlordSafetyCertificate.showContent = sandbox.stub().resolves(null);

            landlordSafetyCertificate.activateAsync({ jobId: "1" })
                .then(() => {
                    expect(showContentSpy.calledOnce).toBe(true);
                    expect(viewModel.defects[0].conditionOfAppliance).toEqual("N/A");
                    expect(viewModel.defects[0].actionTaken).toEqual("N/A");
                    expect(viewModel.defects[1].conditionOfAppliance).toEqual("INCOMPLETE");
                    expect(viewModel.defects[1].actionTaken).toEqual("INCOMPLETE");
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can be called with inst prem defect", (done) => {
            let viewModel = new LandlordSafetyCertificateViewModel();

            let defect = new LandlordSafetyCertificateDefectViewModel();
            defect.conditionOfAppliance = "C";
            defect.actionTaken = "A";
            viewModel.instPremDefect = defect;

            landlordFactoryStub.createLandlordSafetyCertificateViewModel = sandbox.stub().returns(viewModel);
            let getLabelStub = landlordSafetyCertificate.getLabel = sandbox.stub();
            getLabelStub.withArgs("notApplicable").returns("N/A");
            getLabelStub.withArgs("incomplete").returns("INCOMPLETE");

            let showContentSpy: Sinon.SinonSpy = landlordSafetyCertificate.showContent = sandbox.stub().resolves(null);

            landlordSafetyCertificate.activateAsync({ jobId: "1" })
                .then(() => {
                    expect(showContentSpy.calledOnce).toBe(true);
                    expect(viewModel.instPremDefect.conditionOfAppliance).toEqual("looked up value");
                    expect(viewModel.instPremDefect.actionTaken).toEqual("looked up value");
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can be called with inst prem defect with n/a or incomplete", (done) => {
            let viewModel = new LandlordSafetyCertificateViewModel();

            let defect = new LandlordSafetyCertificateDefectViewModel();
            defect.conditionOfAppliance = "N/A";
            defect.actionTaken = "INCOMPLETE";
            viewModel.instPremDefect = defect;

            landlordFactoryStub.createLandlordSafetyCertificateViewModel = sandbox.stub().returns(viewModel);
            let getLabelStub = landlordSafetyCertificate.getLabel = sandbox.stub();
            getLabelStub.withArgs("notApplicable").returns("N/A");
            getLabelStub.withArgs("incomplete").returns("INCOMPLETE");

            let showContentSpy: Sinon.SinonSpy = landlordSafetyCertificate.showContent = sandbox.stub().resolves(null);

            landlordSafetyCertificate.activateAsync({ jobId: "1" })
                .then(() => {
                    expect(showContentSpy.calledOnce).toBe(true);
                    expect(viewModel.instPremDefect.conditionOfAppliance).toEqual("N/A");
                    expect(viewModel.instPremDefect.actionTaken).toEqual("INCOMPLETE");
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });
    });

    // if (viewModel && viewModel.appliances && viewModel.appliances.length > 0) {
    //
    //     viewModel.appliances.forEach(appliance => {
    //         catalogValueLookupPromises.push(
    //             this._catalogService.getItemDescription(CatalogConstants.APPLIANCE_FLUE_TYPES,
    //                 [CatalogConstants.APPLIANCE_FLUE_TYPES_ID],
    //                 [appliance.flueType],
    //                 sCatalogConstants.APPLIANCE_FLUE_TYPES_DESCRIPTION)
    //                 .then(lookupValue => {
    //                     appliance.flueType = lookupValue;
    //                 })
    //         );
    //     });
    // }

});
