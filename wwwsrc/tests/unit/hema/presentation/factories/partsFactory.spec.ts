/// <reference path="../../../../../typings/app.d.ts" />

import {Part} from "../../../../../app/hema/business/models/part";
import {Task} from "../../../../../app/hema/business/models/task";
import {PartsFactory} from "../../../../../app/hema/presentation/factories/partsFactory";
import {TodaysPartViewModel} from "../../../../../app/hema/presentation/modules/parts/viewModels/todaysPartViewModel";
import { DataState } from "../../../../../app/hema/business/models/dataState";
import * as bignumber from "bignumber";

describe("the partsFactory factory", () => {
    let partsFactory: PartsFactory;

    beforeEach(() => {
        partsFactory = new PartsFactory();
    });

    it("can be created", () => {
        expect(partsFactory).toBeDefined();
    });

    describe("the createTodaysPartViewModel function", () => {
        let part: Part;
        let task: Task;

        beforeEach(() => {
            part = new Part();
            part.description = "test part";
            part.price = new bignumber.BigNumber(108);
            part.quantity = 1;
            part.warrantyReturn.isWarrantyReturn = false;
            part.notUsedReturn.quantityToReturn = 1;
            part.notUsedReturn.reasonForReturn = "test";

            task = new Task(true, false);            
        });
        
        it("shoule return a todaysPartViewModel", () => {
            let todaysPartViewModel: TodaysPartViewModel = partsFactory.createTodaysPartViewModel(part, task);

            expect(todaysPartViewModel).toBeDefined();
            expect(todaysPartViewModel.task).toEqual(task);
            expect(todaysPartViewModel.part).toEqual(part);
            expect(todaysPartViewModel.partPrice.toNumber()).toEqual(108);
            expect(todaysPartViewModel.isWarrantyCollapsedOnLoad).toBe(false);
            expect(todaysPartViewModel.isReturnCollapsedOnLoad).toBe(false);
            expect(todaysPartViewModel.dataStateIndicator).toBe(DataState.notVisited); 
        });
    });
});
