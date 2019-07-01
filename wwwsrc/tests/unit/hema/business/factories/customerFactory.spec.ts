/// <reference path="../../../../../typings/app.d.ts" />

import { IAddressFactory } from "../../../../../app/hema/business/factories/interfaces/IAddressFactory";
import { ICustomerFactory } from "../../../../../app/hema/business/factories/interfaces/ICustomerFactory";
import { CustomerFactory } from "../../../../../app/hema/business/factories/customerFactory";
import { ICustomer } from "../../../../../app/hema/api/models/fft/jobs/ICustomer";
import {IAddress} from "../../../../../app/hema/api/models/fft/jobs/IAddress";
import {Address} from "../../../../../app/hema/business/models/address";

describe("the CustomerFactory module", () => {
    let sandbox: Sinon.SinonSandbox;
    let customerFactory: ICustomerFactory;    
    let addressFactoryStub: IAddressFactory;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        addressFactoryStub = <IAddressFactory>{};
        addressFactoryStub.createAddressBusinessModel = sandbox.stub().returns(<Address>{});
        customerFactory = new CustomerFactory(addressFactoryStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(customerFactory).toBeDefined();
    });

    describe("the createCustomerContactBusinessModel function", () => {
        it("can create customer business model", () => {
            let customer: ICustomer = <ICustomer>{};
            customer.id = "1";
            customer.firstName = "firstName";
            customer.middleName = "middleName";            
            customer.lastName = "lastName";            
            customer.initials = "initials";            
            customer.password = "password";            
            customer.title = "title";            
            customer.workPhone = "workPhone";            
            customer.homePhone = "homePhone";            
            customer.address = <IAddress>{};
            let businessModel = customerFactory.createCustomerContactBusinessModel(customer);
            expect(businessModel).toBeDefined();
            expect(businessModel.id).toBeDefined();
            expect(businessModel.id === "1").toBeTruthy();
            expect(businessModel.firstName === "firstName").toBeTruthy();
            expect(businessModel.middleName === "middleName").toBeTruthy();
            expect(businessModel.lastName === "lastName").toBeTruthy();
            expect(businessModel.initials === "initials").toBeTruthy();
            expect(businessModel.password === "password").toBeTruthy();
            expect(businessModel.title === "title").toBeTruthy();
            expect(businessModel.workPhone === "workPhone").toBeTruthy();
            expect(businessModel.homePhone === "homePhone").toBeTruthy();
            expect(businessModel.address).toBeDefined();
        });
    });    
});
