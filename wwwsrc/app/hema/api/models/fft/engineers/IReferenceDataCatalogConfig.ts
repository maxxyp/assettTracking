import { IReferenceDataCatalogConfigItem } from "../reference/IReferenceDataCatalogConfigItem";

export interface IReferenceDataCatalogConfig {
    catalogueConfig: {
        engineerId: string,
        list: IReferenceDataCatalogConfigItem []
    } [];
}
