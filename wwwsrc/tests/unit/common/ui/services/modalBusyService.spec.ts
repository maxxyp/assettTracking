/// <reference path="../../../../../typings/app.d.ts" />
import {DialogService, DialogController} from "aurelia-dialog";
import {ModalBusyService} from "../../../../../app/common/ui/services/modalBusyService";
import {BusyDialog} from "../../../../../app/common/ui/dialogs/busyDialog";
import {BusyDialogModel} from "../../../../../app/common/ui/dialogs/models/busyDialogModel";

describe("the ModalBusyService module", () => {
    let modalBusyService: ModalBusyService;
    let dialogService: DialogService;
    let model: BusyDialogModel;

    beforeEach(() => {
        dialogService = <DialogService>{};
        dialogService.openAndYieldController = (settings: {viewModel: BusyDialog, model: BusyDialogModel}) => {
            model = settings.model;
            return new Promise<DialogController>((resolve, reject) => {
                resolve();
            });
        };

        modalBusyService = new ModalBusyService(dialogService);
    });

    it("can be created", () => {
        expect(modalBusyService).toBeDefined();
    });

    it("can show busy indicator with 1 message", (done) => {
        modalBusyService.showBusy("mycontext", "mymessage")
            .then(() => {
                expect(model.message === "mymessage").toBeDefined();
                done();
            });
    });

    it("can show busy indicator with 2 messages", (done) => {
        modalBusyService.showBusy("mycontext", "mymessage")
            .then(() => modalBusyService.showBusy("mycontext2", "mymessage2"))
            .then(() => {
                expect(model.message === "mymessage<br/>mymessage2").toBeDefined();
                done();
            });
    });

    it("can show busy indicator with update messages", (done) => {
        modalBusyService.showBusy("mycontext", "mymessage")
            .then(() =>  modalBusyService.showBusy("mycontext", "mymessage2"))
            .then(() => {
                expect(model.message === "mymessage2").toBeDefined();
                done();
            });
    });

    it("can hide busy indicator", (done) => {
        modalBusyService.showBusy("mycontext", "mymessage")
            .then(() =>  modalBusyService.hideBusy("mycontext"))
            .then(() => {
                expect(model.message === "").toBeDefined();
                done();
            });
    });

    it("can fail to hide busy indicator", (done) => {
        modalBusyService.showBusy("mycontext", "mymessage")
            .then(() => modalBusyService.hideBusy("mycontext2"))
            .then(() => {
                expect(model.message === "mymessage").toBeDefined();
                done();
            });
    });
});
