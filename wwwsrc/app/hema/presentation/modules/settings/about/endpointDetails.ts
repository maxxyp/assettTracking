import {ILabelService} from "../../../../business/services/interfaces/ILabelService";
import {EventAggregator} from "aurelia-event-aggregator";
import {DialogService} from "aurelia-dialog";
import {LabelService} from "../../../../business/services/labelService";
import {inject} from "aurelia-dependency-injection";
import {BaseInformation} from "./baseInformation";
import {IConfigurationService} from "../../../../../common/core/services/IConfigurationService";
import {ConfigurationService} from "../../../../../common/core/services/configurationService";
import {IEndpointConfiguration} from "../../../../../common/resilience/models/IEndpointConfiguration";

@inject(LabelService, EventAggregator, DialogService, ConfigurationService)
export class EndpointDetails extends BaseInformation {
    public endpoints: { routeName: string, client: string, path: string }[];

    private _configurationService: IConfigurationService;

    constructor(labelService: ILabelService, eventAggregator: EventAggregator, dialogService: DialogService,
                configurationService: IConfigurationService) {
        super(labelService, eventAggregator, dialogService);

        this.isExpanded = false;
        this._configurationService = configurationService;
        this.endpoints = [];
    }

    public attachedAsync() : Promise<void> {
        this.addClientEndpoints("fftServiceEndpoint");
        this.addClientEndpoints("whoAmIServiceEndpoint");
        this.addClientEndpoints("adaptServiceEndpoint");
        this.addClientEndpoints("assetTrackingEndpoint");
        return Promise.resolve();
    }

    private addClientEndpoints(service: string) : void {
        let endpointConfiguration: IEndpointConfiguration = this._configurationService.getConfiguration<IEndpointConfiguration>(service);
        if (endpointConfiguration &&
            endpointConfiguration.routes) {
            endpointConfiguration.routes.forEach(route => {
               this.endpoints.push({routeName: service.replace("ServiceEndpoint", "") + "::" + route.route, client: route.client, path: route.path});
            });
        }
    }
}
