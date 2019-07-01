import {EventAggregator} from "aurelia-event-aggregator";
import {inject} from "aurelia-dependency-injection";
import {Router} from "aurelia-router";
import {ConsumableServiceConstants} from "./constants/consumableServiceConstants";
import {MessageServiceConstants} from "./constants/messageServiceConstants";
import {ConsumablesBasket} from "../../presentation/modules/parts/consumablesBasket";
import {VanStockConstants} from "./constants/vanStockConstants";
import {IMessageService} from "./interfaces/IMessageService";
import {IVanStockService} from "./interfaces/IVanStockService";
import {MessageService} from "./messageService";
import {VanStockService} from "./vanStockService";
import {INotificationService} from "./interfaces/INotificationService";
import {SoundConstants} from "./constants/soundConstants";
import {IStorageService} from "./interfaces/IStorageService";
import {StorageService} from "./storageService";
import { AppConstants } from "../../../appConstants";
import { IToastItem } from "../../../common/ui/elements/models/IToastItem";
import { Guid } from "../../../common/core/guid";

const CONSUMABLES_ROUTE_NAME = "consumables";
const MESSAGES_ROUTE_NAME = "messages";
const GROUP_VANSTOCK_CONSUMABLES = "VANSTOCK_SOURCE";

@inject(EventAggregator, Router, MessageService, VanStockService, StorageService)
export class NotificationService implements INotificationService {
    private _eventAggregator: EventAggregator;
    private _router: Router;
    private _messageService: IMessageService;
    private _vanStockService: IVanStockService;
    private _storage: IStorageService;

    constructor(eventAggregator: EventAggregator, router: Router,
                messageService: IMessageService, vanStockService: IVanStockService, storage: IStorageService) {

        this._eventAggregator = eventAggregator;
        this._router = router;

        this._messageService = messageService;
        this._vanStockService = vanStockService;
        this._storage = storage;
    }

    public initRouterBadgeEventSubs(): void {

        const notCurrentlyOnRoute = (routeName: string) => {

            if (!this._router) {
                return false;
            }

            if (!this._router.currentInstruction) {
                return false;
            }

            if (this._router.currentInstruction.params) {
                return this._router.currentInstruction.params.childRoute !== routeName;
            }

            return false;
        };

        // badge updates for consumables, only do if not on current page
        this._eventAggregator.subscribe(ConsumableServiceConstants.CONSUMABLE_ADDED, async () => {
            // if on consumables page then no need to update read flag
            if (notCurrentlyOnRoute("consumables-basket")) {
                this.updateBadge(CONSUMABLES_ROUTE_NAME, 1);
                await this._storage.setConsumablesRead(false);
            }
        });

        this._eventAggregator.subscribe(ConsumablesBasket.READ_CONSUMBALES_BASKET, async () => {
            this.updateBadge(CONSUMABLES_ROUTE_NAME);
        });

        // badge updates for messages
        this._eventAggregator.subscribe(MessageServiceConstants.MESSAGE_SERVICE_UPDATED, (badgeCount: number) => {
            this.updateBadge(MESSAGES_ROUTE_NAME, badgeCount);

        });

        // badge updates for van stock, check if any outbound items
        this._eventAggregator.subscribe(VanStockConstants.VANSTOCK_UPDATED, async () => {

            const notOnRoute = notCurrentlyOnRoute("in-out-stock");

            const items = await this._vanStockService.getMaterialRequests();
            const badgeCount = items.outboundMaterials.filter(i => i.isUnread).length;

            // if read all items or on different page and updates
            if (badgeCount === 0 || notOnRoute && badgeCount) {
                this.updateBadge(CONSUMABLES_ROUTE_NAME, badgeCount, GROUP_VANSTOCK_CONSUMABLES);
            }

            if (badgeCount) {
                this._eventAggregator.publish(SoundConstants.NOTIFICATION_SOUND);

                const msg = badgeCount > 1 ? "parts" : "part";
                this._eventAggregator.publish(AppConstants.APP_TOAST_ADDED, <IToastItem>{
                    id: Guid.newGuid(),
                    title: "Reservation Request",
                    style: "warning",
                    content: `You have just received a ${msg} reservation request`,
                    autoDismiss: false
                });
            }

        });
    }

    // only call post router setup, i.e. router.ensureConfigured
    public updateInitialRouterBadgeCounts(): Promise<void> {
        return this._router.ensureConfigured().then(() => {

            this.updateBadge("messages", this._messageService.unreadCount);

            return this._vanStockService.getMaterialRequests().then(items => {
                const badgeCount = items.outboundMaterials.filter(i => i.isUnread).length;
                this.updateBadge(CONSUMABLES_ROUTE_NAME, badgeCount, GROUP_VANSTOCK_CONSUMABLES);
            });

        });
    }

    private updateBadge(route: string, count: number = 0, groupId: string = route): void {

        if (!this._router) {
            return;
        }

        let routeObject = this._router.routes.find(r => r.route === route);

        if (!routeObject) {
            return;
        }

        const {settings} = routeObject;
        const {counts = {}} = settings;

        counts[groupId] = count;

        const badgeCount = Object.keys(counts).reduce((a, b) => a + counts[b], 0);

        routeObject.settings = {...settings, badgeCount, counts};
    }
}
