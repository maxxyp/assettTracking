/// <reference path="../../../../../typings/app.d.ts" />

import {Address as AddressBusinessModel} from "../../../../../app/hema/business/models/address";
import {AddressMultiline} from "../../../../../app/hema/presentation/elements/addressMultiline";

describe("the AddressMultiline module", () => {
    let addressMultiline: AddressMultiline;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();    
        addressMultiline = new AddressMultiline();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(addressMultiline).toBeDefined();
    });

    it("can accept null address", () => {
        addressMultiline.activate(null);
        expect(addressMultiline.addressLines).toBeDefined();
        expect(addressMultiline.addressLines.length).toEqual(0);
    });

    it("can map fields correctly with house number", () => {
        let address = new AddressBusinessModel();
        address.premisesName = "The Mansion";
        address.houseNumber = "100";
        address.line = ["New Street", "New Village"];
        address.town = "New Town";
        address.county = "New County";
        address.postCode = "AB1 2CD";
        address.country = "England";

        addressMultiline.activate(address);
        expect(addressMultiline.addressLines).toBeDefined();
        expect(addressMultiline.addressLines.length).toEqual(7);
        expect(addressMultiline.addressLines[0]).toEqual("The Mansion");
        expect(addressMultiline.addressLines[1]).toEqual("100 New Street");
        expect(addressMultiline.addressLines[2]).toEqual("New Village");
        expect(addressMultiline.addressLines[3]).toEqual("New Town");
        expect(addressMultiline.addressLines[4]).toEqual("New County");
        expect(addressMultiline.addressLines[5]).toEqual("AB1 2CD");
        expect(addressMultiline.addressLines[6]).toEqual("England");
    });

    it("can map fields correctly with flat number", () => {
        let address = new AddressBusinessModel();
        address.premisesName = "The Mansion";
        address.flatNumber = "200";
        address.line = ["New Street", "New Village"];
        address.town = "New Town";
        address.county = "New County";
        address.postCode = "AB1 2CD";
        address.country = "England";

        addressMultiline.activate(address);
        expect(addressMultiline.addressLines).toBeDefined();
        expect(addressMultiline.addressLines.length).toEqual(7);
        expect(addressMultiline.addressLines[0]).toEqual("The Mansion");
        expect(addressMultiline.addressLines[1]).toEqual("200 New Street");
        expect(addressMultiline.addressLines[2]).toEqual("New Village");
        expect(addressMultiline.addressLines[3]).toEqual("New Town");
        expect(addressMultiline.addressLines[4]).toEqual("New County");
        expect(addressMultiline.addressLines[5]).toEqual("AB1 2CD");
        expect(addressMultiline.addressLines[6]).toEqual("England");
    });

    it("can map fields correctly with no premises or lines", () => {
        let address = new AddressBusinessModel();
        address.premisesName = null;
        address.line = null;
        address.town = "New Town";
        address.county = "New County";
        address.postCode = "AB1 2CD";
        address.country = "England";

        addressMultiline.activate(address);
        expect(addressMultiline.addressLines).toBeDefined();
        expect(addressMultiline.addressLines.length).toEqual(4);
        expect(addressMultiline.addressLines[0]).toEqual("New Town");
        expect(addressMultiline.addressLines[1]).toEqual("New County");
        expect(addressMultiline.addressLines[2]).toEqual("AB1 2CD");
        expect(addressMultiline.addressLines[3]).toEqual("England");
    });

    it("can map fields correctly with no lines", () => {
        let address = new AddressBusinessModel();
        address.premisesName = "The Mansion";
        address.line = null;
        address.town = "New Town";
        address.county = "New County";
        address.postCode = "AB1 2CD";
        address.country = "England";

        addressMultiline.activate(address);
        expect(addressMultiline.addressLines).toBeDefined();
        expect(addressMultiline.addressLines.length).toEqual(5);
        expect(addressMultiline.addressLines[0]).toEqual("The Mansion");
        expect(addressMultiline.addressLines[1]).toEqual("New Town");
        expect(addressMultiline.addressLines[2]).toEqual("New County");
        expect(addressMultiline.addressLines[3]).toEqual("AB1 2CD");
        expect(addressMultiline.addressLines[4]).toEqual("England");
    });

    it("can map fields correctly with no house of flat number", () => {
        let address = new AddressBusinessModel();
        address.premisesName = "The Mansion";
        address.line = ["New Street", "New Village"];
        address.town = "New Town";
        address.county = "New County";
        address.postCode = "AB1 2CD";
        address.country = "England";

        addressMultiline.activate(address);
        expect(addressMultiline.addressLines).toBeDefined();
        expect(addressMultiline.addressLines.length).toEqual(7);
        expect(addressMultiline.addressLines[0]).toEqual("The Mansion");
        expect(addressMultiline.addressLines[1]).toEqual("New Street");
        expect(addressMultiline.addressLines[2]).toEqual("New Village");
        expect(addressMultiline.addressLines[3]).toEqual("New Town");
        expect(addressMultiline.addressLines[4]).toEqual("New County");
        expect(addressMultiline.addressLines[5]).toEqual("AB1 2CD");
        expect(addressMultiline.addressLines[6]).toEqual("England");
    });

    it("can map fields correctly with house number but no lines", () => {
        let address = new AddressBusinessModel();
        address.premisesName = "The Mansion";
        address.houseNumber = "100";
        address.line = null;
        address.town = "New Town";
        address.county = "New County";
        address.postCode = "AB1 2CD";
        address.country = "England";

        addressMultiline.activate(address);
        expect(addressMultiline.addressLines).toBeDefined();
        expect(addressMultiline.addressLines.length).toEqual(6);
        expect(addressMultiline.addressLines[0]).toEqual("The Mansion");
        expect(addressMultiline.addressLines[1]).toEqual("100");
        expect(addressMultiline.addressLines[2]).toEqual("New Town");
        expect(addressMultiline.addressLines[3]).toEqual("New County");
        expect(addressMultiline.addressLines[4]).toEqual("AB1 2CD");
        expect(addressMultiline.addressLines[5]).toEqual("England");
    });
});
