import { IPlatformAppLauncher } from "../IPlatformAppLauncher";

export class AppLauncher implements IPlatformAppLauncher {

    private _uriScheme: string;

    constructor() {
        this._uriScheme = null;
    }

    public getUriScheme(): Promise<string> {
        if (!!this._uriScheme) {
            return Promise.resolve(this._uriScheme);
        }

        let installedLocation = Windows.ApplicationModel.Package.current.installedLocation;
        return new Promise<string>((resolve => {
            installedLocation.getFileAsync("AppxManifest.xml")
            .then(file => {
                Windows.Storage.FileIO.readTextAsync(file).then(text => {
                    this._uriScheme = text.match(/<uap:Protocol Name="(.*)">/)[1] + "://";
                    resolve(this._uriScheme);
                }, (err) => {
                   resolve(this._uriScheme);
                });
            }, (err) => {
                resolve(this._uriScheme);
            });
        }));
    }

    public checkApplicationInstalled(uri: string): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            Windows.System.Launcher.queryUriSupportAsync(new Windows.Foundation.Uri(uri), Windows.System.LaunchQuerySupportType.uri)
            .done((supported: Windows.System.LaunchQuerySupportStatus) => {
                return resolve(supported === Windows.System.LaunchQuerySupportStatus.available);
            }, () => resolve(false));
        });
    }

    public launchApplication(uri: string): void {
        Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri(uri));
    }
}
