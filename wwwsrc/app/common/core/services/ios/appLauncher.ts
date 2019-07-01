import { IPlatformAppLauncher } from "../IPlatformAppLauncher";

export class AppLauncher implements IPlatformAppLauncher {

    private _uriScheme: string;

    constructor() {
        this._uriScheme = null;
    }

    // dependency ./plugins-custom/cordova-plugin-getcustomuri
    public getUriScheme(): Promise<string> {
        if (!window.GetCustomUri) {
            return Promise.resolve(null);
        }

        let getCustomUri = window.GetCustomUri;
        return new Promise<string>(resolve => {
            getCustomUri.getUriScheme((res: string) => {
                this._uriScheme = res + "://";
                resolve(this._uriScheme);
            }, () => {
                resolve();
            });
        });
    }
    
    // dependency https://github.com/lampaa/com.lampa.startapp
    // dependency cordova-plugin-queries-schemes
    public checkApplicationInstalled(uri: string): Promise<boolean> {
        if (!window.startApp) {
            return Promise.resolve(false);
        }

        let startApp = window.startApp;
        return new Promise<boolean>(resolve => {
            let baseUri: string = uri;
            if (uri.indexOf("://") > -1) {
                baseUri = uri.split("://")[0] + "://";
            }

            startApp.set(baseUri).check(() => { 
                resolve(true);
            }, () => {
                resolve(false);
            });
        });
    }

    public launchApplication(uri: string): void {
        let startApp = window.startApp;
        if (!startApp) {
            return;
        }
        startApp.set(uri).start();
    }
}
