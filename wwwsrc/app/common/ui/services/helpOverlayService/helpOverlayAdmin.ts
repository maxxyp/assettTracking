import { TemplatingEngine, customElement } from "aurelia-framework";
import { inject } from "aurelia-dependency-injection";
import { HelpOverlayService } from "./helpOverlayService";
import { IHelpOverlayService } from "./interfaces/IHelpOverlayService";
import { HelpOverlayStep } from "./helpOverlayStep";
import { ConfirmDialog } from "../../dialogs/confirmDialog";
import { ConfirmDialogModel } from "../../dialogs/models/confirmDialogModel";
import { PlatformHelper } from "../../../../common/core/platformHelper";
import { DialogService } from "aurelia-dialog";
class ArrowPosition {
    public positionDescription: string;
}
@inject(HelpOverlayService, TemplatingEngine, DialogService)
@customElement("help-overlay-admin")
export class HelpOverlayAdmin {
    public arrowPositions: ArrowPosition[];
    public onNextActionType: string;
    public helpOverlayService: IHelpOverlayService;
    public selectedSelector: string;
    public nextActionSelector: string;
    public prevActionSelector: string;
    public platform: string;
    public showAdmin: boolean;
    public onNextClickClassOptions: { className: string }[];
    public onPreviousClickClassOptions: { className: string }[];
    private _selectionTarget: string;
    private _prev: Element;
    private _templatingEngine: TemplatingEngine;
    private _dialogService: DialogService;
    private _fileInput: any;
    constructor(helpOverlayService: IHelpOverlayService, templatingEngine: TemplatingEngine, dialogService: DialogService) {
        this.arrowPositions = [{ positionDescription: "top" },
        { positionDescription: "bottom" },
        { positionDescription: "left" },
        { positionDescription: "right" }];
        this.helpOverlayService = helpOverlayService;
        this._templatingEngine = templatingEngine;
        document.body.addEventListener("mouseover", (e: MouseEvent) => this.handleMouseOver(e));
        document.body.addEventListener("keydown", (e: KeyboardEvent) => this.handleKeyDown(e));
        this.showAdmin = false;
        this._dialogService = dialogService;
        this.platform = PlatformHelper.getPlatform();
    }
    public setTarget(target: string): void {
        this._selectionTarget = target;
    }
    public detached(): void {
        document.body.removeEventListener("mouseover", (e: MouseEvent) => this.handleMouseOver(e));
        document.body.removeEventListener("keydown", (e: KeyboardEvent) => this.handleKeyDown(e));
        if (this._fileInput) {
            this._fileInput.removeEventListener("change", (e: Event) => this.processLoad(e));
        }
    }
    public toggleAdmin(): void {
        this.showAdmin = !this.showAdmin;
        if (this.showAdmin) {
            this._fileInput = document.getElementById("fileInput");
            if (this._fileInput) {
                this._fileInput.addEventListener("change", (e: Event) => this.processLoad(e));
            }
        } else {
            if (this._fileInput) {
                this._fileInput.removeEventListener("change", (e: Event) => this.processLoad(e));
            }
        }
    }
    public refreshOverlay(element: Element): void {
        if (!element) {
            element = document.querySelector(this.helpOverlayService.currentStep.selector);
        }
        this.helpOverlayService.currentStep.selector = this.generateSelector(element);
        this.helpOverlayService.removeElements();
        let newOverlayElement: Element;
        let el = document.createElement("help-overlay");
        newOverlayElement = <Element>document.querySelector(this.helpOverlayService.currentStep.selector).appendChild(el);
        this._templatingEngine.enhance(newOverlayElement);
    }
    public appendStep(): void {
        let id: number;
        if (this.helpOverlayService.steps) {
            id = this.helpOverlayService.steps.length;
            id++;
        } else {
            id = 1;
        }
        this.helpOverlayService.addStep(new HelpOverlayStep(id));
    }
    public removeStep(id: number): void {
        let vm: ConfirmDialogModel = new ConfirmDialogModel();
        vm.header = "Confirmation";
        vm.text = "Are you sure that your wish to remove this step?";
        this._dialogService.open({ viewModel: ConfirmDialog, model: vm }).then((result) => {
            if (result.wasCancelled === false) {
                this.helpOverlayService.removeStep(id);
            }
        });
    }

    public saveFile(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let savePicker: Windows.Storage.Pickers.FileSavePicker = new Windows.Storage.Pickers.FileSavePicker();
            savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
            savePicker.fileTypeChoices.insert("json File", <Windows.Foundation.Collections.IVector<string>>[".json"]);
            savePicker.suggestedFileName = "overlayConfig";

            savePicker.pickSaveFileAsync().then((file) => {
                if (file) {
                    Windows.Storage.CachedFileManager.deferUpdates(file);
                    Windows.Storage.FileIO.writeTextAsync(file, this.helpOverlayService.editedConfigString).done(() => {
                        Windows.Storage.CachedFileManager.completeUpdatesAsync(file).done((updateStatus: Windows.Storage.Provider.FileUpdateStatus) => {
                            if (updateStatus === Windows.Storage.Provider.FileUpdateStatus.complete) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    });
                } else {
                    reject();
                }
            });
        });
    }
    public loadFile(): void {
        let openPicker: Windows.Storage.Pickers.FileOpenPicker = new Windows.Storage.Pickers.FileOpenPicker();
        openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;
        openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
        openPicker.fileTypeFilter.replaceAll(<any>[".json"]);
        openPicker.pickSingleFileAsync().then((file) => this.continueFileOpenPicker(file));
    }

    public continueFileOpenPicker(file: Windows.Storage.StorageFile): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (file !== null) {
                Windows.Storage.FileIO.readBufferAsync(file).then(
                    (buffer) => {
                        let dataReader = Windows.Storage.Streams.DataReader.fromBuffer(buffer);
                        this.helpOverlayService.helpOverlayConfig = JSON.parse(dataReader.readString(buffer.length));
                        resolve();
                    },
                    (error) => {
                        resolve();
                    }
                );
            }
        });
    }
    private processLoad(e: Event): void {
        let file: any = this._fileInput.files[0];
        let content: string;
        let reader: FileReader = new FileReader();
        reader.onload = (readerEvent) => {
            content = reader.result;
            this.helpOverlayService.helpOverlayConfig = JSON.parse(content);
        };
        reader.readAsText(file);
    }

    private handleMouseOver(event: MouseEvent): void {
        if (this._selectionTarget) {
            if (event.target === document.body ||
                (this._prev && this._prev === event.target)) {
                return;
            }
            if (this._prev) {
                this._prev.className = this._prev.className.replace(/ highlight/g, "");
                this._prev = undefined;
            }
            if (event.target) {
                this._prev = <Element>event.target;
                this._prev.className += " highlight";
            }
        }
    }
    private handleKeyDown(event: KeyboardEvent): void {
        if (event.keyCode === 32) {
            if (this._prev) {
                this._prev.className = this._prev.className.replace(/ highlight/g, "");
            }

            let element: Element = <Element>this._prev;
            switch (this._selectionTarget) {
                case "selector":
                    this.refreshOverlay(element);
                    break;
                case "nextAction":
                    this.helpOverlayService.currentStep.onNext = this.generateSelector(element);
                    this.helpOverlayService.currentStep.onNextAction = ".click()";
                    this.getClassList(this._selectionTarget);

                    break;
                case "previousAction":
                    this.helpOverlayService.currentStep.onPrevious = this.generateSelector(element);
                    this.helpOverlayService.currentStep.onPreviousAction = ".click()";
                    this.getClassList(this._selectionTarget);
                    break;
                case "parentScroll":
                    this.helpOverlayService.currentStep.parentScollSelector = this.generateSelector(element);
                    break;
                default:
                    this.selectedSelector = this.generateSelector(element);
            }
            this._selectionTarget = "";
        }
        this.helpOverlayService.updateEditedConfigString();
    }
    private getClassList(selectionTarget: string): void {
        let classList: DOMTokenList;
        if (selectionTarget === "previousAction" && this.helpOverlayService.currentStep.onPrevious) {
            classList = document.querySelector(this.helpOverlayService.currentStep.onPrevious).classList;
            this.onPreviousClickClassOptions = [];
            for (let index = 0; index < classList.length; index++) {
                let item = classList[index];
                this.onPreviousClickClassOptions.push({ className: item });
            }
        }
        if (selectionTarget === "nextAction" && this.helpOverlayService.currentStep.onNext) {
            classList = document.querySelector(this.helpOverlayService.currentStep.onNext).classList;
            this.onNextClickClassOptions = [];
            for (let index = 0; index < classList.length; index++) {
                let item = classList[index];
                this.onNextClickClassOptions.push({ className: item });
            }
        }
    }
    private computedNthIndex(childElement: Element): any {
        let childNodes: NodeList = childElement.parentNode.childNodes;
        let tagName: string = childElement.tagName;
        let elementsWithSameTag: number = 0;

        for (let i = 0, l = childNodes.length; i < l; i++) {
            if (childNodes[i] === childElement) {
                return elementsWithSameTag + 1;
            }
            let childNode: Element = <Element>childNodes[i];
            if (childNode.tagName === tagName) { elementsWithSameTag++; }
        }
    }
    private generateSelector(element: Element): string {
        let currentElement: Element = element;
        let tagNames: string[] = [];

        while (currentElement) {
            let tagName: string = currentElement.tagName;
            if (tagName) {
                let nthIndex: number = this.computedNthIndex(currentElement);
                let selector: string = tagName;
                if (nthIndex > 1) {
                    selector += ":nth-of-type(" + nthIndex + ")";
                }
                tagNames.push(selector);
            }
            currentElement = <Element>currentElement.parentNode;
        }

        return tagNames.reverse().join(" > ").toLowerCase();
    }
}
