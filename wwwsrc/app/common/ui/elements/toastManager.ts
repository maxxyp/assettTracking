import { customElement } from "aurelia-templating";
import { IToastItem } from "./models/IToastItem";
import { EventAggregator } from "aurelia-event-aggregator";
import { inject } from "aurelia-dependency-injection";
import { UiConstants } from "./constants/uiConstants";
import { Threading } from "../../core/threading";
import { ToastPosition } from "./models/toastPosition";
import { ISoundService } from "../services/ISoundService";
import { SoundService } from "../services/soundService";

const FADE_OUT_TIME = 900;
const ONE_SECOND_MS = 1000;

@customElement("toast-manager")
@inject(EventAggregator, SoundService)
export class ToastManager {
    public toasts: IToastItem[];
    public toastPosition: string;

    private _eventAggregator: EventAggregator;
    private _lastCloseDelay: number;
    private _lastFadeOutDelay: number;
    private _soundService: ISoundService;

    constructor(eventAggregator: EventAggregator, soundService: ISoundService) {
        this.toasts = [];
        this._eventAggregator = eventAggregator;
        this._soundService = soundService;

        this._eventAggregator.subscribe(UiConstants.TOAST_ADDED, (toast: IToastItem) => {
            if (toast) {
                let lastToast = this.toasts.length > 0 && this.toasts[0];
                if (!toast.position) {
                    this.toastPosition = ToastPosition[4];
                } else {
                    this.toastPosition = ToastPosition[toast.position];
                }
                if (lastToast && lastToast.content === toast.content) {
                    if (this._lastCloseDelay) {
                        Threading.stopDelay(this._lastCloseDelay);
                        this.setUpDelay(lastToast);
                    }
                    if (this._lastFadeOutDelay) {
                        Threading.stopDelay(this._lastFadeOutDelay);
                    }
                    return;
                }
                if (toast.notificationSound) {
                    this._soundService.play(toast.notificationSound);
                }
                this.toasts.unshift(toast);
                this.setUpDelay(toast);
                this.setToastAction(toast);
            }
        });
    }

    public closeToast(toast: IToastItem): void {
        toast.style += " fade-out";
        this._lastFadeOutDelay = Threading.delay(() => {
            let toastPos = this.toasts.indexOf(toast);
            if (toastPos >= 0) {
                this.toasts.splice(toastPos, 1);
                if (toast.id) {
                    this._eventAggregator.publish(UiConstants.TOAST_REMOVED, toast);
                }
            }
        }, FADE_OUT_TIME);
    }

    private setUpDelay(toast: IToastItem): void {
        const autoDismiss: boolean = toast.autoDismiss === undefined ? true : toast.autoDismiss;
        if (autoDismiss && toast.dismissTime) {
            this._lastCloseDelay = Threading.delay(() => this.closeToast(toast), toast.dismissTime * ONE_SECOND_MS);
        }
    }

    private setToastAction(toast: IToastItem): void {
        if (toast.toastAction) {
            if (!toast.toastAction.label) {
                toast.toastAction.label = "Details";
            }
            if (!toast.toastAction.action) {
                toast.toastAction.isExpanded = false;
                toast.toastAction.action = (t) => {
                    if (t) {
                        t.toastAction.isExpanded = !t.toastAction.isExpanded;
                        Threading.stopDelay(this._lastCloseDelay);
                    }
                };
            }
        }
    }
}
