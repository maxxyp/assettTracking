/// <reference path="../../../../../typings/app.d.ts" />

import { EngineerState } from "../../../../../app/hema/presentation/elements/engineerState";
import { IEngineerService } from "../../../../../app/hema/business/services/interfaces/IEngineerService";
import { ILabelService } from "../../../../../app/hema/business/services/interfaces/ILabelService";
import { IBusinessRuleService } from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { EventAggregator } from "aurelia-event-aggregator";
import { IJobService } from "../../../../../app/hema/business/services/interfaces/IJobService";
import { JobState } from "../../../../../app/hema/business/models/jobState";
import { JobServiceConstants } from "../../../../../app/hema/business/services/constants/jobServiceConstants";
import { EngineerServiceConstants } from "../../../../../app/hema/business/services/constants/engineerServiceConstants";
import { UserPreferenceConstants } from "../../../../../app/hema/business/services/constants/userPreferenceConstants";
import { IConfigurationService } from "../../../../../app/common/core/services/IConfigurationService";
import { Router } from "aurelia-router";
import { DialogService } from "aurelia-dialog";
import { Engineer } from "../../../../../app/hema/business/models/engineer";
import { IArchiveService } from "../../../../../app/hema/business/services/interfaces/IArchiveService";
import { IStorageService } from "../../../../../app/hema/business/services/interfaces/IStorageService";
import { IMessageService } from "../../../../../app/hema/business/services/interfaces/IMessageService";
import { IAnalyticsService } from "../../../../../app/common/analytics/IAnalyticsService";
import { EngineerDialogConstants } from "../../../../../app/hema/presentation/constants/engineerDialogConstants";
import { RetryPayload } from "../../../../../app/common/resilience/models/retryPayload";
import { JobPartsCollection } from "../../../../../app/hema/business/models/jobPartsCollection";
import { IResilientService } from "../../../../../app/common/resilience/services/interfaces/IResilientService";
import { IVanStockService } from "../../../../../app/hema/business/services/interfaces/IVanStockService";
import { IFeatureToggleService } from "../../../../../app/hema/business/services/interfaces/IFeatureToggleService";
import { MaterialToCollect } from "../../../../../app/hema/business/models/materialToCollect";

describe("the EngineerState module", () => {
    let engineerState: EngineerState;
    let sandbox: Sinon.SinonSandbox;
    let engineerServiceStub: IEngineerService;
    let jobServiceStub: IJobService;
    let labelServiceStub: ILabelService;
    let businessRuleServiceStub: IBusinessRuleService;
    let configurationServiceStub: IConfigurationService;
    let eventAggregatorStub: EventAggregator;
    let callbacks: { [event: string]: Function };
    let disposeCount: number;
    let routerStub: Router;
    let fftServiceStub: IResilientService;
    let vanStockServiceStub: IResilientService;
    let dialogServiceStub: DialogService;
    let archiveServiceStub: IArchiveService;
    let storageServiceStub: IStorageService;
    let messageServiceStub: IMessageService;
    let analyticsStub: IAnalyticsService;
    let businessVanStockServiceStub: IVanStockService;
    let featureToggleServiceStub: IFeatureToggleService;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        engineerServiceStub = <IEngineerService>{};
        jobServiceStub = <IJobService>{};
        labelServiceStub = <ILabelService>{};
        businessRuleServiceStub = <IBusinessRuleService>{};
        eventAggregatorStub = <EventAggregator>{};
        configurationServiceStub = <IConfigurationService>{};
        routerStub = <Router>{};
        fftServiceStub = <IResilientService>{};
        vanStockServiceStub = <IResilientService>{};
        dialogServiceStub = <DialogService>{};
        storageServiceStub = <IStorageService>{};
        messageServiceStub = <IMessageService>{ unreadCount: 3 };

        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves({
            "signOnId": "52",
            "signOffId": "13",
            "minId": "5"
        });

        let labels = {
            "signOn": "Sign On",
            "signOff": "Sign Off"
        }
        labels[EngineerDialogConstants.END_OF_DAY_MESSAGE_UNREAD] = EngineerDialogConstants.END_OF_DAY_MESSAGE_UNREAD;
        labels[EngineerDialogConstants.END_OF_DAY_MESSAGE_UNSENT] = EngineerDialogConstants.END_OF_DAY_MESSAGE_UNSENT;
        labels[EngineerDialogConstants.END_OF_DAY_MESSAGE_SUCCESS] = EngineerDialogConstants.END_OF_DAY_MESSAGE_SUCCESS;
        labels[EngineerDialogConstants.END_OF_DAY_MESSAGE_RETRY] = EngineerDialogConstants.END_OF_DAY_MESSAGE_RETRY;

        labelServiceStub.getGroup = sandbox.stub().resolves(labels);

        callbacks = {};
        disposeCount = 0;
        eventAggregatorStub.subscribe = (event: string, callback: Function) => {
            callbacks[event] = callback;
            return { dispose: () => { disposeCount++; } };
        };

        eventAggregatorStub.publish = sandbox.stub();

        jobServiceStub.getActiveJobId = sandbox.stub().resolves("123");
        jobServiceStub.getJobState = sandbox.stub().resolves(JobState.idle);
        jobServiceStub.setJobState = () => Promise.resolve();
        jobServiceStub.areAllJobsDone = sandbox.stub().resolves(false);

        engineerServiceStub.getAllStatus = sandbox.stub().resolves([]);
        engineerServiceStub.getStatus = sandbox.stub().resolves(undefined);
        engineerServiceStub.isSignedOn = sandbox.stub().resolves(true);
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);
        engineerServiceStub.setStatus = () => Promise.resolve();
        let engineer = new Engineer();
        engineer.id = "1234";
        engineer.isSignedOn = true;
        engineer.status = "foo";
        engineerServiceStub.getCurrentEngineer = sandbox.stub().resolves(engineer);
        configurationServiceStub.getConfiguration = sandbox.stub().returns(null);
        fftServiceStub.getUnsentPayloads = sandbox.stub().returns([]);
        vanStockServiceStub.getUnsentPayloads = sandbox.stub().returns([]);
        dialogServiceStub.open = sandbox.stub().resolves(undefined);
        archiveServiceStub = <IArchiveService>{};
        archiveServiceStub.addEngineerState = sandbox.stub().resolves(undefined);

        storageServiceStub.userSettingsComplete = sandbox.stub().resolves(true);

        analyticsStub = <IAnalyticsService>{};
        analyticsStub.setCustomMetaData = sandbox.stub();

        featureToggleServiceStub = <IFeatureToggleService>{};
        featureToggleServiceStub.isAssetTrackingEnabled = sandbox.stub().returns(false);

        businessVanStockServiceStub = <IVanStockService>{};

        engineerState = new EngineerState(engineerServiceStub, jobServiceStub, labelServiceStub, businessRuleServiceStub,
            eventAggregatorStub, configurationServiceStub, routerStub, fftServiceStub, vanStockServiceStub, dialogServiceStub,
            archiveServiceStub, storageServiceStub, messageServiceStub, analyticsStub,
            featureToggleServiceStub, businessVanStockServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(engineerState).toBeDefined();
    });

    describe("attached method", () => {
        it("can subscribe to events and call them signed on and working and usersettings complete", (done) => {
            engineerServiceStub.isSignedOn = sandbox.stub().resolves(true);
            engineerServiceStub.isWorking = sandbox.stub().resolves(true);
            storageServiceStub.userSettingsComplete = sandbox.stub().resolves(true);

            engineerState.attached()
                .then(() => {
                    expect(Object.keys(callbacks).length).toEqual(3);

                    callbacks[UserPreferenceConstants.USER_PREFERENCES_CHANGED]();

                    callbacks[EngineerServiceConstants.ENGINEER_STATUS_CHANGED]().then(() => {
                        callbacks[JobServiceConstants.JOB_STATE_CHANGED]().then(() => {
                            expect(engineerState.userSettingsComplete).toBeTruthy();
                            done();
                        });
                    });
                });
        });

        it("can subscribe to events and call them signed on and not working and usersettings incomplete", (done) => {
            engineerServiceStub.isSignedOn = sandbox.stub().resolves(true);
            engineerServiceStub.isWorking = sandbox.stub().resolves(false);
            storageServiceStub.userSettingsComplete = sandbox.stub().resolves(false);

            engineerState.attached()
                .then(() => {
                    expect(Object.keys(callbacks).length).toEqual(3);

                    callbacks[UserPreferenceConstants.USER_PREFERENCES_CHANGED]();

                    callbacks[EngineerServiceConstants.ENGINEER_STATUS_CHANGED]().then(() => {
                        callbacks[JobServiceConstants.JOB_STATE_CHANGED]().then(() => {
                            expect(engineerState.userSettingsComplete).toBeFalsy();
                            done();
                        });
                    });
                });
        });

        it("can subscribe to events and call them not signed on and working", (done) => {
            engineerServiceStub.isSignedOn = sandbox.stub().resolves(false);
            engineerServiceStub.isWorking = sandbox.stub().resolves(true);

            engineerState.attached()
                .then(() => {
                    expect(Object.keys(callbacks).length).toEqual(3);

                    callbacks[EngineerServiceConstants.ENGINEER_STATUS_CHANGED]().then(() => {
                        callbacks[JobServiceConstants.JOB_STATE_CHANGED]().then(() => {
                            done();
                        });
                    });
                });
        });

        it("can subscribe to events and call them not signed on and not working", (done) => {
            engineerServiceStub.isSignedOn = sandbox.stub().resolves(false);
            engineerServiceStub.isWorking = sandbox.stub().resolves(false);

            engineerState.attached()
                .then(() => {
                    expect(Object.keys(callbacks).length).toEqual(3);

                    callbacks[EngineerServiceConstants.ENGINEER_STATUS_CHANGED]().then(() => {
                        callbacks[JobServiceConstants.JOB_STATE_CHANGED]().then(() => {
                            done();
                        });
                    });
                });
        });

        it("can getstates and filter them", (done) => {
            engineerServiceStub.getAllStatus = sandbox.stub().resolves([
                { fieldOperativeStatus: "11", fieldOperativeStatusDescription: "11" },
                { fieldOperativeStatus: "4", fieldOperativeStatusDescription: "4" },
                { fieldOperativeStatus: "12", fieldOperativeStatusDescription: "12" }
            ]);

            engineerState.attached()
                .then(() => {
                    expect(engineerState.engineerStatuses.length).toEqual(3);
                    expect(engineerState.engineerStatuses[0].fieldOperativeStatus).toEqual("internalWorking");
                    expect(engineerState.engineerStatuses[1].fieldOperativeStatus).toEqual("11");
                    expect(engineerState.engineerStatuses[2].fieldOperativeStatus).toEqual("12");
                    done();
                });
        });

        it("can getstates and sort them", (done) => {
            engineerServiceStub.getAllStatus = sandbox.stub().resolves([
                { fieldOperativeStatus: "11", fieldOperativeStatusDescription: "11" },
                { fieldOperativeStatus: "13", fieldOperativeStatusDescription: "13" },
                { fieldOperativeStatus: "12", fieldOperativeStatusDescription: "12" }
            ]);

            engineerState.attached()
                .then(() => {
                    expect(engineerState.engineerStatuses.length).toEqual(3);
                    expect(engineerState.engineerStatuses[0].fieldOperativeStatus).toEqual("internalWorking");
                    expect(engineerState.engineerStatuses[1].fieldOperativeStatus).toEqual("11");
                    expect(engineerState.engineerStatuses[2].fieldOperativeStatus).toEqual("12");
                    done();
                });
        });

        it("can subscribe to events and call with a valid status", (done) => {
            engineerServiceStub.isSignedOn = sandbox.stub().resolves(true);
            engineerServiceStub.isWorking = sandbox.stub().resolves(false);
            engineerServiceStub.getAllStatus = sandbox.stub().resolves([
                { fieldOperativeStatus: "11", fieldOperativeStatusDescription: "11" },
                { fieldOperativeStatus: "13", fieldOperativeStatusDescription: "13" },
                { fieldOperativeStatus: "12", fieldOperativeStatusDescription: "12" }
            ]);
            engineerServiceStub.getStatus = sandbox.stub().resolves("12");

            engineerState.attached()
                .then(() => {
                    expect(Object.keys(callbacks).length).toEqual(3);

                    callbacks[EngineerServiceConstants.ENGINEER_STATUS_CHANGED]().then(() => {
                        expect(engineerState.engineerState).toEqual("12");
                        done();
                    });
                });
        });

        it("can subscribe to events and call with a invalid status", (done) => {
            engineerServiceStub.isSignedOn = sandbox.stub().resolves(true);
            engineerServiceStub.isWorking = sandbox.stub().resolves(false);
            engineerServiceStub.getAllStatus = sandbox.stub().resolves([
                { fieldOperativeStatus: "11", fieldOperativeStatusDescription: "11" },
                { fieldOperativeStatus: "4", fieldOperativeStatusDescription: "4" },
                { fieldOperativeStatus: "12", fieldOperativeStatusDescription: "12" }
            ]);
            engineerServiceStub.getStatus = sandbox.stub().resolves("99");

            engineerState.attached()
                .then(() => {
                    expect(Object.keys(callbacks).length).toEqual(3);

                    callbacks[EngineerServiceConstants.ENGINEER_STATUS_CHANGED]().then(() => {
                        expect(engineerState.engineerState).toBeUndefined();
                        done();
                    });
                });
        });

        it("can subscribe to events and call with a no status", (done) => {
            engineerServiceStub.isSignedOn = sandbox.stub().resolves(true);
            engineerServiceStub.isWorking = sandbox.stub().resolves(false);
            engineerServiceStub.getAllStatus = sandbox.stub().resolves([
                { fieldOperativeStatus: "11", fieldOperativeStatusDescription: "11" },
                { fieldOperativeStatus: "13", fieldOperativeStatusDescription: "13" },
                { fieldOperativeStatus: "12", fieldOperativeStatusDescription: "12" }
            ]);
            engineerServiceStub.getStatus = sandbox.stub().resolves(null);

            engineerState.attached()
                .then(() => {
                    expect(Object.keys(callbacks).length).toEqual(3);

                    callbacks[EngineerServiceConstants.ENGINEER_STATUS_CHANGED]().then(() => {
                        expect(engineerState.engineerState).toBeUndefined();
                        done();
                    });
                });
        });
    });

    describe("detached method", () => {
        it("can dispose subscriptions", (done) => {
            engineerServiceStub.isSignedOn = sandbox.stub().resolves(true);
            engineerServiceStub.isWorking = sandbox.stub().resolves(true);

            engineerState.attached()
                .then(() => {
                    expect(Object.keys(callbacks).length).toEqual(3);

                    engineerState.detached();
                    expect(disposeCount).toEqual(3);
                    done();
                });
        });
    });

    describe("engineerStateChanged method", () => {
        it("can change with subscriptions", (done) => {
            let sinonSpy = sandbox.spy(engineerServiceStub, "setStatus");

            engineerState.attached()
                .then(() => {
                    engineerState.engineerState = "internalWorking";
                    engineerState.engineerStateChanged("internalWorking", "")
                        .then(() => {
                            expect(sinonSpy.callCount).toEqual(1);
                            expect(sinonSpy.alwaysCalledWith(undefined)).toBeTruthy();
                            done();
                        });
                });
        });

        it("can change to a non-end-of-day state", (done) => {
            let sinonSpy = sandbox.spy(engineerServiceStub, "setStatus");

            engineerState.attached()
                .then(() => {
                    engineerState.engineerState = "1";
                    engineerState.engineerStateChanged("1", "")
                        .then(() => {
                            expect(sinonSpy.callCount).toEqual(1);
                            expect(sinonSpy.alwaysCalledWith("1")).toBeTruthy();
                            done();
                        });
                });
        });

        it("can change to end-of-day state but fail because messages are outstanding", (done) => {
            let setStatusSpy = sandbox.spy(engineerServiceStub, "setStatus");

            engineerState.attached()
                .then(() => {
                    engineerState.engineerState = "13";
                    engineerState.engineerStateChanged("13", "12")
                        .then(() => {
                            expect(setStatusSpy.called).toBe(false);
                            expect(engineerState.engineerState).toBe("12");
                            expect((dialogServiceStub.open as Sinon.SinonStub).called).toBe(true);
                            expect((dialogServiceStub.open as Sinon.SinonStub).args[0][0].model.errorMessage)
                                        .toBe(EngineerDialogConstants.END_OF_DAY_MESSAGE_UNREAD);
                            done();
                        });
                });
        });

        it("can change to end-of-day state but fail because resilience retry payloads still exist", (done) => {
            let setStatusSpy = sandbox.spy(engineerServiceStub, "setStatus");
            messageServiceStub.unreadCount = 0;
            fftServiceStub.getUnsentPayloads = sandbox.stub().returns([<RetryPayload>{}]);

            engineerState.attached()
                .then(() => {
                    engineerState.engineerState = "13";
                    engineerState.engineerStateChanged("13", "12")
                        .then(() => {
                            expect(setStatusSpy.called).toBe(false);
                            expect(engineerState.engineerState).toBe("12");
                            expect((dialogServiceStub.open as Sinon.SinonStub).called).toBe(true);
                            expect((dialogServiceStub.open as Sinon.SinonStub).args[0][0].model.errorMessage)
                                        .toBe(EngineerDialogConstants.END_OF_DAY_MESSAGE_UNSENT);
                            done();
                        });
                });
        });

        it("can change to end-of-day state but fail because resilience retry payloads still exist", (done) => {
            let setStatusSpy = sandbox.spy(engineerServiceStub, "setStatus");
            messageServiceStub.unreadCount = 0;
            fftServiceStub.getUnsentPayloads = sandbox.stub().returns([<RetryPayload>{}]);

            engineerState.attached()
                .then(() => {
                    engineerState.engineerState = "13";
                    engineerState.engineerStateChanged("13", "12")
                        .then(() => {
                            expect(setStatusSpy.called).toBe(false);
                            expect(engineerState.engineerState).toBe("12");
                            expect((dialogServiceStub.open as Sinon.SinonStub).called).toBe(true);
                            expect((dialogServiceStub.open as Sinon.SinonStub).args[0][0].model.errorMessage)
                                        .toBe(EngineerDialogConstants.END_OF_DAY_MESSAGE_UNSENT);
                            done();
                        });
                });
        });

        it("can change to end-of-day state and succeed", (done) => {
            let setStatusSpy = sandbox.spy(engineerServiceStub, "setStatus");
            messageServiceStub.unreadCount = 0;
            fftServiceStub.getUnsentPayloads = sandbox.stub().returns([]);

            engineerState.attached()
                .then(() => {
                    engineerState.engineerState = "13";
                    engineerState.engineerStateChanged("13", "12")
                        .then(() => {
                            expect(setStatusSpy.called).toBe(true);
                            expect(engineerState.engineerState).toBe("13");
                            expect((dialogServiceStub.open as Sinon.SinonStub).called).toBe(true);
                            expect((dialogServiceStub.open as Sinon.SinonStub).args[0][0].model.infoMessage)
                            .toBe(EngineerDialogConstants.END_OF_DAY_MESSAGE_SUCCESS);
                            done();
                        });
                });
        });

        it("can change to end-of-day state and fail if setStaus throws and the user does not want to retry", (done) => {
            engineerServiceStub.setStatus = sandbox.stub().rejects(null);
            messageServiceStub.unreadCount = 0;
            fftServiceStub.getUnsentPayloads = sandbox.stub().returns([]);

            dialogServiceStub.open = sandbox.stub().resolves({output: false})
            engineerState.attached()
                .then(() => {
                    engineerState.engineerState = "13";
                    engineerState.engineerStateChanged("13", "12")
                        .then(() => {
                            expect((dialogServiceStub.open as Sinon.SinonStub).called).toBe(true);
                            expect((dialogServiceStub.open as Sinon.SinonStub).args[0][0].model.errorMessage)
                                .toBe(EngineerDialogConstants.END_OF_DAY_MESSAGE_RETRY);
                            expect(engineerState.engineerState).toBe("12");
                            done();
                        });
                });
        });

        it("can change to end-of-day state and fail if setStaus throws and the user does want to retry", (done) => {
            // this test involves the recursive calling of engineerStateChanged.
            // on sinon 1.7.1 I couldn't find a way to use sandbox.* to make it so that actual engineerStateChanged
            // was called in the first instance, but when it was next called recursively allow us to exit the loop and
            // get on with the test assertions. So this is a bit hacky, feel free to do it properly
            let functionHasBeenCalled = false;
            let originalFn = engineerState.engineerStateChanged;
            engineerState.engineerStateChanged = (n, o) => {
                if (functionHasBeenCalled) {
                    engineerState.engineerStateChanged = originalFn;
                    return Promise.resolve();
                } else {
                    functionHasBeenCalled = true;
                    return originalFn.call(engineerState, n, o);
                }
            };

            engineerServiceStub.setStatus = sandbox.stub().rejects(null);
            messageServiceStub.unreadCount = 0;
            fftServiceStub.getUnsentPayloads = sandbox.stub().returns([]);

            dialogServiceStub.open = sandbox.stub().resolves({output: true})
            engineerState.attached()
                .then(() => {
                    engineerState.engineerState = "13";
                    engineerState.engineerStateChanged("13", "12")
                        .then(() => {
                            expect((dialogServiceStub.open as Sinon.SinonStub).called).toBe(true);
                            expect((dialogServiceStub.open as Sinon.SinonStub).args[0][0].model.errorMessage)
                                .toBe(EngineerDialogConstants.END_OF_DAY_MESSAGE_RETRY);
                            expect(engineerState.engineerState).toBe("13");
                            done();
                        });
                });
        });

        it("can change with subscriptions without active job id", (done) => {
            jobServiceStub.getActiveJobId = sandbox.stub().resolves(null);
            jobServiceStub.getJobState = sandbox.stub().resolves(JobState.idle);

            engineerServiceStub.setStatus = () => Promise.resolve();
            let sinonSpy = sandbox.spy(engineerServiceStub, "setStatus");

            engineerState.attached()
                .then(() => {
                    engineerState.engineerState = "1";
                    engineerState.engineerStateChanged("1", "")
                        .then(() => {
                            expect(sinonSpy.callCount).toEqual(1);
                            expect(sinonSpy.alwaysCalledWith("1")).toBeTruthy();
                            done();
                        });
                });
        });

        it("can not set job state if no active job", (done) => {
            jobServiceStub.getActiveJobId = sandbox.stub().resolves(null);
            jobServiceStub.getJobState = sandbox.stub().resolves(null);

            let sinonSpy = sandbox.spy(jobServiceStub, "setJobState");

            engineerState.attached()
                .then(() => {
                    engineerState.engineerState = "1";
                    engineerState.engineerStateChanged("1", "")
                        .then(() => {
                            expect(sinonSpy.callCount).toEqual(0);
                            done();
                        });
                });
        });

        it("can not set job state if active job and no current job state", (done) => {
            jobServiceStub.getActiveJobId = sandbox.stub().resolves("123");
            jobServiceStub.getJobState = sandbox.stub().resolves(null);

            let sinonSpy = sandbox.spy(jobServiceStub, "setJobState");

            engineerState.attached()
                .then(() => {
                    engineerState.engineerState = "1";
                    engineerState.engineerStateChanged("1", "")
                        .then(() => {
                            expect(sinonSpy.callCount).toEqual(0);
                            done();
                        });
                });
        });

        it("not can change without subscriptions", (done) => {
            engineerServiceStub.setStatus = () => Promise.resolve();
            let sinonSpy = sandbox.spy(engineerServiceStub, "setStatus");

            engineerState.engineerStateChanged("", "")
                .then(() => {
                    expect(sinonSpy.callCount).toEqual(0);
                    done();
                });
        });

        it("should set property engineerService.isPartCollectionInProgress to true when the engineerState set to Obtaining Mats status (old school)", async done => {
            engineerServiceStub.isPartCollectionInProgress = false;

            let jpc1 = new JobPartsCollection();
            jpc1.id = "1";
            jpc1.parts = [];
            jpc1.done = false;
            jobServiceStub.getPartsCollections = sandbox.stub().resolves([jpc1]);

            await engineerState.attached()
            engineerState.engineerState = "11";
            await engineerState.engineerStateChanged("11", "")
            expect(engineerServiceStub.isPartCollectionInProgress).toBe(true);
            done();
        });

        it("should not set property engineerService.isPartCollectionInProgress to true when the engineerState set to working (old school)", async done => {
            engineerServiceStub.isPartCollectionInProgress = false;

            let jpc1 = new JobPartsCollection();
            jpc1.id = "1";
            jpc1.parts = [];
            jpc1.done = false;
            jobServiceStub.getPartsCollections = sandbox.stub().resolves([jpc1]);

            await engineerState.attached()
            engineerState.engineerState = "internalWorking";
            await engineerState.engineerStateChanged("internalWorking", "")
            expect(engineerServiceStub.isPartCollectionInProgress).toBe(false);
            done();
        });

        it("should set property engineerService.isPartCollectionInProgress to true when the engineerState set to Obtaining Mats status (new school)", async done => {
            featureToggleServiceStub.isAssetTrackingEnabled = sandbox.stub().returns(true);
            engineerServiceStub.isPartCollectionInProgress = false;

            jobServiceStub.getPartsCollections = sandbox.stub().resolves([]);
            businessVanStockServiceStub.getPartsToCollect = sandbox.stub().resolves({toCollect: <MaterialToCollect[]>[
                {} // exists a part to collect
            ]})
            await engineerState.attached()
            engineerState.engineerState = "11";
            await engineerState.engineerStateChanged("11", "")
            expect(engineerServiceStub.isPartCollectionInProgress).toBe(true);
            done();
        });

        it("should not set property engineerService.isPartCollectionInProgress to true when the engineerState set to working (new school)", async done => {
            featureToggleServiceStub.isAssetTrackingEnabled = sandbox.stub().returns(true);
            engineerServiceStub.isPartCollectionInProgress = false;

            let jpc1 = new JobPartsCollection();
            jpc1.id = "1";
            jpc1.parts = [];
            jpc1.done = false;
            jobServiceStub.getPartsCollections = sandbox.stub().resolves([jpc1]);
            businessVanStockServiceStub.getPartsToCollect = sandbox.stub().resolves({toCollect: <MaterialToCollect[]>[
                {} // does not exist a part to collect
            ]})
            await engineerState.attached()
            engineerState.engineerState = "internalWorking";
            await engineerState.engineerStateChanged("internalWorking", "")
            expect(engineerServiceStub.isPartCollectionInProgress).toBe(false);
            done();
        });
    });
});
