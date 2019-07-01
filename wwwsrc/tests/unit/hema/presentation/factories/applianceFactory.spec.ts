/// <reference path="../../../../../typings/app.d.ts" />

import {ApplianceFactory} from "../../../../../app/hema/presentation/factories/applianceFactory";
import {Appliance as ApplianceBusinessModel} from "../../../../../app/hema/business/models/appliance";
import {Job} from "../../../../../app/hema/business/models/job";
import {ApplianceSafetyType} from "../../../../../app/hema/business/models/applianceSafetyType";
import {IObjectType} from "../../../../../app/hema/business/models/reference/IObjectType";
import {QueryableBusinessRuleGroup} from "../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import {ApplianceViewModel} from "../../../../../app/hema/presentation/modules/appliances/viewModels/applianceViewModel";
import {IBusinessRuleService} from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {ICatalogService} from "../../../../../app/hema/business/services/interfaces/ICatalogService";
import { IDataStateManager } from "../../../../../app/hema/common/IDataStateManager";
import {DataState} from "../../../../../app/hema/business/models/dataState";

describe("the applianceFactory", () => {
    let sandbox: Sinon.SinonSandbox;
    let applianceFactory: ApplianceFactory;
    let businessRuleServiceStub: IBusinessRuleService;
    let dataStateManagerStub: IDataStateManager;
    let catalogServiceStub: ICatalogService;
    let updateApplianceDataStateStub: Sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        
        dataStateManagerStub = <IDataStateManager>{};
        catalogServiceStub = <ICatalogService>{};
        businessRuleServiceStub = <IBusinessRuleService>{};

        let ruleGroup = <QueryableBusinessRuleGroup>{};
        let getBusinessRuleStub = ruleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("applianceTypesToUseEngineerPatchInsteadToCalculateSafetyType").returns("");
        getBusinessRuleStub.withArgs("applianceCategoryOther").returns("O");
        getBusinessRuleStub.withArgs("applianceCategoryElectrical").returns("E");
        getBusinessRuleStub.withArgs("applianceCategoryGas").returns("G");
        getBusinessRuleStub.withArgs("electricalWorkingSector").returns("PatchES");
        getBusinessRuleStub.withArgs("hardWareCatForCHAppliance").returns("X");
        getBusinessRuleStub.withArgs("instPremApplianceType").returns("INS");

        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().returns(Promise.resolve(ruleGroup));

        updateApplianceDataStateStub = dataStateManagerStub.updateApplianceDataState = sandbox.stub().resolves(undefined);

        applianceFactory = new ApplianceFactory(businessRuleServiceStub, catalogServiceStub, dataStateManagerStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should be defined", () => {
        expect(applianceFactory).toBeDefined();
    });

    describe("createNewApplianceViewModel method", () => {

        it("should map fields correctly and return a new appliance viewmodel", () => {
            let applianceViewModel = applianceFactory.createNewApplianceViewModel();
            expect(applianceViewModel).not.toBeUndefined();
            expect(applianceViewModel.dataStateGroup).toBe("appliances");
            expect(applianceViewModel.hasChildAppliance).toBe(false);
            expect(applianceViewModel.hasParentAppliance).toBe(false);
        });

    });

    describe("createApplianceViewModelFromBusinessModel method", () => {

        it("should map fields correctly and return appliance view model", () => {
            let applianceBusinessModel = new ApplianceBusinessModel();
            applianceBusinessModel.dataStateGroup = "appliances";
            applianceBusinessModel.dataState = DataState.notVisited;
            applianceBusinessModel.dataStateId = "abcd";
            applianceBusinessModel.id = "239470352";
            applianceBusinessModel.gcCode = "4704724";
            applianceBusinessModel.category = "X";
            applianceBusinessModel.contractType = "CNI1";
            applianceBusinessModel.contractExpiryDate = new Date("2018-08-06T00:00:00.000Z");
            applianceBusinessModel.applianceType = "CHB";
            applianceBusinessModel.description = "description";
            applianceBusinessModel.flueType = "F";
            applianceBusinessModel.cylinderType = "C";
            applianceBusinessModel.energyControl = "E";
            applianceBusinessModel.locationDescription = "test location description";
            applianceBusinessModel.condition = "C";
            applianceBusinessModel.numberOfRadiators = 5;
            applianceBusinessModel.numberOfSpecialRadiators = 2;
            applianceBusinessModel.installationYear = 2010;
            applianceBusinessModel.systemDesignCondition = "S";
            applianceBusinessModel.systemType = "ST";
            applianceBusinessModel.notes = "test";
            applianceBusinessModel.boilerSize = 5;
            applianceBusinessModel.isInstPremAppliance = false;
            applianceBusinessModel.applianceSafetyType = ApplianceSafetyType.gas;

            let applianceTypeCatalogItem = <IObjectType> {
                "category": "X",
                "applianceType": "CHB",
                "applianceTypeDescription": "C/HEAT BLR",
                "applianceSafetyNotRequiredIndicator": "N",
                "applianceCategory": "G",
                "useIaci": "Y",
                "fetchGCCode": "Y",
                "allowCreateInField": "Y",
                "allowDeleteInField": "Y",
                "association": ""
            };
        
            let viewModel = applianceFactory.createApplianceViewModelFromBusinessModel(applianceBusinessModel,
                        applianceTypeCatalogItem, "X", "Y", null);
            expect(viewModel.applianceType).toEqual(applianceBusinessModel.applianceType);
            expect(viewModel.id).toEqual(applianceBusinessModel.id);
            expect(viewModel.category).toEqual(applianceBusinessModel.category);
            expect(viewModel.contractType).toEqual(applianceBusinessModel.contractType);
            expect(viewModel.contractExpiryDate).toEqual(applianceBusinessModel.contractExpiryDate);
            expect(viewModel.description).toEqual(applianceBusinessModel.description);
            expect(viewModel.flueType).toEqual(applianceBusinessModel.flueType);
            expect(viewModel.cylinderType).toEqual(applianceBusinessModel.cylinderType);
            expect(viewModel.energyControl).toEqual(applianceBusinessModel.energyControl);
            expect(viewModel.locationDescription).toEqual(applianceBusinessModel.locationDescription);
            expect(viewModel.condition).toEqual(applianceBusinessModel.condition);
            expect(viewModel.numberOfRadiators).toEqual(applianceBusinessModel.numberOfRadiators);   
            expect(viewModel.numberOfSpecialRadiators).toEqual(applianceBusinessModel.numberOfSpecialRadiators);   
            expect(viewModel.installationYear).toEqual(applianceBusinessModel.installationYear);   
            expect(viewModel.systemDesignCondition).toEqual(applianceBusinessModel.systemDesignCondition);
            expect(viewModel.systemType).toEqual(applianceBusinessModel.systemType); 
            expect(viewModel.notes).toEqual(applianceBusinessModel.notes);     
            expect(viewModel.boilerSize).toEqual(applianceBusinessModel.boilerSize);            
            expect(viewModel.isInstPremAppliance).toEqual(applianceBusinessModel.isInstPremAppliance);
            expect(viewModel.isGasAppliance).toEqual(true);
            expect(viewModel.isCentralHeatingAppliance).toEqual(true);
            expect(viewModel.requiresGcCode).toEqual(true);
            expect(viewModel.hasChildAppliance).toEqual(false);
            expect(viewModel.hasParentAppliance).toEqual(false);            
        });

    });

    describe("updateApplianceViewModelApplianceType method", () => {        

        it("should update appliance view model", async () => {
            let applianceViewModel = new ApplianceViewModel();
            applianceViewModel.applianceType = "EWR";

            let applianceTypeCatalogItem = <IObjectType> {
                "category": "A",
                "applianceType": "EWR",
                "applianceTypeDescription": "ELEC WIRNG",
                "applianceSafetyNotRequiredIndicator": "N",
                "applianceCategory": "E",
                "useIaci": "N",
                "fetchGCCode": "N",
                "allowCreateInField": "Y",
                "allowDeleteInField": "Y",
                "association": ""
            };
            catalogServiceStub.getObjectType = sandbox.stub().resolves(applianceTypeCatalogItem);
            await applianceFactory.updateApplianceViewModelApplianceType(applianceViewModel, applianceViewModel.applianceType, 
                    applianceTypeCatalogItem, "X", "Y", "P", "PatchES");
            expect(applianceViewModel.applianceSafetyType).toEqual(ApplianceSafetyType.electrical);
            expect(applianceViewModel.isGasAppliance).toEqual(false);
            expect(applianceViewModel.isCentralHeatingAppliance).toEqual(false);
            expect(applianceViewModel.requiresGcCode).toEqual(false);
            expect(applianceViewModel.hasParentAppliance).toEqual(false);
            expect(applianceViewModel.parentApplianceType).toEqual(undefined);
            expect(applianceViewModel.hasChildAppliance).toEqual(false);
        });     

    });

    describe("createApplianceBusinessModelFromViewModel method", () => {

        let applianceViewModel = new ApplianceViewModel();
        applianceViewModel.dataStateGroup = "appliances";
        applianceViewModel.dataState = DataState.notVisited;
        applianceViewModel.dataStateId = "abcd";
        applianceViewModel.id = "239470352";
        applianceViewModel.gcCode = "4704724";
        applianceViewModel.category = "X";
        applianceViewModel.contractType = "CNI1";
        applianceViewModel.contractExpiryDate = new Date("2018-08-06T00:00:00.000Z");
        applianceViewModel.applianceType = "CHB";
        applianceViewModel.description = "description";
        applianceViewModel.isInstPremAppliance = false;
        applianceViewModel.applianceSafetyType = ApplianceSafetyType.gas;
        applianceViewModel.flueType = "O";   
        applianceViewModel.cylinderType = "C";
        applianceViewModel.energyControl = "E";
        applianceViewModel.locationDescription = "test location description";
        applianceViewModel.condition = "C";
        applianceViewModel.numberOfRadiators = 5;
        applianceViewModel.numberOfSpecialRadiators = 2;
        applianceViewModel.installationYear = 2010;
        applianceViewModel.systemDesignCondition = "S";
        applianceViewModel.systemType = "ST";
        applianceViewModel.notes = "test";
        applianceViewModel.boilerSize = 5;   

        let job = <Job> {
            id: "1223333",
            isLandlordJob: false,
            tasks: [{id: "121233", status: "D", applianceId: "239470352"}]
        };

        let applianceTypeCatalogItem = <IObjectType> {
          "category": "X",
          "applianceType": "CHB",
          "applianceTypeDescription": "C/HEAT BLR",
          "applianceSafetyNotRequiredIndicator": "N",
          "applianceCategory": "G",
          "useIaci": "Y",
          "fetchGCCode": "Y",
          "allowCreateInField": "Y",
          "allowDeleteInField": "Y",
          "association": ""
        };

        it("should map fields correctly and return appliance business model", async () => {
            catalogServiceStub.getObjectType = sandbox.stub().resolves(applianceTypeCatalogItem);
            let applianceBusinessModel = await applianceFactory.createApplianceBusinessModelFromViewModel(applianceViewModel, job, "PatchGS");
            expect(applianceBusinessModel.applianceSafetyType).toEqual(ApplianceSafetyType.gas);
            expect(applianceBusinessModel.id).toEqual(applianceViewModel.id);
            expect(applianceBusinessModel.category).toEqual(applianceViewModel.category);
            expect(applianceBusinessModel.contractType).toEqual(applianceViewModel.contractType);
            expect(applianceBusinessModel.contractExpiryDate).toEqual(applianceViewModel.contractExpiryDate);
            expect(applianceBusinessModel.description).toEqual(applianceViewModel.description);
            expect(applianceBusinessModel.flueType).toEqual(applianceViewModel.flueType);
            expect(applianceBusinessModel.cylinderType).toEqual(applianceViewModel.cylinderType);
            expect(applianceBusinessModel.energyControl).toEqual(applianceViewModel.energyControl);
            expect(applianceBusinessModel.locationDescription).toEqual(applianceViewModel.locationDescription);
            expect(applianceBusinessModel.condition).toEqual(applianceViewModel.condition);
            expect(applianceBusinessModel.numberOfRadiators).toEqual(applianceViewModel.numberOfRadiators);   
            expect(applianceBusinessModel.numberOfSpecialRadiators).toEqual(applianceViewModel.numberOfSpecialRadiators);   
            expect(applianceBusinessModel.installationYear).toEqual(applianceViewModel.installationYear);   
            expect(applianceBusinessModel.systemDesignCondition).toEqual(applianceViewModel.systemDesignCondition);
            expect(applianceBusinessModel.systemType).toEqual(applianceViewModel.systemType); 
            expect(applianceBusinessModel.notes).toEqual(applianceViewModel.notes);     
            expect(applianceBusinessModel.boilerSize).toEqual(applianceViewModel.boilerSize);         
            expect(applianceBusinessModel.isInstPremAppliance).toEqual(applianceViewModel.isInstPremAppliance);
            expect(updateApplianceDataStateStub.called).toEqual(true);
        });

    });  

    describe("updateApplianceBusinessModelFromViewModel method", () => {

        let applianceViewModel = new ApplianceViewModel();
        applianceViewModel.dataStateGroup = "appliances";
        applianceViewModel.dataState = DataState.notVisited;
        applianceViewModel.dataStateId = "abcd";
        applianceViewModel.id = "239470352";
        applianceViewModel.gcCode = "4704724";
        applianceViewModel.category = "X";
        applianceViewModel.applianceType = "CHB";
        applianceViewModel.description = "description";
        applianceViewModel.isInstPremAppliance = false;
        applianceViewModel.applianceSafetyType = ApplianceSafetyType.gas;
        applianceViewModel.flueType = "O";   
        applianceViewModel.cylinderType = "D";
        applianceViewModel.energyControl = "STD";
        applianceViewModel.locationDescription = "locationDescription";
        applianceViewModel.numberOfRadiators = 5;
        applianceViewModel.numberOfSpecialRadiators = 2;
        applianceViewModel.installationYear = 2010;
        applianceViewModel.systemDesignCondition = "Ok";
        applianceViewModel.systemType = "Conditoin Ok";
        applianceViewModel.notes = "notes";
        applianceViewModel.boilerSize = 20; 

        let applianceBusinessModel = <ApplianceBusinessModel> {};

        it("should update appliance business model from the view model", () => {
            applianceFactory.updateApplianceBusinessModelFromViewModel(applianceViewModel, applianceBusinessModel);
            expect(applianceBusinessModel.gcCode).toEqual(applianceViewModel.gcCode);
            expect(applianceBusinessModel.applianceType).toEqual(applianceViewModel.applianceType);
            expect(applianceBusinessModel.category).toEqual(applianceViewModel.category);
            expect(applianceBusinessModel.description).toEqual(applianceViewModel.description);
            expect(applianceBusinessModel.flueType).toEqual(applianceViewModel.flueType);
            expect(applianceBusinessModel.cylinderType).toEqual(applianceViewModel.cylinderType);
            expect(applianceBusinessModel.energyControl).toEqual(applianceViewModel.energyControl);
            expect(applianceBusinessModel.locationDescription).toEqual(applianceViewModel.locationDescription);
            expect(applianceBusinessModel.condition).toEqual(applianceViewModel.condition);
            expect(applianceBusinessModel.numberOfRadiators).toEqual(applianceViewModel.numberOfRadiators);   
            expect(applianceBusinessModel.numberOfSpecialRadiators).toEqual(applianceViewModel.numberOfSpecialRadiators);   
            expect(applianceBusinessModel.installationYear).toEqual(applianceViewModel.installationYear);   
            expect(applianceBusinessModel.systemDesignCondition).toEqual(applianceViewModel.systemDesignCondition);
            expect(applianceBusinessModel.systemType).toEqual(applianceViewModel.systemType); 
            expect(applianceBusinessModel.notes).toEqual(applianceViewModel.notes);     
            expect(applianceBusinessModel.boilerSize).toEqual(applianceViewModel.boilerSize); 
            expect(applianceBusinessModel.applianceSafetyType).toEqual(applianceViewModel.applianceSafetyType);  
            expect(applianceBusinessModel.dataState).toEqual(applianceViewModel.dataState);   
        });

    });
});