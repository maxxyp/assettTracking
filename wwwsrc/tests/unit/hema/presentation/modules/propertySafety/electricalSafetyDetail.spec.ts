/// <reference path="../../../../../../typings/app.d.ts" />

import {ElectricalSafetyDetail} from "../../../../../../app/hema/presentation/modules/propertySafety/electricalSafetyDetail";
import {ICatalogService} from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import {IPropertySafetyService} from "../../../../../../app/hema/business/services/interfaces/IPropertySafetyService";
import {PropertyElectricalSafetyDetail} from "../../../../../../app/hema/business/models/propertyElectricalSafetyDetail";
import {PropertyUnsafeDetail as ElectricalUnsafeDetailBusinessModel} from "../../../../../../app/hema/business/models/propertyUnsafeDetail";
import {EventAggregator} from "aurelia-event-aggregator";
import {IJobService} from "../../../../../../app/hema/business/services/interfaces/IJobService";
import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {IValidationService} from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import {IBusinessRuleService} from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {PropertySafety} from "../../../../../../app/hema/business/models/propertySafety";
import {IEngineerService} from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { DialogService, DialogResult } from "aurelia-dialog";
import {CatalogConstants} from "../../../../../../app/hema/business/services/constants/catalogConstants";
import {Job} from "../../../../../../app/hema/business/models/job";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { Task } from "../../../../../../app/hema/business/models/task";
import { IElectricalSystemType } from "../../../../../../app/hema/business/models/reference/IElectricalSystemType";
import { ISafetyNoticeType } from "../../../../../../app/hema/business/models/reference/ISafetyNoticeType";
import { ISafetyNoticeStatus } from "../../../../../../app/hema/business/models/reference/ISafetyNoticeStatus";
import { ISftyReasonCat } from "../../../../../../app/hema/business/models/reference/ISftyReasonCat";
import { ISafetyAction } from "../../../../../../app/hema/business/models/reference/ISafetyAction";

describe("the ElectricalSafetyDetail module", () => {
    let electricalSafetyDetail: ElectricalSafetyDetail;
    let sandbox: Sinon.SinonSandbox;
    let catalogServiceStub: ICatalogService;

    let propertySafetyServiceStub: IPropertySafetyService;
    let eaStub: EventAggregator;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let labelServiceStub: ILabelService;
    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let dialogServiceStub: DialogService;
    let populateElectricalUnsafeReasonsStub: Sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        catalogServiceStub = <ICatalogService>{};

        validationServiceStub = <IValidationService>{};
        validationServiceStub.build = sandbox.stub().resolves([]);

        let propertySafety: PropertySafety = new PropertySafety();

        let safetyDetail = <PropertyElectricalSafetyDetail>{};
        safetyDetail.eliReading = 0;
        safetyDetail.eliReadingReason = "1";
        safetyDetail.noEliReadings = true;
        safetyDetail.systemType = "2";
        safetyDetail.rcdPresent = "Y";
        safetyDetail.consumerUnitSatisfactory = true;
        safetyDetail.eliSafeAccordingToTops = true;

        let unsafe: ElectricalUnsafeDetailBusinessModel = new ElectricalUnsafeDetailBusinessModel();
        unsafe.report = "report";
        unsafe.conditionAsLeft = "conditionAsLeft";
        unsafe.cappedTurnedOff = "cappedTurnedOff";
        unsafe.labelAttachedRemoved = "labelAttachedRemoved";
        unsafe.ownedByCustomer = true;
        unsafe.letterLeft = true;
        unsafe.signatureObtained = true;

        propertySafety.propertyElectricalSafetyDetail = safetyDetail;
        propertySafety.propertyUnsafeDetail = unsafe;

        propertySafetyServiceStub = <IPropertySafetyService>{};
        propertySafetyServiceStub.getPropertySafetyDetails = sandbox.stub()
            .resolves(propertySafety);

        populateElectricalUnsafeReasonsStub = propertySafetyServiceStub.populateElectricalUnsafeReasons = sandbox.stub().resolves([]);

        eaStub = <EventAggregator>{};
        eaStub.subscribe = sandbox.stub();

        jobServiceStub = <IJobService>{};
        jobServiceStub.isJobEditable = sandbox.stub().resolves(true);

        jobServiceStub = <IJobService>{};
        let job = new Job();
        let task = new Task(true, false);
        task.status = "NA";
        job.tasks = [task];
        job.isLandlordJob = true;
        jobServiceStub.getJob = sandbox.stub().resolves(job);

        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);

        labelServiceStub = <ILabelService>{};
        businessRuleServiceStub = <IBusinessRuleService>{};
        let businessRules: { [key: string]: any } = {
            "ttSystemType": "XX",
            "safeInTopsThreshold": 1,
            "rcdPresentThreshold": 200,
            "unableToCheckSystemType": "U",
            "iniEliReadingDecimalPlaces": 2,
            "availableConditionAsLeftCodes": "A1,A2",
            "availableLabelAttachedCodes": "A"
        };
        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(businessRules);

        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};

        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("notDoingJobStatuses").returns("NA");
        getBusinessRuleStub.withArgs("rcdPresentThreshold").returns(200);

        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);

        catalogServiceStub.getSafetyReasonCats = sandbox.stub()
            .withArgs(CatalogConstants.SAFETY_REASON_CAT_GROUP_ELI_READ_WHY_NOT).resolves([<ISftyReasonCat>{
                safetyReasonCategoryCode: "0",
                safetyReasonCategoryReason: "x"
            }]);

        catalogServiceStub.getElectricalSystemTypes = sandbox.stub().resolves([<IElectricalSystemType>{
            id: "0",
            description: "x"
        }]);

        catalogServiceStub.getSafetyNoticeTypes = sandbox.stub().resolves(<ISafetyNoticeType[]>[
            {
                noticeType: "A1",
                safetyNoticeTypeDescription: "Description A1"
            },
            {
                noticeType: "A2",
                safetyNoticeTypeDescription: "Description A2"
            },
            {
                noticeType: "A3",
                safetyNoticeTypeDescription: "Description A3"
            }]);

        catalogServiceStub.getSafetyActions = sandbox.stub().resolves([<ISafetyAction>{
            actionCode: "B1",
            safetyActionDescription: "Description B1"
        }]);

        catalogServiceStub.getSafetyNoticeStatuses = sandbox.stub().resolves(<ISafetyNoticeStatus[]>[
            {
                noticeStatus: "A",
                safetyNoticeStatusDescription: "ATTACHED"
            },
            {
                noticeStatus: "R",
                safetyNoticeStatusDescription: "REMOVED"
            }]);

        validationServiceStub.build = sandbox.stub().resolves(null);
        labelServiceStub.getGroup = sandbox.stub().resolves({ "yes": "Yes", "no": "No" });

        dialogServiceStub = <DialogService>{};
        dialogServiceStub.open = sandbox.stub().resolves(<DialogResult>{wasCancelled: false});

        electricalSafetyDetail = new ElectricalSafetyDetail(
            jobServiceStub,
            engineerServiceStub,
            labelServiceStub,
            eaStub,
            dialogServiceStub,
            validationServiceStub,
            businessRuleServiceStub,
            catalogServiceStub,
            propertySafetyServiceStub
        );
        electricalSafetyDetail.labels = {
            "yes": "Yes",
            "no": "No",
            "objectName": "foo",
            "confirmation": "foo",
            "clearQuestion": "foo"
        };
        electricalSafetyDetail.reasons = [];
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(electricalSafetyDetail).toBeDefined();
    });

    describe("activateAsync", () => {

        it("can call activateAsync and show content", done => {
            let showContentSpy = sandbox.spy(electricalSafetyDetail, "showContent");

            electricalSafetyDetail.activateAsync()
                .then(() => {
                    expect(showContentSpy.called).toBe(true);
                    expect(electricalSafetyDetail.canEdit).toBe(false);
                    done();
                });

        });

        it("can call activateAsync and populate", done => {
            electricalSafetyDetail.activateAsync()
                .then(() => {
                    expect(electricalSafetyDetail.iniEliReading).toBe(0);
                    expect(electricalSafetyDetail.noEliReadings).toBe(true);
                    expect(electricalSafetyDetail.systemType).toBe("2");
                    expect(electricalSafetyDetail.rcdPresent).toBe("Y");
                    expect(electricalSafetyDetail.consumerUnitSatisfactory).toBe(true);
                    expect(electricalSafetyDetail.eliSafeAccordingToTops).toBe(true);
                    done();
                });
        });

        it("can call activateAsync and set lookups", done => {
            electricalSafetyDetail.activateAsync()
                .then(() => {
                    expect(electricalSafetyDetail.systemTypeLookup.length).toBeGreaterThan(0);
                    expect(electricalSafetyDetail.rcdPresentLookup.length).toBeGreaterThan(0);
                    expect(electricalSafetyDetail.consumerUnitSatisfactoryLookup.length).toBeGreaterThan(0);
                    expect(electricalSafetyDetail.eliSafeAccordingToTopsLookup.length).toBeGreaterThan(0);

                    expect(electricalSafetyDetail.conditionAsLeftLookup.map(condition => condition.value)).toEqual(["A1", "A2"]);
                    expect(electricalSafetyDetail.labelAttachedRemovedLookup.map(condition => condition.value)).toEqual(["A"]);
                    done();
                });
        });

        it("can call activateAsync and show error when catalog throws", done => {
            let showContentSpy = sandbox.spy(electricalSafetyDetail, "showContent");

            catalogServiceStub.getElectricalSystemTypes = sandbox.stub().rejects(null);

            electricalSafetyDetail.activateAsync()
                .catch(() => {
                    expect(showContentSpy.called).toBe(false);
                    done();
                });
        });
    });

    it("can pass the current noEliReadings value to populateElectricalUnsafeReasons when clearing the form", done => {
        electricalSafetyDetail.activateAsync().then(() => {
            electricalSafetyDetail.noEliReadings = true;
            populateElectricalUnsafeReasonsStub.reset();

            electricalSafetyDetail.clear().then(() => {
                // .DF_1582 noEliReadings must be cleared before iniEliReading due to the change handler on iniEliReadings
                //  firing off populateElectricalUnsafeReasons(). If we don't do this, when populateElectricalUnsafeReasons() gets fired
                //  it will use the old version of noEliReadings and register a false positive unsafe reason.
                let isTrueEverPassed = populateElectricalUnsafeReasonsStub.args.some(call => (<PropertyElectricalSafetyDetail>call[0]).noEliReadings === true);
                expect(isTrueEverPassed).toBe(false);
                done();
            });
        })
    });

    // see DF_1858, when the user clears the eli readings by clicking the "x" in the text box (only on CF19) or highlighting text
    // and keying the backspace button it has the affects of setting the iniEliReading to undefined, also we if set to 0 does not
    // set the showEliReadings

    describe("showEliReading set on falsey eliReading value", () => {

        beforeEach(() => {

        });

        it("sets showEliReadings to false if eliReadings is 0", done => {

            electricalSafetyDetail.activateAsync().then(() => {

                electricalSafetyDetail.noEliReadings = false;
                electricalSafetyDetail.showEliSafeAccordingToTops = true;
                electricalSafetyDetail.iniEliReading = 0;
                electricalSafetyDetail.iniEliReadingChanged();

                expect(electricalSafetyDetail.showEliSafeAccordingToTops).toBe(false);

                done();
            });
        });

        it("sets showEliReadings to false if eliReadings is undefined", done => {

            electricalSafetyDetail.activateAsync().then(() => {

                electricalSafetyDetail.noEliReadings = false;
                electricalSafetyDetail.showEliSafeAccordingToTops = true;
                electricalSafetyDetail.iniEliReading = undefined;
                electricalSafetyDetail.iniEliReadingChanged();

                expect(electricalSafetyDetail.showEliSafeAccordingToTops).toBe(false);

                done();
            });
        });
    });

});
