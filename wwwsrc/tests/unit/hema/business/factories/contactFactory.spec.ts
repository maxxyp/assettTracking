/// <reference path="../../../../../typings/app.d.ts" />

import {ContactFactory} from "../../../../../app/hema/business/factories/contactFactory";
import {IContact as ContactApiModel} from "../../../../../app/hema/api/models/fft/jobs/IContact";
import {Contact as ContactBusinessModel} from "../../../../../app/hema/business/models/contact";

describe("the ContactFactory module", () => {
    let contactFactory: ContactFactory;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        contactFactory = new ContactFactory();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(contactFactory).toBeDefined();
    });

    describe("createContactBusinessModel method", () => {
        it("can create from undefined model", () => {
            let businessModel = contactFactory.createContactBusinessModel(undefined);

            expect(businessModel).toBeDefined();
        });

        it("can create from empty model", () => {
            let contact = <ContactApiModel>{};

            let businessModel = contactFactory.createContactBusinessModel(contact);

            expect(businessModel).toBeDefined();
        });

        it("can create from model with properties", () => {
            let contact = <ContactApiModel>{};
            contact.id = "123456";
            contact.password = "P@SSW0RD";
            contact.initials = "JAS";
            contact.title = "Mr";
            contact.firstName = "John";
            contact.middleName = "Archibald";
            contact.lastName = "Smith";
            contact.homePhone = "1234567890";
            contact.workPhone = "0987654321";

            let businessModel = contactFactory.createContactBusinessModel(contact);

            expect(businessModel).toBeDefined();
            expect(businessModel.id).toEqual("123456");
            expect(businessModel.password).toEqual("P@SSW0RD");
            expect(businessModel.initials).toBeUndefined(); // should not be in api update, see #17582 DF_1286
            expect(businessModel.title).toEqual("Mr");
            expect(businessModel.firstName).toEqual("John");
            expect(businessModel.middleName).toEqual("Archibald");
            expect(businessModel.lastName).toEqual("Smith");
            expect(businessModel.homePhone).toEqual("1234567890");
            expect(businessModel.workPhone).toEqual("0987654321");
        });
    });

    describe("createContactApiModel method", () => {
        it("can create from undefined model", () => {
            let apiModel = contactFactory.createContactApiModel(undefined);

            expect(apiModel).toBeDefined();
        });

        it("can create from an empty model", () => {
            let businessModel = <ContactBusinessModel>{};

            let apiModel = contactFactory.createContactApiModel(businessModel);

            expect(apiModel).toBeDefined();
        });

        it("can create from a model with properties", () => {
            let businessModel = <ContactBusinessModel>{};
            businessModel.id = "123456";
            businessModel.password = "P@SSW0RD";
            businessModel.initials = "JAS";
            businessModel.title = "Mr";
            businessModel.firstName = "John";
            businessModel.middleName = "Archibald";
            businessModel.lastName = "Smith";
            businessModel.homePhone = "1234567890";
            businessModel.workPhone = "0987654321";

            let apiModel = contactFactory.createContactApiModel(businessModel);

            expect(apiModel).toBeDefined();
            expect(apiModel.id).toEqual("123456");
            expect(apiModel.password).toBeUndefined();
            expect(apiModel.initials).toBeUndefined();
            expect(apiModel.title).toBeUndefined();
            expect(apiModel.firstName).toBeUndefined();
            expect(apiModel.middleName).toBeUndefined();
            expect(apiModel.lastName).toBeUndefined();
            expect(apiModel.homePhone).toBeUndefined();
            expect(apiModel.workPhone).toBeUndefined();
            expect(apiModel.contactUpdatedMarker).toEqual("A");
        });
    });
});
