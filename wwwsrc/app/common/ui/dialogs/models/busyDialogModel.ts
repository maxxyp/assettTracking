export class BusyDialogModel {
    public linkMessage: string;
    public linkCallback: () => void;
    public message: string;
    public isComplete: boolean;

    public linkClicked() : void {
        if (this.linkCallback) {
            this.linkCallback();
        }
    }
}
