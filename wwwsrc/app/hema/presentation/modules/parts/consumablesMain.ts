import {Router, RouterConfiguration, RouteConfig} from "aurelia-router";
import {DataState} from "../../../business/models/dataState";
import {inject} from "aurelia-dependency-injection";
import {VanStockService} from "../../../business/services/vanStockService";
import {IVanStockService} from "../../../business/services/interfaces/IVanStockService";
import {FeatureToggleService} from "../../../business/services/featureToggleService";
import {IFeatureToggleService} from "../../../business/services/interfaces/IFeatureToggleService";
import {VanStockConstants} from "../../../business/services/constants/vanStockConstants";
import {EventAggregator, Subscription} from "aurelia-event-aggregator";
import {PageService} from "../../services/pageService";
import {IPageService} from "../../services/interfaces/IPageService";
import {ObjectHelper} from "../../../../common/core/objectHelper";
import {ConsumableServiceConstants} from "../../../business/services/constants/consumableServiceConstants";
import {ConsumablesBasket} from "./consumablesBasket";
import {IStorageService} from "../../../business/services/interfaces/IStorageService";
import {StorageService} from "../../../business/services/storageService";

@inject(VanStockService, FeatureToggleService, EventAggregator, PageService, StorageService)
export class ConsumablesMain {
    public router: Router;
    public consumablesLabel: string;

    private _childRoutes: RouteConfig[];

    private _vanStockService: IVanStockService;
    private _featureToggleService: IFeatureToggleService;

    private _eventAggregator: EventAggregator;
    private _pageService: IPageService;
    private _subscriptions: Subscription [];
    private _storageService: IStorageService;

    constructor(vanStockService: IVanStockService,
                featureToggleService: IFeatureToggleService,
                eventAggregator: EventAggregator,
                pageService: IPageService,
                storageService: IStorageService
    ) {

        this._vanStockService = vanStockService;
        this._featureToggleService = featureToggleService;
        this._storageService = storageService;

        this._subscriptions = [];
        this._eventAggregator = eventAggregator;

        this.consumablesLabel = "Consumables";
        this._pageService = pageService;
    }

    public configureRouter(config: RouterConfiguration, childRouter: Router): void {
        this.router = childRouter;
        this.setupChildRoutes();
        config.map(this._childRoutes);
    }

    public async activate(): Promise<void> {
        if (this._featureToggleService.isAssetTrackingEnabled()) {
            this.consumablesLabel = "Material";
        }

        //  events, setup tab titles

        const vanStockSub = this._eventAggregator.subscribe(VanStockConstants.VANSTOCK_UPDATED, async () => {
            await this.updateVanStockTitle();
            await this.updateInOutStockTitle();
        });

        const consumableAddSub = this._eventAggregator.subscribe(ConsumableServiceConstants.CONSUMABLE_ADDED, async (count: number) => {
            await this.updateConsumablesTitle(count);
        });

        const consumableReadSub = this._eventAggregator.subscribe(ConsumablesBasket.READ_CONSUMBALES_BASKET, async () => {
            await this.updateConsumablesTitle(0);
            await this._storageService.setConsumablesRead(true);
        });

        this._subscriptions = [vanStockSub, consumableAddSub, consumableReadSub];

        // initial setup
        // if not read, then previous consumables add must have set this to true and we need to look
        const read = await this._storageService.getConsumablesRead();
        await this.updateConsumablesTitle(read ? 0 : 1 );

        await this.updateVanStockTitle();
        await this.updateInOutStockTitle();
    }

    public deactivate(): Promise<void> {

        this._subscriptions.forEach(subscription => subscription.dispose());
        this._subscriptions = [];
        return Promise.resolve();
    }

    public navigateToRoute(name: string): void {
        this.router.navigateToRoute(name);
    }

    private setupChildRoutes(): void {

        if (this._featureToggleService.isAssetTrackingEnabled()) {
            let landingPage = this._pageService.getLastVisitedPage(ObjectHelper.getClassName(this)) || "van-stock";

            this._childRoutes = [{
                route: "",
                redirect: landingPage
            }];
            this._childRoutes.push({
                route: "in-out-stock",
                moduleId: "hema/presentation/modules/vanStock/inOutStock",
                name: "in-out-stock",
                nav: true,
                title: "Locate Items",
                settings: {
                    dataState: DataState.dontCare,
                    alwaysShow: true,
                    showCount: false,
                    showDataState: true,
                }
            });

            this._childRoutes.push({
                route: "van-stock",
                moduleId: "hema/presentation/modules/vanStock/vanStock",
                name: "van-stock",
                nav: true,
                title: "My Stock",
                settings: {
                    dataState: DataState.dontCare,
                    showDataState: false,
                    showCount: true,
                    alwaysShow: true
                }
            });
        } else {
            this._childRoutes = [{
                route: "",
                redirect: "consumables-basket"
            }];
        }

        this._childRoutes.push({
            route: "consumables-basket",
            moduleId: "hema/presentation/modules/parts/consumablesBasket",
            name: "consumables-basket",
            nav: true,
            title: "Consumables",
            settings: {
                dataState: DataState.dontCare,
                showDataState: true,
                showCount: false,
                alwaysShow: true,
            }
        });
        this._childRoutes.push({
            route: "consumables-history",
            moduleId: "hema/presentation/modules/parts/consumablesHistory",
            name: "consumables-history",
            nav: true,
            title: "Order History",
            settings: {
                dataState: DataState.dontCare,
                showDataState: false,
                showCount: false,
                alwaysShow: true
            }
        });
        this._childRoutes.push({
            route: "consumables-favourites",
            moduleId: "hema/presentation/modules/parts/consumablesFavourites",
            name: "consumables-favourites",
            nav: true,
            title: "Favourites",
            settings: {
                dataState: DataState.dontCare,
                showDataState: false,
                showCount: true,
                alwaysShow: true
            }
        });
    }

    private async updateVanStockTitle(): Promise<void> {
        const total = await this._vanStockService.getLocalVanStockTotal();
        this.updateTitle("van-stock", total);
    }

    private async updateInOutStockTitle(): Promise<void> {
        const items = await this._vanStockService.getMaterialRequests();
        const total = items && items.outboundMaterials ? items.outboundMaterials.filter(i => i.isUnread).length : 0;
        this.updateTitle("in-out-stock", total);
    }

    private async updateConsumablesTitle(count: number): Promise<void> {
        this.updateTitle("consumables-basket", count);
    }

    private updateTitle(route: string, count: number): void {

        // if  items and already on page no need to update the badge

        if (!this.router) {
            return;
        }

        const onRoute = this.router && this.router.currentInstruction &&
            this.router.currentInstruction.fragment === route;

        // if already on page then badge count 0 (means that items read)
        // or we are on different page and we want to update the badge (change tab from orange to grey).

        const updateTheTab = (count === 0) || (!onRoute && count > 0);

        if (!updateTheTab) {
            return;
        }

        let routeObject = this.router.routes.find(r => r.route === route);

        if (!routeObject) {
            return;
        }

        const {settings, navModel, title} = routeObject;

        if (settings && settings.showDataState) {
            settings.badgeCount = count;
            settings.dataState = count ? DataState.notVisited : DataState.dontCare;
        }

        if (!navModel) {
            return;
        }

        if (settings.showCount) {
            const formattedTitle = `${title} ${count ? `(${count})` : ``}`;
            navModel.setTitle(formattedTitle);
        }

    }
}
