/// <reference path="../../../../../../typings/app.d.ts" />
import {GasSafetyDetail} from "../../../../../../app/hema/presentation/modules/propertySafety/gasSafetyDetail";
import {ICatalogService} from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import {IPropertySafetyService} from "../../../../../../app/hema/business/services/interfaces/IPropertySafetyService";
import {EventAggregator} from "aurelia-event-aggregator";
import {IJobService} from "../../../../../../app/hema/business/services/interfaces/IJobService";
import {PropertyGasSafetyDetail as GasSafetyDetailBusinessModel} from "../../../../../../app/hema/business/models/propertyGasSafetyDetail";
import {IValidationService} from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {IBusinessRuleService} from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {BusinessException} from "../../../../../../app/hema/business/models/businessException";
import {PropertySafety} from "../../../../../../app/hema/business/models/propertySafety";
import {PropertyUnsafeDetail as UnsafeDetailBusinessModel} from "../../../../../../app/hema/business/models/propertyUnsafeDetail";
import {IEngineerService} from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import {DialogService} from "aurelia-dialog";
import {ISafetyNoticeStatus} from "../../../../../../app/hema/business/models/reference/ISafetyNoticeStatus";
import {ISafetyAction} from "../../../../../../app/hema/business/models/reference/ISafetyAction";
import {ISafetyNoticeType} from "../../../../../../app/hema/business/models/reference/ISafetyNoticeType";
import {ISftyReasonCat} from "../../../../../../app/hema/business/models/reference/ISftyReasonCat";
import {CatalogConstants} from "../../../../../../app/hema/business/services/constants/catalogConstants";
import {ISftyReadingCat} from "../../../../../../app/hema/business/models/reference/ISftyReadingCat";
import {Job} from "../../../../../../app/hema/business/models/job";
import {UnsafeReason} from "../../../../../../app/hema/business/models/unsafeReason";
import {QueryableBusinessRuleGroup} from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import {Task} from "../../../../../../app/hema/business/models/task";

describe("the GasSafetyDetail module", () => {
    let sandbox: Sinon.SinonSandbox;
    let gasSafetyDetail: GasSafetyDetail;
    let catalogServiceStub: ICatalogService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let propSafetyServiceStub: IPropertySafetyService;
    let validationServiceStub: IValidationService;
    let labelServiceStub: ILabelService;
    let businessRuleServiceStub: IBusinessRuleService;
    let businessException: BusinessException;
    let unSafeReasons: UnsafeReason[];

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        catalogServiceStub = <ICatalogService>{};
        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.publish = sandbox.stub();

        jobServiceStub = <IJobService>{};

        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);

        propSafetyServiceStub = <IPropertySafetyService>{};
        validationServiceStub = <IValidationService>{};
        labelServiceStub = <ILabelService>{};
        businessRuleServiceStub = <IBusinessRuleService>{};

        let job = new Job();
        let task = new Task(true, false);
        task.status = "NA";
        job.tasks = [task];
        job.isLandlordJob = false;
        jobServiceStub.getJob = sandbox.stub().resolves(job);

        let iniEliReadings: ISftyReadingCat[] = [];
        let eliReading: ISftyReadingCat = <ISftyReadingCat>{};
        eliReading.safetyReadingCategoryFlag = "A1";
        eliReading.safetyReadingCategoryReading = "Description A1";
        iniEliReadings.push(eliReading);

        catalogServiceStub.getSafetyReadingCats = sandbox.stub()
            .withArgs(CatalogConstants.SAFETY_READING_CAT_GROUP_INIT_ELI_READING).resolves(iniEliReadings);

        let eliReadWhyNots: ISftyReasonCat[] = [];
        let eliReadWhyNot: ISftyReasonCat = <ISftyReasonCat>{};
        eliReadWhyNot.safetyReasonCategoryCode = "B1";
        eliReadWhyNot.safetyReasonCategoryReason = "Description B1";
        eliReadWhyNots.push(eliReadWhyNot);

        let gassats: ISftyReasonCat[] = [];
        let gas: ISftyReasonCat = <ISftyReasonCat>{};
        gas.safetyReasonCategoryCode = "B1";
        gas.safetyReasonCategoryReason = "Description B1";
        gassats.push(gas);

        catalogServiceStub.getSafetyReasonCats = sandbox.stub()
            .withArgs(CatalogConstants.SAFETY_REASON_CAT_GROUP_ELI_READ_WHY_NOT).resolves(eliReadWhyNots)
            .withArgs(CatalogConstants.SAFETY_REASON_CAT_GROUP_GAS_INST_SAT).resolves(gassats);

        let conditionAsLefts: ISafetyNoticeType[] = [];
        let conditionAsLeft: ISafetyNoticeType = <ISafetyNoticeType>{};
        conditionAsLeft.noticeType = "AR";
        conditionAsLeft.safetyNoticeTypeDescription = "Description AR";
        conditionAsLefts.push(conditionAsLeft);

        conditionAsLeft = <ISafetyNoticeType>{};
        conditionAsLeft.noticeType = "ID";
        conditionAsLeft.safetyNoticeTypeDescription = "Description ID";
        conditionAsLefts.push(conditionAsLeft);

        conditionAsLeft = <ISafetyNoticeType>{};
        conditionAsLeft.noticeType = "SS";
        conditionAsLeft.safetyNoticeTypeDescription = "Description SS";
        conditionAsLefts.push(conditionAsLeft);

        /* let conditionAsLefts: ISafetyNoticeType[] = [<ISafetyNoticeType> {sftyNtceTcode: "AR", sftyNtceTypeDesc: "Description AR"},
         <ISafetyNoticeType> {sftyNtceTcode: "ID", sftyNtceTypeDesc: "Description ID"},
         <ISafetyNoticeType> {sftyNtceTcode: "SS", sftyNtceTypeDesc: "Description SS"}]; */

        catalogServiceStub.getSafetyNoticeTypes = sandbox.stub().resolves(conditionAsLefts);

        let cappedOrTurnedOffs: ISafetyAction[] = [];
        let cappedOrTurnedOff: ISafetyAction = <ISafetyAction>{};
        cappedOrTurnedOff.actionCode = "B1";
        cappedOrTurnedOff.safetyActionDescription = "Description B1";
        cappedOrTurnedOffs.push(cappedOrTurnedOff);

        cappedOrTurnedOff = <ISafetyAction>{};
        cappedOrTurnedOff.actionCode = "A1";
        cappedOrTurnedOff.safetyActionDescription = "Description A1";
        cappedOrTurnedOffs.push(cappedOrTurnedOff);

        catalogServiceStub.getSafetyActions = sandbox.stub().resolves(cappedOrTurnedOffs);

        let labelAttachedRemoveds: ISafetyNoticeStatus[] = [];
        labelAttachedRemoveds.push(<ISafetyNoticeStatus>{
            noticeStatus: "A",
            safetyNoticeStatusDescription: "Description A"
        });
        labelAttachedRemoveds.push(<ISafetyNoticeStatus>{
            noticeStatus: "B",
            safetyNoticeStatusDescription: "Description B"
        });

        catalogServiceStub.getSafetyNoticeStatuses = sandbox.stub().resolves(labelAttachedRemoveds);

        let sat: GasSafetyDetailBusinessModel = new GasSafetyDetailBusinessModel();
        sat.eliReading = "eliReading";
        sat.gasInstallationTightnessTestDone = false;
        sat.gasMeterInstallationSatisfactory = "gasMeterInstallationSatisfactory";
        sat.eliReadingReason = "eliReadingReason";
        sat.safetyAdviseNoticeLeftReason = "safetyAdviseNoticeLeftReason";
        sat.pressureDrop = 5;
        sat.safetyAdviseNoticeLeft = true;

        let unsafe: UnsafeDetailBusinessModel = new UnsafeDetailBusinessModel();
        unsafe.report = "report";
        unsafe.conditionAsLeft = "conditionAsLeft";
        unsafe.cappedTurnedOff = "cappedTurnedOff";
        unsafe.labelAttachedRemoved = "labelAttachedRemoved";
        unsafe.ownedByCustomer = true;
        unsafe.letterLeft = true;
        unsafe.signatureObtained = true;

        let propertySafety: PropertySafety = new PropertySafety();
        propertySafety.propertyGasSafetyDetail = sat;
        propertySafety.propertyUnsafeDetail = unsafe;

        propSafetyServiceStub.getPropertySafetyDetails = sandbox.stub().resolves(propertySafety);
        unSafeReasons = [new UnsafeReason("gasMeterInstallation", "No", [])];
        propSafetyServiceStub.populateGasUnsafeReasons = sandbox.stub().withArgs(8, true, 8, "No", "No Meter", false).resolves(null);

        validationServiceStub.build = sandbox.stub().resolves(null);

        let businessRules: { [key: string]: any } = {};
        businessRules["pressureDropThreshold"] = 8;
        businessRules["pressureDropDecimalPlaces"] = 2;
        businessRules["gasInstallationNotSatisfactoryNoType"] = "N";
        businessRules["gasInstallationNotSatisfactoryNoMeterType"] = "NM";
        businessRules["gasMeterInstallationSatisfactoryNotApplicableOption"] = "N/A";
        businessRules["gasMeterInstallationSatisfactoryNotApplicableOptionInstaPerm"] = "Yes";
        businessRules["noEliReadings"] = true;
        businessRules["cappedTurnedOffDisabledOptions"] = "A1";
        businessRules["cappedTurnedOffSelectedOption"] = "X";
        businessRules["conditionAsLeftDisableOptions"] = "SS";
        businessRules["conditionAsLeftSelectedOptions"] = "ID";
        businessRules["notToCurrentStdConditionAsLeftOptionSelected"] = "SS";
        businessRules["cappedTurnedOffDisabledOptionsForNotToCurrentStd"] = "C,T";
        businessRules["labelAttachedDisabledOptionsForNotToCurrentStd"] = "A,X";
        businessRules["labelAttachedDisableOptions"] = "A";
        businessRules["gasMeterInstallationSatisfactoryNotApplicableOptionYes"] = "Yes";
        businessRules["notToCurrentStdConditionAsLeftOptionSelectedSS"] = "SS";
        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(businessRules);

        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};

        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("notDoingJobStatuses").returns("NA");
        getBusinessRuleStub.withArgs("conditionAsLeftImmediatelyDangerousOption").returns("ID");
        getBusinessRuleStub.withArgs("cappedTurnedOffOptionsForWarningMsg").returns("NC,NT,T");
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);


        businessException = new BusinessException("context", "reference", "message", null, null);

        labelServiceStub.getGroup = sandbox.stub().resolves({"yes": "Yes", "no": "No"});

        dialogServiceStub = <DialogService>{};

        gasSafetyDetail = new GasSafetyDetail(catalogServiceStub,
            labelServiceStub, propSafetyServiceStub, eventAggregatorStub, dialogServiceStub, jobServiceStub, engineerServiceStub,
            validationServiceStub, businessRuleServiceStub);
        gasSafetyDetail.labels = {
            "yes": "Yes",
            "no": "No",
            "noEliReadings": "noEliReadings",
            "noEliReadingsUnsafe": "noEliReadingsUnsafe",
            "gasMeterInstallationUnsafe": "gasMeterInstallationUnsafe",
            "unsafeWarningMsg": "unsafeWarningMsg"
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(gasSafetyDetail).toBeDefined();
    });

    describe("the activateAsync method", () => {
        beforeEach(() => {
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be called", (done) => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(gasSafetyDetail, "activateAsync");

            gasSafetyDetail.activateAsync()
                .then(() => {
                    expect(methodSpy.calledOnce).toBe(true);
                    expect(gasSafetyDetail.canEdit).toBe(false);
                    done();
                })
                .catch((error) => {
                    fail("shouldnt be here " + error);
                    done();
                });
        });

        it("can handle service error", (done) => {
            gasSafetyDetail.loadBusinessRules = sandbox.stub().rejects(businessException);

            let methodSpy: Sinon.SinonSpy = sandbox.spy(gasSafetyDetail, "showContent");

            gasSafetyDetail.activateAsync()
                .then(() => {
                    fail("shouldnt be here");
                    done();
                })
                .catch((error) => {
                    expect(methodSpy.calledOnce).toBe(false);
                    done();
                });
        });

        it("can activate the view", (done) => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(gasSafetyDetail, "showContent");

            gasSafetyDetail.activateAsync().then(() => {
                expect(gasSafetyDetail.iniEliReadingSelected).toBe("eliReading");
                expect(gasSafetyDetail.gasInstallationTightnessTestDoneSelected).toBe(false);
                expect(gasSafetyDetail.reasonWhyText).toBe("safetyAdviseNoticeLeftReason");
                expect(gasSafetyDetail.safetyAdviceNoticeLeftSelected).toBe(true);
                expect(methodSpy.calledOnce).toBe(true);
                done();
            });
        });
    });

    describe("the pressureDropChanged method", () => {

        afterEach(() => {
            sandbox.restore();
        });

        it("can handle pressure drop above threshold", (done) => {
            gasSafetyDetail.activateAsync()
                .then(() => {
                    gasSafetyDetail.pressureDrop = 6;
                    gasSafetyDetail.gasInstallationTightnessTestDoneSelected = true;
                    gasSafetyDetail.gasMeterInstallationSatisfactorySelected = "foo";
                    gasSafetyDetail.pressureDropChanged(10, 0)
                        .then(() => {
                            expect(gasSafetyDetail.gasMeterInstallationSatisfactoryDisabled).toBe(true);
                            expect(gasSafetyDetail.gasMeterInstallationSatisfactorySelected).toBe("No");
                            expect(gasSafetyDetail.conditionAsLeftLookup.find(l => l.value === "SS").disabled).toBe(false);
                            expect(gasSafetyDetail.conditionAsLeftLookup.find(l => l.value === "AR").disabled).toBe(false);
                            done();
                        });
                })
                .catch((error) => {
                    fail("should not be here: " + error);
                    done();
                });
        });

        it("can allow pressure drop below threshold", (done) => {
            gasSafetyDetail.activateAsync()
                .then(() => {
                    gasSafetyDetail.pressureDrop = 5;
                    gasSafetyDetail.gasInstallationTightnessTestDoneSelected = true;
                    gasSafetyDetail.gasMeterInstallationSatisfactorySelected = "foo";
                    gasSafetyDetail.pressureDropChanged(1, 0)
                        .then(() => {
                            expect(gasSafetyDetail.gasMeterInstallationSatisfactoryDisabled).toBe(false);
                            expect(gasSafetyDetail.gasMeterInstallationSatisfactorySelected).toBe("foo");
                            expect(gasSafetyDetail.conditionAsLeftLookup.find(l => l.value === "SS").disabled).toBe(false);
                            expect(gasSafetyDetail.conditionAsLeftLookup.find(l => l.value === "AR").disabled).toBe(false);
                            done();
                        });
                })
                .catch((error) => {
                    fail("should not be here: " + error);
                    done();
                });
        });

    });

    describe("the conditionAsLeftSelectedChanged method", () => {
        it("should restrict the set of label-attached and CappedTurnedOff values if conditionAsLeft is IR or AD", done => {
            gasSafetyDetail.activateAsync().then(() => {
                gasSafetyDetail.conditionAsLeftSelectedChanged("ID");
                expect(gasSafetyDetail.cappedTurnedOffLookup.find(l => l.value === "A1").disabled).toBe(true);
                expect(gasSafetyDetail.cappedTurnedOffLookup.find(l => l.value === "B1").disabled).toBe(false);
                expect(gasSafetyDetail.labelAttachedRemovedLookup.find(l => l.value === "A").disabled).toBe(true);
                expect(gasSafetyDetail.labelAttachedRemovedLookup.find(l => l.value === "B").disabled).toBe(false);
                done();
            });
        });

        it("should not restrict the set of label-attached and CappedTurnedOff values values if conditionAsLeft is not IR or AD", done => {
            gasSafetyDetail.activateAsync().then(() => {
                gasSafetyDetail.conditionAsLeftSelectedChanged("XX");
                expect(gasSafetyDetail.cappedTurnedOffLookup.find(l => l.value === "A1").disabled).toBe(false);
                expect(gasSafetyDetail.cappedTurnedOffLookup.find(l => l.value === "B1").disabled).toBe(false);
                expect(gasSafetyDetail.labelAttachedRemovedLookup.find(l => l.value === "A").disabled).toBe(false);
                expect(gasSafetyDetail.labelAttachedRemovedLookup.find(l => l.value === "B").disabled).toBe(false);
                done();
            });
        });

        it("should not reset labelAttachedRemovedSelected if labelAttachedRemovedSelected is not set to B", done => {
            gasSafetyDetail.activateAsync().then(() => {
                gasSafetyDetail.labelAttachedRemovedSelected = "B";
                gasSafetyDetail.conditionAsLeftSelectedChanged("ID");
                expect(gasSafetyDetail.labelAttachedRemovedSelected).toBe("B");
                done();
            });
        });

        it("should reset labelAttachedRemovedSelected if labelAttachedRemovedSelected is set to A", done => {
            gasSafetyDetail.activateAsync().then(() => {
                gasSafetyDetail.labelAttachedRemovedSelected = "A";
                gasSafetyDetail.conditionAsLeftSelectedChanged("ID");
                expect(gasSafetyDetail.labelAttachedRemovedSelected).toBeUndefined();
                done();
            });
        });


        it("should not reset labelAttachedRemovedSelected if conditionAsLeft is not IR or AD", done => {
            gasSafetyDetail.activateAsync().then(() => {
                gasSafetyDetail.labelAttachedRemovedSelected = "A";
                gasSafetyDetail.conditionAsLeftSelectedChanged("XX");
                expect(gasSafetyDetail.labelAttachedRemovedSelected).toBe("A");
                done();
            });
        });

        it("should not reset cappedTurnedOffSelected if conditionAsLeftSelected is set to SS", done => {
            gasSafetyDetail.activateAsync().then(() => {
                var reasons: UnsafeReason[] = [new UnsafeReason("11", "2001", undefined)];
                gasSafetyDetail.reasons = reasons;
                gasSafetyDetail.cappedTurnedOffSelected = "B1";
                gasSafetyDetail.conditionAsLeftSelectedChanged("SS");
                expect(gasSafetyDetail.cappedTurnedOffSelected).toBe("B1");
                done();
            });
        });

        it("should reset cappedTurnedOffSelected if conditionAsLeftSelected is set to ID", done => {
            gasSafetyDetail.activateAsync().then(() => {
                var reasons: UnsafeReason[] = [new UnsafeReason("11", "2001", undefined)];
                gasSafetyDetail.reasons = reasons;
                gasSafetyDetail.cappedTurnedOffSelected = "A1";
                gasSafetyDetail.conditionAsLeftSelectedChanged("ID");
                expect(gasSafetyDetail.cappedTurnedOffSelected).toBe(undefined);
                done();
            });
        });

        it("should disable cappedTurnedOff options if conditionAsLeft selected is set to ID", done => {
            gasSafetyDetail.activateAsync().then(() => {
                var reasons: UnsafeReason[] = [new UnsafeReason("11", "2001", undefined)];
                gasSafetyDetail.reasons = reasons;
                gasSafetyDetail.cappedTurnedOffSelected = "A1";
                gasSafetyDetail.conditionAsLeftSelectedChanged("ID");
                expect(gasSafetyDetail.cappedTurnedOffLookup.find(btn => btn.value === "A1").disabled).toBe(true);
                done();
            });
        });

        it("should not disable cappedTurnedOff options if conditionAsLeft selected is set to neither SS nor XC", done => {
            gasSafetyDetail.activateAsync().then(() => {
                var reasons: UnsafeReason[] = [new UnsafeReason("11", "2001", undefined)];
                gasSafetyDetail.reasons = reasons;
                gasSafetyDetail.conditionAsLeftSelectedChanged("AR");
                expect(gasSafetyDetail.cappedTurnedOffLookup.find(btn => btn.value !== "X").disabled).toBe(false);
                done();
            });
        });

        it("showUnsafeWarningMsg should be true when conditionAsLeft = Immediately Dangerous", (done) => {
            gasSafetyDetail.activateAsync().then(() => {
                gasSafetyDetail.cappedTurnedOffSelected = "NT";
                gasSafetyDetail.conditionAsLeftSelected = "ID";
                gasSafetyDetail.conditionAsLeftSelectedChanged("ID");
                expect(gasSafetyDetail.showUnsafeWarningMsg).toEqual(true);
                done();
            });
        });


        it("showUnsafeWarningMsg should be false when conditionAsLeft = At Risk", (done) => {
            gasSafetyDetail.activateAsync().then(() => {
                gasSafetyDetail.cappedTurnedOffSelected = "NT";
                gasSafetyDetail.conditionAsLeftSelected = "AR";
                gasSafetyDetail.conditionAsLeftSelectedChanged("AR");
                expect(gasSafetyDetail.showUnsafeWarningMsg).toEqual(false);
                done();
            });
        });
    });

    describe("the cappedTurnedOffSelectedChanged method", () => {
        it("showUnsafeWarningMsg should be true when cappedTurnedOff = turnedOff", (done) => {
            gasSafetyDetail.activateAsync().then(() => {
                gasSafetyDetail.conditionAsLeftSelected = "ID";
                gasSafetyDetail.cappedTurnedOffSelected = "T";
                gasSafetyDetail.cappedTurnedOffSelectedChanged("T");
                expect(gasSafetyDetail.showUnsafeWarningMsg).toEqual(true);
                done();
            });
        });


        it("showUnsafeWarningMsg should be false when cappedTurnedOff =Capped", (done) => {
            gasSafetyDetail.activateAsync().then(() => {
                gasSafetyDetail.conditionAsLeftSelected = "ID";
                gasSafetyDetail.cappedTurnedOffSelected = "C";
                gasSafetyDetail.cappedTurnedOffSelectedChanged("C");
                expect(gasSafetyDetail.showUnsafeWarningMsg).toEqual(false);
                done();
            });
        });
    });

    describe("gasMeterInstallationSatisfactorySelectedChanged method", () => {
        it("should trigger unsafe situation", (done) => {
            propSafetyServiceStub.populateGasUnsafeReasons = sandbox.stub().withArgs(8, true, 8, "No", "No Meter", false).resolves(unSafeReasons);

            gasSafetyDetail.activateAsync().then(() => {
                gasSafetyDetail.gasInstallationTightnessTestDoneSelected = true;
                gasSafetyDetail.gasMeterInstallationSatisfactorySelected = "Yes";
                gasSafetyDetail.gasMeterInstallationSatisfactorySelectedChanged("No", undefined).then(() => {
                    expect(gasSafetyDetail.reasons.length).toBeGreaterThan(0);
                    done();
                });
            });
        });

        it("should not trigger unsafe situation", (done) => {
            propSafetyServiceStub.populateGasUnsafeReasons = sandbox.stub().withArgs(8, true, 8, "No", "No Meter", false).resolves(null);

            gasSafetyDetail.activateAsync().then(() => {
                gasSafetyDetail.gasInstallationTightnessTestDoneSelected = true;
                gasSafetyDetail.gasMeterInstallationSatisfactorySelected = "No";
                gasSafetyDetail.gasMeterInstallationSatisfactorySelectedChanged("Yes", undefined).then(() => {
                    expect(gasSafetyDetail.reasons).toBe(null);
                    done();
                });
            });
        });

        it("should hide NA from isSatisfactory question when tightness test done", (done) => {
            propSafetyServiceStub.populateGasUnsafeReasons = sandbox.stub().withArgs(8, true, 8, "No", "No Meter", false).resolves(null);

            let gassats: ISftyReasonCat[] = [];
            let gas: ISftyReasonCat = <ISftyReasonCat>{};
            gas.safetyReasonCategoryCode = "N/A";
            gas.safetyReasonCategoryReason = "N/A";
            gassats.push(gas);

            catalogServiceStub.getSafetyReasonCats = sandbox.stub()
                .withArgs(CatalogConstants.SAFETY_REASON_CAT_GROUP_GAS_INST_SAT).resolves(gassats);

            // tightness test done
            gasSafetyDetail.gasInstallationTightnessTestDoneSelected = true;

            // na button should be removed
            gasSafetyDetail.activateAsync().then(() => {
                gasSafetyDetail.gasInstallationTightnessTestDoneSelected = true;
                gasSafetyDetail.gasInstallationTightnessTestDoneSelectedChanged(true, undefined).then(() => {
                    expect(gasSafetyDetail.gasMeterInstallationSatisfactoryLookup.length).toBe(0);
                    done();
                });
            });
        });
    });

    describe("clearModel method", () => {

        it("should clear the model", (done) => {
            gasSafetyDetail.getLabel = sandbox.stub()
                .withArgs("objectName").returns("testname")
                .withArgs("confirmation").returns("confirmation");

            gasSafetyDetail.getParameterisedLabel = sandbox.stub().returns("clearQuestion");

            let result = {wasCancelled: true};
            gasSafetyDetail.showConfirmation = sandbox.stub().resolves(result);

            gasSafetyDetail.clear().then(() => {
                expect(gasSafetyDetail.iniEliReadingSelected).toBe(undefined);
                expect(gasSafetyDetail.gasInstallationTightnessTestDoneSelected).toBe(undefined);
                expect(gasSafetyDetail.gasMeterInstallationSatisfactorySelected).toBe(undefined);
                expect(gasSafetyDetail.noEliReadingsReasonSelected).toBe(undefined);
                expect(gasSafetyDetail.reasonWhyText).toBe(undefined);
                expect(gasSafetyDetail.pressureDrop).toBe(undefined);
                expect(gasSafetyDetail.reasons).toEqual(undefined);
                expect(gasSafetyDetail.safetyAdviceNoticeLeftSelected).toBe(undefined);
                done();
            })
        });

    });

    describe("saveModel method", () => {

        it("saves the ELI why not reason when no ELI readings were taken", (done) => {

            let saveGasSafetyDetails: Sinon.SinonStub = sandbox.stub().resolves(null);
            propSafetyServiceStub.saveGasSafetyDetails = saveGasSafetyDetails;

            gasSafetyDetail.activateAsync()
                .then(() => {
                    gasSafetyDetail.iniEliReadingSelected = CatalogConstants.SAFETY_READING_CAT_NO_READING_TAKEN;
                    gasSafetyDetail.noEliReadingsReasonSelected = "some reason";
                })
                .then(() => gasSafetyDetail.save())
                .then(() => {
                    let safetyDetail = saveGasSafetyDetails.args[0][1];
                    expect(safetyDetail.eliReadingReason).toBe("some reason");
                    done();
                });
        });

        it("doesn't save the ELI why not reason when ELI readings were taken", (done) => {

            let saveGasSafetyDetails: Sinon.SinonStub = sandbox.stub().resolves(null);
            propSafetyServiceStub.saveGasSafetyDetails = saveGasSafetyDetails;

            gasSafetyDetail.activateAsync()
                .then(() => {
                    gasSafetyDetail.iniEliReadingSelected = "some reading taken";
                    gasSafetyDetail.noEliReadingsReasonSelected = "some reason";
                })
                .then(() => gasSafetyDetail.save())
                .then(() => {
                    let safetyDetail = saveGasSafetyDetails.args[0][1];
                    expect(safetyDetail.eliReadingReason).toBe(undefined);
                    done();
                });
        });

    });
});
