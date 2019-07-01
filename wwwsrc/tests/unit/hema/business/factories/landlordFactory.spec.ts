import { LandlordFactory } from "../../../../../app/hema/business/factories/landlordFactory";
import { ICatalogService } from "../../../../../app/hema/business/services/interfaces/ICatalogService";
import {ISafetyAction} from "../../../../../app/hema/business/models/reference/ISafetyAction";
import {Job} from "../../../../../app/hema/business/models/job";
import {PropertySafety} from "../../../../../app/hema/business/models/propertySafety";
import {PropertyGasSafetyDetail} from "../../../../../app/hema/business/models/propertyGasSafetyDetail";
import {PropertyUnsafeDetail} from "../../../../../app/hema/business/models/propertyUnsafeDetail";
import {QueryableBusinessRuleGroup} from "../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import {Appliance} from "../../../../../app/hema/business/models/appliance";
import {YesNoNa} from "../../../../../app/hema/business/models/yesNoNa";

describe("the landlord factory module", () => {
    let sandbox: Sinon.SinonSandbox;
    let landlordFactory: LandlordFactory;
    let catalogService: ICatalogService;
    let getBusinessRuleStub;
    let businessRules: QueryableBusinessRuleGroup;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();       

        catalogService = <ICatalogService>{};
        catalogService.getObjectType = sandbox.stub().resolves({

        });
        catalogService.getSafetyActions = sandbox.stub().resolves([
            <ISafetyAction> {
                actionCode: "C",
                safetyActionCategory: "A",
                safetyActionDescription: "Capped"
            }
        ]);

        getBusinessRuleStub = sandbox.stub();
        getBusinessRuleStub.withArgs("gasMeterApplianceSatisfactoryYes").returns("Yes");
        getBusinessRuleStub.withArgs("gasMeterApplianceSatisfactoryNo").returns("No");
        getBusinessRuleStub.withArgs("gasMeterApplianceSatisfactoryNoMeter").returns("No Meter");
        getBusinessRuleStub.withArgs("gasMeterApplianceSatisfactoryNotApplicable").returns("N/A");
        getBusinessRuleStub.withArgs("conditionAsLeftImmediatelyDangerous").returns("ID");
        getBusinessRuleStub.withArgs("conditionAsLeftAtRisk").returns("AR");
        getBusinessRuleStub.withArgs("conditionAsLeftNotCommissioned").returns("XC");
        getBusinessRuleStub.withArgs("conditionAsLeftNotToCurrentStandards").returns("SS");
        getBusinessRuleStub.withArgs("reportMaxLength").returns(40);

        businessRules = <QueryableBusinessRuleGroup>{};
        businessRules.getBusinessRule = getBusinessRuleStub;
        
        landlordFactory = new LandlordFactory(catalogService);
    });

    it("should be defined", () => {
        expect(landlordFactory).toBeDefined();
    });

    describe("createLandlordSafetyCertificateResult", () => {
        let job: Job = <Job> {
            propertySafety: <PropertySafety> {
                propertyGasSafetyDetail: <PropertyGasSafetyDetail> {
                    gasInstallationTightnessTestDone: true,
                    gasMeterInstallationSatisfactory: "No"
                },
                propertyUnsafeDetail: <PropertyUnsafeDetail> {
                    cappedTurnedOff: "C",
                    conditionAsLeft: "XC",
                    labelAttachedRemoved: "A",
                    letterLeft: false,
                    ownedByCustomer: false,
                    reasons: ["GMET"],
                    report: "test report",
                    signatureObtained: false
                }
            }
        };        

        let appliances = [
            <Appliance> {
                applianceType: "CHB"
            }
        ];

        it("Should gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass to be NA when ConditionAsLeft = NotCommissioned & gasMeterInstallationSatisfactory = No", (done) => {
            landlordFactory.createLandlordSafetyCertificate(job, undefined, businessRules, appliances).then( result => {
                expect(result.certificateResult.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass).toBe(YesNoNa.Na);
                done();
            });
        });

        it("Should gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass to be No when ConditionAsLeft = AtRisk & gasMeterInstallationSatisfactory = No", (done) => {
            job.propertySafety.propertyUnsafeDetail.conditionAsLeft = "AR";
            landlordFactory.createLandlordSafetyCertificate(job, undefined, businessRules, appliances).then( result => {
                expect(result.certificateResult.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass).toBe(YesNoNa.No);
                done();
            });
        });

        it("Should gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass to be NA when gasMeterInstallationSatisfactory = No Meter", (done) => {
            job.propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory = "No Meter";
            landlordFactory.createLandlordSafetyCertificate(job, undefined, businessRules, appliances).then( result => {
                expect(result.certificateResult.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass).toBe(YesNoNa.Na);
                done();
            });
        });

        it("Should gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass to be Yes when gasMeterInstallationSatisfactory = No, ConditionAsLeft=NotToCurrentStandards", (done) => {
            job.propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory = "No";
            job.propertySafety.propertyUnsafeDetail.conditionAsLeft = "SS";
            landlordFactory.createLandlordSafetyCertificate(job, undefined, businessRules, appliances).then( result => {
                expect(result.certificateResult.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass).toBe(YesNoNa.Yes);
                done();
            });
        }); 

        it("Should gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass to be Yes when gasMeterInstallationSatisfactory = Yes", (done) => {
            job.propertySafety.propertyGasSafetyDetail.gasMeterInstallationSatisfactory = "Yes";
            landlordFactory.createLandlordSafetyCertificate(job, undefined, businessRules, appliances).then( result => {
                expect(result.certificateResult.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass).toBe(YesNoNa.Yes);
                done();
            });
        });        
    });
});
