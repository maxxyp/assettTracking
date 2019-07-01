import { ApplianceReading } from "../../../../../../app/hema/presentation/modules/appliances/applianceReading";
import { IApplianceService } from "../../../../../../app/hema/business/services/interfaces/IApplianceService";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { EventAggregator } from "aurelia-event-aggregator";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { IValidationService } from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { IApplianceGasSafetyFactory } from "../../../../../../app/hema/presentation/factories/interfaces/IApplianceGasSafetyFactory";
import { ApplianceGasSafetyFactory } from "../../../../../../app/hema/presentation/factories/applianceGasSafetyFactory";
import { BindingEngine, PropertyObserver, Disposable } from "aurelia-binding";
import { ApplianceSafety } from "../../../../../../app/hema/business/models/applianceSafety";
import { ApplianceGasReadings } from "../../../../../../app/hema/business/models/applianceGasReadings";
import { GasApplianceReadingViewModel } from "../../../../../../app/hema/presentation/modules/appliances/viewModels/gasApplianceReadingViewModel";
import { ApplianceGasSafety } from "../../../../../../app/hema/business/models/applianceGasSafety";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { DialogService } from "aurelia-dialog";
import { GasApplianceReadingsMasterViewModel } from "../../../../../../app/hema/presentation/modules/appliances/viewModels/gasApplianceReadingsMasterViewModel";
import { ApplianceGasReadingMaster } from "../../../../../../app/hema/business/models/applianceGasReadingMaster";
import {ValidationRule} from "../../../../../../app/hema/business/services/validation/validationRule";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { Job } from "../../../../../../app/hema/business/models/job";
import { Task } from "../../../../../../app/hema/business/models/task";
import { ApplianceSafetyType } from "../../../../../../app/hema/business/models/applianceSafetyType";

describe("the ApplianceReading module", () => {

    let sandbox: Sinon.SinonSandbox;

    let bindingEngineStub: BindingEngine;
    let disposableStub: Disposable;
    let propertyObserverStub: PropertyObserver;

    let labelServiceStub: ILabelService;
    let applianceServiceStub: IApplianceService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let catalogServiceStub: ICatalogService;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let applianceReading: ApplianceReading;

    let applianceGasSafetyFactoryStub: IApplianceGasSafetyFactory;

    let showContentSpy: Sinon.SinonSpy;
    let propertyObserverSpy: Sinon.SinonSpy;
    let eventPublishSpy: Sinon.SinonSpy;
    let saveApplianceSafetyDetailsSpy: Sinon.SinonSpy;
    let disposeSpy: Sinon.SinonSpy;
    let applianceSafety = new ApplianceSafety();

    const firstRatioWarningThreshold = 0.0041;
    const finalRatioUnsafeThreshold = 0.008;
    const unsafeToastDismissTime = 10;

    const burnerPressureUnsafeValue = 0;
    const gasRateUnsafeValue = 0;

    // const burnerPressureSafeValue = 1;
    const gasRateSafeValue = 1;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        applianceServiceStub = <IApplianceService>{};
        eventAggregatorStub = <EventAggregator>{};

        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sandbox.stub().returns(Promise.resolve({}));
        labelServiceStub.getGroupWithoutCommon = sandbox.stub().returns(Promise.resolve({}));

        catalogServiceStub = <ICatalogService>{};

        // catalogServiceStub.getCatalogItem = sandbox.stub().returns(Promise.resolve());
        applianceGasSafetyFactoryStub = <ApplianceGasSafetyFactory>{};

        disposeSpy = sandbox.spy();
        disposableStub = <Disposable>{};
        disposableStub.dispose = disposeSpy;

        propertyObserverStub = <PropertyObserver>{};
        propertyObserverStub.subscribe = (callback) => {
            return disposableStub;
        };

        bindingEngineStub = <BindingEngine>{};
        bindingEngineStub.propertyObserver = propertyObserverSpy = sandbox.stub().returns(propertyObserverStub);

        businessRuleServiceStub = <IBusinessRuleService>{};

        let businessRuleGroup = {
            "burnerPressureUnsafeValue": burnerPressureUnsafeValue,
            "gasRateUnsafeValue": gasRateUnsafeValue,
            "firstRatioWarningThreshold": firstRatioWarningThreshold,
            "finalRatioUnsafeThreshold": finalRatioUnsafeThreshold,
            "unsafeToastDismissTime": unsafeToastDismissTime,
        };

        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(businessRuleGroup);

        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};

        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("notDoingJobStatuses").returns("NA");
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        validationServiceStub = <IValidationService>{};
        validationServiceStub.build = sandbox.stub().resolves(null);

        applianceSafety.applianceGasSafety = new ApplianceGasSafety();
        applianceSafety.applianceGasReadingsMaster.preliminaryReadings = new ApplianceGasReadings();
        applianceSafety.applianceGasReadingsMaster.supplementaryReadings = new ApplianceGasReadings();
        applianceSafety.applianceGasReadingsMaster.supplementaryBurnerFitted = true;

        applianceServiceStub.getApplianceSafetyDetails = sandbox.stub().resolves(applianceSafety);
        applianceServiceStub.saveApplianceSafetyDetails = saveApplianceSafetyDetailsSpy = sandbox.stub().resolves(true);

        let bm = new ApplianceGasReadings();
        let vm = new GasApplianceReadingsMasterViewModel();
        vm.preliminaryReadings = new GasApplianceReadingViewModel();
        vm.supplementaryReadings = new GasApplianceReadingViewModel();

        applianceGasSafetyFactoryStub.createApplianceGasReadingsBusinessModel = sandbox.stub().returns(bm);
        applianceGasSafetyFactoryStub.createApplianceGasReadingsViewModel = sandbox.stub().returns(vm);

        eventAggregatorStub.publish = eventPublishSpy = sandbox.stub();

        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);

        dialogServiceStub = <DialogService>{};

        jobServiceStub = <IJobService>{};
        let job = new Job();
        let task = new Task(true, false);
        task.status = "NA";
        job.tasks = [task];
        jobServiceStub.getJob = sandbox.stub().resolves(job);

        applianceReading = new ApplianceReading(jobServiceStub, engineerServiceStub, labelServiceStub, eventAggregatorStub, dialogServiceStub,
            validationServiceStub, businessRuleServiceStub, catalogServiceStub, applianceServiceStub, applianceGasSafetyFactoryStub, bindingEngineStub);

        applianceReading.labels = {
            "unsafeSituation": "",
            "burnerPressureUnsafe": "",
            "gasReadingUnsafe": "",
            "isLpg": "",
            "isSuppLpg": "",
            "finalRatioUnsafe": "",
            "yes": "",
            "no": "",
            "clearReadingsWarning": "",
            "supplementaryBurnerPressureUnsafe": "",
            "supplementary": "",
            "supplementaryGasReadingUnsafe": "",
            "supplementaryFinalRatioUnsafe": ""
        };

        let rule1: ValidationRule = new ValidationRule();
        rule1.property = "gasReadings.preliminaryReadings.burnerPressure";
        rule1.min = 0;
        rule1.max = 40;

        applianceReading.validationRules["gasReadings.preliminaryReadings.burnerPressure"] = rule1;

        let rule2: ValidationRule = new ValidationRule();
        rule2.property = "gasReadings.preliminaryReadings.gasRateReading";
        rule2.min = 0;
        rule2.max = 40;

        applianceReading.validationRules["gasReadings.preliminaryReadings.gasRateReading"] = rule2;

        let rule3: ValidationRule = new ValidationRule();
        rule3.property = "gasReadings.preliminaryReadings.readingFinalRatio";
        rule3.min = 0;
        rule3.max = 1;

        applianceReading.validationRules["gasReadings.preliminaryReadings.readingFinalRatio"] = rule3;

        applianceReading.showContent = showContentSpy = sandbox.spy();
        applianceReading.jobId = "1";
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(applianceReading).toBeDefined();
    });

    describe("canActivateAsync", () => {
        it("can continue with correct applianceType", done => {
            applianceServiceStub.getAppliance = sandbox.stub().resolves({applianceSafetyType: ApplianceSafetyType.gas});
            applianceReading.canActivateAsync({ applianceId: "1", jobId: "1" }, {settings: {applianceSafetyType: ApplianceSafetyType.gas} })
            .then(result => {
                expect(result).toBe(true);
                done();
            });
        });

        it("can not continue with incorrect applianceType", done => {
            applianceServiceStub.getAppliance = sandbox.stub().resolves({applianceSafetyType: ApplianceSafetyType.electrical});
            applianceReading.canActivateAsync({ applianceId: "1", jobId: "1" }, {settings: {applianceSafetyType: ApplianceSafetyType.gas} })
            .then(result => {
                expect(result).not.toBe(true);
                done();
            });
        });
    });

    describe("call activateAsync", () => {

        beforeEach(() => {

        });

        it("should set showSupplementaryBurner property", (done) => {
            applianceReading.activateAsync({ applianceId: "1" }).then(() => {
                expect(showContentSpy.called).toBe(true);
                expect(applianceReading.canEdit).toBe(false);
                done();
            });
        });

        it("should set showSupplementaryBurner property", (done) => {
            applianceReading.activateAsync({ applianceId: "1" }).then(() => {
                expect(applianceReading.showSupplementaryBurner).toBe(true);
                done();
            });
        });

        it("should populate gas and supplementary readings vm", (done) => {
            applianceReading.activateAsync({ applianceId: "1" }).then(() => {
                expect(applianceReading.gasReadings).toBeDefined();
                expect(applianceReading.gasReadings.preliminaryReadings).toBeDefined();
                expect(applianceReading.gasReadings.supplementaryReadings).toBeDefined();
                done();
            });
        });

        it("should setup subscriptions for gasReadings props", (done) => {
            const observableNames: string[] = ["burnerPressure", "gasRateReading", "isLpg", "readingFirstRatio", "readingMaxRatio", "readingMinRatio", "readingFinalRatio",
                "readingFirstCO", "readingMaxCO", "readingMinCO", "readingFinalCO", "readingFirstCO2", "readingMaxCO2", "readingMinCO2", "readingFinalCO2"];

            applianceReading.activateAsync({ applianceId: "1" }).then(() => {
                expect(propertyObserverSpy.called).toBe(true);

                // gas burner reading observables
                for (let i = 0; i <= observableNames.length - 1; i++) {
                    expect(propertyObserverSpy.getCall(i).args[0]).toBe(applianceReading.gasReadings.preliminaryReadings);
                    expect(propertyObserverSpy.getCall(i).args[1]).toEqual(observableNames[i]);
                }

                done();
            });
        });

    });

    describe("callbacks", () => {
        beforeEach(() => {
        });

        describe("check unsafe setting made", () => {
            it("should set unsafe if burner pressure unsafe", (done) => {
                applianceReading.activateAsync({ applianceId: "1" }).then(() => {
                    applianceReading.burnerPressureChanged(burnerPressureUnsafeValue, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.preliminaryReadings.isUnsafeReadings).toBeTruthy();
                    expect(applianceReading.gasReadings.supplementaryReadings.isLpg).toBeUndefined();
                    done();
                })
            });

            it("should set if gas reading unsafe", (done) => {
                applianceReading.activateAsync({ applianceId: "1" }).then(() => {
                    applianceReading.gasRateReadingChanged(gasRateUnsafeValue, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.preliminaryReadings.isUnsafeReadings).toBeTruthy();
                    expect(applianceReading.gasReadings.supplementaryReadings.isLpg).toBeUndefined();
                    done();
                })
            });

            it("should set if unmetered lpg appliance is set to false", (done) => {
                applianceReading.activateAsync({ applianceId: "1" }).then(() => {
                    applianceReading.isLpgChanged(false, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.preliminaryReadings.isUnsafeReadings).toBeTruthy();
                    expect(applianceReading.gasReadings.supplementaryReadings.isLpg).toBe(false);
                    done();
                })
            });

            it("should finalRatioUnsafe set to true if final ratio above threshold", (done) => {
                applianceReading.activateAsync({ applianceId: "1" }).then(() => {
                    let val = finalRatioUnsafeThreshold + 0.0001;
                    applianceReading.readingFinalRatioChanged(val, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.preliminaryReadings.isUnsafeReadings).toBeTruthy();
                    expect(applianceReading.gasReadings.preliminaryReadings.finalRatioUnsafe).toBe(true);
                    done();
                })
            });

            it("should finalRatioUnsafe be set to false if the finalRatio below threshold", (done) => {
                applianceReading.activateAsync({ applianceId: "1" }).then(() => {
                    let val = finalRatioUnsafeThreshold - 0.0001;
                    applianceReading.readingFinalRatioChanged(val, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.preliminaryReadings.finalRatioUnsafe).toBe(false);
                    done();
                })
            });

            it("should finalRatioUnsafe be set to false if the finalRatio above the max limit", (done) => {
                applianceReading.activateAsync({ applianceId: "1" }).then(() => {
                    applianceReading.readingFinalRatioChanged(2, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.preliminaryReadings.finalRatioUnsafe).toBe(false);
                    done();
                })
            });

            it("should set supplementary isLpg to false", (done) => {
                applianceReading.activateAsync({ applianceId: "1" }).then(() => {
                    applianceReading.isLpgChanged(false, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.supplementaryReadings.isLpg).toBe(false);
                    done();
                })
            });

            it("should set supplementary isLpg to true", (done) => {
                applianceReading.activateAsync({ applianceId: "1" }).then(() => {
                    applianceReading.isLpgChanged(true, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.supplementaryReadings.isLpg).toBe(true);
                    done();
                })
            });
        });

        describe("check worked on appliance", () => {

            it("should default to false", (done) => {
                applianceReading.activateAsync({ applianceId: "1" }).then(() => {
                    expect(applianceReading.gasReadings.workedOnMainReadings).toBeFalsy();
                    done();
                })
            });

            it("should set if burner pressure value", (done) => {
                applianceReading.activateAsync({ applianceId: "1" }).then(() => {
                    applianceReading.gasReadings.preliminaryReadings.burnerPressure = burnerPressureUnsafeValue;
                    applianceReading.burnerPressureChanged(0, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.workedOnMainReadings).toBe(true);
                    done();
                })
            });

            it("should set if gas rate reading value", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.gasReadings.preliminaryReadings.gasRateReading = gasRateSafeValue;
                    applianceReading.gasRateReadingChanged(0, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.workedOnMainReadings).toBe(true);
                    done();
                })
            });

            it("should set if lpg gas set to false", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.gasReadings.preliminaryReadings.isLpg = false;
                    applianceReading.isLpgChanged(false, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.workedOnMainReadings).toBe(true);
                    done();
                })
            });

             it("workedOnMainReadings should set to true if supplementary burner pressure value", (done) => {
                applianceReading.activateAsync({ applianceId: "1" }).then(() => {
                    applianceReading.gasReadings.supplementaryReadings.burnerPressure = burnerPressureUnsafeValue;
                    applianceReading.burnerPressureChanged(0, applianceReading.gasReadings.supplementaryReadings, true);
                    expect(applianceReading.gasReadings.workedOnMainReadings).toBe(true);
                    done();
                })
            });

            it("workedOnMainReadings should set to true if supplementary gas rate reading value", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.gasReadings.supplementaryReadings.gasRateReading = gasRateSafeValue;
                    applianceReading.gasRateReadingChanged(0, applianceReading.gasReadings.supplementaryReadings, true);
                    expect(applianceReading.gasReadings.workedOnMainReadings).toBe(true);
                    done();
                })
            });

            it("workedOnMainReadings should set to true if main burner lpg gas set to false", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.gasReadings.preliminaryReadings.isLpg = false;
                    applianceReading.isLpgChanged(false, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.workedOnMainReadings).toBe(true);
                    expect(applianceReading.gasReadings.supplementaryReadings.isLpg).toBe(false);
                    done();
                })
            });

            it("supplementary isLpg should be true if the preliminary burner has yes lpg appliance selected", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.isLpgChanged(true, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.supplementaryReadings.isLpg).toBe(true);
                    done();
                });
            });

            it("supplementary isLpg should be false if the preliminary burner has no lpg appliance selected", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.isLpgChanged(false, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.supplementaryReadings.isLpg).toBe(false);
                    done();
                });
            });
        });

        describe("ask if lpg", () => {

            it("should default to true, i.e. burner pressure and gas rate undefined", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    expect(applianceReading.gasReadings.preliminaryReadings.askIfLpg).toBe(true);
                    done();
                });
            });

            it("should be no if safe burner pressure entered", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.gasReadings.preliminaryReadings.burnerPressure = 1;
                    applianceReading.burnerPressureChanged(1, applianceReading.gasReadings.preliminaryReadings, false);

                    expect(applianceReading.gasReadings.preliminaryReadings.askIfLpg).toBe(false);
                    done();
                });
            });

            it("should be no if safe gas rate reading entered", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.gasReadings.preliminaryReadings.gasRateReading = gasRateSafeValue;
                    applianceReading.gasRateReadingChanged(gasRateSafeValue, applianceReading.gasReadings.preliminaryReadings, false);

                    expect(applianceReading.gasReadings.preliminaryReadings.askIfLpg).toBe(false);
                    done();
                });
            });


            it("should be yes if burner pressure reading unsafe", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.gasReadings.preliminaryReadings.burnerPressure = burnerPressureUnsafeValue;

                    applianceReading.burnerPressureChanged(burnerPressureUnsafeValue, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.preliminaryReadings.burnerPressureUnsafe).toBe(true);
                    done();
                });
            });

            it("should be yes if gas rate reading unsafe", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.gasReadings.preliminaryReadings.gasRateReading = gasRateUnsafeValue;

                    applianceReading.gasRateReadingChanged(gasRateUnsafeValue, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.preliminaryReadings.gasReadingUnsafe).toBe(true);
                    done();
                });
            });

           it("should be false if the preliminary burner has no main readings but supplementary burner pressure has some value ", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.gasReadings.supplementaryReadings.burnerPressure = 1;
                    applianceReading.burnerPressureChanged(1, applianceReading.gasReadings.supplementaryReadings, false);
                    expect(applianceReading.gasReadings.preliminaryReadings.askIfLpg).toBe(false);
                    done();
                });
            });

            it("should be false if the preliminary burner has no main readings but supplementary burner pressure has some value ", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.gasReadings.supplementaryReadings.gasRateReading = 1;
                    applianceReading.burnerPressureChanged(1, applianceReading.gasReadings.supplementaryReadings, false);
                    expect(applianceReading.gasReadings.preliminaryReadings.askIfLpg).toBe(false);
                    done();
                });
            });

            it("should be true if the preliminary and supplementary burner has no main readings", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.burnerPressureChanged(1, applianceReading.gasReadings.supplementaryReadings, false);
                    expect(applianceReading.gasReadings.preliminaryReadings.askIfLpg).toBe(true);
                    done();
                });
            });

            // see DF_1821
            it ("should be false if burner pressure is '0'", done => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.gasReadings.preliminaryReadings.burnerPressure = 0;
                    applianceReading.burnerPressureChanged(0, applianceReading.gasReadings.preliminaryReadings, false);
                    expect(applianceReading.gasReadings.preliminaryReadings.askIfLpg).toBe(false);
                    done();
                });
            });

            it ("should be false if supp burner pressure is '0' and prem burner pressure and gas reading is undefined", done => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {

                    applianceReading.gasReadings.preliminaryReadings.burnerPressure = undefined;
                    applianceReading.gasReadings.preliminaryReadings.gasRateReading = undefined;

                    applianceReading.showSupplementaryBurner = true;
                    applianceReading.gasReadings.supplementaryReadings.burnerPressure = 0;

                    applianceReading.burnerPressureChanged(0, applianceReading.gasReadings.supplementaryReadings, false);

                    expect(applianceReading.gasReadings.preliminaryReadings.askIfLpg).toBe(false);

                    done();
                });
            });

        });

        describe("supplmentary ask if lpg", () => {

            it("should default to undefined, i.e. burner pressure and gas rate undefined", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    expect(applianceReading.gasReadings.supplementaryReadings.askIfLpg).toBe(undefined);
                    done();
                });
            });

            it("should be undefined if safe burner pressure entered", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.gasReadings.supplementaryReadings.burnerPressure = 1;
                    applianceReading.burnerPressureChanged(1, applianceReading.gasReadings.supplementaryReadings, true);
                    expect(applianceReading.gasReadings.supplementaryReadings.askIfLpg).toBe(undefined);
                    done();
                });
            });

            it("should be undefined if safe gas rate reading entered", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.gasReadings.supplementaryReadings.gasRateReading = gasRateSafeValue;
                    applianceReading.gasRateReadingChanged(gasRateSafeValue, applianceReading.gasReadings.supplementaryReadings, true);
                    expect(applianceReading.gasReadings.supplementaryReadings.askIfLpg).toBe(undefined);
                    done();
                });
            });


            it("should be yes if burner pressure reading unsafe", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.gasReadings.supplementaryReadings.burnerPressure = burnerPressureUnsafeValue;

                    applianceReading.burnerPressureChanged(burnerPressureUnsafeValue, applianceReading.gasReadings.supplementaryReadings, true);
                    expect(applianceReading.gasReadings.supplementaryReadings.burnerPressureUnsafe).toBe(true);
                    done();
                });
            });

            it("should be yes if gas rate reading unsafe", (done) => {
                applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                    applianceReading.gasReadings.supplementaryReadings.gasRateReading = gasRateUnsafeValue;

                    applianceReading.gasRateReadingChanged(gasRateUnsafeValue, applianceReading.gasReadings.supplementaryReadings, true);
                    expect(applianceReading.gasReadings.supplementaryReadings.gasReadingUnsafe).toBe(true);
                    done();
                });
            });            
        });
    });

    describe("update performance readings performed", ()=> {

        it("should set performanceTestReadings if readingFirstRatio modified", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.gasReadings.preliminaryReadings.readingFirstRatio = 123;
                applianceReading.updatePerformanceReadings(applianceReading.gasReadings.preliminaryReadings, false);
                expect(applianceReading.gasReadings.workedOnPreliminaryPerformanceReadings).toBe(true);
                done();
            });
        });

        it("should set performanceTestReadings if readingFinalRatio modified", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.gasReadings.preliminaryReadings.readingFinalRatio = 123;
                applianceReading.updatePerformanceReadings(applianceReading.gasReadings.preliminaryReadings, false);
                expect(applianceReading.gasReadings.workedOnPreliminaryPerformanceReadings).toBe(true);
                done();
            });
        });

        it("should set performanceTestReadings if readingMinRatio modified", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.gasReadings.preliminaryReadings.readingMinRatio = 123;
                applianceReading.updatePerformanceReadings(applianceReading.gasReadings.preliminaryReadings, false);
                expect(applianceReading.gasReadings.workedOnPreliminaryPerformanceReadings).toBe(true);
                done();
            });
        });

        it("should set performanceTestReadings if readingMaxRatio modified", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.gasReadings.preliminaryReadings.readingMaxRatio = 123;
                applianceReading.updatePerformanceReadings(applianceReading.gasReadings.preliminaryReadings, false);
                expect(applianceReading.gasReadings.workedOnPreliminaryPerformanceReadings).toBe(true);
                done();
            });
        });

        it("should set workedOnSupplementaryPerformanceReadings if readingFirstRatio modified", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.gasReadings.supplementaryReadings.readingFirstRatio = 123;
                applianceReading.updatePerformanceReadings(applianceReading.gasReadings.supplementaryReadings, true);
                expect(applianceReading.gasReadings.workedOnSupplementaryPerformanceReadings).toBe(true);
                done();
            });
        });

        it("should set workedOnSupplementaryPerformanceReadings if readingFinalRatio modified", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.gasReadings.supplementaryReadings.readingFinalRatio = 123;
                applianceReading.updatePerformanceReadings(applianceReading.gasReadings.supplementaryReadings, true);
                expect(applianceReading.gasReadings.workedOnSupplementaryPerformanceReadings).toBe(true);
                done();
            });
        });

        it("should set workedOnSupplementaryPerformanceReadings if readingMinRatio modified", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.gasReadings.supplementaryReadings.readingMinRatio = 123;
                applianceReading.updatePerformanceReadings(applianceReading.gasReadings.supplementaryReadings, true);
                expect(applianceReading.gasReadings.workedOnSupplementaryPerformanceReadings).toBe(true);
                done();
            });
        });

        it("should set workedOnSupplementaryPerformanceReadings if readingMaxRatio modified", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.gasReadings.supplementaryReadings.readingMaxRatio = 123;
                applianceReading.updatePerformanceReadings(applianceReading.gasReadings.supplementaryReadings, true);
                expect(applianceReading.gasReadings.workedOnSupplementaryPerformanceReadings).toBe(true);
                done();
            });
        });
    });

    describe("toggle supplementary burner", () => {
        it("should set to true when adding supplementary burner", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.gasReadings.preliminaryReadings.isLpg = false;
                applianceReading.showSupplementaryBurner = false;
                applianceReading.addSupplementaryBurner();
                expect(applianceReading.showSupplementaryBurner).toBe(true);
                expect(applianceReading.gasReadings.supplementaryReadings.isLpg).toBe(false);
                done();
            });
        });

        it("should set to false when removing supplementary burner", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.showSupplementaryBurner = true;
                applianceReading.gasReadings.supplementaryReadings.burnerPressure = 1;
                applianceReading.gasReadings.supplementaryReadings.readingFirstRatio = 0.008;
                applianceReading.removeSupplementaryBurner();
                expect(applianceReading.showSupplementaryBurner).toBe(false);
                expect(applianceReading.gasReadings.supplementaryReadings.burnerPressure).toBeUndefined();
                expect(applianceReading.gasReadings.supplementaryReadings.readingFirstRatio).toBeUndefined();
                done();
            });
        });
    });

    describe("save, check business model correctly defined", () => {

        beforeEach(()=> {
            let bmm = new ApplianceGasReadingMaster();
            let bm = new ApplianceGasReadings();
            bmm.workedOnMainReadings = true;
            bm.isUnsafeReadings = true;
            bmm.workedOnApplianceReadings = true;
            bmm.preliminaryReadings = bm;
            bmm.supplementaryReadings = bm;
            bmm.workedOnSupplementaryApplianceReadings = true;

            applianceGasSafetyFactoryStub.createApplianceGasReadingsBusinessModel = sandbox.stub().returns(bmm);

            applianceReading = new ApplianceReading(jobServiceStub, engineerServiceStub, labelServiceStub, eventAggregatorStub, dialogServiceStub,
                validationServiceStub, businessRuleServiceStub, catalogServiceStub, applianceServiceStub, applianceGasSafetyFactoryStub, bindingEngineStub);

            applianceReading.labels = {
                "unsafeSituation": "",
                "burnerPressureUnsafe": "",
                "gasReadingUnsafe": "",
                "isLpg": "",
                "finalRatioUnsafe": "",
                "yes": "",
                "no": "",
                "savedTitle": "",
                "savedDataInvalid": "",
                "objectName": "",
                "clearReadingsWarning": "",
                "savedDescription": "",
                "savedDescriptionPlural": ""
            };

            applianceReading.showContent = showContentSpy = sandbox.spy();
            applianceReading.jobId = "1";
        });

        it("should call saveApplianceSafetyDetails", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(() => {
                applianceReading.setDirty(true);
                applianceReading.save().then(() => {
                    expect(saveApplianceSafetyDetailsSpy.called).toBe(true);
                    done();
                });
            });
        });
        it("should call saveApplianceSafetyDetails", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(() => {
                applianceReading.setDirty(true);
                applianceReading.save().then(() => {
                    expect(saveApplianceSafetyDetailsSpy.getCall(0).args[0]).toBe("1");
                    expect(saveApplianceSafetyDetailsSpy.getCall(0).args[1]).toBe("1");
                    done();
                });
            });
        });

        it("should define gasReadings prop in businessModel", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.setDirty(true);
                applianceReading.save().then(() => {
                    const applianceSafetyBm: ApplianceSafety = saveApplianceSafetyDetailsSpy.getCall(0).args[2];
                    expect(applianceSafetyBm).toBeDefined();
                    expect(applianceSafetyBm.applianceGasSafety).toBeDefined();
                    expect(applianceSafetyBm.applianceGasReadingsMaster).toBeDefined();
                    done();
                });
            });
        });

        it("should define datastate for gasReadings prop in businessModel", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.setDirty(true);
                applianceReading.save().then(() => {
                    const applianceSafetyBm: ApplianceSafety = saveApplianceSafetyDetailsSpy.getCall(0).args[2];
                    expect(applianceSafetyBm.applianceGasSafety.dataState).toBeDefined();
                    done();
                });
            });
        });

        it("should define workedOnApplianceReadings & workedOnSupplementaryApplianceReadings if readings taken test done", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.gasReadings.workedOnPreliminaryPerformanceReadings = true;
                applianceReading.gasReadings.workedOnSupplementaryPerformanceReadings = false;
                applianceReading.setDirty(true);
                applianceReading.save().then(() => {
                    const applianceSafetyBm: ApplianceSafety = saveApplianceSafetyDetailsSpy.getCall(0).args[2];
                    expect(applianceSafetyBm.applianceGasReadingsMaster.workedOnApplianceReadings).toBe(true);
                    expect(applianceReading.gasReadings.workedOnSupplementaryPerformanceReadings).toBe(false);
                    done();
                });
            });
        });

        it("should define workedOnApplianceReadings if workedOnAppliance (i.e. burner pressure reading, gas rate reading or lpg) done", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.gasReadings.workedOnPreliminaryPerformanceReadings = true;
                applianceReading.setDirty(true);
                applianceReading.save().then(() => {
                    const applianceSafetyBm: ApplianceSafety = saveApplianceSafetyDetailsSpy.getCall(0).args[2];
                    expect(applianceSafetyBm.applianceGasReadingsMaster.workedOnApplianceReadings).toBe(true);
                    done();
                });
            });
        });

        it("should define workedOnSupplementaryApplianceReadings if workedOnAppliance (i.e. burner pressure reading, gas rate reading or lpg) done", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.gasReadings.workedOnSupplementaryPerformanceReadings = true;
                applianceReading.setDirty(true);
                applianceReading.save().then(() => {
                    const applianceSafetyBm: ApplianceSafety = saveApplianceSafetyDetailsSpy.getCall(0).args[2];
                    expect(applianceSafetyBm.applianceGasReadingsMaster.workedOnSupplementaryApplianceReadings).toBe(true);
                    done();
                });
            });
        });

        it("should undefined isApplianceSafe", (done) => {

            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceReading.setDirty(true);
                applianceReading.save().then(() => {
                    const applianceSafetyBm: ApplianceSafety = saveApplianceSafetyDetailsSpy.getCall(0).args[2];
                    expect(applianceSafetyBm.applianceGasSafety.isApplianceSafe).toBe(undefined);
                    done();
                });
            });
        });

        it("should applianceGasSafety.performanceTestsNotDoneReason be undefined", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceSafety.applianceGasSafety.performanceTestsNotDoneReason = "PI";
                applianceReading.gasReadings.preliminaryReadings.readingFinalRatio = 0.005;
                applianceReading.gasReadings.workedOnPreliminaryPerformanceReadings = true;
                applianceReading.save().then(() => {
                    const applianceSafetyBm: ApplianceSafety = saveApplianceSafetyDetailsSpy.getCall(0).args[2];
                    expect(applianceSafetyBm.applianceGasSafety.performanceTestsNotDoneReason).toBe(undefined);
                    done();
                });
            });
        });

        it("should applianceGasSafety.performanceTestsNotDoneReason not be undefined", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceSafety.applianceGasSafety.performanceTestsNotDoneReason = "PI";
                applianceReading.save().then(() => {
                    const applianceSafetyBm: ApplianceSafety = saveApplianceSafetyDetailsSpy.getCall(0).args[2];
                    expect(applianceSafetyBm.applianceGasSafety.performanceTestsNotDoneReason).toBe("PI");
                    done();
                });
            });
        });

        it("should applianceGasSafety.performanceTestsNotDoneReasonForSupplementary be undefined", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceSafety.applianceGasSafety.performanceTestsNotDoneReason = "PI";
                applianceReading.gasReadings.supplementaryReadings.readingFinalRatio = 0.005;
                applianceReading.gasReadings.workedOnSupplementaryPerformanceReadings = true;
                applianceReading.save().then(() => {
                    const applianceSafetyBm: ApplianceSafety = saveApplianceSafetyDetailsSpy.getCall(0).args[2];
                    expect(applianceSafetyBm.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary).toBe(undefined);
                    done();
                });
            });
        });

        it("should applianceGasSafety.performanceTestsNotDoneReason not be undefined", (done) => {
            applianceReading.activateAsync({applianceId: "1"}).then(()=> {
                applianceSafety.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary = "PI";
                applianceReading.save().then(() => {
                    const applianceSafetyBm: ApplianceSafety = saveApplianceSafetyDetailsSpy.getCall(0).args[2];
                    expect(applianceSafetyBm.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary).toBe("PI");
                    done();
                });
            });
        });
    });

    describe("deactivate supplementary", () => {

        it("should call dispose handlers", done => {
            applianceReading.activateAsync({applianceId: "1"})
                .then(() => applianceReading.deactivateAsync())
                .then(() => {
                    expect(disposeSpy.called).toBe(true);
                    done();
                });
        });

    });
});
