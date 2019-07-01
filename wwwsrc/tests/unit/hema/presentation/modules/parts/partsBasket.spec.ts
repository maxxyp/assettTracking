/// <reference path="../../../../../../typings/app.d.ts" />

import {PartsBasket} from "../../../../../../app/hema/presentation/modules/parts/partsBasket";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import {IJobService} from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { IStorageService } from "../../../../../../app/hema/business/services/interfaces/IStorageService";
import {IVanStockService} from "../../../../../../app/hema/business/services/interfaces/IVanStockService";
import {IEngineerService} from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {IPartService} from "../../../../../../app/hema/business/services/interfaces/IPartService";
import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService, DialogResult } from "aurelia-dialog";
import { IValidationService } from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { BindingEngine } from "aurelia-framework";
import { Router } from "aurelia-router";
import {IConfigurationService} from "../../../../../../app/common/core/services/IConfigurationService";
import {IAppointmentBookingService} from "../../../../../../app/hema/business/services/interfaces/IAppointmentBookingService";
import {IAppLauncher} from "../../../../../../app/common/core/services/IAppLauncher";
import {IPartsBasketFactory} from "../../../../../../app/hema/presentation/factories/interfaces/IPartsBasketFactory";
import {IConsumableService} from "../../../../../../app/hema/business/services/interfaces/IConsumableService";
import {IFavouriteService} from "../../../../../../app/hema/business/services/interfaces/IFavouriteService";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { IHemaConfiguration } from "../../../../../../app/hema/IHemaConfiguration";
import { PartsBasketViewModel } from "../../../../../../app/hema/presentation/models/partsBasketViewModel";
import { Job } from "../../../../../../app/hema/business/models/job";
import { Task } from "../../../../../../app/hema/business/models/task";
import { IJcJobCode } from "../../../../../../app/hema/business/models/reference/IJcJobCode";
import { IObjectType } from "../../../../../../app/hema/business/models/reference/IObjectType";
import { IChargeType } from "../../../../../../app/hema/business/models/reference/IChargeType";
import { IFeatureToggleService } from "../../../../../../app/hema/business/services/interfaces/IFeatureToggleService";

describe("the PartsBasket module", () => {
    let partsBasket: PartsBasket;
    let sandbox: Sinon.SinonSandbox;

    let catalogServiceStub: ICatalogService;
    let jobServiceStub: IJobService;
    let storageServiceStub: IStorageService;
    let vanStockServiceStub: IVanStockService;
    let labelServiceStub: ILabelService;
    let partServiceStub: IPartService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    // let dialogOpenSpy: Sinon.SinonSpy;
    // let getPropertyObserverStub: Sinon.SinonStub;

    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let bindingEngineStub: BindingEngine;
    let routerStub: Router;
    let configurationServiceStub: IConfigurationService;
    let appointmentBookingServiceStub: IAppointmentBookingService;
    let appLauncherStub: IAppLauncher;
    // let appLauncherLaunchAppliacationSpy: Sinon.SinonSpy;
    let partsBasketFactoryStub: IPartsBasketFactory;
    let consumableServiceStub: IConsumableService;
    let favouriteServiceStub: IFavouriteService;
    // let publishStub: Sinon.SinonStub;
    let featureToggleServiceStub: IFeatureToggleService;

    let sectors = [
        {sectorCode: "PatchGas", sectorDescription: "Gas Services"},
        {sectorCode: "PatchES", sectorDescription: "Electrical Services"}
    ];
    let job = <Job>{};

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        catalogServiceStub = <ICatalogService>{};
        catalogServiceStub.getJCJobCode = sandbox.stub().resolves(<IJcJobCode>{fieldAppCode: "foo"});
        catalogServiceStub.getObjectType = sandbox.stub().resolves(<IObjectType>{applianceTypeDescription: "bar"});
        catalogServiceStub.getChargeType = sandbox.stub().resolves(<IChargeType>{chargeTypeDescription: "baz"});

        jobServiceStub = <IJobService>{};
        jobServiceStub.getJob = sandbox.stub().resolves(job);

        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sandbox.stub().resolves(<{ [key: string]: string }>{
            "errorDescription": "",
            "errorTitle": "",
            "PartsBasket": "",
            "no": "",
            "yes": "",
            "confirmation": "",
            "clearQuestion": "",
            "objectName": "",
            "TodaysParts": "",
            "appointmentBooking": "",
            "appointmentBookingMessage": "",
            "close": ""
    });

        partServiceStub = <IPartService>{};
        partServiceStub.getPartStatusValidity = sandbox.stub().resolves(false);
            partServiceStub.getPartsBasket = sandbox.stub().resolves(null);
        partServiceStub.savePartsBasket = sandbox.stub().resolves(null);

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.publish = sandbox.stub();
            eventAggregatorStub.subscribe = sandbox.stub();

        dialogServiceStub = <DialogService>{};
        dialogServiceStub.open = sandbox.stub().resolves(<DialogResult>{});

        validationServiceStub = <IValidationService>{};
            validationServiceStub.addDynamicRule = sandbox.stub();
            validationServiceStub.removeDynamicRule = sandbox.stub();


        storageServiceStub = <IStorageService>{};
        vanStockServiceStub = <IVanStockService>{};



        partsBasketFactoryStub = <IPartsBasketFactory>{};
        consumableServiceStub = <IConsumableService>{};
        favouriteServiceStub = <IFavouriteService>{};

        favouriteServiceStub.getFavouritesList = sandbox.stub().resolves([]);


        let ruleGroup = <QueryableBusinessRuleGroup>{};
        let getBusinessRuleStub = ruleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("firstVisitCode").returns("FV");
        getBusinessRuleStub.withArgs("stockReferencePrefixesToStopWarrantyReturn").returns("F");
        getBusinessRuleStub.withArgs("isPartConsumableStockReferencePrefix").returns("C,F");
        getBusinessRuleStub.withArgs("notDoingJobStatuses").returns("NA");
        getBusinessRuleStub.withArgs("vanStockPartOrderStatus").returns("V");


        businessRuleServiceStub = <IBusinessRuleService>{};
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(ruleGroup);

        let businessRules: { [key: string]: any } = {};
        businessRules["consumablesRule"] = "[^E|^I|^O|[^0-9]";
        businessRules["vanStockPartOrderStatus"] = "V";
        businessRules["partOrderStatus"] = "O";

        businessRules["quantityIncrementStep"] = 1;
        businessRules["priceDecimalPlaces"] = 2;
        businessRules["workedOnClaimRejectCoveredCode"] = "CR";
        businessRules["partsCurrencyUnit"] = 0.01;
        businessRules["isPartConsumableStockReferencePrefix"] = "C,F";


        businessRules["completeStatus"] = "C";
        businessRules["partsRequiredStatus"] = "IP";
        businessRules["waitAdviceStatus"] = "WA";
        businessRules["stockReferencePrefixesToStopWarrantyReturn"] = "F";

        businessRules["firstVisitJob"] = "FV";

        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(businessRules);


        bindingEngineStub = <BindingEngine>{};
        routerStub = <Router>{};
        appLauncherStub = <IAppLauncher>{};
        // appLauncherLaunchAppliacationSpy = appLauncherStub.launchApplication = sandbox.spy();

        configurationServiceStub = <IConfigurationService>{};
        configurationServiceStub.getConfiguration = sandbox.stub().returns(<IHemaConfiguration>{adaptLaunchUri: "Y:"});

        appointmentBookingServiceStub = <IAppointmentBookingService>{};
        appointmentBookingServiceStub.checkCutOffTimeExceededWithParts = sandbox.stub().returns(false);






        vanStockServiceStub.getSectors = sandbox.stub().resolves(sectors);

        storageServiceStub.getUserPatch = sandbox.stub().resolves("");
        storageServiceStub.getWorkingSector = sandbox.stub().resolves("");


        job = new Job();
        job.id = "1";
            let task = new Task(true, false);
        task.status = "NA";
        job.tasks = [task];
        jobServiceStub.getJob = sandbox.stub().resolves(job);

        partsBasketFactoryStub.createPartsBasketViewModel = sandbox.stub().returns(new PartsBasketViewModel());

        featureToggleServiceStub = <IFeatureToggleService>{};
        featureToggleServiceStub.isAssetTrackingEnabled = sandbox.stub().returns(true);

        partsBasket = new PartsBasket(
            catalogServiceStub,
            <IEngineerService>{},
            jobServiceStub,
            labelServiceStub,
            partServiceStub,
            eventAggregatorStub,
            dialogServiceStub,
            validationServiceStub,
            businessRuleServiceStub,
            bindingEngineStub,
            routerStub,
            vanStockServiceStub,
            storageServiceStub,
            appLauncherStub,
            configurationServiceStub,
            appointmentBookingServiceStub,
            partsBasketFactoryStub,
            consumableServiceStub,
            favouriteServiceStub,
            featureToggleServiceStub
        );
        });

        afterEach(() => {
            sandbox.restore();
        });

    it("can be created", () => {
        expect(partsBasket).toBeDefined();
                });
            });


/*
    load and set up lookups
    load and add a part
    load and add a part - two tasks
    load and add a part - one task, van stock
    load and add a part - one task, non van stock
    delete a part

    load and set up with existing parts
*/