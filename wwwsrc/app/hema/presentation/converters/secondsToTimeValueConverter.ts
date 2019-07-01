export class SecondsToTimeValueConverter {
    public toView(seconds: number, format?: string): string {
        if (seconds && !isNaN(seconds)) {
            let hours: number = seconds >= 3600 ? Math.floor(seconds / 3600) : 0;
            seconds -= hours * 3600;
            let minutes: number = seconds >= 0 ? Math.ceil(seconds / 60) : 0;

            if (minutes === 60) {
                hours += 1;
                minutes = 0;
            }

            let time = "";

            if (format === "short") {
                time += `${hours}h${minutes}`;
            } else {
                if (hours > 0) {
                    time += hours === 1 ? "1 hour " : hours + " hours ";
                }

                if (minutes > 0) {
                    time += minutes === 1 ? "1 minute " : minutes + " minutes ";
                }
            }

            return time.trim();
        } else {
            return "";
        }
    }
}
