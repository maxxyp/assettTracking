/// <reference path="../../../../../typings/app.d.ts" />

import { Job } from "../../../../../app/hema/business/models/job";
import { JobState } from "../../../../../app/hema/business/models/jobState";
import * as bignumber from "bignumber";

describe("the Job module", () => {
    let job: Job;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        job = new Job();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(job).toBeDefined();
    });

    describe("isActive", () => {
        it("can tell a job is active if en-route", () => {
            job.state = JobState.enRoute;
            expect(Job.isActive(job)).toBe(true);
        });

        it("can tell a job is active if arrived", () => {
            job.state = JobState.arrived;
            expect(Job.isActive(job)).toBe(true);
        });

        it("can tell a job is not active if idle", () => {
            job.state = JobState.idle;
            expect(Job.isActive(job)).toBe(false);
        });

        it("can tell a job is not active if done", () => {
            job.state = JobState.done;
            expect(Job.isActive(job)).toBe(false);
        });
    });

    describe("hasHazardAndRisk", () => {
        it("can flag as has hazard", () => {
            let job = <Job>{
                risks: [{ isHazard: true }]
            };

            expect(Job.hasHazardAndRisk(job)).toEqual({ hasHazard: true, hasRisk: false });
        });

        it("can flag as has risk", () => {
            let job = <Job>{
                risks: [{ isHazard: false }]
            };

            expect(Job.hasHazardAndRisk(job)).toEqual({ hasHazard: false, hasRisk: true });
        })

        it("can flag as has hazard and has risk", () => {
            let job = <Job>{
                risks: [{ isHazard: false }, { isHazard: true }]
            };

            expect(Job.hasHazardAndRisk(job)).toEqual({ hasHazard: true, hasRisk: true });
        })

    });

    describe("isLandlordJob", () => {

        let job: Job;


        beforeEach(() => {
            job = <Job>{
                tasks: [
                    {
                        jobType: "FOO",
                        applianceType: "BAR"
                    },
                    {
                        jobType: "AS",
                        applianceType: "INS"
                    }
                ]
            };
        });

        it("will ignore cancelled tasks", () => {
            job.tasks[1].isNotDoingTask = true;
            expect(Job.isLandlordJob(job)).toBe(false);
        });

        it("will ignore non-AS tasks", () => {
            job.tasks[1].jobType = "IB";
            expect(Job.isLandlordJob(job)).toBe(false);
        });

        it("will ignore non-INS tasks", () => {
            job.tasks[1].applianceType = "CHB";
            expect(Job.isLandlordJob(job)).toBe(false);
        });

        it("will identify landlord jobs", () => {
            expect(Job.isLandlordJob(job)).toBe(true);
        })
    });

    describe("fromJson", () => {

        let hydratedJob: Job;
        const rawJob = {
            "state": 0,
            "isInstPremJob": false,
            "id": "1319414267",
            "dispatchTime": "2016-03-05T00:00:00.000Z",
            "jobType": 0,
            "isLandlordJob": true,
            "appointment": {
                "promisedDate": "2016-03-05T00:00:00.000Z"
            },
            "enrouteTime": "2016-03-05T00:00:00.000Z",
            "onsiteTime": "2016-03-05T00:00:00.000Z",
            "completionTime": "2016-03-05T00:00:00.000Z",
            "pendingTime": "2016-03-05T00:00:00.000Z",
            "allocationTime": "2016-03-05T00:00:00.000Z",
            "holdTime": "2016-03-05T00:00:00.000Z",
            "cancellationTime": "2016-03-05T00:00:00.000Z",
            "customerId": "007d9437d4248e84d4072e70693b790a200b42e9a908be7fb5469f4baada6217",
            "customerContact": {
                "id": "007d9437d4248e84d4072e70693b790a200b42e9a908be7fb5469f4baada6217",
                "password": "July12",
                "initials": "JS",
                "title": "Mr",
                "firstName": "John",
                "middleName": "M",
                "lastName": "Smith Land Lord",
                "homePhone": "01234545411",
                "workPhone": "01235444531",
                "address": {
                    "houseNumber": "69",
                    "line": ["Lawson Street"],
                    "county": "Leicester",
                    "postCodeOut": "LE2",
                    "postCodeIn": "7QE",
                    "postCode": "LE2 7QE"
                }
            },
            "customerAddress": {
                "houseNumber": "69",
                "line": ["Lawson Street"],
                "county": "Leicester",
                "postCodeOut": "LE2",
                "postCodeIn": "7QE",
                "postCode": "LE2 7QE"
            },
            "premises": {
                "id": "453d772de1eadfa128c0e74402023fb9b98b3d855dfc36d6feb55337e0a974c0",
                "accessInfo": "Gate Passcode 0045",
                "address": {
                    "houseNumber": "1A",
                    "line": ["The Grand road", "Little Street"],
                    "town": "New Town",
                    "county": "London",
                    "postCodeOut": "TW19",
                    "postCodeIn": "3AR",
                    "postCode": "TW19 3AR",
                    "country": "United Kingdom"
                }
            },
            "contact": {
                "id": "2113635",
                "password": "July12",
                "initials": "JB",
                "title": "Mr",
                "firstName": "John",
                "middleName": "A",
                "lastName": "Bower",
                "homePhone": "0123543432",
                "workPhone": "0181 212565"
            },
            "risks": [{
                "dataState": 1,
                "dataStateGroup": "risks",
                "dataStateId": "59378639-4e67-d95a-bc33-1f72304ae327",
                "id": "ddceb080-f5fd-9540-2d54-a4cf300c40a5",
                "reason": "R1",
                "report": "BIG DOG",
                "date": "2016-01-03T00:00:00.000Z",
                "isHazard": false
            }, {
                "dataState": 1,
                "dataStateGroup": "risks",
                "dataStateId": "e570c721-9cf7-71dc-84d4-d0ce9caa8da8",
                "id": "298794b5-3a89-f04b-8999-b75ecb0ed1b3",
                "reason": "R2",
                "report": "BIG CAT",
                "date": "2016-03-05T00:00:00.000Z",
                "isHazard": false
            }, {
                "dataState": 1,
                "dataStateGroup": "risks",
                "dataStateId": "2d15172e-162b-f823-9037-079ced42e9e8",
                "id": "92973624",
                "reason": "HAZ",
                "report": "attic",
                "date": "2000-01-01T00:00:00.000Z",
                "isHazard": true
            }],
            "deletedRisks": [{
                "dataState": 1,
                "dataStateGroup": "risks",
                "dataStateId": "59378639-4e67-d95a-bc33-1f72304ae327",
                "id": "ddceb080-f5fd-9540-2d54-a4cf300c40a5",
                "reason": "R1",
                "report": "BIG DOG",
                "date": "2016-01-03T00:00:00.000Z",
                "isHazard": false
            }],
            "visit": {
                "id": "MW01233216",
                "timeSlotFrom": "2016-06-13T07:00:00.000Z",
                "timeSlotTo": "2016-06-13T11:00:00.000Z",
                "specialInstructions": "Parking OK : Call 0123123132 boiler making noise when turning on"
            },
            "tasksNotToday": [{
                "dataState": 1,
                "dataStateGroup": "tasks",
                "dataStateId": "d7e2e2de-ca60-9cee-4277-7d7156070a90",
                "deleted": false,
                "isNewRFA": false,
                "id": "1319414267001",
                "jobType": "HU",
                "applianceType": "BBF",
                "applianceId": "00000001",
                "chargeType": "NCH3SIS",
                "specialRequirement": "All Ok",
                "supportingText": "boiler is making noise when turning on",
                "sequence": 2,
                "previousVisits": [{
                    "date": "2016-01-01T00:00:00Z",
                    "report": "All OK",
                    "status": "D",
                    "engineerName": "Jack Smith"
                }],
                "fixedPriceQuotationAmount": 1.23,
                "discountCode": "AL",
                "isPotentiallyPartLJReportable": true,
                "activities": [{
                    "date": "2016-01-01T00:00:00.000Z",
                    "status": "D",
                    "engineerName": "Jack Smith",
                    "report": "All OK",
                    "workDuration": 60,
                    "parts": [{
                        "patchVanStockEngineers": [],
                        "isInPatchVanStock": false,
                        "warrantyReturn": {},
                        "notUsedReturn": {},
                        "isWarrantyReturnOptionAvailable": true,
                        "isConsumable": false,
                        "isFavourite": false,
                        "isValid": false,
                        "isPriorityPart": false,
                        "isCatalogPriceDifferentFromAdapt": false,
                        "price": "109.87",
                        "status": "FP",
                        "description": "Fan-105 Assy c/w Impeller 75Watt",
                        "quantity": 1,
                        "stockReferenceId": "E66527",
                        "taskId": "1319414267001",
                        "orderDate": "2016-01-01T00:00:00Z",
                        "quantityCharged": 1,
                        "requisitionNumber": "SOJ00063785639",
                        "fittedDate": "2016-01-01T00:00:00.000Z",
                        "id": "15d5d26f-7416-2705-749c-491ba631b2d1"
                    }]
                }, {
                    "date": "2016-01-02T00:00:00.000Z",
                    "status": "D",
                    "engineerName": "Jack Smith",
                    "report": "All OK",
                    "workDuration": 60,
                    "parts": [{
                        "patchVanStockEngineers": [],
                        "isInPatchVanStock": false,
                        "warrantyReturn": {},
                        "notUsedReturn": {},
                        "isWarrantyReturnOptionAvailable": true,
                        "isConsumable": false,
                        "isFavourite": false,
                        "isValid": false,
                        "isPriorityPart": false,
                        "isCatalogPriceDifferentFromAdapt": false,
                        "price": "12.73",
                        "status": "FP",
                        "description": "Rocker Switch(On/Off)2 Terminal",
                        "quantity": 2,
                        "stockReferenceId": "114077",
                        "taskId": "1319414267001",
                        "orderDate": "2016-01-01T00:00:00Z",
                        "quantityCharged": 2,
                        "requisitionNumber": "SOJ00063785640",
                        "fittedDate": "2016-01-02T00:00:00.000Z",
                        "id": "6184974d-b793-19eb-0e90-2d9253b29713"
                    }]
                }],
                "isCharge": false
            }],
            "tasks": [{
                "dataState": 1,
                "dataStateGroup": "tasks",
                "dataStateId": "d7e2e2de-ca60-9cee-4277-7d7156070a90",
                "deleted": false,
                "isNewRFA": false,
                "id": "1319414267001",
                "jobType": "HU",
                "applianceType": "BBF",
                "applianceId": "00000001",
                "chargeType": "NCH3SIS",
                "specialRequirement": "All Ok",
                "supportingText": "boiler is making noise when turning on",
                "sequence": 2,
                "previousVisits": [{
                    "date": "2016-01-01T00:00:00Z",
                    "report": "All OK",
                    "status": "D",
                    "engineerName": "Jack Smith"
                }],
                "fixedPriceQuotationAmount": 1.23,
                "discountCode": "AL",
                "isPotentiallyPartLJReportable": true,
                "activities": [{
                    "date": "2016-01-01T00:00:00.000Z",
                    "status": "D",
                    "engineerName": "Jack Smith",
                    "report": "All OK",
                    "workDuration": 60,
                    "parts": [{
                        "patchVanStockEngineers": [],
                        "isInPatchVanStock": false,
                        "warrantyReturn": {},
                        "notUsedReturn": {},
                        "isWarrantyReturnOptionAvailable": true,
                        "isConsumable": false,
                        "isFavourite": false,
                        "isValid": false,
                        "isPriorityPart": false,
                        "isCatalogPriceDifferentFromAdapt": false,
                        "price": "109.87",
                        "status": "FP",
                        "description": "Fan-105 Assy c/w Impeller 75Watt",
                        "quantity": 1,
                        "stockReferenceId": "E66527",
                        "taskId": "1319414267001",
                        "orderDate": "2016-01-01T00:00:00Z",
                        "quantityCharged": 1,
                        "requisitionNumber": "SOJ00063785639",
                        "fittedDate": "2016-01-01T00:00:00.000Z",
                        "id": "15d5d26f-7416-2705-749c-491ba631b2d1"
                    }]
                }, {
                    "date": "2016-01-02T00:00:00.000Z",
                    "status": "D",
                    "engineerName": "Jack Smith",
                    "report": "All OK",
                    "workDuration": 60,
                    "parts": [{
                        "patchVanStockEngineers": [],
                        "isInPatchVanStock": false,
                        "warrantyReturn": {},
                        "notUsedReturn": {},
                        "isWarrantyReturnOptionAvailable": true,
                        "isConsumable": false,
                        "isFavourite": false,
                        "isValid": false,
                        "isPriorityPart": false,
                        "isCatalogPriceDifferentFromAdapt": false,
                        "price": "12.73",
                        "status": "FP",
                        "description": "Rocker Switch(On/Off)2 Terminal",
                        "quantity": 2,
                        "stockReferenceId": "114077",
                        "taskId": "1319414267001",
                        "orderDate": "2016-01-01T00:00:00Z",
                        "quantityCharged": 2,
                        "requisitionNumber": "SOJ00063785640",
                        "fittedDate": "2016-01-02T00:00:00.000Z",
                        "id": "6184974d-b793-19eb-0e90-2d9253b29713"
                    }]
                }],
                "isCharge": false
            }, {
                "dataState": 1,
                "dataStateGroup": "tasks",
                "dataStateId": "5e83cfbc-8651-9103-4e20-2bcb9b63d7a0",
                "deleted": false,
                "isNewRFA": false,
                "id": "1319414267002",
                "jobType": "FV",
                "applianceType": "BBF",
                "applianceId": "92973622",
                "chargeType": "NCH3SIS",
                "specialRequirement": "All Ok",
                "supportingText": "Service the boiler",
                "sequence": 1,
                "previousVisits": [],
                "fixedPriceQuotationAmount": 1.23,
                "discountCode": "AL",
                "isPotentiallyPartLJReportable": false,
                "activities": [],
                "isCharge": false
            }],
            "partsDetail": {
                "partsToday": {
                    "dataState": 1,
                    "dataStateGroup": "parts",
                    "dataStateId": "e9663553-e597-2eed-7304-f3a93e2e54eb",
                    "parts": [{
                        "patchVanStockEngineers": [],
                        "isInPatchVanStock": false,
                        "warrantyReturn": {},
                        "notUsedReturn": {},
                        "isWarrantyReturnOptionAvailable": true,
                        "isConsumable": false,
                        "isFavourite": false,
                        "isValid": false,
                        "isPriorityPart": false,
                        "isCatalogPriceDifferentFromAdapt": false,
                        "price": "109.87",
                        "status": "FP",
                        "description": "Fan-105 Assy c/w Impeller 75Watt",
                        "quantity": 1,
                        "stockReferenceId": "E66527",
                        "taskId": "1319414267001",
                        "orderDate": "2016-01-01T00:00:00.000Z",
                        "quantityCharged": 1,
                        "requisitionNumber": "SOJ00063785639",
                        "fittedDate": "2016-01-01T00:00:00.000Z",
                        "id": "15d5d26f-7416-2705-749c-491ba631b2d1"
                    }, {
                        "patchVanStockEngineers": [],
                        "isInPatchVanStock": false,
                        "warrantyReturn": {},
                        "notUsedReturn": {},
                        "isWarrantyReturnOptionAvailable": true,
                        "isConsumable": false,
                        "isFavourite": false,
                        "isValid": false,
                        "isPriorityPart": false,
                        "isCatalogPriceDifferentFromAdapt": false,
                        "price": "12.73",
                        "status": "FP",
                        "description": "Rocker Switch(On/Off)2 Terminal",
                        "quantity": 2,
                        "stockReferenceId": "114077",
                        "taskId": "1319414267001",
                        "orderDate": "2016-01-01T00:00:00Z",
                        "quantityCharged": 2,
                        "requisitionNumber": "SOJ00063785640",
                        "fittedDate": "2016-01-02T00:00:00.000Z",
                        "id": "6184974d-b793-19eb-0e90-2d9253b29713"
                    }]
                },
                "partsBasket": {
                    "dataState": 1,
                    "dataStateGroup": "parts",
                    "dataStateId": "e9663553-e597-2eed-7304-f3a93e2e542b",
                    "lastPartGatheredTime": "2016-01-02T00:00:00.000Z",
                    "showAddPartManually":true,
                    "partsInBasket": [{
                        "patchVanStockEngineers": [],
                        "isInPatchVanStock": false,
                        "warrantyReturn": {},
                        "notUsedReturn": {},
                        "isWarrantyReturnOptionAvailable": true,
                        "isConsumable": false,
                        "isFavourite": false,
                        "isValid": false,
                        "isPriorityPart": false,
                        "isCatalogPriceDifferentFromAdapt": false,
                        "price": "999.99",
                        "status": "FP",
                        "description": "Fan-105 Assy c/w Impeller 75Watt",
                        "quantity": 1,
                        "stockReferenceId": "E66527",
                        "taskId": "1319414267001",
                        "orderDate": "2016-01-01T00:00:00.000Z",
                        "quantityCharged": 1,
                        "requisitionNumber": "SOJ00063785639",
                        "fittedDate": "2016-01-01T00:00:00.000Z",
                        "id": "15d5d26f-7416-2705-749c-491ba631b2d1"
                    }, {
                        "patchVanStockEngineers": [],
                        "isInPatchVanStock": false,
                        "warrantyReturn": {},
                        "notUsedReturn": {},
                        "isWarrantyReturnOptionAvailable": true,
                        "isConsumable": false,
                        "isFavourite": false,
                        "isValid": false,
                        "isPriorityPart": false,
                        "isCatalogPriceDifferentFromAdapt": false,
                        "price": "12.73",
                        "status": "FP",
                        "description": "Rocker Switch(On/Off)2 Terminal",
                        "quantity": 2,
                        "stockReferenceId": "114077",
                        "taskId": "1319414267001",
                        "orderDate": "2016-01-01T00:00:00Z",
                        "quantityCharged": 2,
                        "requisitionNumber": "SOJ00063785640",
                        "fittedDate": "2016-01-02T00:00:00.000Z",
                        "id": "6184974d-b793-19eb-0e90-2d9253b29713"
                    }],
                    "manualPartDetail": {
                        "isInPatchVanStock": false,
                        "warrantyReturn": {},
                        "notUsedReturn": {},
                        "isWarrantyReturnOptionAvailable": true,
                        "isConsumable": false,
                        "isFavourite": false,
                        "isValid": false,
                        "isPriorityPart": false,
                        "isCatalogPriceDifferentFromAdapt": false,
                        "hasTaskWithWrongStatus": false,
                        "price": "0",
                        "isMainPart": false
                    }
                }
            },
            "history": {
                "tasks": [{
                    "dataState": 0,
                    "dataStateGroup": "previous-jobs",
                    "dataStateId": "18b01103-6087-6a61-1dd0-c87f8f7e026e",
                    "deleted": false,
                    "isNewRFA": false,
                    "id": "1318344977001",
                    "jobType": "IB",
                    "applianceType": "BBF",
                    "applianceId": "92973623",
                    "chargeType": "NCH3SIS",
                    "specialRequirement": "All Ok",
                    "supportingText": "boiler is making noise when turning on",
                    "sequence": 1,
                    "previousVisits": [],
                    "fixedPriceQuotationAmount": 1.23,
                    "discountCode": "AL",
                    "isPotentiallyPartLJReportable": false,
                    "activities": [{
                        "date": "2016-06-24T09:22:35.000Z",
                        "status": "X",
                        "engineerName": "Jack Smith",
                        "report": "All OK",
                        "workDuration": 60,
                        "parts": [{
                            "patchVanStockEngineers": [],
                            "isInPatchVanStock": false,
                            "warrantyReturn": {},
                            "notUsedReturn": {},
                            "isWarrantyReturnOptionAvailable": true,
                            "isConsumable": false,
                            "isFavourite": false,
                            "isValid": false,
                            "isPriorityPart": false,
                            "isCatalogPriceDifferentFromAdapt": false,
                            "price": "100",
                            "status": "FP",
                            "description": "Fan-105 Assy c/w Impeller 75Watt",
                            "quantity": 1,
                            "stockReferenceId": "E66527",
                            "taskId": "1318344977001",
                            "isMainPart": false,
                            "orderDate": "2016-01-01T00:00:00Z",
                            "partOrderStatus": "V",
                            "quantityCharged": 1,
                            "requisitionNumber": "SOJ00063785639",
                            "fittedDate": "2016-06-24T09:22:35.000Z",
                            "id": "efda8c1d-b710-e63f-15ea-562d9eafe278"
                        }, {
                            "patchVanStockEngineers": [],
                            "isInPatchVanStock": false,
                            "warrantyReturn": {},
                            "notUsedReturn": {},
                            "isWarrantyReturnOptionAvailable": true,
                            "isConsumable": false,
                            "isFavourite": false,
                            "isValid": false,
                            "isPriorityPart": false,
                            "isCatalogPriceDifferentFromAdapt": false,
                            "price": "100",
                            "status": "AP",
                            "description": "Fan-105 Assy c/w Impeller 75Watt",
                            "quantity": 1,
                            "stockReferenceId": "E66527",
                            "taskId": "1318344977001",
                            "isMainPart": true,
                            "orderDate": "2016-01-01T00:00:00Z",
                            "partOrderStatus": "O",
                            "quantityCharged": 1,
                            "requisitionNumber": "SOJ00063785640",
                            "fittedDate": "2016-06-24T09:22:35.000Z",
                            "id": "531f3f99-8332-3674-443b-a067aff14cee"
                        }]
                    }, {
                        "date": "2016-06-24T09:22:35.000Z",
                        "status": "X",
                        "engineerName": "Jack Smith",
                        "report": "All OK",
                        "workDuration": 60,
                        "parts": [{
                            "patchVanStockEngineers": [],
                            "isInPatchVanStock": false,
                            "warrantyReturn": {},
                            "notUsedReturn": {},
                            "isWarrantyReturnOptionAvailable": true,
                            "isConsumable": false,
                            "isFavourite": false,
                            "isValid": false,
                            "isPriorityPart": false,
                            "isCatalogPriceDifferentFromAdapt": false,
                            "price": "100",
                            "status": "AP",
                            "description": "Fan-105 Assy c/w Impeller 75Watt",
                            "quantity": 10,
                            "stockReferenceId": "E66527",
                            "taskId": "1318344977001",
                            "isMainPart": true,
                            "orderDate": "2016-01-01T00:00:00Z",
                            "partOrderStatus": "V",
                            "quantityCharged": 10,
                            "requisitionNumber": "SOJ00063785639",
                            "fittedDate": "2016-06-24T09:22:35.000Z",
                            "id": "5d35dad6-c7ba-26d9-b202-19566a06a605"
                        }, {
                            "patchVanStockEngineers": [],
                            "isInPatchVanStock": false,
                            "warrantyReturn": {},
                            "notUsedReturn": {},
                            "isWarrantyReturnOptionAvailable": true,
                            "isConsumable": false,
                            "isFavourite": false,
                            "isValid": false,
                            "isPriorityPart": false,
                            "isCatalogPriceDifferentFromAdapt": false,
                            "price": "100",
                            "status": "FP",
                            "description": "Special Pipe",
                            "quantity": 10,
                            "stockReferenceId": "E66527",
                            "taskId": "1318344977001",
                            "isMainPart": true,
                            "orderDate": "2015-05-01T00:00:00Z",
                            "partOrderStatus": "V",
                            "quantityCharged": 10,
                            "requisitionNumber": "SOJ00063785640",
                            "fittedDate": "2016-06-24T09:22:35.000Z",
                            "id": "821670fa-1350-fec9-e339-a7669784726c"
                        }]
                    }]
                }, {
                    "dataState": 0,
                    "dataStateGroup": "previous-jobs",
                    "dataStateId": "1f85926f-5f10-6b87-1363-d28d5937abb2",
                    "deleted": false,
                    "isNewRFA": false,
                    "id": "1318344911002",
                    "jobType": "IB",
                    "applianceType": "BBF",
                    "applianceId": "92973623",
                    "chargeType": "NCH3SIS",
                    "specialRequirement": "All Ok",
                    "supportingText": "boiler is making noise when turning on",
                    "sequence": 1,
                    "previousVisits": [],
                    "fixedPriceQuotationAmount": 1.23,
                    "discountCode": "AL",
                    "isPotentiallyPartLJReportable": false,
                    "activities": [{
                        "date": "2016-02-24T10:25:35.000Z",
                        "status": "D",
                        "engineerName": "Jack Smith",
                        "report": "All OK",
                        "workDuration": 60,
                        "parts": []
                    }]
                }, {
                    "dataState": 0,
                    "dataStateGroup": "previous-jobs",
                    "dataStateId": "2846a382-0c38-dd51-e465-b5a09fb51c3a",
                    "deleted": false,
                    "isNewRFA": false,
                    "id": "1318344922003",
                    "jobType": "IB",
                    "applianceType": "BBF",
                    "applianceId": "92973623",
                    "chargeType": "NCH3SIS",
                    "specialRequirement": "All Ok",
                    "supportingText": "boiler is making noise when turning on",
                    "sequence": 1,
                    "previousVisits": [],
                    "fixedPriceQuotationAmount": 1.23,
                    "discountCode": "AL",
                    "isPotentiallyPartLJReportable": false,
                    "activities": [{
                        "date": "2015-06-22T18:22:35.000Z",
                        "status": "D",
                        "engineerName": "Jack Smith",
                        "report": "All OK",
                        "workDuration": 60,
                        "parts": [{
                            "patchVanStockEngineers": [],
                            "isInPatchVanStock": false,
                            "warrantyReturn": {},
                            "notUsedReturn": {},
                            "isWarrantyReturnOptionAvailable": true,
                            "isConsumable": false,
                            "isFavourite": false,
                            "isValid": false,
                            "isPriorityPart": false,
                            "isCatalogPriceDifferentFromAdapt": false,
                            "price": "100",
                            "status": "FP",
                            "description": "Motor",
                            "quantity": 1,
                            "stockReferenceId": "E66527",
                            "taskId": "1318344922003",
                            "isMainPart": false,
                            "orderDate": "2016-03-05T00:00:00Z",
                            "partOrderStatus": "V",
                            "quantityCharged": 1,
                            "requisitionNumber": "SOJ00063785639",
                            "fittedDate": "2015-06-22T18:22:35.000Z",
                            "id": "5ec5d2ad-d47b-2a9e-435f-a8f1a1b7081a"
                        }]
                    }]
                }, {
                    "dataState": 0,
                    "dataStateGroup": "previous-jobs",
                    "dataStateId": "3aa63b0b-c665-5dab-03fb-9dae8dab0817",
                    "deleted": false,
                    "isNewRFA": false,
                    "id": "1318344933004",
                    "jobType": "IB",
                    "applianceType": "BBF",
                    "applianceId": "92973623",
                    "chargeType": "NCH3SIS",
                    "specialRequirement": "All Ok",
                    "supportingText": "boiler is making noise when turning on",
                    "sequence": 1,
                    "previousVisits": [],
                    "fixedPriceQuotationAmount": 1.23,
                    "discountCode": "AL",
                    "isPotentiallyPartLJReportable": false,
                    "activities": [{
                        "date": "2014-09-24T09:22:35.000Z",
                        "status": "D",
                        "engineerName": "Jack Smith",
                        "report": "All OK",
                        "workDuration": 60,
                        "parts": [{
                            "patchVanStockEngineers": [],
                            "isInPatchVanStock": false,
                            "warrantyReturn": {},
                            "notUsedReturn": {},
                            "isWarrantyReturnOptionAvailable": true,
                            "isConsumable": false,
                            "isFavourite": false,
                            "isValid": false,
                            "isPriorityPart": false,
                            "isCatalogPriceDifferentFromAdapt": false,
                            "price": "100",
                            "status": "FP",
                            "description": "Impeller 100Watt",
                            "quantity": 1,
                            "stockReferenceId": "E66527",
                            "taskId": "1318344933004",
                            "isMainPart": true,
                            "orderDate": "2012-03-30T00:00:00Z",
                            "partOrderStatus": "V",
                            "quantityCharged": 1,
                            "requisitionNumber": "SOJ00063785639",
                            "fittedDate": "2014-09-24T09:22:35.000Z",
                            "id": "6e00df47-0860-9e25-4d20-4584e804a65c"
                        }]
                    }]
                }, {
                    "dataState": 0,
                    "dataStateGroup": "previous-jobs",
                    "dataStateId": "d86d2ed5-6ead-080f-6246-68f41c331ab3",
                    "deleted": false,
                    "isNewRFA": false,
                    "id": "1318344944005",
                    "jobType": "IB",
                    "applianceType": "BBF",
                    "applianceId": "92973623",
                    "chargeType": "NCH3SIS",
                    "specialRequirement": "All Ok",
                    "supportingText": "boiler is making noise when turning on",
                    "sequence": 1,
                    "previousVisits": [],
                    "fixedPriceQuotationAmount": 1.23,
                    "discountCode": "AL",
                    "isPotentiallyPartLJReportable": false,
                    "activities": [{
                        "date": "2016-02-24T11:22:35.000Z",
                        "status": "D",
                        "engineerName": "Jack Smith",
                        "report": "All OK",
                        "workDuration": 60,
                        "parts": [{
                            "patchVanStockEngineers": [],
                            "isInPatchVanStock": false,
                            "warrantyReturn": {},
                            "notUsedReturn": {},
                            "isWarrantyReturnOptionAvailable": true,
                            "isConsumable": false,
                            "isFavourite": false,
                            "isValid": false,
                            "isPriorityPart": false,
                            "isCatalogPriceDifferentFromAdapt": false,
                            "price": "100",
                            "status": "FP",
                            "description": "Valve",
                            "quantity": 1,
                            "stockReferenceId": "E66527",
                            "taskId": "1318344944005",
                            "isMainPart": true,
                            "orderDate": "2016-01-01T00:00:00Z",
                            "partOrderStatus": "O",
                            "quantityCharged": 1,
                            "requisitionNumber": "SOJ00063785639",
                            "fittedDate": "2016-02-24T11:22:35.000Z",
                            "id": "7a8ec5c5-605d-cc90-4c0d-657d2eb86ac8"
                        }]
                    }]
                }, {
                    "dataState": 0,
                    "dataStateGroup": "previous-jobs",
                    "dataStateId": "0ceed66f-2ce3-6c85-d3e2-3606b491dc0b",
                    "deleted": false,
                    "isNewRFA": false,
                    "id": "1318344955006",
                    "jobType": "IB",
                    "applianceType": "BBF",
                    "applianceId": "92973623",
                    "chargeType": "NCH3SIS",
                    "specialRequirement": "All Ok",
                    "supportingText": "boiler is making noise when turning on",
                    "sequence": 1,
                    "previousVisits": [],
                    "fixedPriceQuotationAmount": 1.23,
                    "discountCode": "AL",
                    "isPotentiallyPartLJReportable": false,
                    "activities": [{
                        "date": "2016-05-22T10:22:35.000Z",
                        "status": "D",
                        "engineerName": "Jack Smith",
                        "report": "All OK",
                        "workDuration": 60,
                        "parts": [{
                            "patchVanStockEngineers": [],
                            "isInPatchVanStock": false,
                            "warrantyReturn": {},
                            "notUsedReturn": {},
                            "isWarrantyReturnOptionAvailable": true,
                            "isConsumable": false,
                            "isFavourite": false,
                            "isValid": false,
                            "isPriorityPart": false,
                            "isCatalogPriceDifferentFromAdapt": false,
                            "price": "100",
                            "status": "FP",
                            "description": "Fan-105 Assy c/w Impeller 75Watt",
                            "quantity": 1,
                            "stockReferenceId": "E66527",
                            "taskId": "1318344955006",
                            "isMainPart": true,
                            "orderDate": "2016-01-01T00:00:00Z",
                            "partOrderStatus": "V",
                            "quantityCharged": 1,
                            "requisitionNumber": "SOJ00063785639",
                            "fittedDate": "2016-05-22T10:22:35.000Z",
                            "id": "ff6275cb-e4be-e758-1e2b-c1f8eab0085a"
                        }]
                    }]
                }, {
                    "dataState": 0,
                    "dataStateGroup": "previous-jobs",
                    "dataStateId": "64e309bb-b0a7-5ed8-c4c4-4dd5aa1e664f",
                    "deleted": false,
                    "isNewRFA": false,
                    "id": "1318344966007",
                    "jobType": "IB",
                    "applianceType": "BBF",
                    "applianceId": "92973623",
                    "chargeType": "NCH3SIS",
                    "specialRequirement": "All Ok",
                    "supportingText": "boiler is making noise when turning on",
                    "sequence": 1,
                    "previousVisits": [],
                    "fixedPriceQuotationAmount": 1.23,
                    "discountCode": "AL",
                    "isPotentiallyPartLJReportable": false,
                    "activities": [{
                        "date": "2016-03-23T10:21:35.000Z",
                        "status": "D",
                        "engineerName": "Jack Smith",
                        "report": "All OK",
                        "workDuration": 60,
                        "parts": [{
                            "patchVanStockEngineers": [],
                            "isInPatchVanStock": false,
                            "warrantyReturn": {},
                            "notUsedReturn": {},
                            "isWarrantyReturnOptionAvailable": true,
                            "isConsumable": false,
                            "isFavourite": false,
                            "isValid": false,
                            "isPriorityPart": false,
                            "isCatalogPriceDifferentFromAdapt": false,
                            "price": "100",
                            "status": "AP",
                            "description": "Fan-105 Assy c/w Impeller 75Watt",
                            "quantity": 1,
                            "stockReferenceId": "E66527",
                            "taskId": "1318344966007",
                            "isMainPart": true,
                            "orderDate": "2016-01-01T00:00:00Z",
                            "partOrderStatus": "V",
                            "quantityCharged": 1,
                            "requisitionNumber": "SOJ00063785639",
                            "fittedDate": "2016-03-23T10:21:35.000Z",
                            "id": "b179d46f-0bec-a6bb-8559-234096e806c0"
                        }]
                    }]
                }, {
                    "dataState": 0,
                    "dataStateGroup": "previous-jobs",
                    "dataStateId": "7056a5c5-0922-8584-1001-eb764204b238",
                    "deleted": false,
                    "isNewRFA": false,
                    "id": "1318344977008",
                    "jobType": "IB",
                    "applianceType": "BBF",
                    "applianceId": "92973623",
                    "chargeType": "NCH3SIS",
                    "specialRequirement": "All Ok",
                    "supportingText": "boiler is making noise when turning on",
                    "sequence": 1,
                    "previousVisits": [],
                    "fixedPriceQuotationAmount": 1.23,
                    "discountCode": "AL",
                    "isPotentiallyPartLJReportable": false,
                    "activities": [{
                        "date": "2015-02-25T13:22:35.000Z",
                        "status": "D",
                        "engineerName": "Jack Smith",
                        "report": "All OK",
                        "workDuration": 60,
                        "parts": [{
                            "patchVanStockEngineers": [],
                            "isInPatchVanStock": false,
                            "warrantyReturn": {},
                            "notUsedReturn": {},
                            "isWarrantyReturnOptionAvailable": true,
                            "isConsumable": false,
                            "isFavourite": false,
                            "isValid": false,
                            "isPriorityPart": false,
                            "isCatalogPriceDifferentFromAdapt": false,
                            "price": "100",
                            "status": "FP",
                            "description": "Fan-105 Assy c/w Impeller 75Watt",
                            "quantity": 1,
                            "stockReferenceId": "E66527",
                            "taskId": "1318344977008",
                            "isMainPart": true,
                            "orderDate": "2016-01-01T00:00:00Z",
                            "partOrderStatus": "V",
                            "quantityCharged": 1,
                            "requisitionNumber": "SOJ00063785639",
                            "fittedDate": "2015-02-25T13:22:35.000Z",
                            "id": "a7384ff4-475b-8645-4541-ac20ff2c7608"
                        }]
                    }]
                }],
                "appliances": [{
                    "dataState": 1,
                    "dataStateGroup": "appliances",
                    "dataStateId": "0183926d-5ddb-440d-eea1-631bfbad1234",
                    "isCurrentJob": true,
                    "isSafetyRequired": true,
                    "isCentralHeatingAppliance": true,
                    "safety": {
                        "applianceGasReadingsMaster": {
                            "dataState": 0,
                            "dataStateGroup": "appliances",
                            "dataStateId": "8e60f73e-0dc5-a21b-d1bb-cb5bb18445d3",
                            "workedOnApplianceReadings": false,
                            "workedOnMainReadings": false
                        },
                        "applianceGasSafety": {
                            "dataState": 1,
                            "dataStateGroup": "appliances",
                            "dataStateId": "cdae0862-d6ef-0ecb-6fe9-a337a35e47f8",
                            "isSafetyRequired": true
                        },
                        "applianceGasUnsafeDetail": {},
                        "applianceElectricalSafetyDetail": {
                            "dataState": 0,
                            "dataStateGroup": "appliances",
                            "dataStateId": "018ebcc9-69fe-9d10-06cc-e9d0506e55df"
                        },
                        "applianceElectricalUnsafeDetail": { "unsafeReasons": [] },
                        "applianceOtherSafety": {
                            "dataState": 0,
                            "dataStateGroup": "appliances",
                            "dataStateId": "481d28db-8d70-5205-7ddb-c8b993ae55e8",
                            "isSafetyRequired": true
                        },
                        "applianceOtherUnsafeDetail": {},
                        "previousApplianceUnsafeDetail": {
                            "applianceSafe": true,
                            "flueSafe": true,
                            "ventilationSafe": false,
                            "installationSafe": false,
                            "installationTightnessTestSafe": true,
                            "actionCode": "X",
                            "date": "2017-04-21T07:25:50.705Z",
                            "noticeStatus": "A",
                            "noticeType": "SS",
                            "progress": "Some text information",
                            "report": "NO 2ND RCD IN FUSE BOX"
                        }
                    },
                    "id": "00000001",
                    "applianceCategoryType": 1,
                    "serialId": "55-10/104510090",
                    "gcCode": "4402301",
                    "bgInstallationIndicator": false,
                    "category": "A",
                    "contractType": "LIM",
                    "contractExpiryDate": "2017-04-21T07:25:50.705Z",
                    "applianceType": "BBF",
                    "description": "HEATWAVE TWIN",
                    "flueType": "R",
                    "energyControl": "NC",
                    "locationDescription": "KITCHEN",
                    "numberOfRadiators": 0,
                    "numberOfSpecialRadiators": 0,
                    "installationYear": 1994,
                    "notes": "INS Quote",
                    "boilerSize": 10,
                    "cylinderType": "0",
                    "systemDesignCondition": "0",
                    "systemType": "0",
                    "condition": "1",
                    "preVisitChirpCode": { "code": "A", "date": "2016-01-01T00:00:00Z" },
                    "isInstPremAppliance": false,
                    "childId": "00000002"
                }, {
                    "dataState": 1,
                    "dataStateGroup": "appliances",
                    "dataStateId": "fb1a0735-ec26-6d8b-4c68-70af74de61cc",
                    "isCurrentJob": true,
                    "isSafetyRequired": true,
                    "isCentralHeatingAppliance": false,
                    "safety": {
                        "applianceGasReadingsMaster": {
                            "dataState": 0,
                            "dataStateGroup": "appliances",
                            "dataStateId": "144f694d-88a3-76e5-c49a-cb02a9d219be",
                            "workedOnApplianceReadings": false,
                            "workedOnMainReadings": false
                        },
                        "applianceGasSafety": {
                            "dataState": 1,
                            "dataStateGroup": "appliances",
                            "dataStateId": "52c79655-e527-e18c-4172-6729e07ae053",
                            "isSafetyRequired": true
                        },
                        "applianceGasUnsafeDetail": {},
                        "applianceElectricalSafetyDetail": {
                            "dataState": 0,
                            "dataStateGroup": "appliances",
                            "dataStateId": "aaf1bdc8-14ee-3be1-0c9c-4a2b0c199a40"
                        },
                        "applianceElectricalUnsafeDetail": { "unsafeReasons": [] },
                        "applianceOtherSafety": {
                            "dataState": 0,
                            "dataStateGroup": "appliances",
                            "dataStateId": "a510c652-398b-cf14-0e85-32250488cba1",
                            "isSafetyRequired": true
                        },
                        "applianceOtherUnsafeDetail": {},
                        "previousApplianceUnsafeDetail": {
                            "applianceSafe": true,
                            "flueSafe": true,
                            "ventilationSafe": false,
                            "installationSafe": false,
                            "installationTightnessTestSafe": true,
                            "actionCode": "X",
                            "date": "2016-01-01T00:00:00.000Z",
                            "noticeStatus": "A",
                            "noticeType": "SS",
                            "progress": "Some text information",
                            "report": "NO 2ND RCD IN FUSE BOX"
                        }
                    },
                    "id": "00000002",
                    "applianceCategoryType": 1,
                    "gcCode": "",
                    "bgInstallationIndicator": false,
                    "category": "B",
                    "contractType": "2PI",
                    "contractExpiryDate": "2016-01-01T00:00:00.000Z",
                    "applianceType": "FRB",
                    "description": "Fire for BBF",
                    "flueType": "R",
                    "energyControl": "NC",
                    "locationDescription": "KITCHEN",
                    "numberOfRadiators": 10,
                    "numberOfSpecialRadiators": 2,
                    "installationYear": 1995,
                    "notes": "INS Quote",
                    "boilerSize": 10,
                    "cylinderType": "0",
                    "systemDesignCondition": "0",
                    "systemType": "0",
                    "condition": "1",
                    "parentId": "00000001",
                    "preVisitChirpCode": { "code": "B", "date": "2016-01-01T00:00:00Z" },
                    "isInstPremAppliance": false
                }, {
                    "dataState": 1,
                    "dataStateGroup": "appliances",
                    "dataStateId": "91faf47c-e0b8-4135-b245-48e4b611097f",
                    "isCurrentJob": true,
                    "isSafetyRequired": true,
                    "isCentralHeatingAppliance": true,
                    "safety": {
                        "applianceGasReadingsMaster": {
                            "dataState": 0,
                            "dataStateGroup": "appliances",
                            "dataStateId": "7222856c-95c6-5333-f235-21d0daf55700",
                            "workedOnApplianceReadings": false,
                            "workedOnMainReadings": false
                        },
                        "applianceGasSafety": {
                            "dataState": 1,
                            "dataStateGroup": "appliances",
                            "dataStateId": "028d09a4-5572-95bc-36ed-75aaeec22b28",
                            "isSafetyRequired": true
                        },
                        "applianceGasUnsafeDetail": {},
                        "applianceElectricalSafetyDetail": {
                            "dataState": 0,
                            "dataStateGroup": "appliances",
                            "dataStateId": "d93ea00a-84b9-b11d-3339-c3c12f276255"
                        },
                        "applianceElectricalUnsafeDetail": { "unsafeReasons": [] },
                        "applianceOtherSafety": {
                            "dataState": 0,
                            "dataStateGroup": "appliances",
                            "dataStateId": "b1818211-6c72-2670-aedc-6dccae6f79f6",
                            "isSafetyRequired": true
                        },
                        "applianceOtherUnsafeDetail": {},
                        "previousApplianceUnsafeDetail": {
                            "applianceSafe": true,
                            "flueSafe": true,
                            "ventilationSafe": false,
                            "installationSafe": false,
                            "installationTightnessTestSafe": true,
                            "actionCode": "X",
                            "date": "2016-01-01T00:00:00.000Z",
                            "noticeStatus": "A",
                            "noticeType": "SS",
                            "progress": "Some text information",
                            "report": "NO 2ND RCD IN FUSE BOX"
                        }
                    },
                    "id": "92973622",
                    "applianceCategoryType": 1,
                    "serialId": "55-10/104510090",
                    "gcCode": "9999998",
                    "bgInstallationIndicator": false,
                    "category": "A",
                    "contractType": "NONE",
                    "contractExpiryDate": "2016-01-01T00:00:00.000Z",
                    "applianceType": "AGA",
                    "description": "Aga Description 2",
                    "flueType": "R",
                    "energyControl": "NC",
                    "locationDescription": "KITCHEN",
                    "numberOfRadiators": 0,
                    "numberOfSpecialRadiators": 0,
                    "installationYear": 1996,
                    "notes": "INS Quote",
                    "boilerSize": 10,
                    "cylinderType": "0",
                    "systemDesignCondition": "0",
                    "systemType": "0",
                    "condition": "1",
                    "preVisitChirpCode": { "code": "C", "date": "2016-01-01T00:00:00Z" },
                    "isInstPremAppliance": false
                }, {
                    "dataState": 0,
                    "dataStateGroup": "appliances",
                    "dataStateId": "0d5a0112-837e-f9b7-f12c-0f2dceb96546",
                    "isSafetyRequired": true,
                    "isCentralHeatingAppliance": true,
                    "safety": {
                        "applianceGasReadingsMaster": {
                            "dataState": 0,
                            "dataStateGroup": "appliances",
                            "dataStateId": "68fdf50d-c82f-53ae-3c20-1da917008bf9",
                            "workedOnApplianceReadings": false,
                            "workedOnMainReadings": false
                        },
                        "applianceGasSafety": {
                            "dataState": 1,
                            "dataStateGroup": "appliances",
                            "dataStateId": "297942ba-dda1-edf5-04f5-2f2e039b1e4d",
                            "isSafetyRequired": true
                        },
                        "applianceGasUnsafeDetail": {},
                        "applianceElectricalSafetyDetail": {
                            "dataState": 0,
                            "dataStateGroup": "appliances",
                            "dataStateId": "5dae5870-3d79-3bb4-2a8b-d920124fa3fa"
                        },
                        "applianceElectricalUnsafeDetail": { "unsafeReasons": [] },
                        "applianceOtherSafety": {
                            "dataState": 0,
                            "dataStateGroup": "appliances",
                            "dataStateId": "bc0c63ca-7e3c-c2d6-9a69-9a0139913f77",
                            "isSafetyRequired": true
                        },
                        "applianceOtherUnsafeDetail": {},
                        "previousApplianceUnsafeDetail": {
                            "applianceSafe": true,
                            "flueSafe": true,
                            "ventilationSafe": false,
                            "installationSafe": false,
                            "installationTightnessTestSafe": true,
                            "actionCode": "X",
                            "date": "2016-01-01T00:00:00.000Z",
                            "noticeStatus": "A",
                            "noticeType": "SS",
                            "progress": "Some text information",
                            "report": "NO 2ND RCD IN FUSE BOX"
                        }
                    },
                    "id": "92973623",
                    "applianceCategoryType": 1,
                    "serialId": "55-10/104510090",
                    "gcCode": "9999999",
                    "bgInstallationIndicator": false,
                    "category": "B",
                    "contractType": "2PI",
                    "contractExpiryDate": "2016-01-01T00:00:00.000Z",
                    "applianceType": "BBF",
                    "description": "Carbon Monoxide Model",
                    "flueType": "R",
                    "energyControl": "NC",
                    "locationDescription": "KITCHEN",
                    "numberOfRadiators": 0,
                    "numberOfSpecialRadiators": 0,
                    "installationYear": 1997,
                    "notes": "INS Quote",
                    "boilerSize": 10,
                    "cylinderType": "0",
                    "systemDesignCondition": "0",
                    "systemType": "0",
                    "condition": "1",
                    "preVisitChirpCode": { "code": "D", "date": "2016-01-01T00:00:00Z" },
                    "isInstPremAppliance": false
                }]
            },
            "propertySafety": {
                "propertyGasSafetyDetail": {
                    "dataState": 1,
                    "dataStateGroup": "property-safety",
                    "dataStateId": "64b0a3a2-ac5b-b156-407c-a257f508abdb"
                },
                "propertyUnsafeDetail": {},
                "previousPropertySafetyDetail": {
                    "lastVisitDate": "2016-01-01T00:00:00Z",
                    "safetyNoticeNotLeftReason": "High earth reading- bedroom socket san",
                    "cappedOrTurnedOff": "NT",
                    "conditionAsLeft": "SS",
                    "labelAttachedOrRemoved": "A",
                    "letterLeft": true,
                    "ownedByCustomer": true,
                    "reasons": ["CONS"],
                    "report": "NOT ALL ON RCD",
                    "ownersNameAndDetails": "AS PER LANDLORD DETAILS",
                    "signatureObtained": true
                }
            },
            "charge": {
                "dataState": 0,
                "dataStateGroup": "charges",
                "dataStateId": "6996826b-c4ad-1e5b-4822-9a0efb1e8467",
                "discountAmount": 0,
                "netTotal": 100,
                "chargeTotal": 120,
                "totalVatAmount": 20,
                "tasks": [
                    {
                        "task": {
                            "activities": [{
                                "date": "2016-01-01T00:00:00.000Z",
                            }],
                        },
                        "vat": 20,
                        "discountAmount": 0,
                        "fixedPriceQuotationAmount": 0,
                        "labourItem": {
                            "netAmount": 100,
                            "vat": 20,
                            "chargePair": {
                                "primeCharge": 100,
                                "subsequentCharge": 80
                            }
                        },
                        "partItems": [
                            {
                                "netAmount": 100,
                                "vat": 20
                            }
                        ]
                    }
                ]
            },
            "position": 2
        };
        hydratedJob = Job.fromJson(rawJob);

        it("can be created", () => {
            expect(hydratedJob).toBeDefined();
        });

        describe("job", () => {

            it("maps date properties in job", () => {
                expect(hydratedJob.dispatchTime instanceof Date).toBeTruthy();
                expect(hydratedJob.enrouteTime instanceof Date).toBeTruthy();
                expect(hydratedJob.onsiteTime instanceof Date).toBeTruthy();
                expect(hydratedJob.completionTime instanceof Date).toBeTruthy();
                expect(hydratedJob.pendingTime instanceof Date).toBeTruthy();
                expect(hydratedJob.allocationTime instanceof Date).toBeTruthy();
                expect(hydratedJob.holdTime instanceof Date).toBeTruthy();
                expect(hydratedJob.cancellationTime instanceof Date).toBeTruthy();
            })
        });

        describe("risks", () => {
            it("maps to date object", () => {
                expect(hydratedJob.risks[0].date instanceof Date).toBeTruthy();
            });
        });

        describe("deletedRisks", () => {

            it("maps to date object", () => {
                expect(hydratedJob.deletedRisks[0].date instanceof Date).toBeTruthy();
            });
        });

        describe("visit", () => {
            it("maps to date object", () => {
                expect(hydratedJob.visit.timeSlotFrom instanceof Date).toBeTruthy();
                expect(hydratedJob.visit.timeSlotTo instanceof Date).toBeTruthy();
            });
        });

        describe("tasks", () => {
            it("maps date object", () => {
                expect(hydratedJob.tasks).toBeDefined();
                expect(hydratedJob.tasks[0]).toBeDefined();
                expect(hydratedJob.tasks[0].activities[0].date instanceof Date).toBeTruthy();
                expect(hydratedJob.tasks[0].activities[0].parts[0].price instanceof bignumber.BigNumber).toBeTruthy();

            });

            it("maps date object tasksNotToday", () => {
                expect(hydratedJob.tasksNotToday).toBeDefined();
                expect(hydratedJob.tasksNotToday[0]).toBeDefined();
                expect(hydratedJob.tasksNotToday[0].activities[0].date instanceof Date).toBeTruthy();
            });
        });

        describe("history", () => {
            it("maps date for task, activities", () => {
                expect(hydratedJob.history).toBeDefined();
                expect(hydratedJob.history.tasks).toBeDefined();
                expect(hydratedJob.history.tasks[0].activities[0].date instanceof Date).toBeTruthy();
                expect(hydratedJob.history.appliances[0].contractExpiryDate instanceof Date).toBeTruthy();
                expect(hydratedJob.history.appliances[0].safety.previousApplianceUnsafeDetail.date instanceof Date).toBeTruthy();
            })
        });

        describe("appointment", () => {
            it("maps date for appointments", () => {
                expect(hydratedJob.appointment.promisedDate instanceof Date).toBeTruthy();
            });
        });

        describe("partsDetail", () => {
            it("maps price and dates for partsToday", () => {
                expect(hydratedJob.partsDetail.partsBasket.lastPartGatheredTime instanceof Date).toBeTruthy();

                const part = hydratedJob.partsDetail.partsToday.parts[0];
                expect(part.price instanceof bignumber.BigNumber).toBeTruthy();
                expect(part.orderDate instanceof Date).toBeTruthy();
                expect(part.fittedDate instanceof Date).toBeTruthy();
            });

            describe("maps price and dates for partsBasket", () => {

                const partsInBasket = hydratedJob.partsDetail.partsBasket.partsInBasket;
                const partsToday = hydratedJob.partsDetail.partsToday.parts;
                const manualPartDetail = hydratedJob.partsDetail.partsBasket.manualPartDetail;

                it("maps price and dates for partsBasket", () => {
                    const part = partsInBasket[0];
                    expect(part.price instanceof bignumber.BigNumber).toBeTruthy();
                    expect(part.orderDate instanceof Date).toBeTruthy();
                    expect(part.fittedDate instanceof Date).toBeTruthy();
                });

                it("maps price and dates for partsBasket", () => {
                    const part = partsToday[0];
                    expect(part.price instanceof bignumber.BigNumber).toBeTruthy();
                    expect(part.orderDate instanceof Date).toBeTruthy();
                    expect(part.fittedDate instanceof Date).toBeTruthy();
                });

                it("maps price for partsBasket manualPartDetail", () => {
                    expect(manualPartDetail.price instanceof bignumber.BigNumber).toBeTruthy();
                })
            });
        });

        describe("charge", () => {
            // const {charge} = hydratedJob;
            // const {discountAmount, netTotal, chargeTotal, totalVat, tasks} = charge;
            // const [firstTask] = tasks;
            //
            it("maps totals to bignumber", () => {
                expect(hydratedJob.charge.discountAmount instanceof bignumber.BigNumber).toBeTruthy();
                expect(hydratedJob.charge.netTotal instanceof bignumber.BigNumber).toBeTruthy();
                expect(hydratedJob.charge.chargeTotal instanceof bignumber.BigNumber).toBeTruthy();
                expect(hydratedJob.charge.totalVatAmount instanceof bignumber.BigNumber).toBeTruthy();
            });

            it("maps dates for activities in task property for chargeableTasks", () => {
                expect(hydratedJob.charge.tasks[0].task.activities[0].date instanceof Date).toBeTruthy();
            });

            it("sets totals to bignumber for chargeableTask", () => {
                expect(hydratedJob.charge.tasks[0].vat instanceof bignumber.BigNumber).toBeTruthy();
                expect(hydratedJob.charge.tasks[0].discountAmount instanceof bignumber.BigNumber).toBeTruthy();
                expect(hydratedJob.charge.tasks[0].fixedPriceQuotationAmount instanceof bignumber.BigNumber).toBeTruthy();
                expect(hydratedJob.charge.tasks[0].labourItem.chargePair.primeCharge instanceof bignumber.BigNumber).toBeTruthy();
                expect(hydratedJob.charge.tasks[0].labourItem.chargePair.subsequentCharge instanceof bignumber.BigNumber).toBeTruthy();

                expect(hydratedJob.charge.tasks[0].partItems[0].netAmount instanceof bignumber.BigNumber).toBeTruthy();
                expect(hydratedJob.charge.tasks[0].partItems[0].vat instanceof bignumber.BigNumber).toBeTruthy();

                expect(hydratedJob.charge.tasks[0].labourItem.chargePair.primeCharge instanceof bignumber.BigNumber).toBeTruthy();
                expect(hydratedJob.charge.tasks[0].labourItem.chargePair.subsequentCharge instanceof bignumber.BigNumber).toBeTruthy();
            });
        });
    });

});
