import {IUriSchemeService} from "../IUriSchemeService";

export class UriSchemeService implements IUriSchemeService {
    
    public registerPlatform(handleUriCallback: (path: string) => void): void {
        window.handleOpenURL = (uri: string) => {
            if (uri.indexOf(":/") > -1) {
                let uriPath = uri.replace(uri.substring(0, uri.indexOf(":/") + 2).replace("#", ""), "");
                if (handleUriCallback && !!uriPath) {
                    handleUriCallback(uriPath);
                }
            }
        };
    }
}
