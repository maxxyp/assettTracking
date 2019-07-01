export class PollingHelper {

    public static async pollIntervals(delegate: () => Promise<boolean>, intervals: number[] = []): Promise<void> {

        while (true) {
            if (!intervals.length) {
                break;
            }

            const thisInterval = intervals.shift();
            await Promise.delay(thisInterval * 1000);
            const shouldQuit = await delegate();

            if (shouldQuit) {
                break;
            }
        }
    }
}
