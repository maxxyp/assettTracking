export class StringifyValueConverter {
    public toView(o: any): string {
        if (o) {
            let json = JSON.stringify(o, undefined, 4);
            json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            json = json.replace(
                /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g
                , (match) => {
                    let cls = "number";
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = "key";
                        } else {
                            cls = "string";
                        }
                    } else if (/true|false/.test(match)) {
                        cls = "boolean";
                    } else if (/null/.test(match)) {
                        cls = "null";
                    }
                    return "<span class=\"" + cls + "\">" + match + "</span>";
                });
            return json;
        } else {
            return "";
        }
    }
}
