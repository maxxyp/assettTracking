export class HelpOverlayStep {
    public id: number;
    public title: string;
    public content: string;
    public selector: string;
    public selectorWaitTimeout: number;
    public top: number;
    public bottom: number;
    public left: number;
    public right: number;
    public width: number;
    public height: number;
    public parentScollSelector: string;
    public scrollOffset: number;
    public onPrevious: string;
    public onPreviousAction: string;
    public onPreviousValue: string;
    public onPreviousOkToClickClass: string;
    public onNext: string;
    public onNextAction: string;
    public onNextValue: string;
    public onNextOkToClickClass: string;
    public nextStepOverride: number;
    public parentStep: number;
    public delay: number;
    public arrowPosition: string;
    public showCircle: boolean;
    constructor(stepId: number) {
        this.id = stepId;
        this.width = 350;
        this.height = 170;
        this.top = 85;
        this.bottom = null;
        this.left = 50;
        this.right = null;
        this.selectorWaitTimeout = 1000;
        this.arrowPosition = "left";
        this.title = "New step #" + this.id;
        this.content = "New step content";
        this.selector = "body";
        this.scrollOffset = 0;
        this.showCircle = true;
    }
}
