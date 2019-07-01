import { inject } from "aurelia-dependency-injection";
import { AppLauncher } from "../../../../common/core/services/appLauncher";
import { IAppLauncher } from "../../../../common/core/services/IappLauncher";
import { IConfigurationService } from "../../../../common/core/services/IConfigurationService";
import { ConfigurationService } from "../../../../common/core/services/configurationService";
import { IHemaConfiguration } from "../../../IHemaConfiguration";
import { EditableViewModel } from "../../models/editableViewModel";
import { IApplianceService } from "../../../business/services/interfaces/IApplianceService";
import { ApplianceService } from "../../../business/services/applianceService";
import { Appliance } from "../../../business/models/appliance";
import { ApplianceSummaryViewModel } from "./viewModels/applianceSummaryViewModel";
import { Router } from "aurelia-router";
import { ILabelService } from "../../../business/services/interfaces/ILabelService";
import { LabelService } from "../../../business/services/labelService";
import { EventAggregator } from "aurelia-event-aggregator";
import { IJobService } from "../../../business/services/interfaces/IJobService";
import { JobService } from "../../../business/services/jobService";
import { ICatalogService } from "../../../business/services/interfaces/ICatalogService";
import { CatalogService } from "../../../business/services/catalogService";
import { IValidationService } from "../../../business/services/interfaces/IValidationService";
import { ValidationService } from "../../../business/services/validationService";
import { BusinessRuleService } from "../../../business/services/businessRuleService";
import { IBusinessRuleService } from "../../../business/services/interfaces/IBusinessRuleService";
import { Guid } from "../../../../common/core/guid";
import { EngineerService } from "../../../business/services/engineerService";
import { IEngineerService } from "../../../business/services/interfaces/IEngineerService";
import { DialogService } from "aurelia-dialog";
import { DataStateSummary } from "../../../business/models/dataStateSummary";
import { DataState } from "../../../business/models/dataState";
import { TaskService } from "../../../business/services/taskService";
import { ITaskService } from "../../../business/services/interfaces/ITaskService";
import { ArrayHelper } from "../../../../common/core/arrayHelper";
import { Task } from "../../../business/models/task";
import { ChargeServiceConstants } from "../../../business/services/constants/chargeServiceConstants";
import { ApplianceOperationType } from "../../../business/models/applianceOperationType";

@inject(LabelService,  ApplianceService, Router, JobService, EngineerService,
    EventAggregator, DialogService, ValidationService, BusinessRuleService, CatalogService, AppLauncher, ConfigurationService, TaskService)
export class Appliances extends EditableViewModel {

    public viewModels: ApplianceSummaryViewModel[];
    private _applianceService: IApplianceService;
    private _router: Router;
    private _appLauncher: IAppLauncher;
    private _configurationService: IConfigurationService;
    private _taskService: ITaskService;

    public constructor(labelService: ILabelService,
        applianceService: IApplianceService,
        router: Router,
        jobService: IJobService,
        engineerService: IEngineerService,
        eventAggregator: EventAggregator,
        dialogService: DialogService,
        validationService: IValidationService,
        businessRuleService: IBusinessRuleService,
        catalogService: ICatalogService,
        appLauncher: IAppLauncher,
        configurationService: IConfigurationService,
        taskService: ITaskService) {
        super(jobService, engineerService, labelService, eventAggregator, dialogService, validationService, businessRuleService, catalogService);

        this._applianceService = applianceService;
        this._router = router;
        this._appLauncher = appLauncher;
        this._configurationService = configurationService;
        this._taskService = taskService;
    }

    public activateAsync(params: { jobId: string }): Promise<void> {
        return this.buildValidation()
                .then(() => this.loadBusinessRules())
                .then(() => this.load())
                .then(() => this.showContent());
    }

    public navigateToAppliance(id: string, applianceExcluded: boolean): void {
        this._router.navigateToRoute("appliance", { applianceId: id });
    }

    public newAppliance(): void {
        this._router.navigateToRoute("appliance", { applianceId: Guid.empty });
    }

    public launchAdapt(gcCode: string, applianceExcluded: boolean): void {
        this._appLauncher.launchApplication(this._configurationService.getConfiguration<IHemaConfiguration>().adaptLaunchUri + " " + gcCode);
    }

    public async excludeAppliance(event: MouseEvent, id: string): Promise<void> {
        event.stopPropagation();

        let tasks = await this._taskService.getTasks(this.jobId);
        let associatedTasks = tasks.filter(task => task.applianceId === id);

        if (associatedTasks.length > 0) {
            let dialogResult = await this.showConfirmation(this.getLabel("objectName"), this.getLabel("delinkApplianceMessage"));

            if (dialogResult.wasCancelled === false) {
                await this.excludeApp(id);
                if (tasks.some(task => task.isCharge)) {
                    this._eventAggregator.publish(ChargeServiceConstants.CHARGE_UPDATE_START, this.jobId);
                }
            }
        } else {
            let shouldDelete = await this.showConfirmation(this.getLabel("objectName"), this.getLabel("hideQuestion"));
            if (shouldDelete) {
                await this.excludeApp(id);
            }
        }
    }

    protected loadModel(): Promise<void> {
        /* do not await */ this._applianceService.ensureAdaptInformationIsSynced(this.jobId);
        return this._applianceService.getAppliances(this.jobId)
        .then(appliances => {
            appliances = ArrayHelper.sortByColumnDescending(appliances, "dataState");
            return Promise.all(appliances.map(app => this.createViewModel(app, appliances)))
            .then(viewModels => {
                this.viewModels = viewModels;
            });
        });
    }

    private createViewModel(appliance: Appliance, allAppliances: Appliance[]): Promise<ApplianceSummaryViewModel> {
        let vm = new ApplianceSummaryViewModel();
        vm.appliance = appliance;

        this.setApplianceAggregateDataState(vm);
        this.setContractStatus(vm);

        return this._applianceService.isFullGcCode(appliance.gcCode)
            .then(isFullGcCode => {
                vm.isDisplayableGcCode = isFullGcCode;
            })
            .then(() => this.setApplianceDescription(vm))
            .then(() => this._taskService.getTasks(this.jobId))
            .then((liveTasks: Task[]) => {
                vm.isAssociatedWithTask = liveTasks.filter(task => task.applianceId === appliance.id).length > 0;
                vm.canExclude = !vm.appliance.parentId && !vm.isUnderContract && !liveTasks.some(task => task.applianceId === vm.appliance.id && task.sequence > 1);
                return vm;
            });
    }

    private setApplianceAggregateDataState(vm: ApplianceSummaryViewModel): void {
        let totals = new DataStateSummary(vm.appliance).getTotals("appliances");
        vm.aggregateDataState = totals.invalid ? DataState.invalid
            : totals.notVisited ? DataState.notVisited
                : totals.valid ? DataState.valid
                                    : DataState.dontCare;
    }

    private setContractStatus(vm: ApplianceSummaryViewModel): void {
        let nonContractContractTypes = (this.getBusinessRule<string>("nonContractContractTypes") || "").split(",");
        vm.isUnderContract =  !!vm
            && !!vm.appliance
            && !!vm.appliance.contractType
            && !nonContractContractTypes.some(nonContractContractType => nonContractContractType === vm.appliance.contractType);
    }

    private setApplianceDescription(vm: ApplianceSummaryViewModel): Promise<void> {
        if (vm.appliance.gcCode && vm.isDisplayableGcCode) {
            return this._catalogService.getGCCode(vm.appliance.gcCode)
                .then((gcCode) => {
                    vm.applianceDescription = gcCode ? gcCode.gcCodeDescription : vm.appliance.description;
                });
        } else {
            vm.applianceDescription = vm.appliance.description;
            return Promise.resolve();
        }
    }

    private async excludeApp(applianceId: string): Promise<void> {
        let foundItem = this.viewModels.find(vm => vm.appliance.id === applianceId);

        if (foundItem) {
            this.viewModels.splice(this.viewModels.indexOf(foundItem), 1);
            if (foundItem.appliance.childId) {
                let childIndex = this.viewModels.findIndex(child => child.appliance.id === foundItem.appliance.childId);
                if (childIndex >= 0) {
                    this.viewModels.splice(childIndex, 1);
                }
            }
            await this._applianceService.deleteOrExcludeAppliance(this.jobId, applianceId, ApplianceOperationType.exclude);
            if (foundItem.appliance.childId) {
                await this._applianceService.deleteOrExcludeAppliance(this.jobId, foundItem.appliance.childId, ApplianceOperationType.exclude);
            }
            this.notifyDataStateChanged();
        }
    }
}
