/// <reference path="../../../../../../typings/app.d.ts" />
import {Router} from "aurelia-router";
import {EventAggregator} from "aurelia-event-aggregator";

import {IApplianceService} from "../../../../../../app/hema/business/services/interfaces/IApplianceService";
import {ILabelService} from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import {IValidationService} from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import {IBusinessRuleService} from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {ICatalogService} from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import {Appliances} from "../../../../../../app/hema/presentation/modules/appliances/appliances";
import {Appliance} from "../../../../../../app/hema/business/models/appliance";
import {IEngineerService} from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import {DialogService, DialogResult} from "aurelia-dialog";
import {IAppLauncher} from "../../../../../../app/common/core/services/IappLauncher";
import {IConfigurationService} from "../../../../../../app/common/core/services/IConfigurationService";
import {IHemaConfiguration} from "../../../../../../app/hema/IHemaConfiguration";
import { ITaskService } from "../../../../../../app/hema/business/services/interfaces/ITaskService";
import { QueryableBusinessRuleGroup } from "../../../../../../app/hema/business/models/businessRules/queryableBusinessRuleGroup";
import { Job } from "../../../../../../app/hema/business/models/job";
import { Task } from "../../../../../../app/hema/business/models/task";
import SinonSpy = Sinon.SinonSpy;

describe("the Appliances module", () => {
    let appliances: Appliances;
    let sandbox: Sinon.SinonSandbox;

    let labelServiceStub: ILabelService;
    let applianceServiceStub: IApplianceService;
    let routerStub: Router;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let catalogServiceStub: ICatalogService;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;
    let configurationServiceStub: IConfigurationService;
    let appLauncherStub: IAppLauncher;
    let taskServiceStub: ITaskService;
    let appLauncherLaunchAppliacationSpy: Sinon.SinonSpy;
    let spyApplicationSaveAppliance: SinonSpy;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        applianceServiceStub = <IApplianceService>{};
        routerStub = <Router>{};
        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sinon.stub().resolves({});
        catalogServiceStub = <ICatalogService>{};
        catalogServiceStub.getGCCode = sinon.stub().resolves({gcCodeDescription: "foo"});
        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);
        dialogServiceStub = <DialogService>{};
        taskServiceStub = <ITaskService>{};
        taskServiceStub.getTasks = sandbox.stub().resolves([]);

        jobServiceStub = <IJobService>{};
        let job = new Job();
        let task = new Task(true, false);
        task.status = "NA";
        job.tasks = [task];

        appLauncherStub = <IAppLauncher>{};
        appLauncherLaunchAppliacationSpy = appLauncherStub.launchApplication = sandbox.spy();

        configurationServiceStub = <IConfigurationService>{};
        configurationServiceStub.getConfiguration = sandbox.stub().returns(<IHemaConfiguration>{adaptLaunchUri: "Y:"});

        validationServiceStub = <IValidationService> {};
        validationServiceStub.build = sandbox.stub().resolves(null);

        businessRuleServiceStub = <IBusinessRuleService>{};
        let queryableRuleGroup = <QueryableBusinessRuleGroup>{};

        let getBusinessRuleStub = queryableRuleGroup.getBusinessRule = sandbox.stub();
        getBusinessRuleStub.withArgs("notDoingJobStatuses").returns("NA");
        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves(queryableRuleGroup);
        businessRuleServiceStub.getRuleGroup = sandbox.stub().resolves({
            "nonContractContractTypes": "NONE"
        });

        jobServiceStub.getJob = sandbox.stub().resolves(<Job> {id: "1", isLandlordJob: false});

        eventAggregatorStub = <EventAggregator>{};
        eventAggregatorStub.publish = sandbox.stub();

        applianceServiceStub.deleteOrExcludeAppliance = sandbox.stub().resolves(Promise.resolve());
        applianceServiceStub.updateAppliance = spyApplicationSaveAppliance;
        applianceServiceStub.isFullGcCode = sandbox.stub().resolves(true);
        applianceServiceStub.ensureAdaptInformationIsSynced = sandbox.stub().resolves(true);

        appliances = new Appliances(labelServiceStub, applianceServiceStub, routerStub,
            jobServiceStub, engineerServiceStub, eventAggregatorStub, dialogServiceStub, validationServiceStub, businessRuleServiceStub, catalogServiceStub,
            appLauncherStub, configurationServiceStub, taskServiceStub);

        let getLabelStub: Sinon.SinonStub = sandbox.stub();

        getLabelStub.withArgs("applianceType").returns("Appliance Type");
        getLabelStub.withArgs("gcCode").returns("GC Code");
        getLabelStub.withArgs("gcStatusFolio").returns("Folio");
        getLabelStub.withArgs("gcStatusSafetyIssue").returns("Safety Issue");
        getLabelStub.withArgs("gcStatusWithdrawn").returns("Withdrawn");
        getLabelStub.withArgs("gcStatusRsl").returns("Reduced Service List");
        getLabelStub.withArgs("gcStatusSl").returns("Service Listed");
        getLabelStub.withArgs("gcStatusSlUnknown").returns("Service Listing Unknown");
        getLabelStub.withArgs("gcStatusCeased").returns("Ceased Production");
        getLabelStub.withArgs("gcStatusNa").returns("Product not found");
        getLabelStub.withArgs("adaptError").returns("Could not find product in Adapt");

        appliances.getLabel = getLabelStub;

        spyApplicationSaveAppliance = sandbox.spy();

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(appliances).toBeDefined();
    });

    describe("call activateAsync", () => {

        let appliance: Appliance;

        beforeEach(() => {
            appliance = new Appliance();
            appliance.gcCode = "999999";
            appliance.description= "bar";
            applianceServiceStub.getAppliances = sandbox.stub().resolves([appliance]);

        });

        it("sets the viewModels and show content", (done) => {
            let showContentSpy = sandbox.spy(appliances, "showContent");
            appliances.activateAsync({jobId: "0"})
            .then(() => {
                expect(appliances.viewModels[0].appliance).toBe(appliance);
                expect(showContentSpy.called).toBe(true);
                expect(appliances.canEdit).toBe(false);
                expect((applianceServiceStub.ensureAdaptInformationIsSynced as Sinon.SinonStub).called).toBe(true);
                done();
            })
            .catch((error) => {
                fail("should not be here: " + error);
                done();
            });
        });

        it("handles appliance service errors", (done) => {
            applianceServiceStub.getAppliances = sandbox.stub().rejects(null);
            appliances.activateAsync({jobId: "0"})
                .then(() => {
                    fail("should not be here");
                    done();
                })
                .catch(() => {
                    done();
                });
        });

        // it("can return viewmodel and appropriate icons when adapt interface errors", (done) => {

        //     appliances.activateAsync({jobId: "0"}).then(() => {
        //         /* wait for next cycle as the icon lookup is done with a non returned promise
        //          * so as not to hold up the UI */
        //         Threading.nextCycle(() => {
        //             expect(appliances.viewModels[0].appliance.headerIcons.map(i => i.iconClassName))
        //                 .toContain(AdaptCssClassConstants.ERROR_ADAPT);
        //             expect(appliances.viewModels[0].appliance).toBe(appliance);
        //             done();
        //         });
        //     });
        // });

        // it("sets the safety risk icon", (done) => {
        //     externalApplianceAppModel.safetyNotice = true;
        //     appliances.activateAsync({jobId: "0"}).then(() => {
        //         expect(appliances.viewModels[0].appliance.headerIcons.map(i => i.iconClassName))
        //             .toContain(AdaptCssClassConstants.SAFETY_ISSUE);
        //         done();
        //     });
        // });

        // it("sets the availability icon to RSL", (done) => {
        //     externalApplianceAppModel.availabilityStatus = AdaptAvailabilityAttributeType.REDUCED_PARTS_LIST;
        //     appliances.activateAsync({jobId: "0"}).then(() => {
        //         expect(appliances.viewModels[0].appliance.headerIcons.map(i => i.iconClassName))
        //             .toContain(AdaptCssClassConstants.RESTRICTED);
        //         done();
        //     });
        // });

        // it("sets the availability icon to CEASED", (done) => {
        //     externalApplianceAppModel.ceased = true;
        //     appliances.activateAsync({jobId: "0"}).then(() => {
        //         expect(appliances.viewModels[0].appliance.headerIcons.map(i => i.iconClassName))
        //             .toContain(AdaptCssClassConstants.CEASED);
        //         done();
        //     });
        // });

        // it("sets the availability icon to FOLIO", (done) => {
        //     externalApplianceAppModel.availabilityStatus = AdaptAvailabilityAttributeType.FOLIO;
        //     appliances.activateAsync({jobId: "0"}).then(() => {
        //         expect(appliances.viewModels[0].appliance.headerIcons.map(i => i.iconClassName))
        //             .toContain(AdaptCssClassConstants.FOLIO);
        //         done();
        //     });
        // });

        // it("sets the availability icon to SL", (done) => {
        //     externalApplianceAppModel.availabilityStatus = AdaptAvailabilityAttributeType.SERVICE_LISTED;
        //     appliances.activateAsync({jobId: "0"}).then(() => {
        //         expect(appliances.viewModels[0].appliance.headerIcons.map(i => i.iconClassName))
        //             .toContain(AdaptCssClassConstants.SERVICE_LISTED);
        //         done();
        //     });
        // });

        // it("sets the availability icon to W", (done) => {
        //     externalApplianceAppModel.availabilityStatus = AdaptAvailabilityAttributeType.WITHDRAWN;
        //     appliances.activateAsync({jobId: "0"}).then(() => {
        //         expect(appliances.viewModels[0].appliance.headerIcons.map(i => i.iconClassName))
        //             .toContain(AdaptCssClassConstants.WITHDRAWN);
        //         done();
        //     });
        // });
        // it("caches header icons on first call with application service", (done) => {
        //     appliance.headerIcons = undefined;
        //     externalApplianceAppModel.availabilityStatus = AdaptAvailabilityAttributeType.WITHDRAWN;
        //     appliances.activateAsync({jobId: "0"}).then(() => {
        //         expect(spyApplicationSaveAppliance.called).toBe(true);
        //         done();
        //     });
        // });

        // it("does not go utilise application service if already retrieved, i.e. cached", (done) => {
        //     appliance.headerIcons = []; // if defined, assumed been to adapt and set
        //     appliances.activateAsync({jobId: "0"}).then(() => {
        //         expect(spyApplicationSaveAppliance.called).toBe(false);
        //         done();
        //     });
        // });

        // it("does not set headerIcons if an invalid GcCode", (done) => {
        //     applianceServiceStub.isFullGcCode = sandbox.stub().resolves(false);
        //     appliances.activateAsync({jobId: "0"}).then(() => {
        //         expect(appliance.headerIcons).toEqual([]);
        //         done();
        //     });
        // });

        describe("appliance contract Status", () => {
            it("can set the contract status for an under contract appliance", done => {
                appliance.contractType = "CONTRACT";
                appliances.activateAsync({jobId: "0"}).then(() => {
                    expect(appliances.viewModels[0].isUnderContract).toBe(true);
                    done();
                });
            });

            it("can not set the contract status for an under contract appliance", done => {
                appliance.contractType = "NONE";
                appliances.activateAsync({jobId: "0"}).then(() => {
                    expect(appliances.viewModels[0].isUnderContract).toBe(false);
                    done();
                });
            });
        });

        describe("applianceDescription and gcCode", () => {
            it("can set appliance description to gcCode description if the gcCode is valid length", done => {
                applianceServiceStub.isFullGcCode = sandbox.stub().resolves(true);
                catalogServiceStub.getGCCode = sinon.stub().resolves({gcCodeDescription: "foo"});
                appliances.activateAsync({jobId: "0"}).then(() => {
                    expect(appliances.viewModels[0].applianceDescription).toBe("foo");
                    done();
                });
            });

            it("can not set appliance description to gcCode description if the gcCode is valid length", done => {
                applianceServiceStub.isFullGcCode = sandbox.stub().resolves(true);
                catalogServiceStub.getGCCode = sinon.stub().resolves(null);

                appliances.activateAsync({jobId: "0"}).then(() => {
                    expect(appliances.viewModels[0].applianceDescription).toBe("bar");
                    done();
                });
            });

            it("can not set appliance description to gcCode description if the gcCode is not known", done => {
                applianceServiceStub.isFullGcCode = sandbox.stub().resolves(false);
                catalogServiceStub.getGCCode = sinon.stub().resolves({gcCodeDescription: "foo"});
                appliances.activateAsync({jobId: "0"}).then(() => {
                    expect(appliances.viewModels[0].applianceDescription).toBe("bar");
                    done();
                });
            });
        });

        describe("excludeAppliance", () => {
            let appliance1 = new Appliance();
            beforeEach(() => {
                appliance1.id = "A2";
                appliance1.gcCode = "111111";
                appliance1.description= "test desc";
                appliance1.contractType = "CONTRACT";
                appliance1.applianceType = "CHB";

                appliance.id = "A1";
                appliance.applianceType = "CHB";
                applianceServiceStub.getAppliances = sandbox.stub().resolves([appliance1, appliance]);
            });

            afterEach(() => {
                sandbox.restore();
            });

            it("canExclude should be set to true for non-contracted appliace", (done) => {
                jobServiceStub.getJob = sandbox.stub().resolves(<Job> {id: "1", isLandlordJob: true});
                appliances.activateAsync({jobId: "0"}).then(() => {
                    expect(appliances.viewModels.find(vm => vm.appliance.id === "A1").canExclude).toBeTruthy();
                    done();
                });
            });

            it("canExclude should be set to false for contracted appliace", (done) => {
                jobServiceStub.getJob = sandbox.stub().resolves(<Job> {id: "1", isLandlordJob: true});
                appliances.activateAsync({jobId: "0"}).then(() => {
                    expect(appliances.viewModels.find(vm => vm.appliance.id === "A2").canExclude).toBeFalsy();
                    done();
                });
            });

            it("should remove the appliance from the viewmodels array and call applianceService.excludeAppliance method", (done) => {
                taskServiceStub.getTasks = sandbox.stub().resolves([<Task> {id: "1", applianceId: "A1"}]);

                appliances.activateAsync({jobId: "0"}).then(() => {
                    appliances.jobId = "1";
                    appliances.showConfirmation = sandbox.stub().resolves(<DialogResult> {wasCancelled: false});
                    appliances.excludeAppliance(new MouseEvent(undefined), "A1")
                        .then(() => {
                            expect((applianceServiceStub.deleteOrExcludeAppliance as Sinon.SinonStub).calledWith("1", "A1")).toBeTruthy();
                            expect(appliances.viewModels.findIndex(a => a.appliance.id === "A1")).toEqual(-1);
                            done();
                        });
                });
            });

            it("should't call applianceService.excludeAppliance method as the confirmation dialog was cancelled", (done) => {
                taskServiceStub.getTasks = sandbox.stub().resolves([<Task> {id: "1", applianceId: "A1"}]);

                appliances.activateAsync({jobId: "0"}).then(() => {
                    appliances.jobId = "1";
                    appliances.showConfirmation = sandbox.stub().resolves(<DialogResult> {wasCancelled: true});
                    appliances.excludeAppliance(new MouseEvent(undefined), "A1")
                        .then(() => {
                            expect((applianceServiceStub.deleteOrExcludeAppliance as Sinon.SinonStub).called).toBeFalsy();
                            expect(appliances.viewModels.length).toEqual(2);
                            done();
                        });
                });
            });

            it("should remove the parent and child appliance and call applianceService.excludeAppliance method twice", (done) => {
                taskServiceStub.getTasks = sandbox.stub().resolves([<Task> {id: "1", applianceId: "A3"}]);

                appliance.childId = "A3";
                let appliance2 = new Appliance();
                appliance2.id = "A3";
                appliance2.gcCode = "212244";
                appliance2.description= "child app desc";
                applianceServiceStub.getAppliances = sandbox.stub().resolves([appliance1, appliance2, appliance]);

                appliances.activateAsync({jobId: "0"}).then(() => {
                    appliances.jobId = "1";
                    appliances.showConfirmation = sandbox.stub().resolves(<DialogResult> {wasCancelled: false});
                    expect(appliances.viewModels.length).toEqual(3);
                    appliances.excludeAppliance(new MouseEvent(undefined), "A1")
                        .then(() => {
                            expect((applianceServiceStub.deleteOrExcludeAppliance as Sinon.SinonStub).calledTwice).toBeTruthy();
                            expect(appliances.viewModels.findIndex(a => a.appliance.id === "A1")).toEqual(-1);
                            expect(appliances.viewModels.findIndex(a => a.appliance.id === "A3")).toEqual(-1);
                            done();
                        });
                });
            });

            it("canExclude should be false if it's not first visit activity to which the appliance is likned", (done) => {
                taskServiceStub.getTasks = sandbox.stub().resolves([<Task> {id: "1", applianceId: "A3", sequence: 2}]);
                let appliance2 = new Appliance();
                appliance2.id = "A3";
                appliance2.gcCode = "212244";
                appliance2.description= "app desc";
                applianceServiceStub.getAppliances = sandbox.stub().resolves([appliance1, appliance2, appliance]);

                appliances.activateAsync({jobId: "0"}).then(() => {
                    appliances.jobId = "1";
                    appliances.showConfirmation = sandbox.stub().resolves(<DialogResult> {wasCancelled: false});
                    expect(appliances.viewModels.length).toEqual(3);
                    expect(appliances.viewModels.find(a => a.appliance.id === "A3").canExclude).toBeFalsy();
                    done();
                });
            });

            it("canExclude should be true if it's first visit activity to which the appliance is likned", (done) => {
                taskServiceStub.getTasks = sandbox.stub().resolves([<Task> {id: "1", applianceId: "A3", sequence: 1}]);
                let appliance2 = new Appliance();
                appliance2.id = "A3";
                appliance2.gcCode = "212244";
                appliance2.description= "app desc";
                applianceServiceStub.getAppliances = sandbox.stub().resolves([appliance1, appliance2, appliance]);

                appliances.activateAsync({jobId: "0"}).then(() => {
                    appliances.jobId = "1";
                    appliances.showConfirmation = sandbox.stub().resolves(<DialogResult> {wasCancelled: false});
                    expect(appliances.viewModels.length).toEqual(3);
                    expect(appliances.viewModels.find(a => a.appliance.id === "A3").canExclude).toBeTruthy();
                    done();
                });
            });
        });
    });

    it("can call navigateToAppliance", () => {
        let routerSpy = routerStub.navigateToRoute = sandbox.spy();
        appliances.navigateToAppliance("0", false);
        expect(routerSpy.calledWith("appliance", {applianceId: "0"})).toBe(true);
    });

    it("can call launchAdapt", () => {
        appliances.launchAdapt("X", false);
        expect(appLauncherLaunchAppliacationSpy.calledWith("Y: X")).toBe(true);
    });
});
