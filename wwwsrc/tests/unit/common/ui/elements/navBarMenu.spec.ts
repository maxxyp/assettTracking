/// <reference path="../../../../../typings/app.d.ts" />

import {NavBarMenu} from "../../../../../app/common/ui/elements/navBarMenu";
import {Notification} from "../../../../../app/common/ui/elements/models/notification";
import {UiConstants} from "../../../../../app/common/ui/elements/constants/uiConstants";
import {Router, NavigationInstruction, NavigationInstructionInit} from "aurelia-router";
import {NavModel} from "aurelia-router";
import {RouteConfig} from "aurelia-router";
import {PlatformHelper} from "../../../../../app/common/core/platformHelper";
import {Threading} from "../../../../../app/common/core/threading";

describe("the NavMenuBar module", () => {
    let navBar: NavBarMenu;
    let eaStub: any;
    let sandbox: Sinon.SinonSandbox;
    let navigated: boolean;
    let navigateName: string;
    let navigateParam: any;
    let routerStub: Router;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        eaStub = {};
        eaStub.subscribe = (eventName: string, cb: (e: any) => void) => {
            eaStub.eventLookup = {};
            eaStub.eventLookup[eventName] = [];
            eaStub.eventLookup[eventName].push(cb);
        };
        eaStub.publish = (eventName: string, obj: any) => {
            eaStub.eventLookup[eventName][0](obj);
        };
        navBar = new NavBarMenu(eaStub);

        let eventTarget = <Document>{};
        eventTarget.addEventListener = (type: string, listener: (ev: Event) => any) => {
        };
        eventTarget.removeEventListener = (type: string, listener: (ev: Event) => any) => {
        };
        navBar.setEventTarget(eventTarget);

        routerStub = <Router>{};
        navigated = false;
        routerStub.navigateBack = () => {
            navigated = true;
        };
        routerStub.navigateToRoute = (route: string, params?: any, options?: any): boolean => {
            navigateName = route;
            navigateParam = params;
            return true;
        };
        navBar.router = routerStub;
    });
    afterEach(() => {
        sandbox.restore();
        PlatformHelper.navigatorAppVersion = "web";
        PlatformHelper.resetPlatform();
    });
    it("can be created", () => {
        expect(navBar).toBeDefined();
    });

    it("toggle SideMenu", () => {
        navBar.showNotifications = false;
        navBar.showMenu = false;
        navBar.toggleSideMenu();
        expect(navBar.showMenu && !navBar.showNotifications).toBeTruthy();
    });
    it("toggle SideMenu already visible", () => {
        navBar.showNotifications = true;
        navBar.showMenu = true;
        navBar.toggleSideMenu();
        expect(!navBar.showMenu && !navBar.showNotifications).toBeTruthy();
    });

    it("toggle NotificationsMenu", () => {
        navBar.showNotifications = false;
        navBar.showMenu = false;
        navBar.toggleNotificationsMenu();
        expect(navBar.showNotifications && !navBar.showMenu).toBeTruthy();
    });
    it("toggle NotificationsMenu already visible", () => {
        navBar.showNotifications = true;
        navBar.showMenu = false;
        navBar.toggleNotificationsMenu();
        expect(!navBar.showNotifications && !navBar.showMenu).toBeTruthy();
    });

    it("toggle Hide Menus", () => {
        navBar.showNotifications = true;
        navBar.showMenu = true;
        navBar.hideMenus();
        expect(!navBar.showNotifications && !navBar.showMenu).toBeTruthy();
    });

    it("can detach", () => {
        navBar.showNotifications = true;
        navBar.showMenu = true;
        navBar.detached();
        expect(!navBar.showNotifications && !navBar.showMenu).toBeTruthy();
    });

    it("can detach, wua platform", () => {
        navBar.showNotifications = true;
        navBar.showMenu = true;
        PlatformHelper.navigatorAppVersion = "MSAppHost";
        PlatformHelper.resetPlatform();
        window.Windows = {};
        window.Windows.UI = {};
        window.Windows.UI.Core = {};
        window.Windows.UI.Core.SystemNavigationManager = {};
        window.Windows.UI.Core.SystemNavigationManager.removeEventListener = sandbox.stub();
        navBar.detached();
        expect(!navBar.showNotifications && !navBar.showMenu).toBeTruthy();
    });

    it("can attached, wua platform", (done) => {
        let navModel: NavModel = <NavModel>{};
        navModel.config = <RouteConfig>{};
        navModel.config.name = "aaaa";
        navModel.settings = {
            defaultParam: "111",
            ignoreAuthRequired: true
        };
        routerStub = <Router>{};
        routerStub.navigateBack = sandbox.stub();
        routerStub.navigation = [];
        routerStub.navigation.push(navModel);
        navBar.router = routerStub;
        navBar.showNotifications = true;
        navBar.showMenu = true;
        navBar.homeShowBackButton = false;
        PlatformHelper.navigatorAppVersion = "MSAppHost";
        PlatformHelper.resetPlatform();
        window.Windows = {};
        window.Windows.UI = {};
        window.Windows.UI.Core = {};
        window.Windows.UI.Core.SystemNavigationManager = {};
        window.Windows.UI.Core.SystemNavigationManager.getForCurrentView = sandbox.stub().returns({
            addEventListener: (event: string, callback: (eventargs: { handled: boolean }) => void) => {
                Threading.delay(() => {
                    callback({ handled: true });
                    done();
                }, 600);
            }
        });
        navBar.attached();
    });

    it("can attached, wua platform no home", (done) => {
        let navModel: NavModel = <NavModel>{};
        navModel.config = <RouteConfig>{};
        navModel.config.name = "aaaa";
        navModel.settings = {
            defaultParam: "111",
            ignoreAuthRequired: true
        };
        routerStub = <Router>{};
        routerStub.navigateBack = sandbox.stub();
        routerStub.navigation = [];
        routerStub.navigation.push(navModel);
        navBar.router = routerStub;
        navBar.showNotifications = true;
        navBar.showMenu = true;
        navBar.homeShowBackButton = true;
        PlatformHelper.navigatorAppVersion = "MSAppHost";
        PlatformHelper.resetPlatform();
        window.Windows = {};
        window.Windows.UI = {};
        window.Windows.UI.Core = {};
        window.Windows.UI.Core.SystemNavigationManager = {};
        window.Windows.UI.Core.SystemNavigationManager.getForCurrentView = sandbox.stub().returns({
            addEventListener: (event: string, callback: (eventargs: { handled: boolean }) => void) => {
                Threading.delay(() => {
                    callback({ handled: true });
                    done();
                }, 600);
            }
        });
        navBar.attached();
    });

    it("can attached, non wua platform", () => {
        let navModel: NavModel = <NavModel>{};
        navModel.config = <RouteConfig>{};
        navModel.config.name = "aaaa";
        navModel.settings = {
            defaultParam: "111",
            ignoreAuthRequired: true
        };
        routerStub = <Router>{};
        routerStub.navigateBack = sandbox.stub();
        routerStub.navigation = [];
        routerStub.navigation.push(navModel);
        navBar.router = routerStub;
        navBar.showNotifications = true;
        navBar.showMenu = true;
        PlatformHelper.navigatorAppVersion = "web";
        PlatformHelper.resetPlatform();
        navBar.attached();
    });

    it("can navigate back with router", () => {
        navBar.backClicked();
        expect(navigated).toBeTruthy();
    });

    it("can navigate back with hooked event aggregator", () => {
        let eventCalled = false;
        eaStub.subscribe(UiConstants.EVENT_BACKCLICK, () => {
            eventCalled = true;
        });
        navBar.backClicked();
        expect(eventCalled).toBeTruthy();
    });

    it("can action notification", () => {
        let result = false;
        // pass notification as it expects one ( we dont use it)
        let testNotification: Notification = new Notification(
            "TestNotification", "test", "fa-menu", () => {
                return new Promise<void>((resolve, reject) => {
                    result = true;
                    resolve();
                });

            });
        navBar.notificationActioned(testNotification);
        expect(result).toBeTruthy();
    });

    it("can check home route with no parameters", () => {
        navBar.homeShowBackButton = false;
        let navInstIni: NavigationInstructionInit = <NavigationInstructionInit>{};
        let navInst: NavigationInstruction = new NavigationInstruction(navInstIni);
        let rconfig: any = {};
        rconfig.navModel = {};
        rconfig.navModel.relativeHref = "";
        navInst.config = rconfig;
        routerStub.currentInstruction = navInst;
        eaStub.publish("router:navigation:complete", null);
        expect(navBar.homeShowBackButton === false).toBeTruthy();
    });

    it("can check home route with home page", () => {
        navBar.homeShowBackButton = true;
        let navInstIni: NavigationInstructionInit = <NavigationInstructionInit>{};
        let navInst: NavigationInstruction = new NavigationInstruction(navInstIni);
        let rconfig: any = {};
        rconfig.navModel = {};
        rconfig.navModel.relativeHref = "";
        navInst.config = rconfig;
        routerStub.currentInstruction = navInst;
        eaStub.publish("router:navigation:complete", null);
        expect(navBar.homeShowBackButton).toBeFalsy();
    });

    it("can check home route with not home page", () => {
        navBar.homeShowBackButton = true
        let navInstIni: NavigationInstructionInit = <NavigationInstructionInit>{};
        let navInst: NavigationInstruction = new NavigationInstruction(navInstIni);
        let rconfig: any = {};
        rconfig.navModel = {};
        rconfig.navModel.relativeHref = "/foobar";
        navInst.config = rconfig;
        routerStub.currentInstruction = navInst;
        eaStub.publish("router:navigation:complete", null);
        expect(navBar.homeShowBackButton === true).toBeTruthy();
    });

    it("is hidden after document click", (done) => {
        let eventTarget = <Document>{};
        eventTarget.addEventListener = (type: string, listener: (ev: Event) => any)=> {
            Threading.delay(() => {
                listener(null);
                expect(navBar.showMenu === false).toBeTruthy();
                done();
            }, 600);
        };
        eventTarget.removeEventListener = (type: string, listener: (ev: Event) => any) => {
        };
        navBar.setEventTarget(eventTarget);
        navBar.toggleSideMenu();
    });

    it("is visible after quick document click", (done) => {
        let eventTarget = <Document>{};
        eventTarget.addEventListener = (type: string, listener: (ev: Event) => any) => {
            Threading.delay(() => {
                listener(null);
                expect(navBar.showMenu === true).toBeTruthy();
                done();
            }, 100);
        };
        eventTarget.removeEventListener = (type: string, listener: (ev: Event) => any) => {
        };
        navBar.setEventTarget(eventTarget);
        navBar.toggleSideMenu();
    });

    it("can navigate with a callback", (done) => {
        let navModel: NavModel = <NavModel>{};
        navModel.config = <RouteConfig>{};
        navModel.config.name = "aaaa";
        navModel.settings = {
            callback: (router: Router) => {
                expect(router).toBeDefined();
                done();
            },
            defaultParam: "111"
        };

        navBar.navigateTo(navModel);
    });

    it("can navigate to with default param", () => {
        let navModel: NavModel = <NavModel>{};
        navModel.config = <RouteConfig>{};
        navModel.config.name = "aaaa";
        navModel.settings = {
            defaultParam: "111"
        };

        navBar.navigateTo(navModel);
        expect(navigateName === "aaaa" && navigateParam === "111").toBeTruthy();
    });

    it("can navigate to with no default param", () => {
        let navModel: NavModel = <NavModel>{};
        navModel.config = <RouteConfig>{};
        navModel.config.name = "bbbb";
        navBar.navigateTo(navModel);
        expect(navigateName === "bbbb" && navigateParam === undefined).toBeTruthy();
    });

    it("isActiveChanged set item visible", () => {
        let navModel: NavModel = <NavModel>{};
        navModel.config = <RouteConfig>{};
        navModel.config.name = "aaaa";
        navModel.settings = {
            defaultParam: "111",
            authRequired: true
        };
        routerStub = <Router>{};
        routerStub.navigation = [];
        routerStub.navigation.push(navModel);
        navBar.router = routerStub;
        navBar.isActiveChanged(true, false);
        expect(navModel.settings.showItem).toBeTruthy();
    });

    it("isActiveChanged ignoreAuthRequired set item visible", () => {
        let navModel: NavModel = <NavModel>{};
        navModel.config = <RouteConfig>{};
        navModel.config.name = "aaaa";
        navModel.settings = {
            defaultParam: "111",
            authRequired: false,
            ignoreAuthRequired: true
        };
        routerStub = <Router>{};
        routerStub.navigation = [];
        routerStub.navigation.push(navModel);
        navBar.router = routerStub;
        navBar.isActiveChanged(true, false);
        expect(navModel.settings.showItem).toBeTruthy();
    });

    it("isActiveChanged set item visible", () => {
        let navModel: NavModel = <NavModel>{};
        navModel.config = <RouteConfig>{};
        navModel.config.name = "aaaa";
        navModel.settings = {
            defaultParam: "111",
            authRequired: false
        };
        routerStub = <Router>{};
        routerStub.navigation = [];
        routerStub.navigation.push(navModel);
        navBar.router = routerStub;
        navBar.isActive = false;
        navBar.isActiveChanged(false, true);
        expect(navModel.settings.showItem).toBeTruthy();
    });

    it("isActiveChanged set item not visible", () => {
        let navModel: NavModel = <NavModel>{};
        navModel.config = <RouteConfig>{};
        navModel.config.name = "aaaa";
        navModel.settings = {
            defaultParam: "111",
            authRequired: true
        };
        routerStub = <Router>{};
        routerStub.navigation = [];
        routerStub.navigation.push(navModel);
        navBar.router = routerStub;
        navBar.isActiveChanged(false, true);
        expect(routerStub.navigation[0].settings.showItem).toBeFalsy();
    });

    it("isActiveChanged set item not visible", () => {
        let navModel: NavModel = <NavModel>{};
        navModel.config = <RouteConfig>{};
        navModel.config.name = "aaaa";
        navModel.settings = {
            defaultParam: "111",
            authRequired: false
        };
        routerStub = <Router>{};
        routerStub.navigation = [];
        routerStub.navigation.push(navModel);
        navBar.router = routerStub;
        navBar.isActiveChanged(true, true);
        expect(routerStub.navigation[0].settings.showItem).toBeFalsy();
    });

    it("isActiveChanged settings in undefined, item visible", () => {
        let navModel: NavModel = <NavModel>{};
        navModel.config = <RouteConfig>{};
        navModel.config.name = "aaaa";
        navModel.settings = undefined;
        routerStub = <Router>{};
        routerStub.navigation = [];
        routerStub.navigation.push(navModel);
        navBar.router = routerStub;
        navBar.isActiveChanged(true, true);
        expect(routerStub.navigation[0].settings.showItem).toBeTruthy();
    });
});
