import {Part} from "../../../business/models/part";
import {Task} from "../../../business/models/task";
import {TodaysPartViewModel} from "../../modules/parts/viewModels/todaysPartViewModel";

export interface IPartsFactory {
    createTodaysPartViewModel(part: Part, task: Task): TodaysPartViewModel;
}
