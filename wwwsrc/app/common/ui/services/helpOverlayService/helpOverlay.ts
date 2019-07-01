import { customElement } from "aurelia-framework";
import { observable, inject } from "aurelia-framework";
import { HelpOverlayService } from "./helpOverlayService";
import { EventAggregator } from "aurelia-event-aggregator";
@inject(HelpOverlayService, EventAggregator)
@customElement("help-overlay")
export class HelpOverlay {
    public showContent: boolean;
    public helpOverlayService: HelpOverlayService;
    @observable
    public stepArrayItem: number;
    private _eventAggregator: EventAggregator;
    constructor(helpOverlayService: HelpOverlayService, eventAggregator: EventAggregator) {
        this.helpOverlayService = helpOverlayService;
        this.showContent = false;
        this.stepArrayItem = this.helpOverlayService.stepNumber - 1;
        this._eventAggregator = eventAggregator;
        this._eventAggregator.subscribe("openedOverlay", ((id: number) => { this.closeMe(id); }));
    }

    public nextStep(e: Event): void {
        if (e) {
            e.stopPropagation();
        }
        this.helpOverlayService.getNextStep();
    }

    public previousStep(e: Event): void {
        if (e) {
            e.stopPropagation();
        }
        this.helpOverlayService.getPreviousStep();
    }

    public manageClick(e: Event): void {
        if (e) {
            e.stopPropagation();
        }
    }
    public toggleContent(): void {
        this.showContent = !this.showContent;
        this.helpOverlayService.stepNumber = this.stepArrayItem + 1;
        if (this.showContent) {
            this._eventAggregator.publish("openedOverlay", this.stepArrayItem);
        }
    }
    private closeMe(openedId: number): void {
        if (this.stepArrayItem !== openedId) {
            this.showContent = false;
        }
    }
}   
