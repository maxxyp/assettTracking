/// <reference path="../../../../../typings/app.d.ts" />
import { History } from "aurelia-history";
import { NavigationOptions } from "aurelia-history";
import { ILinkHandler } from "./ILinkHandler";
import { inject } from "aurelia-dependency-injection";
import { Threading } from "../../threading";
import { DefaultLinkHandler } from "./defaultLinkHandler";

@inject(DefaultLinkHandler)
export class HistoryWua extends History {
    private _stack: string[];
    private _routeHandler: (route: string) => boolean;
    private _linkHandler: ILinkHandler;

    constructor(linkHandler: ILinkHandler) {
        super();

        this._linkHandler = linkHandler;
    }

    public activate(options: { root: string; routeHandler: (route: string) => boolean }): boolean {
        this._stack = [];

        options.root = options.root || "/";

        this._stack.push(options.root);
        this._routeHandler = options.routeHandler;

        this._linkHandler.activate(this);

        return this._routeHandler(options.root);
    }

    public deactivate(): void {
        this._linkHandler.deactivate();
    }

    public navigate(fragment: string, options?: NavigationOptions): boolean {
        if (fragment.length > 0 && fragment[0] === "#") {
            fragment = fragment.substr(1);
        }

        fragment = fragment.replace(/^\/+|\/+$/g, "/");

        let replace = options && options.replace;

        if (this._stack[this._stack.length - 1] !== fragment || replace) {
            if (replace) {
                this._stack[this._stack.length - 1] = fragment;
            } else {
                this._stack.push(fragment);
            }
        }

        if (!options || options.trigger || replace) {
            return this._routeHandler(fragment);
        } else {
            return false;
        }
    }

    public navigateBack(): void {
        if (this._stack.length > 1) {
            this._stack.pop();
            Threading.nextCycle(() => this.navigate(this._stack.pop()));
        }
    }

    public setTitle(title: string): void {
    }

    public setState(key: string, value: any): void {
    }

    public getState(key: string): any {
        
    }
}
