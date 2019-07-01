/// <reference path="../../../../../../typings/app.d.ts" />

import {AppliancePageHelper} from "../../../../../../app/hema/presentation/modules/appliances/appliancePageHelper";
import { Appliance } from "../../../../../../app/hema/business/models/appliance";
import { IApplianceService } from "../../../../../../app/hema/business/services/interfaces/IApplianceService";
import { NamedRedirect } from "../../../../../../app/common/ui/namedRedirect";
import { ApplianceSafetyType } from "../../../../../../app/hema/business/models/applianceSafetyType";

describe("the AppliancePageHelper module", () => {
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("checkApplianceSafetyType", () => {

        let applianceServiceStub: IApplianceService;
        let appliance: Appliance;
        let params: any[];

        beforeEach(() => {
            appliance = <Appliance>{};
            applianceServiceStub = <IApplianceService>{};
            applianceServiceStub.getAppliance = sandbox.stub().resolves(appliance);

            params = [
                {jobId: "1", applianceId: "2"},
                {settings: {applianceSafetyType: ApplianceSafetyType.gas}}
            ];
        });

        it("can proceed with no params", done => {
            AppliancePageHelper.checkApplianceSafetyType(applianceServiceStub, undefined).then(result => {
                expect(result).toBe(true);
                done();
            });
        });

        it("can proceed with an expected applianceCategoryType", done => {
            appliance.applianceSafetyType = ApplianceSafetyType.gas;

            AppliancePageHelper.checkApplianceSafetyType(applianceServiceStub, params).then(result => {
                expect(result).toBe(true);
                done();
            });
        });

        it("can not proceed with an unexpected applianceCategoryType", done => {
            appliance.applianceSafetyType = ApplianceSafetyType.electrical;

            AppliancePageHelper.checkApplianceSafetyType(applianceServiceStub, params).then(result => {
                expect(result).toEqual(new NamedRedirect("appliance", {applianceId: "2"}, {useChildRouter: true, trigger: true}));
                done();
            });
        });

        it ("can proceed with a non-inst-prem appliance on a non-inst-prem page", done => {
            appliance.applianceSafetyType = ApplianceSafetyType.gas;
            appliance.isInstPremAppliance = false;
            params[1].settings.hideIfInstPrem = true;
            AppliancePageHelper.checkApplianceSafetyType(applianceServiceStub, params).then(result => {
                expect(result).toBe(true);
                done();
            });
        });

        it ("can proceed with an inst-prem appliance on a non-inst-prem-sensitive page", done => {
            appliance.applianceSafetyType = ApplianceSafetyType.gas;
            appliance.isInstPremAppliance = true;
            AppliancePageHelper.checkApplianceSafetyType(applianceServiceStub, params).then(result => {
                expect(result).toBe(true);
                done();
            });
        });

        it ("can not proceed with an inst-prem appliance", done => {
            appliance.applianceSafetyType = ApplianceSafetyType.gas;
            appliance.isInstPremAppliance = true;
            params[1].settings.hideIfInstPrem = true;
            AppliancePageHelper.checkApplianceSafetyType(applianceServiceStub, params).then(result => {
                expect(result).toEqual(new NamedRedirect("appliance", {applianceId: "2"}, {useChildRouter: true, trigger: true}));
                done();
            });
        });
    });
});
