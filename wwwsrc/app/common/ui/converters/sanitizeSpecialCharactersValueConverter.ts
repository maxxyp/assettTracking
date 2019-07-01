import {StringHelper} from "../../core/stringHelper";
export class SanitizeSpecialCharactersValueConverter {

    public toView(value: string) : string {
        if (StringHelper.isString(value)) {
            value = StringHelper.sanitizeSpecialCharacters(value);
        }
        return value;
    }
}
