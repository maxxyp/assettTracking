import * as Logging from "aurelia-logging";
import { Container } from "aurelia-dependency-injection";
import { ViewModelState } from "../elements/viewModelState";
import { BaseException } from "../../../common/core/models/baseException";
import { ILabelService } from "../../business/services/interfaces/ILabelService";
import { BusinessException } from "../../business/models/businessException";
import { Guid } from "../../../common/core/guid";
import { IToastItem } from "../../../common/ui/elements/models/IToastItem";
import { EventAggregator } from "aurelia-event-aggregator";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { StringHelper } from "../../../common/core/stringHelper";
import { Confirmation } from "../modules/confirmation/confirmation";
import { DialogService, DialogResult } from "aurelia-dialog";
import { CatalogConstants } from "../../business/services/constants/catalogConstants";
import { AppConstants } from "../../../appConstants";
import { Router, Redirect } from "aurelia-router";
import { StorageService } from "../../business/services/storageService";
import { IStorageService } from "../../business/services/interfaces/IStorageService";
import { ApplicationSettings } from "../../business/models/applicationSettings";

export abstract class BaseViewModel {
    public viewState: number;
    public viewStateText: string;

    public labels: { [key: string]: string };
    public catalog: CatalogConstants;
    public element: HTMLElement;
    public appSettings: ApplicationSettings;

    protected _labelService: ILabelService;
    protected _eventAggregator: EventAggregator;
    protected _dialogService: DialogService;
    protected _isCleanInstance: boolean;
    protected _isActivated: boolean;

    protected _logger: Logging.Logger;
    protected _activateAsync: Promise<void>;

    private _scrollableContainer: HTMLElement;

    constructor(labelService: ILabelService, eventAggregator: EventAggregator, dialogService: DialogService) {
        this._labelService = labelService;
        this._eventAggregator = eventAggregator;
        this._dialogService = dialogService;

        this._logger = Logging.getLogger(ObjectHelper.getClassName(this));
        this.catalog = CatalogConstants;

        this._isCleanInstance = true;
        this._isActivated = false;
        this.labels = {};
        this.showBusy("Loading, please wait...");
        this._activateAsync = Promise.resolve(null);
        let storage: IStorageService = Container.instance.get(StorageService);
        storage.getAppSettings()
            .then((settings: ApplicationSettings) => {
                if (settings) {
                    this.appSettings = settings;
                }
            });
    }

    public showBusy(message: string): void {
        this.viewState = ViewModelState.busy;
        this.viewStateText = message;
    }

    public showContent(): void {
        this.viewState = ViewModelState.content;
        this.viewStateText = "";
    }

    public scrollToTop(): void {
        this._scrollableContainer.scrollTop = 0;
    }

    public showError(exception: any | BaseException): void {
        let exceptionText: string = "";

        if (exception === null || exception === undefined) {
            exceptionText = "A problem has occurred, we were unable to identify any additional details.";
        } else if (exception instanceof BaseException) {
            exceptionText = exception.toString();
        } else {
            if (exception.message && exception.stack) {
                exceptionText = exception.message + "\n" + exception.stack;
            } else {
                exceptionText = exception;
            }
        }

        this.showDanger(this.getLabel("errorTitle"), this.getLabel("errorDescription"), exceptionText, 0);

        this._logger.error(exception && exception.toString());
    }

    public showDanger(title: string, message: string, details?: string, dismissTime?: number): string {
        return this.showToast(title, message, "danger", details, dismissTime);
    }

    public showSuccess(title: string, message: string, details?: string, dismissTime?: number): string {
        return this.showToast(title, message, "success", details, dismissTime);
    }

    public showInfo(title: string, message: string, details?: string, dismissTime?: number): string {
        return this.showToast(title, message, "info", details, dismissTime);
    }

    public showWarning(title: string, message: string, details?: string, dismissTime?: number): string {
        return this.showToast(title, message, "warning", details, dismissTime);
    }

    public showToast(title: string, message: string, style: string, details?: string, dismissTime?: number): string {
        let toastItem: IToastItem = {
            id: Guid.newGuid(),
            title: title,
            content: message,
            style: style,
            dismissTime: dismissTime !== undefined ? dismissTime : 2.25
        };
        if (details) {
            toastItem.toastAction = { details: details };
        }
        this._eventAggregator.publish(AppConstants.APP_TOAST_ADDED, toastItem);
        return toastItem.id;
    }

    public showConfirmation(title: string, message: string, yesLabel?: string, noLabel?: string): Promise<DialogResult> {
        if (!yesLabel) {
            yesLabel = this.getLabel("yes");
        }
        if (!noLabel) {
            noLabel = this.getLabel("no");
        }
        return this._dialogService.open({ viewModel: Confirmation, model: { title: title, message: message, yesLabel: yesLabel, noLabel: noLabel } });
    }

    public showDeleteConfirmation(): Promise<boolean> {
        let title = this.getLabel("confirmation");
        let objectName = this.getLabel("objectName");
        if (StringHelper.endsWith(objectName, "ies")) {
            objectName = objectName.substr(0, objectName.length - 3) + "y";
        }
        if (StringHelper.endsWith(objectName, "s")) {
            objectName = objectName.substr(0, objectName.length - 1);
        }
        let deleteContent = this.getParameterisedLabel("deleteQuestion", [objectName.toLowerCase()]);

        return this.showConfirmation(title, deleteContent)
            .then((dialogResult) => {
                return !dialogResult.wasCancelled;
            });
    }

    public canActivate(...rest: any[]): Promise<boolean | Redirect > {
        this._logger.debug(ObjectHelper.getClassName(this) + " => canActivate");

        return this.canActivateAsync(...rest);
    }

    public activate(...rest: any[]): Promise<void> {
        this._logger.debug(ObjectHelper.getClassName(this) + " => activate");
        this._isActivated = true;

        let router = rest.length > 1 && rest[1] && rest[1].navModel && rest[1].navModel.router;
        if (router) {
            let viewPorts = <any>router.viewPorts;
            this.element = viewPorts && viewPorts.default && viewPorts.default.element;
            this._scrollableContainer = this.findScrollableViewPort(router);
        }

        return this.loadLabels(StringHelper.toCamelCase(ObjectHelper.getClassName(this))).then(() => {
            this._activateAsync = this.activateAsync(...rest);
            if (this._activateAsync) {
                this._activateAsync.then(() => {
                    this._isCleanInstance = false;
                }).catch((error) => {
                    this.showError(error);
                });
            }
        }).catch((error) => {
            this.showError(error);
        });
    }

    public attached(): void {
        this._logger.debug(ObjectHelper.getClassName(this) + " => attached");

        let ret: Promise<void> = this.attachedAsync();
        if (ret) {
            ret.catch((error) => {
                this.showError(error);
            });
        }
    }

    public detached(): Promise<void> {
        this._logger.debug(ObjectHelper.getClassName(this) + " => detached");

        let ret: Promise<void> = this.detachedAsync();
        if (ret) {
            ret.catch((error) => {
                this.showError(error);
            });
        }

        return Promise.resolve();
    }

    public canDeactivate(): Promise<boolean> {
        /* only do canDeactivate logic if the view is activated */
        if (this._isActivated) {
            this._logger.debug(ObjectHelper.getClassName(this) + " => canDeactivate");

            /*
                We keep the this._activateAsync reference to the this.activateAsync(...rest) promise that is fired off in activate.
                That promise is not part of its parent promise chain.  In our screens save() is called during
                deactivate (beacause of our "save on page navigate away" approach).  If a navigation is made too quickly, it
                may fire off the save() code before activateAsync completes - resulting in uncertain behaviour and
                most likely null exceptions as models may not be loaded.  So here we chain off the activateAsync promise to ensure
                that that has completed before the save logic fires.
            */
            return this._activateAsync
                .catch(() => { }) // if this._activateAsync falls over, we still want to let the user get away from this page
                .then(() => this.canDeactivateAsync())
                .then((canDeactivate) => {
                    if (canDeactivate) {
                        this._isActivated = false;
                    }
                    return canDeactivate;
                });
        } else {
            return Promise.resolve(true);
        }
    }

    public deactivate(): Promise<void> {
        this._logger.debug(ObjectHelper.getClassName(this) + " => deactivate");

        let ret: Promise<void> = this.deactivateAsync();
        if (ret) {
            ret.catch((error) => {
                this.showError(error);
            });
        }

        return ret;
    }

    public canActivateAsync(...rest: any[]): Promise<boolean | Redirect> {
        return Promise.resolve(true);
    }

    public activateAsync(...rest: any[]): Promise<void> {
        return Promise.resolve();
    }

    public attachedAsync(): Promise<void> {
        return Promise.resolve();
    }

    public detachedAsync(): Promise<void> {
        return Promise.resolve();
    }

    public canDeactivateAsync(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public deactivateAsync(): Promise<void> {
        return Promise.resolve();
    }

    public getLabel(labelId: string): string {
        if (!(labelId in this.labels)) {
            throw new BusinessException(this, "getLabel", "Unable to get label '{0}' for viewModel '{1}'", [labelId, ObjectHelper.getClassName(this)], null);
        }
        return this.labels[labelId];
    }

    public getParameterisedLabel(labelId: string, parameters: any[]): string {
        if (!(labelId in this.labels)) {
            throw new BusinessException(this, "getParameterisedLabel", "Unable to get label '{0}' for viewModel '{1}'", [labelId, ObjectHelper.getClassName(this)], null);
        }

        let labelText: string = this.labels[labelId];

        if (parameters && parameters.length > 0) {
            return labelText.replace(/{(\d+)}/g, (match, idx) => {
                return parameters[idx];
            });
        } else {
            return labelText;
        }
    }

    public loadLabels(groupName: string): Promise<void> {
        return !this._labelService ? Promise.resolve() : this._labelService.getGroup(groupName)
            .then((labels) => this.attachLabels(labels));
    }

    public attachLabels(labels: { [key: string]: string }): void {
        if (!labels) {
            return;
        }

        for (let labelKey in labels) {
            this.labels[labelKey] = this.labels[labelKey] || labels[labelKey];
        }
    }

    private findScrollableViewPort(router: Router): HTMLElement {
        let viewPorts = <any>router.viewPorts;
        let element = viewPorts && viewPorts.default && viewPorts.default.element;
        if (element) {
            let style = getComputedStyle(element);
            let excludeStaticParent = style.position === "absolute";
            let overflowRegex = /(auto|scroll)/;

            if (style.position === "fixed") {
                return document.body;
            }

            if (excludeStaticParent && style.position === "static") {
                if (router.parent) {
                    return this.findScrollableViewPort(router.parent);
                } else {
                    return null;
                }
            }

            if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
                return element;
            }

        }
        if (router.parent) {
            return this.findScrollableViewPort(router.parent);
        }
        return null;
    }
}
