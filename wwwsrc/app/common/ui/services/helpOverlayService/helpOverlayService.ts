import { observable, inject, TemplatingEngine } from "aurelia-framework";
import { Threading } from "../../../core/threading";
import { IAssetService } from "../../../core/services/IAssetService";
import { AssetService } from "../../../core/services/assetService";
import { HelpOverlayConfig } from "./helpOverlayConfig";
import { HelpOverlayStep } from "./helpOverlayStep";
import { Router } from "aurelia-router";
import { EventAggregator } from "aurelia-event-aggregator";
import { AnalyticsConstants } from "../../../analytics/analyticsConstants";

const TOGGLE_HELP_LABEL: string = "Toggle Help";

@inject(TemplatingEngine, AssetService, EventAggregator, Router)
export class HelpOverlayService {
    @observable
    public stepNumber: number;
    @observable
    public steps: HelpOverlayStep[];
    @observable
    public currentStep: HelpOverlayStep;
    @observable
    public editedConfigString: string;
    public helpActivated: boolean;
    @observable
    public showAllSteps: boolean;
    @observable
    public helpOverlayConfig: HelpOverlayConfig[];
    @observable
    public adminActivated: boolean;
    private _templatingEngine: TemplatingEngine;
    private _assetService: IAssetService;
    private _parentID: number;
    private _eventAggregator: EventAggregator;
    private _fragmentArray: string[];

    constructor(templatingEngine: TemplatingEngine, assetService: IAssetService, eventAggregator: EventAggregator, router: Router) {
        this.stepNumber = 0;
        this._parentID = 0;
        this._templatingEngine = templatingEngine;
        this._assetService = assetService;
        this.helpActivated = false;
        this._eventAggregator = eventAggregator;
        this._eventAggregator.subscribe("router:navigation:complete", () => this.handleRouteChanged(router));
        this.loadHelpOverlayAssets().then((jsonSource) => {
            if (jsonSource) {
                this.helpOverlayConfig = jsonSource;
            } else {
                this.helpOverlayConfig = [];
            }
        });
    }
    public showAllStepsChanged(): void {
        if (this.helpOverlayConfig) {
            let pageConfigIndex: number = this.helpOverlayConfig.map((v: HelpOverlayConfig) => v.page).indexOf(this._fragmentArray.join("/"));
            this.helpOverlayConfig[pageConfigIndex].allSteps = this.showAllSteps;
        }
    }
    public helpOverlayConfigChanged(): void {
        if (this._fragmentArray) {
            let helpOverlayConfigItem = this.helpOverlayConfig.find((s) => s.page === this._fragmentArray.join("/"));
            if (helpOverlayConfigItem) {
                this.showAllSteps = helpOverlayConfigItem.allSteps;
                this.steps = helpOverlayConfigItem.steps;
                this.stepNumber = 0;
                this._parentID = 0;
                this.removeElements();
                this.currentStep = helpOverlayConfigItem.steps[0];
                if (this.showAllSteps) {
                    this.processAllSteps();
                } else {
                    this.processNextStep(1);
                }
            }
        }
    }
    public getNextStep(): void {
        let onNextfunc: Function;
        if (this.currentStep) {
            if (this.currentStep.onNext) {
                // check the okToClick class.
                if (this.currentStep.onNextOkToClickClass) {
                    let okToClickClassList: DOMTokenList = document.querySelector(this.currentStep.onNext).classList;
                    if (okToClickClassList.contains(this.currentStep.onNextOkToClickClass)) {
                        onNextfunc = new Function("document.querySelector(\"" + this.currentStep.onNext + "\")" + this.currentStep.onNextAction);
                        onNextfunc();
                    }
                } else {
                    onNextfunc = new Function("document.querySelector(\"" + this.currentStep.onNext + "\")" + this.currentStep.onNextAction);
                    onNextfunc();
                }
            }
            if (this.stepNumber < this.steps.length) {
                this.processNextStep(1);
            }
        } else {
            this.processNextStep(1);
        }
    }

    public toggleHelp(): void {
        this.helpActivated = !this.helpActivated;
        this.stepNumber = 0;
        this.removeElements();
        if (this.helpActivated) {
            if (this.showAllSteps) {
                this.processAllSteps();
            } else {
                this.processNextStep(1);
            }
        }

        this._eventAggregator.publish(AnalyticsConstants.ANALYTICS_EVENT, {
            category: AnalyticsConstants.HELP_OVERLAY_CATEGORY,
            action: AnalyticsConstants.CLICK_ACTION,
            label: TOGGLE_HELP_LABEL,
            metric: AnalyticsConstants.METRIC
        });
    }

    public toggleHelpAdmin(): void {
        this.adminActivated = !this.adminActivated;
    }

    public getPreviousStep(): void {
        let onPreviousfunc: Function;
        if (this.currentStep.onPrevious) {
            // check the okToClick class.
            if (this.currentStep.onPreviousOkToClickClass) {
                let okToClickClassList: DOMTokenList = document.querySelector(this.currentStep.onPrevious).classList;
                if (okToClickClassList.contains(this.currentStep.onPreviousOkToClickClass)) {
                    onPreviousfunc = new Function("document.querySelector(\"" + this.currentStep.onPrevious + "\")" + this.currentStep.onPreviousAction);
                    onPreviousfunc();
                }
            } else {
                onPreviousfunc = new Function("document.querySelector(\"" + this.currentStep.onPrevious + "\")" + this.currentStep.onPreviousAction);
                onPreviousfunc();
            }
        }
        let testStep: HelpOverlayStep = this.steps[this.stepNumber - 2];
        if (!testStep.parentStep) {
            this.processNextStep(-1);
        } else {

            this.processNextStep(testStep.parentStep - this.currentStep.id);
        }
    }

    public removeElements(): void {
        let className = "help-overlay";
        let elements = document.getElementsByTagName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    public addStep(newStep: HelpOverlayStep): void {
        let helpOverlayConfigItem = this.helpOverlayConfig.find((s) => s.page === this._fragmentArray.join("/"));
        if (helpOverlayConfigItem) {
            helpOverlayConfigItem.steps.push(newStep);
        } else {
            let newSteps: HelpOverlayStep[] = [];
            newSteps.push(new HelpOverlayStep(1));
            this.helpOverlayConfig.push(new HelpOverlayConfig(this._fragmentArray.join("/"), newSteps));
            helpOverlayConfigItem = this.helpOverlayConfig.find((s) => s.page === this._fragmentArray.join("/"));
        }
        this.currentStep = helpOverlayConfigItem.steps[helpOverlayConfigItem.steps.length - 1];
        this.stepNumber = helpOverlayConfigItem.steps.length;
        this.steps = helpOverlayConfigItem.steps;
        this.updateEditedConfigString();
        this.processStep();
    }

    public removeStep(idToRemove: number): void {
        let itemToRemoveArrayLocation: number;
        let helpOverlayConfigItem = this.helpOverlayConfig.find((s) => s.page === this._fragmentArray.join("/"));
        // check for child steps
        let childSteps = helpOverlayConfigItem.steps.filter((s) => ~~s.parentStep === idToRemove);
        childSteps.forEach(stepItem => {
            itemToRemoveArrayLocation = helpOverlayConfigItem.steps.map((v: HelpOverlayStep) => v.id).indexOf(stepItem.id);
            helpOverlayConfigItem.steps.splice(itemToRemoveArrayLocation, 1);
        });
        itemToRemoveArrayLocation = helpOverlayConfigItem.steps.map((v: HelpOverlayStep) => v.id).indexOf(idToRemove);
        helpOverlayConfigItem.steps.splice(itemToRemoveArrayLocation, 1);
        this.stepNumber = Math.max(this.stepNumber - 1, 1);
        this.currentStep = helpOverlayConfigItem.steps[Math.max(this.stepNumber - 1, 0)];
        this.steps = helpOverlayConfigItem.steps;
        this.reOrderIds();
        this.updateEditedConfigString();
        if (this.currentStep) {
            this.processStep();
        }
    }

    public insertStep(idToinsertAfter: number): void {
        if (!idToinsertAfter) {
            idToinsertAfter = 1;
        }
        let helpOverlayConfigItem = this.helpOverlayConfig.find((s) => s.page === this._fragmentArray.join("/"));
        helpOverlayConfigItem.steps.splice(idToinsertAfter, 0, new HelpOverlayStep(idToinsertAfter + 1));
        this.currentStep = helpOverlayConfigItem.steps[idToinsertAfter];
        this.steps = helpOverlayConfigItem.steps;
        this.stepNumber = idToinsertAfter + 1;
        this.reOrderIds();
        this.updateEditedConfigString();
        this.processStep();
    }
    public updateEditedConfigString(): void {
        this.editedConfigString = JSON.stringify(this.helpOverlayConfig);
    }

    public processNextStep(direction: number, forceNext: boolean = false): void {
        if (this.steps) {
            this.stepNumber = Math.min(Math.max(this.stepNumber += direction, 1), this.steps.length);
            this.checkStep(forceNext).then((nextOverlayStep: HelpOverlayStep) => {
                this.currentStep = nextOverlayStep;
                this.currentStep.showCircle = true;
                this.processStep();
                if (!this.currentStep.parentStep) {
                    this._parentID = this.currentStep.id;
                }
            }).catch(() => {
                if (this.stepNumber > 0 && this.stepNumber < this.steps.length) {
                    this.processNextStep(direction);
                }
            });
        }
    }
    private reOrderIds(): void {
        for (let index = 0; index < this.steps.length; index++) {
            let step: HelpOverlayStep = this.steps[index];
            step.id = index + 1;
        }
    }
    private handleRouteChanged(router: Router): void {
        this._fragmentArray = router.currentInstruction.fragment.split("/").slice(1);
        for (let i = 0; i < this._fragmentArray.length; i++) {
            /* if the fragmet contains digits then treat it as an id based on the previous item */
            if (/\d/.test(this._fragmentArray[i]) && i >= 1) {
                let previous = this._fragmentArray[i - 1];
                if (previous.charAt(previous.length - 1) === "s") {
                    previous = previous.substr(0, previous.length - 1);
                }
                this._fragmentArray[i] = previous + "details";
            }
        }
        if (this.helpOverlayConfig) {
            let helpOverlayConfig = this.helpOverlayConfig.find((s) => s.page === this._fragmentArray.join("/"));
            if (helpOverlayConfig) {
                this.steps = helpOverlayConfig.steps;
                this.showAllSteps = helpOverlayConfig.allSteps;
                this.stepNumber = 0;
                this._parentID = 0;
                this.removeElements();
                if (this.helpActivated) {
                    if (this.showAllSteps) {
                        this.processAllSteps();
                    } else {
                        this.processNextStep(1);
                    }
                }
            } else {
                this.currentStep = undefined;
                this.steps = undefined;
                this.removeElements();
            }
        }
    }

    private processStep(): void {
        if (!this.showAllSteps) {
            this.removeElements();
            try {
                let newOverlayElement = this.createHelpOverlay(this.currentStep.selector);
                if (newOverlayElement && this.currentStep.parentScollSelector) {
                    this.scrollToStepLocation(newOverlayElement).then(() => this._templatingEngine.enhance(newOverlayElement));
                } else {
                    this._templatingEngine.enhance(newOverlayElement);
                }
            } catch (e) {
                // swallow the error. this may happen if navigating is forced when the element cannot display.
            }
        }
    }

    private loadHelpOverlayAssets(): Promise<HelpOverlayConfig[]> {
        return this._assetService.loadJson<HelpOverlayConfig[]>("services/helpOverlay/overlayConfig.json");
    }

    private scrollToStepLocation(overLayElement: Element): Promise<void> {
        /* tslint:disable:promise-must-complete */
        return new Promise<void>((resolve, reject) => {
            let positionToScrollTo: number;
            let currentPosition: number;
            currentPosition = document.querySelector(this.currentStep.parentScollSelector).scrollTop;
            positionToScrollTo = overLayElement.getBoundingClientRect().top;
            if (currentPosition < positionToScrollTo) {
                let scrollThread = Threading.startTimer(() => {
                    if (currentPosition < positionToScrollTo - this.currentStep.scrollOffset) {
                        currentPosition = currentPosition + 7;
                        document.querySelector(this.currentStep.parentScollSelector).scrollTop = currentPosition;
                    } else {
                        Threading.stopTimer(scrollThread);
                        resolve();
                    }
                }, 1);
            } else {
                let scrollThread = Threading.startTimer(() => {
                    if (currentPosition > positionToScrollTo + ~~this.currentStep.scrollOffset) {
                        currentPosition = currentPosition - 7;
                        document.querySelector(this.currentStep.parentScollSelector).scrollTop = currentPosition;
                    } else {
                        Threading.stopTimer(scrollThread);
                        resolve();
                    }
                }, 1);
            }
        });
        /* tslint:enable:promise-must-complete */
    }

    private checkStep(forceNext: boolean = false): Promise<HelpOverlayStep> {
        let testStepNumber: number = this.stepNumber;
        let testStep: HelpOverlayStep = this.steps[testStepNumber - 1];
        if (this._parentID === ~~testStep.parentStep || !testStep.parentStep || forceNext) {
            return this.elementCheck(testStep, forceNext);
        }
        return Promise.reject(testStep);
    }

    private elementCheck(testStep: HelpOverlayStep, forceNext: boolean): Promise<HelpOverlayStep> {
        return new Promise<HelpOverlayStep>((resolve, reject) => {
            let elapsedTime: number = 0;
            if (testStep.selectorWaitTimeout && !forceNext) {
                let timer = Threading.startTimer(() => {
                    if (elapsedTime < testStep.selectorWaitTimeout) {
                        if (document.querySelector(testStep.selector)) {
                            Threading.stopTimer(timer);
                            resolve(testStep);
                        }
                    } else {
                        Threading.stopTimer(timer);
                        reject();
                    }
                    elapsedTime = elapsedTime + 10;
                }, 10);
            } else {
                if (document.querySelector(testStep.selector) || forceNext) {
                    resolve(testStep);
                } else {
                    reject();
                }
            }
        });
    }

    private processAllSteps(): void {
        this.removeElements();
        this.pushOverlaySteps().then((promises) => {
            this.stepNumber = 0;
            this.processNextStep(1);
        }).catch((promises) => {
            this.stepNumber = 0;
            this.processNextStep(1);
        });
    }
    private pushOverlaySteps(): Promise<any> {
        let promiseArray: Promise<HelpOverlayStep>[] = [];
        if (this.steps) {
            for (let stepCount = 1; stepCount <= this.steps.length; stepCount++) {
                let step: HelpOverlayStep = this.steps[stepCount - 1];
                promiseArray.push(this.elementCheck(step, false));
            }
        }
        return Promise.each(promiseArray, ((step) => {
            this.stepNumber = step.id;
            let newOverlayElement = this.createHelpOverlay(step.selector);
            this._templatingEngine.enhance(newOverlayElement);
        }));

    }

    private createHelpOverlay(selector: string): Element {
        let newElement: Element;
        let el = document.createElement("help-overlay");
        return newElement = <Element>document.querySelector(selector).appendChild(el);
    }
}
