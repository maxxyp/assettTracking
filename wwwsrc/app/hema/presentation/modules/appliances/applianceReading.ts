import { inject } from "aurelia-framework";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { LabelService } from "../../../business/services/labelService";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { EditableViewModel } from "../../models/editableViewModel";
import { IApplianceService } from "../../../business/services/interfaces/IApplianceService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { ValidationService } from "../../../business/services/validationService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { CatalogService } from "../../../business/services/catalogService";
import { ApplianceService } from "../../../business/services/applianceService";
import { GasApplianceReadingViewModel } from "./viewModels/gasApplianceReadingViewModel";
import { IApplianceGasSafetyFactory } from "../../factories/interfaces/IApplianceGasSafetyFactory";
import { ApplianceGasSafetyFactory } from "../../factories/applianceGasSafetyFactory";
import { ApplianceGasSafety } from "../../../business/models/applianceGasSafety";
import { ApplianceGasUnsafeDetail } from "../../../business/models/applianceGasUnsafeDetail";
import { BindingEngine } from "aurelia-binding";
import { ButtonListItem } from "../../../../common/ui/elements/models/buttonListItem";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { EngineerService } from "../../../business/services/engineerService";
import { DialogService } from "aurelia-dialog";
import { GasApplianceReadingsMasterViewModel } from "./viewModels/gasApplianceReadingsMasterViewModel";
import { AppliancePageHelper } from "./appliancePageHelper";
import { BetweenValueValidationRule } from "aurelia-validation";
import { Redirect } from "aurelia-router";

@inject(JobService, EngineerService, LabelService, EventAggregator, DialogService, ValidationService,
    BusinessRuleService, CatalogService, ApplianceService, ApplianceGasSafetyFactory, BindingEngine)
export class ApplianceReading extends EditableViewModel {

    public showSupplementaryBurner: boolean;
    public applianceId: string;

    public gasReadings: GasApplianceReadingsMasterViewModel;
    public gasIsLpgButtons: ButtonListItem[];
    public suppIsLpgButtons: ButtonListItem[];
    public summaryLpgWarningTrigger: boolean;

    private _applianceGasSafetyFactory: IApplianceGasSafetyFactory;
    private _applianceService: IApplianceService;

    private _bindingEngine: BindingEngine;
    private _localSubscriptions: Subscription[];
    private _supplementarySubscriptions: Subscription[];

    // business rule values
    private _burnerPressureUnsafeValue: number;
    private _gasRateUnsafeValue: number;
    private _finalRatioUnsafeThreshold: number;
    private _firstRatioWarningThreshold: number;
    private _unsafeToastDismissTime: number;
    private _unsafeToastTitle: string;
    private _haveCleared: boolean;
    private _isGasSafetyWorkedOn: boolean;

    public constructor(jobService: IJobService,
                       engineerService: IEngineerService,
                       labelService: ILabelService,
                       eventAggregator: EventAggregator,
                       dialogService: DialogService,
                       validationService: IValidationService,
                       businessRuleService: IBusinessRuleService,
                       catalogService: ICatalogService,
                       applianceService: IApplianceService,
                       applianceGasSafetyFactory: IApplianceGasSafetyFactory,
                       bindingEngine: BindingEngine) {

        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService);
        this._applianceService = applianceService;
        this._applianceGasSafetyFactory = applianceGasSafetyFactory;
        this._bindingEngine = bindingEngine;
        this.showSupplementaryBurner = false;
        this._localSubscriptions = [];
        this._supplementarySubscriptions = [];
    }

    public canActivateAsync(...rest: any[]): Promise<boolean | Redirect> {
        return AppliancePageHelper.checkApplianceSafetyType(this._applianceService, rest);
    }

    public activateAsync(params: { applianceId: string }): Promise<any> {
        this.applianceId = params.applianceId;
        this._unsafeToastTitle = this.getLabel("unsafeSituation");

        if (this._isCleanInstance) {
            return this.loadBusinessRules()
                .then(() => this.buildBusinessRules())
                .then(() => this._labelService.getGroupWithoutCommon("validationRules"))
                .then(labels => this.attachLabels(labels))
                .then(() => this.buildValidationRules())
                .then(() => this.loadCatalogs())
                .then(() => this.load())
                .then(() => this.showContent());
        } else {
            return this.load();
        }
    }

    public deactivateAsync(): Promise<void> {
        this.clearSubscriptions();
        return Promise.resolve();
    }

    public addSupplementaryBurner(): void {
        this.toggleAddBurnerButton();
    }

    public removeSupplementaryBurner(): void {
        this.toggleAddBurnerButton();
    }

    public burnerPressureChanged(newValue: number, vm: GasApplianceReadingViewModel, isSupp: boolean): void {
        vm.burnerPressureUnsafe = newValue === this._burnerPressureUnsafeValue;

        if (vm.burnerPressureUnsafe) {
            let unsafeWarningMessage = isSupp ? this.getLabel("supplementaryBurnerPressureUnsafe") : this.getLabel("burnerPressureUnsafe");
            this.showWarning(this._unsafeToastTitle, unsafeWarningMessage, null, this._unsafeToastDismissTime);
        }

        this.updateSummary(vm);
        this.populatePreliminarySupplementaryIsLpg();
    }

    public gasRateReadingChanged(newValue: number, vm: GasApplianceReadingViewModel, isSupp: boolean): void {
        vm.gasReadingUnsafe = newValue === this._gasRateUnsafeValue;

        if (vm.gasReadingUnsafe) {
            let unsafeWarningMessage = isSupp ? this.getLabel("supplementaryGasReadingUnsafe") : this.getLabel("gasReadingUnsafe");
            this.showWarning(this._unsafeToastTitle, unsafeWarningMessage, null, this._unsafeToastDismissTime);
        }

        this.updateSummary(vm);
        this.populatePreliminarySupplementaryIsLpg();
    }

    public isLpgChanged(newValue: boolean, vm: GasApplianceReadingViewModel, isSupp: boolean): void {
        vm.isLpg = newValue;

        if (vm.isLpg === false) {
            this.showWarning(this._unsafeToastTitle, this.getLabel("isLpg"), null, this._unsafeToastDismissTime);
        }

        this.updateSummary(vm);
        this.populatePreliminarySupplementaryIsLpg();
    }

    public readingFirstRatioChanged(newValue: number, vm: GasApplianceReadingViewModel, isSupp: boolean): void {
        vm.showWarningFirstRatio = newValue > this._firstRatioWarningThreshold;
        this.updatePerformanceReadings(vm, isSupp);
    }

    public readingFinalRatioChanged(newValue: number, vm: GasApplianceReadingViewModel, isSupp: boolean): void {
        let valRule = this.getValidationRule(isSupp ? "gasReadings.supplementaryReadings.readingFinalRatio" : "gasReadings.preliminaryReadings.readingFinalRatio");

        vm.finalRatioUnsafe = newValue <= valRule.max && newValue >= valRule.min && newValue > this._finalRatioUnsafeThreshold;
        if (vm.finalRatioUnsafe) {
            let unsafeWarningMessage = isSupp ?
                this.getLabel("supplementaryFinalRatioUnsafe") :
                this.getLabel("finalRatioUnsafe");
            this.showWarning(this._unsafeToastTitle, unsafeWarningMessage, null, this._unsafeToastDismissTime);
        }

        this.updatePerformanceReadings(vm, isSupp);
    }

    public updatePerformanceReadings(vm: GasApplianceReadingViewModel, isSupp: boolean): void {
        let workedOnReadings: boolean;
        if (vm) {
            if (vm.readingFirstRatio === undefined && vm.readingMinRatio === undefined && vm.readingMaxRatio === undefined && vm.readingFinalRatio === undefined &&
                vm.readingFirstCO === undefined && vm.readingMinCO === undefined && vm.readingMaxCO === undefined && vm.readingFinalCO === undefined &&
                vm.readingFirstCO2 === undefined && vm.readingMinCO2 === undefined && vm.readingMaxCO2 === undefined && vm.readingFinalCO2 === undefined) {
                workedOnReadings = false;
            } else {
                workedOnReadings = true;
            }

            if (isSupp) {
                this.gasReadings.workedOnSupplementaryPerformanceReadings = workedOnReadings;
            } else {
                this.gasReadings.workedOnPreliminaryPerformanceReadings = workedOnReadings;
            }
            this.updateSummary(vm);
        }
    }

    protected loadModel(): Promise<void> {
        return this._applianceService.getApplianceSafetyDetails(this.jobId, this.applianceId).then(applianceSafety => {
            this._isGasSafetyWorkedOn = applianceSafety.applianceGasSafety.workedOnAppliance;
            this.gasReadings = this._applianceGasSafetyFactory.createApplianceGasReadingsViewModel(applianceSafety.applianceGasReadingsMaster);
            this.showSupplementaryBurner = applianceSafety.applianceGasReadingsMaster.supplementaryBurnerFitted;
            if (applianceSafety.applianceGasSafety.overrideWorkedOnAppliance === true) {
                // gas safety can set this to yes, in which chase make main readings mandatory, see validation below
                this.gasReadings.workedOnMainReadings = applianceSafety.applianceGasSafety.workedOnAppliance;
                if (!this.gasReadings.workedOnMainReadings) {
                    this.gasReadings.preliminaryReadings.burnerPressure = undefined;
                    this.gasReadings.preliminaryReadings.gasRateReading = undefined;
                    this.gasReadings.supplementaryReadings.burnerPressure = undefined;
                    this.gasReadings.supplementaryReadings.gasRateReading = undefined;
                    this.showSupplementaryBurner = false;
                }

                if (!this.gasReadings.workedOnPreliminaryPerformanceReadings) {
                    this.resetPerformanceReadings(this.gasReadings.preliminaryReadings);
                }

                if (!this.gasReadings.supplementaryReadings) {
                    this.resetPerformanceReadings(this.gasReadings.supplementaryReadings);
                }
            }

            this.setInitialDataState(applianceSafety.applianceGasReadingsMaster.dataStateId, applianceSafety.applianceGasReadingsMaster.dataState);
            this.resetSubscriptions();
            this._haveCleared = false;
        });
    }

    protected saveModel(): Promise<void> {
        return this._applianceService.getApplianceSafetyDetails(this.jobId, this.applianceId).then(applianceSafety => {

            this.updatePerformanceReadings(this.gasReadings.preliminaryReadings, false);
            this.updatePerformanceReadings(this.gasReadings.supplementaryReadings, true);
            let gasReadingsBusinessModel = this._applianceGasSafetyFactory.createApplianceGasReadingsBusinessModel(this.gasReadings);
            gasReadingsBusinessModel.dataState = this.getFinalDataState();

            applianceSafety.applianceGasReadingsMaster = gasReadingsBusinessModel;
            applianceSafety.applianceGasReadingsMaster.supplementaryBurnerFitted = this.showSupplementaryBurner;

            if (this._haveCleared) {
                applianceSafety.applianceGasSafety = new ApplianceGasSafety();
                applianceSafety.applianceGasUnsafeDetail = new ApplianceGasUnsafeDetail();
            } else {
                applianceSafety.applianceGasSafety.summaryPrelimLpgWarningTrigger = this.getSummaryPrelimLpgWarningTrigger();
                applianceSafety.applianceGasSafety.summarySuppLpgWarningTrigger = this.getSummarySuppLpgWarningTrigger();
                applianceSafety.applianceGasSafety.overrideWorkedOnAppliance = false;
                applianceSafety.applianceGasSafety.performanceTestsNotDoneReason = this.gasReadings.workedOnPreliminaryPerformanceReadings ?
                    undefined : applianceSafety.applianceGasSafety.performanceTestsNotDoneReason;
                applianceSafety.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary = this.gasReadings.workedOnSupplementaryPerformanceReadings ?
                    undefined : applianceSafety.applianceGasSafety.performanceTestsNotDoneReasonForSupplementary;
            }

            return this._applianceService.saveApplianceSafetyDetails(this.jobId, this.applianceId, applianceSafety, false, false);
        });
    }

    protected clearModel(): Promise<void> {
        this.gasReadings = this._applianceGasSafetyFactory.createApplianceGasReadingsViewModel(null);
        this.gasReadings.preliminaryReadings = new GasApplianceReadingViewModel();
        this.gasReadings.preliminaryReadings.askIfLpg = true;
        this.showSupplementaryBurner = false;

        this._haveCleared = true;
        this._isGasSafetyWorkedOn = false;
        this.resetSubscriptions();

        return Promise.resolve();
    }

    private toggleAddBurnerButton(): void {
        this.gasReadings.supplementaryReadings = new GasApplianceReadingViewModel();
        this.showSupplementaryBurner = !this.showSupplementaryBurner;
        if (this.showSupplementaryBurner) {
            this.gasReadings.supplementaryReadings.isLpg = this.gasReadings.preliminaryReadings.isLpg;
            this.updateSummary(this.gasReadings.supplementaryReadings);
        }
        this.resetSubscriptions(true);
    }

    private loadCatalogs(): Promise<void> {
        return Promise.all([this.buildNoYesList(), this.buildNoYesList()])
            .then(([yesNoGas, yesNoSupp]) => {
                this.gasIsLpgButtons = yesNoGas;
                this.suppIsLpgButtons = yesNoSupp;
            });
    }

    private setObservables(vm: GasApplianceReadingViewModel, subscriptions: Subscription[], supp: boolean): void {
        let sub1 = this._bindingEngine.propertyObserver(vm, "burnerPressure")
            .subscribe(newValue => this.burnerPressureChanged(newValue, vm, supp));
        subscriptions.push(sub1);

        let sub2 = this._bindingEngine.propertyObserver(vm, "gasRateReading")
            .subscribe(newValue => this.gasRateReadingChanged(newValue, vm, supp));
        subscriptions.push(sub2);

        if (supp === false) {
            let sub3 = this._bindingEngine.propertyObserver(vm, "isLpg")
                .subscribe(newValue => this.isLpgChanged(newValue, vm, supp));
            subscriptions.push(sub3);
        }

        let sub4 = this._bindingEngine.propertyObserver(vm, "readingFirstRatio")
            .subscribe(newValue => this.readingFirstRatioChanged(newValue, vm, supp));
        subscriptions.push(sub4);

        let sub5 = this._bindingEngine.propertyObserver(vm, "readingMaxRatio")
            .subscribe(newValue => this.updatePerformanceReadings(vm, supp));
        subscriptions.push(sub5);

        let sub6 = this._bindingEngine.propertyObserver(vm, "readingMinRatio")
            .subscribe(newValue => this.updatePerformanceReadings(vm, supp));
        subscriptions.push(sub6);

        let sub7 = this._bindingEngine.propertyObserver(vm, "readingFinalRatio")
            .subscribe(newValue => this.readingFinalRatioChanged(newValue, vm, supp));
        subscriptions.push(sub7);

        let sub8 = this._bindingEngine.propertyObserver(vm, "readingFirstCO")
            .subscribe(newValue => this.updatePerformanceReadings(vm, supp));
        subscriptions.push(sub8);

        let sub9 = this._bindingEngine.propertyObserver(vm, "readingMaxCO")
            .subscribe(newValue => this.updatePerformanceReadings(vm, supp));
        subscriptions.push(sub9);

        let sub10 = this._bindingEngine.propertyObserver(vm, "readingMinCO")
            .subscribe(newValue => this.updatePerformanceReadings(vm, supp));
        subscriptions.push(sub10);

        let sub11 = this._bindingEngine.propertyObserver(vm, "readingFinalCO")
            .subscribe(newValue => this.updatePerformanceReadings(vm, supp));
        subscriptions.push(sub11);

        let sub12 = this._bindingEngine.propertyObserver(vm, "readingFirstCO2")
            .subscribe(newValue => this.updatePerformanceReadings(vm, supp));
        subscriptions.push(sub12);

        let sub13 = this._bindingEngine.propertyObserver(vm, "readingMaxCO2")
            .subscribe(newValue => this.updatePerformanceReadings(vm, supp));
        subscriptions.push(sub13);

        let sub14 = this._bindingEngine.propertyObserver(vm, "readingMinCO2")
            .subscribe(newValue => this.updatePerformanceReadings(vm, supp));
        subscriptions.push(sub14);

        let sub15 = this._bindingEngine.propertyObserver(vm, "readingFinalCO2")
            .subscribe(newValue => this.updatePerformanceReadings(vm, supp));
        subscriptions.push(sub15);
    }

    private buildBusinessRules(): Promise<void> {
        this._burnerPressureUnsafeValue = this.getBusinessRule<number>("burnerPressureUnsafeValue");
        this._gasRateUnsafeValue = this.getBusinessRule<number>("gasRateUnsafeValue");
        this._firstRatioWarningThreshold = this.getBusinessRule<number>("firstRatioWarningThreshold");
        this._finalRatioUnsafeThreshold = this.getBusinessRule<number>("finalRatioUnsafeThreshold");
        this._unsafeToastDismissTime = this.getBusinessRule<number>("unsafeToastDismissTime");
        return Promise.resolve();
    }

    private buildValidationRules(): Promise<void> {
        let isFinalRatioRequired = (readings: GasApplianceReadingViewModel) : boolean => {
            return readings && (
                readings.readingFinalRatio !== undefined
                || readings.readingFirstRatio !== undefined
                || readings.readingMinRatio !== undefined
                || readings.readingMaxRatio !== undefined
                || readings.readingFirstCO !== undefined
                || readings.readingMinCO !== undefined
                || readings.readingMaxCO !== undefined
                || readings.readingFinalCO !== undefined
                || readings.readingFirstCO2 !== undefined
                || readings.readingMinCO2 !== undefined
                || readings.readingMaxCO2 !== undefined
                || readings.readingFinalCO2 !== undefined);
        };

        return this.buildValidation([
            {
                property: "gasReadings.preliminaryReadings.burnerPressure",
                groups: ["readingsRequired"],
                required: () => (this._isGasSafetyWorkedOn || this.gasReadings.workedOnPreliminaryPerformanceReadings || this.gasReadings.workedOnMainReadings)
                    && (this.gasReadings.preliminaryReadings.isLpg === undefined
                        || this.gasReadings.preliminaryReadings.isLpg === null)
                    && (this.gasReadings.preliminaryReadings.gasRateReading === undefined
                        || this.gasReadings.preliminaryReadings.gasRateReading === null),
                passes: [
                    {
                        test: () => {
                            // this tests the min & max value
                            if ((this.gasReadings.preliminaryReadings.burnerPressure !== null
                                    && (this.gasReadings.preliminaryReadings.burnerPressure !== undefined))) {

                                let minValue = this.validationRules["gasReadings.preliminaryReadings.burnerPressure"].min;
                                let maxValue = this.validationRules["gasReadings.preliminaryReadings.burnerPressure"].max;

                                let betweenValueRule = new BetweenValueValidationRule(minValue, maxValue);

                                return betweenValueRule.validate(this.gasReadings.preliminaryReadings.burnerPressure, undefined);

                            } else {
                                return true;
                            }
                        },
                        message: () => {
                            let minValue = this.validationRules["gasReadings.preliminaryReadings.burnerPressure"].min;
                            let maxValue = this.validationRules["gasReadings.preliminaryReadings.burnerPressure"].max;

                            return this.getParameterisedLabel("isBetween", [minValue, maxValue]);
                        }
                    }],
                condition: () => this.gasReadings !== undefined && this.gasReadings.preliminaryReadings !== undefined
            },
            {
                property: "gasReadings.preliminaryReadings.gasRateReading",
                groups: ["readingsRequired"],
                required: () => (this._isGasSafetyWorkedOn || this.gasReadings.workedOnPreliminaryPerformanceReadings || this.gasReadings.workedOnMainReadings)
                    && (this.gasReadings.preliminaryReadings.isLpg === undefined
                        || this.gasReadings.preliminaryReadings.isLpg === null)
                    && (this.gasReadings.preliminaryReadings.burnerPressure === undefined
                        || this.gasReadings.preliminaryReadings.burnerPressure === null),
                passes: [
                    {
                        test: () => {
                            // this tests the min & max value
                            if ((this.gasReadings.preliminaryReadings.gasRateReading !== null
                                    && (this.gasReadings.preliminaryReadings.gasRateReading !== undefined))) {

                                let minValue = this.validationRules["gasReadings.preliminaryReadings.gasRateReading"].min;
                                let maxValue = this.validationRules["gasReadings.preliminaryReadings.gasRateReading"].max;

                                let betweenValueRule = new BetweenValueValidationRule(minValue, maxValue);

                                return betweenValueRule.validate(this.gasReadings.preliminaryReadings.gasRateReading, undefined);

                            } else {
                                return true;
                            }
                        },
                        message: () => {
                            let minValue = this.validationRules["gasReadings.preliminaryReadings.gasRateReading"].min;
                            let maxValue = this.validationRules["gasReadings.preliminaryReadings.gasRateReading"].max;

                            return this.getParameterisedLabel("isBetween", [minValue, maxValue]);
                        }
                    }],
                condition: () => this.gasReadings !== undefined && this.gasReadings.preliminaryReadings !== undefined
            },
            {
                property: "gasReadings.preliminaryReadings.isLpg",
                groups: ["readingsRequired"],
                required: () => (this._isGasSafetyWorkedOn || this.gasReadings.workedOnPreliminaryPerformanceReadings || this.gasReadings.workedOnMainReadings)
                    && (this.gasReadings.preliminaryReadings.gasRateReading === undefined
                        || this.gasReadings.preliminaryReadings.gasRateReading === null)
                    && (this.gasReadings.preliminaryReadings.burnerPressure === undefined
                        || this.gasReadings.preliminaryReadings.burnerPressure === null)
                    && !this.checkIfSupplementaryMainReadingsExists(),
                condition: () => this.gasReadings !== undefined && this.gasReadings.preliminaryReadings !== undefined
            },
            {
                property: "gasReadings.preliminaryReadings.readingFirstRatio",
                groups: ["readingsRequired"],
                condition: () => this.gasReadings !== undefined && this.gasReadings.preliminaryReadings && this.gasReadings.preliminaryReadings.readingFirstRatio !== undefined
            },
            {
                property: "gasReadings.preliminaryReadings.readingMinRatio",
                groups: ["readingsRequired"],
                condition: () => this.gasReadings !== undefined && this.gasReadings.preliminaryReadings && this.gasReadings.preliminaryReadings.readingMinRatio !== undefined
            },
            {
                property: "gasReadings.preliminaryReadings.readingMaxRatio",
                groups: ["readingsRequired"],
                condition: () => this.gasReadings !== undefined && this.gasReadings.preliminaryReadings && this.gasReadings.preliminaryReadings.readingMaxRatio !== undefined
            },
            {
                property: "gasReadings.preliminaryReadings.readingFirstCO",
                groups: ["readingsRequired"],
                condition: () => this.gasReadings !== undefined && this.gasReadings.preliminaryReadings && this.gasReadings.preliminaryReadings.readingFirstCO !== undefined
            },
            {
                property: "gasReadings.preliminaryReadings.readingMinCO",
                groups: ["readingsRequired"],
                condition: () => this.gasReadings !== undefined && this.gasReadings.preliminaryReadings && this.gasReadings.preliminaryReadings.readingMinCO !== undefined
            },
            {
                property: "gasReadings.preliminaryReadings.readingMaxCO",
                groups: ["readingsRequired"],
                condition: () => this.gasReadings !== undefined && this.gasReadings.preliminaryReadings && this.gasReadings.preliminaryReadings.readingMaxCO !== undefined
            },
            {
                property: "gasReadings.preliminaryReadings.readingFinalCO",
                groups: ["readingsRequired"],
                condition: () => this.gasReadings !== undefined && this.gasReadings.preliminaryReadings && this.gasReadings.preliminaryReadings.readingFinalCO !== undefined
            },
            {
                property: "gasReadings.preliminaryReadings.readingFirstCO2",
                groups: ["readingsRequired"],
                condition: () => this.gasReadings !== undefined && this.gasReadings.preliminaryReadings && this.gasReadings.preliminaryReadings.readingFirstCO2 !== undefined
            },
            {
                property: "gasReadings.preliminaryReadings.readingMinCO2",
                groups: ["readingsRequired"],
                condition: () => this.gasReadings !== undefined && this.gasReadings.preliminaryReadings && this.gasReadings.preliminaryReadings.readingMinCO2 !== undefined
            },
            {
                property: "gasReadings.preliminaryReadings.readingMaxCO2",
                groups: ["readingsRequired"],
                condition: () => this.gasReadings !== undefined && this.gasReadings.preliminaryReadings && this.gasReadings.preliminaryReadings.readingMaxCO2 !== undefined
            },
            {
                property: "gasReadings.preliminaryReadings.readingFinalCO2",
                groups: ["readingsRequired"],
                condition: () => this.gasReadings !== undefined && this.gasReadings.preliminaryReadings && this.gasReadings.preliminaryReadings.readingFinalCO2 !== undefined
            },

            {
                property: "gasReadings.supplementaryReadings.burnerPressure",
                groups: ["readingsRequired"],
                required: () => this.showSupplementaryBurner
                    && (this._isGasSafetyWorkedOn || this.gasReadings.workedOnSupplementaryPerformanceReadings || this.gasReadings.workedOnMainReadings)
                    && (this.gasReadings.supplementaryReadings.isLpg === undefined
                        || this.gasReadings.supplementaryReadings.isLpg === null)
                    && (this.gasReadings.supplementaryReadings.gasRateReading === undefined
                        || this.gasReadings.supplementaryReadings.gasRateReading === null),
                passes: [
                    {
                        test: () => {
                            // this tests the min & max value
                            if ((this.gasReadings.supplementaryReadings.burnerPressure !== null
                                    && (this.gasReadings.supplementaryReadings.burnerPressure !== undefined))) {

                                let minValue = this.validationRules["gasReadings.supplementaryReadings.burnerPressure"].min;
                                let maxValue = this.validationRules["gasReadings.supplementaryReadings.burnerPressure"].max;

                                let betweenValueRule = new BetweenValueValidationRule(minValue, maxValue);

                                return betweenValueRule.validate(this.gasReadings.supplementaryReadings.burnerPressure, undefined);

                            } else {
                                return true;
                            }
                        },
                        message: () => {
                            let minValue = this.validationRules["gasReadings.supplementaryReadings.burnerPressure"].min;
                            let maxValue = this.validationRules["gasReadings.supplementaryReadings.burnerPressure"].max;

                            return this.getParameterisedLabel("isBetween", [minValue, maxValue]);
                        }
                    }],
                condition: () => this.showSupplementaryBurner === true && this.gasReadings !== undefined && this.gasReadings.supplementaryReadings !== undefined
            },
            {
                property: "gasReadings.supplementaryReadings.gasRateReading",
                groups: ["readingsRequired"],
                required: () => this.showSupplementaryBurner
                    && (this._isGasSafetyWorkedOn || this.gasReadings.workedOnSupplementaryPerformanceReadings || this.gasReadings.workedOnMainReadings)
                    && (this.gasReadings.supplementaryReadings.isLpg === undefined
                        || this.gasReadings.supplementaryReadings.isLpg === null)
                    && (this.gasReadings.supplementaryReadings.burnerPressure === undefined
                        || this.gasReadings.supplementaryReadings.burnerPressure === null),
                passes: [
                    {
                        test: () => {
                            // this tests the min & max value
                            if ((this.gasReadings.supplementaryReadings.gasRateReading !== null
                                    && (this.gasReadings.supplementaryReadings.gasRateReading !== undefined))) {

                                let minValue = this.validationRules["gasReadings.supplementaryReadings.gasRateReading"].min;
                                let maxValue = this.validationRules["gasReadings.supplementaryReadings.gasRateReading"].max;

                                let betweenValueRule = new BetweenValueValidationRule(minValue, maxValue);

                                return betweenValueRule.validate(this.gasReadings.supplementaryReadings.gasRateReading, undefined);

                            } else {
                                return true;
                            }
                        },
                        message: () => {
                            let minValue = this.validationRules["gasReadings.supplementaryReadings.gasRateReading"].min;
                            let maxValue = this.validationRules["gasReadings.supplementaryReadings.gasRateReading"].max;

                            return this.getParameterisedLabel("isBetween", [minValue, maxValue]);
                        }
                    }],
                condition: () => this.showSupplementaryBurner === true && this.gasReadings !== undefined && this.gasReadings.supplementaryReadings !== undefined
            },
            {
                property: "gasReadings.supplementaryReadings.readingFirstRatio",
                groups: ["readingsRequired"],
                condition: () => this.showSupplementaryBurner === true &&
                    this.gasReadings !== undefined && this.gasReadings.supplementaryReadings && this.gasReadings.supplementaryReadings.readingFirstRatio !== undefined
            },
            {
                property: "gasReadings.supplementaryReadings.readingMinRatio",
                groups: ["readingsRequired"],
                condition: () => this.showSupplementaryBurner === true &&
                    this.gasReadings !== undefined && this.gasReadings.supplementaryReadings && this.gasReadings.supplementaryReadings.readingMinRatio !== undefined
            },
            {
                property: "gasReadings.supplementaryReadings.readingMaxRatio",
                groups: ["readingsRequired"],
                condition: () => this.showSupplementaryBurner === true &&
                    this.gasReadings !== undefined && this.gasReadings.supplementaryReadings && this.gasReadings.supplementaryReadings.readingMaxRatio !== undefined
            },
            {
                property: "gasReadings.supplementaryReadings.readingFirstCO",
                groups: ["readingsRequired"],
                condition: () => this.showSupplementaryBurner === true &&
                    this.gasReadings !== undefined && this.gasReadings.supplementaryReadings && this.gasReadings.supplementaryReadings.readingFirstCO !== undefined
            },
            {
                property: "gasReadings.supplementaryReadings.readingMinCO",
                groups: ["readingsRequired"],
                condition: () => this.showSupplementaryBurner === true &&
                    this.gasReadings !== undefined && this.gasReadings.supplementaryReadings && this.gasReadings.supplementaryReadings.readingMinCO !== undefined
            },
            {
                property: "gasReadings.supplementaryReadings.readingMaxCO",
                groups: ["readingsRequired"],
                condition: () => this.showSupplementaryBurner === true &&
                    this.gasReadings !== undefined && this.gasReadings.supplementaryReadings && this.gasReadings.supplementaryReadings.readingMaxCO !== undefined
            },
            {
                property: "gasReadings.supplementaryReadings.readingFinalCO",
                groups: ["readingsRequired"],
                condition: () => this.showSupplementaryBurner === true &&
                    this.gasReadings !== undefined && this.gasReadings.supplementaryReadings && this.gasReadings.supplementaryReadings.readingFinalCO !== undefined
            },
            {
                property: "gasReadings.supplementaryReadings.readingFirstCO2",
                groups: ["readingsRequired"],
                condition: () => this.showSupplementaryBurner === true &&
                    this.gasReadings !== undefined && this.gasReadings.supplementaryReadings && this.gasReadings.supplementaryReadings.readingFirstCO2 !== undefined
            },
            {
                property: "gasReadings.supplementaryReadings.readingMinCO2",
                groups: ["readingsRequired"],
                condition: () => this.showSupplementaryBurner === true &&
                    this.gasReadings !== undefined && this.gasReadings.supplementaryReadings && this.gasReadings.supplementaryReadings.readingMinCO2 !== undefined
            },
            {
                property: "gasReadings.supplementaryReadings.readingMaxCO2",
                groups: ["readingsRequired"],
                condition: () => this.showSupplementaryBurner === true &&
                    this.gasReadings !== undefined && this.gasReadings.supplementaryReadings && this.gasReadings.supplementaryReadings.readingMaxCO2 !== undefined
            },
            {
                property: "gasReadings.supplementaryReadings.readingFinalCO2",
                groups: ["readingsRequired"],
                condition: () => this.showSupplementaryBurner === true &&
                    this.gasReadings !== undefined && this.gasReadings.supplementaryReadings && this.gasReadings.supplementaryReadings.readingFinalCO2 !== undefined
            },
            {
                property: "gasReadings.preliminaryReadings.readingFinalRatio",
                groups: ["readingsRequired"],
                condition: () => this.gasReadings !== undefined && isFinalRatioRequired(this.gasReadings.preliminaryReadings)
            }, // validate if something entered or if first, min or max ratio entered
            {
                property: "gasReadings.supplementaryReadings.readingFinalRatio",
                groups: ["readingsRequired"],
                condition: () => this.showSupplementaryBurner === true && isFinalRatioRequired(this.gasReadings.supplementaryReadings)
            } // validate if something entered or if first, min or max ratio entered
        ]);
    }

    private init(vm: GasApplianceReadingViewModel): void {
        // required on first load to set viewModel related props
        vm.burnerPressureUnsafe = vm.burnerPressure === this._burnerPressureUnsafeValue;
        vm.gasReadingUnsafe = vm.gasRateReading === this._gasRateUnsafeValue;
        vm.showWarningFirstRatio = vm.readingFirstRatio > this._firstRatioWarningThreshold;
        vm.finalRatioUnsafe = vm.readingFinalRatio > this._finalRatioUnsafeThreshold;
        this.updateSummary(vm);
    }

    private updateSummary(vm: GasApplianceReadingViewModel): void {
        if (vm) {
            // is it unsafe
            vm.isUnsafeReadings =
                vm.burnerPressureUnsafe ||
                vm.gasReadingUnsafe ||
                vm.isLpg === false ||
                vm.finalRatioUnsafe;

            let isAPreliminaryReadingTaken = this.gasReadings && this.gasReadings.preliminaryReadings
                && (this.gasReadings.preliminaryReadings.burnerPressure !== undefined ||
                    this.gasReadings.preliminaryReadings.gasRateReading !== undefined ||
                    this.gasReadings.preliminaryReadings.isLpg !== undefined);

            let isASupplementaryReadingTaken = this.gasReadings && this.gasReadings.supplementaryReadings
                && (this.gasReadings.supplementaryReadings.burnerPressure !== undefined ||
                    this.gasReadings.supplementaryReadings.gasRateReading !== undefined ||
                    this.gasReadings.supplementaryReadings.isLpg !== undefined);

            this.gasReadings.workedOnMainReadings = isAPreliminaryReadingTaken || isASupplementaryReadingTaken;
        }
    }

    // despite show.bind still need to reset observables, not sure why
    private setupSubscriptions(onlySupp: boolean = false): void {

        if (this.gasReadings && this.gasReadings.preliminaryReadings && !onlySupp) {
            this.setObservables(this.gasReadings.preliminaryReadings, this._localSubscriptions, false);
            this.init(this.gasReadings.preliminaryReadings);
        }

        if (this.gasReadings && this.gasReadings.supplementaryReadings) {
            this.setObservables(this.gasReadings.supplementaryReadings, this._supplementarySubscriptions, true);
            this.init(this.gasReadings.supplementaryReadings);
        }
        this.populatePreliminarySupplementaryIsLpg();
    }

    private clearSubscriptions(onlySupp: boolean = false): void {

        if (this._localSubscriptions && !onlySupp) {
            this._localSubscriptions.forEach(x => {
                x.dispose();
                x = null;
            });
        }

        if (this._supplementarySubscriptions && this._supplementarySubscriptions.length > 0) {
            this._supplementarySubscriptions.forEach(x => {
                x.dispose();
                x = null;
            });
        }

        this._localSubscriptions = [];
        this._supplementarySubscriptions = [];
    }

    private resetSubscriptions(onlySupp: boolean = false): void {
        this.clearSubscriptions(onlySupp);
        this.setupSubscriptions(onlySupp);
    }

    private getSummaryPrelimLpgWarningTrigger(): boolean {

        if (this.gasReadings.preliminaryReadings && this.gasReadings.preliminaryReadings.isLpg === false) {
            return true;
        } else {
            return false;
        }
    }

    private getSummarySuppLpgWarningTrigger(): boolean {

        if (this.gasReadings.supplementaryReadings && this.gasReadings.supplementaryReadings.isLpg === false) {
            return true;
        } else {
            return false;
        }
    }

    // todo some refactor work required here, conditional iffs need reviewing/removing,
    // todo using deconstruction and variables to break up and improve readability
    // todo bothReadingsExist and burnerGasPremDoesNotExist are used more than once, maybe replace with get method
    private populatePreliminarySupplementaryIsLpg(): void {

        let {preliminaryReadings: pr, supplementaryReadings: sr} = this.gasReadings;

        const noPreliminaryReadings = pr.burnerPressure === undefined && pr.gasRateReading === undefined;
        const noPreliminaryIsLpg = pr.isLpg === undefined;

        const noSupplementaryReadings = sr.burnerPressure === undefined && sr.gasRateReading === undefined;

        sr.isLpg = (!noPreliminaryIsLpg && this.showSupplementaryBurner && noPreliminaryReadings) ? pr.isLpg : undefined;

        const bothReadingsExist = (this.showSupplementaryBurner && !noSupplementaryReadings && noPreliminaryReadings);

        pr.askIfLpg = bothReadingsExist ? false : noPreliminaryReadings;

        if (pr.askIfLpg === false) {
            pr.isLpg = undefined;
        }
    }

    private resetPerformanceReadings(vm: GasApplianceReadingViewModel): void {
        vm.readingFirstCO = undefined;
        vm.readingFirstCO2 = undefined;
        vm.readingFirstRatio = undefined;
        vm.readingMaxCO = undefined;
        vm.readingMaxCO2 = undefined;
        vm.readingMaxRatio = undefined;
        vm.readingMinCO = undefined;
        vm.readingMinCO2 = undefined;
        vm.readingMinRatio = undefined;
        vm.readingFinalCO = undefined;
        vm.readingFinalCO2 = undefined;
        vm.readingFinalRatio = undefined;
    }

    private checkIfSupplementaryMainReadingsExists(): boolean {
        return this.gasReadings.supplementaryReadings && !!this.gasReadings.supplementaryReadings.burnerPressure || !!this.gasReadings.supplementaryReadings.gasRateReading;
    }
}
