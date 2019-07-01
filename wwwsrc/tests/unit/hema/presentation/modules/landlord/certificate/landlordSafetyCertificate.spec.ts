/// <reference path="../../../../../../../typings/app.d.ts" />

import { EventAggregator } from "aurelia-event-aggregator";
import {DialogController, DialogService} from "aurelia-dialog";
import { ILabelService } from "../../../../../../../app/hema/business/services/interfaces/ILabelService";
import {IBusinessRuleService} from "../../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {ICatalogService} from "../../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IAssetService } from "../../../../../../../app/common/core/services/IAssetService";
import {ILandlordFactory} from "../../../../../../../app/hema/presentation/factories/interfaces/ILandlordFactory";
import { IValidationService } from "../../../../../../../app/hema/business/services/interfaces/IValidationService";
import {ILandlordService} from "../../../../../../../app/hema/business/services/interfaces/ILandlordService";
import { LandlordSafetyCertificate } from "../../../../../../../app/hema/presentation/modules/landlord/certificate/landlordSafetyCertificate";

describe("the LandlordSafetyCertificate module", () => {
    let sandbox: Sinon.SinonSandbox;
    let landlordSafetyCertificate: LandlordSafetyCertificate;
    let labelServiceStub = <ILabelService>{};
    let eaStub: EventAggregator = <EventAggregator>{};
    let dialogServiceStub = <DialogService>{};
    let dialogControllerStub = <DialogController>{};
    let businessRuleServiceStub = <IBusinessRuleService>{};
    let catalogServiceStub = <ICatalogService>{};
    let assetServiceStub = <IAssetService>{};
    let landlordFactoryStub = <ILandlordFactory>{};
    let validationServiceStub = <IValidationService>{};
    let landlordserviceStub = <ILandlordService>{};

    beforeEach( () => {
        sandbox = sinon.sandbox.create();

        var landlordMockModel = '{"jobNumber":"1234","engineerName":"Jane Smith","date":"2017-02-11T15:00:05.720Z","landlordAddress":["Line 1","Long Long Long Long Line 2","Town","POS TC0D"],"propertyAddress":["Line 1","Line 2","Town","POS TC0D"],"appliances":[{"location":"Kitchen","type":"BBR","make":"FOO","model":"BAR","flueType":"Flueless","operatingValue":12,"operatingValueUnits":1,"safetyDeviceCorrectOperation":0,"ventilationSatisfactory":1,"flueFlowTest":2,"spillageTest":2,"visualConditionOfFlueAndTerminationSatisfactory":1,"applianceSafe":false,"requestedToTest":true},{"make":"FOO2","model":"BAR2"}],"defects":[{"details":"Foo","actionTaken":"Baz Baz Baz","conditionOfAppliance":"Bar","labelledAndWarningNoticeGiven":1},{"details":"Foo","actionTaken":"Baz","conditionOfAppliance":"Bar","labelledAndWarningNoticeGiven":1}],"instPremDefect":[{"details":"Foo","actionTaken":"Baz Baz Baz","conditionOfAppliance":"Bar","labelledAndWarningNoticeGiven":1},{"details":"Foo","actionTaken":"Baz","conditionOfAppliance":"Bar","labelledAndWarningNoticeGiven":1}],"certificateResult":{"gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass":0,"propertySafetyDefect":{"details":"Foo","actionTaken":"Baz","conditionOfAppliance":"Bar","labelledAndWarningNoticeGiven":1}}}';

        landlordserviceStub.getLandlordSafetyCertificate = sandbox.stub().resolves({});

        assetServiceStub.loadText = sandbox.stub().withArgs("test").resolves("loading...");

        landlordFactoryStub.createLandlordSafetyCertificateViewModel = sandbox.stub().returns(JSON.parse(landlordMockModel));

        catalogServiceStub.getItemDescription = sandbox.stub().resolves("Flueless");

        var rulesMockData = { templateAssetPath: "document_templates/landlordCertificate.html", minApplianceLines: "5", gasMeterApplianceSatisfactoryYes: "Y", gasMeterApplianceSatisfactoryNo: "N"};
        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(rulesMockData);

        var labelsMockData = { "notApplicable": "Not Applicable", "incomplete": "In Complete"};

        labelServiceStub.getGroup = sandbox.stub().resolves(labelsMockData);

        landlordSafetyCertificate = new LandlordSafetyCertificate(labelServiceStub, eaStub, dialogServiceStub, catalogServiceStub,
                                                                businessRuleServiceStub, landlordFactoryStub, assetServiceStub, dialogControllerStub, validationServiceStub,
                                                                landlordserviceStub);
     });

    afterEach( () => {
        sandbox.restore();
    });

    it("should be defined", () => {
        expect(landlordSafetyCertificate).toBeDefined();
    });

    it("should call activateAsync method", (done) => {
        landlordSafetyCertificate.getLabel = sandbox.stub().returns("Not Applicable");
        var params = { jobId: "1234" };
        landlordSafetyCertificate.activateAsync(params).then( () => {
            expect(landlordSafetyCertificate.model.appliances.length).toBeGreaterThan(0);
            expect(landlordSafetyCertificate.model.defects.length).toBeGreaterThan(0);
            done();
        });
    })
});


