/// <reference path="../../../../../typings/app.d.ts" />

import { IVanStockService as IApiVanStockService } from "../../../../../app/hema/api/services/interfaces/IVanStockService";
import { IStorageService } from "../../../../../app/hema/business/services/interfaces/IStorageService";
import { EventAggregator } from "aurelia-event-aggregator";
import { IConfigurationService } from "../../../../../app/common/core/services/IConfigurationService";
import { IVanStockEngine } from "../../../../../app/hema/business/services/interfaces/IVanStockEngine";
import { VanStockEngine } from "../../../../../app/hema/business/services/vanStockEngine";
import { EngineerServiceConstants } from "../../../../../app/hema/business/services/constants/engineerServiceConstants";
import { MaterialSearchResultOnline } from "../../../../../app/hema/business/models/materialSearchResultOnline";

describe("the VanStockEngine module", () => {
    let vanStockServiceStub: IApiVanStockService;
    let sandbox: Sinon.SinonSandbox;
    let storageServiceStub: IStorageService;
    let eventAggregator: EventAggregator;
    let configurationServiceStub: IConfigurationService;
    let vanStockEngine: IVanStockEngine;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        vanStockServiceStub = <IApiVanStockService> {};
        vanStockServiceStub.getHighValueTools = sandbox.stub().resolves(undefined);
        vanStockServiceStub.getEngineerMaterials = sandbox.stub().resolves(undefined);
        vanStockServiceStub.getEngineerActions = sandbox.stub().resolves(undefined);
        
        storageServiceStub = <IStorageService> {};
        storageServiceStub.getMaterialSearchResults = sandbox.stub().returns(undefined);
        storageServiceStub.setMaterialAdjustments = sandbox.stub();
        storageServiceStub.setMaterialHighValueTools = sandbox.stub();
        storageServiceStub.setMaterials = sandbox.stub();
        storageServiceStub.getMaterialAdjustments = sandbox.stub().returns(undefined);
        storageServiceStub.getMaterialHighValueTools = sandbox.stub().returns(undefined);
        storageServiceStub.getMaterialSearchResults = sandbox.stub().returns(undefined);
        storageServiceStub.getMaterials = sandbox.stub().returns(undefined);
        storageServiceStub.setMaterialSearchResults = sandbox.stub();

        configurationServiceStub = <IConfigurationService> {};
        configurationServiceStub.getConfiguration = sandbox.stub().returns({});

        eventAggregator = new EventAggregator();

        vanStockEngine = new VanStockEngine(vanStockServiceStub, storageServiceStub, eventAggregator, configurationServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should be defined", () => {
        expect(vanStockEngine).toBeDefined();
    });

    describe("initialise method", () => {
        it("should call intialise method", async (done) => {
            let initialiseSpy = sandbox.spy(vanStockEngine, "initialise");
            await vanStockEngine.initialise("1111111");
            expect(initialiseSpy.called).toBeTruthy();
            done();
        });

        it("should call VanStockService.getEngineerActions when a user is signed off", async (done) => {
            await vanStockEngine.initialise("1111111");
            eventAggregator.publish(EngineerServiceConstants.ENGINEER_SIGNED_ON_CHANGED, false);
            expect((vanStockServiceStub.getEngineerActions as Sinon.SinonSpy).called).toBeTruthy();
            done();
        });

        describe("Clearing material search results", () => {
            let searchResults;
            beforeEach(() => {
                searchResults = {                    
                    engineerId: "1111111",
                    timestamp: 1559574598046,
                    materialSearchResults: [<MaterialSearchResultOnline> {
                        completionStatus: "NOT_FOUND",
                        stockReferenceId: "757137",
                        summary: {},
                        results: [],
                        timestamp: 1559574598046
                    }]
                };

                storageServiceStub.getMaterialSearchResults = sandbox.stub().returns(searchResults);
            });

            afterEach(() => {
                sandbox.restore();
            });

            it("should clear & rebuild material search results cache if it's a different engineer login ", async (done) => {
                searchResults.engineerId = "0000050";
                await vanStockEngine.initialise("1111111");        
                const args = (storageServiceStub.setMaterialSearchResults as Sinon.SinonSpy).args;    
                expect((storageServiceStub.setMaterialSearchResults as Sinon.SinonSpy).called).toBeTruthy();
                expect(args[0][0].engineerId).toEqual("1111111");
                done();
            });
    
            it("should clear & rebuild material search results cache if the cache timestamp is expired", async (done) => {
                searchResults.timestamp = 11010101;
                await vanStockEngine.initialise("1111111");            
                const args = (storageServiceStub.setMaterialSearchResults as Sinon.SinonSpy).args;    
                expect((storageServiceStub.setMaterialSearchResults as Sinon.SinonSpy).called).toBeTruthy();
                expect(args[0][0].timestamp).not.toEqual("1559572620754");
                done();
            });
    
            it("shouldn't clear material search results cache as the cache timestamp is less than the cut off time", async (done) => {    
                searchResults.timestamp = (new Date()).getTime();   
                await vanStockEngine.initialise("1111111");        
                expect((storageServiceStub.setMaterialSearchResults as Sinon.SinonSpy).called).toBeFalsy();    
                done();
            });
        });  
        
        describe("Clearing material adjustments", () => {
            let adjustments;
            beforeEach(() => {
                adjustments = {
                    engineerId: "1111111",
                    timestamp: 1559574598046,
                    collections: [{
                        id: "1",
                        stockReferenceId: "386789",
                        quantity: "1",
                        jobId: "1384517002"
                    }],
                    inboundMaterialRequests: [{
                        date: 20170131,
                        description: "Pressure Relief Valve 3 Bar TOTE",
                        engineerId: "100000",
                        engineerName: "Kelvin Cripps",
                        engineerPhone: "0800 123456",
                        id: 8,
                        partnerRecordDate: 20190603,
                        partnerRecordTime: 12051274,
                        quantity: 1,
                        status: "FULFILLED_UNACKNOWLEDGED",
                        stockReferenceId: "386789",
                        time: 11223345,
                        history: []
                    }],
                    inboundMaterialTransfers: [],
                    outboundMaterialRequests: [{
                        date: 20170131,
                        description: "Flow Regulator 12 Ltr/Min",
                        engineerId: "100000",
                        engineerPhone: "0800 123456",
                        id: "9ac89d72-2603-cfad-c0a5-b3294550a6ff",
                        isUnread: false,
                        quantity: 1,
                        status: "FULFILLED_ACKNOWLEDGED",
                        stockReferenceId: "727427",
                        time: 11223346,
                        history: [{
                            status: "FULFILLED_ACKNOWLEDGED",
                            time: 11014339
                        }]
                    }],
                    outboundMaterialTransfers: [],
                    returns: [{
                        description: "Actuator For Diverter Valve",
                        history: [{status: "FULFILLED_UNACKNOWLEDGED", time: 12045014}],
                        id: "89776c3d-3024-110f-3f63-fa8e8e929882",
                        quantity: 1,
                        reason: "Material damaged",
                        status: "FULFILLED_UNACKNOWLEDGED",
                        stockReferenceId: "757137"
                    }]
                };

                storageServiceStub.getMaterialAdjustments = sandbox.stub().returns(adjustments);
            });

            afterEach(() => {
                sandbox.restore();
            });

            it("should call storageService.getMaterialAdjustments method", async (done) => {
                await vanStockEngine.initialise("1111111");            
                expect((storageServiceStub.getMaterialAdjustments as Sinon.SinonSpy).called).toBeTruthy();
                done();
            });

            it("should clear material adjustments if the cache timestamp is expired", async (done) => {
                adjustments.timestamp = 11010101;
                await vanStockEngine.initialise("1111111");            
                const args = (storageServiceStub.setMaterialAdjustments as Sinon.SinonSpy).firstCall.args;
                expect((storageServiceStub.setMaterialAdjustments as Sinon.SinonSpy).called).toBeTruthy();
                expect(args[0].yesterdaysReturns.length).toEqual(1);
                expect(args[0].returns.length).toEqual(0);
                done();
            });

            it("should clear material adjustments if it's a different engineer login ", async (done) => {
                adjustments.engineerId = "0000050";
                await vanStockEngine.initialise("1111111");            
                const args = (storageServiceStub.setMaterialAdjustments as Sinon.SinonSpy).firstCall.args;
                expect((storageServiceStub.setMaterialAdjustments as Sinon.SinonSpy).called).toBeTruthy();
                expect(args[0].engineerId).toEqual("1111111");
                expect(args[0].yesterdaysReturns.length).toBe(0);
                expect(args[0].returns.length).toEqual(0);
                done();
            });      
    
            it("shouldn't clear material adjustments as its timestamp is less than the cut off time", async (done) => { 
                adjustments.timestamp = (new Date()).getTime();   
                await vanStockEngine.initialise("1111111");    
                const args = (storageServiceStub.setMaterialAdjustments as Sinon.SinonSpy).firstCall.args;        
                expect(args[0].returns.length).toEqual(1);
                expect(args[0].yesterdaysReturns).toBeUndefined();
                done();
            });
        });

        describe("Rebuilding high value tools", () => {
            let hvTools;
            beforeEach(() => {
                hvTools = {                    
                    engineerId: "1111111",
                    timestamp: 1559574598046,
                    materialSearchResults: [{
                        description: "water pump",
                        materialCode: "1234567"
                    }]
                };

                storageServiceStub.getMaterialHighValueTools = sandbox.stub().returns(hvTools);

                const serverHVTools = [{
                    materialCode: "2345678",
                    materialDescription: "boiler switch"
                },{
                    materialDescription: "water pump",
                    materialCode: "1234567"
                }];
            
                vanStockServiceStub.getHighValueTools = sandbox.stub().resolves(serverHVTools);
            });

            afterEach(() => {
                sandbox.restore();
            });

            it("should call storageService.getMaterialHighValueTools method", async (done) => {
                await vanStockEngine.initialise("1111111");            
                expect((storageServiceStub.getMaterialHighValueTools as Sinon.SinonSpy).called).toBeTruthy();
                done();
            });

            it("should rebuild high value tools if it's a different engineer login ", async (done) => {
                hvTools.engineerId = "0000050";
                await vanStockEngine.initialise("1111111");        
                const args = (storageServiceStub.setMaterialHighValueTools as Sinon.SinonSpy).firstCall.args;  
                expect((vanStockServiceStub.getHighValueTools as Sinon.SinonSpy).called).toBeTruthy();
                expect((storageServiceStub.setMaterialHighValueTools as Sinon.SinonSpy).called).toBeTruthy();
                expect(args[0].engineerId).toEqual("1111111");
                expect(args[0].highValueTools.length).toEqual(2);
                done();
            });
    
            it("should rebuild high value tools if the cache timestamp is expired", async (done) => {
                hvTools.timestamp = 11010101;
                await vanStockEngine.initialise("1111111");            
                const args = (storageServiceStub.setMaterialHighValueTools as Sinon.SinonSpy).firstCall.args;  
                expect((vanStockServiceStub.getHighValueTools as Sinon.SinonSpy).called).toBeTruthy();
                expect((storageServiceStub.setMaterialHighValueTools as Sinon.SinonSpy).called).toBeTruthy();
                expect(args[0].engineerId).toEqual("1111111");
                expect(args[0].highValueTools.length).toEqual(2);
                done();
            });
    
            it("shouldn't rebuild high value tools as the cache timestamp is less than the cut off time", async (done) => {    
                hvTools.timestamp = (new Date()).getTime();   
                await vanStockEngine.initialise("1111111");        
                expect((storageServiceStub.setMaterialHighValueTools as Sinon.SinonSpy).called).toBeFalsy();    
                done();
            }); 
        });

        describe("Rebuilding materials", () => {
            let materials;
            beforeEach(() => {
                materials = {                    
                    engineerId: "1111111",
                    timestamp: 1559574598046,
                    materials: [{
                        description: "water pump",
                        stockReferenceId: "1234567",
                        quantity: 1,
                        owner: "BGS",
                        area: "A"
                    }]
                };

                storageServiceStub.getMaterials = sandbox.stub().returns(materials);

                const serverMaterials = [{
                    materials: [...materials.materials, {
                        description: "boiler switch",
                        stockReferenceId: "2345678",
                        quantity: 2,
                        owner: "BGS",
                        area: "B"
                    }]
                }];
            
                vanStockServiceStub.getEngineerMaterials = sandbox.stub().resolves(serverMaterials);
            });

            afterEach(() => {
                sandbox.restore();
            });

            it("should call storageService.getMaterials method", async (done) => {
                await vanStockEngine.initialise("1111111");            
                expect((storageServiceStub.getMaterials as Sinon.SinonSpy).called).toBeTruthy();
                done();
            });

            it("should rebuild materials if it's a different engineer login ", async (done) => {
                materials.engineerId = "0000050";
                materials.timestamp = (new Date()).getTime();   
                await vanStockEngine.initialise("1111111");        
                const args = (storageServiceStub.setMaterials as Sinon.SinonSpy).secondCall.args;  
                expect((vanStockServiceStub.getEngineerMaterials as Sinon.SinonSpy).called).toBeTruthy();
                expect((storageServiceStub.setMaterials as Sinon.SinonSpy).called).toBeTruthy();
                expect(args[0].materials.length).toEqual(2);
                done();
            });
    
            it("should rebuild materials if the cache timestamp is expired", async (done) => {
                materials.timestamp = 11010101;
                await vanStockEngine.initialise("1111111");            
                const args = (storageServiceStub.setMaterials as Sinon.SinonSpy).secondCall.args;  
                expect((vanStockServiceStub.getEngineerMaterials as Sinon.SinonSpy).called).toBeTruthy();
                expect((storageServiceStub.setMaterials as Sinon.SinonSpy).called).toBeTruthy();
                expect(args[0].engineerId).toEqual("1111111");
                expect(args[0].materials.length).toEqual(2);
                done();
            });
    
            it("shouldn't rebuild materials as the cache timestamp is less than the cut off time", async (done) => {    
                materials.timestamp = (new Date()).getTime();     
                await vanStockEngine.initialise("1111111");        
                expect((storageServiceStub.setMaterialHighValueTools as Sinon.SinonSpy).called).toBeFalsy();    
                done();
            });
        });

        describe("Applying remote actions", () => {

        });
    });
});
