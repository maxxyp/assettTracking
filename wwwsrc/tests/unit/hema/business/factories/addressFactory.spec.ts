/// <reference path="../../../../../typings/app.d.ts" />

import {AddressFactory} from "../../../../../app/hema/business/factories/addressFactory";
import {Address as AddressBusinessModel} from "../../../../../app/hema/business/models/address";
import {IAddress as AddressApiModel} from "../../../../../app/hema/api/models/fft/jobs/IAddress";

describe("the AddressFactory module", () => {
    let addressFactory: AddressFactory;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        addressFactory = new AddressFactory();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(addressFactory).toBeDefined();
    });

    describe("createAddressBusinessModel method", () => {
        it("can create from undefined model", () => {
            let businessModel = addressFactory.createAddressBusinessModel(undefined);

            expect(businessModel).toBeDefined();
        });

        it("can create from empty model", () => {
            let address = <AddressApiModel>{};

            let businessModel = addressFactory.createAddressBusinessModel(address);

            expect(businessModel).toBeDefined();
        });

        it("can create from model with properties", () => {
            let address = <AddressApiModel>{};
            address.premisesName = "A House";
            // address.houseNumber = "1";
            address.flatNumber = "b";
            // address.line = ["a street", "a road"];
            // address.town = "Sometown";
            // address.county = "Somecounty";
            // address.postCodeOut = "SE1";
            address.postCodeIn = "1SE";
            // address.country = "UK";

            let businessModel = addressFactory.createAddressBusinessModel(address);

            expect(businessModel).toBeDefined();
            expect(businessModel.premisesName).toEqual("A House");
            // expect(businessModel.houseNumber).toEqual("1");
            expect(businessModel.flatNumber).toEqual("b");
            // expect(businessModel.line).toEqual(["a street", "a road"]);
            // expect(businessModel.town).toEqual("Sometown");
            // expect(businessModel.county).toEqual("Somecounty");
            // expect(businessModel.postCodeOut).toEqual("SE1");
            expect(businessModel.postCodeIn).toEqual("1SE");
            // expect(businessModel.postCode).toEqual("SE1 1SE");
            // expect(businessModel.country).toEqual("UK");
        });
    });

    describe("createContactApiModel method", () => {
        it("can create from undefined model", () => {
            let apiModel = addressFactory.createAddressApiModel(undefined);

            expect(apiModel).toBeDefined();
        });

        it("can create from an empty model", () => {
            let businessModel = <AddressBusinessModel>{};

            let apiModel = addressFactory.createAddressApiModel(businessModel);

            expect(apiModel).toBeDefined();
        });

        it("can create from a model with properties", () => {
            let businessModel = <AddressBusinessModel>{};
            businessModel.premisesName = "A House";
            businessModel.houseNumber = "1";
            businessModel.flatNumber = "b";
            businessModel.line = ["a street", "a road"];
            businessModel.town = "Sometown";
            businessModel.county = "Somecounty";
            businessModel.postCodeOut = "SE1";
            businessModel.postCodeIn = "1SE";
            businessModel.country = "UK";

            let apiModel = addressFactory.createAddressApiModel(businessModel);

            expect(apiModel).toBeDefined();
        });

        it("can create from a model with empty address lines", () => {
            let businessModel = <AddressBusinessModel>{};
            businessModel.line = [];

            let apiModel = addressFactory.createAddressApiModel(businessModel);

            expect(apiModel).toBeDefined();
            expect(apiModel.postCodeIn).toBeUndefined(); // should not be in api update, see #17582 DF_1286
        });
    });
});
