import { IPlatformAppLauncher } from "./IPlatformAppLauncher";
import { IAppLauncher } from "./IAppLauncher";
import { PlatformServiceBase } from "../platformServiceBase";
import { UrlParamService } from "../urlParamService";

export class AppLauncher extends PlatformServiceBase<IPlatformAppLauncher> implements IAppLauncher {

    constructor() {
        super("common/core/services", "AppLauncher");
    }

    public checkInstalled(uri: string): Promise<boolean> {
        return this.loadModule().then((module) => {
            return module.checkApplicationInstalled(uri);
        });
    }

    public launchApplication(uri: string): void {
        this.loadModule().then((module) => module.launchApplication(uri));
    }

    public launch(uriOrProtocol: string, params: { [index: string]: string }, options?: { returnUri?: boolean, returnUriText?: string, fullScreen?: boolean }): void {
        let uri = uriOrProtocol;
        if (uri.indexOf("://") === -1) {
            uri += "://";
        }

        this.generateUri(uri, params, options)
            .then(encodedUri => this.loadModule().then((module) => module.launchApplication(encodedUri)))
            .catch();
    }

    private generateUri(baseUri: string, params: { [index: string]: string}, options?: { returnUri?: boolean, returnUriText?: string, fullScreen?: boolean }): Promise<string> {
        return Promise.resolve()
            .then(() => {
                if (!!options && !!options.returnUri) {
                    return this.loadModule().then(module => module.getUriScheme());
                }
                return null;
            })
            .then((appScheme) => {
                let paramsAndQs = Object.assign(params, {
                    "?returnappuri": appScheme, 
                    "?returnapptext": options && options.returnUriText,
                    "?fullscreen": options && options.fullScreen
                });

                return UrlParamService.getParamEndpoint(baseUri, this.filterFalsyParams(paramsAndQs)).replace(/{(.*)}/g, "");
            });
    }

    private filterFalsyParams(params: {[index: string]: string}): {[index: string]: string} {
        return Object.keys(params).reduce((newObject: any, key: any) => {
            let val = params[key];
            if (!!val) {
                newObject[key] = val;
            }
            return newObject;
        }, {});
    }
}
