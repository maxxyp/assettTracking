/// <reference path="../../../../../../../typings/app.d.ts" />

import { EventAggregator } from "aurelia-event-aggregator";
import { DialogService } from "aurelia-dialog";
import { IStorageService } from "../../../../../../../app/hema/business/services/interfaces/IStorageService";
import { ILabelService } from "../../../../../../../app/hema/business/services/interfaces/ILabelService";
import { DisplayPreferences } from "../../../../../../../app/hema/presentation/modules/settings/preferences/displayPreferences";
import { ToastPosition } from "../../../../../../../app/common/ui/elements/models/toastPosition";

describe("the DisplayPreferences module", () => {
    let sandbox: Sinon.SinonSandbox;
    let displayPreferences: DisplayPreferences;
    let labelServiceStub = <ILabelService>{};
    let eaStub: EventAggregator = <EventAggregator>{};
    let dialogServiceStub = <DialogService>{};
    let storageServiceStub = <IStorageService>{};

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        storageServiceStub.setAppSettings = sandbox.stub();

        storageServiceStub.getAppSettings = sandbox.stub().resolves({
            notificationPosition: ToastPosition.topright,
            notificationDisplayTime: 100,
            dropdownType: 1
        });
        displayPreferences = new DisplayPreferences(labelServiceStub, eaStub, dialogServiceStub, storageServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should be defined", () => {
        expect(displayPreferences).toBeDefined();
    });

    it("should call activateAsync and return toastSelectedPosition topright", (done) => {
        displayPreferences.activateAsync().then(() => {
            expect(displayPreferences.toastDelay).toEqual(100);
            expect(displayPreferences.toastSelectedPosition).toEqual(3);
            expect(displayPreferences.appSettings).toEqual({notificationPosition: 3, notificationDisplayTime: 100, dropdownType: 1, soundEnabled: false});
            done();
        });
    });

    it("should call toastDelayChanged method", () => {
        displayPreferences.toastDelayChanged(10, 3);
        expect(displayPreferences.appSettings.notificationDisplayTime).toEqual(10);
    });

    it("should call toastSelectedPositionChanged method", () => {
        displayPreferences.toastSelectedPositionChanged(3, 2);
        expect(displayPreferences.appSettings.notificationPosition).toEqual(3);
    });

});