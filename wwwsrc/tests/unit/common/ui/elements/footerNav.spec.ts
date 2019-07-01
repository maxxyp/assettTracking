/// <reference path="../../../../../typings/app.d.ts" />

import {FooterNav} from "../../../../../app/common/ui/elements/footerNav";
import {FooterNavObject} from "../../../../../app/common/ui/elements/models/footerNavObject";
import {Router} from "aurelia-router";

describe("the FooterNav module", () => {
    let footerNav: FooterNav;
    let footerNavObjects: FooterNavObject[];
    let navigated = false;
    beforeEach(() => {
        let router: Router = <Router>{};

        router.navigateToRoute = (route: string, params?: any, options?: any) => {
            navigated = true;
            return true;
        };

        footerNav = new FooterNav(router);

        footerNavObjects = [
            {
                label: "Date Picker",
                routeName: "datepicker",
                paramObject: { "param1": 1 },
                callback: null,
                selected: false,
                imageURL: "",
                imageHeight: 190,
                imageWidth: 150,
                iconClass: "",
                info: "",
                warning: ""
            },
            {
                label: "Star Rating",
                routeName: "starrating",
                paramObject: { "param3": 2 },
                callback: null,
                selected: false,
                imageURL: "",
                imageHeight: 64,
                imageWidth: 58,
                iconClass: "",
                info: "",
                warning: ""
            },
            {
                label: "Please Wait",
                routeName: "pleasewait",
                paramObject: { "param4": 3 },
                callback: null,
                selected: false,
                imageURL: "https://cdn1.iconfinder.com/data/icons/sharovar-outline/128/Settings-128.png",
                imageHeight: 64,
                imageWidth: 58,
                iconClass: "",
                info: "",
                warning: ""
            }
            ,
            {
                label: "Converters",
                routeName: "converters",
                paramObject: { "param4": 4 },
                callback: null,
                selected: false,
                imageURL: "",
                imageHeight: 190,
                imageWidth: 150,
                iconClass: "fa fa-rocket",
                info: "",
                warning: ""
            }
        ];
        footerNav.footerNavObject = footerNavObjects;
    });

    it("can be created", () => {
        expect(footerNav).toBeDefined();
    });

    it("can be attached with undefined selected button and no navstyle", (done) => {
        footerNav.setSelected = undefined;
        footerNav.attached();
        expect(footerNav.navPosition === "styleFixed" && footerNav.navStyle === "").toBeTruthy();
        done();
    });
    it("can be attached with selected button and no navstyle", (done) => {
        footerNav.setSelected = 1;
        footerNav.attached();
        expect(footerNav.navPosition === "styleFixed" && footerNav.navStyle === "" && footerNav.footerNavObject[footerNav.setSelected].selected === true).toBeTruthy();
        done();
    });

    it("can be attached with undefined selected button and card navstyle", (done) => {
        footerNav.setSelected = undefined;
        footerNav.navStyle = "card";
        footerNav.attached();
        expect(footerNav.navPosition === "styleAbsolute" && footerNav.navStyle === "card").toBeTruthy();
        done();
    });

    it("can be attached with selected button and card navstyle", (done) => {
        footerNav.setSelected = 1;
        footerNav.navStyle = "card";
        footerNav.attached();
        expect(footerNav.navPosition === "styleAbsolute" && footerNav.navStyle === "card" && footerNav.footerNavObject[footerNav.setSelected].selected === true).toBeTruthy();
        done();
    });

    it("nav expanded attribute shows all", (done) => {
        footerNav.setSelected = 1;
        footerNav.navStyle = "card";
        footerNav.expanded = true;
        footerNav.attached();
        expect(footerNav.navPosition === "styleAbsolute" && footerNav.navStyle === "card" && footerNav.showHideNav).toBeTruthy();
        done();
    });

    it("has nav objects", () => {
        expect(footerNav.footerNavObject.length > 0).toBeTruthy();
    });

    it("can select active button", () => {
        footerNav.setActiveButton(0);
        expect(footerNav.footerNavObject[0].selected).toEqual(true);
    });

    it("can not select out of range button", () => {
        footerNav.setActiveButton(0);
        footerNav.setActiveButton(10);
        expect(footerNav.footerNavObject[0].selected).toEqual(true);
    });

    it("toggle nav details hidden", () => {
        footerNav.showHideNav = false;
        footerNav.showHideNavDetails();
        expect(footerNav.showHideNav).toBeTruthy();
    });
    it("toggle nav details showing", () => {
        footerNav.showHideNav = true;
        footerNav.showHideNavDetails();
        expect(footerNav.showHideNav).toBeFalsy();
    });
    it("can navigate with callback", () => {
        let callbackCalled = false;
        let footerNavObject = {
                label: "Date Picker",
                routeName: "datepicker",
                paramObject: { "param1": 1 },
                callback: (): void => {
                    callbackCalled = true;
                },
                selected: false,
                imageURL: "",
                imageHeight: 190,
                imageWidth: 150,
                iconClass: "",
                info: "",
                warning: ""
            };
        footerNav.navigate(footerNavObject);
        expect(callbackCalled).toBeTruthy();
    });

    it("can navigate with router", () => {
        navigated = false;

        let footerNavObject: FooterNavObject = {
            label: "Date Picker",
            routeName: "datepicker",
            paramObject: { "param1": 1 },
            callback: null,
            selected: false,
            imageURL: "",
            imageHeight: 190,
            imageWidth: 150,
            iconClass: "",
            info: "",
            warning: ""
        };
        footerNav.navigate(footerNavObject);
        expect(navigated).toBeTruthy();
    });
});
