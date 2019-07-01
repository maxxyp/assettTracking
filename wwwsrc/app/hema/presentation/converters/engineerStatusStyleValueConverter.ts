import {StringHelper} from "../../../common/core/stringHelper";

export class EngineerStatusStyleValueConverter {
    public toView(value: string): string {
        return StringHelper.isString(value) ? "hema-icon-" + StringHelper.toSnakeCase(value) : "";
    }
}
