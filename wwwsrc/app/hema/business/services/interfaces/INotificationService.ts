export interface INotificationService {
    initRouterBadgeEventSubs(): void;
    updateInitialRouterBadgeCounts(): Promise<void>;
}
