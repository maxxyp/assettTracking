/// <reference path="../../../typings/app.d.ts" />

import {Router} from "aurelia-router";

export class NamedRedirect {

    private _name: string;
    private _params: any;
    private _options: any;
    private _childRouter: Router;

    constructor(name: string, params?: any, options?: any) {
        this._name = name;
        this._params = params;
        this._options = options;
    }

    public setRouter(router: Router): void {
        this._childRouter = router;
    }

    public navigate(appRouter: Router): Promise<boolean> {

        let router = this._options && this._options.useChildRouter && this._childRouter
                        ? this._childRouter
                        : appRouter;

        return new Promise<boolean>((resolve, reject) => {
            if (this._name) {
                let url: string = router.generate(this._name, this._params);
                resolve(router.navigate(url, this._options));
            } else {
                resolve(router.navigate("", this._options));
            }
        });
    }
}
