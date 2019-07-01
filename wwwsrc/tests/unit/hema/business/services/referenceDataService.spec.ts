/// <reference path="../../../../../typings/app.d.ts" />

import { IReferenceDataService } from "../../../../../app/hema/business/services/interfaces/IReferenceDataService";
import { ReferenceDataService } from "../../../../../app/hema/business/services/referenceDataService";
import { IDatabaseService } from "../../../../../app/common/storage/IDatabaseService";
import { IFFTService } from "../../../../../app/hema/api/services/interfaces/IFFTService";
import { EventAggregator } from "aurelia-event-aggregator";
import { IAssetService } from "../../../../../app/common/core/services/IAssetService";
import { ReferenceIndex } from "../../../../../app/hema/business/models/reference/referenceIndex";
import { IListObject } from "../../../../../app/hema/api/models/fft/reference/IListObject";
import { IReferenceIndex } from "../../../../../app/hema/api/models/fft/reference/IReferenceIndex";
import * as Logging from "aurelia-logging";
import { IConfigurationService } from "../../../../../app/common/core/services/IConfigurationService";
import { IStorageService } from "../../../../../app/hema/business/services/interfaces/IStorageService";
import { DateHelper } from "../../../../../app/hema/core/dateHelper";
import { IReferenceDataGroup } from "../../../../../app/hema/api/models/fft/reference/IReferenceDataGroup";
import { IReferenceMeta } from "../../../../../app/hema/api/models/fft/reference/IReferenceMeta";
import { Engineer as EngineerBusinessModel } from "../../../../../app/hema/business/models/engineer";
import { ApiException } from "../../../../../app/common/resilience/apiException";
import { IReferenceDataConfiguration } from "../../../../../app/hema/business/services/interfaces/IReferenceDataConfiguration";
import { ReferenceDataManifest } from "../../../../../app/hema/business/models/reference/referenceDataManifest";
import { ITableIndex } from "../../../../../app/hema/business/models/reference/ITableIndex";

describe("the ReferenceDataService class", () => {
    let sandbox: Sinon.SinonSandbox;
    let refDataService: IReferenceDataService;
    let databaseServiceStub: IDatabaseService;
    let assetServiceStub: IAssetService;
    let fftServiceStub: IFFTService;
    let eventAggregatorStub: EventAggregator;
    let configurationServiceStub: IConfigurationService;
    let storageServiceStub: IStorageService;
    let referenceDataObject: IReferenceDataConfiguration;
    let referenceDataManifest: ReferenceDataManifest;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        databaseServiceStub = <IDatabaseService>{};
        databaseServiceStub.exists = sandbox.stub().resolves(true);
        databaseServiceStub.storeExists = sandbox.stub().resolves(true);
        databaseServiceStub.storeRemove = sandbox.stub().resolves(true);
        databaseServiceStub.getAll = sandbox.stub().resolves([{}]);
        databaseServiceStub.close = sandbox.stub().resolves(undefined);
        databaseServiceStub.destroy = sandbox.stub().resolves(undefined);

        fftServiceStub = <IFFTService>{};
        assetServiceStub = <IAssetService>{};
        assetServiceStub.loadJson = sandbox.stub().resolves(null);
        eventAggregatorStub = new EventAggregator();

        referenceDataObject = <IReferenceDataConfiguration>{
            targetReferenceDataTypes: ["refdatatype", "business"]
        };

        configurationServiceStub = <IConfigurationService>{};
        configurationServiceStub.getConfiguration = sandbox.stub().returns(referenceDataObject);

        storageServiceStub = <IStorageService>{};

        storageServiceStub.getLastSuccessfulSyncTime = sandbox.stub().resolves(1);
        storageServiceStub.setLastSuccessfulSyncTime = sandbox.stub().resolves(null);

        let engineerBusinessModel = new EngineerBusinessModel();
        engineerBusinessModel.id = "1111111";
        engineerBusinessModel.firstName = "Mark";
        engineerBusinessModel.lastName = "bar";
        engineerBusinessModel.phoneNumber = "1234567890";
        engineerBusinessModel.roles = [
            "d-Field-Engineer",
            "d-Field-Apprentice",
            "d-Field-Admin"
        ];
        engineerBusinessModel.isSignedOn = true;
        engineerBusinessModel.status = undefined;

        storageServiceStub.getEngineer = sandbox.stub().resolves(engineerBusinessModel);

        fftServiceStub.updateRemoteReferenceData = sandbox.stub().resolves(true);

        referenceDataManifest = <ReferenceDataManifest>{};

        let tableIndex: ITableIndex[] = [];
        tableIndex.push(<ITableIndex>{
            type: "consumableType",
            eTag: "0",
            sourceDocument: "refdatatype"
        });

        tableIndex.push(<ITableIndex>{
            type: "dataType",
            eTag: "0",
            sourceDocument: "business"
        });

        referenceDataManifest.all = sandbox.stub().returns(tableIndex);

        refDataService = new ReferenceDataService(databaseServiceStub, assetServiceStub, fftServiceStub, eventAggregatorStub,
            storageServiceStub, configurationServiceStub, referenceDataManifest);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(refDataService).toBeDefined();
    });

    it("initialise, loads from remote data", (done) => {
        let dataServiceOpenSpy: Sinon.SinonSpy = databaseServiceStub.open = sandbox.stub().resolves(true);
        let dataServiceGetAllSpy: Sinon.SinonSpy = databaseServiceStub.getAll = sandbox.stub().resolves(null);
        databaseServiceStub.removeAll = sandbox.stub().resolves(true);
        databaseServiceStub.setAll = sandbox.stub().resolves(true);
        let refIndex: IListObject = <IListObject>{
            etag: "ds34fd4ewf",
            documentName: "refDataType.json",
            lastModifiedDate: "2017-06-01T13:21:44Z"
        };
        let fftRemoteRefDataIndexSpy: Sinon.SinonSpy = fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().resolves([refIndex]);
        fftServiceStub.getRemoteReferenceDataCatalog = sandbox.stub().resolves({});
        refDataService.initialise().then(() => {
            expect(fftRemoteRefDataIndexSpy.calledOnce).toBeTruthy();
            expect(dataServiceOpenSpy.calledOnce).toBeTruthy();
            expect(dataServiceGetAllSpy.calledTwice).toBeTruthy();
            done();
        });
    });

    describe("remote data change", () => {

        let mockRemoteData: IReferenceDataGroup = <IReferenceDataGroup>{};
        let mockMeta: IReferenceMeta = <IReferenceMeta>{};
        let mockRemoteData2: IReferenceDataGroup = <IReferenceDataGroup>{};
        let mockMeta2: IReferenceMeta = <IReferenceMeta>{};

        let localRefIndex: ReferenceIndex = new ReferenceIndex();
        localRefIndex.eTag = "ds34fd4ewf";
        localRefIndex.container = "refdatatype";
        localRefIndex.tables = "consumableType";

        let mockData1 = {
            consumableType: [
                {
                    "consumableTypeDescription": "Kit - Throttle Jet - NG",
                    "stockReferenceId": "H99998"
                }]
        };

        let mockData2 = {
            dataType: [
                {
                    "description": "gas pipe",
                    "referenceId": "1232334"
                }]
        };

        let fftUpdateRemoteRefDataSpy: Sinon.SinonSpy;

        beforeEach(() => {
            mockMeta.currentMajorVersion = 1;
            mockMeta.currentMinorVersion = 2;
            mockMeta.sequence = 3;
            mockMeta.type = "refdatatype";

            mockRemoteData.meta = mockMeta;
            mockRemoteData.data = mockData1;

            mockRemoteData2.meta = mockMeta2;
            mockRemoteData2.data = mockData2;

            mockMeta2.currentMajorVersion = 2;
            mockMeta2.currentMinorVersion = 1;
            mockMeta2.sequence = 5;
            mockMeta2.type = "business";

            databaseServiceStub.open = sandbox.stub().resolves(true);
            databaseServiceStub.getAll = sandbox.stub().resolves([localRefIndex]);
            // databaseServiceStub.getAll = sandbox.stub().resolves((localRefIndexArray));

            databaseServiceStub.removeAll = sandbox.stub().resolves(true);
            databaseServiceStub.setAll = sandbox.stub().resolves(true);

            let refIndex: IListObject = <IListObject>{
                etag: "new",
                documentName: "refdatatype.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };
            fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().resolves([refIndex]);
            fftServiceStub.getRemoteReferenceDataCatalog = sandbox.stub().resolves((mockRemoteData));

            let getRemoteReferenceDataCatalogStub = fftServiceStub.getRemoteReferenceDataCatalog = sandbox.stub();
            getRemoteReferenceDataCatalogStub
                .withArgs("refdatatype").resolves(mockRemoteData)
                .withArgs("business").resolves(mockRemoteData2);

            fftUpdateRemoteRefDataSpy = fftServiceStub.updateRemoteReferenceData = sandbox.stub().resolves(true);
            sandbox.restore();
        });

        it("loads tables and meta data from remote data", (done) => {

            refDataService.initialise().then(() => {
                const result = refDataService.getVersions();
                // console.log(JSON.stringify(result, null, '\t'));

                const index = result.findIndex(r => r.table === "consumableType");
                const item = result[index];
                const { table, version, majorVersion, minorVersion, sequence, isLocal, lastModifiedDate, source } = item;

                expect(result).toBeDefined();
                expect(table).toEqual("consumableType");
                expect(majorVersion).toEqual(1);
                expect(minorVersion).toEqual(2);
                expect(sequence).toEqual(3);
                expect(version).toEqual("new");
                expect(isLocal).toEqual(false);
                expect(lastModifiedDate).toEqual("2017-06-01T13:21:44Z");
                expect(source).toEqual("refdatatype");
                done();
            });
        });

        it("should make call to notify endpoint for ref data version via endpoint", (done) => {

            let refIndex: IListObject = <IListObject>{
                etag: "new",
                documentName: "refdatatype.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };

            fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().resolves(([refIndex]));
            refDataService.initialise().then(() => {

                const arg = fftUpdateRemoteRefDataSpy.args[0][0];

                const { data } = arg;
                const { catalogueConfig } = data;

                const [firstItem] = catalogueConfig;
                const { engineerId, list } = firstItem;
                const [firstItemList] = list;
                const { documentName, majorVersion, minorVersion, sequenceNumber } = firstItemList;

                expect(fftUpdateRemoteRefDataSpy.callCount).toEqual(1);
                expect(list.length).toEqual(1);

                expect(engineerId).toEqual("1111111");
                expect(documentName).toEqual("refdatatype.json");

                // console.log(JSON.stringify(list, null, '\t'));

                expect(majorVersion).toEqual('1');
                expect(minorVersion).toEqual('2');
                expect(sequenceNumber).toEqual('3');
                done();
            });

        });

        it("should also handle multiple ref data version changes", (done) => {

            let refIndex: IListObject = <IListObject>{
                etag: "new",
                documentName: "refdatatype.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };

            let refIndex2: IListObject = <IListObject>{
                etag: "new",
                documentName: "business.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };

            let refIndex3: IListObject = <IListObject>{
                etag: "new",
                documentName: "should-not-retrieve.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };

            fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().resolves(([refIndex, refIndex2, refIndex3]));

            refDataService.initialise().then(() => {

                // const result = refDataService.getVersions();
                // console.log(JSON.stringify(result, null, '\t'));

                const arg = fftUpdateRemoteRefDataSpy.args[0][0];

                const { data } = arg;
                const { catalogueConfig } = data;

                const [firstItem] = catalogueConfig;
                const { list } = firstItem;

                const [firstItemList, secondItemList] = list;

                expect(fftUpdateRemoteRefDataSpy.callCount).toEqual(1);
                expect(list.length).toEqual(2);

                expect(firstItemList.documentName).toEqual("refdatatype.json");
                expect(firstItemList.majorVersion).toEqual('1');
                expect(firstItemList.minorVersion).toEqual('2');
                expect(firstItemList.sequenceNumber).toEqual('3');

                expect(secondItemList.documentName).toEqual("business.json");
                expect(secondItemList.majorVersion).toEqual('2');
                expect(secondItemList.minorVersion).toEqual('1');
                expect(secondItemList.sequenceNumber).toEqual('5');

                expect((fftServiceStub.getRemoteReferenceDataCatalog as Sinon.SinonSpy).calledWith("refdatatype")).toBe(true);
                expect((fftServiceStub.getRemoteReferenceDataCatalog as Sinon.SinonSpy).calledWith("business")).toBe(true);
                expect((fftServiceStub.getRemoteReferenceDataCatalog as Sinon.SinonSpy).calledWith("should-not-retrieve")).toBe(false);

                done();
            });

        });


        it("should send all docs even if only one change", (done) => {

            let refIndex: IListObject = <IListObject>{
                etag: "same",
                documentName: "refDataType.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };

            let refIndex2: IListObject = <IListObject>{
                etag: "diff",
                documentName: "business.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };

            let localRefIndex: ReferenceIndex = new ReferenceIndex();
            localRefIndex.eTag = "same";
            localRefIndex.container = "refDataType";
            localRefIndex.tables = "consumableType";
            localRefIndex.container = "refdatatype";

            let localRefIndex2: ReferenceIndex = new ReferenceIndex();
            localRefIndex2.eTag = "same";
            localRefIndex2.container = "business";
            localRefIndex2.tables = "dataType";
            localRefIndex2.container = "business";

            databaseServiceStub.getAll = sandbox.stub().resolves(([localRefIndex, localRefIndex2]));

            fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().resolves(([refIndex, refIndex2]));

            refDataService.initialise().then(() => {

                const arg = fftUpdateRemoteRefDataSpy.args[0][0];

                const { data } = arg;
                const { catalogueConfig } = data;

                const [firstItem] = catalogueConfig;
                const { list } = firstItem;

                expect(list.length).toEqual(2);
                done();
            });

        });


        it("does not make api call if no changes in ref data", (done) => {

            let refIndex: IListObject = <IListObject>{
                etag: "same",
                documentName: "refDataType.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };

            fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().resolves(([refIndex]));

            let localRefIndex: ReferenceIndex = new ReferenceIndex();
            localRefIndex.eTag = "same";
            localRefIndex.container = "container";
            localRefIndex.tables = "consumableType";
            localRefIndex.container = "refdatatype";

            databaseServiceStub.getAll = sandbox.stub().resolves(([localRefIndex]));

            refDataService.initialise().then(() => {
                expect(fftUpdateRemoteRefDataSpy.notCalled).toBe(true);
                done();
            });

        });

        it("makes api call if change in ref data", (done) => {

            let refIndex: IListObject = <IListObject>{
                etag: "same",
                documentName: "refDataType.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };

            fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().resolves(([refIndex]));

            let localRefIndex: ReferenceIndex = new ReferenceIndex();
            localRefIndex.eTag = "new";
            localRefIndex.container = "container";
            localRefIndex.tables = "consumableType";
            localRefIndex.container = "refdatatype";

            databaseServiceStub.getAll = sandbox.stub().resolves(([localRefIndex]));

            refDataService.initialise().then(() => {
                expect(fftUpdateRemoteRefDataSpy.called).toBe(true);
                done();
            });

        });

        it("can send api update call if one of the remote catalog call fails", done => {

            //get catalog list items
            let refIndex: IListObject = <IListObject>{
                etag: "new",
                documentName: "refDataType.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };

            let refIndex2: IListObject = <IListObject>{
                etag: "old",
                documentName: "business.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };

            // whats in local storage right now
            let localRefIndex: ReferenceIndex = new ReferenceIndex();
            localRefIndex.eTag = "old";
            localRefIndex.container = "refdatatype";
            localRefIndex.tables = "consumableType";
            localRefIndex.majorVersion = 1;
            localRefIndex.minorVersion = 2;
            localRefIndex.sequence = 3;

            let localRefIndex1: ReferenceIndex = new ReferenceIndex();
            localRefIndex1.eTag = "old";
            localRefIndex1.container = "business";
            localRefIndex1.tables = "dataType";
            localRefIndex1.majorVersion = 1;
            localRefIndex1.minorVersion = 2;
            localRefIndex1.sequence = 3;

            // mock calls
            databaseServiceStub.getAll = sandbox.stub().resolves([localRefIndex, localRefIndex1]);
            fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().resolves([refIndex, refIndex2]);


            let getRemoteReferenceDataCatalogStub = fftServiceStub.getRemoteReferenceDataCatalog = sandbox.stub();

            getRemoteReferenceDataCatalogStub
                .withArgs("refdatatype").rejects(new ApiException(null, "", "api error", null, null, null))
                .withArgs("business").resolves(mockRemoteData2);

            refDataService.initialise()
                .then(() => {
                    const arg = fftUpdateRemoteRefDataSpy.args[0][0];

                    const { data } = arg;
                    const { catalogueConfig } = data;

                    const [firstItem] = catalogueConfig;
                    const { list } = firstItem;

                    const [refDataTypeCatalog, businessCatalog] = list;

                    // we got one catalog call, one failed. We still need to send the old version of the failed catalog call
                    expect(list.length).toEqual(2);
                    expect(refDataTypeCatalog.documentName).toEqual("refdatatype.json");
                    expect(refDataTypeCatalog.majorVersion).toEqual("1");
                    expect(refDataTypeCatalog.minorVersion).toEqual("2");
                    expect(refDataTypeCatalog.sequenceNumber).toEqual("3");

                    expect(businessCatalog.documentName).toEqual("business.json");
                    expect(businessCatalog.majorVersion).toEqual("1");
                    expect(businessCatalog.minorVersion).toEqual("2");
                    expect(businessCatalog.sequenceNumber).toEqual("3");

                    done()
                });

        })

    });

    it("initialise, loads from local data", (done) => {
        let dataServiceOpenSpy: Sinon.SinonSpy = databaseServiceStub.open = sandbox.stub().resolves(true);
        let localRefIndexArray: ReferenceIndex[] = [];

        let localRefIndex: ReferenceIndex = new ReferenceIndex();
        localRefIndex.eTag = "ds34fd4ewf";
        localRefIndex.container = "refDataType";
        localRefIndex.tables = "consumableType";
        localRefIndexArray.push(localRefIndex);

        let dataServiceGetAllSpy: Sinon.SinonSpy = databaseServiceStub.getAll = sandbox.stub().resolves((localRefIndexArray));
        let remoteIndex: IListObject = <IListObject>{
            etag: "newetag",
            documentName: "refDataType.json",
            lastModifiedDate: "2017-07-01T13:21:44Z"
        };
        fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().resolves(([remoteIndex]));
        databaseServiceStub.removeAll = sandbox.stub().resolves(true);
        databaseServiceStub.setAll = sandbox.stub().resolves(true);
        fftServiceStub.getRemoteReferenceDataCatalog = sandbox.stub().resolves({});
        refDataService.initialise().then(() => {
            expect(dataServiceOpenSpy.calledOnce).toBeTruthy();
            expect(dataServiceGetAllSpy.calledTwice).toBeTruthy();
            done();
        });
    });

    it("getItems, returns items", (done) => {
        let localRefIndexArray: IReferenceIndex[] = [];
        let localRefIndex = <IReferenceIndex>{};
        localRefIndex.eTag = "ds34fd4ewf";
        localRefIndex.type = "refDataType";
        localRefIndexArray.push(localRefIndex);
        databaseServiceStub.getAll = sandbox.stub().resolves((localRefIndexArray));
        refDataService.getItems<IReferenceIndex>("storename", undefined, undefined).then((data) => {
            expect(data).toBeDefined();
            expect(data.length === 1).toBeDefined();
            done();
        });
    });

    it("getItems, rejects & logs error", (done) => {
        databaseServiceStub.getAll = sandbox.stub().returns(Promise.reject(""));

        let errorSpy = spyOn(Logging.getLogger("ReferenceDataService"), "error");
        refDataService.getItems<IReferenceIndex>("storename", undefined, undefined)
            .catch(() => {
                expect(errorSpy.calls.count()).toBe(1);
                done();
            });
    });

    it("getItem, returns an item", (done) => {
        let localRefIndex = <IReferenceIndex>{
            eTag: "ds34fd4ewf",
            type: "refDataType"
        };
        databaseServiceStub.get = sandbox.stub().resolves((localRefIndex));
        refDataService.getItem<IReferenceIndex>("storename", "key", "refDataType").then((data) => {
            expect(data).toBeDefined();
            expect(data.eTag).toEqual("ds34fd4ewf");
            expect(data.type).toEqual("refDataType");
            done();
        });
    });

    it("getItem, rejects & logs error", (done) => {
        databaseServiceStub.get = sandbox.stub().returns(Promise.reject(""));

        let errorSpy = spyOn(Logging.getLogger("ReferenceDataService"), "error");
        refDataService.getItem<IReferenceIndex>("storename", "key", "value")
            .catch(() => {
                expect(errorSpy.calls.count()).toBe(1);
                done();
            });
    });

    it("remote index removes duplicates and picks latest modified date", () => {
        let oldest = {
            documentName: "test.json",
            lastModifiedDate: "2017-06-01T12:21:44Z",
            etag: "oldest"
        };
        let newest = {
            documentName: "test.json",
            lastModifiedDate: "2017-06-01T14:21:44Z",
            etag: "newest"
        };
        let inbetween = {
            documentName: "test.json",
            lastModifiedDate: "2017-06-01T13:21:44Z",
            etag: "inbetween"
        };
        let error = {
            documentName: "test.txt",
            lastModifiedDate: undefined,
            etag: "i should be ignored"
        };

        let listObjects: IListObject[] = [error, oldest, newest, inbetween, error];
        let results = refDataService.generateCleanRemoteIndex(listObjects);
        expect(results.length).toEqual(1);
        expect(results[0].eTag).toBe("newest");
    });

    describe("shouldUserRefresh", () => {
        beforeEach(() => {
            configurationServiceStub.getConfiguration = sandbox.stub().resolves({ referenceDataStaleMinutes: 1440 });
            storageServiceStub.getLastSuccessfulSyncTime = sandbox.stub().resolves(9999);
            fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().resolves([]);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("returns false if reference data is not out of date", async done => {
            let msNotYetStale = 9999 + (1440 * 60 * 1000) - 1;
            DateHelper.getTimestampMs = sandbox.stub().returns(msNotYetStale);

            let shouldUserRefresh = await refDataService.shouldUserRefreshReferenceData();

            expect(shouldUserRefresh).toBe(false);
            expect((fftServiceStub.getRemoteReferenceDataIndex as Sinon.SinonStub).called).toBe(false);
            expect((storageServiceStub.setLastSuccessfulSyncTime as Sinon.SinonStub).called).toBe(false);
            done();
        });

        it("returns false if reference data is out of date but has not changed on server, and not check again", async done => {
            databaseServiceStub.open = sandbox.stub().resolves(true);
            databaseServiceStub.getAll = sandbox.stub().resolves(null);
            databaseServiceStub.removeAll = sandbox.stub().resolves(true);
            databaseServiceStub.setAll = sandbox.stub().resolves(true);
            let refIndex: IListObject = <IListObject>{
                etag: "ds34fd4ewf",
                documentName: "refDataType.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };
            fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().resolves(([refIndex]));
            fftServiceStub.getRemoteReferenceDataCatalog = sandbox.stub().resolves({});

            await refDataService.initialise();

            fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().resolves([refIndex]);
            let msNowStale = 9999 + (1440 * 60 * 1000);
            DateHelper.getTimestampMs = sandbox.stub().returns(msNowStale);

            let shouldUserRefresh = await refDataService.shouldUserRefreshReferenceData();

            expect(shouldUserRefresh).toBe(false);
            expect((fftServiceStub.getRemoteReferenceDataIndex as Sinon.SinonStub).calledOnce).toBe(true);

            // sets last sync time so the app will not check again for the configured time span
            expect((storageServiceStub.setLastSuccessfulSyncTime as Sinon.SinonStub).calledWith(msNowStale)).toBe(true);
            done();
        });


        it("returns true if reference data is out of date and has changed", async done => {
            databaseServiceStub.open = sandbox.stub().resolves(true);
            databaseServiceStub.getAll = sandbox.stub().resolves(null);
            databaseServiceStub.removeAll = sandbox.stub().resolves(true);
            databaseServiceStub.setAll = sandbox.stub().resolves(true);

            let refIndex: IListObject = <IListObject>{
                etag: "ds34fd4ewf",
                documentName: "refDataType.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };
            fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().resolves([refIndex]);
            fftServiceStub.getRemoteReferenceDataCatalog = sandbox.stub().resolves({});

            await refDataService.initialise();

            let refIndex2: IListObject = <IListObject>{
                etag: "ds34fd4ewf-HAS-CHANGED",
                documentName: "refDataType.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };

            fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().resolves([refIndex2]);
            let msNowStale = 9999 + (1440 * 60 * 1000);
            DateHelper.getTimestampMs = sandbox.stub().returns(msNowStale);

            let shouldUserRefresh = await refDataService.shouldUserRefreshReferenceData();

            expect(shouldUserRefresh).toBe(true);
            expect((fftServiceStub.getRemoteReferenceDataIndex as Sinon.SinonStub).called).toBe(true);
            expect((storageServiceStub.setLastSuccessfulSyncTime as Sinon.SinonStub).called).toBe(true);
            done();
        });

        it("returns false if reference list endpoint errors", async done => {
            fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().rejects({});

            let msNowStale = 9999 + (1440 * 60 * 1000);
            DateHelper.getTimestampMs = sandbox.stub().returns(msNowStale);

            let shouldUserRefresh = await refDataService.shouldUserRefreshReferenceData();

            expect(shouldUserRefresh).toBe(false);
            expect((fftServiceStub.getRemoteReferenceDataIndex as Sinon.SinonStub).called).toBe(true);
            expect((storageServiceStub.setLastSuccessfulSyncTime as Sinon.SinonStub).called).toBe(false);
            done();
        });

    });

    describe("clear", () => {
        it("closes and destroys the db", async done => {
            await refDataService.clear();
            let closeStub = databaseServiceStub.close as Sinon.SinonStub;
            let destroyStub = databaseServiceStub.destroy as Sinon.SinonStub;
            expect(closeStub.called).toBe(true);
            expect(destroyStub.called).toBe(true);
            expect(closeStub.calledBefore(destroyStub)).toBe(true);
            done();
        });
    });

    describe("shouldReferenceDataNeedsRetry", () => {
        let mockRemoteData: IReferenceDataGroup = <IReferenceDataGroup>{};
        let mockMeta: IReferenceMeta = <IReferenceMeta>{};

        let mockRemoteData1: IReferenceDataGroup = <IReferenceDataGroup>{};
        let mockMeta1: IReferenceMeta = <IReferenceMeta>{};

        let getRemoteReferenceDataCatalogStub;

        let localRefIndex: ReferenceIndex = new ReferenceIndex();
        localRefIndex.eTag = "ds34fd4ewf";
        localRefIndex.container = "business";
        localRefIndex.tables = "dataType";

        let localRefIndex1: ReferenceIndex = new ReferenceIndex();
        localRefIndex1.eTag = "ds34fdsf3";
        localRefIndex1.container = "refdatatype";
        localRefIndex1.tables = "consumableType";

        let mockData1 = {
            consumableType: [
                {
                    "consumableTypeDescription": "Kit - Throttle Jet - NG",
                    "stockReferenceId": "H99998"
                }]
        };

        let mockData2 = {
            dataType: [
                {
                    "description": "gas pipe",
                    "referenceId": "1232334"
                }]
        };

        beforeEach(() => {
            mockMeta.currentMajorVersion = 1;
            mockMeta.currentMinorVersion = 2;
            mockMeta.sequence = 3;
            mockMeta.type = "business";

            mockRemoteData.meta = mockMeta;
            mockRemoteData.data = mockData2;

            mockMeta1.currentMajorVersion = 4;
            mockMeta1.currentMinorVersion = 5;
            mockMeta1.sequence = 6;
            mockMeta1.type = "refdatatype";

            mockRemoteData1.meta = mockMeta1;
            mockRemoteData1.data = mockData1;

            databaseServiceStub.open = sandbox.stub().resolves(true);
            databaseServiceStub.getAll = sandbox.stub().resolves([]);

            databaseServiceStub.removeAll = sandbox.stub().resolves(true);
            databaseServiceStub.setAll = sandbox.stub().resolves(true);

            let refIndex: IListObject = <IListObject>{
                etag: "new",
                documentName: "business.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };

            let refIndex1: IListObject = <IListObject>{
                etag: "new",
                documentName: "refdatatype.json",
                lastModifiedDate: "2017-06-01T13:21:44Z"
            };
            fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().resolves([refIndex, refIndex1]);

            getRemoteReferenceDataCatalogStub = fftServiceStub.getRemoteReferenceDataCatalog = sandbox.stub();
            getRemoteReferenceDataCatalogStub
                .withArgs("business").resolves(mockRemoteData)
                .withArgs("refdatatype").resolves(mockRemoteData1);

            let tableIndex: ITableIndex[] = [];
            tableIndex.push(<ITableIndex>{
                type: "consumableType",
                eTag: "0",
                sourceDocument: "refdatatype"
            });

            tableIndex.push(<ITableIndex>{
                type: "dataType",
                eTag: "0",
                sourceDocument: "business"
            });

            tableIndex.push(<ITableIndex>{
                type: "jobType",
                eTag: "0",
                sourceDocument: "local"
            });

            referenceDataManifest.all = sandbox.stub().returns(tableIndex);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should throw an exception when app receives 500 from list end point", async (done) => {
            fftServiceStub.getRemoteReferenceDataIndex = sandbox.stub().throws(new ApiException("ResilientService", "", "", undefined, undefined));
            await refDataService.initialise()
                .catch(e => {
                    expect(e).toBeDefined();
                    done();
                })
        });

        it("LastSuccessfulSyncTime should be set to undefined when one of the referencedata end point return error", async done => {
            getRemoteReferenceDataCatalogStub
                .withArgs("business").rejects(new ApiException(null, "", "api error", null, null, null));
            storageServiceStub.getLastSuccessfulSyncTime = sandbox.stub().resolves(undefined);
            await refDataService.initialise();
            expect((storageServiceStub.setLastSuccessfulSyncTime as Sinon.SinonSpy).calledWith(undefined)).toBeTruthy();
            done();
        });

        it("LastSuccessfulSyncTime should be set when one of the referencedata end point return error but the last reference data sync was successful", async done => {
            getRemoteReferenceDataCatalogStub
                .withArgs("business").rejects(new ApiException(null, "", "api error", null, null, null));
            let msNowStale = 9999 + (1440 * 60 * 1000);
            DateHelper.getTimestampMs = sandbox.stub().returns(msNowStale);
            await refDataService.initialise();
            expect((storageServiceStub.setLastSuccessfulSyncTime as Sinon.SinonSpy).calledWith(msNowStale)).toBeTruthy();
            done();
        });

        it("LastSuccessfulSyncTime should be set to undefined  if any reference table data in the response is empty", async done => {
            mockRemoteData1.data = {};
            getRemoteReferenceDataCatalogStub
                .withArgs("refdatatype").resolves(mockRemoteData1);

            await refDataService.initialise();
            expect((storageServiceStub.setLastSuccessfulSyncTime as Sinon.SinonSpy).calledWith(undefined)).toBeTruthy();
            done();
        });

        it("it should update the reference data and LastSuccessfulSyncTime should be updated", async done => {
            let getAllStub = databaseServiceStub.getAll = sandbox.stub();
            getAllStub.withArgs("ref", "remoteReferenceIndex").resolves([localRefIndex, localRefIndex1])
                .withArgs("ref", "localReferenceIndex").resolves([]);
            let msNowStale = 9999 + (1440 * 60 * 1000);
            DateHelper.getTimestampMs = sandbox.stub().returns(msNowStale);

            await refDataService.initialise();
            expect((storageServiceStub.setLastSuccessfulSyncTime as Sinon.SinonStub).calledWith(msNowStale)).toBe(true);

            expect((databaseServiceStub.setAll as Sinon.SinonSpy).called).toBeTruthy();
            let catalogIndexArgs = (databaseServiceStub.setAll as Sinon.SinonSpy).args;
            expect(catalogIndexArgs.length).toEqual(5);
            expect(catalogIndexArgs[2][1]).toEqual("remoteReferenceIndex");
            expect((catalogIndexArgs[2][2] as ReferenceIndex[])[0].container).toEqual("business");
            expect((catalogIndexArgs[2][2] as ReferenceIndex[])[0].eTag).toEqual("new");
            expect((catalogIndexArgs[2][2] as ReferenceIndex[])[0].tables).toEqual("dataType");

            expect((catalogIndexArgs[2][2] as ReferenceIndex[])[1].container).toEqual("refdatatype");
            expect((catalogIndexArgs[2][2] as ReferenceIndex[])[1].eTag).toEqual("new");
            expect((catalogIndexArgs[2][2] as ReferenceIndex[])[1].tables).toEqual("consumableType");

            expect(catalogIndexArgs[4][1]).toEqual("localReferenceIndex");
            expect((catalogIndexArgs[4][2] as ReferenceIndex[])[0].container).toEqual("jobType");
            done();
        });

        it("etag should be undefined when the endpoint returns error respones", async done => {
            getRemoteReferenceDataCatalogStub
                .withArgs("business").rejects(new ApiException(null, "", "api error", null, null, null));

            await refDataService.initialise();
            expect((databaseServiceStub.setAll as Sinon.SinonSpy).called).toBeTruthy();
            let catalogIndexArgs: ReferenceIndex[] = (databaseServiceStub.setAll as Sinon.SinonSpy).args[1][2];
            expect(catalogIndexArgs.find(c => c.container === "business").eTag).toBeUndefined();
            done();
        });

        it("etag should not be undefined when the endpoint returns valid respones", async done => {
            let getAllStub = databaseServiceStub.getAll = sandbox.stub();
            getAllStub.withArgs("ref", "remoteReferenceIndex").resolves([localRefIndex, localRefIndex1])
                .withArgs("ref", "localReferenceIndex").resolves([]);
            await refDataService.initialise();
            expect((databaseServiceStub.setAll as Sinon.SinonSpy).called).toBeTruthy();
            let catalogIndexArgs: ReferenceIndex[] = (databaseServiceStub.setAll as Sinon.SinonSpy).args[2][2];
            expect(catalogIndexArgs.some(c => c.eTag === undefined)).toBeFalsy();
            done();
        });

        it("shouldUserRefreshReferenceData should return true", async done => {
            getRemoteReferenceDataCatalogStub
                .withArgs("business").rejects(new ApiException(null, "", "api error", null, null, null));
            storageServiceStub.getLastSuccessfulSyncTime = sandbox.stub().resolves(undefined);
            await refDataService.initialise();
            const shouldRefresh = await refDataService.shouldUserRefreshReferenceData();
            expect(shouldRefresh).toBeTruthy();
            done();
        });

        it("shouldUserRefreshReferenceData should return false", async done => {
            let getAllStub = databaseServiceStub.getAll = sandbox.stub();
            getAllStub.withArgs("ref", "remoteReferenceIndex").resolves([localRefIndex, localRefIndex1])
                .withArgs("ref", "localReferenceIndex").resolves([]);
            await refDataService.initialise();
            const shouldRefresh = await refDataService.shouldUserRefreshReferenceData();
            expect(shouldRefresh).toBeFalsy();
            done();
        });
    });
}); 
