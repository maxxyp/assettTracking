export interface IFeatureToggleService {
    initialise(engineerId: string): Promise<void>;
    isAssetTrackingEnabled(): boolean;
}
