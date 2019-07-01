import { IObserver } from "./IObserver";
import { IAppCommand } from "./IAppCommand";
import { IAppLauncher } from "./IAppLauncher";
import { Guid } from "../guid";
import { IAppIntegrationRegistry } from "./IAppIntegrationRegistry";
import { inject } from "aurelia-dependency-injection";
import { UriSchemeService } from "./uriSchemeService";
import { AppLauncher } from "./appLauncher";

const CUSTOMER_TIPS_COMPLETE: string = "customerTipsComplete";
const CUSTOMER_INFO_NAVIGATE_PREMISES_ID: string = "customerinfo://premises/{premisesId}";
const BOILER_EFFICIENCY_GUIDE_NAVIGATE_GC_CODE: string = "boilerefficiencyguide://{gcCode}";
const EWB_COMMAND_NOTIFY_CUSTOMER_TIPS_URI: string = `hema://command/${CUSTOMER_TIPS_COMPLETE}`;

// encapsulated the interfaces here for now. 
// seems verbose I'm describing the interfaces and the individual 
// app objects below. But this is what the tslining rules want
interface IDisposable {
    dispose: () => void;
}

interface IAppLaunchOptions {
    returnUri?: boolean;
    returnUriText?: string;
    fullScreen?: boolean;
}

interface IBoilerEfficiencyGuideLaunchCommands {
    navigateTo: {
        gcCode: (gcCode: string, options? : {
            returnUri? : boolean,
            returnUriText?: string,
            fullScreen?: boolean
        }) => void
    };
}

interface ICustomerInfoLaunchCommands {
    navigateTo: {
        premises: (premisesId: string, options?: IAppLaunchOptions) => void,
    };
    subscribe: {
        customerTipsComplete: (callback: (premisesId: string) => void) => IDisposable;
    };
}

interface IEngineerWorkBenchLaunchCommands {
    notify: {
        customerTipsComplete: (premisesId: string) => void;
    };
}

@inject(UriSchemeService, AppLauncher)
export class AppIntegrationRegistry implements IAppIntegrationRegistry {

    public boilerEfficiencyGuide: IBoilerEfficiencyGuideLaunchCommands = {
        navigateTo: {
            gcCode: (gcCode: string, options?: IAppLaunchOptions) => {
                this._appLauncher.launch(BOILER_EFFICIENCY_GUIDE_NAVIGATE_GC_CODE, {
                    gcCode
                }, options);
            }
        }
    };

    public customerInfo: ICustomerInfoLaunchCommands = {
        navigateTo: {
            premises: (premisesId: string, options?: IAppLaunchOptions) => {
                this._appLauncher.launch(CUSTOMER_INFO_NAVIGATE_PREMISES_ID, {
                    premisesId
                });
            }
        },
        subscribe: {
            customerTipsComplete: (callback: (premisesId: string) => void) =>
                this.createCommandSubscription(CUSTOMER_TIPS_COMPLETE, (args: any) => callback(args.premisesId))
        }
    };

    public engineerWorkBench: IEngineerWorkBenchLaunchCommands = {
        notify: {
            customerTipsComplete: (premisesId: string) => {
                this._appLauncher.launch(EWB_COMMAND_NOTIFY_CUSTOMER_TIPS_URI, {
                    "?premisesId": premisesId
                });
            }
        }
    };

    private _uriSchemeService: IObserver<IAppCommand> ;
    private _appLauncher: IAppLauncher;
    private _handlers: {
        token: string,
        command: string,
        handler: any
    }[];

    constructor(uriSchemeService: IObserver<IAppCommand> , appLauncher: IAppLauncher) {
        this._uriSchemeService = uriSchemeService;
        this._appLauncher = appLauncher;
        this._handlers = [];

        this._uriSchemeService.subscribe((command) => {
            let handlers = this._handlers.filter(x => x.command === command.methodName);
            handlers.forEach(handler => handler.handler(command.args));
        });
    }

    private createCommandSubscription(command: string, callback: any): IDisposable {
        let token = Guid.newGuid();
        this._handlers.push({
            token: token,
            command,
            handler: callback
        });

        return {
            dispose: () => this.unSubscribe(token)
        };
    }

    private unSubscribe(token: string): void {
        this._handlers = this._handlers.filter(x => x.token !== token);
    }
}
