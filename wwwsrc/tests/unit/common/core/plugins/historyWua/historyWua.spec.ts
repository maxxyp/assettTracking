/// <reference path="../../../../../../typings/app.d.ts" />

import {HistoryWua} from "../../../../../../app/common/core/plugins/historyWua/historyWua";
import {ILinkHandler} from "../../../../../../app/common/core/plugins/historyWua/ILinkHandler";

describe("the HistoryWua module", () => {
    let historyWua: HistoryWua;
    let linkHandler: ILinkHandler;
    let sandbox: Sinon.SinonSandbox;
    let activated: boolean;
    let deactivated: boolean;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        linkHandler = <ILinkHandler>{};
        linkHandler.activate = () => activated = true;
        linkHandler.deactivate = () => deactivated = true;
        historyWua = new HistoryWua(linkHandler);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(historyWua).toBeDefined();
    });

    it("can set title", () => {
        historyWua.setTitle("fred");
        expect(historyWua).toBeDefined();
    });

    it("can activate with root", () => {
        let routeSet: string = "";
        let options: { root: string; routeHandler: (route: string) => boolean} = {
            root: "root",
            routeHandler: (route): boolean => {
                routeSet = route;
                return true;
            }
        };
        historyWua.activate(options);
        expect(routeSet).toEqual("root");
        expect(activated).toBeTruthy();
    });

    it("can activate no root", () => {
        let routeSet: string = "";
        let options: { root: string; routeHandler: (route: string) => boolean} = {
            root: null,
            routeHandler: (route): boolean => {
                routeSet = route;
                return true;
            }
        };
        historyWua.activate(options);
        expect(routeSet).toEqual("/");
        expect(activated).toBeTruthy();
    });

    it("can deactivate", () => {
        historyWua.deactivate();
        expect(deactivated).toBeTruthy();
    });

    it("can navigate to empty fragment", () => {
        historyWua = new HistoryWua(linkHandler);
        let routeSet: string = "";
        let options: { root: string; routeHandler: (route: string) => boolean} = {
            root: null,
            routeHandler: (route): boolean => {
                routeSet = route;
                return true;
            }
        };
        historyWua.activate(options);
        let ret = historyWua.navigate("");
        expect(routeSet).toEqual("");
        expect(ret).toBeTruthy();
    });

    it("can navigate to duplicate empty fragment after back", () => {
        historyWua = new HistoryWua(linkHandler);
        let routeSet: string = "";
        let options: { root: string; routeHandler: (route: string) => boolean} = {
            root: null,
            routeHandler: (route): boolean => {
                routeSet = route;
                return true;
            }
        };
        historyWua.activate(options);
        historyWua.navigate("#blah");
        historyWua.navigateBack();
        let ret = historyWua.navigate("#blah");
        expect(routeSet).toEqual("blah");
        expect(ret).toBeTruthy();
    });

    it("can navigate to fragment", () => {
        historyWua = new HistoryWua(linkHandler);
        let routeSet: string = "";
        let options: { root: string; routeHandler: (route: string) => boolean} = {
            root: null,
            routeHandler: (route): boolean => {
                routeSet = route;
                return true;
            }
        };
        historyWua.activate(options);
        let ret = historyWua.navigate("#blah");
        expect(routeSet).toEqual("blah");
        expect(ret).toBeTruthy();
    });

    it("can navigate to second fragment", () => {
        historyWua = new HistoryWua(linkHandler);
        let routeSet: string = "";
        let options: { root: string; routeHandler: (route: string) => boolean} = {
            root: null,
            routeHandler: (route): boolean => {
                routeSet = route;
                return true;
            }
        };
        historyWua.activate(options);
        historyWua.navigate("#foo");
        let ret = historyWua.navigate("#blah");
        expect(routeSet).toEqual("blah");
        expect(ret).toBeTruthy();
    });

    it("can navigate back with no stack", () => {
        historyWua = new HistoryWua(linkHandler);
        let routeSet: string = "";
        let options: { root: string; routeHandler: (route: string) => boolean} = {
            root: null,
            routeHandler: (route): boolean => {
                routeSet = route;
                return true;
            }
        };
        historyWua.activate(options);
        historyWua.navigateBack();
        historyWua.navigateBack();
        let ret = historyWua.navigate("#blah");
        expect(routeSet).toEqual("blah");
        expect(ret).toBeTruthy();
    });

    it("can navigate to fragment with replace", () => {
        historyWua = new HistoryWua(linkHandler);
        let routeSet: string = "";
        let options: { root: string; routeHandler: (route: string) => boolean} = {
            root: null,
            routeHandler: (route): boolean => {
                routeSet = route;
                return true;
            }
        };
        historyWua.activate(options);
        let ret = historyWua.navigate("#blah", {replace: true, trigger: true});
        expect(routeSet).toEqual("blah");
        expect(ret).toBeTruthy();
    });

    it("can navigate to fragment but not trigger", () => {
        historyWua = new HistoryWua(linkHandler);
        let routeSet: string = "";
        let options: { root: string; routeHandler: (route: string) => boolean} = {
            root: "root",
            routeHandler: (route): boolean => {
                routeSet = route;
                return true;
            }
        };
        historyWua.activate(options);
        let ret = historyWua.navigate("#blah", {replace: false, trigger: false});
        expect(routeSet).toEqual("root");
        expect(ret).toBeFalsy();
    });

    it("can navigate back", (done) => {
        historyWua = new HistoryWua(linkHandler);
        let routeSet: string = "";
        let options: { root: string; routeHandler: (route: string) => boolean} = {
            root: "root",
            routeHandler: (route): boolean => {
                routeSet = route;
                return true;
            }
        };
        historyWua.activate(options);
        historyWua.navigate("#blah");
        historyWua.navigate("#foo");

        setTimeout(() => {
            expect(routeSet).toEqual("blah");
            done();
        }, 50);

        historyWua.navigateBack();
    });
});
