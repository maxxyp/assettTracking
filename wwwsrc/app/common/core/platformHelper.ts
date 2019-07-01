/// <reference path="../../../typings/app.d.ts" />

export class PlatformHelper {
    public static navigatorAppVersion: string;
    public static navigatorPlatform: string;
    public static loaderPrefix: string = "";
    public static isDevelopment: boolean;
    public static isSource: boolean;
    public static appVersion: string;
    public static buildType: string;
    private static _platform: string;

    public static initNavigatorPlatform() : void {
        if (!PlatformHelper.navigatorPlatform) {
            PlatformHelper.navigatorPlatform = navigator.platform;
        }
    }

    public static initNavigatorAppVersion() : void {
        if (!PlatformHelper.navigatorAppVersion) {
            PlatformHelper.navigatorAppVersion = navigator.appVersion;
        }
    }

    public static getPlatform(): string {
        PlatformHelper.initNavigatorPlatform();
        PlatformHelper.initNavigatorAppVersion();

        if (!PlatformHelper._platform) {
            PlatformHelper._platform = "web";

            if (/Electron/.test(PlatformHelper.navigatorAppVersion)) {
                PlatformHelper._platform = "electron";
            } else if (/MSAppHost/.test(PlatformHelper.navigatorAppVersion)) {
                PlatformHelper._platform = "wua";
            }  else if (/iPad|iPhone|iPod/.test(PlatformHelper.navigatorPlatform)) {
                PlatformHelper._platform = "ios";
            }
        }

        return PlatformHelper._platform;
    }

    public static resetPlatform(): void {
        PlatformHelper._platform = null;
    }

    public static appRoot(): string {
        return PlatformHelper.isRequreJs() ? "./" : "./app/";
    }

    public static wwwRoot(): string {
        return PlatformHelper.isSource ? "wwwsrc" : "www";
    }

    public static isRequreJs(): boolean {
        return typeof window.require === "function" ? true : false;
    }

    public static isMobile(): boolean {
        return this.getPlatform() === "wua" &&
            window.Windows &&
            window.Windows.Foundation &&
            window.Windows.Foundation.Metadata &&
            window.Windows.Foundation.Metadata.ApiInformation &&
            window.Windows.Foundation.Metadata.ApiInformation.isTypePresent("Windows.Phone.UI.Input.HardwareButtons");
    }

    public static isCordova(): boolean {
        return window.cordova ? true : false;
    }

    public static isWua(): boolean {
        return PlatformHelper._platform === "wua";
    }

    public static cordovaVersion(): string {
        return window.cordova ? window.cordova.version : "";
    }

    public static cordovaPlatformId(): string {
        return window.cordova ? window.cordova.platformId : "";
    }

    public static loadModule(folder: string, name: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (folder && name) {
                let platform: string = PlatformHelper.getPlatform();

                if (PlatformHelper.isRequreJs()) {
                    window.require([folder + "/" + platform + "/" + name],
                        (module: any) => {
                            resolve(module);
                        },
                        (error: any) => {
                            reject();
                        });
                } else {
                    window.System.normalize(folder + "/" + name, null)
                          .then((normalizedName: string) => {
                              window.System.import("./" + platform + "/" + name, normalizedName)
                                    .then((module: any) => {
                                        resolve(module);
                                    }).catch(() => {
                                  reject();
                              });
                          });
                }
            } else {
                reject();
            }
        });
    }

}
