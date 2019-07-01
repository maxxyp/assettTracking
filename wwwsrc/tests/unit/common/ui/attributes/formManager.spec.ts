/// <reference path="../../../../../typings/app.d.ts" />

import {FormManager} from "../../../../../app/common/ui/attributes/formManager";
import {BindingEngine, PropertyObserver, Disposable} from "aurelia-binding";
import {IFormController} from "../../../../../app/common/ui/attributes/IFormController";
import {FormControllerElement} from "../../../../../app/common/ui/attributes/formControllerElement";
import {Threading} from "../../../../../app/common/core/threading";
import {IMutationObserverProvider} from "../../../../../app/common/ui/services/IMutationObserverProvider";

describe("the FormManager module", () => {
    let formManager: FormManager;
    let sandbox: Sinon.SinonSandbox;
    let htmlElementStub: any; // not HTMLElement, we need to bundle further properties in
    let bindingEngineStub: BindingEngine;
    let mutationObserverProviderStub: IMutationObserverProvider;
    let formControllerStub: IFormController;
    let formElements: FormControllerElement[];
    let childrenStub: any;
    let disposableStub: Disposable;
    let propertyObserverStub: PropertyObserver;
    let subscribeCallback: (newValue: any, oldValue: any) => void;
    let elementUpdateCount: number;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        htmlElementStub = {};
        htmlElementStub.addEventListener = sandbox.stub();
        htmlElementStub.removeEventListener = sandbox.stub();

        childrenStub = [];
        childrenStub.getNamedItem = sandbox.stub();
        childrenStub.item = sandbox.stub();

        disposableStub = <Disposable>{};
        disposableStub.dispose = sandbox.stub();

        propertyObserverStub = <PropertyObserver>{};
        propertyObserverStub.subscribe = (callback) => { subscribeCallback = callback; return disposableStub; };

        bindingEngineStub = <BindingEngine>{};
        bindingEngineStub.propertyObserver = sandbox.stub().returns(propertyObserverStub);

        mutationObserverProviderStub = <IMutationObserverProvider>{};
        mutationObserverProviderStub.create = sandbox.stub().returns({
            observe: () => {},
            disconnect: () => {}
        });

        formElements = undefined;

        elementUpdateCount = 0;
        formControllerStub = <IFormController>{};
        formControllerStub.elementsLoaded = (elements) => {
            formElements = elements;
        };
        formControllerStub.elementUpdate = () => {
            elementUpdateCount++;
        };
        formManager = new FormManager(htmlElementStub, bindingEngineStub, mutationObserverProviderStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(formManager).toBeDefined();
    });

    it("can be bound", () => {
        formManager.bind(formControllerStub);
        expect(formManager).toBeDefined();
    });

    it("can be attached with no form controller bound", () => {
        formManager.attached();
        expect(formManager).toBeDefined();
    });

    it("can be attached with a form controller bound", () => {
        let mySpy: Sinon.SinonSpy = sandbox.spy(formControllerStub, "elementsLoaded");

        formManager.bind(formControllerStub);
        formManager.attached();
        expect(mySpy.callCount).toEqual(2);
    });

    it("can be attached to an element with no children and no value bind attributes", () => {

        formManager.bind(formControllerStub);
        formManager.attached();
        expect(formElements).toBeUndefined();
    });

    it("can be attached to an element with no children and a value bind attributes", () => {
        htmlElementStub.attributes = {
                getNamedItem: (item: string) => {
                    return item === "value.bind" ? {name: "value.bind", value: "myValue"} : null;
                }
        };

        formManager.bind(formControllerStub);
        formManager.attached();
        expect(formElements.length).toBe(1);
    });

    it("can be attached to an element with children with no value bind attributes", () => {
        let child1: { attributes: any, addEventListener: any, removeEventListener: any } = {
            attributes: {
                getNamedItem: sandbox.stub().returns(undefined)
            },
            addEventListener: sandbox.stub(),
            removeEventListener: sandbox.stub()
        };

        childrenStub.push(child1);

        htmlElementStub.children = <HTMLCollection>childrenStub;

        formManager.bind(formControllerStub);
        formManager.attached();
        expect(formElements).toBeUndefined();
    });

    it("can ignore router-views", () => {
        let child1: { attributes: any, addEventListener: any, removeEventListener: any, localName: string } = {
            attributes: {
                getNamedItem: (item: string) => {
                    return item === "value.bind" ? {name: "value.bind", value: "myValue"} : null;
                }
            },
            addEventListener: sandbox.stub(),
            removeEventListener: sandbox.stub(),
            localName: "router-view"
        };

        childrenStub.push(child1);

        htmlElementStub.children = <HTMLCollection>childrenStub;

        formManager.bind(formControllerStub);
        formManager.attached();
        expect(formElements).toBeUndefined();
    });

    it("can be attached to an element with children with a simple value bind attributes", () => {
        let child1: { attributes: any, addEventListener: any, removeEventListener: any } = {
            attributes: {
                getNamedItem: (item: string) => {
                    return item === "value.bind" ? {name: "value.bind", value: "myValue"} : null;
                }
            },
            addEventListener: sandbox.stub(),
            removeEventListener: sandbox.stub()
        };

        childrenStub.push(child1);

        htmlElementStub.children = <HTMLCollection>childrenStub;

        formManager.bind(formControllerStub);
        formManager.attached();
        expect(formElements.length).toEqual(1);
    });

    it("can be attached to an element with a bind attribute and with children with a simple value bind attributes", () => {
        htmlElementStub.attributes = {
                getNamedItem: (item: string) => {
                    return item === "value.bind" ? {name: "value.bind", value: "myValue"} : null;
                }
        };

        let child1: { attributes: any, addEventListener: any, removeEventListener: any } = {
            attributes: {
                getNamedItem: (item: string) => {
                    return item === "value.bind" ? {name: "value.bind", value: "myValue"} : null;
                }
            },
            addEventListener: sandbox.stub(),
            removeEventListener: sandbox.stub()
        };

        childrenStub.push(child1);

        htmlElementStub.children = <HTMLCollection>childrenStub;

        formManager.bind(formControllerStub);
        formManager.attached();
        expect(formElements.length).toEqual(2);
    });

    it("can be attached to an element with children with a complex value bind attributes", () => {
        let child1: { attributes: any, addEventListener: any, removeEventListener: any } = {
            attributes: {
                getNamedItem: (item: string) => {
                    return item === "value.two-way" ? {name: "value.two-way", value: "myValue | someAttribute | someTrigger"} : null;
                }
            },
            addEventListener: sandbox.stub(),
            removeEventListener: sandbox.stub()
        };

        childrenStub.push(child1);

        htmlElementStub.children = <HTMLCollection>childrenStub;

        formManager.bind(formControllerStub);
        formManager.attached();
        expect(formElements.length).toEqual(1);
    });

    it("can call a property observer subscription", (done) => {
        let child1: { attributes: any, addEventListener: any, removeEventListener: any } = {
            attributes: {
                getNamedItem: (item: string) => {
                    return item === "value.bind" ? {name: "value.bind", value: "myValue & someAttribute | someTrigger"} : null;
                }
            },
            addEventListener: sandbox.stub(),
            removeEventListener: sandbox.stub()
        };

        childrenStub.push(child1);

        htmlElementStub.children = <HTMLCollection>childrenStub;

        formManager.bind(formControllerStub);
        formManager.attached();
        expect(subscribeCallback).toBeDefined();
        subscribeCallback(0, 0);
        Threading.delay(() => {
            expect(elementUpdateCount).toEqual(1);
            done();
        }, 250);
    });

    it("can be attach and call a blur listener", (done) => {
        let eventAddListener: (event: FocusEvent) => any;

        let child1: { attributes: any, addEventListener: (name: string,
                                                          callback: (event: FocusEvent) => void) => void,
            removeEventListener: (name: string, callback: (event: FocusEvent) => void) => void } = {
            attributes: {
                getNamedItem: (item: string) => {
                    return item === "value.bind" ? {name: "value.bind", value: "myValue"} : null;
                }
            },
            addEventListener: (name, listener) => { eventAddListener = listener; },
            removeEventListener: sandbox.stub()
        };

        childrenStub.push(child1);

        htmlElementStub.children = <HTMLCollection>childrenStub;

        formManager.bind(formControllerStub);
        formManager.attached();
        expect(formElements.length).toEqual(1);
        expect(eventAddListener).toBeDefined();

        eventAddListener(null);

        Threading.delay(() => {
            expect(elementUpdateCount).toEqual(1);
            done();
        }, 250);
    });

    it("can detach the blur listener", () => {
        let eventAddListener: (event: FocusEvent) => any;
        let eventRemoveListener: (event: FocusEvent) => any;

        let child1: { attributes: any, addEventListener: (name: string,
                                                          callback: (event: FocusEvent) => void) => void,
            removeEventListener: (name: string, callback: (event: FocusEvent) => void) => void } = {
            attributes: {
                getNamedItem: (item: string) => {
                    return item === "value.bind" ? {name: "value.bind", value: "myValue"} : null;
                }
            },
            addEventListener: (name, listener) => { eventAddListener = listener; },
            removeEventListener: (name, listener) => { eventRemoveListener = listener; }
        };

        childrenStub.push(child1);

        htmlElementStub.children = <HTMLCollection>childrenStub;

        formManager.bind(formControllerStub);
        formManager.attached();
        formManager.detached();
        expect(formElements).toBeUndefined();
        expect(eventAddListener).toEqual(eventRemoveListener);
    });

    it("can be detached without a form controller", () => {
        formManager.detached();
        expect(formElements).toBeUndefined();
    });

    it("can be detached from an element with children with a value bind attributes", () => {
        let child1: { attributes: any, addEventListener: any, removeEventListener: any } = {
            attributes: {
                getNamedItem: (item: string) => {
                    return item === "value.bind" ? {name: "value.bind", value: "myValue"} : null;
                }
            },
            addEventListener: sandbox.stub(),
            removeEventListener: sandbox.stub()
        };

        childrenStub.push(child1);

        htmlElementStub.children = <HTMLCollection>childrenStub;

        formManager.bind(formControllerStub);
        formManager.attached();
        expect(formElements.length).toEqual(1);
        formManager.detached();
        expect(formElements).toBeUndefined();
    });
});
