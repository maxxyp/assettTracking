import { ChirpCode } from "../models/chirpCode";
import { IApplianceFactory } from "./interfaces/IApplianceFactory";
import { IAppliance as ApplianceApiModel } from "../../api/models/fft/jobs/history/IAppliance";
import { IAppliance as ApplianceUpdateApiModel } from "../../api/models/fft/jobs/jobUpdate/IAppliance";
import { Appliance as ApplianceBusinessModel } from "../../business/models/appliance";
import { ApplianceSafetyFactory } from "./applianceSafetyFactory";
import { IApplianceSafetyFactory } from "./interfaces/IApplianceSafetyFactory";
import { IReading } from "../../api/models/fft/jobs/jobUpdate/IReading";
import { IApplianceSafety } from "../../api/models/fft/jobs/jobUpdate/IApplianceSafety";
import { inject } from "aurelia-dependency-injection";
import { NumberHelper } from "../../../common/core/numberHelper";
import { StringHelper } from "../../../common/core/stringHelper";
import { ObjectHelper } from "../../../common/core/objectHelper";
import { Job } from "../models/job";

import { IReadingFactory } from "./interfaces/IReadingFactory";
import { ReadingFactory } from "./readingFactory";
import { ILandlordFactory } from "./interfaces/ILandlordFactory";
import { LandlordFactory } from "./landlordFactory";
import { IBusinessRuleService } from "../services/interfaces/IBusinessRuleService";
import { BusinessRuleService } from "../services/businessRuleService";
import { CatalogService } from "../services/catalogService";
import { ICatalogService } from "../services/interfaces/ICatalogService";
import { QueryableBusinessRuleGroup } from "../models/businessRules/queryableBusinessRuleGroup";
import { MiddlewareHelper } from "../../core/middlewareHelper";
import { ISafetyAction } from "../models/reference/ISafetyAction";
import { BaseApplianceFactory } from "../../common/factories/baseApplianceFactory";
import { DataStateManager } from "../../common/dataStateManager";
import { IDataStateManager } from "../../common/IDataStateManager";

@inject(ApplianceSafetyFactory, ReadingFactory, LandlordFactory, BusinessRuleService, CatalogService, DataStateManager)
export class ApplianceFactory extends BaseApplianceFactory implements IApplianceFactory {

    private _applianceSafetyFactory: IApplianceSafetyFactory;
    private _readingFactory: IReadingFactory;
    private _landlordFactory: ILandlordFactory;
    private _dataStateManager: IDataStateManager;

    constructor(applianceSafetyFactory: IApplianceSafetyFactory,
        readingFactory: IReadingFactory,
        landlordFactory: ILandlordFactory,
        businessRuleService: IBusinessRuleService,
        catalogService: ICatalogService,
        dataStateManager: IDataStateManager) {

        super(businessRuleService, catalogService);

        this._applianceSafetyFactory = applianceSafetyFactory;
        this._readingFactory = readingFactory;
        this._landlordFactory = landlordFactory;
        this._dataStateManager = dataStateManager;
    }

    public createApplianceBusinessModel(applianceApiModel: ApplianceApiModel, job: Job, engineerWorkingSector: string): Promise<ApplianceBusinessModel> {
        let applianceBusinessModel = new ApplianceBusinessModel();

        return this._catalogService.getObjectTypes().then((applianceTypes) => {
            if (applianceTypes.find(a => a.applianceType === applianceApiModel.applianceType)) {
                let parseBgInstallationIndicator = (bgInstallationIndicator: string) => {
                    return bgInstallationIndicator === "1" ? true : bgInstallationIndicator === "0" ? false : undefined;
                };

                // map the normal fields
                applianceBusinessModel.id = applianceApiModel.id;
                applianceBusinessModel.serialId = applianceApiModel.serialId;
                applianceBusinessModel.gcCode = applianceApiModel.gcCode;
                applianceBusinessModel.bgInstallationIndicator = parseBgInstallationIndicator(applianceApiModel.bgInstallationIndicator);
                applianceBusinessModel.category = applianceApiModel.category;
                applianceBusinessModel.contractType = applianceApiModel.contractType;
                applianceBusinessModel.contractExpiryDate = StringHelper.isString(applianceApiModel.contractExpiryDate) ? new Date(applianceApiModel.contractExpiryDate) : undefined;
                applianceBusinessModel.applianceType = applianceApiModel.applianceType;
                applianceBusinessModel.description = applianceApiModel.description;
                applianceBusinessModel.flueType = applianceApiModel.flueType;
                applianceBusinessModel.energyControl = applianceApiModel.energyControl;
                applianceBusinessModel.locationDescription = applianceApiModel.locationDescription;
                applianceBusinessModel.numberOfRadiators = applianceApiModel.numberOfRadiators;
                applianceBusinessModel.numberOfSpecialRadiators = applianceApiModel.numberOfSpecialRadiators;
                applianceBusinessModel.installationYear = applianceApiModel.installationYear;
                applianceBusinessModel.notes = applianceApiModel.notes;
                applianceBusinessModel.boilerSize = applianceApiModel.boilerSize;

                // this is because the catalogs are using code as a string and the value comes down as a number
                applianceBusinessModel.cylinderType = NumberHelper.canCoerceToNumber(applianceApiModel.cylinderType) ? applianceApiModel.cylinderType.toString() : undefined;
                applianceBusinessModel.systemDesignCondition = NumberHelper.canCoerceToNumber(applianceApiModel.systemDesignCondition)
                    ? applianceApiModel.systemDesignCondition.toString()
                    : undefined;
                applianceBusinessModel.systemType = NumberHelper.canCoerceToNumber(applianceApiModel.systemType) ? applianceApiModel.systemType.toString() : undefined;
                applianceBusinessModel.condition = NumberHelper.canCoerceToNumber(applianceApiModel.condition) ? applianceApiModel.condition.toString() : undefined;

                // in a parent/child pair, linkId contains the parent's id in both records
                applianceBusinessModel.parentId = applianceApiModel.linkId && applianceApiModel.linkId !== applianceApiModel.id ? applianceApiModel.linkId : undefined;

                if (applianceApiModel.chirp) {
                    applianceBusinessModel.preVisitChirpCode = new ChirpCode();
                    applianceBusinessModel.preVisitChirpCode.code = applianceApiModel.chirp.iaciCode;
                    applianceBusinessModel.preVisitChirpCode.date = applianceApiModel.chirp.iaciDate;
                }

                return this.populateBusinessModelFields(applianceBusinessModel, engineerWorkingSector)
                    .then(() => this._dataStateManager.updateApplianceDataState(applianceBusinessModel, job))
                    .then(() => {
                        if (applianceApiModel.safety) {
                            applianceBusinessModel.safety = this._applianceSafetyFactory.populatePreviousApplianceSafety(applianceApiModel.safety, applianceBusinessModel.safety);
                        }

                        return applianceBusinessModel;
                    });
            } else {
                return undefined;
            }

        });
    }

    public createApplianceApiModel(job: Job, originalJob: Job,
        applianceBusinessModel: ApplianceBusinessModel,
        applianceIdToSequenceMap?: { [guid: string]: number }): Promise<ApplianceUpdateApiModel> {

        let apiModel = this.createApiModel(applianceBusinessModel);

        if (applianceBusinessModel.isDeleted) {
            this.populateDeleteSpecificFields(apiModel, applianceBusinessModel);
            return Promise.resolve(apiModel);
        } else {
            if (applianceBusinessModel.isCreated) {
                this.populateCreateSpecificFields(apiModel, applianceBusinessModel, applianceIdToSequenceMap);
            } else {
                this.populateUpdateSpecificFields(apiModel, applianceBusinessModel);
            }

            let originalAppliance = this.getOriginalAppliance(applianceBusinessModel, originalJob);
            this.populateCoreApplianceFields(apiModel, applianceBusinessModel, originalAppliance);

            return this.populateCentralHeatingFields(apiModel, applianceBusinessModel, originalAppliance)
                .then(() => this.populateLandlordFields(apiModel, applianceBusinessModel, job))
                .then(() => this.populateSafetyFields(apiModel, applianceBusinessModel, job));
        }
    }

    private createApiModel(applianceBusinessModel: ApplianceBusinessModel): ApplianceUpdateApiModel {
        let updateMarker = applianceBusinessModel.isCreated ? "C" : applianceBusinessModel.isDeleted ? "D" : "A";
        return <ApplianceUpdateApiModel>{
            updateMarker,
            applianceType: applianceBusinessModel.applianceType
        };
    }

    private populateCreateSpecificFields(apiModel: ApplianceUpdateApiModel, applianceBusinessModel: ApplianceBusinessModel, applianceIdToSequenceMap?: { [guid: string]: number }): void {
        apiModel.hardwareSequenceNumber = applianceIdToSequenceMap[applianceBusinessModel.id];
        apiModel.linkId = applianceBusinessModel.parentId ? applianceIdToSequenceMap[applianceBusinessModel.parentId].toString() : undefined;
    }

    private populateUpdateSpecificFields(apiModel: ApplianceUpdateApiModel, applianceBusinessModel: ApplianceBusinessModel): void {
        apiModel.id = applianceBusinessModel.id;
    }

    private populateDeleteSpecificFields(apiModel: ApplianceUpdateApiModel, applianceBusinessModel: ApplianceBusinessModel): void {
        apiModel.id = applianceBusinessModel.id;
    }

    private getOriginalAppliance(applianceBusinessModel: ApplianceBusinessModel, originalJob: Job): ApplianceBusinessModel {
        return !applianceBusinessModel.isCreated
            && originalJob
            && originalJob.history
            && originalJob.history.appliances
            && originalJob.history.appliances.find(appl => appl.id === applianceBusinessModel.id);
    }

    private populateCoreApplianceFields(apiModel: ApplianceUpdateApiModel, applianceBusinessModel: ApplianceBusinessModel, originalAppliance: ApplianceBusinessModel): void {

        if (!originalAppliance || applianceBusinessModel.installationYear !== originalAppliance.installationYear) {
            apiModel.installationYear = applianceBusinessModel.installationYear;
        }
        if (!originalAppliance || applianceBusinessModel.description !== originalAppliance.description) {
            apiModel.description = applianceBusinessModel.description;
        }
        if (!originalAppliance || applianceBusinessModel.flueType !== originalAppliance.flueType) {
            apiModel.flueType = applianceBusinessModel.flueType;
        }
        if (!originalAppliance || applianceBusinessModel.gcCode !== originalAppliance.gcCode) {
            apiModel.gcCode = applianceBusinessModel.gcCode;
        }
        if (!originalAppliance || applianceBusinessModel.locationDescription !== originalAppliance.locationDescription) {
            apiModel.locationDescription = applianceBusinessModel.locationDescription;
        }
        if (!originalAppliance || applianceBusinessModel.serialId !== originalAppliance.serialId) {
            apiModel.serialId = applianceBusinessModel.serialId;
        }

        if (!originalAppliance || applianceBusinessModel.notes !== originalAppliance.notes) {
            apiModel.scmsText = applianceBusinessModel.notes;
        }

        let santizeBgInstallationIndicator = (bgInstallationIndicator: boolean) => {
            return bgInstallationIndicator === undefined ? undefined : (bgInstallationIndicator ? "1" : "0");
        };

        if (!originalAppliance || santizeBgInstallationIndicator(applianceBusinessModel.bgInstallationIndicator) !== santizeBgInstallationIndicator(originalAppliance.bgInstallationIndicator)) {
            apiModel.bgInstallationIndicator = santizeBgInstallationIndicator(applianceBusinessModel.bgInstallationIndicator);
        }
    }

    private populateCentralHeatingFields(apiModel: ApplianceUpdateApiModel, applianceBusinessModel: ApplianceBusinessModel, originalAppliance: ApplianceBusinessModel): Promise<void> {

        return this._businessRuleService.getQueryableRuleGroup("applianceDetails")
            .then(ruleGroup => {
                if (applianceBusinessModel.category && applianceBusinessModel.category === ruleGroup.getBusinessRule<string>("centralHeatingApplianceHardwareCategory")) {

                    if (!originalAppliance || applianceBusinessModel.condition !== originalAppliance.condition) {
                        apiModel.condition = applianceBusinessModel.condition;
                    }
                    if (!originalAppliance || applianceBusinessModel.boilerSize !== originalAppliance.boilerSize) {
                        apiModel.boilerSize = applianceBusinessModel.boilerSize;
                    }
                    if (!originalAppliance || applianceBusinessModel.numberOfRadiators !== originalAppliance.numberOfRadiators) {
                        apiModel.numberOfRadiators = applianceBusinessModel.numberOfRadiators;
                    }
                    if (!originalAppliance || applianceBusinessModel.energyControl !== originalAppliance.energyControl) {
                        apiModel.energyControl = applianceBusinessModel.energyControl;
                    }
                    if (!originalAppliance || applianceBusinessModel.systemType !== originalAppliance.systemType) {
                        apiModel.systemType = applianceBusinessModel.systemType;
                    }
                    if (!originalAppliance || applianceBusinessModel.systemDesignCondition !== originalAppliance.systemDesignCondition) {
                        apiModel.systemDesignCondition = applianceBusinessModel.systemDesignCondition;
                    }
                    if (!originalAppliance || applianceBusinessModel.cylinderType !== originalAppliance.cylinderType) {
                        apiModel.cylinderType = applianceBusinessModel.cylinderType;
                    }
                    if (!originalAppliance || applianceBusinessModel.numberOfSpecialRadiators !== originalAppliance.numberOfSpecialRadiators) {
                        apiModel.numberofSpecialRadiators = applianceBusinessModel.numberOfSpecialRadiators;
                    }
                }
            });
    }

    private populateSafetyFields(apiModel: ApplianceUpdateApiModel, applianceBusinessModel: ApplianceBusinessModel, job: Job): Promise<ApplianceUpdateApiModel> {
        return Promise.all<IReading[], IApplianceSafety>([
            this._readingFactory.createReadingApiModels(applianceBusinessModel),
            this._applianceSafetyFactory.createApplianceSafetyApiModel(applianceBusinessModel,
                job.propertySafety && job.propertySafety.propertyGasSafetyDetail,
                job.propertySafety && job.propertySafety.propertyUnsafeDetail)

        ]).then(([readings, safety]) => {
            apiModel.readings = readings;
            apiModel.safety = safety;
            return apiModel;
        });
    }

    private populateLandlordFields(apiModel: ApplianceUpdateApiModel, applianceBusinessModel: ApplianceBusinessModel, job: Job): Promise<ApplianceUpdateApiModel> {

        if (!job.isLandlordJob) {
            return Promise.resolve(apiModel);
        }

        return Promise.all<QueryableBusinessRuleGroup, QueryableBusinessRuleGroup, ISafetyAction[]>([
            this._businessRuleService.getQueryableRuleGroup(StringHelper.toCamelCase(ObjectHelper.getClassName(this))),
            this._businessRuleService.getQueryableRuleGroup("landlordSafetyCertificate"),
            this._catalogService.getSafetyActions()
        ]).then(([applianceBusinessRules, landlordBusinessRules, actions]) => {

            if (applianceBusinessModel.isSafetyRequired && !applianceBusinessModel.isInstPremAppliance) {

                let certificateDefect = this._landlordFactory.createLandlordSafetyCertificateDefect(applianceBusinessModel, landlordBusinessRules, actions);
                apiModel.detailsOfAnyDefectsIdentifiedText = certificateDefect.details;
                apiModel.remedialActionTakenText = certificateDefect.actionTakenText;

                return this._landlordFactory.createLandlordSafetyCertificateAppliance(applianceBusinessModel, landlordBusinessRules)
                    .then((certificateAppliance) => {
                        if (certificateAppliance) {
                            apiModel.safetyDeviceCorrectOperation = MiddlewareHelper.getYNXForYesNoNa(certificateAppliance.safetyDeviceCorrectOperation, undefined);
                            apiModel.make = certificateAppliance.make;
                            apiModel.model = certificateAppliance.model;
                            apiModel.flueFlowTest = MiddlewareHelper.getPFXForYesNoNa(certificateAppliance.flueFlowTest);
                            apiModel.spillageTest = MiddlewareHelper.getPFXForYesNoNa(certificateAppliance.spillageTest);
                            apiModel.requestedToTest = !!certificateAppliance.requestedToTest;
                            apiModel.unableToTest = !!certificateAppliance.unableToTest;

                        }
                        return apiModel;
                    });
            } else if (applianceBusinessModel.contractType === applianceBusinessRules.getBusinessRule<string>("instPremApplianceContractType")) {

                let certificateResult = this._landlordFactory.createLandlordSafetyCertificateResult(job.propertySafety, landlordBusinessRules, actions);
                apiModel.gasInstallationSoundnessTest = MiddlewareHelper.getPFXForYesNoNa(certificateResult.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass);
                apiModel.detailsOfAnyDefectsIdentifiedText = certificateResult.propertySafetyDefect.details;
                apiModel.remedialActionTakenText = certificateResult.propertySafetyDefect.actionTakenText;
                apiModel.requestedToTest = true;
                apiModel.unableToTest = false;

            } else if (applianceBusinessModel.isInstPremAppliance) {

                apiModel.requestedToTest = true;

                let certificateResult = this._landlordFactory.createLandlordSafetyCertificateResult(job.propertySafety, landlordBusinessRules, actions);

                if (job.propertySafety.propertyGasSafetyDetail.gasInstallationTightnessTestDone === true) {
                    apiModel.unableToTest = false;
                } else {
                    apiModel.unableToTest = true;
                }

                apiModel.gasInstallationSoundnessTest = MiddlewareHelper.getPFXForYesNoNa(certificateResult.gasInstallationTightnessTestAndVisualInspectionOfPipeworkPass);
                apiModel.detailsOfAnyDefectsIdentifiedText = certificateResult.propertySafetyDefect.details;
                apiModel.remedialActionTakenText = certificateResult.propertySafetyDefect.actionTakenText;
            }

            return apiModel;
        });
    }
}
