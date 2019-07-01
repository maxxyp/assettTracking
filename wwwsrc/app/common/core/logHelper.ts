import { DateHelper } from "./dateHelper";

export class LogHelper {
    public static getLogFileName(date: Date): string {
        return "log-" + DateHelper.toJsonDateString(date) + ".txt";
    }

    public static clearDownLogs(maxLogFileAgeDays: number): void {
        try {
            let oldestDateToKeep = DateHelper.addDays(new Date(), -1 * maxLogFileAgeDays);
            let oldestFileNameToKeep = this.getLogFileName(oldestDateToKeep);

            Windows.Storage.ApplicationData.current.localFolder.getFilesAsync()
                .then((files: Windows.Foundation.Collections.IVectorView<Windows.Storage.StorageFile>) => {
                    files.forEach(file => {
                        // alphabetical comparison is good enough
                        if (file.name < oldestFileNameToKeep) {
                            file.deleteAsync(Windows.Storage.StorageDeleteOption.default);
                        }
                    });
                });
        } catch (err) {

        }
    }
}
