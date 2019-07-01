/*
/// <reference path="../../../../../../typings/app.d.ts" />
import {Router} from "aurelia-router";
import {EventAggregator} from "aurelia-event-aggregator";
import {BindingEngine} from "aurelia-binding";
import {DialogService/*, DialogResult} from "aurelia-dialog";

import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {IJobService} from "../../../../../../app/hema/business/services/interfaces/IJobService";
import {IVanStockService} from "../../../../../../app/hema/business/services/interfaces/IVanStockService";
import {IValidationService} from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import {IBusinessRuleService} from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {ICatalogService} from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import {IEngineerService} from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import {IPartService} from "../../../../../../app/hema/business/services/interfaces/IPartService";
import {IStorageService} from "../../../../../../app/hema/business/services/interfaces/IStorageService";

import { PartsBasket } from "../../../../../../app/hema/presentation/modules/parts/partsBasket";
import {CollectionObserver, Disposable, PropertyObserver} from "aurelia-binding";
import {PartsBasket as PartsBasketBusinessModel} from "../../../../../../app/hema/business/models/partsBasket";
import {Part} from "../../../../../../app/hema/business/models/part";
import {WarrantyEstimate} from "../../../../../../app/hema/business/models/warrantyEstimate";
import {Guid} from "../../../../../../app/common/core/guid";
import {Task} from "../../../../../../app/hema/business/models/task";
import {ValidationCombinedResult} from "../../../../../../app/hema/business/services/validation/validationCombinedResult";
import {Job} from "../../../../../../app/hema/business/models/job";
// import {VanStockNotice} from "../../../../../../app/hema/presentation/modules/vanStockNotice/vanStockNotice";
import {QueryableBusinessRuleGroup} from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import {IConfigurationService} from "../../../../../../app/common/core/services/IConfigurationService";
import {IAppointmentBookingService} from "../../../../../../app/hema/business/services/interfaces/IAppointmentBookingService";
import {IAppLauncher} from "../../../../../../app/common/core/services/IAppLauncher";
import {IPartsBasketFactory} from "../../../../../../app/hema/presentation/factories/interfaces/IPartsBasketFactory";
import {IHemaConfiguration} from "../../../../../../app/hema/IHemaConfiguration";
import { PartsBasketViewModel } from "../../../../../../app/hema/presentation/models/partsBasketViewModel";
import {IGoodsType} from "../../../../../../app/hema/business/models/reference/IGoodsType";
import {IConsumableService} from "../../../../../../app/hema/business/services/interfaces/IConsumableService";
import {IFavouriteService} from "../../../../../../app/hema/business/services/interfaces/IFavouriteService";
import {IPartOrderStatus} from "../../../../../../app/hema/business/models/reference/IPartOrderStatus";
import { ChargeServiceConstants } from "../../../../../../app/hema/business/services/constants/chargeServiceConstants";
import {WarrantyEstimateType} from "../../../../../../app/hema/business/models/warrantyEstimateType";

describe("the PartsBasket module", () => {
    let partsBasket: PartsBasket;
    let sandbox: Sinon.SinonSandbox;

    let catalogServiceStub: ICatalogService;
    let jobServiceStub: IJobService;
    let storageServiceStub: IStorageService;
    let vanStockServiceStub: IVanStockService;
    let engineerServiceStub: IEngineerService;
    let labelServiceStub: ILabelService;
    let partServiceStub: IPartService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    // let dialogOpenSpy: Sinon.SinonSpy;
    let getPropertyObserverStub: Sinon.SinonStub;

    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let bindingEngineStub: BindingEngine;
    let routerStub: Router;
    let configurationServiceStub: IConfigurationService;
    let appointmentBookingServiceStub: IAppointmentBookingService;
    let appLauncherStub: IAppLauncher;
    let appLauncherLaunchAppliacationSpy: Sinon.SinonSpy;
    let partsBasketFactoryStub: IPartsBasketFactory;
    let consumableServiceStub: IConsumableService;
    let favouriteServiceStub: IFavouriteService;
    let publishStub: Sinon.SinonStub;

    let sectors = [
        {sectorCode: "PatchGas", sectorDescription: "Gas Services"},
        {sectorCode: "PatchES", sectorDescription: "Electrical Services"}
    ];
    let job = <Job>{};

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        catalogServiceStub = <ICatalogService>{};
        jobServiceStub = <IJobService>{};
        storageServiceStub = <IStorageService>{};
        vanStockServiceStub = <IVanStockService>{};
        engineerServiceStub = <IEngineerService>{};
        labelServiceStub = <ILabelService>{};
        partServiceStub = <IPartService>{};
        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.publish = sandbox.stub();
        partsBasketFactoryStub = <IPartsBasketFactory>{};
        consumableServiceStub = <IConsumableService>{};
        favouriteServiceStub = <IFavouriteService>{};

        favouriteServiceStub.getFavouritesList = sandbox.stub().resolves([]);

        dialogServiceStub = <DialogService>{};
        // dialogOpenSpy = dialogServiceStub.open = sandbox.stub().resolves(<DialogResult>{});
        validationServiceStub = <IValidationService>{};
        businessRuleServiceStub = <IBusinessRuleService>{};
        bindingEngineStub = <BindingEngine>{};
        routerStub = <Router>{};
        appLauncherStub = <IAppLauncher>{};
        appLauncherLaunchAppliacationSpy = appLauncherStub.launchApplication = sandbox.spy();

        configurationServiceStub = <IConfigurationService>{};
        configurationServiceStub.getConfiguration = sandbox.stub().returns(<IHemaConfiguration>{adaptLaunchUri: "Y:"});

        appointmentBookingServiceStub = <IAppointmentBookingService>{};
        appointmentBookingServiceStub.checkCutOffTimeExceededWithParts = sandbox.stub().returns(false);
        partServiceStub.getPartStatusValidity = sandbox.stub().resolves(false);

        let ruleGroup = <QueryableBusinessRuleGroup>{};
        let getBusinessRuleStub = ruleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("firstVisitCode").returns("FV");
        getBusinessRuleStub.withArgs("stockReferencePrefixesToStopWarrantyReturn").returns("F");
        getBusinessRuleStub.withArgs("isPartConsumableStockReferencePrefix").returns("C,F");
        getBusinessRuleStub.withArgs("notDoingJobStatuses").returns("NA");
        getBusinessRuleStub.withArgs("vanStockPartOrderStatus").returns("V");

        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(ruleGroup);

        partServiceStub.getPartsBasket = sandbox.stub().resolves(null);
        partServiceStub.setPartsRequiredForTask = sandbox.stub().resolves(null);

        catalogServiceStub.getJCJobCode = sandbox.stub().resolves(null);
        catalogServiceStub.getObjectType = sandbox.stub().resolves(null);
        catalogServiceStub.getChargeType = sandbox.stub().resolves(null);
        catalogServiceStub.getPartOrderStatuses = sandbox.stub().resolves(null);
        catalogServiceStub.getGoodsType = sandbox.stub().resolves(null);

        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(null);

        vanStockServiceStub.getSectors = sandbox.stub().resolves(sectors);

        storageServiceStub.getUserPatch = sandbox.stub().resolves("");
        storageServiceStub.getWorkingSector = sandbox.stub().resolves("");

        jobServiceStub.getJob = sandbox.stub().resolves(job);

        validationServiceStub.removeDynamicRule = sandbox.stub();
        validationServiceStub.build = sandbox.stub();

       // partsBasket.buildValidation = sandbox.stub().resolves(null);

        publishStub = eventAggregatorStub.publish = sandbox.stub();
        eventAggregatorStub.subscribe = sandbox.stub();

        let businessRules: { [key: string]: any } = {};
        businessRules["consumablesRule"] = "[^E|^I|^O|[^0-9]";
        businessRules["vanStockPartOrderStatus"] = "V";
        businessRules["partOrderStatus"] = "O";

        businessRules["quantityIncrementStep"] = 1;
        businessRules["priceDecimalPlaces"] = 2;
        businessRules["workedOnClaimRejectCoveredCode"] = "CR";
        businessRules["partsCurrencyUnit"] = 0.01;
        businessRules["completeStatus"] = "C";
        businessRules["partsRequiredStatus"] = "IP";
        businessRules["waitAdviceStatus"] = "WA";
        businessRules["stockReferencePrefixesToStopWarrantyReturn"] = "F";
        businessRules["isPartConsumableStockReferencePrefix"] = "C,F";
        businessRules["firstVisitJob"] = "FV";

        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(businessRules);

        job = new Job();
        job.id = "1";
        let task = new Task(true, false);
        task.status = "NA";
        job.tasks = [task];
        jobServiceStub.getJob = sandbox.stub().resolves(job);

        partsBasketFactoryStub.createPartsBasketViewModel = sandbox.stub().returns(new PartsBasketViewModel());

        partsBasket = new PartsBasket(catalogServiceStub, engineerServiceStub, jobServiceStub,
            labelServiceStub, partServiceStub, eventAggregatorStub, dialogServiceStub, validationServiceStub,
            businessRuleServiceStub, bindingEngineStub, routerStub, vanStockServiceStub, storageServiceStub,
            appLauncherStub, configurationServiceStub, appointmentBookingServiceStub, partsBasketFactoryStub, consumableServiceStub, favouriteServiceStub);

        partsBasket.labels = {
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
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(partsBasket).toBeDefined();
    });

    it("can save and hit the partsService saveTodaysParts method with the expected inputs", done => {
        let saveSpy: Sinon.SinonSpy = partServiceStub.savePartsBasket = sandbox.stub().resolves(null);

        partsBasket.jobId = "1";

        partsBasket.viewModel = <PartsBasketBusinessModel>{
            partsInBasket: []
        };

        partsBasket.save().then(() => {
            expect(partsBasket.viewModel.partsToOrder).toBe(partsBasket.viewModel.partsInBasket);
            expect(saveSpy.calledOnce).toBe(true);
            expect(saveSpy.args[0][0]).toBe("1");
            expect(saveSpy.args[0][1]).toEqual(partsBasket.viewModel);
            done();
        });
    });

    it("can not call update charges when not dirty and save is called", done => {
        partServiceStub.savePartsBasket = sandbox.stub().resolves(null);
        partsBasket.jobId = "1";
        partsBasket.viewModel = <PartsBasketBusinessModel>{
            partsInBasket: []
        };

        partsBasket.setDirty(false);
        partsBasket.save().then(() => {
            expect(publishStub.calledWith(ChargeServiceConstants.CHARGE_UPDATE_START, "1")).toBe(false);
            done();
        });
    });

    it("can call update charges when dirty and save is called", done => {
        partServiceStub.savePartsBasket = sandbox.stub().resolves(null);
        partsBasket.jobId = "1";
        partsBasket.viewModel = <PartsBasketBusinessModel>{
            partsInBasket: []
        };

        partsBasket.setDirty(true);
        partsBasket.save().then(() => {
            expect(publishStub.calledWith(ChargeServiceConstants.CHARGE_UPDATE_START, "1")).toBe(true);
            done();
        });
    });

    // Needs sorting
    // fit("can clear", done => {

    //     bindingEngineStub.collectionObserver = sandbox.stub().returns(<CollectionObserver>{
    //         subscribe: () => <Disposable>{}
    //     });

    //     let task = new Task(true, false);
    //     task.activity = "Task 1";
    //     task.applianceType = "APP";
    //     task.status = "IP";
    //     task.jobType = "JOB";
    //     task.chargeType = "CHG";

    //     job.tasks = [task];

    //     taskServiceStub.getTasks = sandbox.stub().resolves([task]);

    //     partsBasket.viewModel = <PartsBasketBusinessModel>{
    //         partsInBasket: [{}],
    //         manualPartDetail: {},
    //         showAddPartManually: true,
    //         showRemainingAddPartManuallyFields: true,
    //         deliverPartsToSite: true
    //     };

    //     // partsBasket.activateAsync().then(() => { partsBasket.clear().then(() => {
    //     //     expect(partsBasket.viewModel.partsInBasket).toEqual([]);
    //     //     expect(partsBasket.viewModel.manualPartDetail).toBe(null);
    //     //     expect(partsBasket.viewModel.showAddPartManually).toBe(false);
    //     //     expect(partsBasket.viewModel.showRemainingAddPartManuallyFields).toBe(false);
    //     //     expect(partsBasket.viewModel.deliverPartsToSite).toBe(null);
    //     //     expect(partsBasket.hideDeliverToSiteCheckbox).toBe(true);
    //     //     done();
    //     // }).catch((error) => {
    //     //             fail("Should not be here: " + error);
    //     //             done();
    //     // });

    //     partsBasket.clear().then(() => {
    //         expect(partsBasket.viewModel.partsInBasket).toEqual([]);
    //         expect(partsBasket.viewModel.manualPartDetail).toBe(null);
    //         expect(partsBasket.viewModel.showAddPartManually).toBe(false);
    //         expect(partsBasket.viewModel.showRemainingAddPartManuallyFields).toBe(false);
    //         expect(partsBasket.viewModel.deliverPartsToSite).toBe(null);
    //         expect(partsBasket.hideDeliverToSiteCheckbox).toBe(true);
    //         done();
    //     });
    // // });

    // });


    // stef reftoring:
    // it("can call openDialog and call the dialogService open method with the expected parameters", done => {

    //     storageServiceStub.getUserPatch = sandbox.stub().resolves("z");
    //     storageServiceStub.getWorkingSector = sandbox.stub().resolves("");

    //     let part = <Part>{};
    //     partsBasket.jobId = "1";

    //     partsBasket.loadUserSettings().then(() => {
    //         partsBasket.openDialog(part);
    //         expect(dialogOpenSpy.args[0]).toEqual([
    //             {viewModel: VanStockNotice, model: {jobId: "1", part, userPatch: "z"}}
    //         ]);
    //         done();
    //     });

    // });

    it("can call setSameRefAsOriginal on a part and set the warranty removedPartStockReferenceId", () => {
        let part = <Part>{
            stockReferenceId: "x",
            warrantyReturn: {}
        };

        partsBasket.setSameRefAsOriginal(part);
        expect(part.warrantyReturn.removedPartStockReferenceId).toBe("x");
    });

    it("can launch adapt", () => {
        partsBasket.launchAdapt();
        expect(appLauncherLaunchAppliacationSpy.calledWith("Y:")).toBe(true);
    });

    describe("the activateAsync function", () => {
        let disposableStub: Disposable;
        let collectionObserverStub: CollectionObserver;
        let propertyObserverStub: PropertyObserver;

        beforeEach(() => {
            eventAggregatorStub.subscribe = sandbox.stub();
            partsBasket.loadBusinessRules = sandbox.stub().resolves(null);

            let task = new Task(true, false);
            task.activity = "Task 1";
            task.applianceType = "APP";
            task.jobType = "JOB";
            task.chargeType = "CHG";

            // from refactor: taskServiceStub.getTasks = sandbox.stub().resolves([task]);
            partServiceStub.getPartsBasket = sandbox.stub().resolves(new PartsBasketBusinessModel());
            partServiceStub.getPartWarrantyEstimate = sandbox.stub().resolves(null);
            partServiceStub.getPartStatusValidity = sandbox.stub().resolves(false)
            partServiceStub.setPartsRequiredForTask = sandbox.stub().resolves(null);
            validationServiceStub.build = sandbox.stub().resolves(null);
            // from refactor: taskServiceStub.getTaskItem = sandbox.stub().resolves(task);

            disposableStub = <Disposable>{};
            disposableStub.dispose = sandbox.stub();

            collectionObserverStub = <CollectionObserver>{};
            collectionObserverStub.subscribe = (callback) => {
                return disposableStub;
            };

            propertyObserverStub = <PropertyObserver>{};
            propertyObserverStub.subscribe = (callback) => {
                return disposableStub;
            };

            bindingEngineStub.collectionObserver = sandbox.stub().returns(collectionObserverStub);
            getPropertyObserverStub = bindingEngineStub.propertyObserver = sandbox.stub().returns(propertyObserverStub);

            partsBasket.buildNoYesList = sandbox.stub().resolves(null);
            partsBasket.getBusinessRule = sandbox.stub().returns(null);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called", (done) => {
            let showContentSpy: Sinon.SinonSpy = partsBasket.showContent = sandbox.stub().resolves(null);

            partsBasket.activateAsync()
                .then(() => {
                    expect(partsBasket.tasksCatalog.length === 1).toBeTruthy();
                    expect(showContentSpy.calledOnce).toBe(true);
                    expect(partsBasket.canEdit).toBe(false);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can be called and load existing partsDetail", (done) => {

            let part: Part = new Part();
            part.id = Guid.newGuid();

            let partsBasketBusinessModel: PartsBasketBusinessModel = new PartsBasketBusinessModel();
            partsBasketBusinessModel.partsToOrder = [part];

            partServiceStub.getPartsBasket = sandbox.stub().resolves(partsBasketBusinessModel);
            partServiceStub.getPartWarrantyEstimate = sandbox.stub().resolves(null);

            let showContentSpy: Sinon.SinonSpy = partsBasket.showContent = sandbox.stub().resolves(null);

            let partsBasketViewModel = new PartsBasketViewModel();
            partsBasketFactoryStub.createPartsBasketViewModel = sandbox.stub().returns(partsBasketViewModel);

            partsBasket.activateAsync()
                .then(() => {
                    expect(partsBasket.tasksCatalog.length === 1).toBeTruthy();
                    expect(showContentSpy.calledOnce).toBe(true);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("can be called and set up partTaskAssociation binding", done => {
            let taskIdSubscribeSpy = sandbox.spy();
            getPropertyObserverStub.withArgs(sinon.match.any, "taskId").returns(<PropertyObserver>{
                subscribe: taskIdSubscribeSpy
            });

            let part: Part = new Part();
            part.id = Guid.newGuid();
            part.taskId = "x";

            let partsBasketBusinessModel: PartsBasketBusinessModel = new PartsBasketBusinessModel();
            partsBasketBusinessModel.partsToOrder = [part];

            partServiceStub.getPartsBasket = sandbox.stub().resolves(partsBasketBusinessModel);
            let estimate = <WarrantyEstimate>{};
            partServiceStub.getPartWarrantyEstimate = sandbox.stub().resolves(estimate);

            let partsBasketViewModel = new PartsBasketViewModel();
            partsBasketViewModel.partsToOrder = [part];
            partsBasketFactoryStub.createPartsBasketViewModel = sandbox.stub().returns(partsBasketViewModel);

            partsBasket.activateAsync().then(() => {
                let taskIdCallback: (newVal: any, oldVal: any) => Promise<any> = taskIdSubscribeSpy.args[0][0];

                taskIdCallback("x", "y").then(() => {
                    expect(partsBasket.tasksCatalog.length === 1).toBeTruthy();
                    expect(part.warrantyEstimate).toBe(estimate);
                    done();
                });
            });
        });

        it("should update warrantyEstimate for the part", (done) => {
            let part: Part = new Part();
            part.id = Guid.newGuid();

            let partsBasketBusinessModel: PartsBasketBusinessModel = new PartsBasketBusinessModel();
            partsBasketBusinessModel.partsToOrder = [part];

            partServiceStub.getPartsBasket = sandbox.stub().resolves(partsBasketBusinessModel);

            let warrantyEstimate = <WarrantyEstimate>{
                isInWarranty: true,
                warrantyPeriodWeeks: 100,
                lastFittedDate: new Date(),
                warrantyEstimateType: WarrantyEstimateType.applianceInstallationDate
            };
            partServiceStub.getPartWarrantyEstimate = sandbox.stub().resolves(warrantyEstimate);

            let partsBasketViewModel = new PartsBasketViewModel();
            partsBasketViewModel.partsToOrder = [part];
            partsBasketFactoryStub.createPartsBasketViewModel = sandbox.stub().returns(partsBasketViewModel);

            partsBasket.activateAsync()
                .then(() => {
                    expect(partsBasket.tasksCatalog.length === 1).toBeTruthy();
                    expect(partsBasket.viewModel.partsInBasket[0].warrantyEstimate).toBe(warrantyEstimate);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("for orphan task (without appliance) with parts", (done) => {
            let task = new Task(true, false);
            task.activity = "Task 1";
            task.applianceType = undefined
            task.jobType = "JOB";
            task.chargeType = "CHG";

            // from refactor: taskServiceStub.getTasks = sandbox.stub().resolves([task]);
            let part: Part = new Part();
            part.id = Guid.newGuid();

            let partsBasketBusinessModel: PartsBasketBusinessModel = new PartsBasketBusinessModel();
            partsBasketBusinessModel.partsToOrder = [part];

            partServiceStub.getPartsBasket = sandbox.stub().resolves(partsBasketBusinessModel);

            let warrantyEstimate = <WarrantyEstimate>{
                isInWarranty: true,
                warrantyPeriodWeeks: 100,
                lastFittedDate: new Date(),
                warrantyEstimateType: WarrantyEstimateType.applianceInstallationDate
            };
            partServiceStub.getPartWarrantyEstimate = sandbox.stub().resolves(warrantyEstimate);

            let partsBasketViewModel = new PartsBasketViewModel();
            partsBasketViewModel.partsToOrder = [part];
            partsBasketFactoryStub.createPartsBasketViewModel = sandbox.stub().returns(partsBasketViewModel);

            partsBasket.activateAsync()
                .then(() => {
                    expect(partsBasket.tasksCatalog.length === 0).toBeTruthy();
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });
    });

    describe("the deactivateAsync function", () => {
        beforeEach(() => {

        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called", (done) => {
            partsBasket.deactivateAsync()
                .then(() => {
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });
    });

    describe("the hideAddPartManually function", () => {

        beforeEach(() => {

        });

        afterEach(() => {
            sandbox.restore();
        });

        it("will hide the add part manually section", () => {

            partsBasket.viewModel = new PartsBasketBusinessModel();
            partsBasket.viewModel.manualPartDetail = new Part();
            partsBasket.viewModel.showAddPartManually = true;

            partsBasket.hideAddPartManually()

            expect(partsBasket.viewModel.manualPartDetail).toBeUndefined();
            expect(partsBasket.viewModel.showAddPartManually).toBe(false);
            expect(partsBasket.viewModel.showRemainingAddPartManuallyFields).toBe(false);
        });
    });

    describe("the showAddPartManually function", () => {
        let disposableStub: Disposable;
        let collectionObserverStub: CollectionObserver;
        let propertyObserverStub: PropertyObserver;
        beforeEach(() => {
            collectionObserverStub = <CollectionObserver>{};
            collectionObserverStub.subscribe = (callback) => {
                return disposableStub;
            };

            propertyObserverStub = <PropertyObserver>{};
            propertyObserverStub.subscribe = (callback) => {
                return disposableStub;
            };

            bindingEngineStub.collectionObserver = sandbox.stub().returns(collectionObserverStub);
            getPropertyObserverStub = bindingEngineStub.propertyObserver = sandbox.stub().returns(propertyObserverStub);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("will hide the add part manually section", () => {

            partsBasket.tasksCatalog = [];
            partsBasket.viewModel = new PartsBasketBusinessModel();
            partsBasket.viewModel.manualPartDetail = null;
            partsBasket.viewModel.showAddPartManually = false;

            partsBasket.showAddPartManually()

            expect(partsBasket.viewModel.manualPartDetail.taskId).toBeUndefined();
            expect(partsBasket.viewModel.showAddPartManually).toBe(true);

        });
    });

    describe("the bookAnAppointment function", () => {

        beforeEach(() => {

        });

        afterEach(() => {
            sandbox.restore();
        });

        it("will navigate", () => {

            let methodSpy: Sinon.SinonSpy = routerStub.navigateToRoute = sandbox.stub();

            partsBasket.bookAnAppointment();

            expect(methodSpy.calledOnce).toBe(true);
        });
    });

    describe("the searchForManuallyAddedPart function", () => {

        beforeEach(() => {

            partsBasket.validateSingleRule = sandbox.stub().resolves(<ValidationCombinedResult>{
                isValid: true
            });

            catalogServiceStub.getGoodsType = sandbox.stub().resolves(<IGoodsType>{description: "y", charge: 9});

            partsBasket.viewModel = <PartsBasketBusinessModel>{
                manualPartDetail: {
                    stockReferenceId: "Xx"
                }
            };

            let task = new Task(true, false);
            task.activity = "Task 1";
            task.applianceType = "APP";
            task.jobType = "JOB";
            task.chargeType = "CHG";

            // from refactor: taskServiceStub.getTasks = sandbox.stub().resolves([task]);
            // from refactor: taskServiceStub.getTaskItem = sandbox.stub().resolves(task);
        });

        it("can ensure stockRefId is uppercase", done => {
            partsBasket.searchForManuallyAddedPart()
                .then(() => {
                    expect(partsBasket.viewModel.manualPartDetail.stockReferenceId).toBe("XX");
                    done();
                });
        });

        it("can obtain a part from the part catalog", done => {
            partsBasket.searchForManuallyAddedPart()
                .then(() => {
                    expect(partsBasket.viewModel.manualPartDetail.wasFoundUsingManualEntry).toBe(true);
                    expect(partsBasket.viewModel.manualPartDetail.description).toBe("y");
                    expect(partsBasket.viewModel.manualPartDetail.price.toNumber()).toBe(9);

                    expect(partsBasket.viewModel.showRemainingAddPartManuallyFields).toBe(true);
                    done();
                });
        });

    });

    describe("the addPartToOrderList function", () => {

        let disposableStub: Disposable;
        let collectionObserverStub: CollectionObserver;
        let propertyObserverStub: PropertyObserver;
        let warrantyEstimate = <WarrantyEstimate>{};
        beforeEach(() => {
            eventAggregatorStub.subscribe = sandbox.stub();
            partsBasket.loadBusinessRules = sandbox.stub().resolves(null);

            let task = new Task(true, false);
            task.activity = "Task 1";
            task.applianceType = "APP";
            task.jobType = "JOB";
            task.chargeType = "CHG";

            // from refactor: taskServiceStub.getTasks = sandbox.stub().resolves([task]);
            partServiceStub.getPartsBasket = sandbox.stub().resolves(null);
            partServiceStub.getPartWarrantyEstimate = sandbox.stub().resolves(null);
            validationServiceStub.build = sandbox.stub().resolves(null);
            // from refactor: taskServiceStub.getTaskItem = sandbox.stub().resolves(task);

            disposableStub = <Disposable>{};
            disposableStub.dispose = sandbox.stub();

            collectionObserverStub = <CollectionObserver>{};
            collectionObserverStub.subscribe = (callback) => {
                return disposableStub;
            };

            propertyObserverStub = <PropertyObserver>{};
            propertyObserverStub.subscribe = (callback) => {
                return disposableStub;
            };

            bindingEngineStub.collectionObserver = sandbox.stub().returns(collectionObserverStub);
            bindingEngineStub.propertyObserver = sandbox.stub().returns(propertyObserverStub);

            validationServiceStub.addDynamicRule = sandbox.stub();
            partServiceStub.getPartWarrantyEstimate = sandbox.stub().resolves(warrantyEstimate);

        });

        afterEach(() => {
            sandbox.restore();
        });

        it("will not add part if its invalid", (done) => {

            let existingPartId: Guid = Guid.newGuid();
            let newPartId: Guid = Guid.newGuid();

            let part: Part = new Part();
            part.id = existingPartId;

            partsBasket.viewModel = new PartsBasketBusinessModel();
            partsBasket.viewModel.partsInBasket = [part];
            partsBasket.viewModel.manualPartDetail = new Part();
            partsBasket.viewModel.manualPartDetail.id = newPartId;

            let validationResult: ValidationCombinedResult = new ValidationCombinedResult();
            validationResult.isValid = false;

            let methodSpy: Sinon.SinonSpy = partsBasket.validateSingleRule = sandbox.stub().resolves(validationResult);

            partsBasket.addManualPartToOrderList()
                .then(() => {
                    expect(methodSpy.calledOnce).toBe(true);
                    expect(partsBasket.viewModel.partsInBasket.length).toBe(1);
                    expect(partsBasket.viewModel.partsInBasket[0].id).toBe(existingPartId);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

        it("will add part if its valid", (done) => {

            let existingPartId: Guid = Guid.newGuid();

            let part: Part = new Part();
            part.id = existingPartId;

            partsBasket.viewModel = new PartsBasketBusinessModel();
            partsBasket.viewModel.partsInBasket = [part];
            partsBasket.viewModel.manualPartDetail = new Part();

            let validationResult: ValidationCombinedResult = new ValidationCombinedResult();
            validationResult.isValid = true;
            validationServiceStub.addDynamicRule = sandbox.stub();
            let methodSpy: Sinon.SinonSpy = partsBasket.validateSingleRule = sandbox.stub().resolves(validationResult);

            partsBasket.addManualPartToOrderList()
                .then(() => {
                    expect(methodSpy.calledOnce).toBe(true);
                    expect(partsBasket.viewModel.partsInBasket.length).toBe(2);
                    expect(partsBasket.viewModel.partsInBasket[0].id).toBe(existingPartId);

                    expect(partsBasket.viewModel.partsInBasket[1].id).toBeDefined();
                    expect(partsBasket.viewModel.partsInBasket[1].quantity).toBe(1);
                    expect(partsBasket.viewModel.partsInBasket[1].warrantyEstimate).toBe(warrantyEstimate);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here: " + error);
                    done();
                });
        });

    });

    describe("the deletePart function", () => {

        let disposableStub: Disposable;
        let collectionObserverStub: CollectionObserver;
        let propertyObserverStub: PropertyObserver;

        beforeEach(() => {
            eventAggregatorStub.subscribe = sandbox.stub();

            let task = new Task(true, false);
            task.activity = "Task 1";
            task.applianceType = "APP";
            task.jobType = "JOB";
            task.chargeType = "CHG";

            // from refactor: taskServiceStub.getTasks = sandbox.stub().resolves([task]);
            partServiceStub.getPartsBasket = sandbox.stub().resolves(null);
            validationServiceStub.build = sandbox.stub().resolves(null);

            disposableStub = <Disposable>{};
            disposableStub.dispose = sandbox.stub();

            collectionObserverStub = <CollectionObserver>{};
            collectionObserverStub.subscribe = (callback) => {
                return disposableStub;
            };

            propertyObserverStub = <PropertyObserver>{};
            propertyObserverStub.subscribe = (callback) => {
                return disposableStub;
            };

            bindingEngineStub.collectionObserver = sandbox.stub().returns(collectionObserverStub);
            bindingEngineStub.propertyObserver = sandbox.stub().returns(propertyObserverStub);

        });

        afterEach(() => {
            sandbox.restore();
        });

        it("will not delete if not confirmed", (done) => {

            let existingPartId: Guid = Guid.newGuid();

            let part: Part = new Part();
            part.id = existingPartId;

            partsBasket.viewModel = new PartsBasketBusinessModel();
            partsBasket.viewModel.partsInBasket = [part];

            let eventStub: MouseEvent = <MouseEvent>{};
            eventStub.stopPropagation = sandbox.stub();

            let confirmationSpy: Sinon.SinonSpy = partsBasket.showDeleteConfirmation = sandbox.stub().resolves(false);

            partsBasket.removePart(eventStub, part, false)
                .then(() => {
                    expect(confirmationSpy.calledOnce).toBe(true);
                    expect(partsBasket.viewModel.partsInBasket.length).toBe(1);
                    expect(partsBasket.viewModel.partsInBasket[0].id).toBe(existingPartId);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here:" + error);
                    done();
                });
        });

        it("will delete part if its confirmed", (done) => {

            let existingPartId: Guid = Guid.newGuid();

            let part: Part = new Part();
            part.id = existingPartId;

            partsBasket.viewModel = new PartsBasketBusinessModel();
            partsBasket.viewModel.partsInBasket = [part];

            let eventStub: MouseEvent = <MouseEvent>{};
            eventStub.stopPropagation = sandbox.stub();

            validationServiceStub.removeDynamicRule = sandbox.stub();
            eventAggregatorStub.publish = sandbox.stub();

            let confirmationSpy: Sinon.SinonSpy = partsBasket.showDeleteConfirmation = sandbox.stub().resolves(true);

            partsBasket.removePart(eventStub, part, false)
                .then(() => {
                    expect(confirmationSpy.calledOnce).toBe(true);
                    expect(partsBasket.viewModel.partsInBasket.length).toBe(0);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here:" + error);
                    done();
                });
        });
    });

    describe("the adaptPartsSelected function", () => {

        let disposableStub: Disposable;
        let collectionObserverStub: CollectionObserver;
        let propertyObserverStub: PropertyObserver;

        beforeEach(() => {
            eventAggregatorStub.subscribe = sandbox.stub();
            partsBasket.loadBusinessRules = sandbox.stub().resolves(null);

            let task = new Task(true, false);
            task.activity = "Task 1";
            task.applianceType = "APP";
            task.jobType = "JOB";
            task.chargeType = "CHG";

            // from refactor: taskServiceStub.getTasks = sandbox.stub().resolves([task]);
            partServiceStub.getPartsBasket = sandbox.stub().resolves(null);
            partServiceStub.getPartWarrantyEstimate = sandbox.stub().resolves(null);
            validationServiceStub.build = sandbox.stub().resolves(null);

            disposableStub = <Disposable>{};
            disposableStub.dispose = sandbox.stub();

            collectionObserverStub = <CollectionObserver>{};
            collectionObserverStub.subscribe = (callback) => {
                return disposableStub;
            };

            propertyObserverStub = <PropertyObserver>{};
            propertyObserverStub.subscribe = (callback) => {
                return disposableStub;
            };

            bindingEngineStub.collectionObserver = sandbox.stub().returns(collectionObserverStub);
            bindingEngineStub.propertyObserver = sandbox.stub().returns(propertyObserverStub);

        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can handle no adapt parts selected", (done) => {

            let methodSpy: Sinon.SinonSpy = partServiceStub.getPartsBasket = sandbox.stub().resolves(new PartsBasketBusinessModel());

            partsBasket.viewModel = new PartsBasketBusinessModel();
            partsBasket.viewModel.partsInBasket = [];

            partsBasket.adaptPartLiveUpdate([])
                .then(() => {
                    expect(methodSpy.calledOnce).toBe(true);
                    expect(partsBasket.viewModel.partsInBasket.length).toBe(0);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here:" + error);
                    done();
                });

            expect(methodSpy.calledOnce).toBe(true);
        });

        it("can handle new adapt parts selected", (done) => {

            partsBasket.viewModel = new PartsBasketBusinessModel();
            partsBasket.viewModel.partsInBasket = [];
            partsBasket.tasksCatalog = [];

            let part1 = new Part();
            part1.id = Guid.newGuid();

            let part2 = new Part();
            part2.id = Guid.newGuid();

            let updatedPartsDetail = new PartsBasketBusinessModel();
            updatedPartsDetail.partsToOrder = [part1, part2];

            validationServiceStub.addDynamicRule = sandbox.stub();

            let methodSpy: Sinon.SinonSpy = partServiceStub.getPartsBasket = sandbox.stub().resolves(updatedPartsDetail);

            // only trigger one of the parts
            partsBasket.adaptPartLiveUpdate([part1.id])
                .then(() => {
                    expect(methodSpy.calledOnce).toBe(true);
                    expect(partsBasket.viewModel.partsInBasket.length).toBe(1);
                    done();
                })
                .catch((error) => {
                    fail("Should not be here:" + error);
                    done();
                });

            expect(methodSpy.calledOnce).toBe(true);
        });


    });

    describe("the hideDeliverToSiteCheckbox property", () => {

        let part = new Part();
        part.partOrderStatus = '';

        const vanStockStatus = <IPartOrderStatus>{};
        vanStockStatus.id = "V";

        beforeEach(() => {
            partsBasket.viewModel = new PartsBasketBusinessModel();
            partsBasket.brVanStockPartOrderStatus = "V";
            partsBasket.viewModel.partsInBasket = [];
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("intially set to false", () => {

            partsBasket.viewModel = new PartsBasketBusinessModel();
            partsBasket.viewModel.partsInBasket = [];
            partsBasket.viewModel.partsInBasket.push(part);

            expect(partsBasket.hideDeliverToSiteCheckbox).toBe(false);
        });

        it("sets to true on selectOrderType, all items are van stock", () => {

            partsBasket.viewModel.partsInBasket.push(part);

            expect(partsBasket.hideDeliverToSiteCheckbox).toBe(false);

            partsBasket.selectOrderType(part, true);

            expect(partsBasket.hideDeliverToSiteCheckbox).toBe(true);
        });

        describe("add and remove", () => {

            let disposableStub: Disposable;
            let collectionObserverStub: CollectionObserver;
            let propertyObserverStub: PropertyObserver;

            beforeEach(() => {
                disposableStub = <Disposable>{};
                disposableStub.dispose = sandbox.stub();

                collectionObserverStub = <CollectionObserver>{};
                collectionObserverStub.subscribe = (callback) => {
                    return disposableStub;
                };

                propertyObserverStub = <PropertyObserver>{};
                propertyObserverStub.subscribe = (callback) => {
                    return disposableStub;
                };

                bindingEngineStub.collectionObserver = sandbox.stub().returns(collectionObserverStub);
                bindingEngineStub.propertyObserver = sandbox.stub().returns(propertyObserverStub);

                validationServiceStub.addDynamicRule = sandbox.stub();

                partServiceStub.getPartWarrantyEstimate = sandbox.stub().resolves(null);

            });

            it("sets hideDeliverToSiteCheckbox to false when all vanstock but then new part added", (done) => {

                partsBasket.viewModel.partsInBasket.push(part);
                partsBasket.selectOrderType(part, true);

                let existingPartId: Guid = Guid.newGuid();
                let newPartId: Guid = Guid.newGuid();

                let part2: Part = new Part();
                part2.id = existingPartId;

                let task = new Task(true, false);
                task.activity = "Task 1";
                task.applianceType = "APP";
                task.jobType = "JOB";
                task.chargeType = "CHG";

                // from refactor: taskServiceStub.getTasks = sandbox.stub().resolves([task]);

                partsBasket.viewModel.partsInBasket.push(part2);
                partsBasket.viewModel.manualPartDetail = new Part();
                partsBasket.viewModel.manualPartDetail.id = newPartId;

                let validationResult: ValidationCombinedResult = new ValidationCombinedResult();
                validationResult.isValid = true;
                validationServiceStub.addDynamicRule = sandbox.stub();

                partsBasket.validateSingleRule = sandbox.stub().resolves(validationResult);

                expect(partsBasket.hideDeliverToSiteCheckbox).toBe(true);

                partsBasket.addManualPartToOrderList().then(() => {
                    expect(partsBasket.hideDeliverToSiteCheckbox).toBe(false);
                    done();
                });
            });

            it('sets hideDeliverToSiteCheckbox to false when only part is van stock item but then removed', (done) => {

                let existingPartId: Guid = Guid.newGuid();

                let part: Part = new Part();
                part.id = existingPartId;
                part.partOrderStatus = vanStockStatus.id;

                partsBasket.viewModel.partsInBasket.push(part);

                let eventStub: MouseEvent = <MouseEvent>{};
                eventStub.stopPropagation = sandbox.stub();

                let task = new Task(true, false);
                task.activity = "Task 1";
                task.applianceType = "APP";
                task.jobType = "JOB";
                task.chargeType = "CHG";

                // from refactor: taskServiceStub.getTasks = sandbox.stub().resolves([task]);

                validationServiceStub.removeDynamicRule = sandbox.stub();
                eventAggregatorStub.publish = sandbox.stub();

                partsBasket.showDeleteConfirmation = sandbox.stub().resolves(true);

                partsBasket.hideDeliverToSiteCheckbox = true;

                expect(partsBasket.hideDeliverToSiteCheckbox).toBe(true);
                partsBasket.removePart(eventStub, part, false)
                    .then(() => {
                        expect(partsBasket.hideDeliverToSiteCheckbox).toBe(true);
                        done();
                    });
            });
        });
    });

});
*/
