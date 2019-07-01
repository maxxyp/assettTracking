/// <reference path="../../../../../typings/app.d.ts" />

import {VanStockPatchFactory} from "../../../../../app/hema/business/factories/vanStockPatchFactory";
import {IVanStockPatch} from "../../../../../app/hema/api/models/vanStock/IVanStockPatch";
describe("the VanStockPatchFactory module", () => {
    let vanStockPatchFactory: VanStockPatchFactory;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        vanStockPatchFactory = new VanStockPatchFactory();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(vanStockPatchFactory).toBeDefined();
    });

    it("can create vanStockPatch business model", () => {
        let newVanStockPatch: IVanStockPatch = {
            patchCode: "1a",
            engineers: [
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

        let businessModel = vanStockPatchFactory.createVanStockPatchBusinessModel(newVanStockPatch);

        expect(businessModel).toBeDefined();
        expect(businessModel.patchCode).toBe(newVanStockPatch.patchCode);
        expect(businessModel.engineers).toBe(newVanStockPatch.engineers);
    });

    it("can create empty vanStockPatch business model", () => {
        let newVanStockPatch: IVanStockPatch 
        let businessModel = vanStockPatchFactory.createVanStockPatchBusinessModel(newVanStockPatch);

        expect(businessModel).toBeDefined();
        expect(businessModel.patchCode).toBeUndefined();
        expect(businessModel.engineers).toBeUndefined();
    });
});
