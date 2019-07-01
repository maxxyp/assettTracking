/// <reference path="../../../../../../typings/app.d.ts" />
import {TodaysPartViewModel} from "../../../../../../app/hema/presentation/modules/parts/viewModels/todaysPartViewModel";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService, DialogResult} from "aurelia-dialog";
import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {IJobService} from "../../../../../../app/hema/business/services/interfaces/IJobService";
import {IValidationService} from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import {IDynamicRule} from "../../../../../../app/hema/business/services/validation/IDynamicRule";
import {IBusinessRuleService} from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {ValidationController} from "../../../../../../app/hema/business/services/validation/validationController";
import {ValidationCombinedResult} from "../../../../../../app/hema/business/services/validation/validationCombinedResult";
import {ValidationPropertyResult} from "../../../../../../app/hema/business/services/validation/rules/validationPropertyResult";
import {ICatalogService} from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import {IEngineerService} from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import {IPartService} from "../../../../../../app/hema/business/services/interfaces/IPartService";
import {ITaskService} from "../../../../../../app/hema/business/services/interfaces/ITaskService";
import {TodaysParts} from "../../../../../../app/hema/presentation/modules/parts/todaysParts";
import {Part} from "../../../../../../app/hema/business/models/part";
import {Task} from "../../../../../../app/hema/business/models/task";
import {Job} from "../../../../../../app/hema/business/models/Job";
import {Guid} from "../../../../../../app/common/core/guid";
import {Threading} from "../../../../../../app/common/core/threading";
import {DataState} from "../../../../../../app/hema/business/models/dataState";
import {PartsToday} from "../../../../../../app/hema/business/models/partsToday";
import {PartWarrantyReturn} from "../../../../../../app/hema/business/models/partWarrantyReturn";
import {PartNotUsedReturn} from "../../../../../../app/hema/business/models/partNotUsedReturn";
import {BindingEngine, PropertyObserver} from "aurelia-binding";
import {FormControllerElement} from "../../../../../../app/common/ui/attributes/formControllerElement";
import {PartsFactory} from "../../../../../../app/hema/presentation/factories/partsFactory";
import * as bignumber from "bignumber";
import { ChargeServiceConstants } from "../../../../../../app/hema/business/services/constants/chargeServiceConstants";

describe("the TodaysParts module", () => {
    let todaysParts: TodaysParts;
    let sandbox: Sinon.SinonSandbox;

    let catalogServiceStub: ICatalogService;
    let jobServiceStub: IJobService;

    let engineerServiceStub: IEngineerService;
    let labelServiceStub: ILabelService;
    let partServiceStub: IPartService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let validationServiceStub: IValidationService;
    let validationServiceBuildSpy: Sinon.SinonSpy;
    let businessRuleServiceStub: IBusinessRuleService;
    let taskServiceStub: ITaskService;
    let bindingEngineStub: BindingEngine;
    let propertyObserverStub: Sinon.SinonStub;
    let subscribeSpy: Sinon.SinonSpy;
    let disposeSpy: Sinon.SinonSpy;
    let publishStub: Sinon.SinonStub;

    let job: Job;
    let part: Part;
    let task: Task;
    let partsToday: PartsToday;

    let validationCombinedResult: ValidationCombinedResult;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        jobServiceStub = <IJobService>{};

        engineerServiceStub = <IEngineerService>{};
        labelServiceStub = <ILabelService>{};
        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.publish = sandbox.stub();

        dialogServiceStub = <DialogService>{};
        dialogServiceStub.open = sandbox.stub().resolves(<DialogResult>{});

        businessRuleServiceStub = <IBusinessRuleService>{};
        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(null);

        jobServiceStub.getJob = sandbox.stub().resolves(job);

        catalogServiceStub = <ICatalogService>{};
        catalogServiceStub.getPartsNotUsedReasons = sandbox.stub().resolves(null);

        part = <Part>{
            taskId: "1",
            price: new bignumber.BigNumber(100.54),
            quantity: 2,
            warrantyReturn: <PartWarrantyReturn>{},
            notUsedReturn: <PartNotUsedReturn>{},
            stockReferenceId: "F00001"
        };

        partServiceStub = <IPartService>{};

        partsToday = new PartsToday();
        partsToday.parts = [part];
        partServiceStub.getTodaysParts = sandbox.stub().resolves(partsToday);

        task = <Task>{
            id: "1"
        };

        taskServiceStub = <ITaskService>{};
        taskServiceStub.getTasks = sandbox.stub().resolves([task]);

        validationServiceStub = <IValidationService>{};
        validationServiceBuildSpy = validationServiceStub.build = sandbox.stub().resolves(<ValidationController>{});

        validationCombinedResult = <ValidationCombinedResult>{};
        validationServiceStub.validate = sandbox.stub().resolves(validationCombinedResult);

        publishStub = eventAggregatorStub.publish = sandbox.stub();

        disposeSpy = sandbox.spy();
        subscribeSpy = sandbox.stub().returns({dispose: disposeSpy});

        bindingEngineStub = <BindingEngine>{};
        propertyObserverStub = bindingEngineStub.propertyObserver = sandbox.stub().returns(<PropertyObserver>{subscribe: subscribeSpy});

        todaysParts = new TodaysParts(jobServiceStub, engineerServiceStub, labelServiceStub, eventAggregatorStub,
            dialogServiceStub, validationServiceStub, businessRuleServiceStub, catalogServiceStub, partServiceStub, taskServiceStub,
            bindingEngineStub, new PartsFactory());

        todaysParts.labels = {
            "no": "",
            "yes": "",
            "partQuantityExceeded": "",
            "confirmation": "",
            "clearQuestion": "",
            "objectName": "",
            "TodaysParts": "",
            "errorDescription": "",
            "errorTitle": ""
        };

        todaysParts.validateAllRules = sandbox.stub().resolves(null);

        let todayspartsgetBusinessRuleStub = todaysParts.getBusinessRule = sandbox.stub();
        todayspartsgetBusinessRuleStub.withArgs("partPriceDividedBy").returns(100);
        todayspartsgetBusinessRuleStub.withArgs("stockReferencePrefixesToStopWarrantyReturn").returns("F");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(todaysParts).toBeDefined();
    });

    describe("page load and deactivate methods", () => {
        it("can activate and load", done => {
            let showContentSpy = todaysParts.showContent = sandbox.spy();
            todaysParts.activateAsync().then(() => {
                expect(showContentSpy.called).toBe(true);

                let expectedViewModel = new TodaysPartViewModel();
                expectedViewModel.part = part;
                expectedViewModel.task = task;
                expectedViewModel.dataStateIndicator = DataState.notVisited;
                expectedViewModel.warrantyReturn = new PartWarrantyReturn();
                expectedViewModel.notUsedReturn = new PartNotUsedReturn();
                expectedViewModel.isWarrantyCollapsedOnLoad = true;
                expectedViewModel.isReturnCollapsedOnLoad = true;
                expectedViewModel.partPrice = new bignumber.BigNumber(part.price);
                expectedViewModel.isWarrantyReturnOptionAvailable = false;

                expect(todaysParts.parts).toEqual([expectedViewModel]);
                expect(expectedViewModel.partPrice.toString()).toBe("100.54");
                done();
            });
        });

        describe("validation", () => {

            let rules: IDynamicRule[];
            let getRule = (property: string) => rules.find(r => r.property === property);

            beforeEach(done => {
                todaysParts.activateAsync().then(() => {
                    rules = validationServiceBuildSpy.args[0][2];
                    done();
                });
            });

            describe("dummyPropertyForGlobalValidation", () => {
                it("can register validation", () => {
                    let rule = getRule("parts[0]");
                    expect(rule).toBeDefined();
                    expect(rule.groups).toEqual(["parts", "parts[0]"]);
                });

                it("will validate when page is first loaded (goes orange to invalid or valid)", () => {
                    let rule = getRule("parts[0]");
                    expect(rule.condition()).toBe(true);
                });

                it("will validate when page is dirty", done => {
                    let rule = getRule("parts[0]");
                    Threading.delay(() => {
                        todaysParts.elementUpdate(<FormControllerElement>{}, null);
                        expect(rule.condition()).toBe(true);
                        done();
                    }, 550);
                });

                it("will not validate when page is dirty and part is touched", done => {
                    let rule = getRule("parts[0]");
                    todaysParts.parts[0].warrantyReturn.isWarrantyReturn = false;

                    Threading.delay(() => {
                        todaysParts.elementUpdate(<FormControllerElement>{}, null);
                        expect(rule.condition()).toBe(false);
                        done();
                    }, 550);
                });

                it("will always not validate", () => {
                    let rule = getRule("parts[0]");
                    expect(rule.passes[0].test()).toBe(false);
                });
            });

            describe("notUsedReturn.quantityToReturn", () => {
                it("can register validation", () => {
                    let rule = getRule("parts[0].notUsedReturn.quantityToReturn");
                    expect(rule).toBeDefined();
                    expect(rule.groups).toEqual(["parts", "parts[0]"]);
                });

                it("will not validate if it is not touched", () => {
                    let rule = getRule("parts[0].notUsedReturn.quantityToReturn");
                    expect(rule.condition()).toBe(false);
                });

                it("will validate if reasonForReturn is set", () => {
                    let rule = getRule("parts[0].notUsedReturn.quantityToReturn");
                    todaysParts.parts[0].notUsedReturn.reasonForReturn = "x";
                    expect(rule.condition()).toBe(true);
                });
            });

            describe("notUsedReturn.reasonForReturn", () => {
                it("can register validation", () => {
                    let rule = getRule("parts[0].notUsedReturn.reasonForReturn");
                    expect(rule).toBeDefined();
                    expect(rule.groups).toEqual(["parts", "parts[0]"]);
                });

                it("will not validate if it is not touched", () => {
                    let rule = getRule("parts[0].notUsedReturn.reasonForReturn");
                    expect(rule.condition()).toBe(false);
                });

                it("will not validate if quantityToReturn is set to 0", () => {
                    let rule = getRule("parts[0].notUsedReturn.reasonForReturn");
                    todaysParts.parts[0].notUsedReturn.quantityToReturn = 0;
                    expect(rule.condition()).toBe(false);
                });

                it("will validate if quantityToReturn is set to 1", () => {
                    let rule = getRule("parts[0].notUsedReturn.reasonForReturn");
                    todaysParts.parts[0].notUsedReturn.quantityToReturn = 1;
                    expect(rule.condition()).toBe(true);
                });
            });

            describe("warrantyReturn.isWarrantyReturn", () => {
                it("can register validation", () => {
                    let rule = getRule("parts[0].warrantyReturn.isWarrantyReturn");
                    expect(rule).toBeDefined();
                    expect(rule.groups).toEqual(["parts", "parts[0]"]);
                });

                it("will not validate if quantityToReturn is undefined", () => {
                    let rule = getRule("parts[0].warrantyReturn.isWarrantyReturn");
                    expect(rule.condition()).toBe(false);
                });

                it("will not validate if quantityToReturn is defined", () => {
                    let rule = getRule("parts[0].warrantyReturn.isWarrantyReturn");
                    todaysParts.parts[0].warrantyReturn.isWarrantyReturn = false;
                    expect(rule.condition()).toBe(true);
                    todaysParts.parts[0].warrantyReturn.isWarrantyReturn = true;
                    expect(rule.condition()).toBe(true);
                });
            });

            describe("warrantyReturn.quantityToClaimOrReturn", () => {
                it("can register validation", () => {
                    let rule = getRule("parts[0].warrantyReturn.quantityToClaimOrReturn");
                    expect(rule).toBeDefined();
                    expect(rule.groups).toEqual(["parts", "parts[0]"]);
                });

                it("will not validate if isWarrantyReturn is undefined", () => {
                    let rule = getRule("parts[0].warrantyReturn.quantityToClaimOrReturn");
                    expect(rule.condition()).toBe(false);
                });

                it("will not validate if isWarrantyReturn is false", () => {
                    let rule = getRule("parts[0].warrantyReturn.quantityToClaimOrReturn");
                    todaysParts.parts[0].warrantyReturn.isWarrantyReturn = false;
                    expect(rule.condition()).toBe(false);
                });

                it("will validate if isWarrantyReturn is true", () => {
                    let rule = getRule("parts[0].warrantyReturn.quantityToClaimOrReturn");
                    todaysParts.parts[0].warrantyReturn.isWarrantyReturn = true;
                    expect(rule.condition()).toBe(true);
                });

            });

            describe("warrantyReturn.removedPartStockReferenceId", () => {
                it("can register validation", () => {
                    let rule = getRule("parts[0].warrantyReturn.removedPartStockReferenceId");
                    expect(rule).toBeDefined();
                    expect(rule.groups).toEqual(["parts", "parts[0]"]);
                });

                it("will not validate if not warranty return", () => {
                    let rule = getRule("parts[0].warrantyReturn.removedPartStockReferenceId");
                    todaysParts.parts[0].warrantyReturn.isWarrantyReturn = false;
                    expect(rule.condition()).toBe(false);
                });

                it("will validate if warranty return", () => {
                    let rule = getRule("parts[0].warrantyReturn.removedPartStockReferenceId");
                    todaysParts.parts[0].warrantyReturn.isWarrantyReturn = true;
                    expect(rule.condition()).toBe(true);
                });
            });

            describe("warrantyReturn.reasonForClaim", () => {
                it("can register validation", () => {
                    let rule = getRule("parts[0].warrantyReturn.reasonForClaim");
                    expect(rule).toBeDefined();
                    expect(rule.groups).toEqual(["parts", "parts[0]"]);
                });

                it("will not validate if not warranty return", () => {
                    let rule = getRule("parts[0].warrantyReturn.reasonForClaim");
                    todaysParts.parts[0].warrantyReturn.isWarrantyReturn = false;
                    expect(rule.condition()).toBe(false);
                });

                it("will validate if warranty return", () => {
                    let rule = getRule("parts[0].warrantyReturn.reasonForClaim");
                    todaysParts.parts[0].warrantyReturn.isWarrantyReturn = true;
                    expect(rule.condition()).toBe(true);
                });

            });

        });

        it("can call deactivateAsync and subscribe and dispose change handlers", done => {
            todaysParts.activateAsync()
                .then(() => todaysParts.deactivateAsync())
                .then(() => {
                    expect(subscribeSpy.callCount).toBe(4);
                    expect(disposeSpy.callCount).toBe(4);
                    done();
                });
        });

        describe("change handlers", () => {

            let isWarrantyChangeHandlerSubscribeSpy: Sinon.SinonSpy;
            let warrantyQuantityChangeHandlerSubscribeSpy: Sinon.SinonSpy;
            let returnReasonChangeHandlerSubscribeSpy: Sinon.SinonSpy;
            let notUsedReturnQuantityChangeHandlerSubscribeSpy: Sinon.SinonSpy;

            beforeEach(() => {

                isWarrantyChangeHandlerSubscribeSpy = sandbox.stub().returns({dispose: disposeSpy});
                warrantyQuantityChangeHandlerSubscribeSpy = sandbox.stub().returns({dispose: disposeSpy});
                returnReasonChangeHandlerSubscribeSpy = sandbox.stub().returns({dispose: disposeSpy});
                notUsedReturnQuantityChangeHandlerSubscribeSpy = sandbox.stub().returns({dispose: disposeSpy});

                propertyObserverStub.withArgs(sinon.match.any, "isWarrantyReturn")
                    .returns(<PropertyObserver>{subscribe: isWarrantyChangeHandlerSubscribeSpy});
                propertyObserverStub.withArgs(sinon.match.any, "quantityToClaimOrReturn")
                    .returns(<PropertyObserver>{subscribe: warrantyQuantityChangeHandlerSubscribeSpy});
                propertyObserverStub.withArgs(sinon.match.any, "reasonForReturn")
                    .returns(<PropertyObserver>{subscribe: returnReasonChangeHandlerSubscribeSpy});
                propertyObserverStub.withArgs(sinon.match.any, "quantityToReturn")
                    .returns(<PropertyObserver>{subscribe: notUsedReturnQuantityChangeHandlerSubscribeSpy});
            });

            describe("isWarrantyChangeHandler", () => {
                it("isWarrantyChangeHandler can set default warranty quantity if not already set", done => {
                    part.warrantyReturn.isWarrantyReturn = true;
                    todaysParts.activateAsync()
                        .then(() => {
                            let isWarrantyChangeHandler: () => void = isWarrantyChangeHandlerSubscribeSpy.args[0][0];
                            isWarrantyChangeHandler();
                            expect(todaysParts.parts[0].warrantyReturn.quantityToClaimOrReturn).toBe(1);
                            done();
                        });
                });

                it("isWarrantyChangeHandler can not set default warranty quantity if already set", done => {
                    part.warrantyReturn.quantityToClaimOrReturn = 2;
                    todaysParts.activateAsync()
                        .then(() => {
                            let isWarrantyChangeHandler: () => void = isWarrantyChangeHandlerSubscribeSpy.args[0][0];
                            isWarrantyChangeHandler();
                            expect(todaysParts.parts[0].warrantyReturn.quantityToClaimOrReturn).toBe(2);
                            done();
                        });
                });
            });

            describe("warrantyQuantityChangeHandler", () => {

                it("isWarrantyChangeHandler can amend notUsedReturn.quantityToReturn if a valid new value is being entered", done => {
                    todaysParts.activateAsync()
                        .then(() => {
                            todaysParts.parts[0].notUsedReturn.quantityToReturn = 3;
                            todaysParts.parts[0].part.quantity = 3;

                            let isWarrantyChangeHandler: (newValue: number, oldValue: number) => void = warrantyQuantityChangeHandlerSubscribeSpy.args[0][0];
                            isWarrantyChangeHandler(1, 0);
                            expect(todaysParts.parts[0].notUsedReturn.quantityToReturn).toBe(2);
                            done();
                        });
                });

                it("isWarrantyChangeHandler can amend notUsedReturn.quantityToReturn and reset reasonForReturn if new value takes up all available quantity", done => {
                    todaysParts.activateAsync()
                        .then(() => {
                            todaysParts.parts[0].notUsedReturn.quantityToReturn = 3;
                            todaysParts.parts[0].notUsedReturn.reasonForReturn = "foo";
                            todaysParts.parts[0].part.quantity = 3;

                            let isWarrantyChangeHandler: (newValue: number, oldValue: number) => void = warrantyQuantityChangeHandlerSubscribeSpy.args[0][0];
                            isWarrantyChangeHandler(3, 0);
                            expect(todaysParts.parts[0].notUsedReturn.quantityToReturn).toBe(0);
                            expect(todaysParts.parts[0].notUsedReturn.reasonForReturn).toBeUndefined();

                            done();
                        });
                });

                it("isWarrantyChangeHandler cannot amend notUsedReturn.quantityToReturn if an invalid new value is being entered", done => {
                    todaysParts.activateAsync()
                        .then(() => {
                            todaysParts.parts[0].notUsedReturn.quantityToReturn = 3;
                            todaysParts.parts[0].part.quantity = 3;

                            let isWarrantyChangeHandler: (newValue: number, oldValue: number) => void = warrantyQuantityChangeHandlerSubscribeSpy.args[0][0];
                            isWarrantyChangeHandler(4, 0);
                            expect(todaysParts.parts[0].notUsedReturn.quantityToReturn).toBe(3);
                            done();
                        });
                });

                it("isWarrantyChangeHandler cannot amend notUsedReturn.quantityToReturn if value being entered is decreasing", done => {
                    todaysParts.activateAsync()
                        .then(() => {
                            todaysParts.parts[0].notUsedReturn.quantityToReturn = 3;
                            todaysParts.parts[0].part.quantity = 3;

                            let isWarrantyChangeHandler: (newValue: number, oldValue: number) => void = warrantyQuantityChangeHandlerSubscribeSpy.args[0][0];
                            isWarrantyChangeHandler(0, 1);
                            expect(todaysParts.parts[0].notUsedReturn.quantityToReturn).toBe(3);
                            done();
                        });
                });

                it("isWarrantyChangeHandler cannot amend notUsedReturn.quantityToReturn if notUsedReturn.quantityToReturn would still be valid", done => {
                    todaysParts.activateAsync()
                        .then(() => {
                            todaysParts.parts[0].notUsedReturn.quantityToReturn = 2;
                            todaysParts.parts[0].part.quantity = 3;

                            let isWarrantyChangeHandler: (newValue: number, oldValue: number) => void = warrantyQuantityChangeHandlerSubscribeSpy.args[0][0];
                            isWarrantyChangeHandler(1, 0);
                            expect(todaysParts.parts[0].notUsedReturn.quantityToReturn).toBe(2);
                            done();
                        });
                });

            });

            describe("returnReasonChangeHandler", () => {
                it("returnReasonChangeHandler can set default return quantity if not already set and reason is defined", done => {
                    todaysParts.activateAsync()
                        .then(() => {
                            let returnReasonChangeHandler: () => void = returnReasonChangeHandlerSubscribeSpy.args[0][0];
                            todaysParts.parts[0].notUsedReturn.reasonForReturn = "foo";
                            returnReasonChangeHandler();
                            expect(todaysParts.parts[0].notUsedReturn.quantityToReturn).toBe(1);
                            done();
                        });
                });

                it("returnReasonChangeHandler can not set default return quantity if not already set and reason is not defined", done => {
                    todaysParts.activateAsync()
                        .then(() => {
                            let returnReasonChangeHandler: () => void = returnReasonChangeHandlerSubscribeSpy.args[0][0];
                            todaysParts.parts[0].notUsedReturn.reasonForReturn = undefined;
                            returnReasonChangeHandler();
                            expect(todaysParts.parts[0].notUsedReturn.quantityToReturn).toBeUndefined();
                            done();
                        });
                });

                it("returnReasonChangeHandler can not set default return quantity if already set", done => {
                    part.notUsedReturn.quantityToReturn = 2;
                    todaysParts.activateAsync()
                        .then(() => {
                            let returnReasonChangeHandler: () => void = returnReasonChangeHandlerSubscribeSpy.args[0][0];
                            returnReasonChangeHandler();
                            expect(todaysParts.parts[0].notUsedReturn.quantityToReturn).toBe(2);
                            done();
                        });
                });
            });

            describe("notUsedReturnQuantityChangeHandler", () => {

                it("notUsedReturnQuantityChangeHandler can amend warrantyReturn.quantityToClaimOrReturn if a valid new value is being entered", done => {
                    todaysParts.activateAsync()
                        .then(() => {
                            todaysParts.parts[0].warrantyReturn.quantityToClaimOrReturn = 3;
                            todaysParts.parts[0].part.quantity = 3;

                            let notUsedReturnQuantityChangeHandler: (newValue: number, oldValue: number) => void = notUsedReturnQuantityChangeHandlerSubscribeSpy.args[0][0];
                            notUsedReturnQuantityChangeHandler(1, 0);
                            expect(todaysParts.parts[0].warrantyReturn.quantityToClaimOrReturn).toBe(2);
                            done();
                        });
                });

                it("notUsedReturnQuantityChangeHandler can amend warrantyReturn.quantityToClaimOrReturn and reset isWarrantyReturn if new value takes up all available quantity", done => {
                    todaysParts.activateAsync()
                        .then(() => {
                            todaysParts.parts[0].warrantyReturn.quantityToClaimOrReturn = 3;
                            todaysParts.parts[0].warrantyReturn.isWarrantyReturn = true;
                            todaysParts.parts[0].part.quantity = 3;

                            let notUsedReturnQuantityChangeHandler: (newValue: number, oldValue: number) => void = notUsedReturnQuantityChangeHandlerSubscribeSpy.args[0][0];
                            notUsedReturnQuantityChangeHandler(3, 0);
                            expect(todaysParts.parts[0].warrantyReturn.quantityToClaimOrReturn).toBe(0);
                            expect(todaysParts.parts[0].warrantyReturn.isWarrantyReturn).toBe(false);

                            done();
                        });
                });

                it("notUsedReturnQuantityChangeHandler cannot amend warrantyReturn.quantityToClaimOrReturn if an invalid new value is being entered", done => {
                    todaysParts.activateAsync()
                        .then(() => {
                            todaysParts.parts[0].warrantyReturn.quantityToClaimOrReturn = 3;
                            todaysParts.parts[0].part.quantity = 3;

                            let notUsedReturnQuantityChangeHandler: (newValue: number, oldValue: number) => void = notUsedReturnQuantityChangeHandlerSubscribeSpy.args[0][0];
                            notUsedReturnQuantityChangeHandler(4, 0);
                            expect(todaysParts.parts[0].warrantyReturn.quantityToClaimOrReturn).toBe(3);
                            done();
                        });
                });

                it("notUsedReturnQuantityChangeHandler cannot amend warrantyReturn.quantityToClaimOrReturn if value being entered is decreasing", done => {
                    todaysParts.activateAsync()
                        .then(() => {
                            todaysParts.parts[0].warrantyReturn.quantityToClaimOrReturn = 3;
                            todaysParts.parts[0].part.quantity = 3;

                            let notUsedReturnQuantityChangeHandler: (newValue: number, oldValue: number) => void = notUsedReturnQuantityChangeHandlerSubscribeSpy.args[0][0];
                            notUsedReturnQuantityChangeHandler(0, 1);
                            expect(todaysParts.parts[0].warrantyReturn.quantityToClaimOrReturn).toBe(3);
                            done();
                        });
                });

                it("notUsedReturnQuantityChangeHandler cannot amend warrantyReturn.quantityToClaimOrReturn if warrantyReturn.quantityToClaimOrReturn would still be valid", done => {
                    todaysParts.activateAsync()
                        .then(() => {
                            todaysParts.parts[0].warrantyReturn.quantityToClaimOrReturn = 2;
                            todaysParts.parts[0].part.quantity = 3;

                            let notUsedReturnQuantityChangeHandler: (newValue: number, oldValue: number) => void = notUsedReturnQuantityChangeHandlerSubscribeSpy.args[0][0];
                            notUsedReturnQuantityChangeHandler(1, 0);
                            expect(todaysParts.parts[0].warrantyReturn.quantityToClaimOrReturn).toBe(2);
                            done();
                        });
                });

            });

        });
    });

    it("can save and hit the partsService saveTodaysParts method with the expected inputs", done => {
        let saveSpy: Sinon.SinonSpy = partServiceStub.saveTodaysPartsReturns = sandbox.stub().resolves(undefined);

        todaysParts.jobId = "1";
        todaysParts.getFinalDataState = sandbox.stub().returns(DataState.valid);

        let part1 = <Part>{};
        part1.id = Guid.newGuid();

        let part2 = <Part>{};
        part2.id = Guid.newGuid();

        let vm1 = <TodaysPartViewModel>{
            part: part1,
            warrantyReturn: <PartWarrantyReturn>{},
            notUsedReturn: <PartNotUsedReturn>{}
        };

        let vm2 = <TodaysPartViewModel>{
            part: part2,
            warrantyReturn: <PartWarrantyReturn>{},
            notUsedReturn: <PartNotUsedReturn>{}
        };

        todaysParts.parts = [vm1, vm2];

        todaysParts.save().then(() => {
            expect(saveSpy.calledOnce).toBe(true);
            expect(saveSpy.args[0][0]).toBe("1");
            expect(saveSpy.args[0][1]).toBe(DataState.valid);
            expect(saveSpy.args[0][2]).toEqual([
                {partId: part1.id, notusedReturn: vm1.notUsedReturn, warrantyReturn: vm1.warrantyReturn},
                {partId: part2.id, notusedReturn: vm2.notUsedReturn, warrantyReturn: vm2.warrantyReturn}
            ]);
            done();
        });
    });

    it("can not call update charges when not dirty and save is called", done => {
        partServiceStub.saveTodaysPartsReturns = sandbox.stub().resolves(undefined)
        todaysParts.parts = [];
        todaysParts.jobId = "1";

        todaysParts.setDirty(false);
        todaysParts.save().then(() => {
            expect(publishStub.calledWith(ChargeServiceConstants.CHARGE_UPDATE_START, "1")).toBe(false);
            done();
        });
    });

    it("can call update charges when dirty and save is called", done => {

        partServiceStub.saveTodaysPartsReturns = sandbox.stub().resolves(undefined)
        todaysParts.parts = [];
        todaysParts.jobId = "1";

        todaysParts.setDirty(true);
        todaysParts.save().then(() => {
            expect(publishStub.calledWith(ChargeServiceConstants.CHARGE_UPDATE_START, "1")).toBe(true);
            done();
        });
    });

    it("can set a warranty parts ref to the same as the original", () => {
        let warrantyReturn = <PartWarrantyReturn>{};
        todaysParts.setSameRefAsOriginal(warrantyReturn, <Part>{stockReferenceId: "1"});
        expect(warrantyReturn.removedPartStockReferenceId).toBe("1");
    });

    describe("validationUpdated", () => {
        it("can call validationUpdated with null groups in validation result", done => {
            todaysParts.validationToggle(true);
            validationCombinedResult.groups = null;
            todaysParts.activateAsync()
                .then(() => todaysParts.validateAllRules())
                .then(() => {
                    done();
                });
        });

        it("can call validationUpdated without a property being set and set the part state to notVisited", done => {

            todaysParts.validationToggle(true);
            part.warrantyReturn.isWarrantyReturn = undefined;

            validationCombinedResult.groups = ["parts[0]"];
            validationCombinedResult.propertyResults = {
                "parts[0]": <ValidationPropertyResult>{
                    property: "parts[0]",
                    isValid: true
                },
                "parts[0].warrantyReturn.isWarrantyReturn": <ValidationPropertyResult>{
                    property: "parts[0].warrantyReturn.isWarrantyReturn",
                    isValid: true
                }
            };

            todaysParts.activateAsync()
                .then(() => todaysParts.validateAllRules())
                .then(() => {
                    expect(todaysParts.parts[0].dataStateIndicator).toBe(DataState.notVisited);
                    done();
                });
        });

        it("can call validationUpdated with a valid property being set and set the part state to notVisited", done => {
            todaysParts.validationToggle(true);

            part.warrantyReturn.isWarrantyReturn = true;

            validationCombinedResult.groups = ["parts[0]"];
            validationCombinedResult.propertyResults = {
                "parts[0]": <ValidationPropertyResult>{
                    property: "parts[0]",
                    isValid: true
                },
                "parts[0].warrantyReturn.isWarrantyReturn": <ValidationPropertyResult>{
                    property: "parts[0].warrantyReturn.isWarrantyReturn",
                    isValid: true
                }
            };
            partsToday.dataState = DataState.valid;
            todaysParts.activateAsync()
                .then(() => todaysParts.validateAllRules())
                .then(() => {
                    expect(todaysParts.parts[0].dataStateIndicator).toBe(DataState.notVisited);
                    done();
                });
        });

        it("can call validationUpdated with an invalid property being set and set the part state to notVisited", done => {
            todaysParts.validationToggle(true);

            part.warrantyReturn.isWarrantyReturn = true;

            validationCombinedResult.groups = ["parts[0]"];
            validationCombinedResult.propertyResults = {
                "parts[0]": <ValidationPropertyResult>{
                    property: "parts[0]",
                    isValid: true
                },
                "parts[0].warrantyReturn.isWarrantyReturn": <ValidationPropertyResult>{
                    property: "parts[0].warrantyReturn.isWarrantyReturn",
                    isValid: false
                }
            };
            partsToday.dataState = DataState.valid;
            todaysParts.activateAsync()
                .then(() => todaysParts.validateAllRules())
                .then(() => {
                    expect(todaysParts.parts[0].dataStateIndicator).toBe(DataState.notVisited);
                    done();
                });
        });
    });

    it("can clear", done => {
        todaysParts.parts = [<TodaysPartViewModel>{
            part: null,
            task: null,
            warrantyReturn: {
                isWarrantyReturn: true
            },
            notUsedReturn: {},
            dataStateIndicator: DataState.invalid,
            isWarrantyCollapsedOnLoad: null,
            isReturnCollapsedOnLoad: null
        }
        ];

        todaysParts.clear().then(() => {
            expect(todaysParts.parts[0].warrantyReturn.isWarrantyReturn).toBeUndefined();
            done();
        });

    });
});
