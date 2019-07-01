import {IUriSchemeService} from "../IUriSchemeService";
import { ObjectHelper } from "../../objectHelper";

const FULLSCREEN: string = "fullscreen";

export class UriSchemeService implements IUriSchemeService {
    
    public registerPlatform(handleUriCallback: any): void {
        
        if (window.Windows &&
            window.Windows.UI &&
            window.Windows.UI.WebUI &&
            window.Windows.UI.WebUI.WebUIApplication) {
            window.Windows.UI.WebUI.WebUIApplication.addEventListener("activated",
                (args: Windows.ApplicationModel.Activation.IActivatedEventArgs & Windows.WinRTEvent<any>) => {
                    let activatedEvent = args.detail.find(x => !!x);
                    if (!!activatedEvent.uri) {
                        let rawUri = activatedEvent.uri.rawUri;
                        let scheme = activatedEvent.uri.schemeName + "://";
                        let includesRoute = (rawUri !== scheme);
                        if (includesRoute) {
                            let path = activatedEvent.uri.rawUri.replace(scheme, "").replace("/#", "").replace(/\/$/, "");
                            if (handleUriCallback && !!path) {
                                let queryParams = ObjectHelper.parseQueryString(path);
                                this.setScreenSize(queryParams[FULLSCREEN] === "true" && this.isTabletMode());
                                handleUriCallback(path);
                            }
                        }
                    }
                });
        }
    }

    private isTabletMode(): boolean {
        return window.Windows.ViewManagement.UIViewSettings.getForCurrentView().userInteractionMode === window.Windows.ViewManagement.UserInteractionMode.touch;
    }

    private setScreenSize(fullScreen: boolean): void {
        window.Windows.UI.ViewManagement.ApplicationView.preferredLaunchWindowingMode = !!fullScreen 
            ?  window.Windows.UI.ViewManagement.ApplicationViewWindowingMode.fullScreen 
            :  window.Windows.UI.ViewManagement.ApplicationViewWindowingMode.preferredLaunchViewSize;
    }
}
