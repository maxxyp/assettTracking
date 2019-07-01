/// <reference path="../../../../../typings/app.d.ts" />
import {DialogCancelNavigationStep} from "../../../../../app/common/ui/dialogs/dialogCancelNavigationStep";
import {DialogController, DialogService} from "aurelia-dialog";
import {Router, NavigationInstruction, Next} from "aurelia-router";

describe("the DialogCancelNavigationStep module", () => {

    let dialogCancelNavigationStep: DialogCancelNavigationStep;
    let dialogService: DialogService;
    let navigationInstruction: NavigationInstruction = <NavigationInstruction>{};
    let router = <Router>{};
    let currentInstruction = <NavigationInstruction>{};

    beforeEach(() => {

        // let flag:boolean = false;

        // mock router and current instruction
        currentInstruction.fragment = "originalUrl";
        router.currentInstruction = currentInstruction;

        // object to test, dialogCancelNavigationStep, with a dialogService, default to no open modals
        dialogService = <DialogService>{};
        dialogCancelNavigationStep = new DialogCancelNavigationStep(dialogService, router);
        dialogService.controllers = [];
    });

    it("should not not cancel route navigation if no controller exists", (done) => {

        let mockNext: any;
        let nextCalled: boolean = false;

        mockNext = (): Promise<any> => {
            return new Promise<any>((resolve, reject) => {
                nextCalled = true;
                resolve(null);
            });
        };
        mockNext.complete = (val: any): any => {
            // flag = true;
        };

        // Act
        dialogCancelNavigationStep.run(navigationInstruction, mockNext).then(() => {
            // Assert
            expect(nextCalled).toBeTruthy();
            done();
        });

    });

    // todo describe, split test so that multiple asserts, too many assertions here
    it("should cancel route navigation if existing dialog is open", (done) => {
        let cancelCalled = false;

        // Arrange

        let dialogController: DialogController = <DialogController>{};
        dialogController.cancel = (val: any): any => {
            cancelCalled = true;
            return Promise.resolve();
        };

        dialogService.hasActiveDialog = true;
        dialogService.controllers.push(dialogController);

        let mockNext: Next = <Next>{};
        let nextSpy: jasmine.Spy;

        // spy on next call
        mockNext.cancel = (val: any): any => Promise.resolve();
        nextSpy = spyOn(mockNext, "cancel");

        // Act
        dialogCancelNavigationStep.run(navigationInstruction, mockNext).then(() => {
            // Assert

            expect(cancelCalled).toBeTruthy();

            const call = nextSpy.calls.argsFor(0)[0];
            // should remain on same url

            // todo too many assertions need to create more tests
            expect(call.url).toEqual("originalUrl");
            expect(call.options.trigger).toEqual(false);
            expect(call.options.replace).toEqual(false);
            expect(call.shouldContinueProcessing).toEqual(false);
            done();
        });
    });

    it("should not cancel route navigation if no existing dialogs open", (done) => {

        // Arrange
        let cancelCalled = false;

        dialogService.controllers = [];

        let mockNext: any;

        mockNext = (): Promise<any> => {
            return new Promise<any>((resolve, reject) => {
                resolve(null);
            });
        };
        mockNext.complete = (val: any): any => {
            // flag = true;
        };

        // Act
        dialogCancelNavigationStep.run(navigationInstruction, mockNext).then(() => {
            // Assert
            expect(cancelCalled).toBeFalsy();
            done();
        });

    });
});
