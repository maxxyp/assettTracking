import {PartNotUsedReturn} from "../../business/models/partNotUsedReturn";
import {PartWarrantyReturn} from "../../business/models/partWarrantyReturn";
import {Part} from "../../business/models/part";
import {Task} from "../../business/models/task";
import {TodaysPartViewModel} from "../modules/parts/viewModels/todaysPartViewModel";
import {IPartsFactory} from "./interfaces/IPartsFactory";
import { DataState } from "../../business/models/dataState";
import * as bignumber from "bignumber";

export class PartsFactory implements IPartsFactory {
    public createTodaysPartViewModel(part: Part, task: Task): TodaysPartViewModel {
        let vm = new TodaysPartViewModel();

        vm.part = part;
        vm.partPrice = new bignumber.BigNumber(part.price);

        vm.task = task;

        vm.isWarrantyCollapsedOnLoad = part.warrantyReturn.isWarrantyReturn === undefined;
        vm.isReturnCollapsedOnLoad = part.notUsedReturn.quantityToReturn === undefined
                && part.notUsedReturn.reasonForReturn === undefined;

        vm.warrantyReturn = new PartWarrantyReturn();
        vm.notUsedReturn = new PartNotUsedReturn();
        Object.assign(vm.warrantyReturn, part.warrantyReturn);
        Object.assign(vm.notUsedReturn, part.notUsedReturn);

        vm.dataStateIndicator = DataState.notVisited;

        return vm;
    }
}
