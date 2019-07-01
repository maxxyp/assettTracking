/// <reference path="../../../../../../typings/app.d.ts" />
import { Router } from "aurelia-router";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { BindingEngine, PropertyObserver } from "aurelia-framework";
import { IApplianceService } from "../../../../../../app/hema/business/services/interfaces/IApplianceService";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { IValidationService } from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { ApplianceDetails } from "../../../../../../app/hema/presentation/modules/appliances/applianceDetails";
import { Appliance } from "../../../../../../app/hema/business/models/appliance";
import { Guid } from "../../../../../../app/common/core/guid";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { DialogService, DialogResult } from "aurelia-dialog";
import { IApplianceFactory } from "../../../../../../app/hema/presentation/factories/interfaces/IApplianceFactory";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { Job } from "../../../../../../app/hema/business/models/job";
import { Task } from "../../../../../../app/hema/business/models/task";
import { IGcCode } from "../../../../../../app/hema/business/models/reference/IGcCode";
import { IObjectType } from "../../../../../../app/hema/business/models/reference/IObjectType";
import { StorageService } from "../../../../../../app/hema/business/services/storageService";
import { IStorageService } from "../../../../../../app/hema/business/services/interfaces/IStorageService";
import { ApplianceViewModel } from "../../../../../../app/hema/presentation/modules/appliances/viewModels/applianceViewModel";
import { ApplianceSafetyType } from "../../../../../../app/hema/business/models/applianceSafetyType";
import { ValidationRule } from "../../../../../../app/hema/business/services/validation/validationRule";
import { IDynamicRule } from "../../../../../../app/hema/business/services/validation/IDynamicRule";
import { IApplianceContractType } from "../../../../../../app/hema/business/models/reference/IApplianceContractType"

describe("the ApplianceDetails module", () => {
    let applianceDetails: ApplianceDetails;
    let sandbox: Sinon.SinonSandbox;

    let labelServiceStub: ILabelService;
    let applianceServiceStub: IApplianceService;
    let applianceFactoryStub: IApplianceFactory;
    let applianceSaveSpy: Sinon.SinonSpy;
    let applianceType: IObjectType;
    let routerStub: Router;
    let navigateToRouteSpy: Sinon.SinonSpy;
    let appliance: Appliance;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let catalogServiceStub: ICatalogService;
    let storageServiceStub: IStorageService;
    let validationServiceBuildSpy: Sinon.SinonSpy;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let bindingEngineStub: BindingEngine;
    let showContentSpy: Sinon.SinonSpy;
    let gcCodeSubscriptionDisposeSpy: Sinon.SinonSpy;
    let applianceTypeSubscriptionDisposeSpy: Sinon.SinonSpy;
    let catalogServiceGetGCCodeSpy: Sinon.SinonSpy;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        applianceServiceStub = <IApplianceService>{};
        routerStub = <Router>{};
        routerStub.navigateToRoute = navigateToRouteSpy = sandbox.spy();

        labelServiceStub = <ILabelService>{};

        labelServiceStub.getGroup = sinon.stub().resolves(null);

        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);

        appliance = <Appliance>{};
        appliance.id = "1";
        appliance.applianceType = "1";
        appliance.gcCode = "1234567";
        appliance.contractType = "2PI";

        applianceServiceStub.getAppliances = sandbox.stub().resolves([appliance]);
        applianceServiceStub.getAppliance = sandbox.stub().resolves(appliance);
        applianceServiceStub.updateAppliance = applianceSaveSpy = sandbox.stub().resolves(undefined);
        applianceServiceStub.getChildApplianceId = sandbox.stub().resolves(undefined);
        applianceServiceStub.replaceAppliance = sandbox.stub().resolves(Promise.resolve());

        bindingEngineStub = <BindingEngine>{};

        gcCodeSubscriptionDisposeSpy = sandbox.spy();
        applianceTypeSubscriptionDisposeSpy = sandbox.spy();

        let propertyObserverStub: Sinon.SinonStub = bindingEngineStub.propertyObserver = sandbox.stub().returns(<PropertyObserver>{
            subscribe: () => <Subscription>{
                dispose: () => { }
            }
        });

        propertyObserverStub.withArgs(appliance, "gcCode").returns(<PropertyObserver>{
            subscribe: () => <Subscription>{
                dispose: gcCodeSubscriptionDisposeSpy
            }
        });

        propertyObserverStub.withArgs(appliance, "applianceType").returns(<PropertyObserver>{
            subscribe: () => <Subscription>{
                dispose: applianceTypeSubscriptionDisposeSpy
            }
        });

        applianceType = <IObjectType>{
            applianceType: "INS",
            applianceTypeDescription: "Appliance Type Description",
            allowCreateInField: "Y",
            fetchGCCode: "N"
        };

        catalogServiceStub = <ICatalogService>{};
        catalogServiceStub.getObjectTypes = sandbox.stub().resolves([applianceType]);
        catalogServiceStub.getObjectType = sandbox.stub().resolves(applianceType);
        catalogServiceStub.getFlueTypes = sandbox.stub().resolves([]);
        catalogServiceStub.getApplianceConditions = sandbox.stub().resolves([]);
        catalogServiceStub.getApplianceSystemTypes = sandbox.stub().resolves([]);
        catalogServiceStub.getSystemDesignAndCondition = sandbox.stub().resolves([]);
        catalogServiceStub.getApplianceCylinderTypes = sandbox.stub().resolves([]);
        catalogServiceStub.getEnergyControls = sandbox.stub().resolves([]);
        catalogServiceGetGCCodeSpy = catalogServiceStub.getGCCode = sandbox.stub().resolves(<IGcCode>{
            gcCode: "1234567",
            applianceTypeCode: "1",
            gcCodeDescription: "foo"
        });
        catalogServiceStub.getApplianceContractType = sandbox.stub().resolves(
            <IApplianceContractType> {
                applianceContractTypeDescription: "Appliance ContractType description",
                contractType: "2PI"                
            });

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.publish = sandbox.stub();
        eventAggregatorStub.subscribe = sandbox.stub();

        jobServiceStub = <IJobService>{};
        let job = new Job();
        let task = new Task(true, false);
        task.status = "NA";
        job.tasks = [task];
        jobServiceStub.getJob = sandbox.stub().resolves(job);

        validationServiceStub = <IValidationService>{};
        validationServiceBuildSpy = validationServiceStub.build = sandbox.stub().resolves(null);

        // validationServiceStub.build = sandbox.stub().resolves(null);

        businessRuleServiceStub = <IBusinessRuleService>{};

        let businessRuleGroup = {
            "centralHeatingApplianceHardwareCategory": "",
            "applianceRequiresGcCode": "",
            "isDefaultGcCode": "",
            "applianceTypeAllowsCreation": "Y",
            "applianceTypeCatalogExclusions": "HAZ",
            "gcCodeLength": 2,
            "parentApplianceIndicator": "",
            "childApplianceIndicator": "",
            "serialNumberLength": 2,
            "locationLength": 25,
            "descriptionLength": 25
        };

        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(businessRuleGroup);

        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};

        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();

        getBusinessRuleStub.withArgs("notDoingJobStatuses").returns("NA");

        getBusinessRuleStub.withArgs("instPremApplianceType").returns("INS");

        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        dialogServiceStub = <DialogService>{};        

        storageServiceStub = <StorageService>{};
        storageServiceStub.getWorkingSector = sandbox.stub().resolves("WorkingSector")

        let applianceViewModel = new ApplianceViewModel();
        applianceViewModel.id = appliance.id;
        applianceViewModel.gcCode = appliance.gcCode;
        applianceViewModel.applianceType = appliance.applianceType;
        applianceViewModel.contractType = appliance.contractType;

        applianceFactoryStub = <IApplianceFactory>{};
        applianceFactoryStub.calculateApplianceSafetyType = sinon.stub().resolves(ApplianceSafetyType.gas);
        //applianceFactoryStub.createApplianceBusinessModelFromViewModel = sinon.stub().resolves(appliance);
        applianceFactoryStub.createApplianceViewModelFromBusinessModel = sinon.stub().resolves(applianceViewModel);
        applianceFactoryStub.createNewApplianceViewModel = sinon.stub().resolves(new ApplianceViewModel());
        applianceFactoryStub.updateApplianceViewModelApplianceType = sinon.stub().resolves(null);



        applianceDetails = new ApplianceDetails(jobServiceStub, engineerServiceStub, labelServiceStub, applianceServiceStub,
            applianceFactoryStub, routerStub,
            eventAggregatorStub, dialogServiceStub, validationServiceStub, businessRuleServiceStub, catalogServiceStub,
            bindingEngineStub, storageServiceStub);

        applianceDetails.showContent = showContentSpy = sandbox.spy();

        applianceDetails.labels = {
            "invalidGcCode": "",
            "invalidSerialNumber": "",
            "invalidNumberOfSpecialRadiators": "",
            "invalidYear": "",
            "no": "",
            "yes": "",
            "confirmation": "confirmation",
            "replaceApplianceQuestion": "replace",
            "amendApplianceQuestion": "amend"
        };

        applianceDetails.validationRules["viewModel.gcCode"] = <ValidationRule>{
            minLength: 7,
            maxLength: 7,
            property: "viewModel.gcCode"
        };

        applianceDetails.validationRules["viewModel.description"] = <ValidationRule>{
            minLength: 0,
            maxLength: 24,
            property: "viewModel.description"
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(applianceDetails).toBeDefined();
    });

    describe("activateAsync", () => {
        it("can call activateAsync, bind model, set applianceIds and showContent", done => {
            applianceDetails.activateAsync({ applianceId: "1", newGcCode: undefined ,oldApplianceId: undefined }).then(() => {
                expect(showContentSpy.called).toBe(true);
                expect(applianceDetails.canEdit).toBe(false);
                done();
            });
        });

        it("can call activateAsync for a new appliance, set applianceIds and showContent", done => {
            applianceDetails.activateAsync({ applianceId: Guid.empty, newGcCode: undefined ,oldApplianceId: undefined }).then(() => {
                expect(applianceDetails.viewModel).toBeDefined();
                expect(showContentSpy.called).toBe(true);
                done();
            });
        });

        it("INS option should be available in the applianceTypeCatalog if INS is not exist in the premises", done => {            
            applianceDetails.activateAsync({ applianceId: Guid.empty, newGcCode: undefined ,oldApplianceId: undefined }).then(() => {
                expect(applianceDetails.creatableApplianceTypesCatalog.some(a => a.applianceType === "INS")).toBeTruthy();
                done();
            });
        });

        it("INS option should not be available in the applianceTypeCatalog if INS is already exists in premises", done => {            
            appliance = <Appliance>{};
            appliance.id = "1";
            appliance.applianceType = "INS";
            appliance.gcCode = "1234567";

            applianceServiceStub.getAppliances = sandbox.stub().resolves([appliance]);

            applianceDetails.activateAsync({ applianceId: Guid.empty, newGcCode: undefined ,oldApplianceId: undefined }).then(() => {
                expect(applianceDetails.creatableApplianceTypesCatalog.some(a => a.applianceType === "INS")).toBeFalsy();
                done();
            });
        });

        it("replaceAppliance property should be set to true when the value for newGcCode & oldApplianceId exists in params", done => {
            applianceDetails.activateAsync({ applianceId: Guid.empty, newGcCode: "1222222" ,oldApplianceId: "1222" }).then(() => {
                expect(applianceDetails.isNew).toBeTruthy();
                expect(applianceDetails.replaceAppliance).toBeTruthy();                
                done();
            });
        });

        it("replaceAppliance property should be set to false when the value for newGcCode & oldApplianceId doesn't exists in params", done => {
            applianceDetails.activateAsync({ applianceId: Guid.empty, newGcCode: undefined, oldApplianceId: undefined }).then(() => {
                expect(applianceDetails.isNew).toBeTruthy();
                expect(applianceDetails.replaceAppliance).toBeFalsy();                
                done();
            });
        });

        it("viewModel.gcCode property value should be equal to newGcCode value that passed as a param when replaceAppliace = true", done => {
            let params = { applianceId: Guid.empty, newGcCode: "1222222" ,oldApplianceId: "1222" };
            applianceDetails.activateAsync(params).then(() => {
                expect(applianceDetails.viewModel.gcCode).toEqual(params.newGcCode);
                expect(applianceDetails.replaceAppliance).toBeTruthy();                
                done();
            });
        });

        it("viewModel.applianceType should be set when replaceAppliance = true", done => {
            let params = { applianceId: Guid.empty, newGcCode: "0" ,oldApplianceId: "1222" };
            applianceDetails.activateAsync(params).then(() => {
                expect(applianceDetails.viewModel.applianceType).toEqual("1");
                done();
            });
        });   
        
        it("The length of the viewmodel.description should not be greater than 24 charcters", done => {
            catalogServiceStub.getGCCode = sandbox.stub().resolves(<IGcCode>{
                gcCode: "1234567",
                applianceTypeCode: "1",
                gcCodeDescription: "*C*GREENSTAR 40 CDI REGULAR"
            });
            let params = { applianceId: Guid.empty, newGcCode: "1234567" ,oldApplianceId: "1222" };

            applianceDetails.activateAsync(params).then(() => {
                expect(applianceDetails.viewModel.description.length).not.toBeGreaterThan(applianceDetails.validationRules["viewModel.description"].maxLength);
                expect(applianceDetails.viewModel.description).toEqual("*C*GREENSTAR 40 CDI REGU");
                done();
            });
         });

         it("sohuld set applianceContractTypeDescription", done => {
            applianceDetails.activateAsync({ applianceId: "1", newGcCode: undefined ,oldApplianceId: undefined }).then(() => {
                expect(applianceDetails.contractTypeDescription).toEqual("Appliance ContractType description");
                expect((<Sinon.SinonSpy> catalogServiceStub.getApplianceContractType).called).toBeTruthy();
                done();
            });
         });
    });

    describe("changeHandlers", () => {

        it("can call gcCodeChanged when gcCode is not valid and reset gcCode and flags", done => {
            applianceDetails.activateAsync({ applianceId: "1", newGcCode: undefined ,oldApplianceId: undefined })
                .then(() => {
                    applianceDetails.viewModel.gcCode = "Z";
                    applianceDetails.viewModel.description = "Y";
                    applianceDetails.gcCodeChanged("Z", "X");
                    expect(applianceDetails.viewModel.description).toBeUndefined();
                    expect(applianceDetails.isDefaultGcCodeOptionAvailable).toBe(false);
                    expect(applianceDetails.isKnownGcCodeSelected).toBe(false);
                    done();
                });
        });

        it("can call gcCodeChanged when gcCode is valid and set description flags", done => {
            let showConfirmationStub = applianceDetails.showConfirmation = sandbox.stub();
            showConfirmationStub.withArgs("confirmation", "replace").resolves(<DialogResult> {wasCancelled: true});
            showConfirmationStub.withArgs("confirmation", "amend").resolves(<DialogResult> {wasCancelled: false});
                      
            applianceDetails.activateAsync({ applianceId: "1", newGcCode: undefined ,oldApplianceId: undefined })
                .then(() => {
                    applianceDetails.viewModel.applianceType = "1";
                    applianceDetails.viewModel.gcCode = "1234567";
                    applianceDetails.viewModel.description = "Y";
                    applianceDetails.viewModel.requiresGcCode = true;
                    applianceDetails.gcCodeChanged("1234567", "X")
                        .then(() => {
                            expect(applianceDetails.viewModel.description).toBe("foo");
                            expect(applianceDetails.isDefaultGcCodeOptionAvailable).toBe(false);
                            expect(applianceDetails.isKnownGcCodeSelected).toBe(true);
                            done();
                        });
                });
        });

        it("can call selectedDefaultGcCodeChanged and reset flags", done => {
            applianceDetails.activateAsync({ applianceId: "1", newGcCode: undefined ,oldApplianceId: undefined })
                .then(() => {
                    applianceDetails.viewModel.gcCode = "Z";
                    applianceDetails.isDefaultGcCodeOptionAvailable = true;
                    applianceDetails.selectedDefaultGcCodeChanged("ZZ", "X");

                    expect(applianceDetails.viewModel.gcCode).toBe("ZZ");
                    expect(applianceDetails.isDefaultGcCodeOptionAvailable).toBe(false);
                    done();
                });
        });

        it("can dispose handlers", done => {
            applianceDetails.activateAsync({ applianceId: "1", newGcCode: undefined ,oldApplianceId: undefined })
                .then(() => applianceDetails.deactivateAsync())
                .then(() => {
                    expect(gcCodeSubscriptionDisposeSpy.called).toBe(true);
                    expect(applianceTypeSubscriptionDisposeSpy.called).toBe(true);
                    done();
                });
        });

        it("should not show the confirmation popup when creating new appliance", async done => {
            let showConfirmationSpy = applianceDetails.showConfirmation = sandbox.stub().resolves(<DialogResult> {wasCancelled: false});
            await applianceDetails.activateAsync({ applianceId: Guid.empty, newGcCode: undefined ,oldApplianceId: undefined });
            applianceDetails.viewModel.requiresGcCode = true;
            applianceDetails.viewModel.gcCode = "1234567";
            await applianceDetails.gcCodeChanged("1234567", undefined);
            expect(showConfirmationSpy.called).toBeFalsy();
            expect(catalogServiceGetGCCodeSpy.called).toBeTruthy();
            done();
        })

        it("should show confirmation popup for replacing an appliance when GC Code is changed", async (done) => {
            let showConfirmationSpy = applianceDetails.showConfirmation = sandbox.stub().resolves(<DialogResult> {wasCancelled: false});
            await applianceDetails.activateAsync({ applianceId: "1212121", newGcCode: undefined ,oldApplianceId: undefined });
            applianceDetails.viewModel.gcCode = "1212121";
            applianceDetails.viewModel.description = "test";
            applianceDetails.viewModel.requiresGcCode = true;
            await applianceDetails.gcCodeChanged("1234567", "1212121");
            expect(showConfirmationSpy.calledWith("confirmation", "replace")).toBe(true); 
            done();
        }); 

        it("should show confirmation popup for amending an appliance when GC Code is changed and applianceReplacement confirmation is cancelled", async (done) => {
            let showConfirmationSpy = applianceDetails.showConfirmation = sandbox.stub().resolves(<DialogResult> {wasCancelled: true});
            await applianceDetails.activateAsync({ applianceId: "1212121", newGcCode: undefined ,oldApplianceId: undefined });
            applianceDetails.viewModel.gcCode = "1212121";
            applianceDetails.viewModel.description = "test";
            applianceDetails.viewModel.requiresGcCode = true;
            await applianceDetails.gcCodeChanged("1234567", "1212121");
            expect(showConfirmationSpy.calledWith("confirmation", "amend")).toBe(true);  
            expect(catalogServiceGetGCCodeSpy.called).toBeTruthy();
            done();
        });
    });

    describe("validation", () => {

        let rules: IDynamicRule[];
        let getRule = (property: string) => rules.find(r => r.property === property);

        beforeEach(done => {
            applianceDetails.activateAsync({ applianceId: "1", newGcCode: undefined ,oldApplianceId: undefined }).then(() => {
                rules = validationServiceBuildSpy.args[0][2];
                done();
            });
        });

        describe("viewModel.gcCode", () => {

            it("can register validation", () => {
                let rule = getRule("viewModel.gcCode");
                expect(rule).toBeDefined();
            });

            describe("for validated appliances (fetchGcCode = true)", () => {

                beforeEach(() => {
                    applianceType = <IObjectType>{
                        applianceType: "1",
                        applianceTypeDescription: "Appliance Type Description",
                        fetchGCCode: "Y"
                    };

                    applianceDetails.viewModel.requiresGcCode = true;
                });

                describe("with an invalid GcCode", () => {

                    beforeEach(() => {
                        catalogServiceStub.getGCCode = sandbox.stub().resolves(<IGcCode>{
                            gcCode: "0",
                            applianceTypeCode: "666",
                            gcCodeDescription: "invalid"
                        });
                    });

                    it("will never pass", async (done) => {
                        let rule = getRule("viewModel.gcCode");
                        let result = await rule.passes[0].test();
                        expect(result).toBe(false);
                        done();
                    });

                });

                describe("with a valid GcCode", () => {

                    beforeEach(() => {
                        catalogServiceStub.getGCCode = sandbox.stub().resolves(<IGcCode>{
                            gcCode: "0",
                            applianceTypeCode: "1",
                            gcCodeDescription: "valid"
                        });
                    });

                    it("will always pass", async (done) => {
                        let rule = getRule("viewModel.gcCode");
                        let result = await rule.passes[0].test();
                        expect(result).toBe(true);
                        done();
                    });

                });
            });

            describe("for non-validated appliances (fetchGcCode = false)", () => {

                beforeEach(() => {
                    applianceType = <IObjectType>{
                        applianceType: "1",
                        applianceTypeDescription: "Appliance Type Description",
                        fetchGCCode: "N"
                    };

                    applianceDetails.viewModel.requiresGcCode = false;
                });

                describe("with an invalid GcCode", () => {

                    beforeEach(() => {
                        catalogServiceStub.getGCCode = sandbox.stub().resolves(<IGcCode>{
                            gcCode: "0",
                            applianceTypeCode: "666",
                            gcCodeDescription: "invalid"
                        });
                    });

                    it("will always pass", async (done) => {
                        let rule = getRule("viewModel.gcCode");
                        let result = await rule.passes[0].test();
                        expect(result).toBe(true);
                        done();
                    });

                });

                describe("with a valid GcCode", () => {

                    beforeEach(() => {
                        catalogServiceStub.getGCCode = sandbox.stub().resolves(<IGcCode>{
                            gcCode: "0",
                            applianceTypeCode: "1",
                            gcCodeDescription: "valid"
                        });
                    });

                    it("will always pass", async (done) => {
                        let rule = getRule("viewModel.gcCode");
                        let result = await rule.passes[0].test();
                        expect(result).toBe(true);
                        done();
                    });

                });
            });
        });

    });

    describe("saving", () => {

       it("can save an new appliance", done => {
            let saveStub = applianceDetails.save = sandbox.stub().resolves(true);
            applianceDetails.completeOk().then(() => {
                expect(saveStub.called).toBe(true);
                done();
            });

        });

        it("can not double-save a new appliance", done => {
            let saveStub = applianceDetails.save = sandbox.stub().resolves(true);
            applianceDetails.completeOk().then(() => {
                expect(saveStub.called).toBe(true);
                saveStub.reset();

                applianceDetails.completeOk().then(() => {
                    applianceDetails.isCompleteTriggeredAlready = true;
                    expect(saveStub.called).toBe(false);
                    done();
                });
            });
        });

        it("can save a new parent appliance by using the Child Appliance button", () => {
            let saveStub = applianceDetails.save = sandbox.stub().resolves(true);
            applianceDetails.isNew = true;
            applianceDetails.viewModel = <ApplianceViewModel>{};

            applianceDetails.loadChildAppliance();
            expect(saveStub.called).toBe(true);
        });

        it("can not double-save a new parent appliance by using the Child Appliance button", () => {
            let saveStub = applianceDetails.save = sandbox.stub().resolves(true);
            applianceDetails.isNew = true;
            applianceDetails.viewModel = <ApplianceViewModel>{};

            applianceDetails.loadChildAppliance()
            expect(saveStub.called).toBe(true);
            saveStub.reset();

            applianceDetails.loadChildAppliance()
            applianceDetails.isCompleteTriggeredAlready = true;
            expect(saveStub.called).toBe(false);
        })

        it("can renable the Child Appliance button when the page is reopened", done => {
            applianceDetails.isCompleteTriggeredAlready = true;
            applianceDetails.activateAsync({applianceId: "1", newGcCode: undefined ,oldApplianceId: undefined}).then(() => {
                expect(applianceDetails.isCompleteTriggeredAlready).toBe(false);
                done();
            });
        })
    });
});
