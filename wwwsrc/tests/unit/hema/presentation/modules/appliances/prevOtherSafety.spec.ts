/// <reference path="../../../../../../typings/app.d.ts" />
import { EventAggregator } from "aurelia-event-aggregator";
import { IApplianceService } from "../../../../../../app/hema/business/services/interfaces/IApplianceService";
import { ILabelService } from "../../../../../../app/hema/business/services/interfaces/ILabelService";
import { IJobService } from "../../../../../../app/hema/business/services/interfaces/IJobService";
import { IValidationService } from "../../../../../../app/hema/business/services/interfaces/IValidationService";
import { IBusinessRuleService } from "../../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../../../../../app/hema/business/services/interfaces/ICatalogService";
import { Appliance } from "../../../../../../app/hema/business/models/appliance";
import { ApplianceSafety } from "../../../../../../app/hema/business/models/applianceSafety";
import { IEngineerService } from "../../../../../../app/hema/business/services/interfaces/IEngineerService";
import { DialogService, DialogResult } from "aurelia-dialog";
import { PrevOtherSafety } from "../../../../../../app/hema/presentation/modules/appliances/prevOtherSafety";
import { PreviousApplianceUnsafeDetail } from "../../../../../../app/hema/business/models/previousApplianceUnsafeDetail";
import {ApplianceSafetyType} from "../../../../../../app/hema/business/models/applianceSafetyType";

describe("the PreOtherSafety module", () => {
    let prevOtherSafety: PrevOtherSafety;
    let sandbox: Sinon.SinonSandbox;

    let labelServiceStub: ILabelService;
    let applianceServiceStub: IApplianceService;
    let eventAggregatorStub: EventAggregator;
    let dialogServiceStub: DialogService;
    let catalogServiceStub: ICatalogService;
    let jobServiceStub: IJobService;
    let engineerServiceStub: IEngineerService;
    let validationServiceStub: IValidationService;
    let businessRuleServiceStub: IBusinessRuleService;

    let showContentSpy: Sinon.SinonSpy;

    let applianceStub: Appliance;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        applianceServiceStub = <IApplianceService>{};
        labelServiceStub = <ILabelService>{};
        labelServiceStub.getGroup = sinon.stub().returns(Promise.resolve(null));
        eventAggregatorStub = <EventAggregator>{};

        catalogServiceStub = <ICatalogService>{};
        catalogServiceStub.getSafetyActions = sandbox.stub().resolves([]);
        catalogServiceStub.getSafetyNoticeTypes = sandbox.stub().resolves([]);
        catalogServiceStub.getSafetyNoticeStatuses = sandbox.stub().resolves([]);
        catalogServiceStub.getPerformanceTestReasons = sandbox.stub().resolves([]);

        eventAggregatorStub = <EventAggregator>{};
        jobServiceStub = <IJobService>{};
        jobServiceStub.getJob = sandbox.stub().resolves({ isLandlordJob: true });

        validationServiceStub = <IValidationService>{};
        validationServiceStub.build = sandbox.stub().resolves([]);
        validationServiceStub.validate = sandbox.stub().resolves(undefined);

        engineerServiceStub = <IEngineerService>{};
        engineerServiceStub.isWorking = sandbox.stub().resolves(true);

        applianceStub = new Appliance();
        applianceStub.safety = <ApplianceSafety>{};
        applianceServiceStub.getAppliance = sandbox.stub().resolves(applianceStub);

        eventAggregatorStub.publish = sandbox.stub();

        dialogServiceStub = <DialogService>{};
        let dialogResult: DialogResult = new DialogResult(false, "");
        dialogServiceStub.open = sandbox.stub().resolves(dialogResult);

        prevOtherSafety = new PrevOtherSafety(labelServiceStub, applianceServiceStub, eventAggregatorStub, dialogServiceStub, validationServiceStub, businessRuleServiceStub, catalogServiceStub);

        prevOtherSafety.showContent = showContentSpy = sandbox.spy();

        prevOtherSafety.labels = {
            "no": "",
            "yes": "",
            "na": ""
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(prevOtherSafety).toBeDefined();
    });

    describe("canActivateAsync", () => {
        it("can continue with correct applianceType", done => {
            applianceStub.applianceSafetyType = ApplianceSafetyType.other;
            prevOtherSafety.canActivateAsync({ applianceId: "1", jobId: "1" }, {settings: {applianceSafetyType: ApplianceSafetyType.other} })
            .then(result => {
                expect(result).toBe(true);
                done();
            });
        });

        it("can not continue with incorrect applianceType", done => {
            applianceStub.applianceSafetyType = ApplianceSafetyType.electrical;
            prevOtherSafety.canActivateAsync({ applianceId: "1", jobId: "1" }, {settings: {applianceSafetyType: ApplianceSafetyType.other} })
            .then(result => {
                expect(result).not.toBe(true);
                done();
            });
        });
    });

    describe(("activateAsync"), () => {
        it("can call activateAsync loadCatalogs showContent", done => {
            prevOtherSafety.activateAsync({ jobId: "1", applianceId: "1" }).then(() => {
                expect(showContentSpy.calledOnce).toBeTruthy();
                done();
            });
        });

        it("previousApplianceUnsafeDetail model undefined, isEmpty true", done => {

            applianceStub = new Appliance();
            applianceStub.safety = <ApplianceSafety>{};
            applianceStub.safety.previousApplianceUnsafeDetail = undefined;
            applianceServiceStub.getAppliance = sandbox.stub().resolves(applianceStub);
            prevOtherSafety.activateAsync({ jobId: "1", applianceId: "1" }).then(() => {
                expect(prevOtherSafety.isEmpty).toBeTruthy();
                done();
            });
        });

        it("previousApplianceUnsafeDetail model not undefined but properties are undefined, isEmpty true", done => {

            applianceStub = new Appliance();
            applianceStub.safety = <ApplianceSafety>{};
            applianceStub.safety.previousApplianceUnsafeDetail = <PreviousApplianceUnsafeDetail>{};
            applianceServiceStub.getAppliance = sandbox.stub().resolves(applianceStub);
            prevOtherSafety.activateAsync({ jobId: "1", applianceId: "1" }).then(() => {
                expect(prevOtherSafety.isEmpty).toBeTruthy();
                done();
            });
        });

        it("previousApplianceUnsafeDetail model not undefined has atleast one property has value, isEmpty false", done => {

            applianceStub = new Appliance();
            applianceStub.safety = <ApplianceSafety>{};
            applianceStub.safety.previousApplianceUnsafeDetail = <PreviousApplianceUnsafeDetail>{};
            applianceStub.safety.previousApplianceUnsafeDetail.report = "some report";
            applianceServiceStub.getAppliance = sandbox.stub().resolves(applianceStub);
            prevOtherSafety.activateAsync({ jobId: "1", applianceId: "1" }).then(() => {
                expect(prevOtherSafety.isEmpty).toBeFalsy();
                done();
            });
        });

        it("previousApplianceUnsafeDetail model not undefined has atleast one property has value, isEmpty false", done => {

            applianceStub = new Appliance();
            applianceStub.safety = <ApplianceSafety>{};
            applianceStub.safety.previousApplianceUnsafeDetail = <PreviousApplianceUnsafeDetail>{};
            applianceStub.safety.previousApplianceUnsafeDetail.actionCode = "actionCode";
            applianceStub.safety.previousApplianceUnsafeDetail.date = new Date();
            applianceStub.safety.previousApplianceUnsafeDetail.installationSafe = true;
            applianceStub.safety.previousApplianceUnsafeDetail.noticeStatus = "notice status";
            applianceStub.safety.previousApplianceUnsafeDetail.noticeType = "notice type";
            applianceStub.safety.previousApplianceUnsafeDetail.progress = "progress";
            applianceStub.safety.previousApplianceUnsafeDetail.report = "some report";
            applianceServiceStub.getAppliance = sandbox.stub().resolves(applianceStub);
            prevOtherSafety.activateAsync({ jobId: "1", applianceId: "1" }).then(() => {
                expect(prevOtherSafety.isEmpty).toBeFalsy();
                done();
            });
        });
    });

});
