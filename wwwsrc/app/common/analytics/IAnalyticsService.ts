import * as ga from "universal-ga";

export interface IAnalyticsService {
    initialize(userId: string, opts?: { trackNavigation?: boolean }): Promise<void>;
    setUserId(userId: string): void;
    setCustomMetaData(data: {[index: string]: string}, customDimensionMap: { [index: string]: keyof ga.IFieldObjectDimension } ): void;
    exception(errorMessage: string, isFatal: boolean): void;
    logGeoPosition(): void;
}
