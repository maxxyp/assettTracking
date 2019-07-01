/// <reference path="../../../../../typings/app.d.ts" />

import {PathObserver} from "../../../../../app/common/ui/observers/pathObserver";
import {PropertyObserver, BindingEngine, Disposable} from "aurelia-binding";

describe("the PathObserver module", () => {
    let pathObserver: PathObserver;
    let sandbox: Sinon.SinonSandbox;
    let bindingEngineStub: BindingEngine;
    let propertyObservers: { subject: any, path: string, observer: PropertyObserver, subscribeCallback: (newValue: any, oldValue: any) => void, disposable: Disposable}[];

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        propertyObservers = [];

        bindingEngineStub = <BindingEngine>{};
        bindingEngineStub.propertyObserver = (subject, path) => {
            let po: { subject: any, path: string, observer: PropertyObserver, subscribeCallback: (newValue: any, oldValue: any) => void, disposable: Disposable} =
            { subject: subject, path: path, observer: <PropertyObserver>{}, subscribeCallback: null, disposable: <Disposable>{}};

            po.disposable.dispose = () => propertyObservers.splice(propertyObservers.findIndex(p => p.subject === subject && p.path === path), 1);

            po.observer.subscribe = (callback) => {
                po.subscribeCallback = callback;
                return po.disposable;
            };

            propertyObservers.push(po);

            return po.observer;
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created with a null object and path", () => {
        pathObserver = new PathObserver(bindingEngineStub, null, null);
        expect(pathObserver).toBeDefined();
    });

    it("can be created with a null object and an actual path", () => {
        pathObserver = new PathObserver(bindingEngineStub, null, "myProperty");
        expect(propertyObservers.length).toEqual(0);
    });

    it("can be created with an actual object and no path", () => {
        pathObserver = new PathObserver(bindingEngineStub, {
            myProperty: "val"
        }, null);
        expect(propertyObservers.length).toEqual(0);
    });

    it("can be created with an actual object and a non existent path", () => {
        pathObserver = new PathObserver(bindingEngineStub, {
            myProperty: "val"
        }, "myProperty2");
        expect(propertyObservers.length).toEqual(1);
    });

    it("can be created with an actual object and an actual path", () => {
        pathObserver = new PathObserver(bindingEngineStub, {
            myProperty: "val"
        }, "myProperty");
        expect(propertyObservers.length).toEqual(1);
    });

    it("can subscribe to the value changed and get a disposable subscription", () => {
        pathObserver = new PathObserver(bindingEngineStub, {
            myProperty: "val"
        }, "myProperty");

        let subscription = pathObserver.subscribe((newValue, oldValue) => {
        });
        expect(subscription.dispose).toBeDefined();
    });

    it("can dispose a subscription", () => {
        pathObserver = new PathObserver(bindingEngineStub, {
            myProperty: "val"
        }, "myProperty");

        let subscription = pathObserver.subscribe((newValue, oldValue) => {
        });
        expect(propertyObservers.length).toEqual(1);
        subscription.dispose();
        expect(subscription.dispose).toBeDefined();
        expect(propertyObservers.length).toEqual(0);
    });

    it("can be created with an actual object and a non existant child path", () => {
        pathObserver = new PathObserver(bindingEngineStub, {
            myProperty: "val"
        }, "myProperty.childProperty");

        expect(propertyObservers.length).toEqual(2);
    });

    it("can be created with an actual object and a second level non existant child path", () => {
        pathObserver = new PathObserver(bindingEngineStub, {
            myProperty: "val"
        }, "myProperty.childProperty.another");

        expect(propertyObservers.length).toEqual(2);
    });

    it("can change a value with no valueChanged callback on the leaf node", () => {
        let obj: any = { myProperty: {
            childProperty: 1
        }};
        pathObserver = new PathObserver(bindingEngineStub, obj, "myProperty.childProperty");

        obj.myProperty.childProperty = 2;

        propertyObservers.find(po => po.path === "childProperty").subscribeCallback(2, 1);
        expect(propertyObservers.length).toEqual(2);
    });

    it("can handle valueChanged on the leaf node", () => {
        let obj: any = { myProperty: {
            childProperty: 1
        }};
        pathObserver = new PathObserver(bindingEngineStub, obj, "myProperty.childProperty");

        let oldVal: any = undefined;
        let newVal: any = undefined;
        pathObserver.subscribe((newValue, oldValue) => {
            newVal = newValue;
            oldVal = oldValue;
        });

        obj.myProperty.childProperty = 2;

        expect(propertyObservers.length).toEqual(2);
        propertyObservers.find(po => po.path === "childProperty").subscribeCallback(2, 1);
        expect(oldVal).toEqual(1);
        expect(newVal).toEqual(2);
    });

    it("can create additional subscription when an object value changes", () => {
        let obj: any = { myProperty: { }};

        pathObserver = new PathObserver(bindingEngineStub, obj, "myProperty.childProperty.another.andAnother.final");
        expect(propertyObservers.length).toEqual(2);
        obj.myProperty.childProperty = {};
        propertyObservers.find(po => po.path === "childProperty").subscribeCallback(obj.myProperty.childProperty, undefined);
        expect(propertyObservers.length).toEqual(3);
    });

    it("can create additional subscription when an object value changes and observe the value change", () => {
        let obj: any = { myProperty: { }};

        pathObserver = new PathObserver(bindingEngineStub, obj, "myProperty.childProperty");

        let oldVal: any = undefined;
        let newVal: any = undefined;
        pathObserver.subscribe((newValue, oldValue) => {
            newVal = newValue;
            oldVal = oldValue;
        });

        expect(propertyObservers.length).toEqual(2);
        obj.myProperty.childProperty = {};

        propertyObservers.find(po => po.path === "childProperty").subscribeCallback(obj.myProperty.childProperty, undefined);
        expect(propertyObservers.length).toEqual(2);
        expect(oldVal).toEqual(undefined);
        expect(newVal).toEqual(obj.myProperty.childProperty);
    });

    it("can destroy subscription when an object value changes", () => {
        let obj: any = { myProperty: { childProperty: {} }};

        pathObserver = new PathObserver(bindingEngineStub, obj, "myProperty.childProperty.another.andAnother.final");
        expect(propertyObservers.length).toEqual(3);
        let oldVal: any = obj.myProperty.childProperty;
        obj.myProperty.childProperty = undefined;
        propertyObservers.find(po => po.path === "childProperty").subscribeCallback(undefined, oldVal);
        expect(propertyObservers.length).toEqual(2);
    });

    it("can destroy subscription when an object value changes and observe the value change", () => {
        let obj: any = { myProperty: { childProperty: {} }};

        pathObserver = new PathObserver(bindingEngineStub, obj, "myProperty.childProperty.another.andAnother.final");

        let oldVal: any = undefined;
        let newVal: any = undefined;
        pathObserver.subscribe((newValue, oldValue) => {
            newVal = newValue;
            oldVal = oldValue;
        });

        expect(propertyObservers.length).toEqual(3);
        let oldVal2: any = obj.myProperty.childProperty;
        obj.myProperty.childProperty = undefined;
        propertyObservers.find(po => po.path === "childProperty").subscribeCallback(undefined, oldVal2);
        expect(propertyObservers.length).toEqual(2);
        expect(oldVal).toEqual(undefined);
        expect(newVal).toEqual(undefined);
    });
});
