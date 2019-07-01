import {Aurelia, inject} from "aurelia-framework";
import {Router} from "aurelia-router";
import {IUriSchemeService} from "./IUriSchemeService";
import {PlatformServiceBase} from "../platformServiceBase";
import { ObjectHelper } from "../objectHelper";
import { IAppCommand } from "./IAppCommand";
import { IObserver } from "./IObserver";

@inject(Aurelia)
export class UriSchemeService extends PlatformServiceBase<IUriSchemeService> implements IUriSchemeService, IObserver<IAppCommand> {

    private _aurelia: Aurelia;
    private _handlers: ((command: IAppCommand) => void)[];

    constructor(aurelia: Aurelia) {
        super("common/core/services", "UriSchemeService");
        this._aurelia = aurelia;
        this._handlers = [];
    }

    public registerPlatform(): void {
        this.loadModule().then((module) => {
             module.registerPlatform(this.handleCustomURI.bind(this));
        });
    }

    public navigateToInitialRoute(): void {
        if (window.initialRoute) {
            this.handleCustomURI(window.initialRoute);
        }
    }

    public subscribe(callback: (command: IAppCommand) => void): void {
        this._handlers.push(callback);
    }

    public unsubscribe(callback: (command: IAppCommand) => void): void {
        this._handlers = this._handlers.filter((item) => item !== callback);
    }

    private publish(command: IAppCommand): void {
        this._handlers.forEach((item) => item.call(item, command));
    }

    private handleCustomURI(path: string): void {
        let command = this.parseCommand(path);
        if (command) {
            this.publish(command);
            return;
        }

        // if the uri is not in the format /command/something
        // presume the uri is a route

        let router: Router = this._aurelia.container.get(Router);
        router.navigate(path, { replace: true });
    }

    private parseCommand(path: string): IAppCommand {
        let pathParts = path.split("?");
        let qs: string = null;
        if (pathParts.length > 1) {
            qs = pathParts[1];
        }
        let matches = path.match(new RegExp("^(command)\/([A-z]+)", "i"));
        if (!!matches && matches.length > 0 && matches[1] === "command") {
            return {
                methodName: matches[2],
                args: qs ? ObjectHelper.parseQueryString(qs) : null
            };
        }
        return null;
    }
}
