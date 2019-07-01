import { IBaseApplianceFactory } from "./interfaces/IBaseApplianceFactory";
import { BusinessRuleService } from "../../business/services/businessRuleService";
import { inject } from "aurelia-dependency-injection";
import { CatalogService } from "../../business/services/catalogService";
import { IBusinessRuleService } from "../../business/services/interfaces/IBusinessRuleService";
import { ICatalogService } from "../../business/services/interfaces/ICatalogService";
import { Appliance } from "../../business/models/appliance";
import { BusinessException } from "../../business/models/businessException";
import { ApplianceSafetyType } from "../../business/models/applianceSafetyType";

@inject(BusinessRuleService, CatalogService)
export class BaseApplianceFactory implements IBaseApplianceFactory {

    protected _businessRuleService: IBusinessRuleService;
    protected _catalogService: ICatalogService;

    constructor(businessRuleService: IBusinessRuleService,
                catalogService: ICatalogService) {

        this._businessRuleService = businessRuleService;
        this._catalogService = catalogService;
    }

    public calculateApplianceSafetyType(applianceType: string, engineerWorkingSector: string): Promise<ApplianceSafetyType> {
        let electricalWorkingSector: string = undefined;
        let applianceCategoryOther: string = undefined;
        let applianceCategoryElectrical: string = undefined;
        let applianceCategoryGas: string = undefined;
        let applianceTypesToUseEngineerPatchInsteadToCalculateSafetyType: string = undefined;

        return this._businessRuleService.getQueryableRuleGroup("applianceFactory")
            .then((businessRules) => {
                applianceTypesToUseEngineerPatchInsteadToCalculateSafetyType = businessRules.getBusinessRule<string>("applianceTypesToUseEngineerPatchInsteadToCalculateSafetyType");
                applianceCategoryOther = businessRules.getBusinessRule<string>("applianceCategoryOther");
                applianceCategoryElectrical = businessRules.getBusinessRule<string>("applianceCategoryElectrical");
                applianceCategoryGas = businessRules.getBusinessRule<string>("applianceCategoryGas");
                electricalWorkingSector = businessRules.getBusinessRule<string>("electricalWorkingSector");
            })
            .then(() => this._catalogService.getObjectType(applianceType))
            .then((applianceCatalogObjectType) => {

                // check all the required lookup exist
                if (applianceCategoryOther && applianceCategoryElectrical && applianceCategoryGas && electricalWorkingSector) {

                    if (applianceCatalogObjectType) {

                        // if special appliance, use engineer
                        // otherwise use appliance type

                        if (applianceTypesToUseEngineerPatchInsteadToCalculateSafetyType
                            && applianceTypesToUseEngineerPatchInsteadToCalculateSafetyType.split(",").some(x => x === applianceType)) {
                            // this is a special appliance
                            if (applianceCatalogObjectType.applianceCategory === applianceCategoryOther) {
                                return ApplianceSafetyType.other;
                            } else {
                                if (electricalWorkingSector === engineerWorkingSector) {
                                    return ApplianceSafetyType.electrical;
                                } else {
                                    return ApplianceSafetyType.gas;
                                }
                            }
                        } else {
                            switch (applianceCatalogObjectType.applianceCategory) {
                                case applianceCategoryGas:
                                    return ApplianceSafetyType.gas;
                                case applianceCategoryElectrical:
                                    return ApplianceSafetyType.electrical;
                                case applianceCategoryOther:
                                    return ApplianceSafetyType.other;
                                default:
                                    throw new BusinessException(this, "calculateApplianceSafetyType", "Unknown appliance category detected", null, null);
                            }
                        }

                    } else {
                        // throw exception required lookup values not found
                        throw new BusinessException(this, "calculateApplianceSafetyType", "Required catalog lookup not found", null, null);
                    }
                } else {
                    // throw exception required lookup values not found
                    throw new BusinessException(this, "calculateApplianceSafetyType", "Required business rules lookup not found", null, null);
                }
            });
    }

    public populateBusinessModelFields(appliance: Appliance, engineerWorkingSector: string): Promise<void> {
        // get the business rules
        let hardwareCategoryForCentralHeatingAppliance: string;
        let instPremApplianceType: string;

        return this.calculateApplianceSafetyType(appliance.applianceType, engineerWorkingSector)
            .then((applianceSafetyType) => {
                appliance.applianceSafetyType = applianceSafetyType;

                return this._businessRuleService.getQueryableRuleGroup("applianceFactory");
            })
            .then((businessRules) => {
                hardwareCategoryForCentralHeatingAppliance = businessRules.getBusinessRule<string>("hardWareCatForCHAppliance");
                instPremApplianceType = businessRules.getBusinessRule<string>("instPremApplianceType");
            })
            .then(() => this._catalogService.getObjectType(appliance.applianceType))
            .then((applianceCatalogObjectType) => {

                // check all the required lookup exist
                if (hardwareCategoryForCentralHeatingAppliance && instPremApplianceType
                    && applianceCatalogObjectType) {

                    // central heating appliance
                    appliance.isCentralHeatingAppliance = applianceCatalogObjectType.category === hardwareCategoryForCentralHeatingAppliance;

                    // instPrem appliance
                    appliance.isInstPremAppliance = instPremApplianceType === appliance.applianceType;
                } else {
                    // throw exception required lookup values not found
                    throw new BusinessException(this, "populateBusinessModelFields", "Required business rules/catalog lookup not found", null, null);
                }
            });
    }

}
