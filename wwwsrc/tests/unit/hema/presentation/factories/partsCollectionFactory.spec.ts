/// <reference path="../../../../../typings/app.d.ts" />

import { PartsCollectionFactory } from "../../../../../app/hema/presentation/factories/partsCollectionFactory";
import { JobPartsCollection } from '../../../../../app/hema/business/models/jobPartsCollection';

describe("the partsCollectionFactory factory", () => {
    let partsCollectionFactory: PartsCollectionFactory;

    beforeEach(() => {
        partsCollectionFactory = new PartsCollectionFactory();
    });

    it("can be created", () => {
        expect(partsCollectionFactory).toBeDefined();
    });

    describe("createPartsCollectionViewModel", () => {
        it("returns empty array if the businessModel is undefeind", () => {
            const result = partsCollectionFactory.createPartsCollectionViewModel(undefined);
            expect(result.length === 0).toBeTruthy();
        });

        it("returns viewModel", () => {
            const businessModel: JobPartsCollection[] = []
            const b1 = new JobPartsCollection();
            b1.id = "job1";
            b1.customer = {
                title: "title",
                firstName: "firstName",
                middleName: "middleName",
                lastName: "lastName",
                address: ["line1", "line2", "postcode"]
            };
            b1.parts = [{
                stockReferenceId: "stockReferenceId1",
                description: "description",
                quantity: 1
            },
            {
                stockReferenceId: "stockReferenceId2",
                description: "description",
                quantity: 2
            }];
            businessModel.push(b1);
            const result = partsCollectionFactory.createPartsCollectionViewModel(businessModel);
            expect(result.length === 1).toBeTruthy();
            expect(result[0].jobId === "job1").toBeTruthy();
            expect(result[0].customer).toBeDefined();
            expect(result[0].customer.contactName === "title firstName middleName lastName").toBeTruthy();
            expect(result[0].customer.shortAddress === "line1, line2, postcode").toBeTruthy();
            expect(result[0].parts.length === 2).toBeTruthy();
            expect(result[0].parts[0].stockReferenceId === "stockReferenceId1").toBeTruthy();
            expect(result[0].parts[0].description === "description").toBeTruthy();
            expect(result[0].parts[0].quantity === 1).toBeTruthy();
            expect(result[0].parts[1].stockReferenceId === "stockReferenceId2").toBeTruthy();
            expect(result[0].parts[1].description === "description").toBeTruthy();
            expect(result[0].parts[1].quantity === 2).toBeTruthy();            
        });
    });
});
