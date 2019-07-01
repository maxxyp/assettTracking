import {StringHelper} from "../../core/stringHelper";
export class HtmlFormatValueConverter {

    public toView(value: string) : string {
        if (StringHelper.isString(value)) {
            value = value
                .replace(/\r/gi, "")
                .replace(/\n/gi, "<br />")
                .replace(/&/gi, "&amp;");
        }
        return value;
    }
}
