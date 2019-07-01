export class CamelToSentenceCaseValueConverter {
    public toView(input: string): string {
        if (input) {
            return input
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/([A-Z])([a-z])/g, " $1$2")
                .replace(/\ +/g, " ");
        } else {
            return "";
        }
    }
}
