/// <reference path="../../../../typings/app.d.ts" />

import { DomHelper } from "../../../../app/common/ui/domHelper";
import {Threading} from "../../../../app/common/core/threading";

describe("DomHelper", () => {
    let domHelper: DomHelper;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        domHelper = new DomHelper();
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(domHelper).toBeDefined();
    });

    it("can be scrolled down to element", (done) => {
        let win: any = {};
        win.scrollY = 0;
        win.scrollTo = (x: number, y: number) => {
            win.scrollY = y;
        };
        DomHelper.setWindowTarget(win);
        let ele: any = {};
        ele.offsetTop = 300;
        window.scrollTo(0, 0);
        DomHelper.scrollToElement(ele, 100);
        Threading.delay(() => {
            expect(win.scrollY).toEqual(300);
            done();
        }, 300);
    });
    it("can be scrolled down to element", (done) => {
        let win: any = {};
        win.scrollY = 0;
        win.scrollTo = (x: number, y: number) => {
            win.scrollY = y;
        };
        DomHelper.setWindowTarget(win);
        let ele: any = {};
        ele.offsetTop = 300;
        window.scrollTo(0, 0);
        DomHelper.scrollToElement(ele, 100);
        Threading.delay(() => {
            expect(win.scrollY).toEqual(300);
            done();
        }, 300);
    });
    it("can be scrolled up to element", (done) => {
        let win: any = {};
        win.scrollY = 300;
        win.scrollTo = (x: number, y: number) => {
            win.scrollY = y;
        };

        DomHelper.setWindowTarget(win);
        let ele: any = {};
        ele.offsetTop = 0;
        window.scrollTo(0, 0);
        DomHelper.scrollToElement(ele, 100);
        Threading.delay(() => {
            expect(win.scrollY).toEqual(0);
            done();
        }, 300);
    });

    it("can jump to element", (done) => {
        let win: any = {};
        win.scrollY = 0;
        win.scrollTo = (x: number, y: number) => {
            win.scrollY = y;
        };

        DomHelper.setWindowTarget(win);
        let ele: any = {};
        ele.offsetTop = 300;
        window.scrollTo(0, 0);
        DomHelper.scrollToElement(ele, -1);
        Threading.delay(() => {
            expect(win.scrollY).toEqual(300);
            done();
        }, 100);
    });

    it("can jump to element with adjustment", (done) => {
        let win: any = {};
        win.scrollY = 0;
        win.scrollTo = (x: number, y: number) => {
            win.scrollY = y;
        };

        DomHelper.setWindowTarget(win);
        let ele: any = {};
        ele.offsetTop = 300;
        window.scrollTo(0, 0);
        DomHelper.scrollToElement(ele, -1, 20);
        Threading.delay(() => {
            expect(win.scrollY).toEqual(320);
            done();
        }, 100);
    });

    it("can jump to top", (done) => {
        let win: any = {};
        win.scrollY = 100;
        win.scrollTo = (x: number, y: number) => {
            win.scrollY = y;
        };
        DomHelper.setWindowTarget(win);
        DomHelper.jumpToTop();
        Threading.delay(() => {
            expect(win.scrollY).toEqual(0);
            done();
        }, 100);
    });

    it("can scroll to top", (done) => {
        let win: any = {};
        win.scrollY = 100;
        win.scrollTo = (x: number, y: number) => {
            win.scrollY = y;
        };
        DomHelper.setWindowTarget(win);
        DomHelper.scrollToTop();
        Threading.delay(() => {
            expect(win.scrollY).toEqual(0);
            done();
        }, 200);
    });

    it("can scroll to top", (done) => {
        let win: any = {};
        win.scrollY = 100;
        win.scrollTo = (x: number, y: number) => {
            win.scrollY = y;
        };
        DomHelper.setWindowTarget(win);
        DomHelper.scrollToTop();
        DomHelper.scrollToTop();
        Threading.delay(() => {
            expect(win.scrollY).toEqual(0);
            done();
        }, 200);
    });
    it("undefined check", (done) => {
        let win: Window;
        win = undefined;
        DomHelper.setWindowTarget(win);
        DomHelper.scrollToTop();
        Threading.delay(() => {
            expect(win).toBeUndefined();
            done();
        }, 100);
    });

    describe("getting model propertyies", () => {
        it("can get a model property from a simple path", () => {
            expect(DomHelper.getModelPropertyNameFromBindingPath("foo")).toBe("foo");
        });

        it("can get a model property from a path with |", () => {
            expect(DomHelper.getModelPropertyNameFromBindingPath("foo | bar")).toBe("foo");
        });

        it("can get a model property from a path with &", () => {
            expect(DomHelper.getModelPropertyNameFromBindingPath("foo & bar")).toBe("foo");
        });

        it("can get a model property from a path with | and &", () => {
            expect(DomHelper.getModelPropertyNameFromBindingPath("foo | bar & baz")).toBe("foo");
        });

        it("can get a model property from a path with & and |", () => {
            expect(DomHelper.getModelPropertyNameFromBindingPath("foo & bar | baz")).toBe("foo");
        });

        it("can trim the model property name", () => {
            expect(DomHelper.getModelPropertyNameFromBindingPath(" foo | bar")).toBe("foo");
        });

        it("can cope with an undefined path", () => {
            expect(DomHelper.getModelPropertyNameFromBindingPath(undefined)).toBe(undefined);
        });
    });

});
