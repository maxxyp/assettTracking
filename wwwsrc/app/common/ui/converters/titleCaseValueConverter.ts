export class TitleCaseValueConverter {
    public toView(input: string): string {
        if (input) {
            let output = input.replace(/([A-Z])/g, " $1");
            return output.charAt(0).toUpperCase() + output.substr(1, output.length);
        } else {
            return "";
        }
    }
}
