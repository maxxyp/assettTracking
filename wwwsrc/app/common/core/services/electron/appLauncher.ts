import { IPlatformAppLauncher } from "../IPlatformAppLauncher";

export class AppLauncher implements IPlatformAppLauncher {

    public getUriScheme(): Promise<string> {
        return Promise.resolve(location.protocol + "//" + location.host);
    }

    public checkApplicationInstalled(uri: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    public launchApplication(uri: string): void {
        window.open(uri, "_blank");
    }
}
