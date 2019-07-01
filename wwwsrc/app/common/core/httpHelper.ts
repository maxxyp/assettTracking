import * as Logging from "aurelia-logging";
import { IHttpHelper } from "./IHttpHelper";

export class HttpHelper implements IHttpHelper {

    public isSuspendingEventFired: boolean;
    private _logger: Logging.Logger;

    constructor() {
        this._logger = Logging.getLogger("HttpHelper");
    }

    public intialise(): void {
        if (window.Windows &&
            window.Windows.UI &&
            window.Windows.UI.WebUI &&
            window.Windows.UI.WebUI.WebUIApplication) {
            window.Windows.UI.WebUI.WebUIApplication.addEventListener("suspending", (args: any) => {
                this._logger.warn("HttpHelper: suspending event fired");
                this.isSuspendingEventFired = true;
            });
        }

        if (window.Windows &&
            window.Windows.UI &&
            window.Windows.UI.WebUI &&
            window.Windows.UI.WebUI.WebUIApplication) {
            window.Windows.UI.WebUI.WebUIApplication.addEventListener("resuming", (args: any) => {
                this._logger.warn("HttpHelper: resuming event fired");
                this.isSuspendingEventFired = false;
            });
        }
    }
}
