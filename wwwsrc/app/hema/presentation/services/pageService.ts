import { inject } from "aurelia-dependency-injection";
import { PageModel } from "../models/pageModel";
import { IPageService } from "./interfaces/IPageService";
import { EventAggregator } from "aurelia-event-aggregator";
import { JobServiceConstants } from "../../business/services/constants/jobServiceConstants";
import { ILabelService } from "../../business/services/interfaces/ILabelService";
import { LabelService } from "../../business/services/labelService";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { StringHelper } from "../../../common/core/stringHelper";

@inject(EventAggregator, LabelService)
export class PageService implements IPageService {
    private _pageModels: PageModel[];
    private _eventAggregator: EventAggregator;
    private _labelService: ILabelService;
    private _labels: { [key: string]: string };

    constructor(eventAggregator: EventAggregator, labelService: ILabelService) {
        this._pageModels = [];
        this._eventAggregator = eventAggregator;
        this._eventAggregator.subscribe(JobServiceConstants.JOB_STATE_CHANGED, () => this.clearPageVisitedHistory());
        this._labelService = labelService;
    }

    public async addOrUpdateLastVisitedPage(url: string): Promise<void> {
        let pageName: string = await this.getPageName(url);
        if (pageName) {
            let isPageItemIDRequired: boolean = this.isPageItemIDRequired(url);
            let urlVals = this.getRouteNameAndPageItemId(url, pageName, isPageItemIDRequired);
            let pageModel = this._pageModels.length > 0 ? this._pageModels.find(p => p.pageName === pageName && p.itemId === urlVals.pageItemId) : undefined;

            if (urlVals.routeName) {
                (pageModel) ? pageModel.routeName = urlVals.routeName :
                    this._pageModels.push(new PageModel(pageName, urlVals.pageItemId, urlVals.routeName));
            } else if (urlVals.pageItemId) {
                let defaultRoute = this._labels[pageName];
                this._pageModels.push(new PageModel(pageName, urlVals.pageItemId, defaultRoute));
            }
        }
    }

    public getLastVisitedPage(pageName: string, pageItemId?: string, isNavButtons: boolean = false): string {
        let pageModel = this._pageModels.find(p => p.pageName === this._labels[StringHelper.toCamelCase(pageName)] && p.itemId === pageItemId);
        return pageModel ? pageModel.routeName : undefined;
    }

    public async getLastVisitedPageUrl(url: string): Promise<string> {
        let tabName = await this.getPageName(url);
        let urlvals = (tabName) ? this.getRouteNameAndPageItemId(url, tabName, true) : undefined;
        let pageModel = this._pageModels.length > 0 ? this._pageModels.find(p => p.pageName === tabName && p.itemId === urlvals.pageItemId) : undefined;
        return (pageModel) ? url.replace(urlvals.routeName, pageModel.routeName) : url;
    }

    private clearPageVisitedHistory(): void {
        this._pageModels = [];
    }

    private getRouteNameAndPageItemId(url: string, tabName: string, isPageItemIdIndexExist: boolean): any {
        let urlParts = url.split("/") || [];
        let index = urlParts.findIndex(p => p === tabName);
        return {
            pageItemId: (isPageItemIdIndexExist) ? urlParts[index + 1] || undefined : undefined,
            routeName: (isPageItemIdIndexExist) ? urlParts[index + 2] || undefined : urlParts[index + 1] || undefined
        };
    }

    private async getPageName(url: string): Promise<string> {
        if (!this._labels) {
            this._labels = await this._labelService.getGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(this)));
        }

        if (url.indexOf(this._labels.taskMain) > -1) {
            return this._labels.taskMain;
        } else if (url.indexOf(this._labels.propertySafetyMain) > -1) {
            return this._labels.propertySafetyMain;
        } else if (url.indexOf(this._labels.applianceMain) > -1) {
            return this._labels.applianceMain;
        } else if (url.indexOf(this._labels.partsMain) > -1) {
            return this._labels.partsMain;
        } else if (url.indexOf(this._labels.consumablesMain) > -1) {
            return this._labels.consumablesMain;
        } else {
            return undefined;
        }
    }

    private isPageItemIDRequired(url: string): boolean {
        if (url.indexOf(this._labels.taskMain) > -1 || url.indexOf(this._labels.applianceMain) > -1) {
            return true;
        } else {
            return false;
        }
    }
}
