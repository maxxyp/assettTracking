/// <reference path="../../../../../typings/app.d.ts" />

import { JobFactory } from "../../../../../app/hema/business/factories/jobFactory";
import { IBusinessRuleService } from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../../../app/hema/business/services/interfaces/ICatalogService";
import { QueryableBusinessRuleGroup } from "../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { IJobHistory } from "../../../../../app/hema/api/models/fft/jobs/history/IJobHistory";
import { IJob } from "../../../../../app/hema/api/models/fft/jobs/IJob";
import { ITask } from "../../../../../app/hema/api/models/fft/jobs/ITask";
import { IAppliance } from "../../../../../app/hema/api/models/fft/jobs/history/IAppliance";
import { TaskFactory } from "../../../../../app/hema/business/factories/taskFactory";
import { IPremises } from "../../../../../app/hema/api/models/fft/jobs/IPremises";
import { IContact } from "../../../../../app/hema/api/models/fft/jobs/IContact";
import { IRisk } from "../../../../../app/hema/api/models/fft/jobs/IRisk";
import { IVisit } from "../../../../../app/hema/api/models/fft/jobs/IVisit";
import { DataState } from "../../../../../app/hema/business/models/dataState";
import { ApplianceFactory } from "../../../../../app/hema/business/factories/applianceFactory";
import { ApplianceSafetyFactory } from "../../../../../app/hema/business/factories/applianceSafetyFactory";
import { PropertySafetyFactory } from "../../../../../app/hema/business/factories/propertySafetyFactory";
import { VisitFactory } from "../../../../../app/hema/business/factories/visitFactory";
import { ContactFactory } from "../../../../../app/hema/business/factories/contactFactory";
import { PremisesFactory } from "../../../../../app/hema/business/factories/premisesFactory";
import { RiskFactory } from "../../../../../app/hema/business/factories/riskFactory";
import { AddressFactory } from "../../../../../app/hema/business/factories/addressFactory";
import { IComplaintFactory } from "../../../../../app/hema/business/factories/interfaces/IComplaintFactory";
import { Job as JobBusinessModel, Job } from "../../../../../app/hema/business/models/job";
import { Engineer } from "../../../../../app/hema/business/models/engineer";
import { Task } from "../../../../../app/hema/business/models/task";
import { JobState } from "../../../../../app/hema/business/models/jobState";
import { DateHelper } from "../../../../../app/hema/core/dateHelper";
import { Risk } from "../../../../../app/hema/business/models/risk";
import { PropertySafety } from "../../../../../app/hema/business/models/propertySafety";
import { History } from "../../../../../app/hema/business/models/history";
import { ObjectHelper } from "../../../../../app/common/core/objectHelper";
import { HemaStorage } from "../../../../../app/hema/core/services/hemaStorage";
import { IPartFactory } from "../../../../../app/hema/business/factories/interfaces/IPartFactory";
import { ReadingFactory } from "../../../../../app/hema/business/factories/readingFactory";
import { IChargeFactory } from "../../../../../app/hema/business/factories/interfaces/IChargeFactory";
import { IBusinessRule } from "../../../../../app/hema/business/models/reference/IBusinessRule";
import { IAddressFactory } from "../../../../../app/hema/business/factories/interfaces/IAddressFactory";
import { ICustomerFactory } from "../../../../../app/hema/business/factories/interfaces/ICustomerFactory";
import { ChargeFactory } from "../../../../../app/hema/business/factories/chargeFactory";
import { LandlordFactory } from "../../../../../app/hema/business/factories/landlordFactory";
import { IStorageService } from "../../../../../app/hema/business/services/interfaces/IStorageService";
import { IObjectType } from "../../../../../app/hema/business/models/reference/IObjectType";
import { Visit } from "../../../../../app/hema/business/models/visit";
import { Charge } from "../../../../../app/hema/business/models/charge/charge";
import { IChargeType } from "../../../../../app/hema/business/models/reference/IChargeType";
import { JobNotDoingReason } from "../../../../../app/hema/business/models/jobNotDoingReason";
import { IWorkListItem } from "../../../../../app/hema/api/models/fft/engineers/worklist/IWorkListItem";
import { IDataStateManager } from "../../../../../app/hema/common/IDataStateManager";
import { ApplianceSafetyType } from "../../../../../app/hema/business/models/applianceSafetyType";
import { JobSanityCheckService } from "../../../../../app/hema/business/services/jobSanityCheckService";
import { PropertySafetyType } from "../../../../../app/hema/business/models/propertySafetyType";
import { IPartCollectionResponse } from "../../../../../app/hema/api/models/fft/jobs/parts/IPartCollectionResponse";
import { ISafetyAction } from "../../../../../app/hema/business/models/reference/ISafetyAction";

function assertDateTimeFormat(originalDate: Date, jsonDate: string): boolean {
    let isISO8601 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?(Z|[\+-]\d{2}(?::\d{2})?)$/;
    if (!isISO8601.test(jsonDate)) {
        return false;
    }

    let toDate = DateHelper.fromJsonDateTimeString(jsonDate);
    let toDateLessMs = Math.floor(toDate.getTime() / 1000);
    return Math.floor(originalDate.getTime() / 1000) === toDateLessMs;
}

describe("the JobFactory module", () => {
    let jobFactory: JobFactory;
    let sandbox: Sinon.SinonSandbox;
    let businessRuleServiceStub: IBusinessRuleService;
    let catalogServiceStub: ICatalogService;
    let businessRules: QueryableBusinessRuleGroup;
    let partFactoryStub: IPartFactory;
    let chargeFactoryStub: IChargeFactory;

    let addressFactoryStub: IAddressFactory;
    let customerFactoryStub: ICustomerFactory;
    let storageServiceStub: IStorageService;
    let complaintFactoryStub: IComplaintFactory;
    let dataStateManagerStub: IDataStateManager;
    let sanityChecker: JobSanityCheckService;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        businessRuleServiceStub = <IBusinessRuleService>{};
        catalogServiceStub = <ICatalogService>{};
        partFactoryStub = <IPartFactory>{};
        chargeFactoryStub = <IChargeFactory>{};
        addressFactoryStub = <IAddressFactory>{};
        customerFactoryStub = <ICustomerFactory>{};
        complaintFactoryStub = <IComplaintFactory>{};

        partFactoryStub.createPartBusinessModelFromAdaptApiModel = sandbox.stub();
        partFactoryStub.createPartsChargedApiModelsFromBusinessModels = sandbox.stub().resolves([]);
        partFactoryStub.createPartsClaimedUnderWarrantyApiModelsFromBusinessModels = sandbox.stub().resolves([]);
        partFactoryStub.createPartsNotUsedApiModelsFromBusinessModels = sandbox.stub().resolves([]);
        partFactoryStub.createPartsUsedApiModelsFromBusinessModels = sandbox.stub().resolves([]);

        chargeFactoryStub.createChargeApiModel = sandbox.stub().resolves([]);

        complaintFactoryStub.createComplaintApiModel = sandbox.stub().returns(undefined);

        businessRules = new QueryableBusinessRuleGroup();
        businessRules.rules = <IBusinessRule[]>[
            { id: "applianceTypeHazard", rule: "HAZ" },
            { id: "applianceTypeGas", rule: "G" },
            { id: "applianceTypeElectric", rule: "E" },
            { id: "applianceTypeOther", rule: "O" },
            { id: "createMarker", rule: "C" },
            { id: "updateMarker", rule: "U" },
            { id: "deleteMarker", rule: "D" },
            { id: "statusEnRoute", rule: "enroute" },
            { id: "sourceSystemWMIS", rule: "WMIS" },
            { id: "noChargePrefix", rule: "NC" },
            { id: "instPremApplianceType", rule: "INS" },
            { id: "centralHeatingApplianceHardwareCategory", rule: "X" },
            { id: "safetyDeviceNoValue", rule: 1 },
            { id: "safetyDeviceYesValue", rule: 0 },
            { id: "hardWareCatForCHAppliance", rule: "X" },
            { id: "instPremApplianceType", rule: "INS" },
            { id: "applianceSafetyNotRequiredIndicator", rule: "Y" },
            { id: "electricalWorkingSector", rule: "PatchES" },
            { id: "applianceCategoryOther", rule: "O" },
            { id: "applianceCategoryGas", rule: "G" },
            { id: "applianceCategoryElectrical", rule: "E" },
            { id: "applianceTypesToUseEngineerPatchInsteadToCalculateSafetyType", rule: "DFC,CGE" },
            { id: "NotVisitedOtherActivityStatus", rule: "VO" },
            { id: "statusNoVisit", rule: "50" },
            { id: "statusNoAccess", rule: "51" },
            { id: "electricalWorkingSector", rule: "PatchES" },
            { id: "annualServiceJobType", rule: "AS" }
        ];
        businessRules.getBusinessRuleList = sandbox.stub().returns(["D"]);

        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(businessRules);
        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves(undefined);
        catalogServiceStub.getObjectType = sandbox.stub().resolves({ applianceCategory: "G" });
        catalogServiceStub.getReadTypeMappings = sandbox.stub().resolves([]);
        catalogServiceStub.getReadingTypes = sandbox.stub().resolves([]);
        catalogServiceStub.getActivityComponentVisitStatuses = sandbox.stub().resolves([]);
        catalogServiceStub.getApplianceElectricalType = sandbox.stub().resolves(null);
        catalogServiceStub.getSafetyActions = sandbox.stub().resolves([<ISafetyAction> {safetyActionCategory: "A", actionCode: "C", safetyActionDescription: "CAPPED"}])
        let ct = <IChargeType>{};
        ct.vatCode = "D";

        catalogServiceStub.getChargeType = sandbox.stub().resolves(ct);
        catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
            applianceType: "Gas"
        }]);
        addressFactoryStub.createAddressBusinessModel = sandbox.stub();
        customerFactoryStub.createCustomerContactBusinessModel = sandbox.stub();

        storageServiceStub = <IStorageService>{};
        storageServiceStub.getWorkingSector = sandbox.stub().resolves("PatchGS");

        dataStateManagerStub = <IDataStateManager>{
            updateApplianceDataState: sandbox.stub().resolves(null),
            updateAppliancesDataState: sandbox.stub().resolves(null),
            updatePropertySafetyDataState: sandbox.stub()
        };

        sanityChecker = <JobSanityCheckService>{};
        sanityChecker.isBadlyFormed = sandbox.stub();

        jobFactory = new JobFactory(new RiskFactory(),
            new ContactFactory(),
            new TaskFactory(partFactoryStub, businessRuleServiceStub, catalogServiceStub),
            new PremisesFactory(new AddressFactory()),
            new VisitFactory(),
            new ApplianceFactory(
                new ApplianceSafetyFactory(businessRuleServiceStub),
                new ReadingFactory(catalogServiceStub),
                new LandlordFactory(catalogServiceStub),
                businessRuleServiceStub,
                catalogServiceStub,
                dataStateManagerStub
            ),
            new PropertySafetyFactory(),
            complaintFactoryStub,
            businessRuleServiceStub,
            addressFactoryStub,
            customerFactoryStub,
            new ChargeFactory(businessRuleServiceStub, catalogServiceStub),
            storageServiceStub,
            dataStateManagerStub,
            sanityChecker
        );
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(jobFactory).toBeDefined();
    });

    describe("the createJobBusinessModel method", () => {
        it("can be called with undefined parameters", (done) => {
            jobFactory.createJobBusinessModel(undefined, undefined, undefined)
                .then(job => {
                    expect(job.id).toBeUndefined();
                    done();
                });
        });

        it("can be called with null parameters", (done) => {
            jobFactory.createJobBusinessModel(null, null, null)
                .then(job => {
                    expect(job.id).toBeUndefined();
                    done();
                });
        });

        it("can be called with a worklist item but no job", (done) => {
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456", timestamp: "foo" }, null, null)
                .then(job => {
                    expect(job.id).toEqual("123456");
                    expect(job.wmisTimestamp).toEqual("foo");
                    done();
                });
        });

        it("will call sanity checker", done => {
            let jobApiModel: IJob = <IJob>{
                tasks: []
            };
            jobApiModel.premises = <IPremises>{};
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{
                appliances: []
            };
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect((sanityChecker.isBadlyFormed as Sinon.SinonStub).called).toBe(true);
                    done();
                });
        });
    });

    describe("the createPartCollectionBusinessModel method", () => {

        it("can be called with undefined parameters", () => {
            const jobPartsCollection = jobFactory.createPartCollectionBusinessModel(undefined, undefined);
            expect(jobPartsCollection.id).toBeUndefined();
        });

        it("can be called with null parameters", () => {
            const jobPartsCollection = jobFactory.createPartCollectionBusinessModel(null, null);
            expect(jobPartsCollection.id).toBeUndefined();
        });

        it("can be called with a worklist item but no parts collection job", () => {
            const jobPartsCollection = jobFactory.createPartCollectionBusinessModel(<IWorkListItem>{ id: "123456", timestamp: "foo", workType: "partsCollection" }, undefined);

            expect(jobPartsCollection.id).toEqual("123456");
            expect(jobPartsCollection.wmisTimestamp).toEqual("foo");
        });

        it("can be called with a worklist item but no parts", () => {

            let partsCollectionResponse = <IPartCollectionResponse>{};
            partsCollectionResponse.data = {
                list: undefined,
                customer: {
                    title: undefined,
                    firstName: undefined,
                    middleName: undefined,
                    lastName: "full name",
                    address: ["123", "123", "", "1212"]
                }
            };

            const jobPartsCollection = jobFactory.createPartCollectionBusinessModel(<IWorkListItem>{ id: "123456", timestamp: "foo", workType: "partsCollection" }, partsCollectionResponse);

            expect(jobPartsCollection.id).toEqual("123456");
            expect(jobPartsCollection.wmisTimestamp).toEqual("foo");
        });

        it("can be called with a worklist item but no customer", () => {

            let partsCollectionResponse = <IPartCollectionResponse>{};
            partsCollectionResponse.data = {
                list: [{
                    stockReferenceId: "1",
                    description: "desc",
                    quantity: "1"
                }],
                customer: undefined
            };

            const jobPartsCollection = jobFactory.createPartCollectionBusinessModel(<IWorkListItem>{ id: "123456", timestamp: "foo", workType: "partsCollection" }, partsCollectionResponse);

            expect(jobPartsCollection.id).toEqual("123456");
            expect(jobPartsCollection.wmisTimestamp).toEqual("foo");
        });

        it("can map parts collection", () => {

            let partsCollectionResponse = <IPartCollectionResponse>{};
            partsCollectionResponse.data = {
                list: [{
                    stockReferenceId: "1",
                    description: "desc",
                    quantity: "1"
                }],
                customer: {
                    title: undefined,
                    firstName: undefined,
                    middleName: undefined,
                    lastName: "full name",
                    address: ["123", "123", "1212"]
                }
            };

            const jobPartsCollection = jobFactory.createPartCollectionBusinessModel(<IWorkListItem>{ id: "123456", timestamp: "foo", workType: "partsCollection" }, partsCollectionResponse);

            expect(jobPartsCollection.id).toEqual("123456");
            expect(jobPartsCollection.wmisTimestamp).toEqual("foo");
            expect(jobPartsCollection.customer.lastName).toEqual(partsCollectionResponse.data.customer.lastName);
            expect(jobPartsCollection.customer.address).toEqual(partsCollectionResponse.data.customer.address);

            const expectedList = [{
                stockReferenceId: "1",
                description: "desc",
                quantity: 1
            }];
            expect(jobPartsCollection.parts).toEqual(expectedList);
        });

        it("trims empty address lines", () => {
            let partsCollectionResponse = <IPartCollectionResponse>{};
            partsCollectionResponse.data = {
                list: [{
                    stockReferenceId: "1",
                    description: "desc",
                    quantity: "1"
                }],
                customer: {
                    title: undefined,
                    firstName: undefined,
                    middleName: undefined,
                    lastName: "full name",
                    address: ["123", "123", "", "  ", undefined, "1212"]
                }
            };

            const jobPartsCollection = jobFactory.createPartCollectionBusinessModel(<IWorkListItem>{ id: "123456", timestamp: "foo", workType: "partsCollection" }, partsCollectionResponse);

            expect(jobPartsCollection.customer.address).toEqual(["123", "123", "1212"])
        })

    });

    describe("the createPremisesBusinessModel method", () => {
        it("can be called with empty premises", (done) => {
            let jobApiModel: IJob = <IJob>{
                tasks: []
            };
            jobApiModel.premises = <IPremises>{};
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{
                appliances: []
            };
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.premises).toBeDefined({});
                    expect(job.contact).toBeUndefined();
                    expect(job.risks).toBeUndefined();
                    done();
                });
        });

        it("can be called with empty contact and risks", (done) => {
            let jobApiModel: IJob = <IJob>{
                tasks: []
            };
            jobApiModel.premises = <IPremises>{};
            jobApiModel.premises.contact = <IContact>{};
            jobApiModel.premises.risks = [];
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{
                appliances: []
            };

            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.premises).toBeDefined();
                    expect(job.contact).toBeDefined();
                    expect(job.risks).toBeDefined();
                    done();
                });
        });

        it("can be called with empty contact and having risks", (done) => {
            let jobApiModel: IJob = <IJob>{
                tasks: []
            };
            jobApiModel.premises = <IPremises>{};
            jobApiModel.premises.contact = <IContact>{};
            jobApiModel.premises.risks = [];
            jobApiModel.premises.risks.push(<IRisk>{});
            jobApiModel.premises.risks.push(<IRisk>{});
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{
                appliances: []
            };

            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.premises).toBeDefined();
                    expect(job.contact).toBeDefined();
                    expect(job.risks.length).toEqual(2);
                    done();
                });
        });
    });

    describe("the createVisitBusinessModel method", () => {
        it("can be called with undefined visit", (done) => {
            let jobApiModel: IJob = <IJob>{
                tasks: []
            };
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.visit).toBeUndefined();
                    done();
                });
        });
        it("can be called with empty visit", (done) => {
            let jobApiModel: IJob = <IJob>{
                tasks: []
            };
            jobApiModel.visit = <IVisit>{};
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.visit.timeSlotFrom).toEqual(undefined);
                    expect(job.visit.timeSlotTo).toEqual(undefined);
                    expect(job.visit.specialInstructions).toEqual(undefined);
                    done();
                });
        });
    });

    describe("the createTasksBusinessModel method", () => {
        it("can be called with undefined tasks", (done) => {
            let jobApiModel: IJob = <IJob>{};
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.tasks).toBeUndefined();
                    done();
                });
        });
        it("can be called with empty tasks", (done) => {
            let jobApiModel: IJob = <IJob>{ tasks: [] };
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.tasks).toEqual([]);
                    done();
                });
        });
        it("can be called with multiple tasks in order", (done) => {
            let jobApiModel: IJob = <IJob>{ tasks: [] };
            jobApiModel.tasks = [
                <ITask>{ id: "001", status: "D" },
                <ITask>{ id: "002", status: "D" }
            ];
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.tasks.length).toEqual(2);
                    expect(job.tasks[0].id).toEqual("001");
                    expect(job.tasks[1].id).toEqual("002");
                    done();
                });
        });
        it("can be called with multiple tasks in unordered", (done) => {
            let jobApiModel: IJob = <IJob>{ tasks: [] };
            jobApiModel.tasks = [
                <ITask>{ id: "002", status: "D" },
                <ITask>{ id: "001", status: "D" }
            ];
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.tasks.length).toEqual(2);
                    expect(job.tasks[0].id).toEqual("001");
                    expect(job.tasks[1].id).toEqual("002");
                    done();
                });
        });
    });

    describe("the createHistoryBusinessModel method", () => {
        it("can be called with undefined tasks", (done) => {
            let jobApiModel: IJob = <IJob>{};
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.history.appliances).toEqual([]);
                    done();
                });
        });
        it("can be called with empty tasks", (done) => {
            let jobApiModel: IJob = <IJob>{
                tasks: []
            };
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobHistoryApiModel.tasks = [];
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.history.tasks).toEqual([]);
                    done();
                });
        });
        it("can be called with multiple tasks", (done) => {
            let jobApiModel: IJob = <IJob>{
                tasks: []
            };
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobHistoryApiModel.tasks = [
                <ITask>{},
                <ITask>{}
            ];
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.history.tasks.length).toEqual(2);
                    done();
                });
        });
    });

    describe("the createAppliancesBusinessModel method", () => {

        beforeEach(() => {
            catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                applianceType: "HAZ"
            }]);
        });

        it("can be called with undefined history", (done) => {
            let jobApiModel: IJob = <IJob>{
                tasks: []
            };
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, undefined)
                .then(job => {
                    expect(job.history).toBeUndefined();
                    done();
                });
        });

        it("can be called with undefined history appliances", (done) => {
            let jobApiModel: IJob = <IJob>{
                tasks: []
            };
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{};
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.history.appliances.length).toEqual(0);
                    expect((dataStateManagerStub.updateAppliancesDataState as Sinon.SinonStub).calledWith(job)).toBe(true);
                    done();
                });
        });

        it("can be called with empty history appliances", (done) => {
            let jobApiModel: IJob = <IJob>{
                tasks: []
            };
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobHistoryApiModel.appliances = [];
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.history.appliances.length).toEqual(0);
                    expect((dataStateManagerStub.updateAppliancesDataState as Sinon.SinonStub).called).toBe(true);
                    done();
                });
        });

        it("can be called with multiple history appliances", (done) => {
            catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                applianceType: "FOO"
            }]);
            let jobApiModel: IJob = <IJob>{
                tasks: []
            };
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobHistoryApiModel.appliances = [
                <IAppliance>{ id: "1", applianceType: "FOO" },
                <IAppliance>{ id: "2", applianceType: "FOO" }
            ];
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.history.appliances.length).toEqual(2);
                    expect((dataStateManagerStub.updateAppliancesDataState as Sinon.SinonStub).called).toBe(true);
                    done();
                });
        });

        it("can be called with duplicate history appliances", (done) => {
            catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                applianceType: "FOO"
            }]);
            let jobApiModel: IJob = <IJob>{
                tasks: []
            };
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobHistoryApiModel.appliances = [
                <IAppliance>{ id: "1", applianceType: "FOO" },
                <IAppliance>{ id: "1", applianceType: "FOO" },
                <IAppliance>{ id: "2", applianceType: "FOO" }
            ];
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.history.appliances.length).toEqual(2);
                    expect(job.history.appliances.filter(a => a.id === "1").length).toEqual(1);
                    expect(job.history.appliances.filter(a => a.id === "2").length).toEqual(1);
                    expect((dataStateManagerStub.updateAppliancesDataState as Sinon.SinonStub).called).toBe(true);
                    done();
                });
        });

        it("can be called with null history appliances", (done) => {
            catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                applianceType: "FOO"
            }]);
            let jobApiModel: IJob = <IJob>{
                tasks: []
            };
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobHistoryApiModel.appliances = [
                null,
                <IAppliance>{ id: "1", applianceType: "FOO" },
                <IAppliance>{ id: "2", applianceType: "FOO" },
                null
            ];
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.history.appliances.length).toEqual(2);
                    expect(job.history.appliances.filter(a => a.id === "1").length).toEqual(1);
                    expect(job.history.appliances.filter(a => a.id === "2").length).toEqual(1);
                    expect((dataStateManagerStub.updateAppliancesDataState as Sinon.SinonStub).called).toBe(true);
                    done();
                });
        });

        it("can be called with a hazard appliance", (done) => {
            catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                applianceType: "HAZ"
            }, <IObjectType>{
                applianceType: "FOO"
            }]);
            let jobApiModel: IJob = <IJob>{ tasks: [] };
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobHistoryApiModel.appliances = [
                <IAppliance>{ id: "1", applianceType: "HAZ", installationYear: <any>"2001" },
                <IAppliance>{ id: "2", applianceType: "HAZ", installationYear: 2000 },
                <IAppliance>{ id: "3", applianceType: "FOO" }
            ];
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.risks.length).toEqual(2);
                    expect(job.risks[0].date).toEqual(undefined);
                    expect(job.risks[1].date.getFullYear()).toEqual(2000);
                    expect(job.history.appliances.length).toEqual(1);
                    expect((dataStateManagerStub.updateAppliancesDataState as Sinon.SinonStub).called).toBe(true);
                    done();
                });
        });

        it("can linked to tasks through appliance id", (done) => {
            catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                applianceType: "FOO"
            }]);
            let jobApiModel: IJob = <IJob>{ tasks: [] };
            jobApiModel.tasks = [<ITask>{
                applianceId: "222222",
                status: "D"
            }];

            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobHistoryApiModel.appliances = [
                <IAppliance>{},
                <IAppliance>{ id: null, applianceType: "FOO" },
                <IAppliance>{ id: undefined, applianceType: "FOO" },
                <IAppliance>{ id: "", applianceType: "FOO" },
                <IAppliance>{ id: "111111", applianceType: "FOO" },
                <IAppliance>{ id: "222222", applianceType: "FOO" }
            ];

            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.history.appliances.length).toEqual(2);
                    expect((dataStateManagerStub.updateAppliancesDataState as Sinon.SinonStub).called).toBe(true);
                    done();
                });
        });

        it("can be link to tasks through link id", (done) => {
            catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                applianceType: "FOO"
            }]);
            let jobApiModel: IJob = <IJob>{ tasks: [] };
            jobApiModel.tasks = [<ITask>{
                applianceId: "111111",
                status: "D"
            }];

            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobHistoryApiModel.appliances = [
                <IAppliance>{},
                <IAppliance>{ linkId: null, applianceType: "FOO" },
                <IAppliance>{ linkId: undefined, applianceType: "FOO" },
                <IAppliance>{ linkId: "", applianceType: "FOO" },
                <IAppliance>{ linkId: "blah", applianceType: "FOO" },
                <IAppliance>{ id: "111111", applianceType: "FOO" },
                <IAppliance>{ id: "222222", linkId: "111111", applianceType: "FOO" },
                <IAppliance>{ id: "333333", applianceType: "FOO" },
                <IAppliance>{ id: "444444", linkId: "333333", applianceType: "FOO" }
            ];

            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.history.appliances.length).toEqual(4);
                    expect((dataStateManagerStub.updateAppliancesDataState as Sinon.SinonStub).called).toBe(true);
                    done();
                });
        });

        it("can have parent and child links", (done) => {
            catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                applianceType: "FOO"
            }]);
            let jobApiModel: IJob = <IJob>{ tasks: [] };
            jobApiModel.tasks = [<ITask>{
                applianceId: "111111"
            }];

            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobHistoryApiModel.appliances = [
                <IAppliance>{},
                <IAppliance>{ linkId: null, applianceType: "FOO" },
                <IAppliance>{ linkId: undefined, applianceType: "FOO" },
                <IAppliance>{ linkId: "", applianceType: "FOO" },
                <IAppliance>{ linkId: "blah", applianceType: "FOO" },
                <IAppliance>{ id: "111111", applianceType: "FOO" },
                <IAppliance>{ id: "222222", linkId: "111111", applianceType: "FOO" },
                <IAppliance>{ id: "333333", linkId: "111111", applianceType: "FOO" },
                <IAppliance>{ id: "444444", linkId: "222222", applianceType: "FOO" }
            ];

            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.history.appliances.length).toEqual(4);
                    expect(job.history.appliances.filter(app => app.parentId === undefined).length).toBe(3);
                    expect(job.history.appliances.filter(app => app.childId === undefined).length).toBe(3);
                    let childAppliance = job.history.appliances.find(app => app.parentId !== undefined);
                    let parentAppliance = job.history.appliances.find(app => app.childId !== undefined);
                    expect(parentAppliance.childId).toBe(childAppliance.id);
                    expect(childAppliance.parentId).toBe(parentAppliance.id);
                    done();
                });
        });

        // todo: fix unit test
        xit("can observe the objecttype catalog to ensure an appliance for todays work does not have to have safety", done => {
            let jobApiModel: IJob = <IJob>{ tasks: [] };
            jobApiModel.tasks = [<ITask>{
                applianceId: "111111", applianceType: "HAZ"
            }];

            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobHistoryApiModel.appliances = [
                <IAppliance>{ id: "111111", applianceType: "HAZ" },
            ];

            let objectType = <IObjectType>{ applianceSafetyNotRequiredIndicator: "Y" };

            catalogServiceStub.getObjectType = sandbox.stub().resolves(objectType);
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.history.appliances[0].dataState).toBe(DataState.notVisited);
                    expect(job.history.appliances[0].safety.applianceGasSafety.dataState).toBe(DataState.dontCare);
                    done();
                });
        });
    });

    describe("calculateLandlordJob method", () => {

        let worklistItem = <IWorkListItem>{ id: "123456" };
        let jobApiModel: IJob;
        let jobHistoryApiModel: IJobHistory;

        let task = <ITask>{
            id: "001"
        };
        let otherTask =<ITask>{
            id: "002",
            jobType: "IB",
            applianceType: "CHB",
            status: "D"
        };

        beforeEach(() => {
            jobHistoryApiModel = <IJobHistory>{};
            jobApiModel = <IJob>{
                tasks: [otherTask, task]
            };
        });

        it("is not a landlord job if the AS is not for today", async done => {
            task.jobType = "AS";
            task.applianceType = "INS";
            task.status = "C";

            let job = await jobFactory.createJobBusinessModel(worklistItem, jobApiModel, jobHistoryApiModel)
            expect(job.isLandlordJob).toBe(false);
            expect(job.wasOriginallyLandlordJob).toBe(false);
            done();
        });

        it("is not a landlord job if not an AS job", async done => {
            task.jobType = "IB";
            task.applianceType = "INS";
            task.status = "D";

            let job = await jobFactory.createJobBusinessModel(worklistItem, jobApiModel, jobHistoryApiModel)
            expect(job.isLandlordJob).toBe(false);
            expect(job.wasOriginallyLandlordJob).toBe(false);
            done();
        });

        it("is not a landlord job if not an INS appliance", async done => {
            task.jobType = "AS";
            task.applianceType = "CHB";
            task.status = "D";

            let job = await jobFactory.createJobBusinessModel(worklistItem, jobApiModel, jobHistoryApiModel)
            expect(job.isLandlordJob).toBe(false);
            expect(job.wasOriginallyLandlordJob).toBe(false);
            done();
        });

        it("is a landlord job if AS, INS and do today", async done => {
            task.jobType = "AS";
            task.applianceType = "INS";
            task.status = "D";

            let job = await jobFactory.createJobBusinessModel(worklistItem, jobApiModel, jobHistoryApiModel)
            expect(job.isLandlordJob).toBe(true);
            expect(job.wasOriginallyLandlordJob).toBe(true);
            done();
        });
    });

    describe("calculating property safety type", () => {
        it("can assign a gas job", done => {
            storageServiceStub.getWorkingSector = sandbox.stub().resolves("PatchGS");
            let jobApiModel: IJob = <IJob>{ tasks: [] };
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.propertySafetyType).toBe(PropertySafetyType.gas)
                    done();
                });
        });

        it("can assign a gas job", done => {
            storageServiceStub.getWorkingSector = sandbox.stub().resolves("PatchES");
            let jobApiModel: IJob = <IJob>{ tasks: [] };
            let jobHistoryApiModel: IJobHistory = <IJobHistory>{ appliances: [] };
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.propertySafetyType).toBe(PropertySafetyType.electrical)
                    done();
                });
        })
    });

    describe("the calculateIsCharge method", () => {

        let jobApiModel: IJob;

        const jobHistoryApiModel: IJobHistory = <IJobHistory>{};

        const noneChargeTask = <ITask>{
            chargeType: "NCHNONE",
            status: "D"
        };

        const chargeTask = <ITask>{
            chargeType: "SLONONE",
            status: "D"
        };

        beforeEach(() => {
            jobApiModel = <IJob>{};
            jobApiModel.tasks = [];
        });

        it("should set dispatch time", (done) => {
            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.dispatchTime).toBeDefined();
                    done();
                });
        });

        it("should set isCharge to false if a no charge task (chargeType is prefixed with NC)", (done) => {

            jobApiModel.tasks.push(noneChargeTask);

            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.tasks[0].isCharge).toBeFalsy();
                    done();
                });
        });

        it("should set isCharge to true if a charge task (chargeType is not prefixed with NC)", (done) => {

            jobApiModel.tasks.push(chargeTask);

            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.tasks[0].isCharge).toBeTruthy();
                    done();
                });
        });

        it("should set isCharge to true if a charge task (chargeType is not prefixed with NC) and a none charge task", (done) => {

            jobApiModel.tasks.push(chargeTask);
            jobApiModel.tasks.push(noneChargeTask);

            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.tasks[0].isCharge).toBeTruthy();
                    done();
                });
        });

        it("should set dataState to do not care if no charge", (done) => {

            jobApiModel.tasks.push(noneChargeTask);

            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.charge.dataState).toEqual(DataState.dontCare);
                    done();
                });
        });

        it("should set dataState to not visited if charge", (done) => {

            jobApiModel.tasks.push(chargeTask);

            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "123456" }, jobApiModel, jobHistoryApiModel)
                .then(job => {
                    expect(job.charge.dataState).toEqual(DataState.notVisited);
                    done();
                });
        });
    });

    describe("the createJobApiModel method", () => {

        it("can be called with undefined parameters", (done) => {
            jobFactory.createJobApiModel(undefined, undefined, undefined)
                .then(jobUpdate => {
                    expect(jobUpdate).toBeDefined();
                    expect(jobUpdate.job).toBeUndefined();
                    expect(jobUpdate.appliances).toBeUndefined();
                    expect(jobUpdate.complaintReportOrCompensationPayment).toBeUndefined();
                    expect(jobUpdate.newWork).toBeUndefined();
                    done();
                });
        });

        it("can be called with null parameters", (done) => {
            jobFactory.createJobApiModel(null, null, null)
                .then(jobUpdate => {
                    expect(jobUpdate).toBeDefined();
                    expect(jobUpdate.job).toBeUndefined();
                    expect(jobUpdate.appliances).toBeUndefined();
                    expect(jobUpdate.complaintReportOrCompensationPayment).toBeUndefined();
                    expect(jobUpdate.newWork).toBeUndefined();
                    done();
                });
        });

        it("can be called with an empty job and undefined original job", (done) => {
            let job = <JobBusinessModel>{};
            jobFactory.createJobApiModel(job, undefined, null)
                .then(jobUpdate => {
                    expect(jobUpdate).toBeDefined();
                    expect(jobUpdate.job).toBeUndefined();
                    expect(jobUpdate.appliances).toBeUndefined();
                    expect(jobUpdate.complaintReportOrCompensationPayment).toBeUndefined();
                    expect(jobUpdate.newWork).toBeUndefined();
                    done();
                });
        });

        it("can be called with an empty job and empty original job", (done) => {
            let job = <JobBusinessModel>{};
            let engineer = <Engineer>{};
            jobFactory.createJobApiModel(job, engineer, <Job>{})
                .then(jobUpdate => {
                    expect(jobUpdate).toBeDefined();
                    expect(jobUpdate.job).toBeDefined();
                    expect(jobUpdate.appliances).toBeDefined();
                    expect(jobUpdate.complaintReportOrCompensationPayment).toBeUndefined();
                    done();
                });
        });

        it("can build a complaint object", (done) => {
            let job = <JobBusinessModel>{};
            let complaint = {};
            complaintFactoryStub.createComplaintApiModel = sandbox.stub().returns(complaint);

            let engineer = <Engineer>{};
            jobFactory.createJobApiModel(job, engineer, <Job>{})
                .then(jobUpdate => {
                    expect(jobUpdate.complaintReportOrCompensationPayment).toBe(complaint);
                    done();
                });
        });

        describe("businessRules", () => {
            let getQueryableRuleGroupStub: Sinon.SinonStub;

            beforeEach(() => {
                getQueryableRuleGroupStub = <Sinon.SinonStub>businessRuleServiceStub.getQueryableRuleGroup;
            });

            it("should retrieve jobFactory business rules", (done) => {
                jobFactory.createJobApiModel(<Job>{}, <Engineer>{}, <Job>{})
                    .then(() => {
                        expect(getQueryableRuleGroupStub.callCount).toEqual(1);
                        done();
                    });
            });

            it("should reject when business rule doesn't exist", (done) => {
                let errorObj = Error("Business rule error");
                getQueryableRuleGroupStub = businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().rejects(errorObj);

                jobFactory.createJobApiModel(<Job>{}, <Engineer>{}, <Job>{})
                    .catch((err) => {
                        expect(err.message).toEqual(errorObj.message);
                        done();
                    });
            });
        });

        describe("map jobUpdateApiModel", () => {

            let newJob: Job;

            beforeEach(() => {
                newJob = <Job>{};
            });

            it("should map status from job state", (done) => {
                newJob.state = JobState.enRoute;

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.status.code).toEqual("enroute");
                        done();
                    });
            });

            it("should map visitId from job.visit", (done) => {
                newJob.visit = <Visit>{ id: "123000" };

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.visitId).toEqual("123000");
                        done();
                    });
            });

            it("should set status timestamp to now", (done) => {
                let dtNow = new Date();
                newJob.state = JobState.enRoute;

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        let statusDt = DateHelper.fromJsonDateTimeString(res.job.status.timestamp);
                        let statusSetAgo = Math.abs(<any>dtNow - <any>statusDt);

                        expect(statusSetAgo).toBeLessThan(2000);
                        done();
                    });
            });

            // it ("should set preferredEngineer", (done) => {
            //     // act
            //     jobFactory.createJobApiModel(newJob, <Engineer>{})
            //     .then((res) => {
            //         expect(res.job.preferredEngineer).toBeUndefined();
            //         done();
            //     });
            // });

            it("should set source system from business rules config", (done) => {
                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.sourceSystem).toEqual("WMIS");
                        done();
                    });
            });

            it("should map the enginner id from the engineer object", (done) => {
                jobFactory.createJobApiModel(newJob, <Engineer>{ id: "someId" }, <Job>{})
                    .then((res) => {
                        expect(res.job.engineerId).toEqual("someId");
                        done();
                    });
            });

            it("should map the enginner id to undefined when engineer object is has undefined id", (done) => {
                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.engineerId).toBeUndefined();
                        done();
                    });
            });

            it("should map dispatchTime to JSON date time string", (done) => {
                newJob.dispatchTime = new Date();

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(assertDateTimeFormat(newJob.dispatchTime, res.job.dispatchTime)).toBeTruthy();
                        done();
                    });
            });

            it("should map dispatchTime undefined to undefined", (done) => {
                newJob.dispatchTime = undefined;

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.dispatchTime).toBeUndefined();
                        done();
                    });
            });

            it("should map dispatchTime null to undefined", (done) => {
                newJob.dispatchTime = null;

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.dispatchTime).toBeUndefined();
                        done();
                    });
            });

            it("should map enrouteTime to JSON date time string", (done) => {
                newJob.enrouteTime = new Date();

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(assertDateTimeFormat(newJob.enrouteTime, res.job.enrouteTime)).toBeTruthy();
                        done();
                    });
            });

            it("should map enrouteTime undefined to undefined", (done) => {
                newJob.enrouteTime = undefined;

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.enrouteTime).toBeUndefined();
                        done();
                    });
            });

            it("should map enrouteTime null to undefined", (done) => {
                newJob.enrouteTime = null;

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.enrouteTime).toBeUndefined();
                        done();
                    });
            });

            it("should map onsiteTime to JSON date time string", (done) => {
                newJob.onsiteTime = new Date();

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(assertDateTimeFormat(newJob.onsiteTime, res.job.onsiteTime)).toBeTruthy();
                        done();
                    });
            });

            it("should map onsiteTime undefined to undefined", (done) => {
                newJob.onsiteTime = undefined;

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.onsiteTime).toBeUndefined();
                        done();
                    });
            });

            it("should map onsiteTime null to undefined", (done) => {
                newJob.onsiteTime = null;

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.onsiteTime).toBeUndefined();
                        done();
                    });
            });

            it("should map completionTime to JSON date time string", (done) => {
                newJob.completionTime = new Date();

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(assertDateTimeFormat(newJob.completionTime, res.job.completionTime)).toBeTruthy();
                        done();
                    });
            });

            it("should map completionTime undefined to undefined", (done) => {
                newJob.completionTime = undefined;

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.completionTime).toBeUndefined();
                        done();
                    });
            });

            it("should map completionTime null to be undefined", (done) => {
                newJob.completionTime = null;

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.completionTime).toBeUndefined();
                        done();
                    });
            });

            it("should not create mapped tasks when new job has no tasks", (done) => {
                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.tasks).toBeUndefined();
                        done();
                    });
            });

            it("should map each business model task in the task factory", (done) => {
                newJob.tasks = <Task[]>[
                    { id: "1" },
                    { id: "2" }
                ];
                newJob.charge = <Charge>{};
                newJob.charge.tasks = [];

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.tasks.length).toEqual(2);
                        expect(res.job.tasks[0].id).toEqual("1");
                        expect(res.job.tasks[1].id).toEqual("2");
                        done();
                    })
                    .catch(error => {
                        fail("should not be here: " + error);
                        done();
                    });
            });

            // to extend
            it("should map the job to a future visit in the visit factory", (done) => {
                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.futureVisit).toBeUndefined();
                        done();
                    });
            });

            it("should map risks which are not hazard types", (done) => {
                newJob.risks = [
                    <Risk>{
                        id: "1",
                        reason: "reason1",
                        report: "report1",
                        isHazard: false,
                        date: new Date(2011, 10, 30)
                    },
                    <Risk>{
                        id: "2",
                        reason: "reason2",
                        report: "report2",
                        isHazard: false,
                        date: new Date(2011, 11, 30)
                    },
                    <Risk>{
                        id: "3",
                        reason: "",
                        report: "",
                        isHazard: true,
                        date: new Date(2011, 12, 30)
                    },
                ];

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.premises.risks.length).toEqual(2);
                        expect(res.job.premises.risks[0].reason).toEqual("reason1");
                        expect(res.job.premises.risks[0].report).toEqual("report1");

                        expect(res.job.premises.risks[1].reason).toEqual("reason2");
                        expect(res.job.premises.risks[1].report).toEqual("report2");
                        done();
                    });
            });

            it("should map property safety riskIdentified, if there are risks", (done) => {
                newJob.propertySafety = <PropertySafety>{};
                newJob.risks = [
                    <Risk>{
                        id: "1",
                        reason: "reason1",
                        report: "report1",
                        isHazard: false,
                        date: new Date(2011, 10, 30)
                    }
                ];

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.premises.risks.length).toEqual(1);
                        expect(res.job.premises.safety.riskIdentifiedAtProperty).toEqual(true);
                        done();
                    });
            });

            it("should map property safety riskIdentified false if no risks", (done) => {
                newJob.propertySafety = <PropertySafety>{};
                newJob.risks = [];

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.premises.risks.length).toEqual(0);
                        expect(res.job.premises.safety.riskIdentifiedAtProperty).toBe(false);
                        done();
                    });
            });

            // need to check can the propertySafety object ever be undefined in the api update reponse?
            // if it can then these tests make sense.
            it("should not map safety when there are no risks and property safety are undefined", (done) => {
                newJob.risks = [];

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.premises.risks.length).toEqual(0);
                        expect(res.job.premises.safety).toBeUndefined();
                        done();
                    });
            });

            it("should not map safety when job is no-accessed", (done) => {
                newJob.propertySafety = <PropertySafety>{};
                newJob.tasks = [<Task>{}];
                newJob.charge = <Charge>{};
                newJob.charge.tasks = [];
                newJob.jobNotDoingReason = JobNotDoingReason.taskNoAccessed;
                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.premises.safety).toBeUndefined();
                        done();
                    });
            });

            it("should map safety riskIdentifiedAtProperty when there are risks", (done) => {
                newJob.risks = [
                    <Risk>{
                        id: "1",
                        reason: "reason1",
                        report: "report1",
                        isHazard: false,
                        date: new Date(2011, 10, 30)
                    }
                ];

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.premises.risks.length).toEqual(1);
                        expect(res.job.premises.safety).toBeDefined();
                        expect(res.job.premises.safety.riskIdentifiedAtProperty).toEqual(true);
                        done();
                    });
            });

            it("should only map electrical properties when the job is an electrical job ", (done) => {

                newJob.propertySafetyType = PropertySafetyType.electrical;

                newJob.tasks = [
                    <Task>{ applianceId: "1" },
                ];
                newJob.history = <History>{
                    appliances: [
                        { id: "1", applianceSafetyType: ApplianceSafetyType.electrical }
                    ]
                }
                newJob.charge = <Charge>{ tasks: [] };

                newJob.propertySafety = <PropertySafety>{
                    propertyUnsafeDetail: undefined,
                    previousPropertySafetyDetail: undefined,
                    propertyElectricalSafetyDetail: {
                        noEliReadings: false,
                        eliReading: 1,
                        eliReadingReason: "",
                        consumerUnitSatisfactory: false,
                        systemType: "",
                        rcdPresent: "N",
                        eliSafeAccordingToTops: false,
                        dataState: null,
                        dataStateGroup: null,
                        dataStateId: null
                    },
                    propertyGasSafetyDetail: {
                        eliReading: "",
                        eliReadingReason: "",
                        safetyAdviseNoticeLeft: false,
                        safetyAdviseNoticeLeftReason: "",
                        gasInstallationTightnessTestDone: false,
                        pressureDrop: 0,
                        gasMeterInstallationSatisfactory: "",
                        gasInstallationTightnessTestAndVisualInspectionOfPipeworkResult: "",
                        dataState: null,
                        dataStateGroup: null,
                        dataStateId: null
                    }
                };

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.premises.safety.gasELIReading).toBeUndefined();
                        done();
                    });
            });

            it("should not map gas properties for a non gas job", (done) => {

                newJob.propertySafetyType = PropertySafetyType.electrical;

                newJob.tasks = [
                    <Task>{ applianceId: "1" },
                ];
                newJob.history = <History>{
                    appliances: [
                        { id: "1", applianceSafetyType: ApplianceSafetyType.electrical }
                    ]
                }
                newJob.charge = <Charge>{ tasks: [] };

                newJob.propertySafety = <PropertySafety>{
                    propertyUnsafeDetail: undefined,
                    previousPropertySafetyDetail: undefined,
                    propertyElectricalSafetyDetail: undefined,
                    propertyGasSafetyDetail: {
                        eliReading: "",
                        eliReadingReason: "",
                        safetyAdviseNoticeLeft: false,
                        safetyAdviseNoticeLeftReason: "",
                        gasInstallationTightnessTestDone: false,
                        pressureDrop: 0,
                        gasMeterInstallationSatisfactory: "",
                        gasInstallationTightnessTestAndVisualInspectionOfPipeworkResult: "",
                        dataState: null,
                        dataStateGroup: null,
                        dataStateId: null
                    }
                };

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.premises.safety).toEqual({ jobPartLJReportable: undefined, riskIdentifiedAtProperty: false });
                        done();
                    });
            });

            it("should not map gas properties for a non gas job", (done) => {

                newJob.propertySafetyType = undefined;

                newJob.tasks = [
                    <Task>{ applianceId: "1" },
                ];
                newJob.history = <History>{
                    appliances: [
                        { id: "1", applianceSafetyType: ApplianceSafetyType.gas }
                    ]
                }
                newJob.charge = <Charge>{ tasks: [] };

                newJob.propertySafety = <PropertySafety>{
                    propertyUnsafeDetail: undefined,
                    previousPropertySafetyDetail: undefined,
                    propertyElectricalSafetyDetail: {
                        noEliReadings: false,
                        eliReading: 1,
                        eliReadingReason: "",
                        consumerUnitSatisfactory: false,
                        systemType: "",
                        rcdPresent: "N",
                        eliSafeAccordingToTops: false,
                        dataState: null,
                        dataStateGroup: null,
                        dataStateId: null
                    },
                    propertyGasSafetyDetail: undefined
                };

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        expect(res.job.premises.safety).toEqual({ jobPartLJReportable: undefined, riskIdentifiedAtProperty: false });
                        done();
                    });
            });

            it("should only map gas properties for gas jobs ", (done) => {

                newJob.propertySafetyType = PropertySafetyType.gas;

                newJob.tasks = [
                    <Task>{ applianceId: "1" },
                ];
                newJob.history = <History>{
                    appliances: [
                        { id: "1", applianceSafetyType: ApplianceSafetyType.gas }
                    ]
                }
                newJob.charge = <Charge>{ tasks: [] };

                newJob.propertySafety = <PropertySafety>{
                    propertyUnsafeDetail: {
                        report: "",
                        conditionAsLeft: "",
                        labelAttachedRemoved: "",
                        cappedTurnedOff: "",
                        ownedByCustomer: false,
                        signatureObtained: false,
                        letterLeft: false,
                        reasons: [""]
                    },
                    previousPropertySafetyDetail: undefined,
                    propertyElectricalSafetyDetail: {
                        noEliReadings: false,
                        eliReading: 1,
                        eliReadingReason: "",
                        consumerUnitSatisfactory: false,
                        systemType: "",
                        rcdPresent: "N",
                        eliSafeAccordingToTops: false,
                        dataState: null,
                        dataStateGroup: null,
                        dataStateId: null
                    },
                    propertyGasSafetyDetail: {
                        eliReading: "",
                        eliReadingReason: "",
                        safetyAdviseNoticeLeft: false,
                        safetyAdviseNoticeLeftReason: "",
                        gasInstallationTightnessTestDone: true,
                        pressureDrop: 0,
                        gasMeterInstallationSatisfactory: "",
                        gasInstallationTightnessTestAndVisualInspectionOfPipeworkResult: "",
                        dataState: null,
                        dataStateGroup: null,
                        dataStateId: null
                    }
                };

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        const resSafety = res.job.premises.safety;
                        const gasSafety = newJob.propertySafety.propertyGasSafetyDetail;

                        expect(res.job.premises.safety).toBeDefined();

                        // electrical details
                        expect(resSafety.electricalELIReading).toBeUndefined();
                        expect(resSafety.consumerUnitOrFuseBoxSatisfactory).toBeUndefined();
                        expect(resSafety.electricalSystemType).toBeUndefined();
                        expect(resSafety.rcdPresent).toBeUndefined();
                        expect(resSafety.eliSafeAccordingToTheTableInTops).toBeUndefined();

                        // gas safety
                        expect(resSafety.gasELIReading).toEqual(gasSafety.eliReading);
                        expect(resSafety.eliReason).toEqual(gasSafety.eliReadingReason);
                        expect(resSafety.safetyNoticeNotLeftReason).toEqual(gasSafety.safetyAdviseNoticeLeftReason);
                        expect(resSafety.gasInstallationTightnessTestDone).toEqual(gasSafety.gasInstallationTightnessTestDone);
                        expect(resSafety.pressureDrop).toEqual(gasSafety.pressureDrop);
                        expect(resSafety.gasMeterInstallationSafe).toEqual(gasSafety.gasMeterInstallationSatisfactory);

                        done();
                    });
            });

            it("should only map safetyReasonNotLeft to safetyAdviseNoticeLeftReason when safety safetyAdviseNoticeLeft is true", (done) => {

                newJob.propertySafetyType = PropertySafetyType.gas;

                newJob.tasks = [
                    <Task>{ applianceId: "1" },
                ];
                newJob.history = <History>{
                    appliances: [
                        { id: "1", applianceSafetyType: ApplianceSafetyType.gas }
                    ]
                }
                newJob.charge = <Charge>{ tasks: [] };

                newJob.propertySafety = <PropertySafety>{
                    propertyUnsafeDetail: {
                        report: "",
                        conditionAsLeft: "",
                        labelAttachedRemoved: "",
                        cappedTurnedOff: "",
                        ownedByCustomer: false,
                        signatureObtained: false,
                        letterLeft: false,
                        reasons: [""]
                    },
                    previousPropertySafetyDetail: undefined,
                    propertyElectricalSafetyDetail: undefined,
                    propertyGasSafetyDetail: {
                        eliReading: "",
                        eliReadingReason: "",
                        safetyAdviseNoticeLeft: true,
                        safetyAdviseNoticeLeftReason: "safety advise",
                        gasInstallationTightnessTestDone: true,
                        pressureDrop: 0,
                        gasMeterInstallationSatisfactory: "",
                        gasInstallationTightnessTestAndVisualInspectionOfPipeworkResult: "",
                        dataState: null,
                        dataStateGroup: null,
                        dataStateId: null
                    }
                };

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        const resSafety = res.job.premises.safety;
                        const gasSafety = newJob.propertySafety.propertyGasSafetyDetail;

                        expect(resSafety.safetyNoticeNotLeftReason).toEqual(gasSafety.safetyAdviseNoticeLeftReason);

                        done();
                    });
            });

            it("should map safetyReasonNotLeft to empty string when safetyAdviseNoticeLeft is false", (done) => {

                newJob.propertySafetyType = PropertySafetyType.gas;

                newJob.tasks = [
                    <Task>{ applianceId: "1" },
                ];
                newJob.history = <History>{
                    appliances: [
                        { id: "1", applianceSafetyType: ApplianceSafetyType.gas }
                    ]
                }
                newJob.charge = <Charge>{ tasks: [] };

                newJob.propertySafety = <PropertySafety>{
                    propertyUnsafeDetail: {
                        report: "",
                        conditionAsLeft: "",
                        labelAttachedRemoved: "",
                        cappedTurnedOff: "",
                        ownedByCustomer: false,
                        signatureObtained: false,
                        letterLeft: false,
                        reasons: [""]
                    },
                    previousPropertySafetyDetail: undefined,
                    propertyElectricalSafetyDetail: undefined,
                    propertyGasSafetyDetail: {
                        eliReading: "",
                        eliReadingReason: "",
                        safetyAdviseNoticeLeft: false,
                        safetyAdviseNoticeLeftReason: "safety advise",
                        gasInstallationTightnessTestDone: true,
                        pressureDrop: 0,
                        gasMeterInstallationSatisfactory: "",
                        gasInstallationTightnessTestAndVisualInspectionOfPipeworkResult: "",
                        dataState: null,
                        dataStateGroup: null,
                        dataStateId: null
                    }
                };

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        const resSafety = res.job.premises.safety;

                        expect(resSafety.safetyNoticeNotLeftReason).toEqual("");

                        done();
                    });
            });

            it("should only map pressureDrop when safety gasInstallationTightnessTestDone is true", (done) => {

                newJob.propertySafetyType = PropertySafetyType.gas;

                newJob.tasks = [
                    <Task>{ applianceId: "1" },
                ];
                newJob.history = <History>{
                    appliances: [
                        { id: "1", applianceSafetyType: ApplianceSafetyType.gas }
                    ]
                }
                newJob.charge = <Charge>{ tasks: [] };

                newJob.propertySafety = <PropertySafety>{
                    propertyUnsafeDetail: {
                        report: "",
                        conditionAsLeft: "",
                        labelAttachedRemoved: "",
                        cappedTurnedOff: "",
                        ownedByCustomer: false,
                        signatureObtained: false,
                        letterLeft: false,
                        reasons: [""]
                    },
                    previousPropertySafetyDetail: undefined,
                    propertyElectricalSafetyDetail: undefined,
                    propertyGasSafetyDetail: {
                        eliReading: "",
                        eliReadingReason: "",
                        safetyAdviseNoticeLeft: true,
                        safetyAdviseNoticeLeftReason: "safety advise",
                        gasInstallationTightnessTestDone: true,
                        pressureDrop: 0,
                        gasMeterInstallationSatisfactory: "",
                        gasInstallationTightnessTestAndVisualInspectionOfPipeworkResult: "",
                        dataState: null,
                        dataStateGroup: null,
                        dataStateId: null
                    }
                };

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        const resSafety = res.job.premises.safety;
                        const gasSafety = newJob.propertySafety.propertyGasSafetyDetail;

                        expect(resSafety.gasInstallationTightnessTestDone).toEqual(true);
                        expect(resSafety.pressureDrop).toEqual(gasSafety.pressureDrop);

                        done();
                    });
            });

            it("should map pressureDrop to undefined when safety gasInstallationTightnessTestDone is false", (done) => {

                newJob.propertySafetyType = PropertySafetyType.gas;

                newJob.tasks = [
                    <Task>{ applianceId: "1" },
                ];
                newJob.history = <History>{
                    appliances: [
                        { id: "1", applianceSafetyType: ApplianceSafetyType.gas }
                    ]
                }
                newJob.charge = <Charge>{ tasks: [] };

                newJob.propertySafety = <PropertySafety>{
                    propertyUnsafeDetail: {
                        report: "",
                        conditionAsLeft: "",
                        labelAttachedRemoved: "",
                        cappedTurnedOff: "",
                        ownedByCustomer: false,
                        signatureObtained: false,
                        letterLeft: false,
                        reasons: [""]
                    },
                    previousPropertySafetyDetail: undefined,
                    propertyElectricalSafetyDetail: undefined,
                    propertyGasSafetyDetail: {
                        eliReading: "",
                        eliReadingReason: "",
                        safetyAdviseNoticeLeft: true,
                        safetyAdviseNoticeLeftReason: "safety advise",
                        gasInstallationTightnessTestDone: false,
                        pressureDrop: 0,
                        gasMeterInstallationSatisfactory: "",
                        gasInstallationTightnessTestAndVisualInspectionOfPipeworkResult: "",
                        dataState: null,
                        dataStateGroup: null,
                        dataStateId: null
                    }
                };

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        const resSafety = res.job.premises.safety;

                        expect(resSafety.gasInstallationTightnessTestDone).toEqual(false);
                        expect(resSafety.pressureDrop).toBeUndefined();

                        done();
                    });
            });

            it("should only map electrical properties for electrical jobs ", (done) => {

                newJob.propertySafetyType = PropertySafetyType.electrical;

                newJob.tasks = [
                    <Task>{ applianceId: "1" },
                ];
                newJob.history = <History>{
                    appliances: [
                        { id: "1", applianceSafetyType: ApplianceSafetyType.electrical }
                    ]
                }
                newJob.charge = <Charge>{ tasks: [] };

                newJob.propertySafety = <PropertySafety>{
                    propertyUnsafeDetail: {
                        report: "",
                        conditionAsLeft: "",
                        labelAttachedRemoved: "",
                        cappedTurnedOff: "",
                        ownedByCustomer: false,
                        signatureObtained: false,
                        letterLeft: false,
                        reasons: [""]
                    },
                    previousPropertySafetyDetail: undefined,
                    propertyElectricalSafetyDetail: {
                        noEliReadings: false,
                        eliReading: 1,
                        eliReadingReason: "",
                        consumerUnitSatisfactory: false,
                        systemType: "",
                        rcdPresent: "N",
                        eliSafeAccordingToTops: false,
                        dataState: null,
                        dataStateGroup: null,
                        dataStateId: null
                    },
                    propertyGasSafetyDetail: {
                        eliReading: "",
                        eliReadingReason: "",
                        safetyAdviseNoticeLeft: false,
                        safetyAdviseNoticeLeftReason: "",
                        gasInstallationTightnessTestDone: true,
                        pressureDrop: 0,
                        gasMeterInstallationSatisfactory: "",
                        gasInstallationTightnessTestAndVisualInspectionOfPipeworkResult: "",
                        dataState: null,
                        dataStateGroup: null,
                        dataStateId: null
                    }
                };

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        const resSafety = res.job.premises.safety;
                        const electricalSafety = newJob.propertySafety.propertyElectricalSafetyDetail;

                        expect(res.job.premises.safety).toBeDefined();

                        // gas details
                        expect(resSafety.gasELIReading).toBeUndefined();
                        expect(resSafety.safetyNoticeNotLeftReason).toBeUndefined();
                        expect(resSafety.gasInstallationTightnessTestDone).toBeUndefined();
                        expect(resSafety.pressureDrop).toBeUndefined();
                        expect(resSafety.gasMeterInstallationSafe).toBeUndefined();

                        // electrical details
                        expect(resSafety.electricalELIReading).toEqual(electricalSafety.eliReading);
                        expect(resSafety.eliReason).toBeUndefined();
                        expect(resSafety.consumerUnitOrFuseBoxSatisfactory).toEqual(electricalSafety.consumerUnitSatisfactory);
                        expect(resSafety.electricalSystemType).toEqual(electricalSafety.systemType);
                        expect(resSafety.rcdPresent).toEqual(electricalSafety.rcdPresent === "N" ? false : true);
                        expect(resSafety.eliSafeAccordingToTheTableInTops).toEqual(electricalSafety.eliSafeAccordingToTops);

                        done();
                    });
            });

            it("should map unsafe details for gas job types", (done) => {

                newJob.propertySafetyType = PropertySafetyType.gas;

                newJob.tasks = [
                    <Task>{ applianceId: "1" },
                ];
                newJob.history = <History>{
                    appliances: [
                        { id: "1", applianceSafetyType: ApplianceSafetyType.gas }
                    ]
                }
                newJob.charge = <Charge>{ tasks: [] };

                newJob.propertySafety = <PropertySafety>{
                    propertyUnsafeDetail: {
                        report: "",
                        conditionAsLeft: "",
                        labelAttachedRemoved: "",
                        cappedTurnedOff: "",
                        ownedByCustomer: false,
                        signatureObtained: false,
                        letterLeft: false,
                        reasons: [""]
                    },
                    previousPropertySafetyDetail: undefined,
                    propertyElectricalSafetyDetail: undefined,
                    propertyGasSafetyDetail: {
                        eliReading: "",
                        eliReadingReason: "",
                        safetyAdviseNoticeLeft: true,
                        safetyAdviseNoticeLeftReason: "safety advise",
                        gasInstallationTightnessTestDone: false,
                        pressureDrop: 0,
                        gasMeterInstallationSatisfactory: "",
                        gasInstallationTightnessTestAndVisualInspectionOfPipeworkResult: "",
                        dataState: null,
                        dataStateGroup: null,
                        dataStateId: null
                    }
                };

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        const resUnsafeDetail = res.job.premises.unsafeDetail;
                        const {
                            report,
                            conditionAsLeft,
                            labelAttachedRemoved,
                            cappedTurnedOff,
                            ownedByCustomer,
                            signatureObtained,
                            letterLeft,
                            reasons
                        } = newJob.propertySafety.propertyUnsafeDetail;

                        expect(resUnsafeDetail).toBeDefined();

                        expect(resUnsafeDetail.report).toEqual(report);
                        expect(resUnsafeDetail.conditionAsLeft).toEqual(conditionAsLeft);
                        expect(resUnsafeDetail.labelAttachedOrRemoved).toEqual(labelAttachedRemoved);
                        expect(resUnsafeDetail.cappedOrTurnedOff).toEqual(cappedTurnedOff);
                        expect(resUnsafeDetail.ownedByCustomer).toEqual(ownedByCustomer);
                        expect(resUnsafeDetail.signatureObtained).toEqual(signatureObtained);
                        expect(resUnsafeDetail.letterLeft).toEqual(letterLeft);
                        expect(resUnsafeDetail.reasons).toEqual(reasons);
                        expect(resUnsafeDetail.ownersNameAndDetails).toBeUndefined();

                        done();
                    });
            });

            it("should map unsafe details for electrical job types", (done) => {

                newJob.propertySafetyType = PropertySafetyType.electrical;

                newJob.tasks = [
                    <Task>{ applianceId: "1" },
                ];
                newJob.history = <History>{
                    appliances: [
                        { id: "1", applianceSafetyType: ApplianceSafetyType.electrical }
                    ]
                }
                newJob.charge = <Charge>{ tasks: [] };
                newJob.propertySafety = <PropertySafety>{
                    propertyUnsafeDetail: {
                        report: "",
                        conditionAsLeft: "",
                        labelAttachedRemoved: "",
                        cappedTurnedOff: "",
                        ownedByCustomer: false,
                        signatureObtained: false,
                        letterLeft: false,
                        reasons: [""]
                    },
                    previousPropertySafetyDetail: undefined,
                    propertyGasSafetyDetail: undefined,
                    propertyElectricalSafetyDetail: {
                        noEliReadings: false,
                        eliReading: 1,
                        eliReadingReason: "",
                        consumerUnitSatisfactory: false,
                        systemType: "",
                        rcdPresent: "N",
                        eliSafeAccordingToTops: false,
                        dataState: null,
                        dataStateGroup: null,
                        dataStateId: null
                    },
                };

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        const resUnsafeDetail = res.job.premises.unsafeDetail;
                        const {
                            report,
                            conditionAsLeft,
                            labelAttachedRemoved,
                            cappedTurnedOff,
                            ownedByCustomer,
                            signatureObtained,
                            letterLeft,
                            reasons
                        } = newJob.propertySafety.propertyUnsafeDetail;

                        expect(resUnsafeDetail).toBeDefined();

                        expect(resUnsafeDetail.report).toEqual(report);
                        expect(resUnsafeDetail.conditionAsLeft).toEqual(conditionAsLeft);
                        expect(resUnsafeDetail.labelAttachedOrRemoved).toEqual(labelAttachedRemoved);
                        expect(resUnsafeDetail.cappedOrTurnedOff).toEqual(cappedTurnedOff);
                        expect(resUnsafeDetail.ownedByCustomer).toEqual(ownedByCustomer);
                        expect(resUnsafeDetail.signatureObtained).toEqual(signatureObtained);
                        expect(resUnsafeDetail.letterLeft).toEqual(letterLeft);
                        expect(resUnsafeDetail.reasons).toEqual(reasons);
                        expect(resUnsafeDetail.ownersNameAndDetails).toBeUndefined();

                        done();
                    });
            });

            describe("appliances", () => {
                it("should map appliances that have been updated, created and deleted", done => {
                    newJob = <Job>{
                        tasks: [
                            { applianceId: "c8857734-bcd5-4396-bf08-d56c828b8bb9" }
                        ],
                        history: {
                            appliances: [
                                { id: "0", applianceType: "boiler" },
                                { isCreated: true, isDeleted: true, id: "8cf6d357-3f9d-4e59-9237-81bda6d6a802", applianceType: "boiler" },
                                { isCreated: true, id: "c8857734-bcd5-4396-bf08-d56c828b8bb9", applianceType: "boiler" },
                                { isUpdated: true, id: "2", applianceType: "boiler" },
                                { isDeleted: true, id: "3", applianceType: "boiler" }
                            ]
                        },
                        charge: {
                            tasks: []
                        }
                    };
                    catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                        applianceType: "boiler"
                    }]);
                    jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                        .then((res) => {
                            expect(res.appliances.length).toEqual(3);
                            expect(res.appliances.find(a => a.id === "2")).toBeDefined();
                            expect(res.appliances.find(a => a.id === "3")).toBeDefined();
                            expect(res.appliances.filter(a => a.id === undefined && a.hardwareSequenceNumber !== undefined).length).toBe(1);
                            done();
                        });
                });

                it("INS appliance should be present in the jobupdate api model if its a landlord job", done => {
                    newJob = <Job>{
                        tasks: [
                            { applianceId: "c8857734-bcd5-4396-bf08-d56c828b8bb9" }
                        ],
                        history: {
                            appliances: [
                                { isCreated: true, id: "c8857734-bcd5-4396-bf08-d56c828b8bb9", applianceType: "boiler" },
                                { isUpdated: true, id: "2", applianceType: "boiler" },
                                { isDeleted: true, id: "3", applianceType: "boiler" },
                                { id: "4", applianceType: "INS", isInstPremAppliance: true }
                            ]
                        },
                        charge: {
                            tasks: []
                        },
                        isLandlordJob: true,
                        propertySafety: {
                            propertyGasSafetyDetail: {
                                gasInstallationTightnessTestDone: true
                            }
                        }
                    };
                    catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                        applianceType: "boiler"
                    }, <IObjectType>{
                        applianceType: "INS"
                    }]);
                    jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                        .then((res) => {
                            expect(res.appliances.length).toEqual(4);
                            expect(res.appliances.find(a => a.id === "4").applianceType).toEqual("INS");
                            done();
                        });
                });

                it("INS appliance should not be present in the jobupdate api model if its not a landlord job or INS appliance details have not been updated", done => {
                    newJob = <Job>{
                        tasks: [
                            { applianceId: "c8857734-bcd5-4396-bf08-d56c828b8bb9" }
                        ],
                        history: {
                            appliances: [
                                { isCreated: true, id: "c8857734-bcd5-4396-bf08-d56c828b8bb9", applianceType: "boiler" },
                                { isUpdated: true, id: "2", applianceType: "boiler" },
                                { isDeleted: true, id: "3", applianceType: "boiler" },
                                { id: "4", applianceType: "INS", isInstPremAppliance: true }
                            ]
                        },
                        charge: {
                            tasks: []
                        },
                        isLandlordJob: false
                    };
                    catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                        applianceType: "boiler"
                    }, <IObjectType>{
                        applianceType: "INS"
                    }]);
                    jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                        .then((res) => {
                            expect(res.appliances.length).toEqual(3);
                            expect(res.appliances.find(a => a.id === "4")).toBeUndefined();
                            done();
                        });
                });

                it("INS appliance should be present in the jobupdate api model if the INS appliance details have been updated", done => {
                    newJob = <Job>{
                        tasks: [
                            { applianceId: "c8857734-bcd5-4396-bf08-d56c828b8bb9" }
                        ],
                        history: {
                            appliances: [
                                { isCreated: true, id: "c8857734-bcd5-4396-bf08-d56c828b8bb9", applianceType: "boiler" },
                                { isUpdated: true, id: "2", applianceType: "boiler" },
                                { isDeleted: true, id: "3", applianceType: "boiler" },
                                { id: "4", applianceType: "INS", isUpdated: true }
                            ]
                        },
                        charge: {
                            tasks: []
                        },
                        isLandlordJob: false
                    };
                    catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                        applianceType: "boiler"
                    }, <IObjectType>{
                        applianceType: "INS"
                    }]);
                    jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                        .then((res) => {
                            expect(res.appliances.length).toEqual(4);
                            expect(res.appliances.find(a => a.id === "4").applianceType).toEqual("INS");
                            done();
                        });
                });

                it("should not include the excluded appliances in the jobupdate", done => {
                    newJob = <Job>{
                        tasks: [
                            { applianceId: "c8857734-bcd5-4396-bf08-d56c828b8bb9" },
                            { applianceId: "2" },
                            { applianceId: "3" }
                        ],
                        history: {
                            appliances: [
                                { isCreated: true, id: "c8857734-bcd5-4396-bf08-d56c828b8bb9", applianceType: "boiler" },
                                { isUpdated: true, id: "2", applianceType: "boiler" },
                                { isDeleted: true, id: "3", applianceType: "boiler" },
                                { isExcluded: true, id: "4", applianceType: "boiler" }
                            ]
                        },
                        charge: {
                            tasks: []
                        }
                    };
                    catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                        applianceType: "boiler"
                    }]);
                    jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                        .then((res) => {
                            expect(res.appliances.length).toEqual(3);
                            expect(res.appliances.find(a => a.id === "2")).toBeDefined();
                            expect(res.appliances.find(a => a.id === "3")).toBeDefined();
                            expect(res.appliances.filter(a => a.id === "4").length).toEqual(0);
                            done();
                        });
                });
            });

            describe("no-accessed jobs", () => {
                it("should map appliances for a non-No Accessed job", done => {
                    newJob = <Job>{
                        history: {
                            appliances: [{}, { isUpdated: true, applianceType: "boiler" }]
                        },
                        charge: {
                            tasks: []
                        }
                    };

                    catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                        applianceType: "boiler"
                    }]);

                    jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                        .then((res) => {
                            expect(res.appliances.length).toEqual(1);
                            done();
                        });
                });

                it("should not map appliances for a No Accessed job", done => {
                    newJob = <Job>{
                        tasks: [<Task>{}],
                        history: {
                            appliances: [{}, { isUpdated: true }]
                        },
                        charge: {
                            tasks: []
                        },
                        jobNotDoingReason: JobNotDoingReason.taskNoAccessed
                    };

                    jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                        .then((res) => {
                            expect(res.appliances).toBeUndefined();
                            done();
                        });
                });
            });

            // wmis constraint
            xit("changing an appliances gcCode assumes the users intent was to create a new appliance and delete the old one", (done) => {
                newJob = <Job>{
                    history: {
                        appliances: [
                            { id: "123", applianceType: "boiler", gcCode: "444-444-444" }
                        ]
                    }
                };
                catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                    applianceType: "boiler"
                }]);

                jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                    .then((res) => {
                        const resAppliances = res.appliances;

                        expect(resAppliances.length).toEqual(2);

                        expect(resAppliances[0].updateMarker).toEqual("C");
                        expect(resAppliances[0].id).toBeUndefined();
                        expect(resAppliances[0].gcCode).toEqual("444-444-444");

                        expect(resAppliances[1].updateMarker).toEqual("D");
                        expect(resAppliances[1].id).toEqual("123");
                        expect(resAppliances[1].gcCode).toEqual("555-555-555");
                        done();
                    });
            });

            describe("risks", () => {

                it("should map hazard risks that have been updated, created and deleted", done => {
                    newJob = <Job>{
                        risks: [
                            { isHazard: true, id: "0" },
                            { isHazard: true, isCreated: true, isDeleted: true, id: "8cf6d357-3f9d-4e59-9237-81bda6d6a802" },
                            { isHazard: true, isCreated: true, id: "c8857734-bcd5-4396-bf08-d56c828b8bb9" },
                            { isHazard: true, isUpdated: true, id: "2" }
                        ],
                        deletedRisks: [
                            { isHazard: true, isDeleted: true, id: "3" }
                        ]
                    };

                    jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                        .then((res) => {
                            expect(res.appliances.length).toEqual(3);
                            expect(res.appliances.find(a => a.id === "2")).toBeDefined();
                            expect(res.appliances.find(a => a.id === "3")).toBeDefined();
                            expect(res.appliances.filter(a => a.id === undefined).length).toBe(1);

                            done();
                        });
                });

                it("should map both appliances and hazards", done => {
                    newJob = <Job>{
                        risks: [
                            { isHazard: true, isUpdated: true, id: "2" }
                        ],
                        history: {
                            appliances: [
                                { isUpdated: true, id: "3", applianceType: "boiler" },
                            ]
                        }, charge: {
                            tasks: []
                        }
                    };

                    catalogServiceStub.getObjectTypes = sandbox.stub().resolves([<IObjectType>{
                        applianceType: "boiler"
                    }]);

                    jobFactory.createJobApiModel(newJob, <Engineer>{}, <Job>{})
                        .then((res) => {
                            expect(res.appliances.length).toEqual(2);
                            expect(res.appliances.find(a => a.id === "2")).toBeDefined();
                            expect(res.appliances.find(a => a.id === "3")).toBeDefined();
                            done();
                        });
                });

            });
        });
    });

    describe("storage serialisation", () => {

        let jsonJob = <any>{
            "id": "1307517001",
            "customer": {
                "id": "022208159",
                "lastName": "Mr Elec Ramsey",
                "address": {
                    "houseNumber": "12",
                    "line": [
                        "Havenside"
                    ],
                    "county": "Southend-On-Sea",
                    "postCodeIn": "0JT",
                    "postCodeOut": "SS3"
                }
            },
            "premises": {
                "id": "L276045",
                "address": {
                    "houseNumber": "12",
                    "line": [
                        "Havenside"
                    ],
                    "county": "Southend-On-Sea",
                    "postCodeIn": "0JT",
                    "postCodeOut": "SS3"
                },
                "previousVisitCount": 1,
                "contact": {
                    "id": "022208159",
                    "initials": " ",
                    "lastName": "Mr Elec Ramsey"
                },
                "safetyDetail": {
                    "lastElectricVisitDate": "2016-10-18"
                },
                "risks": [],
                "unsafeDetail": {
                    "report": "INTERNAL WIRING TESTING",
                    "conditionAsLeft": "AR",
                    "labelAttachedOrRemoved": "A",
                    "cappedOrTurnedOff": "C",
                    "ownedByCustomer": true,
                    "signatureObtained": false,
                    "letterLeft": false,
                    "ownersNameAndDetails": "**STAINES***",
                    "reasons": [
                        "SYSTP",
                        "ELSAF",
                        "ESELI"
                    ]
                }
            },
            "visit": {
                "id": "WMW00151142",
                "date": "2016-10-18T00:00:00Z",
                "earliestStartTime": "2016-10-18T08:00:00Z",
                "latestStartTime": "2016-10-18T18:00:00Z",
                "specialInstructions": "07459148851"
            },
            "tasks": [{
                "id": "1307517001001",
                "applianceId": "202230182",
                "jobType": "BE",
                "applianceType": "EWR",
                "chargeType": "NCHHEWI",
                "status": "D",
                "skill": "EI",
                "sequence": 2,
                "specialRequirement": "Special Requirement",
                "supportingText": "Internal wiring ",
                "activities": [{
                    "date": "2016-10-18",
                    "status": "IP",
                    "chargeableTime": 10,
                    "sequence": 1,
                    "workDuration": 10
                }, {
                    "status": "D",
                    "sequence": 2
                }]
            }]
        };

        let jsonJobHistory = <any>{
            "tasks": [{
                "id": "1311517001001",
                "jobType": "BE",
                "applianceType": "EWR",
                "chargeType": "NCHHEWI",
                "status": "I",
                "activities": [{
                    "date": "2016-10-17",
                    "status": "D"
                }]
            }, {
                "id": "1396517001001",
                "jobType": "BE",
                "applianceType": "EWR",
                "chargeType": "NCHHEWI",
                "status": "C",
                "activities": [{
                    "date": "2016-10-18",
                    "status": "C",
                    "engineerName": "Mark Millar"
                }]
            }],
            "appliances": [{
                "id": "202230182",
                "category": "A",
                "contractType": "HEWI",
                "contractExpiryDate": "2017-10-13",
                "applianceType": "EWR"
            }],
            "id": "1307517001"
        };

        it("can store and retrieve the api job model", (done) => {
            let storageService = new HemaStorage();

            storageService.set("myContainer", "myJob", jsonJob)
                .then(() => {
                    storageService.get<Job>("myContainer", "myJob")
                        .then((loadedObject) => {
                            expect(ObjectHelper.isComparable(jsonJob, loadedObject)).toBeTruthy();
                            done();
                        });
                });
        });

        it("can store and retrieve the api job history model", (done) => {
            let storageService = new HemaStorage();

            storageService.set("myContainer", "myJob", jsonJobHistory)
                .then(() => {
                    storageService.get<Job>("myContainer", "myJob")
                        .then((loadedObject) => {
                            expect(ObjectHelper.isComparable(jsonJobHistory, loadedObject)).toBeTruthy();
                            done();
                        });
                });
        });

        it("can store and retrieve the api update model", (done) => {
            let storageService = new HemaStorage();

            jobFactory.createJobBusinessModel(<IWorkListItem>{ id: "1307517001" }, jsonJob, jsonJobHistory)
                .then(job => {
                    jobFactory.createJobApiModel(job, <Engineer>{}, <Job>{})
                        .then((apiUpdateModel) => {
                            storageService.set("myContainer", "myJob", apiUpdateModel)
                                .then(() => {
                                    storageService.get<Job>("myContainer", "myJob")
                                        .then((loadedJob) => {
                                            expect(ObjectHelper.isComparable(apiUpdateModel, loadedJob)).toBeTruthy();
                                            done();
                                        });
                                });
                        });
                });
        });
    });

    describe("getJobStatusCode method", () => {

        let job = <Job>{
            tasks: [<Task>{}],
            jobNotDoingReason: JobNotDoingReason.taskNoAccessed
        };

        it("should return status code as 51 for activity status No Access", (done) => {
            job.tasks[0].status = "NA";
            jobFactory.getJobStatusCode(job).then(statusCode => {
                expect(statusCode).toBe("51");
                done();
            });
        });

        it("should return status code as 50 for activity status Not Visited/Other", (done) => {
            job.tasks[0].status = "VO";
            jobFactory.getJobStatusCode(job).then(statusCode => {
                expect(statusCode).toBe("50");
                done();
            })
        })
    });
});
