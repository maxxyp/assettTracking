export interface IPlatformAppLauncher {
    checkApplicationInstalled(uri: string): Promise<boolean>;
    launchApplication(uri: string): void;
    getUriScheme(): Promise<string>;
}
