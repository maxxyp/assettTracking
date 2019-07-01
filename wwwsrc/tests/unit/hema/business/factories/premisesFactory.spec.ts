/// <reference path="../../../../../typings/app.d.ts" />

import {PremisesFactory} from "../../../../../app/hema/business/factories/premisesFactory";
import {AddressFactory} from "../../../../../app/hema/business/factories/addressFactory";
import {IPremises as PremisesApiModel} from "../../../../../app/hema/api/models/fft/jobs/IPremises";
import {Premises as PremisesBusinessModel} from "../../../../../app/hema/business/models/premises";
import {IAddress as AddressApiModel} from "../../../../../app/hema/api/models/fft/jobs/IAddress";
import {Address} from "../../../../../app/hema/business/models/address";

describe("the PremisesFactory module", () => {
    let premisesFactory: PremisesFactory;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        premisesFactory = new PremisesFactory(new AddressFactory());
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(premisesFactory).toBeDefined();
    });

    describe("createPremisesBusinessModel method", () => {
        it("can create from undefined model", () => {
            let businessModel = premisesFactory.createPremisesBusinessModel(undefined);

            expect(businessModel.id).toBeUndefined();
            expect(businessModel.accessInfo).toBeUndefined();
            expect(businessModel.address).toBeUndefined();
        });

        it("can create from empty model", () => {
            let apiModel = <PremisesApiModel>{};

            let businessModel = premisesFactory.createPremisesBusinessModel(apiModel);

            expect(businessModel.id).toBeUndefined();
            expect(businessModel.accessInfo).toBeUndefined();
            expect(businessModel.address).toBeUndefined();
        });

        it("can create from model with values", () => {
            let apiModel = <PremisesApiModel>{};
            apiModel.id = "123456";
            apiModel.specialAccessInstructions = "knock loudly";
            apiModel.address = <AddressApiModel>{};

            let businessModel = premisesFactory.createPremisesBusinessModel(apiModel);

            expect(businessModel.id).toEqual("123456");
            expect(businessModel.accessInfo).toEqual("knock loudly");
        });
    });

    describe("createPremisesApiModel method", () => {
        it("can create from undefined model", () => {
            let apiModel = premisesFactory.createPremisesApiModel(undefined);

            expect(apiModel.id).toBeUndefined();
            expect(apiModel.specialAccessInstructions).toBeUndefined();
            expect(apiModel.address).toBeUndefined();
        });

        it("can create from empty model", () => {
            let premisesBusinessModel = <PremisesBusinessModel>{};

            let apiModel = premisesFactory.createPremisesApiModel(premisesBusinessModel);

            expect(apiModel.id).toBeUndefined();
            expect(apiModel.specialAccessInstructions).toBeUndefined();
            expect(apiModel.address).toBeUndefined();
        });

        it("can create from model with property values", () => {
            let premisesBusinessModel = <PremisesBusinessModel>{};

            premisesBusinessModel.id = "123456";
            premisesBusinessModel.accessInfo = "knock loudly";
            premisesBusinessModel.address = <Address>{};

            let apiModel = premisesFactory.createPremisesApiModel(premisesBusinessModel);

            expect(apiModel.id).toEqual("123456");
            expect(apiModel.specialAccessInstructions).toBeUndefined();
            expect(apiModel.address).toBeDefined();
        });
    });
});
