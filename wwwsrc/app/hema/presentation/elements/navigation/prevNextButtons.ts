/// <reference path="../../../../../typings/app.d.ts" />
import { Router } from "aurelia-router";
import { customElement, bindable } from "aurelia-templating";
import { inject } from "aurelia-dependency-injection";
import { bindingMode } from "aurelia-binding";
import { Subscription, EventAggregator } from "aurelia-event-aggregator";

@customElement("prev-next-buttons")
@inject(Router, EventAggregator)
export class PrevNextButtons {

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public values: string[];

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public paramId: string;

    public hasPrevious: boolean;
    public hasNext: boolean;
    public info: string;

    private _router: Router;
    private _subscription: Subscription;
    private _eventAggregator: EventAggregator;

    constructor(router: Router, eventAggregator: EventAggregator) {
        this._router = router;
        this._eventAggregator = eventAggregator;
    }

    public attached(): void {
        this._subscription = this._eventAggregator.subscribe("router:navigation:complete", () => this.updateStateFromCurrent());
        this.updateStateFromCurrent();
    }

    public detached(): void {
        if (this._subscription) {
            this._subscription.dispose();
            this._subscription = null;
        }
    }

    public get hasMultipleItems(): boolean {
        return this.values && this.values.length > 1;
    }

    public paramIdChanged(): void {
        this.updateStateFromCurrent();
    }

    public valuesChanged(): void {
        this.updateStateFromCurrent();
    }

    public navigateToNext(): void {
        let currentId = this.getCurrentId();
        if (currentId) {
            let currentIndex = this.values.indexOf(currentId);

            if (currentIndex < this.values.length - 1) {

                let paramRouter = this.getRouterForParam(this._router, this.paramId);

                if (paramRouter) {
                    paramRouter.navigate(paramRouter.currentInstruction.fragment.replace(currentId, this.values[currentIndex + 1]));
                }
            }
        }
    }

    public navigateToPrevious(): void {
        let currentId = this.getCurrentId();
        if (currentId) {
            let currentIndex = this.values.indexOf(currentId);

            if (currentIndex > 0) {
                let paramRouter = this.getRouterForParam(this._router, this.paramId);

                if (paramRouter) {
                    paramRouter.navigate(paramRouter.currentInstruction.fragment.replace(currentId, this.values[currentIndex - 1]));
                }
            }
        }
    }

    private updateStateFromCurrent(): void {
        let currentId = this.getCurrentId();
        if (currentId) {
            let index = this.values.indexOf(currentId);

            let info = "";
            let hasPrevious = false;
            let hasNext = false;

            if (index >= 0) {
                info = (index + 1) + "/" + this.values.length;
                hasPrevious = this.values.length > 1 && index > 0;
                hasNext = this.values.length > 1 && (index < (this.values.length - 1));
            }

            this.hasPrevious = hasPrevious;
            this.hasNext = hasNext;
            this.info = info;
        }
    }

    private getCurrentId(): string {
        if (this.paramId && this.values && this.values.length > 0) {
            let paramRouter = this.getRouterForParam(this._router, this.paramId);

            if (paramRouter) {
                return paramRouter.currentInstruction.params[this.paramId];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    private getRouterForParam(router: Router, paramId: string): Router {
        let paramRouter = router;

        let done: boolean = false;

        do {
            if (paramRouter &&
                paramRouter.currentInstruction &&
                paramRouter.currentInstruction.params &&
                paramRouter.currentInstruction.params[paramId]) {
                done = true;
            } else if (paramRouter.parent) {
                paramRouter = paramRouter.parent;
            } else {
                done = true;
                paramRouter = null;
            }
        }
        while (!done);

        return paramRouter;
    }
}
