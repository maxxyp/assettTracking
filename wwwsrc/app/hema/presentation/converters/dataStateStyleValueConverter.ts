import {DataState} from "../../business/models/dataState";
import {StringHelper} from "../../../common/core/stringHelper";

export class DataStateStyleValueConverter {
    public toView(value: DataState, canEdit: boolean): string {
        return canEdit ? "state-" + StringHelper.toSnakeCase(DataState[value]) : "state-none";
    }
}
