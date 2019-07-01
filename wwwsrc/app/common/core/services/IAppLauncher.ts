export interface IAppLauncher {
    checkInstalled(uri: string): Promise<boolean>;
    launchApplication(uri: string): void;
    launch(uri: string, params: { [index: string]: string}, options?: {
        returnUri?: boolean, 
        returnUriText?: string, 
        fullScreen?: boolean
    }): void;
}
