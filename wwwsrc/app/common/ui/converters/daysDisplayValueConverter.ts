export class DaysDisplayValueConverter {
    public toView(days: string): string {
        if (days) {
            let disp = "";

            let numVal = parseFloat(days);

            if (!isNaN(numVal)) {
                let years = Math.floor(numVal / 365);
                if (years === 1) {
                    disp = years + " year ";
                } else if (years > 1) {
                    disp = years + " years ";
                }

                numVal -= years * 365;

                disp += numVal + " days";
            }

            return disp;
        } else {
            return "";
        }
    }
}
