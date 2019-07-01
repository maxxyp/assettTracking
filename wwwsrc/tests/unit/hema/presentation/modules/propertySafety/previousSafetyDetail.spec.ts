/// <reference path="../../../../../../typings/app.d.ts" />
import {PreviousSafetyDetail} from "../../../../../../app/hema/presentation/modules/propertySafety/previousSafetyDetail";
import {ICatalogService} from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import {IPropertySafetyService} from "../../../../../../app/hema/business/services/interfaces/IPropertySafetyService";
import {EventAggregator} from "aurelia-event-aggregator";
import {IJobService} from "../../../../../../app/hema/business/services/interfaces/IJobService";
import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import {BusinessException} from "../../../../../../app/hema/business/models/businessException";
import {PropertySafety} from "../../../../../../app/hema/business/models/propertySafety";
import {Job} from "../../../../../../app/hema/business/models/job";
import {PreviousPropertySafetyDetail} from "../../../../../../app/hema/business/models/previousPropertySafetyDetail";
import {DialogService} from "aurelia-dialog";
import {ISafetyAction} from "../../../../../../app/hema/business/models/reference/ISafetyAction";
import {ISafetyNoticeType} from "../../../../../../app/hema/business/models/reference/ISafetyNoticeType";
import {ISafetyNoticeStatus} from "../../../../../../app/hema/business/models/reference/ISafetyNoticeStatus";
import {CatalogConstants} from "../../../../../../app/hema/business/services/constants/catalogConstants";
import { ApplianceSafetyType } from "../../../../../../app/hema/business/models/applianceSafetyType";

describe("the PreviousSafetyDetail module", () => {
    let sandbox: Sinon.SinonSandbox;
    let previousSafetyDetail: PreviousSafetyDetail;
    let catalogServiceStub: ICatalogService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let jobServiceStub: IJobService;
    let propSafetyServiceStub: IPropertySafetyService;
    let labelServiceStub: ILabelService;
    let businessException: BusinessException;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        catalogServiceStub = <ICatalogService>{};
        eventAggregatorStub = <EventAggregator>{};
        jobServiceStub = <IJobService>{};
        propSafetyServiceStub = <IPropertySafetyService>{};
        labelServiceStub = <ILabelService>{};

        let capOrTurnedOff: ISafetyAction = <ISafetyAction>{};
        capOrTurnedOff.actionCode = "A1";
        capOrTurnedOff.safetyActionDescription = "Description A1";

        let conditionAsLeft: ISafetyNoticeType = <ISafetyNoticeType>{};
        conditionAsLeft.noticeType = "B1";
        conditionAsLeft.safetyNoticeTypeDescription = "Description B1";

        let safetyNoticeStatus: ISafetyNoticeStatus = <ISafetyNoticeStatus>{};
        safetyNoticeStatus.noticeStatus = "C1";
        safetyNoticeStatus.safetyNoticeStatusDescription = "Description C1";

        catalogServiceStub.getSafetyAction = sandbox.stub().resolves(capOrTurnedOff);

        catalogServiceStub.getSafetyNoticeType = sandbox.stub().resolves(conditionAsLeft);

        catalogServiceStub.getSafetyNoticeStatus = sandbox.stub().resolves(safetyNoticeStatus);

        catalogServiceStub.getSafetyReasonCats = sandbox.stub().withArgs(CatalogConstants.SAFETY_REASON_CAT_GROUP_UNSAFE_REASON).resolves([
            { safetyReasonCategoryCode: "UN1", safetyReasonCategoryReason: "Unsafe 1" },
            { safetyReasonCategoryCode: "UN2", safetyReasonCategoryReason: "Unsafe 2" },
            { safetyReasonCategoryCode: "UN3", safetyReasonCategoryReason: "Unsafe 3" }
        ]);

        let sat: PreviousPropertySafetyDetail = new PreviousPropertySafetyDetail();
        sat.lastVisitDate = new Date().toISOString();
        sat.safetyNoticeNotLeftReason = "SAFETY NOTICE NOT LEFT REASON";

        let propertySafety: PropertySafety = new PropertySafety();
        propertySafety.previousPropertySafetyDetail = sat;

        propSafetyServiceStub.getPropertySafetyDetails = sandbox.stub().resolves(propertySafety);
        propSafetyServiceStub.populateGasUnsafeReasons = sandbox.stub().returns(null);

        labelServiceStub.getGroup = sandbox.stub().resolves({ "yes": "Yes", "no": "No" });

        jobServiceStub.getJob = sandbox.stub().resolves(<Job>{});

        dialogServiceStub = <DialogService>{};

        previousSafetyDetail = new PreviousSafetyDetail(
            labelServiceStub, eventAggregatorStub, dialogServiceStub, propSafetyServiceStub, jobServiceStub,
            catalogServiceStub);

        previousSafetyDetail.labels = { "yes": "Yes", "no": "No" };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(previousSafetyDetail).toBeDefined();
    });

    describe("the activateAsync method", () => {
        beforeEach(() => {
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be be called", (done) => {
            let methodSpy: Sinon.SinonSpy = sandbox.spy(previousSafetyDetail, "activateAsync");

            previousSafetyDetail.activateAsync({ jobId: "123"})
                .then(() => {
                    expect(methodSpy.calledOnce).toBe(true);
                    done();
                })
                .catch((error) => {
                    fail("shouldnt be here " + error);
                    done();
                });
        });

        it("can handle service error", (done) => {
            jobServiceStub.getJob = sandbox.stub().rejects(businessException);

            let methodSpy: Sinon.SinonSpy = sandbox.spy(previousSafetyDetail, "showContent");

            previousSafetyDetail.activateAsync({ jobId: "123"})
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

            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{});

            let methodSpy: Sinon.SinonSpy = sandbox.spy(previousSafetyDetail, "showContent");

            previousSafetyDetail.activateAsync({ jobId: "123" }).then(() => {
                expect(methodSpy.calledOnce).toBe(true);
                done();
            });
        });

        it("hasData when job has 'previous property safety detail'", (done) => {

            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{
                propertySafety: {
                    previousPropertySafetyDetail: {}
                }
            });

            let methodSpy: Sinon.SinonSpy = sandbox.spy(previousSafetyDetail, "showContent");

            previousSafetyDetail.activateAsync({ jobId: "123" }).then(() => {
                expect(previousSafetyDetail.hasData).toBe(true);
                expect(methodSpy.calledOnce).toBe(true);
                done();
            });
        });

    });

    describe("attachedAsync", () => {

        beforeEach(() => {

        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can be be called (defensive empty 'propertySafetyDetail')", (done) => {
            let sat: PreviousPropertySafetyDetail = new PreviousPropertySafetyDetail();
            let propertySafety: PropertySafety = new PropertySafety();

            propertySafety.previousPropertySafetyDetail = sat;

            propSafetyServiceStub.getPropertySafetyDetails = sandbox.stub().resolves(propertySafety);

            previousSafetyDetail.activateAsync({ jobId: "123"})
                .then(() => previousSafetyDetail.attachedAsync())
                .then(() => {
                    done();
                })
                .catch((error) => {
                    fail("shouldnt be here " + error);
                    done();
                });
        });


        it("can handle catalog error", (done) => {
            catalogServiceStub.getSafetyReasonCats = sandbox.stub().rejects(businessException);

            previousSafetyDetail.activateAsync({ jobId: "123"})
                .then(() => previousSafetyDetail.attachedAsync())
                .then(() => {
                    fail("shouldnt be here");
                    done();
                })
                .catch((error) => {

                    done();
                });
        });

        it("can render gas 'lastVisitDate'", (done) => {
            let sat: PreviousPropertySafetyDetail = new PreviousPropertySafetyDetail();
            sat.lastVisitDate = "2000-01-01 00:00:00";

            let propertySafety: PropertySafety = new PropertySafety();
            propertySafety.previousPropertySafetyDetail = sat;

            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{
                tasks: [
                    {applianceId: "1"},
                ],
                history: {
                    appliances:[
                        {id: "1", applianceSafetyType: ApplianceSafetyType.gas}
                    ]
                }
            });
            propSafetyServiceStub.getPropertySafetyDetails = sandbox.stub().resolves(propertySafety);

            previousSafetyDetail.activateAsync({ jobId: "123"})
                .then(() => previousSafetyDetail.attachedAsync())
                .then(() => {
                    expect(previousSafetyDetail.lastVisitDate).toEqual(sat.lastVisitDate);
                    done();
                })
                .catch((error) => {
                    fail("shouldnt be here " + error);
                    done();
                });
        });

        it("can render electric 'lastVisitDate'", (done) => {
            let sat: PreviousPropertySafetyDetail = new PreviousPropertySafetyDetail();
            sat.lastVisitDate = "2000-12-01 00:00:00";

            let propertySafety: PropertySafety = new PropertySafety();
            propertySafety.previousPropertySafetyDetail = sat;

            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{
                tasks: [
                    {applianceId: "1"},
                ],
                history: {
                    appliances:[
                        {id: "1", applianceSafetyType: ApplianceSafetyType.electrical}
                    ]
                }
            });
            propSafetyServiceStub.getPropertySafetyDetails = sandbox.stub().resolves(propertySafety);

            previousSafetyDetail.activateAsync({ jobId: "123"})
                .then(() => previousSafetyDetail.attachedAsync())
                .then(() => {
                    expect(previousSafetyDetail.lastVisitDate).toEqual(sat.lastVisitDate);
                    done();
                })
                .catch((error) => {
                    fail("shouldnt be here " + error);
                    done();
                });
        });

        it("ensure 'safetyNoticeNotLeftReason' is rendered when a gas job", (done) => {
            let sat: PreviousPropertySafetyDetail = new PreviousPropertySafetyDetail();
            sat.lastVisitDate = "2000-12-01 00:00:00";
            sat.safetyNoticeNotLeftReason = "Some notice not left reason.";

            let propertySafety: PropertySafety = new PropertySafety();
            propertySafety.previousPropertySafetyDetail = sat;

            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{
                tasks: [
                    {applianceId: "1"},
                ],
                history: {
                    appliances:[
                        {id: "1", applianceSafetyType: ApplianceSafetyType.gas}
                    ]
                }
            });
            propSafetyServiceStub.getPropertySafetyDetails = sandbox.stub().resolves(propertySafety);

            previousSafetyDetail.activateAsync({ jobId: "123"})
                .then(() => previousSafetyDetail.attachedAsync())
                .then(() => {
                    expect(previousSafetyDetail.safetyNoticeNotLeftReason).toEqual(sat.safetyNoticeNotLeftReason);
                    done();
                })
                .catch((error) => {
                    fail("shouldnt be here " + error);
                    done();
                });
        });

        it("render mapped properties", (done) => {

            let prevSafe: PreviousPropertySafetyDetail = new PreviousPropertySafetyDetail();
            prevSafe.safetyNoticeNotLeftReason = "SAFETY_NOTICE";
            prevSafe.report = "REPORT";
            prevSafe.ownedByCustomer = true;
            prevSafe.letterLeft = true;
            prevSafe.signatureObtained = true;

            let propertySafety: PropertySafety = new PropertySafety();
            propertySafety.previousPropertySafetyDetail = prevSafe;

            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{
                tasks: [
                    {applianceId: "1"},
                ],
                history: {
                    appliances:[
                        {id: "1", applianceSafetyType: ApplianceSafetyType.gas}
                    ]
                }
            });
            propSafetyServiceStub.getPropertySafetyDetails = sandbox.stub().resolves(propertySafety);

            previousSafetyDetail.activateAsync({ jobId: "123"})
                .then(() => previousSafetyDetail.attachedAsync())
                .then(() => {
                    expect(previousSafetyDetail.safetyNoticeNotLeftReason).toEqual("SAFETY_NOTICE");
                    expect(previousSafetyDetail.report).toEqual("REPORT");
                    expect(previousSafetyDetail.ownedByCustomer).toEqual("Yes");
                    expect(previousSafetyDetail.letterLeft).toEqual("Yes");
                    expect(previousSafetyDetail.signatureObtained).toEqual("Yes");
                    done();
                })
                .catch((error) => {
                    fail("shouldnt be here " + error);
                    done();
                });
        });

        it("render unsafe situation from catalog lookups", (done) => {
            let previousSafety: PreviousPropertySafetyDetail = new PreviousPropertySafetyDetail();
            previousSafety.reasons = [
                "UN1",
                "UN3",
                "UN2"
            ];

            let propertySafety: PropertySafety = new PropertySafety();
            propertySafety.previousPropertySafetyDetail = previousSafety;

            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{
                tasks: [
                    {applianceId: "1"},
                ],
                history: {
                    appliances:[
                        {id: "1", applianceSafetyType: ApplianceSafetyType.gas}
                    ]
                }
            });
            propSafetyServiceStub.getPropertySafetyDetails = sandbox.stub().resolves(propertySafety);

            previousSafetyDetail.activateAsync({ jobId: "123"})
                .then(() => previousSafetyDetail.attachedAsync())
                .then(() => {
                    expect(previousSafetyDetail.unsafeSituation).toEqual("Unsafe 1,Unsafe 3,Unsafe 2");
                    done();
                })
                .catch((error) => {
                    fail("shouldnt be here " + error);
                    done();
                });
        });

        it("render unsafe situation from reasons with catalog references only", (done) => {
            let previousSafety: PreviousPropertySafetyDetail = new PreviousPropertySafetyDetail();
            previousSafety.reasons = [
                "UN1",
                "MIS1", // not not in catalog
                "UN2",
                "UN3"
            ];

            let propertySafety: PropertySafety = new PropertySafety();
            propertySafety.previousPropertySafetyDetail = previousSafety;

            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{
                tasks: [
                    {applianceId: "1"},
                ],
                history: {
                    appliances:[
                        {id: "1", applianceSafetyType: ApplianceSafetyType.gas}
                    ]
                }
            });
            propSafetyServiceStub.getPropertySafetyDetails = sandbox.stub().resolves(propertySafety);

            previousSafetyDetail.activateAsync({ jobId: "123"})
                .then(() => previousSafetyDetail.attachedAsync())
                .then(() => {
                    expect(previousSafetyDetail.unsafeSituation).toEqual("Unsafe 1,Unsafe 2,Unsafe 3");
                    done();
                })
                .catch((error) => {
                    fail("shouldnt be here " + error);
                    done();
                });
        });

        it("render conditionAsLeft from catalog reference", (done) => {
            let previousSafety: PreviousPropertySafetyDetail = new PreviousPropertySafetyDetail();
            previousSafety.conditionAsLeft = "B1";

            let propertySafety: PropertySafety = new PropertySafety();
            propertySafety.previousPropertySafetyDetail = previousSafety;

            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{
                tasks: [
                    {applianceId: "1"},
                ],
                history: {
                    appliances:[
                        {id: "1", applianceSafetyType: ApplianceSafetyType.gas}
                    ]
                }
            });
            propSafetyServiceStub.getPropertySafetyDetails = sandbox.stub().resolves(propertySafety);

            previousSafetyDetail.activateAsync({ jobId: "123"})
                .then(() => previousSafetyDetail.attachedAsync())
                .then(() => {
                    expect(previousSafetyDetail.conditionAsLeft).toEqual("Description B1");
                    done();
                })
                .catch((error) => {
                    fail("shouldnt be here " + error);
                    done();
                });
        });

        it("render undefined when conditionAsLeft is not in catalog", (done) => {
            let previousSafety: PreviousPropertySafetyDetail = new PreviousPropertySafetyDetail();
            previousSafety.conditionAsLeft = "Z1";

            let propertySafety: PropertySafety = new PropertySafety();
            propertySafety.previousPropertySafetyDetail = previousSafety;

            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{
                tasks: [
                    {applianceId: "1"},
                ],
                history: {
                    appliances:[
                        {id: "1", applianceSafetyType: ApplianceSafetyType.gas}
                    ]
                }
            });

            catalogServiceStub.getSafetyNoticeType = sandbox.stub().resolves(null);

            previousSafetyDetail.activateAsync({ jobId: "123"})
                .then(() => previousSafetyDetail.attachedAsync())
                .then(() => {
                    expect(previousSafetyDetail.conditionAsLeft).toBeUndefined();
                    done();
                })
                .catch((error) => {
                    fail("shouldnt be here " + error);
                    done();
                });
        });

        it("render cappedTurnedOff from catalog reference", (done) => {
            let safetyDetail: PreviousPropertySafetyDetail = new PreviousPropertySafetyDetail();
            safetyDetail.cappedOrTurnedOff = "A1";

            let propertySafety: PropertySafety = new PropertySafety();
            propertySafety.previousPropertySafetyDetail = safetyDetail;

            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{
                tasks: [
                    {applianceId: "1"},
                ],
                history: {
                    appliances:[
                        {id: "1", applianceSafetyType: ApplianceSafetyType.gas}
                    ]
                }
            });
            propSafetyServiceStub.getPropertySafetyDetails = sandbox.stub().resolves(propertySafety);

            previousSafetyDetail.activateAsync({ jobId: "123"})
                .then(() => previousSafetyDetail.attachedAsync())
                .then(() => {
                    expect(previousSafetyDetail.cappedTurnedOff).toEqual("Description A1");
                    done();
                })
                .catch((error) => {
                    fail("shouldnt be here " + error);
                    done();
                });
        });

        it("render undefined when cappedOrTurnedOff is not in catalog", (done) => {
            let safetyDetail: PreviousPropertySafetyDetail = new PreviousPropertySafetyDetail();
            safetyDetail.cappedOrTurnedOff = "Z1";

            let propertySafety: PropertySafety = new PropertySafety();
            propertySafety.previousPropertySafetyDetail = safetyDetail;

            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{
                tasks: [
                    {applianceId: "1"},
                ],
                history: {
                    appliances:[
                        {id: "1", applianceSafetyType: ApplianceSafetyType.gas}
                    ]
                }
            });
            propSafetyServiceStub.getPropertySafetyDetails = sandbox.stub().resolves(propertySafety);

            catalogServiceStub.getSafetyAction = sandbox.stub().resolves(null);

            previousSafetyDetail.activateAsync({ jobId: "123"})
                .then(() => previousSafetyDetail.attachedAsync())
                .then(() => {
                    expect(previousSafetyDetail.cappedTurnedOff).toBeUndefined();
                    done();
                })
                .catch((error) => {
                    fail("shouldnt be here " + error);
                    done();
                });
        });

         it("render labelAttached from catalog reference", (done) => {
            let safetyDetail: PreviousPropertySafetyDetail = new PreviousPropertySafetyDetail();
            safetyDetail.labelAttachedOrRemoved = "C1";

            let propertySafety: PropertySafety = new PropertySafety();
            propertySafety.previousPropertySafetyDetail = safetyDetail;

            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{
                tasks: [
                    {applianceId: "1"},
                ],
                history: {
                    appliances:[
                        {id: "1", applianceSafetyType: ApplianceSafetyType.gas}
                    ]
                }
            });
            propSafetyServiceStub.getPropertySafetyDetails = sandbox.stub().resolves(propertySafety);

            previousSafetyDetail.activateAsync({ jobId: "123"})
                .then(() => previousSafetyDetail.attachedAsync())
                .then(() => {
                    expect(previousSafetyDetail.labelAttached).toEqual("Description C1");
                    done();
                })
                .catch((error) => {
                    fail("shouldnt be here " + error);
                    done();
                });
        });

        it("render undefined when labelAttached is not in catalog", (done) => {
            let safetyDetail: PreviousPropertySafetyDetail = new PreviousPropertySafetyDetail();
            safetyDetail.labelAttachedOrRemoved = "Z1";

            let propertySafety: PropertySafety = new PropertySafety();
            propertySafety.previousPropertySafetyDetail = safetyDetail;

            jobServiceStub.getJob = sandbox.stub().resolves(<Job>{
                tasks: [
                    {applianceId: "1"},
                ],
                history: {
                    appliances:[
                        {id: "1", applianceSafetyType: ApplianceSafetyType.gas}
                    ]
                }
            });
            propSafetyServiceStub.getPropertySafetyDetails = sandbox.stub().resolves(propertySafety);

            catalogServiceStub.getSafetyNoticeStatus = sandbox.stub().resolves(null);

            previousSafetyDetail.activateAsync({ jobId: "123"})
                .then(() => previousSafetyDetail.attachedAsync())
                .then(() => {
                    expect(previousSafetyDetail.labelAttached).toBeUndefined();
                    done();
                })
                .catch((error) => {
                    fail("shouldnt be here " + error);
                    done();
                });
        });
    });
});
