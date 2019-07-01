var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-dependency-injection", "./helpOverlayService", "./helpOverlayStep", "../../dialogs/confirmDialog", "../../dialogs/models/confirmDialogModel", "../../../../common/core/platformHelper", "aurelia-dialog"], function (require, exports, aurelia_framework_1, aurelia_dependency_injection_1, helpOverlayService_1, helpOverlayStep_1, confirmDialog_1, confirmDialogModel_1, platformHelper_1, aurelia_dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArrowPosition = /** @class */ (function () {
        function ArrowPosition() {
        }
        return ArrowPosition;
    }());
    var HelpOverlayAdmin = /** @class */ (function () {
        function HelpOverlayAdmin(helpOverlayService, templatingEngine, dialogService) {
            var _this = this;
            this.arrowPositions = [{ positionDescription: "top" },
                { positionDescription: "bottom" },
                { positionDescription: "left" },
                { positionDescription: "right" }];
            this.helpOverlayService = helpOverlayService;
            this._templatingEngine = templatingEngine;
            document.body.addEventListener("mouseover", function (e) { return _this.handleMouseOver(e); });
            document.body.addEventListener("keydown", function (e) { return _this.handleKeyDown(e); });
            this.showAdmin = false;
            this._dialogService = dialogService;
            this.platform = platformHelper_1.PlatformHelper.getPlatform();
        }
        HelpOverlayAdmin.prototype.setTarget = function (target) {
            this._selectionTarget = target;
        };
        HelpOverlayAdmin.prototype.detached = function () {
            var _this = this;
            document.body.removeEventListener("mouseover", function (e) { return _this.handleMouseOver(e); });
            document.body.removeEventListener("keydown", function (e) { return _this.handleKeyDown(e); });
            if (this._fileInput) {
                this._fileInput.removeEventListener("change", function (e) { return _this.processLoad(e); });
            }
        };
        HelpOverlayAdmin.prototype.toggleAdmin = function () {
            var _this = this;
            this.showAdmin = !this.showAdmin;
            if (this.showAdmin) {
                this._fileInput = document.getElementById("fileInput");
                if (this._fileInput) {
                    this._fileInput.addEventListener("change", function (e) { return _this.processLoad(e); });
                }
            }
            else {
                if (this._fileInput) {
                    this._fileInput.removeEventListener("change", function (e) { return _this.processLoad(e); });
                }
            }
        };
        HelpOverlayAdmin.prototype.refreshOverlay = function (element) {
            if (!element) {
                element = document.querySelector(this.helpOverlayService.currentStep.selector);
            }
            this.helpOverlayService.currentStep.selector = this.generateSelector(element);
            this.helpOverlayService.removeElements();
            var newOverlayElement;
            var el = document.createElement("help-overlay");
            newOverlayElement = document.querySelector(this.helpOverlayService.currentStep.selector).appendChild(el);
            this._templatingEngine.enhance(newOverlayElement);
        };
        HelpOverlayAdmin.prototype.appendStep = function () {
            var id;
            if (this.helpOverlayService.steps) {
                id = this.helpOverlayService.steps.length;
                id++;
            }
            else {
                id = 1;
            }
            this.helpOverlayService.addStep(new helpOverlayStep_1.HelpOverlayStep(id));
        };
        HelpOverlayAdmin.prototype.removeStep = function (id) {
            var _this = this;
            var vm = new confirmDialogModel_1.ConfirmDialogModel();
            vm.header = "Confirmation";
            vm.text = "Are you sure that your wish to remove this step?";
            this._dialogService.open({ viewModel: confirmDialog_1.ConfirmDialog, model: vm }).then(function (result) {
                if (result.wasCancelled === false) {
                    _this.helpOverlayService.removeStep(id);
                }
            });
        };
        HelpOverlayAdmin.prototype.saveFile = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var savePicker = new Windows.Storage.Pickers.FileSavePicker();
                savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
                savePicker.fileTypeChoices.insert("json File", [".json"]);
                savePicker.suggestedFileName = "overlayConfig";
                savePicker.pickSaveFileAsync().then(function (file) {
                    if (file) {
                        Windows.Storage.CachedFileManager.deferUpdates(file);
                        Windows.Storage.FileIO.writeTextAsync(file, _this.helpOverlayService.editedConfigString).done(function () {
                            Windows.Storage.CachedFileManager.completeUpdatesAsync(file).done(function (updateStatus) {
                                if (updateStatus === Windows.Storage.Provider.FileUpdateStatus.complete) {
                                    resolve();
                                }
                                else {
                                    reject();
                                }
                            });
                        });
                    }
                    else {
                        reject();
                    }
                });
            });
        };
        HelpOverlayAdmin.prototype.loadFile = function () {
            var _this = this;
            var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
            openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;
            openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
            openPicker.fileTypeFilter.replaceAll([".json"]);
            openPicker.pickSingleFileAsync().then(function (file) { return _this.continueFileOpenPicker(file); });
        };
        HelpOverlayAdmin.prototype.continueFileOpenPicker = function (file) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (file !== null) {
                    Windows.Storage.FileIO.readBufferAsync(file).then(function (buffer) {
                        var dataReader = Windows.Storage.Streams.DataReader.fromBuffer(buffer);
                        _this.helpOverlayService.helpOverlayConfig = JSON.parse(dataReader.readString(buffer.length));
                        resolve();
                    }, function (error) {
                        resolve();
                    });
                }
            });
        };
        HelpOverlayAdmin.prototype.processLoad = function (e) {
            var _this = this;
            var file = this._fileInput.files[0];
            var content;
            var reader = new FileReader();
            reader.onload = function (readerEvent) {
                content = reader.result;
                _this.helpOverlayService.helpOverlayConfig = JSON.parse(content);
            };
            reader.readAsText(file);
        };
        HelpOverlayAdmin.prototype.handleMouseOver = function (event) {
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
                    this._prev = event.target;
                    this._prev.className += " highlight";
                }
            }
        };
        HelpOverlayAdmin.prototype.handleKeyDown = function (event) {
            if (event.keyCode === 32) {
                if (this._prev) {
                    this._prev.className = this._prev.className.replace(/ highlight/g, "");
                }
                var element_1 = this._prev;
                switch (this._selectionTarget) {
                    case "selector":
                        this.refreshOverlay(element_1);
                        break;
                    case "nextAction":
                        this.helpOverlayService.currentStep.onNext = this.generateSelector(element_1);
                        this.helpOverlayService.currentStep.onNextAction = ".click()";
                        this.getClassList(this._selectionTarget);
                        break;
                    case "previousAction":
                        this.helpOverlayService.currentStep.onPrevious = this.generateSelector(element_1);
                        this.helpOverlayService.currentStep.onPreviousAction = ".click()";
                        this.getClassList(this._selectionTarget);
                        break;
                    case "parentScroll":
                        this.helpOverlayService.currentStep.parentScollSelector = this.generateSelector(element_1);
                        break;
                    default:
                        this.selectedSelector = this.generateSelector(element_1);
                }
                this._selectionTarget = "";
            }
            this.helpOverlayService.updateEditedConfigString();
        };
        HelpOverlayAdmin.prototype.getClassList = function (selectionTarget) {
            var classList;
            if (selectionTarget === "previousAction" && this.helpOverlayService.currentStep.onPrevious) {
                classList = document.querySelector(this.helpOverlayService.currentStep.onPrevious).classList;
                this.onPreviousClickClassOptions = [];
                for (var index = 0; index < classList.length; index++) {
                    var item = classList[index];
                    this.onPreviousClickClassOptions.push({ className: item });
                }
            }
            if (selectionTarget === "nextAction" && this.helpOverlayService.currentStep.onNext) {
                classList = document.querySelector(this.helpOverlayService.currentStep.onNext).classList;
                this.onNextClickClassOptions = [];
                for (var index = 0; index < classList.length; index++) {
                    var item = classList[index];
                    this.onNextClickClassOptions.push({ className: item });
                }
            }
        };
        HelpOverlayAdmin.prototype.computedNthIndex = function (childElement) {
            var childNodes = childElement.parentNode.childNodes;
            var tagName = childElement.tagName;
            var elementsWithSameTag = 0;
            for (var i = 0, l = childNodes.length; i < l; i++) {
                if (childNodes[i] === childElement) {
                    return elementsWithSameTag + 1;
                }
                var childNode = childNodes[i];
                if (childNode.tagName === tagName) {
                    elementsWithSameTag++;
                }
            }
        };
        HelpOverlayAdmin.prototype.generateSelector = function (element) {
            var currentElement = element;
            var tagNames = [];
            while (currentElement) {
                var tagName = currentElement.tagName;
                if (tagName) {
                    var nthIndex = this.computedNthIndex(currentElement);
                    var selector = tagName;
                    if (nthIndex > 1) {
                        selector += ":nth-of-type(" + nthIndex + ")";
                    }
                    tagNames.push(selector);
                }
                currentElement = currentElement.parentNode;
            }
            return tagNames.reverse().join(" > ").toLowerCase();
        };
        HelpOverlayAdmin = __decorate([
            aurelia_dependency_injection_1.inject(helpOverlayService_1.HelpOverlayService, aurelia_framework_1.TemplatingEngine, aurelia_dialog_1.DialogService),
            aurelia_framework_1.customElement("help-overlay-admin"),
            __metadata("design:paramtypes", [Object, aurelia_framework_1.TemplatingEngine, aurelia_dialog_1.DialogService])
        ], HelpOverlayAdmin);
        return HelpOverlayAdmin;
    }());
    exports.HelpOverlayAdmin = HelpOverlayAdmin;
});

//# sourceMappingURL=helpOverlayAdmin.js.map
