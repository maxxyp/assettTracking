/// <reference path="../../../../../typings/app.d.ts" />

import {ApplianceSafetyFactory} from "../../../../../app/hema/business/factories/applianceSafetyFactory";
import {IBusinessRuleService} from "../../../../../app/hema/business/services/interfaces/IBusinessRuleService";
import {Appliance} from "../../../../../app/hema/business/models/appliance";
import { ApplianceSafety } from "../../../../../app/hema/business/models/applianceSafety";
import {ApplianceElectricalSafetyDetail} from "../../../../../app/hema/business/models/applianceElectricalSafetyDetail";
import {ApplianceElectricalUnsafeDetail} from "../../../../../app/hema/business/models/applianceElectricalUnsafeDetail";
import {YesNoNa} from "../../../../../app/hema/business/models/yesNoNa";
import {PropertyGasSafetyDetail} from "../../../../../app/hema/business/models/propertyGasSafetyDetail";
import {PropertyUnsafeDetail} from "../../../../../app/hema/business/models/propertyUnsafeDetail";
import {ApplianceSafetyType} from "../../../../../app/hema/business/models/applianceSafetyType";
import { ISafety } from "../../../../../app/hema/api/models/fft/jobs/history/ISafety";
import { IApplianceSafety } from "../../../../../app/hema/api/models/fft/jobs/jobUpdate/IApplianceSafety";

describe("the ApplianceSafetyFactory module", () => {
    let applianceSafetyFactory: ApplianceSafetyFactory;

    let businessRuleServiceStub: IBusinessRuleService;
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        businessRuleServiceStub = <IBusinessRuleService>{};

        let getBusinessRuleStub = sandbox.stub();
        getBusinessRuleStub.withArgs("WHITEGOODS").returns("WHITE GOODS");

        businessRuleServiceStub.getQueryableRuleGroup = sandbox.stub().resolves({
            getBusinessRule: getBusinessRuleStub
        });

        applianceSafetyFactory = new ApplianceSafetyFactory(businessRuleServiceStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("can be created", () => {
        expect(applianceSafetyFactory).toBeDefined();
    });

    describe("previous appliance unSafe detail model maps appliance safe", () => {
        let safety: ISafety;
        let applianceSafety: ApplianceSafety;

        beforeEach(() => {
            safety = <ISafety> {};
            applianceSafety = <ApplianceSafety> {};
        })

        it ("will map appliance safe to 'true' when api model is 'Y'", () => {
            safety.applianceSafe = "Y";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.applianceSafe).toEqual(true);
        });

        it ("will map applianceSafe 'false', when api model 'N'", () => {
            safety.applianceSafe = "N";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.applianceSafe).toEqual(false);
        });

        it ("will map applianceSafe undefined, when api model is 'x'", () => {
            safety.applianceSafe = "X";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.applianceSafe).toBeUndefined();
        });

        it ("will map applianceSafe undefined, when api model is 'N' or 'Y'", () => {
            safety.applianceSafe = "A";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.applianceSafe).toBeUndefined();
        });

    });

    describe("previous appliance unSafe detail model maps flueSafe", () => {
        let safety: ISafety;
        let applianceSafety: ApplianceSafety;

        beforeEach(() => {
            safety = <ISafety> {};
            applianceSafety = <ApplianceSafety> {};
        })

        it ("will map flueSafe to 'true' when api model is 'Y'", () => {
            safety.flueSafe = "Y";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.flueSafe).toEqual(true);
        });

        it ("will map flueSafe 'false', when api model 'N'", () => {
            safety.flueSafe = "N";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.flueSafe).toEqual(false);
        });

        it ("will map flueSafe undefined, when api model is 'x'", () => {
            safety.flueSafe = "X";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.flueSafe).toBeUndefined();
        });

        it ("will map flueSafe undefined, when api model is not 'N' or 'Y'", () => {
            safety.flueSafe = "A";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.flueSafe).toBeUndefined();
        });

    });

    describe("previous appliance unSafe detail model maps ventilationSafe", () => {
        let safety: ISafety;
        let applianceSafety: ApplianceSafety;

        beforeEach(() => {
            safety = <ISafety> {};
            applianceSafety = <ApplianceSafety> {};
        })

        it ("will map ventilationSafe to 'true' when api model is 'Y'", () => {
            safety.ventilationSafe = "Y";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.ventilationSafe).toEqual(true);
        });

        it ("will map ventilationSafe 'false', when api model 'N'", () => {
            safety.ventilationSafe = "N";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.ventilationSafe).toEqual(false);
        });

        it ("will map ventilationSafe undefined, when api model is 'x'", () => {
            safety.ventilationSafe = "X";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.ventilationSafe).toBeUndefined();
        });

        it ("will map ventilationSafe undefined, when api model is not 'N' or 'Y'", () => {
            safety.ventilationSafe = "A";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.ventilationSafe).toBeUndefined();
        });

    });

    describe("previous appliance unSafe detail model maps installationSafe", () => {
        let safety: ISafety;
        let applianceSafety: ApplianceSafety;

        beforeEach(() => {
            safety = <ISafety> {};
            applianceSafety = <ApplianceSafety> {};
        })

        it ("will map installationSafe to 'true' when api model is 'Y'", () => {
            safety.installationSafe = "Y";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.installationSafe).toEqual(true);
        });

        it ("will map installationSafe 'false', when api model 'N'", () => {
            safety.installationSafe = "N";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.installationSafe).toEqual(false);
        });

        it ("will map installationSafe undefined, when api model is 'x'", () => {
            safety.installationSafe = "X";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.installationSafe).toBeUndefined();
        });

        it ("will map installationSafe undefined, when api model is not 'N' or 'Y'", () => {
            safety.installationSafe = "A";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.installationSafe).toBeUndefined();
        });

    });

    describe("previous appliance unSafe detail model maps installationTightnessTestSafe", () => {
        let safety: ISafety;
        let applianceSafety: ApplianceSafety;

        beforeEach(() => {
            safety = <ISafety> {};
            applianceSafety = <ApplianceSafety> {};
        })

        it ("will map installationTightnessTestSafe to 'true' when api model is 'Y'", () => {
            safety.installationTightnessTestSafe = "Y";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.installationTightnessTestSafe).toEqual(true);
        });

        it ("will map installationTightnessTestSafe 'false', when api model 'N'", () => {
            safety.installationTightnessTestSafe = "N";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.installationTightnessTestSafe).toEqual(false);
        });

        it ("will map installationTightnessTestSafe undefined, when api model is 'x'", () => {
            safety.installationTightnessTestSafe = "X";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.installationTightnessTestSafe).toBeUndefined();
        });

        it ("will map installationTightnessTestSafe undefined, when api model is not 'N' or 'Y'", () => {
            safety.installationTightnessTestSafe = "A";

            let res = applianceSafetyFactory.populatePreviousApplianceSafety(safety, applianceSafety);
            expect(res.previousApplianceUnsafeDetail.installationTightnessTestSafe).toBeUndefined();
        });

    });

    describe("gas appliance safety api model only created when isApplianceSafe is valid value", () => {
        let appliance: Appliance;

        beforeEach(() => {
            appliance = <Appliance> {
                isSafetyRequired: true,
                applianceSafetyType: ApplianceSafetyType.gas,
                safety: <ApplianceSafety> {
                    applianceGasSafety: {},
                    applianceGasUnsafeDetail: {},
                    applianceGasReadingsMaster: {
                        supplementaryReadings: {}
                    }
                }
            };
        });

        afterEach(() => {

        });

        it("will not create safety info if isApplianceSafe is null", (done) => {
            appliance.safety.applianceGasSafety.isApplianceSafe = null;
            appliance.safety.applianceGasSafety.installationSafe = YesNoNa.Yes;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.installationSafe).toBe(undefined);
                    done();
                });
        });

        it("will not create safety info if isApplianceSafe is undefined", (done) => {
            appliance.safety.applianceGasSafety.isApplianceSafe = undefined;
            appliance.safety.applianceGasSafety.installationSafe = YesNoNa.Yes;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.installationSafe).toBe(undefined);
                    done();
                });
        });

        it("will create safety info if isApplianceSafe is true or false", (done) => {
            appliance.safety.applianceGasSafety.isApplianceSafe = true;
            appliance.safety.applianceGasSafety.installationSafe = YesNoNa.Yes;
            appliance.safety.applianceGasSafety.workedOnAppliance = false;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.installationSafe).toBe("Y");
                    done();
                });
        });
    });

    describe("gas appliance unsafe api model only created when report is valid value", () => {
        let appliance: Appliance;

        beforeEach(() => {
            appliance = <Appliance> {
                isSafetyRequired: true,
                applianceSafetyType: ApplianceSafetyType.gas,
                safety: <ApplianceSafety> {
                    applianceGasSafety: {},
                    applianceGasUnsafeDetail: {},
                    applianceGasReadingsMaster: {
                        supplementaryReadings: {}
                    }
                }
            };
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("will not create unsafe info if report is null", (done) => {
            appliance.safety.applianceGasUnsafeDetail.report = null;
            appliance.safety.applianceGasUnsafeDetail.conditionAsLeft = "SS";

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.noticeType).toBe(undefined);
                    done();
                });
        });

        it("will not create unsafe info if report is undefined", (done) => {
            appliance.safety.applianceGasUnsafeDetail.report = undefined;
            appliance.safety.applianceGasUnsafeDetail.conditionAsLeft = "SS";

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.noticeType).toBe(undefined);
                    done();
                });
        });

        it("will create unsafe info if report has value", (done) => {
            appliance.safety.applianceGasUnsafeDetail.report = "This is the report";
            appliance.safety.applianceGasUnsafeDetail.conditionAsLeft = "SS";

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.noticeType).toBe("SS");
                    done();
                });
        });
    });

    describe("electrical appliance - wiring - safety api model only created when installationSatisfactory is valid value", () => {
        let appliance: Appliance;

        beforeEach(() => {
            appliance = <Appliance> {
                isSafetyRequired: true,
                applianceSafetyType: ApplianceSafetyType.electrical,
                safety: <ApplianceSafety> {
                    applianceElectricalSafetyDetail: {
                        electricalApplianceType: "ELECTRICAL"
                    },
                    applianceElectricalUnsafeDetail: {}
                }
            };
        });

        afterEach(() => {

        });

        it("will not create safety info if installationSatisfactory is null", (done) => {
            appliance.safety.applianceElectricalSafetyDetail.installationSatisfactory = null;
            appliance.safety.applianceElectricalSafetyDetail.readingSafeAccordingToTops = true;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.eliSafeAccordingToTheTableInTops).toBe(undefined);
                    done();
                });
        });

        it("will not create safety info if installationSatisfactory is undefined", (done) => {
            appliance.safety.applianceElectricalSafetyDetail.installationSatisfactory = undefined;
            appliance.safety.applianceElectricalSafetyDetail.readingSafeAccordingToTops = true;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.eliSafeAccordingToTheTableInTops).toBe(undefined);
                    done();
                });
        });

        it("will create safety info if installationSatisfactory is true or false", (done) => {
            appliance.safety.applianceElectricalSafetyDetail.installationSatisfactory = true;
            appliance.safety.applianceElectricalSafetyDetail.readingSafeAccordingToTops = true;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.eliSafeAccordingToTheTableInTops).toBe(true);
                    done();
                });
        });

        it("will correctly map installationSatisfactory into safety info if value is true", (done) => {
            appliance.safety.applianceElectricalSafetyDetail.installationSatisfactory = true;
            appliance.safety.applianceElectricalSafetyDetail.readingSafeAccordingToTops = true;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.installationSafe).toBe("Y");
                    done();
                });
        });

        it("will correctly map installationSatisfactory into safety info if value is false", (done) => {
            appliance.safety.applianceElectricalSafetyDetail.installationSatisfactory = false;
            appliance.safety.applianceElectricalSafetyDetail.readingSafeAccordingToTops = true;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.installationSafe).toBe("N");
                    done();
                });
        });
    });

    describe("electrical appliance - white goods or microwave - safety api model only created when applianceInstallationSatisfactory is valid value", () => {
        let appliance: Appliance;

        beforeEach(() => {
            appliance = <Appliance> {
                isSafetyRequired: true,
                applianceSafetyType: ApplianceSafetyType.electrical,
                safety: <ApplianceSafety> {
                    applianceElectricalSafetyDetail: {
                        electricalApplianceType: "MICROWAVE"
                    },
                    applianceElectricalUnsafeDetail: {}
                }
            };
        });

        afterEach(() => {

        });

        it("will not create safety info if applianceInstallationSatisfactory is null", (done) => {
            appliance.safety.applianceElectricalSafetyDetail.applianceInstallationSatisfactory = null;
            appliance.safety.applianceElectricalSafetyDetail.readingSafeAccordingToTops = true;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.eliSafeAccordingToTheTableInTops).toBe(undefined);
                    done();
                });
        });

        it("will not create safety info if applianceInstallationSatisfactory is undefined", (done) => {
            appliance.safety.applianceElectricalSafetyDetail.applianceInstallationSatisfactory = undefined;
            appliance.safety.applianceElectricalSafetyDetail.readingSafeAccordingToTops = true;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.eliSafeAccordingToTheTableInTops).toBe(undefined);
                    done();
                });
        });

        it("will create safety info if applianceInstallationSatisfactory is true or false", (done) => {
            appliance.safety.applianceElectricalSafetyDetail.applianceInstallationSatisfactory = true;
            appliance.safety.applianceElectricalSafetyDetail.readingSafeAccordingToTops = true;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.eliSafeAccordingToTheTableInTops).toBe(true);
                    done();
                });
        });

        it("will correctly map applianceInstallationSatisfactory into safety info if value is true", (done) => {
            appliance.safety.applianceElectricalSafetyDetail.applianceInstallationSatisfactory = true;
            appliance.safety.applianceElectricalSafetyDetail.readingSafeAccordingToTops = true;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.installationSafe).toBe("Y");
                    done();
                });
        });

        it("will correctly map applianceInstallationSatisfactory into safety info if value is false", (done) => {
            appliance.safety.applianceElectricalSafetyDetail.applianceInstallationSatisfactory = false;
            appliance.safety.applianceElectricalSafetyDetail.readingSafeAccordingToTops = true;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.installationSafe).toBe("N");
                    done();
                });
        });
    });

    describe("electrical appliance unsafe api model only created when report is valid value", () => {
        let appliance: Appliance;

        beforeEach(() => {
            appliance = <Appliance> {
                isSafetyRequired: true,
                applianceSafetyType: ApplianceSafetyType.electrical,
                safety: <ApplianceSafety> {
                    applianceElectricalSafetyDetail: {},
                    applianceElectricalUnsafeDetail: {}
                }
            };
        });

        afterEach(() => {

        });

        it("will not create unsafe info if report is null", (done) => {
            appliance.safety.applianceElectricalUnsafeDetail.report = null;
            appliance.safety.applianceElectricalUnsafeDetail.conditionAsLeft = "SS";

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.noticeType).toBe(undefined);
                    done();
                });
        });

        it("will not create unsafe info if report is undefined", (done) => {
            appliance.safety.applianceElectricalUnsafeDetail.report = undefined;
            appliance.safety.applianceElectricalUnsafeDetail.conditionAsLeft = "SS";

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.noticeType).toBe(undefined);
                    done();
                });
        });

        it("will create unsafe info if report is valid value", (done) => {
            appliance.safety.applianceElectricalUnsafeDetail.report = "This is the report";
            appliance.safety.applianceElectricalUnsafeDetail.conditionAsLeft = "SS";

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.noticeType).toBe("SS");
                    done();
                });
        });
    });

    describe("other appliance safety api model only created when isApplianceSafe is valid value", () => {
        let appliance: Appliance;

        beforeEach(() => {
            appliance = <Appliance> {
                isSafetyRequired: true,
                applianceSafetyType: ApplianceSafetyType.other,
                safety: <ApplianceSafety> {
                    applianceOtherSafety: {},
                    applianceOtherUnsafeDetail: {}
                }
            };
        });

        afterEach(() => {

        });

        it("will not safety info if isApplianceSafe is null", (done) => {
            appliance.safety.applianceOtherSafety.isApplianceSafe = null;
            appliance.safety.applianceOtherSafety.visuallyCheckRelight = true;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.visuallyCheckRelight).toBe(undefined);
                    done();
                });
        });

        it("will not safety info if isApplianceSafe is undefined", (done) => {
            appliance.safety.applianceOtherSafety.isApplianceSafe = undefined;
            appliance.safety.applianceOtherSafety.visuallyCheckRelight = true;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.visuallyCheckRelight).toBe(undefined);
                    done();
                });
        });

        it("will create safety info if isApplianceSafe is true or false", (done) => {
            appliance.safety.applianceOtherSafety.isApplianceSafe = true;
            appliance.safety.applianceOtherSafety.visuallyCheckRelight = true;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.visuallyCheckRelight).toBe("Y");
                    done();
                });
        });
    });

    describe("other appliance unsafe api model only created when report is valid value", () => {
        let appliance: Appliance;

        beforeEach(() => {
            appliance = <Appliance> {
                isSafetyRequired: true,
                applianceSafetyType: ApplianceSafetyType.other,
                safety: <ApplianceSafety> {
                    applianceOtherSafety: {},
                    applianceOtherUnsafeDetail: {}
                }
            };
        });

        afterEach(() => {

        });

        it("will not create unsafe info if report is null", (done) => {
            appliance.safety.applianceOtherUnsafeDetail.report = null;
            appliance.safety.applianceOtherUnsafeDetail.conditionAsLeft = "SS";

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.noticeType).toBe(undefined);
                    done();
                });
        });

        it("will not create unsafe info if report is undefined", (done) => {
            appliance.safety.applianceOtherUnsafeDetail.report = undefined;
            appliance.safety.applianceOtherUnsafeDetail.conditionAsLeft = "SS";

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.noticeType).toBe(undefined);
                    done();
                });
        });

        it("will create unsafe info if report has value", (done) => {
            appliance.safety.applianceOtherUnsafeDetail.report = "This is the report";
            appliance.safety.applianceOtherUnsafeDetail.conditionAsLeft = "SS";

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.noticeType).toBe("SS");
                    done();
                });
        });
    });

    describe("ring continuity reading on electrical appliance", () => {

        let appliance: Appliance;
        beforeEach(() => {

            appliance = <Appliance> {
                isSafetyRequired: true,
                applianceSafetyType: ApplianceSafetyType.electrical,
                safety: <ApplianceSafety> {
                    applianceElectricalSafetyDetail: <ApplianceElectricalSafetyDetail> {
                        applianceInstallationSatisfactory: true,
                        ringContinuityReadingDone: "NOT INITIALISED"
                    },
                    applianceElectricalUnsafeDetail: <ApplianceElectricalUnsafeDetail> {

                    }
                }
            };
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("can handle a pass reading", (done) => {

            appliance.safety.applianceElectricalSafetyDetail.ringContinuityReadingDone = "P";

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance)
                .then(applianceSafetyApiModel => {
                    expect(applianceSafetyApiModel).toBeDefined();
                    expect(applianceSafetyApiModel.ringContinuityReadingDone).toEqual("P");
                    done();
                });
        });

        it("can handle a fail reading", (done) => {

            appliance.safety.applianceElectricalSafetyDetail.ringContinuityReadingDone = "F";

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance)
                .then(applianceSafetyApiModel => {
                    expect(applianceSafetyApiModel).toBeDefined();
                    expect(applianceSafetyApiModel.ringContinuityReadingDone).toEqual("F");
                    done();
                });
        });

        it("can handle a n/a reading", (done) => {

            appliance.safety.applianceElectricalSafetyDetail.ringContinuityReadingDone = "X";

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance)
                .then(applianceSafetyApiModel => {
                    expect(applianceSafetyApiModel).toBeDefined();
                    expect(applianceSafetyApiModel.ringContinuityReadingDone).toEqual("X");
                    done();
                });
        });

    });

    describe("gas appliances", () => {
        let appliance: Appliance;

        beforeEach(() => {

            appliance = <Appliance> {
                isSafetyRequired: true,
                applianceSafetyType: ApplianceSafetyType.gas,
                safety: <ApplianceSafety> {
                    applianceGasSafety: {
                        isApplianceSafe: true,
                        workedOnAppliance: true
                    },
                    applianceGasUnsafeDetail: {},
                    applianceGasReadingsMaster: {
                        supplementaryReadings: {}
                    }
                }
            };
        });

        it("can not set supplementaryBurnerFitted if secondary readings have not been taken", done => {
            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
            .then((apiModel) => {
                expect(apiModel.supplementaryBurnerFitted).toBe(false);
                done();
            });
        });

        it("can set supplementaryBurnerFitted if secondary readings burnerPressure has been taken", done => {
            appliance.safety.applianceGasReadingsMaster.supplementaryReadings.burnerPressure = 0;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
            .then((apiModel) => {
                expect(apiModel.supplementaryBurnerFitted).toBe(true);
                done();
            });
        });

        it("can set supplementaryBurnerFitted if secondary readings gasRateReading has been taken", done => {
            appliance.safety.applianceGasReadingsMaster.supplementaryReadings.gasRateReading = 0;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
            .then((apiModel) => {
                expect(apiModel.supplementaryBurnerFitted).toBe(true);
                done();
            });
        });

        it("can set supplementaryBurnerFitted if secondary readings isLpg has been recorded", done => {
            appliance.safety.applianceGasReadingsMaster.supplementaryReadings.isLpg = false;

            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
            .then((apiModel) => {
                expect(apiModel.supplementaryBurnerFitted).toBe(true);
                done();
            });
        });

        it("can map installationTightnessTestSafe when Yes", done => {
            appliance.safety.applianceGasSafety.installationTightnessTestSafe = YesNoNa.Yes;
            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
            .then((apiModel) => {
                expect(apiModel.applianceTightnessTestSafe).toBe("Y");
                done();
            });
        });

        it("can map installationTightnessTestSafe when No", done => {
            appliance.safety.applianceGasSafety.installationTightnessTestSafe = YesNoNa.No;
            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
            .then((apiModel) => {
                expect(apiModel.applianceTightnessTestSafe).toBe("N");
                done();
            });
        });

        it("can map installationTightnessTestSafe when Na", done => {
            appliance.safety.applianceGasSafety.installationTightnessTestSafe = YesNoNa.Na;
            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
            .then((apiModel) => {
                expect(apiModel.applianceTightnessTestSafe).toBe("X");
                done();
            });
        });

        it("can map applianceSafe when true", done => {
            appliance.safety.applianceGasSafety.isApplianceSafe = true;
            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
            .then((apiModel) => {
                expect(apiModel.applianceSafe).toBe("Y");
                done();
            });
        });

        it("can map applianceSafe when false", done => {
            appliance.safety.applianceGasSafety.isApplianceSafe = false;
            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
            .then((apiModel) => {
                expect(apiModel.applianceSafe).toBe("N");
                done();
            });
        });

        it("can map applianceSafe when not completed", done => {
            appliance.safety.applianceGasSafety.isApplianceSafe = undefined;
            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
            .then((apiModel) => {
                expect(apiModel.applianceSafe).toBe(undefined);
                done();
            });
        });

        it("can map safeDeviceandCorrectOperation when Yes", done => {
            appliance.safety.applianceGasSafety.safetyDevice = YesNoNa.Yes;
            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.safeDeviceandCorrectOperation).toBe("Y");
                    done();
                });
        });

        it("can map safeDeviceandCorrectOperation when No", done => {
            appliance.safety.applianceGasSafety.safetyDevice = YesNoNa.No;
            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.safeDeviceandCorrectOperation).toBe("N");
                    done();
                });
        });

        it("can map safeDeviceandCorrectOperation when Na", done => {
            appliance.safety.applianceGasSafety.safetyDevice = YesNoNa.Na;
            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.safeDeviceandCorrectOperation).toBe("X");
                    done();
                });
        });

        it("can map applianceToCurrentStandards when Yes", done => {
            appliance.safety.applianceGasSafety.toCurrentStandards = YesNoNa.Yes;
            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.applianceToCurrentStandards).toBe("Y");
                    done();
                });
        });

        it("can map applianceToCurrentStandards when No", done => {
            appliance.safety.applianceGasSafety.toCurrentStandards = YesNoNa.No;
            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.applianceToCurrentStandards).toBe("N");
                    done();
                });
        });

        it("can map applianceToCurrentStandards when Na", done => {
            appliance.safety.applianceGasSafety.toCurrentStandards = YesNoNa.Na;
            applianceSafetyFactory.createApplianceSafetyApiModel(appliance, null)
                .then((apiModel) => {
                    expect(apiModel.applianceToCurrentStandards).toBe("X");
                    done();
                });
        });

    });

    describe("can handle electrical appliance conversion for api", () => {
        let electricalAppliance: Appliance;

        beforeEach(() => {
            electricalAppliance = <Appliance> {
                isSafetyRequired: true,
                applianceSafetyType: ApplianceSafetyType.electrical,
                safety: <ApplianceSafety> {
                    applianceElectricalSafetyDetail : {
                        applianceInstallationSatisfactory: true,
                        installationSatisfactory: true
                    },
                    applianceElectricalUnsafeDetail : {}
                }
            };
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("will pass through electrical appliance type", (done) => {
            electricalAppliance.safety.applianceElectricalSafetyDetail.electricalApplianceType = "ELECTRICAL";
            applianceSafetyFactory.createApplianceSafetyApiModel(electricalAppliance)
                .then((apiModel) => {
                    expect(apiModel.jobType).toBe("ELECTRICAL");
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

         it("will convert through white goods appliance type", (done) => {
             electricalAppliance.safety.applianceElectricalSafetyDetail.electricalApplianceType = "WHITEGOODS";
            applianceSafetyFactory.createApplianceSafetyApiModel(electricalAppliance)
                .then((apiModel) => {
                    expect(apiModel.jobType).toBe("WHITE GOODS");
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });

        it("will pass through microwave appliance type", (done) => {
            electricalAppliance.safety.applianceElectricalSafetyDetail.electricalApplianceType = "MICROWAVE";
            applianceSafetyFactory.createApplianceSafetyApiModel(electricalAppliance)
                .then((apiModel) => {
                    expect(apiModel.jobType).toBe("MICROWAVE");
                    done();
                })
                .catch(error => {
                    fail("should not be here: " + error);
                });
        });
    });

    describe("can convert inst prem appliances", () => {
        let applianceObjectStub: Appliance;
        let propertySafety: PropertyGasSafetyDetail;
        let propertyUnsafe: PropertyUnsafeDetail;

        beforeEach(() => {

            applianceObjectStub = <Appliance> {
                isSafetyRequired: true,
                isInstPremAppliance: true,
                applianceSafetyType: ApplianceSafetyType.gas,
                applianceType: "INS",
                safety: <ApplianceSafety> {
                    applianceGasSafety: {},
                    applianceGasUnsafeDetail: {},
                    applianceGasReadingsMaster: {
                        supplementaryReadings: {}
                    }
                }
            };
        });

        it("will map PropertyGasSafetyDetail for inst prem appliance", async done => {

            let apiModel: IApplianceSafety;
            propertySafety = <PropertyGasSafetyDetail>{};
            propertyUnsafe = <PropertyUnsafeDetail>{};

            let run = async () => apiModel = await applianceSafetyFactory.createApplianceSafetyApiModel(applianceObjectStub, propertySafety, propertyUnsafe);

            await run();
            expect(apiModel.gasMeterInstallationSafe).toBeUndefined();

            propertySafety.gasMeterInstallationSatisfactory = "foo";
            await run();
            expect(apiModel.gasMeterInstallationSafe).toBe("foo");

            propertySafety.gasInstallationTightnessTestDone = undefined;
            await run();
            expect(apiModel.applianceTightnessTestSafe).toBeUndefined();

            propertySafety.gasInstallationTightnessTestDone = true;
            await run();
            expect(apiModel.applianceTightnessTestSafe).toBeUndefined();

            propertySafety.gasInstallationTightnessTestDone = false;
            await run();
            expect(apiModel.applianceTightnessTestSafe).toBeUndefined();

            propertySafety.gasMeterInstallationSatisfactory = "Y";
            await run();
            expect(apiModel.applianceSafe).toBe("Y");
            expect(apiModel.applianceToCurrentStandards).toBe("Y");

            propertySafety.gasMeterInstallationSatisfactory = "N/A";
            await run();
            expect(apiModel.applianceSafe).toBe("Y");
            expect(apiModel.applianceToCurrentStandards).toBe("Y");

            propertySafety.gasMeterInstallationSatisfactory = "N";
            propertyUnsafe.conditionAsLeft = "SS";
            await run();
            expect(apiModel.applianceSafe).toBe("Y");
            expect(apiModel.applianceToCurrentStandards).toBe("N");

            propertySafety.gasMeterInstallationSatisfactory = "N";
            propertyUnsafe.conditionAsLeft = "ID";
            await run();
            expect(apiModel.applianceSafe).toBe("N");
            expect(apiModel.applianceToCurrentStandards).toBe("X");

            done();
        });
    });
});
