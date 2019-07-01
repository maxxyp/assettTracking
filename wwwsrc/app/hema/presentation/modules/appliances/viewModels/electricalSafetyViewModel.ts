type AvailableConditionsAsLeft = "AR" | "ID" | "SS" | "XC";
type AvailableLabelAttachedRemoved = "A" | "R" | "N" | "X";

type ApplianceType = "applianceTypeElectrical" | "applianceTypeWhiteGoods" | "applianceTypeMicrowave";

export class ElectricalSafetyViewModel {
    public electricalApplianceType: string;
    public mainEarthChecked: string;
    public mainEarthCheckedVisible: boolean;
    public gasBondingChecked: string;
    public gasBondingCheckedVisible: boolean;
    public waterBondingChecked: string;
    public waterBondingCheckedVisible: boolean;
    public otherBondingChecked: string;
    public otherBondingCheckedVisible: boolean;
    public supplementaryBondingOrFullRcdProtectionChecked: string;
    public supplementaryBondingOrFullRcdProtectionCheckedVisible: boolean;
    public ringContinuityReadingDone: string;
    public ringContinuityReadingDoneVisible: boolean;
    public leInsulationResistance: number;
    public leInsulationResistanceVisible: boolean;
    public leInsulationResistanceReasonWhyNot: string;
    public leInsulationResistanceReasonWhyNotVisible: boolean;
    public showLeInsulationResistanceReasonWhyNot: boolean;
    public showLeInsulationResistanceReasonWhyNotVisible: boolean;
    public neInsulationResistance: number;
    public neInsulationResistanceVisible: boolean;
    public neInsulationResistanceReasonWhyNot: string;
    public neInsulationResistanceReasonWhyNotVisible: boolean;
    public showNeInsulationResistanceReasonWhyNot: boolean;
    public showNeInsulationResistanceReasonWhyNotVisible: boolean;
    public lnInsulationResistance: number;
    public lnInsulationResistanceVisible: boolean;
    public lnInsulationResistanceReasonWhyNot: string;
    public lnInsulationResistanceReasonWhyNotVisible: boolean;
    public showLnInsulationResistanceReasonWhyNot: boolean;
    public showLnInsulationResistanceReasonWhyNotVisible: boolean;
    public systemType: string;
    public systemTypeVisible: boolean;
    public finalEliReadingDone: boolean;
    public finalEliReadingDoneVisible: boolean;
    public finalEliReading: number;
    public finalEliReadingVisible: boolean;
    public readingSafeAccordingToTops: boolean;
    public readingSafeAccordingToTopsVisible: boolean;
    public isRcdPresent: boolean;
    public isRcdPresentVisible: boolean;
    public circuitRcdRcboProtected: string;
    public circuitRcdRcboProtectedVisible: boolean;
    public rcdTripTimeReading: number;
    public rcdTripTimeReadingVisible: boolean;
    public rcdTripTimeReadingMessageVisible: boolean;
    public rcboTripTimeReading: number;
    public rcboTripTimeReadingVisible: boolean;
    public applianceEarthContinuityReadingDone: boolean;
    public applianceEarthContinuityReadingDoneVisible: boolean;
    public applianceEarthContinuityReading: number;
    public applianceEarthContinuityReadingVisible: boolean;
    public applianceEarthContinuityReadingMessageVisible: boolean;
    public isApplianceHardWired: boolean;
    public isApplianceHardWiredVisible: boolean;
    public mcbFuseRating: string;
    public mcbFuseRatingVisible: boolean;
    public mcbFuseRatingReasonWhyNot: string;
    public showMcbFuseRatingReasonWhyNotVisible: boolean;
    public showMcbFuseRatingReasonWhyNot: boolean;
    public mcbFuseRatingReasonWhyNotVisible: boolean;
    public applianceFuseRating: string;
    public applianceFuseRatingVisible: boolean;
    public applianceFuseRatingReasonWhyNot: string;
    public applianceFuseRatingReasonWhyNotVisible: boolean;
    public showApplianceFuseRatingReasonWhyNot: boolean;
    public showApplianceFuseRatingReasonWhyNotVisible: boolean;
    public isPartP: boolean;
    public isPartPVisible: boolean;
    public partPReason: string;
    public partPReasonVisible: boolean;
    public workedOnLightingCircuit: boolean;
    public workedOnLightingCircuitVisible: boolean;
    public cpcInLightingCircuitOk: boolean;
    public cpcInLightingCircuitOkVisible: boolean;
    public installationSatisfactory: boolean;
    public installationSatisfactoryVisible: boolean;
    public microwaveLeakageReading: number;
    public microwaveLeakageReadingVisible: boolean;
    public microwaveLeakageReadingMessageVisible: boolean;
    public microwaveLeakageReadingReasonWhyNot: string;
    public microwaveLeakageReadingReasonWhyNotVisible: boolean;
    public showMicrowaveLeakageReadingReasonWhyNot: boolean;
    public showMicrowaveLeakageReadingReasonWhyNotVisible: boolean;
    public applianceSafe: boolean;
    public applianceSafeVisible: boolean;
    public applianceInstallationSatisfactory: boolean;
    public applianceInstallationSatisfactoryVisible: boolean;
    public report: string;
    public reportFieldsVisible: boolean;
    public reportFieldsMandatory: boolean;
    public conditionAsLeft: string;
    public cappedTurnedOff: string;
    public labelAttachedRemoved: string;
    public ownedByCustomer: boolean;
    public letterLeft: boolean;
    public signatureObtained: boolean;
    public ownerNameAddressPhone: string;

    public unsafeReasons: { field: string, mandatory: boolean } [];
    public availableConditionAsLefts: AvailableConditionsAsLeft[];
    public availableLabelAttachedRemovedLookups: AvailableLabelAttachedRemoved[];

    private _businessRules: { [key: string]: any };

    constructor(businessRules: { [key: string]: any }) {
        this.unsafeReasons = [];
        this.availableConditionAsLefts = [];
        this.availableLabelAttachedRemovedLookups = [];
        this._businessRules = businessRules;
    }

    public getPropertiesToBind(): (keyof this)[] {
        return ["electricalApplianceType", "mainEarthChecked", "gasBondingChecked", "waterBondingChecked",
            "otherBondingChecked", "supplementaryBondingOrFullRcdProtectionChecked", "ringContinuityReadingDone", "leInsulationResistance",
            "showLeInsulationResistanceReasonWhyNot", "leInsulationResistanceReasonWhyNot", "neInsulationResistance",
            "showNeInsulationResistanceReasonWhyNot", "neInsulationResistanceReasonWhyNot", "lnInsulationResistance",
            "showLnInsulationResistanceReasonWhyNot", "lnInsulationResistanceReasonWhyNot", "systemType", "finalEliReadingDone", "finalEliReading",
            "readingSafeAccordingToTops", "isRcdPresent", "circuitRcdRcboProtected", "rcdTripTimeReading",
            "rcboTripTimeReading", "applianceEarthContinuityReadingDone", "applianceEarthContinuityReading", "isApplianceHardWired",
            "mcbFuseRating", "showMcbFuseRatingReasonWhyNot", "mcbFuseRatingReasonWhyNot", "applianceFuseRating",
            "showApplianceFuseRatingReasonWhyNot", "applianceFuseRatingReasonWhyNot", "isPartP", "partPReason", "workedOnLightingCircuit",
            "cpcInLightingCircuitOk", "installationSatisfactory", "microwaveLeakageReading", "showMicrowaveLeakageReadingReasonWhyNot",
            "microwaveLeakageReadingReasonWhyNot", "applianceSafe", "applianceInstallationSatisfactory", "report", "conditionAsLeft",
            "cappedTurnedOff", "labelAttachedRemoved", "ownedByCustomer", "letterLeft", "signatureObtained", "ownerNameAddressPhone"];
    }

    public recalculateflowState(propertyKey?: keyof this): void {
        this.setGeneralFieldVisibilites();
        this.resetGeneralFields(propertyKey);

        this.buildUnsafeConditions();
        this.reportFieldsVisible = this.unsafeReasons.length > 0;
        this.reportFieldsMandatory = this.unsafeReasons.some(r => r.mandatory) || this.isAnyReportFieldComplete();

        this.resetReportFields();
    }

    private isAnyReportFieldComplete(): boolean {
        return !!this.report
                || this.conditionAsLeft !== undefined
                || this.cappedTurnedOff !== undefined
                || this.labelAttachedRemoved !== undefined
                || this.ownedByCustomer !== undefined
                || this.letterLeft !== undefined
                || this.signatureObtained !== undefined;
    }

    private setGeneralFieldVisibilites(): void {
        this.mainEarthCheckedVisible = this.isApplianceType("applianceTypeElectrical");
        this.gasBondingCheckedVisible = this.isApplianceType("applianceTypeElectrical");
        this.waterBondingCheckedVisible = this.isApplianceType("applianceTypeElectrical");
        this.otherBondingCheckedVisible = this.isApplianceType("applianceTypeElectrical");
        this.supplementaryBondingOrFullRcdProtectionCheckedVisible = this.isApplianceType("applianceTypeElectrical");
        this.ringContinuityReadingDoneVisible = this.isApplianceType("applianceTypeElectrical");

        this.leInsulationResistanceVisible = !!this.electricalApplianceType;
        this.showLeInsulationResistanceReasonWhyNotVisible = !!this.electricalApplianceType;
        this.leInsulationResistanceReasonWhyNotVisible = this.showLeInsulationResistanceReasonWhyNot;

        this.neInsulationResistanceVisible = this.isApplianceType("applianceTypeElectrical", "applianceTypeWhiteGoods");
        this.showNeInsulationResistanceReasonWhyNotVisible = this.isApplianceType("applianceTypeElectrical", "applianceTypeWhiteGoods");
        this.neInsulationResistanceReasonWhyNotVisible = this.showNeInsulationResistanceReasonWhyNot;

        this.lnInsulationResistanceVisible = this.isApplianceType("applianceTypeElectrical");
        this.showLnInsulationResistanceReasonWhyNotVisible = this.isApplianceType("applianceTypeElectrical");
        this.lnInsulationResistanceReasonWhyNotVisible = this.showLnInsulationResistanceReasonWhyNot;

        this.systemTypeVisible = this.isApplianceType("applianceTypeElectrical");

        this.finalEliReadingDoneVisible = !!this.electricalApplianceType;
        this.finalEliReadingVisible = !!this.electricalApplianceType && this.finalEliReadingDone;

        this.readingSafeAccordingToTopsVisible = this.isApplianceType("applianceTypeElectrical")
            && this.systemType !== this.getBusinessRule<string>("systemTypeTt")
            && this.finalEliReading > this.getBusinessRule<number>("finalEliReadingMinThreshold");

        this.isRcdPresentVisible = this.isApplianceType("applianceTypeElectrical")
            && this.systemType === this.getBusinessRule<string>("systemTypeTt")
            && this.finalEliReadingDone === true;

        this.circuitRcdRcboProtectedVisible = this.isApplianceType("applianceTypeElectrical")
            || (this.isApplianceType("applianceTypeWhiteGoods", "applianceTypeMicrowave")
                && this.finalEliReading > this.getBusinessRule<number>("finalEliReadingMinThreshold"));

        this.rcdTripTimeReadingVisible = this.circuitRcdRcboProtected === this.getBusinessRule<string>("circuitRcdProtected");

        this.rcdTripTimeReadingMessageVisible = this.rcdTripTimeReading > this.getBusinessRule<number>("rcdTripTimeReadingSecondThreshold");

        this.rcboTripTimeReadingVisible = this.circuitRcdRcboProtected === this.getBusinessRule<string>("circuitRcboProtected");

        this.applianceEarthContinuityReadingDoneVisible = this.isApplianceType("applianceTypeWhiteGoods", "applianceTypeMicrowave")
            && this.finalEliReadingDone === false;
        this.applianceEarthContinuityReadingVisible = this.isApplianceType("applianceTypeWhiteGoods", "applianceTypeMicrowave")
            && this.applianceEarthContinuityReadingDone === true;
        this.isApplianceHardWiredVisible = this.isApplianceType("applianceTypeWhiteGoods", "applianceTypeMicrowave");

        this.mcbFuseRatingVisible = this.isApplianceHardWired || this.isApplianceType("applianceTypeElectrical");
        this.showMcbFuseRatingReasonWhyNotVisible = this.isApplianceHardWired || this.isApplianceType("applianceTypeElectrical");
        this.mcbFuseRatingReasonWhyNotVisible = this.isApplianceHardWired && this.showMcbFuseRatingReasonWhyNot;

        this.applianceFuseRatingVisible = this.isApplianceHardWired === false;
        this.showApplianceFuseRatingReasonWhyNotVisible = this.isApplianceHardWired === false;
        this.applianceFuseRatingReasonWhyNotVisible = this.isApplianceHardWired === false && this.showApplianceFuseRatingReasonWhyNot;

        this.isPartPVisible = this.isApplianceType("applianceTypeElectrical");
        this.partPReasonVisible = this.isPartP;
        this.workedOnLightingCircuitVisible = this.isApplianceType("applianceTypeElectrical");
        this.cpcInLightingCircuitOkVisible = this.workedOnLightingCircuit;

        this.installationSatisfactoryVisible = this.isApplianceType("applianceTypeElectrical");

        this.microwaveLeakageReadingVisible = this.isApplianceType("applianceTypeMicrowave");
        this.showMicrowaveLeakageReadingReasonWhyNotVisible = this.isApplianceType("applianceTypeMicrowave");
        this.microwaveLeakageReadingReasonWhyNotVisible = this.showMicrowaveLeakageReadingReasonWhyNot;
        this.microwaveLeakageReadingMessageVisible = !!this.microwaveLeakageReading;

        this.applianceSafeVisible = this.isApplianceType("applianceTypeWhiteGoods", "applianceTypeMicrowave");
        this.applianceInstallationSatisfactoryVisible = this.isApplianceType("applianceTypeWhiteGoods", "applianceTypeMicrowave");

        this.applianceEarthContinuityReadingMessageVisible = this.applianceEarthContinuityReading > this.getBusinessRule<number>("applianceEarthContinuityReadingMessageThreshold");
    }

    private resetGeneralFields(propertyKey?: keyof this): void {
        // first clear any field that is not visible...
        if (!this.mainEarthCheckedVisible) { this.mainEarthChecked = undefined; }
        if (!this.gasBondingCheckedVisible) { this.gasBondingChecked = undefined; }
        if (!this.waterBondingCheckedVisible) { this.waterBondingChecked = undefined; }
        if (!this.otherBondingCheckedVisible) { this.otherBondingChecked = undefined; }
        if (!this.supplementaryBondingOrFullRcdProtectionCheckedVisible) { this.supplementaryBondingOrFullRcdProtectionChecked = undefined; }
        if (!this.ringContinuityReadingDoneVisible) { this.ringContinuityReadingDone = undefined; }
        if (!this.leInsulationResistanceVisible) { this.leInsulationResistance = undefined; }
        if (!this.showLeInsulationResistanceReasonWhyNotVisible) { this.showLeInsulationResistanceReasonWhyNot = undefined; }
        if (!this.leInsulationResistanceReasonWhyNotVisible) { this.leInsulationResistanceReasonWhyNot = undefined; }
        if (!this.neInsulationResistanceVisible) { this.neInsulationResistance = undefined; }
        if (!this.showNeInsulationResistanceReasonWhyNotVisible) { this.showNeInsulationResistanceReasonWhyNot = undefined; }
        if (!this.neInsulationResistanceReasonWhyNotVisible) { this.neInsulationResistanceReasonWhyNot = undefined; }
        if (!this.lnInsulationResistanceVisible) { this.lnInsulationResistance = undefined; }
        if (!this.showLnInsulationResistanceReasonWhyNotVisible) { this.showLnInsulationResistanceReasonWhyNot = undefined; }
        if (!this.lnInsulationResistanceReasonWhyNotVisible) { this.lnInsulationResistanceReasonWhyNot = undefined; }
        if (!this.finalEliReadingDoneVisible) { this.finalEliReadingDone = undefined; }
        if (!this.finalEliReadingVisible) { this.finalEliReading = undefined; }
        if (!this.readingSafeAccordingToTopsVisible) { this.readingSafeAccordingToTops = undefined; }
        if (!this.isRcdPresentVisible) { this.isRcdPresent = undefined; }
        if (!this.circuitRcdRcboProtectedVisible) { this.circuitRcdRcboProtected = undefined; }
        if (!this.rcdTripTimeReadingVisible) { this.rcdTripTimeReading = undefined; }
        if (!this.rcboTripTimeReadingVisible) { this.rcboTripTimeReading = undefined; }
        if (!this.applianceEarthContinuityReadingDoneVisible) { this.applianceEarthContinuityReadingDone = undefined; }
        if (!this.applianceEarthContinuityReadingVisible) { this.applianceEarthContinuityReading = undefined; }
        if (!this.isApplianceHardWiredVisible) { this.isApplianceHardWired = undefined; }
        if (!this.mcbFuseRatingVisible) { this.mcbFuseRating = undefined; }
        if (!this.showMcbFuseRatingReasonWhyNotVisible) { this.showMcbFuseRatingReasonWhyNot = undefined; }
        if (!this.mcbFuseRatingReasonWhyNotVisible) { this.mcbFuseRatingReasonWhyNot = undefined; }
        if (!this.applianceFuseRatingVisible) { this.applianceFuseRating = undefined; }
        if (!this.showApplianceFuseRatingReasonWhyNotVisible) { this.showApplianceFuseRatingReasonWhyNot = undefined; }
        if (!this.applianceFuseRatingReasonWhyNotVisible) { this.applianceFuseRatingReasonWhyNot = undefined; }
        if (!this.isPartPVisible) { this.isPartP = undefined; }
        if (!this.partPReasonVisible) { this.partPReason = undefined; }
        if (!this.workedOnLightingCircuitVisible) { this.workedOnLightingCircuit = undefined; }
        if (!this.cpcInLightingCircuitOkVisible) { this.cpcInLightingCircuitOk = undefined; }
        if (!this.installationSatisfactoryVisible) { this.installationSatisfactory = undefined; }
        if (!this.microwaveLeakageReadingVisible) { this.microwaveLeakageReading = undefined; }
        if (!this.showMicrowaveLeakageReadingReasonWhyNotVisible) { this.showMicrowaveLeakageReadingReasonWhyNot = undefined; }
        if (!this.microwaveLeakageReadingReasonWhyNotVisible) { this.microwaveLeakageReadingReasonWhyNot = undefined; }
        if (!this.applianceSafeVisible) { this.applianceSafe = undefined; }
        if (!this.applianceInstallationSatisfactoryVisible) { this.applianceInstallationSatisfactory = undefined; }

        // ... then run any other rules
        // pair
        if (propertyKey !== "leInsulationResistance" && this.showLeInsulationResistanceReasonWhyNot) { this.leInsulationResistance = undefined; }
        if (propertyKey !== "showLeInsulationResistanceReasonWhyNot" && this.leInsulationResistance !== undefined) { this.showLeInsulationResistanceReasonWhyNot = undefined; }
        // pair
        if (propertyKey !== "neInsulationResistance" && this.showNeInsulationResistanceReasonWhyNot) { this.neInsulationResistance = undefined; }
        if (propertyKey !== "showNeInsulationResistanceReasonWhyNot" && this.neInsulationResistance !== undefined) { this.showNeInsulationResistanceReasonWhyNot = undefined; }
        // pair
        if (propertyKey !== "lnInsulationResistance" && this.showLnInsulationResistanceReasonWhyNot) { this.lnInsulationResistance = undefined; }
        if (propertyKey !== "showLnInsulationResistanceReasonWhyNot" && this.lnInsulationResistance !== undefined) { this.showLnInsulationResistanceReasonWhyNot = undefined; }

        if (this.finalEliReadingDone === false) { this.finalEliReading = undefined; }
        if (this.finalEliReadingDone === false) { this.readingSafeAccordingToTops = undefined; }
        if (this.finalEliReadingDone === false) { this.isRcdPresent = undefined; }
        if (this.finalEliReadingDone === false && this.isApplianceType("applianceTypeWhiteGoods", "applianceTypeMicrowave")) { this.circuitRcdRcboProtected = undefined; }
        if (this.circuitRcdRcboProtected !== this.getBusinessRule<string>("circuitRcdProtected")) { this.rcdTripTimeReading = undefined; }
        if (this.circuitRcdRcboProtected !== this.getBusinessRule<string>("circuitRcboProtected")) { this.rcboTripTimeReading = undefined; }
        // pair
        if (propertyKey !== "mcbFuseRating" && this.showMcbFuseRatingReasonWhyNot) { this.mcbFuseRating = undefined; }
        if (propertyKey !== "showMcbFuseRatingReasonWhyNot" && this.mcbFuseRating) { this.showMcbFuseRatingReasonWhyNot = undefined; }
        // pair
        if (propertyKey !== "applianceFuseRating" && this.showApplianceFuseRatingReasonWhyNot) { this.applianceFuseRating = undefined; }
        if (propertyKey !== "showApplianceFuseRatingReasonWhyNot" && this.applianceFuseRating) { this.showApplianceFuseRatingReasonWhyNot = undefined; }

        if (this.isPartP === false) { this.partPReason = undefined; }
        if (this.workedOnLightingCircuit === false) { this.cpcInLightingCircuitOk = undefined; }
        // pair
        if (propertyKey !== "microwaveLeakageReading" && this.showMicrowaveLeakageReadingReasonWhyNot) { this.microwaveLeakageReading = undefined; }
        if (propertyKey !== "showMicrowaveLeakageReadingReasonWhyNot" && this.microwaveLeakageReading !== undefined) { this.showMicrowaveLeakageReadingReasonWhyNot = undefined; }
    }

    private resetReportFields(): void {
        if (!this.reportFieldsVisible) { this.report = undefined; }
        if (!this.reportFieldsVisible) { this.conditionAsLeft = undefined; }
        if (!this.reportFieldsVisible) { this.cappedTurnedOff = undefined; }
        if (!this.reportFieldsVisible) { this.labelAttachedRemoved = undefined; }
        if (!this.reportFieldsVisible) { this.ownedByCustomer = undefined; }
        if (!this.reportFieldsVisible) { this.letterLeft = undefined; }
        if (!this.reportFieldsVisible) { this.signatureObtained = undefined; }
        if (!this.reportFieldsVisible) { this.ownerNameAddressPhone = undefined; }

        if (this.reportFieldsVisible && this.availableConditionAsLefts.length === 1) {
            this.conditionAsLeft = this.availableConditionAsLefts[0].toString();
        } else if (!this.availableConditionAsLefts.some(availableConditionAsLeft => this.conditionAsLeft === availableConditionAsLeft)) {
            this.conditionAsLeft = undefined;
        }

        switch (this.conditionAsLeft) {
            case "AR":
            case "ID":
                this.availableLabelAttachedRemovedLookups = ["A"];
                break;
            case "SS":
                this.availableLabelAttachedRemovedLookups = ["N"];
                break;
            default:
                this.availableLabelAttachedRemovedLookups = ["A", "R", "N", "X"];
                break;
        }

        if (!this.availableLabelAttachedRemovedLookups.some(a => a === this.labelAttachedRemoved)) {
            this.labelAttachedRemoved = undefined;
        }
    }

    private buildUnsafeConditions(): void {

        let workingUnsafeReasons: { field: string, mandatory: boolean }[] = [];
        let workingConditionAsLefts: AvailableConditionsAsLeft[] = [];

        let isUnsafe = (reasonKey: string, mandatory: boolean, conditionAsLefts?: AvailableConditionsAsLeft[]) => {
            workingUnsafeReasons.push({ field: reasonKey, mandatory });

            (conditionAsLefts || ["AR", "ID", "SS", "XC"]).forEach(conditionAsLeft => {
                if (workingConditionAsLefts.indexOf(conditionAsLeft) === -1) {
                    workingConditionAsLefts.push(conditionAsLeft);
                }
            });
        };

        if (this.mainEarthCheckedVisible &&
            (this.mainEarthChecked === this.getBusinessRule<string>("itemCheckedQuestionNo"))) {
            isUnsafe("mainEarthChecked", true);
        }

        if (this.mainEarthCheckedVisible &&
            (this.mainEarthChecked === this.getBusinessRule<string>("itemCheckedQuestionNotChecked"))) {
            isUnsafe("mainEarthUnChecked", true);
    }

        if (this.gasBondingCheckedVisible &&
            (this.gasBondingChecked === this.getBusinessRule<string>("itemCheckedQuestionNo"))) {
            isUnsafe("gasBondingChecked", true);
    }

        if (this.gasBondingCheckedVisible &&
            (this.gasBondingChecked === this.getBusinessRule<string>("itemCheckedQuestionNotChecked"))) {
            isUnsafe("gasBondingUnChecked", true);
        }

        if (this.waterBondingCheckedVisible &&
            (this.waterBondingChecked === this.getBusinessRule<string>("itemCheckedQuestionNo"))) {
            isUnsafe("waterBondingChecked", true);
        }

        if (this.waterBondingCheckedVisible &&
            (this.waterBondingChecked === this.getBusinessRule<string>("itemCheckedQuestionNotChecked"))) {
            isUnsafe("waterBondingUnChecked", true);
        }

        if (this.otherBondingCheckedVisible &&
            (this.otherBondingChecked === this.getBusinessRule<string>("itemCheckedQuestionNo"))) {
            isUnsafe("otherBondingChecked", true);
            }

        if (this.otherBondingCheckedVisible &&
            (this.otherBondingChecked === this.getBusinessRule<string>("itemCheckedQuestionNotChecked"))) {
            isUnsafe("otherBondingUnChecked", true);
        }

        if (this.supplementaryBondingOrFullRcdProtectionCheckedVisible &&
            (this.supplementaryBondingOrFullRcdProtectionChecked === this.getBusinessRule<string>("itemCheckedQuestionNo"))) {
            isUnsafe("supplementaryBondingOrFullRcdProtectionChecked", true, ["SS"]);
                    }

        if (this.supplementaryBondingOrFullRcdProtectionCheckedVisible &&
            (this.supplementaryBondingOrFullRcdProtectionChecked === this.getBusinessRule<string>("itemCheckedQuestionNotChecked"))) {
            isUnsafe("supplementaryBondingOrFullRcdProtectionUnChecked", true, ["SS"]);
                }

        if (this.ringContinuityReadingDoneVisible &&
            this.ringContinuityReadingDone === this.getBusinessRule<string>("ringContinuityReadingDoneFail")) {
            isUnsafe("ringContinuityReadingDone", true, ["AR", "ID"]);
                }

        if (this.leInsulationResistanceVisible &&
            this.leInsulationResistance < this.getBusinessRule<number>("leInsulationResistanceMinThreshold")) {
            isUnsafe("leInsulationResistance", true, ["AR", "ID"]);
            }

        if (this.neInsulationResistanceVisible &&
            this.neInsulationResistance < this.getBusinessRule<number>("neInsulationResistanceMinThreshold")) {
            isUnsafe("neInsulationResistance", true, ["AR", "ID"]);
        }

        if (this.lnInsulationResistanceVisible &&
            this.lnInsulationResistance < this.getBusinessRule<number>("lnInsulationResistanceMinThreshold")) {
            isUnsafe("lnInsulationResistance", true, ["AR", "ID"]);
        }

        if (this.systemTypeVisible &&
            this.systemType === this.getBusinessRule<string>("systemTypeUnableToCheck")) {
            isUnsafe("systemType", true, ["AR", "ID"]);
    }

        if (this.finalEliReadingDoneVisible &&
            this.isApplianceType("applianceTypeElectrical") && this.finalEliReadingDone === false) {
            isUnsafe("finalEliReadingDone", true, ["AR", "ID"]);
        }

        if (this.finalEliReadingVisible &&
            this.finalEliReading > this.getBusinessRule<number>("eliReadingRcdPresentMaxThreshold") && this.isRcdPresent === true) {
            isUnsafe("finalEliReading", true, ["AR", "ID"]);
                    }

        if (this.readingSafeAccordingToTopsVisible &&
            this.readingSafeAccordingToTops === false) {
            isUnsafe("readingSafeAccordingToTops", true, ["AR", "ID"]);
    }

        if (this.isRcdPresentVisible &&
            this.isRcdPresent === false) {
            isUnsafe("isRcdPresent", true, ["AR", "ID"]);
    }

        if (this.circuitRcdRcboProtectedVisible &&
            (this.circuitRcdRcboProtected === this.getBusinessRule<string>("circuitRcdProtectedNo")
                || this.circuitRcdRcboProtected === this.getBusinessRule<string>("circuitRcdProtectedCustRefusedTest"))) {
            isUnsafe("circuitRcdRcboProtected", true, ["AR", "ID"]);
        }

        if (this.rcdTripTimeReadingVisible &&
            this.circuitRcdRcboProtected === this.getBusinessRule<string>("circuitRcdProtected")
            && this.rcdTripTimeReading !== undefined) {
                if (this.rcdTripTimeReadingMessageVisible) {
                    isUnsafe("rcdTripTimeReading", false, ["AR", "ID", "SS"]);
                }
        }

        if (this.rcboTripTimeReadingVisible &&
            this.rcboTripTimeReading > this.getBusinessRule<number>("rcboTripTimeReadingMinThreshold")) {
            isUnsafe("rcboTripTimeReading", true, ["AR", "ID"]);
            }

        if (this.applianceEarthContinuityReadingDoneVisible &&
            this.applianceEarthContinuityReadingDone === false) {
            isUnsafe("applianceEarthContinuityReadingDone", true, ["AR", "ID"]);
                }

        if (this.applianceEarthContinuityReadingVisible &&
            this.applianceEarthContinuityReading > this.getBusinessRule<number>("applianceEarthContinuityReadingMaxThreshold")) {
            isUnsafe("applianceEarthContinuityReading", true, ["AR", "ID"]);
    }

        // mcbFuseRating: prior to refactor this has customeConditionsAsLeft but no unsafe() function

        if (this.showMcbFuseRatingReasonWhyNotVisible &&
            this.isApplianceType("applianceTypeElectrical") && this.showMcbFuseRatingReasonWhyNot) {
            isUnsafe("showMcbFuseRatingReasonWhyNot", true, ["AR", "ID"]);
    }

        if (this.mcbFuseRatingReasonWhyNotVisible &&
            this.mcbFuseRatingReasonWhyNot === this.getBusinessRule<string>("mcbFuseRatingUnsafeReason")) {
            isUnsafe("mcbFuseRatingReasonWhyNot", true, ["AR", "ID"]);
    }

        if (this.applianceFuseRatingReasonWhyNotVisible &&
            this.applianceFuseRatingReasonWhyNot === this.getBusinessRule<string>("applianceFuseRatingUnsafeReason")) {
            isUnsafe("applianceFuseRatingReasonWhyNot", true, ["AR", "ID"]);
    }

        if (this.cpcInLightingCircuitOkVisible &&
            this.cpcInLightingCircuitOk === false) {
            isUnsafe("cpcInLightingCircuitOk", true);
                    }

        if (this.installationSatisfactoryVisible &&
            this.installationSatisfactory === false) {
            isUnsafe("installationSatisfactory", true);
                    }

        if (this.microwaveLeakageReadingVisible &&
            this.microwaveLeakageReading > this.getBusinessRule<number>("microwaveLeakageMaxThreshold")) {
            isUnsafe("microwaveLeakageReading", true, ["AR", "ID"]);
                }

        if (this.applianceSafeVisible &&
            this.applianceSafe === false) {
            isUnsafe("applianceSafe", true, ["AR", "ID"]);
                    }

        if (this.applianceInstallationSatisfactoryVisible &&
            this.applianceInstallationSatisfactory === false) {
            isUnsafe("applianceInstallationSatisfactory", true, ["AR", "ID"]);
                }

        this.unsafeReasons = workingUnsafeReasons;
        this.availableConditionAsLefts = workingConditionAsLefts;
                    }

    private isApplianceType(...electricalApplianceTypes: ApplianceType[]): boolean {
        return this.electricalApplianceType
            && !!electricalApplianceTypes.find(a => this.electricalApplianceType.toUpperCase() === this.getBusinessRule<string>(a).toUpperCase());
                }

    private getBusinessRule<T>(key: string): T {
        return <T>(this._businessRules[key]);
    }
}
