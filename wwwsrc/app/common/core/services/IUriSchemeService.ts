export interface IUriSchemeService {
    registerPlatform(callback: (path: string) => void): void;
    navigateToInitialRoute?(): void;
}
