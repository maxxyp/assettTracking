export class ChargeTypeToServiceLevelCodeValueConverter {
    public toView(value: string): string {
        // return the part of the string starting from the first numeric digit, including the digit
        let matches = /^[^\d]*(\d.*)/.exec(value);
        return (matches || []).length >= 2
                    ? matches[1]
                    : null;
    }
}
