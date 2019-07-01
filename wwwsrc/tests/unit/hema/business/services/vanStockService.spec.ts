/// <reference path="../../../../../typings/app.d.ts" />

import { VanStockService } from "../../../../../app/hema/business/services/vanStockService";
import { VanStockPatchFactory } from "../../../../../app/hema/business/factories/vanStockPatchFactory";
import { VanStockPatch } from "../../../../../app/hema/business/models/vanStockPatch";
import { IVanStockService } from "../../../../../app/hema/api/services/interfaces/IVanStockService";
import { IVanStockEngine } from "../../../../../app/hema/business/services/interfaces/IVanStockEngine";

describe("the VanStockService module", () => {
    let vanStockService: VanStockService;
    let sandbox: Sinon.SinonSandbox;
    let apiVanStockServiceStub: IVanStockService;
    let vanStockPatchFactory: VanStockPatchFactory;
    let vanStockEngineStub: IVanStockEngine;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        let vanStockCat = <VanStockPatch>
            {
                "patchCode": "1a",
                "engineers": [
                    {
                        "engineerId": "0163403",
                        "name": "Boo-Boo, Bear  BG/D/I",
                        "phone": "07555576166",
                        "parts": [
                            "663393",
                            "664765",
                            "E41743",
                            "787694",
                            "787708",
                            "H75313",
                            "505868",
                            "520189",
                            "675932",
                            "640222",
                            "H88492",
                            "649099",
                            "652094"
                        ]
                    },
                    {
                        "engineerId": "0051863",
                        "name": "Foghorn, Pig  BG/D/I",
                        "phone": "07555795666",
                        "parts": [
                            "503671",
                            "655820",
                            "662113",
                            "662373",
                            "663393",
                            "681682",
                            "773229",
                            "E41743",
                            "505868",
                            "669844",
                            "H44193",
                            "684498",
                            "520189",
                            "H88484"
                        ]
                    }
                ]
            };

        let localVanStock =
            [{ "stockReferenceId": "386789", "description": "Pressure Relief Valve 3 Bar TOTE", "quantity": 1, "amount": 2.98 }, { "stockReferenceId": "H40266", "description": "O Ring Seal 31.2x25.5x2.9mm", "quantity": 1, "amount": 1.52 }, { "stockReferenceId": "727427", "description": "Flow Regulator 12 Ltr/Min", "quantity": 1, "amount": 20.23 }, { "stockReferenceId": "E67497", "description": "Gas Valve VK4115V 1071", "quantity": 1, "amount": 70.5 }, { "stockReferenceId": "724870", "description": "Hydroblock - Turbine & Magnet", "quantity": 1, "amount": 11.53 }]


        apiVanStockServiceStub = <IVanStockService>{};
        vanStockPatchFactory = new VanStockPatchFactory();
        apiVanStockServiceStub.getVanstockPatch = sandbox.stub().returns(Promise.resolve(vanStockCat));
        apiVanStockServiceStub.getEngineerMaterials = sandbox.stub().returns(Promise.resolve(localVanStock));
        vanStockEngineStub = <IVanStockEngine>{};
        vanStockService = new VanStockService(apiVanStockServiceStub, vanStockPatchFactory, vanStockEngineStub)

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(vanStockService).toBeDefined();
    });

    // describe("getEngineer", () => {
    //     it("can be called and return engineer", (done) => {
    //         vanStockService.getEngineer("0051863", "1a", "PatchES").then((engineer) => {
    //             expect(engineer.name).toEqual("Foghorn, Pig  BG/D/I");
    //             done();
    //         });
    //     });

    //     it("can be called and error when appliance id does not exist", (done) => {
    //         vanStockService.getEngineer("666", "1a", "PatchES").catch((err) => {
    //             done();
    //         });
    //     });
    // });
    // describe("gcCodeLookup", () => {
    //     it("can be called and return matching engineer", (done) => {
    //         vanStockService.gcCodeLookup("640222", "1a", "PatchES").then((engineers) => {
    //             expect(engineers.length).toEqual(1);
    //             done();
    //         });
    //     });
    //     it("can be called and return matching engineers", (done) => {
    //         vanStockService.gcCodeLookup("E41743", "1a", "PatchES").then((engineers) => {
    //             expect(engineers.length).toEqual(2);
    //             done();
    //         });
    //     });
    //     it("can be called and return empty engineer for invalid part", (done) => {
    //         vanStockService.gcCodeLookup("XXX", "1a", "PatchES").then((engineers) => {
    //             expect(engineers.length).toEqual(0);
    //             done();
    //         });
    //     });
    // });

    // describe(("populateEngineerVanStock"), () => {
    //     it("set van stock to local storage", async (done) => {
    //         storageServiceStub.setEngineerVanStock = sandbox.stub().returns(Promise.resolve());
    //         await vanStockService.populateEngineerVanStock("1234");
    //         done();
    //     });
    // });
});


